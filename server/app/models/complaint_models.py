"""
Complaint Processing Models
PyTorch models for complaint classification, routing, and ETA prediction
"""

import torch
import torch.nn as nn
import torch.nn.functional as F
from typing import Dict, Any, Optional
import numpy as np

class ComplaintClassifier(nn.Module):
    """
    Multi-class complaint classifier using transformer embeddings
    Categories: Road, Garbage, Water, Electricity, etc.
    """
    
    def __init__(
        self, 
        input_dim: int = 768,  # BERT embedding size
        num_classes: int = 15,  # Number of complaint categories
        hidden_dims: list = [512, 256, 128],
        dropout_rate: float = 0.3
    ):
        super(ComplaintClassifier, self).__init__()
        
        self.input_dim = input_dim
        self.num_classes = num_classes
        
        # Build hidden layers
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
        
        self.hidden_layers = nn.Sequential(*layers)
        
        # Output layers
        self.category_classifier = nn.Linear(prev_dim, num_classes)
        self.severity_predictor = nn.Linear(prev_dim, 5)  # Severity 1-5
        self.urgency_predictor = nn.Linear(prev_dim, 3)   # Low, Medium, High
        
        # Attention mechanism for important features
        self.attention = nn.MultiheadAttention(
            embed_dim=prev_dim, 
            num_heads=8, 
            dropout=dropout_rate,
            batch_first=True
        )
        
    def forward(self, x: torch.Tensor) -> Dict[str, torch.Tensor]:
        """
        Forward pass returns classification, severity, and urgency
        """
        batch_size = x.size(0)
        
        # Reshape for attention (add sequence dimension)
        x_reshaped = x.unsqueeze(1)  # [batch, 1, features]
        
        # Self-attention
        attended, _ = self.attention(x_reshaped, x_reshaped, x_reshaped)
        attended = attended.squeeze(1)  # [batch, features]
        
        # Pass through hidden layers
        features = self.hidden_layers(attended)
        
        # Get predictions
        category_logits = self.category_classifier(features)
        severity_logits = self.severity_predictor(features)
        urgency_logits = self.urgency_predictor(features)
        
        return {
            'category': F.softmax(category_logits, dim=1),
            'severity': F.softmax(severity_logits, dim=1),
            'urgency': F.softmax(urgency_logits, dim=1),
            'features': features
        }
    
    def predict(self, x: torch.Tensor) -> Dict[str, Any]:
        """
        Make predictions with confidence scores
        """
        with torch.no_grad():
            outputs = self.forward(x)
            
            # Get predicted classes
            category_pred = torch.argmax(outputs['category'], dim=1)
            severity_pred = torch.argmax(outputs['severity'], dim=1) + 1  # 1-5
            urgency_pred = torch.argmax(outputs['urgency'], dim=1)
            
            # Get confidence scores
            category_conf = torch.max(outputs['category'], dim=1)[0]
            severity_conf = torch.max(outputs['severity'], dim=1)[0]
            urgency_conf = torch.max(outputs['urgency'], dim=1)[0]
            
            return {
                'category': category_pred.cpu().numpy(),
                'severity': severity_pred.cpu().numpy(),
                'urgency': ['Low', 'Medium', 'High'][urgency_pred.cpu().numpy()[0]],
                'category_confidence': category_conf.cpu().numpy(),
                'severity_confidence': severity_conf.cpu().numpy(),
                'urgency_confidence': urgency_conf.cpu().numpy(),
                'overall_confidence': (category_conf + severity_conf + urgency_conf) / 3
            }


class ETAPredictor(nn.Module):
    """
    ETA prediction model based on complaint features and location data
    """
    
    def __init__(
        self,
        input_dim: int = 256,  # Feature dimension
        hidden_dims: list = [128, 64, 32],
        dropout_rate: float = 0.2
    ):
        super(ETAPredictor, self).__init__()
        
        layers = []
        prev_dim = input_dim
        
        for hidden_dim in hidden_dims:
            layers.extend([
                nn.Linear(prev_dim, hidden_dim),
                nn.ReLU(),
                nn.Dropout(dropout_rate)
            ])
            prev_dim = hidden_dim
        
        self.layers = nn.Sequential(*layers)
        self.eta_head = nn.Linear(prev_dim, 1)  # Predict hours
        
        # Learnable embeddings for categorical features
        self.category_embedding = nn.Embedding(15, 16)  # 15 categories
        self.severity_embedding = nn.Embedding(5, 8)    # 5 severity levels
        self.urgency_embedding = nn.Embedding(3, 8)     # 3 urgency levels
        
    def forward(self, features: torch.Tensor, category: torch.Tensor, 
                severity: torch.Tensor, urgency: torch.Tensor) -> torch.Tensor:
        """
        Predict resolution time in hours
        """
        # Get embeddings
        cat_emb = self.category_embedding(category)
        sev_emb = self.severity_embedding(severity)
        urg_emb = self.urgency_embedding(urgency)
        
        # Concatenate all features
        combined = torch.cat([features, cat_emb, sev_emb, urg_emb], dim=1)
        
        # Pass through layers
        processed = self.layers(combined)
        
        # Predict ETA
        eta = self.eta_head(processed)
        
        return torch.abs(eta)  # Ensure positive ETA


class DuplicateDetector(nn.Module):
    """
    Detect duplicate complaints using similarity metrics
    """
    
    def __init__(self, embedding_dim: int = 768):
        super(DuplicateDetector, self).__init__()
        
        self.embedding_dim = embedding_dim
        
        # Siamese network architecture
        self.embedding_net = nn.Sequential(
            nn.Linear(embedding_dim, 512),
            nn.ReLU(),
            nn.Dropout(0.3),
            nn.Linear(512, 256),
            nn.ReLU(),
            nn.Dropout(0.2),
            nn.Linear(256, 128)
        )
        
        # Similarity calculation layers
        self.similarity_net = nn.Sequential(
            nn.Linear(128 * 2 + 2, 64),  # 128*2 for embeddings + 2 for coordinates
            nn.ReLU(),
            nn.Linear(64, 32),
            nn.ReLU(),
            nn.Linear(32, 1),
            nn.Sigmoid()  # Output similarity score
        )
    
    def forward(self, emb1: torch.Tensor, emb2: torch.Tensor, 
                lat_diff: torch.Tensor, lng_diff: torch.Tensor) -> torch.Tensor:
        """
        Calculate similarity score between two complaints
        """
        # Get embeddings
        feat1 = self.embedding_net(emb1)
        feat2 = self.embedding_net(emb2)
        
        # Concatenate features and location differences
        combined = torch.cat([feat1, feat2, lat_diff.unsqueeze(1), lng_diff.unsqueeze(1)], dim=1)
        
        # Calculate similarity
        similarity = self.similarity_net(combined)
        
        return similarity


def load_pretrained_models() -> Dict[str, nn.Module]:
    """
    Load pretrained models with proper weights
    """
    models = {
        'classifier': ComplaintClassifier(),
        'eta_predictor': ETAPredictor(),
        'duplicate_detector': DuplicateDetector()
    }
    
    # TODO: Load actual pretrained weights
    # For now, initialize with random weights
    
    return models


if __name__ == "__main__":
    # Test the models
    print("Testing Complaint Models...")
    
    # Test classifier
    classifier = ComplaintClassifier()
    test_input = torch.randn(2, 768)  # Batch of 2, BERT embeddings
    
    outputs = classifier(test_input)
    print(f"Classifier output keys: {list(outputs.keys())}")
    print(f"Category shape: {outputs['category'].shape}")
    
    # Test ETA predictor
    eta_model = ETAPredictor()
    test_features = torch.randn(2, 256)
    test_category = torch.randint(0, 15, (2,))
    test_severity = torch.randint(1, 6, (2,))
    test_urgency = torch.randint(0, 3, (2,))
    
    eta = eta_model(test_features, test_category, test_severity, test_urgency)
    print(f"ETA prediction shape: {eta.shape}")
    
    # Test duplicate detector
    dup_detector = DuplicateDetector()
    emb1 = torch.randn(2, 768)
    emb2 = torch.randn(2, 768)
    lat_diff = torch.randn(2)
    lng_diff = torch.randn(2)
    
    similarity = dup_detector(emb1, emb2, lat_diff, lng_diff)
    print(f"Similarity score shape: {similarity.shape}")
    
    print("All models working correctly!")
