from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from database import get_db
from app.schemas.project import (
    ProjectCreate, ProjectResponse, ProjectUpdate, ProjectGenerateRequest,
    MilestoneCreate, MilestoneResponse
)
from app.models.project import Project, Milestone, ProjectStatus
from app.models.academic import Subject
from app.models.cv import CV
from app.models.user import User
from app.utils.auth import get_current_user_id
from app.agents.project_agent import ProjectAgent
import json
from datetime import datetime

router = APIRouter()


@router.get("", response_model=List[ProjectResponse])
async def get_projects(
    user_id: int = Depends(get_current_user_id),
    db: Session = Depends(get_db)
):
    """Get all projects for current user."""
    projects = db.query(Project).filter(Project.user_id == user_id).all()
    return projects


@router.post("", response_model=ProjectResponse, status_code=status.HTTP_201_CREATED)
async def create_project(
    project_data: ProjectCreate,
    user_id: int = Depends(get_current_user_id),
    db: Session = Depends(get_db)
):
    """Create a new project manually."""
    project = Project(
        user_id=user_id,
        title=project_data.title,
        description=project_data.description,
        problem_statement=project_data.problem_statement,
        required_skills=json.dumps(project_data.required_skills),
        deliverables=json.dumps(project_data.deliverables),
        evaluation_criteria=json.dumps(project_data.evaluation_criteria),
        difficulty_level=project_data.difficulty_level,
        estimated_hours=project_data.estimated_hours,
        status=ProjectStatus.NOT_STARTED,
        completion_percentage=0
    )
    db.add(project)
    db.commit()
    db.refresh(project)
    return project


@router.post("/generate", response_model=ProjectResponse, status_code=status.HTTP_201_CREATED)
async def generate_project(
    request: ProjectGenerateRequest,
    user_id: int = Depends(get_current_user_id),
    db: Session = Depends(get_db)
):
    """AI-generate a project based on a subject."""
    # Get the subject
    subject = db.query(Subject).filter(
        Subject.id == request.subject_id,
        Subject.user_id == user_id
    ).first()
    
    if not subject:
        raise HTTPException(status_code=404, detail="Subject not found")
    
    # Generate project using AI
    generated = ProjectAgent.generate_project(
        subject_name=subject.name,
        subject_description=subject.description,
        difficulty="Intermediate"
    )
    
    # Create project
    project = Project(
        user_id=user_id,
        title=generated.get("title"),
        description=generated.get("description"),
        problem_statement=generated.get("problem_statement"),
        required_skills=json.dumps(generated.get("required_skills", [])),
        deliverables=json.dumps(generated.get("deliverables", [])),
        evaluation_criteria=json.dumps(generated.get("evaluation_criteria", [])),
        difficulty_level="Intermediate",
        estimated_hours=generated.get("estimated_hours", 30),
        status=ProjectStatus.NOT_STARTED,
        completion_percentage=0
    )
    db.add(project)
    db.commit()
    db.refresh(project)
    return project


@router.get("/{project_id}", response_model=ProjectResponse)
async def get_project(
    project_id: int,
    user_id: int = Depends(get_current_user_id),
    db: Session = Depends(get_db)
):
    """Get a specific project."""
    project = db.query(Project).filter(
        Project.id == project_id,
        Project.user_id == user_id
    ).first()
    
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    return project


@router.put("/{project_id}", response_model=ProjectResponse)
async def update_project(
    project_id: int,
    project_data: ProjectUpdate,
    user_id: int = Depends(get_current_user_id),
    db: Session = Depends(get_db)
):
    """Update a project."""
    project = db.query(Project).filter(
        Project.id == project_id,
        Project.user_id == user_id
    ).first()
    
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    old_status = project.status
    
    # Update fields
    update_data = project_data.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(project, key, value)
    
    # Auto-update CV when project is marked as completed
    if old_status != "completed" and project.status == "completed":
        # Get user
        user = db.query(User).filter(User.id == user_id).first()
        
        # Get all completed projects
        completed_projects = db.query(Project).filter(
            Project.user_id == user_id,
            Project.status == "completed"
        ).all()
        
        # Get user's skills
        from app.models.academic import Skill
        skills = db.query(Skill).filter(Skill.user_id == user_id).all()
        
        # Prepare CV data
        projects_list = [
            {
                "title": p.title,
                "description": p.description,
                "required_skills": json.loads(p.required_skills) if isinstance(p.required_skills, str) else p.required_skills,
                "deliverables": json.loads(p.deliverables) if isinstance(p.deliverables, str) else p.deliverables
            }
            for p in completed_projects
        ]
        
        skills_list = [
            {
                "name": s.name,
                "level": s.proficiency_level or 0,
                "category": s.category
            }
            for s in skills
        ]
        
        # Update or create CV
        cv = db.query(CV).filter(CV.user_id == user_id).first()
        if cv:
            cv.projects = projects_list
            cv.skills = skills_list
            cv.updated_at = datetime.utcnow()
        else:
            cv = CV(
                user_id=user_id,
                summary=f"{user.degree_program} student specializing in {user.career_goal}. Passionate about building impactful projects and continuous learning.",
                education={
                    "degree": user.degree_program,
                    "year": user.current_year,
                    "semester": user.current_semester
                },
                skills=skills_list,
                projects=projects_list
            )
            db.add(cv)
    
    db.commit()
    db.refresh(project)
    return project


@router.delete("/{project_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_project(
    project_id: int,
    user_id: int = Depends(get_current_user_id),
    db: Session = Depends(get_db)
):
    """Delete a project."""
    project = db.query(Project).filter(
        Project.id == project_id,
        Project.user_id == user_id
    ).first()
    
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    db.delete(project)
    db.commit()
    return None


@router.get("/{project_id}/milestones", response_model=List[MilestoneResponse])
async def get_project_milestones(
    project_id: int,
    user_id: int = Depends(get_current_user_id),
    db: Session = Depends(get_db)
):
    """Get all milestones for a project."""
    # Verify project ownership
    project = db.query(Project).filter(
        Project.id == project_id,
        Project.user_id == user_id
    ).first()
    
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    milestones = db.query(Milestone).filter(Milestone.project_id == project_id).all()
    return milestones


@router.post("/{project_id}/milestones", response_model=MilestoneResponse, status_code=status.HTTP_201_CREATED)
async def create_milestone(
    project_id: int,
    milestone_data: MilestoneCreate,
    user_id: int = Depends(get_current_user_id),
    db: Session = Depends(get_db)
):
    """Add a milestone to a project."""
    # Verify project ownership
    project = db.query(Project).filter(
        Project.id == project_id,
        Project.user_id == user_id
    ).first()
    
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    milestone = Milestone(
        user_id=user_id,
        project_id=project_id,
        title=milestone_data.title,
        description=milestone_data.description,
        target_date=milestone_data.target_date,
        is_completed=False
    )
    db.add(milestone)
    db.commit()
    db.refresh(milestone)
    return milestone
