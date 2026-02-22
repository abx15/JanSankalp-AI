import logging
from typing import Dict, Any, List
from datetime import datetime
from app.events.kafka_client import kafka_client

logger = logging.getLogger("ai-engine")

class IoTIngestionService:
    async def process_telemetry(self, sensor_id: str, sensor_type: str, value: float, unit: str, location: Dict[str, float]):
        """
        Process incoming IoT sensor data.
        Types: water_level, air_quality, smart_meter
        """
        timestamp = datetime.now().isoformat()
        telemetry_data = {
            "sensor_id": sensor_id,
            "type": sensor_type,
            "value": value,
            "unit": unit,
            "location": location,
            "timestamp": timestamp
        }
        
        logger.info(f"Ingested {sensor_type} data from {sensor_id}: {value} {unit}")
        
        # Emit to Kafka for real-time processing and risk analysis
        await kafka_client.emit_event("sensor_telemetry", telemetry_data)
        
        return telemetry_data

    async def get_active_sensors(self) -> List[Dict[str, Any]]:
        # Mocking active sensors for demonstration
        return [
            {"id": "WL-001", "type": "water_level", "status": "online", "last_value": 4.2},
            {"id": "AQ-005", "type": "air_quality", "status": "online", "last_value": 45},
            {"id": "SM-102", "type": "smart_meter", "status": "online", "last_value": 2.5}
        ]

iot_ingestion_service = IoTIngestionService()
