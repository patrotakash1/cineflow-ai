from fastapi import APIRouter, UploadFile, File, HTTPException
from typing import List
import pdfplumber
import docx
import io
import re

router = APIRouter()

def extract_text_from_pdf(file_bytes: bytes) -> str:
    text = ""
    with pdfplumber.open(io.BytesIO(file_bytes)) as pdf:
        for page in pdf.pages:
            page_text = page.extract_text()
            if page_text:
                text += page_text + "\n"
    return text

def extract_text_from_docx(file_bytes: bytes) -> str:
    doc = docx.Document(io.BytesIO(file_bytes))
    return "\n".join([para.text for para in doc.paragraphs])

def parse_scenes(text: str) -> List[dict]:
    scenes = []
    lines = text.split("\n")
    current_scene = None
    scene_number = 0

    for line in lines:
        line = line.strip()
        if not line:
            continue

        # Detect scene headings: INT. or EXT.
        if re.match(r'^(INT\.|EXT\.|INT\/EXT\.|EXT\/INT\.)', line, re.IGNORECASE):
            if current_scene:
                scenes.append(current_scene)

            scene_number += 1

            # Try to split location and time of day
            parts = line.split(" - ")
            location = parts[0].strip() if parts else line
            time_of_day = parts[1].strip() if len(parts) > 1 else "UNSPECIFIED"

            current_scene = {
                "scene_number": scene_number,
                "heading": line,
                "location": location,
                "time_of_day": time_of_day,
                "characters": [],
                "action": ""
            }

        elif current_scene:
            # Detect character names (ALL CAPS short lines)
            if line.isupper() and len(line.split()) <= 4 and len(line) > 1:
                if line not in current_scene["characters"]:
                    current_scene["characters"].append(line)
            else:
                # Add to action/description
                if current_scene["action"]:
                    current_scene["action"] += " " + line
                else:
                    current_scene["action"] = line

    # Don't forget the last scene
    if current_scene:
        scenes.append(current_scene)

    return scenes

@router.post("/upload")
async def upload_script(file: UploadFile = File(...)):
    filename = file.filename.lower()

    if not (filename.endswith(".pdf") or filename.endswith(".docx")):
        raise HTTPException(status_code=400, detail="Only PDF and DOCX files are supported.")

    file_bytes = await file.read()

    try:
        if filename.endswith(".pdf"):
            text = extract_text_from_pdf(file_bytes)
        else:
            text = extract_text_from_docx(file_bytes)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to read file: {str(e)}")

    if not text.strip():
        raise HTTPException(status_code=400, detail="Could not extract text from the file. Is it a scanned image PDF?")

    scenes = parse_scenes(text)

    return {
        "filename": file.filename,
        "total_scenes": len(scenes),
        "scenes": scenes
    }