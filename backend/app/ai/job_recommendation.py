# AI Job Recommendation Module

AI_ML_JOBS = [
    {
        "title": "AI / Machine Learning Engineer",
        "company": "Google",
        "location": "Bangalore",
        "salary": "₹15 - ₹25 LPA",
        "match": 95,
        "skills": ["Python", "TensorFlow", "Deep Learning"],
        "type": "Full Time",
        "apply_link": "https://careers.google.com/"
    },
    {
        "title": "Data Scientist",
        "company": "Microsoft",
        "location": "Hyderabad",
        "salary": "₹12 - ₹20 LPA",
        "match": 90,
        "skills": ["Python", "Machine Learning", "SQL"],
        "type": "Full Time",
        "apply_link": "https://careers.microsoft.com/"
    },
    {
        "title": "Computer Vision Engineer",
        "company": "NVIDIA",
        "location": "Pune",
        "salary": "₹10 - ₹18 LPA",
        "match": 88,
        "skills": ["OpenCV", "PyTorch", "Python"],
        "type": "Full Time",
        "apply_link": "https://www.nvidia.com/en-us/about-nvidia/careers/"
    }
]

WEB_JOBS = [
    {
        "title": "Frontend Developer",
        "company": "Infosys",
        "location": "Pune",
        "salary": "₹5 - ₹10 LPA",
        "match": 92,
        "skills": ["React", "JavaScript", "HTML", "CSS"],
        "type": "Full Time",
        "apply_link": "https://career.infosys.com/"
    },
    {
        "title": "Full Stack Developer",
        "company": "TCS",
        "location": "Bangalore",
        "salary": "₹6 - ₹12 LPA",
        "match": 90,
        "skills": ["React", "NodeJS", "MongoDB"],
        "type": "Full Time",
        "apply_link": "https://www.tcs.com/careers"
    },
    {
        "title": "Backend Developer",
        "company": "Accenture",
        "location": "Hyderabad",
        "salary": "₹6 - ₹11 LPA",
        "match": 85,
        "skills": ["Python", "FastAPI", "SQL"],
        "type": "Full Time",
        "apply_link": "https://www.accenture.com/in-en/careers"
    }
]

DATA_JOBS = [
    {
        "title": "Data Analyst",
        "company": "Amazon",
        "location": "Chennai",
        "salary": "₹6 - ₹10 LPA",
        "match": 91,
        "skills": ["Excel", "SQL", "Python"],
        "type": "Full Time",
        "apply_link": "https://www.amazon.jobs/"
    },
    {
        "title": "Business Analyst",
        "company": "Deloitte",
        "location": "Mumbai",
        "salary": "₹7 - ₹12 LPA",
        "match": 88,
        "skills": ["SQL", "Power BI", "Excel"],
        "type": "Full Time",
        "apply_link": "https://www2.deloitte.com/"
    },
    {
        "title": "Data Engineer",
        "company": "IBM",
        "location": "Pune",
        "salary": "₹8 - ₹15 LPA",
        "match": 89,
        "skills": ["Python", "Spark", "SQL"],
        "type": "Full Time",
        "apply_link": "https://www.ibm.com/careers"
    }
]


def recommend_jobs(user_skills):

    skills = [skill.lower() for skill in user_skills]

    if (
        "machine learning" in skills
        or "tensorflow" in skills
        or "pytorch" in skills
        or "opencv" in skills
    ):
        jobs = AI_ML_JOBS
        domain = "AI / Machine Learning"

    elif (
        "react" in skills
        or "javascript" in skills
        or "html" in skills
    ):
        jobs = WEB_JOBS
        domain = "Web Development"

    else:
        jobs = DATA_JOBS
        domain = "Data Science"

    return {
        "career_domain": domain,
        "recommended_jobs": jobs
    }