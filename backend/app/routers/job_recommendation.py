from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.models.resume import Resume

from app.ai.resume_parser import extract_text_from_pdf
from app.ai.ats_match import extract_skills
from app.ai.job_recommendation import recommend_jobs

router = APIRouter(
    prefix="/job-recommendation",
    tags=["Job Recommendation"]
)


@router.get("/{user_id}")
def get_job_recommendation(
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
    # Extract Skills
    # -----------------------------
    resume_skills = extract_skills(
        resume_text
    )

    # -----------------------------
    # Recommend Jobs
    # -----------------------------
    result = recommend_jobs(
        resume_skills
    )

    return {
        "success": True,
        "message": "Job Recommendations Generated Successfully",
        "data": result
    }