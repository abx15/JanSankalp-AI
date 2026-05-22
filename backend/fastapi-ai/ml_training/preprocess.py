import re
import pandas as pd
from typing import List, Tuple
from sklearn.preprocessing import LabelEncoder

class MLPreprocessor:
    def __init__(self):
        self.label_encoders = {}

    def clean_text(self, text: str) -> str:
        if not isinstance(text, str):
            return ""
        # Lowercase
        text = text.lower()
        # Remove special characters and numbers
        text = re.sub(r'[^a-zA-Z\s]', '', text)
        # Remove multiple spaces
        text = re.sub(r'\s+', ' ', text).strip()
        return text

    def prepare_data(self, df: pd.DataFrame, target_col: str) -> Tuple[pd.Series, pd.Series]:
        """
        Cleans text and encodes labels.
        """
        df['cleaned_text'] = df['complaint_text'].apply(self.clean_text)
        
        if target_col not in self.label_encoders:
            le = LabelEncoder()
            df['target'] = le.fit_transform(df[target_col])
            self.label_encoders[target_col] = le
        else:
            df['target'] = self.label_encoders[target_col].transform(df[target_col])
            
        return df['cleaned_text'], df['target']

    def get_encoder(self, name: str):
        return self.label_encoders.get(name)

preprocessor = MLPreprocessor()
