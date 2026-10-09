import { Box, Grid, Card, CardContent, Typography, List, ListItem, Link } from '@mui/material';
import { useOutletContext } from 'react-router-dom';
import type { Tournament } from '../../../types';
import { getStandings } from '../../../data/helpers';

interface Ctx { tournament: Tournament }

export default function SummaryTab() {
  const { tournament } = useOutletContext<Ctx>();
  const standings = getStandings(tournament);
  const roundsPlayed = tournament.rounds.filter(r => r.status === 'completed').length;

  const stats = [
    { label: 'Участников', value: tournament.players.filter(p => p.isActive).length },
    { label: 'Раундов сыграно', value: `${roundsPlayed} / ${tournament.totalRounds}` },
    { label: 'Партий всего', value: tournament.rounds.reduce((a, r) => a + r.matches.length, 0) },
  ];

  return (
    <Box>
      {tournament.status === 'registration' && (
        <Box sx={{ mb: 3 }}>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Регистрация открыта. Участников: {tournament.players.length} из {tournament.maxPlayers ?? '∞'}.
          </Typography>

          {tournament.registrationUrl ? (
            <Typography variant="body2">
              Регистрация:{' '}
              <Link
                href={tournament.registrationUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                {tournament.registrationUrl}
              </Link>
            </Typography>
          ) : (
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Ссылка на форму регистрации не указана. Обратитесь к организатору.
            </Typography>
          )}
        </Box>
      )}

      <Grid container spacing={3} sx={{ mb: 3 }}>
        {stats.map(s => (
          <Grid size={{ xs: 12, sm: 4 }} key={s.label}>
            <Card>
              <CardContent>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>{s.label}</Typography>
                <Typography variant="h4">{s.value}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Typography variant="h6" sx={{ mb: 1 }}>Лидеры</Typography>
      <List dense>
        {standings.slice(0, 5).map((s, i) => (
          <ListItem key={s.player.id}>
            {i + 1}. {s.player.name} — {s.score} очк.
          </ListItem>
        ))}
      </List>
    </Box>
  );
}