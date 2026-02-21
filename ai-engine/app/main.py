import os
import time
import logging
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from app.schemas import (
    ChatRequest, ChatResponse, ClassifyRequest, ClassifyResponse,
    DuplicateCheckRequest, DuplicateCheckResponse, RouteRequest, RouteResponse,
    PredictETARequest, PredictETAResponse, VoiceRequest, VoiceResponse,
    AnalyticsResponse, SpamCheckRequest, SpamCheckResponse,
    ResolutionVerifyRequest, ResolutionVerifyResponse,
    AIProcessWorkflowRequest, AIProcessWorkflowResponse
)
from app.services.chat_service import chat_service
from app.services.classification_service import classification_service
from app.services.duplicate_service import duplicate_service
from app.services.routing_service import routing_service
from app.services.analytics_service import analytics_service
from app.services.voice_service import voice_service
from app.services.translation_service import translation_service
from app.services.ml_model_service import ml_model_service
from app.services.spam_service import spam_service
from app.services.verification_service import verification_service

# Production Logging Configuration
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S",
)
logger = logging.getLogger("ai-engine")

app = FastAPI(
    title="JanSankalp AI Engine",
    description="Production-grade Autonomous AI Governance Service",
    version="2.0.0"
)

# CORS Support
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
        "version": "2.0.0",
        "timestamp": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
    }

# --- Core AI Operations ---

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

# --- Autonomous Governance Operations ---

@app.post("/spam-check", response_model=SpamCheckResponse)
async def spam_check_endpoint(request: SpamCheckRequest):
    return await spam_service.check_spam(request.text)

@app.post("/verify-resolution", response_model=ResolutionVerifyResponse)
async def verify_resolution_endpoint(request: ResolutionVerifyRequest):
    return await verification_service.verify_resolution(
        request.complaint_text, 
        request.resolution_text, 
        request.evidence_image_url
    )

@app.post("/process-workflow", response_model=AIProcessWorkflowResponse)
async def process_workflow_endpoint(request: AIProcessWorkflowRequest):
    logger.info(f"Processing Autonomous Workflow for ID: {request.complaint_id}")
    
    # 1. Spam & Validity Check
    spam_result = await spam_service.check_spam(request.text)
    if spam_result.is_spam:
        return AIProcessWorkflowResponse(
            status="REJECTED_SPAM",
            analysis=ClassifyResponse(category="N/A", severity="Low", confidence=spam_result.spam_score, reasoning=spam_result.reasoning),
            is_duplicate=False,
            is_spam=True,
            eta_days=0
        )
    
    # 2. Smart Classification
    analysis = await classification_service.classify_complaint(request.text)
    
    # 3. Duplicate Detection & Grouping
    dup_result = await duplicate_service.check_duplicate(request.text, request.latitude, request.longitude)
    
    # 4. Smart Routing (if not duplicate)
    routing = None
    if not dup_result.is_duplicate:
        routing = await routing_service.route_complaint(analysis.category, analysis.severity)
    
    # 5. ML-based ETA Prediction
    eta = await ml_model_service.predict_eta(analysis.category, analysis.severity, 0.5)

    return AIProcessWorkflowResponse(
        status="PROCESSED",
        analysis=analysis,
        is_duplicate=dup_result.is_duplicate,
        is_spam=False,
        assigned_department=routing.department if routing else None,
        assigned_officer=routing.officer_id if routing else None,
        eta_days=eta.estimated_days
    )

# --- Advanced Analytics & Utils ---

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
    logger.info(f"Starting JanSankalp AI Engine on port {port}")
    uvicorn.run("app.main:app", host="0.0.0.0", port=port, reload=False, workers=1)
