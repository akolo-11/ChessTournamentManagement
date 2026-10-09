import { useState } from 'react';
import {
  Alert, Button, Dialog, DialogActions, DialogContent, DialogTitle,
  Stack, TextField,
} from '@mui/material';
import { api } from '../../api/client';

interface Props {
  open: boolean;
  tournamentId: string;
  onClose: () => void;
  onAdded: () => void;
}

interface FormState {
  name: string;
  rating: string;
  federation: string;
}

const initial: FormState = { name: '', rating: '2000', federation: 'RUS' };

export default function AddPlayerDialog({ open, tournamentId, onClose, onAdded }: Props) {
  const [form, setForm] = useState<FormState>(initial);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm(prev => ({ ...prev, [key]: value }));

  const handleClose = () => {
    setForm(initial);
    setError(null);
    onClose();
  };

  const handleSubmit = async () => {
    if (!form.name.trim()) return setError('Укажите имя');
    const rating = Number(form.rating);
    if (Number.isNaN(rating) || rating < 0) {
      return setError('Рейтинг должен быть больше 0');
    }

    setError(null);
    setSubmitting(true);
    try {
      await api.addPlayer(tournamentId, {
        name: form.name.trim(),
        rating,
        federation: form.federation.trim().toUpperCase().slice(0, 10),
      });
      onAdded();
      handleClose();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
      <DialogTitle>Добавить участника</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          {error && <Alert severity="error">{error}</Alert>}
          <TextField
            label="Имя"
            value={form.name}
            onChange={e => update('name', e.target.value)}
            autoFocus
            fullWidth
          />
          <TextField
            label="Рейтинг"
            value={form.rating}
            onChange={e => update('rating', e.target.value)}
            fullWidth
          />
          <TextField
            label="Федерация"
            value={form.federation}
            onChange={e => update('federation', e.target.value)}
            fullWidth
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={submitting}>Отмена</Button>
        <Button variant="contained" onClick={handleSubmit} disabled={submitting}>
          {submitting ? 'Добавление…' : 'Добавить'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}