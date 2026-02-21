import os
import weaviate
import logging
from typing import List, Dict, Any, Optional

logger = logging.getLogger("ai-engine")

class VectorStoreService:
    def __init__(self):
        self.url = os.getenv("WEAVIATE_URL", "http://vector-db:8080")
        self.client = None
        self._initialize_client()

    def _initialize_client(self):
        try:
            self.client = weaviate.Client(
                url=self.url,
                additional_headers={
                    "X-OpenAI-Api-Key": os.getenv("OPENAI_API_KEY")
                }
            )
            self._create_schema()
            logger.info("Successfully connected to Weaviate vector database")
        except Exception as e:
            logger.error(f"Failed to connect to Weaviate: {e}")

    def _create_schema(self):
        class_obj = {
            "class": "Complaint",
            "description": "A civic complaint reported by a citizen",
            "vectorizer": "text2vec-openai",
            "moduleConfig": {
                "text2vec-openai": {
                    "model": "ada",
                    "modelVersion": "002",
                    "type": "text"
                }
            },
            "properties": [
                {
                    "name": "text",
                    "dataType": ["text"],
                    "description": "The description of the complaint",
                },
                {
                    "name": "complaint_id",
                    "dataType": ["string"],
                    "description": "The unique identifier of the complaint",
                },
                {
                    "name": "department",
                    "dataType": ["string"],
                    "description": "The assigned department",
                },
                {
                    "name": "severity",
                    "dataType": ["string"],
                    "description": "Severity level",
                },
                {
                    "name": "latitude",
                    "dataType": ["number"],
                    "description": "Latitude of the issue",
                },
                {
                    "name": "longitude",
                    "dataType": ["number"],
                    "description": "Longitude of the issue",
                }
            ]
        }
        
        try:
            if not self.client.schema.contains(class_obj):
                self.client.schema.create_class(class_obj)
                logger.info("Created Complaint schema in Weaviate")
        except Exception as e:
            logger.error(f"Error creating Weaviate schema: {e}")

    async def store_complaint(self, text: str, complaint_id: str, metadata: Dict[str, Any]):
        try:
            data_object = {
                "text": text,
                "complaint_id": complaint_id,
                **metadata
            }
            self.client.data_object.create(data_object, "Complaint")
            return True
        except Exception as e:
            logger.error(f"Error storing vector: {e}")
            return False

    async def search_similar(self, text: str, threshold: float = 0.85, limit: int = 5):
        try:
            response = (
                self.client.query
                .get("Complaint", ["complaint_id", "text", "department", "severity"])
                .with_near_text({"concepts": [text], "certainty": threshold})
                .with_limit(limit)
                .do()
            )
            
            return response.get("data", {}).get("Get", {}).get("Complaint", [])
        except Exception as e:
            logger.error(f"Error searching vector: {e}")
            return []

vector_store = VectorStoreService()
