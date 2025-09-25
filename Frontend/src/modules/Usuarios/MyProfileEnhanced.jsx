// src/modules/Usuarios/MyProfileEnhanced.jsx - COMPONENTE COMPLETAMENTE RENOVADO
import React, { useState, useContext, useEffect } from 'react';
import { GlobalContext } from '../../context/GlobalState';
import axios from 'axios';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Grid,
  Fade,
  CircularProgress,
  Card,
  CardContent,
  Avatar,
  Chip,
  Alert,
  Snackbar,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
  Divider,
  Paper,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  Close as CloseIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  PhotoCamera as PhotoCameraIcon,
  Person as PersonIcon,
  Phone as PhoneIcon,
  Business as BusinessIcon,
  Work as WorkIcon,
  CalendarToday as CalendarIcon,
  Email as EmailIcon,
  Security as SecurityIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  CakeOutlined as CakeIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { motion, AnimatePresence } from 'framer-motion';
import CountryCodeSelector from '../../components/CountryCodeSelector';

// ===== COMPONENTES ESTILIZADOS =====
const StyledContainer = styled(Container)(({ theme }) => ({
  padding: theme.spacing(4),
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
    background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.05"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
    pointerEvents: 'none'
  }
}));

const StyledCard = styled(Card)(({ theme }) => ({
  background: 'rgba(255, 255, 255, 0.98)',
  backdropFilter: 'blur(20px)',
  borderRadius: 24,
  boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
  border: '1px solid rgba(255,255,255,0.3)',
  overflow: 'hidden',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: '0 25px 80px rgba(0,0,0,0.2)'
  }
}));

const StyledAvatar = styled(Avatar)(({ theme }) => ({
  width: 120,
  height: 120,
  border: '4px solid #fff',
  boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'scale(1.05)',
    boxShadow: '0 12px 40px rgba(0,0,0,0.25)'
  }
}));

// Opciones para departamentos
const departmentOptions = [
  'Tecnología',
  'Operaciones',
  'Administrativo',
  'Contable'
];

// Opciones para cargos
const positionOptions = [
  'Project Manager',
  'Desarrollador',
  'Gerente',
  'Auxiliar Operativo',
  'Contador',
  'Administrador'
];

// ===== COMPONENTE PRINCIPAL =====
const MyProfileEnhanced = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { profileData, setProfileData, checkProfileCompletion } = useContext(GlobalContext);

  // Estados del componente
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [avatarDialog, setAvatarDialog] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Estados del formulario
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    phone_country_code: '+57',
    department: '',
    position: '',
    hire_date: '',
    birth_date: '',
    avatar: ''
  });

  // Estados de validación
  const [errors, setErrors] = useState({});
  const [hasChanges, setHasChanges] = useState(false);

  // Datos originales para comparar cambios
  const [originalData, setOriginalData] = useState({});
  const [selectedFile, setSelectedFile] = useState(null);

  // ===== EFECTOS =====
  useEffect(() => {
    if (profileData) {
      initializeForm();
      setLoading(false);
    }
  }, [profileData]);

  useEffect(() => {
    // Verificar si hay cambios
    const changed = Object.keys(formData).some(key =>
      formData[key] !== originalData[key]
    );
    setHasChanges(changed);
  }, [formData, originalData]);

  // ===== FUNCIONES =====
  const initializeForm = () => {
    const initialData = {
      name: profileData.name || '',
      phone: profileData.phone || '',
      phone_country_code: profileData.phone_country_code || '+57',
      department: profileData.department || '',
      position: profileData.position || '',
      hire_date: profileData.hire_date ? new Date(profileData.hire_date).toISOString().split('T')[0] : '',
      birth_date: profileData.birth_date ? new Date(profileData.birth_date).toISOString().split('T')[0] : '',
      avatar: profileData.avatar || ''
    };

    setFormData(initialData);
    setOriginalData(initialData);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));

    // Limpiar error del campo
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es requerido';
    }

    if (formData.phone && !/^[0-9\s\-\(\)]{7,}$/.test(formData.phone)) {
      newErrors.phone = 'Formato de teléfono inválido';
    }

    if (formData.birth_date) {
      const birthDate = new Date(formData.birth_date);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();

      if (age < 16 || age > 80) {
        newErrors.birth_date = 'La edad debe estar entre 16 y 80 años';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    
    if (!validateForm()) {
      return;
    }
    
    try {
      setSaving(true);
      // Preparar datos como FormData para manejar archivo de imagen
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name.trim());
      formDataToSend.append('phone', formData.phone.trim() || '');
      formDataToSend.append('phone_country_code', formData.phone_country_code || '');
      formDataToSend.append('department', formData.department || '');
      formDataToSend.append('position', formData.position || '');
      formDataToSend.append('hire_date', formData.hire_date || '');
      formDataToSend.append('birth_date', formData.birth_date || '');

      // Solo agregar avatar si hay un archivo nuevo
      if (selectedFile) {
        formDataToSend.append('avatar', selectedFile);
      }

      // Actualizar en el backend usando FormData
      const response = await axios.put(`/api/user-registration/update-profile/${profileData.id}`, formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data.success) {
        // Actualizar contexto global
        const updatedProfile = {
          ...profileData,
          ...formData,
          avatar: response.data.data?.avatar || formData.avatar
        };

        setProfileData(updatedProfile);
        
        // También guardar en localStorage para persistencia
        localStorage.setItem('profileData', JSON.stringify(updatedProfile));
        localStorage.setItem('profileComplete', JSON.stringify(updatedProfile.profile_complete || false));
        // Verificar si el perfil está completo
        if (checkProfileCompletion) {
          checkProfileCompletion(updatedProfile);
        }

        // Actualizar datos originales
        setOriginalData({ ...formData, avatar: response.data.data?.avatar || formData.avatar });
        setHasChanges(false);
        setEditing(false);
        setSelectedFile(null);

        showSnackbar('Perfil actualizado exitosamente', 'success');
      } else {
        showSnackbar(response.data.message || 'Error al actualizar el perfil', 'error');
      }
    } catch (error) {
      console.error('❌ Error actualizando perfil:', error);
      console.error('❌ Error response:', error.response);
      console.error('❌ Error request:', error.request);
      
      let errorMessage = 'Error al actualizar el perfil';
      
      if (error.response) {
        const { data } = error.response;
        if (data && data.message) {
          errorMessage = data.message;
        } else if (data && data.error) {
          errorMessage = data.error;
        } else {
          errorMessage = `Error del servidor: ${error.response.status} - ${error.response.statusText}`;
        }
      } else if (error.request) {
        errorMessage = 'No se pudo conectar con el servidor. Verifica tu conexión.';
      } else {
        errorMessage = error.message || 'Error inesperado';
      }
      
      showSnackbar(errorMessage, 'error');
    } finally {
      setSaving(false);
      }
  };

  const handleCancel = () => {
    setFormData(originalData);
    setErrors({});
    setEditing(false);
    setHasChanges(false);
    setSelectedFile(null);
  };

  const handleAvatarChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validar tamaño del archivo (5MB máximo)
      if (file.size > 5 * 1024 * 1024) {
        showSnackbar('La imagen debe ser menor a 5MB', 'error');
        return;
      }

      // Validar tipo de archivo
      if (!file.type.startsWith('image/')) {
        showSnackbar('Solo se permiten archivos de imagen', 'error');
        return;
      }

      // Guardar el archivo original para enviarlo al backend
      setSelectedFile(file);

      // Crear preview para mostrar en el UI
      const reader = new FileReader();
      reader.onloadend = () => {
        handleInputChange('avatar', reader.result);
        setAvatarDialog(false);
        showSnackbar('Imagen seleccionada correctamente', 'success');
      };
      reader.readAsDataURL(file);
    }
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const isProfileComplete = () => {
    const requiredFields = ['name', 'phone', 'department', 'position'];
    return requiredFields.every(field => formData[field] && formData[field].trim());
  };

  const calculateAge = (birthDate) => {
    if (!birthDate) return null;
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }

    return age;
  };

  // ===== RENDERIZADO =====
  if (loading) {
    return (
      <StyledContainer maxWidth="lg">
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
          <CircularProgress size={60} sx={{ color: 'white' }} />
        </Box>
      </StyledContainer>
    );
  }

  if (!profileData) {
    return (
      <StyledContainer maxWidth="lg">
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
          <Alert severity="error" sx={{ maxWidth: 400 }}>
            No se pudieron cargar los datos del perfil. Por favor, recarga la página.
          </Alert>
        </Box>
      </StyledContainer>
    );
  }

  return (
    <StyledContainer maxWidth="lg">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Header del Perfil */}
        <Box sx={{ textAlign: 'center', mb: 4, color: 'white' }}>
          <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 2, textShadow: '2px 2px 4px rgba(0,0,0,0.3)' }}>
            👤 Mi Perfil
          </Typography>
          <Typography variant="h6" sx={{ opacity: 0.9 }}>
            Gestiona tu información personal y profesional
          </Typography>

          {/* Indicador de perfil completo */}
          <Box sx={{ mt: 3 }}>
            {isProfileComplete() ? (
              <Chip
                icon={<CheckCircleIcon />}
                label="Perfil Completo"
                color="success"
                sx={{
                  fontWeight: 'bold',
                  fontSize: '1rem',
                  py: 2,
                  px: 3,
                  background: 'rgba(76, 175, 80, 0.9)',
                  color: 'white'
                }}
              />
            ) : (
              <Chip
                icon={<WarningIcon />}
                label="Perfil Incompleto - Completa tu información"
                color="warning"
                sx={{
                  fontWeight: 'bold',
                  fontSize: '1rem',
                  py: 2,
                  px: 3,
                  background: 'rgba(255, 152, 0, 0.9)',
                  color: 'white'
                }}
              />
            )}
          </Box>
        </Box>

        <Grid container spacing={3} justifyContent="center">
          {/* Columna del Avatar y Info Básica */}
          <Grid item xs={12} md={4}>
            <StyledCard>
              <CardContent sx={{ textAlign: 'center', p: 4 }}>
                {/* Avatar */}
                <Box sx={{ mb: 3 }}>
                  <StyledAvatar
                    src={formData.avatar || profileData.avatar}
                    onClick={() => setAvatarDialog(true)}
                    sx={{
                      mx: 'auto',
                      fontSize: '3rem'
                    }}
                  >
                    {!formData.avatar && !profileData.avatar && profileData.name?.charAt(0)?.toUpperCase()}
                  </StyledAvatar>
                  <IconButton
                    sx={{
                      position: 'relative',
                      mt: -2,
                      ml: 3,
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      color: 'white',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                        transform: 'scale(1.1)'
                      }
                    }}
                    onClick={() => setAvatarDialog(true)}
                  >
                    <PhotoCameraIcon />
                  </IconButton>
                </Box>

                {/* Información básica */}
                <Typography variant="h5" fontWeight="bold" gutterBottom>
                  {formData.name || 'Sin nombre'}
                </Typography>

                <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                  {profileData.email}
                </Typography>

                <Chip
                  label={profileData.role || 'Sin rol'}
                  sx={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    fontWeight: 'bold',
                    mb: 2
                  }}
                />

                {/* Edad si se tiene fecha de nacimiento */}
                {formData.birth_date && (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      <CakeIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
                      {calculateAge(formData.birth_date)} años
                    </Typography>
                  </Box>
                )}

                {/* Botón de editar */}
                {!editing && (
                  <Button
                    variant="contained"
                    startIcon={<EditIcon />}
                    onClick={() => setEditing(true)}
                    sx={{
                      mt: 3,
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      borderRadius: 3,
                      py: 1.5
                    }}
                    fullWidth
                  >
                    Editar Perfil
                  </Button>
                )}

                {/* Botones de guardar/cancelar */}
                {editing && (
                  <Box sx={{ mt: 3, display: 'flex', gap: 1 }}>
                    <Button
                      variant="contained"
                      startIcon={saving ? <CircularProgress size={16} /> : <SaveIcon />}
                      onClick={handleSave}
                      disabled={!hasChanges || saving}
                      sx={{
                        flex: 1,
                        background: 'linear-gradient(135deg, #27ae60 0%, #2ecc71 100%)',
                        borderRadius: 3
                      }}
                    >
                      {saving ? 'Guardando...' : 'Guardar'}
                    </Button>

                    <Button
                      variant="outlined"
                      startIcon={<CancelIcon />}
                      onClick={handleCancel}
                      disabled={saving}
                      sx={{ flex: 1, borderRadius: 3 }}
                    >
                      Cancelar
                    </Button>
                  </Box>
                )}
              </CardContent>
            </StyledCard>
          </Grid>

          {/* Columna del Formulario */}
          <Grid item xs={12} md={8}>
            <StyledCard>
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ mb: 3 }}>
                  Información del Perfil
                </Typography>

                <Grid container spacing={3}>
                  {/* Información Personal */}
                  <Grid item xs={12}>
                    <Typography variant="h6" sx={{ mb: 2, color: 'primary.main' }}>
                      <PersonIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                      Información Personal
                    </Typography>
                  </Grid>

                  {/* Nombre */}
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Nombre Completo *"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      disabled={!editing}
                      error={!!errors.name}
                      helperText={errors.name}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <PersonIcon color={editing ? 'primary' : 'disabled'} />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>

                  {/* Fecha de nacimiento */}
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Fecha de Nacimiento"
                      type="date"
                      value={formData.birth_date}
                      onChange={(e) => handleInputChange('birth_date', e.target.value)}
                      disabled={!editing}
                      error={!!errors.birth_date}
                      helperText={errors.birth_date || 'Para celebrar tu cumpleaños 🎉'}
                      InputLabelProps={{ shrink: true }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <CakeIcon color={editing ? 'primary' : 'disabled'} />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>

                  {/* Código de país */}
                  <Grid item xs={12} md={4}>
                    <CountryCodeSelector
                      value={formData.phone_country_code}
                      onChange={(value) => handleInputChange('phone_country_code', value)}
                      disabled={!editing}
                      helperText="Código del país"
                    />
                  </Grid>

                  {/* Teléfono */}
                  <Grid item xs={12} md={8}>
                    <TextField
                      fullWidth
                      label="Teléfono *"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      disabled={!editing}
                      error={!!errors.phone}
                      helperText={errors.phone || 'Solo números, espacios, guiones y paréntesis'}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <PhoneIcon color={editing ? 'primary' : 'disabled'} />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>

                  {/* Separador */}
                  <Grid item xs={12}>
                    <Divider sx={{ my: 2 }} />
                    <Typography variant="h6" sx={{ mb: 2, color: 'primary.main' }}>
                      <BusinessIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                      Información Profesional
                    </Typography>
                  </Grid>

                  {/* Departamento */}
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth disabled={!editing}>
                      <InputLabel>Departamento *</InputLabel>
                      <Select
                        value={formData.department}
                        label="Departamento *"
                        onChange={(e) => handleInputChange('department', e.target.value)}
                        startAdornment={
                          <InputAdornment position="start">
                            <BusinessIcon color={editing ? 'primary' : 'disabled'} />
                          </InputAdornment>
                        }
                      >
                        {departmentOptions.map((dept) => (
                          <MenuItem key={dept} value={dept}>{dept}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>

                  {/* Cargo */}
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth disabled={!editing}>
                      <InputLabel>Cargo *</InputLabel>
                      <Select
                        value={formData.position}
                        label="Cargo *"
                        onChange={(e) => handleInputChange('position', e.target.value)}
                        startAdornment={
                          <InputAdornment position="start">
                            <WorkIcon color={editing ? 'primary' : 'disabled'} />
                          </InputAdornment>
                        }
                      >
                        {positionOptions.map((pos) => (
                          <MenuItem key={pos} value={pos}>{pos}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>

                  {/* Fecha de contratación */}
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Fecha de Contratación"
                      type="date"
                      value={formData.hire_date}
                      onChange={(e) => handleInputChange('hire_date', e.target.value)}
                      disabled={!editing}
                      InputLabelProps={{ shrink: true }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <CalendarIcon color={editing ? 'primary' : 'disabled'} />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                </Grid>

                {/* Mensaje de campos requeridos */}
                {editing && (
                  <Alert severity="info" sx={{ mt: 3 }}>
                    Los campos marcados con (*) son requeridos para que tu perfil esté completo y puedas acceder a todas las funcionalidades del sistema.
                  </Alert>
                )}
              </CardContent>
            </StyledCard>
          </Grid>
        </Grid>

        {/* Dialog para cambiar avatar */}
        <Dialog
          open={avatarDialog}
          onClose={() => setAvatarDialog(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Typography variant="h6" component="span">
                Cambiar Foto de Perfil
              </Typography>
              <IconButton onClick={() => setAvatarDialog(false)}>
                <CloseIcon />
              </IconButton>
            </Box>
          </DialogTitle>
          <DialogContent sx={{ textAlign: 'center', py: 3 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Selecciona una nueva foto para tu perfil (máximo 5MB)
            </Typography>
            <input
              accept="image/*"
              style={{ display: 'none' }}
              id="avatar-upload"
              type="file"
              onChange={handleAvatarChange}
            />
            <label htmlFor="avatar-upload">
              <Button
                variant="contained"
                component="span"
                startIcon={<PhotoCameraIcon />}
                size="large"
                sx={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  borderRadius: 3,
                  py: 2,
                  px: 4
                }}
              >
                Seleccionar Imagen
              </Button>
            </label>
          </DialogContent>
        </Dialog>

        {/* Snackbar */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={4000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert
            onClose={() => setSnackbar({ ...snackbar, open: false })}
            severity={snackbar.severity}
            sx={{ borderRadius: 2 }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </motion.div>
    </StyledContainer>
  );
};

export default MyProfileEnhanced;