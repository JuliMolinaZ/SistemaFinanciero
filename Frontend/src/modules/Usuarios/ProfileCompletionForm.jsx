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
  Stepper,
  Step,
  StepLabel,
  Grid,
  Avatar,
  IconButton,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import {
  Person,
  Lock,
  Phone,
  Business,
  Work,
  CalendarToday,
  PhotoCamera,
  Visibility,
  VisibilityOff,
  CheckCircle,
  Warning
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

const API_URL = process.env.REACT_APP_API_URL || 'https://sigma.runsolutions-services.com';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  color: 'white',
  borderRadius: 20,
  boxShadow: '0 12px 40px rgba(0,0,0,0.15)',
  border: '1px solid rgba(255,255,255,0.3)',
  backdropFilter: 'blur(20px)',
  maxWidth: 600,
  margin: '0 auto'
}));

const steps = ['Información Personal', 'Seguridad', 'Información Laboral'];

const ProfileCompletionForm = ({ userEmail, onProfileComplete }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    password: '',
    confirmPassword: '',
    phone: '',
    department: '',
    position: '',
    hire_date: '',
    avatar: null
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  // Cargar información del usuario
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/user-registration/profile-status/${userEmail}`);
        if (response.data.success) {
          setUserData(response.data.data);
        }
          } catch (error) {
      setSnackbar({
        open: true,
        message: 'Error al cargar datos del usuario',
        severity: 'error'
      });
    }
    };

    if (userEmail) {
      fetchUserData();
    }
  }, [userEmail]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        avatar: file
      }));
    }
  };

  const validateStep = (step) => {
    switch (step) {
      case 0: // Información Personal
        return formData.name.trim().length > 0;
      case 1: // Seguridad
        return formData.password.length >= 8 && formData.password === formData.confirmPassword;
      case 2: // Información Laboral
        return true; // Opcional
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (validateStep(activeStep)) {
      setActiveStep((prevStep) => prevStep + 1);
    } else {
      setSnackbar({
        open: true,
        message: 'Por favor completa todos los campos requeridos',
        severity: 'warning'
      });
    }
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleSubmit = async () => {
    if (!validateStep(activeStep)) {
      setSnackbar({
        open: true,
        message: 'Por favor completa todos los campos requeridos',
        severity: 'warning'
      });
      return;
    }

    setLoading(true);

    try {
      // Crear FormData para enviar archivo
      const submitData = new FormData();
      submitData.append('name', formData.name);
      submitData.append('password', formData.password);
      submitData.append('phone', formData.phone);
      submitData.append('department', formData.department);
      submitData.append('position', formData.position);
      submitData.append('hire_date', formData.hire_date);
      if (formData.avatar) {
        submitData.append('avatar', formData.avatar);
      }

      const response = await axios.put(
        `${API_URL}/api/user-registration/complete-profile/${userData.id}`,
        submitData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      if (response.data.success) {
        setSnackbar({
          open: true,
          message: response.data.message,
          severity: 'success'
        });

        // Notificar al componente padre que el perfil se completó
        if (onProfileComplete) {
          onProfileComplete(response.data.data);
        }
      }
    } catch (error) {
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

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Box>
            <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
              Información Personal
            </Typography>
            
            <TextField
              fullWidth
              label="Nombre Completo"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              sx={{ mb: 3 }}
              InputProps={{
                startAdornment: <Person sx={{ mr: 1, opacity: 0.7 }} />
              }}
            />

            <TextField
              fullWidth
              label="Teléfono"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              sx={{ mb: 3 }}
              InputProps={{
                startAdornment: <Phone sx={{ mr: 1, opacity: 0.7 }} />
              }}
            />

            <Box display="flex" alignItems="center" gap={2} mb={3}>
              <Avatar
                sx={{ width: 80, height: 80, border: '3px solid rgba(255,255,255,0.3)' }}
                src={formData.avatar ? URL.createObjectURL(formData.avatar) : undefined}
              >
                {formData.name ? formData.name.charAt(0).toUpperCase() : <Person />}
              </Avatar>
              
              <Box>
                <input
                  accept="image/*"
                  style={{ display: 'none' }}
                  id="avatar-upload"
                  type="file"
                  onChange={handleFileChange}
                />
                <label htmlFor="avatar-upload">
                  <Button
                    variant="outlined"
                    component="span"
                    startIcon={<PhotoCamera />}
                    sx={{ borderColor: 'rgba(255,255,255,0.5)', color: 'white' }}
                  >
                    Cambiar Foto
                  </Button>
                </label>
              </Box>
            </Box>
          </Box>
        );

      case 1:
        return (
          <Box>
            <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
              Configuración de Seguridad
            </Typography>
            
            <TextField
              fullWidth
              label="Contraseña"
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={handleInputChange}
              required
              sx={{ mb: 3 }}
              InputProps={{
                startAdornment: <Lock sx={{ mr: 1, opacity: 0.7 }} />,
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
              helperText="La contraseña debe tener al menos 8 caracteres"
            />

            <TextField
              fullWidth
              label="Confirmar Contraseña"
              name="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              value={formData.confirmPassword}
              onChange={handleInputChange}
              required
              sx={{ mb: 3 }}
              InputProps={{
                startAdornment: <Lock sx={{ mr: 1, opacity: 0.7 }} />,
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      edge="end"
                    >
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
              error={formData.password !== formData.confirmPassword && formData.confirmPassword !== ''}
              helperText={
                formData.password !== formData.confirmPassword && formData.confirmPassword !== ''
                  ? 'Las contraseñas no coinciden'
                  : ''
              }
            />
          </Box>
        );

      case 2:
        return (
          <Box>
            <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
              Información Laboral (Opcional)
            </Typography>
            
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Departamento"
                  name="department"
                  value={formData.department}
                  onChange={handleInputChange}
                  sx={{ mb: 2 }}
                  InputProps={{
                    startAdornment: <Business sx={{ mr: 1, opacity: 0.7 }} />
                  }}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Cargo"
                  name="position"
                  value={formData.position}
                  onChange={handleInputChange}
                  sx={{ mb: 2 }}
                  InputProps={{
                    startAdornment: <Work sx={{ mr: 1, opacity: 0.7 }} />
                  }}
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Fecha de Contratación"
                  name="hire_date"
                  type="date"
                  value={formData.hire_date}
                  onChange={handleInputChange}
                  InputLabelProps={{ shrink: true }}
                  InputProps={{
                    startAdornment: <CalendarToday sx={{ mr: 1, opacity: 0.7 }} />
                  }}
                />
              </Grid>
            </Grid>
          </Box>
        );

      default:
        return null;
    }
  };

  if (!userData) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress size={60} />
      </Box>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <StyledPaper>
        <Box textAlign="center" mb={4}>
          <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
            🚀 Completar Perfil
          </Typography>
          <Typography variant="body1" sx={{ opacity: 0.9 }}>
            Bienvenido {userData.email}. Por favor completa tu información para acceder al sistema.
          </Typography>
        </Box>

        {/* Stepper */}
        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label, index) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {/* Contenido del paso */}
        <Box sx={{ mb: 4 }}>
          {renderStepContent(activeStep)}
        </Box>

        {/* Botones de navegación */}
        <Box display="flex" justifyContent="space-between">
          <Button
            disabled={activeStep === 0}
            onClick={handleBack}
            sx={{ color: 'rgba(255,255,255,0.8)' }}
          >
            Atrás
          </Button>

          <Box>
            {activeStep === steps.length - 1 ? (
              <Button
                variant="contained"
                onClick={handleSubmit}
                disabled={loading || !validateStep(activeStep)}
                sx={{
                  background: 'rgba(255, 255, 255, 0.2)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  '&:hover': {
                    background: 'rgba(255, 255, 255, 0.3)',
                  }
                }}
              >
                {loading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  <>
                    <CheckCircle sx={{ mr: 1 }} />
                    Completar Perfil
                  </>
                )}
              </Button>
            ) : (
              <Button
                variant="contained"
                onClick={handleNext}
                disabled={!validateStep(activeStep)}
                sx={{
                  background: 'rgba(255, 255, 255, 0.2)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  '&:hover': {
                    background: 'rgba(255, 255, 255, 0.3)',
                  }
                }}
              >
                Siguiente
              </Button>
            )}
          </Box>
        </Box>
      </StyledPaper>

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
    </Container>
  );
};

export default ProfileCompletionForm;
