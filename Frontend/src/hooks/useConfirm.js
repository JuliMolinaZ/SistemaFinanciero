// 🎭 HOOK DE CONFIRMACIÓN - REEMPLAZO DE WINDOW.CONFIRM
// =====================================================

import { useState, useCallback } from 'react';

// 🎯 CONFIGURACIÓN POR DEFECTO
const DEFAULT_CONFIG = {
  title: 'Confirmar acción',
  message: '¿Estás seguro de que deseas continuar?',
  confirmText: 'Confirmar',
  cancelText: 'Cancelar',
  type: 'danger',
  destructive: false
};

// 🎭 HOOK PRINCIPAL
export function useConfirm() {
  const [confirmState, setConfirmState] = useState({
    open: false,
    config: DEFAULT_CONFIG,
    resolve: null
  });

  // 🎯 Función para mostrar confirmación
  const confirm = useCallback((config = {}) => {
    return new Promise((resolve) => {
      setConfirmState({
        open: true,
        config: { ...DEFAULT_CONFIG, ...config },
        resolve
      });
    });
  }, []);

  // 🎯 Función para confirmar
  const handleConfirm = useCallback(() => {
    if (confirmState.resolve) {
      confirmState.resolve(true);
    }
    setConfirmState(prev => ({ ...prev, open: false, resolve: null }));
  }, [confirmState.resolve]);

  // 🎯 Función para cancelar
  const handleCancel = useCallback(() => {
    if (confirmState.resolve) {
      confirmState.resolve(false);
    }
    setConfirmState(prev => ({ ...prev, open: false, resolve: null }));
  }, [confirmState.resolve]);

  // 🎯 Funciones de conveniencia por tipo
  const confirmDelete = useCallback((message, title = 'Eliminar elemento') => {
    return confirm({
      title,
      message,
      type: 'danger',
      confirmText: 'Eliminar',
      destructive: true
    });
  }, [confirm]);

  const confirmWarning = useCallback((message, title = 'Advertencia') => {
    return confirm({
      title,
      message,
      type: 'warning',
      confirmText: 'Continuar'
    });
  }, [confirm]);

  const confirmInfo = useCallback((message, title = 'Información') => {
    return confirm({
      title,
      message,
      type: 'info',
      confirmText: 'Entendido'
    });
  }, [confirm]);

  const confirmSuccess = useCallback((message, title = 'Confirmar') => {
    return confirm({
      title,
      message,
      type: 'success',
      confirmText: 'Confirmar'
    });
  }, [confirm]);

  return {
    confirm,
    confirmDelete,
    confirmWarning,
    confirmInfo,
    confirmSuccess,
    confirmState,
    handleConfirm,
    handleCancel
  };
}

// 🎯 HOOK SIMPLIFICADO PARA USO RÁPIDO
export function useConfirmDialog() {
  const confirmHook = useConfirm();
  
  return {
    ...confirmHook,
    // Función de conveniencia que retorna el componente
    ConfirmDialog: () => {
      const { confirmState, handleConfirm, handleCancel } = confirmHook;
      
      if (!confirmState.open) return null;
      
      // Importar dinámicamente para evitar problemas de dependencias
      const ConfirmDialog = require('../components/ui/ConfirmDialog').default;
      
      return (
        <ConfirmDialog
          open={confirmState.open}
          onClose={handleCancel}
          onConfirm={handleConfirm}
          {...confirmState.config}
        />
      );
    }
  };
}

export default useConfirm;
