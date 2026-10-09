import {
  Alert, Box, Button, Chip, CircularProgress, MenuItem, Select,
  Stack, Table, TableBody, TableCell, TableHead, TableRow, Typography
} from '@mui/material';
import { useOutletContext, useParams } from 'react-router-dom';
import { useState } from 'react';
import { api } from '../../../api/client';
import { getPlayerName, getRound } from '../../../data/helpers';
import type { MatchResult, Round, Tournament } from '../../../types';

interface Ctx {
  tournament: Tournament;
  isAdmin: boolean;
  refetch: () => void;
}

const resultLabels: Record<MatchResult, string> = {
  '1-0': '1–0', '0-1': '0–1', '½-½': '½–½', '*': '—', 'bye': 'bye',
};

export default function RoundTab() {
  const { tournament, isAdmin, refetch } = useOutletContext<Ctx>();
  const { roundNumber } = useParams();
  const round = getRound(tournament, Number(roundNumber));

  const [editMode, setEditMode] = useState(false);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [finishing, setFinishing] = useState(false);
  const [pairing, setPairing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!round) return <Alert severity="error">Раунд не найден</Alert>;
  if (round.announcedAt === null) return <Alert severity="info">Раунд ещё не объявлен</Alert>;

  const isLocked = round.status === 'completed' && !editMode;
  const allResultsSet = round.matches.length > 0 && round.matches.every(m => m.result !== '*');

  const announcedRounds = tournament.rounds.filter(r => r.announcedAt !== null);
  const isLastAnnounced =
    announcedRounds.length > 0 &&
    round.number === Math.max(...announcedRounds.map(r => r.number));
  const canFinishRound =
    isAdmin && isLastAnnounced && tournament.status !== 'finished' && allResultsSet;

  const handleResultChange = async (matchId: string, result: MatchResult) => {
    setSavingId(matchId);
    setError(null);
    try {
      await api.updateResult(tournament.id, matchId, result);
      refetch();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setSavingId(null);
    }
  };

  const handleFinishRound = async () => {
    if (!confirm(`Завершить раунд ${round.number} и объявить следующий?`)) return;
    setFinishing(true);
    setError(null);
    try {
      await api.finishRound(tournament.id, round.number);
      refetch();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setFinishing(false);
    }
  };

  const handleGeneratePairings = async () => {
    setPairing(true);
    setError(null);
    try {
      await api.generatePairings(tournament.id, round.number);
      refetch();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setPairing(false);
    }
  };

  return (
    <Box>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {isAdmin && round.status === 'completed' && (
        <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
          {!editMode ? (
            <Button variant="outlined" onClick={() => setEditMode(true)}>
              Редактировать результаты
            </Button>
          ) : (
            <>
              <Button variant="contained" onClick={() => setEditMode(false)}>
                Готово
              </Button>
              <Button onClick={() => { setEditMode(false); refetch(); }}>
                Отмена
              </Button>
            </>
          )}
        </Stack>
      )}

      {round.matches.length === 0 ? (
        isAdmin ? (
          <Box>
            <Typography sx={{ color: 'text.secondary' }}>
              Раунд объявлен, но пары ещё не созданы.
            </Typography>
            <Button
              variant="contained"
              disabled={pairing}
              onClick={handleGeneratePairings}
            >
              {pairing ? 'Жеребьёвка…' : 'Провести жеребьёвку'}
            </Button>
          </Box>
        ) : (
          <Typography sx={{ color: 'text.secondary' }}>Жеребьевка еще не проведена</Typography>
        )
      ) : (
        <Table size="small">
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
                    {savingId === m.id ? (
                      <CircularProgress size={20} />
                    ) : m.result === 'bye' ? (
                      <span>—</span>
                    ) : (
                      <Select
                        size="small"
                        value={m.result}
                        disabled={isLocked}
                        onChange={e => handleResultChange(m.id, e.target.value as MatchResult)}
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

      {isAdmin && isLastAnnounced && tournament.status !== 'finished' && (
        <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
          <Button
            variant="contained"
            disabled={!canFinishRound || finishing}
            onClick={handleFinishRound}
          >
            {finishing ? 'Завершение…' : 'Завершить раунд'}
          </Button>
        </Stack>
      )}

      {isAdmin && isLastAnnounced && !allResultsSet && tournament.status !== 'finished' && (
        <Alert severity="info" sx={{ mt: 1 }}>
          Кнопка будет доступна, когда все партии получат результат
        </Alert>
      )}
    </Box>
  );
}