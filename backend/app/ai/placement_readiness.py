"""
AI Placement Readiness Module
Calculates placement readiness score based on
Resume Score, ATS Score, Skills, Projects,
and Certifications.
"""


def calculate_placement_readiness(
    resume_score,
    ats_score,
    skills,
    projects,
    certifications
):
    """
    Calculate overall placement readiness.
    """

    # ===============================
    # Score Calculation
    # ===============================

    score = 0

    # Resume Score (30 Marks)
    score += resume_score * 0.30

    # ATS Score (20 Marks)
    score += ats_score * 0.20

    # Skills (20 Marks)
    skills_score = min(len(skills) * 2, 20)
    score += skills_score

    # Projects (15 Marks)
    projects_score = min(len(projects) * 5, 15)
    score += projects_score

    # Certifications (15 Marks)
    certifications_score = min(len(certifications) * 5, 15)
    score += certifications_score

    overall = min(int(score), 100)

    # ===============================
    # Placement Level
    # ===============================

    if overall >= 90:
        level = "Excellent"

    elif overall >= 75:
        level = "Very Good"

    elif overall >= 60:
        level = "Good"

    elif overall >= 45:
        level = "Average"

    else:
        level = "Needs Improvement"

    # ===============================
    # Strengths
    # ===============================

    strengths = []

    if resume_score >= 80:
        strengths.append("Professional Resume")

    if ats_score >= 80:
        strengths.append("ATS Friendly Resume")

    if len(skills) >= 8:
        strengths.append("Strong Technical Skills")

    if len(projects) >= 3:
        strengths.append("Excellent Project Experience")

    if len(certifications) >= 2:
        strengths.append("Industry Certifications")

    # ===============================
    # Weaknesses
    # ===============================

    weaknesses = []

    if ats_score < 70:
        weaknesses.append("Improve ATS Optimization")

    if len(skills) < 6:
        weaknesses.append("Learn More Technical Skills")

    if len(projects) < 3:
        weaknesses.append("Build More Real-world Projects")

    if len(certifications) < 2:
        weaknesses.append("Complete Professional Certifications")

    # ===============================
    # Recommended Learning
    # ===============================

    learning = [
        "Practice Data Structures & Algorithms",
        "Strengthen DBMS, OS and Computer Networks",
        "Practice SQL Interview Questions",
        "Improve Aptitude and Logical Reasoning",
        "Build Full Stack AI Projects",
        "Practice Mock Interviews"
    ]

    # ===============================
    # Interview Readiness
    # ===============================

    if overall >= 85:

        technical = "Ready"
        coding = "Ready"
        hr = "Ready"

    elif overall >= 70:

        technical = "Moderate"
        coding = "Moderate"
        hr = "Ready"

    elif overall >= 50:

        technical = "Needs Practice"
        coding = "Needs Practice"
        hr = "Moderate"

    else:

        technical = "Not Ready"
        coding = "Not Ready"
        hr = "Needs Practice"

    # ===============================
    # Target Companies
    # ===============================

    companies = [
        "Infosys",
        "TCS",
        "Accenture",
        "Capgemini",
        "Cognizant",
        "Wipro",
        "IBM",
        "Tech Mahindra"
    ]

    # ===============================
    # AI Placement Tips
    # ===============================

    tips = [

        "Improve your Resume Formatting",

        "Add Quantifiable Project Achievements",

        "Practice Coding on LeetCode",

        "Complete Cloud or AI Certifications",

        "Participate in Hackathons",

        "Practice Technical & HR Mock Interviews"
    ]

    # ===============================
    # Final Result
    # ===============================

    return {

        "placement_score": overall,

        "level": level,

        "resume_score": resume_score,

        "ats_score": ats_score,

        "skills_score": skills_score,

        "projects_score": projects_score,

        "certifications_score": certifications_score,

        "strengths": strengths,

        "weaknesses": weaknesses,

        "learning": learning,

        "interview_readiness": {

            "technical_round": technical,

            "coding_round": coding,

            "hr_round": hr
        },

        "companies": companies,

        "tips": tips
    }