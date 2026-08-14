from fastapi import APIRouter, UploadFile, File, Form, HTTPException, Depends
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.models.resume import Resume
from app.models.user import User
from app.ai.career_recommendation import get_career_recommendation
from app.ai.resume_tips import generate_resume_tips

from app.ai.resume_parser import extract_text_from_pdf

from app.ai.resume_analyzer import (
    extract_skills,
    extract_education,
    extract_projects,
    extract_certifications,
    extract_contact
)

from app.ai.resume_score import calculate_resume_score
from app.ai.ats_score import calculate_ats_score
from app.ai.missing_skills import find_missing_skills

import shutil
import os
import uuid

router = APIRouter(
    prefix="/resume",
    tags=["Resume"]
)

UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)


# =====================================================
# Upload Resume
# =====================================================
@router.post("/upload")
async def upload_resume(
    user_id: int = Form(...),
    title: str = Form(...),
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):

    user = db.query(User).filter(User.id == user_id).first()

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(
            status_code=400,
            detail="Only PDF files are allowed"
        )

    unique_filename = f"{uuid.uuid4()}_{file.filename}"

    file_path = os.path.join(
        UPLOAD_FOLDER,
        unique_filename
    )

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    resume = Resume(
        title=title,
        file_url=file_path,
        user_id=user_id
    )

    db.add(resume)
    db.commit()
    db.refresh(resume)

    return {
        "message": "Resume uploaded successfully",
        "resume_id": resume.id,
        "file_path": file_path
    }


# =====================================================
# Get User Resumes
# =====================================================
@router.get("/{user_id}")
def get_user_resumes(
    user_id: int,
    db: Session = Depends(get_db)
):

    user = db.query(User).filter(
        User.id == user_id
    ).first()

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    resumes = db.query(Resume).filter(
        Resume.user_id == user_id
    ).all()

    return resumes


# =====================================================
# Replace Resume
# =====================================================
@router.put("/replace/{resume_id}")
async def replace_resume(
    resume_id: int,
    title: str = Form(...),
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):

    resume = db.query(Resume).filter(
        Resume.id == resume_id
    ).first()

    if not resume:
        raise HTTPException(
            status_code=404,
            detail="Resume not found"
        )

    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(
            status_code=400,
            detail="Only PDF files are allowed"
        )

    if os.path.exists(resume.file_url):
        os.remove(resume.file_url)

    unique_filename = f"{uuid.uuid4()}_{file.filename}"

    file_path = os.path.join(
        UPLOAD_FOLDER,
        unique_filename
    )

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    resume.title = title
    resume.file_url = file_path

    db.commit()
    db.refresh(resume)

    return {
        "message": "Resume replaced successfully",
        "resume_id": resume.id,
        "file_path": file_path
    }


# =====================================================
# Delete Resume
# =====================================================
@router.delete("/delete/{resume_id}")
def delete_resume(
    resume_id: int,
    db: Session = Depends(get_db)
):

    resume = db.query(Resume).filter(
        Resume.id == resume_id
    ).first()

    if not resume:
        raise HTTPException(
            status_code=404,
            detail="Resume not found"
        )

    if os.path.exists(resume.file_url):
        os.remove(resume.file_url)

    db.delete(resume)
    db.commit()

    return {
        "message": "Resume deleted successfully"
    }


# =====================================================
# Analyze Resume
# =====================================================
@router.get("/analyze/{resume_id}")
def analyze_resume(
    resume_id: int,
    db: Session = Depends(get_db)
):

    resume = db.query(Resume).filter(
        Resume.id == resume_id
    ).first()

    if not resume:
        raise HTTPException(
            status_code=404,
            detail="Resume not found"
        )

    if not os.path.exists(resume.file_url):
        raise HTTPException(
            status_code=404,
            detail="Resume file not found"
        )

    # Extract Text
    text = extract_text_from_pdf(
        resume.file_url
    )

    # AI Analysis
    skills = extract_skills(text)

    education = extract_education(text)

    projects = extract_projects(text)

    certifications = extract_certifications(text)

    contact = extract_contact(text)

    # Resume Score
    resume_score = calculate_resume_score(
        skills,
        education,
        projects,
        certifications,
        contact
    )

    # ATS Score
    ats_score = calculate_ats_score(
        skills,
        education,
        projects,
        certifications,
        contact
    )

    # Missing Skills
    missing_skills = find_missing_skills(
        skills
    )
    career_recommendation = get_career_recommendation(
    skills
    )

    resume_tips = generate_resume_tips(
    resume_score,
    missing_skills,
    certifications,
    projects
    )

    return {
    "resume_id": resume.id,
    "title": resume.title,

    "resume_score": resume_score,
    "ats_score": ats_score,

    "skills": skills,
    "missing_skills": missing_skills,

    "education": education,
    "projects": projects,
    "certifications": certifications,

    "contact": contact,

    "career_recommendation": career_recommendation,
    "resume_tips": resume_tips
    }