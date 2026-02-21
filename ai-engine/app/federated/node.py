import torch
import torch.optim as optim
import torch.nn as nn
from app.federated.models import ComplaintClassifier, ETAPredictor, get_model_parameters, set_model_parameters
import numpy as np

class DistrictNode:
    def __init__(self, district_id):
        self.district_id = district_id
        self.classifier = ComplaintClassifier()
        self.eta_predictor = ETAPredictor()

    def train_local(self, data, labels, epochs=5):
        """Simulate local training on district data"""
        optimizer = optim.Adam(self.classifier.parameters(), lr=0.001)
        criterion = nn.CrossEntropyLoss()
        
        self.classifier.train()
        for epoch in range(epochs):
            optimizer.zero_grad()
            outputs = self.classifier(data)
            loss = criterion(outputs, labels)
            loss.backward()
            optimizer.step()
            
        return get_model_parameters(self.classifier), len(data)

    def get_performance_metrics(self, test_data, test_labels):
        """Evaluate local model performance"""
        self.classifier.eval()
        with torch.no_grad():
            outputs = self.classifier(test_data)
            _, predicted = torch.max(outputs.data, 1)
            accuracy = (predicted == test_labels).sum().item() / len(test_labels)
        
        return {
            "district_id": self.district_id,
            "accuracy": accuracy,
            "sample_size": len(test_data)
        }

    def update_model(self, global_parameters):
        set_model_parameters(self.classifier, global_parameters)
