import numpy as np
from typing import Dict, List, Any, Tuple

class ComplaintResolutionEnv:
    def __init__(self):
        # State: [Category_Idx, Severity_Idx, Workload_Idx, Lat, Lon]
        # Actions: [Assign_Officer_0, Assign_Officer_1, Assign_Officer_2, Escalate, Merge]
        self.state_dim = 5
        self.action_dim = 5
        self.categories = ["Roads", "Water", "Electricity", "Sanitation", "Traffic", "Others"]
        self.severities = ["Low", "Medium", "High", "Critical"]
        
    def get_state_vector(self, category: str, severity: str, workload: float, lat: float, lon: float) -> np.ndarray:
        cat_idx = self.categories.index(category) if category in self.categories else 5
        sev_idx = self.severities.index(severity) if severity in self.severities else 1
        return np.array([cat_idx, sev_idx, workload, lat, lon], dtype=np.float32)

    def calculate_reward(self, action: int, outcome: Dict[str, Any]) -> float:
        reward = 0.0
        
        # 1. Resolution Speed Reward (Faster is better)
        # Assuming outcome['resolution_days'] is provided
        days = outcome.get('resolution_days', 10)
        if days < 2: reward += 10.0
        elif days < 5: reward += 5.0
        else: reward -= 5.0

        # 2. Correctness/Override Penalty
        if outcome.get('was_overridden'):
            reward -= 20.0
        else:
            reward += 10.0

        # 3. Duplicate Accuracy
        if outcome.get('duplicate_detection_correct'):
            reward += 5.0

        return reward
