import numpy as np
import logging
from app.rl import rl_agent, env

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("rl-training")

def run_simulation(episodes=1000):
    logger.info(f"Starting RL training simulation for {episodes} episodes...")
    
    total_rewards = []
    
    for e in range(episodes):
        # 1. Generate random state
        category = np.random.choice(env.categories)
        severity = np.random.choice(env.severities)
        workload = np.random.uniform(0, 1)
        lat, lon = 28.6, 77.2 # Dummy Delhi coords
        
        state = env.get_state_vector(category, severity, workload, lat, lon)
        
        # 2. Get action from agent
        action = rl_agent.get_action(state)
        
        # 3. Simulate outcome (Simplified)
        # In a real environment, this would come from historical resolution data
        # Action 0, 1, 2 are assignments. action 3 is escalate, 4 is merge.
        is_correct_action = (action == 0 and category == "Roads") or \
                           (action == 1 and category == "Water") or \
                           (action == 2 and category == "Sanitation")
                           
        outcome = {
            'resolution_days': np.random.randint(1, 4) if is_correct_action else np.random.randint(5, 15),
            'was_overridden': not is_correct_action and np.random.rand() > 0.8,
            'duplicate_detection_correct': True
        }
        
        # 4. Calculate reward
        reward = env.calculate_reward(action, outcome)
        
        # 5. Update agent
        # For simplicity in this env, next_state is new complaint state
        next_state = env.get_state_vector(
            np.random.choice(env.categories),
            np.random.choice(env.severities),
            np.random.uniform(0, 1),
            28.6, 77.2
        )
        
        rl_agent.update(state, action, reward, next_state)
        total_rewards.append(reward)
        
        if e % 100 == 0:
            avg_reward = np.mean(total_rewards[-100:])
            logger.info(f"Episode {e} | Avg Reward (last 100): {avg_reward:.2f} | Epsilon: {rl_agent.epsilon:.2f}")

    rl_agent.save_policy()
    logger.info("Training complete.")

if __name__ == "__main__":
    run_simulation()
