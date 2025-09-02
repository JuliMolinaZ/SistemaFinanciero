import axios from 'axios';
import { auth } from '../firebase';

// Función helper para hacer llamadas autenticadas
export const makeAuthenticatedRequest = async (config) => {
  try {
    // Si hay un usuario autenticado, obtener su token
    if (auth.currentUser) {
      const token = await auth.currentUser.getIdToken();
      
      // Agregar el token a los headers
      config.headers = {
        ...config.headers,
        'x-firebase-token': token
      };
      
      console.log('🔐 Token agregado a la llamada:', config.url);
    }
    
    // Realizar la llamada
    return await axios(config);
  } catch (error) {
    console.error('❌ Error en llamada autenticada:', error);
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