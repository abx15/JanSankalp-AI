import os
import logging

logger = logging.getLogger("ai-engine")

REGIONAL_AI_ENDPOINTS = {
    "delhi": os.getenv("AI_DELHI_URL", "http://ai-delhi:8000"),
    "mumbai": os.getenv("AI_MUMBAI_URL", "http://ai-mumbai:8000"),
    "bangalore": os.getenv("AI_BANGALORE_URL", "http://ai-bangalore:8000"),
    "default": os.getenv("AI_SERVICE_URL", "http://localhost:8000")
}

class RegionalAIRouter:
    @staticmethod
    def get_cluster(district_id: str) -> str:
        """
        Routes the request to the nearest regional AI cluster based on districtId.
        """
        if not district_id:
            return REGIONAL_AI_ENDPOINTS["default"]
            
        district_id = district_id.lower()
        
        if "delhi" in district_id:
            return REGIONAL_AI_ENDPOINTS["delhi"]
        elif "mumbai" in district_id:
            return REGIONAL_AI_ENDPOINTS["mumbai"]
        elif "bangalore" in district_id:
            return REGIONAL_AI_ENDPOINTS["bangalore"]
            
        return REGIONAL_AI_ENDPOINTS["default"]

    @staticmethod
    def log_routing(ticket_id: str, district_id: str):
        endpoint = RegionalAIRouter.get_cluster(district_id)
        logger.info(f"Routing Ticket {ticket_id} to Regional AI Cluster: {endpoint}")

regional_ai_router = RegionalAIRouter()
