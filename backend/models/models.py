from sqlalchemy import Column, String, Integer, Float, Boolean, DateTime, Text, ForeignKey, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import uuid

from database import Base


def gen_uuid():
    return str(uuid.uuid4())


class User(Base):
    __tablename__ = "users"

    id            = Column(String, primary_key=True, default=gen_uuid)
    email         = Column(String, unique=True, index=True, nullable=False)
    name          = Column(String, nullable=False)
    hashed_password = Column(String, nullable=False)
    domain        = Column(String, default="Engineering")
    career_goal   = Column(String, default="")
    level         = Column(String, default="Beginner")
    xp            = Column(Integer, default=0)
    is_active     = Column(Boolean, default=True)
    created_at    = Column(DateTime(timezone=True), server_default=func.now())
    updated_at    = Column(DateTime(timezone=True), onupdate=func.now())

    skills        = relationship("UserSkill", back_populates="user", cascade="all, delete")
    simulations   = relationship("UserResponse", back_populates="user", cascade="all, delete")
    predictions   = relationship("Prediction", back_populates="user", cascade="all, delete")
    chat_history  = relationship("ChatHistory", back_populates="user", cascade="all, delete")
    knowledge_gaps= relationship("KnowledgeGap", back_populates="user", cascade="all, delete")
    scores        = relationship("Score", back_populates="user", cascade="all, delete")


class Skill(Base):
    __tablename__ = "skills"

    id          = Column(String, primary_key=True, default=gen_uuid)
    name        = Column(String, unique=True, nullable=False)
    domain      = Column(String, nullable=False)
    category    = Column(String, default="Technical")
    description = Column(Text, default="")


class UserSkill(Base):
    __tablename__ = "user_skills"

    id           = Column(String, primary_key=True, default=gen_uuid)
    user_id      = Column(String, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    skill_name   = Column(String, nullable=False)
    proficiency  = Column(Integer, default=50)   # 0–100
    verified     = Column(Boolean, default=False)
    added_at     = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", back_populates="skills")


class Simulation(Base):
    __tablename__ = "simulations"

    id          = Column(String, primary_key=True, default=gen_uuid)
    title       = Column(String, nullable=False)
    domain      = Column(String, nullable=False)
    difficulty  = Column(String, default="Medium")
    time_limit  = Column(Integer, default=300)
    steps       = Column(JSON, nullable=False)
    created_at  = Column(DateTime(timezone=True), server_default=func.now())


class UserResponse(Base):
    __tablename__ = "user_responses"

    id              = Column(String, primary_key=True, default=gen_uuid)
    user_id         = Column(String, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    simulation_id   = Column(String, nullable=False)
    choices         = Column(JSON, default=[])
    time_taken      = Column(Integer, default=0)
    completed_at    = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", back_populates="simulations")


class Score(Base):
    __tablename__ = "scores"

    id            = Column(String, primary_key=True, default=gen_uuid)
    user_id       = Column(String, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    simulation_id = Column(String, nullable=False)
    accuracy      = Column(Float, default=0)
    logic         = Column(Float, default=0)
    risk          = Column(Float, default=0)
    speed         = Column(Float, default=0)
    overall       = Column(Float, default=0)
    scored_at     = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", back_populates="scores")


class Prediction(Base):
    __tablename__ = "predictions"

    id               = Column(String, primary_key=True, default=gen_uuid)
    user_id          = Column(String, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    job_readiness    = Column(Float, default=0)
    growth_potential = Column(Float, default=0)
    risk_score       = Column(Float, default=0)
    career_level     = Column(String, default="Junior")
    details          = Column(JSON, default={})
    predicted_at     = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", back_populates="predictions")


class ChatHistory(Base):
    __tablename__ = "chat_history"

    id         = Column(String, primary_key=True, default=gen_uuid)
    user_id    = Column(String, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    role       = Column(String, nullable=False)   # "user" | "assistant"
    content    = Column(Text, nullable=False)
    metadata   = Column(JSON, default={})
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", back_populates="chat_history")


class KnowledgeGap(Base):
    __tablename__ = "knowledge_gaps"

    id           = Column(String, primary_key=True, default=gen_uuid)
    user_id      = Column(String, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    career_id    = Column(String, nullable=False)
    missing_skill= Column(String, nullable=False)
    priority     = Column(String, default="Medium")
    progress     = Column(Integer, default=0)
    created_at   = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", back_populates="knowledge_gaps")
