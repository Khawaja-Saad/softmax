from datetime import datetime, timedelta, timezone
from typing import Optional
from jose import JWTError, jwt
from passlib.context import CryptContext
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from config import settings
import hashlib

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Bearer token security
security = HTTPBearer()


def _normalize_password(password: str) -> str:
    """Normalize password to handle bcrypt's 72-byte limit."""
    # If password is longer than 72 bytes, pre-hash with SHA256
    if len(password.encode('utf-8')) > 72:
        return hashlib.sha256(password.encode('utf-8')).hexdigest()
    return password


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a plain password against a hashed password."""
    normalized = _normalize_password(plain_password)
    return pwd_context.verify(normalized, hashed_password)


def get_password_hash(password: str) -> str:
    """Hash a password."""
    normalized = _normalize_password(password)
    return pwd_context.hash(normalized)


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """Create a JWT access token."""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    
    to_encode.update({"exp": expire})
    print(f"Creating token with payload: {to_encode}")  # Debug log
    encoded_jwt = jwt.encode(to_encode, settings.JWT_SECRET, algorithm=settings.JWT_ALGORITHM)
    print(f"Created token: {encoded_jwt}")  # Debug log
    return encoded_jwt


def decode_access_token(token: str) -> dict:
    """Decode and verify a JWT token."""
    try:
        print(f"Attempting to decode token: {token[:50]}...")  # Debug log
        payload = jwt.decode(token, settings.JWT_SECRET, algorithms=[settings.JWT_ALGORITHM])
        print(f"Successfully decoded payload: {payload}")  # Debug log
        return payload
    except JWTError as e:
        print(f"JWT Error: {type(e).__name__} - {str(e)}")  # Debug log
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )


async def get_current_user_id(credentials: HTTPAuthorizationCredentials = Depends(security)) -> int:
    """Get the current user ID from the JWT token."""
    token = credentials.credentials
    print(f"Received token: {token}")  # Debug log
    payload = decode_access_token(token)
    print(f"Decoded payload: {payload}")  # Debug log
    user_id_str: str = payload.get("sub")
    
    if user_id_str is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Convert string back to integer
    try:
        user_id = int(user_id_str)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid user ID in token",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    return user_id
