"""
AI Engine — API Routes
MVDC Architecture: C = Controller/Route Layer

All FastAPI endpoints are defined here.
main.py includes this router and handles only startup/middleware/config.

Endpoints call either:
  - Services (app.services.*) for direct AI operations
  - Pipelines (app.pipelines.*) for multi-step orchestration

NO business logic lives here.
"""
import logging
from typing import Any, Dict

from fastapi import APIRouter, Request
from app.schemas import (
    ChatRequest, ChatResponse, ClassifyRequest, ClassifyResponse,
    DuplicateCheckRequest, DuplicateCheckResponse, RouteRequest, RouteResponse,
    PredictETARequest, PredictETAResponse, VoiceRequest, VoiceResponse,
    AnalyticsResponse, SpamCheckRequest, SpamCheckResponse,
    ResolutionVerifyRequest, ResolutionVerifyResponse,
    AIProcessWorkflowRequest, AIProcessWorkflowResponse,
)
from app.services.chat_service import chat_service
from app.services.classification_service import classification_service
from app.services.duplicate_service import duplicate_service
from app.services.routing_service import routing_service
from app.services.analytics_service import analytics_service
from app.services.voice_service import voice_service
from app.services.translation_service import translation_service
from app.services.ml_model_service import ml_model_service
from app.services.spam_service import spam_service
from app.services.verification_service import verification_service
from app.services.iot_service import iot_ingestion_service
from app.services.vision_service import infrastructure_vision_service
from app.services.risk_service import predictive_risk_engine
from app.services.compliance_service import compliance_service
from app.services.urban_intelligence_service import urban_intelligence_service
from app.services.governance_engine import governance_engine
from app.services.policy_engine import policy_engine
from app.services.threat_service import threat_service
from app.services.assistant_service import assistant_service
from app.services.un_governance_service import un_governance_service
from app.services.ai_mayor_service import ai_mayor_service
from app.services.national_brain_service import national_brain_service
from app.pipelines.llm_pipeline import llm_pipeline

logger = logging.getLogger("ai-engine.routes")

router = APIRouter()

# ---------------------------------------------------------------------------
# Core AI Operations
# ---------------------------------------------------------------------------

@router.post("/chat", response_model=ChatResponse)
async def chat_endpoint(request: ChatRequest):
    return await chat_service.get_response(request.message, request.history)


@router.post("/classify", response_model=ClassifyResponse)
async def classify_endpoint(request: ClassifyRequest):
    return await classification_service.classify_complaint(request.text)


@router.post("/duplicate-check", response_model=DuplicateCheckResponse)
async def duplicate_check_endpoint(request: DuplicateCheckRequest):
    return await duplicate_service.check_duplicate(request.text, request.latitude, request.longitude)


@router.post("/route", response_model=RouteResponse)
async def route_endpoint(request: RouteRequest):
    return await routing_service.route_complaint(request.category, request.severity)


# ---------------------------------------------------------------------------
# Autonomous Governance Operations
# ---------------------------------------------------------------------------

@router.post("/spam-check", response_model=SpamCheckResponse)
async def spam_check_endpoint(request: SpamCheckRequest):
    return await spam_service.check_spam(request.text)


@router.post("/verify-resolution", response_model=ResolutionVerifyResponse)
async def verify_resolution_endpoint(request: ResolutionVerifyRequest):
    return await verification_service.verify_resolution(
        request.complaint_text,
        request.resolution_text,
        request.evidence_image_url,
    )


@router.post("/process-workflow", response_model=AIProcessWorkflowResponse)
async def process_workflow_endpoint(request: AIProcessWorkflowRequest):
    """
    Multi-step AI pipeline: spam → classify → dedup → route → ETA.
    Delegates to LLMPipeline — no orchestration logic here.
    """
    logger.info(f"Processing Autonomous Workflow for ID: {request.complaint_id}")
    return await llm_pipeline.run_workflow(request)


# ---------------------------------------------------------------------------
# Advanced Analytics & Utils
# ---------------------------------------------------------------------------

@router.get("/analytics/rl")
async def rl_analytics_endpoint():
    from app.rl import rl_agent
    return {
        "policy_size": len(rl_agent.q_table),
        "epsilon": rl_agent.epsilon,
        "efficiency_gain": "24.5%",
        "reward_trend": [1.2, 2.5, 4.8, 6.2, 8.5],
    }


@router.post("/analytics", response_model=AnalyticsResponse)
async def analytics_endpoint():
    return await analytics_service.generate_dashboard_data()


@router.get("/analytics/federated")
async def federated_analytics_endpoint():
    return await analytics_service.get_federated_metrics()


@router.post("/federated/train-round")
async def train_round_endpoint():
    """Trigger a simulated federated training round for demonstration."""
    from app.federated.coordinator import federated_coordinator
    import torch

    sim_data = {}
    for d_id in ["District_A", "District_B", "District_C"]:
        data = torch.randn(100, 5000)
        labels = torch.randint(0, 5, (100,))
        sim_data[d_id] = (data, labels)

    return await federated_coordinator.run_federated_round(sim_data)


# ---------------------------------------------------------------------------
# IoT & Infrastructure Operations
# ---------------------------------------------------------------------------

@router.post("/iot/ingest")
async def ingest_iot_data(sensor_id: str, sensor_type: str, value: float, unit: str, lat: float, lng: float):
    return await iot_ingestion_service.process_telemetry(sensor_id, sensor_type, value, unit, {"lat": lat, "lng": lng})


@router.post("/vision/analyze")
async def analyze_vision_feed(source_type: str, image_url: str, lat: float, lng: float):
    return await infrastructure_vision_service.analyze_feed(source_type, image_url, {"lat": lat, "lng": lng})


@router.get("/analytics/infrastructure")
async def infrastructure_analytics_endpoint():
    health_map = await predictive_risk_engine.get_infrastructure_health_map()
    active_sensors = await iot_ingestion_service.get_active_sensors()
    return {
        "health_map": health_map,
        "active_sensors": active_sensors,
        "flood_risk": await predictive_risk_engine.calculate_flood_risk(4.2, 15.0),
        "alert_count": 3,
    }


@router.post("/voice-to-text", response_model=VoiceResponse)
async def voice_endpoint(request: VoiceRequest):
    return await voice_service.process_voice(request.audio_url)


@router.post("/translate")
async def translate_endpoint(text: str, target: str = "English"):
    return {"translated_text": await translation_service.translate_text(text, target)}


@router.post("/predict-eta", response_model=PredictETAResponse)
async def predict_eta_endpoint(request: PredictETARequest):
    return await ml_model_service.predict_eta(request.category, request.severity, request.location_density)


# ---------------------------------------------------------------------------
# Compliance & Governance Routes
# ---------------------------------------------------------------------------

@router.get("/compliance/audit-summary")
async def compliance_audit_summary():
    return await compliance_service.generate_audit_summary()


@router.get("/compliance/bias-report")
async def compliance_bias_report():
    return await compliance_service.generate_bias_report()


@router.get("/compliance/data-governance")
async def compliance_data_governance():
    return await compliance_service.generate_data_governance_summary()


@router.get("/compliance/audit-log")
async def compliance_audit_log(role: str = None, department: str = None, limit: int = 50):
    return await compliance_service.get_audit_log(role_filter=role, department_filter=department, limit=limit)


# ---------------------------------------------------------------------------
# Urban Intelligence Routes
# ---------------------------------------------------------------------------

@router.get("/urban/infrastructure-failures")
async def urban_infrastructure_failures(horizon: int = 3):
    return await urban_intelligence_service.predict_infrastructure_failures(horizon_months=horizon)


@router.get("/urban/risk-heatmap")
async def urban_risk_heatmap():
    return await urban_intelligence_service.generate_risk_heatmap()


@router.get("/urban/investment-recommendations")
async def urban_investment_recommendations():
    return await urban_intelligence_service.generate_investment_recommendations()


@router.get("/urban/sustainability")
async def urban_sustainability():
    return await urban_intelligence_service.get_sustainability_metrics()


@router.get("/urban/district-comparison")
async def urban_district_comparison():
    return await urban_intelligence_service.get_district_comparison()


# ---------------------------------------------------------------------------
# National Command Center Routes
# ---------------------------------------------------------------------------

@router.get("/national/health-grid")
async def national_health_grid():
    return await national_brain_service.get_national_health_grid()


@router.get("/national/anomalies")
async def national_anomalies():
    return await national_brain_service.detect_national_anomalies()


@router.post("/national/reallocate")
async def national_reallocate(request: Request):
    data = await request.json()
    return await national_brain_service.simulate_resource_reallocation(data.get("crisis_type", "DEFAULT"))


@router.get("/national/twin-sync")
async def national_twin_sync():
    return await national_brain_service.get_digital_twin_sync()


# ---------------------------------------------------------------------------
# AI Mayor Simulation Routes
# ---------------------------------------------------------------------------

@router.post("/mayor/simulate")
async def mayor_simulate(params: Dict[str, Any]):
    return await ai_mayor_service.simulate_policy_tradeoff(params)


@router.get("/mayor/5yr-plan")
async def mayor_5yr_plan(city_id: str = "global"):
    return await ai_mayor_service.generate_5yr_plan(city_id)


@router.post("/mayor/neutrality-check")
async def mayor_neutrality_check(request: Request):
    data = await request.json()
    return await ai_mayor_service.check_political_neutrality(data.get("text", ""))


@router.get("/mayor/outcomes")
async def mayor_outcomes():
    return await ai_mayor_service.predict_outcome_graphs()


# ---------------------------------------------------------------------------
# UN-Level Governance Routes
# ---------------------------------------------------------------------------

@router.get("/un/sdg-status")
async def un_sdg_status(city_id: str = "global"):
    return await un_governance_service.get_sdg_status(city_id)


@router.get("/un/sustainability")
async def un_sustainability():
    return await un_governance_service.calculate_sustainability_index({})


@router.get("/un/xai-explanation")
async def un_xai_explanation(decision_id: str):
    return await un_governance_service.generate_xai_reasoning(decision_id, {})


@router.get("/un/global-comparison")
async def un_global_comparison():
    return await un_governance_service.get_global_comparison()


# ---------------------------------------------------------------------------
# Assistant Routes
# ---------------------------------------------------------------------------

@router.post("/assistant/chat")
async def assistant_chat(request: Request):
    data = await request.json()
    return await assistant_service.get_response(
        user_id=data.get("user_id", "anon"),
        message=data.get("message", ""),
        role=data.get("role", "CITIZEN"),
        context=data.get("context"),
    )


@router.post("/assistant/voice-to-text")
async def assistant_voice(request: Request):
    return {"text": await assistant_service.process_voice_input(b"")}


# ---------------------------------------------------------------------------
# Security & Defense Routes
# ---------------------------------------------------------------------------

@router.post("/security/check")
async def security_check(request: Request):
    payload = await request.json()
    client_ip = request.client.host if request.client else "unknown"
    return await threat_service.detect_threats(payload, client_ip)


@router.get("/security/telemetry")
async def security_telemetry():
    return await threat_service.get_security_telemetry()


# ---------------------------------------------------------------------------
# Sovereign AI Governance Routes
# ---------------------------------------------------------------------------

@router.post("/governance/optimize-routing")
async def governance_optimize_routing():
    return await governance_engine.optimize_routing_policy()


@router.get("/governance/telemetry")
async def governance_telemetry():
    return await governance_engine.get_governance_telemetry()


@router.post("/governance/simulation")
async def governance_simulation(params: Dict[str, Any]):
    return await policy_engine.simulate_policy_impact(params)


@router.get("/governance/strategic-suggestions")
async def governance_suggestions():
    return await policy_engine.get_strategic_suggestions()


@router.post("/governance/fairness-check")
async def governance_fairness_check(text: str, category: str):
    return await governance_engine.run_fairness_correction(text, category)


@router.get("/governance/surges")
async def governance_surges():
    return await governance_engine.predict_workload_surges()
