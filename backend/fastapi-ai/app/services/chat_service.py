import openai
from huggingface_hub import InferenceClient
from app.config import settings
from app.schemas import ChatResponse
from typing import List, Dict

class ChatService:
    def __init__(self):
        self.openai_client = openai.OpenAI(api_key=settings.OPENAI_API_KEY) if settings.OPENAI_API_KEY else None
        self.hf_client = InferenceClient(token=settings.HUGGINGFACE_API_KEY) if settings.HUGGINGFACE_API_KEY else None

    async def get_response(self, message: str, history: List[Dict[str, str]] = []) -> ChatResponse:
        messages = history + [{"role": "user", "content": message}]
        
        try:
            # Primary: OpenAI with updated API
            if self.openai_client:
                response = self.openai_client.chat.completions.create(
                    model="gpt-3.5-turbo",
                    messages=messages,
                    temperature=0.7
                )
                return ChatResponse(response=response.choices[0].message.content)
        except Exception as e:
            print(f"OpenAI API Error: {e}")
        
        # Fallback: HuggingFace
        if self.hf_client:
            try:
                hf_resp = self.hf_client.chat_completion(
                    model="microsoft/DialoGPT-medium",
                    messages=messages,
                    max_tokens=500
                )
                return ChatResponse(response=hf_resp.choices[0].message.content, metadata={"model": "huggingface_fallback"})
            except Exception as hf_e:
                print(f"HuggingFace Error: {hf_e}")
        
        # Final fallback: Local rule-based responses
        return self._get_fallback_response(message)
    
    def _get_fallback_response(self, message: str) -> ChatResponse:
        """Local fallback responses when APIs are unavailable"""
        message_lower = message.lower()
        
        if "complaint" in message_lower and "file" in message_lower:
            return ChatResponse(response="To file a complaint, please visit the dashboard and click on 'File Complaint'. You'll need to provide details about the issue, location, and any supporting evidence.")
        
        elif "status" in message_lower or "track" in message_lower:
            return ChatResponse(response="You can track your complaint status by visiting the dashboard and clicking on 'My Complaints'. You'll see real-time updates on your submitted issues.")
        
        elif "hello" in message_lower or "hi" in message_lower:
            return ChatResponse(response="Hello! I'm the JanSankalp AI assistant. How can I help you today? I can assist with filing complaints, tracking status, and answering questions about our services.")
        
        elif "help" in message_lower:
            return ChatResponse(response="I can help you with:\n• Filing new complaints\n• Tracking complaint status\n• Understanding the resolution process\n• Finding the right department for your issue\n• Answering questions about our services\n\nWhat would you like help with?")
        
        else:
            return ChatResponse(response="I'm here to help with your civic complaints and services. You can ask me about filing complaints, tracking status, or general information about our services. For specific issues, please visit the dashboard.")

chat_service = ChatService()
