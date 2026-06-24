from fastapi import APIRouter

router = APIRouter()


@router.post("/check")
def continuity_check(data: dict):

    previous_scene = data.get("previous_scene", {})

    current_scene = data.get("current_scene", {})

    issues = []

    if previous_scene.get("shirt_color") != current_scene.get("shirt_color"):

        issues.append(
            "Actor shirt color changed"
        )

    if previous_scene.get("hairstyle") != current_scene.get("hairstyle"):

        issues.append(
            "Hairstyle mismatch"
        )

    if previous_scene.get("prop") != current_scene.get("prop"):

        issues.append(
            "Prop placement mismatch"
        )

    if previous_scene.get("time_of_day") != current_scene.get("time_of_day"):

        issues.append(
            "Day/Night continuity mismatch"
        )

    if not issues:

        issues.append(
            "No continuity issues detected"
        )

    return {
        "issues": issues
    }