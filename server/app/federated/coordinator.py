import os
import torch
import logging
from typing import List, Dict
import numpy as np
from app.federated.models import ComplaintClassifier, ETAPredictor, get_model_parameters, set_model_parameters
from app.federated.aggregator import secure_aggregator
from app.federated.node import DistrictNode

logger = logging.getLogger("ai-engine")

class FederatedCoordinator:
    def __init__(self):
        self.global_classifier = ComplaintClassifier()
        self.global_eta_predictor = ETAPredictor()
        self.nodes: Dict[str, DistrictNode] = {}
        self.history = []
        self.current_round = 0

    def register_node(self, district_id: str):
        if district_id not in self.nodes:
            self.nodes[district_id] = DistrictNode(district_id)
            logger.info(f"Registered district node: {district_id}")

    async def run_federated_round(self, simulated_data: Dict[str, tuple]):
        """
        Run one round of Federated Learning.
        simulated_data: {district_id: (data_tensor, label_tensor)}
        """
        self.current_round += 1
        logger.info(f"Starting Federated Round {self.current_round}")
        
        district_weights = []
        sample_sizes = []
        round_metrics = []

        for district_id, (data, labels) in simulated_data.items():
            node = self.nodes.get(district_id)
            if not node:
                self.register_node(district_id)
                node = self.nodes[district_id]
            
            # 1. Sync global model to node
            node.update_model(get_model_parameters(self.global_classifier))
            
            # 2. Local training
            weights, size = node.train_local(data, labels)
            district_weights.append(weights)
            sample_sizes.append(size)
            
            # 3. Evaluate
            metrics = node.get_performance_metrics(data, labels)
            round_metrics.append(metrics)

        # 4. Secure Aggregation
        aggregated_weights = secure_aggregator.federated_averaging(district_weights, sample_sizes)
        
        # 5. Update global model
        set_model_parameters(self.global_classifier, aggregated_weights)
        
        # 6. Save round history
        round_summary = {
            "round": self.current_round,
            "avg_accuracy": np.mean([m["accuracy"] for m in round_metrics]),
            "district_metrics": round_metrics,
            "total_samples": sum(sample_sizes)
        }
        self.history.append(round_summary)
        logger.info(f"Round {self.current_round} complete. Avg Accuracy: {round_summary['avg_accuracy']:.4f}")
        
        return round_summary

    def get_latest_metrics(self):
        if not self.history:
            return None
        return self.history[-1]

federated_coordinator = FederatedCoordinator()
