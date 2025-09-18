// 🔔 MODERN TOAST - NOTIFICACIONES ULTRA ELEGANTES
// ===============================================

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle, 
  AlertCircle, 
  AlertTriangle, 
  Info, 
  X,
  Loader2
} from 'lucide-react';
import './modern-toast.css';

// 🎯 TOAST CONTEXT
const ToastContext = createContext();

// 📝 TOAST TYPES
const TOAST_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info',
  LOADING: 'loading'
};

// 🎨 ICONS MAP
const ICONS = {
  [TOAST_TYPES.SUCCESS]: CheckCircle,
  [TOAST_TYPES.ERROR]: AlertCircle,
  [TOAST_TYPES.WARNING]: AlertTriangle,
  [TOAST_TYPES.INFO]: Info,
  [TOAST_TYPES.LOADING]: Loader2
};

// 🔔 SINGLE TOAST COMPONENT
const ToastItem = ({ toast, onRemove }) => {
  const [isRemoving, setIsRemoving] = useState(false);
  const Icon = ICONS[toast.type];

  const handleRemove = useCallback(() => {
    setIsRemoving(true);
    setTimeout(() => onRemove(toast.id), 150);
  }, [toast.id, onRemove]);

  // Auto remove after duration
  useEffect(() => {
    if (toast.duration && toast.duration > 0) {
      const timer = setTimeout(handleRemove, toast.duration);
      return () => clearTimeout(timer);
    }
  }, [toast.duration, handleRemove]);

  return (
    <motion.div
      className={`modern-toast modern-toast--${toast.type} ${isRemoving ? 'modern-toast--removing' : ''}`}
      initial={{ opacity: 0, x: 300, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 300, scale: 0.95 }}
      transition={{ 
        type: 'spring',
        damping: 25,
        stiffness: 300,
        duration: 0.3
      }}
      layout
    >
      <div className="modern-toast-content">
        <div className="modern-toast-icon">
          <Icon 
            className={`modern-toast-icon-svg ${toast.type === 'loading' ? 'modern-toast-icon--spinning' : ''}`} 
          />
        </div>
        
        <div className="modern-toast-text">
          {toast.title && (
            <div className="modern-toast-title">{toast.title}</div>
          )}
          {toast.description && (
            <div className="modern-toast-description">{toast.description}</div>
          )}
        </div>
      </div>

      {!toast.persistent && (
        <button
          className="modern-toast-close"
          onClick={handleRemove}
          aria-label="Cerrar notificación"
        >
          <X className="modern-toast-close-icon" />
        </button>
      )}

      {toast.duration && toast.duration > 0 && (
        <div 
          className="modern-toast-progress"
          style={{ 
            animationDuration: `${toast.duration}ms`,
            animationPlayState: isRemoving ? 'paused' : 'running'
          }}
        />
      )}
    </motion.div>
  );
};

// 🔔 TOAST CONTAINER
const ToastContainer = ({ toasts, onRemove }) => (
  <div className="modern-toast-container">
    <AnimatePresence mode="popLayout">
      {toasts.map((toast) => (
        <ToastItem
          key={toast.id}
          toast={toast}
          onRemove={onRemove}
        />
      ))}
    </AnimatePresence>
  </div>
);

// 🎯 TOAST PROVIDER
export const ModernToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((toast) => {
    const id = Date.now() + Math.random();
    const newToast = {
      id,
      duration: 5000, // Default 5 seconds
      ...toast
    };

    setToasts(prev => [...prev, newToast]);
    return id;
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setToasts([]);
  }, []);

  // 🎯 TOAST METHODS
  const toast = {
    success: (options) => addToast({ type: TOAST_TYPES.SUCCESS, ...options }),
    error: (options) => addToast({ type: TOAST_TYPES.ERROR, duration: 8000, ...options }),
    warning: (options) => addToast({ type: TOAST_TYPES.WARNING, duration: 6000, ...options }),
    info: (options) => addToast({ type: TOAST_TYPES.INFO, ...options }),
    loading: (options) => addToast({ type: TOAST_TYPES.LOADING, persistent: true, ...options }),
    remove: removeToast,
    clear: clearAll
  };

  const value = {
    toasts,
    toast,
    addToast,
    removeToast,
    clearAll
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastContainer
        toasts={toasts}
        onRemove={removeToast}
      />
    </ToastContext.Provider>
  );
};

// 🎯 HOOK TO USE TOASTS
export const useModernToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useModernToast must be used within a ModernToastProvider');
  }
  return context.toast;
};

// 🎯 TOAST RESULT WRAPPER
export const toastResult = async (promise, options = {}) => {
  const toast = useModernToast();
  
  const {
    pending = 'Procesando...',
    success = 'Operación completada',
    error = 'Ocurrió un error'
  } = options;

  let loadingId;
  
  // Show loading toast
  if (pending) {
    loadingId = toast.loading({
      title: typeof pending === 'string' ? pending : pending.title,
      description: typeof pending === 'object' ? pending.description : undefined
    });
  }

  try {
    const result = await promise;
    
    // Remove loading toast
    if (loadingId) {
      toast.remove(loadingId);
    }
    
    // Show success toast
    if (success) {
      toast.success({
        title: typeof success === 'function' ? success(result) : 
               typeof success === 'string' ? success : success.title,
        description: typeof success === 'object' && !success.title ? success.description :
                    typeof success === 'function' ? undefined : 
                    typeof success === 'object' ? success.description : undefined
      });
    }
    
    return result;
  } catch (err) {
    // Remove loading toast
    if (loadingId) {
      toast.remove(loadingId);
    }
    
    // Show error toast
    if (error) {
      toast.error({
        title: typeof error === 'function' ? error(err) :
               typeof error === 'string' ? error : error.title,
        description: typeof error === 'object' && !error.title ? error.description :
                    typeof error === 'function' ? undefined :
                    typeof error === 'object' ? error.description : 
                    err.message || 'Error desconocido'
      });
    }
    
    throw err;
  }
};

export default ModernToastProvider;
