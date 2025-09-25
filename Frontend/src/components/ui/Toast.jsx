// 🍞 TOAST COMPONENT - SISTEMA DE NOTIFICACIONES SIMPLE
// ======================================================

import React, { createContext, useContext, useState, useCallback } from 'react';
import {
  Snackbar,
  Alert,
  AlertTitle,
  IconButton,
  Box,
  Typography,
  Stack
} from '@mui/material';
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Info,
  X
} from 'lucide-react';

// Context para el sistema de toasts
const ToastContext = createContext(null);

// 🎯 PROVIDER DEL SISTEMA DE TOASTS
export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((toast) => {
    const id = toast.id || Date.now() + Math.random();
    const newToast = { 
      ...toast, 
      id,
      duration: toast.duration || 4000,
      timestamp: Date.now()
    };

    setToasts(prev => {
      // Deduplicar por ID y limitar a 5 toasts máximo
      const filtered = prev.filter(t => t.id !== id);
      return [...filtered.slice(-4), newToast];
    });

    // Auto-remove después del tiempo especificado
    if (newToast.duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, newToast.duration);
    }

    return id;
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setToasts([]);
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast, clearAll }}>
      {children}
      <ToastContainer />
    </ToastContext.Provider>
  );
}

// 🎨 CONTENEDOR DE TOASTS
function ToastContainer() {
  const { toasts, removeToast } = useContext(ToastContext);

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 20,
        right: 20,
        zIndex: 9999,
        pointerEvents: 'none'
      }}
    >
      <Stack spacing={1}>
        {toasts.map((toast) => (
          <ToastItem
            key={toast.id}
            toast={toast}
            onClose={() => removeToast(toast.id)}
          />
        ))}
      </Stack>
    </Box>
  );
}

// 🍞 COMPONENTE TOAST INDIVIDUAL
function ToastItem({ toast, onClose }) {
  const getSeverity = (type) => {
    switch (type) {
      case 'success': return 'success';
      case 'error': return 'error';
      case 'warning': return 'warning';
      case 'info': return 'info';
      default: return 'info';
    }
  };

  const getIcon = (type) => {
    const iconProps = { size: 20, strokeWidth: 1.8 };
    switch (type) {
      case 'success': return <CheckCircle2 {...iconProps} />;
      case 'error': return <XCircle {...iconProps} />;
      case 'warning': return <AlertTriangle {...iconProps} />;
      case 'info': return <Info {...iconProps} />;
      default: return <Info {...iconProps} />;
    }
  };

  return (
    <Snackbar
      open={true}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      sx={{ 
        position: 'static',
        pointerEvents: 'auto',
        '& .MuiSnackbarContent-root': {
          padding: 0
        }
      }}
    >
      <Alert
        severity={getSeverity(toast.type)}
        icon={getIcon(toast.type)}
        onClose={onClose}
        sx={{
          minWidth: 300,
          maxWidth: 500,
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          '& .MuiAlert-message': {
            padding: '8px 0'
          }
        }}
      >
        {toast.title && (
          <AlertTitle sx={{ margin: 0, fontSize: 14, fontWeight: 600 }}>
            {toast.title}
          </AlertTitle>
        )}
        {toast.description && (
          <Typography variant="body2" sx={{ fontSize: 13 }}>
            {toast.description}
          </Typography>
        )}
      </Alert>
    </Snackbar>
  );
}

// 🎯 HOOK PARA USAR TOASTS
export function useToast() {
  const context = useContext(ToastContext);
  
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }

  const { addToast, removeToast, clearAll } = context;

  // Funciones de conveniencia
  const success = useCallback((options) => {
    return addToast({ ...options, type: 'success' });
  }, [addToast]);

  const error = useCallback((options) => {
    return addToast({ ...options, type: 'error', duration: 6000 });
  }, [addToast]);

  const warning = useCallback((options) => {
    return addToast({ ...options, type: 'warning', duration: 5000 });
  }, [addToast]);

  const info = useCallback((options) => {
    return addToast({ ...options, type: 'info' });
  }, [addToast]);

  return {
    toast: addToast,
    success,
    error,
    warning,
    info,
    dismiss: removeToast,
    dismissAll: clearAll
  };
}

// 🎯 FUNCIONES DE CONVENIENCIA GLOBALES
export const toast = {
  success: (options) => {

  },
  error: (options) => {

  },
  warning: (options) => {

  },
  info: (options) => {

  }
};

export default ToastProvider;