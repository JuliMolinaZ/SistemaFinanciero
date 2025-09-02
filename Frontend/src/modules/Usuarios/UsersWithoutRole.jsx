import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Chip,
  Grid,
  Alert,
  AlertTitle,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Divider,
  LinearProgress,
  Skeleton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  FormControlLabel,
  Switch
} from '@mui/material';
import {
  Security as SecurityIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  Lock as LockIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  CalendarToday as CalendarIcon,
  Assignment as AssignmentIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Refresh as RefreshIcon,
  Send as SendIcon
} from '@mui/icons-material';
import axios from 'axios';

const UsersWithoutRole = () => {
  const [usersWithoutRole, setUsersWithoutRole] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [assignRoleDialog, setAssignRoleDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [roleForm, setRoleForm] = useState({
    role_id: '',
    is_active: true
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [usersResponse, rolesResponse] = await Promise.all([
        axios.get('/api/usuarios'),
        axios.get('/api/roles')
      ]);
      
      // Filtrar usuarios sin rol asignado
      const users = usersResponse.data.data || [];
      const usersWithoutRole = users.filter(user => !user.role_id);
      
      setUsersWithoutRole(usersWithoutRole);
      setRoles(rolesResponse.data.data || []);
      setError(null);
    } catch (err) {
      setError('Error al cargar los datos');
    } finally {
      setLoading(false);
    }
  };

  const handleAssignRole = async () => {
    try {
      const response = await axios.put(`/api/usuarios/${selectedUser.id}`, roleForm);
      
      if (response.data.success) {
        // Cerrar diálogo y actualizar datos
        setAssignRoleDialog(false);
        setSelectedUser(null);
        setRoleForm({ role_id: '', is_active: true });
        fetchData();
        
        // Mostrar notificación de éxito
        // Aquí podrías usar un sistema de notificaciones global
      }
    } catch (err) {
      // Mostrar error
    }
  };

  const openAssignRoleDialog = (user) => {
    setSelectedUser(user);
    setRoleForm({
      role_id: '',
      is_active: true
    });
    setAssignRoleDialog(true);
  };

  const closeAssignRoleDialog = () => {
    setAssignRoleDialog(false);
    setSelectedUser(null);
    setRoleForm({ role_id: '', is_active: true });
  };

  const handleRoleFormChange = (field, value) => {
    setRoleForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const getRoleLevelText = (level) => {
    switch (level) {
      case 1: return 'Super Administrador';
      case 2: return 'Gerente';
      case 3: return 'Desarrollador';
      case 4: return 'Contador';
      case 5: return 'Invitado';
      default: return 'Usuario';
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent>
          <Skeleton variant="text" width="60%" height={32} />
          <Skeleton variant="text" width="40%" height={24} />
          <Box sx={{ mt: 2 }}>
            <Skeleton variant="rectangular" height={60} />
          </Box>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Alert severity="error">
        <AlertTitle>Error</AlertTitle>
        {error}
        <Button onClick={fetchData} sx={{ ml: 2 }}>
          Reintentar
        </Button>
      </Alert>
    );
  }

  if (usersWithoutRole.length === 0) {
    return (
      <Card>
        <CardContent>
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <CheckCircleIcon color="success" sx={{ fontSize: 64, mb: 2 }} />
            <Typography variant="h6" color="success.main" gutterBottom>
              ¡Excelente! Todos los usuarios tienen rol asignado
            </Typography>
            <Typography variant="body2" color="text.secondary">
              No hay usuarios pendientes de asignación de rol.
            </Typography>
          </Box>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <WarningIcon color="warning" />
              <Typography variant="h6" color="warning.main">
                Usuarios Sin Rol Asignado
              </Typography>
            </Box>
            <Button
              startIcon={<RefreshIcon />}
              onClick={fetchData}
              variant="outlined"
            >
              Actualizar
            </Button>
          </Box>

          <Alert severity="warning" sx={{ mb: 3 }}>
            <AlertTitle>Atención Requerida</AlertTitle>
            Hay {usersWithoutRole.length} usuario(s) que no pueden acceder al sistema porque no tienen rol asignado.
            Estos usuarios pueden ingresar pero no verán ningún contenido hasta que se les asigne un rol.
          </Alert>

          {/* Estadísticas */}
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'warning.light', borderRadius: 2 }}>
                <Typography variant="h4" color="warning.dark">
                  {usersWithoutRole.length}
                </Typography>
                <Typography variant="body2" color="warning.dark">
                  Usuarios Sin Rol
                </Typography>
              </Box>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'info.light', borderRadius: 2 }}>
                <Typography variant="h4" color="info.dark">
                  {roles.length}
                </Typography>
                <Typography variant="body2" color="info.dark">
                  Roles Disponibles
                </Typography>
              </Box>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'success.light', borderRadius: 2 }}>
                <Typography variant="h4" color="success.dark">
                  {usersWithoutRole.filter(u => u.is_active !== false).length}
                </Typography>
                <Typography variant="body2" color="success.dark">
                  Usuarios Activos
                </Typography>
              </Box>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'error.light', borderRadius: 2 }}>
                <Typography variant="h4" color="error.dark">
                  {usersWithoutRole.filter(u => u.is_active === false).length}
                </Typography>
                <Typography variant="body2" color="error.dark">
                  Usuarios Inactivos
                </Typography>
              </Box>
            </Grid>
          </Grid>

          {/* Lista de usuarios sin rol */}
          <Typography variant="h6" gutterBottom>
            Usuarios Pendientes de Asignación
          </Typography>
          
          <Grid container spacing={2}>
            {usersWithoutRole.map((user) => (
              <Grid item xs={12} md={6} lg={4} key={user.id}>
                <Card variant="outlined" sx={{ borderColor: 'warning.main' }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                      <Avatar
                        src={user.avatar}
                        sx={{ width: 48, height: 48 }}
                      >
                        {user.name?.charAt(0).toUpperCase()}
                      </Avatar>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="h6" gutterBottom>
                          {user.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {user.email}
                        </Typography>
                      </Box>
                      <Chip
                        label="Sin Rol"
                        color="warning"
                        size="small"
                        icon={<LockIcon />}
                      />
                    </Box>
                    
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary">
                        Fecha de registro: {formatDate(user.created_at)}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Estado: {user.is_active !== false ? 'Activo' : 'Inactivo'}
                      </Typography>
                    </Box>
                    
                    <Button
                      fullWidth
                      variant="contained"
                      startIcon={<AssignmentIcon />}
                      onClick={() => openAssignRoleDialog(user)}
                      sx={{ borderRadius: 2 }}
                    >
                      Asignar Rol
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>

      {/* Modal para asignar rol */}
      <Dialog open={assignRoleDialog} onClose={closeAssignRoleDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          Asignar Rol a Usuario
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            {selectedUser && (
              <Box sx={{ mb: 3, p: 2, bgcolor: 'grey.50', borderRadius: 2 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Usuario Seleccionado
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar src={selectedUser.avatar}>
                    {selectedUser.name?.charAt(0).toUpperCase()}
                  </Avatar>
                  <Box>
                    <Typography variant="body1" fontWeight="bold">
                      {selectedUser.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {selectedUser.email}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            )}
            
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Seleccionar Rol</InputLabel>
                  <Select
                    value={roleForm.role_id}
                    onChange={(e) => handleRoleFormChange('role_id', e.target.value)}
                    label="Seleccionar Rol"
                    required
                  >
                    {roles.map((role) => (
                      <MenuItem key={role.id} value={role.id}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="body1">
                            {role.name}
                          </Typography>
                          <Chip
                            label={getRoleLevelText(role.level)}
                            size="small"
                            color="primary"
                            variant="outlined"
                          />
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={roleForm.is_active}
                      onChange={(e) => handleRoleFormChange('is_active', e.target.checked)}
                    />
                  }
                  label="Usuario activo"
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeAssignRoleDialog}>
            Cancelar
          </Button>
          <Button
            onClick={handleAssignRole}
            variant="contained"
            disabled={!roleForm.role_id}
            startIcon={<SendIcon />}
          >
            Asignar Rol
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default UsersWithoutRole;
