import type { Match, Player, Round, TimeControl, Tournament } from '../types';

interface ApiTimeControl {
  base_minutes: number;
  increment_seconds: number;
  label?: string | null;
}

interface ApiPlayer {
  id: string;
  name: string;
  rating: number;
  federation: string;
  is_active: boolean;
}

interface ApiMatch {
  id: string;
  board_number: number;
  white_player_id: string;
  black_player_id: string | null;
  result: string;
}

interface ApiRound {
  id: string;
  number: number;
  status: string;
  announced_at: string | null;
  matches: ApiMatch[];
}

export interface ApiTournamentListItem {
  id: string;
  name: string;
  type: string;
  status: string;
  start_date: string;
  end_date: string | null;
  location: string;
  total_rounds: number;
  players_count: number;
  time_control: ApiTimeControl;
}

interface ApiTournament {
  id: string;
  name: string;
  type: string;
  status: string;
  start_date: string;
  end_date: string | null;
  start_time: string | null;
  location: string;
  total_rounds: number;
  max_players: number | null;
  use_rating: boolean;
  time_control: ApiTimeControl;
  players: ApiPlayer[];
  rounds: ApiRound[];
}

function mapTimeControl(tc: ApiTimeControl | undefined | null): TimeControl {
  if (!tc) return { baseMinutes: 0, incrementSeconds: 0 };
  return {
    baseMinutes: tc.base_minutes ?? 0,
    incrementSeconds: tc.increment_seconds ?? 0,
    label: tc.label ?? undefined,
  };
}

function mapPlayer(p: ApiPlayer): Player {
  return {
    id: p.id,
    name: p.name,
    rating: p.rating,
    federation: p.federation,
    isActive: p.is_active,
  };
}

function mapMatch(m: ApiMatch): Match {
  return {
    id: m.id,
    boardNumber: m.board_number,
    whitePlayerId: m.white_player_id,
    blackPlayerId: m.black_player_id,
    result: m.result as Match['result'],
  };
}

function mapRound(r: ApiRound): Round {
  return {
    number: r.number,
    status: r.status as Round['status'],
    announcedAt: r.announced_at,
    matches: r.matches.map(mapMatch),
  };
}

export function mapTournamentListItem(t: ApiTournamentListItem): Tournament {
  return {
    id: t.id,
    name: t.name,
    type: t.type as Tournament['type'],
    status: t.status as Tournament['status'],
    startDate: t.start_date,
    endDate: t.end_date ?? undefined,
    timeControl: mapTimeControl(t.time_control),
    location: t.location,
    totalRounds: t.total_rounds,
    useRating: true,
    playersCount: t.players_count,
    players: [],
    rounds: [],
  };
}

export function mapTournament(t: ApiTournament): Tournament {
  return {
    id: t.id,
    name: t.name,
    type: t.type as Tournament['type'],
    status: t.status as Tournament['status'],
    startDate: t.start_date,
    endDate: t.end_date ?? undefined,
    startTime: t.start_time ?? undefined,
    timeControl: mapTimeControl(t.time_control),
    location: t.location,
    totalRounds: t.total_rounds,
    maxPlayers: t.max_players ?? undefined,
    useRating: t.use_rating,
    players: t.players.map(mapPlayer),
    rounds: t.rounds.map(mapRound),
  };
}