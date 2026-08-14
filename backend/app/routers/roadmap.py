from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.models.profile import Profile

from app.ai.career_roadmap import generate_career_roadmap

router = APIRouter(
    prefix="/roadmap",
    tags=["Career Roadmap"]
)

@router.get("/{user_id}")
def get_roadmap(user_id: int, db: Session = Depends(get_db)):

    profile = db.query(Profile).filter(
        Profile.user_id == user_id
    ).first()

    if not profile:
        raise HTTPException(
            status_code=404,
            detail="Profile not found"
        )

    skills = profile.skills.lower() if profile.skills else ""

    if "machine learning" in skills or "python" in skills:
        career = "AI / Machine Learning Engineer"

    elif "react" in skills or "javascript" in skills:
        career = "Full Stack Developer"

    else:
        career = "Software Engineer"

    roadmap = generate_career_roadmap(career)

    return roadmap