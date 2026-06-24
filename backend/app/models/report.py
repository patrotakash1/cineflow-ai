from sqlalchemy import (
    Column,
    Integer,
    String,
    Float,
    Text,
    DateTime
)

from sqlalchemy.sql import func

from app.database import Base


class DailyReport(Base):

    __tablename__ = "daily_reports"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    date = Column(
        String,
        nullable=False
    )

    scenes_completed = Column(
        Integer,
        default=0
    )

    hours_worked = Column(
        Float,
        default=0.0
    )

    crew_present = Column(
        Integer,
        default=0
    )

    expenses = Column(
        Float,
        default=0.0
    )

    issues = Column(
        Text,
        default=""
    )

    director_notes = Column(
        Text,
        default=""
    )

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )