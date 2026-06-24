from sqlalchemy import (
    Column,
    Integer,
    String,
    Float,
    DateTime,
    ForeignKey
)

from sqlalchemy.sql import func

from app.database import Base


class BudgetCategory(Base):

    __tablename__ = "budget_categories"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    name = Column(
        String,
        nullable=False
    )

    allocated = Column(
        Float,
        default=0.0
    )

    project_name = Column(
        String,
        default="Shadows of Tomorrow"
    )

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )


class Expense(Base):

    __tablename__ = "expenses"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    category_id = Column(
        Integer,
        ForeignKey("budget_categories.id")
    )

    title = Column(
        String,
        nullable=False
    )

    amount = Column(
        Float,
        nullable=False
    )

    vendor = Column(
        String,
        default=""
    )

    date = Column(
        String,
        default=""
    )

    notes = Column(
        String,
        default=""
    )

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )