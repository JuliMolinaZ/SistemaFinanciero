import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

// Crear instancia de axios separada para evitar interceptores globales
const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8765',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
});

export const useCuentasCobrar = () => {
  const [cuentas, setCuentas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Función para obtener todas las cuentas por cobrar
  const fetchCuentas = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔍 useCuentasCobrar: Obteniendo cuentas por cobrar...');
      
      const response = await apiClient.get('/api/cuentas-cobrar');
      
      console.log('✅ useCuentasCobrar: Respuesta recibida:', response.data);
      
      // Asegurar que los datos sean un array
      const cuentasData = Array.isArray(response.data) ? response.data : [];
      
      console.log('📊 useCuentasCobrar: Cuentas procesadas:', cuentasData.length);
      
      setCuentas(cuentasData);
      
    } catch (error) {
      console.error('❌ useCuentasCobrar: Error obteniendo cuentas:', error);
      setError(error.response?.data?.message || 'Error al cargar las cuentas por cobrar');
      setCuentas([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Función para crear una nueva cuenta por cobrar
  const createCuenta = useCallback(async (cuentaData) => {
    try {
      console.log('🔍 useCuentasCobrar: Creando cuenta:', cuentaData);
      
      const response = await apiClient.post('/api/cuentas-cobrar', cuentaData);
      
      console.log('✅ useCuentasCobrar: Cuenta creada:', response.data);
      
      // Recargar las cuentas después de crear una nueva
      await fetchCuentas();
      
      return response.data;
      
    } catch (error) {
      console.error('❌ useCuentasCobrar: Error creando cuenta:', error);
      throw error;
    }
  }, [fetchCuentas]);

  // Función para actualizar una cuenta por cobrar
  const updateCuenta = useCallback(async (id, updateData) => {
    try {
      console.log('🔍 useCuentasCobrar: Actualizando cuenta:', id, updateData);
      
      const response = await apiClient.put(`/api/cuentas-cobrar/${id}`, updateData);
      
      console.log('✅ useCuentasCobrar: Cuenta actualizada:', response.data);
      
      // Actualizar la cuenta en el estado local
      setCuentas(prevCuentas => 
        prevCuentas.map(cuenta => 
          cuenta.id === id ? { ...cuenta, ...updateData } : cuenta
        )
      );
      
      return response.data;
      
    } catch (error) {
      console.error('❌ useCuentasCobrar: Error actualizando cuenta:', error);
      throw error;
    }
  }, []);

  // Función para eliminar una cuenta por cobrar
  const deleteCuenta = useCallback(async (id) => {
    try {
      console.log('🔍 useCuentasCobrar: Eliminando cuenta:', id);
      
      await apiClient.delete(`/api/cuentas-cobrar/${id}`);
      
      console.log('✅ useCuentasCobrar: Cuenta eliminada');
      
      // Remover la cuenta del estado local
      setCuentas(prevCuentas => 
        prevCuentas.filter(cuenta => cuenta.id !== id)
      );
      
    } catch (error) {
      console.error('❌ useCuentasCobrar: Error eliminando cuenta:', error);
      throw error;
    }
  }, []);

  // Función para obtener una cuenta por ID
  const getCuentaById = useCallback(async (id) => {
    try {
      console.log('🔍 useCuentasCobrar: Obteniendo cuenta por ID:', id);
      
      const response = await apiClient.get(`/api/cuentas-cobrar/${id}`);
      
      console.log('✅ useCuentasCobrar: Cuenta obtenida:', response.data);
      
      return response.data;
      
    } catch (error) {
      console.error('❌ useCuentasCobrar: Error obteniendo cuenta por ID:', error);
      throw error;
    }
  }, []);

  // Función para obtener estadísticas
  const getEstadisticas = useCallback(async () => {
    try {
      console.log('🔍 useCuentasCobrar: Obteniendo estadísticas...');
      
      const response = await apiClient.get('/api/cuentas-cobrar/estadisticas');
      
      console.log('✅ useCuentasCobrar: Estadísticas obtenidas:', response.data);
      
      return response.data;
      
    } catch (error) {
      console.error('❌ useCuentasCobrar: Error obteniendo estadísticas:', error);
      throw error;
    }
  }, []);

  // Función para exportar cuentas
  const exportarCuentas = useCallback(async (formato = 'csv') => {
    try {
      console.log('🔍 useCuentasCobrar: Exportando cuentas en formato:', formato);
      
      const response = await apiClient.get(`/api/cuentas-cobrar/exportar/${formato}`, {
        responseType: 'blob'
      });
      
      console.log('✅ useCuentasCobrar: Cuentas exportadas');
      
      return response.data;
      
    } catch (error) {
      console.error('❌ useCuentasCobrar: Error exportando cuentas:', error);
      throw error;
    }
  }, []);

  // Función para refrescar las cuentas
  const refreshCuentas = useCallback(() => {
    fetchCuentas();
  }, [fetchCuentas]);

  // Cargar cuentas al montar el componente
  useEffect(() => {
    fetchCuentas();
  }, [fetchCuentas]);

  return {
    cuentas,
    loading,
    error,
    createCuenta,
    updateCuenta,
    deleteCuenta,
    getCuentaById,
    getEstadisticas,
    exportarCuentas,
    refreshCuentas
  };
};
