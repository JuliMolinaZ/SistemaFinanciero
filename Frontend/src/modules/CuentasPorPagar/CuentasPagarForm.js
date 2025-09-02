// src/modules/CuentasPorPagar/CuentasPagarForm.jsx
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import axios from 'axios';
import { useCuentasPagar } from '../../hooks/useCuentasPagar';
import Filtros from './components/Filtros';
import TablaCuentas from './components/TablaCuentas';
import ModalRegistro from './components/ModalRegistro';
import ModalPagoParcial from './components/ModalPagoParcial';
import CalendarPagos from './components/CalendarPagos';
import DashboardElegante from './components/DashboardElegante';
import ExportButton from '../../components/ExportButton';
import {
  Container,
  Box,
  Typography,
  Button,
  Snackbar,
  Alert,
  CircularProgress,
  Slide,
  Grid,
  Card,
  CardContent,
  IconButton,
  Tooltip,
  Chip,
  Divider,
  Fade,
  Zoom,
  useTheme,
  useMediaQuery,
  Tabs,
  Tab,
  Paper,
  AppBar,
  Toolbar,
  Fab,
  SpeedDial,
  SpeedDialAction,
  SpeedDialIcon,
  Backdrop,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Collapse,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  MobileStepper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Area,
  AreaChart
} from 'recharts';
import {
  Add as AddIcon,
  Refresh as RefreshIcon,
  TrendingUp as TrendingUpIcon,
  AccountBalance as AccountBalanceIcon,
  Payment as PaymentIcon,
  Schedule as ScheduleIcon,
  FilterList as FilterListIcon,
  CalendarToday as CalendarIcon,
  Assessment as AssessmentIcon,
  MonetizationOn as MonetizationOnIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Info as InfoIcon,
  Dashboard as DashboardIcon,
  TableChart as TableIcon,
  ViewModule as ViewModuleIcon,
  Settings as SettingsIcon,
  Help as HelpIcon,
  Notifications as NotificationsIcon,
  Search as SearchIcon,
  Tune as TuneIcon,
  Speed as SpeedIcon,
  Analytics as AnalyticsIcon,
  Business as BusinessIcon,
  Category as CategoryIcon,
  DateRange as DateRangeIcon,
  AttachMoney as MoneyIcon,
  Receipt as ReceiptIcon,
  AccountCircle as UserIcon,
  ExitToApp as LogoutIcon
} from '@mui/icons-material';
import { calcularTotalesRecuperacion } from '../../utils/cuentas';

// Función de transición para Snackbar
function SlideTransition(props) {
  return <Slide {...props} direction="up" />;
}

// Componentes estilizados modernos (como los otros módulos)
const StyledContainer = styled(Container)(({ theme }) => ({
  paddingTop: theme.spacing(3),
  paddingBottom: theme.spacing(3),
  minHeight: '100vh',
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  position: 'relative',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.05"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
    pointerEvents: 'none'
  }
}));

const StyledCard = styled(Card)(({ theme }) => ({
  background: 'rgba(255, 255, 255, 0.95)',
  backdropFilter: 'blur(20px)',
  border: '1px solid rgba(255, 255, 255, 0.3)',
  borderRadius: 16,
  boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 12px 40px rgba(0,0,0,0.15)'
  }
}));

const StatsCard = styled(Card)(({ theme, color = 'primary' }) => ({
  background: '#ffffff !important',
  border: `3px solid ${theme.palette[color].main}60`,
  borderRadius: 20,
  padding: theme.spacing(3),
  textAlign: 'center',
  transition: 'all 0.3s ease',
  boxShadow: `0 6px 25px ${theme.palette[color].main}20`,
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: `0 10px 35px ${theme.palette[color].main}30`,
    borderColor: `${theme.palette[color].main}80`
  }
}));

const ActionButton = styled(Button)(({ theme, variant = 'contained' }) => ({
  borderRadius: 12,
  textTransform: 'none',
  fontWeight: 600,
  padding: theme.spacing(1.5, 3),
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 6px 20px rgba(0,0,0,0.15)'
  }
}));

const CuentasPagarForm = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [currentTab, setCurrentTab] = useState(0);
  const [showCalendar, setShowCalendar] = useState(false);
  const [showModalRegistro, setShowModalRegistro] = useState(false);
  const [showModalPagoParcial, setShowModalPagoParcial] = useState(false);
  const [showModalDetalles, setShowModalDetalles] = useState(false);
  const [selectedCuenta, setSelectedCuenta] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [loading, setLoading] = useState(false);

  // Hook personalizado para cuentas por pagar
  const { cuentas, loading: cuentasLoading, error, refreshCuentas } = useCuentasPagar();

  // Debug: Log de cuentas
  console.log('🔍 CuentasPagarForm - cuentas recibidas:', cuentas?.length || 0);
  console.log('📊 Primera cuenta:', cuentas?.[0]);

  // Estados para filtros
  const [filtroMes, setFiltroMes] = useState('');
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [estadoFiltro, setEstadoFiltro] = useState('');
  const [montoMinimo, setMontoMinimo] = useState('');
  const [montoMaximo, setMontoMaximo] = useState('');
  const [proveedorFiltro, setProveedorFiltro] = useState('');
  const [categoriaFiltro, setCategoriaFiltro] = useState('');

  // Estados para datos de filtros
  const [categorias, setCategorias] = useState([]);
  const [proveedores, setProveedores] = useState([]);

  // Cargar categorías y proveedores
  useEffect(() => {
    const cargarDatosFiltros = async () => {
      try {
        // Cargar categorías
        const responseCategorias = await axios.get(`http://localhost:5001/api/categorias`);
        if (responseCategorias.data.success) {
          setCategorias(responseCategorias.data.data || []);
        }

        // Cargar proveedores
        const responseProveedores = await axios.get(`http://localhost:5001/api/proveedores`);
        if (responseProveedores.data.success) {
          setProveedores(responseProveedores.data.data || []);
        }
      } catch (error) {
        console.error('Error al cargar datos de filtros:', error);
      }
    };

    cargarDatosFiltros();
  }, []);

  // Función de filtrado avanzado
  const cuentasFiltradas = useMemo(() => {
    if (!cuentas) return [];
    
    return cuentas.filter(cuenta => {
      // Filtro por mes
      if (filtroMes && new Date(cuenta.fecha).getMonth() + 1 !== parseInt(filtroMes)) {
        return false;
      }
      
      // Filtro por fecha inicio
      if (fechaInicio && new Date(cuenta.fecha) < new Date(fechaInicio)) {
        return false;
      }
      
      // Filtro por fecha fin
      if (fechaFin && new Date(cuenta.fecha) > new Date(fechaFin)) {
        return false;
      }
      
      // Filtro por estado
      if (estadoFiltro && cuenta.pagado !== parseInt(estadoFiltro)) {
        return false;
      }
      
      // Filtro por monto mínimo
      if (montoMinimo && parseFloat(cuenta.monto_con_iva || cuenta.monto_neto || 0) < parseFloat(montoMinimo)) {
        return false;
      }
      
      // Filtro por monto máximo
      if (montoMaximo && parseFloat(cuenta.monto_con_iva || cuenta.monto_neto || 0) > parseFloat(montoMaximo)) {
        return false;
      }
      
      // Filtro por proveedor
      if (proveedorFiltro && cuenta.proveedor_id !== parseInt(proveedorFiltro)) {
        return false;
      }
      
      // Filtro por categoría
      if (categoriaFiltro && cuenta.categoria_id !== parseInt(categoriaFiltro)) {
        return false;
      }
      
      return true;
    });
  }, [cuentas, filtroMes, fechaInicio, fechaFin, estadoFiltro, montoMinimo, montoMaximo, proveedorFiltro, categoriaFiltro]);

  // Calcular totales
  const totales = useMemo(() => {
    if (!cuentas?.length) return { pagadas: 0, porPagar: 0, general: 0, filtradas: 0 };
    
    // Debug: Mostrar información de las primeras cuentas
    console.log('🔍 Debug - Primera cuenta:', cuentas[0]);
    console.log('🔍 Debug - Campos disponibles:', Object.keys(cuentas[0]));
    
    // Total general de todas las cuentas (no filtradas)
    // Intentar usar diferentes campos para determinar si está pagada
    const pagadas = cuentas.filter(c => {
      // Si pagado es true, está pagada
      if (c.pagado === true) return true;
      // Si tiene monto_transferencia o monto_efectivo mayor a 0, está pagada
      if (parseFloat(c.monto_transferencia || 0) > 0 || parseFloat(c.monto_efectivo || 0) > 0) return true;
      // Si el estado_detallado dice "Pagada", está pagada
      if (c.estado_detallado === 'Pagada') return true;
      return false;
    });
    
    const porPagar = cuentas.filter(c => {
      // Si no está pagada por ningún criterio, está por pagar
      if (c.pagado === true) return false;
      if (parseFloat(c.monto_transferencia || 0) > 0 || parseFloat(c.monto_efectivo || 0) > 0) return false;
      if (c.estado_detallado === 'Pagada') return false;
      return true;
    });
    
    // Debug: Mostrar conteos
    console.log('🔍 Debug - Total cuentas:', cuentas.length);
    console.log('🔍 Debug - Cuentas pagadas:', pagadas.length);
    console.log('🔍 Debug - Cuentas por pagar:', porPagar.length);
    
    // Total de cuentas filtradas
    const totalFiltradas = cuentasFiltradas.reduce((sum, c) => sum + parseFloat(c.monto_con_iva || c.monto_neto || 0), 0);
    
    const result = {
      pagadas: pagadas.reduce((sum, c) => sum + parseFloat(c.monto_con_iva || c.monto_neto || 0), 0),
      porPagar: porPagar.reduce((sum, c) => sum + parseFloat(c.monto_con_iva || c.monto_neto || 0), 0),
      general: cuentas.reduce((sum, c) => sum + parseFloat(c.monto_con_iva || c.monto_neto || 0), 0),
      filtradas: totalFiltradas
    };
    
    console.log('🔍 Debug - Totales calculados:', result);
    return result;
  }, [cuentas, cuentasFiltradas]);

  // Manejar cambio de tab
  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  // Manejar apertura de modal de registro
  const handleOpenModalRegistro = () => {
    setShowModalRegistro(true);
  };

  // Manejar apertura de modal de pago parcial
  const handleOpenModalPagoParcial = (cuenta) => {
    setSelectedCuenta(cuenta);
    setShowModalPagoParcial(true);
  };

  // Manejar cierre de modales
  const handleCloseModals = () => {
    setShowModalRegistro(false);
    setShowModalPagoParcial(false);
    setShowModalDetalles(false);
    setSelectedCuenta(null);
  };

  // Manejar snackbar
  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Mostrar mensaje de éxito
  const showSuccessMessage = (message) => {
    setSnackbar({ open: true, message, severity: 'success' });
  };

  // Mostrar mensaje de error
  const showErrorMessage = (message) => {
    setSnackbar({ open: true, message, severity: 'error' });
  };

  if (cuentasLoading) {
    return (
      <StyledContainer>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          minHeight: '50vh',
          flexDirection: 'column',
          gap: 3
        }}>
          <CircularProgress size={60} sx={{ color: '#fff' }} />
          <Typography variant="h6" sx={{ color: '#fff', fontWeight: 600 }}>
            Cargando Cuentas por Pagar...
          </Typography>
        </Box>
      </StyledContainer>
    );
  }

  if (error) {
    return (
      <StyledContainer>
        <Container maxWidth="md" sx={{ pt: 8 }}>
          <StyledCard sx={{ p: 4, textAlign: 'center' }}>
            <ErrorIcon sx={{ fontSize: 80, color: 'error.main', mb: 2 }} />
            <Typography variant="h5" color="error" gutterBottom>
              Error al cargar las cuentas
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              {error}
            </Typography>
            <Button 
              variant="contained" 
              onClick={refreshCuentas}
              startIcon={<RefreshIcon />}
              sx={{
                background: 'rgba(255,255,255,0.2)',
                color: '#fff',
                border: '1px solid rgba(255,255,255,0.3)',
                '&:hover': {
                  background: 'rgba(255,255,255,0.3)'
                }
              }}
            >
              Reintentar
            </Button>
          </StyledCard>
        </Container>
      </StyledContainer>
    );
  }

  return (
    <StyledContainer maxWidth="xl">
      {/* Header Simple */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box>
            <Typography variant="h3" sx={{ 
              fontWeight: 800, 
              color: '#fff',
              textShadow: '0 2px 4px rgba(0,0,0,0.3)',
              mb: 1
            }}>
              Cuentas por Pagar
            </Typography>
            <Typography variant="h6" sx={{ 
              color: 'rgba(255,255,255,0.8)',
              fontWeight: 400
            }}>
              Gestiona y analiza todas las cuentas pendientes de pago
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <ActionButton
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={refreshCuentas}
              sx={{
                background: 'rgba(255,255,255,0.2)',
                color: '#fff',
                border: '1px solid rgba(255,255,255,0.3)',
                '&:hover': {
                  background: 'rgba(255,255,255,0.3)'
                }
              }}
            >
              Actualizar
            </ActionButton>

            <ActionButton
              variant="contained"
              startIcon={<CalendarIcon />}
              onClick={() => setShowCalendar(!showCalendar)}
              sx={{
                background: 'rgba(255,255,255,0.2)',
                color: '#fff',
                border: '1px solid rgba(255,255,255,0.3)',
                '&:hover': {
                  background: 'rgba(255,255,255,0.3)'
                }
              }}
            >
              {showCalendar ? 'Ocultar' : 'Mostrar'} Calendario
            </ActionButton>

            <ActionButton
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleOpenModalRegistro}
              sx={{
                background: 'linear-gradient(135deg, #667eea, #764ba2)',
                color: '#fff',
                border: 'none',
                '&:hover': {
                  background: 'linear-gradient(135deg, #5a6fd8, #6a4190)',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 6px 20px rgba(102, 126, 234, 0.4)'
                }
              }}
            >
              Nueva Cuenta
            </ActionButton>

            <ExportButton 
              modules={[
                { id: 'cuentas-pagar', name: 'Cuentas por Pagar', description: 'Información de cuentas pendientes de pago' }
              ]}
              onExport={async (exportData) => {
                console.log('Exportando cuentas por pagar:', exportData);
                
                try {
                  // Preguntar al usuario si quiere exportar solo los filtrados o todos
                  const exportFiltered = window.confirm(
                    `¿Qué quieres exportar?\n\n` +
                    `• Solo cuentas filtradas (${cuentasFiltradas?.length || 0} cuentas)\n` +
                    `• Todas las cuentas (${cuentas?.length || 0} cuentas)\n\n` +
                    `Haz clic en "Aceptar" para exportar solo las filtradas, o "Cancelar" para exportar todas.`
                  );
                  
                  // Usar los datos filtrados o todos según la elección del usuario
                  const cuentasData = exportFiltered ? (cuentasFiltradas || []) : (cuentas || []);
                  
                  if (cuentasData.length === 0) {
                    showErrorMessage('No hay cuentas por pagar para exportar');
                    return;
                  }
                  
                  // Crear contenido del archivo según el formato
                  let content, filename, mimeType;
                  
                  if (exportData.format === 'csv') {
                    const headers = ['ID', 'Proveedor', 'Concepto', 'Monto Neto', 'Monto Con IVA', 'Fecha', 'Estado', 'Pagado', 'Comentarios'];
                    const csvContent = [
                      headers.join(','),
                      ...cuentasData.map(cuenta => [
                        cuenta.id,
                        (cuenta.proveedor || '').replace(/,/g, ';'),
                        (cuenta.concepto || '').replace(/,/g, ';'),
                        cuenta.monto_neto || '',
                        cuenta.monto_con_iva || '',
                        cuenta.fecha ? new Date(cuenta.fecha).toLocaleDateString() : '',
                        (cuenta.estado || '').replace(/,/g, ';'),
                        cuenta.pagado ? 'Sí' : 'No',
                        (cuenta.comentarios || '').replace(/,/g, ';')
                      ].join(','))
                    ].join('\n');
                    
                    content = csvContent;
                    filename = `cuentas_por_pagar_${new Date().toISOString().split('T')[0]}.csv`;
                    mimeType = 'text/csv';
                  } else if (exportData.format === 'excel') {
                    const headers = ['ID', 'Proveedor', 'Concepto', 'Monto Neto', 'Monto Con IVA', 'Fecha', 'Estado', 'Pagado', 'Comentarios'];
                    const tsvContent = [
                      headers.join('\t'),
                      ...cuentasData.map(cuenta => [
                        cuenta.id,
                        (cuenta.proveedor || '').replace(/\t/g, ' '),
                        (cuenta.concepto || '').replace(/\t/g, ' '),
                        cuenta.monto_neto || '',
                        cuenta.monto_con_iva || '',
                        cuenta.fecha ? new Date(cuenta.fecha).toLocaleDateString() : '',
                        (cuenta.estado || '').replace(/\t/g, ' '),
                        cuenta.pagado ? 'Sí' : 'No',
                        (cuenta.comentarios || '').replace(/\t/g, ' ')
                      ].join('\t'))
                    ].join('\n');
                    
                    content = tsvContent;
                    filename = `cuentas_por_pagar_${new Date().toISOString().split('T')[0]}.tsv`;
                    mimeType = 'text/tab-separated-values';
                  } else {
                    const htmlContent = `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reporte de Cuentas por Pagar</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #333; padding-bottom: 20px; }
        .cuenta-section { margin-bottom: 30px; border: 1px solid #ddd; padding: 15px; border-radius: 8px; }
        .cuenta-title { font-size: 18px; font-weight: bold; color: #333; margin-bottom: 15px; }
        .cuenta-details { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
        .detail-item { margin-bottom: 8px; }
        .detail-label { font-weight: bold; color: #666; }
    </style>
</head>
<body>
    <div class="header">
        <h1>💳 REPORTE DE CUENTAS POR PAGAR</h1>
        <p><strong>Fecha de exportación:</strong> ${new Date().toLocaleString()}</p>
        <p><strong>Total de cuentas:</strong> ${cuentasData.length}</p>
    </div>
    
    ${cuentasData.map((cuenta, index) => `
    <div class="cuenta-section">
        <div class="cuenta-title">📋 Cuenta ${index + 1}: ${cuenta.concepto || 'N/A'}</div>
        <div class="cuenta-details">
            <div class="detail-item">
                <span class="detail-label">ID:</span> ${cuenta.id}
            </div>
            <div class="detail-item">
                <span class="detail-label">Proveedor:</span> ${cuenta.proveedor || 'N/A'}
            </div>
            <div class="detail-item">
                <span class="detail-label">Monto Neto:</span> ${cuenta.monto_neto ? formatterMXN.format(cuenta.monto_neto) : 'N/A'}
            </div>
            <div class="detail-item">
                <span class="detail-label">Monto Con IVA:</span> ${cuenta.monto_con_iva ? formatterMXN.format(cuenta.monto_con_iva) : 'N/A'}
            </div>
            <div class="detail-item">
                <span class="detail-label">Fecha:</span> ${cuenta.fecha ? new Date(cuenta.fecha).toLocaleDateString() : 'N/A'}
            </div>
            <div class="detail-item">
                <span class="detail-label">Estado:</span> ${cuenta.estado || 'N/A'}
            </div>
            <div class="detail-item">
                <span class="detail-label">Pagado:</span> 
                <span style="color: ${cuenta.pagado ? '#27ae60' : '#e74c3c'}; font-weight: bold;">
                    ${cuenta.pagado ? 'Sí' : 'No'}
                </span>
            </div>
            <div class="detail-item">
                <span class="detail-label">Comentarios:</span> ${cuenta.comentarios || 'N/A'}
            </div>
        </div>
    </div>
    `).join('')}
</body>
</html>`;
                    
                    content = htmlContent;
                    filename = `cuentas_por_pagar_${new Date().toISOString().split('T')[0]}.html`;
                    mimeType = 'text/html';
                  }
                  
                  // Descargar archivo
                  const blob = new Blob([content], { type: mimeType });
                  const url = window.URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = filename;
                  document.body.appendChild(a);
                  a.click();
                  window.URL.revokeObjectURL(url);
                  document.body.removeChild(a);
                  
                  showSuccessMessage(`Cuentas por pagar exportadas exitosamente: ${cuentasData.length} cuentas en formato ${exportData.format.toUpperCase()}`);
                } catch (error) {
                  console.error('Error al exportar:', error);
                  showErrorMessage('Error al exportar cuentas por pagar');
                }
              }}
            />
          </Box>
        </Box>

        {/* 8 KPIs Diferentes y Útiles */}
        <Grid container spacing={3}>
          {/* KPI 1: Total Pagadas */}
          <Grid item xs={12} sm={6} md={3}>
            <motion.div whileHover={{ scale: 1.02 }}>
              <StatsCard color="success">
                <CheckCircleIcon sx={{ fontSize: 40, color: 'success.main', mb: 2 }} />
                <Typography variant="h4" sx={{ fontWeight: 800, color: 'success.main', mb: 1 }}>
                  {formatterMXN.format(totales.pagadas)}
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                  Total Pagadas
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  {cuentas?.filter(c => {
                    if (c.pagado === true) return true;
                    if (parseFloat(c.monto_transferencia || 0) > 0 || parseFloat(c.monto_efectivo || 0) > 0) return true;
                    if (c.estado_detallado === 'Pagada') return true;
                    return false;
                  }).length || 0} cuentas
                </Typography>
              </StatsCard>
            </motion.div>
          </Grid>

          {/* KPI 2: Total por Pagar */}
          <Grid item xs={12} sm={6} md={3}>
            <motion.div whileHover={{ scale: 1.02 }}>
              <StatsCard color="warning">
                <WarningIcon sx={{ fontSize: 40, color: 'warning.main', mb: 2 }} />
                <Typography variant="h4" sx={{ fontWeight: 800, color: 'warning.main', mb: 1 }}>
                  {formatterMXN.format(totales.porPagar)}
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                  Total por Pagar
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  {cuentas?.filter(c => {
                    if (c.pagado === true) return false;
                    if (parseFloat(c.monto_transferencia || 0) > 0 || parseFloat(c.monto_efectivo || 0) > 0) return false;
                    if (c.estado_detallado === 'Pagada') return false;
                    return true;
                  }).length || 0} cuentas
                </Typography>
              </StatsCard>
            </motion.div>
          </Grid>

          {/* KPI 3: Total General */}
          <Grid item xs={12} sm={6} md={3}>
            <motion.div whileHover={{ scale: 1.02 }}>
              <StatsCard color="info">
                <AccountBalanceIcon sx={{ fontSize: 40, color: 'info.main', mb: 2 }} />
                <Typography variant="h4" sx={{ fontWeight: 800, color: 'info.main', mb: 1 }}>
                  {formatterMXN.format(totales.general)}
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                  Total General
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  {cuentas?.length || 0} cuentas totales
                </Typography>
              </StatsCard>
            </motion.div>
          </Grid>

          {/* KPI 4: Cuentas Filtradas */}
          <Grid item xs={12} sm={6} md={3}>
            <motion.div whileHover={{ scale: 1.02 }}>
              <StatsCard>
                <FilterListIcon sx={{ fontSize: 40, color: 'primary.main', mb: 2 }} />
                <Typography variant="h4" sx={{ fontWeight: 800, color: 'primary.main', mb: 1 }}>
                  {formatterMXN.format(totales.filtradas)}
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                  Filtradas
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  {cuentasFiltradas?.length || 0} cuentas visibles
                </Typography>
              </StatsCard>
            </motion.div>
          </Grid>

          {/* KPI 5: Promedio por Cuenta */}
          <Grid item xs={12} sm={6} md={3}>
            <motion.div whileHover={{ scale: 1.02 }}>
              <StatsCard color="secondary">
                <TrendingUpIcon sx={{ fontSize: 40, color: 'secondary.main', mb: 2 }} />
                <Typography variant="h4" sx={{ fontWeight: 800, color: 'secondary.main', mb: 1 }}>
                  {formatterMXN.format(cuentas?.length > 0 ? totales.general / cuentas.length : 0)}
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                  Promedio por Cuenta
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  Monto promedio
                </Typography>
              </StatsCard>
            </motion.div>
          </Grid>

          {/* KPI 6: Cuentas Vencidas */}
          <Grid item xs={12} sm={6} md={3}>
            <motion.div whileHover={{ scale: 1.02 }}>
              <StatsCard color="error">
                <ScheduleIcon sx={{ fontSize: 40, color: 'error.main', mb: 2 }} />
                <Typography variant="h4" sx={{ fontWeight: 800, color: 'error.main', mb: 1 }}>
                  {formatterMXN.format(cuentas?.filter(c => {
                    if (c.pagado === 1) return false;
                    
                    // La fecha en la base de datos es la fecha de vencimiento
                    const fechaVencimiento = new Date(c.fecha);
                    const ahora = new Date();
                    
                    // Solo es vencida si la fecha de vencimiento ya pasó
                    const esVencida = fechaVencimiento < ahora;
                    
                    // Debug: Solo para las primeras 3 cuentas
                    if (cuentas.indexOf(c) < 3) {
                      console.log(`🔍 Debug Cuenta ${c.id}:`, {
                        concepto: c.concepto,
                        fecha: c.fecha,
                        fechaVencimiento: fechaVencimiento,
                        ahora: ahora,
                        esVencida: esVencida,
                        pagado: c.pagado,
                        diasHastaVencimiento: Math.ceil((fechaVencimiento - ahora) / (1000 * 60 * 60 * 24))
                      });
                    }
                    
                    return esVencida;
                  }).reduce((sum, c) => sum + parseFloat(c.monto_con_iva || c.monto_neto || 0), 0) || 0)}
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                  Cuentas Vencidas
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  {cuentas?.filter(c => {
                    // No incluir cuentas ya pagadas
                    if (c.pagado === true) return false;
                    if (parseFloat(c.monto_transferencia || 0) > 0 || parseFloat(c.monto_efectivo || 0) > 0) return false;
                    if (c.estado_detallado === 'Pagada') return false;
                    
                    // Solo es vencida si la fecha de vencimiento ya pasó
                    const fechaVencimiento = new Date(c.fecha);
                    const ahora = new Date();
                    return fechaVencimiento < ahora;
                  }).length || 0} cuentas
                </Typography>
              </StatsCard>
            </motion.div>
          </Grid>

          {/* KPI 7: Próximas a Vencer */}
          <Grid item xs={12} sm={6} md={3}>
            <motion.div whileHover={{ scale: 1.02 }}>
              <StatsCard color="warning">
                <CalendarIcon sx={{ fontSize: 40, color: 'warning.main', mb: 2 }} />
                <Typography variant="h4" sx={{ fontWeight: 800, color: 'warning.main', mb: 1 }}>
                  {formatterMXN.format(cuentas?.filter(c => {
                    // No incluir cuentas ya pagadas
                    if (c.pagado === true) return false;
                    if (parseFloat(c.monto_transferencia || 0) > 0 || parseFloat(c.monto_efectivo || 0) > 0) return false;
                    if (c.estado_detallado === 'Pagada') return false;
                    
                    const vencimiento = new Date(c.fecha);
                    const ahora = new Date();
                    const diasHastaVencimiento = Math.ceil((vencimiento - ahora) / (1000 * 60 * 60 * 24));
                    return diasHastaVencimiento > 0 && diasHastaVencimiento <= 7;
                  }).reduce((sum, c) => sum + parseFloat(c.monto_con_iva || c.monto_neto || 0), 0) || 0)}
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                  Próximas a Vencer
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  {cuentas?.filter(c => {
                    // No incluir cuentas ya pagadas
                    if (c.pagado === true) return false;
                    if (parseFloat(c.monto_transferencia || 0) > 0 || parseFloat(c.monto_efectivo || 0) > 0) return false;
                    if (c.estado_detallado === 'Pagada') return false;
                    
                    const vencimiento = new Date(c.fecha);
                    const ahora = new Date();
                    const diasHastaVencimiento = Math.ceil((vencimiento - ahora) / (1000 * 60 * 60 * 24));
                    return diasHastaVencimiento > 0 && diasHastaVencimiento <= 7;
                  }).length || 0} cuentas (7 días)
                </Typography>
              </StatsCard>
            </motion.div>
          </Grid>

          {/* KPI 8: Cuentas del Mes */}
          <Grid item xs={12} sm={6} md={3}>
            <motion.div whileHover={{ scale: 1.02 }}>
              <StatsCard color="secondary">
                <MonetizationOnIcon sx={{ fontSize: 40, color: 'secondary.main', mb: 2 }} />
                <Typography variant="h4" sx={{ fontWeight: 800, color: 'secondary.main', mb: 1 }}>
                  {formatterMXN.format(cuentas?.filter(c => {
                    const cuentaFecha = new Date(c.fecha);
                    const ahora = new Date();
                    return cuentaFecha.getMonth() === ahora.getMonth() && 
                           cuentaFecha.getFullYear() === ahora.getFullYear();
                  }).reduce((sum, c) => sum + parseFloat(c.monto_con_iva || c.monto_neto || 0), 0) || 0)}
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                  Cuentas del Mes
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  {cuentas?.filter(c => {
                    const cuentaFecha = new Date(c.fecha);
                    const ahora = new Date();
                    return cuentaFecha.getMonth() === ahora.getMonth() && 
                           cuentaFecha.getFullYear() === ahora.getFullYear();
                  }).length || 0} cuentas
                </Typography>
              </StatsCard>
            </motion.div>
          </Grid>
        </Grid>
      </Box>

      {/* Calendario Compacto */}
      {showCalendar && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
        >
          <StyledCard sx={{ mb: 4 }}>
            <CalendarPagos 
              cuentas={cuentasFiltradas || []}
              onEventClick={(event) => {
                setSelectedCuenta(event);
                setShowModalPagoParcial(true);
              }}
              onDateClick={(date) => {
                console.log('Fecha seleccionada:', date);
              }}
            />
          </StyledCard>
        </motion.div>
      )}

      {/* Sistema de Tabs Simple */}
      <StyledCard>
        <AppBar position="static" elevation={0} sx={{ 
          background: 'linear-gradient(90deg, #667eea, #764ba2)',
          borderRadius: '16px 16px 0 0'
        }}>
          <Tabs 
            value={currentTab} 
            onChange={handleTabChange}
            variant={isMobile ? "scrollable" : "fullWidth"}
            scrollButtons={isMobile ? "auto" : false}
            sx={{
              '& .MuiTab-root': {
                color: 'rgba(255,255,255,0.8)',
                fontWeight: 600,
                fontSize: '1rem',
                textTransform: 'none',
                '&.Mui-selected': {
                  color: '#fff',
                  fontWeight: 700
                }
              },
              '& .MuiTabs-indicator': {
                background: '#fff',
                height: 3
              }
            }}
          >
            <Tab 
              icon={<DashboardIcon />} 
              label="Dashboard" 
              iconPosition="start"
            />
            <Tab 
              icon={<FilterListIcon />} 
              label="Filtros" 
              iconPosition="start"
            />
            <Tab 
              icon={<TableIcon />} 
              label="Tabla de Cuentas" 
              iconPosition="start"
            />
          </Tabs>
        </AppBar>

        {/* Contenido de los Tabs */}
        <Box sx={{ p: 3 }}>
          {currentTab === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {console.log('🎯 Renderizando DashboardElegante con cuentas:', cuentas?.length || 0)}
                                              <DashboardElegante cuentas={cuentasFiltradas || []} />
            </motion.div>
          )}

          {currentTab === 1 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Filtros
                filtroMes={filtroMes}
                setFiltroMes={setFiltroMes}
                fechaInicio={fechaInicio}
                setFechaInicio={setFechaInicio}
                fechaFin={fechaFin}
                setFechaFin={setFechaFin}
                estadoFiltro={estadoFiltro}
                setEstadoFiltro={setEstadoFiltro}
                montoMinimo={montoMinimo}
                setMontoMinimo={setMontoMinimo}
                montoMaximo={montoMaximo}
                setMontoMaximo={setMontoMaximo}
                proveedorFiltro={proveedorFiltro}
                setProveedorFiltro={setProveedorFiltro}
                categoriaFiltro={categoriaFiltro}
                setCategoriaFiltro={setCategoriaFiltro}
                categorias={categorias}
                proveedores={proveedores}
              />
            </motion.div>
          )}

          {currentTab === 2 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <TablaCuentas
                cuentas={cuentasFiltradas || []}
                loading={cuentasLoading}
                error={error}
                onEdit={(cuenta) => {
                  setSelectedCuenta(cuenta);
                  setShowModalRegistro(true);
                }}
                onPagoParcial={handleOpenModalPagoParcial}
                onDelete={(id) => {
                  showSuccessMessage('Cuenta eliminada correctamente');
                }}
                onView={(cuenta) => {
                  setSelectedCuenta(cuenta);
                  setShowModalDetalles(true);
                }}
                onRefresh={refreshCuentas}
              />
            </motion.div>
          )}
        </Box>
      </StyledCard>

      {/* Modales */}
      <ModalRegistro
        open={showModalRegistro}
        onClose={handleCloseModals}
        cuenta={selectedCuenta}
        onSuccess={(message) => {
          showSuccessMessage(message);
          handleCloseModals();
          refreshCuentas();
        }}
        onError={showErrorMessage}
      />

      <ModalPagoParcial
        open={showModalPagoParcial}
        onClose={handleCloseModals}
        cuenta={selectedCuenta}
        onSuccess={(message) => {
          showSuccessMessage(message);
          handleCloseModals();
          refreshCuentas();
        }}
        onError={showErrorMessage}
      />

      {/* Modal de Detalles */}
      <Dialog
        open={showModalDetalles}
        onClose={handleCloseModals}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
          }
        }}
      >
        <DialogTitle sx={{ 
          fontWeight: 700, 
          color: '#2c3e50', 
          textAlign: 'center',
          borderBottom: '2px solid rgba(102, 126, 234, 0.2)',
          pb: 2
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
            <InfoIcon sx={{ color: '#667eea', fontSize: '2rem' }} />
            Detalles de la Cuenta por Pagar
          </Box>
        </DialogTitle>
        
        <DialogContent sx={{ mt: 2 }}>
          {selectedCuenta && (
            <Box>
              <Grid container spacing={3}>
                {/* Información Principal */}
                <Grid item xs={12}>
                  <Card sx={{ p: 3, mb: 3, background: 'rgba(255,255,255,0.9)' }}>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: '#2c3e50', mb: 2 }}>
                      📋 Información de la Cuenta
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6}>
                        <Typography variant="body2" sx={{ color: '#7f8c8d', fontWeight: 500 }}>
                          ID:
                        </Typography>
                        <Typography variant="body1" sx={{ fontWeight: 600, color: '#2c3e50' }}>
                          {selectedCuenta.id}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Typography variant="body2" sx={{ color: '#7f8c8d', fontWeight: 500 }}>
                          Estado:
                        </Typography>
                        <Chip
                          label={selectedCuenta.pagado ? 'Pagada' : 'Pendiente'}
                          color={selectedCuenta.pagado ? 'success' : 'warning'}
                          size="small"
                          sx={{ fontWeight: 600 }}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <Typography variant="body2" sx={{ color: '#7f8c8d', fontWeight: 500 }}>
                          Concepto:
                        </Typography>
                        <Typography variant="body1" sx={{ fontWeight: 600, color: '#2c3e50' }}>
                          {selectedCuenta.concepto || 'N/A'}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Typography variant="body2" sx={{ color: '#7f8c8d', fontWeight: 500 }}>
                          Monto Neto:
                        </Typography>
                        <Typography variant="body1" sx={{ fontWeight: 600, color: '#27ae60' }}>
                          {formatterMXN.format(selectedCuenta.monto_neto || 0)}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Typography variant="body2" sx={{ color: '#7f8c8d', fontWeight: 500 }}>
                          Monto Con IVA:
                        </Typography>
                        <Typography variant="body1" sx={{ fontWeight: 600, color: '#f39c12' }}>
                          {formatterMXN.format(selectedCuenta.monto_con_iva || 0)}
                        </Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography variant="body2" sx={{ color: '#7f8c8d', fontWeight: 500 }}>
                          Fecha:
                        </Typography>
                        <Typography variant="body1" sx={{ fontWeight: 600, color: '#2c3e50' }}>
                          {selectedCuenta.fecha ? new Date(selectedCuenta.fecha).toLocaleDateString('es-MX') : 'N/A'}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Card>
                </Grid>

                {/* Información del Proveedor */}
                <Grid item xs={12} md={6}>
                  <Card sx={{ p: 3, mb: 3, background: 'rgba(255,255,255,0.9)' }}>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: '#2c3e50', mb: 2 }}>
                      🏢 Información del Proveedor
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <Typography variant="body2" sx={{ color: '#7f8c8d', fontWeight: 500 }}>
                          Nombre:
                        </Typography>
                        <Typography variant="body1" sx={{ fontWeight: 600, color: '#2c3e50' }}>
                          {proveedores.find(p => p.id === selectedCuenta.proveedor_id)?.nombre || 'N/A'}
                        </Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography variant="body2" sx={{ color: '#7f8c8d', fontWeight: 500 }}>
                          ID Proveedor:
                        </Typography>
                        <Typography variant="body1" sx={{ fontWeight: 600, color: '#2c3e50' }}>
                          {selectedCuenta.proveedor_id || 'N/A'}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Card>
                </Grid>

                {/* Información de Categoría */}
                <Grid item xs={12} md={6}>
                  <Card sx={{ p: 3, mb: 3, background: 'rgba(255,255,255,0.9)' }}>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: '#2c3e50', mb: 2 }}>
                      🏷️ Información de Categoría
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <Typography variant="body2" sx={{ color: '#7f8c8d', fontWeight: 500 }}>
                          Categoría:
                        </Typography>
                        <Typography variant="body1" sx={{ fontWeight: 600, color: '#2c3e50' }}>
                          {categorias.find(c => c.id === selectedCuenta.categoria_id)?.nombre || 'N/A'}
                        </Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography variant="body2" sx={{ color: '#7f8c8d', fontWeight: 500 }}>
                          ID Categoría:
                        </Typography>
                        <Typography variant="body1" sx={{ fontWeight: 600, color: '#2c3e50' }}>
                          {selectedCuenta.categoria_id || 'N/A'}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Card>
                </Grid>

                {/* Comentarios */}
                {selectedCuenta.comentarios && (
                  <Grid item xs={12}>
                    <Card sx={{ p: 3, background: 'rgba(255,255,255,0.9)' }}>
                      <Typography variant="h6" sx={{ fontWeight: 700, color: '#2c3e50', mb: 2 }}>
                        💬 Comentarios
                      </Typography>
                      <Typography variant="body1" sx={{ color: '#2c3e50' }}>
                        {selectedCuenta.comentarios}
                      </Typography>
                    </Card>
                  </Grid>
                )}
              </Grid>
            </Box>
          )}
        </DialogContent>
        
        <DialogActions sx={{ p: 3, justifyContent: 'center', gap: 2 }}>
          <Button
            variant="outlined"
            onClick={handleCloseModals}
            sx={{
              border: '1px solid rgba(102, 126, 234, 0.3)',
              color: '#667eea',
              px: 3,
              '&:hover': {
                borderColor: '#667eea',
                background: 'rgba(102, 126, 234, 0.05)'
              }
            }}
          >
            Cerrar
          </Button>
          <Button
            variant="contained"
            onClick={() => {
              setShowModalDetalles(false);
              setShowModalRegistro(true);
            }}
            sx={{
              background: 'linear-gradient(135deg, #667eea, #764ba2)',
              color: '#fff',
              px: 4,
              py: 1.5,
              fontWeight: 'bold',
              borderRadius: 2,
              '&:hover': {
                background: 'linear-gradient(135deg, #5a6fd8, #6a4190)',
                transform: 'translateY(-2px)',
                boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)'
              }
            }}
          >
            Editar Cuenta
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar para mensajes */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        TransitionComponent={SlideTransition}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleSnackbarClose} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </StyledContainer>
  );
};

// Formateador de moneda
const formatterMXN = new Intl.NumberFormat('es-MX', {
  style: 'currency',
  currency: 'MXN',
  minimumFractionDigits: 2,
});

export default CuentasPagarForm;



