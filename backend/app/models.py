from __future__ import annotations

from datetime import date, time, datetime
from typing import Literal, Optional
from pydantic import BaseModel, Field


TournamentType = Literal["swiss", "round-robin"]
TournamentStatus = Literal["draft", "registration", "active", "finished"]
RoundStatus = Literal["pending", "in-progress", "completed"]
MatchResult = Literal["1-0", "0-1", "½-½", "*", "bye"]


class TimeControl(BaseModel):
    base_minutes: int
    increment_seconds: int
    label: Optional[str] = None


class Player(BaseModel):
    id: str
    name: str
    rating: int
    federation: str
    is_active: bool = True


class Match(BaseModel):
    id: str
    board_number: int
    white_player_id: str
    black_player_id: Optional[str] = None
    result: MatchResult = "*"


class Round(BaseModel):
    number: int
    status: RoundStatus = "pending"
    matches: list[Match] = Field(default_factory=list)
    announced_at: Optional[datetime] = None


class Tournament(BaseModel):
    id: str
    name: str
    type: TournamentType
    status: TournamentStatus = "draft"
    start_date: date
    end_date: Optional[date] = None
    start_time: Optional[time] = None
    time_control: TimeControl
    location: str
    total_rounds: int
    max_players: Optional[int] = None
    use_rating: bool = True
    players: list[Player] = Field(default_factory=list)
    rounds: list[Round] = Field(default_factory=list)


# ─── Схемы запросов ───

class TournamentCreate(BaseModel):
    name: str
    type: TournamentType
    start_date: date
    end_date: Optional[date] = None
    start_time: Optional[time] = None
    time_control: TimeControl
    location: str
    total_rounds: int
    max_players: Optional[int] = None
    use_rating: bool = True


class PlayerCreate(BaseModel):
    name: str
    rating: int
    federation: str


class ResultUpdate(BaseModel):
    result: MatchResult