// hooks/useDashboardData.js - Hook avanzado para gestión de datos del dashboard
import { useState, useEffect, useCallback, useMemo } from 'react';
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8765";

export const useDashboardData = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  
  // Estados para diferentes tipos de datos
  const [financialData, setFinancialData] = useState({
    cuentasPagar: [],
    cuentasCobrar: [],
    contabilidad: [],
    flujoEfectivo: []
  });
  
  const [operationalData, setOperationalData] = useState({
    clients: [],
    projects: [],
    providers: [],
    users: []
  });

  const [analyticsData, setAnalyticsData] = useState({
    kpis: {},
    trends: {},
    forecasts: {},
    comparisons: {}
  });

  // Función para obtener datos financieros
  const fetchFinancialData = useCallback(async () => {
    try {
      const [cuentasPagar, cuentasCobrar, contabilidad] = await Promise.all([
        axios.get(`${API_BASE_URL}/api/cuentas-pagar`),
        axios.get(`${API_BASE_URL}/api/cuentas-cobrar`),
        axios.get(`${API_BASE_URL}/api/contabilidad`)
      ]);

      setFinancialData({
        cuentasPagar: cuentasPagar.data || [],
        cuentasCobrar: cuentasCobrar.data || [],
        contabilidad: contabilidad.data || [],
        flujoEfectivo: calculateCashFlow(contabilidad.data || [])
      });
    } catch (err) {
      console.error('Error fetching financial data:', err);
      setError(err.message);
    }
  }, []);

  // Función para obtener datos operacionales
  const fetchOperationalData = useCallback(async () => {
    try {
      const [clients, projects, users] = await Promise.all([
        axios.get(`${API_BASE_URL}/api/clients`),
        axios.get(`${API_BASE_URL}/api/projects`),
        axios.get(`${API_BASE_URL}/api/usuarios`)
      ]);

      setOperationalData({
        clients: clients.data || [],
        projects: projects.data || [],
        providers: [],
        users: users.data || []
      });
    } catch (err) {
      console.error('Error fetching operational data:', err);
      setError(err.message);
    }
  }, []);

  // Función para calcular flujo de efectivo
  const calculateCashFlow = useCallback((contabilidad) => {
    const sortedData = contabilidad.sort((a, b) => new Date(a.fecha) - new Date(b.fecha));
    let runningBalance = 0;
    
    return sortedData.map(item => {
      runningBalance += parseFloat(item.monto) || 0;
      return {
        ...item,
        runningBalance,
        date: item.fecha
      };
    });
  }, []);

  // Cálculos avanzados de KPIs
  const calculatedKPIs = useMemo(() => {
    const { cuentasPagar, cuentasCobrar, contabilidad } = financialData;
    const { clients, projects } = operationalData;

    // KPIs Financieros
    const totalPagar = cuentasPagar.reduce((sum, cuenta) => sum + (parseFloat(cuenta.monto_con_iva) || 0), 0);
    const totalCobrar = cuentasCobrar.reduce((sum, cuenta) => sum + (parseFloat(cuenta.monto_con_iva) || 0), 0);
    const netCashFlow = totalCobrar - totalPagar;
    
    // KPIs de liquidez
    const pagosPendientes = cuentasPagar.filter(c => !c.pagado).length;
    const cobrosPendientes = cuentasCobrar.filter(c => c.estado !== 'Cobrada').length;
    
    // KPIs operacionales
    const activeProjects = projects.filter(p => p.estado === 'Activo').length;
    const completedProjects = projects.filter(p => p.estado === 'Completado').length;
    const projectSuccessRate = projects.length > 0 ? (completedProjects / projects.length) * 100 : 0;
    
    // KPIs de crecimiento
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const monthlyRevenue = contabilidad
      .filter(item => {
        const itemDate = new Date(item.fecha);
        return itemDate.getMonth() === currentMonth && itemDate.getFullYear() === currentYear && item.monto > 0;
      })
      .reduce((sum, item) => sum + parseFloat(item.monto), 0);

    // Análisis de tendencias
    const last6Months = Array.from({length: 6}, (_, i) => {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      return {
        month: date.toLocaleDateString('es', { month: 'long', year: 'numeric' }),
        revenue: contabilidad
          .filter(item => {
            const itemDate = new Date(item.fecha);
            return itemDate.getMonth() === date.getMonth() && 
                   itemDate.getFullYear() === date.getFullYear() && 
                   item.monto > 0;
          })
          .reduce((sum, item) => sum + parseFloat(item.monto), 0),
        expenses: contabilidad
          .filter(item => {
            const itemDate = new Date(item.fecha);
            return itemDate.getMonth() === date.getMonth() && 
                   itemDate.getFullYear() === date.getFullYear() && 
                   item.monto < 0;
          })
          .reduce((sum, item) => sum + Math.abs(parseFloat(item.monto)), 0)
      };
    }).reverse();

    return {
      financial: {
        totalPagar,
        totalCobrar,
        netCashFlow,
        monthlyRevenue,
        liquidityRatio: totalPagar > 0 ? totalCobrar / totalPagar : 0,
        pagosPendientes,
        cobrosPendientes
      },
      operational: {
        totalClients: clients.length,
        activeProjects,
        completedProjects,
        projectSuccessRate,
        totalUsers: operationalData.users.length
      },
      trends: {
        last6Months,
        growth: last6Months.length > 1 ? 
          ((last6Months[last6Months.length - 1].revenue - last6Months[last6Months.length - 2].revenue) / 
           (last6Months[last6Months.length - 2].revenue || 1)) * 100 : 0
      }
    };
  }, [financialData, operationalData]);

  // Función para refrescar todos los datos
  const refreshAllData = useCallback(async () => {
    setRefreshing(true);
    setError(null);
    
    try {
      await Promise.all([
        fetchFinancialData(),
        fetchOperationalData()
      ]);
    } catch (err) {
      setError(err.message);
    } finally {
      setRefreshing(false);
    }
  }, [fetchFinancialData, fetchOperationalData]);

  // Cargar datos iniciales
  useEffect(() => {
    const loadInitialData = async () => {
      setLoading(true);
      await refreshAllData();
      setLoading(false);
    };

    loadInitialData();
  }, [refreshAllData]);

  // Auto-refresh cada 5 minutos
  useEffect(() => {
    const interval = setInterval(refreshAllData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [refreshAllData]);

  return {
    // Estados de carga
    loading,
    error,
    refreshing,
    
    // Datos brutos
    financialData,
    operationalData,
    analyticsData,
    
    // KPIs calculados
    kpis: calculatedKPIs,
    
    // Funciones
    refreshData: refreshAllData,
    
    // Utilidades
    isDataStale: false // Implementar lógica para detectar datos obsoletos
  };
};

export default useDashboardData;