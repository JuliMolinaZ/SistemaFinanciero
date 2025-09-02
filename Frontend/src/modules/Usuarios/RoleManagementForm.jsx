import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Container,
  Paper,
  Typography,
  Button,
  Box,
  Alert,
  Snackbar,
  CircularProgress,
  Card,
  CardContent,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Tooltip,
  Chip,
  Avatar,
  useTheme,
  useMediaQuery,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Switch,
  FormControlLabel,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider
} from '@mui/material';
import {
  Security,
  Edit,
  Delete,
  Add,
  ExpandMore,
  Save,
  Cancel,
  Visibility,
  Create,
  Update,
  DeleteForever,
  FileDownload,
  Approval,
  AdminPanelSettings,
  Group,
  Person
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

const API_URL = 'http://localhost:5001';

const StyledContainer = styled(Container)(({ theme }) => ({
  padding: theme.spacing(3),
  background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
  minHeight: '100%',
  borderRadius: 16
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  color: 'white',
  borderRadius: 24,
  boxShadow: '0 20px 60px rgba(102, 126, 234, 0.3), 0 8px 25px rgba(0,0,0,0.1)',
  border: '1px solid rgba(255,255,255,0.3)',
  backdropFilter: 'blur(20px)',
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: -50,
    right: -50,
    width: 100,
    height: 100,
    background: 'rgba(255,255,255,0.1)',
    borderRadius: '50%',
    filter: 'blur(20px)'
  }
}));

const StyledCard = styled(Card)(({ theme }) => ({
  background: 'rgba(255, 255, 255, 0.98)',
  backdropFilter: 'blur(20px)',
  borderRadius: 20,
  boxShadow: '0 8px 32px rgba(0,0,0,0.08), 0 4px 16px rgba(0,0,0,0.04)',
  border: '1px solid rgba(255,255,255,0.3)',
  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
  overflow: 'hidden',
  '&:hover': {
    transform: 'translateY(-8px) scale(1.02)',
    boxShadow: '0 20px 60px rgba(0,0,0,0.15), 0 12px 35px rgba(0,0,0,0.08)'
  }
}));

const PermissionSwitch = styled(FormControlLabel)(({ theme }) => ({
  margin: theme.spacing(1, 0),
  '& .MuiFormControlLabel-label': {
    fontSize: '0.9rem',
    fontWeight: 500
  }
}));

const RoleManagementForm = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Estados
  const [roles, setRoles] = useState([]);
  const [modules, setModules] = useState([]);
  const [selectedRole, setSelectedRole] = useState(null);
  const [rolePermissions, setRolePermissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rolesLoading, setRolesLoading] = useState(false);
  const [permissionsLoading, setPermissionsLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  
  // Estados para diálogos
  const [createRoleDialog, setCreateRoleDialog] = useState(false);
  const [editRoleDialog, setEditRoleDialog] = useState(false);
  const [deleteRoleDialog, setDeleteRoleDialog] = useState(false);
  const [editPermissionsDialog, setEditPermissionsDialog] = useState(false);
  
  // Estados para formularios
  const [newRole, setNewRole] = useState({ name: '', description: '', level: 5 });
  const [editingRole, setEditingRole] = useState({ name: '', description: '', level: 5, is_active: true });
  const [editingPermissions, setEditingPermissions] = useState([]);

  // Cargar roles y módulos al montar el componente
  useEffect(() => {
    fetchRoles();
    fetchModules();
  }, []);

  // Cargar roles del sistema
  const fetchRoles = async () => {
    setRolesLoading(true);
    try {
      const response = await axios.get(`${API_URL}/api/role-management/roles`);
      if (response.data.success) {
        setRoles(response.data.data);
      } else {
        throw new Error('Respuesta de API no exitosa');
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Error al cargar roles. Verifica que el backend esté funcionando.',
        severity: 'error'
      });
    } finally {
      setRolesLoading(false);
      setLoading(false);
    }
  };

  // Cargar módulos del sistema
  const fetchModules = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/role-management/modules`);
      if (response.data.success) {
        setModules(response.data.data);
      } else {
        throw new Error('Respuesta de API no exitosa');
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Error al cargar módulos del sistema.',
        severity: 'error'
      });
    }
  };

  // Cargar permisos de un rol específico
  const fetchRolePermissions = async (roleId) => {
    setPermissionsLoading(true);
    try {
      const response = await axios.get(`${API_URL}/api/role-management/roles/${roleId}/permissions`);
      if (response.data.success) {
        setRolePermissions(response.data.data);
      } else {
        throw new Error('Respuesta de API no exitosa');
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Error al cargar permisos del rol.',
        severity: 'error'
      });
    } finally {
      setPermissionsLoading(false);
    }
  };

  // Seleccionar rol
  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    fetchRolePermissions(role.id);
  };

  // Crear nuevo rol
  const handleCreateRole = async () => {
    try {
      const response = await axios.post(`${API_URL}/api/role-management/roles`, newRole);
      if (response.data.success) {
        setSnackbar({
          open: true,
          message: 'Rol creado exitosamente.',
          severity: 'success'
        });
        setCreateRoleDialog(false);
        setNewRole({ name: '', description: '', level: 5 });
        fetchRoles();
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Error al crear rol';
      setSnackbar({
        open: true,
        message: errorMessage,
        severity: 'error'
      });
    }
  };

  // Actualizar rol
  const handleUpdateRole = async () => {
    try {
      const response = await axios.put(`${API_URL}/api/role-management/roles/${editingRole.id}`, editingRole);
      if (response.data.success) {
        setSnackbar({
          open: true,
          message: 'Rol actualizado exitosamente.',
          severity: 'success'
        });
        setEditRoleDialog(false);
        setEditingRole({ name: '', description: '', level: 5, is_active: true });
        fetchRoles();
        if (selectedRole && selectedRole.id === editingRole.id) {
          setSelectedRole(response.data.data);
        }
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Error al actualizar rol';
      setSnackbar({
        open: true,
        message: errorMessage,
        severity: 'error'
      });
    }
  };

  // Eliminar rol
  const handleDeleteRole = async () => {
    try {
      const response = await axios.delete(`${API_URL}/api/role-management/roles/${editingRole.id}`);
      if (response.data.success) {
        setSnackbar({
          open: true,
          message: 'Rol eliminado exitosamente.',
          severity: 'success'
        });
        setDeleteRoleDialog(false);
        setEditingRole({ name: '', description: '', level: 5, is_active: true });
        fetchRoles();
        if (selectedRole && selectedRole.id === editingRole.id) {
          setSelectedRole(null);
          setRolePermissions([]);
        }
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Error al eliminar rol';
      setSnackbar({
        open: true,
        message: errorMessage,
        severity: 'error'
      });
    }
  };

  // Abrir diálogo de edición de permisos
  const handleEditPermissions = (role) => {
    setEditingRole(role);
    setEditingPermissions([...rolePermissions]);
    setEditPermissionsDialog(true);
  };

  // Actualizar permisos
  const handleUpdatePermissions = async () => {
    try {
      const response = await axios.put(`${API_URL}/api/role-management/roles/${editingRole.id}/permissions`, {
        permissions: editingPermissions
      });
      if (response.data.success) {
        setSnackbar({
          open: true,
          message: 'Permisos actualizados exitosamente.',
          severity: 'success'
        });
        setEditPermissionsDialog(false);
        setEditingRole({ name: '', description: '', level: 5, is_active: true });
        setEditingPermissions([]);
        fetchRolePermissions(editingRole.id);
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Error al actualizar permisos';
      setSnackbar({
        open: true,
        message: errorMessage,
        severity: 'error'
      });
    }
  };

  // Cambiar permiso individual
  const handlePermissionChange = (moduleName, permissionType, value) => {
    setEditingPermissions(prev => 
      prev.map(perm => 
        perm.module === moduleName 
          ? { ...perm, [permissionType]: value }
          : perm
      )
    );
  };

  // Obtener icono para el tipo de permiso
  const getPermissionIcon = (type) => {
    switch (type) {
      case 'can_read': return <Visibility />;
      case 'can_create': return <Create />;
      case 'can_update': return <Update />;
      case 'can_delete': return <DeleteForever />;
      case 'can_export': return <FileDownload />;
      case 'can_approve': return <Approval />;
      default: return <Security />;
    }
  };

  // Obtener color para el tipo de permiso
  const getPermissionColor = (type) => {
    switch (type) {
      case 'can_read': return 'primary';
      case 'can_create': return 'success';
      case 'can_update': return 'warning';
      case 'can_delete': return 'error';
      case 'can_export': return 'info';
      case 'can_approve': return 'secondary';
      default: return 'default';
    }
  };

  // Obtener nombre legible del tipo de permiso
  const getPermissionLabel = (type) => {
    switch (type) {
      case 'can_read': return 'Ver';
      case 'can_create': return 'Crear';
      case 'can_update': return 'Editar';
      case 'can_delete': return 'Eliminar';
      case 'can_export': return 'Exportar';
      case 'can_approve': return 'Aprobar';
      default: return type;
    }
  };

  // Cerrar snackbar
  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  if (loading) {
    return (
      <Container sx={{ py: 4, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress size={60} />
      </Container>
    );
  }

  return (
    <StyledContainer maxWidth="xl">
      <StyledPaper>
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 700, textAlign: 'center', mb: 4 }}>
          <Security sx={{ mr: 2, verticalAlign: 'middle' }} />
          Gestión de Roles y Permisos
        </Typography>

        <Grid container spacing={3}>
          {/* Lista de Roles */}
          <Grid item xs={12} md={4}>
            <StyledCard>
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                  <Typography variant="h6" sx={{ fontWeight: 600, color: '#1a1a1a' }}>
                    <Group sx={{ mr: 1, verticalAlign: 'middle' }} />
                    Roles del Sistema
                  </Typography>
                  <Button
                    variant="contained"
                    startIcon={<Add />}
                    onClick={() => setCreateRoleDialog(true)}
                    sx={{ borderRadius: 2 }}
                  >
                    Nuevo Rol
                  </Button>
                </Box>

                {rolesLoading ? (
                  <Box display="flex" justifyContent="center" py={3}>
                    <CircularProgress />
                  </Box>
                ) : (
                  <Box>
                    {roles.map((role) => (
                      <Card
                        key={role.id}
                        sx={{
                          mb: 2,
                          cursor: 'pointer',
                          border: selectedRole?.id === role.id ? '2px solid #667eea' : '1px solid #e0e0e0',
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            borderColor: '#667eea',
                            boxShadow: '0 4px 12px rgba(102, 126, 234, 0.2)'
                          }
                        }}
                        onClick={() => handleRoleSelect(role)}
                      >
                        <CardContent sx={{ py: 2, px: 2 }}>
                          <Box display="flex" justifyContent="space-between" alignItems="center">
                            <Box>
                              <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#1a1a1a' }}>
                                {role.name}
                              </Typography>
                              <Typography variant="body2" color="textSecondary" sx={{ fontSize: '0.8rem' }}>
                                Nivel: {role.level}
                              </Typography>
                              <Typography variant="body2" color="textSecondary" sx={{ fontSize: '0.8rem' }}>
                                Usuarios: {role._count?.users || 0}
                              </Typography>
                            </Box>
                            <Box>
                              <IconButton
                                size="small"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setEditingRole(role);
                                  setEditRoleDialog(true);
                                }}
                                sx={{ color: '#667eea' }}
                              >
                                <Edit />
                              </IconButton>
                              {role.name !== 'Super Administrador' && (
                                <IconButton
                                  size="small"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setEditingRole(role);
                                    setDeleteRoleDialog(true);
                                  }}
                                  sx={{ color: '#f44336' }}
                                >
                                  <Delete />
                                </IconButton>
                              )}
                            </Box>
                          </Box>
                        </CardContent>
                      </Card>
                    ))}
                  </Box>
                )}
              </CardContent>
            </StyledCard>
          </Grid>

          {/* Detalles del Rol y Permisos */}
          <Grid item xs={12} md={8}>
            {selectedRole ? (
              <StyledCard>
                <CardContent>
                  <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                    <Box>
                      <Typography variant="h5" sx={{ fontWeight: 600, color: '#1a1a1a' }}>
                        <AdminPanelSettings sx={{ mr: 1, verticalAlign: 'middle' }} />
                        {selectedRole.name}
                      </Typography>
                      <Typography variant="body1" color="textSecondary" sx={{ mt: 1 }}>
                        {selectedRole.description}
                      </Typography>
                      <Box display="flex" gap={1} mt={1}>
                        <Chip 
                          label={`Nivel: ${selectedRole.level}`} 
                          color="primary" 
                          size="small" 
                        />
                        <Chip 
                          label={`Usuarios: ${selectedRole._count?.users || 0}`} 
                          color="secondary" 
                          size="small" 
                        />
                        <Chip 
                          label={selectedRole.is_active ? 'Activo' : 'Inactivo'} 
                          color={selectedRole.is_active ? 'success' : 'error'} 
                          size="small" 
                        />
                      </Box>
                    </Box>
                    <Button
                      variant="contained"
                      startIcon={<Security />}
                      onClick={() => handleEditPermissions(selectedRole)}
                      disabled={selectedRole.name === 'Super Administrador'}
                      sx={{ borderRadius: 2 }}
                    >
                      Editar Permisos
                    </Button>
                  </Box>

                  <Divider sx={{ my: 2 }} />

                  <Typography variant="h6" sx={{ fontWeight: 600, color: '#1a1a1a', mb: 2 }}>
                    Permisos del Rol
                  </Typography>

                  {permissionsLoading ? (
                    <Box display="flex" justifyContent="center" py={3}>
                      <CircularProgress />
                    </Box>
                  ) : (
                    <Box>
                      {rolePermissions.length > 0 ? (
                        rolePermissions.map((permission) => (
                          <Accordion key={permission.module} sx={{ mb: 1 }}>
                            <AccordionSummary expandIcon={<ExpandMore />}>
                              <Box display="flex" alignItems="center" width="100%">
                                <Typography variant="subtitle1" sx={{ fontWeight: 600, flexGrow: 1 }}>
                                  {permission.module}
                                </Typography>
                                <Box display="flex" gap={1}>
                                  {Object.entries(permission)
                                    .filter(([key, value]) => key.startsWith('can_') && value)
                                    .map(([key, value]) => (
                                      <Chip
                                        key={key}
                                        icon={getPermissionIcon(key)}
                                        label={getPermissionLabel(key)}
                                        color={getPermissionColor(key)}
                                        size="small"
                                        variant="outlined"
                                      />
                                    ))}
                                </Box>
                              </Box>
                            </AccordionSummary>
                            <AccordionDetails>
                              <Grid container spacing={2}>
                                {Object.entries(permission)
                                  .filter(([key, value]) => key.startsWith('can_'))
                                  .map(([key, value]) => (
                                    <Grid item xs={6} sm={4} key={key}>
                                      <Box display="flex" alignItems="center" gap={1}>
                                        {getPermissionIcon(key)}
                                        <Typography variant="body2">
                                          {getPermissionLabel(key)}
                                        </Typography>
                                        <Chip
                                          label={value ? 'Sí' : 'No'}
                                          color={value ? 'success' : 'error'}
                                          size="small"
                                          variant="outlined"
                                        />
                                      </Box>
                                    </Grid>
                                  ))}
                              </Grid>
                            </AccordionDetails>
                          </Accordion>
                        ))
                      ) : (
                        <Typography variant="body1" color="textSecondary" sx={{ textAlign: 'center', py: 3 }}>
                          No hay permisos configurados para este rol.
                        </Typography>
                      )}
                    </Box>
                  )}
                </CardContent>
              </StyledCard>
            ) : (
              <StyledCard>
                <CardContent sx={{ textAlign: 'center', py: 6 }}>
                  <Security sx={{ fontSize: 64, color: '#ccc', mb: 2 }} />
                  <Typography variant="h6" color="textSecondary">
                    Selecciona un rol para ver sus detalles y permisos
                  </Typography>
                </CardContent>
              </StyledCard>
            )}
          </Grid>
        </Grid>
      </StyledPaper>

      {/* Diálogo para crear rol */}
      <Dialog open={createRoleDialog} onClose={() => setCreateRoleDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Crear Nuevo Rol</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Nombre del Rol"
            value={newRole.name}
            onChange={(e) => setNewRole({ ...newRole, name: e.target.value })}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Descripción"
            value={newRole.description}
            onChange={(e) => setNewRole({ ...newRole, description: e.target.value })}
            margin="normal"
            multiline
            rows={3}
          />
          <TextField
            fullWidth
            label="Nivel"
            type="number"
            value={newRole.level}
            onChange={(e) => setNewRole({ ...newRole, level: parseInt(e.target.value) })}
            margin="normal"
            required
            inputProps={{ min: 1, max: 10 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateRoleDialog(false)}>Cancelar</Button>
          <Button onClick={handleCreateRole} variant="contained">Crear</Button>
        </DialogActions>
      </Dialog>

      {/* Diálogo para editar rol */}
      <Dialog open={editRoleDialog} onClose={() => setEditRoleDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Editar Rol</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Nombre del Rol"
            value={editingRole.name}
            onChange={(e) => setEditingRole({ ...editingRole, name: e.target.value })}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Descripción"
            value={editingRole.description}
            onChange={(e) => setEditingRole({ ...editingRole, description: e.target.value })}
            margin="normal"
            multiline
            rows={3}
          />
          <TextField
            fullWidth
            label="Nivel"
            type="number"
            value={editingRole.level}
            onChange={(e) => setEditingRole({ ...editingRole, level: parseInt(e.target.value) })}
            margin="normal"
            required
            inputProps={{ min: 1, max: 10 }}
          />
          <FormControlLabel
            control={
              <Switch
                checked={editingRole.is_active}
                onChange={(e) => setEditingRole({ ...editingRole, is_active: e.target.checked })}
              />
            }
            label="Rol Activo"
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditRoleDialog(false)}>Cancelar</Button>
          <Button onClick={handleUpdateRole} variant="contained">Actualizar</Button>
        </DialogActions>
      </Dialog>

      {/* Diálogo para eliminar rol */}
      <Dialog open={deleteRoleDialog} onClose={() => setDeleteRoleDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Confirmar Eliminación</DialogTitle>
        <DialogContent>
          <Typography>
            ¿Estás seguro de que quieres eliminar el rol "{editingRole.name}"?
          </Typography>
          <Typography variant="body2" color="error" sx={{ mt: 1 }}>
            Esta acción no se puede deshacer.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteRoleDialog(false)}>Cancelar</Button>
          <Button onClick={handleDeleteRole} variant="contained" color="error">Eliminar</Button>
        </DialogActions>
      </Dialog>

      {/* Diálogo para editar permisos */}
      <Dialog open={editPermissionsDialog} onClose={() => setEditPermissionsDialog(false)} maxWidth="lg" fullWidth>
        <DialogTitle>Editar Permisos - {editingRole.name}</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
            Configura los permisos para cada módulo del sistema
          </Typography>
          
          {editingPermissions.map((permission) => (
            <Card key={permission.module} sx={{ mb: 2 }}>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                  {permission.module}
                </Typography>
                <Grid container spacing={2}>
                  {Object.entries(permission)
                    .filter(([key, value]) => key.startsWith('can_'))
                    .map(([key, value]) => (
                      <Grid item xs={6} sm={4} key={key}>
                        <PermissionSwitch
                          control={
                            <Switch
                              checked={value}
                              onChange={(e) => handlePermissionChange(permission.module, key, e.target.checked)}
                              color={getPermissionColor(key)}
                            />
                          }
                          label={
                            <Box display="flex" alignItems="center" gap={1}>
                              {getPermissionIcon(key)}
                              {getPermissionLabel(key)}
                            </Box>
                          }
                        />
                      </Grid>
                    ))}
                </Grid>
              </CardContent>
            </Card>
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditPermissionsDialog(false)}>Cancelar</Button>
          <Button onClick={handleUpdatePermissions} variant="contained">Guardar Permisos</Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar para notificaciones */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </StyledContainer>
  );
};

export default RoleManagementForm;
