"""
Model Loader Service
Handles loading and initialization of all AI/ML models
"""

import logging
import asyncio
from typing import Dict, Any, Optional
import os

# Check if we're in production environment
IS_PRODUCTION = os.getenv("RENDER") == "true" or os.getenv("ENV") == "production"

if not IS_PRODUCTION:
    # Only import heavy ML libraries in development
    try:
        import torch
        import joblib
        from transformers import AutoTokenizer, AutoModel
        ML_AVAILABLE = True
    except ImportError:
        ML_AVAILABLE = False
else:
    # Production environment - skip ML models for now
    ML_AVAILABLE = False
    print("Production environment: ML models disabled for faster deployment")

logger = logging.getLogger("ai-engine.model-loader")

class ModelLoader:
    """
    Centralized model loading and management service
    """
    
    def __init__(self):
        self.models: Dict[str, Any] = {}
        self.is_loaded = False
        self.device = "cpu"  # Use CPU for production
        
        if IS_PRODUCTION:
            # Skip ML models in production
            self.is_loaded = True
            logger.info("Production mode: ML models disabled")
            return
            
        # Development mode - load ML models
        import torch
        from pathlib import Path
        self.model_dir = Path("/app/models")  # Docker mount path
        self.device = "cpu"  # Use CPU for now
        
    async def load_all_models(self) -> bool:
        """
        Load all AI/ML models asynchronously
        """
        if IS_PRODUCTION:
            logger.info("Production mode: Skipping ML model loading")
            return True
            
        try:
            logger.info(f"Loading models on device: {self.device}")
            
            # Load NLP models
            await self._load_nlp_models()
            
            # Load ML models
            await self._load_ml_models()
            
            # Load vision models
            await self._load_vision_models()
            
            # Load prediction models
            await self._load_prediction_models()
            
            self.is_loaded = True
            logger.info("All models loaded successfully")
            return True
            
        except Exception as e:
            logger.error(f"Failed to load models: {e}")
            return False
    
    async def _load_nlp_models(self):
        """Load NLP and text processing models"""
        try:
            logger.info("Loading NLP models...")
            
            # Initialize multilingual NLP
            nlp_model = MultilingualNLP()
            self.models['nlp'] = nlp_model
            
            # Initialize text embedding
            text_embedding = TextEmbedding()
            self.models['text_embedding'] = text_embedding
            
            logger.info("NLP models loaded")
            
        except Exception as e:
            logger.error(f"Failed to load NLP models: {e}")
            raise
    
    async def _load_ml_models(self):
        """Load machine learning models"""
        try:
            logger.info("Loading ML models...")
            
            # Load complaint classifier
            classifier = ComplaintClassifier().to(self.device)
            self.models['complaint_classifier'] = classifier
            
            # Load ETA predictor
            eta_predictor = ETAPredictor().to(self.device)
            self.models['eta_predictor'] = eta_predictor
            
            # Load duplicate detector
            duplicate_detector = DuplicateDetector().to(self.device)
            self.models['duplicate_detector'] = duplicate_detector
            
            logger.info("ML models loaded")
            
        except Exception as e:
            logger.error(f"Failed to load ML models: {e}")
            raise
    
    async def _load_vision_models(self):
        """Load computer vision models"""
        try:
            logger.info("Loading vision models...")
            
            # Load infrastructure analyzer
            vision_model = InfrastructureAnalyzer().to(self.device)
            self.models['infrastructure_analyzer'] = vision_model
            
            logger.info("Vision models loaded")
            
        except Exception as e:
            logger.error(f"Failed to load vision models: {e}")
            raise
    
    async def _load_prediction_models(self):
        """Load prediction and optimization models"""
        try:
            logger.info("Loading prediction models...")
            
            # Load risk predictor
            risk_predictor = RiskPredictor().to(self.device)
            self.models['risk_predictor'] = risk_predictor
            
            # Initialize resource optimizer
            resource_optimizer = ResourceOptimizer()
            self.models['resource_optimizer'] = resource_optimizer
            
            # Initialize predictive maintenance
            predictive_maintenance = PredictiveMaintenance()
            self.models['predictive_maintenance'] = predictive_maintenance
            
            logger.info("Prediction models loaded")
            
        except Exception as e:
            logger.error(f"Failed to load prediction models: {e}")
            raise
    
    def get_model(self, model_name: str) -> Optional[Any]:
        """
        Get a loaded model by name
        """
        if not self.is_loaded:
            logger.warning("Models not loaded yet")
            return None
        
        return self.models.get(model_name)
    
    def get_model_status(self) -> Dict[str, Any]:
        """
        Get status of all loaded models
        """
        status = {
            'loaded': self.is_loaded,
            'device': str(self.device),
            'models': {}
        }
        
        for name, model in self.models.items():
            try:
                if hasattr(model, 'parameters'):
                    # PyTorch model
                    param_count = sum(p.numel() for p in model.parameters())
                    status['models'][name] = {
                        'type': 'pytorch',
                        'parameters': param_count,
                        'device': next(model.parameters()).device
                    }
                else:
                    # Other model types
                    status['models'][name] = {
                        'type': type(model).__name__,
                        'status': 'loaded'
                    }
            except Exception as e:
                status['models'][name] = {
                    'type': type(model).__name__,
                    'error': str(e)
                }
        
        return status
    
    async def warm_up_models(self):
        """
        Warm up models with dummy data to ensure they're ready
        """
        try:
            logger.info("Warming up models...")
            
            # Warm up NLP models
            nlp = self.get_model('nlp')
            if nlp:
                await self._warm_up_nlp(nlp)
            
            # Warm up ML models
            classifier = self.get_model('complaint_classifier')
            if classifier:
                await self._warm_up_classifier(classifier)
            
            # Warm up vision models
            vision = self.get_model('infrastructure_analyzer')
            if vision:
                await self._warm_up_vision(vision)
            
            logger.info("Model warm-up completed")
            
        except Exception as e:
            logger.error(f"Model warm-up failed: {e}")
    
    async def _warm_up_nlp(self, nlp_model):
        """Warm up NLP models"""
        try:
            # Test language detection
            nlp_model.detect_language("Hello world")
            
            # Test classification
            nlp_model.classify_complaint("There is a water leak")
            
        except Exception as e:
            logger.error(f"NLP warm-up failed: {e}")
    
    async def _warm_up_classifier(self, classifier):
        """Warm up ML classifier"""
        try:
            dummy_input = torch.randn(1, 768).to(self.device)
            with torch.no_grad():
                classifier(dummy_input)
        except Exception as e:
            logger.error(f"Classifier warm-up failed: {e}")
    
    async def _warm_up_vision(self, vision_model):
        """Warm up vision models"""
        try:
            dummy_input = torch.randn(1, 3, 224, 224).to(self.device)
            with torch.no_grad():
                vision_model(dummy_input)
        except Exception as e:
            logger.error(f"Vision model warm-up failed: {e}")
    
    def unload_models(self):
        """
        Unload all models to free memory
        """
        try:
            logger.info("Unloading models...")
            
            for name, model in self.models.items():
                try:
                    if hasattr(model, 'cpu'):
                        model.cpu()
                    if hasattr(model, 'to'):
                        model.to('cpu')
                    del model
                except Exception as e:
                    logger.error(f"Error unloading {name}: {e}")
            
            # Clear CUDA cache if available
            if torch.cuda.is_available():
                torch.cuda.empty_cache()
            
            self.models.clear()
            self.is_loaded = False
            
            logger.info("Models unloaded successfully")
            
        except Exception as e:
            logger.error(f"Failed to unload models: {e}")


# Global model loader instance
model_loader = ModelLoader()

async def initialize_models():
    """
    Initialize all models (called during startup)
    """
    success = await model_loader.load_all_models()
    if success:
        await model_loader.warm_up_models()
    return success

def get_model_loader() -> ModelLoader:
    """
    Get the global model loader instance
    """
    return model_loader
