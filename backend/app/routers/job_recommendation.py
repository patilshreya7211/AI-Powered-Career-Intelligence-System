import os

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.models.resume import Resume

from app.ai.resume_parser import extract_text_from_pdf
from app.ai.ats_match import extract_skills
from app.ai.job_recommendation import recommend_jobs


# ============================================================
# ROUTER
# ============================================================

router = APIRouter(
    prefix="/job-recommendation",
    tags=["Job Recommendation"]
)


# ============================================================
# BASE DIRECTORY
# ============================================================

BASE_DIR = os.path.dirname(
    os.path.dirname(
        os.path.dirname(
            os.path.abspath(__file__)
        )
    )
)


# ============================================================
# UPLOAD DIRECTORY
# ============================================================

UPLOAD_FOLDER = os.path.join(
    BASE_DIR,
    "uploads"
)

os.makedirs(
    UPLOAD_FOLDER,
    exist_ok=True
)


# ============================================================
# RESOLVE RESUME PATH
# ============================================================

def resolve_resume_path(file_url: str) -> str:
    """
    Convert database resume URL into the actual
    physical file path.
    """

    if not file_url:

        raise HTTPException(
            status_code=404,
            detail="Resume file URL is empty."
        )

    stored_path = file_url.strip()

    # /uploads/example.pdf
    if stored_path.startswith(
        "/uploads/"
    ):

        filename = stored_path[
            len("/uploads/"):
        ]

    # uploads/example.pdf
    elif stored_path.startswith(
        "uploads/"
    ):

        filename = stored_path[
            len("uploads/"):
        ]

    # Old/legacy stored path
    else:

        filename = os.path.basename(
            stored_path
        )

    # --------------------------------------------------------
    # Prevent directory traversal
    # --------------------------------------------------------

    filename = os.path.basename(
        filename
    )

    resume_path = os.path.abspath(
        os.path.join(
            UPLOAD_FOLDER,
            filename
        )
    )

    return resume_path


# ============================================================
# JOB RECOMMENDATION
# ============================================================

@router.get("/{user_id}")
def get_job_recommendation(
    user_id: int,
    db: Session = Depends(get_db)
):

    print("\n========================================")
    print("JOB RECOMMENDATION")
    print("User ID:", user_id)
    print("========================================")

    # ========================================================
    # 1. GET LATEST RESUME
    # ========================================================

    resume = (
        db.query(Resume)
        .filter(
            Resume.user_id == user_id
        )
        .order_by(
            Resume.id.desc()
        )
        .first()
    )

    if not resume:

        raise HTTPException(
            status_code=404,
            detail=(
                "Resume not found. "
                "Please upload a resume first."
            )
        )

    print(
        "Resume ID:",
        resume.id
    )

    print(
        "Database file_url:",
        resume.file_url
    )

    # ========================================================
    # 2. RESOLVE PHYSICAL FILE
    # ========================================================

    try:

        resume_path = resolve_resume_path(
            resume.file_url
        )

    except HTTPException:

        raise

    except Exception as error:

        print(
            "Path resolution error:",
            error
        )

        raise HTTPException(
            status_code=500,
            detail=(
                "Unable to resolve resume file path."
            )
        )

    print(
        "Resolved resume path:",
        resume_path
    )

    # ========================================================
    # 3. CHECK FILE
    # ========================================================

    if not os.path.isfile(
        resume_path
    ):

        print(
            "Resume file does not exist:",
            resume_path
        )

        raise HTTPException(
            status_code=404,
            detail=(
                "Resume file not found on the server. "
                "Please upload the resume again."
            )
        )

    print(
        "Resume file found successfully."
    )

    # ========================================================
    # 4. EXTRACT RESUME TEXT
    # ========================================================

    try:

        resume_text = extract_text_from_pdf(
            resume_path
        )

    except Exception as error:

        print(
            "Resume extraction error:",
            str(error)
        )

        raise HTTPException(
            status_code=500,
            detail=(
                "Unable to read the resume PDF."
            )
        )

    # ========================================================
    # 5. CHECK TEXT
    # ========================================================

    if (
        not resume_text
        or not resume_text.strip()
    ):

        raise HTTPException(
            status_code=400,
            detail=(
                "No readable text found in the resume."
            )
        )

    print(
        "Resume text length:",
        len(resume_text)
    )

    # ========================================================
    # 6. EXTRACT SKILLS
    # ========================================================

    try:

        resume_skills = extract_skills(
            resume_text
        )

    except Exception as error:

        print(
            "Skill extraction error:",
            str(error)
        )

        raise HTTPException(
            status_code=500,
            detail=(
                "Unable to extract skills from resume."
            )
        )

    print(
        "Resume skills:",
        resume_skills
    )

    # ========================================================
    # 7. RECOMMEND JOBS
    # ========================================================

    try:

        result = recommend_jobs(
            resume_skills
        )

    except Exception as error:

        print(
            "Job recommendation error:",
            str(error)
        )

        raise HTTPException(
            status_code=500,
            detail=(
                "Failed to generate job recommendations."
            )
        )

    # ========================================================
    # 8. RETURN RESPONSE
    # ========================================================

    return {
        "success": True,
        "message": (
            "Job Recommendations Generated Successfully"
        ),
        "data": result
    }