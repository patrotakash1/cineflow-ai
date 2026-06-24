from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from collections import defaultdict

router = APIRouter()

class Scene(BaseModel):
    scene_number: int
    heading: str
    location: str
    time_of_day: str
    characters: List[str]
    action: Optional[str] = ""

class ScheduleRequest(BaseModel):
    scenes: List[Scene]
    shoot_days: int
    call_time: str = "07:00 AM"
    wrap_time: str = "07:00 PM"
    project_name: str = "Shadows of Tomorrow"

class SceneSlot(BaseModel):
    scene_number: int
    heading: str
    location: str
    time_of_day: str
    characters: List[str]
    estimated_hours: float

class ShootDay(BaseModel):
    day_number: int
    date_label: str
    call_time: str
    wrap_time: str
    primary_location: str
    scenes: List[SceneSlot]
    total_scenes: int
    unique_locations: int
    all_characters: List[str]

def normalize_location(location: str) -> str:
    """Extract core location name for grouping"""
    loc = location.upper()
    loc = loc.replace("INT.", "").replace("EXT.", "").replace("INT/EXT.", "").strip()
    loc = loc.split("-")[0].strip()
    return loc

def estimate_scene_hours(scene: Scene) -> float:
    """Estimate shoot time based on scene complexity"""
    base = 1.0
    action_len = len(scene.action or "")
    if action_len > 300:
        base += 1.5
    elif action_len > 150:
        base += 0.75
    char_count = len(scene.characters)
    if char_count > 4:
        base += 1.0
    elif char_count > 2:
        base += 0.5
    if "NIGHT" in scene.time_of_day.upper():
        base += 0.5
    return round(base, 1)

@router.post("/generate")
def generate_schedule(request: ScheduleRequest):
    if request.shoot_days < 1:
        raise HTTPException(status_code=400, detail="Shoot days must be at least 1")
    if not request.scenes:
        raise HTTPException(status_code=400, detail="No scenes provided")

    # Group scenes by normalized location
    location_groups = defaultdict(list)
    for scene in request.scenes:
        loc_key = normalize_location(scene.location)
        location_groups[loc_key].append(scene)

    # Sort location groups by size (largest first — most efficient)
    sorted_groups = sorted(location_groups.items(), key=lambda x: len(x[1]), reverse=True)

    # Flatten scenes in location-grouped order
    grouped_scenes = []
    for loc, scenes in sorted_groups:
        grouped_scenes.extend(scenes)

    # Distribute across shoot days
    max_hours_per_day = 12.0
    shoot_days: List[ShootDay] = []
    current_day_scenes = []
    current_day_hours = 0.0
    day_number = 1

    for scene in grouped_scenes:
        hours = estimate_scene_hours(scene)

        # Start new day if over time limit or reached max scenes per day
        if current_day_hours + hours > max_hours_per_day and current_day_scenes:
            shoot_days.append(_build_day(day_number, current_day_scenes, request.call_time, request.wrap_time))
            day_number += 1
            current_day_scenes = []
            current_day_hours = 0.0

        current_day_scenes.append(scene)
        current_day_hours += hours

        # Force new day if we've hit the requested shoot days limit
        if day_number > request.shoot_days:
            break

    # Add remaining scenes to last day
    if current_day_scenes:
        shoot_days.append(_build_day(day_number, current_day_scenes, request.call_time, request.wrap_time))

    return {
        "project_name": request.project_name,
        "total_shoot_days": len(shoot_days),
        "total_scenes_scheduled": sum(d.total_scenes for d in shoot_days),
        "schedule": [d.dict() for d in shoot_days]
    }

def _build_day(day_number: int, scenes: List[Scene], call_time: str, wrap_time: str) -> ShootDay:
    all_chars = []
    locations = set()
    scene_slots = []

    for scene in scenes:
        hours = estimate_scene_hours(scene)
        scene_slots.append(SceneSlot(
            scene_number=scene.scene_number,
            heading=scene.heading,
            location=scene.location,
            time_of_day=scene.time_of_day,
            characters=scene.characters,
            estimated_hours=hours
        ))
        for char in scene.characters:
            if char not in all_chars:
                all_chars.append(char)
        locations.add(normalize_location(scene.location))

    primary_location = normalize_location(scenes[0].location) if scenes else "TBD"

    return ShootDay(
        day_number=day_number,
        date_label=f"Day {day_number}",
        call_time=call_time,
        wrap_time=wrap_time,
        primary_location=primary_location,
        scenes=scene_slots,
        total_scenes=len(scene_slots),
        unique_locations=len(locations),
        all_characters=all_chars
    )