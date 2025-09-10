// src/context/GlobalState.js
import React, { createContext, useState, useEffect } from 'react';
import { auth } from '../firebase';
import axios from 'axios';
import AuthErrorModal from '../components/AuthErrorModal';
import { authGet } from '../utils/authAxios';

// Configuración global de Axios
const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8765";
axios.defaults.baseURL = API_BASE_URL;

console.log('🌐 Configuración de Axios:');
console.log('🌐 API_BASE_URL:', API_BASE_URL);
console.log('🌐 axios.defaults.baseURL:', axios.defaults.baseURL);
console.log('🌐 process.env.REACT_APP_API_URL:', process.env.REACT_APP_API_URL);
console.log('🌐 process.env.NODE_ENV:', process.env.NODE_ENV);
console.log('🌐 Todas las variables REACT_APP:', Object.keys(process.env).filter(key => key.startsWith('REACT_APP')));
console.log('🌐 window.location:', window.location.href);
console.log('🌐 window.location.port:', window.location.port);
console.log('🌐 ===========================================');
console.log('🌐 DIAGNÓSTICO DE CONFIGURACIÓN:');
console.log('🌐 ===========================================');

// INTERCEPTOR GLOBAL para detectar y redirigir usuarios invitados
console.log('🔒 INTERCEPTOR GLOBAL INICIADO');
console.log('🔒 ===========================================');
console.log('🔒 SISTEMA DE BLOQUEO ACTIVADO');
console.log('🔒 ===========================================');

// Variables globales para almacenar los handlers de errores
let globalAuthErrorHandler = null;
let globalBackendErrorHandler = null;

// Interceptor de Request - Agregar token automáticamente
axios.interceptors.request.use(
  async (config) => {
    console.log('🔒 INTERCEPTOR: Interceptando llamada a:', config.url);
    console.log('🔒 INTERCEPTOR: URL completa:', `${config.baseURL}${config.url}`);
    console.log('🔒 INTERCEPTOR: Método:', config.method);
    console.log('🔒 INTERCEPTOR: URL actual:', window.location.pathname);
    
    // Solo bloquear si la URL actual contiene complete-profile Y la llamada es específicamente para crear usuarios
    if (window.location.pathname.includes('/complete-profile/') && 
        config.url === '/api/usuarios' && 
        config.method === 'POST') {
      console.log('🎯 INTERCEPTOR: USUARIO INVITADO DETECTADO!');
      console.log('🎯 INTERCEPTOR: ===========================================');
      console.log('🚫 INTERCEPTOR: BLOQUEANDO LLAMADA A /api/usuarios (POST)');
      console.log('🚫 INTERCEPTOR: URL bloqueada:', config.url);
      console.log('🚫 INTERCEPTOR: Método:', config.method);
      console.log('🚫 INTERCEPTOR: Redirigiendo a:', window.location.pathname);
      
      // Redirigir automáticamente a la ruta de invitación
      setTimeout(() => {
        window.location.href = window.location.pathname;
      }, 100);
      
      return Promise.reject(new Error('Usuario invitado - Redirigiendo automáticamente'));
    }
    
    // Agregar token de Firebase automáticamente a TODAS las llamadas
    try {
      if (auth.currentUser && !config.headers['x-firebase-token']) {
        console.log('🔐 INTERCEPTOR: Agregando token de Firebase a la llamada...');
        const token = await auth.currentUser.getIdToken();
        config.headers['x-firebase-token'] = token;
        console.log('✅ INTERCEPTOR: Token agregado exitosamente');
      } else if (!auth.currentUser) {
        console.log('⚠️ INTERCEPTOR: No hay usuario autenticado - continuando sin token');
      }
    } catch (tokenError) {
      console.warn('⚠️ INTERCEPTOR: Error obteniendo token de Firebase:', tokenError);
      // Continuar sin token - el backend decidirá si es requerido
    }
    
    // Permitir todas las demás llamadas
    console.log('✅ INTERCEPTOR: Llamada permitida - URL:', config.url, 'Método:', config.method);
    return config;
  },
  (error) => {
    console.error('❌ INTERCEPTOR: Error en interceptor de request:', error);
    return Promise.reject(error);
  }
);

// Interceptor de Response - Manejo global de errores de autenticación
axios.interceptors.response.use(
  (response) => {
    // Si la respuesta es exitosa, simplemente la devolvemos
    console.log('✅ INTERCEPTOR RESPONSE: Respuesta exitosa:', response.status, response.config?.url);
    return response;
  },
  (error) => {
    console.error('🔥 INTERCEPTOR RESPONSE: Error detectado:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      message: error.message,
      url: error.config?.url,
      method: error.config?.method,
      data: error.response?.data
    });

    // Si es un error de conexión, manejarlo con el sistema de errores de backend
    if (!error.response || error.code === 'NETWORK_ERROR' || error.message?.includes('Network Error')) {
      console.log('🔌 ERROR DE CONEXIÓN DETECTADO - Activando manejo de errores de backend');
      console.log('🔌 URL que falló:', error.config?.url);
      console.log('🔌 Tipo de error:', error.code || error.message);
      
      if (globalBackendErrorHandler) {
        globalBackendErrorHandler(error);
        
        return Promise.resolve({
          data: { error: 'Handled by backend error system' },
          status: 500,
          config: error.config
        });
      }
    }
    
    // Si es un error 401 (No autorizado), manejarlo con el sistema de errores amigables
    if (error.response && error.response.status === 401) {
      console.log('🔥 ERROR 401 DETECTADO - Activando manejo amigable de errores');
      console.log('🔥 URL que falló:', error.config?.url);
      console.log('🔥 Método:', error.config?.method);
      console.log('🔥 Respuesta del servidor:', error.response?.data);
      
      // Evitar loops infinitos si el error viene de una llamada de auth
      const isAuthCall = error.config?.url?.includes('/api/usuarios/firebase/') || 
                        error.config?.url?.includes('/api/auth/');
      
      if (!isAuthCall && globalAuthErrorHandler) {
        console.log('🔥 Usando handler global para mostrar modal');
        globalAuthErrorHandler(error, `Error de autenticación en ${error.config?.url}`);
        
        // NO re-lanzar el error para evitar que aparezca en consola
        return Promise.resolve({
          data: { error: 'Handled by auth error system' },
          status: 401,
          config: error.config
        });
      } else if (!globalAuthErrorHandler) {
        // Fallback: mostrar alert simple si no tenemos el handler
        console.log('🔥 No hay handler global - usando fallback');
        alert('Tu sesión ha expirado o no tienes permisos para realizar esta acción. Por favor, inicia sesión nuevamente.');
        window.location.href = '/login';
      }
    }

    // Para otros errores, simplemente los re-lanzamos
    return Promise.reject(error);
  }
);

export const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {
  console.log('🌐 GLOBAL STATE PROVIDER INICIADO');
  console.log('🌐 ===========================================');
  console.log('🌐 SISTEMA DE DETECCIÓN AUTOMÁTICA ACTIVADO');
  console.log('🌐 ===========================================');
  
  const [clientes, setClientes] = useState([]);
  const [proyectos, setProyectos] = useState([]);
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [profileComplete, setProfileComplete] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [sidebarFullyMinimized, setSidebarFullyMinimized] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  
  // Estados para manejo de errores de autenticación
  const [authError, setAuthError] = useState(null);
  const [showAuthError, setShowAuthError] = useState(false);
  
  // Estados para manejo de errores de conexión con el backend
  const [backendError, setBackendError] = useState(null);
  const [backendConnected, setBackendConnected] = useState(true);
  
  // Función para determinar el tipo de error
  const determineErrorType = (error) => {
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
      
      return 'invalid-token';
    }
    
    if (error.response && error.response.status === 404) {
      const errorMessage = error.response.data?.message?.toLowerCase() || '';
      if (errorMessage.includes('usuario')) {
        return 'user-not-found';
      }
    }
    
    if (error.response && error.response.status >= 500) {
      return 'server-error';
    }
    
    if (error.code === 'NETWORK_ERROR' || error.message?.includes('Network Error')) {
      return 'server-error';
    }
    
    return 'generic';
  };
  
  // Función para manejar errores de autenticación
  const handleAuthError = (error, customMessage = null) => {
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
  };
  
  // Función para limpiar errores de autenticación
  const clearAuthError = () => {
    setAuthError(null);
    setShowAuthError(false);
  };
  
  // Función para reintentar
  const retryAction = () => {
    clearAuthError();
    window.location.reload();
  };
  
  // Función para redirigir al login
  const redirectToLogin = async () => {
    try {
      if (auth.currentUser) {
        await auth.signOut();
      }
      
      localStorage.removeItem('profileData');
      localStorage.removeItem('profileComplete');
      
      window.location.href = '/login';
    } catch (logoutError) {
      console.error('Error cerrando sesión:', logoutError);
      window.location.href = '/login';
    }
  };
  
  // Función para manejar errores de conexión con el backend
  const handleBackendError = (error) => {
    console.error('🔌 Error de conexión con el backend:', error);
    
    // Verificar si es un error de conexión
    if (error.code === 'NETWORK_ERROR' || 
        error.message?.includes('Network Error') ||
        error.message?.includes('ERR_CONNECTION_REFUSED') ||
        error.message?.includes('fetch') ||
        !error.response) {
      
      console.log('🔌 Detectado error de conexión - Backend desconectado');
      setBackendConnected(false);
      setBackendError({
        type: 'connection',
        message: 'No se puede conectar al servidor',
        timestamp: new Date().toISOString()
      });
    } else if (error.response && error.response.status >= 500) {
      console.log('🔌 Detectado error del servidor - Backend con problemas');
      setBackendConnected(false);
      setBackendError({
        type: 'server',
        message: 'El servidor está experimentando problemas',
        timestamp: new Date().toISOString()
      });
    }
  };
  
  // Función para limpiar errores de backend
  const clearBackendError = () => {
    setBackendError(null);
    setBackendConnected(true);
  };
  
  // Función para verificar conexión con el backend
  const checkBackendConnection = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/health`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 5000
      });
      
      if (response.ok) {
        console.log('✅ Backend conectado correctamente');
        setBackendConnected(true);
        setBackendError(null);
        return true;
      } else {
        throw new Error(`Backend respondió con status: ${response.status}`);
      }
    } catch (error) {
      console.error('❌ Error verificando conexión al backend:', error);
      handleBackendError(error);
      return false;
    }
  };
  
  // Configurar los handlers globales para los interceptors
  useEffect(() => {
    globalAuthErrorHandler = handleAuthError;
    globalBackendErrorHandler = handleBackendError;
    
    // Limpiar al desmontar
    return () => {
      globalAuthErrorHandler = null;
      globalBackendErrorHandler = null;
    };
  }, []);
  
  // ELIMINADO: Sistema viejo de permisos
  // const [permisos, setPermisos] = useState([]);

  // ELIMINADO: Carga del sistema viejo de permisos
  // useEffect(() => {
  //   const fetchPermisos = async () => {
  //     try {
  //       const response = await axios.get('/api/permisos');
  //       console.log("Permisos obtenidos en GlobalState:", response.data);
  //       
  //       if (response.data && response.data.success && Array.isArray(response.data.data)) {
  //         setPermisos(response.data.data);
  //       } else if (Array.isArray(response.data)) {
  //         setPermisos(response.data);
  //       } else {
  //         console.warn("Estructura de permisos inesperada:", response.data);
  //         setPermisos([]);
  //       }
  //     } catch (error) {
  //       console.error("Error fetching permisos in GlobalState:", error);
  //         setPermisos([]);
  //       }
  //     };
  //     fetchPermisos();
  //   }, []);

  // DETECCIÓN AUTOMÁTICA de usuarios invitados - se ejecuta en cada cambio de URL
  useEffect(() => {
    const checkIfInvitedUser = () => {
      if (window.location.pathname.includes('/complete-profile/')) {
        console.log('🎯 DETECCIÓN AUTOMÁTICA: Usuario invitado detectado');
        console.log('🎯 URL actual:', window.location.pathname);
        console.log('🎯 Limpiando estados de Firebase');
        
        // Limpiar todos los estados relacionados con Firebase
        setCurrentUser(null);
        setProfileData(null);
        setProfileComplete(false);
        
        // Forzar logout de Firebase si está autenticado
        if (auth.currentUser) {
          auth.signOut().then(() => {
            console.log('🎯 Firebase logout exitoso para usuario invitado');
          }).catch((error) => {
            console.log('🎯 Error en Firebase logout:', error);
          });
        }
      }
    };

    // Verificar inmediatamente
    checkIfInvitedUser();

    // Escuchar cambios en la URL
    const handleUrlChange = () => {
      checkIfInvitedUser();
    };

    // Agregar listener para cambios de URL
    window.addEventListener('popstate', handleUrlChange);
    window.addEventListener('pushstate', handleUrlChange);
    window.addEventListener('replacestate', handleUrlChange);

    return () => {
      window.removeEventListener('popstate', handleUrlChange);
      window.removeEventListener('pushstate', handleUrlChange);
      window.removeEventListener('replacestate', handleUrlChange);
    };
  }, []);

  // Manejo de autenticación y perfil
  useEffect(() => {
    console.log('🔐 AUTH STATE CHANGED - Iniciando listener');
    console.log('🔐 authLoading actual:', authLoading);
    console.log('🔐 Configuración actual:', {
      API_BASE_URL,
      'axios.defaults.baseURL': axios.defaults.baseURL,
      'window.location': window.location.href,
      'NODE_ENV': process.env.NODE_ENV
    });
    
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      console.log('🔐 Firebase Auth State Changed:', user ? user.email : 'No hay usuario');
      
      // DETECCIÓN AUTOMÁTICA: Si es un usuario invitado, redirigir automáticamente
      if (window.location.pathname.includes('/complete-profile/')) {
        console.log("🎯 USUARIO INVITADO DETECTADO - Redirigiendo automáticamente");
        console.log("🎯 URL actual:", window.location.pathname);
        console.log("🎯 No se procesará autenticación de Firebase");
        setCurrentUser(null);
        setProfileData(null);
        setProfileComplete(false);
        setAuthLoading(false);
        return;
      }
      
      console.log('🔐 Usuario Firebase detectado:', user ? user.email : 'No hay usuario');
      setCurrentUser(user);
      
      if (user) {
        try {
          console.log('🔐 Intentando cargar perfil para usuario:', user.email);
          console.log('🔐 Firebase UID:', user.uid);
          console.log('🔐 API_BASE_URL configurado:', API_BASE_URL);
          console.log('🔐 URL que se va a llamar:', `${API_BASE_URL}/api/usuarios/firebase/${user.uid}`);
          
          // Agregar timeout para la llamada a la API
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 segundos de timeout
          
          let response;
          try {
            // Usar la función autenticada
            console.log('🔐 Intentando llamada autenticada...');
            response = await authGet(`/api/usuarios/firebase/${user.uid}`, {
              signal: controller.signal
            });
            console.log('✅ Llamada autenticada exitosa');
          } catch (authError) {
            console.log('⚠️ Llamada autenticada falló, usando handleAuthError:', authError.message);
            
            // Usar el manejador de errores de autenticación
            if (authError.response && authError.response.status === 401) {
              handleAuthError(authError, 'Error al cargar perfil de usuario');
              return;
            }
            
            // Para otros errores, re-lanzar
            throw authError;
          }
          
          clearTimeout(timeoutId);
          console.log("✅ Conexión exitosa al backend. Datos del usuario:", response.data);
          console.log("✅ Status de la respuesta:", response.status);
          console.log("✅ Headers de la respuesta:", response.headers);
          
          // Verificar la estructura de la respuesta
          let userData;
          if (response.data && response.data.success && response.data.data) {
            userData = response.data.data;
            console.log('✅ Datos del usuario extraídos correctamente:', userData);
          } else if (response.data) {
            userData = response.data;
            console.log('✅ Datos del usuario (formato alternativo):', userData);
          } else {
            throw new Error('Estructura de respuesta inesperada');
          }
          
          setProfileData(userData);
          setProfileComplete(true);
          console.log('✅ Perfil del usuario cargado exitosamente');
          
        } catch (err) {
          console.error("❌ Error al cargar perfil:", err);
          console.error("❌ Detalles del error:", {
            status: err.response?.status,
            statusText: err.response?.statusText,
            data: err.response?.data,
            message: err.message,
            isAbort: err.name === 'AbortError',
            name: err.name,
            stack: err.stack
          });
          
          // Si es un timeout, mostrar mensaje específico
          if (err.name === 'AbortError') {
            console.error('⏰ Timeout en la carga del perfil');
            alert("La carga del perfil tardó demasiado. Por favor, recarga la página.");
            setProfileData(null);
            setProfileComplete(false);
            setAuthLoading(false);
            return;
          }
          
          // VERIFICACIÓN AGRESIVA: Si es un usuario invitado, NO crear automáticamente
          if (window.location.pathname.includes('/complete-profile/')) {
            console.log("🚫 USUARIO INVITADO DETECTADO - BLOQUEANDO CREACIÓN AUTOMÁTICA");
            console.log("🚫 URL actual:", window.location.pathname);
            console.log("🚫 No se creará perfil automáticamente");
            setProfileData(null);
            setProfileComplete(false);
            setCurrentUser(null); // Forzar logout del usuario Firebase
            setAuthLoading(false);
            return;
          }
          
          if (err.response && err.response.status === 404) {
            console.log('🔐 Usuario no encontrado, intentando crear perfil...');
            try {
              const createResponse = await axios.post('/api/usuarios', {
                firebase_uid: user.uid,
                email: user.email,
                name: user.displayName || "Nombre Desconocido",
                role: "defaultRole",
                avatar: user.photoURL || ""
              });
              console.log("✅ Usuario creado en el backend:", createResponse.data);
              
              // Verificar la estructura de la respuesta
              let userData;
              if (createResponse.data && createResponse.data.success && createResponse.data.data) {
                userData = createResponse.data.data;
              } else if (createResponse.data) {
                userData = createResponse.data;
              } else {
                throw new Error('Estructura de respuesta inesperada');
              }
              
              setProfileData(userData);
              setProfileComplete(true);
              console.log('✅ Perfil del usuario creado exitosamente');
            } catch (createError) {
              console.error("❌ Error al crear el usuario:", createError);
              console.error("❌ Detalles del error de creación:", {
                status: createError.response?.status,
                statusText: createError.response?.statusText,
                data: createError.response?.data,
                message: createError.message
              });
              alert("No se pudo crear tu perfil. Intenta nuevamente más tarde.");
              setProfileData(null);
              setProfileComplete(false);
            }
          } else {
            console.error("❌ Error no manejado al cargar perfil:", err);
            console.error("❌ Intentando hacer debug adicional...");
            
            // Debug adicional: probar con fetch directamente
            try {
              console.log('🔍 DEBUG: Probando con fetch directamente...');
              const debugResponse = await fetch(`${API_BASE_URL}/api/usuarios/firebase/${user.uid}`);
              console.log('🔍 DEBUG: Response status:', debugResponse.status);
              console.log('🔍 DEBUG: Response headers:', debugResponse.headers);
              
              if (debugResponse.ok) {
                const debugData = await debugResponse.json();
                console.log('🔍 DEBUG: Data obtenida con fetch:', debugData);
              } else {
                console.log('🔍 DEBUG: Response no OK:', debugResponse.statusText);
              }
            } catch (debugError) {
              console.error('🔍 DEBUG: Error con fetch:', debugError);
            }
            
            setProfileData(null);
            setProfileComplete(false);
            alert("No se pudo cargar tu perfil. Intenta nuevamente más tarde.");
          }
        }
      } else {
        console.log('🔐 No hay usuario autenticado, limpiando estados');
        setProfileData(null);
        setProfileComplete(false);
        localStorage.removeItem('profileData');
        localStorage.removeItem('profileComplete');
      }
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Cargar datos desde localStorage
  useEffect(() => {
    const storedProfile = localStorage.getItem('profileData');
    const storedProfileComplete = localStorage.getItem('profileComplete');
    if (storedProfile) setProfileData(JSON.parse(storedProfile));
    if (storedProfileComplete) setProfileComplete(JSON.parse(storedProfileComplete));
  }, []);

  // Guardar cambios en localStorage
  useEffect(() => {
    if (profileData) {
      localStorage.setItem('profileData', JSON.stringify(profileData));
    }
    localStorage.setItem('profileComplete', JSON.stringify(profileComplete));
  }, [profileData, profileComplete]);

  return (
    <GlobalContext.Provider
      value={{
        clientes,
        setClientes,
        proyectos,
        setProyectos,
        users,
        setUsers,
        currentUser,
        setCurrentUser,
        profileComplete,
        setProfileComplete,
        profileData,
        setProfileData,
        sidebarCollapsed,
        setSidebarCollapsed,
        sidebarFullyMinimized,
        setSidebarFullyMinimized,
        authLoading,
        backendConnected,
        backendError,
        checkBackendConnection,
        clearBackendError,
        // ELIMINADO: permisos
        // permisos,
        // setPermisos,
      }}
    >
      {children}
      
      {/* Modal para errores de autenticación */}
      <AuthErrorModal
        open={showAuthError}
        onClose={clearAuthError}
        errorType={authError?.type || 'generic'}
        onRetry={retryAction}
        onLogin={redirectToLogin}
      />
    </GlobalContext.Provider>
  );
};
