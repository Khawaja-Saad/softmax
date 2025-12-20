from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from config import settings
from database import Base, engine
from app.routes import auth, academic, projects, cv, opportunities, chat

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="AI-Powered Student Career & Learning Co-Pilot"
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {
        "message": "Welcome to EduPilot API",
        "version": settings.APP_VERSION,
        "status": "running"
    }

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

# Register routers
app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(academic.router, prefix="/api/academic", tags=["Academic"])
app.include_router(projects.router, prefix="/api/projects", tags=["Projects"])
app.include_router(cv.router, prefix="/api/cv", tags=["CV"])
app.include_router(opportunities.router, prefix="/api/opportunities", tags=["Opportunities"])
app.include_router(chat.router, tags=["Chat"])

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
