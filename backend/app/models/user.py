from sqlalchemy import Column, Integer, String, DateTime, Boolean, ForeignKey, Text, Enum as SQLEnum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database import Base
import enum


class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    username = Column(String, index=True)
    hashed_password = Column(String, nullable=False)
    full_name = Column(String, nullable=False)
    degree_program = Column(String)
    current_year = Column(Integer)
    current_semester = Column(Integer)
    career_goal = Column(String)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    subjects = relationship("Subject", back_populates="user", cascade="all, delete-orphan")
    skills = relationship("Skill", back_populates="user", cascade="all, delete-orphan")
    projects = relationship("Project", back_populates="user", cascade="all, delete-orphan")
    milestones = relationship("Milestone", back_populates="user", cascade="all, delete-orphan")
    cv = relationship("CV", back_populates="user", uselist=False, cascade="all, delete-orphan")
    opportunities = relationship("Opportunity", back_populates="user", cascade="all, delete-orphan")
    chat_sessions = relationship("ChatSession", back_populates="user", cascade="all, delete-orphan")
