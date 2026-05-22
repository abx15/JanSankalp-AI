import logging
import random
import math
from datetime import datetime, timedelta
from typing import Dict, List, Any

logger = logging.getLogger("ai-engine")

# Simulated district data (in production these would come from DB + IoT sensors)
DISTRICTS = [
    {"id": "D1", "name": "Gandhi Nagar",    "lat": 12.9716, "lng": 77.5946, "population": 125000},
    {"id": "D2", "name": "Shivaji Park",    "lat": 12.9750, "lng": 77.5900, "population": 98000},
    {"id": "D3", "name": "Rajiv Colony",    "lat": 12.9600, "lng": 77.6000, "population": 142000},
    {"id": "D4", "name": "Nehru District",  "lat": 12.9800, "lng": 77.5800, "population": 87000},
    {"id": "D5", "name": "Indira Nagar",    "lat": 12.9650, "lng": 77.5700, "population": 110000},
]

class UrbanIntelligenceService:
    """
    Predictive Urban Intelligence Service.
    Predicts infrastructure failures, generates risk heatmaps, and provides
    3/6/12-month infrastructure risk forecasts.
    """

    def __init__(self):
        self.model_version = "2.0.0"

    # ------------------------------------------------------------------
    # Infrastructure Failure Prediction
    # ------------------------------------------------------------------
    async def predict_infrastructure_failures(self, horizon_months: int = 3) -> Dict[str, Any]:
        """
        Predicts infrastructure failure probability for each district over
        the requested horizon (3, 6, or 12 months).
        """
        horizon_months = max(1, min(horizon_months, 12))
        base_multiplier = 1.0 + (horizon_months - 3) * 0.08  # risk grows with horizon

        predictions = []
        model_types = ["Road Damage", "Water Shortage", "Electricity Outage"]

        for district in DISTRICTS:
            dist_predictions = {"district": district["name"], "district_id": district["id"], "models": {}}

            # Simulate correlation: higher population → slightly higher risk
            pop_factor = district["population"] / 130000  # normalise

            for model_type in model_types:
                base_risk = random.uniform(0.10, 0.55)
                adjusted_risk = min(0.98, base_risk * base_multiplier * (0.9 + 0.2 * pop_factor))

                dist_predictions["models"][model_type] = {
                    "failure_probability": round(adjusted_risk, 3),
                    "risk_level": self._risk_level(adjusted_risk),
                    "estimated_complaints": int(adjusted_risk * random.randint(40, 120)),
                    "estimated_cost_inr": int(adjusted_risk * random.randint(200000, 1200000)),
                    "key_drivers": self._key_drivers(model_type),
                    "recommended_action": self._recommended_action(model_type, adjusted_risk),
                }

            # Overall district risk
            risks = [dist_predictions["models"][m]["failure_probability"] for m in model_types]
            dist_predictions["overall_risk"] = round(sum(risks) / len(risks), 3)
            dist_predictions["overall_risk_level"] = self._risk_level(dist_predictions["overall_risk"])
            predictions.append(dist_predictions)

        return {
            "generated_at": datetime.utcnow().isoformat() + "Z",
            "horizon_months": horizon_months,
            "model_version": self.model_version,
            "district_predictions": predictions,
            "summary": {
                "high_risk_districts": sum(1 for p in predictions if p["overall_risk"] > 0.5),
                "critical_risk_districts": sum(1 for p in predictions if p["overall_risk"] > 0.75),
                "total_estimated_cost_inr": sum(
                    sum(p["models"][m]["estimated_cost_inr"] for m in model_types)
                    for p in predictions
                ),
            },
        }

    # ------------------------------------------------------------------
    # Risk Heatmap
    # ------------------------------------------------------------------
    async def generate_risk_heatmap(self) -> List[Dict[str, Any]]:
        """
        Returns lat/lng points with risk intensity for frontend heatmap rendering.
        """
        heatmap_points = []

        for district in DISTRICTS:
            # Generate a cluster of heatmap points around each district centre
            num_points = random.randint(6, 14)
            for _ in range(num_points):
                scatter_lat = district["lat"] + random.uniform(-0.015, 0.015)
                scatter_lng = district["lng"] + random.uniform(-0.015, 0.015)
                intensity = random.uniform(0.15, 0.95)
                risk_type = random.choice(["Road Damage", "Water Shortage", "Electricity Outage", "Flooding", "Traffic Congestion"])

                heatmap_points.append({
                    "lat": round(scatter_lat, 6),
                    "lng": round(scatter_lng, 6),
                    "intensity": round(intensity, 3),
                    "risk_type": risk_type,
                    "district": district["name"],
                    "district_id": district["id"],
                })

        # Extra high-risk anchor points
        heatmap_points.extend([
            {"lat": 12.9716, "lng": 77.5946, "intensity": 0.85, "risk_type": "Road Damage",       "district": "Gandhi Nagar", "district_id": "D1"},
            {"lat": 12.9600, "lng": 77.6000, "intensity": 0.92, "risk_type": "Water Shortage",    "district": "Rajiv Colony", "district_id": "D3"},
            {"lat": 12.9800, "lng": 77.5800, "intensity": 0.78, "risk_type": "Electricity Outage","district": "Nehru District","district_id": "D4"},
        ])

        return heatmap_points

    # ------------------------------------------------------------------
    # Investment Recommendations
    # ------------------------------------------------------------------
    async def generate_investment_recommendations(self) -> List[Dict[str, Any]]:
        """
        Returns AI-prioritised infrastructure investment recommendations by district.
        """
        recommendations = []

        scenarios = [
            {
                "district": "Rajiv Colony",
                "district_id": "D3",
                "priority": 1,
                "risk_score": 0.82,
                "recommendation": "Emergency water pipeline upgrade",
                "investment_required_inr": 3500000,
                "expected_impact": "Reduces water shortage risk by 68%",
                "roi_estimate": "4.2x over 5 years",
                "horizon": "SHORT_TERM",
                "category": "Water",
            },
            {
                "district": "Gandhi Nagar",
                "district_id": "D1",
                "priority": 2,
                "risk_score": 0.74,
                "recommendation": "Road resurfacing and pothole repair programme",
                "investment_required_inr": 2100000,
                "expected_impact": "Reduces road damage risk by 54%",
                "roi_estimate": "3.1x over 3 years",
                "horizon": "SHORT_TERM",
                "category": "Roads",
            },
            {
                "district": "Nehru District",
                "district_id": "D4",
                "priority": 3,
                "risk_score": 0.69,
                "recommendation": "Substation capacity upgrade + smart grid integration",
                "investment_required_inr": 5800000,
                "expected_impact": "Reduces outage risk by 71%",
                "roi_estimate": "5.6x over 7 years",
                "horizon": "MEDIUM_TERM",
                "category": "Electricity",
            },
            {
                "district": "Indira Nagar",
                "district_id": "D5",
                "priority": 4,
                "risk_score": 0.58,
                "recommendation": "Install IoT flood sensors and early-warning system",
                "investment_required_inr": 1200000,
                "expected_impact": "Early detection reduces flood damage by 45%",
                "roi_estimate": "2.8x over 4 years",
                "horizon": "MEDIUM_TERM",
                "category": "Flooding",
            },
            {
                "district": "Shivaji Park",
                "district_id": "D2",
                "priority": 5,
                "risk_score": 0.44,
                "recommendation": "Traffic signal modernisation and AI-adaptive control",
                "investment_required_inr": 900000,
                "expected_impact": "Reduces congestion by 32%, lowers accident risk by 28%",
                "roi_estimate": "2.1x over 3 years",
                "horizon": "LONG_TERM",
                "category": "Traffic",
            },
        ]

        return scenarios

    # ------------------------------------------------------------------
    # Sustainability Metrics
    # ------------------------------------------------------------------
    async def get_sustainability_metrics(self) -> Dict[str, Any]:
        """
        Returns sustainability score, carbon footprint estimate, and smart city KPIs.
        """
        return {
            "generated_at": datetime.utcnow().isoformat() + "Z",
            "sustainability_score": {
                "overall": 68.4,
                "max": 100,
                "grade": "B+",
                "breakdown": {
                    "energy_efficiency": 72.1,
                    "water_management": 64.8,
                    "waste_management": 61.2,
                    "green_cover": 71.5,
                    "air_quality": 67.9,
                    "transport_efficiency": 69.3,
                },
            },
            "carbon_footprint": {
                "total_annual_tonnes_co2": 142500,
                "per_capita_kg_co2": 1140,
                "breakdown": {
                    "transport": 38.2,
                    "electricity": 29.7,
                    "waste": 18.4,
                    "construction": 13.7,
                },
                "yoy_change_percent": -4.2,
                "target_2030_reduction": "40%",
                "current_progress_percent": 18.7,
            },
            "smart_city_kpis": {
                "digital_services_adoption": 0.74,
                "iot_sensor_coverage": 0.52,
                "complaint_resolution_rate": 0.89,
                "predictive_maintenance_coverage": 0.41,
                "renewable_energy_share": 0.28,
                "paperless_process_rate": 0.82,
            },
            "smart_city_recommendations": [
                {
                    "title": "Expand IoT sensor network to underserved wards",
                    "impact": "HIGH",
                    "cost_inr": 2500000,
                    "sustainability_gain": "+4.2 points",
                    "carbon_reduction_tonnes": 1200,
                },
                {
                    "title": "Solar panel installation on government buildings",
                    "impact": "HIGH",
                    "cost_inr": 8000000,
                    "sustainability_gain": "+6.8 points",
                    "carbon_reduction_tonnes": 3400,
                },
                {
                    "title": "AI-optimised waste collection routing",
                    "impact": "MEDIUM",
                    "cost_inr": 450000,
                    "sustainability_gain": "+2.1 points",
                    "carbon_reduction_tonnes": 580,
                },
                {
                    "title": "Electric vehicle fleet for government operations",
                    "impact": "MEDIUM",
                    "cost_inr": 12000000,
                    "sustainability_gain": "+5.3 points",
                    "carbon_reduction_tonnes": 2100,
                },
            ],
        }

    # ------------------------------------------------------------------
    # District Comparison
    # ------------------------------------------------------------------
    async def get_district_comparison(self) -> List[Dict[str, Any]]:
        """
        Returns a comparative table of districts with risk, complaints, and investment priority.
        """
        comparison = []
        for idx, district in enumerate(DISTRICTS):
            risk = round(random.uniform(0.30, 0.82), 3)
            comparison.append({
                "district_id": district["id"],
                "district_name": district["name"],
                "population": district["population"],
                "overall_risk_score": risk,
                "risk_level": self._risk_level(risk),
                "complaint_density": round(random.uniform(0.8, 4.5), 2),  # per 1000 people
                "resolution_rate": round(random.uniform(0.72, 0.96), 3),
                "infrastructure_age_years": random.randint(8, 35),
                "investment_priority": idx + 1,
                "pending_issues": random.randint(5, 45),
                "monthly_budget_utilisation": round(random.uniform(0.68, 0.99), 3),
            })

        comparison.sort(key=lambda x: x["overall_risk_score"], reverse=True)
        for rank, d in enumerate(comparison, 1):
            d["investment_priority"] = rank

        return comparison

    # ------------------------------------------------------------------
    # Helpers
    # ------------------------------------------------------------------
    def _risk_level(self, risk: float) -> str:
        if risk >= 0.75:
            return "CRITICAL"
        elif risk >= 0.55:
            return "HIGH"
        elif risk >= 0.35:
            return "MEDIUM"
        return "LOW"

    def _key_drivers(self, model_type: str) -> List[str]:
        mapping = {
            "Road Damage": ["Heavy monsoon rainfall", "Aging road surface", "High traffic volume", "Poor drainage"],
            "Water Shortage": ["Population growth", "Aging pipe network", "Seasonal demand spike", "Low reservoir levels"],
            "Electricity Outage": ["Peak load demand", "Aging transformer capacity", "Monsoon damage risk", "Grid imbalance"],
        }
        drivers = mapping.get(model_type, ["Seasonal factors", "Historical patterns"])
        return random.sample(drivers, k=min(3, len(drivers)))

    def _recommended_action(self, model_type: str, risk: float) -> str:
        if risk > 0.65:
            urgency = "Immediate"
        elif risk > 0.45:
            urgency = "Within 30 days"
        else:
            urgency = "Within 90 days"

        actions = {
            "Road Damage": f"{urgency}: Deploy pothole repair crew and assess drainage",
            "Water Shortage": f"{urgency}: Activate emergency water tanker fleet and audit pipeline",
            "Electricity Outage": f"{urgency}: Pre-deploy maintenance team and check transformer loads",
        }
        return actions.get(model_type, f"{urgency}: Review infrastructure status")


urban_intelligence_service = UrbanIntelligenceService()
