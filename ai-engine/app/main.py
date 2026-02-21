import os
import time
import logging
from fastapi import FastAPI, Request
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

# Production Logging Configuration
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S",
)
logger = logging.getLogger("ai-engine")

app = FastAPI(
    title="JanSankalp AI Engine",
    description="Production-grade AI microservice for civic complaint management",
    version="1.0.0"
)

# CORS Support - In production, limit origins to your Vercel URL
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Performance Middleware
@app.middleware("http")
async def log_request_time(request: Request, call_next):
    start_time = time.time()
    response = await call_next(request)
    duration = time.time() - start_time
    logger.info(f"Method: {request.method} | Path: {request.url.path} | Duration: {duration:.4f}s | Status: {response.status_code}")
    return response

@app.get("/")
@app.get("/health")
def health_check():
    return {
        "status": "online",
        "service": "JanSankalp AI Engine",
        "timestamp": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
    }

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

if __name__ == "__main__":
    import uvicorn
    # Render provides PORT environment variable
    port = int(os.environ.get("PORT", 10000))
    uvicorn.run("app.main:app", host="0.0.0.0", port=port, reload=False, workers=1)
