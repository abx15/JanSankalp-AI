import openai
from app.config import settings
from app.schemas import ClassifyResponse
import json

class ClassificationService:
    def __init__(self):
        openai.api_key = settings.OPENAI_API_KEY

    async def classify_complaint(self, text: str) -> ClassifyResponse:
        prompt = f"""
        Analyze the following civic complaint and provide:
        1. Category (Roads, Water, Electricity, Sanitation, Traffic, Others)
        2. Severity scoring (Low, Medium, High, Critical)
        3. Confidence score (0.0 to 1.0)
        4. Brief reasoning

        Complaint: "{text}"

        Return ONLY a JSON object with: 
        {{
            "category": "category_name",
            "severity": "severity_level",
            "confidence": 0.95,
            "reasoning": "reasoning text"
        }}
        """
        
        try:
            response = openai.ChatCompletion.create(
                model="gpt-4",
                messages=[{"role": "user", "content": prompt}],
                temperature=0.3
            )
            
            result = json.loads(response.choices[0].message.content)
            return ClassifyResponse(**result)
        except Exception as e:
            # Fallback for error handling
            return ClassifyResponse(
                category="Others",
                severity="Medium",
                confidence=0.5,
                reasoning=f"Error in classification: {str(e)}"
            )

classification_service = ClassificationService()
