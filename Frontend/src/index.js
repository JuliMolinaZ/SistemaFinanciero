// src/index.js
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { GlobalProvider } from './context/GlobalState';
import { NotificationProvider } from './components/providers/NotificationProvider';
import { NotificationsProvider } from './context/NotificationsContext';
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
        <NotificationProvider>
          <NotificationsProvider>
            <App />
          </NotificationsProvider>
        </NotificationProvider>
      </GlobalProvider>
    </ThemeProvider>
  </React.StrictMode>
);
