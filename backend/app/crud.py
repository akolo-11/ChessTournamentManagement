from __future__ import annotations

from datetime import datetime
from uuid import uuid4

from sqlalchemy.orm import Session, selectinload
from sqlalchemy import select

from . import models, schemas


# Tournaments

def list_tournaments(db: Session) -> list[models.Tournament]:
    return list(db.scalars(select(models.Tournament).order_by(models.Tournament.start_date.desc())))


def get_tournament(db: Session, tournament_id: str) -> models.Tournament | None:
    stmt = (
        select(models.Tournament)
        .where(models.Tournament.id == tournament_id)
        .options(
            selectinload(models.Tournament.players),
            selectinload(models.Tournament.rounds).selectinload(models.Round.matches),
        )
    )
    return db.scalar(stmt)


def create_tournament(db: Session, data: schemas.TournamentCreate) -> models.Tournament:
    tournament = models.Tournament(
        id=str(uuid4()),
        name=data.name,
        type=data.type,
        status="registration",
        start_date=data.start_date,
        end_date=data.end_date,
        start_time=data.start_time,
        location=data.location,
        total_rounds=data.total_rounds,
        max_players=data.max_players,
        use_rating=data.use_rating,
        tc_base_minutes=data.time_control.base_minutes,
        tc_increment_seconds=data.time_control.increment_seconds,
        tc_label=data.time_control.label,
    )
    db.add(tournament)
    db.commit()
    db.refresh(tournament)
    return tournament


def delete_tournament(db: Session, tournament_id: str) -> bool:
    tournament = db.get(models.Tournament, tournament_id)
    if tournament is None:
        return False
    db.delete(tournament)
    db.commit()
    return True


# Players

def add_player(db: Session, tournament: models.Tournament, data: schemas.PlayerCreate) -> models.Player:
    if tournament.max_players and len(tournament.players) >= tournament.max_players:
        raise ValueError("Достигнут лимит участников")

    player = models.Player(
        id=str(uuid4()),
        tournament_id=tournament.id,
        name=data.name,
        rating=data.rating,
        federation=data.federation,
    )
    db.add(player)
    db.commit()
    db.refresh(player)
    return player


def remove_player(db: Session, tournament_id: str, player_id: str) -> bool:
    player = db.get(models.Player, player_id)
    if player is None or player.tournament_id != tournament_id:
        return False
    db.delete(player)
    db.commit()
    return True


# Lifecycle util

def start_tournament(db: Session, tournament: models.Tournament) -> models.Tournament:
    if tournament.status != "registration":
        raise ValueError("Турнир уже запущен или завершён")
    if len(tournament.players) < 2:
        raise ValueError("Нужно минимум 2 участника")

    tournament.status = "active"
    first_round = models.Round(
        id=str(uuid4()),
        tournament_id=tournament.id,
        number=1,
        status="in-progress",
        announced_at=datetime.utcnow(),
    )
    db.add(first_round)
    db.commit()
    db.refresh(tournament)
    return tournament


def finish_round(db: Session, tournament: models.Tournament, round_number: int) -> dict:
    round_ = next((r for r in tournament.rounds if r.number == round_number), None)
    if round_ is None:
        raise LookupError("Раунд не найден")
    if any(m.result == "*" for m in round_.matches):
        raise ValueError("Не все результаты введены")

    round_.status = "completed"

    if round_number < tournament.total_rounds:
        next_round = models.Round(
            id=str(uuid4()),
            tournament_id=tournament.id,
            number=round_number + 1,
            status="in-progress",
            announced_at=datetime.utcnow(),
        )
        db.add(next_round)
        db.commit()
        return {"next_round": next_round.number, "tournament_finished": False}

    tournament.status = "finished"
    db.commit()
    return {"next_round": None, "tournament_finished": True}


# Matches

def update_result(db: Session, tournament_id: str, match_id: str, result: str) -> models.Match | None:
    stmt = (
        select(models.Match)
        .join(models.Round)
        .where(models.Match.id == match_id, models.Round.tournament_id == tournament_id)
    )
    match = db.scalar(stmt)
    if match is None:
        return None
    match.result = result
    db.commit()
    db.refresh(match)
    return match