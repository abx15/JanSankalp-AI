import openai
from app.config import settings
from app.schemas import RouteResponse
from app.services.routing_service import routing_service
import json
import logging

logger = logging.getLogger("ai-engine.agents.routing")

# Map category to officers
DEPARTMENTS_OFFICERS = {
    "Roads": ["officer_1", "officer_2"],
    "Sanitation": ["officer_3", "officer_4"],
    "Water": ["officer_5", "officer_6"],
    "Electricity": ["officer_7", "officer_8"],
    "Traffic": ["officer_9", "officer_10"],
    "Others": ["officer_9", "officer_10"]
}

class RoutingAgent:
    def __init__(self):
        self.client = openai.OpenAI(api_key=settings.OPENAI_API_KEY) if settings.OPENAI_API_KEY else None

    async def run(self, category: str, severity: str, text: str = "", lat: float = 0.0, lon: float = 0.0) -> RouteResponse:
        logger.info(f"[Routing Agent] Routing complaint for Category: {category}, Severity: {severity}")
        
        if not self.client:
            logger.warning("[Routing Agent] OpenAI Client not initialized. Using RL/Service Fallback routing.")
            return await self._run_fallback(category, severity, lat, lon)
            
        # Map category names to align with existing service names or use directly
        norm_category = category if category in DEPARTMENTS_OFFICERS else "Others"
        allowed_officers = DEPARTMENTS_OFFICERS.get(norm_category, DEPARTMENTS_OFFICERS["Others"])
        
        prompt = f"""
        You are JanSankalp AI's Smart Routing Agent.
        Your task is to assign the civic complaint to the appropriate Department, Officer ID, and priority level.
        
        INPUT DATA:
        - Complaint Category: {category}
        - Severity Level: {severity}
        - Complaint Text: "{text}"
        - Allowed Department: "{norm_category}"
        - Available Officers for this Department: {allowed_officers}
        
        GUIDELINES:
        - Select the most appropriate Officer ID from the available officers list.
        - Determine the priority (Low, Normal, High, Urgent) based on complaint text and severity.
          If severity is 'Critical', priority MUST be 'Urgent'.
          If complaint mentions danger, water contamination, live wires, or active accidents, assign 'Urgent'.
        
        Return a JSON object matching this exact schema:
        {{
            "department": "Name of the department",
            "officer_id": "Selected officer ID from the allowed list",
            "priority": "Low, Normal, High, or Urgent"
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
            
            # Validation
            dept = result.get("department", norm_category)
            officer = result.get("officer_id")
            if officer not in allowed_officers:
                # Default to first officer
                officer = allowed_officers[0]
                
            priority = result.get("priority", "Normal")
            if severity == "Critical":
                priority = "Urgent"
                
            return RouteResponse(
                department=dept,
                officer_id=officer,
                priority=priority
            )
            
        except Exception as e:
            logger.error(f"[Routing Agent] API Error: {e}. Falling back to service.")
            return await self._run_fallback(category, severity, lat, lon)

    async def _run_fallback(self, category: str, severity: str, lat: float = 0.0, lon: float = 0.0) -> RouteResponse:
        # Standardize category string for existing RL routing service
        service_category = category
        if category == "Roads":
            service_category = "Road & Potholes"
        elif category == "Sanitation":
            service_category = "Garbage & Sanitation"
        elif category == "Water":
            service_category = "Water Supply"
            
        res = await routing_service.route_complaint(service_category, severity, lat, lon)
        # Map department back if needed, but we keep RouteResponse consistency
        return res

routing_agent = RoutingAgent()
