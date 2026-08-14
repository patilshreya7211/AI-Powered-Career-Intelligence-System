def calculate_ats_score(
    skills,
    education,
    projects,
    certifications,
    contact
):
    """
    Calculate ATS Score out of 100
    """

    score = 0

    # ==========================
    # Contact Details (20 Marks)
    # ==========================
    if contact.get("email"):
        score += 10

    if contact.get("phone"):
        score += 10

    # ==========================
    # Skills (35 Marks)
    # ==========================
    score += min(len(skills) * 3, 35)

    # ==========================
    # Education (15 Marks)
    # ==========================
    if len(education) > 0:
        score += 15

    # ==========================
    # Projects (15 Marks)
    # ==========================
    score += min(len(projects) * 5, 15)

    # ==========================
    # Certifications (15 Marks)
    # ==========================
    score += min(len(certifications) * 5, 15)

    return min(score, 100)