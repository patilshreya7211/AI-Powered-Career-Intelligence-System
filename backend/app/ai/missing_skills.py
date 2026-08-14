AI_ML = [
    "Python",
    "Machine Learning",
    "Deep Learning",
    "TensorFlow",
    "PyTorch",
    "OpenCV",
    "NumPy",
    "Pandas",
    "Scikit-learn",
    "SQL",
    "Git"
]

WEB = [
    "HTML",
    "CSS",
    "JavaScript",
    "React",
    "Node.js",
    "FastAPI",
    "MongoDB",
    "MySQL",
    "Git",
    "GitHub"
]

DATA = [
    "Python",
    "SQL",
    "Pandas",
    "NumPy",
    "Power BI",
    "Excel",
    "Tableau",
    "Machine Learning"
]


def find_missing_skills(user_skills):
    """
    Find missing skills based on the detected career domain.
    """

    user_skills_lower = [skill.lower() for skill in user_skills]

    # Detect domain
    if (
        "tensorflow" in user_skills_lower
        or "pytorch" in user_skills_lower
        or "machine learning" in user_skills_lower
    ):
        required = AI_ML

    elif (
        "react" in user_skills_lower
        or "javascript" in user_skills_lower
        or "html" in user_skills_lower
    ):
        required = WEB

    else:
        required = DATA

    missing = []

    for skill in required:
        if skill.lower() not in user_skills_lower:
            missing.append(skill)

    return missing