import { Box, List, ListItemButton, ListItemText, Chip, Stack } from '@mui/material';
import { useNavigate, useOutletContext } from 'react-router-dom';
import type { Tournament } from '../../../types';

interface Ctx { tournament: Tournament }

const roundStatusLabels = { pending: 'Не начат', 'in-progress': 'Идёт', completed: 'Завершён' } as const;
const roundStatusColors = { pending: 'default', 'in-progress': 'warning', completed: 'success' } as const;

export default function RoundsTab() {
  const { tournament } = useOutletContext<Ctx>();
  const navigate = useNavigate();

  if (tournament.rounds.length === 0) {
    return <Box sx={{ p: 2 }}>Раунды ещё не созданы</Box>;
  }

  return (
    <Box>
      <List>
        {tournament.rounds.map(r => (
          <ListItemButton
            key={r.number}
            onClick={() => navigate(`/tournaments/${tournament.id}/rounds/${r.number}`)}
          >
            <ListItemText
              primary={`Раунд ${r.number}`}
              secondary={`Партий: ${r.matches.length}`}
            />
            <Stack direction="row" spacing={1}>
              <Chip label={roundStatusLabels[r.status]} color={roundStatusColors[r.status]} size="small" />
            </Stack>
          </ListItemButton>
        ))}
      </List>
    </Box>
  );
}