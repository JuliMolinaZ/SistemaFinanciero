// src/hooks/useUsersData.js
import { useState, useEffect } from 'react';
import axios from 'axios';

const useUsersData = () => {
  const [totalUsers, setTotalUsers] = useState(0);
  const [usersByRole, setUsersByRole] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUsersData = async () => {
      try {
        const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8765';
        const response = await axios.get(`${API_BASE_URL}/api/usuarios`);
        const responseData = response.data;
        
        // Verificar la estructura de la respuesta
        let users;
        if (responseData && responseData.success && Array.isArray(responseData.data)) {
          users = responseData.data;
        } else if (Array.isArray(responseData)) {
          users = responseData;
        } else {

          users = [];
        }
        
        setTotalUsers(users.length);

        // Agrupar por rol
        const rolesCount = users.reduce((acc, user) => {
          acc[user.role] = (acc[user.role] || 0) + 1;
          return acc;
        }, {});
        setUsersByRole(rolesCount);
      } catch (error) {
        console.error('Error al obtener datos de usuarios:', error);
        setTotalUsers(0);
        setUsersByRole({});
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsersData();
  }, []);

  return { totalUsers, usersByRole, isLoading };
};

export default useUsersData;
