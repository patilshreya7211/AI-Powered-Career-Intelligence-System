from sqlalchemy import Column, Integer, String, ForeignKey, Text
from sqlalchemy.orm import relationship

from app.database.database import Base


class Profile(Base):
    __tablename__ = "profiles"

    # ===========================
    # Primary Keys
    # ===========================

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True)

    # ===========================
    # Personal Information
    # ===========================

    phone = Column(String, nullable=True)
    dob = Column(String, nullable=True)
    gender = Column(String, nullable=True)
    location = Column(String, nullable=True)

    # ===========================
    # Higher Education
    # ===========================

    college = Column(String, nullable=True)
    degree = Column(String, nullable=True)
    branch = Column(String, nullable=True)
    year = Column(String, nullable=True)
    cgpa = Column(String, nullable=True)

    # ===========================
    # HSC Details
    # ===========================

    hsc_college = Column(String, nullable=True)
    hsc_board = Column(String, nullable=True)
    hsc_year = Column(String, nullable=True)
    hsc_percentage = Column(String, nullable=True)

    # ===========================
    # SSC Details
    # ===========================

    ssc_school = Column(String, nullable=True)
    ssc_board = Column(String, nullable=True)
    ssc_year = Column(String, nullable=True)
    ssc_percentage = Column(String, nullable=True)

    # ===========================
    # Professional Links
    # ===========================

    linkedin = Column(String, nullable=True)
    github = Column(String, nullable=True)
    portfolio = Column(String, nullable=True)

    # ===========================
    # Skills & About
    # ===========================

    skills = Column(Text, nullable=True)
    bio = Column(Text, nullable=True)

    # ===========================
    # Additional Information
    # ===========================

    education = Column(Text, nullable=True)
    projects = Column(Text, nullable=True)
    certifications = Column(Text, nullable=True)

    # ===========================
    # Profile Photo
    # ===========================

    photo = Column(String, nullable=True)

    # ===========================
    # Relationship
    # ===========================

    user = relationship("User", back_populates="profile")