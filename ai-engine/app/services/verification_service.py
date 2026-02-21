import openai
from app.config import settings
from app.schemas import ResolutionVerifyResponse
import json
from typing import Optional

class VerificationService:
    def __init__(self):
        openai.api_key = settings.OPENAI_API_KEY

    async def verify_resolution(
        self, 
        complaint_text: str, 
        resolution_text: str, 
        image_url: Optional[str] = None
    ) -> ResolutionVerifyResponse:
        prompt = f"""
        Analyze whether the following civic complaint has been properly resolved based on the officer's resolution notes.
        
        Original Complaint: "{complaint_text}"
        Officer's Resolution: "{resolution_text}"
        
        {f'Image attached by officer: {image_url}' if image_url else 'No image attached.'}

        A resolution is valid if it:
        - Directly addresses the original problem.
        - Provides specific details of what was done.
        - Is not just a generic "work done" message.
        - Is professional.

        Return ONLY a JSON object:
        {{
            "is_verified": true/false,
            "confidence": 0.88,
            "feedback": "Specific feedback on why it was verified or rejected",
            "requires_admin": true/false
        }}
        """
        
        try:
            response = openai.ChatCompletion.create(
                model="gpt-4",
                messages=[{"role": "user", "content": prompt}],
                temperature=0.0
            )
            
            result = json.loads(response.choices[0].message.content)
            return ResolutionVerifyResponse(**result)
        except Exception as e:
            return ResolutionVerifyResponse(
                is_verified=False,
                confidence=0.0,
                feedback=f"Verification script error: {str(e)}",
                requires_admin=True
            )

verification_service = VerificationService()
