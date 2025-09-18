// 🔔 NOTIFICATION PROVIDER - SISTEMA GLOBAL DE NOTIFICACIONES
// ===========================================================

import React, { useEffect } from 'react';
import { ToastProvider } from '../ui/Toast.jsx';
import { ErrorDialog, useErrorDialog } from '../ui/ErrorDialog.jsx';
import { normalizeError } from '../../lib/errors.js';

/**
 * Provider global que maneja tanto toasts como error dialogs
 */
export function NotificationProvider({ children }) {
  const { showError, hideError, ErrorDialog: ErrorDialogComponent } = useErrorDialog();

  // Escuchar eventos globales de error
  useEffect(() => {
    const handleShowErrorDialog = (event) => {
      const error = event.detail;
      const normalizedError = error.code ? error : normalizeError(error);
      showError(normalizedError);
    };

    window.addEventListener('showErrorDialog', handleShowErrorDialog);

    return () => {
      window.removeEventListener('showErrorDialog', handleShowErrorDialog);
    };
  }, [showError]);

  return (
    <ToastProvider>
      {children}
      <ErrorDialogComponent />
    </ToastProvider>
  );
}

export default NotificationProvider;