// 🔔 HOOK UNIFICADO DE NOTIFICACIONES Y CONFIRMACIONES
// ====================================================

import { useNotify } from './useNotify';
import { useConfirm } from './useConfirm';

// 🎯 HOOK PRINCIPAL QUE COMBINA NOTIFICACIONES Y CONFIRMACIONES
export function useNotifications() {
  const notify = useNotify();
  const confirm = useConfirm();

  return {
    // Notificaciones
    notify,
    
    // Confirmaciones
    confirm,
    
    // Funciones de conveniencia combinadas
    async confirmAndNotify(action, options = {}) {
      const {
        confirmTitle = 'Confirmar acción',
        confirmMessage = '¿Estás seguro de que deseas continuar?',
        confirmType = 'danger',
        successTitle = 'Operación exitosa',
        successMessage = 'La operación se completó correctamente',
        errorTitle = 'Error',
        errorMessage = 'Ocurrió un error durante la operación',
        loadingTitle = 'Procesando...',
        loadingMessage = 'Por favor espera...'
      } = options;

      try {
        // Mostrar confirmación
        const confirmed = await confirm.confirm({
          title: confirmTitle,
          message: confirmMessage,
          type: confirmType
        });

        if (!confirmed) {
          return false;
        }

        // Mostrar loading
        const loadingId = notify.loading({
          title: loadingTitle,
          description: loadingMessage
        });

        try {
          // Ejecutar acción
          const result = await action();
          
          // Remover loading
          notify.remove(loadingId);
          
          // Mostrar éxito
          notify.success({
            title: successTitle,
            description: successMessage
          });

          return result;
        } catch (error) {
          // Remover loading
          notify.remove(loadingId);
          
          // Mostrar error
          notify.error({
            title: errorTitle,
            description: error.message || errorMessage
          });
          
          throw error;
        }
      } catch (error) {
        console.error('Error en confirmAndNotify:', error);
        throw error;
      }
    },

    // Función para operaciones de eliminación
    async confirmDelete(action, options = {}) {
      return this.confirmAndNotify(action, {
        confirmTitle: options.confirmTitle || 'Eliminar elemento',
        confirmMessage: options.confirmMessage || '¿Estás seguro de que deseas eliminar este elemento? Esta acción no se puede deshacer.',
        confirmType: 'danger',
        successTitle: options.successTitle || 'Elemento eliminado',
        successMessage: options.successMessage || 'El elemento se eliminó correctamente',
        errorTitle: options.errorTitle || 'Error al eliminar',
        errorMessage: options.errorMessage || 'No se pudo eliminar el elemento',
        loadingTitle: options.loadingTitle || 'Eliminando...',
        loadingMessage: options.loadingMessage || 'Por favor espera...',
        ...options
      });
    },

    // Función para operaciones de actualización
    async confirmUpdate(action, options = {}) {
      return this.confirmAndNotify(action, {
        confirmTitle: options.confirmTitle || 'Actualizar elemento',
        confirmMessage: options.confirmMessage || '¿Estás seguro de que deseas actualizar este elemento?',
        confirmType: 'warning',
        successTitle: options.successTitle || 'Elemento actualizado',
        successMessage: options.successMessage || 'El elemento se actualizó correctamente',
        errorTitle: options.errorTitle || 'Error al actualizar',
        errorMessage: options.errorMessage || 'No se pudo actualizar el elemento',
        loadingTitle: options.loadingTitle || 'Actualizando...',
        loadingMessage: options.loadingMessage || 'Por favor espera...',
        ...options
      });
    },

    // Función para operaciones de creación
    async confirmCreate(action, options = {}) {
      return this.confirmAndNotify(action, {
        confirmTitle: options.confirmTitle || 'Crear elemento',
        confirmMessage: options.confirmMessage || '¿Estás seguro de que deseas crear este elemento?',
        confirmType: 'info',
        successTitle: options.successTitle || 'Elemento creado',
        successMessage: options.successMessage || 'El elemento se creó correctamente',
        errorTitle: options.errorTitle || 'Error al crear',
        errorMessage: options.errorMessage || 'No se pudo crear el elemento',
        loadingTitle: options.loadingTitle || 'Creando...',
        loadingMessage: options.loadingMessage || 'Por favor espera...',
        ...options
      });
    }
  };
}

export default useNotifications;
