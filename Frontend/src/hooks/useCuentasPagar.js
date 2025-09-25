// src/hooks/useCuentasPagar.js
import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

// Crear una instancia de axios separada para evitar interceptores
const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:8765",
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
});

export const useCuentasPagar = () => {
  const [cuentas, setCuentas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCuentas = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {

      const response = await apiClient.get('/api/cuentas-pagar');

      // La API devuelve directamente un array de cuentas
      const cuentasData = Array.isArray(response.data) ? response.data : [];

      setCuentas(cuentasData);
    } catch (err) {
      console.error('❌ Error al obtener cuentas:', err);
      console.error('❌ Detalles del error:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
        config: err.config,
        code: err.code,
        name: err.name
      });
      // Extraer solo el mensaje de error
      const errorMessage = err.response?.data?.error || err.message || 'Error desconocido al obtener cuentas';
      setError(errorMessage);
      setCuentas([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateCuenta = useCallback(
    async (id, data) => {
      try {

        await apiClient.put(`/api/cuentas-pagar/${id}`, data);
        await fetchCuentas();

      } catch (err) {
        console.error('❌ Error al actualizar cuenta:', err);
        const errorMessage = err.response?.data?.error || err.message || 'Error al actualizar cuenta';
        setError(errorMessage);
      }
    },
    [fetchCuentas]
  );

  const createCuenta = useCallback(
    async (data) => {
      try {

        await apiClient.post('/api/cuentas-pagar', data);
        await fetchCuentas();

      } catch (err) {
        console.error('❌ Error al crear cuenta:', err);
        const errorMessage = err.response?.data?.error || err.message || 'Error al crear cuenta';
        setError(errorMessage);
      }
    },
    [fetchCuentas]
  );

  const deleteCuenta = useCallback(
    async (id) => {
      try {

        await apiClient.delete(`/api/cuentas-pagar/${id}`);
        await fetchCuentas();

      } catch (err) {
        console.error('❌ Error al eliminar cuenta:', err);
        const errorMessage = err.response?.data?.error || err.message || 'Error al eliminar cuenta';
        setError(errorMessage);
      }
    },
    [fetchCuentas]
  );

  // Función para limpiar errores
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  useEffect(() => {

    fetchCuentas();
  }, [fetchCuentas]);

  return { 
    cuentas, 
    loading, 
    error, 
    fetchCuentas, 
    refreshCuentas: fetchCuentas, // Alias para compatibilidad
    updateCuenta, 
    createCuenta, 
    deleteCuenta,
    clearError
  };
};
