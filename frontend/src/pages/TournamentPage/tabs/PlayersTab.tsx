import { useState, useMemo } from 'react';
import {
  Table, TableHead, TableRow, TableCell, TableBody,
  Chip, Button, Stack, Box, ToggleButton, ToggleButtonGroup,
} from '@mui/material';
import { useOutletContext } from 'react-router-dom';
import type { Tournament } from '../../../types';
import { getPlayerScore } from '../../../data/helpers';
import AddPlayerDialog from '../../../components/tournament/AddPlayerDialog'

interface Ctx { tournament: Tournament; isAdmin: boolean }

type SortKey = 'name' | 'rating' | 'score';

export default function PlayersTab() {
  const { tournament, isAdmin } = useOutletContext<Ctx>();
  const [sortBy, setSortBy] = useState<SortKey>('score');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const rows = useMemo(() => {
    const list = tournament.players.map(p => ({
      player: p,
      score: getPlayerScore(tournament, p.id),
    }));
    return list.sort((a, b) => {
      if (sortBy === 'name')   return a.player.name.localeCompare(b.player.name, 'ru');
      if (sortBy === 'rating') return b.player.rating - a.player.rating;
      return b.score - a.score || b.player.rating - a.player.rating;
    });
  }, [tournament, sortBy]);

  return (
    <Box>
      <Stack direction="row" spacing={1} sx={{ mb: 2, alignItems: 'center', flexWrap: 'wrap' }}>
        <ToggleButtonGroup
          size="small"
          exclusive
          value={sortBy}
          onChange={(_, v) => v && setSortBy(v)}
        >
          <ToggleButton value="name">По алфавиту</ToggleButton>
          <ToggleButton value="rating">По рейтингу</ToggleButton>
          <ToggleButton value="score">По очкам</ToggleButton>
        </ToggleButtonGroup>
        <Box sx={{ flexGrow: 1 }} />
        {isAdmin && (
          <>
            <Button variant="contained" onClick={() => setDialogOpen(true)}>
              Добавить участника
            </Button>
            <AddPlayerDialog
              open={dialogOpen}
              tournamentId={tournament.id}
              onClose={() => setDialogOpen(false)}
              onAdded={() => setRefreshKey(k => k + 1)}
            />
          </>
        )}
      </Stack>

      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>#</TableCell>
            <TableCell>Имя</TableCell>
            <TableCell align="right">Рейтинг</TableCell>
            <TableCell>Федерация</TableCell>
            <TableCell align="right">Очки</TableCell>
            <TableCell>Статус</TableCell>
            {isAdmin && <TableCell align="right">Действия</TableCell>}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map(({ player: p, score }, i) => (
            <TableRow key={p.id} hover>
              <TableCell>{i + 1}</TableCell>
              <TableCell>{p.name}</TableCell>
              <TableCell align="right">{p.rating}</TableCell>
              <TableCell>{p.federation}</TableCell>
              <TableCell align="right"><strong>{score}</strong></TableCell>
              <TableCell>
                <Chip
                  label={p.isActive ? 'Активен' : 'Снят с турнира'}
                  color={p.isActive ? 'success' : 'error'}
                  size="small"
                />
              </TableCell>
              {isAdmin && (
                <TableCell align="right">
                  <Button size="small" color="error" disabled={!p.isActive}>
                    Снять с турнира
                  </Button>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
}