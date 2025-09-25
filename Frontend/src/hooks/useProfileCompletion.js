import { useState, useEffect } from 'react';
import { auth } from '../firebase';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8765";

export const useProfileCompletion = (userEmail) => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [firebaseUID, setFirebaseUID] = useState(null);

  // Cargar información del usuario
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/user-registration/profile-status/${userEmail}`);
        if (response.data.success) {
          setUserData(response.data.data);
        }
      } catch (error) {
        console.error('Error al cargar datos del usuario:', error);
        setError('Error al cargar datos del usuario');
      }
    };

    if (userEmail) {
      fetchUserData();
    }
  }, [userEmail]);

  // Obtener Firebase UID del usuario autenticado
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setFirebaseUID(user.uid);

      } else {
        setFirebaseUID(null);

      }
    });

    return () => unsubscribe();
  }, []);

  // Función para completar perfil
  const completeProfile = async (profileData) => {
    setLoading(true);
    setError(null);

    try {
      // Crear FormData para enviar archivo
      const submitData = new FormData();
      submitData.append('name', profileData.name);
      submitData.append('password', profileData.password);
      submitData.append('phone', profileData.phone || '');
      submitData.append('department', profileData.department || '');
      submitData.append('position', profileData.position || '');
      submitData.append('hire_date', profileData.hire_date || '');
      if (profileData.avatar) {
        submitData.append('avatar', profileData.avatar);
      }

      // Si hay Firebase UID, enviarlo también
      if (firebaseUID) {
        submitData.append('firebase_uid', firebaseUID);

      }

      const response = await axios.put(
        `${API_URL}/api/user-registration/complete-profile/${userData.id}`,
        submitData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      if (response.data.success) {

        return { success: true, data: response.data.data };
      } else {
        throw new Error(response.data.message || 'Error al completar perfil');
      }
    } catch (error) {
      console.error('Error al completar perfil:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Error al completar perfil';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Función para verificar si el usuario puede acceder al sistema
  const canAccessSystem = () => {
    return userData && userData.profile_complete && userData.is_active;
  };

  // Función para obtener el Firebase UID del usuario
  const getUserFirebaseUID = () => {
    return userData?.firebase_uid || firebaseUID;
  };

  return {
    userData,
    loading,
    error,
    firebaseUID,
    completeProfile,
    canAccessSystem,
    getUserFirebaseUID,
    clearError: () => setError(null)
  };
};
