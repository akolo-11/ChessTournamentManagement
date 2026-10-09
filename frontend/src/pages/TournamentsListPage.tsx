import { useEffect, useState } from 'react';
import {
  Alert, Box, Button, Card, CardContent, Chip, CircularProgress,
  Grid, Stack, Typography,
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { api } from '../api/client';
import { mapTournamentListItem, type ApiTournamentListItem } from '../api/mappers';
import type { Tournament } from '../types';
import {
  formatTimeControl, getTimeControlCategory, categoryLabels,
} from '../utils/timeControl';
import { useAuth } from '../hooks/useAuth';
import { motion } from 'framer-motion';

const statusLabels = {
  draft: 'Черновик',
  registration: 'Регистрация',
  active: 'Идёт',
  finished: 'Завершён',
} as const;

const statusColors = {
  draft: 'default',
  registration: 'secondary',
  active: 'success',
  finished: 'info',
} as const;

export default function TournamentsListPage() {
  const { isAdmin } = useAuth();
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api.listTournaments()
      .then(raw => setTournaments((raw as ApiTournamentListItem[]).map(mapTournamentListItem)))
      .catch(e => setError(String(e)))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <CircularProgress />;
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <Box>
      <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Турниры</Typography>
        {isAdmin && (
          <Button variant="contained" component={RouterLink} to="/admin/tournaments/create">
            Создать
          </Button>
        )}
      </Stack>

      {tournaments.length === 0 ? (
        <Alert severity="info">Турниров пока нет</Alert>
      ) : (
        <Grid container spacing={3}>
          {tournaments.map(t => {
            const category = getTimeControlCategory(t.timeControl);
            return (
              <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={t.id}>
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25, delay: 0.05 }}
                >
                  <Card
                    component={RouterLink}
                    to={`/tournaments/${t.id}`}
                    sx={{ display: 'block', textDecoration: 'none', height: '100%' }}
                  >
                    <CardContent>
                      <Stack direction="row" spacing={1} sx={{ mb: 1.5 }}>
                        <Chip label={statusLabels[t.status]} color={statusColors[t.status]} size="small" />
                        <Chip label={categoryLabels[category]} variant="outlined" size="small" />
                      </Stack>

                      <Typography variant="h6" sx={{ mb: 0.5 }}>{t.name}</Typography>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>{t.location}</Typography>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        {t.startDate} · {formatTimeControl(t.timeControl)}
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1.5 }}>
                        {t.status === 'registration'
                          ? `Зарегистрировано: ${t.playersCount ?? 0}`
                          : `Участников: ${t.playersCount ?? 0} · Туров: ${t.totalRounds}`}
                      </Typography>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            );
          })}
        </Grid>
      )}
    </Box>
  );
}