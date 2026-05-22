import joblib
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression, LinearRegression
from sklearn.pipeline import Pipeline
from ml_training.preprocess import preprocessor
import os

MODEL_DIR = "models"
os.makedirs(MODEL_DIR, exist_ok=True)

def train_models(data_path: str):
    # Load dataset
    df = pd.read_csv(data_path)
    
    # Preprocess text
    df['cleaned_text'] = df['complaint_text'].apply(preprocessor.clean_text)

    # 1. Train Department Classifier
    dept_pipeline = Pipeline([
        ('tfidf', TfidfVectorizer(max_features=5000)),
        ('clf', LogisticRegression(max_iter=1000))
    ])
    dept_pipeline.fit(df['cleaned_text'], df['department'])
    joblib.dump(dept_pipeline, os.path.join(MODEL_DIR, 'classifier.pkl'))
    print("✓ Department Classifier trained and saved.")

    # 2. Train Severity Predictor
    severity_pipeline = Pipeline([
        ('tfidf', TfidfVectorizer(max_features=5000)),
        ('clf', LogisticRegression(max_iter=1000))
    ])
    severity_pipeline.fit(df['cleaned_text'], df['severity'])
    joblib.dump(severity_pipeline, os.path.join(MODEL_DIR, 'severity_model.pkl'))
    print("✓ Severity Predictor trained and saved.")

    # 3. Train Resolution Time (ETA) Model
    # For regression, we might want to include category/severity as features too
    # Simple version for now using text
    eta_pipeline = Pipeline([
        ('tfidf', TfidfVectorizer(max_features=5000)),
        ('reg', LinearRegression())
    ])
    eta_pipeline.fit(df['cleaned_text'], df['resolution_time'])
    joblib.dump(eta_pipeline, os.path.join(MODEL_DIR, 'eta_model.pkl'))
    print("✓ ETA Regression model trained and saved.")

if __name__ == "__main__":
    # Example: Create dummy data if not exists for demonstration
    if not os.path.exists("training_data.csv"):
        dummy_data = {
            "complaint_text": [
                "There is a huge pothole on MG Road", 
                "Street lights are not working in Sector 4",
                "Water leakage near central market",
                "Garbage pile up in front of school",
                "Dead tree about to fall on wires",
                "Sewage overflowing in the lane"
            ] * 10,
            "department": ["Roads", "Electricity", "Water", "Sanitation", "Forestry", "Sanitation"] * 10,
            "severity": ["High", "Medium", "High", "Low", "Critical", "Medium"] * 10,
            "resolution_time": [5, 2, 3, 1, 0, 4] * 10, # Days
        }
        pd.DataFrame(dummy_data).to_csv("training_data.csv", index=False)
        print("Created dummy training data.")
    
    train_models("training_data.csv")
