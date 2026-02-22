import numpy as np
import torch
import logging

logger = logging.getLogger("ai-engine")

class SecureAggregator:
    def __init__(self, dp_epsilon=0.1, dp_delta=1e-5):
        self.dp_epsilon = dp_epsilon
        self.dp_delta = dp_delta

    def federated_averaging(self, district_weights, sample_sizes):
        """Standard FedAvg implementation"""
        if not district_weights:
            return None
        
        total_samples = sum(sample_sizes)
        # Weighted average of weights
        avg_weights = []
        for i in range(len(district_weights[0])):
            layer_avg = np.zeros_like(district_weights[0][i])
            for dw, size in zip(district_weights, sample_sizes):
                layer_avg += dw[i] * (size / total_samples)
            
            # Apply Differential Privacy (Laplacian Noise)
            noise = np.random.laplace(0, self.dp_epsilon, layer_avg.shape)
            layer_avg += noise
            
            avg_weights.append(layer_avg)
            
        return avg_weights

    def check_drift(self, global_weights, local_weights, threshold=0.5):
        """Detect if a district's model is drifting significantly from the global model"""
        drifts = []
        for gw, lw in zip(global_weights, local_weights):
            dist = np.linalg.norm(gw - lw)
            drifts.append(dist)
        
        avg_drift = np.mean(drifts)
        return avg_drift > threshold, avg_drift

secure_aggregator = SecureAggregator()
