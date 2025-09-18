import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Container,
  Paper,
  Box,
  Typography,
  useTheme,
  useMediaQuery,
  Card,
  CardContent,
  Grid,
  Chip,
  Avatar,
  IconButton,
  Tooltip,
  Fade,
  Button,
  Alert,
  Skeleton,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Badge,
  Switch,
  FormControlLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Menu,
  ListItemIcon,
  Stack,
  InputBase
} from '@mui/material';
import {
  AccountBalance,
  Add,
  Search,
  Download,
  Delete,
  Edit,
  Visibility,
  MoreVert,
  Payment,
  Pending,
  CheckCircle,
  Warning,
  ErrorOutline,
  Info,
  TrendingUp,
  TrendingDown,
  FilterList,
  Refresh,
  CalendarToday,
  AttachMoney,
  Business,
  Category,
  DateRange,
  Sort,
  Clear,
  FilterAlt,
  SortByAlpha,
  MonetizationOn
} from '@mui/icons-material';
import { styled, alpha } from '@mui/material/styles';
import { motion, AnimatePresence } from 'framer-motion';
import { useCuentasPagar } from '../../../hooks/useCuentasPagar';
import { useNotify } from '../../../hooks/useNotify.js';
import axios from 'axios';

// ========================================
// COMPONENTES ESTILIZADOS MEJORADOS
// ========================================

const StyledContainer = styled(Container)(({ theme }) => ({
  paddingTop: theme.spacing(3),
  paddingBottom: theme.spacing(3),
  minHeight: '100vh',
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: `
      radial-gradient(circle at 25% 25%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 75% 75%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
      url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.05"%3E%3Ccircle cx="30" cy="30" r="1.5"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")
    `,
    pointerEvents: 'none',
    animation: 'float 15s ease-in-out infinite'
  },
  '@keyframes float': {
    '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
    '50%': { transform: 'translateY(-10px) rotate(180deg)' }
  }
}));

const StyledCard = styled(Card)(({ theme }) => ({
  background: 'rgba(255,255,255,0.98)',
  backdropFilter: 'blur(20px)',
  borderRadius: 20,
  boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
  border: '2px solid rgba(255,255,255,0.3)',
  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
  overflow: 'hidden',
  position: 'relative',
  '&:hover': {
    transform: 'translateY(-8px) scale(1.01)',
    boxShadow: '0 20px 50px rgba(0,0,0,0.18)',
    '&::before': {
      opacity: 1
    }
  },
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.05), rgba(118, 75, 162, 0.05))',
    opacity: 0,
    transition: 'opacity 0.3s ease',
    pointerEvents: 'none'
  }
}));

const StatCard = styled(Card)(({ theme, color }) => ({
  background: `linear-gradient(135deg, ${color}08, ${color}15)`,
  border: `2px solid ${color}20`,
  borderRadius: 16,
  padding: theme.spacing(2.5),
  textAlign: 'center',
  transition: 'all 0.3s ease',
  position: 'relative',
  overflow: 'hidden',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: `0 12px 24px ${color}25`
  },
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '3px',
    background: `linear-gradient(90deg, ${color}, ${color}80)`
  }
}));

const StyledTable = styled(TableContainer)(({ theme }) => ({
  borderRadius: 16,
  overflow: 'hidden',
  boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
  border: '1px solid rgba(0,0,0,0.08)',
  background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
  '& .MuiTableHead-root': {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    position: 'relative',
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'linear-gradient(45deg, transparent, rgba(255,255,255,0.1), transparent)',
      animation: 'shimmer 2s infinite'
    },
    '& .MuiTableCell-head': {
      color: 'white',
      fontWeight: 800,
      fontSize: '0.9rem',
      textTransform: 'uppercase',
      letterSpacing: '0.8px',
      textShadow: '0 1px 2px rgba(0,0,0,0.2)',
      borderBottom: 'none',
      padding: theme.spacing(2),
      position: 'relative',
      zIndex: 2,
      '&::after': {
        content: '""',
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '2px',
        background: 'rgba(255,255,255,0.3)'
      }
    }
  },
  '& .MuiTableRow-root': {
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    position: 'relative',
    '&:hover': {
      backgroundColor: 'rgba(102, 126, 234, 0.08)',
      transform: 'scale(1.01)',
      boxShadow: '0 4px 20px rgba(102, 126, 234, 0.15)',
      zIndex: 1
    },
    '&:nth-of-type(even)': {
      backgroundColor: 'rgba(0,0,0,0.02)'
    },
    '&:nth-of-type(odd)': {
      backgroundColor: 'rgba(255,255,255,0.5)'
    }
  },
  '& .MuiTableCell-root': {
    borderBottom: '1px solid rgba(0,0,0,0.06)',
    padding: theme.spacing(2),
    position: 'relative'
  },
  '& .MuiTableBody-root .MuiTableRow-root:last-child .MuiTableCell-root': {
    borderBottom: 'none'
  },
  '@keyframes shimmer': {
    '0%': { transform: 'translateX(-100%)' },
    '100%': { transform: 'translateX(100%)' }
  }
}));

const SearchField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.9)',
    '& fieldset': {
      borderColor: 'rgba(0,0,0,0.1)',
      borderWidth: 1
    },
    '&:hover fieldset': {
      borderColor: theme.palette.primary.main
    },
    '&.Mui-focused fieldset': {
      borderColor: theme.palette.primary.main,
      borderWidth: 2
    }
  }
}));

const FilterButton = styled(Button)(({ theme, active }) => ({
  borderRadius: 8,
  textTransform: 'none',
  fontWeight: 500,
  padding: theme.spacing(1, 2),
  backgroundColor: active ? theme.palette.primary.main : 'rgba(255,255,255,0.8)',
  color: active ? 'white' : theme.palette.text.primary,
  border: `1px solid ${active ? theme.palette.primary.main : 'rgba(0,0,0,0.1)'}`,
  '&:hover': {
    backgroundColor: active ? theme.palette.primary.dark : 'rgba(255,255,255,1)',
    transform: 'translateY(-1px)'
  }
}));

const ActionButton = styled(IconButton)(({ theme, variant }) => ({
  borderRadius: 8,
  padding: theme.spacing(0.8),
  transition: 'all 0.2s ease',
  ...(variant === 'edit' && {
    color: '#1976d2',
    backgroundColor: 'rgba(25, 118, 210, 0.08)',
    '&:hover': {
      backgroundColor: 'rgba(25, 118, 210, 0.15)',
      transform: 'scale(1.1)'
    }
  }),
  ...(variant === 'delete' && {
    color: '#d32f2f',
    backgroundColor: 'rgba(211, 47, 47, 0.08)',
    '&:hover': {
      backgroundColor: 'rgba(211, 47, 47, 0.15)',
      transform: 'scale(1.1)'
    }
  }),
  ...(variant === 'view' && {
    color: '#388e3c',
    backgroundColor: 'rgba(56, 142, 60, 0.08)',
    '&:hover': {
      backgroundColor: 'rgba(56, 142, 60, 0.15)',
      transform: 'scale(1.1)'
    }
  })
}));

const CuentasPagarList = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const notify = useNotify();

  const { cuentas, loading, error, fetchCuentas, updateCuenta, deleteCuenta } = useCuentasPagar();
  
  // Estados para proveedores
  const [proveedores, setProveedores] = useState([]);
  const [showProviderDialog, setShowProviderDialog] = useState(false);
  const [selectedCuentaForProvider, setSelectedCuentaForProvider] = useState(null);
  const [selectedProviderId, setSelectedProviderId] = useState('');
  
  // Cargar proveedores al montar el componente
  useEffect(() => {
    const fetchProveedores = async () => {
      try {
        const response = await axios.get('/api/proveedores');
        const proveedoresData = Array.isArray(response.data?.data) ? response.data.data : response.data;
        setProveedores(proveedoresData);
      } catch (error) {
        console.error('Error cargando proveedores:', error);
      }
    };
    
    fetchProveedores();
  }, []);
  
  // Estados locales
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('fecha');
  const [sortOrder, setSortOrder] = useState('desc');
  const [selectedCuentas, setSelectedCuentas] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [cuentaToDelete, setCuentaToDelete] = useState(null);
  const [cuentaToPay, setCuentaToPay] = useState(null);
  const [bulkAction, setBulkAction] = useState(null);
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [showDateFilters, setShowDateFilters] = useState(false);

  // Estadísticas calculadas
  const stats = useMemo(() => {
    const total = cuentas.length;
    const pagadas = cuentas.filter(c => c.pagado).length;
    const pendientes = total - pagadas;
    const montoTotal = cuentas.reduce((sum, c) => sum + parseFloat(c.monto_con_iva || 0), 0);
    const montoPagado = cuentas.filter(c => c.pagado).reduce((sum, c) => sum + parseFloat(c.monto_con_iva || 0), 0);
    const montoPendiente = montoTotal - montoPagado;

    return {
      total,
      pagadas,
      pendientes,
      montoTotal,
      montoPagado,
      montoPendiente
    };
  }, [cuentas]);

  // Filtrar y ordenar cuentas
  const filteredAndSortedCuentas = useMemo(() => {
    let filtered = cuentas;

    // Filtro por búsqueda
    if (searchTerm) {
      filtered = filtered.filter(cuenta =>
        cuenta.concepto?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cuenta.categoria?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cuenta.proveedor_nombre?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtro por estado
    if (statusFilter !== 'all') {
      filtered = filtered.filter(cuenta => {
        if (statusFilter === 'pagadas') return cuenta.pagado;
        if (statusFilter === 'pendientes') return !cuenta.pagado;
        if (statusFilter === 'sin_proveedor') return !cuenta.proveedor_nombre;
        return true;
      });
    }

    // Filtro por rango de fechas
    if (fechaInicio && fechaFin) {
      const inicio = new Date(fechaInicio);
      const fin = new Date(fechaFin);
      fin.setDate(fin.getDate() + 1); // Incluir el día final
      
      filtered = filtered.filter(cuenta => {
        const fechaCuenta = new Date(cuenta.fecha);
        return fechaCuenta >= inicio && fechaCuenta < fin;
      });
    } else if (fechaInicio) {
      const inicio = new Date(fechaInicio);
      filtered = filtered.filter(cuenta => {
        const fechaCuenta = new Date(cuenta.fecha);
        return fechaCuenta >= inicio;
      });
    } else if (fechaFin) {
      const fin = new Date(fechaFin);
      fin.setDate(fin.getDate() + 1);
      filtered = filtered.filter(cuenta => {
        const fechaCuenta = new Date(cuenta.fecha);
        return fechaCuenta < fin;
      });
    }

    // Ordenar
    filtered.sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'fecha':
          aValue = new Date(a.fecha);
          bValue = new Date(b.fecha);
          break;
        case 'monto':
          aValue = parseFloat(a.monto_con_iva || 0);
          bValue = parseFloat(b.monto_con_iva || 0);
          break;
        case 'concepto':
          aValue = a.concepto || '';
          bValue = b.concepto || '';
          break;
        default:
          aValue = a[sortBy] || '';
          bValue = b[sortBy] || '';
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [cuentas, searchTerm, statusFilter, sortBy, sortOrder, fechaInicio, fechaFin]);

  // Paginación
  const paginatedCuentas = useMemo(() => {
    const start = page * rowsPerPage;
    return filteredAndSortedCuentas.slice(start, start + rowsPerPage);
  }, [filteredAndSortedCuentas, page, rowsPerPage]);

  // Handlers
  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    setPage(0);
  };

  const handleStatusFilter = (status) => {
    setStatusFilter(status);
    setPage(0);
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const handleSelectAll = () => {
    if (selectedCuentas.length === paginatedCuentas.length) {
      setSelectedCuentas([]);
    } else {
      setSelectedCuentas(paginatedCuentas.map(c => c.id));
    }
  };

  const handleSelectCuenta = (cuentaId) => {
    setSelectedCuentas(prev =>
      prev.includes(cuentaId)
        ? prev.filter(id => id !== cuentaId)
        : [...prev, cuentaId]
    );
  };

  const handleTogglePagado = (cuenta) => {
    setCuentaToPay(cuenta);
    setShowPaymentDialog(true);
  };

  const handleConfirmPayment = async () => {
    if (!cuentaToPay) return;
    
    try {
      await updateCuenta(cuentaToPay.id, { pagado: !cuentaToPay.pagado });
      setShowPaymentDialog(false);
      setCuentaToPay(null);
      fetchCuentas();
    } catch (error) {
      console.error('Error al actualizar cuenta:', error);
    }
  };

  const handleDelete = (cuenta) => {
    setCuentaToDelete(cuenta);
    setShowDeleteDialog(true);
  };

  const handleConfirmDelete = async () => {
    if (!cuentaToDelete) return;
    
    try {
      await deleteCuenta(cuentaToDelete.id);
      setShowDeleteDialog(false);
      setCuentaToDelete(null);
      fetchCuentas();
    } catch (error) {
      console.error('Error al eliminar cuenta:', error);
    }
  };

  const handleAssignProvider = (cuenta) => {
    setSelectedCuentaForProvider(cuenta);
    setSelectedProviderId(cuenta.proveedor_id || '');
    setShowProviderDialog(true);
  };

  const handleSaveProvider = async () => {
    if (!selectedCuentaForProvider || !selectedProviderId) return;
    
    try {
      await updateCuenta(selectedCuentaForProvider.id, { proveedor_id: parseInt(selectedProviderId) });
      setShowProviderDialog(false);
      setSelectedCuentaForProvider(null);
      setSelectedProviderId('');
      // Recargar datos
      fetchCuentas();
    } catch (error) {
      console.error('Error asignando proveedor:', error);
    }
  };

  const handleCloseProviderDialog = () => {
    setShowProviderDialog(false);
    setSelectedCuentaForProvider(null);
    setSelectedProviderId('');
  };

  const handleBulkAction = (action) => {
    if (selectedCuentas.length === 0) {
      notify.warning({
        title: 'Selección requerida',
        description: 'Por favor selecciona al menos una cuenta para continuar'
      });
      return;
    }
    setBulkAction(action);
  };

  const handleConfirmBulkAction = async () => {
    if (!bulkAction || selectedCuentas.length === 0) return;
    
    try {
      const promises = selectedCuentas.map(cuentaId => {
        const cuenta = cuentas.find(c => c.id === cuentaId);
        if (bulkAction === 'mark_paid') {
          return updateCuenta(cuentaId, { pagado: true });
        } else if (bulkAction === 'mark_unpaid') {
          return updateCuenta(cuentaId, { pagado: false });
        } else if (bulkAction === 'delete') {
          return deleteCuenta(cuentaId);
        }
      });
      
      await Promise.all(promises);
      setSelectedCuentas([]);
      setBulkAction(null);
      fetchCuentas();
    } catch (error) {
      console.error('Error en acción en lote:', error);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(amount);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('es-MX');
  };

  // Función para obtener el color de vencimiento
  const getVencimientoColor = (cuenta) => {
    if (cuenta.pagado) return '#27ae60'; // Verde si está pagada
    
    const hoy = new Date();
    const fechaVencimiento = new Date(cuenta.fecha_vencimiento || cuenta.fecha);
    const diffTime = fechaVencimiento - hoy;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return '#e74c3c'; // Rojo si está vencida
    if (diffDays === 0) return '#e67e22'; // Naranja si vence hoy
    if (diffDays === 1) return '#f39c12'; // Amarillo si vence mañana
    if (diffDays <= 7) return '#f1c40f'; // Amarillo claro si vence en una semana
    
    return '#95a5a6'; // Gris para fechas futuras
  };

  // Función para obtener el patrón de fondo
  const getBackgroundPattern = (cuenta) => {
    if (cuenta.pagado) return 'linear-gradient(135deg, #d5f4e6 0%, #a8e6cf 100%)'; // Verde suave
    if (cuenta.autorizado) return 'linear-gradient(135deg, #ffeaa7 0%, #fdcb6e 100%)'; // Naranja suave
    
    const hoy = new Date();
    const fechaVencimiento = new Date(cuenta.fecha_vencimiento || cuenta.fecha);
    const diffTime = fechaVencimiento - hoy;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'linear-gradient(135deg, #ffebee 0%, #ffcdd2 100%)'; // Rojo suave si vencida
    if (diffDays === 0) return 'linear-gradient(135deg, #fff3e0 0%, #ffcc80 100%)'; // Naranja suave si vence hoy
    if (diffDays === 1) return 'linear-gradient(135deg, #fffde7 0%, #fff59d 100%)'; // Amarillo suave si vence mañana
    if (diffDays <= 7) return 'linear-gradient(135deg, #f9fbe7 0%, #f0f4c3 100%)'; // Amarillo muy suave si vence en una semana
    
    return 'linear-gradient(135deg, #fafafa 0%, #f5f5f5 100%)'; // Gris muy suave para fechas futuras
  };

  // Función para obtener el ícono de estado
  const getStatusIcon = (cuenta) => {
    if (cuenta.pagado) return <CheckCircle sx={{ color: '#27ae60' }} />;
    if (cuenta.autorizado) return <Warning sx={{ color: '#f39c12' }} />;
    
    const hoy = new Date();
    const fechaVencimiento = new Date(cuenta.fecha_vencimiento || cuenta.fecha);
    const diffTime = fechaVencimiento - hoy;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return <ErrorOutline sx={{ color: '#e74c3c' }} />;
    if (diffDays === 0) return <Warning sx={{ color: '#e67e22' }} />;
    if (diffDays === 1) return <Warning sx={{ color: '#f39c12' }} />;
    
    return <Info sx={{ color: '#95a5a6' }} />;
  };

  // Función para obtener el texto de estado
  const getStatusText = (cuenta) => {
    if (cuenta.pagado) return 'Pagada';
    if (cuenta.autorizado) return 'Autorizada';
    
    const hoy = new Date();
    const fechaVencimiento = new Date(cuenta.fecha_vencimiento || cuenta.fecha);
    const diffTime = fechaVencimiento - hoy;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return `Vencida hace ${Math.abs(diffDays)} días`;
    if (diffDays === 0) return 'Vence hoy';
    if (diffDays === 1) return 'Vence mañana';
    if (diffDays <= 7) return `Vence en ${diffDays} días`;
    
    return 'Pendiente';
  };

  const getStatusChip = (cuenta) => {
    const color = getVencimientoColor(cuenta);
    const text = getStatusText(cuenta);
    const icon = getStatusIcon(cuenta);
    
    return (
      <Chip
        icon={icon}
        label={text}
        sx={{ 
          backgroundColor: color,
          color: 'white',
          fontWeight: 600,
          fontSize: '0.75rem',
          '& .MuiChip-icon': {
            color: 'white !important'
          }
        }}
        size="small"
      />
    );
  };

  if (loading) {
    return (
      <StyledContainer maxWidth="xl">
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <Skeleton variant="rectangular" height={200} sx={{ borderRadius: 3 }} />
          <Skeleton variant="rectangular" height={400} sx={{ borderRadius: 3 }} />
        </Box>
      </StyledContainer>
    );
  }

  if (error) {
    return (
      <StyledContainer maxWidth="xl">
        <Alert severity="error" sx={{ borderRadius: 3 }}>
          Error al cargar las cuentas: {error}
        </Alert>
      </StyledContainer>
    );
  }

  return (
    <StyledContainer maxWidth="xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Header con estadísticas */}
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              color: '#2c3e50',
              textAlign: 'center',
              mb: 3,
              textShadow: 'none'
            }}
          >
            <AccountBalance sx={{ mr: 2, verticalAlign: 'middle', color: '#667eea' }} />
            Lista de Cuentas por Pagar
          </Typography>

          {/* Tarjetas de estadísticas */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6} md={3}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <StatCard color="#667eea">
                  <Typography variant="h3" sx={{ fontWeight: 700, color: '#2c3e50', mb: 1 }}>
                    {stats.total}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#7f8c8d', fontWeight: 500 }}>
                    Total Cuentas
                  </Typography>
                </StatCard>
              </motion.div>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <StatCard color="#27ae60">
                  <Typography variant="h3" sx={{ fontWeight: 700, color: '#2c3e50', mb: 1 }}>
                    {stats.pagadas}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#7f8c8d', fontWeight: 500 }}>
                    Pagadas
                  </Typography>
                </StatCard>
              </motion.div>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <StatCard color="#e67e22">
                  <Typography variant="h3" sx={{ fontWeight: 700, color: '#2c3e50', mb: 1 }}>
                    {stats.pendientes}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#7f8c8d', fontWeight: 500 }}>
                    Pendientes
                  </Typography>
                </StatCard>
              </motion.div>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <StatCard color="#e74c3c">
                  <Typography variant="h4" sx={{ fontWeight: 700, color: '#2c3e50', mb: 1 }}>
                    {formatCurrency(stats.montoPendiente)}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#7f8c8d', fontWeight: 500 }}>
                    Monto Pendiente
                  </Typography>
                </StatCard>
              </motion.div>
            </Grid>
          </Grid>
        </Box>

        {/* Controles de filtrado y búsqueda */}
        <StyledCard sx={{ mb: 3 }}>
          <CardContent>
            {/* Búsqueda */}
            <Grid container spacing={3} alignItems="center" sx={{ mb: 2 }}>
              <Grid item xs={12} md={8}>
                <SearchField
                  fullWidth
                  placeholder="Buscar por concepto, categoría o proveedor..."
                  value={searchTerm}
                  onChange={handleSearch}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search sx={{ color: '#7f8c8d' }} />
                      </InputAdornment>
                    ),
                    endAdornment: searchTerm && (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setSearchTerm('')} size="small">
                          <Clear sx={{ color: '#7f8c8d' }} />
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                />
              </Grid>
              
              <Grid item xs={12} md={4}>
                <Button
                  variant="outlined"
                  startIcon={<Refresh />}
                  onClick={fetchCuentas}
                  fullWidth
                  sx={{ borderRadius: 2, height: '56px' }}
                >
                  Actualizar
                </Button>
              </Grid>
            </Grid>

            {/* Filtros organizados */}
            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#2c3e50' }}>
                  Filtros por Estado
                </Typography>
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<DateRange />}
                  onClick={() => setShowDateFilters(!showDateFilters)}
                  sx={{ 
                    borderRadius: 2,
                    textTransform: 'none',
                    fontWeight: 500
                  }}
                >
                  {showDateFilters ? 'Ocultar Fechas' : 'Filtros por Fecha'}
                </Button>
              </Box>
              
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                <FilterButton
                  active={statusFilter === 'all'}
                  onClick={() => handleStatusFilter('all')}
                  startIcon={<FilterList />}
                >
                  Todos ({stats.total})
                </FilterButton>
                <FilterButton
                  active={statusFilter === 'pagadas'}
                  onClick={() => handleStatusFilter('pagadas')}
                  startIcon={<CheckCircle />}
                >
                  Pagadas ({stats.pagadas})
                </FilterButton>
                <FilterButton
                  active={statusFilter === 'pendientes'}
                  onClick={() => handleStatusFilter('pendientes')}
                  startIcon={<Warning />}
                >
                  Pendientes ({stats.pendientes})
                </FilterButton>
                <FilterButton
                  active={statusFilter === 'sin_proveedor'}
                  onClick={() => handleStatusFilter('sin_proveedor')}
                  startIcon={<Business />}
                >
                  Sin Proveedor
                </FilterButton>
              </Stack>

              {/* Filtros por fecha */}
              {showDateFilters && (
                <Box sx={{ 
                  mt: 2, 
                  p: 2, 
                  backgroundColor: 'rgba(102, 126, 234, 0.05)', 
                  borderRadius: 2,
                  border: '1px solid rgba(102, 126, 234, 0.1)'
                }}>
                  <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600, color: '#2c3e50' }}>
                    Filtro por Rango de Fechas
                  </Typography>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} sm={4}>
                      <TextField
                        fullWidth
                        type="date"
                        label="Fecha de Inicio"
                        value={fechaInicio}
                        onChange={(e) => setFechaInicio(e.target.value)}
                        InputLabelProps={{ shrink: true }}
                        sx={{ 
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 2
                          }
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <TextField
                        fullWidth
                        type="date"
                        label="Fecha de Fin"
                        value={fechaFin}
                        onChange={(e) => setFechaFin(e.target.value)}
                        InputLabelProps={{ shrink: true }}
                        sx={{ 
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 2
                          }
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <Stack direction="row" spacing={1}>
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() => {
                            setFechaInicio('');
                            setFechaFin('');
                          }}
                          sx={{ borderRadius: 2 }}
                        >
                          Limpiar
                        </Button>
                        <Button
                          variant="contained"
                          size="small"
                          onClick={() => {
                            const hoy = new Date();
                            const hace30Dias = new Date();
                            hace30Dias.setDate(hoy.getDate() - 30);
                            setFechaInicio(hace30Dias.toISOString().split('T')[0]);
                            setFechaFin(hoy.toISOString().split('T')[0]);
                          }}
                          sx={{ 
                            borderRadius: 2,
                            background: 'linear-gradient(135deg, #667eea, #764ba2)',
                            '&:hover': {
                              background: 'linear-gradient(135deg, #5a6fd8, #6a4190)'
                            }
                          }}
                        >
                          Últimos 30 días
                        </Button>
                      </Stack>
                    </Grid>
                  </Grid>
                  {(fechaInicio || fechaFin) && (
                    <Box sx={{ mt: 2, p: 1, backgroundColor: 'rgba(52, 152, 219, 0.1)', borderRadius: 1 }}>
                      <Typography variant="caption" sx={{ color: '#2980b9', fontWeight: 500 }}>
                        📅 Filtro activo: 
                        {fechaInicio && ` Desde ${new Date(fechaInicio).toLocaleDateString('es-MX')}`}
                        {fechaInicio && fechaFin && ' hasta '}
                        {fechaFin && ` ${new Date(fechaFin).toLocaleDateString('es-MX')}`}
                        {!fechaInicio && fechaFin && ` Hasta ${new Date(fechaFin).toLocaleDateString('es-MX')}`}
                      </Typography>
                    </Box>
                  )}
                </Box>
              )}
            </Box>

            {/* Acciones en lote */}
            {selectedCuentas.length > 0 && (
              <Box sx={{ 
                p: 2, 
                backgroundColor: 'rgba(102, 126, 234, 0.1)', 
                borderRadius: 2,
                border: '1px solid rgba(102, 126, 234, 0.2)'
              }}>
                <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600, color: '#2c3e50' }}>
                  Acciones en Lote ({selectedCuentas.length} seleccionadas)
                </Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                  <Button
                    variant="contained"
                    size="small"
                    startIcon={<CheckCircle />}
                    onClick={() => handleBulkAction('mark_paid')}
                    sx={{ 
                      backgroundColor: '#27ae60',
                      '&:hover': { backgroundColor: '#229954' }
                    }}
                  >
                    Marcar como Pagadas
                  </Button>
                  <Button
                    variant="contained"
                    size="small"
                    startIcon={<Warning />}
                    onClick={() => handleBulkAction('mark_unpaid')}
                    sx={{ 
                      backgroundColor: '#e67e22',
                      '&:hover': { backgroundColor: '#d35400' }
                    }}
                  >
                    Marcar como Pendientes
                  </Button>
                  <Button
                    variant="contained"
                    size="small"
                    startIcon={<Delete />}
                    onClick={() => handleBulkAction('delete')}
                    sx={{ 
                      backgroundColor: '#e74c3c',
                      '&:hover': { backgroundColor: '#c0392b' }
                    }}
                  >
                    Eliminar Seleccionadas
                  </Button>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => setSelectedCuentas([])}
                  >
                    Limpiar Selección
                  </Button>
                </Stack>
              </Box>
            )}
          </CardContent>
        </StyledCard>

        {/* Tabla de cuentas */}
        <StyledCard>
          <CardContent sx={{ p: 0 }}>
            <StyledTable>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell padding="checkbox">
                      <Switch
                        checked={selectedCuentas.length === paginatedCuentas.length && paginatedCuentas.length > 0}
                        indeterminate={selectedCuentas.length > 0 && selectedCuentas.length < paginatedCuentas.length}
                        onChange={handleSelectAll}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Button
                        onClick={() => handleSort('concepto')}
                        endIcon={<Sort />}
                        sx={{ color: 'white', fontWeight: 600, textTransform: 'none' }}
                      >
                        Concepto
                      </Button>
                    </TableCell>
                    <TableCell align="right">
                      <Button
                        onClick={() => handleSort('monto_con_iva')}
                        endIcon={<Sort />}
                        sx={{ color: 'white', fontWeight: 600, textTransform: 'none' }}
                      >
                        Monto
                      </Button>
                    </TableCell>
                    <TableCell>
                      <Button
                        onClick={() => handleSort('categoria')}
                        endIcon={<Sort />}
                        sx={{ color: 'white', fontWeight: 600, textTransform: 'none' }}
                      >
                        Categoría
                      </Button>
                    </TableCell>
                    <TableCell>
                      <Button
                        onClick={() => handleSort('proveedor_nombre')}
                        endIcon={<Sort />}
                        sx={{ color: 'white', fontWeight: 600, textTransform: 'none' }}
                      >
                        Proveedor
                      </Button>
                    </TableCell>
                    <TableCell>
                      <Button
                        onClick={() => handleSort('fecha')}
                        endIcon={<Sort />}
                        sx={{ color: 'white', fontWeight: 600, textTransform: 'none' }}
                      >
                        Fecha
                      </Button>
                    </TableCell>
                    <TableCell align="center">Estado</TableCell>
                    <TableCell align="center">Acciones</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <AnimatePresence>
                    {paginatedCuentas.map((cuenta) => (
                      <motion.tr
                        key={cuenta.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                        style={{
                          background: getBackgroundPattern(cuenta),
                          borderLeft: `4px solid ${getVencimientoColor(cuenta)}`,
                          borderRadius: '8px',
                          marginBottom: '4px'
                        }}
                      >
                        <TableCell padding="checkbox">
                          <Switch
                            checked={selectedCuentas.includes(cuenta.id)}
                            onChange={() => handleSelectCuenta(cuenta.id)}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <Box>
                            <Typography variant="body2" fontWeight={600} sx={{ color: '#2c3e50' }}>
                              {cuenta.concepto || 'Sin concepto'}
                            </Typography>
                            {cuenta.pagos_parciales > 0 && (
                              <Typography variant="caption" sx={{ color: '#7f8c8d' }}>
                                Pago parcial: {formatCurrency(cuenta.pagos_parciales)}
                              </Typography>
                            )}
                          </Box>
                        </TableCell>
                        <TableCell align="right">
                          <Typography variant="body2" fontWeight={600} sx={{ color: '#2c3e50' }}>
                            {formatCurrency(cuenta.monto_con_iva || 0)}
                          </Typography>
                          {cuenta.requiere_iva && (
                            <Chip label="IVA" size="small" color="info" sx={{ ml: 1 }} />
                          )}
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={cuenta.categoria || 'Sin categoría'}
                            size="small"
                            variant="outlined"
                            sx={{ fontWeight: 500 }}
                          />
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Avatar sx={{ 
                              width: 28, 
                              height: 28, 
                              fontSize: '0.75rem', 
                              bgcolor: cuenta.proveedor_nombre ? '#667eea' : '#e74c3c'
                            }}>
                              {cuenta.proveedor_nombre?.charAt(0) || '?'}
                            </Avatar>
                            <Box>
                              <Typography variant="body2" sx={{ color: '#2c3e50' }}>
                                {cuenta.proveedor_nombre || 'Sin proveedor'}
                              </Typography>
                              {!cuenta.proveedor_nombre && (
                                <Typography variant="caption" sx={{ color: '#e74c3c', fontStyle: 'italic' }}>
                                  Requiere asignación
                                </Typography>
                              )}
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" sx={{ color: '#2c3e50' }}>
                            {formatDate(cuenta.fecha)}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          {getStatusChip(cuenta)}
                        </TableCell>
                        <TableCell align="center">
                          <Stack direction="row" spacing={1} justifyContent="center">
                            <Tooltip title="Asignar proveedor">
                              <ActionButton
                                variant="view"
                                onClick={() => handleAssignProvider(cuenta)}
                                size="small"
                              >
                                <Business />
                              </ActionButton>
                            </Tooltip>
                            <Tooltip title={cuenta.pagado ? "Marcar como pendiente" : "Marcar como pagada"}>
                              <ActionButton
                                variant="edit"
                                onClick={() => handleTogglePagado(cuenta)}
                                size="small"
                              >
                                <Payment />
                              </ActionButton>
                            </Tooltip>
                            <Tooltip title="Eliminar cuenta">
                              <ActionButton
                                variant="delete"
                                onClick={() => handleDelete(cuenta)}
                                size="small"
                              >
                                <Delete />
                              </ActionButton>
                            </Tooltip>
                          </Stack>
                        </TableCell>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </TableBody>
              </Table>
            </StyledTable>

            {/* Paginación */}
            <TablePagination
              component="div"
              count={filteredAndSortedCuentas.length}
              page={page}
              onPageChange={(event, newPage) => setPage(newPage)}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={(event) => {
                setRowsPerPage(parseInt(event.target.value, 10));
                setPage(0);
              }}
              rowsPerPageOptions={[5, 10, 25, 50]}
              labelRowsPerPage="Filas por página:"
              labelDisplayedRows={({ from, to, count }) =>
                `${from}-${to} de ${count !== -1 ? count : `más de ${to}`}`
              }
              sx={{
                borderTop: '1px solid rgba(0,0,0,0.06)',
                '& .MuiTablePagination-toolbar': {
                  paddingLeft: 2,
                  paddingRight: 2
                }
              }}
            />
          </CardContent>
        </StyledCard>

        {/* Mensaje cuando no hay datos */}
        {filteredAndSortedCuentas.length === 0 && (
          <StyledCard sx={{ mt: 3 }}>
            <CardContent sx={{ textAlign: 'center', py: 6 }}>
              <AccountBalance sx={{ fontSize: 64, color: '#bdc3c7', mb: 2 }} />
              <Typography variant="h6" sx={{ color: '#7f8c8d', mb: 1, fontWeight: 500 }}>
                No se encontraron cuentas
              </Typography>
              <Typography variant="body2" sx={{ color: '#95a5a6' }}>
                {searchTerm || statusFilter !== 'all'
                  ? 'Intenta ajustar los filtros de búsqueda'
                  : 'No hay cuentas por pagar registradas'
                }
              </Typography>
            </CardContent>
          </StyledCard>
        )}

        {/* Diálogo de confirmación para pago */}
        <Dialog 
          open={showPaymentDialog} 
          onClose={() => setShowPaymentDialog(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle sx={{ 
            background: 'linear-gradient(135deg, #27ae60, #2ecc71)',
            color: 'white',
            textAlign: 'center'
          }}>
            <Payment sx={{ mr: 1, verticalAlign: 'middle' }} />
            {cuentaToPay?.pagado ? 'Marcar como Pendiente' : 'Marcar como Pagada'}
          </DialogTitle>
          <DialogContent sx={{ pt: 3 }}>
            {cuentaToPay && (
              <Box>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  {cuentaToPay.concepto}
                </Typography>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  <strong>Monto:</strong> {formatCurrency(cuentaToPay.monto_con_iva || 0)}
                </Typography>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  <strong>Proveedor:</strong> {cuentaToPay.proveedor_nombre || 'Sin proveedor'}
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  <strong>Fecha:</strong> {formatDate(cuentaToPay.fecha)}
                </Typography>
                <Alert severity={cuentaToPay.pagado ? "warning" : "success"} sx={{ mt: 2 }}>
                  {cuentaToPay.pagado 
                    ? "¿Estás seguro de que quieres marcar esta cuenta como PENDIENTE? Esto afectará las estadísticas de pagos."
                    : "¿Estás seguro de que quieres marcar esta cuenta como PAGADA? Esto actualizará el estado de la cuenta."
                  }
                </Alert>
              </Box>
            )}
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button 
              onClick={() => setShowPaymentDialog(false)}
              variant="outlined"
            >
              Cancelar
            </Button>
            <Button 
              onClick={handleConfirmPayment}
              variant="contained"
              sx={{
                background: cuentaToPay?.pagado 
                  ? 'linear-gradient(135deg, #e67e22, #f39c12)'
                  : 'linear-gradient(135deg, #27ae60, #2ecc71)',
                '&:hover': {
                  background: cuentaToPay?.pagado 
                    ? 'linear-gradient(135deg, #d35400, #e67e22)'
                    : 'linear-gradient(135deg, #229954, #27ae60)'
                }
              }}
            >
              {cuentaToPay?.pagado ? 'Marcar como Pendiente' : 'Marcar como Pagada'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Diálogo de confirmación para eliminar */}
        <Dialog 
          open={showDeleteDialog} 
          onClose={() => setShowDeleteDialog(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle sx={{ 
            background: 'linear-gradient(135deg, #e74c3c, #c0392b)',
            color: 'white',
            textAlign: 'center'
          }}>
            <Delete sx={{ mr: 1, verticalAlign: 'middle' }} />
            Eliminar Cuenta
          </DialogTitle>
          <DialogContent sx={{ pt: 3 }}>
            {cuentaToDelete && (
              <Box>
                <Alert severity="error" sx={{ mb: 2 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    ⚠️ ADVERTENCIA: Esta acción no se puede deshacer
                  </Typography>
                </Alert>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  {cuentaToDelete.concepto}
                </Typography>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  <strong>Monto:</strong> {formatCurrency(cuentaToDelete.monto_con_iva || 0)}
                </Typography>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  <strong>Proveedor:</strong> {cuentaToDelete.proveedor_nombre || 'Sin proveedor'}
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  <strong>Estado:</strong> {cuentaToDelete.pagado ? 'Pagada' : 'Pendiente'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Esta cuenta será eliminada permanentemente de la base de datos.
                </Typography>
              </Box>
            )}
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button 
              onClick={() => setShowDeleteDialog(false)}
              variant="outlined"
            >
              Cancelar
            </Button>
            <Button 
              onClick={handleConfirmDelete}
              variant="contained"
              sx={{
                background: 'linear-gradient(135deg, #e74c3c, #c0392b)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #c0392b, #a93226)'
                }
              }}
            >
              Eliminar Permanentemente
            </Button>
          </DialogActions>
        </Dialog>

        {/* Diálogo de confirmación para acciones en lote */}
        <Dialog 
          open={!!bulkAction} 
          onClose={() => setBulkAction(null)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle sx={{ 
            background: 'linear-gradient(135deg, #667eea, #764ba2)',
            color: 'white',
            textAlign: 'center'
          }}>
            <Warning sx={{ mr: 1, verticalAlign: 'middle' }} />
            Acción en Lote
          </DialogTitle>
          <DialogContent sx={{ pt: 3 }}>
            <Alert severity="warning" sx={{ mb: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Confirmar Acción en Lote
              </Typography>
            </Alert>
            <Typography variant="body1" sx={{ mb: 2 }}>
              Estás a punto de realizar la siguiente acción en <strong>{selectedCuentas.length}</strong> cuentas:
            </Typography>
            <Typography variant="h6" sx={{ mb: 2, textAlign: 'center' }}>
              {bulkAction === 'mark_paid' && 'Marcar como Pagadas'}
              {bulkAction === 'mark_unpaid' && 'Marcar como Pendientes'}
              {bulkAction === 'delete' && 'Eliminar Permanentemente'}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {bulkAction === 'delete' 
                ? 'Esta acción no se puede deshacer. Las cuentas serán eliminadas permanentemente.'
                : 'Esta acción actualizará el estado de todas las cuentas seleccionadas.'
              }
            </Typography>
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button 
              onClick={() => setBulkAction(null)}
              variant="outlined"
            >
              Cancelar
            </Button>
            <Button 
              onClick={handleConfirmBulkAction}
              variant="contained"
              sx={{
                background: bulkAction === 'delete' 
                  ? 'linear-gradient(135deg, #e74c3c, #c0392b)'
                  : 'linear-gradient(135deg, #667eea, #764ba2)',
                '&:hover': {
                  background: bulkAction === 'delete' 
                    ? 'linear-gradient(135deg, #c0392b, #a93226)'
                    : 'linear-gradient(135deg, #5a6fd8, #6a4190)'
                }
              }}
            >
              Confirmar Acción
            </Button>
          </DialogActions>
        </Dialog>

        {/* Diálogo para asignar proveedor */}
        <Dialog 
          open={showProviderDialog} 
          onClose={handleCloseProviderDialog}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle sx={{ 
            background: 'linear-gradient(135deg, #667eea, #764ba2)',
            color: 'white',
            textAlign: 'center'
          }}>
            <Business sx={{ mr: 1, verticalAlign: 'middle' }} />
            Asignar Proveedor
          </DialogTitle>
          <DialogContent sx={{ pt: 3 }}>
            {selectedCuentaForProvider && (
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" sx={{ mb: 1 }}>
                  {selectedCuentaForProvider.concepto}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Monto: {formatCurrency(selectedCuentaForProvider.monto_con_iva || 0)}
                </Typography>
              </Box>
            )}
            
            <FormControl fullWidth>
              <InputLabel>Seleccionar Proveedor</InputLabel>
              <Select
                value={selectedProviderId}
                onChange={(e) => setSelectedProviderId(e.target.value)}
                label="Seleccionar Proveedor"
              >
                {proveedores.map(proveedor => (
                  <MenuItem key={proveedor.id} value={proveedor.id}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Avatar sx={{ width: 24, height: 24, fontSize: '0.75rem' }}>
                        {proveedor.nombre?.charAt(0) || '?'}
                      </Avatar>
                      <Box>
                        <Typography variant="body2" fontWeight={600}>
                          {proveedor.nombre}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {proveedor.run_proveedor} • {proveedor.elemento}
                        </Typography>
                      </Box>
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button 
              onClick={handleCloseProviderDialog}
              variant="outlined"
            >
              Cancelar
            </Button>
            <Button 
              onClick={handleSaveProvider}
              variant="contained"
              disabled={!selectedProviderId}
              sx={{
                background: 'linear-gradient(135deg, #667eea, #764ba2)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #5a6fd8, #6a4190)'
                }
              }}
            >
              Asignar Proveedor
            </Button>
          </DialogActions>
        </Dialog>
      </motion.div>
    </StyledContainer>
  );
};

export default CuentasPagarList;