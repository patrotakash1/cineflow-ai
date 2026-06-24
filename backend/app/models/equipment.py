from sqlalchemy import Column, Integer, String, Text, DateTime
from sqlalchemy.sql import func
from app.database import Base

class Equipment(Base):
    __tablename__ = "equipment"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    category = Column(String, nullable=False)  # Camera, Lens, Lighting, Sound, Grip, Transport
    brand = Column(String, nullable=True)
    model_number = Column(String, nullable=True)
    serial_number = Column(String, nullable=True)
    status = Column(String, default="available")  # available, in_use, maintenance
    condition = Column(String, default="good")  # excellent, good, fair, poor
    assigned_to = Column(String, nullable=True)
    reserved_for = Column(String, nullable=True)  # shoot day or project name
    notes = Column(Text, nullable=True)
    daily_rate = Column(Integer, nullable=True)  # in rupees
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())