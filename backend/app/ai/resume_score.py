def calculate_resume_score(
    skills,
    education,
    projects,
    certifications,
    contact
):
    """
    Calculate resume score out of 100.
    """

    score = 0

    # ==========================
    # Skills (40 Marks)
    # ==========================
    score += min(len(skills) * 4, 40)

    # ==========================
    # Education (20 Marks)
    # ==========================
    if education:
        score += 20

    # ==========================
    # Projects (20 Marks)
    # ==========================
    score += min(len(projects) * 10, 20)

    # ==========================
    # Certifications (10 Marks)
    # ==========================
    score += min(len(certifications) * 5, 10)

    # ==========================
    # Contact Details (10 Marks)
    # ==========================
    if contact.get("email") and contact.get("phone"):
        score += 10

    # Never exceed 100
    return min(score, 100)