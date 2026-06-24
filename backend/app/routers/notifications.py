from fastapi import APIRouter

router = APIRouter()


@router.get("/")
def get_notifications():

    return [

        {

            "id":1,

            "type":"warning",

            "title":"Budget nearing limit",

            "message":"Lighting department reached 80%."

        },

        {

            "id":2,

            "type":"info",

            "title":"Schedule updated",

            "message":"Scene 17 moved to Day 9."

        },

        {

            "id":3,

            "type":"success",

            "title":"Crew task completed",

            "message":"Camera setup finished."

        }

    ]