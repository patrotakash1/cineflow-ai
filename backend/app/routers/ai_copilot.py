from fastapi import APIRouter, UploadFile, File, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from app.services.ai_copilot import chat_with_copilot, analyze_script_text, optimize_schedule
import pdfplumber
import io

router = APIRouter()


class Message(BaseModel):
    role: str
    content: str


class ChatRequest(BaseModel):
    message: str
    history: Optional[List[Message]] = []


class ScheduleRequest(BaseModel):
    scenes: list
    constraints: Optional[str] = ""


@router.post("/chat")
async def copilot_chat(req: ChatRequest):
    try:
        history = [{"role": m.role, "content": m.content} for m in req.history]
        reply = chat_with_copilot(history, req.message)
        return {"reply": reply, "role": "assistant"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/analyze-script")
async def analyze_script(file: UploadFile = File(...)):
    try:
        content = await file.read()
        text = ""

        if file.filename.endswith(".pdf"):
            with pdfplumber.open(io.BytesIO(content)) as pdf:
                for page in pdf.pages:
                    text += page.extract_text() or ""

        elif file.filename.endswith((".txt", ".fountain")):
            text = content.decode("utf-8")

        else:
            raise HTTPException(
                status_code=400,
                detail="Please upload a PDF or TXT file"
            )

        if not text.strip():
            raise HTTPException(
                status_code=400,
                detail="Could not extract text from file"
            )

        result = analyze_script_text(text)
        return {"success": True, "analysis": result}

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/optimize-schedule")
async def schedule_optimizer(req: ScheduleRequest):
    try:
        result = optimize_schedule(req.scenes, req.constraints)
        return {"schedule": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))