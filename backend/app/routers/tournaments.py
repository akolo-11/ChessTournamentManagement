from fastapi import APIRouter, HTTPException, status

from ..models import (
    Tournament, TournamentCreate, PlayerCreate, Player, TimeControl, Round,
)
from ..storage import storage

router = APIRouter(prefix="/api/tournaments", tags=["tournaments"])


@router.get("", response_model=list[Tournament])
def list_tournaments() -> list[Tournament]:
    return storage.list()


@router.get("/{tournament_id}", response_model=Tournament)
def get_tournament(tournament_id: str) -> Tournament:
    tournament = storage.get(tournament_id)
    if tournament is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Турнир не найден")
    return tournament


@router.post("", response_model=Tournament, status_code=status.HTTP_201_CREATED)
def create_tournament(data: TournamentCreate) -> Tournament:
    return storage.create(data)


@router.post("/{tournament_id}/players", response_model=Player, status_code=201)
def add_player(tournament_id: str, data: PlayerCreate) -> Player:
    try:
        player = storage.add_player(tournament_id, data.name, data.rating, data.federation)
    except ValueError as e:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, str(e))
    if player is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Турнир не найден")
    return player


@router.delete("/{tournament_id}/players/{player_id}", status_code=204)
def remove_player(tournament_id: str, player_id: str) -> None:
    tournament = storage.get(tournament_id)
    if tournament is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Турнир не найден")
    tournament.players = [p for p in tournament.players if p.id != player_id]
    return None


@router.post("/{tournament_id}/start", response_model=Tournament)
def start_tournament(tournament_id: str) -> Tournament:
    """Перевод из registration в active, создание раунда 1."""
    from datetime import datetime
    tournament = storage.get(tournament_id)
    if tournament is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Турнир не найден")
    if tournament.status != "registration":
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "Турнир уже запущен или завершён")
    if len(tournament.players) < 2:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "Нужно минимум 2 участника")

    tournament.status = "active"
    first_round = Round(number=1, status="in-progress", announced_at=datetime.utcnow())
    tournament.rounds.append(first_round)
    return tournament