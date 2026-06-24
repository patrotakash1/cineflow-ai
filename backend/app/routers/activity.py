from fastapi import APIRouter

router = APIRouter()


@router.get("/")
def get_activity():

    return [

        {
            "title": "Scene 14 rescheduled",
            "time": "10 mins ago"
        },

        {
            "title": "Budget updated",
            "time": "25 mins ago"
        },

        {
            "title": "Shot list generated",
            "time": "1 hour ago"
        },

        {
            "title": "Crew task completed",
            "time": "2 hours ago"
        }

    ]