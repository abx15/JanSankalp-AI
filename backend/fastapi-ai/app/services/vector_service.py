import os
import weaviate
import weaviate.classes as wvc
import logging
from typing import List, Dict, Any, Optional

logger = logging.getLogger("ai-engine")

WEAVIATE_URL = os.getenv("WEAVIATE_URL", "http://vector-db:8080")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", "")


class VectorStoreService:
    def __init__(self):
        self.client = None
        self._initialize_client()

    def _initialize_client(self):
        """Connect using Weaviate v4 client API."""
        try:
            host = WEAVIATE_URL.replace("http://", "").replace("https://", "").rstrip("/")
            # Split host:port
            if ":" in host:
                host_part, port_part = host.rsplit(":", 1)
                port_int = int(port_part)
            else:
                host_part = host
                port_int = 8080

            self.client = weaviate.connect_to_custom(
                http_host=host_part,
                http_port=port_int,
                http_secure=WEAVIATE_URL.startswith("https"),
                grpc_host=host_part,
                grpc_port=50051,
                grpc_secure=False,
                headers={"X-OpenAI-Api-Key": OPENAI_API_KEY} if OPENAI_API_KEY else {},
            )
            self._ensure_collection()
            logger.info("Connected to Weaviate vector database (v4 client)")
        except Exception as e:
            logger.error(f"Failed to connect to Weaviate: {e}")
            self.client = None

    def _ensure_collection(self):
        """Create the Complaint collection if it doesn't exist."""
        try:
            if not self.client.collections.exists("Complaint"):
                self.client.collections.create(
                    name="Complaint",
                    description="Civic complaints for semantic search",
                    vectorizer_config=wvc.config.Configure.Vectorizer.text2vec_openai(
                        model="ada", model_version="002"
                    ) if OPENAI_API_KEY else wvc.config.Configure.Vectorizer.none(),
                    properties=[
                        wvc.config.Property(name="text", data_type=wvc.config.DataType.TEXT),
                        wvc.config.Property(name="complaint_id", data_type=wvc.config.DataType.TEXT),
                        wvc.config.Property(name="department", data_type=wvc.config.DataType.TEXT),
                        wvc.config.Property(name="severity", data_type=wvc.config.DataType.TEXT),
                        wvc.config.Property(name="latitude", data_type=wvc.config.DataType.NUMBER),
                        wvc.config.Property(name="longitude", data_type=wvc.config.DataType.NUMBER),
                    ],
                )
                logger.info("Created 'Complaint' collection in Weaviate")
        except Exception as e:
            logger.error(f"Error creating Weaviate collection: {e}")

    async def store_complaint(self, text: str, complaint_id: str, metadata: Dict[str, Any]):
        if not self.client:
            return False
        try:
            collection = self.client.collections.get("Complaint")
            collection.data.insert({
                "text": text,
                "complaint_id": complaint_id,
                **{k: v for k, v in metadata.items() if k in ("department", "severity", "latitude", "longitude")},
            })
            return True
        except Exception as e:
            logger.error(f"Error storing vector: {e}")
            return False

    async def search_similar(self, text: str, threshold: float = 0.85, limit: int = 5) -> List[Dict]:
        if not self.client:
            return []
        try:
            collection = self.client.collections.get("Complaint")
            results = collection.query.near_text(
                query=text,
                certainty=threshold,
                limit=limit,
                return_properties=["complaint_id", "text", "department", "severity"],
            )
            return [obj.properties for obj in results.objects]
        except Exception as e:
            logger.error(f"Error searching vector: {e}")
            return []


vector_store = VectorStoreService()
