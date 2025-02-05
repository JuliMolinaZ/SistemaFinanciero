// src/hooks/useMoneyFlowRecoveryData.js
import { useState, useEffect } from 'react';
import axios from 'axios';

const useMoneyFlowRecoveryData = (url, intervalTime = 10000) => {
  // Inicializamos con totales en 0 para evitar errores al formatear
  const [data, setData] = useState({ totalRecuperado: 0, totalPorRecuperar: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      const response = await axios.get(url);
      console.log("Datos MoneyFlow Recovery (raw):", response.data);
      // Si response.data es un arreglo, sumamos manualmente
      if (Array.isArray(response.data)) {
        const totalRecuperado = response.data
          .filter(item => Number(item.recuperado) === 1)
          .reduce((acc, item) => acc + parseFloat(item.monto || 0), 0);
        const totalPorRecuperar = response.data
          .filter(item => Number(item.recuperado) !== 1)
          .reduce((acc, item) => acc + parseFloat(item.monto || 0), 0);
        setData({ totalRecuperado, totalPorRecuperar });
      } else {
        // Si el endpoint retorna ya un objeto con totales, lo usamos directamente
        setData(response.data);
      }
      setIsLoading(false);
      setError(null);
    } catch (err) {
      console.error("Error en useMoneyFlowRecoveryData:", err);
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

export default useMoneyFlowRecoveryData;
