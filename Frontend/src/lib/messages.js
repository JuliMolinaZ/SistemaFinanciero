// 🌐 SISTEMA DE MENSAJES CENTRALIZADOS - ES
// ========================================

export const messages = {
  // Mensajes de éxito
  success: {
    projectCreated: (name) => `Proyecto "${name}" creado exitosamente`,
    projectUpdated: "Cambios guardados correctamente",
    projectDeleted: "Proyecto eliminado",
    phaseCreated: (name) => `Fase "${name}" creada`,
    phaseUpdated: (name) => `Fase "${name}" actualizada`,
    phaseDeleted: "Fase eliminada",
    phaseReordered: "Orden de fases actualizado",
    currentPhaseChanged: (name) => `Fase actual cambiada a "${name}"`,
    reportGenerated: "Reporte generado exitosamente",
    dataExported: "Datos exportados",
    settingsSaved: "Configuración guardada"
  },

  // Mensajes de carga/progreso
  loading: {
    creating: "Creando proyecto...",
    updating: "Guardando cambios...",
    deleting: "Eliminando proyecto...",
    loading: "Cargando...",
    generating: "Generando reporte...",
    exporting: "Exportando datos...",
    saving: "Guardando...",
    processing: "Procesando...",
    uploading: "Subiendo archivo...",
    downloading: "Descargando..."
  },

  // Mensajes de error generales
  errors: {
    generic: "No se pudo completar la acción",
    network: "Error de conexión. Verifica tu conexión a internet",
    timeout: "La operación tardó demasiado tiempo",
    unauthorized: "No tienes permisos para esta acción",
    forbidden: "Acceso denegado",
    notFound: "Recurso no encontrado",
    conflict: "Conflicto con datos existentes",
    validation: "Datos inválidos. Revisa los campos",
    serverError: "Error interno del servidor",
    unknownError: "Error desconocido"
  },

  // Mensajes específicos de proyectos
  projects: {
    errors: {
      createFailed: "No se pudo crear el proyecto",
      updateFailed: "Error al actualizar el proyecto",
      deleteFailed: "No se pudo eliminar el proyecto",
      notFound: "Proyecto no encontrado",
      nameRequired: "El nombre del proyecto es obligatorio",
      nameExists: "Ya existe un proyecto con ese nombre",
      clientRequired: "Debe seleccionar un cliente"
    }
  },

  // Mensajes específicos de fases
  phases: {
    errors: {
      createFailed: "No se pudo crear la fase",
      updateFailed: "Error al actualizar la fase",
      deleteFailed: "No se pudo eliminar la fase",
      reorderFailed: "Error al reordenar las fases",
      nameRequired: "El nombre de la fase es obligatorio",
      nameExists: "Ya existe una fase con ese nombre",
      cannotDeleteCurrent: "No se puede eliminar la fase actual",
      cannotDeleteLast: "Debe existir al menos una fase",
      invalidPosition: "Posición de fase inválida"
    }
  },

  // Confirmaciones
  confirmations: {
    deleteProject: (name) => ({
      title: "¿Eliminar proyecto?",
      description: `Se eliminará permanentemente el proyecto "${name}" y todos sus datos asociados. Esta acción no se puede deshacer.`,
      confirm: "Eliminar proyecto",
      cancel: "Cancelar"
    }),
    deletePhase: (name) => ({
      title: "¿Eliminar fase?",
      description: `Se eliminará la fase "${name}". Esta acción no se puede deshacer.`,
      confirm: "Eliminar fase",
      cancel: "Cancelar"
    }),
    unsavedChanges: {
      title: "¿Descartar cambios?",
      description: "Tienes cambios sin guardar. ¿Estás seguro de que quieres salir?",
      confirm: "Descartar cambios",
      cancel: "Continuar editando"
    }
  },

  // Acciones
  actions: {
    save: "Guardar",
    cancel: "Cancelar",
    delete: "Eliminar",
    edit: "Editar",
    create: "Crear",
    view: "Ver",
    close: "Cerrar",
    retry: "Reintentar",
    viewDetails: "Ver detalles",
    copyDiagnostic: "Copiar diagnóstico",
    download: "Descargar",
    export: "Exportar"
  },

  // Estados
  states: {
    loading: "Cargando...",
    empty: "No hay datos",
    error: "Error",
    success: "Éxito",
    warning: "Advertencia",
    info: "Información"
  }
};

// Función helper para obtener mensajes anidados
export function getMessage(path, ...args) {
  const keys = path.split('.');
  let current = messages;

  for (const key of keys) {
    if (current[key] === undefined) {
      console.warn(`Mensaje no encontrado: ${path}`);
      return path;
    }
    current = current[key];
  }

  if (typeof current === 'function') {
    return current(...args);
  }

  return current;
}

export default messages;