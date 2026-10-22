from datetime import datetime, timedelta
from uuid import uuid4
import hashlib
import secrets

from jose import jwt, JWTError
from passlib.context import CryptContext
from sqlalchemy.orm import Session
from sqlalchemy import select

from . import models
from .config import settings


pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

ALGORITHM = "HS256"
ACCESS_TOKEN_TTL = timedelta(minutes=30)
REFRESH_TOKEN_TTL = timedelta(days=14)


# ─── Пароли ───

def hash_password(password: str) -> str:
    return pwd_context.hash(password)


def verify_password(plain: str, hashed: str) -> bool:
    return pwd_context.verify(plain, hashed)


# ─── Access token (JWT) ───

def create_access_token(user: models.User) -> str:
    payload = {
        "sub": user.id,
        "username": user.username,
        "role": user.role,
        "exp": datetime.utcnow() + ACCESS_TOKEN_TTL,
        "type": "access",
    }
    return jwt.encode(payload, settings.secret_key, algorithm=ALGORITHM)


def decode_access_token(token: str) -> dict | None:
    try:
        payload = jwt.decode(token, settings.secret_key, algorithms=[ALGORITHM])
        if payload.get("type") != "access":
            return None
        return payload
    except JWTError:
        return None


# ─── Refresh token (opaque, хранится в БД) ───

def create_refresh_token(db: Session, user: models.User) -> str:
    raw = secrets.token_urlsafe(48)
    token_hash = hashlib.sha256(raw.encode()).hexdigest()
    db.add(models.RefreshToken(
        id=str(uuid4()),
        user_id=user.id,
        token_hash=token_hash,
        expires_at=datetime.utcnow() + REFRESH_TOKEN_TTL,
    ))
    db.commit()
    return raw


def consume_refresh_token(db: Session, raw: str) -> models.User | None:
    """Проверяет refresh-токен и возвращает пользователя. Отзывает токен (rotation)."""
    token_hash = hashlib.sha256(raw.encode()).hexdigest()
    token = db.scalar(
        select(models.RefreshToken).where(models.RefreshToken.token_hash == token_hash)
    )
    if token is None or token.revoked:
        return None
    if token.expires_at < datetime.utcnow():
        return None
    token.revoked = True
    db.commit()
    return db.get(models.User, token.user_id)


def revoke_all_refresh_tokens(db: Session, user_id: str) -> None:
    """При выходе отзываем все активные refresh-токены пользователя."""
    tokens = db.scalars(
        select(models.RefreshToken).where(
            models.RefreshToken.user_id == user_id,
            models.RefreshToken.revoked == False,
        )
    ).all()
    for t in tokens:
        t.revoked = True
    db.commit()