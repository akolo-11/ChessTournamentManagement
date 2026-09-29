import { AppBar, Toolbar, Typography, Box, Chip } from '@mui/material';
import { Link, Outlet } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export default function Layout() {
  const { isAdmin } = useAuth();

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="static">
        <Toolbar sx={{ gap: 2 }}>
          <Typography
            component={Link}
            to="/"
            sx={{ color: 'inherit', textDecoration: 'none', fontSize: '1.05rem', fontWeight: 500 }}
          >
            Chess Tournament Manager
          </Typography>
          <Box sx={{ flexGrow: 1 }} />
          <Chip label={isAdmin ? 'Администратор' : 'Зритель'} size="small" variant="outlined" />
        </Toolbar>
      </AppBar>

      <Box component="main" sx={{ flexGrow: 1, px: { xs: 2, md: 4 }, py: 4 }}>
        <Outlet />
      </Box>

      <Box component="footer" sx={{ py: 3, textAlign: 'center', borderTop: '1px solid', borderColor: 'divider' }}>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          Chess Tournament Manager · {new Date().getFullYear()}
        </Typography>
      </Box>
    </Box>
  );
}