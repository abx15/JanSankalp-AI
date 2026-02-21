import openai
from app.config import settings

class TranslationService:
    def __init__(self):
        openai.api_key = settings.OPENAI_API_KEY

    async def translate_text(self, text: str, target_lang: str = "English") -> str:
        prompt = f"Translate the following text to {target_lang}: \"{text}\""
        try:
            response = openai.ChatCompletion.create(
                model="gpt-3.5-turbo",
                messages=[{"role": "user", "content": prompt}]
            )
            return response.choices[0].message.content
        except Exception as e:
            return f"Translation error: {str(e)}"

translation_service = TranslationService()
