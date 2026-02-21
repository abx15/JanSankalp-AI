from app.schemas import RouteResponse
from typing import Dict, List

# Mock Department and Officer database
DEPARTMENTS = {
    "Roads": ["OFF_ROAD_001", "OFF_ROAD_002"],
    "Water": ["OFF_WATER_001", "OFF_WATER_002"],
    "Electricity": ["OFF_ELEC_001"],
    "Sanitation": ["OFF_SAN_001", "OFF_SAN_002"],
    "Traffic": ["OFF_TRAF_001"],
    "Others": ["OFF_GEN_001"]
}

# Mock workload (in production, fetch from Database)
officer_workload = {
    "OFF_ROAD_001": 5,
    "OFF_ROAD_002": 3,
    "OFF_WATER_001": 7,
    "OFF_WATER_002": 4,
    "OFF_ELEC_001": 2,
    "OFF_SAN_001": 6,
    "OFF_SAN_002": 1,
    "OFF_TRAF_001": 4,
    "OFF_GEN_001": 3
}

class RoutingService:
    async def route_complaint(self, category: str, severity: str) -> RouteResponse:
        officers = DEPARTMENTS.get(category, DEPARTMENTS["Others"])
        
        # Select officer with least workload (Load Balancing)
        selected_officer = min(officers, key=lambda x: officer_workload.get(x, 0))
        
        # Priority mapping
        priority_map = {
            "Critical": "Urgent",
            "High": "High",
            "Medium": "Normal",
            "Low": "Low"
        }
        
        return RouteResponse(
            department=category,
            officer_id=selected_officer,
            priority=priority_map.get(severity, "Normal")
        )

routing_service = RoutingService()
