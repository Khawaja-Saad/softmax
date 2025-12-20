from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Form
from sqlalchemy.orm import Session
from sqlalchemy.orm.attributes import flag_modified
from typing import List, Optional
import json
from datetime import datetime, timezone
from database import get_db
from app.schemas.academic import SubjectCreate, SubjectResponse, SkillCreate, SkillResponse, SkillRoadmapResponse
from app.models.academic import Subject, Skill, SubjectStatus
from app.models.project import Project, ProjectStatus
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
    # Check if course with same name already exists for this user
    existing_subject = db.query(Subject).filter(
        Subject.user_id == user_id,
        Subject.name.ilike(subject_data.name)
    ).first()
    
    if existing_subject:
        # Only allow re-adding if the existing subject is completed
        if existing_subject.status != SubjectStatus.COMPLETED:
            raise HTTPException(
                status_code=400,
                detail="Course is already in progress. Complete it first before re-adding."
            )
        # If completed, allow creating a new one (for re-learning)
    
    subject = Subject(
        user_id=user_id,
        name=subject_data.name,
        code=subject_data.code,
        semester=subject_data.semester,
        year=subject_data.year,
        credits=subject_data.credits,
        description=subject_data.description,
        status=SubjectStatus.IN_PROGRESS,
        progress=0
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


@router.delete("/subjects/{subject_id}")
async def delete_subject(
    subject_id: int,
    user_id: int = Depends(get_current_user_id),
    db: Session = Depends(get_db)
):
    """Delete a subject."""
    subject = db.query(Subject).filter(
        Subject.id == subject_id,
        Subject.user_id == user_id
    ).first()
    
    if not subject:
        raise HTTPException(status_code=404, detail="Subject not found")
    
    db.delete(subject)
    db.commit()
    return {"message": "Course deleted successfully"}


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


@router.post("/subjects/{subject_id}/concepts")
async def generate_concepts(
    subject_id: int,
    user_id: int = Depends(get_current_user_id),
    db: Session = Depends(get_db)
):
    """Generate key concepts for a subject using AI."""
    from sqlalchemy.orm.attributes import flag_modified
    
    subject = db.query(Subject).filter(
        Subject.id == subject_id,
        Subject.user_id == user_id
    ).first()
    
    if not subject:
        raise HTTPException(status_code=404, detail="Subject not found")
    
    # Generate concepts using AI
    concepts = AcademicAgent.generate_subject_concepts(subject.name)
    
    # Store concepts in subject metadata
    if not subject.subject_data:
        subject.subject_data = {}
    
    subject.subject_data['concepts'] = [
        {"id": i + 1, "name": concept, "learned": False}
        for i, concept in enumerate(concepts)
    ]
    
    # Flag the JSON field as modified
    flag_modified(subject, 'subject_data')
    db.commit()
    db.refresh(subject)
    
    return {"concepts": subject.subject_data.get('concepts', [])}


@router.put("/subjects/{subject_id}/concepts/{concept_id}/toggle")
async def toggle_concept(
    subject_id: int,
    concept_id: int,
    user_id: int = Depends(get_current_user_id),
    db: Session = Depends(get_db)
):
    """Toggle concept learned status."""
    from sqlalchemy.orm.attributes import flag_modified
    
    subject = db.query(Subject).filter(
        Subject.id == subject_id,
        Subject.user_id == user_id
    ).first()
    
    if not subject:
        raise HTTPException(status_code=404, detail="Subject not found")
    
    if not subject.subject_data or 'concepts' not in subject.subject_data:
        raise HTTPException(status_code=400, detail="No concepts found for this subject")
    
    # Toggle the concept
    for concept in subject.subject_data['concepts']:
        if concept['id'] == concept_id:
            concept['learned'] = not concept.get('learned', False)
            break
    
    # Calculate progress: Each concept = 10% (5 concepts = 50%, documentation = 50%)
    concepts = subject.subject_data.get('concepts', [])
    learned_count = sum(1 for c in concepts if c.get('learned', False))
    concept_progress = learned_count * 10  # 10% per concept, max 50%
    
    # Check if documentation was already submitted
    has_documentation = subject.subject_data.get('documentation_submitted', False)
    doc_progress = 50 if has_documentation else 0
    
    subject.progress = concept_progress + doc_progress
    
    # Flag the JSON field as modified for SQLAlchemy to detect changes
    flag_modified(subject, 'subject_data')
    db.commit()
    
    return {"message": "Concept toggled successfully", "progress": subject.progress}


@router.post("/subjects/{subject_id}/generate-task")
async def generate_project_task(
    subject_id: int,
    user_id: int = Depends(get_current_user_id),
    db: Session = Depends(get_db)
):
    """Generate a project task covering all concepts of the subject."""
    subject = db.query(Subject).filter(
        Subject.id == subject_id,
        Subject.user_id == user_id
    ).first()
    
    if not subject:
        raise HTTPException(status_code=404, detail="Subject not found")
    
    # Initialize subject_data if needed
    if not subject.subject_data:
        subject.subject_data = {}
    
    # Check if task already exists - return existing task
    existing_task = subject.subject_data.get('generated_task')
    if existing_task:
        return {"task": existing_task, "is_existing": True}
    
    # Get concepts
    concepts = subject.subject_data.get('concepts', []) if subject.subject_data else []
    concept_names = [c['name'] for c in concepts]
    
    # Generate project task using AI
    task = AcademicAgent.generate_project_task(subject.name, concept_names)
    
    # Save the generated task to database
    subject.subject_data = {**subject.subject_data, 'generated_task': task}
    flag_modified(subject, 'subject_data')
    db.commit()
    
    return {"task": task, "is_existing": False}


@router.post("/subjects/submit-project")
async def submit_project(
    subject_id: int = Form(...),
    task: str = Form(...),
    github_link: Optional[str] = Form(None),
    documentation: UploadFile = File(...),
    user_id: int = Depends(get_current_user_id),
    db: Session = Depends(get_db)
):
    """Submit a project with documentation."""
    # Validate file type
    allowed_types = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/msword']
    
    if documentation.content_type not in allowed_types:
        raise HTTPException(
            status_code=400,
            detail="Only PDF and DOCX files are allowed for documentation"
        )
    
    # Save file (in production, upload to cloud storage)
    file_location = f"uploads/{user_id}_{subject_id}_{documentation.filename}"
    
    # Update subject metadata
    subject = db.query(Subject).filter(
        Subject.id == subject_id,
        Subject.user_id == user_id
    ).first()
    
    if not subject:
        raise HTTPException(status_code=404, detail="Subject not found")
    
    if not subject.subject_data:
        subject.subject_data = {}
    
    if 'submissions' not in subject.subject_data:
        subject.subject_data['submissions'] = []
    
    # Mark documentation as submitted
    subject.subject_data['documentation_submitted'] = True
    subject.subject_data['submissions'].append({
        'task': task,
        'github_link': github_link,
        'documentation': documentation.filename,
        'submitted_at': datetime.now(timezone.utc).isoformat()
    })
    
    # Update subject progress to 100% and status to completed
    subject.progress = 100
    subject.status = SubjectStatus.COMPLETED
    
    # Create a new project in the Projects table as completed
    new_project = Project(
        user_id=user_id,
        title=f"{subject.name} Project",
        description=task,
        problem_statement=task,
        status=ProjectStatus.COMPLETED,
        github_url=github_link if github_link else None,
        completion_percentage=100,
        difficulty_level="Intermediate",
        start_date=subject.created_at,
        end_date=datetime.now(timezone.utc)
    )
    db.add(new_project)
    
    flag_modified(subject, 'subject_data')
    db.commit()
    db.refresh(new_project)
    
    return {
        "message": "Project submitted successfully",
        "subject_id": subject_id,
        "project_id": new_project.id,
        "documentation": documentation.filename
    }

