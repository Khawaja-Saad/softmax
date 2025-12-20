from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text, Float, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database import Base


# Subject status constants
class SubjectStatus:
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"


class Subject(Base):
    __tablename__ = "subjects"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    name = Column(String, nullable=False)
    code = Column(String)
    semester = Column(Integer)
    year = Column(Integer)
    credits = Column(Integer)
    description = Column(Text)
    status = Column(String, default=SubjectStatus.IN_PROGRESS)  # 'in_progress' or 'completed'
    progress = Column(Integer, default=0)  # 0-100 percentage
    subject_data = Column(JSON, default={})  # For storing concepts and submissions
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    user = relationship("User", back_populates="subjects")
    skills = relationship("Skill", back_populates="subject")


class Skill(Base):
    __tablename__ = "skills"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    subject_id = Column(Integer, ForeignKey("subjects.id"), nullable=True)
    name = Column(String, nullable=False)
    category = Column(String)  # Technical, Soft, Domain-specific
    proficiency_level = Column(Float, default=0.0)  # 0-100
    target_level = Column(Float)
    acquired_date = Column(DateTime(timezone=True))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    user = relationship("User", back_populates="skills")
    subject = relationship("Subject", back_populates="skills")
