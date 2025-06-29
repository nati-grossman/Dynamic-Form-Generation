from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from config import ALLOWED_ORIGINS, HOST, PORT, DEBUG
from routers import forms, submissions, statistics
from database import create_tables

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Lifespan events for the application"""
    # Startup
    try:
        create_tables()
    except Exception as e:
        # Server will run without database functionality
        pass
    
    yield
    
    # Shutdown
    pass

app = FastAPI(
    title="Dynamic Form Generator API",
    description="API for generating and managing dynamic forms",
    version="1.0.0",
    debug=DEBUG,
    lifespan=lifespan
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(forms.router)
app.include_router(submissions.router)
app.include_router(statistics.router)

@app.get("/")
def read_root():
    return {
        "message": "Dynamic Form Generator API",
        "version": "1.0.0",
        "docs": "/docs"
    }

@app.get("/health")
def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host=HOST, port=PORT, reload=DEBUG)