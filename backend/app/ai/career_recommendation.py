def get_career_recommendation(skills):
    
    skills = [skill.lower() for skill in skills]

    careers = []

    # AI / ML
    if (
        "python" in skills
        and ("machine learning" in skills or "tensorflow" in skills or "pytorch" in skills)
    ):
        careers.append("AI / Machine Learning Engineer")

    # Data Science
    if (
        "python" in skills
        and "sql" in skills
        and "pandas" in skills
    ):
        careers.append("Data Scientist")

    # Data Analyst
    if (
        "excel" in skills
        or "power bi" in skills
        or "tableau" in skills
    ):
        careers.append("Data Analyst")

    # Frontend
    if (
        "html" in skills
        and "css" in skills
        and "javascript" in skills
    ):
        careers.append("Frontend Developer")

    # Full Stack
    if (
        "react" in skills
        and ("fastapi" in skills or "node.js" in skills)
    ):
        careers.append("Full Stack Developer")

    # Backend
    if (
        "java" in skills
        or "spring boot" in skills
    ):
        careers.append("Java Backend Developer")

    if (
        "fastapi" in skills
        or "flask" in skills
    ):
        careers.append("Python Backend Developer")

    # Cloud
    if (
        "aws" in skills
        or "azure" in skills
    ):
        careers.append("Cloud Engineer")

    # DevOps
    if (
        "docker" in skills
        and "git" in skills
    ):
        careers.append("DevOps Engineer")

    # Computer Vision
    if (
        "opencv" in skills
    ):
        careers.append("Computer Vision Engineer")

    if len(careers) == 0:
        careers.append("Software Engineer")

    return careers