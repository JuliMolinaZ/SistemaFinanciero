import React from 'react';
import {
  Container,
  Paper,
  Typography,
  Button,
  Stack,
  Alert,
  AlertTitle,
  Box,
  LinearProgress,
  Chip
} from '@mui/material';
import {
  CloudOff as DisconnectedIcon,
  Refresh as RefreshIcon,
  Settings as SettingsIcon,
  Warning as WarningIcon,
  Computer as ServerIcon
} from '@mui/icons-material';

const BackendError = ({ 
  errorType = 'connection', 
  onRetry,
  isRetrying = false 
}) => {
  const getErrorConfig = () => {
    switch (errorType) {
      case 'connection':
        return {
          title: "Sin Conexión al Servidor",
          subtitle: "No podemos conectarnos al servidor en este momento",
          description: "Parece que el servidor está desconectado o hay un problema de red. Esto puede deberse a:",
          icon: <DisconnectedIcon sx={{ fontSize: 80, color: 'error.main' }} />,
          severity: 'error',
          suggestions: [
            "El servidor puede estar iniciándose (espera unos segundos)",
            "Problemas temporales de red",
            "Mantenimiento programado del sistema",
            "El servidor necesita ser reiniciado"
          ],
          actions: "Puedes intentar reconectarte o contactar al administrador del sistema si el problema persiste."
        };
      
      case 'server':
        return {
          title: "Error del Servidor",
          subtitle: "El servidor está experimentando problemas",
          description: "Hay un problema interno en el servidor que está impidiendo el funcionamiento normal:",
          icon: <ServerIcon sx={{ fontSize: 80, color: 'warning.main' }} />,
          severity: 'warning',
          suggestions: [
            "Error interno del servidor",
            "Base de datos temporalmente no disponible",
            "Sobrecarga del sistema",
            "Configuración del servidor necesita atención"
          ],
          actions: "El equipo técnico ha sido notificado. Puedes intentar nuevamente en unos momentos."
        };
      
      default:
        return {
          title: "Problema de Conexión",
          subtitle: "Hay un problema comunicándose con el servidor",
          description: "Se ha detectado un problema de conectividad:",
          icon: <WarningIcon sx={{ fontSize: 80, color: 'warning.main' }} />,
          severity: 'warning',
          suggestions: [
            "Problema de red temporal",
            "El servidor puede estar sobrecargado",
            "Tu conexión a internet puede estar lenta"
          ],
          actions: "Intenta nuevamente en unos momentos."
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

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper 
        elevation={3} 
        sx={{ 
          p: 4, 
          textAlign: 'center',
          borderRadius: 3,
          background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'
        }}
      >
        <Stack spacing={4} alignItems="center">
          {/* Icono principal */}
          <Box sx={{ position: 'relative' }}>
            {config.icon}
            <Chip
              label={errorType === 'connection' ? 'DESCONECTADO' : 'ERROR SERVIDOR'}
              color={errorType === 'connection' ? 'error' : 'warning'}
              size="small"
              sx={{ 
                position: 'absolute', 
                top: -10, 
                right: -20,
                fontWeight: 'bold'
              }}
            />
          </Box>
          
          {/* Título y subtítulo */}
          <Stack spacing={1} alignItems="center">
            <Typography variant="h3" component="h1" gutterBottom>
              {config.title}
            </Typography>
            <Typography variant="h6" color="text.secondary">
              {config.subtitle}
            </Typography>
          </Stack>

          {/* Progreso de reintento */}
          {isRetrying && (
            <Box sx={{ width: '100%', maxWidth: 400 }}>
              <Typography variant="body2" color="primary" gutterBottom>
                Intentando reconectar...
              </Typography>
              <LinearProgress />
            </Box>
          )}
          
          {/* Descripción detallada */}
          <Alert severity={config.severity} sx={{ width: '100%', textAlign: 'left' }}>
            <AlertTitle>¿Qué está pasando?</AlertTitle>
            {config.description}
            <Box component="ul" sx={{ mt: 2, mb: 1 }}>
              {config.suggestions.map((suggestion, index) => (
                <Typography 
                  component="li" 
                  variant="body2" 
                  key={index}
                  sx={{ mb: 0.5 }}
                >
                  {suggestion}
                </Typography>
              ))}
            </Box>
          </Alert>

          {/* Acciones */}
          <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
            <Button
              variant="contained"
              size="large"
              startIcon={<RefreshIcon />}
              onClick={handleRetry}
              disabled={isRetrying}
              sx={{ px: 4 }}
            >
              {isRetrying ? 'Reconectando...' : 'Intentar Nuevamente'}
            </Button>
            
            <Button
              variant="outlined"
              size="large"
              startIcon={<SettingsIcon />}
              onClick={() => window.location.reload()}
              disabled={isRetrying}
            >
              Recargar Página
            </Button>
          </Stack>

          {/* Información adicional */}
          <Alert severity="info" sx={{ width: '100%' }}>
            <Typography variant="body2">
              <strong>💡 ¿Qué puedes hacer?</strong><br />
              {config.actions}
              <br /><br />
              <strong>🔧 Para desarrolladores:</strong><br />
              • Verifica que el servidor backend esté ejecutándose en el puerto 8765<br />
              • Revisa los logs del servidor para errores<br />
              • Asegúrate de que la base de datos esté conectada
            </Typography>
          </Alert>

          {/* Timestamp */}
          <Typography variant="caption" color="text.secondary">
            Último intento: {new Date().toLocaleTimeString()}
          </Typography>
        </Stack>
      </Paper>
    </Container>
  );
};

export default BackendError;