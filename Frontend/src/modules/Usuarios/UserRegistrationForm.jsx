import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Container,
  Paper,
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
  useMediaQuery
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
  Delete
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import CoolAvatar from '../../components/CoolAvatar';

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

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: 12,
    background: 'rgba(255,255,255,0.9)',
    backdropFilter: 'blur(10px)',
    border: '2px solid rgba(255,255,255,0.3)',
    transition: 'all 0.3s ease',
    '&:hover': {
      borderColor: 'rgba(255,255,255,0.5)',
      background: 'rgba(255,255,255,0.95)'
    },
    '&.Mui-focused': {
      borderColor: '#fff',
      boxShadow: '0 0 0 3px rgba(255,255,255,0.2)'
    }
  },
  '& .MuiInputLabel-root': {
    color: 'rgba(255,255,255,0.9)',
    fontWeight: 600
  },
  '& .MuiInputBase-input': {
    color: '#1a1a1a',
    fontWeight: 500
  }
}));

const StyledSelect = styled(Select)(({ theme }) => ({
  borderRadius: 12,
  background: 'rgba(255,255,255,0.9)',
  backdropFilter: 'blur(10px)',
  border: '2px solid rgba(255,255,255,0.3)',
  transition: 'all 0.3s ease',
  '&:hover': {
    borderColor: 'rgba(255,255,255,0.5)',
    background: 'rgba(255,255,255,0.95)'
  },
  '&.Mui-focused': {
    borderColor: '#fff',
    boxShadow: '0 0 0 3px rgba(255,255,255,0.2)'
  },
  '& .MuiSelect-select': {
    color: '#1a1a1a',
    fontWeight: 600
  }
}));

const UserCard = styled(Box)(({ theme }) => ({
  background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
  border: '2px solid rgba(0,0,0,0.05)',
  borderRadius: 16,
  padding: theme.spacing(3),
  marginBottom: theme.spacing(2),
  transition: 'all 0.3s ease',
  position: 'relative',
  overflow: 'hidden',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 12px 40px rgba(0,0,0,0.1)',
    borderColor: 'rgba(0,0,0,0.1)'
  },
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 4,
    background: 'linear-gradient(90deg, #f39c12, #e67e22)'
  }
}));

const StatsCard = styled(Box)(({ theme, color }) => ({
  background: `linear-gradient(135deg, ${color}15 0%, ${color}25 100%)`,
  border: `2px solid ${color}30`,
  borderRadius: 16,
  padding: theme.spacing(2),
  textAlign: 'center',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-4px) scale(1.02)',
    boxShadow: `0 12px 30px ${color}20`,
    borderColor: `${color}50`
  },
  '& .icon': {
    fontSize: '2rem',
    color: color,
    marginBottom: theme.spacing(1),
    filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'
  },
  '& .number': {
    fontSize: '1.5rem',
    fontWeight: 700,
    color: color,
    marginBottom: theme.spacing(0.5)
  },
  '& .label': {
    fontSize: '0.875rem',
    fontWeight: 600,
    color: '#64748b',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  }
}));

const UserRegistrationForm = () => {
  
  
  const [formData, setFormData] = useState({
    email: '',
    role_id: ''
  });
  
  const [roles, setRoles] = useState([]);
  const [pendingUsers, setPendingUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [rolesLoading, setRolesLoading] = useState(true);
  const [pendingUsersLoading, setPendingUsersLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Cargar roles disponibles
  useEffect(() => {
    fetchRoles();
  }, []);

  // Cargar usuarios pendientes
  useEffect(() => {
    fetchPendingUsers();
  }, []);

  const fetchRoles = async () => {
    setRolesLoading(true);
    try {
      const response = await axios.get(`${API_URL}/api/roles/public/list`);
      if (response.data.success) {
        setRoles(response.data.data);
      } else {
        throw new Error('Respuesta de API no exitosa');
      }
    } catch (error) {
      console.error('Error al cargar roles:', error);
      setSnackbar({
        open: true,
        message: 'Error al cargar roles del sistema. Verifica que el backend esté funcionando.',
        severity: 'error'
      });
    } finally {
      setRolesLoading(false);
    }
  };

  const fetchPendingUsers = async () => {
    setPendingUsersLoading(true);
    try {
      const response = await axios.get(`${API_URL}/api/user-registration/pending-profiles`);
      if (response.data.success) {
        setPendingUsers(response.data.data);
      } else {
        throw new Error('Respuesta de API no exitosa');
      }
    } catch (error) {
      console.error('Error al cargar usuarios pendientes:', error);
      setSnackbar({
        open: true,
        message: 'Error al cargar usuarios pendientes. Verifica que el backend esté funcionando.',
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
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await axios.post(`${API_URL}/api/user-registration/register`, formData);
      
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
      const response = await axios.post(`${API_URL}/api/user-registration/send-invitation/${userId}`);
      
      if (response.data.success) {
        setSnackbar({
          open: true,
          message: `Email de invitación enviado exitosamente a ${response.data.data.email}`,
          severity: 'success'
        });
        
        // Mostrar información del enlace de acceso
        
      }
    } catch (error) {
      console.error('Error al enviar invitación:', error);
      const errorMessage = error.response?.data?.message || 'Error al enviar email de invitación';
      setSnackbar({
        open: true,
        message: errorMessage,
        severity: 'error'
      });
    }
  };

  // Eliminar usuario invitado
  const handleDeleteUser = async (userId, userEmail) => {
    if (window.confirm(`¿Estás seguro de que quieres eliminar al usuario ${userEmail}? Esta acción no se puede deshacer.`)) {
      try {
        const response = await axios.delete(`${API_URL}/api/user-registration/delete-user/${userId}`);
        
        if (response.data.success) {
          setSnackbar({
            open: true,
            message: `Usuario ${userEmail} eliminado exitosamente`,
            severity: 'success'
        });
          
          // Actualizar lista de usuarios pendientes
          fetchPendingUsers();
        }
      } catch (error) {
        const errorMessage = error.response?.data?.message || 'Error al eliminar usuario';
        setSnackbar({
          open: true,
          message: errorMessage,
          severity: 'error'
        });
      }
    }
  };

  // Mock data para estadísticas (en producción vendría de la API)
  const stats = [
    { icon: <PersonAdd />, number: pendingUsers.length || 0, label: 'Pendientes', color: '#f39c12' },
    { icon: <Group />, number: roles.length || 0, label: 'Roles Disponibles', color: '#667eea' },
    { icon: <TrendingUp />, number: '3', label: 'Nuevos Este Mes', color: '#27ae60' },
    { icon: <Schedule />, number: '24h', label: 'Tiempo Promedio', color: '#9b59b6' }
  ];



  return (
    <StyledContainer maxWidth="xl">
      {/* Header con estadísticas */}
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Typography variant="h3" component="h1" gutterBottom sx={{ 
          fontWeight: 800,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}>
          👤 Registro Avanzado de Usuarios
        </Typography>
        <Typography variant="h6" color="textSecondary" sx={{ mb: 4 }}>
          Sistema de registro inteligente para Super Administradores
        </Typography>
        
        {/* Estadísticas rápidas */}
        <Grid container spacing={2} justifyContent="center">
          {stats.map((stat, index) => (
            <Grid item key={index}>
              <StatsCard color={stat.color}>
                <Box className="icon">{stat.icon}</Box>
                <Typography className="number">{stat.number}</Typography>
                <Typography className="label">{stat.label}</Typography>
              </StatsCard>
            </Grid>
          ))}
        </Grid>
      </Box>

      <Grid container spacing={4}>
        {/* Formulario de Registro */}
        <Grid item xs={12} lg={5}>
          <StyledPaper elevation={0}>
            <Box display="flex" alignItems="center" gap={3} mb={4}>
              <Box sx={{ 
                p: 2.5, 
                borderRadius: '20px', 
                background: 'rgba(255,255,255,0.2)',
                backdropFilter: 'blur(10px)'
              }}>
                <PersonAdd sx={{ fontSize: 40 }} />
              </Box>
              <Box>
                <Typography variant="h4" component="h2" fontWeight={700}>
                  Registrar Nuevo Usuario
                </Typography>
                <Typography variant="body1" sx={{ opacity: 0.9, mt: 1 }}>
                  Crea cuentas de usuario con roles específicos
                </Typography>
              </Box>
            </Box>

            <form onSubmit={handleSubmit}>
              <StyledTextField
                fullWidth
                label="Email del Usuario"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                sx={{ mb: 4 }}
                InputProps={{
                  startAdornment: <Email sx={{ mr: 1.5, opacity: 0.7 }} />
                }}
                placeholder="usuario@empresa.com"
              />

              <FormControl fullWidth sx={{ mb: 4 }}>
                <InputLabel>Rol del Usuario</InputLabel>
                <StyledSelect
                  name="role_id"
                  value={formData.role_id}
                  onChange={handleInputChange}
                  required
                  disabled={rolesLoading}
                  startAdornment={<AdminPanelSettings sx={{ mr: 1.5, opacity: 0.7 }} />}
                >
                  {rolesLoading ? (
                    <MenuItem disabled>
                      <CircularProgress size={20} sx={{ mr: 1.5 }} />
                      Cargando roles disponibles...
                    </MenuItem>
                  ) : (
                    roles.map((role) => (
                      <MenuItem key={role.id} value={role.id}>
                        <Box display="flex" alignItems="center" gap={2}>
                          <Box sx={{ 
                            p: 0.5, 
                            borderRadius: '8px', 
                            background: `${role.level <= 2 ? '#f39c12' : '#667eea'}20`,
                            color: role.level <= 2 ? '#f39c12' : '#667eea'
                          }}>
                            {role.level <= 2 ? <Security /> : <Group />}
                          </Box>
                          <Box>
                            <Typography variant="body1" fontWeight={600}>
                              {role.name}
                            </Typography>
                            {role.description && (
                              <Typography variant="caption" sx={{ opacity: 0.7 }}>
                                {role.description}
                              </Typography>
                            )}
                          </Box>
                        </Box>
                      </MenuItem>
                    ))
                  )}
                </StyledSelect>
              </FormControl>

              <Button
                type="submit"
                variant="contained"
                fullWidth
                size="large"
                disabled={loading || !formData.email || !formData.role_id}
                sx={{
                  background: 'rgba(255, 255, 255, 0.2)',
                  backdropFilter: 'blur(10px)',
                  border: '2px solid rgba(255, 255, 255, 0.3)',
                  borderRadius: 3,
                  py: 2,
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  textTransform: 'none',
                  '&:hover': {
                    background: 'rgba(255, 255, 255, 0.3)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 25px rgba(0,0,0,0.2)'
                  },
                  '&:disabled': {
                    background: 'rgba(255, 255, 255, 0.1)',
                    color: 'rgba(255, 255, 255, 0.5)'
                  }
                }}
              >
                {loading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  <>
                    <PersonAdd sx={{ mr: 1.5 }} />
                    Registrar Usuario
                  </>
                )}
              </Button>
            </form>

            {/* Información adicional */}
            <Box sx={{ 
              mt: 4, 
              p: 3, 
              background: 'rgba(255,255,255,0.1)', 
              borderRadius: 2,
              backdropFilter: 'blur(10px)'
            }}>
              <Typography variant="body2" sx={{ opacity: 0.9, textAlign: 'center' }}>
                💡 El usuario recibirá un email de invitación para completar su perfil
              </Typography>
            </Box>
          </StyledPaper>
        </Grid>

        {/* Lista de Usuarios Pendientes */}
        <Grid item xs={12} lg={7}>
          <StyledCard>
            <CardContent sx={{ p: 4 }}>
              <Box display="flex" alignItems="center" justifyContent="space-between" mb={4}>
                <Box>
                  <Typography variant="h5" component="h3" fontWeight={700} color="#1e293b">
                    Usuarios Pendientes de Completar Perfil
                  </Typography>
                  <Typography variant="body1" color="#64748b">
                    Usuarios registrados que aún no han completado su información
                  </Typography>
                </Box>
                <Tooltip title="Actualizar lista">
                  <IconButton 
                    onClick={fetchPendingUsers} 
                    disabled={pendingUsersLoading}
                    sx={{ 
                      background: '#667eea15', 
                      color: '#667eea',
                      '&:hover': { background: '#667eea25' }
                    }}
                  >
                    <Refresh />
                  </IconButton>
                </Tooltip>
              </Box>

              {pendingUsersLoading ? (
                <Box display="flex" justifyContent="center" py={6}>
                  <CircularProgress size={48} />
                </Box>
              ) : pendingUsers.length === 0 ? (
                <Box textAlign="center" py={6}>
                  <CheckCircle sx={{ fontSize: 64, color: 'success.main', mb: 2 }} />
                  <Typography variant="h6" color="textSecondary" gutterBottom>
                    ¡Excelente! No hay usuarios pendientes
                  </Typography>
                  <Typography variant="body1" color="textSecondary">
                    Todos los usuarios han completado su perfil correctamente
                  </Typography>
                </Box>
              ) : (
                <Box>
                  {pendingUsers.map((user, index) => (
                    <UserCard key={user.id}>
                      <Box display="flex" alignItems="center" justifyContent="space-between">
                        <Box sx={{ flex: 1 }}>
                          <Box display="flex" alignItems="center" gap={2} mb={2}>
                            <CoolAvatar 
                              user={user}
                              size={48}
                              variant="auto"
                              showTooltip={true}
                            />
                            <Box>
                              <Typography variant="h6" fontWeight={600} color="#1e293b">
                                {user.email}
                              </Typography>
                              <Typography variant="body2" color="#64748b">
                                Rol: {user.roles?.name || user.role || 'Sin rol asignado'}
                              </Typography>
                            </Box>
                          </Box>
                          
                          <Box display="flex" alignItems="center" gap={2}>
                            <Chip 
                              label="Pendiente de Perfil" 
                              color="warning" 
                              size="small"
                              icon={<Warning />}
                              sx={{ fontWeight: 600 }}
                            />
                            <Typography variant="caption" color="#64748b">
                              Registrado: {new Date(user.created_at).toLocaleDateString('es-ES', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })}
                            </Typography>
                          </Box>
                          
                          {/* Botones de acción */}
                          <Box display="flex" gap={1} mt={2}>
                            <Tooltip title="Enviar email de invitación">
                              <Button
                                size="small"
                                variant="outlined"
                                color="primary"
                                startIcon={<Email />}
                                onClick={() => handleSendInvitation(user.id)}
                                sx={{ 
                                  borderRadius: 2,
                                  textTransform: 'none',
                                  fontSize: '0.75rem'
                                }}
                              >
                                Enviar Invitación
                              </Button>
                            </Tooltip>
                            
                            <Tooltip title="Eliminar usuario invitado">
                              <Button
                                size="small"
                                variant="outlined"
                                color="error"
                                startIcon={<Delete />}
                                onClick={() => handleDeleteUser(user.id, user.email)}
                                sx={{ 
                                  borderRadius: 2,
                                  textTransform: 'none',
                                  fontSize: '0.75rem'
                                }}
                              >
                                Eliminar
                              </Button>
                            </Tooltip>
                          </Box>
                        </Box>
                      </Box>
                    </UserCard>
                  ))}
                </Box>
              )}
            </CardContent>
          </StyledCard>
        </Grid>
      </Grid>

      {/* Snackbar para notificaciones */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </StyledContainer>
  );
};

export default UserRegistrationForm;
