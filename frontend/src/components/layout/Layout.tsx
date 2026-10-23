import { useState } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Box, Chip, Button, Menu, Stack, MenuItem } from '@mui/material';
import { useAuth } from '../../hooks/useAuth';
import chessIcon from '../../assets/chess.png';
import LoginDialog from './LoginDialog';

export default function Layout() {
  const { user, isAdmin, isJudge, logout } = useAuth();
  const navigate = useNavigate();
  
  const [loginOpen, setLoginOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleLogout = async () => {
    await logout();
    setAnchorEl(null);
    navigate('/');
  };

  const roleLabel = user?.role === 'admin' ? 'Администратор' 
                  : user?.role === 'judge' ? 'Судья' 
                  : 'Зритель';

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

          {!user ? (
            <Button color="inherit" variant="outlined" size="small" onClick={() => setLoginOpen(true)}>
              Войти
            </Button>
          ) : (
            <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
              {user.role === 'judge' && (
                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                  {user.full_name} ({user.organization})
                </Typography>
              )}
              <Chip label={roleLabel} size="small" variant="outlined" sx={{ color: 'white', borderColor: 'rgba(255,255,255,0.5)' }} />
              <Button color="inherit" size="small" onClick={(e) => setAnchorEl(e.currentTarget)}>
                {user.username}
              </Button>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={() => setAnchorEl(null)}
              >
                <MenuItem onClick={handleLogout}>Выйти</MenuItem>
              </Menu>
            </Stack>
          )}
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

      <LoginDialog open={loginOpen} onClose={() => setLoginOpen(false)} />
    </Box>
  );
}