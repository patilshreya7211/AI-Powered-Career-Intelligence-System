from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.models.profile import Profile
from app.models.user import User
from app.schemas.profile import ProfileCreate, ProfileUpdate

router = APIRouter(
    prefix="/profile",
    tags=["Profile"]
)

# ==========================================
# Create Profile
# ==========================================

@router.post("/create")
def create_profile(profile: ProfileCreate, db: Session = Depends(get_db)):

    # Check whether user exists
    user = db.query(User).filter(User.id == profile.user_id).first()

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    # Check if profile already exists
    existing = db.query(Profile).filter(
        Profile.user_id == profile.user_id
    ).first()

    if existing:
        raise HTTPException(
            status_code=400,
            detail="Profile already exists"
        )

    # Create new profile
    new_profile = Profile(**profile.model_dump())

    db.add(new_profile)
    db.commit()
    db.refresh(new_profile)

    return {
        "success": True,
        "message": "Profile created successfully",
        "profile": new_profile
    }


# ==========================================
# Get Profile
# ==========================================

@router.get("/{user_id}")
def get_profile(user_id: int, db: Session = Depends(get_db)):

    profile = db.query(Profile).filter(
        Profile.user_id == user_id
    ).first()

    if not profile:
        raise HTTPException(
            status_code=404,
            detail="Profile not found"
        )

    return profile


# ==========================================
# Update Profile (Auto Create)
# ==========================================

@router.put("/update/{user_id}")
def update_profile(
    user_id: int,
    profile: ProfileUpdate,
    db: Session = Depends(get_db)
):

    # Check whether user exists
    user = db.query(User).filter(
        User.id == user_id
    ).first()

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    # Check whether profile exists
    existing = db.query(Profile).filter(
        Profile.user_id == user_id
    ).first()

    # If profile doesn't exist, create it
    if not existing:

        existing = Profile(user_id=user_id)

        db.add(existing)
        db.commit()
        db.refresh(existing)

    # Update only provided fields
    update_data = profile.model_dump(exclude_unset=True)

    for key, value in update_data.items():
        if value is not None:
            setattr(existing, key, value)

    db.commit()
    db.refresh(existing)

    return {
        "success": True,
        "message": "Profile saved successfully",
        "profile": existing
    }


# ==========================================
# Delete Profile
# ==========================================

@router.delete("/delete/{user_id}")
def delete_profile(
    user_id: int,
    db: Session = Depends(get_db)
):

    profile = db.query(Profile).filter(
        Profile.user_id == user_id
    ).first()

    if not profile:
        raise HTTPException(
            status_code=404,
            detail="Profile not found"
        )

    db.delete(profile)
    db.commit()

    return {
        "success": True,
        "message": "Profile deleted successfully"
    }