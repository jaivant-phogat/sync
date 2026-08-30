from pydantic import BaseModel, EmailStr
import uuid
from datetime import date

class UserCreate(BaseModel):
    name: str
    email: EmailStr
    role: str

class UserOut(BaseModel):
    id: uuid.UUID
    name: str
    email: str
    role: str

    class Config:
        from_attributes = True

class ProjectCreate(BaseModel):
    title: str
    deadline: date | None = None
    created_by: uuid.UUID

class ProjectOut(BaseModel):
    id: uuid.UUID
    title: str
    deadline: date | None = None
    created_by: uuid.UUID
    status: str

    class Config:
        from_attributes = True
