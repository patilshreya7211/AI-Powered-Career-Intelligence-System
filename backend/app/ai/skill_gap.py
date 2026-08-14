"""
Skill Gap Analysis

This module compares resume skills with job description skills
and identifies:
1. Matching Skills
2. Missing Skills
3. Skill Gap %
4. Learning Recommendations
"""


def analyze_skill_gap(resume_skills, job_skills):
    """
    Compare Resume Skills with Job Skills.
    """

    resume_skills = list(set(resume_skills))
    job_skills = list(set(job_skills))

    matching_skills = []
    missing_skills = []

    for skill in job_skills:

        if skill in resume_skills:
            matching_skills.append(skill)
        else:
            missing_skills.append(skill)

    # Calculate Skill Gap %
    if len(job_skills) == 0:
        skill_gap = 0
    else:
        skill_gap = int(
            (len(missing_skills) / len(job_skills)) * 100
        )

    # Learning Recommendations
    learning_recommendations = []

    for skill in missing_skills:
        learning_recommendations.append(
            f"Learn {skill}"
        )

    return {

        "matching_skills": matching_skills,

        "missing_skills": missing_skills,

        "skill_gap": skill_gap,

        "learning_recommendations": learning_recommendations

    }