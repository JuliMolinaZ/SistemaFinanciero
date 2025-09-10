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
  Table,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  IconButton,
  Grid,
  MenuItem,
  InputAdornment,
  Snackbar,
  Alert,
  Slide,
  Collapse
} from '@mui/material';

import { styled } from '@mui/material/styles';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import PaymentIcon from '@mui/icons-material/Payment';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CloseIcon from '@mui/icons-material/Close';

// Transición para Snackbar
function SlideTransition(props) {
  return <Slide {...props} direction="left" />;
}

// Botón para expandir (mostrar complementos)
const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
}));

// Función para formatear la fecha en un formato legible
const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('es-MX', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:8765';

const CuentasCobrarForm = () => {
  const [cuentas, setCuentas] = useState([]);
  const [proyectos, setProyectos] = useState([]);
  const [cuenta, setCuenta] = useState({
    proyecto_id: '',
    concepto: '',
    monto_sin_iva: '',
    monto_con_iva: '',
    fecha: ''
  });
  const [openDialog, setOpenDialog] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [filterByMonth, setFilterByMonth] = useState('');
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  // Estados para complementos de pago
  const [expandedRows, setExpandedRows] = useState([]); // ids de cuentas expandidas
  const [complementosByCuenta, setComplementosByCuenta] = useState({}); // { cuentaId: [complementos] }
  const [openComplementoDialog, setOpenComplementoDialog] = useState(false);
  const [selectedCuentaId, setSelectedCuentaId] = useState(null);
  const [complemento, setComplemento] = useState({
    fecha_pago: '',
    concepto: '',
    monto_sin_iva: '',
    monto_con_iva: ''
  });
  // Estados para edición de complemento
  const [isEditingComplement, setIsEditingComplement] = useState(false);
  const [editingComplementId, setEditingComplementId] = useState(null);

  // Manejo del snackbar
  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') return;
    setSnackbar({ ...snackbar, open: false });
  };

  useEffect(() => {
    fetchCuentas();
    fetchProyectos();
  }, []);

  // Obtener cuentas por cobrar y además precargar los complementos para cada cuenta
  const fetchCuentas = async () => {
    try {
      const response = await axios.get('/api/cuentas-cobrar');
      setCuentas(response.data);
      // Prefetch: para cada cuenta, cargar sus complementos
      response.data.forEach(cuenta => {
        fetchComplementos(cuenta.id);
      });
    } catch (error) {
      console.error('Error al obtener cuentas por cobrar:', error.response?.data || error.message);
      setSnackbar({
        open: true,
        message: 'Error al obtener cuentas por cobrar.',
        severity: 'error',
      });
    }
  };

  // Obtener proyectos
  const fetchProyectos = async () => {
    try {
      const response = await axios.get('/api/projects');
      setProyectos(response.data);
    } catch (error) {
      console.error('Error al obtener proyectos:', error.response?.data || error.message);
      setSnackbar({
        open: true,
        message: 'Error al obtener proyectos.',
        severity: 'error',
      });
    }
  };

  // Obtener los complementos de pago de una cuenta
  const fetchComplementos = async (cuentaId) => {
    try {
      const response = await axios.get(`/api/complementos-pago/${cuentaId}`);
      setComplementosByCuenta((prev) => ({
        ...prev,
        [cuentaId]: response.data,
      }));
    } catch (error) {
      console.error('Error al obtener complementos:', error.response?.data || error.message);
      setSnackbar({
        open: true,
        message: 'Error al obtener los complementos de pago.',
        severity: 'error',
      });
    }
  };

  // Función para calcular los totales de los complementos de pago (se define antes de calculateTotals)
  const calculateTotalComplementos = (cuentaId, field = 'monto_sin_iva') => {
    const comps = complementosByCuenta[cuentaId] || [];
    return comps.reduce((acc, comp) => acc + parseFloat(comp[field] || 0), 0);
  };

  // Calcular totales generales netos (descontando los complementos de cada cuenta)
  const calculateTotals = () => {
    let totalSinIVA = 0;
    let totalConIVA = 0;
    cuentas.forEach(c => {
      const compSin = calculateTotalComplementos(c.id, 'monto_sin_iva');
      const compCon = calculateTotalComplementos(c.id, 'monto_con_iva');
      totalSinIVA += (parseFloat(c.monto_sin_iva || 0) - compSin);
      totalConIVA += (parseFloat(c.monto_con_iva || 0) - compCon);
    });
    return { totalSinIVA, totalConIVA };
  };

  const { totalSinIVA, totalConIVA } = calculateTotals();

  // Filtrar cuentas por mes (suponiendo que la propiedad "fecha" existe)
  const cuentasFiltradas = filterByMonth
    ? cuentas.filter((c) => new Date(c.fecha).getMonth() + 1 === parseInt(filterByMonth))
    : cuentas;

  // Formatear moneda
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
    }).format(amount);
  };

  // Alternar el diálogo del formulario de cuenta
  const toggleDialog = () => {
    if (openDialog) {
      setIsEditing(false);
      setEditingId(null);
      setCuenta({
        proyecto_id: '',
        concepto: '',
        monto_sin_iva: '',
        monto_con_iva: '',
        fecha: ''
      });
    }
    setOpenDialog(!openDialog);
  };

  // Manejar cambios en el formulario de cuenta
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCuenta((prev) => ({
      ...prev,
      [name]: value,
      ...(name === 'monto_sin_iva' && {
        monto_con_iva: (parseFloat(value) * 1.16 || 0).toFixed(2),
      }),
    }));
  };

  // Envío del formulario para crear/editar una cuenta
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await axios.put(`/api/cuentas-cobrar/${editingId}`, cuenta);
        setSnackbar({
          open: true,
          message: 'Cuenta actualizada exitosamente.',
          severity: 'success',
        });
      } else {
        await axios.post('/api/cuentas-cobrar', cuenta);
        setSnackbar({
          open: true,
          message: 'Cuenta registrada exitosamente.',
          severity: 'success',
        });
      }
      fetchCuentas();
      toggleDialog();
    } catch (error) {
      console.error('Error al registrar cuenta por cobrar:', error.response?.data || error.message);
      setSnackbar({
        open: true,
        message: 'Error al registrar la cuenta por cobrar.',
        severity: 'error',
      });
    }
  };

  // Iniciar edición de una cuenta
  const handleEdit = (id) => {
    const cuentaToEdit = cuentas.find((c) => c.id === id);
    setCuenta(cuentaToEdit);
    setIsEditing(true);
    setEditingId(id);
    setOpenDialog(true);
  };

  // Eliminar una cuenta por cobrar
  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar esta cuenta por cobrar?')) return;
    try {
      await axios.delete(`/api/cuentas-cobrar/${id}`);
      setCuentas(cuentas.filter((c) => c.id !== id));
      setSnackbar({
        open: true,
        message: 'Cuenta eliminada exitosamente.',
        severity: 'success',
      });
    } catch (error) {
      console.error('Error al eliminar cuenta por cobrar:', error.response?.data || error.message);
      setSnackbar({
        open: true,
        message: 'Error al eliminar la cuenta.',
        severity: 'error',
      });
    }
  };

  // Alternar la expansión de una fila para mostrar complementos
  const handleExpandClick = (cuentaId) => {
    const isExpanded = expandedRows.includes(cuentaId);
    if (isExpanded) {
      setExpandedRows(expandedRows.filter((id) => id !== cuentaId));
    } else {
      setExpandedRows([...expandedRows, cuentaId]);
      if (!complementosByCuenta[cuentaId]) {
        fetchComplementos(cuentaId);
      }
    }
  };

  // Abrir diálogo para agregar o editar un complemento
  // Si se pasa un objeto "comp" se entiende que se está editando
  const handleOpenComplementoDialog = (cuentaId, comp = null) => {
    setSelectedCuentaId(cuentaId);
    if (comp) {
      setIsEditingComplement(true);
      setEditingComplementId(comp.id);
      setComplemento({
        fecha_pago: comp.fecha_pago,
        concepto: comp.concepto,
        monto_sin_iva: comp.monto_sin_iva,
        monto_con_iva: comp.monto_con_iva
      });
    } else {
      setIsEditingComplement(false);
      setEditingComplementId(null);
      setComplemento({
        fecha_pago: '',
        concepto: '',
        monto_sin_iva: '',
        monto_con_iva: ''
      });
    }
    setOpenComplementoDialog(true);
  };

  // Función para iniciar la edición de un complemento desde la tabla
  const handleEditComplemento = (comp, cuentaId) => {
    handleOpenComplementoDialog(cuentaId, comp);
  };

  // Cerrar diálogo de complemento y resetear estados de edición
  const handleCloseComplementoDialog = () => {
    setOpenComplementoDialog(false);
    setSelectedCuentaId(null);
    setIsEditingComplement(false);
    setEditingComplementId(null);
    setComplemento({
      fecha_pago: '',
      concepto: '',
      monto_sin_iva: '',
      monto_con_iva: ''
    });
  };

  // Manejar cambios en el formulario de complemento
  const handleComplementoChange = (e) => {
    const { name, value } = e.target;
    setComplemento((prev) => ({
      ...prev,
      [name]: value,
      ...(name === 'monto_sin_iva' && {
        monto_con_iva: (parseFloat(value) * 1.16 || 0).toFixed(2),
      }),
    }));
  };

  // Enviar formulario para crear o editar un complemento
  const handleComplementoSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditingComplement) {
        await axios.put(`/api/complementos-pago/${editingComplementId}`, complemento);
        setSnackbar({
          open: true,
          message: 'Complemento actualizado exitosamente.',
          severity: 'success',
        });
      } else {
        await axios.post(`/api/complementos-pago/${selectedCuentaId}`, complemento);
        setSnackbar({
          open: true,
          message: 'Complemento agregado exitosamente.',
          severity: 'success',
        });
      }
      fetchComplementos(selectedCuentaId);
      handleCloseComplementoDialog();
    } catch (error) {
      console.error('Error al guardar complemento:', error.response?.data || error.message);
      setSnackbar({
        open: true,
        message: 'Error al guardar el complemento.',
        severity: 'error',
      });
    }
  };

  // Función para eliminar un complemento de pago
  const handleDeleteComplemento = async (complementoId, cuentaId) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar este complemento?')) return;
    try {
      await axios.delete(`/api/complementos-pago/${complementoId}`);
      setSnackbar({
        open: true,
        message: 'Complemento eliminado exitosamente.',
        severity: 'success',
      });
      // Recargar los complementos de la cuenta para actualizar la UI
      fetchComplementos(cuentaId);
    } catch (error) {
      console.error('Error al eliminar complemento:', error.response?.data || error.message);
      setSnackbar({
        open: true,
        message: 'Error al eliminar el complemento.',
        severity: 'error',
      });
    }
  };

  return (
    <Container sx={{ py: 4, maxWidth: '1200px' }}>
      {/* Título */}
      <Typography
        variant="h3"
        gutterBottom
        sx={{
          textAlign: 'center',
          textTransform: 'uppercase',
          fontWeight: 'bold',
          letterSpacing: 2,
          color: '#e63946',
          mb: 3,
          textShadow: `1px 1px 0 #000, 3px 3px 0 rgba(0,0,0,0.2)`,
        }}
      >
        Cuentas por Cobrar
      </Typography>

      {/* Botón para abrir el formulario de cuenta */}
      <Grid container justifyContent="center" sx={{ mb: 3 }}>
        <Button
          variant="contained"
          onClick={toggleDialog}
          sx={{
            backgroundColor: '#007bff',
            px: 3,
            py: 1.5,
            fontWeight: 'bold',
            borderRadius: '8px',
            boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
            transition: 'all 0.3s ease',
            '&:hover': { backgroundColor: '#0056b3', transform: 'scale(1.02)' },
          }}
        >
          {openDialog ? 'Cerrar formulario' : 'Registrar Cuenta'}
        </Button>
      </Grid>

      {/* Diálogo para registrar o editar una cuenta */}
      <Dialog open={openDialog} onClose={toggleDialog} fullWidth maxWidth="sm">
        <DialogTitle
          sx={{
            p: 2,
            background: 'linear-gradient(90deg, #ff6b6b, #f94d9a)',
            color: '#fff',
            fontWeight: 'bold',
            position: 'relative',
          }}
        >
          {isEditing ? 'Editar Cuenta' : 'Registrar Cuenta'}
          <IconButton
            aria-label="close"
            onClick={toggleDialog}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: '#fff',
              '&:hover': { color: '#ffeb3b' },
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <Box component="form" onSubmit={handleSubmit} noValidate>
          <DialogContent sx={{ backgroundColor: '#f5f5f5', p: 3 }}>
            <TextField
              select
              margin="dense"
              label="Proyecto"
              name="proyecto_id"
              value={cuenta.proyecto_id}
              onChange={handleChange}
              fullWidth
              required
              variant="outlined"
              sx={{ backgroundColor: '#fff', borderRadius: 1 }}
            >
              <MenuItem value="">
                <em>Seleccione un proyecto</em>
              </MenuItem>
              {proyectos.map((p) => (
                <MenuItem key={p.id} value={p.id}>
                  {p.nombre}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              margin="dense"
              label="Concepto"
              name="concepto"
              value={cuenta.concepto}
              onChange={handleChange}
              fullWidth
              required
              variant="outlined"
              sx={{ backgroundColor: '#fff', borderRadius: 1, mt: 1 }}
            />
            <TextField
              margin="dense"
              label="Monto sin IVA"
              name="monto_sin_iva"
              type="number"
              value={cuenta.monto_sin_iva}
              onChange={handleChange}
              fullWidth
              required
              variant="outlined"
              sx={{ backgroundColor: '#fff', borderRadius: 1, mt: 1 }}
            />
            <TextField
              margin="dense"
              label="Monto con IVA"
              name="monto_con_iva"
              type="number"
              value={cuenta.monto_con_iva}
              InputProps={{ readOnly: true }}
              fullWidth
              variant="outlined"
              sx={{ backgroundColor: '#fff', borderRadius: 1, mt: 1 }}
            />
            <TextField
              margin="dense"
              label="Fecha"
              name="fecha"
              type="date"
              value={cuenta.fecha}
              onChange={handleChange}
              fullWidth
              required
              variant="outlined"
              sx={{ backgroundColor: '#fff', borderRadius: 1, mt: 1 }}
              InputLabelProps={{ shrink: true }}
            />
          </DialogContent>
          <DialogActions
            sx={{
              backgroundColor: '#f5f5f5',
              p: 2,
              justifyContent: 'space-between',
            }}
          >
            <Button onClick={toggleDialog} sx={{ color: '#007bff', fontWeight: 'bold' }}>
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="contained"
              sx={{
                backgroundColor: '#007bff',
                px: 3,
                py: 1.5,
                fontWeight: 'bold',
                borderRadius: '8px',
                boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
                transition: 'all 0.3s ease',
                '&:hover': { backgroundColor: '#0056b3', transform: 'scale(1.02)' },
              }}
            >
              {isEditing ? 'Actualizar Cuenta' : 'Registrar Cuenta'}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>

      {/* Totales Generales (netos, restando los subpagos) */}
      <Grid container spacing={3} justifyContent="center" sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={4}>
          <Box
            sx={{
              p: 2,
              border: '1px solid #ddd',
              borderRadius: '8px',
              background: '#fff',
              boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
              textAlign: 'center',
            }}
          >
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', textTransform: 'uppercase', mb: 1 }}>
              Total sin IVA (neto)
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#007bff' }}>
              {formatCurrency(totalSinIVA)}
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Box
            sx={{
              p: 2,
              border: '1px solid #ddd',
              borderRadius: '8px',
              background: '#fff',
              boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
              textAlign: 'center',
            }}
          >
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', textTransform: 'uppercase', mb: 1 }}>
              Total con IVA (neto)
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#007bff' }}>
              {formatCurrency(totalConIVA)}
            </Typography>
          </Box>
        </Grid>
      </Grid>

      {/* Filtro por Mes */}
      <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <TextField
          select
          label="Filtrar por Mes"
          value={filterByMonth}
          onChange={(e) => setFilterByMonth(e.target.value)}
          variant="outlined"
          size="small"
          sx={{ width: { xs: '90%', sm: '300px' }, borderRadius: '8px' }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
          }}
        >
          <MenuItem value="">
            <em>Todos los meses</em>
          </MenuItem>
          {Array.from({ length: 12 }, (_, i) => (
            <MenuItem key={i + 1} value={i + 1}>
              {new Date(0, i).toLocaleString('default', { month: 'long' })}
            </MenuItem>
          ))}
        </TextField>
      </Box>

      {/* Tabla de Cuentas por Cobrar */}
      <Typography
        variant="h5"
        gutterBottom
        sx={{
          mt: 4,
          textAlign: 'center',
          fontWeight: 'bold',
          letterSpacing: 1,
          textShadow: '1px 1px 2px rgba(0,0,0,0.3)',
        }}
      >
        Cuentas por Cobrar Registradas
      </Typography>
      <TableContainer
        component={Paper}
        sx={{
          mt: 2,
          borderRadius: '16px',
          boxShadow: '0px 6px 12px rgba(0, 0, 0, 0.3)',
          overflow: 'hidden',
        }}
      >
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f4f4f4' }}>
              <TableCell sx={{ fontWeight: 'bold', color: '#333' }}>Proyecto</TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: '#333' }}>Concepto</TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: '#333' }}>Monto sin IVA</TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: '#333' }}>Monto con IVA</TableCell>
              <TableCell align="center" sx={{ fontWeight: 'bold', color: '#333' }}>
                Acciones
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {cuentasFiltradas.map((c) => {
              // Calcular totales de complementos para determinar saldo por cada cuenta
              const totalCompSinIVA = calculateTotalComplementos(c.id, 'monto_sin_iva');
              const totalCompConIVA = calculateTotalComplementos(c.id, 'monto_con_iva');
              const saldoSinIVA = parseFloat(c.monto_sin_iva) - totalCompSinIVA;
              const saldoConIVA = parseFloat(c.monto_con_iva) - totalCompConIVA;

              return (
                <React.Fragment key={c.id}>
                  <TableRow sx={{ '&:hover': { backgroundColor: '#ececec' } }}>
                    <TableCell>
                      {proyectos.find((p) => p.id === c.proyecto_id)?.nombre || 'N/A'}
                    </TableCell>
                    <TableCell>{c.concepto}</TableCell>
                    <TableCell>
                      {formatCurrency(c.monto_sin_iva)} <br />
                      <small style={{ color: 'green' }}>
                        Saldo: {formatCurrency(saldoSinIVA)}
                      </small>
                    </TableCell>
                    <TableCell>
                      {formatCurrency(c.monto_con_iva)} <br />
                      <small style={{ color: 'green' }}>
                        Saldo: {formatCurrency(saldoConIVA)}
                      </small>
                    </TableCell>
                    <TableCell align="center">
                      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                        <IconButton
                          sx={{
                            backgroundColor: '#4caf50',
                            '&:hover': { backgroundColor: '#45a049' },
                          }}
                          onClick={() => handleEdit(c.id)}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          sx={{
                            backgroundColor: '#f44336',
                            '&:hover': { backgroundColor: '#d32f2f' },
                          }}
                          onClick={() => handleDelete(c.id)}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                        <ExpandMore
                          expand={expandedRows.includes(c.id)}
                          onClick={() => handleExpandClick(c.id)}
                          aria-expanded={expandedRows.includes(c.id)}
                          aria-label="mostrar complementos"
                        >
                          <ExpandMoreIcon />
                        </ExpandMore>
                        <IconButton
                          sx={{
                            backgroundColor: '#1976d2',
                            '&:hover': { backgroundColor: '#1565c0' },
                          }}
                          onClick={() => handleOpenComplementoDialog(c.id)}
                        >
                          <PaymentIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </TableCell>
                  </TableRow>
                  {/* Fila expandible para mostrar complementos */}
                  <TableRow>
                    <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                      <Collapse in={expandedRows.includes(c.id)} timeout="auto" unmountOnExit>
                        <Box margin={2} sx={{ backgroundColor: '#f9f9f9', padding: 2, borderRadius: '8px' }}>
                          <Typography variant="subtitle1" gutterBottom component="div">
                            Complementos de Pago
                          </Typography>
                          {complementosByCuenta[c.id] && complementosByCuenta[c.id].length > 0 ? (
                            <Table size="small">
                              <TableHead>
                                <TableRow>
                                  <TableCell>Fecha de Pago</TableCell>
                                  <TableCell>Concepto</TableCell>
                                  <TableCell>Monto sin IVA</TableCell>
                                  <TableCell>Monto con IVA</TableCell>
                                  <TableCell align="center">Acciones</TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {complementosByCuenta[c.id].map((comp) => (
                                  <TableRow key={comp.id}>
                                    <TableCell>{formatDate(comp.fecha_pago)}</TableCell>
                                    <TableCell>{comp.concepto}</TableCell>
                                    <TableCell>{formatCurrency(comp.monto_sin_iva)}</TableCell>
                                    <TableCell>{formatCurrency(comp.monto_con_iva)}</TableCell>
                                    <TableCell align="center">
                                      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                                        <IconButton
                                          sx={{
                                            backgroundColor: '#4caf50',
                                            '&:hover': { backgroundColor: '#45a049' },
                                          }}
                                          onClick={() => handleEditComplemento(comp, c.id)}
                                        >
                                          <EditIcon fontSize="small" />
                                        </IconButton>
                                        <IconButton
                                          sx={{
                                            backgroundColor: '#f44336',
                                            '&:hover': { backgroundColor: '#d32f2f' },
                                          }}
                                          onClick={() => handleDeleteComplemento(comp.id, c.id)}
                                        >
                                          <DeleteIcon fontSize="small" />
                                        </IconButton>
                                      </Box>
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          ) : (
                            <Typography variant="body2">No hay complementos registrados.</Typography>
                          )}
                        </Box>
                      </Collapse>
                    </TableCell>
                  </TableRow>
                </React.Fragment>
              );
            })}
            {cuentasFiltradas.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  <Typography variant="body1" color="textSecondary">
                    No se encontraron cuentas.
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Diálogo para agregar/editar un complemento */}
      <Dialog open={openComplementoDialog} onClose={handleCloseComplementoDialog} fullWidth maxWidth="sm">
        <DialogTitle
          sx={{
            p: 2,
            background: 'linear-gradient(90deg, #1976d2, #1565c0)',
            color: '#fff',
            fontWeight: 'bold',
            position: 'relative',
          }}
        >
          {isEditingComplement ? 'Editar Complemento de Pago' : 'Agregar Complemento de Pago'}
          <IconButton
            aria-label="close"
            onClick={handleCloseComplementoDialog}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: '#fff',
              '&:hover': { color: '#ffeb3b' },
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <Box component="form" onSubmit={handleComplementoSubmit} noValidate>
          <DialogContent sx={{ backgroundColor: '#f5f5f5', p: 3 }}>
            <TextField
              margin="dense"
              label="Fecha de Pago"
              name="fecha_pago"
              type="date"
              value={complemento.fecha_pago}
              onChange={handleComplementoChange}
              fullWidth
              required
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              sx={{ backgroundColor: '#fff', borderRadius: 1 }}
            />
            <TextField
              margin="dense"
              label="Concepto"
              name="concepto"
              value={complemento.concepto}
              onChange={handleComplementoChange}
              fullWidth
              required
              variant="outlined"
              sx={{ backgroundColor: '#fff', borderRadius: 1, mt: 1 }}
            />
            <TextField
              margin="dense"
              label="Monto sin IVA"
              name="monto_sin_iva"
              type="number"
              value={complemento.monto_sin_iva}
              onChange={handleComplementoChange}
              fullWidth
              required
              variant="outlined"
              sx={{ backgroundColor: '#fff', borderRadius: 1, mt: 1 }}
            />
            <TextField
              margin="dense"
              label="Monto con IVA"
              name="monto_con_iva"
              type="number"
              value={complemento.monto_con_iva}
              InputProps={{ readOnly: true }}
              fullWidth
              variant="outlined"
              sx={{ backgroundColor: '#fff', borderRadius: 1, mt: 1 }}
            />
          </DialogContent>
          <DialogActions
            sx={{
              backgroundColor: '#f5f5f5',
              p: 2,
              justifyContent: 'space-between',
            }}
          >
            <Button onClick={handleCloseComplementoDialog} sx={{ color: '#1976d2', fontWeight: 'bold' }}>
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="contained"
              sx={{
                backgroundColor: '#1976d2',
                px: 3,
                py: 1.5,
                fontWeight: 'bold',
                borderRadius: '8px',
                boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
                transition: 'all 0.3s ease',
                '&:hover': { backgroundColor: '#1565c0', transform: 'scale(1.02)' },
              }}
            >
              {isEditingComplement ? 'Actualizar Complemento' : 'Agregar Complemento'}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>

      {/* Snackbar para notificaciones */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        TransitionComponent={SlideTransition}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbar.severity} variant="filled" sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default CuentasCobrarForm;
