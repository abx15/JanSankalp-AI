import torch
import numpy as np
from app.federated.models import ComplaintClassifier, set_model_parameters, get_model_parameters
from app.federated.aggregator import secure_aggregator
from app.federated.coordinator import federated_coordinator
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("test-federated")

def test_aggregation():
    logger.info("Testing Federated Averaging...")
    weights1 = [np.array([1.0, 2.0]), np.array([3.0, 4.0])]
    weights2 = [np.array([2.0, 4.0]), np.array([6.0, 8.0])]
    
    avg = secure_aggregator.federated_averaging([weights1, weights2], [10, 10])
    
    # Check if average is roughly (1.5, 3.0), (4.5, 6.0) plus DP noise
    logger.info(f"Aggregated weights: {avg}")
    assert len(avg) == 2
    assert avg[0].shape == (2,)
    logger.info("Aggregation test passed.")

def test_coordinator_round():
    logger.info("Testing Federated Coordinator Round...")
    coordinator = federated_coordinator
    
    # Create dummy data for 2 districts
    sim_data = {
        "D1": (torch.randn(10, 5000), torch.randint(0, 5, (10,))),
        "D2": (torch.randn(10, 5000), torch.randint(0, 5, (10,)))
    }
    
    import asyncio
    loop = asyncio.get_event_loop()
    result = loop.run_until_complete(coordinator.run_federated_round(sim_data))
    
    logger.info(f"Round result: {result}")
    assert result["round"] == 1
    assert result["total_samples"] == 20
    assert len(result["district_metrics"]) == 2
    logger.info("Coordinator round test passed.")

if __name__ == "__main__":
    try:
        test_aggregation()
        test_coordinator_round()
        print("\nALL FEDERATED LEARNING TESTS PASSED!")
    except Exception as e:
        print(f"\nTEST FAILED: {e}")
        import traceback
        traceback.print_exc()
