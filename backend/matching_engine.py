def match_resume_to_jd(resume_text: str, job_description: str) -> dict:
    """
    Dummy matching function: returns keyword match count and score.
    Replace with a real NLP-based approach later.
    """
    resume_words = set(resume_text.lower().split())
    jd_words = set(job_description.lower().split())
    matched_words = resume_words.intersection(jd_words)

    score = round(len(matched_words) / len(jd_words) * 100, 2) if jd_words else 0

    return {
        "matched_keywords": list(matched_words),
        "match_score": score
    }
