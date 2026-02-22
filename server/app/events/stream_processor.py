import logging
import asyncio
from app.events.kafka_client import kafka_client
from app.services.classification_service import classification_service
from app.services.spam_service import spam_service
from app.services.duplicate_service import duplicate_service
from app.services.routing_service import routing_service
from app.services.ml_model_service import ml_model_service
from app.services.iot_service import iot_ingestion_service
from app.services.vision_service import infrastructure_vision_service
from app.services.risk_service import predictive_risk_engine

logger = logging.getLogger("ai-engine")

# Regional window for surge detection
regional_windows = {} # district_id -> [timestamps]
WINDOW_SIZE_SECONDS = 60
SURGE_THRESHOLD = 5
DISASTER_MODE_THRESHOLD = 15

async def check_for_regional_surge(district_id: str) -> bool:
    if not district_id: return False
    
    now = asyncio.get_event_loop().time()
    if district_id not in regional_windows:
        regional_windows[district_id] = []
    
    # Clean up old timestamps
    regional_windows[district_id] = [ts for ts in regional_windows[district_id] if now - ts < WINDOW_SIZE_SECONDS]
    
    count = len(regional_windows[district_id])
    if count >= SURGE_THRESHOLD:
        logger.warning(f"REGIONAL SURGE DETECTED in {district_id}!")
        await kafka_client.emit_event("system_alert", {
            "type": "REGIONAL_SURGE",
            "districtId": district_id,
            "count": count,
            "window_seconds": WINDOW_SIZE_SECONDS,
            "is_disaster_mode": count >= DISASTER_MODE_THRESHOLD
        })
        return True
    return False

async def process_complaint_event(topic, data):
    # Handle RL Feedback
    if topic == "complaint_resolved":
        from app.events.feedback_handler import process_resolution_feedback
        await process_resolution_feedback(data)
        return

    # Handle IoT Telemetry
    if topic == "sensor_telemetry":
        # Check for flood risk if it's a water level sensor
        if data.get("type") == "water_level":
            risk = await predictive_risk_engine.calculate_flood_risk(data.get("value"), 10.0) # 10mm rain as dummy
            if risk > 0.7:
                await kafka_client.emit_event("system_alert", {
                    "type": "FLOOD_WARNING",
                    "risk_score": risk,
                    "location": data.get("location")
                })
        return

    # Handle Vision Events (Potholes, Garbage, etc.)
    if topic == "vision_event":
        detection = data.get("detection")
        # Auto-create complaint for high-severity vision detections
        if detection.get("severity") == "HIGH":
            # This would trigger the standard complaint workflow
            logger.info(f"Auto-escalating high-severity vision event: {detection.get('type')}")
        return

    complaint_id = data.get("complaint_id")
    
    # [STREAM ANALYTICS] Track for surge detection
    complaint_window.append(asyncio.get_event_loop().time())
    await check_for_surge()
    
    ticket_id = data.get("ticketId")
    text = data.get("description")
    lat, lon = data.get("latitude"), data.get("longitude")
    
    # Regional Metadata for Multi-tenancy
    state_id = data.get("stateId")
    district_id = data.get("districtId")
    city_id = data.get("cityId")
    ward_id = data.get("wardId")

    # [GEO-SPATIAL ANALYTICS] Track for regional surge detection
    if district_id:
        regional_windows.setdefault(district_id, []).append(asyncio.get_event_loop().time())
        is_surge = await check_for_regional_surge(district_id)
        
        # DISASTER MODE: Auto-escalate if surge is severe
        is_disaster = len(regional_windows.get(district_id, [])) >= DISASTER_MODE_THRESHOLD
    else:
        is_surge = False
        is_disaster = False

    # 1. Spam Detection
    spam_result = await spam_service.check_spam(text)
    if spam_result.is_spam:
        await kafka_client.emit_event("complaint_rejected", {
            "complaint_id": complaint_id,
            "reason": "SPAM_DETECTED",
            "score": spam_result.spam_score,
            "ticketId": ticket_id,
            "districtId": district_id # Pass through for bridge filtering
        })
        return

    # 2. Classification & Analysis
    analysis = await classification_service.classify_complaint(text)
    
    # 3. Duplicate Detection
    dup_result = await duplicate_service.check_duplicate(text, lat, lon)
    
    # 4. Predict ETA (Enhanced by disaster mode)
    eta = await ml_model_service.predict_eta(analysis.category, analysis.severity, 0.5)
    if is_disaster:
        analysis.severity = "CRITICAL" # Auto-escalation
        eta.estimated_days = 1 # Urgent resolution

    # 5. Routing
    routing = await routing_service.route_complaint(analysis.category, analysis.severity, lat, lon)

    # Emit Processed Event (with enrichment)
    processed_data = {
        "complaint_id": complaint_id,
        "ticketId": ticket_id,
        "is_disaster_mode": is_disaster,
        "analysis": {
            "category": analysis.category,
            "severity": analysis.severity,
            "confidence": analysis.confidence,
            "reasoning": analysis.reasoning
        },
        "is_duplicate": dup_result.is_duplicate,
        "status": "IN_PROGRESS" if routing.assigned_officer else "PENDING",
        "assigned_officer": routing.assigned_officer,
        "eta_days": eta.estimated_days,
        # Regional Scoping
        "stateId": state_id,
        "districtId": district_id,
        "cityId": city_id,
        "wardId": ward_id
    }
    
    await kafka_client.emit_event("complaint_processed", processed_data)
    logger.info(f"AI Processing complete for {ticket_id}. Emitted 'complaint_processed'.")

async def start_event_processing():
    topics = ["complaint_submitted", "complaint_resolved", "sensor_telemetry", "vision_event"]
    await kafka_client.consume_events(topics, process_complaint_event)
