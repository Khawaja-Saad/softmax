from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text, Boolean, JSON, Float
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database import Base


class CV(Base):
    __tablename__ = "cvs"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True)
    summary = Column(Text)
    education = Column(JSON)  # Store education details as JSON
    skills = Column(JSON)  # Store skills array as JSON
    projects = Column(JSON)  # Store projects array as JSON
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
