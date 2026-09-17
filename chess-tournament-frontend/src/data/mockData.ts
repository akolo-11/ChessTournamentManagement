import type { Tournament } from '../types';

export const mockTournaments: Tournament[] = [
  // ─────────────────────────────────────────────────────────────
  // Турнир 1: активный, швейцарка, классика
  // ─────────────────────────────────────────────────────────────
  {
    id: 't1',
    name: 'Открытый кубок города — 2026',
    type: 'swiss',
    status: 'active',
    startDate: '2026-09-10',
    timeControl: {
      baseMinutes: 90,
      incrementSeconds: 30,
    },
    location: 'Шахматный клуб «Ладья», Москва',
    totalRounds: 5,
    players: [
      { id: 'p1', name: 'Иванов Иван',      rating: 2210, federation: 'RUS', isActive: true },
      { id: 'p2', name: 'Петров Пётр',      rating: 2185, federation: 'RUS', isActive: true },
      { id: 'p3', name: 'Сидоров Алексей',  rating: 2150, federation: 'RUS', isActive: true },
      { id: 'p4', name: 'Кузнецов Дмитрий', rating: 2090, federation: 'RUS', isActive: true },
      { id: 'p5', name: 'Смирнова Анна',    rating: 2050, federation: 'RUS', isActive: true },
      { id: 'p6', name: 'Волков Сергей',    rating: 1980, federation: 'BLR', isActive: true },
      { id: 'p7', name: 'Морозов Олег',     rating: 1920, federation: 'RUS', isActive: true },
      { id: 'p8', name: 'Соколов Никита',   rating: 1870, federation: 'KAZ', isActive: false },
    ],
    rounds: [
      {
        number: 1,
        status: 'completed',
        announcedAt: '2026-09-10T10:00:00Z',
        matches: [
          { id: 't1-r1-b1', boardNumber: 1, whitePlayerId: 'p1', blackPlayerId: 'p8', result: '1-0' },
          { id: 't1-r1-b2', boardNumber: 2, whitePlayerId: 'p2', blackPlayerId: 'p7', result: '1-0' },
          { id: 't1-r1-b3', boardNumber: 3, whitePlayerId: 'p3', blackPlayerId: 'p6', result: '½-½' },
          { id: 't1-r1-b4', boardNumber: 4, whitePlayerId: 'p4', blackPlayerId: 'p5', result: '0-1' },
        ],
      },
      {
        number: 2,
        status: 'completed',
        announcedAt: '2026-09-10T15:00:00Z',
        matches: [
          { id: 't1-r2-b1', boardNumber: 1, whitePlayerId: 'p5', blackPlayerId: 'p1', result: '½-½' },
          { id: 't1-r2-b2', boardNumber: 2, whitePlayerId: 'p2', blackPlayerId: 'p3', result: '1-0' },
          { id: 't1-r2-b3', boardNumber: 3, whitePlayerId: 'p6', blackPlayerId: 'p7', result: '0-1' },
          { id: 't1-r2-b4', boardNumber: 4, whitePlayerId: 'p8', blackPlayerId: 'p4', result: '0-1' },
        ],
      },
      {
        number: 3,
        status: 'in-progress',
        announcedAt: '2026-09-11T10:00:00Z',
        matches: [
          { id: 't1-r3-b1', boardNumber: 1, whitePlayerId: 'p1', blackPlayerId: 'p2', result: '*' },
          { id: 't1-r3-b2', boardNumber: 2, whitePlayerId: 'p5', blackPlayerId: 'p7', result: '1-0' },
          { id: 't1-r3-b3', boardNumber: 3, whitePlayerId: 'p3', blackPlayerId: 'p4', result: '½-½' },
          { id: 't1-r3-b4', boardNumber: 4, whitePlayerId: 'p6', blackPlayerId: null, result: 'bye' },
        ],
      },
      {
        number: 4,
        status: 'pending',
        announcedAt: null,
        matches: [],
      },
      {
        number: 5,
        status: 'pending',
        announcedAt: null,
        matches: [],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  // Турнир 2: завершённый, круговая, рапид
  // ─────────────────────────────────────────────────────────────
  {
    id: 't2',
    name: 'Клубный турнир выходного дня',
    type: 'round-robin',
    status: 'finished',
    startDate: '2026-08-01',
    endDate: '2026-08-03',
    timeControl: {
      baseMinutes: 25,
      incrementSeconds: 10,
    },
    location: 'Шахматный клуб «Ладья», Москва',
    totalRounds: 3,
    players: [
      { id: 'p2', name: 'Петров Пётр',     rating: 2185, federation: 'RUS', isActive: true },
      { id: 'p3', name: 'Сидоров Алексей', rating: 2150, federation: 'RUS', isActive: true },
      { id: 'p5', name: 'Смирнова Анна',   rating: 2050, federation: 'RUS', isActive: true },
      { id: 'p7', name: 'Морозов Олег',    rating: 1920, federation: 'RUS', isActive: true },
    ],
    rounds: [
      {
        number: 1,
        status: 'completed',
        announcedAt: '2026-08-01T10:00:00Z',
        matches: [
          { id: 't2-r1-b1', boardNumber: 1, whitePlayerId: 'p2', blackPlayerId: 'p3', result: '½-½' },
          { id: 't2-r1-b2', boardNumber: 2, whitePlayerId: 'p5', blackPlayerId: 'p7', result: '1-0' },
        ],
      },
      {
        number: 2,
        status: 'completed',
        announcedAt: '2026-08-02T10:00:00Z',
        matches: [
          { id: 't2-r2-b1', boardNumber: 1, whitePlayerId: 'p3', blackPlayerId: 'p5', result: '1-0' },
          { id: 't2-r2-b2', boardNumber: 2, whitePlayerId: 'p7', blackPlayerId: 'p2', result: '0-1' },
        ],
      },
      {
        number: 3,
        status: 'completed',
        announcedAt: '2026-08-03T10:00:00Z',
        matches: [
          { id: 't2-r3-b1', boardNumber: 1, whitePlayerId: 'p5', blackPlayerId: 'p2', result: '0-1' },
          { id: 't2-r3-b2', boardNumber: 2, whitePlayerId: 'p7', blackPlayerId: 'p3', result: '½-½' },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  // Турнир 3: черновик, блиц, участники добавлены, раундов нет
  // ─────────────────────────────────────────────────────────────
  {
    id: 't3',
    name: 'Ночной блиц-марафон',
    type: 'swiss',
    status: 'draft',
    startDate: '2026-10-05',
    timeControl: {
      baseMinutes: 3,
      incrementSeconds: 2,
    },
    location: 'Онлайн (Lichess)',
    totalRounds: 9,
    players: [
      { id: 'p1', name: 'Иванов Иван',      rating: 2210, federation: 'RUS', isActive: true },
      { id: 'p3', name: 'Сидоров Алексей',  rating: 2150, federation: 'RUS', isActive: true },
      { id: 'p5', name: 'Смирнова Анна',    rating: 2050, federation: 'RUS', isActive: true },
      { id: 'p6', name: 'Волков Сергей',    rating: 1980, federation: 'BLR', isActive: true },
      { id: 'p7', name: 'Морозов Олег',     rating: 1920, federation: 'RUS', isActive: true },
      { id: 'p9', name: 'Громова Екатерина',rating: 2010, federation: 'RUS', isActive: true },
    ],
    rounds: [],
  },
];