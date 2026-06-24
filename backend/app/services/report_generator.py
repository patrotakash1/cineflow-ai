def generate_report(data):

    summary = []

    summary.append(
        f"🎬 Scenes completed: {data.scenes_completed}"
    )

    summary.append(
        f"⏱️ Hours worked: {data.hours_worked}"
    )

    summary.append(
        f"👥 Crew present: {data.crew_present}"
    )

    summary.append(
        f"💰 Expenses: ₹{data.expenses}"
    )

    if data.issues:

        summary.append(

            f"⚠️ Issues: {data.issues}"

        )

    else:

        summary.append(

            "✅ No production issues"

        )

    if data.director_notes:

        summary.append(

            f"📝 Notes: {data.director_notes}"

        )

    return summary