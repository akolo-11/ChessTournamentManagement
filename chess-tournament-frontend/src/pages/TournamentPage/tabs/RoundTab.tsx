import {
  Box, Table, TableHead, TableRow, TableCell, TableBody,
  Chip, Select, MenuItem, Alert, Stack, IconButton, Button
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate, useOutletContext, useParams } from 'react-router-dom';
import { useState } from 'react';
import type { MatchResult, Tournament } from '../../../types';
import { getPlayerName, getRound } from '../../../data/helpers';

interface Ctx { tournament: Tournament; isAdmin: boolean }

const resultLabels: Record<MatchResult, string> = {
  '1-0': '1–0', '0-1': '0–1', '½-½': '½–½', '*': '—', 'bye': 'bye',
};

export default function RoundTab() {
  const { tournament, isAdmin } = useOutletContext<Ctx>();
  const { roundNumber } = useParams();
  const navigate = useNavigate();
  const round = getRound(tournament, Number(roundNumber));

  if (!round) return <Alert severity="error">Раунд не найден</Alert>;

  const [editMode, setEditMode] = useState(false);
  const isLocked = round.status === 'completed' && !editMode;

  if (round.announcedAt === null) {
    return <Alert severity="info">Раунд ещё не объявлен</Alert>;
  }

  return (
    <Box>
      <Stack direction="row" spacing={1} sx={{ alignItems: 'center', mb: 2 }}>
        <IconButton onClick={() => navigate(`/tournaments/${tournament.id}/rounds`)}>
          <ArrowBackIcon />
        </IconButton>
        <strong>Раунд {round.number}</strong>
      </Stack>

      {isAdmin && round.status === 'completed' && (
        <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
          {!editMode ? (
            <Button variant="outlined" onClick={() => setEditMode(true)}>
              Редактировать результаты
            </Button>
          ) : (
            <>
              <Button variant="contained" onClick={() => { /* TODO: сохранить */ setEditMode(false); }}>
                Сохранить
              </Button>
              <Button onClick={() => setEditMode(false)}>Отмена</Button>
            </>
          )}
        </Stack>
      )}

      {round.matches.length === 0 ? (
        <Alert severity="info">Пары ещё не созданы</Alert>
      ) : (
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Доска</TableCell>
              <TableCell>Белые</TableCell>
              <TableCell>Чёрные</TableCell>
              <TableCell>Результат</TableCell>
              {isAdmin && <TableCell align="right">Действия</TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {round.matches.map(m => (
              <TableRow key={m.id} hover>
                <TableCell>{m.boardNumber}</TableCell>
                <TableCell>{getPlayerName(tournament, m.whitePlayerId)}</TableCell>
                <TableCell>{getPlayerName(tournament, m.blackPlayerId)}</TableCell>
                <TableCell>
                  <Chip
                    label={resultLabels[m.result]}
                    color={m.result === '*' ? 'default' : 'primary'}
                    size="small"
                  />
                </TableCell>
                {isAdmin && (
                  <TableCell align="right">
                    {m.result === 'bye' ? (
                      <span>—</span>
                    ) : (
                      <Select
                        size="small"
                        defaultValue={m.result}
                        disabled={isLocked}
                        sx={{ minWidth: 90 }}
                      >
                        <MenuItem value="*">—</MenuItem>
                        <MenuItem value="1-0">1–0</MenuItem>
                        <MenuItem value="0-1">0–1</MenuItem>
                        <MenuItem value="½-½">½–½</MenuItem>
                      </Select>
                    )}
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </Box>
  );
}