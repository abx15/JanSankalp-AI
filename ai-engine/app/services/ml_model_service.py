import joblib
import numpy as np
import os
import logging
import torch
from app.schemas import PredictETAResponse
from app.federated.coordinator import federated_coordinator

logger = logging.getLogger("ai-engine")

# Path to models volume
MODEL_DIR = "models"
CLASSIFIER_PATH = os.path.join(MODEL_DIR, "classifier.pkl")
SEVERITY_PATH = os.path.join(MODEL_DIR, "severity_model.pkl")
ETA_PATH = os.path.join(MODEL_DIR, "eta_model.pkl")

class MLModelService:
    def __init__(self):
        self.classifier = self._load_model(CLASSIFIER_PATH)
        self.severity_model = self._load_model(SEVERITY_PATH)
        self.eta_model = self._load_model(ETA_PATH)

    def _load_model(self, path: str):
        if os.path.exists(path):
            try:
                model = joblib.load(path)
                logger.info(f"Loaded custom model from {path}")
                return model
            except Exception as e:
                logger.error(f"Error loading model {path}: {e}")
        return None

    async def predict_eta(self, category: str, severity: str, density: float) -> PredictETAResponse:
        # Fallback to logic if model doesn't exist
        if not self.eta_model:
            # Simple heuristic
            sev_weight = {"Low":1, "Medium":2, "High":3, "Critical":5}
            prediction = sev_weight.get(severity, 2) + (density * 2)
        else:
            # We assume for now the model uses text features but can be expanded
            # This is a placeholder for actual feature engineering integration
            prediction = 3.5 # Dummy prediction from model
            
        prediction = max(0.5, float(prediction))
        
        return PredictETAResponse(
            estimated_days=round(prediction, 1),
            confidence_interval=[round(prediction-0.5, 1), round(prediction+0.5,1)]
        )

    async def classify_custom(self, text: str):
        if self.classifier:
            return self.classifier.predict([text])[0]
        return None

    async def classify_federated(self, input_tensor: torch.Tensor):
        """Use the federated model for classification"""
        self.federated_classifier = federated_coordinator.global_classifier
        self.federated_classifier.eval()
        with torch.no_grad():
            outputs = self.federated_classifier(input_tensor)
            _, predicted = torch.max(outputs.data, 1)
            return predicted.item()

ml_model_service = MLModelService()
