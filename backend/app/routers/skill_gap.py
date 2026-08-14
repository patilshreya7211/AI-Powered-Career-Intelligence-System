from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.models.resume import Resume

from app.ai.resume_parser import extract_text_from_pdf
from app.ai.ats_match import extract_skills
from app.ai.skill_gap import analyze_skill_gap

router = APIRouter(
    prefix="/skill-gap",
    tags=["Skill Gap Analysis"]
)


@router.get("/{user_id}")
def skill_gap_analysis(
    user_id: int,
    db: Session = Depends(get_db)
):

    # -----------------------------
    # Get Latest Resume
    # -----------------------------
    resume = (
        db.query(Resume)
        .filter(Resume.user_id == user_id)
        .order_by(Resume.id.desc())
        .first()
    )

    if not resume:
        raise HTTPException(
            status_code=404,
            detail="Resume not found"
        )

    # -----------------------------
    # Extract Resume Text
    # -----------------------------
    resume_text = extract_text_from_pdf(
        resume.file_url
    )

    # -----------------------------
    # Extract Resume Skills
    # -----------------------------
    resume_skills = extract_skills(
        resume_text
    )

    # -----------------------------
    # Example Job Skills
    # (Later these will come from ATS module)
    # -----------------------------
    job_skills = [
        "Python",
        "Machine Learning",
        "Deep Learning",
        "TensorFlow",
        "React",
        "FastAPI",
        "Git",
        "Docker",
        "AWS",
        "SQL"
    ]

    # -----------------------------
    # Analyze Skill Gap
    # -----------------------------
    result = analyze_skill_gap(
        resume_skills,
        job_skills
    )

    return {
        "success": True,
        "message": "Skill Gap Analysis Completed",
        "data": result
    }