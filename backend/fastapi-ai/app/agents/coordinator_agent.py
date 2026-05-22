from app.agents.spam_agent import spam_agent
from app.agents.classification_agent import classification_agent
from app.agents.duplicate_rag_agent import duplicate_rag_agent
from app.agents.routing_agent import routing_agent
from app.agents.eta_policy_agent import eta_policy_agent

from app.schemas import (
    ClassifyResponse,
    AIProcessWorkflowRequest,
    AIProcessWorkflowResponse,
)
import logging
from typing import Dict, Any, Optional

logger = logging.getLogger("ai-engine.agents.coordinator")

class CoordinatorAgent:
    """
    Central Orchestrator of the JanSankalp Multi-Agent RAG System.
    Coordinates specialized agents sequentially, aggregates decisions, 
    compiles audit reports, and provides fallback orchestration.
    """

    async def run(self, request: AIProcessWorkflowRequest) -> AIProcessWorkflowResponse:
        logger.info(f"[Coordinator] Orchestrating Multi-Agent flow for Complaint ID: {request.complaint_id}")
        
        # 1. Autonomous Spam & Validity Agent Check
        logger.info("[Coordinator] Dispatching to Spam Agent...")
        spam_result = await spam_agent.run(request.text)
        
        if spam_result.is_spam:
            logger.info(f"[Coordinator] Spam Agent flagged complaint {request.complaint_id} as Spam. Halting flow.")
            return AIProcessWorkflowResponse(
                status="REJECTED_SPAM",
                analysis=ClassifyResponse(
                    category="Others",
                    severity="Low",
                    confidence=spam_result.spam_score,
                    reasoning=f"SPAM REJECTION: {spam_result.reasoning}",
                ),
                is_duplicate=False,
                is_spam=True,
                assigned_department=None,
                assigned_officer=None,
                eta_days=0.0
            )

        # 2. Autonomous Classification & Severity Triage Agent
        logger.info("[Coordinator] Dispatching to Classification Agent...")
        classify_result = await classification_agent.run(request.text)
        
        # 3. Autonomous Semantic Check & Duplicate RAG Agent
        logger.info("[Coordinator] Dispatching to Duplicate RAG Agent...")
        dup_result = await duplicate_rag_agent.run(
            text=request.text, 
            lat=request.latitude, 
            lon=request.longitude, 
            complaint_id=request.complaint_id
        )

        # 4. Autonomous Routing Agent (skip routing if duplicate, or assign standard officer)
        assigned_department = None
        assigned_officer = None
        
        if dup_result.is_duplicate:
            logger.info(f"[Coordinator] Duplicate RAG Agent flagged complaint {request.complaint_id} as DUPLICATE of {dup_result.cluster_id}.")
            status = "PROCESSED_DUPLICATE"
        else:
            logger.info("[Coordinator] Unique complaint confirmed. Dispatching to Routing Agent...")
            routing_result = await routing_agent.run(
                category=classify_result.category,
                severity=classify_result.severity,
                text=request.text,
                lat=request.latitude,
                lon=request.longitude
            )
            assigned_department = routing_result.department
            assigned_officer = routing_result.officer_id
            status = "PROCESSED"

        # 5. Autonomous ETA & Governance Policy Agent
        logger.info("[Coordinator] Dispatching to ETA & Policy Agent...")
        eta_policy = await eta_policy_agent.run(
            category=classify_result.category,
            severity=classify_result.severity,
            density=0.5 # Normalizing local issues density
        )
        
        eta_days = float(eta_policy.get("estimated_days", 2.0))
        
        # Log highly detailed Multi-Agent Execution Audit log
        logger.info(
            f"=== MULTI-AGENT PIPELINE AUDIT LOG ===\n"
            f"Complaint ID: {request.complaint_id}\n"
            f"Status: {status}\n"
            f"Category: {classify_result.category} (Confidence: {classify_result.confidence})\n"
            f"Severity: {classify_result.severity}\n"
            f"Is Duplicate: {dup_result.is_duplicate} (Cluster: {dup_result.cluster_id})\n"
            f"Routed Dept: {assigned_department} -> Officer: {assigned_officer}\n"
            f"Estimated ETA: {eta_days} days\n"
            f"Governing Policy: {eta_policy.get('governing_policy')}\n"
            f"Escalation SLA: {eta_policy.get('auto_escalation_protocol')}\n"
            f"======================================="
        )

        return AIProcessWorkflowResponse(
            status=status,
            analysis=classify_result,
            is_duplicate=dup_result.is_duplicate,
            is_spam=False,
            assigned_department=assigned_department,
            assigned_officer=assigned_officer,
            eta_days=eta_days
        )

coordinator_agent = CoordinatorAgent()
