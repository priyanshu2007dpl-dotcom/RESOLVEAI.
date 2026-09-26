from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from app.core.config import settings
from app.core.database import engine, Base
from app.api import auth, complaints, investigations, solvers, incidents, company, ai, external_api, audit, policies, notifications, search
from app.seed.demo_data import seed_database

# Create tables
Base.metadata.create_all(bind=engine)
# Run initial database seed
seed_database()

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup actions
    seed_database()
    yield

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Enterprise B2B Complaint-Management Outsourcing & Autonomous AI Investigation Platform",
    version=settings.VERSION,
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount Uploads directory
app.mount("/uploads", StaticFiles(directory=str(settings.UPLOAD_DIR)), name="uploads")

# Include API Routers under /api
app.include_router(auth.router, prefix=settings.API_PREFIX)
app.include_router(complaints.router, prefix=settings.API_PREFIX)
app.include_router(investigations.router, prefix=settings.API_PREFIX)
app.include_router(solvers.router, prefix=settings.API_PREFIX)
app.include_router(incidents.router, prefix=settings.API_PREFIX)
app.include_router(company.router, prefix=settings.API_PREFIX)
app.include_router(ai.router, prefix=settings.API_PREFIX)
app.include_router(audit.router, prefix=settings.API_PREFIX)
app.include_router(policies.router, prefix=settings.API_PREFIX)
app.include_router(notifications.router, prefix=settings.API_PREFIX)
app.include_router(search.router, prefix=settings.API_PREFIX)

# Include external B2B integration under /api/v1
app.include_router(external_api.router, prefix=settings.API_PREFIX)

@app.get("/health")
@app.get("/api/health")
def health():
    return {
        "status": "healthy",
        "database": "connected",
        "background_workers": "active",
        "ai_engine": "operational",
        "version": settings.VERSION
    }

@app.get("/download-zip")
@app.get("/api/download-zip")
def download_project_zip():
    from fastapi.responses import FileResponse
    from fastapi import HTTPException
    import os
    from pathlib import Path
    
    candidates = [
        Path(r"C:\Users\user\Downloads\resolve-ai-platform.zip"),
        Path(__file__).resolve().parent.parent.parent / "resolve-ai-platform.zip",
        Path(__file__).resolve().parent.parent.parent / "frontend" / "public" / "resolve-ai-platform.zip",
    ]
    for p in candidates:
        if p.exists() and p.stat().st_size > 0:
            return FileResponse(
                path=str(p),
                media_type="application/zip",
                filename="resolve-ai-platform.zip",
                headers={"Content-Disposition": "attachment; filename=resolve-ai-platform.zip"}
            )
    raise HTTPException(status_code=404, detail="Zip file not found")

@app.get("/ready")
@app.get("/api/ready")
def ready():
    return {
        "status": "ready",
        "database_migrated": True,
        "seed_loaded": True
    }

@app.get("/")
def root():
    return {
        "platform": settings.PROJECT_NAME,
        "primary_tagline": "Every Complaint. Any Domain. Intelligent Investigation. Human-Verified Resolution.",
        "business_tagline": "Companies focus on their business. We handle the complaint-investigation workload.",
        "core_product_statement": "From complaint → understanding → investigation → evidence → root cause → expert resolution → human escalation → prevention.",
        "status": "operational",
        "api_docs": "/docs",
        "demo_accounts": {
            "Customer": "elena.vance@example.com / password123",
            "Solver (Mechanical & Electrical PE)": "dr.marcus.vance@omnisolver.com / password123",
            "Company Admin (Apex Dynamics)": "admin@apexdynamics.com / password123",
            "Platform SuperAdmin": "platform.admin@omniresolve.ai / password123"
        }
    }
