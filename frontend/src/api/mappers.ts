import type { Match, Player, Round, time_control, Tournament } from '../types';

interface Apitime_control {
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
  time_control: Apitime_control;
  players: ApiPlayer[];
  rounds: ApiRound[];
}

function maptime_control(tc: Apitime_control): time_control {
  return {
    baseMinutes: tc.base_minutes,
    incrementSeconds: tc.increment_seconds,
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

export function mapTournament(t: ApiTournament): Tournament {
  return {
    id: t.id,
    name: t.name,
    type: t.type as Tournament['type'],
    status: t.status as Tournament['status'],
    start_date: t.start_date,
    end_date: t.end_date ?? undefined,
    start_time: t.start_time ?? undefined,
    time_control: maptime_control(t.time_control),
    location: t.location,
    totalRounds: t.total_rounds,
    max_players: t.max_players ?? undefined,
    use_rating: t.use_rating,
    players: t.players.map(mapPlayer),
    rounds: t.rounds.map(mapRound),
  };
}