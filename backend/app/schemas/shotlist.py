from pydantic import BaseModel


class ShotRequest(BaseModel):

    scene_name: str

    description: str

    location: str

    time_of_day: str


class ShotOut(BaseModel):

    scene_name: str

    shot_type: str

    lens: str

    camera_movement: str

    duration: str

    priority: str

    class Config:

        from_attributes = True