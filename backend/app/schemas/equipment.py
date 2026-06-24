from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class EquipmentCreate(BaseModel):
    name: str
    category: str
    brand: Optional[str] = None
    model_number: Optional[str] = None
    serial_number: Optional[str] = None
    status: Optional[str] = "available"
    condition: Optional[str] = "good"
    assigned_to: Optional[str] = None
    reserved_for: Optional[str] = None
    notes: Optional[str] = None
    daily_rate: Optional[int] = None

class EquipmentUpdate(BaseModel):
    name: Optional[str] = None
    category: Optional[str] = None
    brand: Optional[str] = None
    model_number: Optional[str] = None
    serial_number: Optional[str] = None
    status: Optional[str] = None
    condition: Optional[str] = None
    assigned_to: Optional[str] = None
    reserved_for: Optional[str] = None
    notes: Optional[str] = None
    daily_rate: Optional[int] = None

class EquipmentOut(BaseModel):
    id: int
    name: str
    category: str
    brand: Optional[str]
    model_number: Optional[str]
    serial_number: Optional[str]
    status: str
    condition: str
    assigned_to: Optional[str]
    reserved_for: Optional[str]
    notes: Optional[str]
    daily_rate: Optional[int]
    created_at: datetime

    class Config:
        from_attributes = True