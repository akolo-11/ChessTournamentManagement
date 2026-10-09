import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    mode: 'light',
    background: { default: '#faf6f0', paper: '#fffdf9' },
    primary: { main: '#a86b3c' },      
    secondary: { main: '#7a8b6f' },    
    text: { primary: '#2e2a26', secondary: '#7a7169' },
    divider: '#e8dfd3',
  },
  typography: {
    fontFamily: '"Inter", "Segoe UI", system-ui, sans-serif',
    h4: { fontWeight: 500, letterSpacing: '-0.02em' },
    h6: { fontWeight: 500 },
  },
  shape: { borderRadius: 8 },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: { backgroundColor: '#fffdf9', color: '#2e2a26', boxShadow: 'none', borderBottom: '1px solid #e8dfd3' },
      },
    },
    MuiCard: {
      styleOverrides: { root: { boxShadow: 'none', border: '1px solid #e8dfd3' } },
    },
    MuiButton: { defaultProps: { disableElevation: true } },
  },
});