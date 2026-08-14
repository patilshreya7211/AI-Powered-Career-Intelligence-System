from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.database import get_db

from app.models.profile import Profile
from app.models.resume import Resume

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
from app.ai.placement_readiness import calculate_placement_readiness

import os

router = APIRouter(
    prefix="/placement",
    tags=["Placement Readiness"]
)


@router.get("/{user_id}")
def placement_readiness(user_id: int, db: Session = Depends(get_db)):

    profile = db.query(Profile).filter(
        Profile.user_id == user_id
    ).first()

    if not profile:
        raise HTTPException(
            status_code=404,
            detail="Profile not found"
        )

    resume = db.query(Resume).filter(
        Resume.user_id == user_id
    ).order_by(Resume.id.desc()).first()

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

    text = extract_text_from_pdf(resume.file_url)

    skills = extract_skills(text)
    education = extract_education(text)
    projects = extract_projects(text)
    certifications = extract_certifications(text)
    contact = extract_contact(text)

    resume_score = calculate_resume_score(
        skills,
        education,
        projects,
        certifications,
        contact
    )

    ats_score = calculate_ats_score(
        skills,
        education,
        projects,
        certifications,
        contact
    )

    result = calculate_placement_readiness(
        resume_score,
        ats_score,
        skills,
        projects,
        certifications
    )

    return result