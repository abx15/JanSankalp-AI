from app.utils.geo_utils import is_within_radius
from app.schemas import DuplicateCheckResponse
from app.services.vector_service import vector_store
import uuid
import logging
from typing import List, Dict, Any

logger = logging.getLogger("ai-engine")

class DuplicateService:
    async def check_duplicate(self, text: str, lat: float, lon: float) -> DuplicateCheckResponse:
        # 1. Semantic Search via Vector DB
        similar_complaints = await vector_store.search_similar(text, threshold=0.85, limit=5)
        
        is_duplicate = False
        max_similarity = 0.0
        cluster_id = None
        nearby_count = 0

        # 2. Geo-Spatial Filter & Refinement
        for complaint in similar_complaints:
            comp_id = complaint.get('complaint_id')
            comp_lat = complaint.get('latitude')
            comp_lon = complaint.get('longitude')
            
            if comp_lat is not None and comp_lon is not None:
                if is_within_radius((lat, lon), (comp_lat, comp_lon), radius_km=0.5):
                    nearby_count += 1
                    is_duplicate = True
                    cluster_id = comp_id # Use the first similar found ID as cluster
                    break

        # 3. Store new record in Vector DB if not already there (async storage)
        if not is_duplicate:
            metadata = {
                "latitude": lat,
                "longitude": lon,
            }
            # Note: The actual workflow in main.py also triggers storage with the real ticket ID
            await vector_store.store_complaint(text, str(uuid.uuid4()), metadata)

        return DuplicateCheckResponse(
            is_duplicate=is_duplicate,
            similarity_score=max_similarity if not is_duplicate else 0.9,
            cluster_id=cluster_id,
            nearby_complaints_count=nearby_count
        )

duplicate_service = DuplicateService()
