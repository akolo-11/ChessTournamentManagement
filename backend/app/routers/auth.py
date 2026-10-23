from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session
from uuid import uuid4

from .. import models, schemas, security
from ..database import get_db
from ..dependencies import get_current_user, require_admin

router = APIRouter(prefix="/api/auth", tags=["auth"])


@router.post("/register", response_model=schemas.UserOut, status_code=201)
def register(data: schemas.UserRegister, db: Session = Depends(get_db)):
    exists = db.scalar(select(models.User).where(models.User.username == data.username))
    if exists:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, detail="Имя пользователя занято")

    # Первый зарегистрированный становится админом
    is_first = db.scalar(select(models.User).limit(1)) is None

    user = models.User(
        id=str(uuid4()),
        username=data.username,
        password_hash=security.hash_password(data.password),
        role="admin" if is_first else "viewer",
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


@router.post("/login", response_model=schemas.TokenPair)
def login(data: schemas.UserRegister, db: Session = Depends(get_db)):
    user = db.scalar(select(models.User).where(models.User.username == data.username))
    if user is None or not security.verify_password(data.password, user.password_hash):
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, detail="Неверные учётные данные")
    if not user.is_active:
        raise HTTPException(status.HTTP_403_FORBIDDEN, detail="Учётная запись заблокирована")

    return schemas.TokenPair(
        access_token=security.create_access_token(user),
        refresh_token=security.create_refresh_token(db, user),
    )


@router.post("/refresh", response_model=schemas.TokenPair)
def refresh(data: schemas.RefreshRequest, db: Session = Depends(get_db)):
    user = security.consume_refresh_token(db, data.refresh_token)
    if user is None:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, detail="Refresh-токен недействителен")
    return schemas.TokenPair(
        access_token=security.create_access_token(user),
        refresh_token=security.create_refresh_token(db, user),
    )


@router.post("/logout", status_code=204)
def logout(
    user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    security.revoke_all_refresh_tokens(db, user.id)


@router.get("/me", response_model=schemas.UserOut)
def me(user: models.User = Depends(get_current_user)):
    return user

@router.post("/judges", response_model=schemas.UserOut, status_code=201)
def create_judge(
    data: schemas.UserCreateJudge,
    db: Session = Depends(get_db),
    _: models.User = Depends(require_admin),
):
    exists = db.scalar(select(models.User).where(models.User.username == data.username))
    if exists:
        raise HTTPException(400, "Имя пользователя занято")
    
    user = models.User(
        id=str(uuid4()),
        username=data.username,
        password_hash=security.hash_password(data.password),
        role="judge",
        full_name=data.full_name,
        organization=data.organization,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user