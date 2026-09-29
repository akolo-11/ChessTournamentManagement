from fastapi import APIRouter, HTTPException, status

from ..models import Match, ResultUpdate, Round
from ..storage import storage

router = APIRouter(prefix="/api/tournaments", tags=["matches"])


def _find_match(tournament, match_id: str) -> tuple[Match, object]:
    for round_ in tournament.rounds:
        for match in round_.matches:
            if match.id == match_id:
                return match, round_
    raise HTTPException(status.HTTP_404_NOT_FOUND, "Партия не найдена")


@router.put("/{tournament_id}/matches/{match_id}/result", response_model=Match)
def update_result(tournament_id: str, match_id: str, data: ResultUpdate) -> Match:
    tournament = storage.get(tournament_id)
    if tournament is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Турнир не найден")
    match, _ = _find_match(tournament, match_id)
    match.result = data.result
    return match


@router.post("/{tournament_id}/rounds/{round_number}/finish")
def finish_round(tournament_id: str, round_number: int):
    """Завершить раунд и объявить следующий."""
    from datetime import datetime
    tournament = storage.get(tournament_id)
    if tournament is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Турнир не найден")

    round_ = next((r for r in tournament.rounds if r.number == round_number), None)
    if round_ is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Раунд не найден")
    if any(m.result == "*" for m in round_.matches):
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "Не все результаты введены")

    round_.status = "completed"

    if round_number < tournament.total_rounds:
        next_round = Round(
            number=round_number + 1,
            status="in-progress",
            announced_at=datetime.utcnow(),
        )
        tournament.rounds.append(next_round)
        return {"ok": True, "next_round": next_round.number}

    # Последний раунд — турнир завершён
    tournament.status = "finished"
    return {"ok": True, "next_round": None, "tournament_finished": True}