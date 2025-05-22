from fastapi import FastAPI, UploadFile, File, Form
from resume_parser import extract_resume_data
from matching_engine import match_resume_to_jd

app = FastAPI()

@app.get("/")
def read_root():
    return {"message": "API is working!"}

@app.post("/upload/")
async def upload_resume(file: UploadFile = File(...), jd: str = Form(...)):
    contents = await file.read()
    resume_text = extract_resume_data(contents)
    match_score = match_resume_to_jd(resume_text, jd)
    return {"match": round(match_score * 100, 2)}
