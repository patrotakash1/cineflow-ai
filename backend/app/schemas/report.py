from pydantic import BaseModel


class ReportRequest(BaseModel):

    date: str

    scenes_completed: int

    hours_worked: float

    crew_present: int

    expenses: float

    issues: str

    director_notes: str


class ReportOut(BaseModel):

    summary: list[str]