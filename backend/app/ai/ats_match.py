# backend/app/ai/ats_match.py

# ==========================================
# Common Technical Skills Database
# ==========================================

SKILLS_DATABASE = [
    "Python",
    "Java",
    "C",
    "C++",
    "JavaScript",
    "React",
    "Node.js",
    "FastAPI",
    "Django",
    "Flask",
    "HTML",
    "CSS",
    "SQL",
    "MySQL",
    "MongoDB",
    "Git",
    "GitHub",
    "Docker",
    "Kubernetes",
    "AWS",
    "Azure",
    "TensorFlow",
    "PyTorch",
    "Machine Learning",
    "Deep Learning",
    "Data Science",
    "REST API",
    "Linux",
    "OpenCV",
    "Pandas",
    "NumPy"
]


# ==========================================
# Extract Skills
# ==========================================

def extract_skills(text):
    """
    Extract technical skills from Resume or Job Description.
    """

    if not text:
        return []

    text = text.lower()

    found_skills = []

    for skill in SKILLS_DATABASE:

        if skill.lower() in text:
            found_skills.append(skill)

    return sorted(list(set(found_skills)))


# ==========================================
# Compare Resume with Job Description
# ==========================================

def compare_resume_with_job(resume_text, job_text):
    """
    Compare Resume with Job Description
    and calculate ATS score.
    """

    resume_skills = extract_skills(resume_text)
    job_skills = extract_skills(job_text)

    matching_skills = []
    missing_skills = []

    for skill in job_skills:

        if skill in resume_skills:
            matching_skills.append(skill)

        else:
            missing_skills.append(skill)

    # -------------------------------------
    # ATS Score
    # -------------------------------------

    if len(job_skills) == 0:
        ats_score = 0
    else:
        ats_score = int(
            (len(matching_skills) / len(job_skills)) * 100
        )

    # -------------------------------------
    # AI Recommendations
    # -------------------------------------

    recommendations = []

    if len(missing_skills) > 0:

        for skill in missing_skills:
            recommendations.append(f"Learn {skill}")

    if ats_score >= 90:
        recommendations.append(
            "Excellent! Your resume is highly optimized for this job."
        )

    elif ats_score >= 75:
        recommendations.append(
            "Good match. Add the missing skills to further improve your ATS score."
        )

    elif ats_score >= 50:
        recommendations.append(
            "Your resume matches partially. Improve technical skills and add relevant projects."
        )

    else:
        recommendations.append(
            "Your resume needs significant improvement. Add the missing skills, projects, certifications, and keywords."
        )

    # -------------------------------------
    # Return Result
    # -------------------------------------

    return {

        "ats_score": ats_score,

        "match_percentage": ats_score,

        "resume_skills": resume_skills,

        "job_skills": job_skills,

        "matching_skills": matching_skills,

        "missing_skills": missing_skills,

        "recommendations": recommendations
    }