def generate_resume_tips(
    score,
    missing_skills,
    certifications,
    projects
):

    tips = []

    # Resume Score
    if score < 60:
        tips.append("Your resume needs significant improvement. Add more technical skills, projects, and certifications.")
    elif score < 80:
        tips.append("Your resume is good, but it can be improved by adding more achievements and relevant skills.")
    else:
        tips.append("Excellent resume! Keep updating it regularly with your latest achievements.")

    # Projects
    if len(projects) == 0:
        tips.append("Add at least 2–3 academic or real-world projects.")
    elif len(projects) < 2:
        tips.append("Include more projects to showcase your practical experience.")

    # Certifications
    if len(certifications) == 0:
        tips.append("Complete industry-recognized certifications such as AWS, Google, Microsoft, or Coursera.")
    elif len(certifications) < 2:
        tips.append("Add more certifications to strengthen your profile.")

    # Missing Skills
    if len(missing_skills) > 0:
        tips.append(
            "Focus on learning these important skills: "
            + ", ".join(missing_skills[:5])
        )

    # General Tips
    tips.append("Use action verbs like Developed, Designed, Implemented, and Optimized.")
    tips.append("Quantify achievements using numbers whenever possible.")
    tips.append("Keep your resume limited to one page if you have less than 5 years of experience.")
    tips.append("Ensure your resume is ATS-friendly by using standard section headings.")
    tips.append("Customize your resume according to the job description before applying.")

    return tips