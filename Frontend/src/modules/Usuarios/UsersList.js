import React, { useState, useEffect, useCallback, useMemo, useTransition, forwardRef, useImperativeHandle } from 'react';
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
  CardContent,
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
  Divider,
  Menu,
  ListItemIcon,
  ListItemText,
  Paper,
  Stack
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  Add as AddIcon,
  Search as SearchIcon,
  Download as DownloadIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Visibility as VisibilityIcon,
  PersonAdd as PersonAddIcon,
  Group as GroupIcon,
  AdminPanelSettings as AdminPanelSettingsIcon,
  VerifiedUser as VerifiedUserIcon,
  Refresh as RefreshIcon,
  FilterList as FilterIcon,
  MoreVert as MoreVertIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Business as BusinessIcon,
  CalendarToday as CalendarIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Block as BlockIcon,
  Send as SendIcon,
  Security as SecurityIcon,
  Stars as StarsIcon,
  TrendingUp as TrendingUpIcon,
  People as PeopleIcon
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

// ========================================
// COMPONENTES ESTILIZADOS MEJORADOS
// ========================================

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
      padding: theme.spacing(2),
      whiteSpace: 'nowrap'
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

const StyledChip = styled(Chip)(({ status }) => ({
  borderRadius: 12,
  fontWeight: 600,
  textTransform: 'uppercase',
  fontSize: '0.75rem',
  background: status === 'active' ? 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' :
              status === 'pending' ? 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' :
              status === 'blocked' ? 'linear-gradient(135deg, #ffeaa7 0%, #fab1a0 100%)' :
              'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  color: '#fff',
  boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
}));

const UserRowSkeleton = React.memo(() => (
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
    <TableCell><Skeleton variant="text" width={120} height={20} /></TableCell>
    <TableCell><Skeleton variant="rectangular" width={80} height={24} sx={{ borderRadius: 1 }} /></TableCell>
    <TableCell><Skeleton variant="text" width={100} height={20} /></TableCell>
    <TableCell><Skeleton variant="text" width={80} height={20} /></TableCell>
    <TableCell>
      <Box sx={{ display: 'flex', gap: 1 }}>
        <Skeleton variant="circular" width={36} height={36} />
        <Skeleton variant="circular" width={36} height={36} />
        <Skeleton variant="circular" width={36} height={36} />
      </Box>
    </TableCell>
  </TableRow>
));

// Hook personalizado para caché de datos
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

const UsersList = forwardRef((props, ref) => {
  // Estados principales
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [roleFilter, setRoleFilter] = useState('all');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedUser, setSelectedUser] = useState(null);
  const [viewDialog, setViewDialog] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [isPending, startTransition] = useTransition();
  
  // Hooks personalizados
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const { getCachedData, setCachedData } = useDataCache();

  // Estadísticas mejoradas
  const stats = useMemo(() => {
    const activeUsers = users.filter(u => u.status === 'active').length;
    const pendingUsers = users.filter(u => u.profile_complete === false).length;
    const adminUsers = users.filter(u => u.role_name?.toLowerCase().includes('admin')).length;
    
    return [
      {
        label: 'Total Usuarios',
        value: users.length,
        icon: <PeopleIcon />,
        color: '#667eea',
        change: '+12%'
      },
      {
        label: 'Usuarios Activos',
        value: activeUsers,
        icon: <CheckCircleIcon />,
        color: '#27ae60',
        change: '+5%'
      },
      {
        label: 'Perfiles Pendientes',
        value: pendingUsers,
        icon: <WarningIcon />,
        color: '#f39c12',
        change: '-8%'
      },
      {
        label: 'Administradores',
        value: adminUsers,
        icon: <StarsIcon />,
        color: '#e74c3c',
        change: '0%'
      }
    ];
  }, [users]);

  // Fetch usuarios sin caché para datos en tiempo real
  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      // Agregar timestamp para evitar caché del navegador
      const timestamp = new Date().getTime();
      const response = await axios.get(`/api/user-registration/all-users?t=${timestamp}`);
      const userData = response.data.success ? response.data.data : [];
      // Transformar datos del backend para el frontend
      const transformedUsers = userData.map(user => {
        // Lógica mejorada para determinar si el perfil está completo
        const hasName = user.name && user.name.trim() !== '';
        const hasEmail = user.email && user.email.trim() !== '';
        const hasPhone = user.phone && user.phone.trim() !== '';
        const hasDepartment = user.department && user.department.trim() !== '';
        const hasPosition = user.position && user.position.trim() !== '';
        
        // Un perfil se considera completo si tiene al menos nombre, email y teléfono
        const isProfileComplete = hasName && hasEmail && hasPhone;
        
        // Determinar el estado del usuario
        const userStatus = user.is_active ? 'Activo' : 'Inactivo';
        
        // Determinar si ha iniciado sesión
        const hasLoggedIn = user.last_login !== null && user.last_login !== undefined;
        const lastLoginText = hasLoggedIn ? 
          new Date(user.last_login).toLocaleDateString('es-ES') : 
          'Nunca ha iniciado sesión';

        const transformed = {
          id: user.id,
          full_name: user.name || 'Sin nombre',
          email: user.email || 'No disponible',
          phone: user.phone || 'No disponible',
          role_name: user.roles?.name || user.role || 'Sin rol',
          status: userStatus,
          profile_complete: isProfileComplete,
          profile_complete_text: isProfileComplete ? 'Perfil Completo' : 'Perfil Incompleto',
          last_login: user.last_login,
          last_login_text: lastLoginText,
          created_at: user.created_at,
          avatar: user.avatar,
          department: user.department || 'No asignado',
          position: user.position || 'No especificado',
          firebase_uid: user.firebase_uid,
          role_id: user.role_id,
          is_first_login: user.is_first_login,
          access_token: user.access_token ? 'Activo' : 'Inactivo'
        };
        
        return transformed;
      });

      setUsers(transformedUsers);
      setFilteredUsers(transformedUsers);
      
      // Limpiar caché para forzar actualización
      setCachedData('users', null);
      
      setSnackbar({
        open: true,
        message: `✅ ${transformedUsers.length} usuarios cargados correctamente`,
        severity: 'success'
      });
      
    } catch (error) {
      console.error('❌ Error al cargar usuarios:', error);
      setSnackbar({
        open: true,
        message: '❌ Error al cargar usuarios: ' + (error.response?.data?.message || error.message),
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  }, [setCachedData]);

  // Exponer la función fetchUsers al componente padre
  useImperativeHandle(ref, () => ({
    fetchUsers
  }), [fetchUsers]);

  // Filtros y búsqueda optimizada
  useEffect(() => {
    startTransition(() => {
      let filtered = users;

      // Búsqueda por término
      if (debouncedSearchTerm) {
        filtered = filtered.filter(user =>
          user.full_name?.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
          user.email?.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
          user.role_name?.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
          user.department?.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
        );
      }

      // Filtro por estado
      if (statusFilter !== 'all') {
        filtered = filtered.filter(user => user.status === statusFilter);
      }

      // Filtro por rol
      if (roleFilter !== 'all') {
        filtered = filtered.filter(user => 
          user.role_name?.toLowerCase().includes(roleFilter.toLowerCase())
        );
      }

      setFilteredUsers(filtered);
      setPage(0); // Reset página cuando cambian filtros
    });
  }, [users, debouncedSearchTerm, statusFilter, roleFilter]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Event handlers
  const handleMenuOpen = (event, user) => {
    event.stopPropagation();
    setSelectedUser(user);
    setMenuAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
    setSelectedUser(null);
  };

  const handleViewUser = (user) => {
    setSelectedUser(user);
    setViewDialog(true);
    handleMenuClose();
  };

  const handleDeleteUser = (user) => {
    setSelectedUser(user);
    setDeleteDialog(true);
    handleMenuClose();
  };

  const handleSendInvitation = async (user) => {
    try {
      await axios.post(`/api/user-registration/send-invitation/${user.id}`);
      setSnackbar({
        open: true,
        message: `Invitación enviada a ${user.full_name}`,
        severity: 'success'
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Error al enviar invitación',
        severity: 'error'
      });
    }
    handleMenuClose();
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`/api/user-registration/delete-user/${selectedUser.id}`);
      setUsers(users.filter(u => u.id !== selectedUser.id));
      setSnackbar({
        open: true,
        message: `Usuario ${selectedUser.full_name} eliminado exitosamente`,
        severity: 'success'
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Error al eliminar usuario',
        severity: 'error'
      });
    }
    setDeleteDialog(false);
    setSelectedUser(null);
  };

  const getStatusChip = (user) => {
    if (!user.profile_complete) {
      return <StyledChip label="Perfil Incompleto" status="pending" size="small" />;
    }
    if (user.status === 'Activo') {
      return <StyledChip label="Activo" status="active" size="small" />;
    }
    if (user.status === 'Pendiente') {
      return <StyledChip label="Pendiente" status="pending" size="small" />;
    }
    return <StyledChip label="Inactivo" status="inactive" size="small" />;
  };

  const formatLastLogin = (lastLogin) => {
    if (!lastLogin) return 'Nunca ha iniciado sesión';
    
    const date = new Date(lastLogin);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffMinutes = Math.floor(diffTime / (1000 * 60));
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    // Solo mostrar "En línea" si es muy reciente (menos de 2 minutos) 
    // Esto evita mostrar "En línea" cuando solo se consultó el perfil
    if (diffMinutes < 2) return '🟢 En línea ahora';
    
    // Si es hoy
    if (diffDays === 0) {
      if (diffHours === 0) return `🟡 Hace ${diffMinutes} minutos`;
      return `🟡 Hoy a las ${date.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })}`;
    }
    
    // Si es ayer
    if (diffDays === 1) return `🟠 Ayer a las ${date.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })}`;
    
    // Si es esta semana
    if (diffDays <= 7) return `🔴 Hace ${diffDays} días`;
    
    // Si es más antiguo
    return `⚫ ${date.toLocaleDateString('es-MX', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })}`;
  };

  const getUserStatus = (user) => {
    if (!user.is_active) return { text: 'Inactivo', color: '#e74c3c', icon: '🔴' };
    if (!user.last_login) return { text: 'Pendiente', color: '#f39c12', icon: '🟡' };
    
    const lastLogin = new Date(user.last_login);
    const now = new Date();
    const diffMinutes = Math.floor((now - lastLogin) / (1000 * 60));
    
    // Solo mostrar "En línea" si es muy reciente (menos de 2 minutos)
    // Esto evita mostrar "En línea" cuando solo se consultó el perfil
    if (diffMinutes < 2) return { text: 'En línea', color: '#27ae60', icon: '🟢' };
    if (diffMinutes < 30) return { text: 'Reciente', color: '#2ecc71', icon: '🟢' };
    if (diffMinutes < 1440) return { text: 'Activo hoy', color: '#3498db', icon: '🔵' };
    
    return { text: 'Inactivo', color: '#95a5a6', icon: '⚪' };
  };

  return (
    <Box>
      {/* Estadísticas mejoradas */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <StyledCard>
                <CardContent sx={{ textAlign: 'center', p: 2.5 }}>
                  <Box sx={{ color: stat.color, mb: 1.5 }}>
                    {stat.icon}
                  </Box>
                  <Typography variant="h3" sx={{ 
                    fontWeight: 800, 
                    color: '#2c3e50', 
                    mb: 0.5,
                    fontSize: '2.5rem'
                  }}>
                    {loading ? <Skeleton width={60} /> : stat.value}
                  </Typography>
                  <Typography variant="body2" sx={{ 
                    color: '#7f8c8d', 
                    fontWeight: 600,
                    mb: 1
                  }}>
                    {stat.label}
                  </Typography>
                  <Typography variant="caption" sx={{ 
                    color: stat.change.startsWith('+') ? '#27ae60' : 
                           stat.change.startsWith('-') ? '#e74c3c' : '#7f8c8d',
                    fontWeight: 700
                  }}>
                    {stat.change} este mes
                  </Typography>
                </CardContent>
              </StyledCard>
            </motion.div>
          </Grid>
        ))}
      </Grid>

      {/* Barra de filtros mejorada */}
      <StyledCard sx={{ mb: 4 }}>
        <CardContent>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} sm={6} md={4}>
              <StyledSearchField
                fullWidth
                placeholder="Buscar usuarios por nombre, email, rol o departamento..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: <SearchIcon sx={{ color: '#7f8c8d', mr: 1 }} />
                }}
              />
            </Grid>
            <Grid item xs={12} sm={3} md={2}>
              <FormControl fullWidth>
                <InputLabel>Estado</InputLabel>
                <Select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  label="Estado"
                  sx={{ borderRadius: 3 }}
                >
                  <MenuItem value="all">Todos</MenuItem>
                  <MenuItem value="active">Activos</MenuItem>
                  <MenuItem value="pending">Pendientes</MenuItem>
                  <MenuItem value="blocked">Bloqueados</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={3} md={2}>
              <FormControl fullWidth>
                <InputLabel>Rol</InputLabel>
                <Select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  label="Rol"
                  sx={{ borderRadius: 3 }}
                >
                  <MenuItem value="all">Todos los Roles</MenuItem>
                  <MenuItem value="super">Super Admin</MenuItem>
                  <MenuItem value="admin">Administrador</MenuItem>
                  <MenuItem value="user">Usuario</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={12} md={4}>
              <Stack direction="row" spacing={2} justifyContent="flex-end">
                <Button
                  variant="outlined"
                  startIcon={<RefreshIcon />}
                  onClick={() => {
                    // Limpiar caché del navegador
                    localStorage.removeItem('users');
                    sessionStorage.clear();
                    // Recargar datos
                    fetchUsers();
                  }}
                  sx={{
                    borderRadius: 3,
                    fontWeight: 600,
                    borderColor: 'rgba(102, 126, 234, 0.5)',
                    color: '#667eea'
                  }}
                >
                  🔄 Forzar Recarga
                </Button>
                <Button
                  variant="contained"
                  startIcon={<DownloadIcon />}
                  sx={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    borderRadius: 3,
                    fontWeight: 600,
                    boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)'
                  }}
                >
                  Exportar
                </Button>
              </Stack>
            </Grid>
          </Grid>
        </CardContent>
      </StyledCard>

      {/* Tabla de usuarios mejorada */}
      <StyledCard>
        <StyledTableContainer>
          <StyledTable>
            <TableHead>
              <TableRow>
                <TableCell>Usuario</TableCell>
                <TableCell>Contacto</TableCell>
                <TableCell>Estado</TableCell>
                <TableCell>Departamento</TableCell>
                <TableCell>Último Acceso</TableCell>
                <TableCell align="center">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                Array.from({ length: 5 }).map((_, index) => (
                  <UserRowSkeleton key={index} />
                ))
              ) : filteredUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    <Box sx={{ p: 4, textAlign: 'center' }}>
                      <GroupIcon sx={{ fontSize: 60, color: '#bdc3c7', mb: 2 }} />
                      <Typography variant="h6" sx={{ color: '#7f8c8d', mb: 1 }}>
                        No se encontraron usuarios
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#95a5a6' }}>
                        Ajusta los filtros de búsqueda o registra un nuevo usuario
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              ) : (
                <AnimatePresence>
                  {filteredUsers
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((user, index) => (
                    <motion.tr
                      key={user.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      component={TableRow}
                      sx={{ cursor: 'pointer' }}
                      onClick={() => handleViewUser(user)}
                    >
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Badge
                            overlap="circular"
                            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                            badgeContent={
                              user.profile_complete ? (
                                <CheckCircleIcon sx={{ 
                                  color: '#27ae60', 
                                  fontSize: 16,
                                  background: '#fff',
                                  borderRadius: '50%',
                                  p: 0.2
                                }} />
                              ) : (
                                <WarningIcon sx={{ 
                                  color: '#f39c12', 
                                  fontSize: 16,
                                  background: '#fff',
                                  borderRadius: '50%',
                                  p: 0.2
                                }} />
                              )
                            }
                          >
                            <Avatar
                              sx={{
                                width: 48,
                                height: 48,
                                background: user.role_name?.includes('Admin') ? 
                                  'linear-gradient(135deg, #fa709a 0%, #fee140 100%)' :
                                  'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                fontWeight: 700,
                                fontSize: '1.2rem'
                              }}
                            >
                              {user.full_name?.split(' ').map(n => n[0]).join('').toUpperCase()}
                            </Avatar>
                          </Badge>
                          <Box>
                            <Typography variant="subtitle1" sx={{ 
                              fontWeight: 600, 
                              color: '#2c3e50',
                              lineHeight: 1.2
                            }}>
                              {user.full_name}
                            </Typography>
                            <Typography variant="body2" sx={{ 
                              color: '#7f8c8d',
                              display: 'flex',
                              alignItems: 'center',
                              gap: 0.5,
                              mt: 0.5
                            }}>
                              <SecurityIcon sx={{ fontSize: 14 }} />
                              {user.role_name}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box>
                          <Typography variant="body2" sx={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: 0.5,
                            mb: 0.5,
                            color: '#2c3e50'
                          }}>
                            <EmailIcon sx={{ fontSize: 14 }} />
                            {user.email}
                          </Typography>
                          <Typography variant="body2" sx={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: 0.5,
                            color: '#7f8c8d'
                          }}>
                            <PhoneIcon sx={{ fontSize: 14 }} />
                            {user.phone || 'No registrado'}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        {getStatusChip(user)}
                      </TableCell>
                      <TableCell>
                        <Box>
                          <Typography variant="body2" sx={{ 
                            fontWeight: 600,
                            color: '#2c3e50',
                            mb: 0.5
                          }}>
                            {user.department || 'Sin departamento'}
                          </Typography>
                          <Typography variant="caption" sx={{ color: '#7f8c8d' }}>
                            {user.position || 'Sin posición'}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                          <Typography variant="body2" sx={{ 
                            color: user.last_login ? '#2c3e50' : '#e74c3c',
                            fontWeight: 500,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 0.5
                          }}>
                            {formatLastLogin(user.last_login)}
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Chip 
                              label={getUserStatus(user).text}
                              size="small"
                              sx={{ 
                                backgroundColor: getUserStatus(user).color + '20',
                                color: getUserStatus(user).color,
                                fontWeight: 500,
                                fontSize: '0.75rem'
                              }}
                            />
                            <Typography variant="caption" sx={{ 
                              color: '#7f8c8d',
                              display: 'flex',
                              alignItems: 'center',
                              gap: 0.5
                            }}>
                              <CalendarIcon sx={{ fontSize: 12 }} />
                              Registrado: {new Date(user.created_at).toLocaleDateString('es-MX')}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell align="center">
                        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                          <Tooltip title="Ver detalles">
                            <ActionButton
                              color="#45b7d1"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleViewUser(user);
                              }}
                            >
                              <VisibilityIcon fontSize="small" />
                            </ActionButton>
                          </Tooltip>
                          <Tooltip title="Más opciones">
                            <ActionButton
                              color="#7f8c8d"
                              onClick={(e) => handleMenuOpen(e, user)}
                            >
                              <MoreVertIcon fontSize="small" />
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
        
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50]}
          component="div"
          count={filteredUsers.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={(event, newPage) => setPage(newPage)}
          onRowsPerPageChange={(event) => {
            setRowsPerPage(parseInt(event.target.value, 10));
            setPage(0);
          }}
          labelRowsPerPage="Usuarios por página:"
          labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
          sx={{
            borderTop: '1px solid rgba(0,0,0,0.05)',
            background: 'rgba(255,255,255,0.8)',
            '& .MuiTablePagination-toolbar': {
              minHeight: 52
            }
          }}
        />
      </StyledCard>

      {/* Menú contextual */}
      <Menu
        anchorEl={menuAnchorEl}
        open={Boolean(menuAnchorEl)}
        onClose={handleMenuClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        PaperProps={{
          sx: {
            borderRadius: 2,
            mt: 1,
            minWidth: 180,
            boxShadow: '0 8px 32px rgba(0,0,0,0.15)'
          }
        }}
      >
        <MenuItem onClick={() => handleViewUser(selectedUser)}>
          <ListItemIcon>
            <VisibilityIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Ver detalles</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleSendInvitation(selectedUser)}>
          <ListItemIcon>
            <SendIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Enviar invitación</ListItemText>
        </MenuItem>
        <Divider />
        <MenuItem 
          onClick={() => handleDeleteUser(selectedUser)}
          sx={{ color: '#e74c3c' }}
        >
          <ListItemIcon>
            <DeleteIcon fontSize="small" sx={{ color: '#e74c3c' }} />
          </ListItemIcon>
          <ListItemText>Eliminar usuario</ListItemText>
        </MenuItem>
      </Menu>

      {/* Diálogo de detalles del usuario */}
      <Dialog
        open={viewDialog}
        onClose={() => setViewDialog(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            overflow: 'hidden'
          }
        }}
      >
        <DialogTitle sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: '#fff',
          textAlign: 'center',
          py: 3
        }}>
          <Typography variant="h5" fontWeight={700}>
            👤 Detalles del Usuario
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ p: 0 }}>
          {selectedUser && (
            <Box sx={{ p: 3 }}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Avatar
                      sx={{
                        width: 120,
                        height: 120,
                        mx: 'auto',
                        mb: 2,
                        background: selectedUser.role_name?.includes('Admin') ? 
                          'linear-gradient(135deg, #fa709a 0%, #fee140 100%)' :
                          'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        fontSize: '2.5rem',
                        fontWeight: 700
                      }}
                    >
                      {selectedUser.full_name?.split(' ').map(n => n[0]).join('').toUpperCase()}
                    </Avatar>
                    <Typography variant="h6" fontWeight={600} sx={{ color: '#2c3e50' }}>
                      {selectedUser.full_name}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#7f8c8d', mb: 2 }}>
                      {selectedUser.position || 'Sin posición definida'}
                    </Typography>
                    {getStatusChip(selectedUser)}
                  </Box>
                </Grid>
                <Grid item xs={12} md={8}>
                  <Typography variant="h6" sx={{ color: '#2c3e50', mb: 2, fontWeight: 600 }}>
                    📋 Información de Contacto
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <Typography variant="subtitle2" sx={{ color: '#7f8c8d' }}>Email</Typography>
                      <Typography variant="body1" sx={{ fontWeight: 500, mb: 2 }}>
                        {selectedUser.email}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2" sx={{ color: '#7f8c8d' }}>Teléfono</Typography>
                      <Typography variant="body1" sx={{ fontWeight: 500, mb: 2 }}>
                        {selectedUser.phone || 'No registrado'}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2" sx={{ color: '#7f8c8d' }}>Departamento</Typography>
                      <Typography variant="body1" sx={{ fontWeight: 500, mb: 2 }}>
                        {selectedUser.department || 'Sin departamento'}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2" sx={{ color: '#7f8c8d' }}>Rol</Typography>
                      <Typography variant="body1" sx={{ fontWeight: 500, mb: 2 }}>
                        {selectedUser.role_name}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2" sx={{ color: '#7f8c8d' }}>Estado de Actividad</Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                        <Chip 
                          label={getUserStatus(selectedUser).text}
                          size="small"
                          sx={{ 
                            backgroundColor: getUserStatus(selectedUser).color + '20',
                            color: getUserStatus(selectedUser).color,
                            fontWeight: 500
                          }}
                        />
                        <Typography variant="body2" sx={{ color: '#7f8c8d' }}>
                          {getUserStatus(selectedUser).icon}
                        </Typography>
                      </Box>
                      <Typography variant="subtitle2" sx={{ color: '#7f8c8d' }}>Último Acceso</Typography>
                      <Typography variant="body1" sx={{ fontWeight: 500, mb: 2 }}>
                        {formatLastLogin(selectedUser.last_login)}
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="subtitle2" sx={{ color: '#7f8c8d' }}>Fecha de Registro</Typography>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        {new Date(selectedUser.created_at).toLocaleDateString('es-MX', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3, gap: 2 }}>
          <Button
            onClick={() => setViewDialog(false)}
            variant="outlined"
            sx={{ borderRadius: 2 }}
          >
            Cerrar
          </Button>
          <Button
            variant="contained"
            startIcon={<SendIcon />}
            onClick={() => {
              handleSendInvitation(selectedUser);
              setViewDialog(false);
            }}
            sx={{
              background: 'linear-gradient(135deg, #27ae60, #2ecc71)',
              borderRadius: 2
            }}
          >
            Enviar Invitación
          </Button>
        </DialogActions>
      </Dialog>

      {/* Diálogo de confirmación de eliminación */}
      <Dialog
        open={deleteDialog}
        onClose={() => setDeleteDialog(false)}
        PaperProps={{
          sx: { borderRadius: 3 }
        }}
      >
        <DialogTitle sx={{ textAlign: 'center', py: 3 }}>
          <Typography variant="h5" fontWeight={700} sx={{ color: '#e74c3c' }}>
            ⚠️ Confirmar Eliminación
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ textAlign: 'center', pb: 2 }}>
          <Typography variant="body1" sx={{ mb: 2 }}>
            ¿Estás seguro de que quieres eliminar al usuario <strong>{selectedUser?.full_name}</strong>?
          </Typography>
          <Typography variant="body2" sx={{ color: '#e74c3c' }}>
            Esta acción no se puede deshacer.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 3, justifyContent: 'center', gap: 2 }}>
          <Button
            onClick={() => setDeleteDialog(false)}
            variant="outlined"
            sx={{ borderRadius: 2 }}
          >
            Cancelar
          </Button>
          <Button
            onClick={confirmDelete}
            variant="contained"
            sx={{
              background: 'linear-gradient(135deg, #e74c3c, #c0392b)',
              borderRadius: 2
            }}
          >
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar para notificaciones */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
          severity={snackbar.severity}
          variant="filled"
          sx={{
            borderRadius: 2,
            fontWeight: 600
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
});

UsersList.displayName = 'UsersList';

export default UsersList;