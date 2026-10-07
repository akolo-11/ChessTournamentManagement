from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from .. import crud, schemas
from ..database import get_db
from ..dependencies import get_tournament_or_404

router = APIRouter(prefix="/api/tournaments/{tournament_id}/matches", tags=["matches"])


@router.put("/{match_id}/result", response_model=schemas.MatchOut)
def update_result(
    match_id: str,
    data: schemas.ResultUpdate,
    tournament=Depends(get_tournament_or_404),
    db: Session = Depends(get_db),
):
    match = crud.update_result(db, tournament.id, match_id, data.result)
    if match is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, detail="Партия не найдена")
    return match