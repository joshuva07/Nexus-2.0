from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel, EmailStr

from database import get_db
from models.models import User
from utils.jwt_auth import hash_password, verify_password, create_access_token
import uuid

router = APIRouter()


class RegisterRequest(BaseModel):
    name:     str
    email:    EmailStr
    password: str
    domain:   str = "Engineering"

class LoginRequest(BaseModel):
    email:    EmailStr
    password: str

class AuthResponse(BaseModel):
    access_token: str
    token_type:   str = "bearer"
    user: dict


@router.post("/register", response_model=AuthResponse, status_code=201)
async def register(req: RegisterRequest, db: Session = Depends(get_db)):
    if db.query(User).filter(User.email == req.email).first():
        raise HTTPException(status_code=400, detail="Email already registered")

    user = User(
        id              = str(uuid.uuid4()),
        email           = req.email,
        name            = req.name,
        hashed_password = hash_password(req.password),
        domain          = req.domain,
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    token = create_access_token({"sub": user.id})
    return AuthResponse(
        access_token=token,
        user={"id": user.id, "name": user.name, "email": user.email}
    )


@router.post("/login", response_model=AuthResponse)
async def login(req: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == req.email).first()
    if not user or not verify_password(req.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = create_access_token({"sub": user.id})
    return AuthResponse(
        access_token=token,
        user={"id": user.id, "name": user.name, "email": user.email, "domain": user.domain}
    )
