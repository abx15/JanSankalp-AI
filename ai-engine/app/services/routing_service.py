from typing import Dict, List, Optional
from app.rl import rl_agent, env
import numpy as np

# ... (DEPARTMENTS and other mocks remain the same)

class RoutingService:
    async def route_complaint(self, category: str, severity: str, lat: float = 0, lon: float = 0) -> RouteResponse:
        # 1. Prepare RL state
        # In production, workload would be fetched from DB
        workload = 0.5 
        state = env.get_state_vector(category, severity, workload, lat, lon)
        
        # 2. Get AI Recommended Action
        action = rl_agent.get_action(state)
        
        # 3. Map action to routing decision
        officers = DEPARTMENTS.get(category, DEPARTMENTS["Others"])
        
        # Action 0, 1, 2 map to officer selection
        if action < 3:
            selected_idx = action % len(officers)
            selected_officer = officers[selected_idx]
        else:
            # Fallback to least workload if RL suggests escalation/merge but we need an officer
            selected_officer = min(officers, key=lambda x: officer_workload.get(x, 0))

        # Action 3 suggests potential escalation
        priority = "Normal"
        if action == 3 or severity == "Critical":
            priority = "Urgent"
        elif severity == "High":
            priority = "High"
        elif severity == "Low":
            priority = "Low"

        return RouteResponse(
            department=category,
            officer_id=selected_officer,
            priority=priority
        )

routing_service = RoutingService()
