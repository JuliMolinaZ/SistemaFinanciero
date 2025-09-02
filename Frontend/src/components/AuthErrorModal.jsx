import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Alert,
  AlertTitle,
  Box,
  Stack
} from '@mui/material';
import {
  ErrorOutline as ErrorIcon,
  PersonOff as UserOffIcon,
  Refresh as RefreshIcon,
  ExitToApp as LoginIcon,
  AccessTime as TimeIcon,
  Security as SecurityIcon
} from '@mui/icons-material';

const AuthErrorModal = ({ 
  open, 
  onClose, 
  errorType = 'generic',
  onRetry,
  onLogin 
}) => {
  const getErrorConfig = () => {
    switch (errorType) {
      case 'user-not-found':
        return {
          title: "Usuario No Encontrado",
          message: "Tu cuenta no está registrada en nuestro sistema.",
          detail: "Parece que tu cuenta no ha sido creada aún o ha sido eliminada. Contacta al administrador para obtener acceso al sistema.",
          icon: <UserOffIcon sx={{ fontSize: 40, color: 'error.main' }} />,
          severity: 'warning',
          primaryAction: 'login',
          showRetry: false
        };
      
      case 'token-expired':
        return {
          title: "Sesión Expirada",
          message: "Tu sesión ha expirado por seguridad.",
          detail: "Por tu seguridad, las sesiones expiran automáticamente después de un tiempo. Necesitas iniciar sesión nuevamente para continuar usando el sistema.",
          icon: <TimeIcon sx={{ fontSize: 40, color: 'warning.main' }} />,
          severity: 'warning',
          primaryAction: 'login',
          showRetry: false
        };
      
      case 'invalid-token':
        return {
          title: "Credenciales Inválidas",
          message: "Tus credenciales de acceso no son válidas.",
          detail: "Las credenciales que estás usando no son válidas o han sido modificadas. Inicia sesión nuevamente para obtener credenciales actualizadas.",
          icon: <SecurityIcon sx={{ fontSize: 40, color: 'error.main' }} />,
          severity: 'error',
          primaryAction: 'login',
          showRetry: false
        };
      
      case 'no-token':
        return {
          title: "Acceso Restringido",
          message: "Necesitas iniciar sesión para continuar.",
          detail: "Esta funcionalidad requiere que estés autenticado en el sistema. Por favor, inicia sesión para acceder.",
          icon: <LoginIcon sx={{ fontSize: 40, color: 'info.main' }} />,
          severity: 'info',
          primaryAction: 'login',
          showRetry: false
        };
      
      case 'server-error':
        return {
          title: "Error del Servidor",
          message: "Hay un problema temporal con nuestros servidores.",
          detail: "Estamos experimentando dificultades técnicas temporales. Por favor, intenta nuevamente en unos momentos.",
          icon: <ErrorIcon sx={{ fontSize: 40, color: 'error.main' }} />,
          severity: 'error',
          primaryAction: 'retry',
          showRetry: true
        };
      
      default:
        return {
          title: "Error de Autenticación",
          message: "Hubo un problema al verificar tu sesión.",
          detail: "No pudimos verificar tu identidad. Esto puede deberse a un problema temporal o a credenciales expiradas.",
          icon: <ErrorIcon sx={{ fontSize: 40, color: 'error.main' }} />,
          severity: 'error',
          primaryAction: 'login',
          showRetry: true
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
    onClose();
  };

  const handleLogin = () => {
    if (onLogin) {
      onLogin();
    } else {
      window.location.href = '/login';
    }
    onClose();
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 2 }
      }}
    >
      <DialogTitle sx={{ textAlign: 'center', pt: 3 }}>
        <Stack spacing={2} alignItems="center">
          {config.icon}
          <Typography variant="h5" component="h2">
            {config.title}
          </Typography>
        </Stack>
      </DialogTitle>
      
      <DialogContent sx={{ px: 3, py: 2 }}>
        <Stack spacing={3}>
          <Alert severity={config.severity}>
            <AlertTitle>{config.message}</AlertTitle>
            {config.detail}
          </Alert>
          
          <Box>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              💡 ¿Qué puedes hacer ahora?
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {config.primaryAction === 'retry' 
                ? "• Intenta la operación nuevamente\n• Verifica tu conexión a internet\n• Si el problema persiste, contacta al soporte técnico"
                : "• Inicia sesión nuevamente con tus credenciales\n• Si no tienes acceso, contacta al administrador\n• Verifica que tu cuenta esté activa"
              }
            </Typography>
          </Box>
        </Stack>
      </DialogContent>
      
      <DialogActions sx={{ p: 3, justifyContent: 'center' }}>
        <Stack direction="row" spacing={2}>
          {config.showRetry && (
            <Button
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={handleRetry}
              size="large"
            >
              Reintentar
            </Button>
          )}
          
          <Button
            variant="contained"
            startIcon={config.primaryAction === 'login' ? <LoginIcon /> : <RefreshIcon />}
            onClick={config.primaryAction === 'login' ? handleLogin : handleRetry}
            size="large"
            color={config.severity === 'error' ? 'error' : 'primary'}
          >
            {config.primaryAction === 'login' ? 'Iniciar Sesión' : 'Reintentar'}
          </Button>
          
          <Button
            variant="text"
            onClick={onClose}
            size="large"
          >
            Cerrar
          </Button>
        </Stack>
      </DialogActions>
    </Dialog>
  );
};

export default AuthErrorModal;