import openai
from app.config import settings
from app.schemas import SpamCheckResponse
import json

class SpamService:
    def __init__(self):
        openai.api_key = settings.OPENAI_API_KEY

    async def check_spam(self, text: str) -> SpamCheckResponse:
        prompt = f"""
        Analyze the following civic complaint for spam, fake content, or irrelevance.
        A complaint is spam if it:
        - Contains gibberish
        - Is offensive or abusive
        - Is completely unrelated to civic issues (e.g., promotional content)
        - Is extremely short or nonsensical

        Complaint: "{text}"

        Return ONLY a JSON object:
        {{
            "is_spam": true/false,
            "spam_score": 0.95,
            "reasoning": "Brief explanation"
        }}
        """
        
        try:
            response = openai.ChatCompletion.create(
                model="gpt-4",
                messages=[{"role": "user", "content": prompt}],
                temperature=0.0
            )
            
            result = json.loads(response.choices[0].message.content)
            return SpamCheckResponse(**result)
        except Exception as e:
            return SpamCheckResponse(
                is_spam=False,
                spam_score=0.1,
                reasoning=f"Error in spam check: {str(e)}"
            )

spam_service = SpamService()
