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

      const response = await apiClient.get('/api/cuentas-cobrar');

      // Asegurar que los datos sean un array
      const cuentasData = Array.isArray(response.data) ? response.data : [];

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

      const response = await apiClient.post('/api/cuentas-cobrar', cuentaData);

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

      const response = await apiClient.put(`/api/cuentas-cobrar/${id}`, updateData);

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

      await apiClient.delete(`/api/cuentas-cobrar/${id}`);

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

      const response = await apiClient.get(`/api/cuentas-cobrar/${id}`);

      return response.data;
      
    } catch (error) {
      console.error('❌ useCuentasCobrar: Error obteniendo cuenta por ID:', error);
      throw error;
    }
  }, []);

  // Función para obtener estadísticas
  const getEstadisticas = useCallback(async () => {
    try {

      const response = await apiClient.get('/api/cuentas-cobrar/estadisticas');

      return response.data;
      
    } catch (error) {
      console.error('❌ useCuentasCobrar: Error obteniendo estadísticas:', error);
      throw error;
    }
  }, []);

  // Función para exportar cuentas
  const exportarCuentas = useCallback(async (formato = 'csv') => {
    try {

      const response = await apiClient.get(`/api/cuentas-cobrar/exportar/${formato}`, {
        responseType: 'blob'
      });

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
