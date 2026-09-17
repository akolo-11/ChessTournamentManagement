import * as XLSX from 'xlsx';
import type { Tournament } from '../types';
import { getStandings } from '../data/helpers';

export function exportTournamentToExcel(tournament: Tournament) {
  const standings = getStandings(tournament);

  const data = standings.map((s, i) => ({
    '#': i + 1,
    'Игрок': s.player.name,
    'Рейтинг': s.player.rating,
    'Федерация': s.player.federation,
    'Партий': s.played,
    'Очки': s.score,
  }));

  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Турнирная таблица');
  XLSX.writeFile(wb, `${tournament.name}.xlsx`);
}