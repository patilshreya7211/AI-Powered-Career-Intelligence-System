from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.models.profile import Profile
from app.models.user import User


router = APIRouter(
    prefix="/ai-career-assistance",
    tags=["AI Career Assistance"]
)


# =========================================================
# Request Schema
# =========================================================

class CareerQuestion(BaseModel):
    user_id: int
    question: str


# =========================================================
# Temporary AI Career Assistant
# =========================================================

def generate_career_response(question: str, profile: Profile):

    question_lower = question.lower()

    # -----------------------------------------------------
    # Get profile information
    # -----------------------------------------------------

    branch = profile.branch or "Not provided"
    degree = profile.degree or "Not provided"
    year = profile.year or "Not provided"
    cgpa = profile.cgpa or "Not provided"
    skills = profile.skills or "Not provided"
    projects = profile.projects or "Not provided"
    certifications = profile.certifications or "Not provided"
    education = profile.education or "Not provided"
    bio = profile.bio or "Not provided"

    # -----------------------------------------------------
    # AI/ML Skills Question
    # -----------------------------------------------------

    if (
        "skill" in question_lower
        and (
            "ai" in question_lower
            or "ml" in question_lower
            or "machine learning" in question_lower
            or "artificial intelligence" in question_lower
        )
    ):

        return f"""
Based on your profile, here is a recommended AI/ML learning path.

Your current background:
• Degree: {degree}
• Branch: {branch}
• Year: {year}
• CGPA: {cgpa}
• Current Skills: {skills}

Recommended skills to learn:

1. Python
   • Python programming
   • Functions and classes
   • Exception handling
   • File handling
   • Object-oriented programming

2. Mathematics
   • Linear Algebra
   • Probability
   • Statistics
   • Basic Calculus

3. Data Science
   • NumPy
   • Pandas
   • Matplotlib
   • Seaborn

4. Machine Learning
   • Linear Regression
   • Logistic Regression
   • Decision Trees
   • Random Forest
   • K-Nearest Neighbors
   • Support Vector Machines
   • Clustering
   • Model evaluation

5. Deep Learning
   • Neural Networks
   • CNN
   • RNN
   • Transformers
   • TensorFlow or PyTorch

6. SQL
   • SELECT
   • WHERE
   • JOIN
   • GROUP BY
   • Subqueries

7. AI/ML Projects
   • Build real-world projects
   • Upload projects to GitHub
   • Explain projects clearly in your resume

8. Deployment
   • FastAPI
   • Flask
   • Docker
   • Basic cloud deployment

Recommended order:

Python
→ Mathematics
→ NumPy/Pandas
→ Machine Learning
→ Deep Learning
→ Projects
→ Deployment

Your existing skills and projects can be used as a starting point. Focus on building practical AI/ML projects instead of only studying theory.
"""

    # -----------------------------------------------------
    # Career Path Question
    # -----------------------------------------------------

    if (
        "career path" in question_lower
        or "career option" in question_lower
        or "which career" in question_lower
        or "career suitable" in question_lower
    ):

        return f"""
Based on your profile, you have a good starting point for technology and AI-related careers.

Your profile:
• Degree: {degree}
• Branch: {branch}
• Year: {year}
• CGPA: {cgpa}
• Skills: {skills}

Possible career paths:

1. AI/ML Engineer
   Focus on machine learning, deep learning, Python and deployment.

2. Data Scientist
   Focus on statistics, Python, SQL, data analysis and machine learning.

3. Data Analyst
   Focus on SQL, Excel, Python, Pandas and data visualization.

4. AI Software Developer
   Combine software development with AI/ML technologies.

5. Computer Vision Engineer
   Focus on OpenCV, CNNs, image processing and deep learning.

6. NLP Engineer
   Focus on text processing, transformers, NLP and language models.

Recommended choice:

Since your background is related to AI/ML, AI/ML Engineer or AI Software Developer would be strong career options.

Build projects and internships in your selected area before applying for placements.
"""

    # -----------------------------------------------------
    # Project Question
    # -----------------------------------------------------

    if (
        "project" in question_lower
        or "projects" in question_lower
        or "resume project" in question_lower
    ):

        return f"""
Based on your profile, you should build projects that demonstrate practical skills.

Your current projects:
{projects}

Recommended AI/ML projects:

1. AI Career Recommendation System
   • Recommend career paths based on student skills.
   • Use Python and machine learning.

2. Disease Prediction System
   • Predict possible diseases from medical parameters.
   • Use classification algorithms.

3. Resume Analyzer
   • Extract skills from resumes.
   • Compare skills with job requirements.

4. Student Performance Prediction
   • Predict student performance using machine learning.

5. Fake News Detection
   • Use NLP and classification algorithms.

6. Image Classification System
   • Use CNN and TensorFlow/PyTorch.

7. Career Recommendation Chatbot
   • Provide career suggestions based on student profile.

For your resume, focus on projects that have:

• Clear problem statement
• Technology stack
• Dataset
• Machine learning model
• Results
• GitHub repository
• Working demonstration
"""

    # -----------------------------------------------------
    # Placement Question
    # -----------------------------------------------------

    if (
        "placement" in question_lower
        or "campus" in question_lower
        or "job preparation" in question_lower
    ):

        return f"""
Here is a recommended placement preparation plan.

Your current background:
• Degree: {degree}
• Branch: {branch}
• Year: {year}
• CGPA: {cgpa}

Focus on these areas:

1. Programming
   • Python
   • Basic problem solving
   • Data structures

2. DSA
   • Arrays
   • Strings
   • Linked Lists
   • Stacks
   • Queues
   • Trees
   • Searching
   • Sorting

3. SQL
   • SELECT
   • JOIN
   • GROUP BY
   • Subqueries

4. Core Computer Science
   • DBMS
   • Operating Systems
   • Computer Networks
   • OOP

5. AI/ML
   • Machine learning algorithms
   • Model evaluation
   • Deep learning basics

6. Resume
   • Keep the resume concise.
   • Highlight projects.
   • Add internships.
   • Add certifications.
   • Add GitHub and LinkedIn.

7. Interview Preparation
   • Technical questions
   • HR questions
   • Project explanation
   • Aptitude
   • Coding problems

A good daily routine is:

DSA → SQL → Core CS → AI/ML → Project → Interview Practice
"""

    # -----------------------------------------------------
    # Resume Question
    # -----------------------------------------------------

    if (
        "resume" in question_lower
        or "cv" in question_lower
    ):

        return f"""
Here are recommendations for improving your resume.

Your current information:

Education:
{education}

Skills:
{skills}

Projects:
{projects}

Certifications:
{certifications}

Recommended resume structure:

1. Name and Contact Information

2. Career Objective / Summary

3. Education

4. Technical Skills

5. Projects

6. Internships / Experience

7. Certifications

8. Achievements

9. GitHub / LinkedIn / Portfolio

For AI/ML roles, highlight:

• Python
• NumPy
• Pandas
• Scikit-learn
• TensorFlow/PyTorch
• SQL
• Machine Learning
• Deep Learning
• AI projects

For each project, mention:

• Problem
• Technology
• Your contribution
• Result
"""

    # -----------------------------------------------------
    # Learning Path
    # -----------------------------------------------------

    if (
        "learn" in question_lower
        or "learning path" in question_lower
        or "study" in question_lower
        or "roadmap" in question_lower
    ):

        return """
Recommended AI/ML learning roadmap:

Phase 1:
Python fundamentals

Phase 2:
NumPy, Pandas and data visualization

Phase 3:
Statistics and mathematics

Phase 4:
Machine learning

Phase 5:
Deep learning

Phase 6:
Natural Language Processing / Computer Vision

Phase 7:
Real-world projects

Phase 8:
FastAPI, Docker and deployment

Phase 9:
DSA, SQL and placement preparation

Do not try to learn everything at once.

Complete one topic, practice it, and then build a small project.
"""

    # -----------------------------------------------------
    # Interview Question
    # -----------------------------------------------------

    if (
        "interview" in question_lower
        or "interviews" in question_lower
    ):

        return """
For AI/ML interview preparation, focus on:

1. Python
2. Data Structures
3. SQL
4. Statistics
5. Machine Learning
6. Deep Learning
7. Your projects
8. Resume questions
9. HR questions

Important ML topics:

• Supervised learning
• Unsupervised learning
• Regression
• Classification
• Overfitting
• Underfitting
• Bias and variance
• Cross-validation
• Confusion matrix
• Precision
• Recall
• F1-score

Most importantly, be able to explain every project mentioned on your resume.
"""

    # -----------------------------------------------------
    # Default Response
    # -----------------------------------------------------

    return f"""
I can help you with your career development.

Your current profile:

• Degree: {degree}
• Branch: {branch}
• Year: {year}
• CGPA: {cgpa}
• Skills: {skills}
• Projects: {projects}

You can ask me questions such as:

• Which career path is suitable for me?
• What skills should I learn for AI/ML?
• What projects should I build?
• How can I prepare for campus placements?
• How can I improve my resume?
• What should I learn next?
• How should I prepare for AI/ML interviews?

Please ask a specific career question so I can give you a more focused recommendation.
"""


# =========================================================
# API Endpoint
# =========================================================

@router.post("/")
def ask_career_assistant(
    data: CareerQuestion,
    db: Session = Depends(get_db)
):

    print("=" * 50)
    print("TEMPORARY AI CAREER ASSISTANT")
    print("User ID:", data.user_id)
    print("Question:", data.question)
    print("=" * 50)

    # -----------------------------------------------------
    # Validate question
    # -----------------------------------------------------

    question = data.question.strip()

    if not question:
        return {
            "success": False,
            "message": "Please enter a career question.",
            "response": "Please enter a career question."
        }

    # -----------------------------------------------------
    # Check user
    # -----------------------------------------------------

    user = db.query(User).filter(
        User.id == data.user_id
    ).first()

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    # -----------------------------------------------------
    # Get user profile
    # -----------------------------------------------------

    profile = db.query(Profile).filter(
        Profile.user_id == data.user_id
    ).first()

    if not profile:
        raise HTTPException(
            status_code=404,
            detail="Profile not found. Please complete your profile first."
        )

    # -----------------------------------------------------
    # Generate temporary AI response
    # -----------------------------------------------------

    try:

        response = generate_career_response(
            question,
            profile
        )

        print("Temporary AI response generated successfully.")

        return {
            "success": True,
            "question": question,
            "response": response
        }

    except Exception as error:

        print("=" * 50)
        print("TEMPORARY AI ERROR")
        print("ERROR:", error)
        print("=" * 50)

        return {
            "success": False,
            "question": question,
            "response": "Sorry, I could not generate a career response right now."
        }