// src/context/GlobalState.js
import React, { createContext, useState, useEffect } from 'react';
import { auth, signOut } from '../firebase';
import axios from 'axios';
import AuthErrorModal from '../components/AuthErrorModal';
import { authGet } from '../utils/authAxios';

// Variables globales para los handlers de errores
let globalAuthErrorHandler = null;
let globalBackendErrorHandler = null;

// Configuración global de Axios
const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8765";
axios.defaults.baseURL = API_BASE_URL;

// Interceptor de Request - Agregar token de Firebase automáticamente
axios.interceptors.request.use(
  async (config) => {
    try {
      if (auth.currentUser && !config.headers['x-firebase-token']) {
        const token = await auth.currentUser.getIdToken();
        config.headers['x-firebase-token'] = token;
      } else if (!auth.currentUser) {
        // Usuario no autenticado - continuar sin token
      }
    } catch (tokenError) {

      // Continuar sin token - el backend decidirá si es requerido
    }
    
    // Permitir todas las demás llamadas
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

      // Evitar loops infinitos si el error viene de una llamada de auth
      const isAuthCall = error.config?.url?.includes('/api/usuarios/firebase/') || 
                        error.config?.url?.includes('/api/auth/') ||
                        error.config?.url?.includes('/api/roles');
      
      // NO mostrar modal de error para llamadas de autenticación básicas
      if (isAuthCall) {

        // Para llamadas de auth, devolver una respuesta controlada en lugar de rechazar
        return Promise.resolve({
          data: { 
            success: false, 
            error: 'Authentication required',
            message: error.response?.data?.message || 'Usuario no autenticado'
          },
          status: 401,
          config: error.config
        });
      }
      
      if (!isAuthCall && globalAuthErrorHandler) {

        globalAuthErrorHandler(error, `Error de autenticación en ${error.config?.url}`);
        
        // NO re-lanzar el error para evitar que aparezca en consola
        return Promise.resolve({
          data: { error: 'Handled by auth error system' },
          status: 401,
          config: error.config
        });
      } else if (!globalAuthErrorHandler) {
        // Fallback: mostrar alert simple si no tenemos el handler

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

  const [clientes, setClientes] = useState([]);
  const [proyectos, setProyectos] = useState([]);
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [profileComplete, setProfileComplete] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [profileManuallyUpdated, setProfileManuallyUpdated] = useState(false);
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

      setBackendConnected(false);
      setBackendError({
        type: 'connection',
        message: 'No se puede conectar al servidor',
        timestamp: new Date().toISOString()
      });
    } else if (error.response && error.response.status >= 500) {

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

  // Función para actualizar el perfil del usuario sin recargar desde Firebase
  const updateUserProfile = (updatedProfileData) => {
    const now = new Date();
    
    setProfileData(prevData => ({
      ...prevData,
      ...updatedProfileData,
      updated_at: now.toISOString(), // Actualizar timestamp
      profile_complete: null // Se calculará abajo
    }));
    
    // Calcular si el perfil está completo
    const isComplete = !!(updatedProfileData.name &&
                         updatedProfileData.phone &&
                         updatedProfileData.phone_country_code &&
                         updatedProfileData.department &&
                         updatedProfileData.position &&
                         updatedProfileData.birth_date);
    
    setProfileComplete(isComplete);
    setProfileManuallyUpdated(true); // Marcar como actualizado manualmente
    
    // Actualizar también el profileData con el estado completo calculado
    setProfileData(prevData => ({
      ...prevData,
      profile_complete: isComplete
    }));
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

  //       
  //       if (response.data && response.data.success && Array.isArray(response.data.data)) {
  //         setPermisos(response.data.data);
  //       } else if (Array.isArray(response.data)) {
  //         setPermisos(response.data);
  //       } else {

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

        // Limpiar todos los estados relacionados con Firebase
        setCurrentUser(null);
        setProfileData(null);
        setProfileComplete(false);
        
        // Forzar logout de Firebase si está autenticado
        if (auth.currentUser) {
          auth.signOut().then(() => {

          }).catch((error) => {

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

    const unsubscribe = auth.onAuthStateChanged(async (user) => {

      // DETECCIÓN AUTOMÁTICA: Si es un usuario invitado, redirigir automáticamente
      if (window.location.pathname.includes('/complete-profile/')) {

        setCurrentUser(null);
        setProfileData(null);
        setProfileComplete(false);
        setAuthLoading(false);
        return;
      }

      setCurrentUser(user);
      
      if (user) {
        try {

          // Agregar timeout para la llamada a la API
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 segundos de timeout
          
          let response;
          try {
            // Usar la función autenticada

            response = await authGet(`/api/usuarios/firebase/${user.uid}`, {
              signal: controller.signal
            });

          } catch (authError) {

            // Usar el manejador de errores de autenticación
            if (authError.response && authError.response.status === 401) {
              handleAuthError(authError, 'Error al cargar perfil de usuario');
              return;
            }
            
            // Para otros errores, re-lanzar
            throw authError;
          }
          
          clearTimeout(timeoutId);

          // Verificar la estructura de la respuesta
          let userData;
          if (response.data && response.data.success && response.data.data) {
            userData = response.data.data;

          } else if (response.data) {
            userData = response.data;

          }
          
          // Solo actualizar si no fue actualizado manualmente
          if (!profileManuallyUpdated) {
            setProfileData(userData);
            setProfileComplete(userData.profile_complete || false);
          } else {
            }

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

            setProfileData(null);
            setProfileComplete(false);
            setCurrentUser(null); // Forzar logout del usuario Firebase
            setAuthLoading(false);
            return;
          }
          
          if (err.response && err.response.status === 404) {

            // Si es un usuario invitado, verificar si existe por email
            if (window.location.pathname.includes('/complete-profile/')) {

              try {
                const verifyResponse = await axios.get(`/api/user-registration/verify-user/${user.email}`);
                if (verifyResponse.data.success) {

                  setProfileData(verifyResponse.data.data);
                  setProfileComplete(verifyResponse.data.data.profile_complete);
                  setAuthLoading(false);
                  return;
                }
              } catch (verifyError) {

              }
            }

            try {
              const createResponse = await axios.post('/api/user-registration/create-from-firebase', {
                firebase_uid: user.uid,
                email: user.email,
                name: user.displayName || "Nombre Desconocido",
                role: "usuario",
                avatar: user.photoURL || ""
              });

              // Verificar la estructura de la respuesta
              let userData;
              if (createResponse.data && createResponse.data.success && createResponse.data.data) {
                userData = createResponse.data.data;
              } else if (createResponse.data) {
                userData = createResponse.data;
              } else {
                throw new Error('Estructura de respuesta inesperada');
              }
              
              // Solo actualizar si no fue actualizado manualmente
              if (!profileManuallyUpdated) {
                setProfileData(userData);
                setProfileComplete(userData.profile_complete || false);
              } else {
                }

            } catch (createError) {
              console.error("❌ Error al crear el usuario:", createError);
              console.error("❌ Detalles del error de creación:", {
                status: createError.response?.status,
                statusText: createError.response?.statusText,
                data: createError.response?.data,
                message: createError.message
              });

              // 🚨 BLOQUEO DE SEGURIDAD: Si el usuario no está invitado (403), logout inmediato
              if (createError.response?.status === 403) {
                console.log("❌ Usuario no invitado - cerrando sesión automáticamente");
                alert("❌ Acceso denegado: No has sido invitado a esta plataforma. Contacta al administrador.");

                // Logout inmediato
                await signOut(auth);
                setCurrentUser(null);
                setProfileData(null);
                setProfileComplete(false);
                setAuthLoading(false);

                // Redireccionar al login
                window.location.href = '/login';
                return;
              }

              alert("No se pudo crear tu perfil. Intenta nuevamente más tarde.");
              setProfileData(null);
              setProfileComplete(false);
            }
          } else {
            console.error("❌ Error no manejado al cargar perfil:", err);
            console.error("❌ Intentando hacer debug adicional...");
            
            // Debug adicional: probar con fetch directamente
            try {

              const debugResponse = await fetch(`${API_BASE_URL}/api/usuarios/firebase/${user.uid}`);

              if (debugResponse.ok) {
                const debugData = await debugResponse.json();

              } else {

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

        setProfileData(null);
        setProfileComplete(false);
        localStorage.removeItem('profileData');
        localStorage.removeItem('profileComplete');
      }
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Resetear flag de actualización manual cuando cambie el usuario
  useEffect(() => {
    if (currentUser) {
      setProfileManuallyUpdated(false);
    }
  }, [currentUser]);

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
        updateUserProfile,
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
