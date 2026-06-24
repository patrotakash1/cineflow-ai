from sqlalchemy import (
    Column,
    Integer,
    String,
    Text,
    DateTime
)

from sqlalchemy.sql import func

from app.database import Base


class ContinuityReport(Base):

    __tablename__ = "continuity_reports"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    scene_number = Column(
        String,
        nullable=False
    )

    description = Column(
        Text,
        nullable=False
    )

    costume = Column(
        String,
        nullable=False
    )

    props = Column(
        String,
        nullable=False
    )

    time_of_day = Column(
        String,
        nullable=False
    )

    report = Column(
        Text,
        default=""
    )

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )