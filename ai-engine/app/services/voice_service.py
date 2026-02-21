import assemblyai as aai
import openai
from app.config import settings
from app.schemas import VoiceResponse
import json

class VoiceService:
    def __init__(self):
        aai.settings.api_key = settings.ASSEMBLY_AI_API_KEY
        openai.api_key = settings.OPENAI_API_KEY

    async def process_voice(self, audio_url: str) -> VoiceResponse:
        transcriber = aai.Transcriber()
        config = aai.TranscriptionConfig(language_detection=True)
        transcript = transcriber.transcribe(audio_url, config)

        raw_text = transcript.text
        detected_language = transcript.json_response.get('language_code', 'unknown')

        # Translate if not English
        translation = raw_text
        if detected_language != 'en':
            prompt = f"Translate the following text to English: \"{raw_text}\""
            response = openai.ChatCompletion.create(
                model="gpt-3.5-turbo",
                messages=[{"role": "user", "content": prompt}]
            )
            translation = response.choices[0].message.content

        # Get structured data from translation
        struct_prompt = f"Extract structured information (location, type of issue, urgency) from this complaint: \"{translation}\". Return as JSON."
        struct_response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[{"role": "user", "content": struct_prompt}]
        )
        try:
            structured_data = json.loads(struct_response.choices[0].message.content)
        except:
            structured_data = {"raw": translation}

        return VoiceResponse(
            transcript=raw_text,
            language=detected_language,
            translation=translation,
            structured_data=structured_data
        )

voice_service = VoiceService()
