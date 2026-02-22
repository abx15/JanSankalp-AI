import os
from dotenv import load_dotenv

# Load .env from same directory or root if not found
load_dotenv() # Looks for .env in CWD
if not os.getenv("OPENAI_API_KEY"):
    load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), '../../.env'))

class Config:
    OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
    GROK_API_KEY = os.getenv("GROK_API_KEY")
    HUGGINGFACE_API_KEY = os.getenv("HUGGINGFACE_API_KEY")
    COHERE_API_KEY = os.getenv("COHERE_API_KEY")
    ASSEMBLY_AI_API_KEY = os.getenv("ASSEMBLY_AI_API_KEY")
    
    AI_SERVICE_URL = os.getenv("AI_SERVICE_URL", "https://jansankalp-ai.onrender.com")
    
    # Categories for classification
    CATEGORIES = ["Roads", "Water", "Electricity", "Sanitation", "Traffic", "Others"]
    SEVERITY_LEVELS = ["Low", "Medium", "High", "Critical"]
    
    # Embedding Configuration
    EMBEDDING_MODEL = "text-embedding-3-small"
    SIMILARITY_THRESHOLD = 0.85

settings = Config()
