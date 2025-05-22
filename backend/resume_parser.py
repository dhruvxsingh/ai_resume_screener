from PyPDF2 import PdfReader
import os

def extract_resume_data(file_path: str) -> str:
    """Extracts text from a PDF resume file."""
    if not os.path.exists(file_path):
        raise FileNotFoundError("Resume file not found.")

    reader = PdfReader(file_path)
    text = ""

    for page in reader.pages:
        text += page.extract_text() or ""

    return text.strip()
