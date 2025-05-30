from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import re
import numpy as np

def preprocess_text(text):
    """More resilient text cleaning"""
    text = text.lower()
    text = re.sub(r'[^\w\s]', '', text)  # Remove punctuation
    return text

def match_resume_to_jd(resume_text: str, job_description: str) -> dict:
    # Clean texts
    resume_clean = preprocess_text(resume_text)
    jd_clean = preprocess_text(job_description)
    
    # More flexible vectorizer configuration
    vectorizer = TfidfVectorizer(
        stop_words='english',
        min_df=1,  # Allow terms that appear in just one document
        ngram_range=(1, 2),
        token_pattern=r'(?u)\b[a-zA-Z][a-zA-Z]+\b'  # Only words with 2+ chars
    )
    
    try:
        # Vectorize
        tfidf_matrix = vectorizer.fit_transform([resume_clean, jd_clean])
        
        # Calculate similarity
        similarity = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:2])[0][0]
        score = round(float(similarity) * 100, 2)
        
        # Get meaningful keywords
        feature_names = vectorizer.get_feature_names_out()
        resume_words = set(resume_clean.split())
        jd_words = set(jd_clean.split())
        
        meaningful_matches = [
            word for word in (resume_words & jd_words)
            if word in feature_names
        ]
        
        return {
            "match_score": score,
            "matched_keywords": meaningful_matches
        }
        
    except ValueError:
        # Fallback for very short/no matching texts
        return {
            "match_score": 0.0,
            "matched_keywords": []
        }

# Test cases
print("Case 1 (Exact match):", 
    match_resume_to_jd("Python", "Python"))
    
print("Case 2 (Synonyms):",
    match_resume_to_jd(
        "Expert in artificial intelligence",
        "Looking for machine learning specialists"
    ))
    
print("Case 3 (Normal case):",
    match_resume_to_jd(
        "5 years Python and Django",
        "Senior Python developer needed"
    ))