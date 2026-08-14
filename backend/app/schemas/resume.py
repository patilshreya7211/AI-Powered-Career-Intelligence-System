from pydantic import BaseModel
from datetime import datetime


class ResumeCreate(BaseModel):
    title: str
    file_url: str


class ResumeResponse(BaseModel):
    id: int
    title: str
    file_url: str
    uploaded_at: datetime
    user_id: int

    class Config:
        from_attributes = True