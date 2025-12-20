from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from database import get_db
from app.utils.auth import get_current_user_id
from app.models.cv import Opportunity
from app.models.academic import Skill
from app.models.user import User
from datetime import datetime
import httpx
import os

router = APIRouter()

# Findwork.dev API configuration
FINDWORK_API_KEY = os.getenv("FINDWORK_API_KEY", "1c7624843df925449dee76eda738dfdf019c38df")
FINDWORK_API_URL = "https://findwork.dev/api/jobs/"

@router.get("/jobs")
async def get_findwork_jobs(
    search: Optional[str] = Query(None, description="Search keywords like 'python', 'react', 'developer'"),
    location: Optional[str] = Query(None, description="Filter by location like 'london', 'remote', 'new york'"),
    remote: Optional[bool] = Query(None, description="Filter for remote jobs only"),
    employment_type: Optional[str] = Query(None, description="Filter by employment type like 'full time', 'contract'"),
    sort_by: Optional[str] = Query("relevance", description="Sort by 'relevance' or 'date'")
):
    """
    Proxy endpoint to fetch jobs from findwork.dev API
    Supports filtering by search, location, remote, employment_type, and sorting
    """
    try:
        # Build query parameters
        params = {}
        if search:
            params["search"] = search
        if location:
            params["location"] = location
        if remote is not None:
            params["remote"] = str(remote).lower()
        if employment_type:
            params["employment_type"] = employment_type
        if sort_by:
            params["sort_by"] = sort_by
            
        async with httpx.AsyncClient() as client:
            response = await client.get(
                FINDWORK_API_URL,
                params=params,
                headers={
                    "Authorization": f"Token {FINDWORK_API_KEY}"
                },
                timeout=30.0
            )
            
            if response.status_code != 200:
                raise HTTPException(
                    status_code=response.status_code,
                    detail=f"Failed to fetch jobs from findwork.dev: {response.text}"
                )
            
            return response.json()
    except httpx.TimeoutException:
        raise HTTPException(status_code=504, detail="Request to findwork.dev timed out")
    except httpx.RequestError as e:
        raise HTTPException(status_code=502, detail=f"Failed to connect to findwork.dev: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal error: {str(e)}")

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
