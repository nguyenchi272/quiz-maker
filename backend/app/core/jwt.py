from datetime import datetime, timedelta
from jose import jwt
from app.core.config import settings

SECRET_KEY = "CHANGE_ME_SUPER_SECRET"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60
EMAIL_VERIFY_EXPIRE_HOURS = 24

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(
        minutes=ACCESS_TOKEN_EXPIRE_MINUTES
    )
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def create_email_verify_token(email: str):
    payload = {
        "sub": email,
        "type": "email_verify",
        "exp": datetime.utcnow() + timedelta(hours=EMAIL_VERIFY_EXPIRE_HOURS)
    }
    return jwt.encode(payload, settings.SECRET_KEY, algorithm="HS256")


def verify_email_token(token: str):
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])
        if payload.get("type") != "email_verify":
            return None
        return payload.get("sub")
    except jwt.ExpiredSignatureError:
        return None
    except jwt.JWTError:
        return None
