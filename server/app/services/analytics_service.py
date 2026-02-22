from app.federated.coordinator import federated_coordinator
from app.schemas import AnalyticsResponse
from typing import Dict, List, Any

class AnalyticsService:
    async def generate_dashboard_data(self) -> AnalyticsResponse:
        # In production, this would be a series of SQL queries
        # For this requirement, we return chart-ready structured JSON
        return AnalyticsResponse(
            total_complaints=125,
            avg_resolution_time=4.2,
            severity_distribution={
                "Critical": 12,
                "High": 28,
                "Medium": 55,
                "Low": 30
            },
            department_breakdown={
                "Roads": 40,
                "Water": 25,
                "Electricity": 15,
                "Sanitation": 30,
                "Traffic": 10,
                "Others": 5
            },
            officer_performance=[
                {"name": "Officer A", "resolved": 25, "active": 5, "rating": 4.8},
                {"name": "Officer B", "resolved": 18, "active": 8, "rating": 4.2},
                {"name": "Officer C", "resolved": 30, "active": 2, "rating": 4.9}
            ]
        )

    async def get_federated_metrics(self) -> Dict[str, Any]:
        """Return metrics for the Federated Learning dashboard"""
        latest = federated_coordinator.get_latest_metrics()
        
        # Calculate some additional metrics for the dashboard
        return {
            "is_active": True,
            "current_round": federated_coordinator.current_round,
            "global_accuracy": latest["avg_accuracy"] if latest else 0.0,
            "total_districts": len(federated_coordinator.nodes),
            "total_samples": latest["total_samples"] if latest else 0,
            "privacy_compliance": "High",
            "drift_detected": False, # Placeholder
            "district_performance": latest["district_metrics"] if latest else []
        }

analytics_service = AnalyticsService()
