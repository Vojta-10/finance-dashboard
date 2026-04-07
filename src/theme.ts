import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    // The background of the app. A very soft gray makes the white dashboard cards pop.
    background: {
      default: '#f4f6f8',
      paper: '#ffffff',
    },
    // The main brand color (e.g., used for your Navbar and primary buttons)
    primary: {
      main: '#1976d2', // A trustworthy corporate blue
      light: '#42a5f5',
      dark: '#1565c0',
    },
    // Secondary color (useful for floating action buttons or accents)
    secondary: {
      main: '#9c27b0', 
    },
    // Financial colors: Success (Income) and Error (Expenses)
    success: {
      main: '#2e7d32', // Clean, readable green
      light: '#4caf50',
    },
    error: {
      main: '#d32f2f', // Standard alert red
      light: '#ef5350',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    // Make our dashboard headers look a bit bolder and more professional
    h1: { fontWeight: 700 },
    h2: { fontWeight: 700 },
    h3: { fontWeight: 600 },
    h4: { fontWeight: 600 },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
  },
  // We can also override default component behaviors here globally!
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none', // Stops MUI from making all buttons UPPERCASE by default
          borderRadius: 8,       // Gives buttons a modern, slightly rounded look
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,      // Makes our dashboard cards look softer and more modern
          boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.05)', // A very soft, modern shadow
        },
      },
    },
  },
});

export default theme;