// src/modules/Usuarios/UsersList.jsx - VERSIÓN ULTRA OPTIMIZADA
import React, { useState, useEffect, useCallback, useMemo, useTransition } from 'react';
import axios from 'axios';
import {
  Container,
  Grid,
  Box,
  Typography,
  IconButton,
  TextField,
  CircularProgress,
  Chip,
  Avatar,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Alert,
  Snackbar,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Card,
  Badge,
  Switch,
  FormControlLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Skeleton,
  Fade,
  Zoom
} from '@mui/material';
import { styled } from '@mui/material/styles';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import DownloadIcon from '@mui/icons-material/Download';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import GroupIcon from '@mui/icons-material/Group';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import RefreshIcon from '@mui/icons-material/Refresh';
import { motion, AnimatePresence } from 'framer-motion';

// Componentes estilizados ULTRA OPTIMIZADOS
const StyledContainer = styled(Container)({
  padding: '24px',
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  minHeight: '100vh',
  position: 'relative',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.03"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
    pointerEvents: 'none'
  }
});

const StyledCard = styled(Card)({
  background: 'rgba(255, 255, 255, 0.95)',
  backdropFilter: 'blur(20px)',
  borderRadius: 16,
  boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
  border: '1px solid rgba(255,255,255,0.3)',
  marginBottom: '20px',
  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 12px 40px rgba(0,0,0,0.15)'
  }
});

const StyledTableContainer = styled(TableContainer)({
  borderRadius: 12,
  background: 'rgba(255, 255, 255, 0.98)',
  backdropFilter: 'blur(20px)',
  boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
  border: '1px solid rgba(255,255,255,0.4)',
  overflow: 'hidden'
});

const StyledTable = styled(Table)({
  '& .MuiTableCell-head': {
    background: '#667eea', // Color único para todos los headers
    fontWeight: 700,
    fontSize: '0.875rem',
    color: '#fff',
    borderBottom: '2px solid rgba(255,255,255,0.2)',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    padding: '16px 12px',
    position: 'relative',
    '&:first-of-type': {
      borderTopLeftRadius: 12,
    },
    '&:last-of-type': {
      borderTopRightRadius: 12,
    }
  },
  '& .MuiTableCell-body': {
    fontSize: '0.875rem',
    borderBottom: '1px solid rgba(224, 230, 237, 0.3)',
    padding: '12px',
    color: '#2c3e50',
    fontWeight: 500
  },
  '& .MuiTableRow-root': {
    transition: 'background-color 0.15s ease',
    '&:nth-of-type(even)': {
      backgroundColor: 'rgba(255,255,255,0.3)',
    },
    '&:nth-of-type(odd)': {
      backgroundColor: 'rgba(255,255,255,0.5)',
    },
    '&:hover': {
      backgroundColor: 'rgba(102, 126, 234, 0.05)',
      '& .MuiTableCell-body': {
        color: '#1a1a1a',
        fontWeight: 600,
      }
    }
  }
});

const StyledSearchField = styled(TextField)({
  '& .MuiOutlinedInput-root': {
    borderRadius: 12,
    background: 'rgba(255,255,255,0.9)',
    backdropFilter: 'blur(10px)',
    border: '2px solid rgba(255,255,255,0.3)',
    transition: 'all 0.2s ease',
    '&:hover': {
      borderColor: 'rgba(102, 126, 234, 0.5)',
      background: 'rgba(255,255,255,0.95)'
    },
    '&.Mui-focused': {
      borderColor: '#667eea',
      boxShadow: '0 0 0 3px rgba(102, 126, 234, 0.1)'
    }
  },
  '& .MuiInputLabel-root': {
    color: '#2c3e50',
    fontWeight: 600
  },
  '& .MuiInputBase-input': {
    color: '#2c3e50',
    fontWeight: 500
  }
});

const StyledSelect = styled(Select)({
  borderRadius: 12,
  background: 'rgba(255,255,255,0.9)',
  backdropFilter: 'blur(10px)',
  border: '2px solid rgba(255,255,255,0.3)',
  transition: 'all 0.2s ease',
  '&:hover': {
    borderColor: 'rgba(102, 126, 234, 0.5)',
    background: 'rgba(255,255,255,0.95)'
  },
  '&.Mui-focused': {
    borderColor: '#667eea',
    boxShadow: '0 0 0 3px rgba(102, 126, 234, 0.1)'
  },
  '& .MuiSelect-select': {
    color: '#2c3e50',
    fontWeight: 600
  }
});

const StyledChip = styled(Chip)(({ color }) => ({
  borderRadius: 8,
  fontWeight: 600,
  fontSize: '0.75rem',
  height: 24,
  '& .MuiChip-label': {
    padding: '0 8px'
  },
  background: color === 'admin' ? '#e74c3c' :
              color === 'user' ? '#4ecdc4' :
              color === 'juan_carlos' ? '#f39c12' :
              '#95a5a6',
  color: '#fff',
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
}));

const StyledAvatar = styled(Avatar)({
  width: 48,
  height: 48,
  border: '2px solid #fff',
  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
  background: 'linear-gradient(135deg, #667eea, #764ba2)',
  fontSize: '1.25rem',
  fontWeight: 700
});

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

// Componente de skeleton optimizado
const UserRowSkeleton = React.memo(() => (
  <TableRow>
    <TableCell>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Skeleton variant="circular" width={48} height={48} />
        <Box>
          <Skeleton variant="text" width={120} height={20} />
          <Skeleton variant="text" width={150} height={16} />
        </Box>
      </Box>
    </TableCell>
    <TableCell>
      <Skeleton variant="rectangular" width={80} height={24} sx={{ borderRadius: 1 }} />
    </TableCell>
    <TableCell>
      <Skeleton variant="text" width={100} height={20} />
    </TableCell>
    <TableCell>
      <Skeleton variant="rectangular" width={60} height={24} sx={{ borderRadius: 1 }} />
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

// Hook personalizado para debounce
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

// Hook personalizado para cache de datos
const useDataCache = () => {
  const [cache, setCache] = useState(new Map());
  const [cacheTime, setCacheTime] = useState(new Map());

  const getCachedData = useCallback((key) => {
    const data = cache.get(key);
    const time = cacheTime.get(key);
    if (data && time && Date.now() - time < 30000) { // 30 segundos cache
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

const UsersList = () => {
  
  // Estados optimizados
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isPending, startTransition] = useTransition();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [selectedUser, setSelectedUser] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [editDialog, setEditDialog] = useState(false);
  const [viewDialog, setViewDialog] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [showInactive, setShowInactive] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [editFormData, setEditFormData] = useState({});
  const [roles, setRoles] = useState([]);

  // Hooks personalizados
  const debouncedSearch = useDebounce(search, 300);
  const { getCachedData, setCachedData } = useDataCache();

  // Usar la configuración global de axios
  const API_URL = axios.defaults.baseURL || 'process.env.REACT_APP_API_URL || "http://localhost:8765"';

  // Datos de ejemplo optimizados
  const mockUsers = useMemo(() => [
    { id: 1, name: 'Super Administrador Pérez', email: 'juan.carlos@empresa.com', role: 'administrador', created_at: '2024-01-15T10:30:00Z', status: 'active' },
    { id: 2, name: 'María González', email: 'maria.gonzalez@empresa.com', role: 'usuario', created_at: '2024-02-20T14:15:00Z', status: 'active' },
    { id: 3, name: 'Carlos Rodríguez', email: 'carlos.rodriguez@empresa.com', role: 'super administrador', created_at: '2024-03-10T09:45:00Z', status: 'active' },
    { id: 4, name: 'Ana Martínez', email: 'ana.martinez@empresa.com', role: 'usuario', created_at: '2024-01-05T16:20:00Z', status: 'inactive' },
    { id: 5, name: 'Luis Fernández', email: 'luis.fernandez@empresa.com', role: 'administrador', created_at: '2024-02-28T11:00:00Z', status: 'active' }
  ], []);

  // Estadísticas memoizadas
  const stats = useMemo(() => [
    { label: 'Total Usuarios', value: users.length.toString(), icon: <GroupIcon />, color: '#4ecdc4' },
    { label: 'Administradores', value: users.filter(u => u.roles?.name === 'administrador').length.toString(), icon: <AdminPanelSettingsIcon />, color: '#e74c3c' },
    { label: 'Usuarios Activos', value: users.filter(u => u.status === 'active').length.toString(), icon: <VerifiedUserIcon />, color: '#27ae60' },
    { label: 'Nuevos Este Mes', value: '3', icon: <PersonAddIcon />, color: '#f39c12' }
  ], [users]);

      // Obtener roles disponibles
  const fetchRoles = useCallback(async () => {
    try {
      const response = await axios.get('/api/roles/public/list');
      
      if (response.data && response.data.data) {
        setRoles(response.data.data);
      } else {
        setRoles([]);
      }
      
    } catch (error) {
      setRoles([]);
    }
  }, []);

  // Fetch simplificado
  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      
      const response = await axios.get('/api/user-registration/all-users');
      
      if (response.data && response.data.data) {
        setUsers(response.data.data);
      } else {
        setUsers([]);
      }
      
    } catch (error) {
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Filtrado optimizado con useTransition
  const filterUsers = useCallback(() => {
    startTransition(() => {
      let filtered = users;

      if (debouncedSearch) {
        const searchLower = debouncedSearch.toLowerCase();
        filtered = filtered.filter(user =>
          user.name?.toLowerCase().includes(searchLower) ||
          user.email?.toLowerCase().includes(searchLower) ||
          user.roles?.name?.toLowerCase().includes(searchLower)
        );
      }

      if (filter !== 'all') {
        filtered = filtered.filter(user => user.roles?.name === filter);
      }

      if (!showInactive) {
        filtered = filtered.filter(user => user.status === 'active');
      }

      setFilteredUsers(filtered);
    });
  }, [users, debouncedSearch, filter, showInactive]);

  // Efectos optimizados
  useEffect(() => {
    fetchUsers();
    fetchRoles();
  }, []); // Solo una vez al montar

  useEffect(() => {
    filterUsers();
  }, [filterUsers]);



  // Datos paginados memoizados
  const paginatedUsers = useMemo(() => {
    const startIndex = page * rowsPerPage;
    return filteredUsers.slice(startIndex, startIndex + rowsPerPage);
  }, [filteredUsers, page, rowsPerPage]);

  // Handlers optimizados
  const handleDelete = useCallback((user) => {
    setSelectedUser(user);
    setDeleteDialog(true);
  }, []);

  const confirmDelete = useCallback(async () => {
    try {
      await axios.delete(`/api/user-registration/delete-user/${selectedUser.id}`);
      setSnackbar({ open: true, message: 'Usuario eliminado exitosamente', severity: 'success' });
      fetchUsers();
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Error al eliminar usuario';
      setSnackbar({ open: true, message: errorMessage, severity: 'error' });
    } finally {
      setDeleteDialog(false);
      setSelectedUser(null);
    }
  }, [selectedUser, fetchUsers]);

  const handleEdit = useCallback((user) => {
    setSelectedUser(user);
    
    // Inicializar formulario con datos del usuario
    setEditFormData({
      name: user.name || '',
      last_name: user.last_name || '',
      email: user.email || '',
      role_id: user.roles?.id || '',
      status: user.status || 'active'
    });
    
    setEditDialog(true);
  }, []);

  const handleEditFormChange = useCallback((field, value) => {
    setEditFormData(prev => ({
      ...prev,
      [field]: value
    }));
  }, []);

  const confirmEdit = useCallback(async () => {
    try {
      const response = await axios.put(`/api/user-registration/update-user/${selectedUser.id}`, editFormData);
      
      if (response.data.success) {
        setSnackbar({ 
          open: true, 
          message: 'Usuario actualizado exitosamente', 
          severity: 'success' 
        });
        
        // Actualizar lista de usuarios
        fetchUsers();
        
        // Cerrar diálogo
        setEditDialog(false);
        setSelectedUser(null);
        setEditFormData({});
      }
      
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Error al editar usuario';
      setSnackbar({ 
        open: true, 
        message: errorMessage, 
        severity: 'error' 
      });
    }
  }, [selectedUser, editFormData, fetchUsers]);

  const handleView = useCallback((user) => {
    setSelectedUser(user);
    setViewDialog(true);
  }, []);

  const handleSnackbarClose = useCallback(() => {
    setSnackbar({ ...snackbar, open: false });
  }, [snackbar]);

  const handleChangePage = useCallback((event, newPage) => {
    setPage(newPage);
  }, []);

  const handleChangeRowsPerPage = useCallback((event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  }, []);

  // Funciones de utilidad memoizadas
  const getRoleColor = useCallback((role) => {
    const colors = { 'administrador': 'admin', 'usuario': 'user', 'super administrador': 'juan_carlos' };
    return colors[role] || 'default';
  }, []);

  const formatDate = useCallback((dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' });
  }, []);

  const getRoleLabel = useCallback((role) => {
    const labels = { 'administrador': 'Administrador', 'usuario': 'Usuario', 'super administrador': 'Super Administrador' };
    return labels[role] || role;
  }, []);

  // Función para descargar informe de usuarios
  const handleDownloadReport = async () => {
    try {
      setLoading(true);
      
      const response = await axios.get('/api/user-registration/download/report', {
        responseType: 'blob'
      });

      // Crear URL para descarga
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `informe_usuarios_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      setSnackbar({
        open: true,
        message: 'Informe descargado exitosamente',
        severity: 'success'
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.response?.data?.error || 'Error al descargar el informe',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <StyledContainer maxWidth={false}>
      {/* Header optimizado */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Box>
            <Typography variant="h4" sx={{ 
              color: '#fff', 
              fontWeight: 800, 
              mb: 0.5,
              textShadow: '0 2px 4px rgba(0,0,0,0.3)',
              letterSpacing: '-0.5px'
            }}>
              Gestión de Usuarios
            </Typography>
            <Typography variant="h6" sx={{ 
              color: 'rgba(255,255,255,0.8)', 
              fontWeight: 400,
              textShadow: '0 1px 2px rgba(0,0,0,0.2)'
            }}>
              Administra y controla el acceso de usuarios al sistema
            </Typography>
          </Box>
          <IconButton 
            onClick={fetchUsers}
            disabled={loading}
            sx={{ 
              background: 'rgba(255,255,255,0.2)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.3)',
              color: '#fff',
              '&:hover': {
                background: 'rgba(255,255,255,0.3)',
                transform: 'scale(1.05)'
              }
            }}
          >
            <RefreshIcon />
          </IconButton>



        </Box>
        
        {/* Stats optimizados */}
        <Grid container spacing={2} sx={{ mb: 2 }}>
          {stats.map((stat, index) => (
            <Grid item xs={6} md={3} key={index}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <StyledCard sx={{ 
                  p: 2, 
                  textAlign: 'center', 
                  background: 'rgba(255,255,255,0.95)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255,255,255,0.3)',
                  position: 'relative',
                  overflow: 'hidden',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '3px',
                    background: stat.color,
                    borderRadius: '2px'
                  }
                }}>
                  <Box sx={{ 
                    color: stat.color, 
                    mb: 1,
                    display: 'flex',
                    justifyContent: 'center',
                    '& svg': {
                      fontSize: '2rem',
                      filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'
                    }
                  }}>
                    {stat.icon}
                  </Box>
                  <Typography variant="h4" sx={{ 
                    fontWeight: 800, 
                    color: '#2c3e50',
                    mb: 0.5,
                    textShadow: '0 1px 2px rgba(0,0,0,0.1)'
                  }}>
                    {stat.value}
                  </Typography>
                  <Typography variant="body2" sx={{ 
                    color: '#7f8c8d',
                    fontWeight: 500,
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    fontSize: '0.75rem'
                  }}>
                    {stat.label}
                  </Typography>
                </StyledCard>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Filtros optimizados */}
      <StyledCard sx={{ p: 2 }}>
        <Box sx={{ mb: 2 }}>
          <Typography variant="h6" sx={{ 
            color: '#2c3e50', 
            fontWeight: 700,
            mb: 0.5,
            display: 'flex',
            alignItems: 'center',
            gap: 1
          }}>
            <SearchIcon sx={{ color: '#667eea' }} />
            Filtros y Búsqueda
          </Typography>
          <Typography variant="body2" sx={{ color: '#7f8c8d' }}>
            Encuentra y filtra usuarios rápidamente
          </Typography>
        </Box>
        
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <StyledSearchField
              fullWidth
              placeholder="Buscar por nombre, email o rol..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              InputProps={{
                startAdornment: <SearchIcon sx={{ mr: 1, color: '#667eea' }} />
              }}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel sx={{ color: '#2c3e50', fontWeight: 600 }}>Filtrar por rol</InputLabel>
              <StyledSelect
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                label="Filtrar por rol"
              >
                <MenuItem value="all">Todos los roles</MenuItem>
                <MenuItem value="administrador">Administrador</MenuItem>
                <MenuItem value="usuario">Usuario</MenuItem>
                <MenuItem value="super administrador">Super Administrador</MenuItem>
              </StyledSelect>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControlLabel
              control={
                <Switch
                  checked={showInactive}
                  onChange={(e) => setShowInactive(e.target.checked)}
                  sx={{
                    '& .MuiSwitch-switchBase.Mui-checked': {
                      color: '#4ecdc4',
                      '&:hover': {
                        backgroundColor: 'rgba(78, 205, 196, 0.08)'
                      }
                    },
                    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                      backgroundColor: '#4ecdc4'
                    }
                  }}
                />
              }
              label={
                <Typography variant="body2" sx={{ color: '#2c3e50', fontWeight: 600 }}>
                  Mostrar inactivos
                </Typography>
              }
            />
          </Grid>
          <Grid item xs={12} md={2}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <IconButton 
                onClick={fetchUsers}
                disabled={loading}
                sx={{ 
                  background: 'linear-gradient(135deg, #667eea, #764ba2)',
                  color: '#fff',
                  boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #5a6fd8, #6a4190)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 6px 16px rgba(102, 126, 234, 0.4)'
                  }
                }}
              >
                <RefreshIcon />
              </IconButton>
            </Box>
          </Grid>
        </Grid>
      </StyledCard>

      {/* Tabla optimizada */}
      <StyledCard>
        <Box sx={{ p: 2, pb: 1 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Box>
              <Typography variant="h5" sx={{ 
                fontWeight: 800, 
                color: '#2c3e50',
                mb: 0.5,
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}>
                <GroupIcon sx={{ color: '#667eea' }} />
                Lista de Usuarios
              </Typography>
              <Typography variant="body2" sx={{ color: '#7f8c8d' }}>
                {filteredUsers.length} usuarios encontrados
                {isPending && ' (actualizando...)'}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <IconButton 
                sx={{ 
                  background: 'rgba(78, 205, 196, 0.1)',
                  color: '#4ecdc4',
                  '&:hover': {
                    background: 'rgba(78, 205, 196, 0.2)'
                  }
                }}
              >
                <AddIcon />
              </IconButton>
              <IconButton
                onClick={handleDownloadReport}
                disabled={loading}
                sx={{ 
                  background: 'rgba(243, 156, 18, 0.1)',
                  color: '#f39c12',
                  '&:hover': {
                    background: 'rgba(243, 156, 18, 0.2)'
                  }
                }}
                title="Descargar informe de usuarios"
              >
                <DownloadIcon />
              </IconButton>
            </Box>
          </Box>
        </Box>
        
        {loading ? (
          <Box sx={{ p: 2 }}>
            <StyledTableContainer>
              <StyledTable>
                <TableHead>
                  <TableRow>
                    <TableCell>Usuario</TableCell>
                    <TableCell>Rol</TableCell>
                    <TableCell>Fecha de Registro</TableCell>
                    <TableCell>Estado</TableCell>
                    <TableCell align="center">Acciones</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {Array.from({ length: 5 }).map((_, index) => (
                    <UserRowSkeleton key={index} />
                  ))}
                </TableBody>
              </StyledTable>
            </StyledTableContainer>
          </Box>
        ) : (
          <>
            <StyledTableContainer>
              <StyledTable>
                <TableHead>
                  <TableRow>
                    <TableCell>Usuario</TableCell>
                    <TableCell>Rol</TableCell>
                    <TableCell>Fecha de Registro</TableCell>
                    <TableCell>Estado</TableCell>
                    <TableCell align="center">Acciones</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <AnimatePresence>
                    {paginatedUsers.map((user, index) => (
                      <motion.tr
                        key={user.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ delay: index * 0.05 }}
                        component={TableRow}
                      >
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Badge
                              overlap="circular"
                              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                              badgeContent={
                                <Box
                                  sx={{
                                    width: 8,
                                    height: 8,
                                    borderRadius: '50%',
                                    background: user.status === 'active' ? '#27ae60' : '#e74c3c',
                                    border: '1px solid #fff'
                                  }}
                                />
                              }
                            >
                              <StyledAvatar>
                                {user.name?.charAt(0)?.toUpperCase()}
                              </StyledAvatar>
                            </Badge>
                            <Box>
                              <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#333' }}>
                                {user.name}
                              </Typography>
                              <Typography variant="caption" sx={{ color: '#666' }}>
                                {user.email}
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <StyledChip
                            label={getRoleLabel(user.roles?.name)}
                            color={getRoleColor(user.roles?.name)}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" sx={{ color: '#333' }}>
                            {formatDate(user.created_at)}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <StyledChip
                            label={user.status === 'active' ? 'Activo' : 'Inactivo'}
                            color={user.status === 'active' ? 'success' : 'error'}
                            size="small"
                          />
                        </TableCell>
                        <TableCell align="center">
                          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 0.5 }}>
                            <Tooltip title="Ver detalles">
                              <ActionButton
                                color="#45b7d1"
                                onClick={() => handleView(user)}
                              >
                                <VisibilityIcon fontSize="small" />
                              </ActionButton>
                            </Tooltip>
                            <Tooltip title="Editar usuario">
                              <ActionButton
                                color="#f39c12"
                                onClick={() => handleEdit(user)}
                              >
                                <EditIcon fontSize="small" />
                              </ActionButton>
                            </Tooltip>
                            <Tooltip title="Eliminar usuario">
                              <ActionButton
                                color="#e74c3c"
                                onClick={() => handleDelete(user)}
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
            
            {/* Paginación optimizada */}
            <Box sx={{ 
              p: 2, 
              background: 'rgba(255,255,255,0.8)', 
              borderTop: '1px solid rgba(0,0,0,0.1)',
              backdropFilter: 'blur(10px)'
            }}>
              <TablePagination
                component="div"
                count={filteredUsers.length}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                rowsPerPageOptions={[5, 10, 25, 50]}
                sx={{
                  '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': {
                    color: '#2c3e50',
                    fontWeight: 600,
                    fontSize: '0.875rem',
                  },
                  '& .MuiTablePagination-select': {
                    color: '#4ecdc4',
                    fontWeight: 600,
                  },
                  '& .MuiTablePagination-actions': {
                    '& .MuiIconButton-root': {
                      color: '#4ecdc4',
                      '&:hover': {
                        backgroundColor: 'rgba(78, 205, 196, 0.1)',
                      },
                      '&.Mui-disabled': {
                        color: '#bdc3c7',
                      }
                    }
                  }
                }}
              />
            </Box>
          </>
        )}
      </StyledCard>

      {/* Diálogos optimizados */}
      <Dialog 
        open={deleteDialog} 
        onClose={() => setDeleteDialog(false)}
        PaperProps={{
          sx: {
            borderRadius: 2,
            background: 'rgba(255,255,255,0.95)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.3)',
            boxShadow: '0 20px 60px rgba(0,0,0,0.15)'
          }
        }}
      >
        <DialogTitle sx={{ color: '#2c3e50', fontWeight: 700, pb: 1 }}>
          Confirmar Eliminación
        </DialogTitle>
        <DialogContent>
          <Typography sx={{ color: '#2c3e50', mb: 2 }}>
            ¿Estás seguro de que quieres eliminar al usuario <strong>"{selectedUser?.name}"</strong>?
          </Typography>
          <Typography variant="body2" sx={{ color: '#e74c3c', fontWeight: 500 }}>
            ⚠️ Esta acción no se puede deshacer.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button 
            onClick={() => setDeleteDialog(false)}
            sx={{ color: '#7f8c8d', fontWeight: 600 }}
          >
            Cancelar
          </Button>
          <Button 
            onClick={confirmDelete} 
            variant="contained"
            sx={{
              background: 'linear-gradient(135deg, #e74c3c, #c0392b)',
              fontWeight: 600,
              '&:hover': {
                background: 'linear-gradient(135deg, #c0392b, #a93226)'
              }
            }}
          >
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog 
        open={editDialog} 
        onClose={() => setEditDialog(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            background: 'rgba(255,255,255,0.95)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.3)',
            boxShadow: '0 20px 60px rgba(0,0,0,0.15)'
          }
        }}
      >
        <DialogTitle sx={{ color: '#2c3e50', fontWeight: 700, pb: 1 }}>
          Editar Usuario
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ mb: 3, color: '#2c3e50', fontWeight: 600 }}>
            Editando: <strong>{selectedUser?.name}</strong>
          </Typography>
          
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* Nombre */}
            <TextField
              fullWidth
              label="Nombre"
              value={editFormData.name || ''}
              onChange={(e) => handleEditFormChange('name', e.target.value)}
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  '&:hover': {
                    borderColor: '#667eea'
                  }
                }
              }}
            />
            
            {/* Apellido */}
            <TextField
              fullWidth
              label="Apellido"
              value={editFormData.last_name || ''}
              onChange={(e) => handleEditFormChange('last_name', e.target.value)}
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  '&:hover': {
                    borderColor: '#667eea'
                  }
                }
              }}
            />
            
            {/* Email */}
            <TextField
              fullWidth
              label="Email"
              value={editFormData.email || ''}
              onChange={(e) => handleEditFormChange('email', e.target.value)}
              variant="outlined"
              type="email"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  '&:hover': {
                    borderColor: '#667eea'
                  }
                }
              }}
            />
            
            {/* Rol */}
            <FormControl fullWidth>
              <InputLabel>Rol</InputLabel>
              <Select
                value={editFormData.role_id || ''}
                onChange={(e) => handleEditFormChange('role_id', e.target.value)}
                label="Rol"
                sx={{
                  borderRadius: 2,
                  '&:hover': {
                    borderColor: '#667eea'
                  }
                }}
              >
                {roles.map((role) => (
                  <MenuItem key={role.id} value={role.id}>
                    {role.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            
            {/* Estado */}
            <FormControl fullWidth>
              <InputLabel>Estado</InputLabel>
              <Select
                value={editFormData.status || 'active'}
                onChange={(e) => handleEditFormChange('status', e.target.value)}
                label="Estado"
                sx={{
                  borderRadius: 2,
                  '&:hover': {
                    borderColor: '#667eea'
                  }
                }}
              >
                <MenuItem value="active">Activo</MenuItem>
                <MenuItem value="inactive">Inactivo</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button 
            onClick={() => {
              setEditDialog(false);
              setSelectedUser(null);
              setEditFormData({});
            }}
            sx={{ color: '#7f8c8d', fontWeight: 600 }}
          >
            Cancelar
          </Button>
          <Button 
            onClick={confirmEdit}
            variant="contained"
            sx={{ 
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              fontWeight: 600,
              '&:hover': {
                background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)'
              }
            }}
          >
            Guardar Cambios
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog 
        open={viewDialog} 
        onClose={() => setViewDialog(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            background: 'rgba(255,255,255,0.95)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.3)',
            boxShadow: '0 20px 60px rgba(0,0,0,0.15)'
          }
        }}
      >
        <DialogTitle sx={{ color: '#2c3e50', fontWeight: 700, pb: 1 }}>
          Detalles del Usuario
        </DialogTitle>
        <DialogContent>
          {selectedUser && (
            <Box sx={{ mt: 2 }}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <StyledAvatar src={selectedUser.avatar} sx={{ width: 80, height: 80, mb: 2 }}>
                      {selectedUser.name?.charAt(0)?.toUpperCase()}
                    </StyledAvatar>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: '#2c3e50' }}>
                      {selectedUser.name}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#7f8c8d' }}>
                      {selectedUser.email}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} md={8}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Box>
                      <Typography variant="subtitle2" sx={{ color: '#7f8c8d', mb: 0.5, fontWeight: 600 }}>
                        Rol
                      </Typography>
                      <StyledChip
                        label={getRoleLabel(selectedUser.roles?.name)}
                        color={getRoleColor(selectedUser.roles?.name)}
                      />
                    </Box>
                    <Box>
                      <Typography variant="subtitle2" sx={{ color: '#7f8c8d', mb: 0.5, fontWeight: 600 }}>
                        Estado
                      </Typography>
                      <StyledChip
                        label={selectedUser.status === 'active' ? 'Activo' : 'Inactivo'}
                        color={selectedUser.status === 'active' ? 'success' : 'error'}
                      />
                    </Box>
                    <Box>
                      <Typography variant="subtitle2" sx={{ color: '#7f8c8d', mb: 0.5, fontWeight: 600 }}>
                        Fecha de Registro
                      </Typography>
                      <Typography variant="body1" sx={{ color: '#2c3e50', fontWeight: 600 }}>
                        {formatDate(selectedUser.created_at)}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button 
            onClick={() => setViewDialog(false)}
            sx={{ color: '#7f8c8d', fontWeight: 600 }}
          >
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </StyledContainer>
  );
};

export default React.memo(UsersList);

