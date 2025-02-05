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
        const response = await axios.get('/api/usuarios');
        const users = response.data;
        setTotalUsers(users.length);

        // Agrupar por rol
        const rolesCount = users.reduce((acc, user) => {
          acc[user.role] = (acc[user.role] || 0) + 1;
          return acc;
        }, {});
        setUsersByRole(rolesCount);
      } catch (error) {
        console.error('Error al obtener datos de usuarios:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsersData();
  }, []);

  return { totalUsers, usersByRole, isLoading };
};

export default useUsersData;
