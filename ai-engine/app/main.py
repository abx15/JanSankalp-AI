from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from app.schemas import (
    ChatRequest, ChatResponse, ClassifyRequest, ClassifyResponse,
    DuplicateCheckRequest, DuplicateCheckResponse, RouteRequest, RouteResponse,
    PredictETARequest, PredictETAResponse, VoiceRequest, VoiceResponse,
    AnalyticsResponse
)
from app.services.chat_service import chat_service
from app.services.classification_service import classification_service
from app.services.duplicate_service import duplicate_service
from app.services.routing_service import routing_service
from app.services.analytics_service import analytics_service
from app.services.voice_service import voice_service
from app.services.translation_service import translation_service
from app.services.ml_model_service import ml_model_service
import logging
import time

# Setup Logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("ai-engine")

app = FastAPI(title="JanSankalp AI Engine", version="1.0.0")

# CORS Support
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Middleware for performance logging
@app.middleware("http")
async def add_process_time_header(request: Request, call_next):
    start_time = time.time()
    response = await call_next(request)
    process_time = time.time() - start_time
    response.headers["X-Process-Time"] = str(process_time)
    logger.info(f"Path: {request.url.path} | Time: {process_time:.4f}s")
    return response

@app.post("/chat", response_model=ChatResponse)
async def chat_endpoint(request: ChatRequest):
    return await chat_service.get_response(request.message, request.history)

@app.post("/classify", response_model=ClassifyResponse)
async def classify_endpoint(request: ClassifyRequest):
    return await classification_service.classify_complaint(request.text)

@app.post("/duplicate-check", response_model=DuplicateCheckResponse)
async def duplicate_check_endpoint(request: DuplicateCheckRequest):
    return await duplicate_service.check_duplicate(request.text, request.latitude, request.longitude)

@app.post("/route", response_model=RouteResponse)
async def route_endpoint(request: RouteRequest):
    return await routing_service.route_complaint(request.category, request.severity)

@app.post("/analytics", response_model=AnalyticsResponse)
async def analytics_endpoint():
    return await analytics_service.generate_dashboard_data()

@app.post("/voice-to-text", response_model=VoiceResponse)
async def voice_endpoint(request: VoiceRequest):
    return await voice_service.process_voice(request.audio_url)

@app.post("/translate")
async def translate_endpoint(text: str, target: str = "English"):
    return {"translated_text": await translation_service.translate_text(text, target)}

@app.post("/predict-eta", response_model=PredictETAResponse)
async def predict_eta_endpoint(request: PredictETARequest):
    return await ml_model_service.predict_eta(request.category, request.severity, request.location_density)

@app.get("/health")
def health_check():
    return {"status": "healthy", "timestamp": time.time()}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
