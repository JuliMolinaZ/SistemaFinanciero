// src/index.js
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { GlobalProvider } from './context/GlobalState';
import './styles/global.css';
import { ThemeProvider, createTheme } from '@mui/material/styles';

const theme = createTheme({
  // Opcional: Personaliza el tema aquí
});

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <GlobalProvider>
        <App />
      </GlobalProvider>
    </ThemeProvider>
  </React.StrictMode>
);
