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
import ExportButton from '../../components/ExportButton';

// ========================================
// COMPONENTES ESTILIZADOS IDÉNTICOS A PROYECTOS
// ========================================

// Container con el mismo estilo que Proyectos
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

// Card con el mismo estilo que Proyectos
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

// Tabla con el mismo estilo que Proyectos
const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  borderRadius: 16,
  overflow: 'hidden',
  boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
  background: 'rgba(255,255,255,0.98)',
  backdropFilter: 'blur(20px)'
}));

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

const StyledChip = styled(Chip)(({ theme, status }) => ({
  backgroundColor: status === 'activo' ? '#27ae60' :
                 status === 'servicio' ? '#3498db' :
                 status === 'producto' ? '#9b59b6' : 
                 status === 'inactivo' ? '#e74c3c' : '#95a5a6',
  color: '#fff',
  fontWeight: 600,
  fontSize: '0.75rem',
  minWidth: '80px',
  '& .MuiChip-label': {
    px: 1,
    textAlign: 'center'
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

// Campo de búsqueda con el mismo estilo que Proyectos
const StyledSearchField = styled(TextField)(({ theme }) => ({
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

// Select con el mismo estilo que Proyectos
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

// Skeleton con el mismo estilo que Proyectos
const ProviderRowSkeleton = React.memo(() => (
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
      <Skeleton variant="rectangular" width={80} height={24} sx={{ borderRadius: 1 }} />
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

// Hooks personalizados idénticos a Proyectos
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

const ProveedoresFormV2 = () => {
  // Estados optimizados como en Proyectos
  const [proveedores, setProveedores] = useState([]);
  const [filteredProveedores, setFilteredProveedores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProveedor, setEditingProveedor] = useState(null);
  const [formData, setFormData] = useState({
    run_proveedor: '',
    nombre: '',
    direccion: '',
    telefono: '',
    email: '',
    tipo_proveedor: '',
    estado: 'activo'
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [isPending, startTransition] = useTransition();
  const [selectedProveedor, setSelectedProveedor] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  // Hooks personalizados
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const { getCachedData, setCachedData } = useDataCache();

  // Estadísticas optimizadas como en Proyectos
  const stats = useMemo(() => [
    { 
      label: 'Total Proveedores', 
      value: proveedores.length.toString(), 
      icon: <BusinessIcon />, 
      color: '#4ecdc4' 
    },
    { 
      label: 'Proveedores Activos', 
      value: proveedores.filter(p => p.estado === 'activo').length.toString(), 
      icon: <TrendingUpIcon />, 
      color: '#27ae60' 
    },
    { 
      label: 'Servicios', 
      value: proveedores.filter(p => p.tipo_proveedor === 'servicio').length.toString(), 
      icon: <TimelineIcon />, 
      color: '#f39c12' 
    },
    { 
      label: 'Productos', 
      value: proveedores.filter(p => p.tipo_proveedor === 'producto').length.toString(), 
      icon: <ScheduleIcon />, 
      color: '#e74c3c' 
    }
  ], [proveedores]);

  // Funciones de API optimizadas como en Proyectos
  const fetchProveedores = useCallback(async () => {
    try {
      setLoading(true);
      const cached = getCachedData('proveedores');
      if (cached) {
        setProveedores(cached);
        setFilteredProveedores(cached);
        setLoading(false);
        return;
      }

      const response = await axios.get('/api/proveedores');
      if (response.data && response.data.success) {
        setProveedores(response.data.data);
        setFilteredProveedores(response.data.data);
        setCachedData('proveedores', response.data.data);
      } else {
        setProveedores([]);
        setFilteredProveedores([]);
      }
    } catch (error) {
      console.error('Error al obtener proveedores:', error);
      setProveedores([]);
      setFilteredProveedores([]);
    } finally {
      setLoading(false);
    }
  }, [getCachedData, setCachedData]);

  const createProveedor = useCallback(async (data) => {
    try {
      const response = await axios.post('/api/proveedores', data);
      if (response.data && response.data.success) {
        setSnackbar({
          open: true,
          message: 'Proveedor creado exitosamente',
          severity: 'success'
        });
        fetchProveedores();
        return true;
      }
    } catch (error) {
      console.error('Error al crear proveedor:', error);
      setSnackbar({
        open: true,
        message: 'Error al crear proveedor',
        severity: 'error'
      });
      return false;
    }
  }, [fetchProveedores]);

  const updateProveedor = useCallback(async (id, data) => {
    try {
      const response = await axios.put(`/api/proveedores/${id}`, data);
      if (response.data && response.data.success) {
        setSnackbar({
          open: true,
          message: 'Proveedor actualizado exitosamente',
          severity: 'success'
        });
        fetchProveedores();
        return true;
      }
    } catch (error) {
      console.error('Error al actualizar proveedor:', error);
      setSnackbar({
        open: true,
        message: 'Error al actualizar proveedor',
        severity: 'error'
      });
      return false;
    }
  }, [fetchProveedores]);

  const deleteProveedor = useCallback(async (proveedor) => {
    if (window.confirm(`¿Estás seguro de eliminar al proveedor ${proveedor.nombre}?`)) {
      try {
        const response = await axios.delete(`/api/proveedores/${proveedor.id}`);
        if (response.data && response.data.success) {
          setSnackbar({
            open: true,
            message: 'Proveedor eliminado exitosamente',
            severity: 'success'
          });
          fetchProveedores();
        }
      } catch (error) {
        console.error('Error al eliminar proveedor:', error);
        setSnackbar({
          open: true,
          message: 'Error al eliminar proveedor',
          severity: 'error'
        });
      }
    }
  }, [fetchProveedores]);

  // Filtros y búsqueda como en Proyectos
  useEffect(() => {
    startTransition(() => {
      let filtered = proveedores;

      if (searchTerm) {
        filtered = filtered.filter(proveedor =>
          proveedor.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
          proveedor.run_proveedor.toLowerCase().includes(searchTerm.toLowerCase()) ||
          proveedor.email?.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      if (statusFilter !== 'all') {
        filtered = filtered.filter(proveedor => proveedor.estado === statusFilter);
      }

      setFilteredProveedores(filtered);
    });
  }, [proveedores, debouncedSearchTerm, statusFilter]);

  // Manejadores de eventos
  const handleCreateProveedor = () => {
    setEditingProveedor(null);
    setFormData({
      run_proveedor: '',
      nombre: '',
      elemento: '',
      datos_bancarios: '',
      contacto: '',
      direccion: '',
      telefono: '',
      email: '',
      tipo_proveedor: 'producto',
      estado: 'activo'
    });
    setShowForm(true);
  };

  const handleEditProveedor = (proveedor) => {
    setEditingProveedor(proveedor);
    setFormData({
      run_proveedor: proveedor.run_proveedor || '',
      nombre: proveedor.nombre || '',
      elemento: proveedor.elemento || '',
      datos_bancarios: proveedor.datos_bancarios || '',
      contacto: proveedor.contacto || '',
      direccion: proveedor.direccion || '',
      telefono: proveedor.telefono || '',
      email: proveedor.email || '',
      tipo_proveedor: proveedor.tipo_proveedor || 'producto',
      estado: proveedor.estado || 'activo'
    });
    setShowForm(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    
    // Validar solo el campo más importante
    if (!formData.nombre || !formData.nombre.trim()) {
      setSnackbar({
        open: true,
        message: 'El nombre del proveedor es obligatorio',
        severity: 'error'
      });
      return;
    }
    
    if (editingProveedor) {
      const success = await updateProveedor(editingProveedor.id, formData);
      if (success) {
        setShowForm(false);
        setEditingProveedor(null);
      }
    } else {
      const success = await createProveedor(formData);
      if (success) {
        setShowForm(false);
      }
    }
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingProveedor(null);
    setFormData({
      run_proveedor: '',
      nombre: '',
      elemento: '',
      datos_bancarios: '',
      contacto: '',
      direccion: '',
      telefono: '',
      email: '',
      tipo_proveedor: 'producto',
      estado: 'activo'
    });
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Efectos
  useEffect(() => {
    fetchProveedores();
  }, [fetchProveedores]);

  return (
    <StyledContainer maxWidth="xl">
      {/* Header con estadísticas como en Proyectos */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography
            variant="h3"
            component="h1"
            sx={{
              fontWeight: 800,
              color: '#ffffff',
              mb: 2,
              textTransform: 'capitalize',
              textShadow: '0 2px 4px rgba(0,0,0,0.3)'
            }}
          >
            <BusinessIcon sx={{ mr: 2, verticalAlign: 'middle' }} />
            Proveedores
          </Typography>
          <Typography
            variant="h6"
            sx={{
              color: 'rgba(255,255,255,0.9)',
              fontWeight: 400,
              opacity: 0.9
            }}
          >
            Gestiona y controla los proveedores del sistema
          </Typography>
        </Box>
      </motion.div>

      {/* Botones de acción - ARRIBA DE LOS KPIs como en Proyectos */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <Box sx={{ mb: 3, display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleCreateProveedor}
            sx={{
              backgroundColor: '#4caf50',
              '&:hover': { backgroundColor: '#45a049' },
              borderRadius: 2,
              px: 4,
              py: 1.5,
              fontWeight: 600,
              fontSize: '1rem'
            }}
          >
            Nuevo Proveedor
          </Button>
          
          <ExportButton
            onExport={async (exportData) => {
              try {
                const exportFiltered = window.confirm(
                  `¿Qué quieres exportar?\n\n` +
                  `• Solo proveedores filtrados (${filteredProveedores.length} proveedores)\n` +
                  `• Todos los proveedores (${proveedores.length} proveedores)\n\n` +
                  `Haz clic en "Aceptar" para exportar solo los filtrados, o "Cancelar" para exportar todos.`
                );
                
                const proveedoresData = exportFiltered ? filteredProveedores : proveedores;
                
                if (proveedoresData.length === 0) {
                  setSnackbar({ 
                    open: true, 
                    message: 'No hay proveedores para exportar', 
                    severity: 'warning' 
                  });
                  return;
                }
                
                // Crear contenido del archivo según el formato
                let content, filename, mimeType;
                
                if (exportData.format === 'csv') {
                  const headers = ['ID', 'RUN/RUT', 'Nombre', 'Dirección', 'Teléfono', 'Email', 'Tipo', 'Estado', 'Fecha Creación'];
                  const csvContent = [
                    headers.join(','),
                    ...proveedoresData.map(proveedor => [
                      proveedor.id,
                      proveedor.run_proveedor || '',
                      proveedor.nombre || '',
                      (proveedor.direccion || '').replace(/,/g, ';'),
                      proveedor.telefono || '',
                      proveedor.email || '',
                      proveedor.tipo_proveedor || '',
                      proveedor.estado || 'activo',
                      proveedor.created_at ? new Date(proveedor.created_at).toLocaleDateString() : ''
                    ].join(','))
                  ].join('\n');
                  
                  content = csvContent;
                  filename = `proveedores_${new Date().toISOString().split('T')[0]}.csv`;
                  mimeType = 'text/csv';
                } else if (exportData.format === 'excel') {
                  const headers = ['ID', 'RUN/RUT', 'Nombre', 'Dirección', 'Teléfono', 'Email', 'Tipo', 'Estado', 'Fecha Creación'];
                  const tsvContent = [
                    headers.join('\t'),
                    ...proveedoresData.map(proveedor => [
                      proveedor.id,
                      proveedor.run_proveedor || '',
                      proveedor.nombre || '',
                      (proveedor.direccion || '').replace(/\t/g, ' '),
                      proveedor.telefono || '',
                      proveedor.email || '',
                      proveedor.tipo_proveedor || '',
                      proveedor.estado || 'activo',
                      proveedor.created_at ? new Date(proveedor.created_at).toLocaleDateString() : ''
                    ].join('\t'))
                  ].join('\n');
                  
                  content = tsvContent;
                  filename = `proveedores_${new Date().toISOString().split('T')[0]}.tsv`;
                  mimeType = 'text/tab-separated-values';
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
                
                setSnackbar({
                  open: true,
                  message: `Proveedores exportados exitosamente (${proveedoresData.length} registros)`,
                  severity: 'success'
                });
              } catch (error) {
                console.error('Error al exportar:', error);
                setSnackbar({
                  open: true,
                  message: 'Error al exportar proveedores',
                  severity: 'error'
                });
              }
            }}
            data={filteredProveedores}
            filename="proveedores"
            moduleName="Proveedores"
          />
        </Box>
      </motion.div>

      {/* Estadísticas como en Proyectos */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {stats.map((stat, index) => (
            <Grid item xs={6} sm={3} key={index}>
              <StyledCard>
                <CardContent sx={{ textAlign: 'center', p: 2 }}>
                  <Box sx={{ color: stat.color, mb: 1 }}>
                    {stat.icon}
                  </Box>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: '#2c3e50', mb: 0.5 }}>
                    {stat.value}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#7f8c8d', fontWeight: 500 }}>
                    {stat.label}
                  </Typography>
                </CardContent>
              </StyledCard>
            </Grid>
          ))}
        </Grid>
      </motion.div>

      {/* Barra de acciones como en Proyectos */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <StyledCard sx={{ mb: 4 }}>
          <CardContent>
            <Grid container spacing={3} alignItems="center">
              <Grid item xs={12} sm={6} md={3}>
                <StyledSearchField
                  fullWidth
                  placeholder="Buscar proveedores..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{
                    startAdornment: <SearchIcon sx={{ color: '#7f8c8d', mr: 1 }} />
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <StyledSelect fullWidth>
                  <InputLabel>Filtrar por Estado</InputLabel>
                  <Select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    label="Filtrar por Estado"
                  >
                    <MenuItem value="all">Todos</MenuItem>
                    <MenuItem value="activo">Activos</MenuItem>
                    <MenuItem value="inactivo">Inactivos</MenuItem>
                  </Select>
                </StyledSelect>
              </Grid>
              <Grid item xs={12} sm={6} md={6}>
                <Button
                  variant="outlined"
                  startIcon={<RefreshIcon />}
                  onClick={fetchProveedores}
                  sx={{
                    borderColor: 'rgba(255,255,255,0.3)',
                    color: '#fff',
                    borderRadius: 12,
                    px: 3,
                    py: 1.5,
                    fontWeight: 600,
                    '&:hover': {
                      borderColor: '#fff',
                      background: 'rgba(255,255,255,0.1)'
                    }
                  }}
                >
                  Actualizar
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </StyledCard>
      </motion.div>

      {/* Tabla de datos como en Proyectos */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
      >
        <StyledCard>
          <StyledTableContainer>
            <StyledTable>
              <TableHead>
                <TableRow>
                  <TableCell>Proveedor</TableCell>
                  <TableCell>RUN/RUT</TableCell>
                  <TableCell>Contacto</TableCell>
                  <TableCell>Tipo</TableCell>
                  <TableCell>Estado</TableCell>
                  <TableCell align="center">Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  Array.from({ length: 8 }).map((_, index) => (
                    <ProviderRowSkeleton key={index} />
                  ))
                ) : filteredProveedores.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      <Box sx={{ p: 4, textAlign: 'center' }}>
                        <BusinessIcon sx={{ fontSize: 60, color: '#bdc3c7', mb: 2 }} />
                        <Typography variant="h6" sx={{ color: '#7f8c8d', mb: 1 }}>
                          No hay proveedores registrados
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#95a5a6' }}>
                          Comienza agregando el primer proveedor al sistema
                        </Typography>
                      </Box>
                    </TableCell>
                  </TableRow>
                ) : (
                  <AnimatePresence>
                    {filteredProveedores.map((proveedor, index) => (
                      <motion.tr
                        key={proveedor.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        component={TableRow}
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
                              {proveedor.nombre?.charAt(0)?.toUpperCase() || 'P'}
                            </Avatar>
                            <Box>
                              <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#2c3e50' }}>
                                {proveedor.nombre}
                              </Typography>
                              <Typography variant="body2" sx={{ color: '#7f8c8d' }}>
                                {proveedor.direccion || 'Sin dirección'}
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" sx={{ fontWeight: 600, color: '#2c3e50' }}>
                            {proveedor.run_proveedor}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Box>
                            <Typography variant="body2" sx={{ color: '#2c3e50' }}>
                              {proveedor.email || 'Sin email'}
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#7f8c8d' }}>
                              {proveedor.telefono || 'Sin teléfono'}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <StyledChip
                            label={proveedor.tipo_proveedor === 'servicio' ? 'Servicio' : 'Producto'}
                            status={proveedor.tipo_proveedor === 'servicio' ? 'activo' : 'inactivo'}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <StyledChip
                            label={proveedor.estado === 'activo' ? 'Activo' : 'Inactivo'}
                            status={proveedor.estado}
                            size="small"
                          />
                        </TableCell>
                        <TableCell align="center">
                          <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                            <Tooltip title="Ver detalles">
                              <ActionButton
                                color="#45b7d1"
                                onClick={() => {
                                  setSelectedProveedor(proveedor);
                                  setShowDetails(true);
                                }}
                              >
                                <VisibilityIcon fontSize="small" />
                              </ActionButton>
                            </Tooltip>
                            <Tooltip title="Editar proveedor">
                              <ActionButton
                                color="#f39c12"
                                onClick={() => handleEditProveedor(proveedor)}
                              >
                                <EditIcon fontSize="small" />
                              </ActionButton>
                            </Tooltip>
                            <Tooltip title="Eliminar proveedor">
                              <ActionButton
                                color="#e74c3c"
                                onClick={() => deleteProveedor(proveedor)}
                              >
                                <DeleteIcon fontSize="small" />
                              </ActionButton>
                            </Tooltip>
                          </Box>
                        </TableCell>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                )}
              </TableBody>
            </StyledTable>
          </StyledTableContainer>
        </StyledCard>
      </motion.div>

      {/* Formulario modal como en Proyectos */}
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
          {editingProveedor ? '✏️ Editar Proveedor' : '➕ Crear Nuevo Proveedor'}
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
                  name="run_proveedor"
                  label="RUN/RUT Proveedor"
                  value={formData.run_proveedor}
                  onChange={(e) => setFormData({ ...formData, run_proveedor: e.target.value })}
                  fullWidth
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
                  name="nombre"
                  label="Nombre del Proveedor"
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
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
                  name="elemento"
                  label="Elemento/Servicio"
                  value={formData.elemento}
                  onChange={(e) => setFormData({ ...formData, elemento: e.target.value })}
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
                  name="datos_bancarios"
                  label="Datos Bancarios"
                  value={formData.datos_bancarios}
                  onChange={(e) => setFormData({ ...formData, datos_bancarios: e.target.value })}
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
                  name="contacto"
                  label="Contacto"
                  value={formData.contacto}
                  onChange={(e) => setFormData({ ...formData, contacto: e.target.value })}
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
                  name="direccion"
                  label="Dirección"
                  value={formData.direccion}
                  onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
                  fullWidth
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
                  name="telefono"
                  label="Teléfono"
                  value={formData.telefono}
                  onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                  fullWidth
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
                  name="email"
                  label="Email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  fullWidth
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
                  <InputLabel>Tipo de Proveedor</InputLabel>
                  <Select
                    name="tipo_proveedor"
                    value={formData.tipo_proveedor}
                    onChange={(e) => setFormData({ ...formData, tipo_proveedor: e.target.value })}
                    label="Tipo de Proveedor"
                  >
                    <MenuItem value="servicio">Servicio</MenuItem>
                    <MenuItem value="producto">Producto</MenuItem>
                  </Select>
                </StyledSelect>
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
                    <MenuItem value="activo">Activo</MenuItem>
                    <MenuItem value="inactivo">Inactivo</MenuItem>
                  </Select>
                </StyledSelect>
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
            {editingProveedor ? 'Actualizar' : 'Crear'}
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
              <BusinessIcon sx={{ fontSize: '2rem' }} />
              <Typography variant="h5" sx={{ fontWeight: 700 }}>
                Detalles del Proveedor
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
          {selectedProveedor && (
            <Box>
              {/* Información Principal */}
              <Card sx={{ p: 3, mb: 3, background: 'rgba(255,255,255,0.9)' }}>
                <Typography variant="h6" sx={{ fontWeight: 700, color: '#2c3e50', mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                  📋 Información General
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={8}>
                    <Typography variant="subtitle2" sx={{ color: '#7f8c8d', fontWeight: 600, mb: 1 }}>
                      Nombre
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 600, color: '#2c3e50', mb: 2 }}>
                      {selectedProveedor.nombre}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Typography variant="subtitle2" sx={{ color: '#7f8c8d', fontWeight: 600, mb: 1 }}>
                      RUN/RUT
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 600, color: '#2c3e50', mb: 2 }}>
                      {selectedProveedor.run_proveedor}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle2" sx={{ color: '#7f8c8d', fontWeight: 600, mb: 1 }}>
                      Tipo de Proveedor
                    </Typography>
                    <StyledChip
                      label={selectedProveedor.tipo_proveedor === 'servicio' ? 'Servicio' : 'Producto'}
                      status={selectedProveedor.tipo_proveedor}
                      size="medium"
                      sx={{ fontWeight: 700 }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle2" sx={{ color: '#7f8c8d', fontWeight: 600, mb: 1 }}>
                      Estado
                    </Typography>
                    <StyledChip
                      label={selectedProveedor.estado === 'activo' ? 'Activo' : 'Inactivo'}
                      status={selectedProveedor.estado}
                      size="medium"
                      sx={{ fontWeight: 700 }}
                    />
                  </Grid>
                </Grid>
              </Card>

              {/* Información de Contacto */}
              <Card sx={{ p: 3, mb: 3, background: 'rgba(255,255,255,0.9)' }}>
                <Typography variant="h6" sx={{ fontWeight: 700, color: '#2c3e50', mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                  📞 Información de Contacto
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Box sx={{ p: 2, borderRadius: 2, background: 'rgba(102, 126, 234, 0.1)' }}>
                      <Typography variant="subtitle2" sx={{ color: '#7f8c8d', fontWeight: 600, mb: 1 }}>
                        Email
                      </Typography>
                      <Typography variant="h6" sx={{ fontWeight: 700, color: '#667eea' }}>
                        {selectedProveedor.email || 'Sin email'}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Box sx={{ p: 2, borderRadius: 2, background: 'rgba(255, 152, 0, 0.1)' }}>
                      <Typography variant="subtitle2" sx={{ color: '#7f8c8d', fontWeight: 600, mb: 1 }}>
                        Teléfono
                      </Typography>
                      <Typography variant="h6" sx={{ fontWeight: 700, color: '#ff9800' }}>
                        {selectedProveedor.telefono || 'Sin teléfono'}
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Card>

              {/* Dirección */}
              <Card sx={{ p: 3, background: 'rgba(255,255,255,0.9)' }}>
                <Typography variant="h6" sx={{ fontWeight: 700, color: '#2c3e50', mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                  📍 Dirección
                </Typography>
                <Box sx={{ p: 2, borderRadius: 2, background: 'rgba(156, 39, 176, 0.1)', border: '1px solid rgba(156, 39, 176, 0.1)' }}>
                  <Typography variant="body1" sx={{ color: '#2c3e50', fontWeight: 600 }}>
                    {selectedProveedor.direccion || 'Sin dirección'}
                  </Typography>
                </Box>
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

export default ProveedoresFormV2;
