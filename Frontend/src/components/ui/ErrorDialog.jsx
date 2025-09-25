// 🚨 ERROR DIALOG - DIAGNÓSTICO DETALLADO DE ERRORES
// =================================================

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  Button,
  Card,
  CardContent,
  Collapse,
  Typography,
  Box,
  IconButton
} from '@mui/material';
import {
  AlertTriangle,
  Copy,
  ChevronDown,
  ChevronRight,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';
import { createErrorDiagnostic } from '../../lib/errors.js';
import { messages } from '../../lib/messages.js';
import './error-dialog.css';

export function ErrorDialog({
  isOpen,
  onClose,
  error,
  title = "Error Detallado",
  showReportButton = true
}) {
  const [copied, setCopied] = useState(false);
  const [showTechnicalDetails, setShowTechnicalDetails] = useState(false);

  if (!error || !isOpen) return null;

  const handleCopyDiagnostic = async () => {
    try {
      const diagnostic = createErrorDiagnostic(error);
      await navigator.clipboard.writeText(diagnostic);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Error copying diagnostic:', err);
    }
  };

  const handleReportError = () => {
    // TODO: Implementar reporte de errores

  };

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      className="error-dialog"
    >
      <DialogTitle className="error-dialog-title">
        <Box display="flex" alignItems="center" gap={2}>
          <AlertTriangle className="error-dialog-icon-svg" />
          <Box>
            <Typography variant="h6" component="div">
              {title}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Código: {error.code}
            </Typography>
          </Box>
        </Box>
      </DialogTitle>

      <DialogContent className="error-dialog-content">
        {/* Mensaje principal */}
        <Card className="error-dialog-message">
          <div className="error-dialog-message-content">
            <h3 className="error-dialog-message-title">
              ¿Qué ocurrió?
            </h3>
            <p className="error-dialog-message-text">
              {error.human}
            </p>
          </div>
        </Card>

        {/* Detalles técnicos colapsables */}
        <Card className="error-dialog-technical-card">
          <CardContent>
            <Box 
              display="flex" 
              alignItems="center" 
              gap={1} 
              sx={{ cursor: 'pointer' }}
              onClick={() => setShowTechnicalDetails(!showTechnicalDetails)}
            >
              {showTechnicalDetails ? (
                <ChevronDown className="error-dialog-chevron" />
              ) : (
                <ChevronRight className="error-dialog-chevron" />
              )}
              <Typography variant="subtitle2">Detalles técnicos</Typography>
            </Box>

            <Collapse in={showTechnicalDetails}>
              <Box mt={2} className="error-dialog-technical-content">
                <Box className="error-dialog-technical-details">
                  <Box className="error-dialog-detail-row">
                    <Typography variant="body2" className="error-dialog-detail-label">Código:</Typography>
                    <Typography variant="body2" component="code" className="error-dialog-detail-value">{error.code}</Typography>
                  </Box>

                  <Box className="error-dialog-detail-row">
                    <Typography variant="body2" className="error-dialog-detail-label">Timestamp:</Typography>
                    <Typography variant="body2" component="code" className="error-dialog-detail-value">
                      {new Date().toISOString()}
                    </Typography>
                  </Box>

                  <Box className="error-dialog-detail-row">
                    <Typography variant="body2" className="error-dialog-detail-label">URL:</Typography>
                    <Typography variant="body2" component="code" className="error-dialog-detail-value">
                      {window.location.href}
                    </Typography>
                  </Box>

                  {error.details && Object.keys(error.details).length > 0 && (
                    <Box className="error-dialog-detail-section">
                      <Typography variant="body2" className="error-dialog-detail-label">Detalles:</Typography>
                      <Typography variant="body2" component="pre" className="error-dialog-detail-json">
                        {JSON.stringify(error.details, null, 2)}
                      </Typography>
                    </Box>
                  )}
                </Box>
              </Box>
            </Collapse>
          </CardContent>
        </Card>

        {/* Acciones recomendadas */}
        <Card className="error-dialog-actions-card">
          <div className="error-dialog-actions-content">
            <h3 className="error-dialog-actions-title">
              ¿Qué puedes hacer?
            </h3>
            <ul className="error-dialog-actions-list">
              <li>Intenta recargar la página</li>
              <li>Verifica tu conexión a internet</li>
              <li>Si el problema persiste, contacta al administrador</li>
              {error.code.includes('HTTP_5') && (
                <li>El servidor puede estar temporalmente no disponible</li>
              )}
              {error.code === 'NETWORK_ERROR' && (
                <li>Revisa tu conexión de red</li>
              )}
            </ul>
          </div>
        </Card>
      </DialogContent>

      <DialogActions className="error-dialog-footer">
        <Box display="flex" justifyContent="space-between" width="100%">
          <Box>
            {showReportButton && (
              <Button
                variant="outlined"
                startIcon={<ExternalLink />}
                onClick={handleReportError}
                size="small"
              >
                Reportar Error
              </Button>
            )}
          </Box>

          <Box display="flex" gap={1}>
            <Button
              variant="outlined"
              startIcon={copied ? <CheckCircle2 /> : <Copy />}
              onClick={handleCopyDiagnostic}
              disabled={copied}
              size="small"
            >
              {copied ? 'Copiado' : messages.actions.copyDiagnostic}
            </Button>

            <Button
              variant="contained"
              onClick={onClose}
              color="primary"
            >
              {messages.actions.close}
            </Button>
          </Box>
        </Box>
      </DialogActions>
    </Dialog>
  );
}

// Hook para usar ErrorDialog
export function useErrorDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState(null);

  const showError = (errorData) => {
    setError(errorData);
    setIsOpen(true);
  };

  const hideError = () => {
    setIsOpen(false);
    setError(null);
  };

  return {
    isOpen,
    error,
    showError,
    hideError,
    ErrorDialog: (props) => (
      <ErrorDialog
        isOpen={isOpen}
        onClose={hideError}
        error={error}
        {...props}
      />
    )
  };
}

export default ErrorDialog;