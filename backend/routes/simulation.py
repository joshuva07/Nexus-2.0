from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List, Dict, Any, Optional

from backend.database import get_db
from backend.models.models import User, UserResponse, Score
from backend.utils.jwt_auth import get_current_user
from backend.services.ai_service import call_ai
from backend.ai.prompts import FEEDBACK_ENGINE_PROMPT
import uuid

router = APIRouter()


class StartRequest(BaseModel):
    scenario_id: str
    domain:      str


class SubmitRequest(BaseModel):
    scenario_id: str
    domain:      str
    title:       str
    choices:     List[Dict[str, Any]]
    scores:      Dict[str, float]
    time_taken:  int = 0
    use_ai:      bool = False


@router.post("/start")
async def start_simulation(
    req: StartRequest,
    current_user: User = Depends(get_current_user),
):
    return {
        "session_id": str(uuid.uuid4()),
        "scenario_id": req.scenario_id,
        "domain": req.domain,
        "started_at": __import__("datetime").datetime.utcnow().isoformat(),
        "message": "Simulation started. Good luck!",
    }


@router.post("/submit")
async def submit_simulation(
    req: SubmitRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    # Compute overall score (0-100)
    raw = req.scores.get("accuracy", 0) + req.scores.get("logic", 0) + req.scores.get("risk", 0) + req.scores.get("speed", 0)
    overall = min(round((raw / 160) * 100), 100)

    # Persist response
    response = UserResponse(
        user_id=current_user.id,
        simulation_id=req.scenario_id,
        choices=req.choices,
        time_taken=req.time_taken,
    )
    db.add(response)

    # Persist score
    score_obj = Score(
        user_id=current_user.id,
        simulation_id=req.scenario_id,
        accuracy=req.scores.get("accuracy", 0),
        logic=req.scores.get("logic", 0),
        risk=req.scores.get("risk", 0),
        speed=req.scores.get("speed", 0),
        overall=overall,
    )
    db.add(score_obj)

    # Award XP
    xp_earned = max(50, overall)
    current_user.xp += xp_earned
    db.commit()

    ai_feedback = None
    if req.use_ai:
        prompt = (
            f"Scenario: {req.title} ({req.domain})\n"
            f"Scores — Accuracy: {req.scores.get('accuracy')}, Logic: {req.scores.get('logic')}, "
            f"Risk: {req.scores.get('risk')}, Speed: {req.scores.get('speed')}\n"
            f"Overall: {overall}%\n"
            f"Provide coaching feedback for this simulation performance."
        )
        ai_feedback = await call_ai(prompt, system=FEEDBACK_ENGINE_PROMPT)

    return {
        "overall_score":  overall,
        "scores":         req.scores,
        "xp_earned":      xp_earned,
        "ai_feedback":    ai_feedback or _default_feedback(overall, req.domain),
        "career_level":   "Expert" if overall >= 85 else "Proficient" if overall >= 70 else "Developing",
    }


def _default_feedback(score: int, domain: str) -> str:
    if score >= 85:
        return f"Exceptional performance! Your {domain} decision-making is at an expert level. You handled high-pressure scenarios with clarity and precision."
    elif score >= 65:
        return f"Solid effort in this {domain} simulation. Your fundamentals are strong — focus on speed under pressure and risk assessment to reach expert level."
    else:
        return f"Good attempt at a challenging {domain} scenario. Review the decisions where you lost points and practice similar simulations to build confidence."
