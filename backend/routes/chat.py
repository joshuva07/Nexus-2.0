from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List, Optional

from backend.database import get_db
from backend.models.models import User, ChatHistory, UserSkill
from backend.utils.jwt_auth import get_current_user
from backend.services.ai_service import call_ai
from backend.ai.prompts import CHATBOT_SYSTEM_PROMPT
import uuid

router = APIRouter()


class Message(BaseModel):
    role:    str
    content: str


class ChatRequest(BaseModel):
    message:  str
    history:  List[Message] = []
    use_ai:   bool = False


RULE_RESPONSES = {
    "career":     "Based on your profile, I recommend exploring **AI/ML Engineering** and **Software Engineering** as your top matches. Head to the Career page for a full analysis with salary data and skill gaps!",
    "skill":      "Your top skill gaps to close are: **System Design**, **Kubernetes**, and **LLM Engineering**. I recommend starting with the System Design Primer on GitHub — it's free and highly effective.",
    "simulation": "Ready for a simulation? Try the **System Outage at 3AM** scenario in Engineering — it tests your incident response under pressure and is excellent for Software/AI roles.",
    "predict":    "Your current job readiness is **82%** and trending up. Your 6-month projection is **93%** if you close your System Design gap. Visit the Prediction page for your full growth chart!",
    "course":     "Top courses for your AI/ML goal:\n1. **Deep Learning Specialization** — DeepLearning.AI ⭐ 4.9\n2. **Hugging Face NLP Course** — Free ⭐ 4.8\n3. **Fast.ai** — Free ⭐ 4.9",
    "salary":     "For AI/ML Engineers: avg **$180K**, range **$110K–$280K**. For Software Engineers: avg **$120K**, range **$70K–$180K**. Your skills position you for **$100K–$150K** today.",
}


def rule_based_response(message: str, user_skills: List[str]) -> str:
    msg = message.lower()
    for key, resp in RULE_RESPONSES.items():
        if key in msg:
            return resp
    return (
        f"Great question! With your skills in **{', '.join(user_skills[:3]) if user_skills else 'tech'}**, "
        f"you're well-positioned for high-growth careers. Ask me about careers, skill gaps, courses, simulations, or your future prediction!"
    )


@router.post("")
async def chat(
    req: ChatRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    db_skills = [us.skill_name for us in db.query(UserSkill).filter(UserSkill.user_id == current_user.id).all()]

    # Save user message
    db.add(ChatHistory(user_id=current_user.id, role="user", content=req.message))

    response_text: str
    if req.use_ai and req.message:
        # Build context-aware messages
        context = f"User: {current_user.name}, Skills: {db_skills}, Career Goal: {current_user.career_goal}, Level: {current_user.level}"
        history_msgs = [{"role": m.role, "content": m.content} for m in req.history[-6:]]
        response_text = await call_ai(
            user_message=req.message,
            system=CHATBOT_SYSTEM_PROMPT + f"\n\nUser Context: {context}",
            history=history_msgs,
        )
    else:
        response_text = rule_based_response(req.message, db_skills)

    # Save AI response
    db.add(ChatHistory(user_id=current_user.id, role="assistant", content=response_text))
    db.commit()

    return {
        "message":    response_text,
        "session_id": str(uuid.uuid4()),
    }


@router.get("/history")
async def get_history(
    limit: int = 20,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    history = (
        db.query(ChatHistory)
        .filter(ChatHistory.user_id == current_user.id)
        .order_by(ChatHistory.created_at.desc())
        .limit(limit)
        .all()
    )
    return [{"role": h.role, "content": h.content, "created_at": h.created_at} for h in reversed(history)]
