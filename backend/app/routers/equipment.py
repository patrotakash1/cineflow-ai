from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database import get_db
from app.models.equipment import Equipment
from app.schemas.equipment import EquipmentCreate, EquipmentUpdate, EquipmentOut

router = APIRouter()

@router.get("/", response_model=List[EquipmentOut])
def get_equipment(category: Optional[str] = None, status: Optional[str] = None, db: Session = Depends(get_db)):
    query = db.query(Equipment)
    if category:
        query = query.filter(Equipment.category == category)
    if status:
        query = query.filter(Equipment.status == status)
    return query.order_by(Equipment.category, Equipment.name).all()

@router.post("/", response_model=EquipmentOut)
def create_equipment(item: EquipmentCreate, db: Session = Depends(get_db)):
    new_item = Equipment(**item.dict())
    db.add(new_item)
    db.commit()
    db.refresh(new_item)
    return new_item

@router.patch("/{item_id}", response_model=EquipmentOut)
def update_equipment(item_id: int, updates: EquipmentUpdate, db: Session = Depends(get_db)):
    item = db.query(Equipment).filter(Equipment.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Equipment not found")
    for field, value in updates.dict(exclude_unset=True).items():
        setattr(item, field, value)
    db.commit()
    db.refresh(item)
    return item

@router.delete("/{item_id}")
def delete_equipment(item_id: int, db: Session = Depends(get_db)):
    item = db.query(Equipment).filter(Equipment.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Equipment not found")
    db.delete(item)
    db.commit()
    return {"message": "Equipment deleted"}