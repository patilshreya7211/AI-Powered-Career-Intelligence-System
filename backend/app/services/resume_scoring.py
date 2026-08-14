def calculate_resume_score(analysis):
    
    score = 0

    # Contact
    if analysis.get("contact", {}).get("email"):
        score += 10

    if analysis.get("contact", {}).get("phone"):
        score += 5

    # Skills
    skills = analysis.get("skills", [])

    if len(skills) >= 10:
        score += 30
    elif len(skills) >= 5:
        score += 20
    elif len(skills) > 0:
        score += 10

    # Education
    education = analysis.get("education", [])

    if len(education) > 0:
        score += 20

    # Experience
    experience = analysis.get("experience", [])

    if len(experience) > 0:
        score += 20

    # Projects
    projects = analysis.get("projects", [])

    if len(projects) > 0:
        score += 10

    # Certifications
    certifications = analysis.get("certifications", [])

    if len(certifications) > 0:
        score += 5

    if score > 100:
        score = 100

    return score