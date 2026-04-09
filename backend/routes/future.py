from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List

from backend.database import get_db
from backend.models.models import User, Score, UserSkill, Prediction
from backend.utils.jwt_auth import get_current_user
import uuid, math

router = APIRouter()


class FutureRequest(BaseModel):
    skills:       List[str] = []
    career_goal:  str = ""
    domain:       str = "Engineering"


def compute_prediction(user: User, skills: List[str], scores_list: List[Score]) -> dict:
    skill_score       = min(len(skills) * 6, 60)
    sim_score         = min(sum(s.overall for s in scores_list) / max(len(scores_list), 1) * 0.3, 30) if scores_list else 10
    job_readiness     = round(skill_score + sim_score + 10)
    growth_potential  = min(round(job_readiness * 1.1 + 5), 99)
    risk_score        = max(0, 100 - job_readiness - (len(scores_list) * 5))

    career_level = (
        "Senior"     if job_readiness >= 85 else
        "Mid-level"  if job_readiness >= 65 else
        "Junior"     if job_readiness >= 40 else
        "Entry-level"
    )

    return {
        "job_readiness":    job_readiness,
        "growth_potential": growth_potential,
        "risk_score":       risk_score,
        "risk_level":       "Very Low" if risk_score < 20 else "Low" if risk_score < 40 else "Medium" if risk_score < 60 else "High",
        "career_level":     career_level,
        "promotion_chance": min(round(job_readiness * 0.85), 95),
        "six_month_target": min(job_readiness + 12, 99),
        "scenarios": {
            "optimistic":  min(job_readiness + 15, 99),
            "realistic":   job_readiness,
            "pessimistic": max(job_readiness - 12, 30),
        },
    }


@router.post("/predict")
async def predict_future(
    req: FutureRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    db_skills = [us.skill_name for us in db.query(UserSkill).filter(UserSkill.user_id == current_user.id).all()]
    all_skills = list(set(db_skills + req.skills))
    scores_list = db.query(Score).filter(Score.user_id == current_user.id).all()

    pred_data = compute_prediction(current_user, all_skills, scores_list)

    # Persist prediction
    pred = Prediction(
        user_id          = current_user.id,
        job_readiness    = pred_data["job_readiness"],
        growth_potential = pred_data["growth_potential"],
        risk_score       = pred_data["risk_score"],
        career_level     = pred_data["career_level"],
        details          = pred_data,
    )
    db.add(pred)
    db.commit()

    return pred_data
