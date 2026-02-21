from app.utils.embeddings import get_openai_embedding, calculate_cosine_similarity
from app.utils.geo_utils import is_within_radius
from app.schemas import DuplicateCheckResponse
import uuid
from typing import List, Dict, Any

# Mock storage for embeddings (in production, use a Vector DB like ChromaDB or Pinecone)
complaint_store = []

class DuplicateService:
    async def check_duplicate(self, text: str, lat: float, lon: float) -> DuplicateCheckResponse:
        current_embedding = get_openai_embedding(text)
        is_duplicate = False
        max_similarity = 0.0
        cluster_id = None
        nearby_count = 0

        for complaint in complaint_store:
            # First check geo-proximity
            if is_within_radius((lat, lon), (complaint['lat'], complaint['lon']), radius_km=0.5):
                nearby_count += 1
                similarity = calculate_cosine_similarity(current_embedding, complaint['embedding'])
                if similarity > max_similarity:
                    max_similarity = similarity
                
                if similarity > 0.85:
                    is_duplicate = True
                    cluster_id = complaint.get('cluster_id') or str(uuid.uuid4())
                    complaint['cluster_id'] = cluster_id # Group them

        # If duplicate found but no cluster_id in store, create one
        if is_duplicate and not cluster_id:
            cluster_id = str(uuid.uuid4())

        # Store for future checks
        complaint_store.append({
            "text": text,
            "embedding": current_embedding,
            "lat": lat,
            "lon": lon,
            "cluster_id": cluster_id
        })

        return DuplicateCheckResponse(
            is_duplicate=is_duplicate,
            similarity_score=max_similarity,
            cluster_id=cluster_id,
            nearby_complaints_count=nearby_count
        )

duplicate_service = DuplicateService()
