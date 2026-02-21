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
