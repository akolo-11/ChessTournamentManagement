"""швейцарская жеребьёвка.

Алгоритм:
1. очки игроков по сыгранным партиям.
2. сортировка очки -> рейтинг.
3. пары сверху вниз.
4. ротация повторных встреч.
5. при нечётном числе bye для последнего в списке.
6. цвета фигур определяются по балансу белых/чёрных у игроков.
"""

#TODO: внедрить py4swiss

from __future__ import annotations

from uuid import uuid4

from . import models


def _score_for_player(tournament: models.Tournament, player_id: str) -> float:
    """Очки игрока по всем сыгранным партиям турнира."""
    score = 0.0
    for round_ in tournament.rounds:
        for match in round_.matches:
            if match.white_player_id == player_id:
                if match.result == "1-0":
                    score += 1
                elif match.result == "½-½":
                    score += 0.5
                elif match.result == "bye":
                    score += 1
            elif match.black_player_id == player_id:
                if match.result == "0-1":
                    score += 1
                elif match.result == "½-½":
                    score += 0.5
    return score


def _color_balance(tournament: models.Tournament, player_id: str) -> int:
    """Разница (белые − чёрные). Положительная — больше играл белыми."""
    whites = blacks = 0
    for round_ in tournament.rounds:
        for match in round_.matches:
            if match.white_player_id == player_id:
                whites += 1
            elif match.black_player_id == player_id:
                blacks += 1
    return whites - blacks


def _already_played(tournament: models.Tournament, a: str, b: str) -> bool:
    """Играли ли эти двое между собой."""
    for round_ in tournament.rounds:
        for match in round_.matches:
            pair = {match.white_player_id, match.black_player_id}
            if pair == {a, b}:
                return True
    return False



def generate_pairings(tournament: models.Tournament, round_number: int) -> list[models.Match]:
    """Возвращает список Match для указанного раунда (без сохранения в БД)."""
    active_players = [p for p in tournament.players if p.is_active]
    if len(active_players) < 2:
        raise ValueError("Нужно минимум 2 активных участника")

    ranked = sorted(
        active_players,
        key=lambda p: (-_score_for_player(tournament, p.id), -p.rating),
    )

    bye_player: models.Player | None = None
    if len(ranked) % 2 == 1:
        for p in reversed(ranked):
            if not _had_bye(tournament, p.id):
                bye_player = p
                ranked.remove(p)
                break
        if bye_player is None:
            bye_player = ranked.pop()

    matches: list[models.Match] = []
    board = 1

    while len(ranked) >= 2:
        white = ranked.pop(0)
        black = None

        for i, candidate in enumerate(ranked):
            if not _already_played(tournament, white.id, candidate.id):
                black = ranked.pop(i)
                break

        if black is None:
            black = ranked.pop(0)

        w_bal = _color_balance(tournament, white.id)
        b_bal = _color_balance(tournament, black.id)
        if w_bal > b_bal:
            white, black = black, white  # у кого больше белых — играет чёрными

        matches.append(models.Match(
            id=str(uuid4()),
            round_id="",  # заполнится при сохранении
            board_number=board,
            white_player_id=white.id,
            black_player_id=black.id,
            result="*",
        ))
        board += 1

    if bye_player is not None:
        matches.append(models.Match(
            id=str(uuid4()),
            round_id="",
            board_number=board,
            white_player_id=bye_player.id,
            black_player_id=None,
            result="bye",
        ))

    return matches


def _had_bye(tournament: models.Tournament, player_id: str) -> bool:
    for round_ in tournament.rounds:
        for match in round_.matches:
            if match.result == "bye" and match.white_player_id == player_id:
                return True
    return False