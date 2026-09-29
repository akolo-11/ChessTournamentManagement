from __future__ import annotations

from uuid import uuid4
from .models import Tournament, Player, TournamentCreate


class Storage:
    def __init__(self) -> None:
        self.tournaments: dict[str, Tournament] = {}

    def list(self) -> list[Tournament]:
        return list(self.tournaments.values())

    def get(self, tournament_id: str) -> Tournament | None:
        return self.tournaments.get(tournament_id)

    def create(self, data: TournamentCreate) -> Tournament:
        tournament = Tournament(id=str(uuid4()), **data.model_dump())
        self.tournaments[tournament.id] = tournament
        return tournament

    def add_player(self, tournament_id: str, name: str, rating: int, federation: str) -> Player | None:
        tournament = self.get(tournament_id)
        if tournament is None:
            return None
        if tournament.max_players and len(tournament.players) >= tournament.max_players:
            raise ValueError("Достигнут лимит участников")
        player = Player(id=str(uuid4()), name=name, rating=rating, federation=federation)
        tournament.players.append(player)
        return player


storage = Storage()