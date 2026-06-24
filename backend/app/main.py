from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import Base, engine

from app.models import user
from app.models import budget
from app.models import crew
from app.models import equipment

from app.routers import auth
from app.routers import budget as budget_router
from app.routers import script as script_router
from app.routers import schedule as schedule_router
from app.routers import crew as crew_router
from app.routers import equipment as equipment_router
from app.models import shotlist

from app.routers.shotlist import router as shotlist_router
from app.models import continuity

from app.routers.continuity import router as continuity_router
from app.models import report

from app.routers.report import router as report_router
from app.routers.analytics import router as analytics_router
from app.routers import copilot
from app.routers import activity
from app.routers import dashboard
from app.routers import notifications
from app.routers import ai_copilot



Base.metadata.create_all(bind=engine)


app = FastAPI(
    title="CineFlow AI API",
    description="Film production operating system",
    version="1.0.0"
)

app.include_router(
    notifications.router,
    prefix="/api/notifications",
    tags=["notifications"]
)

app.include_router(ai_copilot.router, prefix="/api/ai", tags=["AI Copilot"])

app.include_router(
    dashboard.router,
    prefix="/api/dashboard",
    tags=["dashboard"]
)

app.include_router(

    shotlist_router,

    prefix="/api/shotlist",

    tags=["shotlist"]

)
app.include_router(
    copilot.router,
    prefix="/api/copilot",
    tags=["copilot"]
)
app.include_router(
    activity.router,
    prefix="/api/activity",
    tags=["activity"]
)


app.include_router(

    analytics_router,

    prefix="/api/analytics",

    tags=["analytics"]

)

app.include_router(

    continuity_router,

    prefix="/api/continuity",

    tags=["continuity"]

)

app.include_router(

    report_router,

    prefix="/api/reports",

    tags=["reports"]

)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],),


app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(budget_router.router, prefix="/api/budget", tags=["budget"])
app.include_router(script_router.router, prefix="/api/script", tags=["script"])
app.include_router(schedule_router.router, prefix="/api/schedule", tags=["schedule"])
app.include_router(crew_router.router, prefix="/api/crew", tags=["crew"])
app.include_router(equipment_router.router, prefix="/api/equipment", tags=["equipment"])


@app.get("/")
def root():
    return {"message": "CineFlow AI is running", "status": "ok"}


@app.get("/health")
def health():
    return {"status": "healthy"}