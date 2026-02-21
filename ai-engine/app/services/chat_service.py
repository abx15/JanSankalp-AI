import openai
from huggingface_hub import InferenceClient
from app.config import settings
from app.schemas import ChatResponse
from typing import List, Dict

class ChatService:
    def __init__(self):
        openai.api_key = settings.OPENAI_API_KEY
        self.hf_client = InferenceClient(token=settings.HUGGINGFACE_API_KEY) if settings.HUGGINGFACE_API_KEY else None

    async def get_response(self, message: str, history: List[Dict[str, str]] = []) -> ChatResponse:
        messages = history + [{"role": "user", "content": message}]
        
        try:
            # Primary: OpenAI
            response = openai.ChatCompletion.create(
                model="gpt-4",
                messages=messages,
                temperature=0.7
            )
            return ChatResponse(response=response.choices[0].message.content)
        except Exception as e:
            # Fallback: HuggingFace
            if self.hf_client:
                try:
                    hf_resp = self.hf_client.chat_completion(
                        messages=messages,
                        max_tokens=500
                    )
                    return ChatResponse(response=hf_resp.choices[0].message.content, metadata={"model": "huggingface_fallback"})
                except Exception as hf_e:
                    return ChatResponse(response="I'm sorry, I'm having trouble connecting to my AI services right now.")
            
            return ChatResponse(response=f"Error in chat service: {str(e)}")

chat_service = ChatService()
