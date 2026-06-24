from pydantic import BaseModel


class ContinuityRequest(BaseModel):

    scene_number: str

    description: str

    costume: str

    props: str

    time_of_day: str


class ContinuityOut(BaseModel):

    issues: list[str]