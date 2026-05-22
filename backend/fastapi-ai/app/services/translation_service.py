import openai
from app.config import settings

class TranslationService:
    def __init__(self):
        self.client = openai.OpenAI(api_key=settings.OPENAI_API_KEY) if settings.OPENAI_API_KEY else None

    async def translate_text(self, text: str, target_lang: str = "English") -> str:
        prompt = f"Translate the following text to {target_lang}: \"{text}\""
        try:
            if not self.client:
                raise Exception("OpenAI API key not configured")
            response = self.client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[{"role": "user", "content": prompt}]
            )
            return response.choices[0].message.content
        except Exception as e:
            return f"Translation error: {str(e)}"

translation_service = TranslationService()
