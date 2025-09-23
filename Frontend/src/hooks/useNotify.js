// 📢 HOOK DE NOTIFICACIONES - SISTEMA UNIFICADO
// ==============================================

import { useState, useCallback, useRef, useEffect } from 'react';
import { useNotifications as useNotificationContext } from '../components/ui/NotificationSystem';

// 🎯 TIPOS DE NOTIFICACIÓN
const NOTIFICATION_TYPES = {
  success: 'success',
  error: 'error',
  warning: 'warning',
  info: 'info'
};

// ⏰ DURACIÓN POR DEFECTO
const DEFAULT_DURATION = {
  success: 4000,
  error: 6000,
  warning: 5000,
  info: 4000
};

// 🎭 HOOK PRINCIPAL - WRAPPER PARA NOTIFICACIONES
export function useNotify() {
  // Intentar usar el sistema de notificaciones si está disponible
  let notificationSystem = null;
  try {
    notificationSystem = useNotificationContext();
  } catch (error) {
    // Si no hay NotificationProvider, usar fallback
    console.warn('NotificationProvider no disponible, usando fallback con console');
  }

  // 🎯 Funciones de conveniencia por tipo
  const success = useCallback((options) => {
    if (notificationSystem) {
      return notificationSystem.notify.success(options);
    } else {
      // Fallback con console (sin alert)
      console.log(`✅ ${options.title}${options.description ? ` - ${options.description}` : ''}`);
    }
  }, [notificationSystem]);

  const error = useCallback((options) => {
    if (notificationSystem) {
      return notificationSystem.notify.error(options);
    } else {
      // Fallback con console (sin alert)
      console.error(`❌ ${options.title}${options.description ? ` - ${options.description}` : ''}`);
    }
  }, [notificationSystem]);

  const warning = useCallback((options) => {
    if (notificationSystem) {
      return notificationSystem.notify.warning(options);
    } else {
      // Fallback con console (sin alert)
      console.warn(`⚠️ ${options.title}${options.description ? ` - ${options.description}` : ''}`);
    }
  }, [notificationSystem]);

  const info = useCallback((options) => {
    if (notificationSystem) {
      return notificationSystem.notify.info(options);
    } else {
      // Fallback con console (sin alert)
      console.info(`ℹ️ ${options.title}${options.description ? ` - ${options.description}` : ''}`);
    }
  }, [notificationSystem]);

  const loading = useCallback((options) => {
    if (notificationSystem) {
      return notificationSystem.notify.loading(options);
    } else {
      // Fallback con console
      console.log(`⏳ ${options.title}${options.description ? ` - ${options.description}` : ''}`);
    }
  }, [notificationSystem]);

  const remove = useCallback((id) => {
    if (notificationSystem) {
      return notificationSystem.notify.remove(id);
    }
  }, [notificationSystem]);

  const clear = useCallback(() => {
    if (notificationSystem) {
      return notificationSystem.notify.clear();
    }
  }, [notificationSystem]);

  // 📊 Log para debugging
  useEffect(() => {
    console.log('🔔 Sistema de notificaciones inicializado:', notificationSystem ? 'Notification UI' : 'Alert fallback');
  }, [notificationSystem]);

  return {
    success,
    error,
    warning,
    info,
    loading,
    remove,
    clear
  };
}

// 🎯 Hook simplificado que usa directamente useNotify
export function useNotifyWithContainer() {
  return useNotify();
}

// 🎯 NOTIFICATION RESULT WRAPPER
export const notifyResult = async (promise, options = {}) => {
  const notify = useNotify();
  
  const {
    pending = 'Procesando...',
    success = 'Operación completada',
    error = 'Ocurrió un error'
  } = options;

  let loadingId;
  
  // Show loading notification
  if (pending) {
    loadingId = notify.loading({
      title: typeof pending === 'string' ? pending : pending.title,
      description: typeof pending === 'object' ? pending.description : undefined
    });
  }

  try {
    const result = await promise;
    
    // Remove loading notification
    if (loadingId) {
      notify.remove(loadingId);
    }
    
    // Show success notification
    if (success) {
      notify.success({
        title: typeof success === 'function' ? success(result) : 
               typeof success === 'string' ? success : success.title,
        description: typeof success === 'object' && !success.title ? success.description :
                    typeof success === 'function' ? undefined : 
                    typeof success === 'object' ? success.description : undefined
      });
    }
    
    return result;
  } catch (err) {
    // Remove loading notification
    if (loadingId) {
      notify.remove(loadingId);
    }
    
    // Show error notification
    if (error) {
      notify.error({
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

// 🎯 BATCH OPERATIONS HELPER
export const notifyOperations = {
  batch: async (operations, options = {}) => {
    const notify = useNotify();
    const { 
      pending = 'Procesando operaciones...',
      success = (results) => `${results.length} operaciones completadas`,
      error = 'Algunas operaciones fallaron'
    } = options;

    const loadingId = notify.loading({ title: pending });
    
    try {
      const results = await Promise.allSettled(operations);
      notify.remove(loadingId);
      
      const successful = results.filter(r => r.status === 'fulfilled');
      const failed = results.filter(r => r.status === 'rejected');
      
      if (failed.length === 0) {
        notify.success({ title: success(successful) });
      } else if (successful.length === 0) {
        notify.error({ title: error, description: `${failed.length} operaciones fallaron` });
      } else {
        notify.warning({ 
          title: 'Operaciones parcialmente completadas',
          description: `${successful.length} exitosas, ${failed.length} fallidas`
        });
      }
      
      return results;
    } catch (err) {
      notify.remove(loadingId);
      notify.error({ title: error, description: err.message });
      throw err;
    }
  }
};