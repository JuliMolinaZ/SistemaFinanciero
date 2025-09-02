import React, { useState, useEffect, useCallback } from 'react';
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
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Card,
  Badge,
  Switch,
  FormControlLabel,
  Skeleton,
  Fade,
  Zoom,
  useTheme,
  useMediaQuery,
  Button,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Tabs,
  Tab,
  Paper,
  AlertTitle,
  LinearProgress
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  Security as SecurityIcon,
  AdminPanelSettings as AdminPanelSettingsIcon,
  VerifiedUser as VerifiedUserIcon,
  Refresh as RefreshIcon,
  ExpandMore as ExpandMoreIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  Save as SaveIcon,
  Close as CloseIcon,
  Lock as LockIcon,
  LockOpen as LockOpenIcon,
  Group as GroupIcon,
  Person as PersonIcon,
  Settings as SettingsIcon
} from '@mui/icons-material';

// ===== COMPONENTES ESTILIZADOS =====
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

const PermissionChip = styled(Chip)(({ theme, active }) => ({
  backgroundColor: active ? theme.palette.success.main : theme.palette.grey[300],
  color: active ? theme.palette.success.contrastText : theme.palette.grey[700],
  fontWeight: active ? 600 : 400,
  '&:hover': {
    backgroundColor: active ? theme.palette.success.dark : theme.palette.grey[400],
  }
}));

// ===== COMPONENTE PRINCIPAL =====
const RolesManagement = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  // Estados principales
  const [roles, setRoles] = useState([]);
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Estados para modales
  const [roleDialog, setRoleDialog] = useState(false);
  const [permissionsDialog, setPermissionsDialog] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState(false);
  
  // Estados para formularios
  const [selectedRole, setSelectedRole] = useState(null);
  const [roleForm, setRoleForm] = useState({
    name: '',
    description: '',
    level: 5
  });
  const [permissionsForm, setPermissionsForm] = useState({});
  
  // Estados para notificaciones
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  
  // Estados para tabs
  const [activeTab, setActiveTab] = useState(0);

  // ===== EFECTOS =====
  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (selectedRole) {
      initializePermissionsForm();
    }
  }, [selectedRole, modules]);

  // ===== FUNCIONES DE DATOS =====
  const fetchData = async () => {
    try {
      setLoading(true);
      const [rolesResponse, modulesResponse] = await Promise.all([
        axios.get('/api/roles'),
        axios.get('/api/roles/modules/list')
      ]);
      
      setRoles(rolesResponse.data.data || []);
      setModules(modulesResponse.data.data || []);
      setError(null);
    } catch (err) {
      setError('Error al cargar los datos');
    } finally {
      setLoading(false);
    }
  };

  const initializePermissionsForm = () => {
    if (!selectedRole || !modules.length) return;
    
    const permissions = {};
    modules.forEach(module => {
      const existingPermission = selectedRole.permissions?.find(p => p.module === module.name);
      permissions[module.name] = {
        can_read: existingPermission?.can_read || false,
        can_create: existingPermission?.can_create || false,
        can_update: existingPermission?.can_update || false,
        can_delete: existingPermission?.can_delete || false,
        can_export: existingPermission?.can_export || false,
        can_approve: existingPermission?.can_approve || false
      };
    });
    setPermissionsForm(permissions);
  };

  // ===== FUNCIONES DE ROLES =====
  const handleCreateRole = async () => {
    try {
      const response = await axios.post('/api/roles', roleForm);
      
      if (response.data.success) {
        setSnackbar({
          open: true,
          message: 'Rol creado exitosamente',
          severity: 'success'
        });
        setRoleDialog(false);
        resetRoleForm();
        fetchData();
      }
    } catch (err) {
      setSnackbar({
        open: true,
        message: err.response?.data?.error || 'Error al crear el rol',
        severity: 'error'
      });
    }
  };

  const handleUpdateRole = async () => {
    try {
      const response = await axios.put(`/api/roles/${selectedRole.id}`, {
        ...roleForm,
        permissions: Object.entries(permissionsForm).map(([module, perms]) => ({
          module,
          ...perms
        }))
      });
      
      if (response.data.success) {
        setSnackbar({
          open: true,
          message: 'Rol actualizado exitosamente',
          severity: 'success'
        });
        setPermissionsDialog(false);
        setSelectedRole(null);
        resetRoleForm();
        fetchData();
      }
    } catch (err) {
      setSnackbar({
        open: true,
        message: err.response?.data?.error || 'Error al crear el rol',
        severity: 'error'
      });
    }
  };

  const handleDeleteRole = async () => {
    try {
      const response = await axios.delete(`/api/roles/${selectedRole.id}`);
      
      if (response.data.success) {
        setSnackbar({
          open: true,
          message: 'Rol eliminado exitosamente',
          severity: 'success'
        });
        setDeleteDialog(false);
        setSelectedRole(null);
        fetchData();
      }
    } catch (err) {
      setSnackbar({
        open: true,
        message: err.response?.data?.error || 'Error al eliminar el rol',
        severity: 'error'
      });
    }
  };

  // ===== FUNCIONES DE FORMULARIOS =====
  const resetRoleForm = () => {
    setRoleForm({
      name: '',
      description: '',
      level: 5
    });
    setPermissionsForm({});
  };

  const handleRoleFormChange = (field, value) => {
    setRoleForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePermissionChange = (module, permission, value) => {
    setPermissionsForm(prev => ({
      ...prev,
      [module]: {
        ...prev[module],
        [permission]: value
      }
    }));
  };

  const handlePermissionToggle = (module, permission) => {
    const currentValue = permissionsForm[module]?.[permission] || false;
    handlePermissionChange(module, permission, !currentValue);
  };

  // ===== FUNCIONES DE INTERFAZ =====
  const openRoleDialog = (role = null) => {
    if (role) {
      setSelectedRole(role);
      setRoleForm({
        name: role.name,
        description: role.description,
        level: role.level
      });
    } else {
      setSelectedRole(null);
      resetRoleForm();
    }
    setRoleDialog(true);
  };

  const openPermissionsDialog = (role) => {
    setSelectedRole(role);
    setPermissionsDialog(true);
  };

  const openDeleteDialog = (role) => {
    setSelectedRole(role);
    setDeleteDialog(true);
  };

  const closeDialogs = () => {
    setRoleDialog(false);
    setPermissionsDialog(false);
    setDeleteDialog(false);
    setSelectedRole(null);
    resetRoleForm();
  };

  // ===== FUNCIONES DE UTILIDAD =====
  const getRoleLevelColor = (level) => {
    switch (level) {
      case 1: return 'error';
      case 2: return 'warning';
      case 3: return 'info';
      case 4: return 'success';
      default: return 'default';
    }
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

  const getPermissionIcon = (permission, value) => {
    if (value) {
      return <CheckCircleIcon color="success" />;
    }
    return <CancelIcon color="disabled" />;
  };

  // ===== FUNCIONES DE PERMISOS =====
  const handleEnableAllPermissions = (moduleName) => {
    setPermissionsForm(prev => ({
      ...prev,
      [moduleName]: {
        can_read: true,
        can_create: true,
        can_update: true,
        can_delete: true,
        can_export: true,
        can_approve: true
      }
    }));
  };

  const handleEnableReadOnly = (moduleName) => {
    setPermissionsForm(prev => ({
      ...prev,
      [moduleName]: {
        can_read: true,
        can_create: false,
        can_update: false,
        can_delete: false,
        can_export: false,
        can_approve: false
      }
    }));
  };

  const handleDisableAllPermissions = (moduleName) => {
    setPermissionsForm(prev => ({
      ...prev,
      [moduleName]: {
        can_read: false,
        can_create: false,
        can_update: false,
        can_delete: false,
        can_export: false,
        can_approve: false
      }
    }));
  };

  // ===== RENDERIZADO =====
  if (loading) {
    return (
      <StyledContainer maxWidth="xl">
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <LinearProgress />
          <Typography variant="h6" sx={{ mt: 2 }}>
            Cargando sistema de roles...
          </Typography>
        </Box>
      </StyledContainer>
    );
  }

  if (error) {
    return (
      <StyledContainer maxWidth="xl">
        <Alert severity="error" sx={{ mt: 2 }}>
          <AlertTitle>Error</AlertTitle>
          {error}
          <Button onClick={fetchData} sx={{ ml: 2 }}>
            Reintentar
          </Button>
        </Alert>
      </StyledContainer>
    );
  }

  return (
    <StyledContainer maxWidth="xl">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography variant="h3" component="h1" gutterBottom sx={{ color: 'white', fontWeight: 'bold' }}>
            🎭 Gestión de Roles y Permisos
          </Typography>
          <Typography variant="h6" sx={{ color: 'white', opacity: 0.9 }}>
            Administra roles, permisos y accesos del sistema
          </Typography>
        </Box>
      </motion.div>

      {/* Tabs */}
      <StyledCard sx={{ mb: 3 }}>
        <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)} centered>
          <Tab label="Roles del Sistema" icon={<GroupIcon />} />
          <Tab label="Permisos por Módulo" icon={<SecurityIcon />} />
          <Tab label="Estadísticas" icon={<AdminPanelSettingsIcon />} />
        </Tabs>
      </StyledCard>

      {/* Tab 1: Roles del Sistema */}
      {activeTab === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <StyledCard sx={{ mb: 3 }}>
            <Box sx={{ p: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h5" component="h2">
                Roles del Sistema
              </Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => openRoleDialog()}
                sx={{ borderRadius: 2 }}
              >
                Crear Nuevo Rol
              </Button>
            </Box>
            
            <Divider />
            
            <Box sx={{ p: 3 }}>
              <Grid container spacing={3}>
                {roles.map((role) => (
                  <Grid item xs={12} md={6} lg={4} key={role.id}>
                    <Card
                      sx={{
                        p: 2,
                        border: '1px solid',
                        borderColor: 'divider',
                        '&:hover': {
                          borderColor: 'primary.main',
                          boxShadow: 2
                        }
                      }}
                    >
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                        <Box>
                          <Typography variant="h6" gutterBottom>
                            {role.name}
                          </Typography>
                          <Chip
                            label={getRoleLevelText(role.level)}
                            color={getRoleLevelColor(role.level)}
                            size="small"
                            sx={{ mb: 1 }}
                          />
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                            {role.description}
                          </Typography>
                        </Box>
                        <Avatar sx={{ bgcolor: 'primary.main' }}>
                          {role.name.charAt(0).toUpperCase()}
                        </Avatar>
                      </Box>
                      
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" color="text.secondary">
                          Usuarios asignados: {role.user_count || 0}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Módulos con acceso: {role.permissions?.length || 0}
                        </Typography>
                      </Box>
                      
                      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                        <Button
                          size="small"
                          startIcon={<EditIcon />}
                          onClick={() => openPermissionsDialog(role)}
                          variant="outlined"
                        >
                          Permisos
                        </Button>
                        <Button
                          size="small"
                          startIcon={<EditIcon />}
                          onClick={() => openRoleDialog(role)}
                          variant="outlined"
                        >
                          Editar
                        </Button>
                        {role.user_count === 0 && (
                          <Button
                            size="small"
                            startIcon={<DeleteIcon />}
                            onClick={() => openDeleteDialog(role)}
                            variant="outlined"
                            color="error"
                          >
                            Eliminar
                          </Button>
                        )}
                      </Box>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </StyledCard>
        </motion.div>
      )}

      {/* Tab 2: Permisos por Módulo */}
      {activeTab === 1 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <StyledCard>
            <Box sx={{ p: 3 }}>
              <Typography variant="h5" component="h2" gutterBottom>
                Permisos por Módulo
              </Typography>
              
              <Accordion defaultExpanded>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography variant="h6">Módulos del Sistema</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Grid container spacing={2}>
                    {modules.map((module) => (
                      <Grid item xs={12} md={6} lg={4} key={module.id}>
                        <Card sx={{ p: 2, border: '1px solid', borderColor: 'divider' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                            <Typography variant="subtitle1" fontWeight="bold">
                              {module.display_name}
                            </Typography>
                            {module.requires_approval && (
                              <Chip label="Requiere Aprobación" size="small" color="warning" />
                            )}
                          </Box>
                          
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                            {module.description}
                          </Typography>
                          
                          <Typography variant="caption" color="text.secondary">
                            Ruta: {module.route}
                          </Typography>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                </AccordionDetails>
              </Accordion>
            </Box>
          </StyledCard>
        </motion.div>
      )}

      {/* Tab 3: Estadísticas */}
      {activeTab === 2 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <StyledCard>
                <Box sx={{ p: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    Resumen de Roles
                  </Typography>
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="body2">
                      Total de roles: {roles.length}
                    </Typography>
                    <Typography variant="body2">
                      Roles activos: {roles.filter(r => r.is_active).length}
                    </Typography>
                    <Typography variant="body2">
                      Total de permisos: {roles.reduce((acc, r) => acc + (r.permissions?.length || 0), 0)}
                    </Typography>
                  </Box>
                </Box>
              </StyledCard>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <StyledCard>
                <Box sx={{ p: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    Niveles de Acceso
                  </Typography>
                  <Box sx={{ mt: 2 }}>
                    {[1, 2, 3, 4, 5].map(level => {
                      const roleCount = roles.filter(r => r.level === level).length;
                      return (
                        <Box key={level} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                          <Typography variant="body2">
                            Nivel {level}: {getRoleLevelText(level)}
                          </Typography>
                          <Typography variant="body2" fontWeight="bold">
                            {roleCount}
                          </Typography>
                        </Box>
                      );
                    })}
                  </Box>
                </Box>
              </StyledCard>
            </Grid>
          </Grid>
        </motion.div>
      )}

      {/* Modal: Crear/Editar Rol */}
      <Dialog open={roleDialog} onClose={closeDialogs} maxWidth="sm" fullWidth>
        <DialogTitle>
          {selectedRole ? 'Editar Rol' : 'Crear Nuevo Rol'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Nombre del Rol"
                  value={roleForm.name}
                  onChange={(e) => handleRoleFormChange('name', e.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Descripción"
                  value={roleForm.description}
                  onChange={(e) => handleRoleFormChange('description', e.target.value)}
                  multiline
                  rows={3}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Nivel de Acceso</InputLabel>
                  <Select
                    value={roleForm.level}
                    onChange={(e) => handleRoleFormChange('level', e.target.value)}
                    label="Nivel de Acceso"
                  >
                    <MenuItem value={1}>1 - Super Administrador</MenuItem>
                    <MenuItem value={2}>2 - Gerente</MenuItem>
                    <MenuItem value={3}>3 - Desarrollador</MenuItem>
                    <MenuItem value={4}>4 - Contador</MenuItem>
                    <MenuItem value={5}>5 - Invitado</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDialogs}>Cancelar</Button>
          <Button
            onClick={selectedRole ? handleUpdateRole : handleCreateRole}
            variant="contained"
            disabled={!roleForm.name || !roleForm.description}
          >
            {selectedRole ? 'Actualizar' : 'Crear'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal: Gestionar Permisos */}
      <Dialog open={permissionsDialog} onClose={closeDialogs} maxWidth="lg" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <SecurityIcon color="primary" />
            <Typography variant="h6">
              Gestionar Permisos: {selectedRole?.name}
            </Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Configura los permisos de acceso para cada módulo del sistema. Usa los botones de acción rápida o configura cada permiso individualmente.
            </Typography>
            
            <Grid container spacing={3}>
              {modules.map((module) => (
                <Grid item xs={12} key={module.id}>
                  <Card sx={{ 
                    p: 3, 
                    border: '1px solid', 
                    borderColor: 'divider',
                    borderRadius: 2,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    '&:hover': {
                      boxShadow: '0 4px 16px rgba(0,0,0,0.15)'
                    }
                  }}>
                    {/* Header del módulo */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="h6" fontWeight="bold" sx={{ mb: 1 }}>
                          {module.display_name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                          {module.description}
                        </Typography>
                        
                        {/* Contador de permisos activos */}
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Chip
                            size="small"
                            label={`${Object.values(permissionsForm[module.name] || {}).filter(Boolean).length}/6 permisos activos`}
                            color="primary"
                            variant="outlined"
                          />
                        </Box>
                      </Box>
                    </Box>
                    
                    {/* Botones de Acción Rápida */}
                    <Box sx={{ mb: 3 }}>
                      <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 2, color: theme.palette.primary.main }}>
                        🚀 Acciones Rápidas:
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                        <Button
                          variant="outlined"
                          color="success"
                          size="small"
                          startIcon={<CheckCircleIcon />}
                          onClick={() => handleEnableAllPermissions(module.name)}
                          sx={{ borderRadius: 2, textTransform: 'none' }}
                        >
                          ✅ Habilitar Todo
                        </Button>
                        <Button
                          variant="outlined"
                          color="warning"
                          size="small"
                          startIcon={<VisibilityIcon />}
                          onClick={() => handleEnableReadOnly(module.name)}
                          sx={{ borderRadius: 2, textTransform: 'none' }}
                        >
                          👁️ Solo Lectura
                        </Button>
                        <Button
                          variant="outlined"
                          color="error"
                          size="small"
                          startIcon={<CancelIcon />}
                          onClick={() => handleDisableAllPermissions(module.name)}
                          sx={{ borderRadius: 2, textTransform: 'none' }}
                        >
                          ❌ Deshabilitar Todo
                        </Button>
                      </Box>
                    </Box>
                    
                    <Divider sx={{ my: 2 }} />
                    
                    {/* Permisos Individuales */}
                    <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 2, color: theme.palette.text.secondary }}>
                      🔧 Permisos Individuales:
                    </Typography>
                    <Grid container spacing={2}>
                      {[
                        { key: 'can_read', label: '📖 Lectura', icon: '📖', color: 'primary', description: 'Puede ver el módulo' },
                        { key: 'can_create', label: '➕ Crear', icon: '➕', color: 'success', description: 'Puede crear nuevos registros' },
                        { key: 'can_update', label: '✏️ Editar', icon: '✏️', color: 'info', description: 'Puede modificar registros' },
                        { key: 'can_delete', label: '🗑️ Eliminar', icon: '🗑️', color: 'error', description: 'Puede eliminar registros' },
                        { key: 'can_export', label: '📤 Exportar', icon: '📤', color: 'warning', description: 'Puede exportar datos' },
                        { key: 'can_approve', label: '✅ Aprobar', icon: '✅', color: 'secondary', description: 'Puede aprobar acciones' }
                      ].map((perm) => (
                        <Grid item xs={12} sm={6} md={4} key={perm.key}>
                          <Card sx={{ 
                            p: 2, 
                            textAlign: 'center',
                            border: permissionsForm[module.name]?.[perm.key] ? `2px solid ${theme.palette[perm.color].main}` : '2px solid #e0e0e0',
                            backgroundColor: permissionsForm[module.name]?.[perm.key] ? `${theme.palette[perm.color].main}10` : 'white',
                            transition: 'all 0.2s ease',
                            '&:hover': {
                              transform: 'translateY(-2px)',
                              boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                            }
                          }}>
                            <Box sx={{ mb: 1, color: theme.palette[perm.color].main }}>
                              <Typography variant="h6">{perm.icon}</Typography>
                            </Box>
                            <Typography variant="body2" sx={{ mb: 1, fontWeight: 'bold' }}>
                              {perm.label}
                            </Typography>
                            <Typography variant="caption" sx={{ mb: 2, display: 'block', color: 'text.secondary' }}>
                              {perm.description}
                            </Typography>
                            <Switch
                              checked={permissionsForm[module.name]?.[perm.key] || false}
                              onChange={() => handlePermissionToggle(module.name, perm.key)}
                              color={perm.color}
                              size="small"
                            />
                          </Card>
                        </Grid>
                      ))}
                    </Grid>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDialogs} startIcon={<CloseIcon />}>
            Cancelar
          </Button>
          <Button 
            onClick={handleUpdateRole} 
            variant="contained" 
            color="primary"
            startIcon={<SaveIcon />}
            sx={{ 
              background: 'linear-gradient(45deg, #667eea, #764ba2)',
              '&:hover': {
                background: 'linear-gradient(45deg, #5a6fd8, #6a4190)'
              }
            }}
          >
            💾 Guardar Permisos
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal: Confirmar Eliminación */}
      <Dialog open={deleteDialog} onClose={closeDialogs}>
        <DialogTitle>Confirmar Eliminación</DialogTitle>
        <DialogContent>
          <Typography>
            ¿Está seguro de que desea eliminar el rol "{selectedRole?.name}"?
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Esta acción no se puede deshacer.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDialogs}>Cancelar</Button>
          <Button onClick={handleDeleteRole} variant="contained" color="error">
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar para notificaciones */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </StyledContainer>
  );
};

export default RolesManagement;
