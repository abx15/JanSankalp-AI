import openai
from app.config import settings
from app.schemas import PredictETAResponse
from app.services.ml_model_service import ml_model_service
from typing import List, Dict, Any
import json
import logging

logger = logging.getLogger("ai-engine.agents.eta_policy")

# Indian municipal policies map for local fallback
POLICY_DATABASE = {
    "Roads": {
        "policy": "Indian Road Congress (IRC) Maintenance Manual Sec 12",
        "guidelines": "Repair potholes within 48 hours in arterial roads and 7 days in collector roads.",
        "escalation": "Auto-escalation to Chief Engineer if unresolved within 5 days."
    },
    "Water": {
        "policy": "CPHEEO Manual on Water Supply and Treatment, 2021",
        "guidelines": "Respond to minor pipeline leaks within 24 hours. Major water supply outages within 12 hours.",
        "escalation": "Auto-escalation to Superintendent Engineer if unresolved within 36 hours."
    },
    "Electricity": {
        "policy": "Electricity Act 2003, Standard of Performance Regulations",
        "guidelines": "Transformer failures must be replaced within 24 hours in urban areas. Individual line faults within 4 hours.",
        "escalation": "Auto-escalation to Executive Engineer if unresolved within 12 hours."
    },
    "Sanitation": {
        "policy": "Swachh Bharat Mission (Urban) Operational Guidelines",
        "guidelines": "Clear solid waste dumping within 24 hours of report. Drain blockages cleared within 12 hours.",
        "escalation": "Auto-escalation to Municipal Commissioner if unresolved within 3 days."
    },
    "Traffic": {
        "policy": "Motor Vehicles (Amendment) Act and Traffic Flow Standards",
        "guidelines": "Remove broken down vehicles or clear severe signals within 30 minutes of notification.",
        "escalation": "Immediate notification dispatch to local PCR and Traffic ACP."
    },
    "Others": {
        "policy": "JanSankalp General Civic Grievance SLA Policy, 2024",
        "guidelines": "Acknowledge within 4 hours and resolve within 7 working days.",
        "escalation": "Escalation to Nodal Grievance Officer after 7 days."
    }
}

class ETAPolicyAgent:
    def __init__(self):
        self.client = openai.OpenAI(api_key=settings.OPENAI_API_KEY) if settings.OPENAI_API_KEY else None

    async def run(self, category: str, severity: str, density: float = 0.5) -> Dict[str, Any]:
        logger.info(f"[ETA & Policy Agent] Forecasting ETA for: Category={category}, Severity={severity}")
        
        if not self.client:
            logger.warning("[ETA & Policy Agent] OpenAI Client not initialized. Using ML Service / Policy DB Fallback.")
            return await self._run_fallback(category, severity, density)
            
        policy_info = POLICY_DATABASE.get(category, POLICY_DATABASE["Others"])
        
        prompt = f"""
        You are JanSankalp AI's Policy, Compliance & ETA Forecasting Agent.
        Determine the estimated days to resolve this complaint and state the governing municipal policy guidelines.
        
        INPUT DETAILS:
        - Category: {category}
        - Severity: {severity}
        - Population/Issue Density: {density}
        - Reference Policy Title: "{policy_info['policy']}"
        - Reference Policy SLA Guidelines: "{policy_info['guidelines']}"
        - Reference Escalation Protocol: "{policy_info['escalation']}"
        
        GUIDELINES:
        - Estimate resolution time in days (float value, e.g. 0.5 to 10.0 days).
        - Predict realistic confidence interval (e.g. [estimated_days - 0.5, estimated_days + 1.0]).
        - Outline a concise compliance recommendation.
        
        Return a JSON object matching this exact schema:
        {{
            "estimated_days": 2.5,
            "confidence_interval": [2.0, 3.5],
            "governing_policy": "Full governing policy name/reference",
            "compliance_summary": "Detailed guidelines on what actions are required",
            "auto_escalation_protocol": "Conditions under which this gets escalated to higher officer"
        }}
        """
        
        try:
            response = self.client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[{"role": "user", "content": prompt}],
                temperature=0.1,
                response_format={"type": "json_object"}
            )
            
            result = json.loads(response.choices[0].message.content)
            return result
            
        except Exception as e:
            logger.error(f"[ETA & Policy Agent] API Error: {e}. Falling back.")
            return await self._run_fallback(category, severity, density, f"Fallback trigger due to error: {str(e)}")

    async def _run_fallback(self, category: str, severity: str, density: float, notes: str = "Local Heuristic Policy Match") -> Dict[str, Any]:
        ml_eta = await ml_model_service.predict_eta(category, severity, density)
        policy_info = POLICY_DATABASE.get(category, POLICY_DATABASE["Others"])
        
        return {
            "estimated_days": ml_eta.estimated_days,
            "confidence_interval": ml_eta.confidence_interval,
            "governing_policy": f"{policy_info['policy']} ({notes})",
            "compliance_summary": policy_info['guidelines'],
            "auto_escalation_protocol": policy_info['escalation']
        }

eta_policy_agent = ETAPolicyAgent()
