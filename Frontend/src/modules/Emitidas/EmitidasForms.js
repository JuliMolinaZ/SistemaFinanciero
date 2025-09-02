// src/modules/Emitidas/EmitidasForms.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Container,
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  FormControlLabel,
  Checkbox,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  IconButton,
  Tooltip,
  CircularProgress,
  Snackbar,
  Alert,
  Slide,
} from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faEdit,
  faTrash,
  faFilePdf,
  faFileCode,
  faClose,
} from '@fortawesome/free-solid-svg-icons';

// URL base (variable de entorno)
const API_URL = 'http://localhost:5001';

// Componente de transición para el Snackbar
function SlideTransition(props) {
  return <Slide {...props} direction="up" />;
}

// ==================================================
// COMPONENTE: TitleHeader
// ==================================================
const TitleHeader = () => (
  <Typography
    variant="h3"
    component="h1"
    sx={{
      textAlign: 'center',
      mb: 4,
      color: 'var(--color-titulo, #e63946)',
      fontWeight: 'bold',
      textTransform: 'capitalize',
    }}
  >
    CFDIs Emitidos
  </Typography>
);

// ==================================================
// COMPONENTE: CfdiFormDialog
// (Formulario en Dialog para crear/editar CFDI)
// ==================================================
const CfdiFormDialog = ({
  open,
  onClose,
  cfdiData,
  onChange,
  onSubmit,
  isEditing,
  onAddPago,
  onRemovePago,
  onPagoChange,
}) => (
  <Dialog open={open} onClose={onClose} fullWidth maxWidth="md" keepMounted>
    <DialogTitle
      sx={{
        p: 2,
        background: 'linear-gradient(90deg, #ff6b6b, #f94d9a)',
        color: '#fff',
        fontWeight: 'bold',
        position: 'relative',
      }}
    >
      {isEditing ? 'Editar CFDI' : 'Registrar CFDI'}
      <IconButton
        onClick={onClose}
        sx={{
          position: 'absolute',
          right: 8,
          top: 8,
          color: '#fff',
          '&:hover': { color: '#ffeb3b' },
        }}
      >
        <FontAwesomeIcon icon={faClose} />
      </IconButton>
    </DialogTitle>
    <DialogContent sx={{ backgroundColor: '#fff' }}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            label="RFC Receptor"
            name="rfcReceptor"
            value={cfdiData.rfcReceptor}
            onChange={onChange}
            fullWidth
            required
            variant="outlined"
            sx={{ backgroundColor: '#f9f9f9', borderRadius: 1 }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Razón Social"
            name="razonSocial"
            value={cfdiData.razonSocial}
            onChange={onChange}
            fullWidth
            required
            variant="outlined"
            sx={{ backgroundColor: '#f9f9f9', borderRadius: 1 }}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            label="Fecha de Emisión"
            name="fechaEmision"
            type="date"
            value={cfdiData.fechaEmision}
            onChange={onChange}
            fullWidth
            required
            InputLabelProps={{ shrink: true }}
            variant="outlined"
            sx={{ backgroundColor: '#f9f9f9', borderRadius: 1 }}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            label="Subtotal"
            name="subtotal"
            type="number"
            value={cfdiData.subtotal}
            onChange={onChange}
            fullWidth
            inputProps={{ min: "0", step: "0.01" }}
            required
            variant="outlined"
            sx={{ backgroundColor: '#f9f9f9', borderRadius: 1 }}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            label="IVA"
            name="iva"
            type="number"
            value={cfdiData.iva}
            onChange={onChange}
            fullWidth
            inputProps={{ min: "0", step: "0.01" }}
            required
            variant="outlined"
            sx={{ backgroundColor: '#f9f9f9', borderRadius: 1 }}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            label="Total"
            name="total"
            type="number"
            value={cfdiData.total}
            onChange={onChange}
            fullWidth
            inputProps={{ min: "0", step: "0.01" }}
            required
            variant="outlined"
            sx={{ backgroundColor: '#f9f9f9', borderRadius: 1 }}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            label="Clave SAT"
            name="claveSat"
            value={cfdiData.claveSat}
            onChange={onChange}
            fullWidth
            required
            variant="outlined"
            sx={{ backgroundColor: '#f9f9f9', borderRadius: 1 }}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Descripción"
            name="descripcion"
            value={cfdiData.descripcion}
            onChange={onChange}
            fullWidth
            multiline
            rows={3}
            variant="outlined"
            sx={{ backgroundColor: '#f9f9f9', borderRadius: 1 }}
          />
        </Grid>
        {/* Checkboxes */}
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={cfdiData.facturaAdmon}
                  onChange={onChange}
                  name="facturaAdmon"
                />
              }
              label="Factura-Admon"
            />
            <FormControlLabel
              control={<Checkbox checked={cfdiData.pue} onChange={onChange} name="pue" />}
              label="PUE"
            />
            <FormControlLabel
              control={<Checkbox checked={cfdiData.ppd} onChange={onChange} name="ppd" />}
              label="PPD"
            />
          </Box>
        </Grid>
        {/* Pagos múltiples */}
        <Grid item xs={12}>
          <Typography variant="subtitle1" sx={{ mb: 1 }}>
            Pagos
          </Typography>
          {cfdiData.pagos.map((pago, index) => (
            <Box key={index} sx={{ display: 'flex', gap: 1, mb: 1 }}>
              <TextField
                label="Monto"
                type="number"
                value={pago.monto}
                onChange={(e) => onPagoChange(index, 'monto', e.target.value)}
                fullWidth
                inputProps={{ min: "0", step: "0.01" }}
                variant="outlined"
              />
              <TextField
                label="Fecha de Pago"
                type="date"
                value={pago.fechaPago}
                onChange={(e) => onPagoChange(index, 'fechaPago', e.target.value)}
                fullWidth
                InputLabelProps={{ shrink: true }}
                variant="outlined"
              />
              <Button variant="outlined" color="error" onClick={() => onRemovePago(index)}>
                Eliminar
              </Button>
            </Box>
          ))}
          <Button variant="contained" onClick={onAddPago} sx={{ mt: 1 }}>
            Agregar Pago
          </Button>
        </Grid>
        {/* Archivos múltiples */}
        <Grid item xs={12} sm={6}>
          <Typography variant="subtitle1" sx={{ mb: 1 }}>
            Facturas PDF (múltiples)
          </Typography>
          <Button variant="outlined" component="label">
            Seleccionar Archivos
            <input type="file" name="facturasPDF" accept="application/pdf" multiple hidden onChange={onChange} />
          </Button>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography variant="subtitle1" sx={{ mb: 1 }}>
            Facturas XML (múltiples)
          </Typography>
          <Button variant="outlined" component="label">
            Seleccionar Archivos
            <input type="file" name="facturasXML" accept=".xml" multiple hidden onChange={onChange} />
          </Button>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography variant="subtitle1" sx={{ mb: 1 }}>
            Comprobantes de Pago (múltiples)
          </Typography>
          <Button variant="outlined" component="label">
            Seleccionar Archivos
            <input type="file" name="comprobantesPago" multiple hidden onChange={onChange} />
          </Button>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography variant="subtitle1" sx={{ mb: 1 }}>
            Complementos PDF (múltiples)
          </Typography>
          <Button variant="outlined" component="label">
            Seleccionar Archivos
            <input type="file" name="complementosPDF" accept="application/pdf" multiple hidden onChange={onChange} />
          </Button>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="subtitle1" sx={{ mb: 1 }}>
            Complementos XML (múltiples)
          </Typography>
          <Button variant="outlined" component="label">
            Seleccionar Archivos
            <input type="file" name="complementosXML" accept=".xml" multiple hidden onChange={onChange} />
          </Button>
        </Grid>
      </Grid>
    </DialogContent>
    <DialogActions
      sx={{
        p: 2,
        justifyContent: 'center',
        backgroundColor: '#fff',
      }}
    >
      <Button
        type="submit"
        onClick={onSubmit}
        variant="contained"
        sx={{
          backgroundColor: 'var(--color-titulo, #e63946)',
          px: 4,
          py: 1.2,
          fontWeight: 'bold',
          borderRadius: 2,
          transition: 'all 0.3s ease',
          '&:hover': { backgroundColor: '#c12c33', transform: 'scale(1.05)' },
        }}
      >
        {isEditing ? 'Actualizar CFDI' : 'Guardar CFDI'}
      </Button>
    </DialogActions>
  </Dialog>
);

// ==================================================
// COMPONENTE: CfdiTable
// (Tabla para mostrar los CFDIs registrados)
// ==================================================
const CfdiTable = ({ cfdiList, onEdit, onDelete }) => {
  // Función auxiliar para formatear la fecha
  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const yyyy = date.getFullYear();
    let mm = date.getMonth() + 1;
    let dd = date.getDate();
    if (mm < 10) mm = `0${mm}`;
    if (dd < 10) dd = `0${dd}`;
    return `${yyyy}-${mm}-${dd}`;
  };

  // Función auxiliar para formatear números (moneda)
  const formatCurrency = (value) =>
    new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(value);

  return (
    <TableContainer
      component={Paper}
      sx={{
        width: '100%',
        maxWidth: 1100,
        mt: 4,
        mb: 6,
        borderRadius: 2,
        boxShadow: 2,
        mx: 'auto',
      }}
    >
      <Table>
        <TableHead sx={{ backgroundColor: 'var(--color-titulo, #e63946)' }}>
          <TableRow>
            <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>RFC Receptor</TableCell>
            <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Razón Social</TableCell>
            <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Fecha Emisión</TableCell>
            <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Subtotal</TableCell>
            <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>IVA</TableCell>
            <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Total</TableCell>
            <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Clave SAT</TableCell>
            <TableCell sx={{ color: '#fff', fontWeight: 'bold', textAlign: 'center' }}>Acciones</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {Array.isArray(cfdiList) && cfdiList.length > 0 ? (
            cfdiList.map((cfdi) => (
            <TableRow key={cfdi.id} sx={{ '&:hover': { backgroundColor: '#fefefe' } }}>
              <TableCell>{cfdi.rfcReceptor}</TableCell>
              <TableCell>{cfdi.razonSocial}</TableCell>
              <TableCell>{formatDate(cfdi.fechaEmision)}</TableCell>
              <TableCell>{formatCurrency(cfdi.subtotal)}</TableCell>
              <TableCell>{formatCurrency(cfdi.iva)}</TableCell>
              <TableCell>{formatCurrency(cfdi.total)}</TableCell>
              <TableCell>{cfdi.claveSat}</TableCell>
              <TableCell sx={{ textAlign: 'center' }}>
                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                  <Tooltip title="Editar">
                    <IconButton
                      onClick={() => onEdit(cfdi.id)}
                      sx={{
                        backgroundColor: '#4caf50',
                        color: '#fff',
                        '&:hover': { backgroundColor: '#45a049' },
                      }}
                    >
                      <FontAwesomeIcon icon={faEdit} />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Eliminar">
                    <IconButton
                      onClick={() => onDelete(cfdi.id)}
                      sx={{
                        backgroundColor: '#f44336',
                        color: '#fff',
                        '&:hover': { backgroundColor: '#d32f2f' },
                      }}
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </IconButton>
                  </Tooltip>
                  {cfdi.facturasPDF && cfdi.facturasPDF.length > 0 && (
                    <a href={`${API_URL}/uploads/${cfdi.facturasPDF[0]}`} target="_blank" rel="noopener noreferrer">
                      <Tooltip title="Ver Factura PDF">
                        <IconButton
                          sx={{
                            backgroundColor: '#d32f2f',
                            color: '#fff',
                            '&:hover': { backgroundColor: '#b71c1c' },
                          }}
                        >
                          <FontAwesomeIcon icon={faFilePdf} />
                        </IconButton>
                      </Tooltip>
                    </a>
                  )}
                  {cfdi.facturasXML && cfdi.facturasXML.length > 0 && (
                    <a href={`${API_URL}/uploads/${cfdi.facturasXML[0]}`} target="_blank" rel="noopener noreferrer">
                      <Tooltip title="Ver Factura XML">
                        <IconButton
                          sx={{
                            backgroundColor: '#1976d2',
                            color: '#fff',
                            '&:hover': { backgroundColor: '#115293' },
                          }}
                        >
                          <FontAwesomeIcon icon={faFileCode} />
                        </IconButton>
                      </Tooltip>
                    </a>
                  )}
                </Box>
              </TableCell>
            </TableRow>
          ))
          ) : (
            <TableRow>
              <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                {loading ? 'Cargando CFDIs...' : 'No hay CFDIs registrados'}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

// ==================================================
// COMPONENTE PRINCIPAL: EmitidasForms
// ==================================================
const EmitidasForms = () => {
  const [cfdiList, setCfdiList] = useState([]);
  const [cfdiData, setCfdiData] = useState({
    rfcReceptor: '',
    razonSocial: '',
    fechaEmision: '',
    subtotal: '',
    iva: '',
    total: '',
    claveSat: '',
    descripcion: '',
    facturaAdmon: false,
    pue: false,
    ppd: false,
    pagos: [],
    facturasPDF: [],
    facturasXML: [],
    comprobantesPago: [],
    complementosPDF: [],
    complementosXML: [],
  });
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  // Estado para notificaciones (Snackbar)
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') return;
    setSnackbar({ ...snackbar, open: false });
  };

  useEffect(() => {
    fetchCfdis();
  }, []);

  // Asegurar que cfdiList siempre sea un array
  useEffect(() => {
    if (!Array.isArray(cfdiList)) {
      setCfdiList([]);
    }
  }, [cfdiList]);

  const fetchCfdis = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/emitidas`);
      if (response.data && response.data.success) {
        setCfdiList(response.data.data);
      } else {
        setCfdiList([]);
      }
    } catch (error) {
      console.error('Error al obtener CFDIs:', error);
      setSnackbar({
        open: true,
        message: 'No se pudo obtener los CFDIs.',
        severity: 'error',
      });
      setCfdiList([]);
    } finally {
      setLoading(false);
    }
  };

  const resetFormulario = () => {
    setIsEditing(false);
    setEditingId(null);
    setCfdiData({
      rfcReceptor: '',
      razonSocial: '',
      fechaEmision: '',
      subtotal: '',
      iva: '',
      total: '',
      claveSat: '',
      descripcion: '',
      facturaAdmon: false,
      pue: false,
      ppd: false,
      pagos: [],
      facturasPDF: [],
      facturasXML: [],
      comprobantesPago: [],
      complementosPDF: [],
      complementosXML: [],
    });
    setError('');
  };

  const toggleForm = () => {
    if (showForm) {
      resetFormulario();
    }
    setShowForm((prev) => !prev);
  };

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (files && files.length) {
      setCfdiData((prev) => ({
        ...prev,
        [name]: Array.from(files),
      }));
      return;
    }
    if (type === 'checkbox') {
      setCfdiData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setCfdiData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Funciones para manejar pagos
  const handleAddPago = () => {
    setCfdiData((prev) => ({
      ...prev,
      pagos: [...prev.pagos, { monto: '', fechaPago: '' }],
    }));
  };

  const handleRemovePago = (index) => {
    setCfdiData((prev) => ({
      ...prev,
      pagos: prev.pagos.filter((_, i) => i !== index),
    }));
  };

  const handlePagoChange = (index, field, val) => {
    setCfdiData((prev) => {
      const pagosActualizados = [...prev.pagos];
      pagosActualizados[index][field] = val;
      return { ...prev, pagos: pagosActualizados };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const formData = new FormData();
      formData.append('rfcReceptor', cfdiData.rfcReceptor);
      formData.append('razonSocial', cfdiData.razonSocial);
      formData.append('fechaEmision', cfdiData.fechaEmision);
      formData.append('subtotal', cfdiData.subtotal);
      formData.append('iva', cfdiData.iva);
      formData.append('total', cfdiData.total);
      formData.append('claveSat', cfdiData.claveSat);
      formData.append('descripcion', cfdiData.descripcion);
      formData.append('facturaAdmon', cfdiData.facturaAdmon);
      formData.append('pue', cfdiData.pue);
      formData.append('ppd', cfdiData.ppd);
      // Guardamos los pagos como string JSON
      formData.append('pagos', JSON.stringify(cfdiData.pagos));
      // Archivos
      cfdiData.facturasPDF.forEach((file) => {
        formData.append('facturasPDF', file);
      });
      cfdiData.facturasXML.forEach((file) => {
        formData.append('facturasXML', file);
      });
      cfdiData.comprobantesPago.forEach((file) => {
        formData.append('comprobantesPago', file);
      });
      cfdiData.complementosPDF.forEach((file) => {
        formData.append('complementosPDF', file);
      });
      cfdiData.complementosXML.forEach((file) => {
        formData.append('complementosXML', file);
      });

      if (isEditing) {
        await axios.put(`${API_URL}/api/emitidas/${editingId}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        setSnackbar({
          open: true,
          message: 'CFDI actualizado exitosamente.',
          severity: 'success',
        });
      } else {
        await axios.post(`${API_URL}/api/emitidas`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        setSnackbar({
          open: true,
          message: 'CFDI registrado exitosamente.',
          severity: 'success',
        });
      }
      resetFormulario();
      fetchCfdis();
      setShowForm(false);
    } catch (err) {
      console.error('Error al enviar CFDI:', err);
      setError('Error al enviar CFDI');
      setSnackbar({
        open: true,
        message: 'Error al enviar CFDI.',
        severity: 'error',
      });
    }
  };

  // Función auxiliar para formatear fecha para input type="date"
  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const yyyy = date.getFullYear();
    let mm = date.getMonth() + 1;
    let dd = date.getDate();
    if (mm < 10) mm = `0${mm}`;
    if (dd < 10) dd = `0${dd}`;
    return `${yyyy}-${mm}-${dd}`;
  };

  const handleEdit = (id) => {
    const cfdiToEdit = cfdiList.find((c) => c.id === id);
    setCfdiData({
      rfcReceptor: cfdiToEdit.rfcReceptor,
      razonSocial: cfdiToEdit.razonSocial,
      fechaEmision: formatDate(cfdiToEdit.fechaEmision),
      subtotal: cfdiToEdit.subtotal,
      iva: cfdiToEdit.iva,
      total: cfdiToEdit.total,
      claveSat: cfdiToEdit.claveSat,
      descripcion: cfdiToEdit.descripcion,
      facturaAdmon: cfdiToEdit.facturaAdmon,
      pue: cfdiToEdit.pue,
      ppd: cfdiToEdit.ppd,
      pagos: cfdiToEdit.pagos || [],
      facturasPDF: [],
      facturasXML: [],
      comprobantesPago: [],
      complementosPDF: [],
      complementosXML: [],
    });
    setIsEditing(true);
    setEditingId(id);
    setShowForm(true);
    setError('');
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Seguro que deseas eliminar este CFDI?')) return;
    try {
      await axios.delete(`${API_URL}/api/emitidas/${id}`);
      setCfdiList(cfdiList.filter((c) => c.id !== id));
      setSnackbar({
        open: true,
        message: 'CFDI eliminado exitosamente.',
        severity: 'success',
      });
    } catch (error) {
      console.error('Error al eliminar CFDI:', error);
      setSnackbar({
        open: true,
        message: 'Error al eliminar CFDI.',
        severity: 'error',
      });
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container
      sx={{
        py: 4,
        backgroundColor: 'var(--color-fondo, #f5f5f5)',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <TitleHeader />
      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 2 }}>
        <Button
          onClick={toggleForm}
          variant="contained"
          sx={{
            backgroundColor: 'var(--color-titulo, #e63946)',
            color: '#fff',
            fontWeight: 600,
            px: 2,
            py: 1,
            borderRadius: 2,
            transition: 'background 0.3s, transform 0.3s',
            '&:hover': { backgroundColor: '#c12c33', transform: 'scale(1.05)' },
          }}
        >
          {showForm ? 'Cerrar formulario' : 'Registrar CFDI'}
        </Button>
      </Box>
      {showForm && (
        <CfdiFormDialog
          open={showForm}
          onClose={toggleForm}
          cfdiData={cfdiData}
          onChange={handleChange}
          onSubmit={handleSubmit}
          isEditing={isEditing}
          onAddPago={handleAddPago}
          onRemovePago={handleRemovePago}
          onPagoChange={handlePagoChange}
        />
      )}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <CfdiTable cfdiList={cfdiList} onEdit={handleEdit} onDelete={handleDelete} />
      )}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        TransitionComponent={SlideTransition}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} variant="filled" sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default EmitidasForms;