from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List, Optional

from database import get_db
from models.models import User, UserSkill
from utils.jwt_auth import get_current_user

router = APIRouter()


class ProfileResponse(BaseModel):
    id:          str
    name:        str
    email:       str
    domain:      str
    career_goal: str
    level:       str
    xp:          int
    skills:      List[str]
    badges:      List[str] = []

    class Config:
        from_attributes = True


class UpdateProfileRequest(BaseModel):
    name:        Optional[str] = None
    domain:      Optional[str] = None
    career_goal: Optional[str] = None
    level:       Optional[str] = None
    skills:      Optional[List[str]] = None


@router.get("/profile")
async def get_profile(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    skills = [us.skill_name for us in db.query(UserSkill).filter(UserSkill.user_id == current_user.id).all()]
    return {
        "id":          current_user.id,
        "name":        current_user.name,
        "email":       current_user.email,
        "domain":      current_user.domain,
        "career_goal": current_user.career_goal,
        "level":       current_user.level,
        "xp":          current_user.xp,
        "skills":      skills,
    }


@router.put("/profile")
async def update_profile(
    req: UpdateProfileRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if req.name:        current_user.name        = req.name
    if req.domain:      current_user.domain      = req.domain
    if req.career_goal: current_user.career_goal = req.career_goal
    if req.level:       current_user.level       = req.level

    if req.skills is not None:
        db.query(UserSkill).filter(UserSkill.user_id == current_user.id).delete()
        for skill in req.skills:
            db.add(UserSkill(user_id=current_user.id, skill_name=skill))

    db.commit()
    return {"message": "Profile updated successfully"}


@router.post("/xp")
async def add_xp(
    amount: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    current_user.xp += amount
    db.commit()
    return {"xp": current_user.xp}
