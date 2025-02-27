// src/context/GlobalState.js
import React, { createContext, useState, useEffect } from 'react';
import { auth } from '../firebase';
import axios from 'axios';

// Configuración global de Axios
axios.defaults.baseURL = process.env.REACT_APP_API_URL || 'https://sigma.runsolutions-services.com';

export const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {
  const [clientes, setClientes] = useState([]);
  const [proyectos, setProyectos] = useState([]);
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [profileComplete, setProfileComplete] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  // Estado de permisos
  const [permisos, setPermisos] = useState([]);

  // Cargar permisos al inicio
  useEffect(() => {
    const fetchPermisos = async () => {
      try {
        const response = await axios.get('/api/permisos');
        console.log("Permisos obtenidos en GlobalState:", response.data);
        setPermisos(response.data);
      } catch (error) {
        console.error("Error fetching permisos in GlobalState:", error);
      }
    };
    fetchPermisos();
  }, []);

  // Manejo de autenticación y perfil
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      setCurrentUser(user);
      if (user) {
        try {
          const response = await axios.get(`/api/usuarios/firebase/${user.uid}`);
          console.log("Conexión exitosa al backend. Datos del usuario:", response.data);
          setProfileData(response.data);
          setProfileComplete(true);
        } catch (err) {
          console.error("Error al cargar perfil:", err);
          if (err.response && err.response.status === 404) {
            try {
              const createResponse = await axios.post('/api/usuarios', {
                firebase_uid: user.uid,
                email: user.email,
                name: user.displayName || "Nombre Desconocido",
                role: "defaultRole",
                avatar: user.photoURL || ""
              });
              console.log("Usuario creado en el backend:", createResponse.data);
              setProfileData(createResponse.data);
              setProfileComplete(true);
            } catch (createError) {
              console.error("Error al crear el usuario:", createError);
              alert("No se pudo crear tu perfil. Intenta nuevamente más tarde.");
              setProfileData(null);
              setProfileComplete(false);
            }
          } else {
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
        permisos,
        setPermisos,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};
