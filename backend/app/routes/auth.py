from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from database import get_db
from app.schemas.user import UserCreate, UserLogin, UserResponse, TokenResponse, UserUpdate, ProfileUpdate, PasswordChange
from app.services.auth_service import AuthService
from app.utils.auth import create_access_token, get_current_user_id

router = APIRouter()


@router.post("/register", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
async def register(user_data: UserCreate, db: Session = Depends(get_db)):
    """Register a new user."""
    user = AuthService.create_user(db, user_data)
    
    # Create access token with user.id as string
    access_token = create_access_token(data={"sub": str(user.id)})
    
    return TokenResponse(
        access_token=access_token,
        user=UserResponse.from_orm(user)
    )


@router.post("/login", response_model=TokenResponse)
async def login(credentials: UserLogin, db: Session = Depends(get_db)):
    """Login user and return access token."""
    user = AuthService.authenticate_user(db, credentials.email, credentials.password)
    
    # Create access token with user.id as string
    access_token = create_access_token(data={"sub": str(user.id)})
    
    return TokenResponse(
        access_token=access_token,
        user=UserResponse.from_orm(user)
    )


@router.get("/me", response_model=UserResponse)
async def get_current_user(
    user_id: int = Depends(get_current_user_id),
    db: Session = Depends(get_db)
):
    """Get current user profile."""
    user = AuthService.get_user_by_id(db, user_id)
    return UserResponse.from_orm(user)


@router.put("/me", response_model=UserResponse)
async def update_current_user(
    update_data: UserUpdate,
    user_id: int = Depends(get_current_user_id),
    db: Session = Depends(get_db)
):
    """Update current user profile."""
    update_dict = update_data.dict(exclude_unset=True)
    user = AuthService.update_user(db, user_id, update_dict)
    return UserResponse.from_orm(user)


@router.put("/update-profile", response_model=UserResponse)
async def update_profile(
    profile_data: ProfileUpdate,
    user_id: int = Depends(get_current_user_id),
    db: Session = Depends(get_db)
):
    """Update user profile (username and full name)."""
    update_dict = profile_data.dict(exclude_unset=True)
    user = AuthService.update_user(db, user_id, update_dict)
    return UserResponse.from_orm(user)


@router.post("/change-password")
async def change_password(
    password_data: PasswordChange,
    user_id: int = Depends(get_current_user_id),
    db: Session = Depends(get_db)
):
    """Change user password without requiring logout."""
    AuthService.change_password(db, user_id, password_data.current_password, password_data.new_password)
    return {"message": "Password changed successfully"}


@router.get("/activity-report")
async def get_activity_report(
    user_id: int = Depends(get_current_user_id),
    db: Session = Depends(get_db)
):
    """Generate and download user activity report as PDF."""
    from fastapi.responses import Response
    
    pdf_content = AuthService.generate_activity_report(db, user_id)
    
    return Response(
        content=pdf_content,
        media_type="application/pdf",
        headers={
            "Content-Disposition": f"attachment; filename=activity_report_{user_id}.pdf"
        }
    )
