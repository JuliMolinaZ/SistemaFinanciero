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
} from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

const ModalPagoParcial = ({
  selectedCuenta,
  pagoMonto,
  setPagoMonto,
  errorPago,
  handleGuardarPagoParcial,
  handleCerrarPagoModal,
  formatoMoneda,
}) => {
  return (
    <Dialog open onClose={handleCerrarPagoModal} fullWidth maxWidth="sm">
      <DialogTitle
        sx={{
          background: 'linear-gradient(90deg, #64b5f6, #42a5f5)',
          color: 'white',
          fontWeight: 'bold',
          position: 'relative',
        }}
      >
        Ingresar Pago Parcial
        <IconButton
          onClick={handleCerrarPagoModal}
          sx={{ position: 'absolute', right: 8, top: 8, color: 'white' }}
        >
          <FontAwesomeIcon icon={faTimes} />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <Box sx={{ mb: 2 }}>
          <Typography variant="body1">
            <strong>Concepto:</strong> {selectedCuenta.concepto}
          </Typography>
          <Typography variant="body1">
            <strong>Total con IVA:</strong> {formatoMoneda(selectedCuenta.monto_con_iva)}
          </Typography>
          <Typography variant="body1">
            <strong>Pagos Parciales:</strong> {formatoMoneda(selectedCuenta.pagos_parciales || 0)}
          </Typography>
          <Typography variant="body1">
            <strong>Restante:</strong>{' '}
            {formatoMoneda(
              parseFloat(selectedCuenta.monto_con_iva || 0) -
                parseFloat(selectedCuenta.pagos_parciales || 0)
            )}
          </Typography>
        </Box>
        <TextField
          label="Monto del Pago"
          type="number"
          fullWidth
          value={pagoMonto}
          onChange={(e) => setPagoMonto(e.target.value)}
          error={Boolean(errorPago)}
          helperText={errorPago}
          InputLabelProps={{ shrink: true }}
        />
      </DialogContent>
      <DialogActions sx={{ justifyContent: 'center', p: 2 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleGuardarPagoParcial}
          disabled={!pagoMonto || isNaN(pagoMonto) || parseFloat(pagoMonto) <= 0}
          sx={{ px: 4, py: 1 }}
        >
          Guardar Pago
        </Button>
        <Button
          variant="outlined"
          color="secondary"
          onClick={handleCerrarPagoModal}
          sx={{ px: 4, py: 1 }}
        >
          Cancelar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default React.memo(ModalPagoParcial);

