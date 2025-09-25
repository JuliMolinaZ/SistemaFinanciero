import axios from 'axios';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';

// Configurar la base URL para que coincida con el interceptor global
const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8765";

// Función para limpiar completamente la autenticación
export const forceLogout = async () => {
  try {
    // Cerrar sesión en Firebase
    await signOut(auth);

    // Limpiar localStorage
    localStorage.clear();

    // Limpiar sessionStorage
    sessionStorage.clear();

    // Limpiar cookies relacionadas con Firebase
    document.cookie.split(";").forEach((c) => {
      document.cookie = c
        .replace(/^ +/, "")
        .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
    });

    // Recargar la página para limpiar completamente el estado
    window.location.reload();

  } catch (error) {
    console.error('❌ Error en logout forzado:', error);
    // Aún así, recargar la página
    window.location.reload();
  }
};

// Función helper para hacer llamadas autenticadas
export const makeAuthenticatedRequest = async (config) => {
  try {
    // Si hay un usuario autenticado, obtener su token
    if (auth.currentUser) {
      const token = await auth.currentUser.getIdToken(true); // Force refresh

      // Agregar el token a los headers
      config.headers = {
        ...config.headers,
        'x-firebase-token': token
      };
    }

    // Asegurar que la URL sea absoluta si no lo es
    if (config.url && !config.url.startsWith('http')) {
      config.url = `${API_BASE_URL}${config.url}`;
    }

    // Realizar la llamada
    return await axios(config);
  } catch (error) {
    console.error('❌ Error en llamada autenticada:', error);

    // Si es un error 401, podría ser por token incorrecto de proyecto
    if (error.response && error.response.status === 401) {
      console.error('🔥 Error 401 detectado - Posible token de proyecto incorrecto');
      console.error('📝 Respuesta del servidor:', error.response.data);

      // Si el error menciona audiencia incorrecta, forzar logout
      const errorMessage = error.response.data?.message || '';
      if (errorMessage.includes('audience') || errorMessage.includes('aud')) {
        console.error('🚨 Error de audiencia detectado - Forzando logout...');

        // Mostrar alerta al usuario
        alert('❌ Token de autenticación incompatible detectado.\n\n🔄 Se va a cerrar la sesión automáticamente para obtener tokens correctos.\n\n✅ Por favor, inicia sesión nuevamente.');

        // Forzar logout después de un breve delay
        setTimeout(() => {
          forceLogout();
        }, 2000);
      }
    }

    throw error;
  }
};

// Función para obtener datos con autenticación
export const authGet = async (url, config = {}) => {
  return makeAuthenticatedRequest({
    method: 'GET',
    url,
    ...config
  });
};

// Función para enviar datos con autenticación
export const authPost = async (url, data, config = {}) => {
  return makeAuthenticatedRequest({
    method: 'POST',
    url,
    data,
    ...config
  });
};

// Función para actualizar datos con autenticación
export const authPut = async (url, data, config = {}) => {
  return makeAuthenticatedRequest({
    method: 'PUT',
    url,
    data,
    ...config
  });
};

// Función para eliminar datos con autenticación
export const authDelete = async (url, config = {}) => {
  return makeAuthenticatedRequest({
    method: 'DELETE',
    url,
    ...config
  });
};