from datetime import date
from sqlalchemy.orm import Session
import models

def calculate_risk(project_id, db: Session):
    project = db.query(models.Project).filter(models.Project.id == project_id).first()
    if not project:
        return None

    tasks = db.query(models.Task).filter(models.Task.project_id == project_id).all()
    dependencies = db.query(models.TaskDependency).join(
        models.Task, models.TaskDependency.depends_on_task_id == models.Task.id
    ).filter(models.Task.project_id == project_id).all()

    today = date.today()
    score = 0
    reasons = []

    # 1. Overdue tasks
    overdue_tasks = [t for t in tasks if t.status != "approved" and t.deadline and t.deadline < today]
    for t in overdue_tasks:
        score += 15
        reasons.append(f"'{t.title}' is overdue")

    # 2. Blocked dependencies (overdue task blocking others)
    blocked_count = 0
    for dep in dependencies:
        blocking_task = next((t for t in tasks if t.id == dep.depends_on_task_id), None)
        if blocking_task and blocking_task in overdue_tasks:
            blocked_count += 1
    if blocked_count > 0:
        score += blocked_count * 10
        reasons.append(f"{blocked_count} task(s) blocked by overdue work")

    # 3. Deadline pressure: incomplete tasks vs time remaining
    if project.deadline:
        days_remaining = (project.deadline - today).days
        incomplete = [t for t in tasks if t.status != "approved"]
        if days_remaining <= 7 and len(incomplete) > len(tasks) * 0.5:
            score += 20
            reasons.append("Less than a week left with over half the tasks incomplete")

    # 4. Workload imbalance
    effort_by_user = {}
    for t in tasks:
        if t.assigned_to and t.estimated_effort:
            effort_by_user[t.assigned_to] = effort_by_user.get(t.assigned_to, 0) + t.estimated_effort
    if effort_by_user:
        max_effort = max(effort_by_user.values())
        total_effort = sum(effort_by_user.values())
        if total_effort > 0 and max_effort / total_effort > 0.5 and len(effort_by_user) > 1:
            score += 15
            reasons.append("Workload is imbalanced across team members")

    score = min(score, 100)

    if score <= 30:
        status = "healthy"
    elif score <= 60:
        status = "at_risk"
    else:
        status = "critical"

    return {
        "project_id": str(project_id),
        "risk_score": score,
        "status": status,
        "reasons": reasons
    }