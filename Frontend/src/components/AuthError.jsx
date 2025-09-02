import React from 'react';
import { 
  Alert, 
  AlertTitle, 
  Box, 
  Button, 
  Container, 
  Typography,
  Paper,
  Stack
} from '@mui/material';
import { 
  ErrorOutline as ErrorIcon,
  PersonOff as UserOffIcon,
  Refresh as RefreshIcon,
  ExitToApp as LoginIcon
} from '@mui/icons-material';

const AuthError = ({ 
  title = "Error de Autenticación", 
  message = "Hubo un problema al verificar tu sesión", 
  errorType = "generic",
  onRetry,
  onLogin,
  showRetry = true,
  showLogin = true 
}) => {
  const getErrorConfig = () => {
    switch (errorType) {
      case 'user-not-found':
        return {
          title: "Usuario No Encontrado",
          message: "Tu cuenta no está registrada en nuestro sistema. Por favor, contacta al administrador para obtener acceso.",
          icon: <UserOffIcon sx={{ fontSize: 48, color: 'error.main' }} />,
          severity: 'warning'
        };
      
      case 'token-expired':
        return {
          title: "Sesión Expirada",
          message: "Tu sesión ha expirado por seguridad. Por favor, inicia sesión nuevamente para continuar.",
          icon: <ErrorIcon sx={{ fontSize: 48, color: 'warning.main' }} />,
          severity: 'warning'
        };
      
      case 'invalid-token':
        return {
          title: "Credenciales Inválidas",
          message: "Tus credenciales de acceso no son válidas. Por favor, inicia sesión nuevamente.",
          icon: <ErrorIcon sx={{ fontSize: 48, color: 'error.main' }} />,
          severity: 'error'
        };
      
      case 'no-token':
        return {
          title: "Acceso Restringido",
          message: "Necesitas iniciar sesión para acceder a esta funcionalidad.",
          icon: <LoginIcon sx={{ fontSize: 48, color: 'info.main' }} />,
          severity: 'info'
        };
      
      case 'server-error':
        return {
          title: "Error del Servidor",
          message: "Hay un problema temporal con nuestros servidores. Por favor, intenta nuevamente en unos momentos.",
          icon: <ErrorIcon sx={{ fontSize: 48, color: 'error.main' }} />,
          severity: 'error'
        };
      
      default:
        return {
          title: title,
          message: message,
          icon: <ErrorIcon sx={{ fontSize: 48, color: 'error.main' }} />,
          severity: 'error'
        };
    }
  };

  const config = getErrorConfig();

  const handleRetry = () => {
    if (onRetry) {
      onRetry();
    } else {
      window.location.reload();
    }
  };

  const handleLogin = () => {
    if (onLogin) {
      onLogin();
    } else {
      window.location.href = '/login';
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 8, mb: 8 }}>
      <Paper 
        elevation={3} 
        sx={{ 
          p: 4, 
          textAlign: 'center',
          borderRadius: 2
        }}
      >
        <Stack spacing={3} alignItems="center">
          {config.icon}
          
          <Typography variant="h4" component="h1" gutterBottom>
            {config.title}
          </Typography>
          
          <Alert severity={config.severity} sx={{ width: '100%', textAlign: 'left' }}>
            <AlertTitle>¿Qué significa esto?</AlertTitle>
            {config.message}
          </Alert>

          <Box sx={{ mt: 3, mb: 2 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Puedes intentar las siguientes acciones para resolver este problema:
            </Typography>
            
            <Stack direction="row" spacing={2} justifyContent="center">
              {showRetry && (
                <Button
                  variant="outlined"
                  startIcon={<RefreshIcon />}
                  onClick={handleRetry}
                  size="large"
                >
                  Intentar Nuevamente
                </Button>
              )}
              
              {showLogin && (
                <Button
                  variant="contained"
                  startIcon={<LoginIcon />}
                  onClick={handleLogin}
                  size="large"
                >
                  Iniciar Sesión
                </Button>
              )}
            </Stack>
          </Box>
          
          <Alert severity="info" sx={{ width: '100%' }}>
            <Typography variant="body2">
              <strong>¿Sigues teniendo problemas?</strong><br />
              Si este error persiste, contacta al administrador del sistema o intenta:
              <br />• Cerrar y abrir tu navegador
              <br />• Limpiar la caché de tu navegador
              <br />• Verificar tu conexión a internet
            </Typography>
          </Alert>
        </Stack>
      </Paper>
    </Container>
  );
};

export default AuthError;