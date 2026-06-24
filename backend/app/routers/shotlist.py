from fastapi import APIRouter

from app.schemas.shotlist import ShotRequest

from app.services.shot_generator import generate_shots


router = APIRouter()


@router.post("/generate")
def generate(data: ShotRequest):

    shots = generate_shots(data)

    return {

        "scene": data.scene_name,

        "shots": shots

    }