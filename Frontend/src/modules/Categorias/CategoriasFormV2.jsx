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
import CategoryIcon from '@mui/icons-material/Category';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import ScheduleIcon from '@mui/icons-material/Schedule';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import StoreIcon from '@mui/icons-material/Store';
import TimelineIcon from '@mui/icons-material/Timeline';
import RefreshIcon from '@mui/icons-material/Refresh';
import AssignmentIcon from '@mui/icons-material/Assignment';
import CloseIcon from '@mui/icons-material/Close';

// ========================================
// COMPONENTES ESTILIZADOS IDÉNTICOS A PROYECTOS
// ========================================

// Animación CSS para el ícono de refresh
const spinAnimation = `
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`;

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

// Botones de acción con el mismo estilo que Proyectos
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

// Chip con el mismo estilo que Proyectos
const StyledChip = styled(Chip)(({ status }) => ({
  borderRadius: 12,
  fontWeight: 600,
  textTransform: 'uppercase',
  fontSize: '0.75rem',
  background: status === 'activa' ? 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' :
              status === 'inactiva' ? 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)' :
              'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
  color: '#fff',
  boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
}));

// Skeleton con el mismo estilo que Proyectos
const CategoryRowSkeleton = React.memo(() => (
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
    // Cache más largo para mejor rendimiento
    if (data && time && Date.now() - time < 300000) { // 5 minutos
      return data;
    }
    return null;
  }, [cache, cacheTime]);

  const setCachedData = useCallback((key, data) => {
    setCache(prev => new Map(prev).set(key, data));
    setCacheTime(prev => new Map(prev).set(key, Date.now()));
  }, []);

  const updateCachedData = useCallback((key, updater) => {
    setCache(prev => {
      const newCache = new Map(prev);
      const currentData = newCache.get(key) || [];
      newCache.set(key, updater(currentData));
      return newCache;
    });
  }, []);

  return { getCachedData, setCachedData, updateCachedData };
};

const CategoriasFormV2 = () => {
  // Agregar estilos CSS para animaciones
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = spinAnimation;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  // Estados optimizados como en Proyectos
  const [categorias, setCategorias] = useState([]);
  const [filteredCategorias, setFilteredCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingCategoria, setEditingCategoria] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    tipo: '',
    estado: 'activa',
    color: '#667eea'
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [isPending, startTransition] = useTransition();
  const [optimisticUpdates, setOptimisticUpdates] = useState(new Set());

  // Hooks personalizados
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const { getCachedData, setCachedData, updateCachedData } = useDataCache();

  // Estadísticas optimizadas con cálculos eficientes
  const stats = useMemo(() => {
    const total = categorias.length;
    const activas = categorias.filter(c => c.estado === 'activa').length;
    const productos = categorias.filter(c => c.tipo === 'producto').length;
    const servicios = categorias.filter(c => c.tipo === 'servicio').length;

    return [
      { 
        label: 'Total Categorías', 
        value: total.toString(), 
        icon: <CategoryIcon />, 
        color: '#4ecdc4' 
      },
      { 
        label: 'Categorías Activas', 
        value: activas.toString(), 
        icon: <TrendingUpIcon />, 
        color: '#27ae60' 
      },
      { 
        label: 'Productos', 
        value: productos.toString(), 
        icon: <StoreIcon />, 
        color: '#f39c12' 
      },
      { 
        label: 'Servicios', 
        value: servicios.toString(), 
        icon: <AssignmentIcon />, 
        color: '#e74c3c' 
      }
    ];
  }, [categorias]);

  // Funciones de API optimizadas como en Proyectos
  const fetchCategorias = useCallback(async () => {
    try {
      setLoading(true);
      const cached = getCachedData('categorias');
      if (cached) {
        setCategorias(cached);
        setFilteredCategorias(cached);
        setLoading(false);
        return;
      }

      const response = await axios.get('/api/categorias');
      if (response.data && response.data.success) {
        setCategorias(response.data.data);
        setFilteredCategorias(response.data.data);
        setCachedData('categorias', response.data.data);
      } else {
        setCategorias([]);
        setFilteredCategorias([]);
      }
    } catch (error) {
      console.error('Error al obtener categorías:', error);
      setCategorias([]);
      setFilteredCategorias([]);
    } finally {
      setLoading(false);
    }
  }, [getCachedData, setCachedData]);

  const createCategoria = useCallback(async (data) => {
    try {
      // Actualización optimista - agregar inmediatamente a la UI
      const tempId = Date.now();
      const newCategoria = {
        id: tempId,
        ...data,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      // Actualizar estado inmediatamente
      setCategorias(prev => [newCategoria, ...prev]);
      setFilteredCategorias(prev => [newCategoria, ...prev]);
      
      // Actualizar cache inmediatamente
      updateCachedData('categorias', prev => [newCategoria, ...prev]);
      
      // Marcar como actualización optimista
      setOptimisticUpdates(prev => new Set(prev).add(tempId));

      // Llamar a la API
      const response = await axios.post('/api/categorias', data);
      if (response.data && response.data.success) {
        // Reemplazar con datos reales del servidor
        const realCategoria = response.data.data;
        setCategorias(prev => prev.map(cat => 
          cat.id === tempId ? realCategoria : cat
        ));
        setFilteredCategorias(prev => prev.map(cat => 
          cat.id === tempId ? realCategoria : cat
        ));
        updateCachedData('categorias', prev => prev.map(cat => 
          cat.id === tempId ? realCategoria : cat
        ));
        
        // Remover indicador de actualización optimista
        setOptimisticUpdates(prev => {
          const newSet = new Set(prev);
          newSet.delete(tempId);
          return newSet;
        });

        setSnackbar({
          open: true,
          message: 'Categoría creada exitosamente',
          severity: 'success'
        });
        return true;
      }
    } catch (error) {
      console.error('Error al crear categoría:', error);
      
      // Revertir cambios en caso de error
      setCategorias(prev => prev.filter(cat => cat.id !== tempId));
      setFilteredCategorias(prev => prev.filter(cat => cat.id !== tempId));
      updateCachedData('categorias', prev => prev.filter(cat => cat.id !== tempId));
      
      // Remover indicador de actualización optimista
      setOptimisticUpdates(prev => {
        const newSet = new Set(prev);
        newSet.delete(tempId);
        return newSet;
      });

      setSnackbar({
        open: true,
        message: 'Error al crear categoría',
        severity: 'error'
      });
      return false;
    }
  }, [updateCachedData]);

  const updateCategoria = useCallback(async (id, data) => {
    try {
      // Actualización optimista - actualizar inmediatamente en la UI
      const updatedCategoria = {
        ...data,
        id: parseInt(id),
        updated_at: new Date().toISOString()
      };

      // Actualizar estado inmediatamente
      setCategorias(prev => prev.map(cat => 
        cat.id === parseInt(id) ? { ...cat, ...updatedCategoria } : cat
      ));
      setFilteredCategorias(prev => prev.map(cat => 
        cat.id === parseInt(id) ? { ...cat, ...updatedCategoria } : cat
      ));
      
      // Actualizar cache inmediatamente
      updateCachedData('categorias', prev => prev.map(cat => 
        cat.id === parseInt(id) ? { ...cat, ...updatedCategoria } : cat
      ));
      
      // Marcar como actualización optimista
      setOptimisticUpdates(prev => new Set(prev).add(parseInt(id)));

      // Llamar a la API
      const response = await axios.put(`/api/categorias/${id}`, data);
      if (response.data && response.data.success) {
        // Confirmar con datos reales del servidor
        const realCategoria = response.data.data;
        setCategorias(prev => prev.map(cat => 
          cat.id === parseInt(id) ? realCategoria : cat
        ));
        setFilteredCategorias(prev => prev.map(cat => 
          cat.id === parseInt(id) ? realCategoria : cat
        ));
        updateCachedData('categorias', prev => prev.map(cat => 
          cat.id === parseInt(id) ? realCategoria : cat
        ));
        
        // Remover indicador de actualización optimista
        setOptimisticUpdates(prev => {
          const newSet = new Set(prev);
          newSet.delete(parseInt(id));
          return newSet;
        });

        setSnackbar({
          open: true,
          message: 'Categoría actualizada exitosamente',
          severity: 'success'
        });
        return true;
      }
    } catch (error) {
      console.error('Error al actualizar categoría:', error);
      
      // Revertir cambios en caso de error
      fetchCategorias();

      setSnackbar({
        open: true,
        message: 'Error al actualizar categoría',
        severity: 'error'
      });
      return false;
    }
  }, [updateCachedData, fetchCategorias]);

  const deleteCategoria = useCallback(async (categoria) => {
    if (window.confirm(`¿Estás seguro de eliminar la categoría "${categoria.nombre}"?`)) {
      try {
              // Actualización optimista - eliminar inmediatamente de la UI
      setCategorias(prev => prev.filter(cat => cat.id !== categoria.id));
      setFilteredCategorias(prev => prev.filter(cat => cat.id !== categoria.id));
      
      // Actualizar cache inmediatamente
      updateCachedData('categorias', prev => prev.filter(cat => cat.id !== categoria.id));
      
      // Marcar como eliminación optimista
      setOptimisticUpdates(prev => new Set(prev).add(categoria.id));

        // Llamar a la API
        const response = await axios.delete(`/api/categorias/${categoria.id}`);
        if (response.data && response.data.success) {
          setSnackbar({
            open: true,
            message: 'Categoría eliminada exitosamente',
            severity: 'success'
          });
        }
      } catch (error) {
        console.error('Error al eliminar categoría:', error);
        
        // Revertir cambios en caso de error
        setCategorias(prev => [...prev, categoria]);
        setFilteredCategorias(prev => [...prev, categoria]);
        updateCachedData('categorias', prev => [...prev, categoria]);
        
        // Remover indicador de eliminación optimista
        setOptimisticUpdates(prev => {
          const newSet = new Set(prev);
          newSet.delete(categoria.id);
          return newSet;
        });

        setSnackbar({
          open: true,
          message: 'Error al eliminar categoría',
          severity: 'error'
        });
      }
    }
  }, [updateCachedData]);

  // Filtros y búsqueda optimizados
  useEffect(() => {
    startTransition(() => {
      let filtered = categorias;

      if (debouncedSearchTerm) {
        const searchLower = debouncedSearchTerm.toLowerCase();
        filtered = filtered.filter(categoria =>
          categoria.nombre?.toLowerCase().includes(searchLower) ||
          categoria.descripcion?.toLowerCase().includes(searchLower)
        );
      }

      if (statusFilter !== 'all') {
        filtered = filtered.filter(categoria => categoria.estado === statusFilter);
      }

      setFilteredCategorias(filtered);
    });
  }, [categorias, debouncedSearchTerm, statusFilter]);

  // Manejadores de eventos
  const handleCreateCategoria = () => {
    setEditingCategoria(null);
    setFormData({
      nombre: '',
      descripcion: '',
      tipo: '',
      estado: 'activa',
      color: '#667eea'
    });
    setShowForm(true);
  };

  const handleEditCategoria = (categoria) => {
    setEditingCategoria(categoria);
    setFormData({
      nombre: categoria.nombre || '',
      descripcion: categoria.descripcion || '',
      tipo: categoria.tipo || '',
      estado: categoria.estado || 'activa',
      color: categoria.color || '#667eea'
    });
    setShowForm(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    
    if (editingCategoria) {
      const success = await updateCategoria(editingCategoria.id, formData);
      if (success) {
        setShowForm(false);
        setEditingCategoria(null);
      }
    } else {
      const success = await createCategoria(formData);
      if (success) {
        setShowForm(false);
      }
    }
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingCategoria(null);
    setFormData({
      nombre: '',
      descripcion: '',
      tipo: '',
      estado: 'activa',
      color: '#667eea'
    });
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Efectos
  useEffect(() => {
    fetchCategorias();
  }, [fetchCategorias]);

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
            <CategoryIcon sx={{ mr: 2, verticalAlign: 'middle' }} />
            Categorías
          </Typography>
          <Typography
            variant="h6"
            sx={{
              color: 'rgba(255,255,255,0.9)',
              fontWeight: 400,
              opacity: 0.9
            }}
          >
            Organiza y gestiona las categorías del sistema
          </Typography>
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
                  placeholder="Buscar categorías..."
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
                    <MenuItem value="all">Todas</MenuItem>
                    <MenuItem value="activa">Activas</MenuItem>
                    <MenuItem value="inactiva">Inactivas</MenuItem>
                  </Select>
                </StyledSelect>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={handleCreateCategoria}
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
                  Crear Categoría
                </Button>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Button
                  variant="outlined"
                  startIcon={loading ? <RefreshIcon sx={{ animation: 'spin 2s linear infinite' }} /> : <RefreshIcon />}
                  onClick={fetchCategorias}
                  disabled={loading}
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
                  {loading ? 'Actualizando...' : 'Actualizar'}
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
                  <TableCell>Categoría</TableCell>
                  <TableCell>Descripción</TableCell>
                  <TableCell>Tipo</TableCell>
                  <TableCell>Estado</TableCell>
                  <TableCell>Fecha Creación</TableCell>
                  <TableCell align="center">Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  Array.from({ length: 8 }).map((_, index) => (
                    <CategoryRowSkeleton key={index} />
                  ))
                ) : filteredCategorias.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      <Box sx={{ p: 4, textAlign: 'center' }}>
                        <CategoryIcon sx={{ fontSize: 60, color: '#bdc3c7', mb: 2 }} />
                        <Typography variant="h6" sx={{ color: '#7f8c8d', mb: 1 }}>
                          No hay categorías registradas
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#95a5a6' }}>
                          Comienza agregando la primera categoría al sistema
                        </Typography>
                      </Box>
                    </TableCell>
                  </TableRow>
                ) : (
                  <AnimatePresence>
                    {filteredCategorias.map((categoria, index) => (
                      <motion.tr
                        key={categoria.id}
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
                                background: categoria.color || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                fontWeight: 700,
                                fontSize: '1.2rem',
                                opacity: optimisticUpdates.has(categoria.id) ? 0.7 : 1
                              }}
                            >
                              {categoria.nombre?.charAt(0)?.toUpperCase() || 'C'}
                            </Avatar>
                            <Box>
                              <Typography variant="subtitle1" sx={{ 
                                fontWeight: 600, 
                                color: '#2c3e50',
                                opacity: optimisticUpdates.has(categoria.id) ? 0.7 : 1
                              }}>
                                {categoria.nombre}
                              </Typography>
                              <Typography variant="body2" sx={{ color: '#7f8c8d' }}>
                                ID: {categoria.id}
                              </Typography>
                              {optimisticUpdates.has(categoria.id) && (
                                <Chip
                                  label="Actualizando..."
                                  size="small"
                                  color="warning"
                                  sx={{ mt: 0.5, fontSize: '0.7rem' }}
                                />
                              )}
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" sx={{ 
                            color: '#7f8c8d',
                            maxWidth: 200,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                          }}>
                            {categoria.descripcion || 'Sin descripción'}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <StyledChip
                            label={categoria.tipo === 'producto' ? 'Producto' : 'Servicio'}
                            status={categoria.tipo === 'producto' ? 'activa' : 'inactiva'}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <StyledChip
                            label={categoria.estado === 'activa' ? 'Activa' : 'Inactiva'}
                            status={categoria.estado}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" sx={{ color: '#7f8c8d' }}>
                            {categoria.created_at ? new Date(categoria.created_at).toLocaleDateString('es-MX') : 'N/A'}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                            <Tooltip title="Ver detalles">
                              <ActionButton
                                color="#45b7d1"
                                onClick={() => handleEditCategoria(categoria)}
                              >
                                <VisibilityIcon fontSize="small" />
                              </ActionButton>
                            </Tooltip>
                            <Tooltip title="Editar categoría">
                              <ActionButton
                                color="#f39c12"
                                onClick={() => handleEditCategoria(categoria)}
                              >
                                <EditIcon fontSize="small" />
                              </ActionButton>
                            </Tooltip>
                            <Tooltip title="Eliminar categoría">
                              <ActionButton
                                color="#e74c3c"
                                onClick={() => deleteCategoria(categoria)}
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
          {editingCategoria ? '✏️ Editar Categoría' : '➕ Crear Nueva Categoría'}
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
                  name="nombre"
                  label="Nombre de la Categoría"
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
                <StyledSelect fullWidth required>
                  <InputLabel>Tipo de Categoría</InputLabel>
                  <Select
                    name="tipo"
                    value={formData.tipo}
                    onChange={(e) => setFormData({ ...formData, tipo: e.target.value })}
                    label="Tipo de Categoría"
                  >
                    <MenuItem value="producto">Producto</MenuItem>
                    <MenuItem value="servicio">Servicio</MenuItem>
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
                    <MenuItem value="activa">Activa</MenuItem>
                    <MenuItem value="inactiva">Inactiva</MenuItem>
                  </Select>
                </StyledSelect>
              </Grid>
              <Grid item xs={12} sm={6}>
                <StyledSelect fullWidth required>
                  <InputLabel>Color de Identificación</InputLabel>
                  <Select
                    name="color"
                    value={formData.color}
                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                    label="Color de Identificación"
                  >
                    <MenuItem value="#667eea">
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Box
                          sx={{
                            width: 16,
                            height: 16,
                            borderRadius: '50%',
                            backgroundColor: '#667eea',
                            border: '1px solid #ddd'
                          }}
                        />
                        Azul Principal
                      </Box>
                    </MenuItem>
                    <MenuItem value="#764ba2">
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Box
                          sx={{
                            width: 16,
                            height: 16,
                            borderRadius: '50%',
                            backgroundColor: '#764ba2',
                            border: '1px solid #ddd'
                          }}
                        />
                        Púrpura
                      </Box>
                    </MenuItem>
                    <MenuItem value="#f093fb">
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Box
                          sx={{
                            width: 16,
                            height: 16,
                            borderRadius: '50%',
                            backgroundColor: '#f093fb',
                            border: '1px solid #ddd'
                          }}
                        />
                        Rosa
                      </Box>
                    </MenuItem>
                    <MenuItem value="#4facfe">
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Box
                          sx={{
                            width: 16,
                            height: 16,
                            borderRadius: '50%',
                            backgroundColor: '#4facfe',
                            border: '1px solid #ddd'
                          }}
                        />
                        Azul Claro
                      </Box>
                    </MenuItem>
                    <MenuItem value="#43e97b">
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Box
                          sx={{
                            width: 16,
                            height: 16,
                            borderRadius: '50%',
                            backgroundColor: '#43e97b',
                            border: '1px solid #ddd'
                          }}
                        />
                        Verde
                      </Box>
                    </MenuItem>
                  </Select>
                </StyledSelect>
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
            {editingCategoria ? 'Actualizar' : 'Crear'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Indicador de operaciones optimistas */}
      {optimisticUpdates.size > 0 && (
        <Box
          sx={{
            position: 'fixed',
            top: 20,
            right: 20,
            zIndex: 9999,
            background: 'rgba(255, 193, 7, 0.9)',
            color: '#000',
            px: 2,
            py: 1,
            borderRadius: 2,
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 193, 7, 0.3)',
            display: 'flex',
            alignItems: 'center',
            gap: 1
          }}
        >
          <RefreshIcon sx={{ animation: 'spin 2s linear infinite' }} />
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            {optimisticUpdates.size} actualización{optimisticUpdates.size > 1 ? 'es' : ''} en progreso...
          </Typography>
        </Box>
      )}

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

export default CategoriasFormV2;
