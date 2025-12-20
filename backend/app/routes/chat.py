from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy.orm.attributes import flag_modified
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime, timedelta, timezone
from database import get_db
from app.models.chat import ChatSession, ChatMessage
from app.utils.auth import get_current_user_id
import os
from dotenv import load_dotenv
from openai import OpenAI

# Load environment variables
load_dotenv()

router = APIRouter(prefix="/api/chat", tags=["chat"])

# Initialize Groq client
client = OpenAI(
    api_key=os.getenv("OPENAI_API_KEY"),
    base_url="https://api.groq.com/openai/v1"
)

# EduPilot System Prompt - Restricts bot to platform-related queries only
EDUBOT_SYSTEM_PROMPT = """You are EduBot, the official AI assistant for EduPilot - an AI-powered career development platform for university students.

ABOUT EDUPILOT:
EduPilot is a comprehensive platform that helps university students manage their academic journey and career development. Here are its key features:

1. **Dashboard**: Overview of academic progress, ongoing projects, skills development, and upcoming opportunities.

2. **Subjects/Courses**: 
   - Add and manage your university courses
   - AI generates 5 key concepts for each subject
   - Track learning progress by marking concepts as learned
   - Generate AI-powered project tasks when all concepts are completed

3. **Projects**: 
   - View and manage your academic projects
   - Track project status (In Progress, Completed, On Hold)
   - Monitor project milestones and deadlines

4. **Profile (CV Section)**:
   - Manage your personal information
   - Add education, experience, skills, and certifications
   - Build your professional profile

5. **CV Generator**:
   - Generate professional CVs in multiple formats
   - ATS-optimized format for job applications
   - Modern, Creative, and Minimal design options
   - Export as PDF

6. **Opportunities**:
   - Discover internships, jobs, and scholarships
   - AI-matched opportunities based on your profile
   - Apply directly through the platform

7. **Settings**:
   - Update personal information
   - Change password
   - Download activity reports

IMPORTANT RULES:
1. ONLY answer questions related to EduPilot platform and its features
2. If asked about topics unrelated to EduPilot (like general knowledge, coding help, other websites), politely redirect: "I'm EduBot, your EduPilot assistant! I can only help with questions about the EduPilot platform. Is there anything about your dashboard, subjects, projects, CV, or opportunities I can help with?"
3. Be friendly, helpful, and concise
4. Use emojis occasionally to be engaging 🎓
5. If users ask how to use a feature, provide step-by-step guidance
6. Encourage users to explore all platform features

COMMON QUESTIONS:
- How to add a course? Go to Subjects page → Click "Add New Course" → Enter course name → AI will generate concepts automatically
- How to generate CV? Go to CV Generator → Fill your details or they auto-populate from Profile → Select format → Click Generate
- How to track projects? Go to Projects page to see all your projects and their status
- How to find opportunities? Go to Opportunities page to see AI-matched internships and jobs

Always be helpful and guide users to get the most out of EduPilot! 🚀"""


class ChatRequest(BaseModel):
    message: str


class ChatMessageResponse(BaseModel):
    id: int
    role: str
    content: str
    created_at: datetime

    class Config:
        from_attributes = True


class ChatSessionResponse(BaseModel):
    id: int
    messages: List[ChatMessageResponse]
    created_at: datetime
    updated_at: Optional[datetime]

    class Config:
        from_attributes = True


def cleanup_old_messages(db: Session, user_id: int):
    """Delete chat messages older than 7 days."""
    seven_days_ago = datetime.now(timezone.utc) - timedelta(days=7)
    
    # Get old sessions
    old_sessions = db.query(ChatSession).filter(
        ChatSession.user_id == user_id,
        ChatSession.created_at < seven_days_ago
    ).all()
    
    # Delete old sessions (messages will cascade delete)
    for session in old_sessions:
        db.delete(session)
    
    db.commit()


@router.get("/session", response_model=Optional[ChatSessionResponse])
async def get_or_create_session(
    user_id: int = Depends(get_current_user_id),
    db: Session = Depends(get_db)
):
    """Get the user's active chat session or create a new one."""
    # Cleanup old messages first
    cleanup_old_messages(db, user_id)
    
    # Get the most recent session
    session = db.query(ChatSession).filter(
        ChatSession.user_id == user_id
    ).order_by(ChatSession.created_at.desc()).first()
    
    if not session:
        # Create new session
        session = ChatSession(user_id=user_id)
        db.add(session)
        db.commit()
        db.refresh(session)
    
    return session


@router.post("/message", response_model=ChatMessageResponse)
async def send_message(
    request: ChatRequest,
    user_id: int = Depends(get_current_user_id),
    db: Session = Depends(get_db)
):
    """Send a message to EduBot and get a response."""
    # Get or create session
    session = db.query(ChatSession).filter(
        ChatSession.user_id == user_id
    ).order_by(ChatSession.created_at.desc()).first()
    
    if not session:
        session = ChatSession(user_id=user_id)
        db.add(session)
        db.commit()
        db.refresh(session)
    
    # Save user message
    user_message = ChatMessage(
        session_id=session.id,
        role="user",
        content=request.message
    )
    db.add(user_message)
    db.commit()
    
    # Get conversation history (last 10 messages for context)
    recent_messages = db.query(ChatMessage).filter(
        ChatMessage.session_id == session.id
    ).order_by(ChatMessage.created_at.desc()).limit(10).all()
    
    # Reverse to get chronological order
    recent_messages = list(reversed(recent_messages))
    
    # Build messages for API
    messages = [{"role": "system", "content": EDUBOT_SYSTEM_PROMPT}]
    for msg in recent_messages:
        messages.append({"role": msg.role, "content": msg.content})
    
    try:
        # Call Groq API
        response = client.chat.completions.create(
            model="llama-3.1-8b-instant",
            messages=messages,
            temperature=0.7,
            max_tokens=500
        )
        
        assistant_content = response.choices[0].message.content
    except Exception as e:
        print(f"Groq API error: {e}")
        assistant_content = "I'm having trouble connecting right now. Please try again in a moment! 🔄"
    
    # Save assistant message
    assistant_message = ChatMessage(
        session_id=session.id,
        role="assistant",
        content=assistant_content
    )
    db.add(assistant_message)
    
    # Update session timestamp
    session.updated_at = datetime.now(timezone.utc)
    db.commit()
    db.refresh(assistant_message)
    
    return assistant_message


@router.delete("/clear")
async def clear_chat(
    user_id: int = Depends(get_current_user_id),
    db: Session = Depends(get_db)
):
    """Clear all chat history for the user."""
    sessions = db.query(ChatSession).filter(
        ChatSession.user_id == user_id
    ).all()
    
    for session in sessions:
        db.delete(session)
    
    db.commit()
    
    return {"message": "Chat history cleared"}
