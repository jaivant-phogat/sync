from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session
from database import SessionLocal
import models
import schemas

app = FastAPI()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/")
def read_root():
    return {"message": "SYNC backend is running"}

@app.post("/users", response_model=schemas.UserOut)
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = models.User(name=user.name, email=user.email, role=user.role)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

@app.post("/projects", response_model=schemas.ProjectOut)
def create_project(project: schemas.ProjectCreate, db: Session = Depends(get_db)):
    db_project = models.Project(
        title=project.title,
        deadline=project.deadline,
        created_by=project.created_by
    )
    db.add(db_project)
    db.commit()
    db.refresh(db_project)
    return db_project

@app.post("/tasks", response_model=schemas.TaskOut)
def create_task(task: schemas.TaskCreate, db: Session = Depends(get_db)):
    db_task = models.Task(
        project_id=task.project_id,
        title=task.title,
        description=task.description,
        assigned_to=task.assigned_to,
        deadline=task.deadline,
        estimated_effort=task.estimated_effort
    )
    db.add(db_task)
    db.commit()
    db.refresh(db_task)
    return db_task

@app.post("/task_dependencies", response_model=schemas.TaskDependencyOut)
def create_task_dependency(dep: schemas.TaskDependencyCreate, db: Session = Depends(get_db)):
    db_dep = models.TaskDependency(
        task_id=dep.task_id,
        depends_on_task_id=dep.depends_on_task_id
    )
    db.add(db_dep)
    db.commit()
    db.refresh(db_dep)
    return db_dep

@app.post("/project_members", response_model=schemas.ProjectMemberOut)
def add_project_member(member: schemas.ProjectMemberCreate, db: Session = Depends(get_db)):
    db_member = models.ProjectMember(
        project_id=member.project_id,
        user_id=member.user_id
    )
    db.add(db_member)
    db.commit()
    db.refresh(db_member)
    return db_member

import risk_engine

@app.get("/projects/{project_id}/risk")
def get_project_risk(project_id: str, db: Session = Depends(get_db)):
    result = risk_engine.calculate_risk(project_id, db)
    if not result:
        return {"error": "Project not found"}
    return result

import interventions

@app.get("/projects/{project_id}/intervention")
def get_project_intervention(project_id: str, db: Session = Depends(get_db)):
    risk_data = risk_engine.calculate_risk(project_id, db)
    if not risk_data:
        return {"error": "Project not found"}
    result = interventions.generate_intervention(risk_data)
    return {**risk_data, **result}