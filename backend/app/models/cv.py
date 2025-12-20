from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text, Boolean, JSON, Float
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database import Base


class CV(Base):
    __tablename__ = "cvs"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True)
    
    # Personal Information
    full_name = Column(String)
    phone = Column(String)
    email = Column(String)
    linkedin_url = Column(String)
    github_url = Column(String)
    portfolio_url = Column(String)
    location = Column(String)
    
    # Professional Summary
    summary = Column(Text)
    
    # Education, Experience, Skills stored as JSON
    education = Column(JSON)  # Array of education objects
    experience = Column(JSON)  # Array of work experience objects
    
    # Skills (stored as comma-separated strings or JSON)
    technical_skills = Column(Text)
    soft_skills = Column(Text)
    languages = Column(Text)
    
    # Certifications and Projects
    certifications = Column(JSON)  # Array of certification objects
    projects = Column(JSON)  # Array of project objects
    
    # Legacy fields (kept for backward compatibility)
    skills = Column(JSON)  # Store skills array as JSON
    
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    
    # Relationships
    user = relationship("User", back_populates="cv")


class Opportunity(Base):
    __tablename__ = "opportunities"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    title = Column(String, nullable=False)
    company = Column(String)
    description = Column(Text)
    required_skills = Column(JSON)  # Store as JSON array
    type = Column(String)  # internship, job, research
    location = Column(String)
    url = Column(String)
    match_score = Column(Float)  # 0-100
    applied = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    user = relationship("User", back_populates="opportunities")
