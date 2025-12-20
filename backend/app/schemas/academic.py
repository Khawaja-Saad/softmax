from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime


class SubjectBase(BaseModel):
    name: str
    code: Optional[str] = None
    semester: Optional[int] = None
    year: Optional[int] = None
    credits: Optional[int] = None
    description: Optional[str] = None


class SubjectCreate(SubjectBase):
    pass


class SubjectResponse(SubjectBase):
    id: int
    user_id: int
    created_at: datetime
    
    class Config:
        from_attributes = True


class SkillBase(BaseModel):
    name: str
    category: Optional[str] = None  # Technical, Soft, Domain-specific
    proficiency_level: float = Field(default=0.0, ge=0, le=100)
    target_level: Optional[float] = Field(None, ge=0, le=100)


class SkillCreate(SkillBase):
    subject_id: Optional[int] = None


class SkillResponse(SkillBase):
    id: int
    user_id: int
    subject_id: Optional[int]
    acquired_date: Optional[datetime]
    created_at: datetime
    updated_at: Optional[datetime]
    
    class Config:
        from_attributes = True


class SkillRoadmapItem(BaseModel):
    subject: str
    skills: List[dict]


class SkillRoadmapResponse(BaseModel):
    roadmap: List[SkillRoadmapItem]
    total_skills: int
    estimated_weeks: int
