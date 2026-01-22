from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from app.core.database import SessionLocal
from app.core.security import hash_password, verify_password, create_access_token
from app.api.deps import get_db, get_current_user

from app.models.user import User
from app.schemas.auth import UserCreate, UserLogin, TokenResponse
from app.core.jwt import create_email_verify_token, verify_email_token
from app.core.email import send_verification_email

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# -------------------------------
# POST /api/auth/register
# -------------------------------
@router.post("/register")
async def register(data: UserCreate, db: Session = Depends(get_db)):
    if db.query(User).filter(User.email == data.email).first():
        raise HTTPException(status_code=400, detail="Email already exists")

    user = User(
        email=data.email,
        hashed_password=hash_password(data.password),
        is_verified=False
    )

    db.add(user)
    db.commit()

    token = create_email_verify_token(user.email)
    await send_verification_email(user.email, token)

    return {"message": "Registration successful. Please check your email to verify your account."}

# -------------------------------
# POST /api/auth/login
# -------------------------------
@router.post("/login")
def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(
        User.email == form_data.username
    ).first()

    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(status_code=400, detail="Incorrect email or password")

    if not user.is_verified:
        raise HTTPException(status_code=403, detail="Email not verified")
    
    access_token = create_access_token(
        data={"sub": str(user.id)}
    )

    return {
        "access_token": access_token,
        "token_type": "bearer"
    }

@router.get("/me")
def me(user: User = Depends(get_current_user)):
    return {
        "id": user.id,
        "email": user.email,
        "role": user.role
    }

@router.get("/verify-email")
def verify_email(token: str, db: Session = Depends(get_db)):
    email = verify_email_token(token)
    if not email:
        raise HTTPException(status_code=400, detail="Invalid or expired token")

    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    if user.is_verified:
        return {"message": "Email already verified"}

    user.is_verified = True
    db.commit()

    return {"message": "Email verified successfully"}

