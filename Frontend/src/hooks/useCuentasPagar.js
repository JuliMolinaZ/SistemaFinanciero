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
      console.log('🔍 Fetching cuentas desde: /api/cuentas-pagar');
      console.log('🔍 apiClient.defaults.baseURL:', apiClient.defaults.baseURL);
      console.log('🔍 apiClient.defaults.headers:', apiClient.defaults.headers);
      
      const response = await apiClient.get('/api/cuentas-pagar');
      console.log('✅ Respuesta completa:', response.data);
      
      // La API devuelve directamente un array de cuentas
      const cuentasData = Array.isArray(response.data) ? response.data : [];
      console.log('✅ Cuentas obtenidas:', cuentasData.length, 'registros');
      console.log('📊 Primera cuenta:', cuentasData[0]);
      console.log('🔍 Campos disponibles:', Object.keys(cuentasData[0] || {}));
      console.log('🏷️ Estructura completa de la primera cuenta:', JSON.stringify(cuentasData[0], null, 2));
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
        console.log('🔄 Actualizando cuenta:', id, data);
        await apiClient.put(`/api/cuentas-pagar/${id}`, data);
        await fetchCuentas();
        console.log('✅ Cuenta actualizada exitosamente');
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
        console.log('➕ Creando nueva cuenta:', data);
        await apiClient.post('/api/cuentas-pagar', data);
        await fetchCuentas();
        console.log('✅ Cuenta creada exitosamente');
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
        console.log('🗑️ Eliminando cuenta:', id);
        await apiClient.delete(`/api/cuentas-pagar/${id}`);
        await fetchCuentas();
        console.log('✅ Cuenta eliminada exitosamente');
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
    console.log('🚀 Hook useCuentasPagar inicializado');
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
