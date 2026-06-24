from pydantic import BaseModel
from typing import Optional


class CategoryCreate(BaseModel):
    name: str
    allocated: float
    project_name: Optional[str] = "Shadows of Tomorrow"


class CategoryOut(BaseModel):
    id: int
    name: str
    allocated: float
    project_name: str
    spent: Optional[float] = 0.0

    class Config:
        from_attributes = True


class ExpenseCreate(BaseModel):
    category_id: int
    title: str
    amount: float
    vendor: Optional[str] = ""
    date: Optional[str] = ""
    notes: Optional[str] = ""


class ExpenseOut(BaseModel):
    id: int
    category_id: int
    title: str
    amount: float
    vendor: str
    date: str
    notes: str

    class Config:
        from_attributes = True