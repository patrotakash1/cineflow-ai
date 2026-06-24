def check_continuity(data):

    issues = []

    if data.time_of_day.lower() == "day":

        issues.append("✓ Day scene detected")

    else:

        issues.append("✓ Night scene detected")

    if len(data.costume) < 4:

        issues.append("⚠️ Costume details too short")

    else:

        issues.append("✓ Costume documented")

    if len(data.props) < 3:

        issues.append("⚠️ Props not specified")

    else:

        issues.append("✓ Props documented")

    if len(data.description) < 20:

        issues.append("⚠️ Scene description too short")

    else:

        issues.append("✓ Scene description valid")

    return issues