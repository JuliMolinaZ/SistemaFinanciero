// src/modules/CuentasPorPagar/components/ModalPagoParcial.jsx
import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  TextField,
  Button,
  Box,
  IconButton,
  Alert,
  Chip,
  useTheme
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  Close as CloseIcon,
  Payment as PaymentIcon,
  AttachMoney as AttachMoneyIcon,
  Warning as WarningIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';

// Componentes estilizados
const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    borderRadius: 16,
    background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
    border: '1px solid rgba(255,255,255,0.3)',
    boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
  }
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: 12,
    background: 'rgba(255,255,255,0.9)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255,255,255,0.3)',
    transition: 'all 0.3s ease',
    '&:hover': {
      background: 'rgba(255,255,255,0.95)',
      borderColor: 'rgba(102, 126, 234, 0.5)'
    },
    '&.Mui-focused': {
      background: 'rgba(255,255,255,1)',
      borderColor: '#667eea',
      boxShadow: '0 0 0 3px rgba(102, 126, 234, 0.1)'
    }
  }
}));

const ActionButton = styled(Button)(({ theme, variant = 'contained' }) => ({
  borderRadius: 12,
  textTransform: 'none',
  fontWeight: 600,
  padding: theme.spacing(1.5, 3),
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
  }
}));

const ModalPagoParcial = ({
  open,
  onClose,
  cuenta,
  monto,
  setMonto,
  onSubmit,
  error
}) => {
  const theme = useTheme();

  // Función para formatear moneda
  const formatoMoneda = (valor) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 2
    }).format(valor || 0);
  };

  // Si no hay cuenta seleccionada, no mostrar el modal
  if (!open || !cuenta) {
    return null;
  }

  // Calcular montos
  const montoTotal = parseFloat(cuenta.monto_con_iva || 0);
  const pagosParciales = parseFloat(cuenta.pagos_parciales || 0);
  const montoRestante = Math.max(0, montoTotal - pagosParciales);
  const porcentajePagado = montoTotal > 0 ? (pagosParciales / montoTotal) * 100 : 0;

  return (
    <StyledDialog 
      open={open} 
      onClose={onClose} 
      fullWidth 
      maxWidth="sm"
      PaperProps={{
        component: motion.div,
        initial: { opacity: 0, scale: 0.8, y: 20 },
        animate: { opacity: 1, scale: 1, y: 0 },
        exit: { opacity: 0, scale: 0.8, y: -20 },
        transition: { duration: 0.3 }
      }}
    >
      <DialogTitle
        sx={{
          background: 'linear-gradient(135deg, #667eea, #764ba2)',
          color: 'white',
          fontWeight: 700,
          position: 'relative',
          textAlign: 'center',
          py: 3
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
          <PaymentIcon sx={{ fontSize: '1.5rem' }} />
          <Typography variant="h6">
            Registrar Pago Parcial
          </Typography>
        </Box>
        <IconButton
          onClick={onClose}
          sx={{ 
            position: 'absolute', 
            right: 16, 
            top: 16, 
            color: 'white',
            background: 'rgba(255,255,255,0.2)',
            '&:hover': {
              background: 'rgba(255,255,255,0.3)'
            }
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 3 }}>
        {/* Información de la cuenta */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: 'text.primary' }}>
            {cuenta.concepto || 'Sin concepto'}
          </Typography>
          
          {/* Resumen de montos */}
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
            gap: 2, 
            mb: 3 
          }}>
            <Box sx={{ 
              p: 2, 
              bgcolor: 'success.light', 
              borderRadius: 2, 
              textAlign: 'center',
              border: '1px solid rgba(76, 175, 80, 0.3)'
            }}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Total con IVA
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 700, color: 'success.dark' }}>
                {formatoMoneda(montoTotal)}
              </Typography>
            </Box>

            <Box sx={{ 
              p: 2, 
              bgcolor: 'info.light', 
              borderRadius: 2, 
              textAlign: 'center',
              border: '1px solid rgba(33, 150, 243, 0.3)'
            }}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Pagos Realizados
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 700, color: 'info.dark' }}>
                {formatoMoneda(pagosParciales)}
              </Typography>
            </Box>

            <Box sx={{ 
              p: 2, 
              bgcolor: 'warning.light', 
              borderRadius: 2, 
              textAlign: 'center',
              border: '1px solid rgba(255, 152, 0, 0.3)'
            }}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Monto Restante
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 700, color: 'warning.dark' }}>
                {formatoMoneda(montoRestante)}
              </Typography>
            </Box>
          </Box>

          {/* Barra de progreso visual */}
          <Box sx={{ mb: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2" color="text.secondary">
                Progreso de Pago
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                {porcentajePagado.toFixed(1)}%
              </Typography>
            </Box>
            <Box sx={{ 
              width: '100%', 
              height: 8, 
              bgcolor: 'grey.200', 
              borderRadius: 4,
              overflow: 'hidden'
            }}>
              <Box sx={{ 
                width: `${Math.min(porcentajePagado, 100)}%`, 
                height: '100%', 
                bgcolor: porcentajePagado >= 100 ? 'success.main' : 'warning.main',
                transition: 'width 0.3s ease'
              }} />
            </Box>
          </Box>

          {/* Alertas */}
          {montoRestante <= 0 && (
            <Alert 
              severity="success" 
              sx={{ mb: 2 }}
              icon={<PaymentIcon />}
            >
              ¡Esta cuenta ya está completamente pagada!
            </Alert>
          )}

          {montoRestante > 0 && montoRestante < montoTotal * 0.1 && (
            <Alert 
              severity="info" 
              sx={{ mb: 2 }}
              icon={<AttachMoneyIcon />}
            >
              Solo falta un pequeño monto para completar el pago
            </Alert>
          )}
        </Box>

        {/* Campo de monto */}
        <Box sx={{ mb: 2 }}>
          <StyledTextField
            label="Monto del Pago Parcial"
            type="number"
            fullWidth
            value={monto}
            onChange={(e) => setMonto(e.target.value)}
            error={Boolean(error)}
            helperText={error || `Máximo recomendado: ${formatoMoneda(montoRestante)}`}
            InputLabelProps={{ shrink: true }}
            InputProps={{
              startAdornment: <AttachMoneyIcon sx={{ mr: 1, color: 'action.active' }} />,
              inputProps: { 
                step: "0.01", 
                min: "0.01", 
                max: montoRestante 
              }
            }}
            placeholder="0.00"
          />
        </Box>

        {/* Información adicional */}
        <Box sx={{ 
          p: 2, 
          bgcolor: 'rgba(102, 126, 234, 0.1)', 
          borderRadius: 2,
          border: '1px solid rgba(102, 126, 234, 0.2)'
        }}>
          <Typography variant="body2" sx={{ color: 'text.secondary', textAlign: 'center' }}>
            <strong>Nota:</strong> Al registrar este pago, la cuenta se marcará como pagada si el monto 
            cubre completamente el restante pendiente.
          </Typography>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 3, justifyContent: 'center', gap: 2 }}>
        <ActionButton
          variant="outlined"
          onClick={onClose}
          sx={{
            border: '1px solid rgba(102, 126, 234, 0.3)',
            color: '#667eea',
            '&:hover': {
              borderColor: '#667eea',
              background: 'rgba(102, 126, 234, 0.05)'
            }
          }}
        >
          Cancelar
        </ActionButton>
        
        <ActionButton
          variant="contained"
          onClick={onSubmit}
          disabled={!monto || parseFloat(monto) <= 0 || parseFloat(monto) > montoRestante}
          sx={{
            background: 'linear-gradient(135deg, #667eea, #764ba2)',
            color: '#fff',
            '&:hover': {
              background: 'linear-gradient(135deg, #5a6fd8, #6a4190)',
              transform: 'translateY(-2px)'
            },
            '&:disabled': {
              background: 'rgba(0,0,0,0.12)',
              color: 'rgba(0,0,0,0.38)'
            }
          }}
          startIcon={<PaymentIcon />}
        >
          Registrar Pago
        </ActionButton>
      </DialogActions>
    </StyledDialog>
  );
};

export default ModalPagoParcial;

