from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime
from enum import Enum


class ProjectStatus(str, Enum):
    NOT_STARTED = "not_started"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    ARCHIVED = "archived"


class ProjectBase(BaseModel):
    title: str
    description: Optional[str] = None
    problem_statement: Optional[str] = None
    difficulty_level: Optional[str] = "Intermediate"
    estimated_hours: Optional[int] = None


class ProjectCreate(ProjectBase):
    required_skills: Optional[List[str]] = []
    deliverables: Optional[List[str]] = []
    evaluation_criteria: Optional[List[str]] = []


class ProjectGenerateRequest(BaseModel):
    subject_id: int


class ProjectUpdate(BaseModel):
    status: Optional[ProjectStatus] = None
    completion_percentage: Optional[int] = Field(None, ge=0, le=100)
    github_url: Optional[str] = None
    live_url: Optional[str] = None
    actual_hours: Optional[int] = None


class ProjectResponse(ProjectBase):
    id: int
    user_id: int
    required_skills: Optional[str]
    deliverables: Optional[str]
    evaluation_criteria: Optional[str]
    status: str
    completion_percentage: int
    github_url: Optional[str]
    live_url: Optional[str]
    actual_hours: Optional[int]
    start_date: Optional[datetime]
    end_date: Optional[datetime]
    created_at: datetime
    updated_at: Optional[datetime]
    
    class Config:
        from_attributes = True


class MilestoneBase(BaseModel):
    title: str
    description: Optional[str] = None
    target_date: Optional[datetime] = None


class MilestoneCreate(MilestoneBase):
    project_id: Optional[int] = None


class MilestoneResponse(MilestoneBase):
    id: int
    user_id: int
    project_id: Optional[int]
    is_completed: bool
    completed_date: Optional[datetime]
    created_at: datetime
    
    class Config:
        from_attributes = True
