from __future__ import annotations

from datetime import date, time, datetime
from typing import Literal

from pydantic import BaseModel, Field, ConfigDict


TournamentType = Literal["swiss", "round-robin"]
TournamentStatus = Literal["draft", "registration", "active", "finished"]
MatchResult = Literal["1-0", "0-1", "½-½", "*", "bye"]


# time_control
class time_control(BaseModel):
    base_minutes: int = Field(..., ge=1, le=300)
    increment_seconds: int = Field(0, ge=0, le=300)
    label: str | None = None


# Player
class PlayerCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=200)
    rating: int = Field(0, ge=0, le=4000)
    federation: str = Field("", max_length=10)


class PlayerOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: str
    name: str
    rating: int
    federation: str
    is_active: bool


# Match
class MatchOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: str
    board_number: int
    white_player_id: str
    black_player_id: str | None
    result: MatchResult


class ResultUpdate(BaseModel):
    result: MatchResult


# Round
class RoundOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: str
    number: int
    status: str
    announced_at: datetime | None
    matches: list[MatchOut] = []


# Tournament
class TournamentCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=200)
    type: TournamentType
    start_date: date
    end_date: date | None = None
    start_time: time | None = None
    time_control: time_control
    location: str = Field("", max_length=200)
    total_rounds: int = Field(..., ge=1, le=30)
    max_players: int | None = Field(None, ge=2)
    use_rating: bool = True
    registration_url: str | None = Field(None, max_length=500)


class TournamentListOut(BaseModel): # for listing
    model_config = ConfigDict(from_attributes=True)
    id: str
    name: str
    type: TournamentType
    status: TournamentStatus
    start_date: date
    end_date: date | None
    location: str
    total_rounds: int
    players_count: int = 0
    time_control: time_control
    registration_url: str | None = Field(None, max_length=500)


class TournamentOut(BaseModel): # for full view
    model_config = ConfigDict(from_attributes=True)
    id: str
    name: str
    type: TournamentType
    status: TournamentStatus
    start_date: date
    end_date: date | None
    start_time: time | None
    location: str
    total_rounds: int
    max_players: int | None
    use_rating: bool
    time_control: time_control
    players: list[PlayerOut] = []
    rounds: list[RoundOut] = []
    registration_url: str | None = Field(None, max_length=500)