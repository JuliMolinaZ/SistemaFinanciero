// src/hooks/useCuentasPagar.js
import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

// Obtener la URL de la API desde las variables de entorno
const API_BASE = 'http://localhost:5001';

export const useCuentasPagar = () => {
  const [cuentas, setCuentas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCuentas = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      console.log('🔍 Fetching cuentas desde:', `${API_BASE}/api/cuentas-pagar`);
      const response = await axios.get(`${API_BASE}/api/cuentas-pagar`);
      console.log('✅ Cuentas obtenidas:', response.data.length, 'registros');
      console.log('📊 Primera cuenta:', response.data[0]);
      console.log('🔍 Campos disponibles:', Object.keys(response.data[0] || {}));
      console.log('🏷️ Estructura completa de la primera cuenta:', JSON.stringify(response.data[0], null, 2));
      setCuentas(response.data);
    } catch (err) {
      console.error('❌ Error al obtener cuentas:', err);
      console.error('❌ Detalles del error:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
        config: err.config
      });
      // Extraer solo el mensaje de error
      const errorMessage = err.response?.data?.error || err.message || 'Error desconocido al obtener cuentas';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateCuenta = useCallback(
    async (id, data) => {
      try {
        console.log('🔄 Actualizando cuenta:', id, data);
        await axios.put(`${API_BASE}/api/cuentas-pagar/${id}`, data);
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
        await axios.post(`${API_BASE}/api/cuentas-pagar`, data);
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
        await axios.delete(`${API_BASE}/api/cuentas-pagar/${id}`);
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
    console.log('🚀 Hook useCuentasPagar inicializado, API_BASE:', API_BASE);
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
