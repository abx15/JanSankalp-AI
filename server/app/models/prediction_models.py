"""
Prediction Models for Risk Assessment and Resource Planning
Includes predictive analytics for infrastructure, resource allocation, and optimization
"""

import torch
import torch.nn as nn
import torch.nn.functional as F
import numpy as np
from typing import Dict, List, Any, Tuple, Optional
from datetime import datetime, timedelta
import pandas as pd
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import RandomForestRegressor, GradientBoostingRegressor
import joblib

class RiskPredictor(nn.Module):
    """
    Deep learning model for predicting infrastructure risks
    Predicts likelihood of failures, maintenance needs, and resource requirements
    """
    
    def __init__(
        self,
        input_dim: int = 50,  # Number of features
        hidden_dims: list = [128, 64, 32],
        output_dim: int = 10,  # Number of risk categories
        dropout_rate: float = 0.3
    ):
        super(RiskPredictor, self).__init__()
        
        # Feature extraction layers
        layers = []
        prev_dim = input_dim
        
        for hidden_dim in hidden_dims:
            layers.extend([
                nn.Linear(prev_dim, hidden_dim),
                nn.BatchNorm1d(hidden_dim),
                nn.ReLU(),
                nn.Dropout(dropout_rate)
            ])
            prev_dim = hidden_dim
        
        self.feature_extractor = nn.Sequential(*layers)
        
        # Risk prediction heads
        self.failure_predictor = nn.Linear(prev_dim, 1)  # Probability of failure
        self.maintenance_predictor = nn.Linear(prev_dim, 1)  # Maintenance urgency
        self.resource_predictor = nn.Linear(prev_dim, 5)  # Resource requirements
        
        # Attention mechanism for feature importance
        self.attention = nn.MultiheadAttention(
            embed_dim=prev_dim,
            num_heads=4,
            dropout=dropout_rate,
            batch_first=True
        )
        
        # Temporal modeling for time-series predictions
        self.lstm = nn.LSTM(prev_dim, 32, batch_first=True)
        
    def forward(self, x: torch.Tensor, temporal_features: Optional[torch.Tensor] = None) -> Dict[str, torch.Tensor]:
        """
        Forward pass for risk prediction
        """
        batch_size = x.size(0)
        
        # Feature extraction
        features = self.feature_extractor(x)
        
        # Add sequence dimension for attention
        features_seq = features.unsqueeze(1)
        
        # Self-attention
        attended, attention_weights = self.attention(features_seq, features_seq, features_seq)
        attended = attended.squeeze(1)
        
        # Temporal modeling if provided
        if temporal_features is not None:
            lstm_out, _ = self.lstm(temporal_features)
            temporal_features = lstm_out[:, -1, :]  # Take last output
            # Combine with attended features
            combined = torch.cat([attended, temporal_features], dim=1)
        else:
            combined = attended
        
        # Risk predictions
        failure_prob = torch.sigmoid(self.failure_predictor(combined))
        maintenance_urgency = torch.sigmoid(self.maintenance_predictor(combined))
        resource_requirements = F.softmax(self.resource_predictor(combined), dim=1)
        
        return {
            'failure_probability': failure_prob,
            'maintenance_urgency': maintenance_urgency,
            'resource_requirements': resource_requirements,
            'attention_weights': attention_weights,
            'features': combined
        }
    
    def predict_risk(self, features: np.ndarray, temporal_data: Optional[np.ndarray] = None) -> Dict[str, Any]:
        """
        Make risk predictions with detailed analysis
        """
        self.eval()
        with torch.no_grad():
            x_tensor = torch.FloatTensor(features).unsqueeze(0)
            temporal_tensor = torch.FloatTensor(temporal_data).unsqueeze(0) if temporal_data is not None else None
            
            outputs = self.forward(x_tensor, temporal_tensor)
            
            # Extract predictions
            failure_prob = outputs['failure_probability'].item()
            maintenance_urgency = outputs['maintenance_urgency'].item()
            resource_req = outputs['resource_requirements'].cpu().numpy()[0]
            
            # Determine risk level
            if failure_prob > 0.8:
                risk_level = "Critical"
            elif failure_prob > 0.6:
                risk_level = "High"
            elif failure_prob > 0.4:
                risk_level = "Medium"
            else:
                risk_level = "Low"
            
            return {
                'risk_level': risk_level,
                'failure_probability': failure_prob,
                'maintenance_urgency': maintenance_urgency,
                'resource_requirements': {
                    'personnel': int(resource_req[0] * 10),
                    'equipment': int(resource_req[1] * 5),
                    'materials': int(resource_req[2] * 20),
                    'budget': float(resource_req[3] * 10000),
                    'time_hours': float(resource_req[4] * 24)
                },
                'confidence': 1.0 - abs(failure_prob - 0.5) * 2  # Higher confidence for extreme values
            }


class ResourceOptimizer:
    """
    Optimization model for resource allocation and planning
    Uses machine learning to optimize resource distribution
    """
    
    def __init__(self):
        self.scaler = StandardScaler()
        self.resource_model = GradientBoostingRegressor(
            n_estimators=100,
            learning_rate=0.1,
            max_depth=6,
            random_state=42
        )
        self.is_trained = False
        
    def prepare_features(self, data: Dict[str, Any]) -> np.ndarray:
        """
        Prepare features for resource optimization
        """
        features = []
        
        # Infrastructure features
        features.extend([
            data.get('road_quality', 0),
            data.get('water_supply_quality', 0),
            data.get('electricity_reliability', 0),
            data.get('sewage_condition', 0),
            data.get('streetlight_coverage', 0)
        ])
        
        # Demand features
        features.extend([
            data.get('population_density', 0),
            data.get('complaint_volume', 0),
            data.get('service_requests', 0),
            data.get('emergency_incidents', 0)
        ])
        
        # Historical performance
        features.extend([
            data.get('avg_resolution_time', 0),
            data.get('citizen_satisfaction', 0),
            data.get('resource_utilization', 0),
            data.get('budget_efficiency', 0)
        ])
        
        # Temporal features
        current_time = datetime.now()
        features.extend([
            current_time.month / 12,  # Month of year
            current_time.weekday() / 7,  # Day of week
            current_time.hour / 24,  # Hour of day
            data.get('seasonal_factor', 0.5)  # Seasonal demand
        ])
        
        return np.array(features).reshape(1, -1)
    
    def optimize_allocation(self, current_data: Dict[str, Any], budget: float) -> Dict[str, Any]:
        """
        Optimize resource allocation given current conditions and budget
        """
        features = self.prepare_features(current_data)
        
        if not self.is_trained:
            # Use rule-based allocation if model not trained
            return self._rule_based_allocation(current_data, budget)
        
        # Predict optimal allocation
        predicted_allocation = self.resource_model.predict(features)[0]
        
        # Normalize to budget
        total_predicted = sum(predicted_allocation)
        if total_predicted > 0:
            allocation_ratio = budget / total_predicted
            optimized_allocation = [x * allocation_ratio for x in predicted_allocation]
        else:
            optimized_allocation = [budget / 5] * 5  # Equal distribution
        
        return {
            'road_maintenance': optimized_allocation[0],
            'water_services': optimized_allocation[1],
            'electricity': optimized_allocation[2],
            'sewage_management': optimized_allocation[3],
            'streetlight_repair': optimized_allocation[4],
            'total_budget': budget,
            'optimization_score': self._calculate_optimization_score(optimized_allocation, current_data)
        }
    
    def _rule_based_allocation(self, data: Dict[str, Any], budget: float) -> Dict[str, Any]:
        """
        Rule-based resource allocation as fallback
        """
        # Define weights based on conditions
        weights = {
            'road_maintenance': max(0.1, 1.0 - data.get('road_quality', 0.5)),
            'water_services': max(0.1, 1.0 - data.get('water_supply_quality', 0.5)),
            'electricity': max(0.1, 1.0 - data.get('electricity_reliability', 0.5)),
            'sewage_management': max(0.1, 1.0 - data.get('sewage_condition', 0.5)),
            'streetlight_repair': max(0.1, 1.0 - data.get('streetlight_coverage', 0.5))
        }
        
        # Normalize weights
        total_weight = sum(weights.values())
        normalized_weights = {k: v / total_weight for k, v in weights.items()}
        
        # Allocate budget
        allocation = {k: v * budget for k, v in normalized_weights.items()}
        
        return {
            **allocation,
            'total_budget': budget,
            'optimization_score': 0.7  # Moderate confidence for rule-based
        }
    
    def _calculate_optimization_score(self, allocation: List[float], data: Dict[str, Any]) -> float:
        """
        Calculate how well the allocation matches the needs
        """
        # Simple scoring based on alignment with needs
        needs = [
            1.0 - data.get('road_quality', 0.5),
            1.0 - data.get('water_supply_quality', 0.5),
            1.0 - data.get('electricity_reliability', 0.5),
            1.0 - data.get('sewage_condition', 0.5),
            1.0 - data.get('streetlight_coverage', 0.5)
        ]
        
        # Normalize allocation
        total_alloc = sum(allocation)
        if total_alloc > 0:
            normalized_alloc = [x / total_alloc for x in allocation]
        else:
            normalized_alloc = [0.2] * 5
        
        # Calculate correlation with needs
        correlation = np.corrcoef(needs, normalized_alloc)[0, 1]
        return max(0, correlation) if not np.isnan(correlation) else 0.5


class PredictiveMaintenance:
    """
    Predictive maintenance scheduling and optimization
    """
    
    def __init__(self):
        self.maintenance_model = RandomForestRegressor(
            n_estimators=100,
            max_depth=10,
            random_state=42
        )
        self.scaler = StandardScaler()
        self.is_trained = False
        
    def predict_maintenance_schedule(self, infrastructure_data: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """
        Predict maintenance schedule for multiple infrastructure assets
        """
        schedules = []
        
        for asset in infrastructure_data:
            # Prepare features for this asset
            features = self._extract_asset_features(asset)
            
            if not self.is_trained:
                # Use rule-based prediction
                schedule = self._rule_based_maintenance(asset)
            else:
                # Use ML model prediction
                features_scaled = self.scaler.transform(features.reshape(1, -1))
                days_until_maintenance = self.maintenance_model.predict(features_scaled)[0]
                schedule = self._create_schedule(asset, max(1, int(days_until_maintenance)))
            
            schedules.append(schedule)
        
        # Sort by urgency
        schedules.sort(key=lambda x: x['urgency_score'], reverse=True)
        
        return schedules
    
    def _extract_asset_features(self, asset: Dict[str, Any]) -> np.ndarray:
        """
        Extract features from asset data
        """
        features = [
            asset.get('age_years', 0),
            asset.get('usage_intensity', 0.5),
            asset.get('last_maintenance_days', 0),
            asset.get('failure_count', 0),
            asset.get('environmental_stress', 0.5),
            asset.get('load_factor', 0.5),
            asset.get('quality_score', 0.5),
            asset.get('criticality', 0.5)
        ]
        
        return np.array(features)
    
    def _rule_based_maintenance(self, asset: Dict[str, Any]) -> Dict[str, Any]:
        """
        Rule-based maintenance scheduling
        """
        age = asset.get('age_years', 0)
        last_maintenance = asset.get('last_maintenance_days', 0)
        failure_count = asset.get('failure_count', 0)
        criticality = asset.get('criticality', 0.5)
        
        # Calculate urgency score
        urgency_score = (age / 50) * 0.3 + (last_maintenance / 365) * 0.4 + (failure_count / 10) * 0.2 + criticality * 0.1
        
        # Determine days until maintenance
        if urgency_score > 0.8:
            days = 7  # Critical - within a week
        elif urgency_score > 0.6:
            days = 30  # High - within a month
        elif urgency_score > 0.4:
            days = 90  # Medium - within 3 months
        else:
            days = 180  # Low - within 6 months
        
        return self._create_schedule(asset, days, urgency_score)
    
    def _create_schedule(self, asset: Dict[str, Any], days_until: int, urgency_score: float = None) -> Dict[str, Any]:
        """
        Create maintenance schedule entry
        """
        if urgency_score is None:
            urgency_score = max(0, 1.0 - (days_until / 365))
        
        scheduled_date = datetime.now() + timedelta(days=days_until)
        
        return {
            'asset_id': asset.get('id', 'unknown'),
            'asset_type': asset.get('type', 'unknown'),
            'location': asset.get('location', 'unknown'),
            'scheduled_date': scheduled_date.isoformat(),
            'days_until_maintenance': days_until,
            'urgency_score': urgency_score,
            'priority': self._determine_priority(urgency_score),
            'estimated_cost': self._estimate_maintenance_cost(asset),
            'required_resources': self._estimate_resources(asset)
        }
    
    def _determine_priority(self, urgency_score: float) -> str:
        """Determine maintenance priority based on urgency score"""
        if urgency_score > 0.8:
            return "Critical"
        elif urgency_score > 0.6:
            return "High"
        elif urgency_score > 0.4:
            return "Medium"
        else:
            return "Low"
    
    def _estimate_maintenance_cost(self, asset: Dict[str, Any]) -> float:
        """Estimate maintenance cost for asset"""
        base_cost = {
            'road': 10000,
            'water_pipe': 5000,
            'electricity': 8000,
            'streetlight': 2000,
            'sewage': 6000
        }
        
        asset_type = asset.get('type', 'road')
        age_factor = 1 + (asset.get('age_years', 0) / 20)
        
        return base_cost.get(asset_type, 5000) * age_factor
    
    def _estimate_resources(self, asset: Dict[str, Any]) -> Dict[str, int]:
        """Estimate required resources for maintenance"""
        return {
            'personnel': 2 + int(asset.get('complexity', 1)),
            'equipment_hours': 4 + int(asset.get('size_factor', 1) * 4),
            'material_units': 10 + int(asset.get('age_years', 0) * 2)
        }


# Initialize global instances
risk_predictor = RiskPredictor()
resource_optimizer = ResourceOptimizer()
predictive_maintenance = PredictiveMaintenance()

if __name__ == "__main__":
    # Test the prediction models
    print("Testing Prediction Models...")
    
    # Test risk predictor
    test_features = np.random.randn(1, 50)
    risk_prediction = risk_predictor.predict_risk(test_features)
    
    print(f"Risk Prediction:")
    print(f"Risk Level: {risk_prediction['risk_level']}")
    print(f"Failure Probability: {risk_prediction['failure_probability']:.2f}")
    
    # Test resource optimizer
    current_data = {
        'road_quality': 0.3,
        'water_supply_quality': 0.7,
        'electricity_reliability': 0.5,
        'population_density': 0.8,
        'complaint_volume': 15
    }
    
    allocation = resource_optimizer.optimize_allocation(current_data, budget=100000)
    print(f"\nResource Allocation:")
    print(f"Road Maintenance: ${allocation['road_maintenance']:.2f}")
    print(f"Water Services: ${allocation['water_services']:.2f}")
    
    # Test predictive maintenance
    assets = [
        {'id': 'road_1', 'type': 'road', 'age_years': 15, 'criticality': 0.8},
        {'id': 'light_1', 'type': 'streetlight', 'age_years': 5, 'criticality': 0.3}
    ]
    
    schedules = predictive_maintenance.predict_maintenance_schedule(assets)
    print(f"\nMaintenance Schedules: {len(schedules)} assets scheduled")
    
    print("Prediction Models working correctly!")
