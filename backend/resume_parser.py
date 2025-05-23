from PyPDF2 import PdfReader
from io import BytesIO
import re

def extract_resume_data(file_bytes: bytes) -> str:
    """Extracts text from uploaded PDF bytes."""
    reader = PdfReader(BytesIO(file_bytes))
    text = ""

    for page in reader.pages:
        text += page.extract_text() or ""

    return text.strip()

def parse_resume_structured(text: str) -> dict:
    """Parses resume text into structured data."""
    return {
        "name": extract_name(text),
        "email": extract_email(text),
        "phone": extract_phone(text),
        "skills": extract_skills(text)
    }

def extract_email(text: str):
    match = re.search(r"[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+", text)
    return match.group(0) if match else None

def extract_phone(text: str):
    match = re.search(r"\+?\d[\d\s\-()]{8,}\d", text)
    return match.group(0) if match else None

def extract_name(text: str):
    lines = text.strip().split("\n")
    return lines[0].strip() if lines else None

def extract_skills(text: str):
    skill_list = ["Python", "Java", "C++", "React", "Node.js", "Machine Learning", "FastAPI", "SQL", "MongoDB", "AWS"]
    return [skill for skill in skill_list if skill.lower() in text.lower()]
