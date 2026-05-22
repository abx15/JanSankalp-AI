import openai
import cohere
from typing import List
from app.config import settings

openai.api_key = settings.OPENAI_API_KEY
co = cohere.Client(settings.COHERE_API_KEY) if settings.COHERE_API_KEY else None

def get_openai_embedding(text: str) -> List[float]:
    response = openai.Embedding.create(
        input=text,
        model=settings.EMBEDDING_MODEL
    )
    return response['data'][0]['embedding']

def get_cohere_embedding(text: str) -> List[float]:
    if not co:
        return []
    response = co.embed(
        texts=[text],
        model="embed-english-v3.0",
        input_type="search_document"
    )
    return response.embeddings[0]

def calculate_cosine_similarity(vec1: List[float], vec2: List[float]) -> float:
    import numpy as np
    from sklearn.metrics.pairwise import cosine_similarity
    
    v1 = np.array(vec1).reshape(1, -1)
    v2 = np.array(vec2).reshape(1, -1)
    return float(cosine_similarity(v1, v2)[0][0])
