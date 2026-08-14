from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.models.user import User
from app.schemas.user import UserCreate, UserLogin, UserResponse
from app.services.auth import hash_password, verify_password


router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)


# ============================================================
# Register API
# ============================================================

@router.post("/register", response_model=UserResponse)
def register_user(
    user: UserCreate,
    db: Session = Depends(get_db)
):

    # --------------------------------------------------------
    # Check whether email already exists
    # --------------------------------------------------------

    existing_user = db.query(User).filter(
        User.email == user.email
    ).first()

    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="Email already registered"
        )

    # --------------------------------------------------------
    # Get requested role
    # --------------------------------------------------------

    requested_role = user.role.strip()

    # --------------------------------------------------------
    # Security:
    # Users are NOT allowed to create an Admin account
    # through normal registration.
    #
    # Admin accounts must be created/assigned separately.
    # --------------------------------------------------------

    if requested_role.lower() == "admin":
        raise HTTPException(
            status_code=403,
            detail="Admin accounts cannot be created through registration"
        )

    # --------------------------------------------------------
    # Allow only normal user roles
    # --------------------------------------------------------

    allowed_roles = {
        "student": "Student",
        "job seeker": "Job Seeker"
    }

    normalized_role = requested_role.lower()

    if normalized_role not in allowed_roles:
        # If no valid role is provided, make it Student
        final_role = "Student"
    else:
        final_role = allowed_roles[normalized_role]

    # --------------------------------------------------------
    # Create new user
    # --------------------------------------------------------

    new_user = User(
        full_name=user.full_name,
        email=user.email,
        password=hash_password(user.password),
        role=final_role
    )

    # --------------------------------------------------------
    # Save user
    # --------------------------------------------------------

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return new_user


# ============================================================
# Login API
# ============================================================

@router.post("/login")
def login_user(
    user: UserLogin,
    db: Session = Depends(get_db)
):

    # --------------------------------------------------------
    # Find user by email
    # --------------------------------------------------------

    existing_user = db.query(User).filter(
        User.email == user.email
    ).first()

    if not existing_user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    # --------------------------------------------------------
    # Verify password
    # --------------------------------------------------------

    if not verify_password(
        user.password,
        existing_user.password
    ):
        raise HTTPException(
            status_code=401,
            detail="Invalid password"
        )

    # --------------------------------------------------------
    # Get user role
    # --------------------------------------------------------

    user_role = existing_user.role

    # --------------------------------------------------------
    # Login successful
    # --------------------------------------------------------

    return {
        "success": True,
        "message": "Login Successful",

        # Role is also returned at top level
        # so React can easily access it.
        "role": user_role,

        "user": {
            "id": existing_user.id,
            "full_name": existing_user.full_name,
            "email": existing_user.email,
            "role": user_role
        }
    }


# ============================================================
# Get User Profile
# ============================================================

@router.get(
    "/profile/{user_id}",
    response_model=UserResponse
)
def get_profile(
    user_id: int,
    db: Session = Depends(get_db)
):

    # --------------------------------------------------------
    # Find user
    # --------------------------------------------------------

    user = db.query(User).filter(
        User.id == user_id
    ).first()

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    return user


# ============================================================
# Logout API
# ============================================================

@router.post("/logout")
def logout_user():
    """
    Since login information is stored in localStorage,
    logout is handled by the frontend.

    This endpoint simply confirms logout success.
    """

    return {
        "success": True,
        "message": "Logout Successful"
    }