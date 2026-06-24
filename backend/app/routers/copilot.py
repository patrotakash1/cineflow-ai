from fastapi import APIRouter

router = APIRouter()


@router.post("/ask")
def ask_ai(data: dict):

    question = data.get("question", "").lower()

    answer = ""

    if "budget" in question:

        answer = (
            "Reduce travel costs and merge shooting locations."
        )

    elif "crew" in question:

        answer = (
            "Lighting team has free capacity."
        )

    elif "schedule" in question:

        answer = (
            "Reschedule Scene 14 to Day 9."
        )

    elif "days" in question:

        answer = (
            "Current pace indicates completion in 6 days."
        )

    else:

        answer = (
            "No recommendation available."
        )

    return {

        "answer": answer

    }