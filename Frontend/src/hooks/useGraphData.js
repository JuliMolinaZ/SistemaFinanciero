// src/hooks/useGraphData.js
import { useState, useEffect } from 'react';
import axios from 'axios';

const useGraphData = (url, intervalTime = 5000) => {
  const [graphData, setGraphData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchGraphData = async () => {
    try {
      const response = await axios.get(url);

      const {
        cuentasPorCobrar = 0,
        cuentasPagadas = 0,
        cuentasPorPagar = 0,
        totalRecuperado = 0,
        totalPorRecuperar = 0,
        costosFijosMXN = 0,
        costosFijosUSD = 0,
      } = response.data;

      setGraphData({
        cuentasPorCobrar,
        cuentasPagadas,
        cuentasPorPagar,
        totalRecuperado,
        totalPorRecuperar,
        costosFijosMXN,
        costosFijosUSD,
      });
      setIsLoading(false);
      setError(null);
    } catch (err) {
      console.error('Error al obtener los datos del gráfico:', err);
      if (err.response) {
        // Errores del servidor
        setError(`Error ${err.response.status}: ${err.response.data.message}`);
      } else if (err.request) {
        // Errores de red
        setError('Error de red. Por favor, verifica tu conexión.');
      } else {
        // Otros errores
        setError('Ocurrió un error inesperado.');
      }
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchGraphData();
    const interval = setInterval(fetchGraphData, intervalTime);
    return () => clearInterval(interval);
  }, [url, intervalTime]);

  return { graphData, isLoading, error };
};

export default useGraphData;

