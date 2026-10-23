import { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Alert, Stack } from '@mui/material';
import { api } from '../../api/client';

interface Props { open: boolean; onClose: () => void; }

export default function CreateJudgeDialog({ open, onClose }: Props) {
  const [form, setForm] = useState({ username: '', password: '', fullName: '', organization: '' });
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const handleSubmit = async () => {
    setBusy(true); 
    setError(null);
    try {
      await api.createJudge({
        username: form.username,
        password: form.password,
        full_name: form.fullName,
        organization: form.organization,
      });
      
      onClose();
      setForm({ username: '', password: '', fullName: '', organization: '' });
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally { 
      setBusy(false); 
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Новый судья</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          {error && <Alert severity="error">{error}</Alert>}
          <TextField label="Логин" value={form.username} onChange={e => setForm({...form, username: e.target.value})} fullWidth />
          <TextField label="Пароль" type="password" value={form.password} onChange={e => setForm({...form, password: e.target.value})} fullWidth />
          <TextField label="ФИО" value={form.fullName} onChange={e => setForm({...form, fullName: e.target.value})} fullWidth />
          <TextField label="Организация" value={form.organization} onChange={e => setForm({...form, organization: e.target.value})} fullWidth />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={busy}>Отмена</Button>
        <Button variant="contained" onClick={handleSubmit} disabled={busy}>Создать</Button>
      </DialogActions>
    </Dialog>
  );
}