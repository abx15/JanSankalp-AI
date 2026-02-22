"""
JanSankalp AI Engine — Entry Point
MVDC Architecture: main.py handles ONLY:

  1. FastAPI app creation
  2. CORS + logging middleware
  3. Startup lifecycle events
  4. Health check endpoint
  5. Router inclusion (all API endpoints live in app/api/routes_ai.py)

NO business logic, NO service calls, NO inline route handlers here.
"""
import os
import time
import asyncio
import logging

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes_ai import router as ai_router
from app.api.models_status import router as models_router

# ---------------------------------------------------------------------------
# Logging
# ---------------------------------------------------------------------------
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S",
)
logger = logging.getLogger("ai-engine")

# ---------------------------------------------------------------------------
# App
# ---------------------------------------------------------------------------
app = FastAPI(
    title="JanSankalp AI Engine",
    description="Production-grade Autonomous AI Governance Service",
    version="2.0.0",
)

# ---------------------------------------------------------------------------
# Startup Event
# ---------------------------------------------------------------------------

@app.on_event("startup")
async def startup_event():
    from app.events.stream_processor import start_event_processing
    from app.services.model_loader import initialize_models
    
    # Start event processing
    asyncio.create_task(start_event_processing())
    logger.info("Kafka processing pipeline started in background")
    
    # Initialize AI/ML models
    try:
        model_success = await initialize_models()
        if model_success:
            logger.info("AI/ML models initialized successfully")
        else:
            logger.error("Failed to initialize AI/ML models")
    except Exception as e:
        logger.error(f"Model initialization error: {e}")

# ---------------------------------------------------------------------------
# Middleware
# ---------------------------------------------------------------------------

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.middleware("http")
async def log_request_time(request: Request, call_next):
    start_time = time.time()
    response = await call_next(request)
    duration = time.time() - start_time
    logger.info(
        f"Method: {request.method} | Path: {request.url.path} | "
        f"Duration: {duration:.4f}s | Status: {response.status_code}"
    )
    return response

# ---------------------------------------------------------------------------
# Health Check
# ---------------------------------------------------------------------------

@app.get("/")
@app.get("/health")
def health_check():
    return {
        "status": "online",
        "service": "JanSankalp AI Engine",
        "version": "2.0.0",
        "timestamp": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
    }

# Mount All AI Routes
app.include_router(ai_router)
app.include_router(models_router, prefix="/models", tags=["models"])

# ---------------------------------------------------------------------------
# Development Entry Point
# ---------------------------------------------------------------------------

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 10000))
    logger.info(f"Starting JanSankalp AI Engine on port {port}")
    uvicorn.run("app.main:app", host="0.0.0.0", port=port, reload=False, workers=1)
