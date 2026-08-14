from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.models.resume import Resume

from app.ai.resume_parser import extract_text_from_pdf
from app.ai.ats_match import extract_skills
from app.ai.skill_gap import analyze_skill_gap
from app.ai.learning_resources import recommend_learning_resources

router = APIRouter(
    prefix="/learning-resources",
    tags=["Learning Resources"]
)


@router.get("/{user_id}")
def get_learning_resources(
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
    # (Later these can come from ATS)
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
    # Skill Gap Analysis
    # -----------------------------
    gap_result = analyze_skill_gap(
        resume_skills,
        job_skills
    )

    # -----------------------------
    # Learning Resources
    # -----------------------------
    resources = recommend_learning_resources(
        gap_result["missing_skills"]
    )

    return {
        "success": True,
        "message": "Learning Resources Generated Successfully",
        "data": resources
    }