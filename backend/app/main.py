import os

from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.database.database import engine, Base


# ============================================================
# Load Environment Variables
# ============================================================

load_dotenv()


# ============================================================
# Import Models
# ============================================================

from app.models.user import User
from app.models.resume import Resume
from app.models.profile import Profile


# ============================================================
# Import Routers
# ============================================================

from app.routers import auth
from app.routers import admin
from app.routers import resume
from app.routers import profile
from app.routers import career
from app.routers import roadmap
from app.routers import placement
from app.routers import ats
from app.routers.skill_gap import router as skill_gap_router
from app.routers import job_recommendation
from app.routers import learning_resources
from app.routers import dashboard
from app.routers import resume_builder
from app.routers import ai_career


# ============================================================
# Create Database Tables
# ============================================================

Base.metadata.create_all(bind=engine)


# ============================================================
# Create FastAPI Application
# ============================================================

app = FastAPI(
    title="AI Career Intelligence System",
    version="1.0.0",
    description=(
        "AI-powered Career Intelligence System using "
        "FastAPI, React, and PostgreSQL"
    )
)


# ============================================================
# CORS Configuration
# ============================================================

FRONTEND_URL = os.getenv(
    "FRONTEND_URL",
    "http://localhost:5173"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        FRONTEND_URL
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ============================================================
# Create Upload Directories
# ============================================================

os.makedirs("uploads", exist_ok=True)
os.makedirs("uploads/job_descriptions", exist_ok=True)


# ============================================================
# Static Files
# ============================================================

app.mount(
    "/uploads",
    StaticFiles(directory="uploads"),
    name="uploads"
)


# ============================================================
# Include Routers
# ============================================================

# ----------------------------
# Authentication
# ----------------------------
app.include_router(auth.router)


# ----------------------------
# Admin Dashboard
# ----------------------------
app.include_router(admin.router)


# ----------------------------
# User Profile
# ----------------------------
app.include_router(profile.router)


# ----------------------------
# Resume
# ----------------------------
app.include_router(resume.router)


# ----------------------------
# Career Recommendation
# ----------------------------
app.include_router(career.router)


# ----------------------------
# Career Roadmap
# ----------------------------
app.include_router(roadmap.router)


# ----------------------------
# Placement Readiness
# ----------------------------
app.include_router(placement.router)


# ----------------------------
# ATS Analysis
# ----------------------------
app.include_router(ats.router)


# ----------------------------
# Skill Gap Analysis
# ----------------------------
app.include_router(skill_gap_router)


# ----------------------------
# Job Recommendation
# ----------------------------
app.include_router(job_recommendation.router)


# ----------------------------
# Learning Resources
# ----------------------------
app.include_router(learning_resources.router)


# ----------------------------
# Dashboard
# ----------------------------
app.include_router(dashboard.router)


# ----------------------------
# Resume Builder
# ----------------------------
app.include_router(resume_builder.router)


# ----------------------------
# AI Career Assistance
# ----------------------------
app.include_router(ai_career.router)


# ============================================================
# Home API
# ============================================================

@app.get("/")
def home():
    return {
        "message": "Welcome to AI Career Intelligence System",
        "status": "Running Successfully"
    }