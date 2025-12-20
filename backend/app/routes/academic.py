from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from database import get_db
from app.schemas.academic import SubjectCreate, SubjectResponse, SkillCreate, SkillResponse, SkillRoadmapResponse
from app.models.academic import Subject, Skill
from app.models.user import User
from app.utils.auth import get_current_user_id
from app.agents.academic_agent import AcademicAgent

router = APIRouter()


@router.get("/subjects", response_model=List[SubjectResponse])
async def get_subjects(
    user_id: int = Depends(get_current_user_id),
    db: Session = Depends(get_db)
):
    """Get all subjects for current user."""
    subjects = db.query(Subject).filter(Subject.user_id == user_id).all()
    return subjects


@router.post("/subjects", response_model=SubjectResponse, status_code=status.HTTP_201_CREATED)
async def create_subject(
    subject_data: SubjectCreate,
    user_id: int = Depends(get_current_user_id),
    db: Session = Depends(get_db)
):
    """Add a new subject."""
    subject = Subject(
        user_id=user_id,
        name=subject_data.name,
        code=subject_data.code,
        semester=subject_data.semester,
        year=subject_data.year,
        credits=subject_data.credits,
        description=subject_data.description
    )
    db.add(subject)
    db.commit()
    db.refresh(subject)
    return subject


@router.get("/subjects/{subject_id}", response_model=SubjectResponse)
async def get_subject(
    subject_id: int,
    user_id: int = Depends(get_current_user_id),
    db: Session = Depends(get_db)
):
    """Get a specific subject."""
    subject = db.query(Subject).filter(
        Subject.id == subject_id,
        Subject.user_id == user_id
    ).first()
    
    if not subject:
        raise HTTPException(status_code=404, detail="Subject not found")
    
    return subject


@router.get("/skills", response_model=List[SkillResponse])
async def get_skills(
    user_id: int = Depends(get_current_user_id),
    db: Session = Depends(get_db)
):
    """Get all skills for current user."""
    skills = db.query(Skill).filter(Skill.user_id == user_id).all()
    return skills


@router.post("/skills", response_model=SkillResponse, status_code=status.HTTP_201_CREATED)
async def create_skill(
    skill_data: SkillCreate,
    user_id: int = Depends(get_current_user_id),
    db: Session = Depends(get_db)
):
    """Add a new skill."""
    skill = Skill(
        user_id=user_id,
        subject_id=skill_data.subject_id,
        name=skill_data.name,
        category=skill_data.category,
        proficiency_level=skill_data.proficiency_level,
        target_level=skill_data.target_level
    )
    db.add(skill)
    db.commit()
    db.refresh(skill)
    return skill


@router.get("/roadmap", response_model=SkillRoadmapResponse)
async def get_skill_roadmap(
    user_id: int = Depends(get_current_user_id),
    db: Session = Depends(get_db)
):
    """Generate AI-powered skill roadmap from enrolled subjects."""
    # Get user and subjects
    user = db.query(User).filter(User.id == user_id).first()
    subjects = db.query(Subject).filter(Subject.user_id == user_id).all()
    
    if not subjects:
        raise HTTPException(
            status_code=400,
            detail="Please add subjects first to generate a roadmap"
        )
    
    # Convert subjects to dict
    subjects_data = [
        {
            "name": s.name,
            "code": s.code,
            "description": s.description
        }
        for s in subjects
    ]
    
    # Generate roadmap using AI
    roadmap = AcademicAgent.generate_skill_roadmap(
        subjects_data,
        career_goal=user.career_goal
    )
    
    # Save skills to database
    for subject_roadmap in roadmap.get("roadmap", []):
        # Find the corresponding subject
        subject = next((s for s in subjects if s.name == subject_roadmap.get("subject")), None)
        
        for skill_data in subject_roadmap.get("skills", []):
            # Check if skill already exists
            existing_skill = db.query(Skill).filter(
                Skill.user_id == user_id,
                Skill.name == skill_data.get("name")
            ).first()
            
            if not existing_skill:
                # Create new skill
                skill = Skill(
                    user_id=user_id,
                    subject_id=subject.id if subject else None,
                    name=skill_data.get("name"),
                    category=skill_data.get("category", "Technical"),
                    proficiency_level=0,  # Start at 0
                    target_level=skill_data.get("target_level", 80)
                )
                db.add(skill)
    
    db.commit()
    
    return roadmap


@router.put("/skills/{skill_id}/progress")
async def update_skill_progress(
    skill_id: int,
    proficiency_level: float,
    user_id: int = Depends(get_current_user_id),
    db: Session = Depends(get_db)
):
    """Update skill proficiency level."""
    skill = db.query(Skill).filter(
        Skill.id == skill_id,
        Skill.user_id == user_id
    ).first()
    
    if not skill:
        raise HTTPException(status_code=404, detail="Skill not found")
    
    skill.proficiency_level = proficiency_level
    db.commit()
    
    return {"message": "Skill progress updated", "proficiency_level": proficiency_level}
