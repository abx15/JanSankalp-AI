import openai
from app.config import settings
from app.schemas import SpamCheckResponse
import json
import logging

logger = logging.getLogger("ai-engine.agents.spam")

class SpamAgent:
    def __init__(self):
        # Correctly initialize OpenAI Client
        self.client = openai.OpenAI(api_key=settings.OPENAI_API_KEY) if settings.OPENAI_API_KEY else None

    async def run(self, text: str) -> SpamCheckResponse:
        logger.info(f"[Spam Agent] Analyzing complaint validity for: '{text[:50]}...'")
        
        if not self.client:
            logger.warning("[Spam Agent] OpenAI Client is not initialized. Using local heuristics.")
            return self._run_fallback(text)
            
        prompt = f"""
        You are JanSankalp AI's Spam Detection Agent.
        Analyze the following civic complaint/grievance to determine if it is spam, abusive, fake, or completely irrelevant.
        
        A complaint is classified as SPAM if it:
        - Contains nonsensical characters, random strings, or gibberish (e.g. "asdfghjk").
        - Contains promotional, advertising, or marketing pitches (e.g. "Buy crypto now").
        - Uses profane, abusive, hate-filled, or inappropriate language.
        - Is completely unrelated to public utilities, civic infrastructure, governance, or local services.
        
        Complaint: "{text}"
        
        Return a JSON object matching this exact schema:
        {{
            "is_spam": true,
            "spam_score": 0.95,
            "reasoning": "Brief explanation"
        }}
        
        Set is_spam to false if it is a legitimate complaint.
        """
        
        try:
            # Modern OpenAI API format
            response = self.client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[{"role": "user", "content": prompt}],
                temperature=0.0,
                response_format={"type": "json_object"}
            )
            
            result = json.loads(response.choices[0].message.content)
            return SpamCheckResponse(**result)
            
        except Exception as e:
            logger.error(f"[Spam Agent] API Error: {e}. Falling back.")
            return self._run_fallback(text, f"Fallback trigger due to API Error: {str(e)}")

    def _run_fallback(self, text: str, reason: str = "Local heuristics check") -> SpamCheckResponse:
        text_lower = text.lower().strip()
        
        # Simple local heuristic checks
        if len(text_lower) < 5:
            return SpamCheckResponse(is_spam=True, spam_score=0.95, reasoning=f"{reason}: Text is too short to be a valid complaint.")
            
        # Repetitive characters
        if len(set(text_lower)) <= 3 and len(text_lower) > 10:
            return SpamCheckResponse(is_spam=True, spam_score=0.9, reasoning=f"{reason}: Repetitive characters detected.")
            
        # Bad words / promotional keywords check
        spam_keywords = ["buy", "sell", "casino", "crypto", "dating", "sex", "promo", "discount", "viagra", "make money"]
        for kw in spam_keywords:
            if kw in text_lower:
                return SpamCheckResponse(is_spam=True, spam_score=0.85, reasoning=f"{reason}: Promotional keyword '{kw}' detected.")
                
        return SpamCheckResponse(is_spam=False, spam_score=0.05, reasoning=f"{reason}: Text cleared structural heuristic checks.")

spam_agent = SpamAgent()
