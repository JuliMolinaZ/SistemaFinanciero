import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Stepper,
  Step,
  StepLabel,
  Grid,
  Box,
  Alert,
  CircularProgress,
  Avatar,
  IconButton,
  Chip,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment
} from '@mui/material';
import {
  Person,
  Email,
  Phone,
  Business,
  Work,
  CalendarToday,
  Lock,
  Visibility,
  VisibilityOff,
  CheckCircle,
  Warning,
  ArrowForward
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const steps = ['Información Personal', 'Información Laboral', 'Seguridad'];

const CompleteProfile = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  
  // Debug: Log para verificar que CompleteProfile se está ejecutando
  console.log('🎯 COMPLETE PROFILE COMPONENT RENDERIZADO');
  console.log('🎯 Token recibido:', token);
  console.log('🎯 URL actual:', window.location.pathname);
  console.log('🎯 Timestamp:', new Date().toISOString());
  
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  
  // Formulario
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    department: '',
    position: '',
    hire_date: '',
    password: '',
    confirmPassword: '',
    avatar: null
  });
  
  // Estados de validación
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});

  // Verificar token al cargar
  useEffect(() => {
    verifyToken();
  }, [token]);

  const verifyToken = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/user-registration/verify-token/${token}`);
      
      if (response.data.success) {
        setUserData(response.data.data);
        setFormData(prev => ({
          ...prev,
          name: response.data.data.name || '',
          phone: response.data.data.phone || '',
          department: response.data.data.department || '',
          position: response.data.data.position || '',
          hire_date: response.data.data.hire_date || ''
        }));
      } else {
        setError('Token inválido o expirado');
      }
    } catch (error) {
      setError('Error al verificar el token. Intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Limpiar error del campo
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateStep = (step) => {
    const newErrors = {};
    
    switch (step) {
      case 0: // Información Personal
        if (!formData.name.trim()) newErrors.name = 'El nombre es requerido';
        if (!formData.phone.trim()) newErrors.phone = 'El teléfono es requerido';
        break;
        
      case 1: // Información Laboral
        if (!formData.department.trim()) newErrors.department = 'El departamento es requerido';
        if (!formData.position.trim()) newErrors.position = 'El cargo es requerido';
        if (!formData.hire_date) newErrors.hire_date = 'La fecha de contratación es requerida';
        break;
        
      case 2: // Seguridad
        if (!formData.password) newErrors.password = 'La contraseña es requerida';
        else if (formData.password.length < 8) newErrors.password = 'La contraseña debe tener al menos 8 caracteres';
        else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
          newErrors.password = 'La contraseña debe contener mayúsculas, minúsculas y números';
        }
        
        if (!formData.confirmPassword) newErrors.confirmPassword = 'Confirma tu contraseña';
        else if (formData.password !== formData.confirmPassword) {
          newErrors.confirmPassword = 'Las contraseñas no coinciden';
        }
        break;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(activeStep)) {
      setActiveStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    setActiveStep(prev => prev - 1);
  };

  const handleSubmit = async () => {
    if (!validateStep(activeStep)) return;

    try {
      setSubmitting(true);

      // Intentar obtener el Firebase UID si el usuario está autenticado
      let firebaseUID = null;
      try {
        const { getAuth, onAuthStateChanged } = await import('firebase/auth');
        const auth = getAuth();

        // Esperar a que Firebase se inicialice
        const currentUser = await new Promise((resolve) => {
          const unsubscribe = onAuthStateChanged(auth, (user) => {
            unsubscribe();
            resolve(user);
          });
        });

        if (currentUser && currentUser.uid) {
          firebaseUID = currentUser.uid;
          console.log('🔐 Firebase UID obtenido para envío:', firebaseUID);
        }
      } catch (firebaseError) {
        console.log('ℹ️ No se pudo obtener Firebase UID, continuando sin él:', firebaseError.message);
      }

      const submitData = {
        ...formData,
        token: token,
        firebase_uid: firebaseUID // Incluir Firebase UID si está disponible
      };

      console.log('📤 Enviando datos de completar perfil:', { ...submitData, password: '[HIDDEN]', confirmPassword: '[HIDDEN]' });

      const response = await axios.post(`/api/user-registration/complete-profile/${token}`, submitData);
      
      if (response.data.success) {
        console.log('✅ Perfil completado exitosamente');

        // Si no se incluyó Firebase UID en la llamada inicial, intentar actualizarlo ahora
        if (!firebaseUID) {
          try {
            const { getAuth, onAuthStateChanged } = await import('firebase/auth');
            const auth = getAuth();

            const currentUser = await new Promise((resolve) => {
              const unsubscribe = onAuthStateChanged(auth, (user) => {
                unsubscribe();
                resolve(user);
              });
            });

            if (currentUser && currentUser.uid) {
              console.log('🔐 Actualizando Firebase UID posterior:', currentUser.uid);

              const updateResponse = await axios.put(`/api/user-registration/update-firebase-uid/${userData.email}`, {
                firebase_uid: currentUser.uid
              });

              if (updateResponse.data.success) {
                console.log('✅ Firebase UID actualizado exitosamente');
              } else {
                console.warn('⚠️ No se pudo actualizar el Firebase UID:', updateResponse.data.message);
              }
            }
          } catch (firebaseError) {
            console.warn('⚠️ Error al actualizar Firebase UID posterior:', firebaseError.message);
          }
        }

        setSuccess(true);
        // Redirigir al login después de 3 segundos
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Error al completar el perfil');
    } finally {
      setSubmitting(false);
    }
  };

  const handleAvatarChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, avatar: file }));
    }
  };

  if (loading) {
    return (
      <Container maxWidth="sm" sx={{ mt: 8, textAlign: 'center' }}>
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Verificando tu invitación...
        </Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="sm" sx={{ mt: 8 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button 
          variant="contained" 
          onClick={() => navigate('/login')}
          fullWidth
        >
          Ir al Login
        </Button>
      </Container>
    );
  }

  if (success) {
    return (
      <Container maxWidth="sm" sx={{ mt: 8 }}>
        <Alert severity="success" sx={{ mb: 2 }}>
          ¡Perfil completado exitosamente! Serás redirigido al login en unos segundos.
        </Alert>
        <Box sx={{ textAlign: 'center' }}>
          <CheckCircle sx={{ fontSize: 60, color: 'success.main', mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            ¡Bienvenido a RunSolutions!
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Tu cuenta está lista. Ya puedes acceder al sistema.
          </Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Avatar 
            sx={{ 
              width: 80, 
              height: 80, 
              mx: 'auto', 
              mb: 2,
              bgcolor: 'primary.main'
            }}
          >
            <Person sx={{ fontSize: 40 }} />
          </Avatar>
          <Typography variant="h4" gutterBottom>
            ¡Completa tu Perfil!
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Bienvenido a RunSolutions. Completa tu información para acceder al sistema.
          </Typography>
          {userData && (
            <Box sx={{ mt: 2 }}>
              <Chip 
                icon={<Email />} 
                label={userData.email} 
                variant="outlined" 
                sx={{ mr: 1 }}
              />
              <Chip 
                icon={<Business />} 
                label={userData.roles?.name || 'Sin rol'} 
                color="primary" 
                variant="outlined"
              />
            </Box>
          )}
        </Box>

        <Divider sx={{ mb: 4 }} />

        {/* Stepper */}
        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {/* Formulario */}
        <Box sx={{ mt: 4 }}>
          {activeStep === 0 && (
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  Información Personal
                </Typography>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Nombre Completo"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  error={!!errors.name}
                  helperText={errors.name}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Person />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Teléfono"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  error={!!errors.phone}
                  helperText={errors.phone}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Phone />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              
              <Grid item xs={12}>
                <Typography variant="body2" color="text.secondary">
                  Sube una foto de perfil (opcional)
                </Typography>
                <input
                  accept="image/*"
                  style={{ display: 'none' }}
                  id="avatar-upload"
                  type="file"
                  onChange={handleAvatarChange}
                />
                <label htmlFor="avatar-upload">
                  <Button variant="outlined" component="span">
                    Seleccionar Imagen
                  </Button>
                </label>
                {formData.avatar && (
                  <Typography variant="body2" sx={{ ml: 2, display: 'inline' }}>
                    ✅ {formData.avatar.name}
                  </Typography>
                )}
              </Grid>
            </Grid>
          )}

          {activeStep === 1 && (
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  Información Laboral
                </Typography>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Departamento"
                  value={formData.department}
                  onChange={(e) => handleInputChange('department', e.target.value)}
                  error={!!errors.department}
                  helperText={errors.department}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Business />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Cargo"
                  value={formData.position}
                  onChange={(e) => handleInputChange('position', e.target.value)}
                  error={!!errors.position}
                  helperText={errors.position}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Work />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Fecha de Contratación"
                  type="date"
                  value={formData.hire_date}
                  onChange={(e) => handleInputChange('hire_date', e.target.value)}
                  error={!!errors.hire_date}
                  helperText={errors.hire_date}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <CalendarToday />
                      </InputAdornment>
                    ),
                  }}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
            </Grid>
          )}

          {activeStep === 2 && (
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  Configuración de Seguridad
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Establece una contraseña segura para acceder al sistema
                </Typography>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Contraseña"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  error={!!errors.password}
                  helperText={errors.password}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Confirmar Contraseña"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  error={!!errors.confirmPassword}
                  helperText={errors.confirmPassword}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          edge="end"
                        >
                          {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              
              <Grid item xs={12}>
                <Alert severity="info">
                  <Typography variant="body2">
                    <strong>Requisitos de contraseña:</strong>
                  </Typography>
                  <Typography variant="body2">
                    • Mínimo 8 caracteres
                  </Typography>
                  <Typography variant="body2">
                    • Al menos una mayúscula
                  </Typography>
                  <Typography variant="body2">
                    • Al menos una minúscula
                  </Typography>
                  <Typography variant="body2">
                    • Al menos un número
                  </Typography>
                </Alert>
              </Grid>
            </Grid>
          )}
        </Box>

        {/* Navegación */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
          <Button
            disabled={activeStep === 0}
            onClick={handleBack}
            startIcon={<ArrowForward sx={{ transform: 'rotate(180deg)' }} />}
          >
            Anterior
          </Button>
          
          <Box>
            {activeStep === steps.length - 1 ? (
              <Button
                variant="contained"
                onClick={handleSubmit}
                disabled={submitting}
                startIcon={submitting ? <CircularProgress size={20} /> : <CheckCircle />}
              >
                {submitting ? 'Completando...' : 'Completar Perfil'}
              </Button>
            ) : (
              <Button
                variant="contained"
                onClick={handleNext}
                endIcon={<ArrowForward />}
              >
                Siguiente
              </Button>
            )}
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default CompleteProfile;
