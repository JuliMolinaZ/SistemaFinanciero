import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { GlobalProvider } from './context/GlobalState';
import './styles/global.css';  {/* Importa los estilos globales */}

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <GlobalProvider>
      <App />
    </GlobalProvider>
  </React.StrictMode>
);