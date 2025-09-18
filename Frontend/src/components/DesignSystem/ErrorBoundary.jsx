// 🛡️ ERROR BOUNDARY UNIFICADO CON RECUPERACIÓN AUTOMÁTICA
// ======================================================

import React, { Component } from 'react';
import {
  Box,
  Typography,
  Container,
  Alert,
  AlertTitle,
  Button,
  Collapse,
  IconButton,
  Chip,
  Stack,
  Paper,
  alpha
} from '@mui/material';
import {
  Error as ErrorIcon,
  Refresh as RefreshIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  BugReport as BugIcon,
  Home as HomeIcon,
  Code as CodeIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { designTheme, styleUtils } from './theme';
import { UnifiedCard, UnifiedButton } from './BaseComponents';

// 🚨 COMPONENTE DE ERROR UNIFICADO
const ErrorDisplay = ({
  error,
  errorInfo,
  onRetry,
  onGoHome,
  showDetails = false,
  severity = 'error'
}) => {
  const [showErrorDetails, setShowErrorDetails] = React.useState(false);
  const [copied, setCopied] = React.useState(false);

  const handleCopyError = async () => {
    const errorData = {
      message: error?.message || 'Error desconocido',
      stack: error?.stack || 'Stack trace no disponible',
      componentStack: errorInfo?.componentStack || 'Component stack no disponible',
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href
    };

    try {
      await navigator.clipboard.writeText(JSON.stringify(errorData, null, 2));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Error al copiar:', err);
    }
  };

  const getErrorType = () => {
    if (error?.name === 'ChunkLoadError') return 'Chunk Load Error';
    if (error?.message?.includes('Loading chunk')) return 'Loading Error';
    if (error?.message?.includes('Network')) return 'Network Error';
    if (error?.message?.includes('404')) return '404 Error';
    if (error?.message?.includes('500')) return 'Server Error';
    return 'JavaScript Error';
  };

  const getErrorSeverity = () => {
    const errorType = getErrorType();
    if (errorType === 'Network Error' || errorType === 'Server Error') return 'warning';
    if (errorType === 'Chunk Load Error' || errorType === 'Loading Error') return 'info';
    return 'error';
  };

  const getErrorMessage = () => {
    const errorType = getErrorType();

    switch (errorType) {
      case 'Chunk Load Error':
      case 'Loading Error':
        return {
          title: 'Error de Carga de Recursos',
          description: 'Algunos recursos de la aplicación no se pudieron cargar. Esto suele ocurrir cuando hay una nueva versión disponible.',
          suggestion: 'Intenta recargar la página o limpiar la caché del navegador.'
        };
      case 'Network Error':
        return {
          title: 'Error de Conexión',
          description: 'No se pudo establecer conexión con el servidor.',
          suggestion: 'Verifica tu conexión a internet e intenta nuevamente.'
        };
      case '404 Error':
        return {
          title: 'Recurso No Encontrado',
          description: 'El recurso solicitado no existe o ha sido movido.',
          suggestion: 'Verifica la URL o regresa al inicio.'
        };
      case 'Server Error':
        return {
          title: 'Error del Servidor',
          description: 'Ocurrió un error en el servidor.',
          suggestion: 'El problema es temporal. Intenta nuevamente en unos momentos.'
        };
      default:
        return {
          title: 'Error Inesperado',
          description: 'Ocurrió un error inesperado en la aplicación.',
          suggestion: 'Por favor, recarga la página o contacta al soporte técnico.'
        };
    }
  };

  const errorDetails = getErrorMessage();
  const currentSeverity = getErrorSeverity();

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <UnifiedCard variant="glass">
          <Box sx={{ p: 4, textAlign: 'center' }}>
            {/* Icono de error animado */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            >
              <Box
                sx={{
                  display: 'inline-flex',
                  p: 3,
                  borderRadius: '50%',
                  backgroundColor: alpha(designTheme.colors.semantic.danger[400], 0.1),
                  border: `2px solid ${designTheme.colors.semantic.danger[400]}`,
                  mb: 3
                }}
              >
                <ErrorIcon
                  sx={{
                    fontSize: 48,
                    color: designTheme.colors.semantic.danger[500]
                  }}
                />
              </Box>
            </motion.div>

            {/* Título del error */}
            <Typography
              variant="h4"
              sx={{
                ...designTheme.typography.h4,
                fontWeight: 700,
                mb: 2,
                color: designTheme.colors.semantic.danger[600]
              }}
            >
              {errorDetails.title}
            </Typography>

            {/* Descripción del error */}
            <Typography
              variant="body1"
              sx={{
                ...designTheme.typography.body1,
                color: designTheme.colors.semantic.neutral[600],
                mb: 1,
                maxWidth: 500,
                mx: 'auto'
              }}
            >
              {errorDetails.description}
            </Typography>

            <Typography
              variant="body2"
              sx={{
                ...designTheme.typography.body2,
                color: designTheme.colors.semantic.neutral[500],
                mb: 4,
                maxWidth: 500,
                mx: 'auto'
              }}
            >
              {errorDetails.suggestion}
            </Typography>

            {/* Chip con tipo de error */}
            <Box sx={{ mb: 4 }}>
              <Chip
                icon={<BugIcon />}
                label={getErrorType()}
                color={currentSeverity}
                variant="outlined"
                sx={{
                  borderRadius: designTheme.borderRadius.full,
                  fontWeight: 500
                }}
              />
            </Box>

            {/* Botones de acción */}
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={2}
              justifyContent="center"
              sx={{ mb: 3 }}
            >
              <UnifiedButton
                variant="primary"
                icon={<RefreshIcon />}
                onClick={onRetry}
                size="large"
              >
                Reintentar
              </UnifiedButton>

              <UnifiedButton
                variant="secondary"
                icon={<HomeIcon />}
                onClick={onGoHome}
                size="large"
              >
                Ir al Inicio
              </UnifiedButton>
            </Stack>

            {/* Toggle para mostrar detalles técnicos */}
            {showDetails && (
              <Box>
                <Button
                  startIcon={showErrorDetails ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                  onClick={() => setShowErrorDetails(!showErrorDetails)}
                  sx={{
                    color: designTheme.colors.semantic.neutral[600],
                    textTransform: 'none',
                    mb: 2
                  }}
                >
                  {showErrorDetails ? 'Ocultar' : 'Mostrar'} detalles técnicos
                </Button>

                <Collapse in={showErrorDetails}>
                  <Paper
                    sx={{
                      p: 3,
                      backgroundColor: designTheme.colors.semantic.neutral[50],
                      borderRadius: designTheme.borderRadius.lg,
                      border: `1px solid ${designTheme.colors.semantic.neutral[200]}`,
                      maxHeight: 300,
                      overflow: 'auto',
                      textAlign: 'left'
                    }}
                  >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <CodeIcon />
                        Información técnica
                      </Typography>

                      <UnifiedButton
                        variant="secondary"
                        size="small"
                        onClick={handleCopyError}
                      >
                        {copied ? 'Copiado!' : 'Copiar Error'}
                      </UnifiedButton>
                    </Box>

                    <Typography variant="body2" sx={{ mb: 2, fontWeight: 600 }}>
                      Mensaje:
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        fontFamily: 'monospace',
                        backgroundColor: designTheme.colors.semantic.danger[50],
                        p: 1,
                        borderRadius: designTheme.borderRadius.sm,
                        mb: 2,
                        wordBreak: 'break-word'
                      }}
                    >
                      {error?.message || 'Mensaje no disponible'}
                    </Typography>

                    {error?.stack && (
                      <>
                        <Typography variant="body2" sx={{ mb: 1, fontWeight: 600 }}>
                          Stack Trace:
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            fontFamily: 'monospace',
                            backgroundColor: designTheme.colors.semantic.neutral[100],
                            p: 1,
                            borderRadius: designTheme.borderRadius.sm,
                            fontSize: '0.75rem',
                            whiteSpace: 'pre-wrap',
                            wordBreak: 'break-word'
                          }}
                        >
                          {error.stack}
                        </Typography>
                      </>
                    )}
                  </Paper>
                </Collapse>
              </Box>
            )}
          </Box>
        </UnifiedCard>
      </motion.div>
    </Container>
  );
};

// 🛡️ ERROR BOUNDARY CLASS COMPONENT
class UnifiedErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: null
    };
  }

  static getDerivedStateFromError(error) {
    return {
      hasError: true,
      error,
      errorId: Date.now().toString()
    };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error capturado por ErrorBoundary:', error, errorInfo);

    this.setState({
      error,
      errorInfo
    });

    // Log del error para analytics/monitoring
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // Reportar error a servicio de monitoreo (ejemplo: Sentry)
    if (window.Sentry) {
      window.Sentry.captureException(error, {
        contexts: {
          react: {
            componentStack: errorInfo.componentStack
          }
        }
      });
    }
  }

  handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: null
    });

    if (this.props.onRetry) {
      this.props.onRetry();
    }
  };

  handleGoHome = () => {
    if (this.props.onGoHome) {
      this.props.onGoHome();
    } else {
      window.location.href = '/';
    }
  };

  render() {
    if (this.state.hasError) {
      // Renderizar UI de error personalizada
      if (this.props.fallback) {
        return this.props.fallback(
          this.state.error,
          this.state.errorInfo,
          this.handleRetry
        );
      }

      return (
        <ErrorDisplay
          error={this.state.error}
          errorInfo={this.state.errorInfo}
          onRetry={this.handleRetry}
          onGoHome={this.handleGoHome}
          showDetails={this.props.showDetails}
          severity={this.props.severity}
        />
      );
    }

    return this.props.children;
  }
}

// 🎯 HOC PARA ENVOLVER COMPONENTES CON ERROR BOUNDARY
export const withErrorBoundary = (WrappedComponent, errorBoundaryProps = {}) => {
  const WithErrorBoundaryComponent = (props) => (
    <UnifiedErrorBoundary {...errorBoundaryProps}>
      <WrappedComponent {...props} />
    </UnifiedErrorBoundary>
  );

  WithErrorBoundaryComponent.displayName =
    `withErrorBoundary(${WrappedComponent.displayName || WrappedComponent.name})`;

  return WithErrorBoundaryComponent;
};

// 🔧 HOOK PARA MANEJO DE ERRORES EN COMPONENTES FUNCIONALES
export const useErrorHandler = () => {
  const [error, setError] = React.useState(null);

  const resetError = React.useCallback(() => {
    setError(null);
  }, []);

  const captureError = React.useCallback((error, errorInfo = {}) => {
    console.error('Error capturado:', error);
    setError({ error, errorInfo });

    // Reportar a servicio de monitoreo
    if (window.Sentry) {
      window.Sentry.captureException(error, {
        extra: errorInfo
      });
    }
  }, []);

  // Auto-reset después de 10 segundos
  React.useEffect(() => {
    if (error) {
      const timer = setTimeout(resetError, 10000);
      return () => clearTimeout(timer);
    }
  }, [error, resetError]);

  return {
    error,
    resetError,
    captureError,
    hasError: !!error
  };
};

export { ErrorDisplay };
export default UnifiedErrorBoundary;