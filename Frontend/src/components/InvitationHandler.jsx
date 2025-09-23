import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Paper, Typography, Button, Alert, CircularProgress, Box } from '@mui/material';
import { CheckCircle, Warning, ArrowForward } from '@mui/icons-material';
import axios from 'axios';
import { auth } from '../firebase';

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8765";

const InvitationHandler = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userData, setUserData] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [firebaseUser, setFirebaseUser] = useState(null);

  useEffect(() => {
    verifyToken();
    checkFirebaseAuth();
  }, [token]);

  const verifyToken = async () => {
    try {
      console.log('🔍 Verificando token de invitación:', token);
      
      const response = await axios.get(`${API_BASE_URL}/api/user-registration/verify-token/${token}`);
      
      if (response.data.success) {
        console.log('✅ Token válido:', response.data.data);
        setUserData(response.data.data);
      } else {
        setError('Token inválido o expirado');
      }
    } catch (err) {
      console.error('❌ Error verificando token:', err);
      setError(err.response?.data?.message || 'Error al verificar la invitación');
    } finally {
      setLoading(false);
    }
  };

  const checkFirebaseAuth = () => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        console.log('🔐 Usuario Firebase autenticado:', user.email);
        setFirebaseUser(user);
        setIsAuthenticated(true);
      } else {
        console.log('🔐 No hay usuario Firebase autenticado');
        setIsAuthenticated(false);
      }
    });

    return () => unsubscribe();
  };

  const handleLogin = () => {
    // Redirigir al login con el token como parámetro
    navigate(`/login?invitation=${token}`);
  };

  const handleCompleteProfile = () => {
    // Redirigir a completar perfil
    navigate(`/complete-profile/${token}`);
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
        <Paper sx={{ p: 4 }}>
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
          <Typography variant="h6" gutterBottom>
            Invitación no válida
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            El enlace de invitación no es válido o ha expirado. Contacta al administrador para obtener un nuevo enlace.
          </Typography>
          <Button 
            variant="contained" 
            onClick={() => navigate('/login')}
            fullWidth
          >
            Ir al Login
          </Button>
        </Paper>
      </Container>
    );
  }

  if (!userData) {
    return (
      <Container maxWidth="sm" sx={{ mt: 8 }}>
        <Alert severity="warning">
          No se pudo cargar la información de la invitación.
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper sx={{ p: 4 }}>
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <CheckCircle sx={{ fontSize: 80, color: 'success.main', mb: 2 }} />
          <Typography variant="h4" gutterBottom>
            ¡Bienvenido a SIGMA! 🎉
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Sistema Integrado de Gestión y Administración
          </Typography>
        </Box>

        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            Información de tu cuenta:
          </Typography>
          <Box sx={{ bgcolor: 'grey.50', p: 3, borderRadius: 2 }}>
            <Typography variant="body1" sx={{ mb: 1 }}>
              <strong>Email:</strong> {userData.email}
            </Typography>
            <Typography variant="body1" sx={{ mb: 1 }}>
              <strong>Rol asignado:</strong> {userData.roles?.name || 'Sin rol'}
            </Typography>
            <Typography variant="body1" sx={{ mb: 1 }}>
              <strong>Descripción:</strong> {userData.roles?.description || 'Sin descripción'}
            </Typography>
            <Typography variant="body1">
              <strong>Estado del perfil:</strong> {userData.profile_complete ? 'Completado' : 'Pendiente'}
            </Typography>
          </Box>
        </Box>

        {!isAuthenticated ? (
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h6" gutterBottom>
              Paso 1: Inicia sesión con tu cuenta empresarial
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              Necesitas autenticarte con tu cuenta de Google empresarial para continuar.
            </Typography>
            <Button 
              variant="contained" 
              size="large"
              onClick={handleLogin}
              endIcon={<ArrowForward />}
              sx={{ mb: 2 }}
            >
              Iniciar Sesión con Google
            </Button>
          </Box>
        ) : (
          <Box sx={{ textAlign: 'center' }}>
            <Alert severity="success" sx={{ mb: 3 }}>
              ¡Autenticación exitosa! Bienvenido, {firebaseUser?.displayName || firebaseUser?.email}
            </Alert>
            
            {!userData.profile_complete ? (
              <Box>
                <Typography variant="h6" gutterBottom>
                  Paso 2: Completa tu perfil
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                  Necesitas completar tu información personal para acceder al sistema.
                </Typography>
                <Button 
                  variant="contained" 
                  size="large"
                  onClick={handleCompleteProfile}
                  endIcon={<ArrowForward />}
                >
                  Completar Mi Perfil
                </Button>
              </Box>
            ) : (
              <Box>
                <Typography variant="h6" gutterBottom>
                  ¡Tu perfil está completo!
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                  Ya puedes acceder al sistema con todas las funcionalidades disponibles.
                </Typography>
                <Button 
                  variant="contained" 
                  size="large"
                  onClick={() => navigate('/')}
                  endIcon={<ArrowForward />}
                >
                  Acceder al Sistema
                </Button>
              </Box>
            )}
          </Box>
        )}

        <Box sx={{ mt: 4, p: 3, bgcolor: 'info.50', borderRadius: 2 }}>
          <Typography variant="h6" gutterBottom>
            📋 Próximos pasos:
          </Typography>
          <Typography variant="body2" component="div">
            <ol>
              <li>Inicia sesión con tu cuenta empresarial de Google</li>
              <li>Completa tu información personal y profesional</li>
              <li>Establece tu contraseña de acceso</li>
              <li>Explora los módulos disponibles según tu rol</li>
            </ol>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default InvitationHandler;
