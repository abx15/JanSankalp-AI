from app.rl import rl_agent, env
import logging

logger = logging.getLogger("ai-engine")

async def process_resolution_feedback(event_data: dict):
    """
    Called when a 'complaint_resolved' event is received.
    Updates the RL agent with the reward from the outcome.
    """
    try:
        # Extract original state and action from metadata stored in DB (sent in event)
        state_data = event_data.get("original_state")
        action_taken = event_data.get("action_taken")
        
        if not state_data or action_taken is None:
            return

        # Prepare outcome for reward calculation
        outcome = {
            "resolution_days": event_data.get("resolution_days"),
            "was_overridden": event_data.get("was_overridden", False),
            "duplicate_detection_correct": event_data.get("duplicate_detection_correct", True)
        }
        
        # Calculate Reward
        reward = env.calculate_reward(action_taken, outcome)
        
        # Current state and 'next state' (simplified for one-step task or next random state)
        state = env.get_state_vector(**state_data)
        
        # In this simple model, we update the agent immediately
        # next_state is dummy as we treat this as episodic tasks
        rl_agent.update(state, action_taken, reward, state)
        
        logger.info(f"RL Agent updated for Ticket {event_data.get('ticketId')} with reward {reward}")
        
        # Periodically save the policy
        rl_agent.save_policy()
        
    except Exception as e:
        logger.error(f"Error processing RL feedback: {e}")
