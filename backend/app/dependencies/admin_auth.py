from fastapi import Depends, HTTPException, Header
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.models.user import User


def get_current_admin(
    x_user_id: int = Header(...),
    db: Session = Depends(get_db)
):
    """
    Verify that the logged-in user exists
    and has Admin role.
    """

    user = db.query(User).filter(
        User.id == x_user_id
    ).first()

    # User does not exist
    if not user:
        raise HTTPException(
            status_code=401,
            detail="User not authenticated"
        )

    # Check admin role
    if user.role.lower() != "admin":
        raise HTTPException(
            status_code=403,
            detail="Admin access required"
        )

    return user