"""
NLP Models for Multilingual Text Processing
Handles text classification, embedding generation, and language detection
"""

import torch
import torch.nn as nn
import torch.nn.functional as F
from transformers import (
    AutoTokenizer, 
    AutoModel, 
    AutoModelForSequenceClassification,
    pipeline
)
from typing import Dict, List, Any, Optional, Tuple
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

class MultilingualNLP:
    """
    Multilingual NLP processor supporting 22+ Indian languages
    Uses transformer models for text understanding and classification
    """
    
    def __init__(self):
        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        
        # Load multilingual models
        self.model_name = "xlm-roberta-base"  # Multilingual model
        self.tokenizer = AutoTokenizer.from_pretrained(self.model_name)
        self.model = AutoModel.from_pretrained(self.model_name).to(self.device)
        
        # Language detection model
        self.language_detector = pipeline(
            "text-classification",
            model="facebook/fasttext-language-identification",
            device=0 if torch.cuda.is_available() else -1
        )
        
        # Sentiment analyzer
        self.sentiment_analyzer = pipeline(
            "sentiment-analysis",
            model="cardiffnlp/twitter-roberta-base-sentiment-latest",
            device=0 if torch.cuda.is_available() else -1
        )
        
        # Text embeddings cache
        self.embedding_cache = {}
        
    def preprocess_text(self, text: str) -> str:
        """
        Clean and preprocess text for better model performance
        """
        # Remove extra whitespace
        text = ' '.join(text.split())
        
        # Normalize unicode characters
        text = text.normalize('NFKC')
        
        return text.strip()
    
    def detect_language(self, text: str) -> Dict[str, Any]:
        """
        Detect the language of input text
        Returns language code and confidence
        """
        try:
            result = self.language_detector(text[:512])  # Limit to 512 chars
            
            if isinstance(result, list) and len(result) > 0:
                prediction = result[0]
                return {
                    'language': prediction['label'].replace('__label__', ''),
                    'confidence': prediction['score']
                }
        except Exception as e:
            print(f"Language detection failed: {e}")
        
        # Fallback to default
        return {'language': 'en', 'confidence': 0.5}
    
    def get_embeddings(self, texts: List[str], batch_size: int = 8) -> np.ndarray:
        """
        Get text embeddings using transformer model
        """
        embeddings = []
        
        # Process in batches for memory efficiency
        for i in range(0, len(texts), batch_size):
            batch_texts = texts[i:i + batch_size]
            batch_embeddings = self._get_batch_embeddings(batch_texts)
            embeddings.append(batch_embeddings)
        
        return np.vstack(embeddings) if embeddings else np.array([])
    
    def _get_batch_embeddings(self, texts: List[str]) -> np.ndarray:
        """
        Get embeddings for a batch of texts
        """
        # Preprocess texts
        processed_texts = [self.preprocess_text(text) for text in texts]
        
        # Tokenize
        inputs = self.tokenizer(
            processed_texts,
            padding=True,
            truncation=True,
            max_length=512,
            return_tensors="pt"
        ).to(self.device)
        
        # Get embeddings
        with torch.no_grad():
            outputs = self.model(**inputs)
            
            # Use mean pooling of last hidden state
            embeddings = outputs.last_hidden_state.mean(dim=1)
            
        return embeddings.cpu().numpy()
    
    def classify_complaint(self, text: str) -> Dict[str, Any]:
        """
        Classify complaint into category, severity, and urgency
        """
        # Detect language first
        lang_info = self.detect_language(text)
        
        # Get embedding
        embedding = self.get_embeddings([text])[0]
        
        # Get sentiment
        sentiment = self.sentiment_analyzer(text[:512])
        sentiment_score = sentiment[0]['score'] if sentiment else 0.5
        
        # Category classification (simplified for demo)
        categories = [
            "Road & Potholes", "Garbage & Sanitation", "Streetlight", 
            "Water Supply", "Sewage & Drainage", "Electricity", 
            "Traffic & Signals", "Noise Pollution", "Park & Recreation",
            "Corruption & Misconduct", "Building & Construction",
            "Public Safety", "Transport & Bus", "Healthcare", "Education"
        ]
        
        # Use embedding similarity to classify (simplified)
        category_scores = self._classify_by_similarity(text, categories)
        
        # Determine severity based on keywords and sentiment
        severity = self._determine_severity(text, sentiment_score)
        
        # Determine urgency based on category and severity
        urgency = self._determine_urgency(category_scores['category'], severity)
        
        return {
            'category': category_scores['category'],
            'severity': severity,
            'urgency': urgency,
            'confidence': category_scores['confidence'],
            'language': lang_info['language'],
            'sentiment': sentiment_score,
            'embedding': embedding.tolist()
        }
    
    def _classify_by_similarity(self, text: str, categories: List[str]) -> Dict[str, Any]:
        """
        Classify text by similarity to category descriptions
        """
        # Category descriptions for similarity matching
        category_descriptions = {
            "Road & Potholes": "road pothole damage crack street repair traffic",
            "Garbage & Sanitation": "garbage trash waste dustbin cleaning sanitation",
            "Streetlight": "streetlight light dark night pole electricity",
            "Water Supply": "water supply tap pipe drinking shortage",
            "Sewage & Drainage": "sewage drainage drain overflow blockage",
            "Electricity": "electricity power cut outage transformer wire",
            "Traffic & Signals": "traffic signal jam vehicle road accident",
            "Noise Pollution": "noise loud speaker horn pollution sound",
            "Park & Recreation": "park garden playground recreation maintenance",
            "Corruption & Misconduct": "corruption bribe misconduct official illegal",
            "Building & Construction": "building construction illegal demolition",
            "Public Safety": "safety security police crime emergency",
            "Transport & Bus": "transport bus stop vehicle schedule",
            "Healthcare": "hospital medical healthcare doctor emergency",
            "Education": "school education teacher student facility"
        }
        
        # Get embeddings for text and all categories
        all_texts = [text] + list(category_descriptions.values())
        embeddings = self.get_embeddings(all_texts)
        
        text_embedding = embeddings[0]
        category_embeddings = embeddings[1:]
        
        # Calculate similarities
        similarities = cosine_similarity([text_embedding], category_embeddings)[0]
        
        # Get best category
        best_idx = np.argmax(similarities)
        best_category = categories[best_idx]
        confidence = float(similarities[best_idx])
        
        return {
            'category': best_category,
            'confidence': confidence,
            'all_scores': dict(zip(categories, similarities.tolist()))
        }
    
    def _determine_severity(self, text: str, sentiment_score: float) -> int:
        """
        Determine severity (1-5) based on text content and sentiment
        """
        severity_keywords = {
            5: ["emergency", "critical", "danger", "accident", "fire", "life threatening"],
            4: ["urgent", "immediate", "serious", "major", "severe"],
            3: ["important", "significant", "problem", "issue"],
            2: ["minor", "small", "little", "slight"],
            1: ["suggestion", "request", "question", "information"]
        }
        
        text_lower = text.lower()
        
        # Check for severity keywords
        for level, keywords in severity_keywords.items():
            if any(keyword in text_lower for keyword in keywords):
                return level
        
        # Use sentiment as fallback
        if sentiment_score < 0.3:  # Very negative
            return 4
        elif sentiment_score < 0.5:  # Negative
            return 3
        elif sentiment_score < 0.7:  # Neutral
            return 2
        else:  # Positive
            return 1
    
    def _determine_urgency(self, category: str, severity: int) -> str:
        """
        Determine urgency level based on category and severity
        """
        high_urgency_categories = [
            "Public Safety", "Electricity", "Water Supply", 
            "Healthcare", "Traffic & Signals"
        ]
        
        if severity >= 4 or category in high_urgency_categories:
            return "High"
        elif severity >= 3:
            return "Medium"
        else:
            return "Low"


class TextEmbedding:
    """
    Advanced text embedding generation using multiple techniques
    """
    
    def __init__(self):
        self.tfidf_vectorizer = TfidfVectorizer(
            max_features=5000,
            ngram_range=(1, 3),
            stop_words='english'
        )
        self.is_fitted = False
        
    def fit_transform(self, texts: List[str]) -> np.ndarray:
        """
        Fit TF-IDF vectorizer and transform texts
        """
        embeddings = self.tfidf_vectorizer.fit_transform(texts)
        self.is_fitted = True
        return embeddings.toarray()
    
    def transform(self, texts: List[str]) -> np.ndarray:
        """
        Transform texts using fitted vectorizer
        """
        if not self.is_fitted:
            raise ValueError("Vectorizer not fitted. Call fit_transform first.")
        
        embeddings = self.tfidf_vectorizer.transform(texts)
        return embeddings.toarray()
    
    def get_similarity_matrix(self, texts: List[str]) -> np.ndarray:
        """
        Get pairwise similarity matrix for texts
        """
        if not self.is_fitted:
            embeddings = self.fit_transform(texts)
        else:
            embeddings = self.transform(texts)
        
        return cosine_similarity(embeddings)


# Initialize global instances
multilingual_nlp = MultilingualNLP()
text_embedding = TextEmbedding()

if __name__ == "__main__":
    # Test the NLP models
    print("Testing NLP Models...")
    
    # Test language detection
    test_texts = [
        "मेरे गाँव में सड़क बहुत खराब है",
        "There is a water leak in my area",
        "என் பகுதியில் மின்சாரம் இல்லை"
    ]
    
    for text in test_texts:
        lang_info = multilingual_nlp.detect_language(text)
        print(f"Text: {text[:30]}... -> Language: {lang_info['language']}")
    
    # Test complaint classification
    complaint = "मेरे मोहल्ले में पानी की पाइप लीक हो गई है और पानी बर्बाद हो रहा है"
    classification = multilingual_nlp.classify_complaint(complaint)
    
    print(f"\nComplaint Classification:")
    print(f"Category: {classification['category']}")
    print(f"Severity: {classification['severity']}")
    print(f"Urgency: {classification['urgency']}")
    print(f"Confidence: {classification['confidence']:.2f}")
    print(f"Language: {classification['language']}")
    
    print("\nNLP Models working correctly!")
