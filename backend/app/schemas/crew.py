from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class CommentCreate(BaseModel):
    author: str
    content: str

class CommentOut(BaseModel):
    id: int
    task_id: int
    author: str
    content: str
    created_at: datetime

    class Config:
        from_attributes = True

class TaskCreate(BaseModel):
    title: str
    description: Optional[str] = None
    status: Optional[str] = "todo"
    priority: Optional[str] = "medium"
    department: Optional[str] = None
    assigned_to: Optional[str] = None
    due_date: Optional[str] = None

class TaskUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    status: Optional[str] = None
    priority: Optional[str] = None
    department: Optional[str] = None
    assigned_to: Optional[str] = None
    due_date: Optional[str] = None

class TaskOut(BaseModel):
    id: int
    title: str
    description: Optional[str]
    status: str
    priority: str
    department: Optional[str]
    assigned_to: Optional[str]
    due_date: Optional[str]
    created_at: datetime
    comments: List[CommentOut] = []

    class Config:
        from_attributes = True