from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List, Optional
import json, os

from database import get_db
from models.models import User, UserSkill, KnowledgeGap
from utils.jwt_auth import get_current_user
from services.ai_service import call_ai
from ai.prompts import CAREER_RECOMMENDATION_PROMPT

router = APIRouter()

# ── In-memory career dataset (mirrors frontend) ───────────────────────────────
CAREERS = [
    {"id": "software-engineer",    "title": "Software Engineer",    "domain": "Engineering", "salary_avg": 120000, "demand": 95, "growth": 25, "skills": ["JavaScript","Python","React","Node.js","SQL","Git","System Design"]},
    {"id": "data-scientist",       "title": "Data Scientist",       "domain": "Engineering", "salary_avg": 135000, "demand": 92, "growth": 31, "skills": ["Python","Statistics","ML","SQL","TensorFlow","Data Viz","R"]},
    {"id": "product-manager",      "title": "Product Manager",      "domain": "Business",    "salary_avg": 150000, "demand": 88, "growth": 19, "skills": ["Strategy","Analytics","Communication","Roadmapping","Agile","SQL"]},
    {"id": "ux-designer",          "title": "UX Designer",          "domain": "Arts",        "salary_avg": 100000, "demand": 84, "growth": 16, "skills": ["Figma","Wireframing","Prototyping","User Research","Accessibility"]},
    {"id": "ai-engineer",          "title": "AI/ML Engineer",       "domain": "Engineering", "salary_avg": 180000, "demand": 99, "growth": 42, "skills": ["Python","PyTorch","LLMs","Transformers","MLOps","RAG","CUDA"]},
    {"id": "cybersecurity-analyst","title": "Cybersecurity Analyst","domain": "Engineering", "salary_avg": 115000, "demand": 97, "growth": 35, "skills": ["Network Security","Ethical Hacking","SIEM","Python","Linux"]},
    {"id": "cloud-architect",      "title": "Cloud Architect",      "domain": "Engineering", "salary_avg": 175000, "demand": 94, "growth": 28, "skills": ["AWS","GCP","Azure","Kubernetes","Terraform","Networking"]},
    {"id": "financial-analyst",    "title": "Financial Analyst",    "domain": "Business",    "salary_avg": 95000,  "demand": 82, "growth": 11, "skills": ["Excel","Financial Modeling","Valuation","SQL","Python"]},
    {"id": "doctor",               "title": "Medical Doctor",       "domain": "Medical",     "salary_avg": 220000, "demand": 90, "growth": 13, "skills": ["Clinical Knowledge","Diagnosis","Patient Care","Research"]},
    {"id": "content-creator",      "title": "Content Creator",      "domain": "Arts",        "salary_avg": 80000,  "demand": 78, "growth": 22, "skills": ["Video Editing","Storytelling","SEO","Analytics"]},
]


class CareerPredictRequest(BaseModel):
    skills:    List[str]
    domain:    str = "All"
    level:     str = "Intermediate"
    interests: str = ""
    use_ai:    bool = False


def score_match(career: dict, user_skills: List[str]) -> dict:
    required = career["skills"]
    matched  = [s for s in required if any(s.lower() in us.lower() or us.lower() in s.lower() for us in user_skills)]
    gaps     = [s for s in required if s not in matched]
    raw      = len(matched) / max(len(required), 1)
    score    = min(int(raw * 70 + 20), 99)
    return {**career, "match_score": score, "matched_skills": matched, "knowledge_gaps": gaps}


@router.post("/predict")
async def predict_career(
    req: CareerPredictRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    candidates = [c for c in CAREERS if req.domain == "All" or c["domain"] == req.domain]
    results    = sorted([score_match(c, req.skills) for c in candidates], key=lambda x: -x["match_score"])

    # Save knowledge gaps to DB
    db.query(KnowledgeGap).filter(KnowledgeGap.user_id == current_user.id).delete()
    for career in results[:3]:
        for gap in career["knowledge_gaps"][:3]:
            db.add(KnowledgeGap(
                user_id=current_user.id,
                career_id=career["id"],
                missing_skill=gap,
                priority="High" if results.index(career) == 0 else "Medium",
            ))
    db.commit()

    ai_explanation = None
    if req.use_ai:
        prompt = f"User skills: {req.skills}\nTop career match: {results[0]['title']}\nMatch score: {results[0]['match_score']}%\nKnowledge gaps: {results[0]['knowledge_gaps']}\n\nProvide a 2-sentence personalized explanation of why this is their best career match."
        ai_explanation = await call_ai(prompt, system=CAREER_RECOMMENDATION_PROMPT)

    return {
        "results": results,
        "ai_explanation": ai_explanation,
        "total": len(results),
    }
