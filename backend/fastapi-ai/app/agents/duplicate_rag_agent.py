import os
import json
import uuid
import logging
import numpy as np
import openai
from typing import List, Dict, Any, Tuple
from app.config import settings
from app.schemas import DuplicateCheckResponse
from app.services.vector_service import vector_store
from app.utils.geo_utils import is_within_radius

logger = logging.getLogger("ai-engine.agents.duplicate_rag")

CACHE_DIR = "models"
CACHE_PATH = os.path.join(CACHE_DIR, "vector_cache.json")

class DuplicateRAGAgent:
    def __init__(self):
        self.client = openai.OpenAI(api_key=settings.OPENAI_API_KEY) if settings.OPENAI_API_KEY else None
        self.similarity_threshold = settings.SIMILARITY_THRESHOLD if hasattr(settings, "SIMILARITY_THRESHOLD") else 0.85
        self._ensure_cache_exists()

    def _ensure_cache_exists(self):
        if not os.path.exists(CACHE_DIR):
            os.makedirs(CACHE_DIR, exist_ok=True)
        if not os.path.exists(CACHE_PATH):
            with open(CACHE_PATH, "w") as f:
                json.dump([], f)

    def _load_cache(self) -> List[Dict[str, Any]]:
        try:
            with open(CACHE_PATH, "r") as f:
                return json.load(f)
        except Exception as e:
            logger.error(f"[Duplicate Agent] Failed to load cache: {e}")
            return []

    def _save_cache(self, data: List[Dict[str, Any]]):
        try:
            with open(CACHE_PATH, "w") as f:
                json.dump(data, f, indent=2)
        except Exception as e:
            logger.error(f"[Duplicate Agent] Failed to save cache: {e}")

    async def get_embedding(self, text: str) -> List[float]:
        if not self.client:
            raise ValueError("OpenAI client not initialized")
        
        response = self.client.embeddings.create(
            input=[text],
            model="text-embedding-3-small"
        )
        return response.data[0].embedding

    def cosine_similarity(self, a: List[float], b: List[float]) -> float:
        a_arr = np.array(a)
        b_arr = np.array(b)
        dot_product = np.dot(a_arr, b_arr)
        norm_a = np.linalg.norm(a_arr)
        norm_b = np.linalg.norm(b_arr)
        if norm_a == 0 or norm_b == 0:
            return 0.0
        return float(dot_product / (norm_a * norm_b))

    async def run(self, text: str, lat: float, lon: float, complaint_id: str = None) -> DuplicateCheckResponse:
        logger.info(f"[Duplicate Agent] Running check for location ({lat}, {lon})")
        
        # Scenario A: Try Weaviate first if client is connected
        if vector_store.client:
            try:
                similar_complaints = await vector_store.search_similar(text, threshold=self.similarity_threshold, limit=5)
                is_duplicate = False
                cluster_id = None
                nearby_count = 0
                max_similarity = 0.0

                for complaint in similar_complaints:
                    comp_id = complaint.get('complaint_id')
                    comp_lat = complaint.get('latitude')
                    comp_lon = complaint.get('longitude')
                    
                    if comp_lat is not None and comp_lon is not None:
                        if is_within_radius((lat, lon), (comp_lat, comp_lon), radius_km=0.5):
                            nearby_count += 1
                            is_duplicate = True
                            cluster_id = comp_id
                            max_similarity = 0.90
                            break
                            
                if not is_duplicate:
                    metadata = {"latitude": lat, "longitude": lon}
                    await vector_store.store_complaint(text, complaint_id or str(uuid.uuid4()), metadata)

                return DuplicateCheckResponse(
                    is_duplicate=is_duplicate,
                    similarity_score=max_similarity if is_duplicate else 0.0,
                    cluster_id=cluster_id,
                    nearby_complaints_count=nearby_count
                )
            except Exception as e:
                logger.warning(f"[Duplicate Agent] Weaviate search failed ({e}), falling back to Local RAG Cache.")

        # Scenario B: Local Semantic RAG Cache (numpy + json file)
        if not self.client:
            logger.warning("[Duplicate Agent] No OpenAI client. Falling back to local keyword matching.")
            return self._run_keyword_fallback(text, lat, lon)

        try:
            query_embedding = await self.get_embedding(text)
            cache = self._load_cache()
            
            is_duplicate = False
            max_similarity = 0.0
            cluster_id = None
            nearby_count = 0
            
            for item in cache:
                comp_lat = item.get("latitude")
                comp_lon = item.get("longitude")
                
                # Spatial check first to save computation
                if is_within_radius((lat, lon), (comp_lat, comp_lon), radius_km=0.5):
                    nearby_count += 1
                    
                    # Compute cosine similarity semantically
                    sim = self.cosine_similarity(query_embedding, item["embedding"])
                    if sim > max_similarity:
                        max_similarity = sim
                    
                    if sim >= self.similarity_threshold:
                        is_duplicate = True
                        cluster_id = item["complaint_id"]
            
            # Store if not duplicate
            if not is_duplicate:
                new_complaint_id = complaint_id or f"JS-{uuid.uuid4().hex[:8].upper()}"
                cache.append({
                    "complaint_id": new_complaint_id,
                    "text": text,
                    "latitude": lat,
                    "longitude": lon,
                    "embedding": query_embedding
                })
                self._save_cache(cache)
                logger.info(f"[Duplicate Agent] Stored unique complaint {new_complaint_id} in Local Semantic Cache.")
                
            return DuplicateCheckResponse(
                is_duplicate=is_duplicate,
                similarity_score=max_similarity,
                cluster_id=cluster_id,
                nearby_complaints_count=nearby_count
            )

        except Exception as e:
            logger.error(f"[Duplicate Agent] Local Semantic Cache Error: {e}")
            return self._run_keyword_fallback(text, lat, lon)

    def _run_keyword_fallback(self, text: str, lat: float, lon: float) -> DuplicateCheckResponse:
        logger.info("[Duplicate Agent] Running basic keyword fallback duplicate check.")
        cache = self._load_cache()
        words = set(text.lower().split())
        
        is_duplicate = False
        cluster_id = None
        nearby_count = 0
        max_similarity = 0.0
        
        for item in cache:
            comp_lat = item.get("latitude")
            comp_lon = item.get("longitude")
            
            if is_within_radius((lat, lon), (comp_lat, comp_lon), radius_km=0.5):
                nearby_count += 1
                
                # Simple Jaccard similarity fallback
                item_words = set(item["text"].lower().split())
                intersection = words.intersection(item_words)
                union = words.union(item_words)
                jaccard = len(intersection) / len(union) if union else 0.0
                
                if jaccard > max_similarity:
                    max_similarity = jaccard
                
                if jaccard >= 0.5: # Lower threshold for basic keyword matching
                    is_duplicate = True
                    cluster_id = item["complaint_id"]
                    
        return DuplicateCheckResponse(
            is_duplicate=is_duplicate,
            similarity_score=max_similarity,
            cluster_id=cluster_id,
            nearby_complaints_count=nearby_count
        )

duplicate_rag_agent = DuplicateRAGAgent()
