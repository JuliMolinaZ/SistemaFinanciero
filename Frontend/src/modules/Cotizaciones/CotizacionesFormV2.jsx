import React, { useState, useEffect, useCallback, useMemo, useTransition } from 'react';
import axios from 'axios';
import {
  Container,
  Box,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  Snackbar,
  Alert,
  Chip,
  Avatar,
  IconButton,
  Tooltip,
  Tabs,
  Tab,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Skeleton,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Card,
  CardContent,
  Fade,
  Zoom,
  Button
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { motion, AnimatePresence } from 'framer-motion';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import DownloadIcon from '@mui/icons-material/Download';
import BusinessIcon from '@mui/icons-material/Business';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import ScheduleIcon from '@mui/icons-material/Schedule';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import TimelineIcon from '@mui/icons-material/Timeline';
import RefreshIcon from '@mui/icons-material/Refresh';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CloseIcon from '@mui/icons-material/Close';
import ErrorIcon from '@mui/icons-material/Error';
import DescriptionIcon from '@mui/icons-material/Description';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import AssignmentIcon from '@mui/icons-material/Assignment';

// ========================================
// COMPONENTES ESTILIZADOS IDÉNTICOS A PROVEEDORES
// ========================================

// Container con el mismo estilo que Proveedores
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

// Card con el mismo estilo que Proveedores
const StyledCard = styled(Card)(({ theme }) => ({
  background: 'rgba(255,255,255,0.95)',
  backdropFilter: 'blur(20px)',
  border: '1px solid rgba(255,255,255,0.3)',
  borderRadius: 16,
  boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 12px 40px rgba(0,0,0,0.15)'
  }
}));

// Tabla con el mismo estilo que Proveedores
const StyledTable = styled(Table)(({ theme }) => ({
  '& .MuiTableCell-head': {
    backgroundColor: 'rgba(102, 126, 234, 0.1)',
    color: '#2c3e50',
    fontWeight: 700,
    fontSize: '0.875rem',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  },
  '& .MuiTableCell-body': {
    fontSize: '0.875rem',
    color: '#34495e'
  }
}));

// Select con el mismo estilo que Proveedores
const StyledSelect = styled(FormControl)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: 12,
    background: 'rgba(255,255,255,0.9)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255,255,255,0.3)',
    transition: 'all 0.3s ease',
    '&:hover': {
      background: 'rgba(255,255,255,0.95)',
      borderColor: 'rgba(102, 126, 234, 0.5)'
    },
    '&.Mui-focused': {
      background: 'rgba(255,255,255,1)',
      borderColor: '#667eea',
      boxShadow: '0 0 0 3px rgba(102, 126, 234, 0.1)'
    }
  }
}));

const ActionButton = styled(IconButton)(({ theme, color }) => ({
  backgroundColor: color,
  color: '#fff',
  width: 32,
  height: 32,
  '&:hover': {
    backgroundColor: color,
    transform: 'scale(1.1)',
    boxShadow: `0 4px 12px ${color}40`
  },
  transition: 'all 0.2s ease'
}));

const StyledChip = styled(Chip)(({ theme, status }) => ({
  backgroundColor: status === 'No_creada' ? '#e74c3c' :
                 status === 'En_proceso_de_aceptaci_n' ? '#3498db' :
                 status === 'Aceptada_por_cliente' ? '#27ae60' : 
                 status === 'No_aceptada' ? '#e74c3c' : '#95a5a6',
  color: '#fff',
  fontWeight: 600,
  fontSize: '0.75rem',
  minWidth: '80px',
  '& .MuiChip-label': {
    px: 1,
    textAlign: 'center'
  }
}));

// Skeleton con el mismo estilo que Proveedores
const CotizacionRowSkeleton = React.memo(() => (
  <TableRow>
    <TableCell>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Skeleton variant="circular" width={48} height={48} />
        <Box>
          <Skeleton variant="text" width={150} height={20} />
          <Skeleton variant="text" width={100} height={16} />
        </Box>
      </Box>
    </TableCell>
    <TableCell>
      <Skeleton variant="text" width={120} height={20} />
    </TableCell>
    <TableCell>
      <Skeleton variant="text" width={100} height={20} />
    </TableCell>
    <TableCell>
      <Skeleton variant="text" width={100} height={20} />
    </TableCell>
    <TableCell>
      <Skeleton variant="text" width={100} height={20} />
    </TableCell>
    <TableCell>
      <Skeleton variant="rectangular" width={80} height={24} sx={{ borderRadius: 1 }} />
    </TableCell>
    <TableCell>
      <Skeleton variant="text" width={100} height={20} />
    </TableCell>
    <TableCell>
      <Box sx={{ display: 'flex', gap: 1 }}>
        <Skeleton variant="circular" width={36} height={36} />
        <Skeleton variant="circular" width={36} height={36} />
        <Skeleton variant="circular" width={36} height={36} />
      </Box>
    </TableCell>
  </TableRow>
));

// Hooks personalizados idénticos a Proveedores
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

const useDataCache = () => {
  const [cache, setCache] = useState(new Map());
  const [cacheTime, setCacheTime] = useState(new Map());

  const getCachedData = useCallback((key) => {
    const data = cache.get(key);
    const time = cacheTime.get(key);
    if (data && time && Date.now() - time < 30000) {
      return data;
    }
    return null;
  }, [cache, cacheTime]);

  const setCachedData = useCallback((key, data) => {
    setCache(prev => new Map(prev).set(key, data));
    setCacheTime(prev => new Map(prev).set(key, Date.now()));
  }, []);

  return { getCachedData, setCachedData };
};

const CotizacionesFormV2 = () => {
  // Estados
  const [cotizaciones, setCotizaciones] = useState([]);
  const [filteredCotizaciones, setFilteredCotizaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingCotizacion, setEditingCotizacion] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedCotizacion, setSelectedCotizacion] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [isPending, startTransition] = useTransition();
  const [optimisticUpdates, setOptimisticUpdates] = useState(new Set());
  
  const [formData, setFormData] = useState({
    cliente: '',
    proyecto: '',
    monto_neto: '',
    monto_con_iva: '',
    descripcion: '',
    documento: '',
    estado: 'No_creada'
  });

  // Hooks personalizados idénticos a Proveedores
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const { getCachedData, setCachedData } = useDataCache();

  // Estados de archivos
  const [selectedFile, setSelectedFile] = useState(null);

  // Estados de filtros
  const [estadoFilter, setEstadoFilter] = useState('');

  // Fetch cotizaciones optimizado como en Proveedores
  const fetchCotizaciones = useCallback(async () => {
    try {
      setLoading(true);
      const cached = getCachedData('cotizaciones');
      if (cached) {
        setCotizaciones(cached);
        setFilteredCotizaciones(cached);
        setLoading(false);
        return;
      }

      const response = await axios.get('/api/cotizaciones');
      if (response.data && response.data.success) {
        setCotizaciones(response.data.data);
        setFilteredCotizaciones(response.data.data);
        setCachedData('cotizaciones', response.data.data);
      } else {
        setCotizaciones([]);
        setFilteredCotizaciones([]);
      }
    } catch (error) {
      console.error('Error al obtener cotizaciones:', error);
      setCotizaciones([]);
      setFilteredCotizaciones([]);
    } finally {
      setLoading(false);
    }
  }, [getCachedData, setCachedData]);

  // Efecto para cargar datos
  useEffect(() => {
    fetchCotizaciones();
  }, [fetchCotizaciones]);

  // Efecto para filtros
  useEffect(() => {
    let filtered = cotizaciones;

    if (debouncedSearchTerm) {
      filtered = filtered.filter(cotizacion =>
        cotizacion.cliente?.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        cotizacion.proyecto?.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        cotizacion.descripcion?.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
      );
    }

    if (estadoFilter) {
      filtered = filtered.filter(cotizacion => cotizacion.estado === estadoFilter);
    }

    setFilteredCotizaciones(filtered);
  }, [cotizaciones, debouncedSearchTerm, estadoFilter]);

  // Estadísticas
  const stats = useMemo(() => [
    {
      label: 'Total Cotizaciones',
      value: cotizaciones.length.toString(),
      icon: <DescriptionIcon />,
      color: '#4ecdc4'
    },
    {
      label: 'No Creadas',
      value: cotizaciones.filter(c => c.estado === 'No_creada').length.toString(),
      icon: <BusinessIcon />,
      color: '#ff9a9e'
    },
    {
      label: 'En Proceso',
      value: cotizaciones.filter(c => c.estado === 'En_proceso_de_aceptaci_n').length.toString(),
      icon: <AssignmentIcon />,
      color: '#a8edea'
    },
    {
      label: 'Total Cotizado',
      value: new Intl.NumberFormat('es-MX', {
        style: 'currency',
        currency: 'MXN'
      }).format(cotizaciones.reduce((sum, c) => sum + parseFloat(c.monto_con_iva || 0), 0)),
      icon: <AttachMoneyIcon />,
      color: '#27ae60'
    }
  ], [cotizaciones]);

  // Funciones CRUD optimizadas como en Proveedores
  const createCotizacion = useCallback(async (data) => {
    try {
      const response = await axios.post('/api/cotizaciones', data);
      if (response.data && response.data.success) {
        setSnackbar({
          open: true,
          message: 'Cotización creada exitosamente',
          severity: 'success'
        });
        fetchCotizaciones();
        return true;
      }
    } catch (error) {
      console.error('Error al crear cotización:', error);
      setSnackbar({
        open: true,
        message: 'Error al crear cotización',
        severity: 'error'
      });
      return false;
    }
  }, [fetchCotizaciones]);

  const updateCotizacion = useCallback(async (id, data) => {
    try {
      const response = await axios.put(`/api/cotizaciones/${id}`, data);
      if (response.data && response.data.success) {
        setSnackbar({
          open: true,
          message: 'Cotización actualizada exitosamente',
          severity: 'success'
        });
        fetchCotizaciones();
        return true;
      }
    } catch (error) {
      console.error('Error al actualizar cotización:', error);
      setSnackbar({
        open: true,
        message: 'Error al actualizar cotización',
        severity: 'error'
      });
      return false;
    }
  }, [fetchCotizaciones]);

  const deleteCotizacion = useCallback(async (cotizacion) => {
    if (window.confirm(`¿Estás seguro de eliminar la cotización "${cotizacion.cliente}"?`)) {
      try {
        const response = await axios.delete(`/api/cotizaciones/${cotizacion.id}`);
        if (response.data && response.data.success) {
          setSnackbar({
            open: true,
            message: 'Cotización eliminada exitosamente',
            severity: 'success'
          });
          fetchCotizaciones();
        }
      } catch (error) {
        console.error('Error al eliminar cotización:', error);
        setSnackbar({
          open: true,
          message: 'Error al eliminar cotización',
          severity: 'error'
        });
      }
    }
  }, [fetchCotizaciones]);

  // Funciones de manejo de archivos
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setFormData(prev => ({ ...prev, documento: [file] }));
    }
  };

  const getFileUrl = (filename) => {
    const baseURL = window.location.hostname === 'localhost' ? 'process.env.REACT_APP_API_URL || "http://localhost:8765"' : 'https://sigma.runsolutions-services.com';
    return `${baseURL}/uploads/${filename}`;
  };

  // Funciones de formulario optimizadas como en Proveedores
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    
    if (editingCotizacion) {
      const success = await updateCotizacion(editingCotizacion.id, formData);
      if (success) {
        setShowForm(false);
        setEditingCotizacion(null);
        setFormData({
          cliente: '',
          proyecto: '',
          monto_neto: '',
          monto_con_iva: '',
          descripcion: '',
          documento: '',
          estado: 'No_creada'
        });
      }
    } else {
      const success = await createCotizacion(formData);
      if (success) {
        setShowForm(false);
        setFormData({
          cliente: '',
          proyecto: '',
          monto_neto: '',
          monto_con_iva: '',
          descripcion: '',
          documento: '',
          estado: 'No_creada'
        });
      }
    }
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingCotizacion(null);
    setFormData({
      cliente: '',
      proyecto: '',
      monto_neto: '',
      monto_con_iva: '',
      descripcion: '',
      documento: '',
      estado: 'No_creada'
    });
  };

  const handleEdit = (cotizacion) => {
    setEditingCotizacion(cotizacion);
    setFormData({
      cliente: cotizacion.cliente || '',
      proyecto: cotizacion.proyecto || '',
      monto_neto: cotizacion.monto_neto?.toString() || '',
      monto_con_iva: cotizacion.monto_con_iva?.toString() || '',
      descripcion: cotizacion.descripcion || '',
      documento: cotizacion.documento || '',
      estado: cotizacion.estado || 'No_creada'
    });
    setShowForm(true);
  };

  const handleViewDetails = (cotizacion) => {
    setSelectedCotizacion(cotizacion);
    setShowDetails(true);
  };

  const handleSnackbarClose = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  // Función para exportar
  const handleExport = () => {
    const csvContent = [
      ['Cliente', 'Proyecto', 'Monto Neto', 'Monto con IVA', 'Descripción', 'Estado', 'Fecha Creación'],
      ...cotizaciones.map(cot => [
        cot.cliente,
        cot.proyecto,
        cot.monto_neto,
        cot.monto_con_iva,
        cot.descripcion || '',
        cot.estado,
        new Date(cot.created_at).toLocaleDateString('es-MX')
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `cotizaciones_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <StyledContainer maxWidth="xl">
      {/* Header con estadísticas */}
      <StyledCard>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h4" sx={{ mb: 3, fontWeight: 700, color: '#2c3e50' }}>
            📋 Módulo de Cotizaciones
          </Typography>
          
          <Grid container spacing={3}>
            {stats.map((stat, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card sx={{ 
                    background: 'rgba(255,255,255,0.98)',
                    backdropFilter: 'blur(20px)',
                    borderRadius: 3,
                    border: '1px solid rgba(255,255,255,0.3)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 8px 25px rgba(0,0,0,0.15)'
                    }
                  }}>
                    <CardContent sx={{ textAlign: 'center', p: 2 }}>
                      <Box sx={{ color: stat.color, mb: 1 }}>
                        {stat.icon}
                      </Box>
                      <Typography variant="h4" sx={{ fontWeight: 700, mb: 1, color: '#2c3e50' }}>
                        {stat.value}
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#7f8c8d' }}>
                        {stat.label}
                      </Typography>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </StyledCard>

      {/* Botones de acción */}
      <Card sx={{ mb: 3, borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: '#2c3e50' }}>
            🚀 Botones de Acción
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setShowForm(true)}
              sx={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                borderRadius: 2,
                px: 3,
                py: 1.5,
                fontWeight: 600,
                boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 6px 20px rgba(102, 126, 234, 0.6)'
                },
                transition: 'all 0.3s ease'
              }}
            >
              Nueva Cotización
            </Button>
            
            <Button
              variant="outlined"
              startIcon={<DownloadIcon />}
              onClick={handleExport}
              sx={{
                borderColor: '#667eea',
                color: '#667eea',
                borderRadius: 2,
                px: 3,
                py: 1.5,
                fontWeight: 600,
                '&:hover': {
                  borderColor: '#667eea',
                  backgroundColor: 'rgba(102, 126, 234, 0.1)',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)'
                },
                transition: 'all 0.3s ease'
              }}
            >
              Exportar Informe
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Filtros */}
      <Card sx={{ mb: 3, borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: '#2c3e50' }}>
            🔍 Filtros
          </Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Buscar por cliente, proyecto o descripción"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                variant="outlined"
                size="small"
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <FormControl fullWidth size="small">
                <InputLabel>Estado</InputLabel>
                <Select
                  value={estadoFilter}
                  onChange={(e) => setEstadoFilter(e.target.value)}
                  label="Estado"
                >
                  <MenuItem value="">Todos los estados</MenuItem>
                  <MenuItem value="No_creada">No Creada</MenuItem>
                  <MenuItem value="En_proceso_de_aceptaci_n">En Proceso</MenuItem>
                  <MenuItem value="Aceptada_por_cliente">Aceptada</MenuItem>
                  <MenuItem value="No_aceptada">No Aceptada</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Indicador de actualizaciones optimistas */}
      {optimisticUpdates.size > 0 && (
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 1, 
          mb: 2, 
          p: 2, 
          bgcolor: 'rgba(102, 126, 234, 0.1)', 
          borderRadius: 2,
          border: '1px solid rgba(102, 126, 234, 0.3)',
          backdropFilter: 'blur(10px)'
        }}>
          <Box sx={{ 
            animation: 'spin 1s linear infinite',
            '@keyframes spin': {
              '0%': { transform: 'rotate(0deg)' },
              '100%': { transform: 'rotate(360deg)' }
            }
          }}>
            <RefreshIcon sx={{ color: '#667eea' }} />
          </Box>
          <Typography variant="body2" sx={{ color: '#667eea', fontWeight: 600 }}>
            {optimisticUpdates.size} actualización{optimisticUpdates.size > 1 ? 'es' : ''} en progreso...
          </Typography>
        </Box>
      )}

      {/* Tabla de cotizaciones */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
          <CardContent sx={{ p: 0 }}>
            <TableContainer component={Paper} sx={{ borderRadius: 0 }}>
              <StyledTable>
              <TableHead>
                <TableRow>
                  <TableCell>Cliente</TableCell>
                  <TableCell>Proyecto</TableCell>
                  <TableCell>Monto Neto</TableCell>
                  <TableCell>Monto con IVA</TableCell>
                  <TableCell>Descripción</TableCell>
                  <TableCell>Estado</TableCell>
                  <TableCell>Documento</TableCell>
                  <TableCell>Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <AnimatePresence>
                  {loading ? (
                    Array.from({ length: 5 }).map((_, index) => (
                      <CotizacionRowSkeleton key={index} />
                    ))
                  ) : filteredCotizaciones.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} align="center">
                        <Box sx={{ p: 4, textAlign: 'center' }}>
                          <DescriptionIcon sx={{ fontSize: 60, color: '#bdc3c7', mb: 2 }} />
                          <Typography variant="h6" sx={{ color: '#7f8c8d', mb: 1 }}>
                            {cotizaciones.length === 0 ? 'No hay cotizaciones registradas' : 'No se encontraron cotizaciones'}
                          </Typography>
                          <Typography variant="body2" sx={{ color: '#95a5a6' }}>
                            {cotizaciones.length === 0 ? 'Comienza agregando la primera cotización al sistema' : 'Intenta ajustar los filtros de búsqueda'}
                          </Typography>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredCotizaciones.map((cotizacion, index) => (
                      <motion.tr
                        key={cotizacion.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        component={TableRow}
                        sx={{
                          '&:hover': {
                            backgroundColor: '#f8f9fa',
                            transition: 'background-color 0.2s ease'
                          }
                        }}
                      >
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Avatar
                              sx={{
                                width: 48,
                                height: 48,
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                fontWeight: 700,
                                fontSize: '1.2rem'
                              }}
                            >
                              {cotizacion.cliente?.charAt(0)?.toUpperCase() || 'C'}
                            </Avatar>
                            <Box>
                              <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#2c3e50' }}>
                                {cotizacion.cliente}
                              </Typography>
                              <Typography variant="body2" sx={{ color: '#7f8c8d' }}>
                                {cotizacion.proyecto || 'Sin proyecto'}
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        
                        <TableCell>
                          <Typography variant="body2" sx={{ fontWeight: 600, color: '#2c3e50' }}>
                            {cotizacion.proyecto}
                          </Typography>
                        </TableCell>
                        
                        <TableCell>
                          <Typography variant="body2" sx={{ color: '#2c3e50' }}>
                            {new Intl.NumberFormat('es-MX', {
                              style: 'currency',
                              currency: 'MXN'
                            }).format(cotizacion.monto_neto)}
                          </Typography>
                        </TableCell>
                        
                        <TableCell>
                          <Box>
                            <Typography variant="body2" sx={{ color: '#2c3e50' }}>
                              {new Intl.NumberFormat('es-MX', {
                                style: 'currency',
                                currency: 'MXN'
                              }).format(cotizacion.monto_con_iva)}
                            </Typography>
                          </Box>
                        </TableCell>
                        
                        <TableCell>
                          <Typography variant="body2" sx={{ color: '#7f8c8d' }}>
                            {cotizacion.descripcion || 'Sin descripción'}
                          </Typography>
                        </TableCell>
                        
                        <TableCell>
                          <StyledChip
                            label={cotizacion.estado?.replace(/_/g, ' ') || 'No_creada'}
                            status={cotizacion.estado || 'No_creada'}
                            size="small"
                          />
                        </TableCell>
                        
                        <TableCell>
                          {cotizacion.documento ? (
                            <Box sx={{ display: 'flex', gap: 1 }}>
                              <Tooltip title="Ver documento">
                                <IconButton
                                  size="small"
                                  onClick={() => window.open(getFileUrl(cotizacion.documento), '_blank')}
                                  sx={{ color: '#e74c3c' }}
                                >
                                  <PictureAsPdfIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Descargar documento">
                                <IconButton
                                  size="small"
                                  onClick={() => window.open(getFileUrl(cotizacion.documento), '_blank')}
                                  sx={{ color: '#3498db' }}
                                >
                                  <DownloadIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            </Box>
                          ) : (
                            <Typography variant="body2" sx={{ color: '#bdc3c7', fontStyle: 'italic' }}>
                              Sin documento
                            </Typography>
                          )}
                        </TableCell>
                        
                        <TableCell align="center">
                          <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                            <Tooltip title="Ver detalles">
                              <ActionButton
                                color="#45b7d1"
                                onClick={() => handleViewDetails(cotizacion)}
                              >
                                <VisibilityIcon fontSize="small" />
                              </ActionButton>
                            </Tooltip>
                            
                            <Tooltip title="Editar cotización">
                              <ActionButton
                                color="#f39c12"
                                onClick={() => handleEdit(cotizacion)}
                              >
                                <EditIcon fontSize="small" />
                              </ActionButton>
                            </Tooltip>
                            
                            <Tooltip title="Eliminar cotización">
                              <ActionButton
                                color="#e74c3d"
                                onClick={() => deleteCotizacion(cotizacion)}
                              >
                                <DeleteIcon fontSize="small" />
                              </ActionButton>
                            </Tooltip>
                          </Box>
                        </TableCell>
                      </motion.tr>
                    ))
                  )}
                </AnimatePresence>
              </TableBody>
            </StyledTable>
          </TableContainer>
        </CardContent>
      </Card>
        </motion.div>

      {/* Formulario modal como en Proveedores */}
      <Dialog
        open={showForm}
        onClose={handleFormCancel}
        maxWidth="md"
        fullWidth
        TransitionComponent={Zoom}
        PaperProps={{
          sx: {
            borderRadius: 16,
            overflow: 'hidden'
          }
        }}
      >
        <DialogTitle
          sx={{
            p: 3,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: '#fff',
            fontWeight: 700,
            position: 'relative'
          }}
        >
          {editingCotizacion ? '✏️ Editar Cotización' : '➕ Crear Nueva Cotización'}
          <IconButton
            onClick={handleFormCancel}
            sx={{
              position: 'absolute',
              right: 16,
              top: 16,
              color: '#fff',
              '&:hover': { 
                color: '#ffeb3b',
                transform: 'rotate(90deg)',
                transition: 'transform 0.3s ease'
              }
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        
        <DialogContent sx={{ p: 0 }}>
          <Box component="form" onSubmit={handleFormSubmit} sx={{ p: 3 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="cliente"
                  label="Cliente"
                  value={formData.cliente}
                  onChange={(e) => setFormData({ ...formData, cliente: e.target.value })}
                  fullWidth
                  required
                  variant="outlined"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 12,
                      background: 'rgba(255,255,255,0.9)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255,255,255,0.3)',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        background: 'rgba(255,255,255,0.95)',
                        borderColor: 'rgba(102, 126, 234, 0.5)'
                      },
                      '&.Mui-focused': {
                        background: 'rgba(255,255,255,1)',
                        borderColor: '#667eea',
                        boxShadow: '0 0 0 3px rgba(102, 126, 234, 0.1)'
                      }
                    }
                  }}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  name="proyecto"
                  label="Proyecto"
                  value={formData.proyecto}
                  onChange={(e) => setFormData({ ...formData, proyecto: e.target.value })}
                  fullWidth
                  required
                  variant="outlined"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 12,
                      background: 'rgba(255,255,255,0.9)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255,255,255,0.3)',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        background: 'rgba(255,255,255,0.95)',
                        borderColor: 'rgba(102, 126, 234, 0.5)'
                      },
                      '&.Mui-focused': {
                        background: 'rgba(255,255,255,1)',
                        borderColor: '#667eea',
                        boxShadow: '0 0 0 3px rgba(102, 126, 234, 0.1)'
                      }
                    }
                  }}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  name="monto_neto"
                  label="Monto Neto"
                  type="number"
                  value={formData.monto_neto}
                  onChange={(e) => setFormData({ ...formData, monto_neto: e.target.value })}
                  fullWidth
                  required
                  variant="outlined"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 12,
                      background: 'rgba(255,255,255,0.9)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255,255,255,0.3)',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        background: 'rgba(255,255,255,0.95)',
                        borderColor: 'rgba(102, 126, 234, 0.5)'
                      },
                      '&.Mui-focused': {
                        background: 'rgba(255,255,255,1)',
                        borderColor: '#667eea',
                        boxShadow: '0 0 0 3px rgba(102, 126, 234, 0.1)'
                      }
                    }
                  }}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  name="monto_con_iva"
                  label="Monto con IVA"
                  type="number"
                  value={formData.monto_con_iva}
                  onChange={(e) => setFormData({ ...formData, monto_con_iva: e.target.value })}
                  fullWidth
                  required
                  variant="outlined"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 12,
                      background: 'rgba(255,255,255,0.9)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255,255,255,0.3)',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        background: 'rgba(255,255,255,0.95)',
                        borderColor: 'rgba(102, 126, 234,0.5)'
                      },
                      '&.Mui-focused': {
                        background: 'rgba(255,255,255,1)',
                        borderColor: '#667eea',
                        boxShadow: '0 0 0 3px rgba(102, 126, 234, 0.1)'
                      }
                    }
                  }}
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  name="descripcion"
                  label="Descripción"
                  value={formData.descripcion}
                  onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                  fullWidth
                  multiline
                  rows={3}
                  variant="outlined"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 12,
                      background: 'rgba(255,255,255,0.9)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255,255,255,0.3)',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        background: 'rgba(255,255,255,0.95)',
                        borderColor: 'rgba(102, 126, 234, 0.5)'
                      },
                      '&.Mui-focused': {
                        background: 'rgba(255,255,255,1)',
                        borderColor: '#667eea',
                        boxShadow: '0 0 0 3px rgba(102, 126, 234, 0.1)'
                      }
                    }
                  }}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <StyledSelect fullWidth required>
                  <InputLabel>Estado</InputLabel>
                  <Select
                    name="estado"
                    value={formData.estado}
                    onChange={(e) => setFormData({ ...formData, estado: e.target.value })}
                    label="Estado"
                  >
                    <MenuItem value="No_creada">No Creada</MenuItem>
                    <MenuItem value="En_proceso_de_aceptaci_n">En Proceso</MenuItem>
                    <MenuItem value="Aceptada_por_cliente">Aceptada</MenuItem>
                    <MenuItem value="No_aceptada">No Aceptada</MenuItem>
                  </Select>
                </StyledSelect>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Button
                  variant="outlined"
                  component="label"
                  startIcon={<FileUploadIcon />}
                  fullWidth
                  sx={{ 
                    height: 56,
                    borderRadius: 12,
                    borderColor: '#667eea',
                    color: '#667eea',
                    fontWeight: 600,
                    background: 'rgba(255,255,255,0.9)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(102, 126, 234, 0.3)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      borderColor: '#667eea',
                      backgroundColor: 'rgba(102, 126, 234, 0.1)',
                      transform: 'translateY(-2px)'
                    }
                  }}
                >
                  {selectedFile ? selectedFile.name : 'Subir Documento'}
                  <input
                    type="file"
                    hidden
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileChange}
                  />
                </Button>
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        
        <DialogActions sx={{ p: 3, gap: 2 }}>
          <Button
            onClick={handleFormCancel}
            variant="outlined"
            sx={{
              borderRadius: 12,
              px: 3,
              py: 1.5,
              fontWeight: 600
            }}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="contained"
            onClick={handleFormSubmit}
            sx={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              borderRadius: 12,
              px: 3,
              py: 1.5,
              fontWeight: 600,
              boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 6px 20px rgba(102, 126, 234, 0.4)'
              }
            }}
          >
            {editingCotizacion ? 'Actualizar' : 'Crear'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal de detalles del proveedor */}
      <Dialog 
        open={showDetails} 
        onClose={() => setShowDetails(false)} 
        maxWidth="lg" 
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
          }
        }}
      >
        <DialogTitle sx={{ 
          background: 'linear-gradient(135deg, #667eea, #764ba2)',
          color: '#fff',
          borderRadius: 0,
          pb: 2
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <DescriptionIcon sx={{ fontSize: '2rem' }} />
              <Typography variant="h5" sx={{ fontWeight: 700 }}>
                Detalles de la Cotización
              </Typography>
            </Box>
            <IconButton 
              onClick={() => setShowDetails(false)}
              sx={{ 
                color: '#fff',
                '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' }
              }}
            >
              <ErrorIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        
        <DialogContent sx={{ mt: 2, p: 3 }}>
          {selectedCotizacion && (
            <Box>
              {/* Información Principal */}
              <Card sx={{ p: 3, mb: 3, background: 'rgba(255,255,255,0.9)' }}>
                <Typography variant="h6" sx={{ fontWeight: 700, color: '#2c3e50', mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                  📋 Información General
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={8}>
                    <Typography variant="subtitle2" sx={{ color: '#7f8c8d', fontWeight: 600, mb: 1 }}>
                      Cliente
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 600, color: '#2c3e50', mb: 2 }}>
                      {selectedCotizacion.cliente}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Typography variant="subtitle2" sx={{ color: '#7f8c8d', fontWeight: 600, mb: 1 }}>
                      Proyecto
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 600, color: '#2c3e50', mb: 2 }}>
                      {selectedCotizacion.proyecto}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle2" sx={{ color: '#7f8c8d', fontWeight: 600, mb: 1 }}>
                      Estado
                    </Typography>
                    <StyledChip
                      label={selectedCotizacion.estado?.replace(/_/g, ' ') || 'No_creada'}
                      status={selectedCotizacion.estado || 'No_creada'}
                      size="medium"
                      sx={{ fontWeight: 700 }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle2" sx={{ color: '#7f8c8d', fontWeight: 600, mb: 1 }}>
                      Descripción
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#2c3e50', fontWeight: 600 }}>
                      {selectedCotizacion.descripcion || 'Sin descripción'}
                    </Typography>
                  </Grid>
                </Grid>
              </Card>

              {/* Información Financiera */}
              <Card sx={{ p: 3, mb: 3, background: 'rgba(255,255,255,0.9)' }}>
                <Typography variant="h6" sx={{ fontWeight: 700, color: '#2c3e50', mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                  💰 Información Financiera
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Box sx={{ p: 2, borderRadius: 2, background: 'rgba(39, 174, 96, 0.1)' }}>
                      <Typography variant="subtitle2" sx={{ color: '#7f8c8d', fontWeight: 600, mb: 1 }}>
                        Monto Neto
                      </Typography>
                      <Typography variant="h6" sx={{ fontWeight: 700, color: '#27ae60' }}>
                        {new Intl.NumberFormat('es-MX', {
                          style: 'currency',
                          currency: 'MXN'
                        }).format(selectedCotizacion.monto_neto)}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Box sx={{ p: 2, borderRadius: 2, background: 'rgba(231, 76, 60, 0.1)' }}>
                      <Typography variant="subtitle2" sx={{ color: '#7f8c8d', fontWeight: 600, mb: 1 }}>
                        Monto con IVA
                      </Typography>
                      <Typography variant="h6" sx={{ fontWeight: 12, color: '#e74c3c' }}>
                        {new Intl.NumberFormat('es-MX', {
                          style: 'currency',
                          currency: 'MXN'
                        }).format(selectedCotizacion.monto_con_iva)}
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Card>

              {/* Documento */}
              <Card sx={{ p: 3, background: 'rgba(255,255,255,0.9)' }}>
                <Typography variant="h6" sx={{ fontWeight: 700, color: '#2c3e50', mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                  📄 Documento
                </Typography>
                {selectedCotizacion.documento ? (
                  <Box sx={{ p: 2, borderRadius: 2, background: 'rgba(102, 126, 234, 0.1)', border: '1px solid rgba(102, 126, 234, 0.1)' }}>
                    <Typography variant="body1" sx={{ color: '#2c3e50', fontWeight: 600, mb: 2 }}>
                      {selectedCotizacion.documento}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 2 }}>
                      <Button
                        variant="outlined"
                        startIcon={<PictureAsPdfIcon />}
                        onClick={() => window.open(getFileUrl(selectedCotizacion.documento), '_blank')}
                        sx={{
                          borderColor: '#e74c3c',
                          color: '#e74c3c',
                          fontWeight: 600,
                          '&:hover': {
                            borderColor: '#e74c3c',
                            backgroundColor: 'rgba(231, 76, 60, 0.1)'
                          },
                          transition: 'all 0.3s ease'
                        }}
                      >
                        Ver
                      </Button>
                      <Button
                        variant="outlined"
                        startIcon={<DownloadIcon />}
                        onClick={() => window.open(getFileUrl(selectedCotizacion.documento), '_blank')}
                        sx={{
                          borderColor: '#3498db',
                          color: '#3498db',
                          fontWeight: 600,
                          '&:hover': {
                            borderColor: '#3498db',
                            backgroundColor: 'rgba(52, 152, 219, 0.1)'
                          },
                          transition: 'all 0.3s ease'
                        }}
                      >
                        Descargar
                      </Button>
                    </Box>
                  </Box>
                ) : (
                  <Box sx={{ p: 2, borderRadius: 2, background: 'rgba(189, 195, 199, 0.1)', border: '1px solid rgba(189, 195, 199, 0.1)' }}>
                    <Typography variant="body1" sx={{ color: '#7f8c8d', fontStyle: 'italic' }}>
                      Sin documento
                    </Typography>
                  </Box>
                )}
              </Card>
            </Box>
          )}
        </DialogContent>
        
        <DialogActions sx={{ p: 3, background: 'rgba(255,255,255,0.9)' }}>
          <Button 
            onClick={() => setShowDetails(false)}
            variant="contained"
            sx={{
              background: 'linear-gradient(135deg, #667eea, #764ba2)',
              color: '#fff',
              fontWeight: 600,
              px: 4,
              py: 1.5,
              borderRadius: 2,
              '&:hover': {
                background: 'linear-gradient(135deg, #5a6fd8, #6a4190)'
              }
            }}
          >
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar de notificaciones */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbar.severity}
          variant="filled"
          sx={{
            borderRadius: 12,
            fontWeight: 600,
            boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </StyledContainer>
  );
};

export default CotizacionesFormV2;
