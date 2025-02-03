// src/hooks/useCuentasPagar.js
import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

export const useCuentasPagar = () => {
  const [cuentas, setCuentas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCuentas = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get('https://sigma.runsolutions-services.com/api/cuentas-pagar');
      setCuentas(response.data);
    } catch (err) {
      setError(err);
      console.error('Error al obtener cuentas:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateCuenta = useCallback(
    async (id, data) => {
      try {
        await axios.put(`/api/cuentas-pagar/${id}`, data);
        await fetchCuentas();
      } catch (err) {
        setError(err);
        console.error('Error al actualizar cuenta:', err);
      }
    },
    [fetchCuentas]
  );

  const createCuenta = useCallback(
    async (data) => {
      try {
        await axios.post('/api/cuentas-pagar', data);
        await fetchCuentas();
      } catch (err) {
        setError(err);
        console.error('Error al crear cuenta:', err);
      }
    },
    [fetchCuentas]
  );

  const deleteCuenta = useCallback(
    async (id) => {
      try {
        await axios.delete(`/api/cuentas-pagar/${id}`);
        await fetchCuentas();
      } catch (err) {
        setError(err);
        console.error('Error al eliminar cuenta:', err);
      }
    },
    [fetchCuentas]
  );

  useEffect(() => {
    fetchCuentas();
  }, [fetchCuentas]);

  return { cuentas, loading, error, fetchCuentas, updateCuenta, createCuenta, deleteCuenta };
};
