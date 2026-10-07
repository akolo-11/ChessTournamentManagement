from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from .. import crud, models, schemas
from ..database import get_db
from ..dependencies import get_tournament_or_404

router = APIRouter(prefix="/api/tournaments", tags=["tournaments"])


@router.get("", response_model=list[schemas.TournamentListOut])
def list_tournaments(db: Session = Depends(get_db)):
    tournaments = crud.list_tournaments(db)
    return [
        schemas.TournamentListOut(
            id=t.id, name=t.name, type=t.type, status=t.status,
            start_date=t.start_date, end_date=t.end_date,
            location=t.location, total_rounds=t.total_rounds,
            players_count=len(t.players),
        )
        for t in tournaments
    ]


@router.get("/{tournament_id}", response_model=schemas.TournamentOut)
def get_tournament(tournament: models.Tournament = Depends(get_tournament_or_404)):
    return _to_out(tournament)


@router.post("", response_model=schemas.TournamentOut, status_code=status.HTTP_201_CREATED)
def create_tournament(data: schemas.TournamentCreate, db: Session = Depends(get_db)):
    tournament = crud.create_tournament(db, data)
    return _to_out(tournament)


@router.delete("/{tournament_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_tournament(
    tournament: models.Tournament = Depends(get_tournament_or_404),
    db: Session = Depends(get_db),
):
    crud.delete_tournament(db, tournament.id)


@router.post("/{tournament_id}/start", response_model=schemas.TournamentOut)
def start_tournament(
    tournament: models.Tournament = Depends(get_tournament_or_404),
    db: Session = Depends(get_db),
):
    try:
        tournament = crud.start_tournament(db, tournament)
    except ValueError as e:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, detail=str(e))
    return _to_out(tournament)


@router.post("/{tournament_id}/rounds/{round_number}/finish")
def finish_round(
    round_number: int,
    tournament: models.Tournament = Depends(get_tournament_or_404),
    db: Session = Depends(get_db),
):
    try:
        return crud.finish_round(db, tournament, round_number)
    except LookupError as e:
        raise HTTPException(status.HTTP_404_NOT_FOUND, detail=str(e))
    except ValueError as e:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, detail=str(e))

def _to_out(t: models.Tournament) -> schemas.TournamentOut:
    return schemas.TournamentOut(
        id=t.id, name=t.name, type=t.type, status=t.status,
        start_date=t.start_date, end_date=t.end_date, start_time=t.start_time,
        location=t.location, total_rounds=t.total_rounds,
        max_players=t.max_players, use_rating=t.use_rating,
        time_control=schemas.time_control(
            base_minutes=t.tc_base_minutes,
            increment_seconds=t.tc_increment_seconds,
            label=t.tc_label,
        ),
        players=[schemas.PlayerOut.model_validate(p) for p in t.players],
        rounds=[
            schemas.RoundOut(
                id=r.id, number=r.number, status=r.status, announced_at=r.announced_at,
                matches=[schemas.MatchOut.model_validate(m) for m in r.matches],
            )
            for r in t.rounds
        ],
    )