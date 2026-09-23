import { useState } from 'react';
import {
  Box, Typography, TextField, Stack, MenuItem, FormControlLabel,
  Switch, Button, Grid, Alert,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { useNavigate } from 'react-router-dom';
import dayjs, { type Dayjs } from 'dayjs';
import type { TournamentType } from '../../types';

interface FormState {
  name: string;
  type: TournamentType;
  location: string;
  startDate: Dayjs | null;
  endDate: Dayjs | null;
  startTime: Dayjs | null;
  baseMinutes: number;
  incrementSeconds: number;
  totalRounds: number;
  maxPlayers: number;
  useRating: boolean;
}

const initial: FormState = {
  name: '',
  type: 'swiss',
  location: '',
  startDate: null,
  endDate: null,
  startTime: dayjs().hour(10).minute(0),
  baseMinutes: 90,
  incrementSeconds: 30,
  totalRounds: 7,
  maxPlayers: 32,
  useRating: true,
};

export default function CreateTournamentPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState<FormState>(initial);
  const [error, setError] = useState<string | null>(null);

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm(prev => ({ ...prev, [key]: value }));

  const handleSubmit = () => {
    if (!form.name.trim()) return setError('Укажите название');
    if (!form.startDate) return setError('Укажите дату начала');
    if (form.endDate && form.endDate.isBefore(form.startDate)) {
      return setError('Дата окончания раньше начала');
    }
    if (form.totalRounds < 1) return setError('Минимум 1 раунд');
    if (form.maxPlayers < 2) return setError('Минимум 2 участника');

    // TODO: отправка на сервер (startDate.toISOString() и т.п.)
    navigate('/');
  };

  return (
    <Box sx={{ maxWidth: 720 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>Новый турнир</Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Stack spacing={3}>
        <TextField
          label="Название"
          value={form.name}
          onChange={e => update('name', e.target.value)}
          fullWidth
        />

        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              select
              label="Система"
              value={form.type}
              onChange={e => update('type', e.target.value as TournamentType)}
              fullWidth
            >
              <MenuItem value="swiss">Швейцарская</MenuItem>
              <MenuItem value="round-robin">Круговая</MenuItem>
            </TextField>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              label="Место проведения"
              value={form.location}
              onChange={e => update('location', e.target.value)}
              fullWidth
            />
          </Grid>
        </Grid>

        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 4 }}>
            <DatePicker
              label="Дата начала"
              value={form.startDate}
              onChange={value => update('startDate', value)}
              slotProps={{ textField: { fullWidth: true } }}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <DatePicker
              label="Дата окончания"
              value={form.endDate}
              onChange={value => update('endDate', value)}
              slotProps={{ textField: { fullWidth: true } }}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <TimePicker
              label="Время начала"
              value={form.startTime}
              onChange={value => update('startTime', value)}
              slotProps={{ textField: { fullWidth: true } }}
            />
          </Grid>
        </Grid>

        <Box>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>Контроль времени</Typography>
          <Grid container spacing={2}>
            <Grid size={{ xs: 6, sm: 3 }}>
              <TextField
                label="Минут"
                type="number"
                value={form.baseMinutes}
                onChange={e => update('baseMinutes', Number(e.target.value))}
                fullWidth
              />
            </Grid>
            <Grid size={{ xs: 6, sm: 3 }}>
              <TextField
                label="Секунд добавка"
                type="number"
                value={form.incrementSeconds}
                onChange={e => update('incrementSeconds', Number(e.target.value))}
                fullWidth
              />
            </Grid>
          </Grid>
        </Box>

        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              label="Количество раундов"
              type="number"
              value={form.totalRounds}
              onChange={e => update('totalRounds', Number(e.target.value))}
              fullWidth
              slotProps={{ htmlInput: { min: 1, max: 30 } }}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              label="Макс. участников"
              type="number"
              value={form.maxPlayers}
              onChange={e => update('maxPlayers', Number(e.target.value))}
              fullWidth
              slotProps={{ htmlInput: { min: 2 } }}
            />
          </Grid>
        </Grid>

        <FormControlLabel
          control={
            <Switch
              checked={form.useRating}
              onChange={e => update('useRating', e.target.checked)}
            />
          }
          label="Учитывать рейтинг при жеребьёвке"
        />

        <Stack direction="row" spacing={2}>
          <Button variant="contained" onClick={handleSubmit}>Создать</Button>
          <Button onClick={() => navigate('/')}>Отмена</Button>
        </Stack>
      </Stack>
    </Box>
  );
}