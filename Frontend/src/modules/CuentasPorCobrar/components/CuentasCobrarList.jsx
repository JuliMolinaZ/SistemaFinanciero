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
import { useCuentasCobrar } from '../../../hooks/useCuentasCobrar';

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

const StyledTable = styled(TableContainer)(({ theme }) => ({
  borderRadius: 16,
  overflow: 'hidden',
  boxShadow: '0 12px 40px rgba(0,0,0,0.15)',
  background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
  border: '2px solid rgba(255,255,255,0.5)',
  backdropFilter: 'blur(10px)',
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
      position: 'relative',
      zIndex: 2
    }
  },
  '& .MuiTableRow-root': {
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    position: 'relative',
    '&:hover': {
      backgroundColor: 'rgba(102, 126, 234, 0.08)',
      transform: 'scale(1.005)',
      boxShadow: '0 4px 20px rgba(102, 126, 234, 0.15)',
      '&::before': {
        opacity: 1
      }
    },
    '&:nth-of-type(even)': {
      backgroundColor: 'rgba(0,0,0,0.02)'
    },
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'linear-gradient(90deg, transparent, rgba(102, 126, 234, 0.05), transparent)',
      opacity: 0,
      transition: 'opacity 0.3s ease',
      pointerEvents: 'none'
    }
  },
  '@keyframes shimmer': {
    '0%': { transform: 'translateX(-100%)' },
    '100%': { transform: 'translateX(100%)' }
  }
}));

const ActionButton = styled(IconButton)(({ theme, variant }) => {
  const colors = {
    view: '#3498db',
    edit: '#f39c12',
    delete: '#e74c3c',
    payment: '#27ae60'
  };
  
  return {
    width: 36,
    height: 36,
    backgroundColor: `${colors[variant]}20`,
    color: colors[variant],
    border: `2px solid ${colors[variant]}40`,
    borderRadius: 12,
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    position: 'relative',
    overflow: 'hidden',
    backdropFilter: 'blur(10px)',
    boxShadow: `0 4px 15px ${colors[variant]}25`,
    '&:hover': {
      backgroundColor: colors[variant],
      color: 'white',
      transform: 'scale(1.15) translateY(-2px)',
      boxShadow: `0 8px 25px ${colors[variant]}40`,
      '&::before': {
        opacity: 1,
        transform: 'scale(1)'
      }
    },
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: `linear-gradient(45deg, transparent, rgba(255,255,255,0.3), transparent)`,
      transform: 'scale(0)',
      opacity: 0,
      transition: 'all 0.3s ease'
    }
  };
});

const CuentasCobrarList = () => {
  const { cuentas, loading, error, refreshCuentas, updateCuenta, deleteCuenta } = useCuentasCobrar();
  
  // Estados para filtros y paginación
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('fecha');
  const [sortOrder, setSortOrder] = useState('desc');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  
  // Estados para selección múltiple
  const [selectedCuentas, setSelectedCuentas] = useState([]);
  
  // Estados para diálogos
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [cuentaToDelete, setCuentaToDelete] = useState(null);
  const [cuentaToPay, setCuentaToPay] = useState(null);
  
  // Estados para filtros de fecha
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [showDateFilters, setShowDateFilters] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Función para formatear moneda
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('es-MX');
  };

  // Función para obtener el color de vencimiento
  const getVencimientoColor = (cuenta) => {
    if (cuenta.cobrado) return '#27ae60'; // Verde si está cobrada
    
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
    if (cuenta.cobrado) return 'linear-gradient(135deg, #d5f4e6 0%, #a8e6cf 100%)'; // Verde suave
    
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
    if (cuenta.cobrado) return <CheckCircle sx={{ color: '#27ae60' }} />;
    
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
    if (cuenta.cobrado) return 'Cobrada';
    
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

  // Filtrar y ordenar cuentas
  const filteredAndSortedCuentas = useMemo(() => {
    let filtered = cuentas.filter(cuenta => {
      // Filtro de búsqueda
      const matchesSearch = !searchTerm || 
        cuenta.concepto?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cuenta.cliente_nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cuenta.categoria?.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Filtro de estado
      let matchesStatus = true;
      if (statusFilter === 'cobradas') {
        matchesStatus = cuenta.cobrado;
      } else if (statusFilter === 'pendientes') {
        matchesStatus = !cuenta.cobrado;
      } else if (statusFilter === 'vencidas') {
        const hoy = new Date();
        const fechaVencimiento = new Date(cuenta.fecha_vencimiento || cuenta.fecha);
        const diffTime = fechaVencimiento - hoy;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        matchesStatus = !cuenta.cobrado && diffDays < 0;
      }
      
      // Filtro de fecha
      let matchesDate = true;
      if (fechaInicio || fechaFin) {
        const cuentaFecha = new Date(cuenta.fecha);
        if (fechaInicio) {
          const inicio = new Date(fechaInicio);
          matchesDate = matchesDate && cuentaFecha >= inicio;
        }
        if (fechaFin) {
          const fin = new Date(fechaFin);
          fin.setHours(23, 59, 59, 999); // Incluir todo el día
          matchesDate = matchesDate && cuentaFecha <= fin;
        }
      }
      
      return matchesSearch && matchesStatus && matchesDate;
    });
    
    // Ordenar
    filtered.sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'concepto':
          aValue = a.concepto || '';
          bValue = b.concepto || '';
          break;
        case 'monto':
          aValue = parseFloat(a.monto_con_iva || 0);
          bValue = parseFloat(b.monto_con_iva || 0);
          break;
        case 'fecha':
          aValue = new Date(a.fecha);
          bValue = new Date(b.fecha);
          break;
        case 'cliente':
          aValue = a.cliente_nombre || '';
          bValue = b.cliente_nombre || '';
          break;
        default:
          aValue = new Date(a.fecha);
          bValue = new Date(b.fecha);
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
  const paginatedCuentas = filteredAndSortedCuentas.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  // Manejar selección de cuentas
  const handleSelectCuenta = (cuentaId) => {
    setSelectedCuentas(prev => 
      prev.includes(cuentaId) 
        ? prev.filter(id => id !== cuentaId)
        : [...prev, cuentaId]
    );
  };

  const handleSelectAll = () => {
    if (selectedCuentas.length === paginatedCuentas.length) {
      setSelectedCuentas([]);
    } else {
      setSelectedCuentas(paginatedCuentas.map(c => c.id));
    }
  };

  // Manejar acciones
  const handleToggleCobrado = (cuenta) => {
    setCuentaToPay(cuenta);
    setShowPaymentDialog(true);
  };

  const handleConfirmPayment = async () => {
    if (cuentaToPay) {
      try {
        await updateCuenta(cuentaToPay.id, { cobrado: !cuentaToPay.cobrado });
        setShowPaymentDialog(false);
        setCuentaToPay(null);
      } catch (error) {
        console.error('Error actualizando cuenta:', error);
      }
    }
  };

  const handleDelete = (cuenta) => {
    setCuentaToDelete(cuenta);
    setShowDeleteDialog(true);
  };

  const handleConfirmDelete = async () => {
    if (cuentaToDelete) {
      try {
        await deleteCuenta(cuentaToDelete.id);
        setShowDeleteDialog(false);
        setCuentaToDelete(null);
      } catch (error) {
        console.error('Error eliminando cuenta:', error);
      }
    }
  };

  // Limpiar filtros
  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setFechaInicio('');
    setFechaFin('');
    setSortBy('fecha');
    setSortOrder('desc');
    setPage(0);
  };

  // Aplicar filtro de últimos 30 días
  const applyLast30Days = () => {
    const hoy = new Date();
    const hace30Dias = new Date(hoy.getTime() - 30 * 24 * 60 * 60 * 1000);
    setFechaInicio(hace30Dias.toISOString().split('T')[0]);
    setFechaFin(hoy.toISOString().split('T')[0]);
    setPage(0);
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
          <Typography variant="h6">Error al cargar las cuentas</Typography>
          <Typography variant="body2">{error}</Typography>
        </Alert>
      </StyledContainer>
    );
  }

  return (
    <StyledContainer maxWidth="xl">
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        
        {/* Header con estadísticas */}
        <StyledCard>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h4" sx={{ 
                color: '#2c3e50', 
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: 2
              }}>
                <AccountBalance sx={{ fontSize: '2rem', color: '#e74c3c' }} />
                Lista de Cuentas por Cobrar
              </Typography>
              <Button
                variant="contained"
                startIcon={<Refresh />}
                onClick={refreshCuentas}
                sx={{
                  background: 'linear-gradient(135deg, #667eea, #764ba2)',
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 600
                }}
              >
                Actualizar
              </Button>
            </Box>
            
            {/* Estadísticas rápidas */}
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ textAlign: 'center', p: 2, backgroundColor: '#f8f9fa', borderRadius: 2 }}>
                  <Typography variant="h4" sx={{ color: '#2c3e50', fontWeight: 700 }}>
                    {cuentas.length}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#7f8c8d' }}>
                    Total Cuentas
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ textAlign: 'center', p: 2, backgroundColor: '#d4edda', borderRadius: 2 }}>
                  <Typography variant="h4" sx={{ color: '#155724', fontWeight: 700 }}>
                    {cuentas.filter(c => c.cobrado).length}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#155724' }}>
                    Cobradas
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ textAlign: 'center', p: 2, backgroundColor: '#fff3cd', borderRadius: 2 }}>
                  <Typography variant="h4" sx={{ color: '#856404', fontWeight: 700 }}>
                    {cuentas.filter(c => !c.cobrado).length}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#856404' }}>
                    Pendientes
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ textAlign: 'center', p: 2, backgroundColor: '#f8d7da', borderRadius: 2 }}>
                  <Typography variant="h4" sx={{ color: '#721c24', fontWeight: 700 }}>
                    {cuentas.filter(c => {
                      if (c.cobrado) return false;
                      const hoy = new Date();
                      const fechaVencimiento = new Date(c.fecha_vencimiento || c.fecha);
                      const diffTime = fechaVencimiento - hoy;
                      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                      return diffDays < 0;
                    }).length}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#721c24' }}>
                    Vencidas
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </StyledCard>

        {/* Filtros y búsqueda */}
        <StyledCard>
          <CardContent>
            <Typography variant="h6" sx={{ 
              color: '#2c3e50', 
              fontWeight: 600, 
              mb: 3,
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}>
              <FilterList sx={{ color: '#667eea' }} />
              Filtros y Búsqueda
            </Typography>
            
            <Grid container spacing={3}>
              {/* Búsqueda */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  placeholder="Buscar por concepto, cliente o categoría..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search />
                      </InputAdornment>
                    ),
                    endAdornment: searchTerm && (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setSearchTerm('')} size="small">
                          <Clear />
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                  sx={{ borderRadius: 2 }}
                />
              </Grid>
              
              {/* Filtro de estado */}
              <Grid item xs={12} md={3}>
                <FormControl fullWidth>
                  <InputLabel>Estado</InputLabel>
                  <Select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    label="Estado"
                  >
                    <MenuItem value="all">Todos</MenuItem>
                    <MenuItem value="cobradas">Cobradas</MenuItem>
                    <MenuItem value="pendientes">Pendientes</MenuItem>
                    <MenuItem value="vencidas">Vencidas</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              
              {/* Ordenamiento */}
              <Grid item xs={12} md={3}>
                <FormControl fullWidth>
                  <InputLabel>Ordenar por</InputLabel>
                  <Select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    label="Ordenar por"
                  >
                    <MenuItem value="fecha">Fecha</MenuItem>
                    <MenuItem value="concepto">Concepto</MenuItem>
                    <MenuItem value="monto">Monto</MenuItem>
                    <MenuItem value="cliente">Cliente</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
            
            {/* Filtros de fecha */}
            <Box sx={{ mt: 3 }}>
              <Button
                variant="outlined"
                startIcon={<DateRange />}
                onClick={() => setShowDateFilters(!showDateFilters)}
                sx={{ mb: 2 }}
              >
                {showDateFilters ? 'Ocultar' : 'Mostrar'} Filtros por Fecha
              </Button>
              
              {showDateFilters && (
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      fullWidth
                      label="Fecha Inicio"
                      type="date"
                      value={fechaInicio}
                      onChange={(e) => setFechaInicio(e.target.value)}
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      fullWidth
                      label="Fecha Fin"
                      type="date"
                      value={fechaFin}
                      onChange={(e) => setFechaFin(e.target.value)}
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Stack direction="row" spacing={1}>
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={clearFilters}
                        startIcon={<Clear />}
                      >
                        Limpiar
                      </Button>
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={applyLast30Days}
                        startIcon={<CalendarToday />}
                      >
                        Últimos 30 días
                      </Button>
                    </Stack>
                  </Grid>
                </Grid>
              )}
              
              {/* Indicador de filtros activos */}
              {(fechaInicio || fechaFin || searchTerm || statusFilter !== 'all') && (
                <Alert severity="info" sx={{ mt: 2 }}>
                  <Typography variant="body2">
                    <strong>Filtros activos:</strong>
                    {searchTerm && ` Búsqueda: "${searchTerm}"`}
                    {statusFilter !== 'all' && ` Estado: ${statusFilter}`}
                    {fechaInicio && ` Desde: ${fechaInicio}`}
                    {fechaFin && ` Hasta: ${fechaFin}`}
                  </Typography>
                </Alert>
              )}
            </Box>
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
                    <TableCell>Concepto</TableCell>
                    <TableCell align="right">Monto</TableCell>
                    <TableCell>Categoría</TableCell>
                    <TableCell>Cliente</TableCell>
                    <TableCell>Fecha</TableCell>
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
                              bgcolor: cuenta.cliente_nombre ? '#667eea' : '#e74c3c'
                            }}>
                              {cuenta.cliente_nombre?.charAt(0) || '?'}
                            </Avatar>
                            <Box>
                              <Typography variant="body2" sx={{ color: '#2c3e50' }}>
                                {cuenta.cliente_nombre || 'Sin cliente'}
                              </Typography>
                              {!cuenta.cliente_nombre && (
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
                            <Tooltip title={cuenta.cobrado ? "Marcar como pendiente" : "Marcar como cobrada"}>
                              <ActionButton
                                variant="payment"
                                onClick={() => handleToggleCobrado(cuenta)}
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
                  : 'No hay cuentas por cobrar registradas'
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
            {cuentaToPay?.cobrado ? 'Marcar como Pendiente' : 'Marcar como Cobrada'}
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
                  <strong>Cliente:</strong> {cuentaToPay.cliente_nombre || 'Sin cliente'}
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  <strong>Fecha:</strong> {formatDate(cuentaToPay.fecha)}
                </Typography>
                <Alert severity={cuentaToPay.cobrado ? "warning" : "success"} sx={{ mt: 2 }}>
                  {cuentaToPay.cobrado 
                    ? "¿Estás seguro de que quieres marcar esta cuenta como PENDIENTE? Esto afectará las estadísticas de cobros."
                    : "¿Estás seguro de que quieres marcar esta cuenta como COBRADA? Esto actualizará el estado de la cuenta."
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
                background: cuentaToPay?.cobrado ? 'linear-gradient(135deg, #f39c12, #e67e22)' : 'linear-gradient(135deg, #27ae60, #2ecc71)',
                color: 'white'
              }}
            >
              {cuentaToPay?.cobrado ? 'Marcar Pendiente' : 'Marcar Cobrada'}
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
                <Typography variant="h6" sx={{ mb: 2 }}>
                  {cuentaToDelete.concepto}
                </Typography>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  <strong>Monto:</strong> {formatCurrency(cuentaToDelete.monto_con_iva || 0)}
                </Typography>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  <strong>Cliente:</strong> {cuentaToDelete.cliente_nombre || 'Sin cliente'}
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  <strong>Fecha:</strong> {formatDate(cuentaToDelete.fecha)}
                </Typography>
                <Alert severity="error" sx={{ mt: 2 }}>
                  <strong>⚠️ Advertencia:</strong> Esta acción no se puede deshacer. 
                  Se eliminará permanentemente la cuenta y todos sus datos asociados.
                </Alert>
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
                color: 'white'
              }}
            >
              Eliminar Definitivamente
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </StyledContainer>
  );
};

export default CuentasCobrarList;
