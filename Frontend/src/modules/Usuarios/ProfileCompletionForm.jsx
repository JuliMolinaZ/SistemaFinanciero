import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Avatar,
  IconButton,
  useTheme,
  useMediaQuery,
  Stepper,
  Step,
  StepLabel,
  Divider,
  Card,
  CardContent,
  Chip,
  Fade,
  Zoom
} from '@mui/material';
import {
  Person,
  Email,
  Phone,
  Business,
  Assignment,
  CalendarToday,
  PhotoCamera,
  CheckCircle,
  Warning,
  Security,
  Diamond,
  Rocket,
  Star,
  Info
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { motion, AnimatePresence } from 'framer-motion';

// Componentes estilizados
const StyledContainer = styled(Container)(({ theme }) => ({
  padding: theme.spacing(3),
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
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  background: 'rgba(255, 255, 255, 0.95)',
  backdropFilter: 'blur(20px)',
  borderRadius: 24,
  boxShadow: '0 20px 60px rgba(0,0,0,0.1), 0 8px 25px rgba(0,0,0,0.05)',
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

const StyledButton = styled(Button)(({ theme }) => ({
  borderRadius: 12,
  padding: theme.spacing(1.5, 3),
  fontWeight: 700,
  textTransform: 'none',
  fontSize: '1rem',
  boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 12px 35px rgba(0,0,0,0.2)',
  }
}));

const ProfileCompletionForm = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Estados principales
  const [formData, setFormData] = useState({
    name: '',
    password: '',
    confirmPassword: '',
    phone: '',
    department: '',
    position: '',
    hire_date: '',
    firebase_uid: ''
  });
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(true);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [activeStep, setActiveStep] = useState(0);
  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);

  // Verificar token al cargar
  useEffect(() => {
    verifyToken();
  }, [token]);

  const verifyToken = async () => {
    try {
      const response = await axios.get(`/api/user-registration/verify-token/${token}`);
      
      if (response.data.success) {
        setUserInfo(response.data.data);
        setFormData(prev => ({
          ...prev,
          firebase_uid: response.data.data.firebase_uid || ''
        }));
      } else {
        setSnackbar({
          open: true,
          message: 'Token inválido o expirado',
          severity: 'error'
        });
        setTimeout(() => navigate('/'), 3000);
      }
    } catch (error) {
      console.error('Error verificando token:', error);
      setSnackbar({
        open: true,
        message: 'Error al verificar el token de acceso',
        severity: 'error'
      });
      setTimeout(() => navigate('/'), 3000);
    } finally {
      setVerifying(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatar(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setAvatarPreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validaciones
    if (formData.password !== formData.confirmPassword) {
      setSnackbar({
        open: true,
        message: 'Las contraseñas no coinciden',
        severity: 'error'
      });
      return;
    }

    if (formData.password.length < 6) {
      setSnackbar({
        open: true,
        message: 'La contraseña debe tener al menos 6 caracteres',
        severity: 'error'
      });
      return;
    }

    setLoading(true);
    
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('token', token);
      formDataToSend.append('name', formData.name);
      formDataToSend.append('password', formData.password);
      formDataToSend.append('phone', formData.phone);
      formDataToSend.append('department', formData.department);
      formDataToSend.append('position', formData.position);
      formDataToSend.append('hire_date', formData.hire_date);
      formDataToSend.append('firebase_uid', formData.firebase_uid);
      
      if (avatar) {
        formDataToSend.append('avatar', avatar);
      }

      const response = await axios.post('/api/user-registration/complete-profile', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      if (response.data.success) {
        setSnackbar({
          open: true,
          message: 'Perfil completado exitosamente. Redirigiendo al sistema...',
          severity: 'success'
        });
        
        setTimeout(() => {
          navigate('/');
        }, 2000);
      }
    } catch (error) {
      console.error('Error al completar perfil:', error);
      const errorMessage = error.response?.data?.message || 'Error al completar perfil';
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

  const steps = [
    'Información Personal',
    'Datos Profesionales',
    'Configuración de Seguridad',
    'Confirmar Perfil'
  ];

  if (verifying) {
    return (
      <StyledContainer maxWidth="sm">
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          justifyContent: 'center',
          minHeight: '100vh',
          textAlign: 'center'
        }}>
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <CircularProgress size={60} sx={{ color: 'white', mb: 3 }} />
            <Typography variant="h5" sx={{ color: 'white', fontWeight: 600 }}>
              Verificando acceso...
            </Typography>
            <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.8)', mt: 1 }}>
              Por favor espera mientras validamos tu invitación
            </Typography>
          </motion.div>
        </Box>
      </StyledContainer>
    );
  }

  if (!userInfo) {
    return (
      <StyledContainer maxWidth="sm">
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          justifyContent: 'center',
          minHeight: '100vh',
          textAlign: 'center'
        }}>
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Warning sx={{ fontSize: 80, color: '#e74c3c', mb: 3 }} />
            <Typography variant="h5" sx={{ color: 'white', fontWeight: 600 }}>
              Token Inválido
            </Typography>
            <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.8)', mt: 1 }}>
              El enlace de invitación no es válido o ha expirado
            </Typography>
          </motion.div>
        </Box>
      </StyledContainer>
    );
  }

  return (
    <StyledContainer maxWidth="md">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography variant="h3" component="h1" gutterBottom sx={{ 
            fontWeight: 800,
            background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            textShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            <Diamond sx={{ mr: 2, verticalAlign: 'middle', fontSize: '2.5rem' }} />
            ¡Bienvenido a RunSolutions!
          </Typography>
          <Typography variant="h6" sx={{ 
            color: 'rgba(255,255,255,0.9)', 
            mb: 4,
            fontWeight: 500
          }}>
            Completa tu perfil para acceder al sistema
          </Typography>
        </Box>

        <StyledPaper elevation={0}>
          {/* Información del usuario */}
          <Card sx={{ mb: 4, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
            <CardContent sx={{ textAlign: 'center', py: 3 }}>
              <Avatar
                sx={{ 
                  width: 80, 
                  height: 80, 
                  mx: 'auto', 
                  mb: 2,
                  background: 'rgba(255,255,255,0.2)',
                  fontSize: '2rem'
                }}
              >
                {userInfo.email?.charAt(0)?.toUpperCase()}
              </Avatar>
              <Typography variant="h5" fontWeight={600} gutterBottom>
                {userInfo.email}
              </Typography>
              <Chip
                label={userInfo.roles?.name || 'Sin rol'}
                sx={{ 
                  background: 'rgba(255,255,255,0.2)',
                  color: 'white',
                  fontWeight: 600
                }}
              />
            </CardContent>
          </Card>

          {/* Stepper */}
          <Stepper activeStep={activeStep} orientation={isMobile ? 'vertical' : 'horizontal'} sx={{ mb: 4 }}>
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
              </Step>
            ))}
          </Stepper>

          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              {/* Paso 1: Información Personal */}
              {activeStep === 0 && (
                <Grid item xs={12}>
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <Typography variant="h6" gutterBottom sx={{ color: '#2c3e50', fontWeight: 600 }}>
                      <Person sx={{ mr: 1, verticalAlign: 'middle' }} />
                      Información Personal
                    </Typography>
                    <Grid container spacing={3}>
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          label="Nombre Completo"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                          InputProps={{
                            startAdornment: <Person sx={{ mr: 1, color: '#667eea' }} />
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          label="Teléfono"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          InputProps={{
                            startAdornment: <Phone sx={{ mr: 1, color: '#667eea' }} />
                          }}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <Box sx={{ textAlign: 'center' }}>
                          <input
                            accept="image/*"
                            style={{ display: 'none' }}
                            id="avatar-upload"
                            type="file"
                            onChange={handleAvatarChange}
                          />
                          <label htmlFor="avatar-upload">
                            <IconButton
                              component="span"
                              sx={{
                                width: 120,
                                height: 120,
                                border: '3px dashed #667eea',
                                borderRadius: '50%',
                                '&:hover': {
                                  borderColor: '#5a6fd8',
                                  background: 'rgba(102, 126, 234, 0.05)'
                                }
                              }}
                            >
                              {avatarPreview ? (
                                <Avatar
                                  src={avatarPreview}
                                  sx={{ width: 100, height: 100 }}
                                />
                              ) : (
                                <PhotoCamera sx={{ fontSize: 40, color: '#667eea' }} />
                              )}
                            </IconButton>
                          </label>
                          <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                            Haz clic para subir una foto de perfil
                          </Typography>
                        </Box>
                      </Grid>
                    </Grid>
                  </motion.div>
                </Grid>
              )}

              {/* Paso 2: Datos Profesionales */}
              {activeStep === 1 && (
                <Grid item xs={12}>
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <Typography variant="h6" gutterBottom sx={{ color: '#2c3e50', fontWeight: 600 }}>
                      <Business sx={{ mr: 1, verticalAlign: 'middle' }} />
                      Datos Profesionales
                    </Typography>
                    <Grid container spacing={3}>
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          label="Departamento"
                          name="department"
                          value={formData.department}
                          onChange={handleInputChange}
                          InputProps={{
                            startAdornment: <Business sx={{ mr: 1, color: '#667eea' }} />
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          label="Posición/Cargo"
                          name="position"
                          value={formData.position}
                          onChange={handleInputChange}
                          InputProps={{
                            startAdornment: <Assignment sx={{ mr: 1, color: '#667eea' }} />
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          label="Fecha de Contratación"
                          name="hire_date"
                          type="date"
                          value={formData.hire_date}
                          onChange={handleInputChange}
                          InputLabelProps={{ shrink: true }}
                          InputProps={{
                            startAdornment: <CalendarToday sx={{ mr: 1, color: '#667eea' }} />
                          }}
                        />
                      </Grid>
                    </Grid>
                  </motion.div>
                </Grid>
              )}

              {/* Paso 3: Configuración de Seguridad */}
              {activeStep === 2 && (
                <Grid item xs={12}>
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <Typography variant="h6" gutterBottom sx={{ color: '#2c3e50', fontWeight: 600 }}>
                      <Security sx={{ mr: 1, verticalAlign: 'middle' }} />
                      Configuración de Seguridad
                    </Typography>
                    <Grid container spacing={3}>
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          label="Contraseña"
                          name="password"
                          type="password"
                          value={formData.password}
                          onChange={handleInputChange}
                          required
                          helperText="Mínimo 6 caracteres"
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          label="Confirmar Contraseña"
                          name="confirmPassword"
                          type="password"
                          value={formData.confirmPassword}
                          onChange={handleInputChange}
                          required
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <Alert severity="info" sx={{ mt: 2 }}>
                          <Info sx={{ mr: 1 }} />
                          Tu contraseña debe ser segura y única. Úsala para futuros accesos al sistema.
                        </Alert>
                      </Grid>
                    </Grid>
                  </motion.div>
                </Grid>
              )}

              {/* Paso 4: Confirmar Perfil */}
              {activeStep === 3 && (
                <Grid item xs={12}>
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <Typography variant="h6" gutterBottom sx={{ color: '#2c3e50', fontWeight: 600 }}>
                      <CheckCircle sx={{ mr: 1, verticalAlign: 'middle' }} />
                      Confirmar Perfil
                    </Typography>
                    <Card sx={{ background: '#f8f9fa', p: 3 }}>
                      <Typography variant="h6" gutterBottom>
                        Resumen de tu perfil:
                      </Typography>
                      <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                          <Typography variant="body2" color="textSecondary">
                            <strong>Nombre:</strong> {formData.name || 'No especificado'}
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            <strong>Email:</strong> {userInfo.email}
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            <strong>Teléfono:</strong> {formData.phone || 'No especificado'}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <Typography variant="body2" color="textSecondary">
                            <strong>Departamento:</strong> {formData.department || 'No especificado'}
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            <strong>Posición:</strong> {formData.position || 'No especificado'}
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            <strong>Rol:</strong> {userInfo.roles?.name || 'Sin rol'}
                          </Typography>
                        </Grid>
                      </Grid>
                    </Card>
                  </motion.div>
                </Grid>
              )}
            </Grid>

            {/* Botones de navegación */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
              <StyledButton
                onClick={() => setActiveStep((prev) => Math.max(prev - 1, 0))}
                disabled={activeStep === 0}
                sx={{ color: '#7f8c8d' }}
              >
                Atrás
              </StyledButton>
              
              {activeStep === steps.length - 1 ? (
                <StyledButton
                  type="submit"
                  variant="contained"
                  disabled={loading || !formData.name || !formData.password}
                  sx={{
                    background: 'linear-gradient(135deg, #27ae60, #2ecc71)'
                  }}
                >
                  {loading ? <CircularProgress size={20} color="inherit" /> : 'Completar Perfil'}
                </StyledButton>
              ) : (
                <StyledButton
                  onClick={() => setActiveStep((prev) => prev + 1)}
                  variant="contained"
                  disabled={
                    (activeStep === 0 && !formData.name) ||
                    (activeStep === 1) ||
                    (activeStep === 2 && (!formData.password || !formData.confirmPassword))
                  }
                  sx={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                  }}
                >
                  Continuar
                </StyledButton>
              )}
            </Box>
          </form>
        </StyledPaper>
      </motion.div>

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
    </StyledContainer>
  );
};

export default ProfileCompletionForm;