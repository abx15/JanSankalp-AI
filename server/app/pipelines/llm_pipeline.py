"""
LLM Pipeline — MVDC Architecture

This module encapsulates the multi-step AI orchestration pipeline
that processes complaints end-to-end. Previously this logic was
inline in the /process-workflow endpoint in main.py.

MVDC: pipelines/ = AI workflow orchestration layer
"""
import logging
from app.schemas import (
    ClassifyResponse,
    AIProcessWorkflowRequest,
    AIProcessWorkflowResponse,
)
from app.services.spam_service import spam_service
from app.services.classification_service import classification_service
from app.services.duplicate_service import duplicate_service
from app.services.routing_service import routing_service
from app.services.ml_model_service import ml_model_service

logger = logging.getLogger("ai-engine.pipeline")


class LLMPipeline:
    """
    Orchestrates the multi-step complaint processing workflow:

    1. Spam / validity check
    2. Smart classification
    3. Duplicate detection & grouping
    4. Smart routing (if not duplicate)
    5. ML-based ETA prediction

    Returns: AIProcessWorkflowResponse
    """

    async def run_workflow(self, request: AIProcessWorkflowRequest) -> AIProcessWorkflowResponse:
        logger.info(f"[Pipeline] Starting workflow for complaint_id={request.complaint_id}")

        # Step 1 — Spam & Validity Check
        spam_result = await spam_service.check_spam(request.text)
        if spam_result.is_spam:
            logger.info(f"[Pipeline] Complaint {request.complaint_id} rejected as spam.")
            return AIProcessWorkflowResponse(
                status="REJECTED_SPAM",
                analysis=ClassifyResponse(
                    category="N/A",
                    severity="Low",
                    confidence=spam_result.spam_score,
                    reasoning=spam_result.reasoning,
                ),
                is_duplicate=False,
                is_spam=True,
                eta_days=0,
            )

        # Step 2 — Smart Classification
        logger.info(f"[Pipeline] Classifying complaint {request.complaint_id}")
        analysis = await classification_service.classify_complaint(request.text)

        # Step 3 — Duplicate Detection
        dup_result = await duplicate_service.check_duplicate(
            request.text, request.latitude, request.longitude
        )

        # Step 4 — Smart Routing (if not duplicate)
        routing = None
        if not dup_result.is_duplicate:
            routing = await routing_service.route_complaint(analysis.category, analysis.severity)

        # Step 5 — ML-based ETA Prediction
        eta = await ml_model_service.predict_eta(analysis.category, analysis.severity, 0.5)

        logger.info(
            f"[Pipeline] Workflow complete for {request.complaint_id}: "
            f"category={analysis.category}, duplicate={dup_result.is_duplicate}, eta={eta.estimated_days}d"
        )

        return AIProcessWorkflowResponse(
            status="PROCESSED",
            analysis=analysis,
            is_duplicate=dup_result.is_duplicate,
            is_spam=False,
            assigned_department=routing.department if routing else None,
            assigned_officer=routing.officer_id if routing else None,
            eta_days=eta.estimated_days,
        )


# Singleton pipeline instance
llm_pipeline = LLMPipeline()
