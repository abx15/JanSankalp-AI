"""
Models Status API
Provides status and health information for all AI/ML models
"""

import logging
from fastapi import APIRouter
from app.services.model_loader import get_model_loader

logger = logging.getLogger("ai-engine.models-status")
router = APIRouter()

@router.get("/status")
async def get_models_status():
    """
    Get status of all loaded AI/ML models
    """
    try:
        model_loader = get_model_loader()
        status = model_loader.get_model_status()
        
        return {
            "success": True,
            "data": status,
            "message": "Models status retrieved successfully"
        }
        
    except Exception as e:
        logger.error(f"Failed to get models status: {e}")
        return {
            "success": False,
            "error": str(e),
            "message": "Failed to retrieve models status"
        }

@router.get("/health")
async def models_health_check():
    """
    Health check for AI/ML models
    """
    try:
        model_loader = get_model_loader()
        
        if not model_loader.is_loaded:
            return {
                "status": "unhealthy",
                "message": "Models not loaded"
            }
        
        # Test a few models to ensure they're working
        test_results = {}
        
        # Test NLP model
        nlp = model_loader.get_model('nlp')
        if nlp:
            try:
                result = nlp.detect_language("test")
                test_results['nlp'] = "working"
            except Exception as e:
                test_results['nlp'] = f"error: {str(e)}"
        
        # Test classifier
        classifier = model_loader.get_model('complaint_classifier')
        if classifier:
            test_results['classifier'] = "loaded"
        
        # Test vision model
        vision = model_loader.get_model('infrastructure_analyzer')
        if vision:
            test_results['vision'] = "loaded"
        
        all_working = all("error" not in result for result in test_results.values())
        
        return {
            "status": "healthy" if all_working else "degraded",
            "models": test_results,
            "device": str(model_loader.device)
        }
        
    except Exception as e:
        logger.error(f"Models health check failed: {e}")
        return {
            "status": "unhealthy",
            "error": str(e)
        }

@router.post("/reload")
async def reload_models():
    """
    Reload all AI/ML models
    """
    try:
        model_loader = get_model_loader()
        
        # Unload existing models
        model_loader.unload_models()
        
        # Reload models
        success = await model_loader.load_all_models()
        
        if success:
            await model_loader.warm_up_models()
            return {
                "success": True,
                "message": "Models reloaded successfully"
            }
        else:
            return {
                "success": False,
                "message": "Failed to reload models"
            }
            
    except Exception as e:
        logger.error(f"Failed to reload models: {e}")
        return {
            "success": False,
            "error": str(e),
            "message": "Failed to reload models"
        }
