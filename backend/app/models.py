from __future__ import annotations

from datetime import date, time, datetime

from sqlalchemy import (
    String, Integer, Boolean, Date, Time, DateTime, ForeignKey, Enum as SAEnum,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship

from .database import Base


class Tournament(Base):
    __tablename__ = "tournaments"

    id: Mapped[str] = mapped_column(String(36), primary_key=True)
    name: Mapped[str] = mapped_column(String(200), nullable=False)
    type: Mapped[str] = mapped_column(String(20), nullable=False)          # swiss | round-robin
    status: Mapped[str] = mapped_column(String(20), default="draft")        # draft | registration | active | finished
    start_date: Mapped[date] = mapped_column(Date, nullable=False)
    end_date: Mapped[date | None] = mapped_column(Date)
    start_time: Mapped[time | None] = mapped_column(Time)
    location: Mapped[str] = mapped_column(String(200), default="")
    total_rounds: Mapped[int] = mapped_column(Integer, nullable=False)
    max_players: Mapped[int | None] = mapped_column(Integer)
    use_rating: Mapped[bool] = mapped_column(Boolean, default=True)

    tc_base_minutes: Mapped[int] = mapped_column(Integer, nullable=False)
    tc_increment_seconds: Mapped[int] = mapped_column(Integer, default=0)
    tc_label: Mapped[str | None] = mapped_column(String(50))

    players: Mapped[list[Player]] = relationship(
        back_populates="tournament", cascade="all, delete-orphan",
    )
    rounds: Mapped[list[Round]] = relationship(
        back_populates="tournament", cascade="all, delete-orphan",
        order_by="Round.number",
    )


class Player(Base):
    __tablename__ = "players"

    id: Mapped[str] = mapped_column(String(36), primary_key=True)
    tournament_id: Mapped[str] = mapped_column(
        ForeignKey("tournaments.id", ondelete="CASCADE"), nullable=False, index=True,
    )
    name: Mapped[str] = mapped_column(String(200), nullable=False)
    rating: Mapped[int] = mapped_column(Integer, default=0)
    federation: Mapped[str] = mapped_column(String(10), default="")
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)

    tournament: Mapped[Tournament] = relationship(back_populates="players")


class Round(Base):
    __tablename__ = "rounds"

    id: Mapped[str] = mapped_column(String(36), primary_key=True)
    tournament_id: Mapped[str] = mapped_column(
        ForeignKey("tournaments.id", ondelete="CASCADE"), nullable=False, index=True,
    )
    number: Mapped[int] = mapped_column(Integer, nullable=False)
    status: Mapped[str] = mapped_column(String(20), default="pending")
    announced_at: Mapped[datetime | None] = mapped_column(DateTime)

    tournament: Mapped[Tournament] = relationship(back_populates="rounds")
    matches: Mapped[list[Match]] = relationship(
        back_populates="round", cascade="all, delete-orphan",
    )


class Match(Base):
    __tablename__ = "matches"

    id: Mapped[str] = mapped_column(String(36), primary_key=True)
    round_id: Mapped[str] = mapped_column(
        ForeignKey("rounds.id", ondelete="CASCADE"), nullable=False, index=True,
    )
    board_number: Mapped[int] = mapped_column(Integer, nullable=False)
    white_player_id: Mapped[str] = mapped_column(
        ForeignKey("players.id", ondelete="CASCADE"), nullable=False,
    )
    black_player_id: Mapped[str | None] = mapped_column(
        ForeignKey("players.id", ondelete="SET NULL"),
    )
    result: Mapped[str] = mapped_column(String(10), default="*")

    round: Mapped[Round] = relationship(back_populates="matches")