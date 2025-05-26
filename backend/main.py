from fastapi import FastAPI, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware
from resume_parser import extract_resume_data, parse_resume_structured
from matching_engine import match_resume_to_jd

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
    text = extract_resume_data("temp.pdf")
    parsed = parse_resume_structured(text)
    score = match_resume_to_jd(text, jd)
    return {"match_score": score, "parsed_resume": parsed}
