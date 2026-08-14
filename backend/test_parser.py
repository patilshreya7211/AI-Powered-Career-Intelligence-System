from app.ai.resume_parser import extract_text_from_pdf

from app.ai.resume_analyzer import (
    extract_skills,
    extract_education,
    extract_projects,
    extract_certifications,
    extract_contact
)

# =====================================
# PDF Path
# =====================================

pdf_path = "uploads/838ae6ab-88d4-4087-aab0-4bda980a2f10_ShreyaDPatil.pdf"

# =====================================
# Extract Text
# =====================================

text = extract_text_from_pdf(pdf_path)

# =====================================
# Extract Information
# =====================================

skills = extract_skills(text)
education = extract_education(text)
projects = extract_projects(text)
certifications = extract_certifications(text)
contact = extract_contact(text)

# =====================================
# Display Results
# =====================================

print("========== Skills ==========")
for skill in skills:
    print(skill)

print("\n========== Education ==========")
for edu in education:
    print(edu)

print("\n========== Projects ==========")
for project in projects:
    print(project)

print("\n========== Certifications ==========")
for cert in certifications:
    print(cert)

print("\n========== Contact Information ==========")
print("Email :", contact["email"])
print("Phone :", contact["phone"])