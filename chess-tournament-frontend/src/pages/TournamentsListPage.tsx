import { Box, Card, CardContent, Chip, Stack, Typography, Grid, Button } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { mockTournaments } from '../data/mockData';
import { formatTimeControl, getTimeControlCategory, categoryLabels } from '../utils/timeControl';
import { useAuth } from '../hooks/useAuth';

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

      <Grid container spacing={3}>
        {mockTournaments.map(t => {
          const category = getTimeControlCategory(t.timeControl);
          return (
            <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={t.id}>
              <Card component={RouterLink} to={`/tournaments/${t.id}`} sx={{ display: 'block', textDecoration: 'none', height: '100%' }}>
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
                      ? `Зарегистрировано: ${t.players.length}`
                      : `Участников: ${t.players.length} · Туров: ${t.totalRounds}`}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
}