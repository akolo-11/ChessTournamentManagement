import {
  Alert, Box, Chip, CircularProgress, IconButton,
  Stack, Tab, Tabs, Typography,
} from '@mui/material';
import { Outlet, useLocation, useNavigate, useParams } from 'react-router-dom';
import DownloadIcon from '@mui/icons-material/Download';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import { useTournament } from '../../hooks/useTournament';
import { useAuth } from '../../hooks/useAuth';
import { formatTimeControl, getTimeControlCategory, categoryLabels } from '../../utils/timeControl';
import { exportTournamentToExcel } from '../../utils/exportExcel';
import { exportTournamentToPdf } from '../../utils/exportPdf';
import TournamentActions from '../../components/tournament/TournamentActions';
import AnimatedTabPanel from '../../components/AnimatedTabPanel';

const mainTabs = [
  { label: 'Главная',   path: '' },
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
  const { pathname } = useLocation();
  const { isAdmin } = useAuth();
  const { tournament, loading, error, refetch } = useTournament(id);

  if (loading) return <CircularProgress />;
  if (error) return <Alert severity="error">{error}</Alert>;
  if (!tournament) return <Alert severity="error">Турнир не найден</Alert>;

  const base = `/tournaments/${id}`;
  const roundMatch = pathname.match(/\/rounds\/(\d+)/);
  const currentRound = roundMatch ? Number(roundMatch[1]) : null;
  const isRoundsPath = currentRound !== null;

  // Активная верхняя вкладка. null — открыт раунд (вкладки не активны).
  const activeMainTab = mainTabs.find(t =>
        t.path === '' ? pathname === base : pathname.startsWith(`${base}/${t.path}`)
      )?.path ?? '';

  const category = getTimeControlCategory(tournament.timeControl);
  const visibleRounds = tournament.rounds.filter(r => r.announcedAt !== null);
  const showRoundsRow = visibleRounds.length > 0;

  return (
    <Box>
      <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
        <Stack direction="row" spacing={1}>
          <Chip label={statusLabels[tournament.status]} color={statusColors[tournament.status]} size="small" />
          <Chip label={categoryLabels[category]} variant="outlined" size="small" />
        </Stack>

        <Stack direction="row" spacing={0.5}>
          <IconButton size="small" onClick={() => exportTournamentToExcel(tournament)} title="Скачать Excel">
            <DownloadIcon fontSize="small" />
          </IconButton>
          <IconButton size="small" onClick={() => exportTournamentToPdf(tournament)} title="Скачать PDF">
            <PictureAsPdfIcon fontSize="small" />
          </IconButton>
        </Stack>
      </Stack>

      <Typography variant="h4">{tournament.name}</Typography>

      <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5, mb: 3 }}>
        {tournament.location} · {tournament.startDate}
        {tournament.endDate ? ` — ${tournament.endDate}` : ''} ·
        Контроль: {formatTimeControl(tournament.timeControl)} ·
        Туров: {tournament.totalRounds}
      </Typography>

      {isAdmin && <TournamentActions tournament={tournament} onRefetch={refetch} />}

      {/* Верхние вкладки. value={false} — ни одна не активна, когда открыт раунд. */}
      <Tabs
        value={activeMainTab ?? false}
        onChange={(_, value) => navigate(`${base}/${value}`.replace(/\/$/, ''))}
        sx={{ borderBottom: 1, borderColor: 'divider' }}
      >
        {mainTabs.map(t => <Tab key={t.path} label={t.label} value={t.path} />)}
      </Tabs>

      {/* Раунды — независимая группа. Показываем только на «Главной». */}
      {showRoundsRow && (
        <Tabs
          value={currentRound ?? false}
          onChange={(_, value) => navigate(`${base}/rounds/${value}`)}
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

      <Box sx={{ mt: showRoundsRow ? 0 : 3 }}>
        <AnimatedTabPanel tabKey={`${activeMainTab ?? 'round'}-${currentRound ?? ''}`}>
          <Outlet context={{ tournament, isAdmin, refetch, round: currentRound }} />
        </AnimatedTabPanel>
      </Box>
    </Box>
  );
}