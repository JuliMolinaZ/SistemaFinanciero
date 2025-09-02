// src/context/GlobalState.js
import React, { createContext, useState, useEffect } from 'react';
import { auth } from '../firebase';
import axios from 'axios';

// Configuración global de Axios
const API_BASE_URL = 'http://localhost:5001';
axios.defaults.baseURL = API_BASE_URL;

console.log('🌐 Configuración de Axios:');
console.log('🌐 API_BASE_URL:', API_BASE_URL);
console.log('🌐 axios.defaults.baseURL:', axios.defaults.baseURL);

// INTERCEPTOR GLOBAL para detectar y redirigir usuarios invitados
console.log('🔒 INTERCEPTOR GLOBAL INICIADO');
console.log('🔒 ===========================================');
console.log('🔒 SISTEMA DE BLOQUEO ACTIVADO');
console.log('🔒 ===========================================');

axios.interceptors.request.use(
  (config) => {
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
    
    // Permitir todas las demás llamadas
    console.log('✅ INTERCEPTOR: Llamada permitida - URL:', config.url, 'Método:', config.method);
    return config;
  },
  (error) => {
    console.error('❌ INTERCEPTOR: Error en interceptor:', error);
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
  const [authLoading, setAuthLoading] = useState(true);
  
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
            // Intentar con Axios primero
            console.log('🔐 Intentando llamada con Axios...');
            response = await axios.get(`/api/usuarios/firebase/${user.uid}`, {
              signal: controller.signal
            });
            console.log('✅ Llamada con Axios exitosa');
          } catch (axiosError) {
            console.log('⚠️ Axios falló, intentando con fetch:', axiosError.message);
            console.log('⚠️ Detalles del error de Axios:', {
              message: axiosError.message,
              name: axiosError.name,
              response: axiosError.response?.data,
              status: axiosError.response?.status
            });
            
            // Fallback a fetch
            console.log('🔐 Intentando llamada con fetch...');
            const fetchResponse = await fetch(`${API_BASE_URL}/api/usuarios/firebase/${user.uid}`, {
              signal: controller.signal
            });
            
            if (!fetchResponse.ok) {
              throw new Error(`HTTP error! status: ${fetchResponse.status}`);
            }
            
            const fetchData = await fetchResponse.json();
            response = { data: fetchData, status: fetchResponse.status, headers: fetchResponse.headers };
            console.log('✅ Llamada con fetch exitosa');
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
        authLoading,
        // ELIMINADO: permisos
        // permisos,
        // setPermisos,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};
