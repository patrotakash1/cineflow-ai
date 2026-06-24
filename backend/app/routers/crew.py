from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models.crew import CrewTask, TaskComment
from app.schemas.crew import TaskCreate, TaskUpdate, TaskOut, CommentCreate, CommentOut

router = APIRouter()

# ── Tasks ──────────────────────────────────────────────

@router.get("/tasks", response_model=List[TaskOut])
def get_tasks(db: Session = Depends(get_db)):
    return db.query(CrewTask).order_by(CrewTask.created_at.desc()).all()

@router.post("/tasks", response_model=TaskOut)
def create_task(task: TaskCreate, db: Session = Depends(get_db)):
    new_task = CrewTask(**task.dict())
    db.add(new_task)
    db.commit()
    db.refresh(new_task)
    return new_task

@router.patch("/tasks/{task_id}", response_model=TaskOut)
def update_task(task_id: int, updates: TaskUpdate, db: Session = Depends(get_db)):
    task = db.query(CrewTask).filter(CrewTask.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    for field, value in updates.dict(exclude_unset=True).items():
        setattr(task, field, value)
    db.commit()
    db.refresh(task)
    return task

@router.delete("/tasks/{task_id}")
def delete_task(task_id: int, db: Session = Depends(get_db)):
    task = db.query(CrewTask).filter(CrewTask.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    db.delete(task)
    db.commit()
    return {"message": "Task deleted"}

# ── Comments ───────────────────────────────────────────

@router.post("/tasks/{task_id}/comments", response_model=CommentOut)
def add_comment(task_id: int, comment: CommentCreate, db: Session = Depends(get_db)):
    task = db.query(CrewTask).filter(CrewTask.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    new_comment = TaskComment(task_id=task_id, **comment.dict())
    db.add(new_comment)
    db.commit()
    db.refresh(new_comment)
    return new_comment

@router.get("/tasks/{task_id}/comments", response_model=List[CommentOut])
def get_comments(task_id: int, db: Session = Depends(get_db)):
    return db.query(TaskComment).filter(TaskComment.task_id == task_id).all()