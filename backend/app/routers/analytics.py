from fastapi import APIRouter

router = APIRouter()


@router.get("/overview")
def overview():

    return {

        "total_budget": 2900000,

        "spent": 1240000,

        "remaining": 1660000,

        "scenes_completed": 34,

        "total_scenes": 58,

        "crew_active": 24,

        "crew_total": 28,

        "shoot_days": 18,

        "shoot_total": 32,

        "alerts": [

            "⚠️ Actor unavailable on Day 19",

            "⚠️ Lighting budget nearing limit"

        ]

    }