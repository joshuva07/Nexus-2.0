from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List

from backend.database import get_db
from backend.models.models import User, UserSkill, KnowledgeGap
from backend.utils.jwt_auth import get_current_user

router = APIRouter()

CAREER_SKILLS = {
    "software-engineer": ["JavaScript", "Python", "React", "Node.js", "SQL", "Git", "System Design"],
    "ai-engineer":       ["Python", "PyTorch", "LLMs", "Transformers", "MLOps", "RAG", "CUDA"],
    "data-scientist":    ["Python", "Statistics", "ML", "SQL", "TensorFlow", "Data Viz", "R"],
    "cloud-architect":   ["AWS", "GCP", "Azure", "Kubernetes", "Terraform", "Networking", "Python"],
    "product-manager":   ["Strategy", "Analytics", "Communication", "Roadmapping", "Agile", "SQL"],
}

RESOURCES = {
    "System Design":    ["System Design Primer (GitHub)", "Grokking the System Design Interview"],
    "Kubernetes":       ["Kubernetes Official Docs", "CKAD Practice Labs"],
    "MLOps":            ["MLflow Docs", "Full Stack MLOps Course"],
    "LLMs":             ["Hugging Face Course", "LangChain Docs"],
    "PyTorch":          ["PyTorch Official Tutorials", "Fast.ai Part 1"],
    "AWS":              ["AWS Solutions Architect (A Cloud Guru)", "AWS Free Tier"],
    "Transformers":     ["Hugging Face NLP Course", "Attention is All You Need (paper)"],
    "RAG":              ["LlamaIndex Docs", "LangChain RAG Tutorial"],
    "Statistics":       ["StatQuest (YouTube)", "Think Stats (free book)"],
    "TensorFlow":       ["TensorFlow Official Course", "DeepLearning.AI Specialization"],
}


class GapRequest(BaseModel):
    user_skills:  List[str]
    career_id:    str = "ai-engineer"


@router.post("/gaps")
async def detect_gaps(
    req: GapRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    required = CAREER_SKILLS.get(req.career_id, [])
    db_skills = [us.skill_name for us in db.query(UserSkill).filter(UserSkill.user_id == current_user.id).all()]
    all_skills = list(set(db_skills + req.user_skills))

    gaps = []
    for skill in required:
        has = any(skill.lower() in s.lower() or s.lower() in skill.lower() for s in all_skills)
        if not has:
            priority = "High" if required.index(skill) < 3 else "Medium"
            gaps.append({
                "skill":     skill,
                "priority":  priority,
                "progress":  0,
                "resources": RESOURCES.get(skill, [f"Search: 'Learn {skill} 2025'"]),
            })

    matched = [s for s in required if s not in [g["skill"] for g in gaps]]

    return {
        "career_id":      req.career_id,
        "total_required": len(required),
        "matched":        matched,
        "gaps":           gaps,
        "coverage_pct":   round(len(matched) / max(len(required), 1) * 100),
    }
