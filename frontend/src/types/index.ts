export type UserRole = 'admin' | 'viewer';

export type TournamentType = 'swiss' | 'round-robin' | 'match' | 'knockout';
export type TournamentStatus = 'draft' | 'registration' | 'active' | 'finished';
export type RoundStatus = 'pending' | 'in-progress' | 'completed';
export type MatchResult = '1-0' | '0-1' | '½-½' | '*' | 'bye';

export interface time_control {
  baseMinutes: number;
  incrementSeconds: number;
  label?: string;
}

export interface Player {
  id: string;
  name: string;
  rating: number;
  federation: string;
  isActive: boolean;   // false == dq
}

export interface Match {
  id: string;
  boardNumber: number;
  whitePlayerId: string;
  blackPlayerId: string | null;   // null == bye
  result: MatchResult;
  resultEdited?: boolean;
}

export interface Round {
  number: number;
  status: RoundStatus;
  matches: Match[];
  announcedAt: string | null;
  isTiebreak?: boolean;
}

export interface Tournament {
  id: string;
  name: string;
  type: TournamentType;
  status: TournamentStatus;
  use_rating: boolean;
  start_date: string;        // ISO
  end_date?: string;
  start_time?: string;
  time_control: time_control;
  location: string;
  totalRounds: number;
  max_players?: number;
  players: Player[];
  rounds: Round[];
  closedEarly?: boolean;
}