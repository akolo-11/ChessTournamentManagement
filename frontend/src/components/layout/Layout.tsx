import { AppBar, Toolbar, Typography, Box, Chip } from '@mui/material';
import { Link, Outlet } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import chessIcon from '../../assets/chess.png';

export default function Layout() {
  const { isAdmin } = useAuth();

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="static">
        <Toolbar sx={{ gap: 2 }}>
          <Box
            component={Link}
            to="/"
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 1,
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            <Box
              component="img"
              src={chessIcon}
              alt="Chess"
              sx={{ width: 28, height: 28 }}
            />
            <Typography
              sx={{ color: 'inherit', fontSize: '1.05rem', fontWeight: 500 }}
            >
              Chess Tournament Manager
            </Typography>
          </Box>
          
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