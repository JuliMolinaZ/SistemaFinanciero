// 🚨 SISTEMA DE NORMALIZACIÓN DE ERRORES
// =====================================

import { messages } from './messages.js';

/**
 * Normaliza cualquier tipo de error a un formato consistente
 * @param {any} error - Error a normalizar
 * @returns {Object} Error normalizado con { code, human, details }
 */
export function normalizeError(error) {
  // Error de Zod (validación)
  if (error?.name === 'ZodError') {
    return {
      code: 'VAL_422',
      human: messages.errors.validation,
      details: error.issues?.map(issue => ({
        field: issue.path?.join('.'),
        message: issue.message,
        code: issue.code
      })) || []
    };
  }

  // Response object (fetch)
  if (error instanceof Response) {
    const status = error.status;
    const statusMap = {
      400: { code: 'HTTP_400', human: messages.errors.validation },
      401: { code: 'HTTP_401', human: messages.errors.unauthorized },
      403: { code: 'HTTP_403', human: messages.errors.forbidden },
      404: { code: 'HTTP_404', human: messages.errors.notFound },
      409: { code: 'HTTP_409', human: messages.errors.conflict },
      422: { code: 'HTTP_422', human: messages.errors.validation },
      500: { code: 'HTTP_500', human: messages.errors.serverError },
      502: { code: 'HTTP_502', human: messages.errors.network },
      503: { code: 'HTTP_503', human: messages.errors.serverError },
      504: { code: 'HTTP_504', human: messages.errors.timeout }
    };

    const mapped = statusMap[status];
    if (mapped) {
      return {
        ...mapped,
        details: {
          status,
          statusText: error.statusText,
          url: error.url
        }
      };
    }

    return {
      code: `HTTP_${status}`,
      human: `Error ${status}: ${error.statusText || 'Error del servidor'}`,
      details: { status, statusText: error.statusText, url: error.url }
    };
  }

  // Error estructurado de API
  if (error?.response && typeof error.response === 'object') {
    const { status, data } = error.response;

    if (data?.message) {
      return {
        code: `API_${status || 'ERROR'}`,
        human: data.message,
        details: data.details || data.errors || data
      };
    }
  }

  // Error de red (fetch failed)
  if (error?.name === 'TypeError' && error.message?.includes('fetch')) {
    return {
      code: 'NETWORK_ERROR',
      human: messages.errors.network,
      details: { originalMessage: error.message }
    };
  }

  // Error de timeout
  if (error?.name === 'AbortError' || error?.code === 'ECONNABORTED') {
    return {
      code: 'TIMEOUT_ERROR',
      human: messages.errors.timeout,
      details: { originalMessage: error.message }
    };
  }

  // Error con estructura personalizada
  if (error?.code && error?.human) {
    return {
      code: error.code,
      human: error.human,
      details: error.details || {}
    };
  }

  // Error con mensaje simple
  if (error?.message) {
    return {
      code: 'UNEXPECTED',
      human: error.message,
      details: {
        name: error.name,
        stack: error.stack
      }
    };
  }

  // String como error
  if (typeof error === 'string') {
    return {
      code: 'STRING_ERROR',
      human: error,
      details: {}
    };
  }

  // Error completamente desconocido
  return {
    code: 'UNKNOWN',
    human: messages.errors.unknownError,
    details: { originalError: error }
  };
}

/**
 * Crea un diagnóstico técnico del error para copiar al portapapeles
 * @param {Object} normalizedError - Error normalizado
 * @returns {string} Diagnóstico técnico
 */
export function createErrorDiagnostic(normalizedError) {
  const timestamp = new Date().toISOString();
  const userAgent = navigator.userAgent;
  const url = window.location.href;

  const diagnostic = {
    timestamp,
    url,
    userAgent,
    error: {
      code: normalizedError.code,
      message: normalizedError.human,
      details: normalizedError.details
    }
  };

  return `=== DIAGNÓSTICO DE ERROR ===
Timestamp: ${timestamp}
URL: ${url}
User Agent: ${userAgent}

Código: ${normalizedError.code}
Mensaje: ${normalizedError.human}

Detalles:
${JSON.stringify(normalizedError.details, null, 2)}

=== FIN DIAGNÓSTICO ===`;
}

/**
 * Determina si un error debe ser persistente (no auto-dismiss)
 * @param {Object} normalizedError - Error normalizado
 * @returns {boolean} True si debe ser persistente
 */
export function isErrorPersistent(normalizedError) {
  const persistentCodes = [
    'HTTP_500',
    'HTTP_502',
    'HTTP_503',
    'NETWORK_ERROR',
    'TIMEOUT_ERROR',
    'UNKNOWN'
  ];

  return persistentCodes.includes(normalizedError.code);
}

/**
 * Obtiene la duración apropiada para un toast basado en el tipo
 * @param {string} variant - Variante del toast (success, warning, destructive, default)
 * @param {Object} normalizedError - Error normalizado (para destructive)
 * @returns {number} Duración en milisegundos
 */
export function getToastDuration(variant, normalizedError = null) {
  switch (variant) {
    case 'success':
    case 'default':
      return 3500; // 3.5 segundos

    case 'warning':
      return 5000; // 5 segundos

    case 'destructive':
      // Errores persistentes no se auto-cierran
      return normalizedError && isErrorPersistent(normalizedError) ? 999999 : 7000;

    default:
      return 3500;
  }
}

export default {
  normalizeError,
  createErrorDiagnostic,
  isErrorPersistent,
  getToastDuration
};