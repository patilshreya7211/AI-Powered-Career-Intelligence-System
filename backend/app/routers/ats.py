from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    UploadFile,
    File,
    Form
)

from sqlalchemy.orm import Session

from app.database.database import get_db
from app.models.resume import Resume

from app.ai.resume_parser import extract_text_from_pdf
from app.ai.job_parser import extract_text_from_job
from app.ai.ats_match import compare_resume_with_job

import os
import shutil


# ============================================================
# ATS ROUTER
# ============================================================

router = APIRouter(
    prefix="/ats",
    tags=["ATS Analysis"]
)


# ============================================================
# JOB DESCRIPTION UPLOAD FOLDER
# ============================================================

UPLOAD_FOLDER = "uploads/job_descriptions"

os.makedirs(
    UPLOAD_FOLDER,
    exist_ok=True
)


# ============================================================
# ATS ANALYSIS
# ============================================================

@router.post("/{user_id}")
async def ats_analysis(
    user_id: int,

    # --------------------------------------------------------
    # Job Description File - OPTIONAL
    # --------------------------------------------------------

    file: UploadFile = File(None),

    # --------------------------------------------------------
    # Job Description Text - OPTIONAL
    # --------------------------------------------------------

    job_description: str = Form(None),

    # --------------------------------------------------------
    # Database
    # --------------------------------------------------------

    db: Session = Depends(get_db)
):

    print("\n========================================")
    print("        ATS ANALYSIS STARTED")
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
            detail="Resume not found. Please upload a resume first."
        )


    print("\n========== RESUME DATABASE ==========")
    print("Resume ID :", resume.id)
    print("User ID   :", resume.user_id)
    print("File Path :", resume.file_url)
    print("=====================================\n")


    # ========================================================
    # 2. CHECK RESUME FILE
    # ========================================================

    if not os.path.exists(resume.file_url):

        raise HTTPException(
            status_code=404,
            detail=f"Resume file not found: {resume.file_url}"
        )


    # ========================================================
    # 3. EXTRACT RESUME TEXT
    # ========================================================

    try:

        resume_text = extract_text_from_pdf(
            resume.file_url
        )

    except Exception as e:

        print("Resume extraction error:", str(e))

        raise HTTPException(
            status_code=500,
            detail="Failed to extract text from resume."
        )


    print("\n========== RESUME TEXT ==========")
    print(resume_text)
    print("=================================\n")


    # ========================================================
    # 4. GET JOB DESCRIPTION
    # ========================================================

    job_text = ""


    # ========================================================
    # OPTION A: JOB DESCRIPTION FILE
    # ========================================================

    if file is not None:

        print("\n========== JOB DESCRIPTION FILE ==========")
        print("Filename:", file.filename)
        print("==========================================\n")


        # ----------------------------------------------------
        # Validate filename
        # ----------------------------------------------------

        if not file.filename:

            raise HTTPException(
                status_code=400,
                detail="Invalid job description file."
            )


        # ----------------------------------------------------
        # Check extension
        # ----------------------------------------------------

        filename = file.filename.lower()

        if not (
            filename.endswith(".pdf")
            or filename.endswith(".txt")
        ):

            raise HTTPException(
                status_code=400,
                detail="Job description must be a PDF or TXT file."
            )


        # ----------------------------------------------------
        # Create safe filename
        # ----------------------------------------------------

        safe_filename = os.path.basename(
            file.filename
        )


        job_path = os.path.join(
            UPLOAD_FOLDER,
            safe_filename
        )


        # ----------------------------------------------------
        # Save file
        # ----------------------------------------------------

        try:

            with open(
                job_path,
                "wb"
            ) as buffer:

                shutil.copyfileobj(
                    file.file,
                    buffer
                )

        except Exception as e:

            print(
                "Job file save error:",
                str(e)
            )

            raise HTTPException(
                status_code=500,
                detail="Failed to save job description file."
            )


        print("\n========== JOB FILE SAVED ==========")
        print(job_path)
        print("====================================\n")


        # ----------------------------------------------------
        # Extract Job Description
        # ----------------------------------------------------

        try:

            job_text = extract_text_from_job(
                job_path
            )

        except Exception as e:

            print(
                "Job description extraction error:",
                str(e)
            )

            raise HTTPException(
                status_code=500,
                detail="Failed to extract job description text."
            )


    # ========================================================
    # OPTION B: JOB DESCRIPTION TEXT
    # ========================================================

    elif job_description is not None:

        print(
            "\n========== JOB DESCRIPTION TEXT =========="
        )

        print(
            job_description
        )

        print(
            "==========================================\n"
        )


        # ----------------------------------------------------
        # Remove unnecessary spaces
        # ----------------------------------------------------

        job_text = job_description.strip()


        # ----------------------------------------------------
        # Check empty text
        # ----------------------------------------------------

        if not job_text:

            raise HTTPException(
                status_code=400,
                detail="Job description text cannot be empty."
            )


    # ========================================================
    # NO JOB DESCRIPTION PROVIDED
    # ========================================================

    else:

        raise HTTPException(
            status_code=400,
            detail="Please upload a Job Description PDF/TXT or enter the Job Description as text."
        )


    # ========================================================
    # 5. CHECK EXTRACTED JOB TEXT
    # ========================================================

    if not job_text or not job_text.strip():

        raise HTTPException(
            status_code=400,
            detail="Could not extract any text from the Job Description."
        )


    print("\n========== FINAL JOB TEXT ==========")
    print(job_text)
    print("====================================\n")


    # ========================================================
    # 6. COMPARE RESUME WITH JOB DESCRIPTION
    # ========================================================

    try:

        result = compare_resume_with_job(
            resume_text,
            job_text
        )

    except Exception as e:

        print(
            "\n========== ATS COMPARISON ERROR =========="
        )

        print(
            str(e)
        )

        print(
            "==========================================\n"
        )

        raise HTTPException(
            status_code=500,
            detail=f"ATS comparison failed: {str(e)}"
        )


    # ========================================================
    # 7. PRINT ATS RESULT
    # ========================================================

    print(
        "\n========== ATS RESULT =========="
    )

    print(
        result
    )

    print(
        "================================\n"
    )


    # ========================================================
    # 8. RETURN RESPONSE
    # ========================================================

    return {

        "success": True,

        "message": "ATS Analysis Completed Successfully",

        "data": result

    }