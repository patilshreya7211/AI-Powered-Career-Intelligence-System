from sqlalchemy import Column, Integer, String, DateTime, Boolean
from sqlalchemy.orm import relationship
from app.database.database import Base
from datetime import datetime


class User(Base):
    __tablename__ = "users"

    # ==========================================
    # Primary Key
    # ==========================================

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    # ==========================================
    # Personal Information
    # ==========================================

    full_name = Column(
        String,
        nullable=False
    )

    # ==========================================
    # Login Information
    # ==========================================

    email = Column(
        String,
        unique=True,
        index=True,
        nullable=False
    )

    password = Column(
        String,
        nullable=False
    )

    # ==========================================
    # User Role
    # ==========================================

    role = Column(
        String,
        nullable=False,
        default="user",
        server_default="user"
    )

    # ==========================================
    # Account Status
    # ==========================================
    # True  = user can access the system
    # False = user is deactivated

    is_active = Column(
        Boolean,
        nullable=False,
        default=True,
        server_default="true"
    )

    # ==========================================
    # Account Creation Time
    # ==========================================

    created_at = Column(
        DateTime,
        default=datetime.utcnow
    )

    # ==========================================
    # Resume Relationship
    # ==========================================

    resumes = relationship(
        "Resume",
        back_populates="user",
        cascade="all, delete-orphan"
    )

    # ==========================================
    # Profile Relationship
    # ==========================================

    profile = relationship(
        "Profile",
        back_populates="user",
        uselist=False,
        cascade="all, delete-orphan"
    )