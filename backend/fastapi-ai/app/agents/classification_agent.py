import openai
from app.config import settings
from app.schemas import ClassifyResponse
import json
import logging

logger = logging.getLogger("ai-engine.agents.classification")

class ClassificationAgent:
    def __init__(self):
        self.client = openai.OpenAI(api_key=settings.OPENAI_API_KEY) if settings.OPENAI_API_KEY else None
        self.categories = settings.CATEGORIES
        self.severity_levels = settings.SEVERITY_LEVELS

    async def run(self, text: str) -> ClassifyResponse:
        logger.info(f"[Classification Agent] Classifying complaint: '{text[:50]}...'")
        
        if not self.client:
            logger.warning("[Classification Agent] OpenAI Client is not initialized. Using local heuristics.")
            return self._run_fallback(text)
            
        prompt = f"""
        You are JanSankalp AI's Smart Triage and Classification Agent.
        Analyze the following Indian civic complaint and extract the appropriate category, severity level, confidence, and reasoning.
        
        ALLOWED CATEGORIES:
        {self.categories}
        
        ALLOWED SEVERITY LEVELS:
        {self.severity_levels}
        
        Complaint: "{text}"
        
        Return a JSON object matching this exact schema:
        {{
            "category": "One from the allowed categories list",
            "severity": "One from the allowed severity levels list",
            "confidence": 0.0 to 1.0,
            "reasoning": "A highly detailed, 1-2 sentence explanation of your classification decision based on gravity."
        }}
        """
        
        try:
            response = self.client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[{"role": "user", "content": prompt}],
                temperature=0.2,
                response_format={"type": "json_object"}
            )
            
            result = json.loads(response.choices[0].message.content)
            # Ensure the values are correct
            category = result.get("category", "Others")
            if category not in self.categories:
                category = "Others"
                
            severity = result.get("severity", "Medium")
            if severity not in self.severity_levels:
                severity = "Medium"
                
            return ClassifyResponse(
                category=category,
                severity=severity,
                confidence=float(result.get("confidence", 0.8)),
                reasoning=result.get("reasoning", "AI classified.")
            )
            
        except Exception as e:
            logger.error(f"[Classification Agent] API Error: {e}. Falling back.")
            return self._run_fallback(text, f"Fallback trigger due to API Error: {str(e)}")

    def _run_fallback(self, text: str, reason: str = "Local heuristics check") -> ClassifyResponse:
        text_lower = text.lower()
        category = "Others"
        severity = "Medium"
        confidence = 0.6
        
        # Simple heuristic mapping
        if any(w in text_lower for w in ["road", "pothole", "street", "highway", "asphalt", "cracks"]):
            category = "Roads"
            if "accident" in text_lower or "dangerous" in text_lower or "injured" in text_lower:
                severity = "Critical"
        elif any(w in text_lower for w in ["water", "leak", "pipe", "drain", "sewage", "drinking", "flooding"]):
            category = "Water"
            if "contamination" in text_lower or "poison" in text_lower:
                severity = "Critical"
        elif any(w in text_lower for w in ["electricity", "power", "outage", "blackout", "transformer", "wire", "shock"]):
            category = "Electricity"
            if "sparking" in text_lower or "open wire" in text_lower:
                severity = "Critical"
        elif any(w in text_lower for w in ["garbage", "trash", "sanitation", "smell", "dump", "dirty", "unhygienic"]):
            category = "Sanitation"
            if "disease" in text_lower or "epidemic" in text_lower:
                severity = "High"
        elif any(w in text_lower for w in ["traffic", "jam", "signal", "light", "congestion", "police", "parking"]):
            category = "Traffic"
            if "blockage" in text_lower:
                severity = "High"
                
        # Upgrade severity for urgent exclamation
        if severity == "Medium" and ("urgent" in text_lower or "immediate" in text_lower or "emergency" in text_lower):
            severity = "High"
            
        return ClassifyResponse(
            category=category,
            severity=severity,
            confidence=confidence,
            reasoning=f"{reason}: Classified via text scanning mapping rules."
        )

classification_agent = ClassificationAgent()
