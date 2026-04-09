from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from backend.routes import auth, user, career, simulation, future, knowledge, chat

app = FastAPI(
    title="NEXUS AI Backend",
    description="Human Intelligence Operating System — FastAPI Backend",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# ── CORS ──────────────────────────────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:3000",
        "https://nexus-ai.vercel.app",
        "https://nexus-ai-frontend.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Routers ───────────────────────────────────────────────────────────────────
app.include_router(auth.router,       prefix="/auth",       tags=["Auth"])
app.include_router(user.router,       prefix="/user",       tags=["User"])
app.include_router(career.router,     prefix="/career",     tags=["Career"])
app.include_router(simulation.router, prefix="/simulation", tags=["Simulation"])
app.include_router(future.router,     prefix="/future",     tags=["Future"])
app.include_router(knowledge.router,  prefix="/knowledge",  tags=["Knowledge"])
app.include_router(chat.router,       prefix="/chat",       tags=["Chat"])

# ── Health ────────────────────────────────────────────────────────────────────
@app.get("/", tags=["Health"])
async def root():
    return {"status": "ok", "service": "NEXUS AI Backend", "version": "1.0.0"}

@app.get("/health", tags=["Health"])
async def health():
    return {"status": "healthy"}
