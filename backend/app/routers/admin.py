from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.models.user import User


# ============================================================
# ADMIN ROUTER
# ============================================================

router = APIRouter(
    prefix="/admin",
    tags=["Admin"]
)


# ============================================================
# ADMIN ACCESS CHECK
# ============================================================

def verify_admin(
    user_id: int,
    db: Session = Depends(get_db)
):
    """
    Verify that the requested user is an administrator.
    """

    user = db.query(User).filter(
        User.id == user_id
    ).first()

    if not user:
        raise HTTPException(
            status_code=404,
            detail="Admin user not found"
        )

    if not user.role or user.role.lower() != "admin":
        raise HTTPException(
            status_code=403,
            detail="Admin access required"
        )

    return user


# ============================================================
# GET ALL USERS
# ============================================================

@router.get("/users")
def get_all_users(
    user_id: int,
    db: Session = Depends(get_db)
):
    """
    Get all registered users.
    Only admins can access this endpoint.
    """

    verify_admin(user_id, db)

    users = db.query(User).all()

    return {
        "success": True,
        "total_users": len(users),

        "users": [
            {
                "id": user.id,
                "full_name": user.full_name,
                "email": user.email,
                "role": user.role,
                "is_active": user.is_active,
                "created_at": user.created_at
            }
            for user in users
        ]
    }


# ============================================================
# GET USER COUNT
# ============================================================

@router.get("/users/count")
def get_user_count(
    user_id: int,
    db: Session = Depends(get_db)
):
    """
    Get total number of registered users.
    """

    verify_admin(user_id, db)

    total_users = db.query(User).count()

    return {
        "success": True,
        "total_users": total_users
    }


# ============================================================
# ADMIN ANALYTICS
# ============================================================

@router.get("/analytics")
def get_admin_analytics(
    user_id: int,
    db: Session = Depends(get_db)
):
    """
    Get important user statistics
    for the Admin Dashboard.
    """

    verify_admin(user_id, db)

    users = db.query(User).all()

    total_users = len(users)

    total_students = 0
    total_job_seekers = 0
    total_admins = 0
    active_users = 0
    inactive_users = 0

    for user in users:

        role = (user.role or "").strip().lower()

        if role == "student":
            total_students += 1

        elif role == "job seeker":
            total_job_seekers += 1

        elif role == "admin":
            total_admins += 1

        # User status
        if user.is_active:
            active_users += 1
        else:
            inactive_users += 1

    return {
        "success": True,

        "analytics": {
            "total_users": total_users,
            "total_students": total_students,
            "total_job_seekers": total_job_seekers,
            "total_admins": total_admins,
            "active_users": active_users,
            "inactive_users": inactive_users
        }
    }


# ============================================================
# GET ADMIN DASHBOARD STATUS
# ============================================================

@router.get("/status")
def admin_status(
    user_id: int,
    db: Session = Depends(get_db)
):
    """
    Get admin dashboard/application status.
    """

    admin = verify_admin(user_id, db)

    total_users = db.query(User).count()

    return {
        "success": True,

        "application": "AI Career Intelligence System",

        "status": "Running Successfully",

        "admin": {
            "id": admin.id,
            "full_name": admin.full_name,
            "email": admin.email,
            "role": admin.role,
            "is_active": admin.is_active
        },

        "total_users": total_users
    }


# ============================================================
# GET SINGLE USER
# ============================================================

@router.get("/users/{target_user_id}")
def get_single_user(
    target_user_id: int,
    user_id: int,
    db: Session = Depends(get_db)
):
    """
    Get details of a specific user.
    Only admins can view user details.
    """

    verify_admin(user_id, db)

    target_user = db.query(User).filter(
        User.id == target_user_id
    ).first()

    if not target_user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    return {
        "success": True,

        "user": {
            "id": target_user.id,
            "full_name": target_user.full_name,
            "email": target_user.email,
            "role": target_user.role,
            "is_active": target_user.is_active,
            "created_at": target_user.created_at
        }
    }


# ============================================================
# ACTIVATE / DEACTIVATE USER
# ============================================================

@router.put("/users/{target_user_id}/status")
def update_user_status(
    target_user_id: int,
    user_id: int,
    is_active: bool,
    db: Session = Depends(get_db)
):
    """
    Activate or deactivate a normal user.

    Example:

    Activate:
    PUT /admin/users/5/status?user_id=1&is_active=true

    Deactivate:
    PUT /admin/users/5/status?user_id=1&is_active=false
    """

    # --------------------------------------------------------
    # Verify requester is admin
    # --------------------------------------------------------

    admin = verify_admin(user_id, db)

    # --------------------------------------------------------
    # Prevent admin from changing their own status
    # --------------------------------------------------------

    if admin.id == target_user_id:
        raise HTTPException(
            status_code=400,
            detail="Admin cannot change their own account status"
        )

    # --------------------------------------------------------
    # Find target user
    # --------------------------------------------------------

    target_user = db.query(User).filter(
        User.id == target_user_id
    ).first()

    if not target_user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    # --------------------------------------------------------
    # Prevent changing another admin
    # --------------------------------------------------------

    if (
        target_user.role
        and target_user.role.lower() == "admin"
    ):
        raise HTTPException(
            status_code=403,
            detail="Admin account status cannot be changed"
        )

    # --------------------------------------------------------
    # Update status
    # --------------------------------------------------------

    target_user.is_active = is_active

    db.commit()
    db.refresh(target_user)

    # --------------------------------------------------------
    # Return response
    # --------------------------------------------------------

    return {
        "success": True,

        "message": (
            "User activated successfully"
            if is_active
            else "User deactivated successfully"
        ),

        "user": {
            "id": target_user.id,
            "full_name": target_user.full_name,
            "email": target_user.email,
            "role": target_user.role,
            "is_active": target_user.is_active
        }
    }


# ============================================================
# DELETE USER
# ============================================================

@router.delete("/users/{target_user_id}")
def delete_user(
    target_user_id: int,
    user_id: int,
    db: Session = Depends(get_db)
):
    """
    Delete a normal user.
    Admin accounts cannot be deleted.
    """

    # --------------------------------------------------------
    # Verify requester is admin
    # --------------------------------------------------------

    admin = verify_admin(user_id, db)

    # --------------------------------------------------------
    # Prevent admin from deleting themselves
    # --------------------------------------------------------

    if admin.id == target_user_id:
        raise HTTPException(
            status_code=400,
            detail="Admin cannot delete their own account"
        )

    # --------------------------------------------------------
    # Find target user
    # --------------------------------------------------------

    target_user = db.query(User).filter(
        User.id == target_user_id
    ).first()

    if not target_user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    # --------------------------------------------------------
    # Prevent deleting another admin
    # --------------------------------------------------------

    if (
        target_user.role
        and target_user.role.lower() == "admin"
    ):
        raise HTTPException(
            status_code=403,
            detail="Admin accounts cannot be deleted"
        )

    # --------------------------------------------------------
    # Delete user
    # --------------------------------------------------------

    db.delete(target_user)
    db.commit()

    # --------------------------------------------------------
    # Success response
    # --------------------------------------------------------

    return {
        "success": True,
        "message": "User deleted successfully",
        "deleted_user_id": target_user_id
    }