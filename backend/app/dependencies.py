from fastapi import Depends, HTTPException, status
from sqlalchemy.orm import Session
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

from . import crud, models, security
from .database import get_db

bearer_scheme = HTTPBearer(auto_error=False)

def get_tournament_or_404(
    tournament_id: str,
    db: Session = Depends(get_db),
) -> models.Tournament:
    tournament = crud.get_tournament(db, tournament_id)
    if tournament is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, detail="Турнир не найден")
    return tournament

def get_current_user(
    credentials: HTTPAuthorizationCredentials | None = Depends(bearer_scheme),
    db: Session = Depends(get_db),
) -> models.User:
    if credentials is None:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, detail="Требуется авторизация")
    payload = security.decode_access_token(credentials.credentials)
    if payload is None:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, detail="Недействительный токен")
    user = db.get(models.User, payload["sub"])
    if user is None or not user.is_active:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, detail="Пользователь не найден")
    return user


def require_role(*roles: str):
    def checker(user: models.User = Depends(get_current_user)) -> models.User:
        if user.role not in roles:
            raise HTTPException(status.HTTP_403_FORBIDDEN, detail="Недостаточно прав")
        return user
    return checker

require_admin = require_role("admin")
require_judge = require_role("admin", "judge")