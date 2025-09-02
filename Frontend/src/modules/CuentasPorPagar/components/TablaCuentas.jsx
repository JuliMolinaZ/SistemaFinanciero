// src/modules/CuentasPorPagar/components/TablaCuentas.jsx
import React, { useState, useMemo, useEffect } from 'react';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tooltip,
  Chip,
  Typography,
  Avatar,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  useTheme,
  useMediaQuery,
  Grid,
  InputAdornment,
  Collapse,
  Fade,
  Divider,
  Badge,
  Card,
  CardContent,
  Skeleton,
  LinearProgress,
  Alert,
  Snackbar
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Payment as PaymentIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  Visibility as VisibilityIcon,
  AttachMoney as AttachMoneyIcon,
  FilterList as FilterListIcon,
  Clear as ClearIcon,
  Search as SearchIcon,
  DateRange as DateRangeIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  CalendarToday as CalendarIcon,
  Business as BusinessIcon,
  Tune as TuneIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Refresh as RefreshIcon,
  AutoAwesome as AutoAwesomeIcon
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

// Componentes estilizados
const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  borderRadius: 16,
  overflow: 'hidden',
  boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
  background: 'rgba(255,255,255,0.98)',
  backdropFilter: 'blur(20px)'
}));

const StyledTable = styled(Table)(({ theme }) => ({
  '& .MuiTableHead-root': {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    '& .MuiTableCell-head': {
      color: '#fff',
      fontWeight: 700,
      fontSize: '0.875rem',
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
      borderBottom: 'none',
      padding: theme.spacing(2)
    }
  },
  '& .MuiTableBody-root': {
    '& .MuiTableRow-root': {
      transition: 'all 0.2s ease',
      '&:hover': {
        background: 'rgba(102, 126, 234, 0.05)',
        transform: 'scale(1.01)'
      },
      '&:nth-of-type(even)': {
        background: 'rgba(0,0,0,0.02)'
      }
    },
    '& .MuiTableCell-body': {
      borderBottom: '1px solid rgba(0,0,0,0.05)',
      padding: theme.spacing(2),
      fontSize: '0.875rem'
    }
  }
}));

const ActionButton = styled(IconButton)(({ color }) => ({
  width: 36,
  height: 36,
  margin: '0 2px',
  background: color,
  color: '#fff',
  transition: 'all 0.15s ease',
  '&:hover': {
    background: color,
    transform: 'translateY(-1px)',
    boxShadow: '0 3px 8px rgba(0,0,0,0.15)'
  }
}));

// Componentes de filtros inline
const FilterRow = styled(TableRow)(({ theme }) => ({
  background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.05), rgba(118, 75, 162, 0.05))',
  '& .MuiTableCell-root': {
    borderBottom: '1px solid rgba(102, 126, 234, 0.1)',
    padding: theme.spacing(1.5),
    background: 'transparent'
  }
}));

const InlineFilterField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: 12,
    background: 'rgba(255,255,255,0.9)',
    backdropFilter: 'blur(10px)',
    border: '2px solid rgba(102, 126, 234, 0.15)',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    fontSize: '0.875rem',
    '&:hover': {
      background: 'rgba(255,255,255,0.95)',
      borderColor: 'rgba(102, 126, 234, 0.3)',
      transform: 'translateY(-1px)',
      boxShadow: '0 4px 15px rgba(102, 126, 234, 0.15)'
    },
    '&.Mui-focused': {
      background: 'rgba(255,255,255,1)',
      borderColor: '#667eea',
      boxShadow: '0 0 0 3px rgba(102, 126, 234, 0.1), 0 4px 15px rgba(102, 126, 234, 0.2)',
      transform: 'translateY(-1px)'
    }
  },
  '& .MuiInputLabel-root': {
    fontWeight: 600,
    color: '#667eea',
    fontSize: '0.75rem',
    '&.Mui-focused': {
      color: '#667eea',
      fontWeight: 700
    }
  }
}));

const InlineSelect = styled(FormControl)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: 12,
    background: 'rgba(255,255,255,0.9)',
    backdropFilter: 'blur(10px)',
    border: '2px solid rgba(102, 126, 234, 0.15)',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    fontSize: '0.875rem',
    '&:hover': {
      background: 'rgba(255,255,255,0.95)',
      borderColor: 'rgba(102, 126, 234, 0.3)',
      transform: 'translateY(-1px)',
      boxShadow: '0 4px 15px rgba(102, 126, 234, 0.15)'
    },
    '&.Mui-focused': {
      background: 'rgba(255,255,255,1)',
      borderColor: '#667eea',
      boxShadow: '0 0 0 3px rgba(102, 126, 234, 0.1), 0 4px 15px rgba(102, 126, 234, 0.2)',
      transform: 'translateY(-1px)'
    }
  },
  '& .MuiInputLabel-root': {
    fontWeight: 600,
    color: '#667eea',
    fontSize: '0.75rem',
    '&.Mui-focused': {
      color: '#667eea',
      fontWeight: 700
    }
  }
}));

const FilterToggleButton = styled(Button)(({ theme, active }) => ({
  borderRadius: 12,
  textTransform: 'none',
  fontWeight: 600,
  padding: theme.spacing(1, 2),
  fontSize: '0.75rem',
  background: active 
    ? 'linear-gradient(135deg, #667eea, #764ba2)' 
    : 'rgba(102, 126, 234, 0.1)',
  color: active ? '#fff' : '#667eea',
  border: `2px solid ${active ? 'transparent' : 'rgba(102, 126, 234, 0.2)'}`,
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover': {
    background: active 
      ? 'linear-gradient(135deg, #5a6fd8, #6a4190)' 
      : 'rgba(102, 126, 234, 0.2)',
    transform: 'translateY(-1px)',
    boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)'
  }
}));

const QuickFilterChip = styled(Chip)(({ theme, active, variant = 'default' }) => ({
  background: active
    ? 'linear-gradient(135deg, #667eea, #764ba2)'
    : variant === 'time' 
      ? 'rgba(255, 193, 7, 0.1)'
      : variant === 'money'
      ? 'rgba(76, 175, 80, 0.1)'
      : variant === 'status'
      ? 'rgba(255, 87, 34, 0.1)'
      : 'rgba(102, 126, 234, 0.08)',
  color: active 
    ? '#fff' 
    : variant === 'time'
      ? '#f57c00'
      : variant === 'money'
      ? '#2e7d32'
      : variant === 'status'
      ? '#d84315'
      : '#667eea',
  fontWeight: 600,
  fontSize: '0.75rem',
  borderRadius: 12,
  padding: theme.spacing(0.5, 1.5),
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  cursor: 'pointer',
  border: `2px solid ${active 
    ? 'transparent' 
    : variant === 'time'
      ? 'rgba(255, 193, 7, 0.3)'
      : variant === 'money'
      ? 'rgba(76, 175, 80, 0.3)'
      : variant === 'status'
      ? 'rgba(255, 87, 34, 0.3)'
      : 'rgba(102, 126, 234, 0.2)'}`,
  '&:hover': {
    transform: 'translateY(-1px) scale(1.02)',
    boxShadow: `0 4px 15px ${active 
      ? 'rgba(102, 126, 234, 0.4)' 
      : variant === 'time'
        ? 'rgba(255, 193, 7, 0.3)'
        : variant === 'money'
        ? 'rgba(76, 175, 80, 0.3)'
        : variant === 'status'
        ? 'rgba(255, 87, 34, 0.3)'
        : 'rgba(102, 126, 234, 0.3)'}`,
    borderColor: active 
      ? 'transparent' 
      : variant === 'time'
        ? 'rgba(255, 193, 7, 0.5)'
        : variant === 'money'
        ? 'rgba(76, 175, 80, 0.5)'
        : variant === 'status'
        ? 'rgba(255, 87, 34, 0.5)'
        : 'rgba(102, 126, 234, 0.4)'
  }
}));

// Componente de carga elegante
const LoadingSkeleton = () => (
  <Box sx={{ p: 2 }}>
    <Box sx={{ mb: 3 }}>
      <Skeleton variant="rectangular" height={40} sx={{ borderRadius: 2, mb: 2 }} />
      <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
        <Skeleton variant="rectangular" width={100} height={32} sx={{ borderRadius: 16 }} />
        <Skeleton variant="rectangular" width={120} height={32} sx={{ borderRadius: 16 }} />
        <Skeleton variant="rectangular" width={90} height={32} sx={{ borderRadius: 16 }} />
      </Box>
    </Box>
    
    <StyledTableContainer>
      <StyledTable>
        <TableHead>
          <TableRow>
            <TableCell>Proveedor</TableCell>
            <TableCell>Descripción</TableCell>
            <TableCell>Fecha</TableCell>
            <TableCell>Monto</TableCell>
            <TableCell>Estado</TableCell>
            <TableCell align="center">Acciones</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {[...Array(8)].map((_, index) => (
            <TableRow key={index}>
              <TableCell>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Skeleton variant="circular" width={32} height={32} />
                  <Skeleton variant="text" width={120} height={20} />
                </Box>
              </TableCell>
              <TableCell>
                <Skeleton variant="text" width={180} height={20} />
                <Skeleton variant="rectangular" width={80} height={20} sx={{ mt: 0.5, borderRadius: 10 }} />
              </TableCell>
              <TableCell>
                <Skeleton variant="text" width={80} height={20} />
              </TableCell>
              <TableCell>
                <Skeleton variant="text" width={100} height={20} />
              </TableCell>
              <TableCell>
                <Skeleton variant="rectangular" width={80} height={24} sx={{ borderRadius: 12 }} />
              </TableCell>
              <TableCell align="center">
                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 0.5 }}>
                  {[...Array(4)].map((_, i) => (
                    <Skeleton key={i} variant="circular" width={36} height={36} />
                  ))}
                </Box>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </StyledTable>
    </StyledTableContainer>
  </Box>
);

// Componente de estado vacío
const EmptyState = ({ hasFilters, onRefresh }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
  >
    <Box sx={{ 
      textAlign: 'center', 
      py: 6, 
      px: 4,
      background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.05), rgba(118, 75, 162, 0.05))',
      borderRadius: 3,
      border: '1px solid rgba(102, 126, 234, 0.1)',
      mt: 2
    }}>
      {hasFilters ? (
        <>
          <SearchIcon sx={{ fontSize: '4rem', color: '#667eea', mb: 2, opacity: 0.7 }} />
          <Typography variant="h5" sx={{ mb: 2, color: '#667eea', fontWeight: 700 }}>
            No se encontraron resultados
          </Typography>
          <Typography variant="body1" sx={{ mb: 3, color: 'text.secondary' }}>
            Intenta ajustar los filtros de búsqueda o crear nuevas cuentas
          </Typography>
          <Button
            variant="outlined"
            onClick={onRefresh}
            startIcon={<RefreshIcon />}
            sx={{
              borderColor: '#667eea',
              color: '#667eea',
              '&:hover': {
                borderColor: '#5a6fd8',
                background: 'rgba(102, 126, 234, 0.05)'
              }
            }}
          >
            Reintentar
          </Button>
        </>
      ) : (
        <>
          <AutoAwesomeIcon sx={{ fontSize: '4rem', color: '#667eea', mb: 2, opacity: 0.7 }} />
          <Typography variant="h5" sx={{ mb: 2, color: '#667eea', fontWeight: 700 }}>
            No hay cuentas disponibles
          </Typography>
          <Typography variant="body1" sx={{ mb: 3, color: 'text.secondary' }}>
            Comienza agregando tu primera cuenta por pagar
          </Typography>
          <Button
            variant="contained"
            startIcon={<AutoAwesomeIcon />}
            sx={{
              background: 'linear-gradient(135deg, #667eea, #764ba2)',
              '&:hover': {
                background: 'linear-gradient(135deg, #5a6fd8, #6a4190)'
              }
            }}
          >
            Crear Primera Cuenta
          </Button>
        </>
      )}
    </Box>
  </motion.div>
);

const TablaCuentas = ({
  cuentas = [],
  loading = false,
  error = null,
  onEdit,
  onDelete,
  onPagoParcial,
  onView,
  onStatusChange,
  onRefresh
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  // Estados para filtros inline
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    proveedor: '',
    fecha: '',
    monto: '',
    estado: '',
    descripcion: ''
  });
  
  // Filtros rápidos
  const [quickFilters, setQuickFilters] = useState({
    thisMonth: false,
    overdue: false,
    highAmount: false,
    urgent: false
  });

  // Estado para notificaciones
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  // Debug: Ver la estructura real de los datos
  console.log('🔍 TablaCuentas - Datos recibidos:', cuentas);
  console.log('📊 Primera cuenta completa:', cuentas?.[0]);
  console.log('🏷️ Campos disponibles:', cuentas?.[0] ? Object.keys(cuentas[0]) : []);
  console.log('🔄 Estado de loading:', loading);
  console.log('❌ Estado de error:', error);
  
  // Debug específico para proveedores
  if (cuentas && cuentas.length > 0) {
    console.log('🏢 Análisis de proveedores:');
    cuentas.slice(0, 5).forEach((cuenta, index) => {
      console.log(`Cuenta ${index + 1}:`, {
        id: cuenta.id,
        concepto: cuenta.concepto,
        proveedor_id: cuenta.proveedor_id,
        proveedor_nombre: cuenta.proveedor_nombre,
        estado_detallado: cuenta.estado_detallado,
        monto_con_iva: cuenta.monto_con_iva,
        pagado: cuenta.pagado
      });
    });
  }

  // Aplicar filtros a las cuentas
  const filteredCuentas = useMemo(() => {
    if (!cuentas) return [];
    
    return cuentas.filter(cuenta => {
      // Filtro por proveedor
      if (filters.proveedor && !(cuenta.proveedor_nombre || '')?.toLowerCase().includes(filters.proveedor.toLowerCase())) {
        return false;
      }
      
      // Filtro por fecha
      if (filters.fecha && !cuenta.fecha?.includes(filters.fecha)) {
        return false;
      }
      
      // Filtro por monto
      if (filters.monto) {
        const monto = parseFloat(cuenta.monto_con_iva || cuenta.monto_neto || 0);
        const filtroMonto = parseFloat(filters.monto);
        if (monto < filtroMonto) return false;
      }
      
      // Filtro por estado
      if (filters.estado) {
        switch (filters.estado) {
          case 'por_pagar':
            if (cuenta.estado_detallado !== 'Por Pagar') return false;
            break;
          case 'pago_parcial':
            if (cuenta.estado_detallado !== 'Pago Parcial') return false;
            break;
          case 'vencida':
            if (cuenta.estado_detallado !== 'Vencida') return false;
            break;
          case 'pagada':
            if (cuenta.estado_detallado !== 'Pagada') return false;
            break;
        }
      }
      
      // Filtro por descripción
      if (filters.descripcion && !(cuenta.concepto || cuenta.descripcion || '')?.toLowerCase().includes(filters.descripcion.toLowerCase())) {
        return false;
      }
      
      return true;
    });
  }, [cuentas, filters]);

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleQuickFilter = (filterType) => {
    setQuickFilters(prev => ({
      ...prev,
      [filterType]: !prev[filterType]
    }));
  };

  const clearFilters = () => {
    setFilters({
      proveedor: '',
      fecha: '',
      monto: '',
      estado: '',
      descripcion: ''
    });
    setQuickFilters({
      thisMonth: false,
      overdue: false,
      highAmount: false,
      urgent: false
    });
    
    // Mostrar notificación
    setSnackbar({
      open: true,
      message: 'Filtros limpiados correctamente',
      severity: 'info'
    });
  };

  const hasActiveFilters = Object.values(filters).some(v => v) || Object.values(quickFilters).some(v => v);

  // Mostrar error si existe
  useEffect(() => {
    if (error) {
      setSnackbar({
        open: true,
        message: error,
        severity: 'error'
      });
    }
  }, [error]);

  // Si está cargando, mostrar skeleton
  if (loading) {
    return <LoadingSkeleton />;
  }

  return (
    <Box>
      {/* Header de filtros */}
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, color: '#667eea' }}>
            📊 Tabla de Cuentas
          </Typography>
          <Badge badgeContent={filteredCuentas.length} color="primary" sx={{
            '& .MuiBadge-badge': {
              background: 'linear-gradient(135deg, #667eea, #764ba2)',
              color: '#fff'
            }
          }}>
            <Chip 
              label={`${cuentas?.length || 0} total`} 
              size="small" 
              sx={{ background: 'rgba(102, 126, 234, 0.1)', color: '#667eea' }}
            />
          </Badge>
        </Box>
        
        <Box sx={{ display: 'flex', gap: 1 }}>
          <FilterToggleButton
            active={showFilters}
            onClick={() => setShowFilters(!showFilters)}
            startIcon={<FilterListIcon />}
          >
            {showFilters ? 'Ocultar Filtros' : 'Mostrar Filtros'}
          </FilterToggleButton>
          
          {hasActiveFilters && (
            <FilterToggleButton
              onClick={clearFilters}
              startIcon={<ClearIcon />}
              sx={{ background: 'rgba(244, 67, 54, 0.1)', color: '#f44336', borderColor: 'rgba(244, 67, 54, 0.2)' }}
            >
              Limpiar
            </FilterToggleButton>
          )}

          <Tooltip title="Actualizar datos">
            <IconButton
              onClick={onRefresh}
              sx={{
                background: 'rgba(102, 126, 234, 0.1)',
                color: '#667eea',
                '&:hover': {
                  background: 'rgba(102, 126, 234, 0.2)',
                  transform: 'scale(1.1)'
                }
              }}
            >
              <RefreshIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* Filtros rápidos */}
      <Box sx={{ mb: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
        <QuickFilterChip
          active={quickFilters.thisMonth}
          variant="time"
          label="Este Mes"
          onClick={() => handleQuickFilter('thisMonth')}
          icon={<CalendarIcon />}
        />
        <QuickFilterChip
          active={quickFilters.overdue}
          variant="status"
          label="Vencidas"
          onClick={() => handleQuickFilter('overdue')}
          icon={<WarningIcon />}
        />
        <QuickFilterChip
          active={quickFilters.highAmount}
          variant="money"
          label="Monto Alto"
          onClick={() => handleQuickFilter('highAmount')}
          icon={<TrendingUpIcon />}
        />
        <QuickFilterChip
          active={quickFilters.urgent}
          variant="status"
          label="Urgente"
          onClick={() => handleQuickFilter('urgent')}
          icon={<WarningIcon />}
        />
      </Box>

      {/* Tabla con filtros inline */}
      <StyledTableContainer>
        <StyledTable>
          <TableHead>
            <TableRow>
              <TableCell>Proveedor</TableCell>
              <TableCell>Descripción</TableCell>
              <TableCell>Fecha</TableCell>
              <TableCell>Monto</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell align="center">Acciones</TableCell>
            </TableRow>
          </TableHead>
          
          {/* Fila de filtros inline */}
          {showFilters && (
            <FilterRow>
              <TableCell>
                <InlineFilterField
                  size="small"
                  placeholder="Buscar proveedor..."
                  value={filters.proveedor}
                  onChange={(e) => handleFilterChange('proveedor', e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon sx={{ fontSize: 16, color: '#667eea' }} />
                      </InputAdornment>
                    )
                  }}
                />
              </TableCell>
              <TableCell>
                <InlineFilterField
                  size="small"
                  placeholder="Buscar descripción..."
                  value={filters.descripcion}
                  onChange={(e) => handleFilterChange('descripcion', e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon sx={{ fontSize: 16, color: '#667eea' }} />
                      </InputAdornment>
                    )
                  }}
                />
              </TableCell>
              <TableCell>
                <InlineFilterField
                  size="small"
                  type="date"
                  value={filters.fecha}
                  onChange={(e) => handleFilterChange('fecha', e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <DateRangeIcon sx={{ fontSize: 16, color: '#667eea' }} />
                      </InputAdornment>
                    )
                  }}
                />
              </TableCell>
              <TableCell>
                <InlineFilterField
                  size="small"
                  type="number"
                  placeholder="Monto mínimo..."
                  value={filters.monto}
                  onChange={(e) => handleFilterChange('monto', e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <AttachMoneyIcon sx={{ fontSize: 16, color: '#667eea' }} />
                      </InputAdornment>
                    )
                  }}
                />
              </TableCell>
              <TableCell>
                <InlineSelect size="small" fullWidth>
                  <InputLabel>Estado</InputLabel>
                  <Select
                    value={filters.estado}
                    onChange={(e) => handleFilterChange('estado', e.target.value)}
                    label="Estado"
                  >
                    <MenuItem value="">Todos los estados</MenuItem>
                    <MenuItem value="por_pagar">Por Pagar</MenuItem>
                    <MenuItem value="pago_parcial">Pago Parcial</MenuItem>
                    <MenuItem value="vencida">Vencida</MenuItem>
                    <MenuItem value="pagada">Pagada</MenuItem>
                  </Select>
                </InlineSelect>
              </TableCell>
              <TableCell align="center">
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  Filtros activos
                </Typography>
              </TableCell>
            </FilterRow>
          )}

          {/* Cuerpo de la tabla */}
          <TableBody>
            <AnimatePresence>
              {filteredCuentas.map((cuenta, index) => (
                <motion.tr
                  key={cuenta.id || index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.05 }}
                  component={TableRow}
                  sx={{
                    background: cuenta.estado_detallado === 'Vencida' 
                      ? 'rgba(244, 67, 54, 0.05)' 
                      : cuenta.estado_detallado === 'Pago Parcial'
                      ? 'rgba(255, 193, 7, 0.05)'
                      : cuenta.estado_detallado === 'Pagada'
                      ? 'rgba(76, 175, 80, 0.05)'
                      : 'transparent'
                  }}
                >
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Avatar sx={{ 
                        width: 32, 
                        height: 32, 
                        bgcolor: cuenta.proveedor_nombre 
                          ? 'rgba(76, 175, 80, 0.1)' 
                          : 'rgba(255, 193, 7, 0.1)' 
                      }}>
                        {cuenta.proveedor_nombre ? (
                          <BusinessIcon sx={{ fontSize: 16, color: '#2e7d32' }} />
                        ) : (
                          <InfoIcon sx={{ fontSize: 16, color: '#f57c00' }} />
                        )}
                      </Avatar>
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {cuenta.proveedor_nombre || 'Sin proveedor'}
                        </Typography>
                        {cuenta.proveedor_rfc && (
                          <Typography variant="caption" sx={{ color: 'text.secondary', fontStyle: 'italic' }}>
                            RFC: {cuenta.proveedor_rfc}
                          </Typography>
                        )}
                        {!cuenta.proveedor_nombre && (
                          <Typography variant="caption" sx={{ color: 'text.secondary', fontStyle: 'italic' }}>
                            ID: {cuenta.proveedor_id || 'N/A'}
                          </Typography>
                        )}
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box>
                      <Typography variant="body2" sx={{ 
                        maxWidth: 200, 
                        overflow: 'hidden', 
                        textOverflow: 'ellipsis',
                        fontWeight: 500,
                        color: cuenta.concepto || cuenta.descripcion ? 'text.primary' : 'text.secondary'
                      }}>
                        {cuenta.concepto || cuenta.descripcion || 'Sin descripción'}
                      </Typography>
                      {cuenta.categoria && (
                        <Chip 
                          label={cuenta.categoria} 
                          size="small" 
                          variant="outlined"
                          sx={{ 
                            mt: 0.5, 
                            fontSize: '0.7rem',
                            height: 20,
                            background: 'rgba(102, 126, 234, 0.1)',
                            borderColor: 'rgba(102, 126, 234, 0.3)',
                            color: '#667eea'
                          }}
                        />
                      )}
                      {cuenta.observaciones && (
                        <Typography variant="caption" sx={{ 
                          color: 'text.secondary', 
                          fontStyle: 'italic',
                          display: 'block',
                          mt: 0.5
                        }}>
                          📝 {cuenta.observaciones}
                        </Typography>
                      )}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {cuenta.fecha ? new Date(cuenta.fecha).toLocaleDateString() : 'Sin fecha'}
                      </Typography>
                      {cuenta.fecha_vencimiento && (
                        <Typography variant="caption" sx={{ 
                          color: cuenta.dias_vencida > 0 ? '#f44336' : 'text.secondary',
                          fontWeight: cuenta.dias_vencida > 0 ? 600 : 400
                        }}>
                          Vence: {new Date(cuenta.fecha_vencimiento).toLocaleDateString()}
                          {cuenta.dias_vencida > 0 && ` (${cuenta.dias_vencida} días vencida)`}
                        </Typography>
                      )}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: '#2e7d32' }}>
                        ${(cuenta.monto_con_iva || cuenta.monto_neto || 0).toLocaleString()}
                      </Typography>
                      {cuenta.monto_neto && cuenta.monto_con_iva && cuenta.monto_neto !== cuenta.monto_con_iva && (
                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                          Neto: ${cuenta.monto_neto.toLocaleString()}
                        </Typography>
                      )}
                      {cuenta.pagos_parciales > 0 && (
                        <Typography variant="caption" sx={{ 
                          color: '#ff9800', 
                          fontWeight: 600,
                          display: 'block'
                        }}>
                          Pagado: ${cuenta.pagos_parciales.toLocaleString()}
                        </Typography>
                      )}
                      {cuenta.monto_pendiente > 0 && cuenta.monto_pendiente !== cuenta.monto_con_iva && (
                        <Typography variant="caption" sx={{ 
                          color: '#f44336', 
                          fontWeight: 600,
                          display: 'block'
                        }}>
                          Pendiente: ${cuenta.monto_pendiente.toLocaleString()}
                        </Typography>
                      )}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                      <Chip
                        label={cuenta.estado_detallado || (cuenta.pagado ? 'Pagada' : 'Por Pagar')}
                        color={
                          cuenta.estado_detallado === 'Pagada' ? 'success' :
                          cuenta.estado_detallado === 'Pago Parcial' ? 'warning' :
                          cuenta.estado_detallado === 'Vencida' ? 'error' : 'default'
                        }
                        size="small"
                        sx={{ fontWeight: 600 }}
                      />
                      {cuenta.requiere_iva && (
                        <Chip 
                          label="IVA" 
                          size="small" 
                          variant="outlined"
                          sx={{ 
                            fontSize: '0.6rem',
                            height: 18,
                            background: 'rgba(156, 39, 176, 0.1)',
                            borderColor: 'rgba(156, 39, 176, 0.3)',
                            color: '#9c27b0'
                          }}
                        />
                      )}
                    </Box>
                  </TableCell>
                  <TableCell align="center">
                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 0.5 }}>
                      <Tooltip title="Ver detalles">
                        <ActionButton
                          color="rgba(33, 150, 243, 0.8)"
                          onClick={() => onView?.(cuenta)}
                          size="small"
                        >
                          <VisibilityIcon fontSize="small" />
                        </ActionButton>
                      </Tooltip>
                      
                      {!cuenta.pagado && (
                        <Tooltip title="Editar cuenta">
                          <ActionButton
                            color="rgba(255, 193, 7, 0.8)"
                            onClick={() => onEdit?.(cuenta)}
                            size="small"
                          >
                            <EditIcon fontSize="small" />
                          </ActionButton>
                        </Tooltip>
                      )}
                      
                      {!cuenta.pagado && (
                        <Tooltip title="Registrar pago parcial">
                          <ActionButton
                            color="rgba(76, 175, 80, 0.8)"
                            onClick={() => onPagoParcial?.(cuenta)}
                            size="small"
                          >
                            <PaymentIcon fontSize="small" />
                          </ActionButton>
                        </Tooltip>
                      )}
                      
                      <Tooltip title="Eliminar cuenta">
                        <ActionButton
                          color="rgba(244, 67, 54, 0.8)"
                          onClick={() => onDelete?.(cuenta)}
                          size="small"
                        >
                          <DeleteIcon fontSize="small" />
                        </ActionButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </motion.tr>
              ))}
            </AnimatePresence>
          </TableBody>
        </StyledTable>
      </StyledTableContainer>

      {/* Estado vacío */}
      {filteredCuentas.length === 0 && !loading && (
        <EmptyState hasFilters={hasActiveFilters} onRefresh={onRefresh} />
      )}

      {/* Notificaciones */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={() => setSnackbar({ ...snackbar, open: false })} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default TablaCuentas;

