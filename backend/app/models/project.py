from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text, Enum as SQLEnum, Boolean
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database import Base
import enum


class ProjectStatus(str, enum.Enum):
    NOT_STARTED = "not_started"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    ARCHIVED = "archived"


class Project(Base):
    __tablename__ = "projects"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    title = Column(String, nullable=False)
    description = Column(Text)
    problem_statement = Column(Text)
    required_skills = Column(Text)  # JSON string
    deliverables = Column(Text)  # JSON string
    evaluation_criteria = Column(Text)  # JSON string
    status = Column(SQLEnum(ProjectStatus), default=ProjectStatus.NOT_STARTED)
    github_url = Column(String)
    live_url = Column(String)
    completion_percentage = Column(Integer, default=0)
    difficulty_level = Column(String)  # Beginner, Intermediate, Advanced
    estimated_hours = Column(Integer)
    actual_hours = Column(Integer)
    start_date = Column(DateTime(timezone=True))
    end_date = Column(DateTime(timezone=True))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    user = relationship("User", back_populates="projects")
    milestones = relationship("Milestone", back_populates="project")


class Milestone(Base):
    __tablename__ = "milestones"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    project_id = Column(Integer, ForeignKey("projects.id"), nullable=True)
    title = Column(String, nullable=False)
    description = Column(Text)
    target_date = Column(DateTime(timezone=True))
    completed_date = Column(DateTime(timezone=True))
    is_completed = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    user = relationship("User", back_populates="milestones")
    project = relationship("Project", back_populates="milestones")
