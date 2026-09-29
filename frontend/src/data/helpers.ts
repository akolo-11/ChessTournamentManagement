import { mockTournaments } from './mockData';
import type { Match, Player, Round, Tournament } from '../types';

export function getTournament(id: string): Tournament | undefined {
  return mockTournaments.find(t => t.id === id);
}

export function getPlayer(tournament: Tournament, playerId: string): Player | undefined {
  return tournament.players.find(p => p.id === playerId);
}

export function getPlayerName(tournament: Tournament, playerId: string | null): string {
  if (!playerId) return '—';
  return getPlayer(tournament, playerId)?.name ?? 'Неизвестный';
}

export function getRound(tournament: Tournament, roundNumber: number): Round | undefined {
  return tournament.rounds.find(r => r.number === roundNumber);
}

export function getMatch(tournament: Tournament, matchId: string): Match | undefined {
  for (const round of tournament.rounds) {
    const match = round.matches.find(m => m.id === matchId);
    if (match) return match;
  }
  return undefined;
}

/* Очки игрока по результатам партий */
export function getPlayerScore(tournament: Tournament, playerId: string): number {
  let score = 0;
  for (const round of tournament.rounds) {
    for (const match of round.matches) {
      if (match.result === '*' || match.result === 'bye') {
        if (match.result === 'bye' && match.whitePlayerId === playerId) score += 1;
        continue;
      }
      if (match.whitePlayerId === playerId) {
        if (match.result === '1-0') score += 1;
        else if (match.result === '½-½') score += 0.5;
      } else if (match.blackPlayerId === playerId) {
        if (match.result === '0-1') score += 1;
        else if (match.result === '½-½') score += 0.5;
      }
    }
  }
  return score;
}

/* Сортированный список игроков с очками */
export function getStandings(tournament: Tournament) {
  return tournament.players
    .map(player => ({
      player,
      score: getPlayerScore(tournament, player.id),
      played: tournament.rounds.reduce(
        (acc, r) => acc + r.matches.filter(
          m => m.result !== '*' &&
               (m.whitePlayerId === player.id || m.blackPlayerId === player.id)
        ).length,
        0,
      ),
    }))
    .sort((a, b) => b.score - a.score || b.player.rating - a.player.rating);
}