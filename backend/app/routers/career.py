from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.models.profile import Profile

router = APIRouter(
    prefix="/career",
    tags=["Career Recommendation"]
)


@router.get("/{user_id}")
def career_recommendation(user_id: int, db: Session = Depends(get_db)):

    profile = db.query(Profile).filter(Profile.user_id == user_id).first()

    if not profile:
        raise HTTPException(
            status_code=404,
            detail="Profile not found"
        )

    skills = profile.skills.lower() if profile.skills else ""

    if "machine learning" in skills or "python" in skills:
        career = "AI / Machine Learning Engineer"
        salary = "₹8 - ₹18 LPA"

        roadmap = [
            "Python",
            "Machine Learning",
            "Deep Learning",
            "MLOps",
            "AI Engineer"
        ]

        companies = [
            "Google",
            "Microsoft",
            "Amazon",
            "NVIDIA",
            "Infosys"
        ]

        courses = [
            "Machine Learning",
            "Deep Learning",
            "TensorFlow",
            "Docker",
            "AWS"
        ]

    elif "react" in skills or "javascript" in skills:

        career = "Full Stack Developer"
        salary = "₹6 - ₹15 LPA"

        roadmap = [
            "HTML",
            "CSS",
            "JavaScript",
            "React",
            "Node.js"
        ]

        companies = [
            "TCS",
            "Infosys",
            "Wipro",
            "Accenture",
            "Capgemini"
        ]

        courses = [
            "React",
            "Node.js",
            "MongoDB",
            "Express.js"
        ]

    else:

        career = "Software Engineer"
        salary = "₹5 - ₹12 LPA"

        roadmap = [
            "DSA",
            "Java",
            "SQL",
            "System Design"
        ]

        companies = [
            "Infosys",
            "TCS",
            "Accenture"
        ]

        courses = [
            "Java",
            "SQL",
            "DSA"
        ]

    return {
        "career": career,
        "salary": salary,
        "roadmap": roadmap,
        "companies": companies,
        "courses": courses
    }