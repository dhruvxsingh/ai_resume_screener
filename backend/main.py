from fastapi import FastAPI, UploadFile, Form, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
from uuid import uuid4
from sqlalchemy import create_engine, Column, String, Float, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
import os

from resume_parser import extract_resume_data, parse_resume_structured
from matching_engine import match_resume_to_jd

# Database setup
SQLALCHEMY_DATABASE_URL = "sqlite:///./jobboard.db"
engine = create_engine(
    SQLALCHEMY_DATABASE_URL, 
    connect_args={"check_same_thread": False}
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Models
class DBJob(Base):
    __tablename__ = "jobs"
    
    id = Column(String, primary_key=True, index=True)
    title = Column(String)
    description = Column(String)

class DBCandidate(Base):
    __tablename__ = "candidates"
    
    id = Column(String, primary_key=True, index=True)
    job_id = Column(String, ForeignKey("jobs.id"))
    name = Column(String)
    email = Column(String)
    phone = Column(String)
    match_score = Column(Float)
    resume_text = Column(String)

# Create tables
Base.metadata.create_all(bind=engine)

# FastAPI app
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"]
)

# Pydantic models
class Job(BaseModel):
    id: str
    title: str
    description: str

    class Config:
        orm_mode = True

class JobCreate(BaseModel):
    title: str
    description: str

class Candidate(BaseModel):
    id: str
    job_id: str
    name: str
    email: str
    phone: str
    match_score: float

    class Config:
        orm_mode = True

# Database dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Routes
@app.get("/")
def root():
    return {"message": "API is working!"}

@app.get("/jobs/", response_model=List[Job])
def list_jobs(db: Session = Depends(get_db)):
    return db.query(DBJob).all()

@app.post("/jobs/", response_model=Job)
def add_job(job: JobCreate, db: Session = Depends(get_db)):
    db_job = DBJob(id=str(uuid4()), title=job.title, description=job.description)
    db.add(db_job)
    db.commit()
    db.refresh(db_job)
    return db_job

@app.post("/upload/")
async def upload_resume(
    file: UploadFile, 
    jd: str = Form(...),
    job_id: str = Form(...),
    db: Session = Depends(get_db)
):
    # Check if job exists
    job = db.query(DBJob).filter(DBJob.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    
    # Process resume
    file_bytes = await file.read()
    text = extract_resume_data(file_bytes)
    parsed = parse_resume_structured(text)
    match_result = match_resume_to_jd(text, jd)
    
    # Store candidate
    candidate = DBCandidate(
        id=str(uuid4()),
        job_id=job_id,
        name=parsed["name"],
        email=parsed["email"],
        phone=parsed["phone"],
        match_score=match_result["match_score"],
        resume_text=text
    )
    
    db.add(candidate)
    db.commit()
    
    return {
        "match_score": match_result["match_score"],
        "matched_keywords": match_result.get("matched_keywords", []),
        "parsed_resume": parsed
    }

@app.get("/jobs/{job_id}/candidates/", response_model=List[Candidate])
def get_candidates_for_job(job_id: str, db: Session = Depends(get_db)):
    return db.query(DBCandidate).filter(DBCandidate.job_id == job_id).all()