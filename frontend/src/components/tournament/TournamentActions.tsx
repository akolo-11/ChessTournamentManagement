import { useState } from 'react';
import { Alert, Button, Stack, Snackbar } from '@mui/material';
import { api } from '../../api/client';
import type { Tournament } from '../../types';

interface Props {
  tournament: Tournament;
  onRefetch: () => void;
}

export default function TournamentActions({ tournament, onRefetch }: Props) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const run = async (fn: () => Promise<unknown>) => {
    setBusy(true);
    setError(null);
    try {
      await fn();
      onRefetch();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setBusy(false);
    }
  };

  const canStart = tournament.status === 'registration';
  const canFinish = tournament.status === 'active';
  const isFinished = tournament.status === 'finished';

  return (
    <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
      {canStart && (
        <Button
          variant="contained"
          disabled={busy}
          onClick={() => run(() => api.startTournament(tournament.id))}
        >
          Начать турнир
        </Button>
      )}

      {canFinish && (
        <Button
          variant="outlined"
          color="error"
          disabled={busy}
          onClick={() => {
            if (confirm('Завершить турнир досрочно? Действие необратимо.')) {
              run(() => api.finishTournament(tournament.id));
            }
          }}
        >
          Завершить турнир
        </Button>
      )}

      {isFinished && (
        <Alert severity="success" sx={{ py: 0 }}>
          Турнир завершён
        </Alert>
      )}

      <Snackbar
        open={!!error}
        autoHideDuration={5000}
        onClose={() => setError(null)}
        message={error}
      />
    </Stack>
  );
}