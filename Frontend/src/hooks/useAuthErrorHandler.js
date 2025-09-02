import { useState, useCallback } from 'react';
import { auth } from '../firebase';

export const useAuthErrorHandler = () => {
  const [authError, setAuthError] = useState(null);
  const [showAuthError, setShowAuthError] = useState(false);

  const determineErrorType = (error) => {
    // Error 401 - No autorizado
    if (error.response && error.response.status === 401) {
      const errorMessage = error.response.data?.message?.toLowerCase() || '';
      
      if (errorMessage.includes('token') && errorMessage.includes('expirado')) {
        return 'token-expired';
      }
      
      if (errorMessage.includes('token') && errorMessage.includes('inválido')) {
        return 'invalid-token';
      }
      
      if (errorMessage.includes('requerido')) {
        return 'no-token';
      }
      
      // Si la respuesta del backend incluye información específica
      if (error.response.data?.errors) {
        const firstError = error.response.data.errors[0];
        if (firstError?.field === 'firebase_token') {
          return 'invalid-token';
        }
        if (firstError?.field === 'authorization') {
          return 'no-token';
        }
      }
      
      return 'invalid-token';
    }
    
    // Error 404 - Usuario no encontrado
    if (error.response && error.response.status === 404) {
      const errorMessage = error.response.data?.message?.toLowerCase() || '';
      if (errorMessage.includes('usuario')) {
        return 'user-not-found';
      }
    }
    
    // Error 500 o errores de conexión
    if (error.response && error.response.status >= 500) {
      return 'server-error';
    }
    
    // Errores de red
    if (error.code === 'NETWORK_ERROR' || error.message?.includes('Network Error')) {
      return 'server-error';
    }
    
    // Timeouts
    if (error.name === 'AbortError' || error.code === 'ECONNABORTED') {
      return 'server-error';
    }
    
    return 'generic';
  };

  const handleAuthError = useCallback((error, customMessage = null) => {
    console.error('🔥 Error de autenticación detectado:', {
      error,
      message: error.message,
      status: error.response?.status,
      data: error.response?.data
    });

    const errorType = determineErrorType(error);
    
    setAuthError({
      type: errorType,
      originalError: error,
      customMessage,
      timestamp: new Date().toISOString()
    });
    
    setShowAuthError(true);
  }, []);

  const clearAuthError = useCallback(() => {
    setAuthError(null);
    setShowAuthError(false);
  }, []);

  const retryAction = useCallback(() => {
    clearAuthError();
    // Recargar la página para limpiar el estado
    window.location.reload();
  }, [clearAuthError]);

  const redirectToLogin = useCallback(async () => {
    try {
      // Cerrar sesión de Firebase si existe
      if (auth.currentUser) {
        await auth.signOut();
      }
      
      // Limpiar localStorage
      localStorage.removeItem('profileData');
      localStorage.removeItem('profileComplete');
      
      // Redirigir al login
      window.location.href = '/login';
    } catch (logoutError) {
      console.error('Error cerrando sesión:', logoutError);
      // Forzar redirección de todos modos
      window.location.href = '/login';
    }
  }, []);

  const getUserFriendlyMessage = (errorType) => {
    switch (errorType) {
      case 'user-not-found':
        return {
          title: 'Usuario No Encontrado',
          message: 'Tu cuenta no está registrada en el sistema. Contacta al administrador para obtener acceso.'
        };
      
      case 'token-expired':
        return {
          title: 'Sesión Expirada',
          message: 'Tu sesión ha expirado por seguridad. Inicia sesión nuevamente para continuar.'
        };
      
      case 'invalid-token':
        return {
          title: 'Credenciales Inválidas',
          message: 'Tus credenciales no son válidas. Inicia sesión nuevamente.'
        };
      
      case 'no-token':
        return {
          title: 'Acceso Restringido',
          message: 'Necesitas iniciar sesión para acceder a esta funcionalidad.'
        };
      
      case 'server-error':
        return {
          title: 'Error del Servidor',
          message: 'Hay un problema temporal. Intenta nuevamente en unos momentos.'
        };
      
      default:
        return {
          title: 'Error de Autenticación',
          message: 'Hubo un problema al verificar tu sesión. Intenta iniciar sesión nuevamente.'
        };
    }
  };

  return {
    authError,
    showAuthError,
    handleAuthError,
    clearAuthError,
    retryAction,
    redirectToLogin,
    getUserFriendlyMessage
  };
};