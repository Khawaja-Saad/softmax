from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional, Dict, Any
from pydantic import BaseModel
from database import get_db
from app.utils.auth import get_current_user_id
from app.models.cv import CV
from app.models.project import Project
from app.models.academic import Skill
from app.models.user import User
from app.agents.academic_agent import AcademicAgent
from datetime import datetime

router = APIRouter()
academic_agent = AcademicAgent()


# Pydantic models for CV data
class CVSaveRequest(BaseModel):
    full_name: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[str] = None
    linkedin_url: Optional[str] = None
    github_url: Optional[str] = None
    portfolio_url: Optional[str] = None
    location: Optional[str] = None
    summary: Optional[str] = None
    education: Optional[List[Dict[str, Any]]] = None
    experience: Optional[List[Dict[str, Any]]] = None
    technical_skills: Optional[str] = None
    soft_skills: Optional[str] = None
    languages: Optional[str] = None
    certifications: Optional[List[Dict[str, Any]]] = None
    projects: Optional[List[Dict[str, Any]]] = None

class CVGenerateRequest(BaseModel):
    cvData: Dict[str, Any]
    format: str

@router.get("/current")
async def get_current_cv(
    user_id: int = Depends(get_current_user_id),
    db: Session = Depends(get_db)
):
    """Get user's current CV or generate from user profile data"""
    # First check if user has a saved CV
    cv = db.query(CV).filter(CV.user_id == user_id).order_by(CV.updated_at.desc()).first()
    
    # Get user data
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Get user's projects
    projects = db.query(Project).filter(Project.user_id == user_id).all()
    projects_list = [
        {
            "title": p.title,
            "description": p.description,
            "github_url": p.github_url,
            "live_url": p.live_url,
            "required_skills": p.required_skills
        }
        for p in projects
    ]
    
    # Get user's skills
    skills = db.query(Skill).filter(Skill.user_id == user_id).all()
    skills_list = [s.name for s in skills if s.name]
    
    if cv:
        # Return existing CV but update with latest user data
        # Only update fields that are empty in the CV but available from user
        response_data = {
            "id": cv.id,
            "user_id": cv.user_id,
            "full_name": cv.full_name or user.full_name,
            "email": cv.email or user.email,
            "phone": cv.phone,
            "linkedin_url": cv.linkedin_url,
            "github_url": cv.github_url,
            "portfolio_url": cv.portfolio_url,
            "location": cv.location,
            "summary": cv.summary,
            "education": cv.education if cv.education else [{"degree": user.degree_program, "year": user.current_year}] if user.degree_program else [],
            "experience": cv.experience or [],
            "technical_skills": cv.technical_skills or ", ".join(skills_list) if skills_list else "",
            "soft_skills": cv.soft_skills,
            "languages": cv.languages,
            "certifications": cv.certifications or [],
            "projects": cv.projects if cv.projects else projects_list,
            "updated_at": cv.updated_at
        }
        return response_data
    
    # If no CV exists, create response from user profile data
    # Build education from user data
    education = []
    if user.degree_program:
        education.append({
            "degree": user.degree_program,
            "year": user.current_year,
            "semester": user.current_semester
        })
    
    # Build summary from user data
    summary = ""
    if user.degree_program or user.career_goal:
        parts = []
        if user.degree_program:
            parts.append(f"{user.degree_program} student")
        if user.career_goal:
            parts.append(f"specializing in {user.career_goal}")
        summary = " ".join(parts) + "." if parts else ""
    
    return {
        "id": None,
        "user_id": user_id,
        "full_name": user.full_name,
        "email": user.email,
        "phone": None,
        "linkedin_url": None,
        "github_url": None,
        "portfolio_url": None,
        "location": None,
        "summary": summary,
        "education": education,
        "experience": [],
        "technical_skills": ", ".join(skills_list) if skills_list else "",
        "soft_skills": None,
        "languages": None,
        "certifications": [],
        "projects": projects_list,
        "updated_at": None
    }

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

@router.post("/save")
async def save_cv(
    cv_data: CVSaveRequest,
    user_id: int = Depends(get_current_user_id),
    db: Session = Depends(get_db)
):
    """Save or update user's CV profile data"""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Check if CV exists
    existing_cv = db.query(CV).filter(CV.user_id == user_id).first()
    
    # Prepare CV data dictionary
    cv_dict = {
        "user_id": user_id,
        "full_name": cv_data.full_name,
        "phone": cv_data.phone,
        "email": cv_data.email,
        "linkedin_url": cv_data.linkedin_url,
        "github_url": cv_data.github_url,
        "portfolio_url": cv_data.portfolio_url,
        "location": cv_data.location,
        "summary": cv_data.summary,
        "education": cv_data.education or [],
        "experience": cv_data.experience or [],
        "technical_skills": cv_data.technical_skills,
        "soft_skills": cv_data.soft_skills,
        "languages": cv_data.languages,
        "certifications": cv_data.certifications or [],
        "projects": cv_data.projects or [],
        "updated_at": datetime.utcnow()
    }
    
    if existing_cv:
        # Update existing CV
        for key, value in cv_dict.items():
            if key != "user_id":  # Don't update user_id
                setattr(existing_cv, key, value)
        db.commit()
        db.refresh(existing_cv)
        return existing_cv
    else:
        # Create new CV
        new_cv = CV(**cv_dict)
        db.add(new_cv)
        db.commit()
        db.refresh(new_cv)
        return new_cv

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

@router.post("/generate-formatted")
async def generate_formatted_cv(
    request: CVGenerateRequest,
    user_id: int = Depends(get_current_user_id),
    db: Session = Depends(get_db)
):
    """Generate a formatted CV using AI based on selected format"""
    cv_data = request.cvData
    format_type = request.format
    
    # Generate formatted CV using AI
    formatted_cv = academic_agent.generate_formatted_cv(cv_data, format_type)
    
    return {
        "formatted_cv": formatted_cv,
        "format": format_type
    }
