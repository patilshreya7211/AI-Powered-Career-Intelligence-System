import re

# =====================================
# Skills List
# =====================================

SKILLS = [
    "Python",
    "Java",
    "C",
    "C++",
    "SQL",
    "HTML",
    "CSS",
    "JavaScript",
    "React",
    "Node.js",
    "FastAPI",
    "Machine Learning",
    "Deep Learning",
    "TensorFlow",
    "PyTorch",
    "Git",
    "GitHub",
    "MongoDB",
    "MySQL",
    "PostgreSQL",
    "Flask",
    "OpenCV",
    "NumPy",
    "Pandas",
    "Scikit-learn",
    "Arduino",
    "PHP",
    "Bootstrap"
]

# =====================================
# Extract Skills
# =====================================

def extract_skills(text):
    """
    Extract technical skills from resume text.
    """

    found = []

    lower_text = text.lower()

    for skill in SKILLS:
        if skill.lower() in lower_text:
            found.append(skill)

    return sorted(list(set(found)))


# =====================================
# Extract Education
# =====================================

def extract_education(text):
    """
    Extract education details from resume text.
    """

    education = []

    keywords = [
        "Bachelor",
        "Master",
        "B.Tech",
        "M.Tech",
        "B.E",
        "M.E",
        "BCA",
        "MCA",
        "Diploma",
        "SSC",
        "HSC",
        "Engineering",
        "University",
        "College"
    ]

    lines = text.split("\n")

    for line in lines:

        line = line.strip()

        if not line:
            continue

        for keyword in keywords:

            if keyword.lower() in line.lower():
                education.append(line)
                break

    return list(dict.fromkeys(education))


# =====================================
# Extract Projects
# =====================================

def extract_projects(text):
    """
    Extract project names from resume.
    """

    projects = []

    lines = text.split("\n")

    keywords = [
        "Project",
        "Projects",
        "System",
        "Website",
        "Application",
        "Management",
        "Detection",
        "Analyzer"
    ]

    for line in lines:

        line = line.strip()

        if not line:
            continue

        for keyword in keywords:

            if keyword.lower() in line.lower():
                projects.append(line)
                break

    return list(dict.fromkeys(projects))


# =====================================
# Extract Certifications
# =====================================

def extract_certifications(text):
    """
    Extract certification details.
    """

    certifications = []

    keywords = [
        "Certification",
        "Certified",
        "Certificate",
        "NPTEL",
        "Coursera",
        "Udemy",
        "Infosys",
        "Google",
        "AWS",
        "Microsoft",
        "Oracle",
        "Accenture",
        "Cisco"
    ]

    lines = text.split("\n")

    for line in lines:

        line = line.strip()

        if not line:
            continue

        for keyword in keywords:

            if keyword.lower() in line.lower():
                certifications.append(line)
                break

    return list(dict.fromkeys(certifications))


# =====================================
# Extract Contact Information
# =====================================

def extract_contact(text):
    """
    Extract email and phone number.
    """

    email = ""

    phone = ""

    email_match = re.search(
        r"[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}",
        text
    )

    if email_match:
        email = email_match.group()

    phone_match = re.search(
        r"(\+91[- ]?)?[6-9]\d{9}",
        text
    )

    if phone_match:
        phone = phone_match.group()

    return {
        "email": email,
        "phone": phone
    }