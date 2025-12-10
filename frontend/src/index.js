import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { ThemeProvider, createTheme } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';

const theme = createTheme({
  palette: {
    primary: { main: '#2980b9' },
    secondary: { main: '#27ae60' },
  },
});

ReactDOM.render(
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <App />
  </ThemeProvider>,
  document.getElementById('root')
);