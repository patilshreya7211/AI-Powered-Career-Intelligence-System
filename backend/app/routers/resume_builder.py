from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter(
    prefix="/resume-builder",
    tags=["Resume Builder"]
)


class ResumeBuilderRequest(BaseModel):
    user_id: int
    resume_text: str


@router.post("/create")
def create_resume(data: ResumeBuilderRequest):

    print("User ID:", data.user_id)
    print("Resume Information:")
    print(data.resume_text)

    return {
        "success": True,
        "message": "Resume information received successfully.",
        "data": {
            "user_id": data.user_id,
            "resume_text": data.resume_text
        }
    }
    