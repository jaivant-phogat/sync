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

class TaskCreate(BaseModel):
    project_id: uuid.UUID
    title: str
    description: str | None = None
    assigned_to: uuid.UUID | None = None
    deadline: date | None = None
    estimated_effort: int | None = None

class TaskOut(BaseModel):
    id: uuid.UUID
    project_id: uuid.UUID
    title: str
    description: str | None = None
    assigned_to: uuid.UUID | None = None
    status: str
    deadline: date | None = None
    estimated_effort: int | None = None

    class Config:
        from_attributes = True

class TaskDependencyCreate(BaseModel):
    task_id: uuid.UUID
    depends_on_task_id: uuid.UUID

class TaskDependencyOut(BaseModel):
    task_id: uuid.UUID
    depends_on_task_id: uuid.UUID

    class Config:
        from_attributes = True