from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List

from app.database import get_db
from app.models.budget import BudgetCategory, Expense
from app.schemas.budget import (
    CategoryCreate,
    CategoryOut,
    ExpenseCreate,
    ExpenseOut
)

router = APIRouter()


@router.post("/categories", response_model=CategoryOut)
def create_category(
    data: CategoryCreate,
    db: Session = Depends(get_db)
):
    category = BudgetCategory(**data.model_dump())

    db.add(category)
    db.commit()
    db.refresh(category)

    return {
        **category.__dict__,
        "spent": 0.0
    }


@router.get(
    "/categories",
    response_model=List[CategoryOut]
)
def get_categories(
    db: Session = Depends(get_db)
):
    categories = db.query(BudgetCategory).all()

    result = []

    for category in categories:

        spent = (
            db.query(func.sum(Expense.amount))
            .filter(
                Expense.category_id == category.id
            )
            .scalar()
            or 0.0
        )

        result.append(
            {
                **category.__dict__,
                "spent": spent
            }
        )

    return result


@router.post(
    "/expenses",
    response_model=ExpenseOut
)
def add_expense(
    data: ExpenseCreate,
    db: Session = Depends(get_db)
):

    category = (
        db.query(BudgetCategory)
        .filter(
            BudgetCategory.id == data.category_id
        )
        .first()
    )

    if not category:

        raise HTTPException(
            status_code=404,
            detail="Category not found"
        )

    expense = Expense(**data.model_dump())

    db.add(expense)

    db.commit()

    db.refresh(expense)

    return expense


@router.get(
    "/expenses",
    response_model=List[ExpenseOut]
)
def get_expenses(
    db: Session = Depends(get_db)
):
    return (
        db.query(Expense)
        .order_by(
            Expense.created_at.desc()
        )
        .all()
    )


@router.get("/summary")
def get_summary(
    db: Session = Depends(get_db)
):

    categories = db.query(BudgetCategory).all()

    total_allocated = sum(
        category.allocated
        for category in categories
    )

    total_spent = (
        db.query(func.sum(Expense.amount))
        .scalar()
        or 0.0
    )

    over_budget = []

    for category in categories:

        spent = (
            db.query(func.sum(Expense.amount))
            .filter(
                Expense.category_id == category.id
            )
            .scalar()
            or 0.0
        )

        if spent > category.allocated:

            over_budget.append(
                {
                    "category": category.name,
                    "over_by": spent - category.allocated
                }
            )

    return {
        "total_allocated": total_allocated,
        "total_spent": total_spent,
        "remaining": total_allocated - total_spent,
        "percent_used": round(
            (total_spent / total_allocated * 100),
            1
        )
        if total_allocated > 0
        else 0,
        "over_budget_categories": over_budget
    }


@router.delete("/expenses/{expense_id}")
def delete_expense(
    expense_id: int,
    db: Session = Depends(get_db)
):

    expense = (
        db.query(Expense)
        .filter(
            Expense.id == expense_id
        )
        .first()
    )

    if not expense:

        raise HTTPException(
            status_code=404,
            detail="Expense not found"
        )

    db.delete(expense)

    db.commit()

    return {
        "message": "Deleted"
    }