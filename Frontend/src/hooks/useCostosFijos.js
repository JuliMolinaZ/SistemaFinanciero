// src/hooks/useCostosFijos.js
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

export const useCostosFijos = () => {
  const [costosFijos, setCostosFijos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Función para obtener todos los costos fijos
  const fetchCostosFijos = useCallback(async (mesFiltro = '') => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔍 useCostosFijos: Obteniendo costos fijos...');
      
      const response = await apiClient.get('/api/costos-fijos', {
        params: { mes: mesFiltro }
      });
      
      console.log('✅ useCostosFijos: Respuesta recibida:', response.data);
      
      // La API devuelve {success: true, data: [...]}
      const costosData = response.data.data || response.data || [];
      
      // Asegurar que los datos sean un array
      if (!Array.isArray(costosData)) {
        console.error('❌ useCostosFijos: Los datos no son un array:', costosData);
        setCostosFijos([]);
        return;
      }
      
      // Procesar y formatear los datos
      const costosFormateados = costosData.map((costo) => ({
        ...costo,
        monto_mxn: parseFloat(costo.monto_mxn) || 0,
        monto_usd: parseFloat(costo.monto_usd) || 0,
        impuestos_imss: parseFloat(costo.impuestos_imss) || 0,
        cuenta_creada: costo.cuenta_creada || false,
      }));
      
      console.log('📊 useCostosFijos: Costos procesados:', costosFormateados.length);
      
      setCostosFijos(costosFormateados);
      
    } catch (error) {
      console.error('❌ useCostosFijos: Error obteniendo costos:', error);
      setError(error.response?.data?.message || 'Error al cargar los costos fijos');
      setCostosFijos([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Función para crear un nuevo costo fijo
  const createCostoFijo = useCallback(async (data) => {
    try {
      setError(null);
      
      console.log('🔍 useCostosFijos: Creando costo fijo:', data);
      
      const response = await apiClient.post('/api/costos-fijos', data);
      
      console.log('✅ useCostosFijos: Costo creado:', response.data);
      
      // Refrescar la lista
      await fetchCostosFijos();
      
      return { success: true, data: response.data };
    } catch (error) {
      console.error('❌ useCostosFijos: Error creando costo:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Error al crear costo fijo';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, [fetchCostosFijos]);

  // Función para actualizar un costo fijo
  const updateCostoFijo = useCallback(async (id, data) => {
    try {
      setError(null);
      
      console.log('🔍 useCostosFijos: Actualizando costo fijo:', id, data);
      
      const response = await apiClient.put(`/api/costos-fijos/${id}`, data);
      
      console.log('✅ useCostosFijos: Costo actualizado:', response.data);
      
      // Refrescar la lista
      await fetchCostosFijos();
      
      return { success: true, data: response.data };
    } catch (error) {
      console.error('❌ useCostosFijos: Error actualizando costo:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Error al actualizar costo fijo';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, [fetchCostosFijos]);

  // Función para enviar a cuentas por pagar
  const enviarACuentasPagar = useCallback(async (id) => {
    try {
      setError(null);
      
      console.log('🔍 useCostosFijos: Enviando a cuentas por pagar:', id);
      
      const response = await apiClient.post(`/api/costos-fijos/${id}/enviar`);
      
      console.log('✅ useCostosFijos: Enviado a cuentas por pagar:', response.data);
      
      // Actualizar el estado local para marcar como enviado
      setCostosFijos(prev => prev.map(costo => 
        costo.id === id ? { ...costo, cuenta_creada: true } : costo
      ));
      
      return { success: true, data: response.data };
    } catch (error) {
      console.error('❌ useCostosFijos: Error enviando a cuentas por pagar:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Error al enviar a cuentas por pagar';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, []);

  // Función para limpiar errores
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Cargar datos al montar el hook
  useEffect(() => {
    console.log('🚀 Hook useCostosFijos inicializado');
    fetchCostosFijos();
  }, [fetchCostosFijos]);

  return { 
    costosFijos, 
    loading, 
    error, 
    fetchCostosFijos, 
    refreshCostosFijos: fetchCostosFijos, // Alias para compatibilidad
    createCostoFijo, 
    updateCostoFijo,
    enviarACuentasPagar,
    clearError
  };
};
