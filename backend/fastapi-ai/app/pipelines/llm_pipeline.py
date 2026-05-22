"""
LLM Pipeline — Autonomous Multi-Agent Orchestration Architecture

This module has been modernized to leverage the new multi-agent architecture.
It routes incoming requests directly to the CoordinatorAgent, which orchestates the
spam detection, classification, duplicate check (with RAG semantic vector fallback),
routing, and compliance forecasting agents.
"""

import logging
from app.schemas import (
    ClassifyResponse,
    AIProcessWorkflowRequest,
    AIProcessWorkflowResponse,
)
from app.agents.coordinator_agent import coordinator_agent

logger = logging.getLogger("ai-engine.pipeline")

class LLMPipeline:
    """
    Modernized LLM Pipeline executing autonomous, multi-agent workflows.
    Delegates all execution steps to the CoordinatorAgent.
    """

    async def run_workflow(self, request: AIProcessWorkflowRequest) -> AIProcessWorkflowResponse:
        logger.info(f"[Pipeline] Routing complaint {request.complaint_id} through Coordinator Agent...")
        try:
            response = await coordinator_agent.run(request)
            logger.info(f"[Pipeline] Multi-agent orchestration complete for complaint {request.complaint_id}.")
            return response
        except Exception as e:
            logger.error(f"[Pipeline] Error in Multi-Agent Pipeline: {e}", exc_info=True)
            # Resilient fallback response
            return AIProcessWorkflowResponse(
                status="PROCESSED_FALLBACK",
                analysis=ClassifyResponse(
                    category="Others",
                    severity="Medium",
                    confidence=0.5,
                    reasoning=f"Pipeline fallback triggered due to exception: {str(e)}"
                ),
                is_duplicate=False,
                is_spam=False,
                assigned_department="Others",
                assigned_officer="officer_9",
                eta_days=3.0
            )

# Singleton pipeline instance for routes_ai.py compatibility
llm_pipeline = LLMPipeline()
