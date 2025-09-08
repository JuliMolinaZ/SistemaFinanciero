import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel,
  IconButton,
} from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

const ModalRegistro = ({
  isEditing,
  cuenta,
  handleChange,
  handleCheckboxChange,
  handleSubmit,
  toggleFormModal,
  proveedores,
  categorias,
}) => {
  return (
    <Dialog open onClose={toggleFormModal} fullWidth maxWidth="sm">
      <DialogTitle
        sx={{
          background: 'linear-gradient(90deg, #ff6b6b, #f94d9a)',
          color: '#fff',
          fontWeight: 'bold',
          position: 'relative',
        }}
      >
        {isEditing ? 'Actualizar Cuenta' : 'Registrar Cuenta'}
        <IconButton
          onClick={toggleFormModal}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: '#fff',
          }}
        >
          <FontAwesomeIcon icon={faTimes} />
        </IconButton>
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent dividers>
          <Grid container spacing={2}>
            {/* Concepto */}
            <Grid item xs={12}>
              <TextField
                label="Concepto"
                name="concepto"
                value={cuenta.concepto}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>
            {/* Monto Neto */}
            <Grid item xs={6}>
              <TextField
                label="Monto Neto"
                name="monto_neto"
                type="number"
                value={cuenta.monto_neto}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>
            {/* Checkbox: Requiere IVA */}
            <Grid item xs={6} container alignItems="center">
              <FormControlLabel
                control={
                  <Checkbox
                    checked={cuenta.requiere_iva}
                    onChange={handleCheckboxChange}
                    name="requiere_iva"
                  />
                }
                label="¿Requiere IVA?"
              />
            </Grid>
            {/* Monto con IVA */}
            <Grid item xs={6}>
              <TextField
                label="Monto con IVA"
                name="monto_con_iva"
                type="number"
                value={cuenta.monto_con_iva}
                fullWidth
                InputProps={{ readOnly: true }}
              />
            </Grid>
            {/* Monto Transferencia */}
            <Grid item xs={6}>
              <TextField
                label="Monto Transferencia"
                name="monto_transferencia"
                type="number"
                value={cuenta.monto_transferencia}
                onChange={handleChange}
                fullWidth
              />
            </Grid>
            {/* Monto Efectivo */}
            <Grid item xs={6}>
              <TextField
                label="Monto Efectivo"
                name="monto_efectivo"
                type="number"
                value={cuenta.monto_efectivo}
                onChange={handleChange}
                fullWidth
              />
            </Grid>
            {/* Categoría */}
            <Grid item xs={6}>
              <FormControl fullWidth required>
                <InputLabel id="categoria-label">Categoría</InputLabel>
                <Select
                  labelId="categoria-label"
                  name="categoria"
                  value={cuenta.categoria}
                  onChange={handleChange}
                  label="Categoría"
                >
                  <MenuItem value="">
                    <em>Seleccione...</em>
                  </MenuItem>
                  <MenuItem value="proveedor">Pago a Proveedor</MenuItem>
                  <MenuItem value="otro">Otro</MenuItem>
                  {categorias.map((categoria) => (
                    <MenuItem key={categoria.id} value={categoria.nombre}>
                      {categoria.nombre}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            {/* Proveedor (solo si la categoría es 'proveedor') */}
            {cuenta.categoria === 'proveedor' && (
              <Grid item xs={12}>
                <FormControl fullWidth required>
                  <InputLabel id="proveedor-label">Proveedor</InputLabel>
                  <Select
                    labelId="proveedor-label"
                    name="proveedor_id"
                    value={cuenta.proveedor_id}
                    onChange={handleChange}
                    label="Proveedor"
                  >
                    <MenuItem value="">
                      <em>Seleccione un proveedor</em>
                    </MenuItem>
                    {proveedores.map((p) => (
                      <MenuItem key={p.id} value={p.id}>
                        {p.nombre}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            )}
            {/* Fecha */}
            <Grid item xs={12}>
              <TextField
                label="Fecha"
                name="fecha"
                type="date"
                value={cuenta.fecha}
                onChange={handleChange}
                fullWidth
                required
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', p: 2 }}>
          <Button type="submit" variant="contained" color="primary" sx={{ px: 4, py: 1 }}>
            {isEditing ? 'Actualizar Cuenta' : 'Registrar Cuenta'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default React.memo(ModalRegistro);
