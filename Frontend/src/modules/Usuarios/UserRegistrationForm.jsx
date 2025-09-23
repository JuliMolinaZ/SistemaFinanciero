import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Typography,
  TextField,
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
  Divider,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  Badge,
  Fade,
  Zoom
} from '@mui/material';
import {
  PersonAdd,
  AdminPanelSettings,
  Refresh,
  CheckCircle,
  Warning,
  Email,
  Security,
  Group,
  TrendingUp,
  Schedule,
  Delete,
  Send,
  Visibility,
  Edit,
  MoreVert,
  Person,
  Business,
  Assignment,
  Star,
  Diamond,
  Rocket,
  CheckCircleOutline,
  ErrorOutline,
  Info
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { motion, AnimatePresence } from 'framer-motion';

// Componentes estilizados
const StyledPaper = styled(Card)(({ theme }) => ({
  background: 'rgba(255, 255, 255, 0.95)',
  backdropFilter: 'blur(20px)',
  borderRadius: 16,
  boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
  border: '1px solid rgba(255,255,255,0.3)',
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: -50,
    right: -50,
    width: 100,
    height: 100,
    background: 'rgba(102, 126, 234, 0.1)',
    borderRadius: '50%',
    filter: 'blur(20px)'
  }
}));

const StyledCard = styled(Card)(({ theme, color }) => ({
  background: `linear-gradient(135deg, ${color}15, ${color}05)`,
  border: `2px solid ${color}30`,
  borderRadius: 16,
  padding: theme.spacing(3),
  textAlign: 'center',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  cursor: 'pointer',
  position: 'relative',
  overflow: 'hidden',
  '&:hover': {
    transform: 'translateY(-8px) scale(1.02)',
    boxShadow: `0 20px 40px ${color}20`,
    borderColor: color,
    '& .icon': {
      transform: 'scale(1.2) rotate(5deg)',
    }
  },
  '& .icon': {
    color: color,
    fontSize: '2.5rem',
    marginBottom: theme.spacing(2),
    transition: 'all 0.3s ease',
    filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.1))'
  },
  '& .number': {
    fontSize: '2rem',
    fontWeight: 800,
    color: color,
    marginBottom: theme.spacing(1),
    textShadow: '0 2px 4px rgba(0,0,0,0.1)'
  },
  '& .label': {
    fontSize: '0.875rem',
    fontWeight: 600,
    color: '#666',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  }
}));

const StyledButton = styled(Button)(({ theme, variant }) => ({
  borderRadius: 12,
  padding: theme.spacing(1.5, 3),
  fontWeight: 700,
  textTransform: 'none',
  fontSize: '1rem',
  boxShadow: variant === 'contained' ? '0 8px 25px rgba(0,0,0,0.15)' : 'none',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: variant === 'contained' ? '0 12px 35px rgba(0,0,0,0.2)' : 'none',
  }
}));

const UserRegistrationForm = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  // Estados principales
  const [formData, setFormData] = useState({
    email: '',
    role_id: ''
  });
  const [roles, setRoles] = useState([]);
  const [pendingUsers, setPendingUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [rolesLoading, setRolesLoading] = useState(false);
  const [pendingUsersLoading, setPendingUsersLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [activeStep, setActiveStep] = useState(0);
  const [selectedUser, setSelectedUser] = useState(null);
  const [viewDialog, setViewDialog] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState(false);

  // Obtener roles disponibles
  const fetchRoles = async () => {
    setRolesLoading(true);
    try {
      const response = await axios.get('/api/roles/public/list');
      
      if (response.data && response.data.data) {
        setRoles(response.data.data);
      } else {
        setRoles([]);
      }
      
    } catch (error) {
      console.error('Error al cargar roles:', error);
      setSnackbar({
        open: true,
        message: 'Error al cargar roles disponibles',
        severity: 'error'
      });
    } finally {
      setRolesLoading(false);
    }
  };

  const fetchPendingUsers = async () => {
    setPendingUsersLoading(true);
    try {
      const response = await axios.get('/api/user-registration/pending-profiles');
      if (response.data.success) {
        setPendingUsers(response.data.data);
      } else {
        throw new Error('Respuesta de API no exitosa');
      }
    } catch (error) {
      console.error('Error al cargar usuarios pendientes:', error);
      setSnackbar({
        open: true,
        message: 'Error al cargar usuarios pendientes',
        severity: 'error'
      });
    } finally {
      setPendingUsersLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    
    try {
      const response = await axios.post('/api/user-registration/register', formData);
      
      if (response.data.success) {
        setSnackbar({
          open: true,
          message: 'Usuario registrado exitosamente. Se enviará un email de invitación.',
          severity: 'success'
        });
        
        // Limpiar formulario
        setFormData({
          email: '',
          role_id: ''
        });
        
        // Actualizar lista de usuarios pendientes
        fetchPendingUsers();
      }
    } catch (error) {
      console.error('Error al registrar usuario:', error);
      const errorMessage = error.response?.data?.message || 'Error al registrar usuario';
      setSnackbar({
        open: true,
        message: errorMessage,
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  // Enviar email de invitación
  const handleSendInvitation = async (userId) => {
    try {
      const response = await axios.post(`/api/user-registration/send-invitation/${userId}`);
      
      if (response.data.success) {
        setSnackbar({
          open: true,
          message: 'Email de invitación enviado exitosamente',
          severity: 'success'
        });
      }
    } catch (error) {
      console.error('Error al enviar invitación:', error);
      setSnackbar({
        open: true,
        message: 'Error al enviar email de invitación',
        severity: 'error'
      });
    }
  };

  // Eliminar usuario pendiente
  const handleDeleteUser = async (userId) => {
      try {
      const response = await axios.delete(`/api/user-registration/delete-user/${userId}`);
        
        if (response.data.success) {
          setSnackbar({
            open: true,
          message: 'Usuario eliminado exitosamente',
            severity: 'success'
        });
          fetchPendingUsers();
        }
      } catch (error) {
      console.error('Error al eliminar usuario:', error);
        setSnackbar({
          open: true,
        message: 'Error al eliminar usuario',
          severity: 'error'
        });
    } finally {
      setDeleteDialog(false);
      setSelectedUser(null);
    }
  };

  const handleViewUser = (user) => {
    setSelectedUser(user);
    setViewDialog(true);
  };

  const handleDeleteClick = (user) => {
    setSelectedUser(user);
    setDeleteDialog(true);
  };

  useEffect(() => {
    fetchRoles();
    fetchPendingUsers();
  }, []);

  // Estadísticas
  const stats = [
    { icon: <PersonAdd />, number: pendingUsers.length || 0, label: 'Pendientes', color: '#f39c12' },
    { icon: <Group />, number: roles.length || 0, label: 'Roles Disponibles', color: '#667eea' },
    { icon: <TrendingUp />, number: '3', label: 'Nuevos Este Mes', color: '#27ae60' },
    { icon: <Schedule />, number: '24h', label: 'Tiempo Promedio', color: '#9b59b6' }
  ];

  const steps = [
    'Información Básica',
    'Asignar Rol',
    'Confirmar Registro'
  ];

  return (
    <Box>
      {/* Header con estadísticas */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
      <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Typography variant="h4" component="h1" gutterBottom sx={{ 
            fontWeight: 700,
            color: '#2c3e50',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 2
          }}>
            <PersonAdd sx={{ fontSize: '2rem', color: '#27ae60' }} />
            Registro de Usuarios
        </Typography>
          <Typography variant="h6" sx={{ 
            color: '#7f8c8d', 
            mb: 4,
            fontWeight: 500
          }}>
          Sistema de registro inteligente para Super Administradores
        </Typography>
        
        {/* Estadísticas rápidas */}
        <Grid container spacing={2} justifyContent="center">
          {stats.map((stat, index) => (
            <Grid item key={index}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <StyledCard color={stat.color}>
                <Box className="icon">{stat.icon}</Box>
                <Typography className="number">{stat.number}</Typography>
                <Typography className="label">{stat.label}</Typography>
                  </StyledCard>
                </motion.div>
            </Grid>
          ))}
        </Grid>
      </Box>
      </motion.div>

      <Grid container spacing={4}>
        {/* Formulario de Registro */}
        <Grid item xs={12} lg={6}>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
          <StyledPaper elevation={0}>
              <CardContent sx={{ p: 4 }}>
            <Box display="flex" alignItems="center" gap={3} mb={4}>
              <Box sx={{ 
                p: 2.5, 
                borderRadius: '20px', 
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white'
              }}>
                <PersonAdd sx={{ fontSize: 40 }} />
              </Box>
              <Box>
                    <Typography variant="h4" component="h2" fontWeight={700} sx={{ color: '#2c3e50' }}>
                  Registrar Nuevo Usuario
                </Typography>
                    <Typography variant="body1" sx={{ color: '#7f8c8d', mt: 1 }}>
                  Crea cuentas de usuario con roles específicos
                </Typography>
              </Box>
            </Box>

              {/* Stepper */}
              <Stepper activeStep={activeStep} orientation="vertical" sx={{ mb: 4 }}>
                {steps.map((label, index) => (
                  <Step key={label}>
                    <StepLabel
                      StepIconComponent={({ active, completed }) => (
                        <Box
                          sx={{
                            width: 32,
                            height: 32,
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            background: completed 
                              ? 'linear-gradient(135deg, #27ae60, #2ecc71)'
                              : active 
                                ? 'linear-gradient(135deg, #667eea, #764ba2)'
                                : '#e0e0e0',
                            color: 'white',
                            fontWeight: 'bold'
                          }}
                        >
                          {completed ? <CheckCircle /> : index + 1}
                        </Box>
                      )}
                    >
                      {label}
                    </StepLabel>
                    <StepContent>
                      <Box sx={{ mb: 2 }}>
                        {index === 0 && (
                          <TextField
                fullWidth
                label="Email del Usuario"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                            type="email"
                required
                            sx={{ mb: 2 }}
                InputProps={{
                              startAdornment: <Email sx={{ mr: 1, color: '#667eea' }} />
                            }}
                          />
                        )}
                        {index === 1 && (
                          <FormControl fullWidth sx={{ mb: 2 }}>
                            <InputLabel>Seleccionar Rol</InputLabel>
                            <Select
                  name="role_id"
                  value={formData.role_id}
                  onChange={handleInputChange}
                              label="Seleccionar Rol"
                  disabled={rolesLoading}
                            >
                              {roles.map((role) => (
                      <MenuItem key={role.id} value={role.id}>
                                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Security sx={{ fontSize: '1rem', color: '#667eea' }} />
                                    {role.name}
                          </Box>
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        )}
                        {index === 2 && (
                          <Box sx={{ p: 2, background: '#f8f9fa', borderRadius: 2, mb: 2 }}>
                            <Typography variant="h6" gutterBottom>
                              Resumen del Registro
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                              <strong>Email:</strong> {formData.email}
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                              <strong>Rol:</strong> {roles.find(r => r.id == formData.role_id)?.name || 'No seleccionado'}
                              </Typography>
                          </Box>
                        )}
                        </Box>
                      <Box>
                        <StyledButton
                variant="contained"
                          onClick={() => {
                            if (activeStep === steps.length - 1) {
                              handleSubmit();
                            } else {
                              setActiveStep((prevActiveStep) => prevActiveStep + 1);
                            }
                          }}
                          disabled={loading || (activeStep === 0 && !formData.email) || (activeStep === 1 && !formData.role_id)}
                          sx={{
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            mr: 1
                          }}
                        >
                          {loading ? <CircularProgress size={20} color="inherit" /> : 
                           activeStep === steps.length - 1 ? 'Registrar Usuario' : 'Continuar'}
                        </StyledButton>
                        {activeStep > 0 && (
                          <StyledButton
                            onClick={() => setActiveStep((prevActiveStep) => prevActiveStep - 1)}
                            sx={{ color: '#7f8c8d' }}
                          >
                            Atrás
                          </StyledButton>
                        )}
            </Box>
                    </StepContent>
                  </Step>
                ))}
              </Stepper>
              </CardContent>
          </StyledPaper>
          </motion.div>
        </Grid>

        {/* Lista de Usuarios Pendientes */}
        <Grid item xs={12} lg={6}>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <StyledPaper elevation={0}>
            <CardContent sx={{ p: 4 }}>
                <Box display="flex" alignItems="center" gap={3} mb={4}>
                  <Box sx={{ 
                    p: 2.5, 
                    borderRadius: '20px', 
                    background: 'linear-gradient(135deg, #f39c12 0%, #e67e22 100%)',
                    color: 'white'
                  }}>
                    <Group sx={{ fontSize: 40 }} />
                  </Box>
                <Box>
                    <Typography variant="h4" component="h2" fontWeight={700} sx={{ color: '#2c3e50' }}>
                      Usuarios Pendientes
                  </Typography>
                    <Typography variant="body1" sx={{ color: '#7f8c8d', mt: 1 }}>
                      Gestiona usuarios que necesitan completar su perfil
                  </Typography>
                </Box>
              </Box>

              {pendingUsersLoading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                  <CircularProgress />
                </Box>
              ) : pendingUsers.length === 0 ? (
                <Box sx={{ textAlign: 'center', p: 4 }}>
                  <CheckCircleOutline sx={{ fontSize: 64, color: '#27ae60', mb: 2 }} />
                  <Typography variant="h6" color="textSecondary">
                    No hay usuarios pendientes
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Todos los usuarios han completado su perfil
                  </Typography>
                </Box>
              ) : (
                <List>
                  <AnimatePresence>
                  {pendingUsers.map((user, index) => (
                      <motion.div
                        key={user.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <ListItem
                          sx={{
                            background: 'rgba(255,255,255,0.7)',
                            borderRadius: 2,
                            mb: 1,
                            border: '1px solid rgba(0,0,0,0.1)',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              background: 'rgba(102, 126, 234, 0.05)',
                              transform: 'translateX(4px)'
                            }
                          }}
                        >
                          <ListItemAvatar>
                            <Badge
                              overlap="circular"
                              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                              badgeContent={
                                <Box
                                  sx={{
                                    width: 12,
                                    height: 12,
                                    borderRadius: '50%',
                                    background: '#f39c12',
                                    border: '2px solid white'
                                  }}
                                />
                              }
                            >
                              <Avatar sx={{ background: 'linear-gradient(135deg, #667eea, #764ba2)' }}>
                                {user.email?.charAt(0)?.toUpperCase()}
                              </Avatar>
                            </Badge>
                          </ListItemAvatar>
                          <ListItemText
                            primary={
                              <Typography variant="subtitle1" fontWeight={600}>
                                {user.email}
                              </Typography>
                            }
                            secondary={
                              <Box>
                                <Typography variant="body2" color="textSecondary">
                                  Rol: {user.roles?.name || 'Sin rol'}
                                </Typography>
                                <Typography variant="caption" color="textSecondary">
                                  Registrado: {new Date(user.created_at).toLocaleDateString()}
                              </Typography>
                            </Box>
                            }
                          />
                          <ListItemSecondaryAction>
                            <Box sx={{ display: 'flex', gap: 1 }}>
                              <Tooltip title="Ver detalles">
                                <IconButton
                                  onClick={() => handleViewUser(user)}
                                  sx={{ color: '#45b7d1' }}
                                >
                                  <Visibility />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Enviar invitación">
                                <IconButton
                                onClick={() => handleSendInvitation(user.id)}
                                  sx={{ color: '#27ae60' }}
                                >
                                  <Send />
                                </IconButton>
                            </Tooltip>
                              <Tooltip title="Eliminar">
                                <IconButton
                                  onClick={() => handleDeleteClick(user)}
                                  sx={{ color: '#e74c3c' }}
                                >
                                  <Delete />
                                </IconButton>
                            </Tooltip>
                          </Box>
                          </ListItemSecondaryAction>
                        </ListItem>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </List>
              )}
            </CardContent>
            </StyledPaper>
          </motion.div>
        </Grid>
      </Grid>

      {/* Diálogo de detalles del usuario */}
      <Dialog 
        open={viewDialog} 
        onClose={() => setViewDialog(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            background: 'rgba(255,255,255,0.95)',
            backdropFilter: 'blur(20px)',
            boxShadow: '0 20px 60px rgba(0,0,0,0.15)'
          }
        }}
      >
        <DialogTitle sx={{ 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          textAlign: 'center',
          py: 3
        }}>
          <Diamond sx={{ fontSize: 40, mb: 1 }} />
          <Typography variant="h5" fontWeight={700}>
            Detalles del Usuario
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          {selectedUser && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <Box sx={{ textAlign: 'center' }}>
                  <Avatar
                    sx={{ 
                      width: 100, 
                      height: 100, 
                      mx: 'auto', 
                      mb: 2,
                      background: 'linear-gradient(135deg, #667eea, #764ba2)',
                      fontSize: '2rem'
                    }}
                  >
                    {selectedUser.email?.charAt(0)?.toUpperCase()}
                  </Avatar>
                  <Typography variant="h6" fontWeight={600}>
                    {selectedUser.email}
                  </Typography>
                  <Chip
                    label={selectedUser.roles?.name || 'Sin rol'}
                    color="primary"
                    sx={{ mt: 1 }}
                  />
                </Box>
              </Grid>
              <Grid item xs={12} md={8}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Box>
                    <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                      Estado del Perfil
                    </Typography>
                    <Chip
                      label={selectedUser.profile_complete ? 'Completado' : 'Pendiente'}
                      color={selectedUser.profile_complete ? 'success' : 'warning'}
                      icon={selectedUser.profile_complete ? <CheckCircle /> : <Warning />}
                    />
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                      Fecha de Registro
                    </Typography>
                    <Typography variant="body1">
                      {new Date(selectedUser.created_at).toLocaleString()}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                      Descripción del Rol
                    </Typography>
                    <Typography variant="body1">
                      {selectedUser.roles?.description || 'Sin descripción'}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <StyledButton
            onClick={() => setViewDialog(false)}
            sx={{ color: '#7f8c8d' }}
          >
            Cerrar
          </StyledButton>
          <StyledButton
            variant="contained"
            onClick={() => {
              handleSendInvitation(selectedUser?.id);
              setViewDialog(false);
            }}
            sx={{
              background: 'linear-gradient(135deg, #27ae60, #2ecc71)'
            }}
          >
            Enviar Invitación
          </StyledButton>
        </DialogActions>
      </Dialog>

      {/* Diálogo de confirmación de eliminación */}
      <Dialog 
        open={deleteDialog} 
        onClose={() => setDeleteDialog(false)}
        PaperProps={{
          sx: {
            borderRadius: 3,
            background: 'rgba(255,255,255,0.95)',
            backdropFilter: 'blur(20px)',
            boxShadow: '0 20px 60px rgba(0,0,0,0.15)'
          }
        }}
      >
        <DialogTitle sx={{ textAlign: 'center', py: 3 }}>
          <ErrorOutline sx={{ fontSize: 64, color: '#e74c3c', mb: 2 }} />
          <Typography variant="h5" fontWeight={700}>
            Confirmar Eliminación
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ textAlign: 'center', pb: 2 }}>
          <Typography variant="body1" sx={{ mb: 2 }}>
            ¿Estás seguro de que quieres eliminar al usuario <strong>{selectedUser?.email}</strong>?
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Esta acción no se puede deshacer.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 3, justifyContent: 'center', gap: 2 }}>
          <StyledButton
            onClick={() => setDeleteDialog(false)}
            sx={{ color: '#7f8c8d' }}
          >
            Cancelar
          </StyledButton>
          <StyledButton
            variant="contained"
            onClick={() => handleDeleteUser(selectedUser?.id)}
            sx={{
              background: 'linear-gradient(135deg, #e74c3c, #c0392b)'
            }}
          >
            Eliminar
          </StyledButton>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ borderRadius: 2 }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default UserRegistrationForm;