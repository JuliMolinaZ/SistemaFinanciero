// src/context/GlobalState.js
import React, { createContext, useState, useEffect } from 'react';
import { auth } from '../firebase'; // Asegúrate de que la ruta sea correcta
import axios from 'axios';

export const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {
  const [clientes, setClientes] = useState([]);
  const [proyectos, setProyectos] = useState([]);
  
  // Estados para autenticación
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  
  // Estados para perfil
  const [profileComplete, setProfileComplete] = useState(false);
  const [profileData, setProfileData] = useState(null);
  
  // Estado para sidebar
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  
  // Estado de carga de autenticación
  const [authLoading, setAuthLoading] = useState(true);

  // Suscribirse al estado de autenticación y verificar perfil en la base de datos
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      setCurrentUser(user);
      if (user) {
        try {
          // Consultar si existe un perfil para el usuario autenticado
          const response = await axios.get(`http://localhost:5000/api/usuarios/firebase/${user.uid}`);
          setProfileData(response.data);
          setProfileComplete(true);
        } catch (err) {
          setProfileData(null);
          setProfileComplete(false);
        }
      } else {
        // Cuando no hay usuario autenticado, limpiar el estado y localStorage
        setProfileData(null);
        setProfileComplete(false);
        localStorage.removeItem('profileData');
        localStorage.removeItem('profileComplete');
      }
      // Finalizar el estado de carga una vez que se resuelva la autenticación
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Cargar datos de perfil desde localStorage al montar el componente (opcional)
  useEffect(() => {
    const storedProfile = localStorage.getItem('profileData');
    const storedProfileComplete = localStorage.getItem('profileComplete');
    if (storedProfile) {
      setProfileData(JSON.parse(storedProfile));
    }
    if (storedProfileComplete) {
      setProfileComplete(JSON.parse(storedProfileComplete));
    }
  }, []);

  // Guardar cambios en profileData y profileComplete en localStorage
  useEffect(() => {
    localStorage.setItem('profileData', JSON.stringify(profileData));
    localStorage.setItem('profileComplete', JSON.stringify(profileComplete));
  }, [profileData, profileComplete]);

  return (
    <GlobalContext.Provider value={{
      clientes, setClientes,
      proyectos, setProyectos,
      users, setUsers,
      currentUser, setCurrentUser,
      profileComplete, setProfileComplete,
      profileData, setProfileData,
      sidebarCollapsed, setSidebarCollapsed,
      authLoading // Agrega authLoading al contexto
    }}>
      {children}
    </GlobalContext.Provider>
  );
};

