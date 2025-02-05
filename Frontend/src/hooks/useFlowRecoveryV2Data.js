// src/hooks/useFlowRecoveryV2Data.js
import { useState, useEffect } from 'react';
import axios from 'axios';

const useFlowRecoveryV2Data = (url, intervalTime = 10000) => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      const response = await axios.get(url);
      // Si el endpoint retorna un array, calculemos los totales:
      if (Array.isArray(response.data)) {
        let totalRecuperado = 0;
        let totalPorRecuperar = 0;
        response.data.forEach(item => {
          const monto = parseFloat(item.monto) || 0;
          // Supongamos que si "recuperado" es igual a 1 significa que ya se recuperó;
          // de lo contrario (0 o null) se considera pendiente.
          if (Number(item.recuperado) === 1) {
            totalRecuperado += monto;
          } else {
            totalPorRecuperar += monto;
          }
        });
        setData({ totalRecuperado, totalPorRecuperar });
      } else {
        setData(response.data);
      }
      setIsLoading(false);
      setError(null);
    } catch (err) {
      console.error('Error al obtener Flow Recovery V2:', err);
      setError(err);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, intervalTime);
    return () => clearInterval(interval);
  }, [url, intervalTime]);

  return { data, isLoading, error };
};

export default useFlowRecoveryV2Data;

