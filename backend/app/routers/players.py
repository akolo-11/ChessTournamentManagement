from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from .. import crud, models, schemas
from ..database import get_db
from ..dependencies import get_tournament_or_404

router = APIRouter(prefix="/api/tournaments/{tournament_id}/players", tags=["players"])


@router.post("", response_model=schemas.PlayerOut, status_code=status.HTTP_201_CREATED)
def add_player(
    data: schemas.PlayerCreate,
    tournament: models.Tournament = Depends(get_tournament_or_404),
    db: Session = Depends(get_db),
):
    try:
        return crud.add_player(db, tournament, data)
    except ValueError as e:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, detail=str(e))


@router.delete("/{player_id}", status_code=status.HTTP_204_NO_CONTENT)
def remove_player(
    player_id: str,
    tournament: models.Tournament = Depends(get_tournament_or_404),
    db: Session = Depends(get_db),
):
    if not crud.remove_player(db, tournament.id, player_id):
        raise HTTPException(status.HTTP_404_NOT_FOUND, detail="Игрок не найден")