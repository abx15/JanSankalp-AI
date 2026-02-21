import pickle
import numpy as np
import os
from sklearn.linear_model import LinearRegression
from app.schemas import PredictETAResponse

MODEL_PATH = "app/ml_models/complaint_classifier.pkl"

class MLModelService:
    def __init__(self):
        self.model = self._load_or_train_model()

    def _load_or_train_model(self):
        if os.path.exists(MODEL_PATH):
            with open(MODEL_PATH, "rb") as f:
                return pickle.load(f)
        else:
            # Training a basic regression model: 
            # Features: [Category_Index, Severity_Index, Location_Density]
            # Target: Days to resolve
            X = np.array([
                [0, 3, 0.8], # Roads, Critical, High Density -> 5 days
                [1, 2, 0.5], # Water, High, Med Density -> 3 days
                [3, 1, 0.2], # Sanitation, Med, Low Density -> 2 days
                [4, 0, 0.1], # Traffic, Low, Low Density -> 1 day
            ])
            y = np.array([5.0, 3.2, 2.1, 1.0])
            
            model = LinearRegression()
            model.fit(X, y)
            
            # Save the model
            os.makedirs(os.path.dirname(MODEL_PATH), exist_ok=True)
            with open(MODEL_PATH, "wb") as f:
                pickle.dump(model, f)
            return model

    async def predict_eta(self, category: str, severity: str, density: float) -> PredictETAResponse:
        # Simple mapping for indices
        cat_map = {"Roads":0, "Water":1, "Electricity":2, "Sanitation":3, "Traffic":4, "Others":5}
        sev_map = {"Low":0, "Medium":1, "High":2, "Critical":3}
        
        feature = np.array([[
            cat_map.get(category, 5),
            sev_map.get(severity, 1),
            density
        ]])
        
        prediction = self.model.predict(feature)[0]
        prediction = max(0.5, prediction) # Minimum 0.5 days
        
        return PredictETAResponse(
            estimated_days=round(float(prediction), 1),
            confidence_interval=[round(prediction-0.5, 1), round(prediction+0.5,1)]
        )

ml_model_service = MLModelService()
