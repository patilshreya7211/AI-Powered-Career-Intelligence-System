from pydantic import BaseModel
from typing import Optional


# ==========================================
# Base Profile Schema
# ==========================================

class ProfileBase(BaseModel):

    # Personal Details
    phone: Optional[str] = None
    dob: Optional[str] = None
    gender: Optional[str] = None
    location: Optional[str] = None

    # ======================================
    # Higher Education
    # ======================================

    college: Optional[str] = None
    degree: Optional[str] = None
    branch: Optional[str] = None
    year: Optional[str] = None
    cgpa: Optional[str] = None

    # ======================================
    # HSC Details
    # ======================================

    hsc_college: Optional[str] = None
    hsc_board: Optional[str] = None
    hsc_year: Optional[str] = None
    hsc_percentage: Optional[str] = None

    # ======================================
    # SSC Details
    # ======================================

    ssc_school: Optional[str] = None
    ssc_board: Optional[str] = None
    ssc_year: Optional[str] = None
    ssc_percentage: Optional[str] = None

    # ======================================
    # Professional Links
    # ======================================

    linkedin: Optional[str] = None
    github: Optional[str] = None
    portfolio: Optional[str] = None

    # ======================================
    # Skills & About
    # ======================================

    skills: Optional[str] = None
    bio: Optional[str] = None

    # ======================================
    # Additional Information
    # ======================================

    education: Optional[str] = None
    projects: Optional[str] = None
    certifications: Optional[str] = None

    photo: Optional[str] = None


# ==========================================
# Create Profile
# ==========================================

class ProfileCreate(ProfileBase):
    user_id: int


# ==========================================
# Update Profile
# ==========================================

class ProfileUpdate(ProfileBase):
    pass


# ==========================================
# Response Schema
# ==========================================

class ProfileResponse(ProfileBase):
    id: int
    user_id: int

    class Config:
        from_attributes = True