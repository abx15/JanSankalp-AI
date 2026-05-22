import logging
from typing import List, Dict, Any

logger = logging.getLogger("ai-engine")

class PredictiveRiskEngine:
    def __init__(self):
        # Risk weights
        self.weights = {
            "water_level": 0.6,
            "rainfall_forecast": 0.4,
            "smart_meter_load": 0.7,
            "pothole_density": 0.3
        }

    async def calculate_flood_risk(self, water_level: float, predicted_rainfall: float) -> float:
        """Calculate flood risk score (0-1)"""
        # Threshold: 5.0m is critical
        normalized_wl = min(1.0, water_level / 5.0)
        # Threshold: 50mm is high
        normalized_rain = min(1.0, predicted_rainfall / 50.0)
        
        risk_score = (normalized_wl * self.weights["water_level"]) + \
                     (normalized_rain * self.weights["rainfall_forecast"])
        
        return round(risk_score, 2)

    async def detect_utility_clusters(self, smart_meter_events: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """Identify geographical clusters of power outages"""
        # Simple clustering logic
        clusters = []
        if len(smart_meter_events) >= 3:
            # If 3 or more outages in the same ward, create a cluster
            clusters.append({
                "type": "POWER_OUTAGE_CLUSTER",
                "risk_level": "SEVERE",
                "affected_region": "Ward 12",
                "predicted_restoration": "4 hours"
            })
        return clusters

    async def get_infrastructure_health_map(self) -> List[Dict[str, Any]]:
        # Mock data for frontend heatmap
        return [
            {"lat": 12.9716, "lng": 77.5946, "intensity": 0.8, "type": "Flood Risk"},
            {"lat": 12.9750, "lng": 77.5900, "intensity": 0.4, "type": "Traffic Congestion"},
            {"lat": 12.9600, "lng": 77.6000, "intensity": 0.9, "type": "Road Damage"}
        ]

predictive_risk_engine = PredictiveRiskEngine()
