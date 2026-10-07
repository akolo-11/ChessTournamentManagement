from fastapi import Depends, HTTPException, status
from sqlalchemy.orm import Session

from . import crud, models
from .database import get_db


def get_tournament_or_404(
    tournament_id: str,
    db: Session = Depends(get_db),
) -> models.Tournament:
    tournament = crud.get_tournament(db, tournament_id)
    if tournament is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, detail="Турнир не найден")
    return tournament