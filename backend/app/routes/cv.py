from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from database import get_db
from app.utils.auth import get_current_user_id
from app.models.cv import CV
from app.models.project import Project
from app.models.academic import Skill
from app.models.user import User
from datetime import datetime

router = APIRouter()

@router.get("/current")
async def get_current_cv(
    user_id: int = Depends(get_current_user_id),
    db: Session = Depends(get_db)
):
    """Get user's current CV"""
    cv = db.query(CV).filter(CV.user_id == user_id).order_by(CV.updated_at.desc()).first()
    if not cv:
        raise HTTPException(status_code=404, detail="No CV found. Generate one first.")
    return cv

@router.post("/generate")
async def generate_cv(
    user_id: int = Depends(get_current_user_id),
    db: Session = Depends(get_db)
):
    """Generate CV from user's projects and skills"""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Get user's completed projects
    completed_projects = db.query(Project).filter(
        Project.user_id == user_id,
        Project.status == "completed"
    ).all()
    
    # Get user's skills
    skills = db.query(Skill).filter(Skill.user_id == user_id).all()
    
    # Prepare CV data
    projects_list = [
        {
            "title": p.title,
            "description": p.description,
            "tech_stack": p.tech_stack,
            "github_url": p.github_url
        }
        for p in completed_projects
    ]
    
    skills_list = [
        {
            "name": s.name,
            "level": s.current_level or 0,
            "category": s.category
        }
        for s in skills
    ]
    
    # Check if CV exists
    existing_cv = db.query(CV).filter(CV.user_id == user_id).first()
    
    cv_data = {
        "user_id": user_id,
        "summary": f"{user.degree_program} student specializing in {user.career_goal}. Passionate about building impactful projects and continuous learning.",
        "education": {
            "degree": user.degree_program,
            "year": user.current_year,
            "semester": user.current_semester
        },
        "skills": skills_list,
        "projects": projects_list,
        "updated_at": datetime.utcnow()
    }
    
    if existing_cv:
        # Update existing CV
        for key, value in cv_data.items():
            setattr(existing_cv, key, value)
        db.commit()
        db.refresh(existing_cv)
        return existing_cv
    else:
        # Create new CV
        cv = CV(**cv_data)
        db.add(cv)
        db.commit()
        db.refresh(cv)
        return cv

@router.get("/download")
async def download_cv(
    user_id: int = Depends(get_current_user_id),
    db: Session = Depends(get_db)
):
    """Download CV as formatted document"""
    cv = db.query(CV).filter(CV.user_id == user_id).order_by(CV.updated_at.desc()).first()
    if not cv:
        raise HTTPException(status_code=404, detail="No CV found. Generate one first.")
    
    # In a real implementation, this would generate a PDF
    # For now, return CV data
    return {
        "message": "CV download would be implemented here",
        "cv_data": cv
    }
