import { useState } from 'react';
import { Alert, Box, Button, Stack, TextField, Typography } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function RegisterPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    setBusy(true); setError(null);
    try {
      await login(username, password);
      navigate('/');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Ошибка входа');
    } finally { setBusy(false); }
  };

  return (
    <Box sx={{ maxWidth: 400, mx: 'auto', mt: 8 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>Вход</Typography>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      <Stack spacing={2}>
        <TextField label="Имя пользователя" value={username}
          onChange={e => setUsername(e.target.value)} fullWidth />
        <TextField label="Пароль" type="password" value={password}
          onChange={e => setPassword(e.target.value)} fullWidth />
        <Button variant="contained" onClick={submit} disabled={busy}>
          {busy ? 'Вход…' : 'Войти'}
        </Button>
        <Typography variant="body2">
          Нет аккаунта? <Link to="/register">Зарегистрироваться</Link>
        </Typography>
      </Stack>
    </Box>
  );
}