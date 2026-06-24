from fastapi import APIRouter

router = APIRouter()


@router.get("/")
def dashboard_data():

    return {

        "stats": {

            "scenes_completed": 34,

            "total_scenes": 58,

            "budget_used": "₹12.4L",

            "budget_total": "₹22L",

            "shoot_days": "18 / 32",

            "crew_active": 24

        },

        "health": {

            "score": 91,

            "message": "On track to finish 2 days early."

        },

        "ai_insight": {

            "title": "Schedule conflict detected",

            "message": "Actor double-booked on Day 7. Moving scene to Day 9 saves ₹18,000."

        },

        "activity": [

            {

                "title":"Scene 14 rescheduled",

                "time":"10 mins ago"

            },

            {

                "title":"Budget updated",

                "time":"25 mins ago"

            },

            {

                "title":"Crew task completed",

                "time":"1 hour ago"

            }

        ]

    }