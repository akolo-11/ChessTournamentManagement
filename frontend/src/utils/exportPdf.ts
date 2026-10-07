import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { Tournament } from '../types';
import { getStandings } from '../data/helpers';

export function exportTournamentToPdf(tournament: Tournament) {
  const doc = new jsPDF();
  doc.setFontSize(14);
  doc.text(tournament.name, 14, 18);
  doc.setFontSize(10);
  doc.text(`${tournament.location} · ${tournament.start_date}`, 14, 24);

  const standings = getStandings(tournament);
  autoTable(doc, {
    startY: 30,
    head: [['#', 'Игрок', 'Рейтинг', 'Федерация', 'Партий', 'Очки']],
    body: standings.map((s, i) => [
      i + 1, s.player.name, s.player.rating, s.player.federation, s.played, s.score,
    ]),
  });

  doc.save(`${tournament.name}.pdf`);
}