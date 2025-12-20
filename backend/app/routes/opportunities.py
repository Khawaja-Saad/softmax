from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from database import get_db
from app.utils.auth import get_current_user_id
from app.models.cv import Opportunity
from app.models.academic import Skill
from app.models.user import User
from datetime import datetime

router = APIRouter()

@router.get("")
async def get_opportunities(
    user_id: int = Depends(get_current_user_id),
    db: Session = Depends(get_db)
):
    """Get all opportunities for the user"""
    opportunities = db.query(Opportunity).filter(
        Opportunity.user_id == user_id
    ).order_by(Opportunity.match_score.desc()).all()
    
    return opportunities

@router.post("/match")
async def match_opportunities(
    user_id: int = Depends(get_current_user_id),
    db: Session = Depends(get_db)
):
    """AI-powered opportunity matching based on user skills"""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Get user's skills
    skills = db.query(Skill).filter(Skill.user_id == user_id).all()
    
    if not skills:
        raise HTTPException(
            status_code=400, 
            detail="No skills found. Generate your skill roadmap first."
        )
    
    # In a real implementation, this would use AI to match with real job postings
    # For MVP, we'll create sample opportunities based on skills
    
    skill_names = [s.name for s in skills]
    
    # Sample opportunities based on common career paths
    sample_opportunities = [
        {
            "title": "Software Engineering Intern",
            "company": "Tech Corp",
            "location": "Remote",
            "type": "internship",
            "description": "Looking for students with programming and problem-solving skills",
            "required_skills": ["Python", "JavaScript", "Problem Solving"],
            "match_score": 85.0,
            "url": "https://example.com/job1"
        },
        {
            "title": "Data Science Intern",
            "company": "Data Analytics Inc",
            "location": "New York",
            "type": "internship",
            "description": "Seeking students with data analysis and ML experience",
            "required_skills": ["Python", "Data Analysis", "Machine Learning"],
            "match_score": 78.0,
            "url": "https://example.com/job2"
        },
        {
            "title": "Full Stack Developer",
            "company": "StartupXYZ",
            "location": "San Francisco",
            "type": "job",
            "description": "Full-time position for graduates with web development skills",
            "required_skills": ["JavaScript", "React", "Node.js", "Database Design"],
            "match_score": 72.0,
            "url": "https://example.com/job3"
        },
        {
            "title": "Research Assistant",
            "company": "University Lab",
            "location": "Boston",
            "type": "research",
            "description": "Research opportunity in AI/ML",
            "required_skills": ["Machine Learning", "Python", "Research"],
            "match_score": 68.0,
            "url": "https://example.com/job4"
        }
    ]
    
    # Clear existing opportunities
    db.query(Opportunity).filter(Opportunity.user_id == user_id).delete()
    
    # Create new opportunities
    created_opportunities = []
    for opp_data in sample_opportunities:
        opportunity = Opportunity(
            user_id=user_id,
            **opp_data
        )
        db.add(opportunity)
        created_opportunities.append(opportunity)
    
    db.commit()
    
    # Refresh to get IDs
    for opp in created_opportunities:
        db.refresh(opp)
    
    return {
        "message": f"Found {len(created_opportunities)} matching opportunities",
        "opportunities": created_opportunities
    }

@router.put("/{opportunity_id}/apply")
async def mark_as_applied(
    opportunity_id: int,
    user_id: int = Depends(get_current_user_id),
    db: Session = Depends(get_db)
):
    """Mark opportunity as applied"""
    opportunity = db.query(Opportunity).filter(
        Opportunity.id == opportunity_id,
        Opportunity.user_id == user_id
    ).first()
    
    if not opportunity:
        raise HTTPException(status_code=404, detail="Opportunity not found")
    
    opportunity.applied = True
    db.commit()
    db.refresh(opportunity)
    
    return opportunity
