// src/modules/Usuarios/MyProfile.jsx - COMPONENTE COMPLETAMENTE RENOVADO
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
  Warning as WarningIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { motion, AnimatePresence } from 'framer-motion';

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

// ===== COMPONENTE PRINCIPAL =====
const MyProfile = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { profileData, updateUserProfile, profileComplete } = useContext(GlobalContext);
  
  // Redirección automática cuando el perfil esté completo
  useEffect(() => {
    if (profileComplete && profileData) {
      const isActuallyComplete = !!(profileData.name &&
                                   profileData.phone &&
                                   profileData.phone_country_code &&
                                   profileData.department &&
                                   profileData.position &&
                                   profileData.birth_date);
      
      if (isActuallyComplete) {
        // Redirigir a project-management después de un breve delay
        setTimeout(() => {
          window.location.href = '/project-management';
        }, 1000);
      }
    }
  }, [profileComplete, profileData]);
  
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
    department: '',
    position: '',
    hire_date: '',
    avatar: ''
  });
  
  // Estados de validación
  const [errors, setErrors] = useState({});
  const [hasChanges, setHasChanges] = useState(false);
  
  // Datos originales para comparar cambios
  const [originalData, setOriginalData] = useState({});

  // ===== EFECTOS =====
  useEffect(() => {
    if (profileData) {
      initializeForm();
      setLoading(false);
    }
  }, [profileData]);

  useEffect(() => {
    // Verificar si hay cambios
    const changed = Object.keys(formData).some(key => {
      if (key === 'avatar') {
        // Para el avatar, verificar si es una nueva imagen (base64) o si cambió la URL
        const currentAvatar = formData[key];
        const originalAvatar = originalData[key];
        
          current: currentAvatar?.substring(0, 50) + '...',
          original: originalAvatar,
          isBase64: currentAvatar?.startsWith('data:image/'),
          isDifferent: currentAvatar !== originalAvatar
        });
        
        // Si el avatar actual es base64, siempre hay cambios (nueva imagen)
        if (currentAvatar && currentAvatar.startsWith('data:image/')) {
          return true; // Siempre hay cambios si es base64
        }
        
        // Si no es base64, comparar normalmente
        return currentAvatar !== originalAvatar;
      }
      
      // Para otros campos, comparar normalmente
      const isDifferent = formData[key] !== originalData[key];
      if (isDifferent) {
        }
      return isDifferent;
    });
    
      changed,
      hasChanges: changed,
      formData: {
        name: formData.name,
        phone: formData.phone,
        avatar: formData.avatar?.substring(0, 50) + '...'
      },
      originalData: {
        name: originalData.name,
        phone: originalData.phone,
        avatar: originalData.avatar
      }
    });
    
    setHasChanges(changed);
  }, [formData, originalData]);

  // ===== FUNCIONES =====
  const initializeForm = () => {
    const initialData = {
      name: profileData.name || '',
      phone: profileData.phone || '',
      department: profileData.department || '',
      position: profileData.position || '',
      hire_date: profileData.hire_date ? new Date(profileData.hire_date).toISOString().split('T')[0] : '',
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
    
    if (formData.phone && !/^[\+]?[0-9\s\-\(\)]{7,}$/.test(formData.phone)) {
      newErrors.phone = 'Formato de teléfono inválido';
    }
    
    if (formData.department && formData.department.length < 2) {
      newErrors.department = 'El departamento debe tener al menos 2 caracteres';
    }
    
    if (formData.position && formData.position.length < 2) {
      newErrors.position = 'El cargo debe tener al menos 2 caracteres';
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
      // Verificar si hay una nueva imagen (base64)
      const hasNewImage = formData.avatar && 
                         formData.avatar !== originalData.avatar && 
                         formData.avatar.startsWith('data:image/');
      
        hasNewImage,
        currentAvatar: formData.avatar,
        originalAvatar: originalData.avatar,
        isBase64: formData.avatar?.startsWith('data:image/'),
        hasAvatar: !!formData.avatar
      });
      
      let response;
      
      // Siempre intentar usar el endpoint con soporte para archivos si hay avatar
      if (formData.avatar && formData.avatar.startsWith('data:image/')) {
        
        try {
          // Usar endpoint con soporte para archivos
          const formDataToSend = new FormData();
          formDataToSend.append('name', formData.name.trim());
          formDataToSend.append('phone', formData.phone.trim() || '');
          formDataToSend.append('department', formData.department.trim() || '');
          formDataToSend.append('position', formData.position.trim() || '');
          formDataToSend.append('hire_date', formData.hire_date || '');
          
          // Convertir base64 a blob
          const fetchResponse = await fetch(formData.avatar);
          const blob = await fetchResponse.blob();
          
          // Determinar extensión del archivo basado en el tipo MIME
          const mimeType = formData.avatar.split(';')[0].split(':')[1];
          let extension = 'jpg';
          if (mimeType.includes('png')) extension = 'png';
          else if (mimeType.includes('gif')) extension = 'gif';
          else if (mimeType.includes('webp')) extension = 'webp';
          
          formDataToSend.append('avatar', blob, `avatar.${extension}`);
          
          response = await axios.put(`/api/user-registration/update-profile/${profileData.id}`, formDataToSend, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          });

        } catch (formDataError) {

          // Fallback: usar endpoint sin archivos
          const updateData = {
            name: formData.name.trim(),
            phone: formData.phone.trim() || null,
            department: formData.department.trim() || null,
            position: formData.position.trim() || null,
            hire_date: formData.hire_date || null,
            avatar: formData.avatar
          };
          
          response = await axios.put(`/api/user-registration/update-user/${profileData.id}`, updateData);
        }
      } else {
        
        // Usar endpoint sin archivos
        const updateData = {
          name: formData.name.trim(),
          phone: formData.phone.trim() || null,
          department: formData.department.trim() || null,
          position: formData.position.trim() || null,
          hire_date: formData.hire_date || null,
          avatar: formData.avatar
        };
        
        response = await axios.put(`/api/user-registration/update-user/${profileData.id}`, updateData);
      }
      
      // Verificar si la respuesta es exitosa (status 200-299 y success: true)
      const isSuccess = response.status >= 200 && response.status < 300 && response.data && response.data.success === true;
      
      if (isSuccess) {
        // Preparar datos para actualizar el contexto
        const newAvatarUrl = response.data.data?.avatar || formData.avatar;
        
        const updateData = {
          name: formData.name.trim(),
          phone: formData.phone.trim() || null,
          department: formData.department.trim() || null,
          position: formData.position.trim() || null,
          hire_date: formData.hire_date || null,
          avatar: newAvatarUrl
        };
        
        // Usar la función del contexto para actualizar el perfil
        updateUserProfile(updateData);
        
        // Actualizar datos originales con la nueva URL del avatar
        setOriginalData({ ...formData, avatar: newAvatarUrl });
        setHasChanges(false);
        setEditing(false);
        
        showSnackbar('Perfil actualizado exitosamente', 'success');
      } else {
        const errorMessage = response.data?.message || 'Error al actualizar el perfil';
        showSnackbar(errorMessage, 'error');
      }
    } catch (error) {
      console.error('❌ Error actualizando perfil:', error);
      console.error('❌ Error response:', error.response);
      console.error('❌ Error request:', error.request);
      console.error('❌ Error message:', error.message);
      
      let errorMessage = 'Error al actualizar el perfil';
      
      if (error.response) {
        // El servidor respondió con un código de error
        const { data } = error.response;
        if (data && data.message) {
          errorMessage = data.message;
        } else if (data && data.error) {
          errorMessage = data.error;
        } else {
          errorMessage = `Error del servidor: ${error.response.status} - ${error.response.statusText}`;
        }
      } else if (error.request) {
        // La petición se hizo pero no hubo respuesta
        errorMessage = 'No se pudo conectar con el servidor. Verifica tu conexión.';
      } else {
        // Algo pasó configurando la petición
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
  };

  const handleAvatarChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        handleInputChange('avatar', reader.result);
        setAvatarDialog(false);
        
        // Activar modo edición automáticamente cuando se selecciona una imagen
        if (!editing) {
          setEditing(true);
          showSnackbar('Imagen seleccionada. Haz clic en "Guardar" para confirmar los cambios.', 'info');
        } else {
          showSnackbar('Imagen seleccionada correctamente', 'success');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
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
        </Box>

        <Grid container spacing={3} justifyContent="center">
          {/* Columna del Avatar */}
          <Grid item xs={12} md={4}>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <StyledCard>
                <CardContent sx={{ textAlign: 'center', p: 4 }}>
                  <Box sx={{ position: 'relative', display: 'inline-block' }}>
                    <StyledAvatar
                      src={formData.avatar || '/default-avatar.png'}
                      alt="Avatar del usuario"
                      onClick={() => setAvatarDialog(true)}
                    />
                    <IconButton
                      sx={{
                        position: 'absolute',
                        bottom: 0,
                        right: 0,
                        backgroundColor: theme.palette.primary.main,
                        color: 'white',
                        '&:hover': { backgroundColor: theme.palette.primary.dark }
                      }}
                      onClick={() => setAvatarDialog(true)}
                    >
                      <PhotoCameraIcon />
                    </IconButton>
                  </Box>
                  
                  <Typography variant="h6" sx={{ mt: 2, fontWeight: 'bold' }}>
                    {formData.name || 'Sin nombre'}
                  </Typography>
                  
                  <Chip
                    label={profileData.role || 'Sin rol asignado'}
                    color="primary"
                    variant="outlined"
                    sx={{ mt: 1 }}
                  />
                  
                  <Typography variant="body2" sx={{ mt: 2, color: 'text.secondary' }}>
                    Haz clic en el avatar para cambiarlo
                  </Typography>
                </CardContent>
              </StyledCard>
            </motion.div>
          </Grid>

          {/* Columna del Formulario */}
          <Grid item xs={12} md={8}>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <StyledCard>
                <CardContent sx={{ p: 4 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                      📝 Información Personal
                    </Typography>
                    
                    <Box>
                      {editing ? (
                        <>
                          <Button
                            variant="outlined"
                            startIcon={<CancelIcon />}
                            onClick={handleCancel}
                            sx={{ mr: 1 }}
                          >
                            Cancelar
                          </Button>
                            saving,
                            hasChanges,
                            disabled: saving || !hasChanges
                          })}
                          <Button
                            variant="contained"
                            startIcon={<SaveIcon />}
                            onClick={handleSave}
                            disabled={saving || !hasChanges}
                            sx={{
                              background: 'linear-gradient(45deg, #4CAF50, #45a049)',
                              '&:hover': { background: 'linear-gradient(45deg, #45a049, #4CAF50)' }
                            }}
                          >
                            {saving ? <CircularProgress size={20} color="inherit" /> : 'Guardar'}
                          </Button>
                        </>
                      ) : (
                        <Button
                          variant="contained"
                          startIcon={<EditIcon />}
                          onClick={() => setEditing(true)}
                          sx={{
                            background: 'linear-gradient(45deg, #2196F3, #1976D2)',
                            '&:hover': { background: 'linear-gradient(45deg, #1976D2, #2196F3)' }
                          }}
                        >
                          Editar Perfil
                        </Button>
                      )}
                    </Box>
                  </Box>

                  <Divider sx={{ mb: 3 }} />

                  {/* Formulario */}
                  <Grid container spacing={3}>
                    {/* Nombre */}
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Nombre Completo"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        disabled={!editing}
                        error={!!errors.name}
                        helperText={errors.name}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <PersonIcon color="action" />
                            </InputAdornment>
                          )
                        }}
                        sx={{ mb: 2 }}
                      />
                    </Grid>

                    {/* Teléfono */}
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Teléfono"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        disabled={!editing}
                        error={!!errors.phone}
                        helperText={errors.phone || 'Opcional'}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <PhoneIcon color="action" />
                            </InputAdornment>
                          )
                        }}
                        sx={{ mb: 2 }}
                      />
                    </Grid>

                    {/* Departamento */}
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Departamento"
                        value={formData.department}
                        onChange={(e) => handleInputChange('department', e.target.value)}
                        disabled={!editing}
                        error={!!errors.department}
                        helperText={errors.department || 'Opcional'}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <BusinessIcon color="action" />
                            </InputAdornment>
                          )
                        }}
                        sx={{ mb: 2 }}
                      />
                    </Grid>

                    {/* Cargo */}
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Cargo/Puesto"
                        value={formData.position}
                        onChange={(e) => handleInputChange('position', e.target.value)}
                        disabled={!editing}
                        error={!!errors.position}
                        helperText={errors.position || 'Opcional'}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <WorkIcon color="action" />
                            </InputAdornment>
                          )
                        }}
                        sx={{ mb: 2 }}
                      />
                    </Grid>

                    {/* Fecha de Contratación */}
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Fecha de Contratación"
                        type="date"
                        value={formData.hire_date}
                        onChange={(e) => handleInputChange('hire_date', e.target.value)}
                        disabled={!editing}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <CalendarIcon color="action" />
                            </InputAdornment>
                          )
                        }}
                        sx={{ mb: 2 }}
                      />
                    </Grid>

                    {/* Email (Solo lectura) */}
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Correo Electrónico"
                        value={profileData.email || ''}
                        disabled
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <EmailIcon color="action" />
                            </InputAdornment>
                          )
                        }}
                        sx={{ mb: 2 }}
                        helperText="No se puede modificar"
                      />
                    </Grid>
                  </Grid>

                  {/* Información del Rol */}
                  <Box sx={{ mt: 4, p: 3, backgroundColor: 'rgba(0,0,0,0.03)', borderRadius: 2 }}>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, display: 'flex', alignItems: 'center' }}>
                      <SecurityIcon sx={{ mr: 1, color: 'primary.main' }} />
                      Información del Rol
                    </Typography>
                    
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="body2" color="text.secondary">
                          <strong>Rol:</strong> {profileData.role || 'Sin rol asignado'}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="body2" color="text.secondary" component="span">
                            <strong>Estado:</strong>
                          </Typography>
                          <Chip
                            label={profileData.is_active ? 'Activo' : 'Inactivo'}
                            color={profileData.is_active ? 'success' : 'error'}
                            size="small"
                          />
                        </Box>
                      </Grid>
                    </Grid>
                  </Box>

                  {/* Indicador de Cambios */}
                  {hasChanges && editing && (
                    <Alert 
                      severity="info" 
                      sx={{ mt: 3 }}
                      icon={<CheckCircleIcon />}
                    >
                      Tienes cambios sin guardar. Haz clic en "Guardar" para aplicar los cambios.
                    </Alert>
                  )}
                </CardContent>
              </StyledCard>
            </motion.div>
          </Grid>
        </Grid>
      </motion.div>

      {/* Dialog para cambiar avatar */}
      <Dialog open={avatarDialog} onClose={() => setAvatarDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ background: 'linear-gradient(45deg, #667eea, #764ba2)', color: 'white' }}>
          Cambiar Avatar
          <IconButton
            onClick={() => setAvatarDialog(false)}
            sx={{ position: 'absolute', right: 8, top: 8, color: 'white' }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Selecciona una nueva imagen para tu perfil:
          </Typography>
          
          <Button
            variant="contained"
            component="label"
            startIcon={<PhotoCameraIcon />}
            fullWidth
            sx={{ py: 2 }}
          >
            Subir Nueva Imagen
            <input
              type="file"
              accept="image/*"
              hidden
              onChange={handleAvatarChange}
            />
          </Button>
        </DialogContent>
      </Dialog>

      {/* Snackbar para notificaciones */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
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

export default MyProfile;

