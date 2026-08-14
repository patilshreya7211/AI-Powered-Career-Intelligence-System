from fastapi import APIRouter
from app.ai.dashboard import generate_dashboard_data

router = APIRouter(
    prefix="/dashboard",
    tags=["Dashboard"]
)

@router.get("/")
def dashboard():

    return {
        "success": True,
        "message": "Dashboard Loaded Successfully",
        "data": generate_dashboard_data()
    }