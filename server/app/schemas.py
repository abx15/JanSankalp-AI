from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any

class ChatRequest(BaseModel):
    message: str
    history: Optional[List[Dict[str, str]]] = []

class ChatResponse(BaseModel):
    response: str
    metadata: Optional[Dict[str, Any]] = {}

class ClassifyRequest(BaseModel):
    text: str

class ClassifyResponse(BaseModel):
    category: str
    severity: str
    confidence: float
    reasoning: str

class DuplicateCheckRequest(BaseModel):
    text: str
    latitude: float
    longitude: float

class DuplicateCheckResponse(BaseModel):
    is_duplicate: bool
    similarity_score: float
    cluster_id: Optional[str] = None
    nearby_complaints_count: int

class RouteRequest(BaseModel):
    category: str
    location: str
    severity: str

class RouteResponse(BaseModel):
    department: str
    officer_id: str
    priority: str

class PredictETARequest(BaseModel):
    category: str
    severity: str
    location_density: float # e.g., population or issue density

class PredictETAResponse(BaseModel):
    estimated_days: float
    confidence_interval: List[float]

class VoiceRequest(BaseModel):
    audio_url: str

class VoiceResponse(BaseModel):
    transcript: str
    language: str
    translation: Optional[str] = None
    structured_data: Dict[str, Any]

class AnalyticsResponse(BaseModel):
    total_complaints: int
    avg_resolution_time: float
    severity_distribution: Dict[str, int]
    department_breakdown: Dict[str, int]
    officer_performance: List[Dict[str, Any]]

# --- Autonomous Governance Schemas ---

class SpamCheckRequest(BaseModel):
    text: str

class SpamCheckResponse(BaseModel):
    is_spam: bool
    spam_score: float # 0 to 1
    reasoning: str

class ResolutionVerifyRequest(BaseModel):
    complaint_text: str
    resolution_text: str
    evidence_image_url: Optional[str] = None

class ResolutionVerifyResponse(BaseModel):
    is_verified: bool
    confidence: float
    feedback: str
    requires_admin: bool

class AIProcessWorkflowRequest(BaseModel):
    complaint_id: str
    text: str
    latitude: float
    longitude: float

class AIProcessWorkflowResponse(BaseModel):
    status: str
    analysis: ClassifyResponse
    is_duplicate: bool
    is_spam: bool
    assigned_department: Optional[str] = None
    assigned_officer: Optional[str] = None
    eta_days: float
