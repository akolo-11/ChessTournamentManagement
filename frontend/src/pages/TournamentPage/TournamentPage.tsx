import { Box, Stack, Typography, Chip, Tabs, Tab, Alert } from '@mui/material';
import { Outlet, useNavigate, useParams, useLocation } from 'react-router-dom';
import { getTournament } from '../../data/helpers';
import { formattime_control, gettime_controlCategory, categoryLabels } from '../../utils/time_control';
import { useAuth } from '../../hooks/useAuth';

import { IconButton } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import { exportTournamentToExcel } from '../../utils/exportExcel';
import { exportTournamentToPdf } from '../../utils/exportPdf';

const mainTabs = [
  { label: 'Главная',    path: '' },
  { label: 'Участники', path: 'players' },
  { label: 'Итоги',     path: 'results' },
];

const statusLabels = {
  draft: 'Черновик',
  registration: 'Регистрация открыта',
  active: 'Идёт',
  finished: 'Завершён',
} as const;

const statusColors = {
  draft: 'default',
  registration: 'secondary',
  active: 'success',
  finished: 'info',
} as const;

export default function TournamentPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAdmin } = useAuth();
  const tournament = id ? getTournament(id) : undefined;

  if (!tournament) return <Alert severity="error">Турнир не найден</Alert>;

  const currentMainTab = mainTabs.find(t =>
    t.path === ''
      ? location.pathname === `/tournaments/${id}`
      : location.pathname.startsWith(`/tournaments/${id}/${t.path}`)
  )?.path ?? '';

  const category = gettime_controlCategory(tournament.time_control);

  const visibleRounds = tournament.rounds.filter(r => r.status !== 'pending' || r.matches.length > 0);// rounds visible for pairings/results
  const currentRoundMatch = location.pathname.match(/\/rounds\/(\d+)/);
  const currentRound = currentRoundMatch ? Number(currentRoundMatch[1]) : null;

  return (
    <Box>
      <Stack direction="row" spacing={1} sx={{ mb: 1.5 }}>
        <Chip label={statusLabels[tournament.status]} color={statusColors[tournament.status]} size="small" />
        <Chip label={categoryLabels[category]} variant="outlined" size="small" />
      </Stack>

      <Typography variant="h4">{tournament.name}</Typography>

      <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5, mb: 3 }}>
        {tournament.location} · {tournament.start_date}
        {tournament.end_date ? ` — ${tournament.end_date}` : ''} ·
        Контроль: {formattime_control(tournament.time_control)} ·
        Туров: {tournament.totalRounds}
      </Typography>

      <Stack direction="row" spacing={0.5} sx={{ mt: 1 }}>
        <IconButton size="small" onClick={() => exportTournamentToExcel(tournament)} title="Скачать Excel">
          <DownloadIcon fontSize="small" />
        </IconButton>
        <IconButton size="small" onClick={() => exportTournamentToPdf(tournament)} title="Скачать PDF">
          <PictureAsPdfIcon fontSize="small" />
        </IconButton>
      </Stack>

      {/* tournament tabs */}
      <Tabs
        value={currentMainTab}
        onChange={(_, value) => navigate(`/tournaments/${id}/${value}`.replace(/\/$/, ''))}
        sx={{ borderBottom: 1, borderColor: 'divider' }}
      >
        {mainTabs.map(t => <Tab key={t.path} label={t.label} value={t.path} />)}
      </Tabs>

      {/* rounds tabs */}
      {visibleRounds.length > 0 && currentMainTab === '' && (
        <Tabs
          value={currentRound ?? false}
          onChange={(_, value) => navigate(`/tournaments/${id}/rounds/${value}`)}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            borderBottom: 1,
            borderColor: 'divider',
            mb: 3,
            minHeight: 36,
            '& .MuiTab-root': { minHeight: 36, py: 0.5, textTransform: 'none', fontSize: '0.875rem' },
          }}
        >
          {visibleRounds.map(r => (
            <Tab key={r.number} value={r.number} label={`Раунд ${r.number}/${tournament.totalRounds}`} />
          ))}
        </Tabs>
      )}

      <Box sx={{ mt: currentMainTab === '' && visibleRounds.length > 0 ? 0 : 3 }}>
        <Outlet context={{ tournament, isAdmin }} />
      </Box>
    </Box>
  );
}