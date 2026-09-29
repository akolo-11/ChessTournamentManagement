import { Table, TableHead, TableRow, TableCell, TableBody, Box, Typography } from '@mui/material';
import { useOutletContext } from 'react-router-dom';
import type { MatchResult, Tournament } from '../../../types';

interface Ctx { tournament: Tournament }

const resultSymbols: Record<MatchResult, string> = {
  '1-0': '1', '0-1': '0', '½-½': '½', '*': '—', 'bye': '+',
};

/* Результат игрока в конкретном раунде */
function getRoundResult(tournament: Tournament, roundNumber: number, playerId: string): MatchResult | null {
  const round = tournament.rounds.find(r => r.number === roundNumber);
  if (!round) return null;
  const match = round.matches.find(m => m.whitePlayerId === playerId || m.blackPlayerId === playerId);
  if (!match) return null;

  // Инверсия результата для черных 1-0 / 0-1
  if (match.blackPlayerId === playerId) {
    if (match.result === '1-0') return '0-1';
    if (match.result === '0-1') return '1-0';
  }
  return match.result;
}

export default function ResultsTab() {
  const { tournament } = useOutletContext<Ctx>();
  const rounds = tournament.rounds.filter(r => r.matches.length > 0);

  if (tournament.status !== 'finished') {
    return <Typography sx={{ color: 'text.secondary' }}>Итоги будут доступны после завершения турнира</Typography>;
  }

  return (
    <Box sx={{ overflowX: 'auto' }}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>#</TableCell>
            <TableCell>Игрок</TableCell>
            <TableCell align="right">Рейтинг</TableCell>
            {rounds.map(r => (
              <TableCell key={r.number} align="center">{r.number}</TableCell>
            ))}
            <TableCell align="right">Очки</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {tournament.players.map((p, i) => {
            const total = rounds.reduce((sum, r) => {
              const res = getRoundResult(tournament, r.number, p.id);
              if (res === '1-0') return sum + 1;
              if (res === '½-½') return sum + 0.5;
              return sum;
            }, 0);
            return (
              <TableRow key={p.id} hover>
                <TableCell>{i + 1}</TableCell>
                <TableCell>{p.name}</TableCell>
                <TableCell align="right">{p.rating}</TableCell>
                {rounds.map(r => {
                  const res = getRoundResult(tournament, r.number, p.id);
                  return (
                    <TableCell key={r.number} align="center">
                      {res ? resultSymbols[res] : '—'}
                    </TableCell>
                  );
                })}
                <TableCell align="right"><strong>{total}</strong></TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </Box>
  );
}