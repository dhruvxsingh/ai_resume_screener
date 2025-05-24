from fastapi import FastAPI, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware
from resume_parser import extract_text, extract_details
from matching_engine import calculate_similarity

app = FastAPI()
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])

@app.get("/")
def root():
    return {"message": "API is working!"}

@app.post("/upload/")
async def upload_resume(file: UploadFile, jd: str = Form(...)):
    contents = await file.read()
    with open("temp.pdf", "wb") as f:
        f.write(contents)
    text = extract_text("temp.pdf")
    parsed = extract_details(text)
    score = calculate_similarity(text, jd)
    return {"match_score": score, "parsed_resume": parsed}
