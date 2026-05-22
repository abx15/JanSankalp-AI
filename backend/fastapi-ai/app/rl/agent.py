import numpy as np
import os
import pickle
import logging

logger = logging.getLogger("ai-engine")

class QLearningAgent:
    def __init__(self, state_dim: int, action_dim: int, learning_rate=0.1, discount_factor=0.9, epsilon=0.1):
        self.state_dim = state_dim
        self.action_dim = action_dim
        self.lr = learning_rate
        self.gamma = discount_factor
        self.epsilon = epsilon
        self.q_table = {} # Using a dict for sparse state space
        self.model_path = "models/rl_policy.pkl"
        self._load_policy()

    def _get_state_key(self, state: np.ndarray) -> tuple:
        # Discretize state for tabular Q-learning
        return tuple(np.round(state, 1))

    def get_action(self, state: np.ndarray) -> int:
        state_key = self._get_state_key(state)
        
        # Exploration
        if np.random.rand() < self.epsilon:
            return np.random.randint(self.action_dim)
        
        # Exploitation
        if state_key not in self.q_table:
            return np.random.randint(self.action_dim)
            
        return np.argmax(self.q_table[state_key])

    def update(self, state: np.ndarray, action: int, reward: float, next_state: np.ndarray):
        state_key = self._get_state_key(state)
        next_state_key = self._get_state_key(next_state)
        
        if state_key not in self.q_table:
            self.q_table[state_key] = np.zeros(self.action_dim)
        if next_state_key not in self.q_table:
            self.q_table[next_state_key] = np.zeros(self.action_dim)
            
        # Q-Learning update rule
        best_next_action = np.argmax(self.q_table[next_state_key])
        td_target = reward + self.gamma * self.q_table[next_state_key][best_next_action]
        td_error = td_target - self.q_table[state_key][action]
        self.q_table[state_key][action] += self.lr * td_error

    def save_policy(self):
        os.makedirs(os.path.dirname(self.model_path), exist_ok=True)
        with open(self.model_path, "wb") as f:
            pickle.dump(self.q_table, f)
        logger.info("RL Policy saved.")

    def _load_policy(self):
        if os.path.exists(self.model_path):
            try:
                with open(self.model_path, "rb") as f:
                    self.q_table = pickle.load(f)
                logger.info("RL Policy loaded.")
            except Exception as e:
                logger.error(f"Failed to load RL Policy: {e}")

rl_agent = QLearningAgent(state_dim=5, action_dim=5)
