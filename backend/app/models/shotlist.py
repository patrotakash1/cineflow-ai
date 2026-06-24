from sqlalchemy import (
    Column,
    Integer,
    String,
    Text,
    DateTime
)

from sqlalchemy.sql import func

from app.database import Base


class ShotList(Base):

    __tablename__ = "shotlists"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    scene_name = Column(
        String,
        nullable=False
    )

    description = Column(
        Text,
        nullable=False
    )

    location = Column(
        String,
        nullable=False
    )

    time_of_day = Column(
        String,
        default="Day"
    )

    shot_type = Column(
        String,
        nullable=False
    )

    lens = Column(
        String,
        nullable=False
    )

    camera_movement = Column(
        String,
        nullable=False
    )

    duration = Column(
        String,
        nullable=False
    )

    priority = Column(
        String,
        default="Medium"
    )

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )