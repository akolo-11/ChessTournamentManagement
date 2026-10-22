import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import 'dayjs/locale/ru';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import { theme } from './theme';
import AppRouter from './routes/AppRouter';
import { AuthProvider } from './hooks/useAuth';

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ru">
        <AuthProvider>
          <AppRouter />
        </AuthProvider>
      </LocalizationProvider>
    </ThemeProvider>
  );
}