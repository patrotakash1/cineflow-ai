from fastapi import APIRouter

from app.schemas.report import ReportRequest

from app.services.report_generator import generate_report


router = APIRouter()


@router.post("/generate")
def generate(data: ReportRequest):

    return {

        "summary": generate_report(data)

    }