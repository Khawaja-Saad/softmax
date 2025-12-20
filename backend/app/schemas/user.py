from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime


class UserBase(BaseModel):
    email: EmailStr
    full_name: str


class UserCreate(UserBase):
    password: str = Field(..., min_length=6)
    degree_program: Optional[str] = None
    current_year: Optional[int] = Field(None, ge=1, le=6)
    current_semester: Optional[int] = Field(None, ge=1, le=12)
    career_goal: Optional[str] = None


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserResponse(UserBase):
    id: int
    username: Optional[str]
    degree_program: Optional[str]
    current_year: Optional[int]
    current_semester: Optional[int]
    career_goal: Optional[str]
    is_active: bool
    created_at: datetime
    
    class Config:
        from_attributes = True


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse


class UserUpdate(BaseModel):
    full_name: Optional[str] = None
    degree_program: Optional[str] = None
    current_year: Optional[int] = Field(None, ge=1, le=6)
    current_semester: Optional[int] = Field(None, ge=1, le=12)
    career_goal: Optional[str] = None


class ProfileUpdate(BaseModel):
    username: Optional[str] = None
    full_name: Optional[str] = None


class PasswordChange(BaseModel):
    current_password: str
    new_password: str = Field(..., min_length=6)
