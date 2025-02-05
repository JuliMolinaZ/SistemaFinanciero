// src/modules/CuentasPorCobrar/CuentasCobrarForm.js
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
  InputAdornment
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';

const CuentasCobrarForm = () => {
  const [cuentas, setCuentas] = useState([]);
  const [proyectos, setProyectos] = useState([]);
  const [cuenta, setCuenta] = useState({
    proyecto_id: '',
    concepto: '',
    monto_sin_iva: '',
    monto_con_iva: ''
  });
  const [openDialog, setOpenDialog] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [filterByMonth, setFilterByMonth] = useState('');

  useEffect(() => {
    fetchCuentas();
    fetchProyectos();
  }, []);

  const fetchCuentas = async () => {
    try {
      const response = await axios.get('https://sigma.runsolutions-services.com/api/cuentas-cobrar');
      setCuentas(response.data);
    } catch (error) {
      console.error('Error al obtener cuentas por cobrar:', error);
    }
  };

  const fetchProyectos = async () => {
    try {
      const response = await axios.get('https://sigma.runsolutions-services.com/api/projects');
      setProyectos(response.data);
    } catch (error) {
      console.error('Error al obtener proyectos:', error);
    }
  };

  const toggleDialog = () => {
    if (openDialog) {
      // Al cerrar se reinician estados
      setIsEditing(false);
      setEditingId(null);
      setCuenta({
        proyecto_id: '',
        concepto: '',
        monto_sin_iva: '',
        monto_con_iva: ''
      });
    }
    setOpenDialog(!openDialog);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCuenta((prev) => ({
      ...prev,
      [name]: value,
      ...(name === 'monto_sin_iva' && {
        monto_con_iva: (parseFloat(value) * 1.16 || 0).toFixed(2)
      })
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await axios.put(`/api/cuentas-cobrar/${editingId}`, cuenta);
      } else {
        await axios.post('/api/cuentas-cobrar', cuenta);
      }
      fetchCuentas();
      toggleDialog();
    } catch (error) {
      console.error('Error al registrar cuenta por cobrar:', error);
    }
  };

  const handleEdit = (id) => {
    const cuentaToEdit = cuentas.find((c) => c.id === id);
    setCuenta(cuentaToEdit);
    setIsEditing(true);
    setEditingId(id);
    setOpenDialog(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar esta cuenta por cobrar?')) return;
    try {
      await axios.delete(`/api/cuentas-cobrar/${id}`);
      setCuentas(cuentas.filter((c) => c.id !== id));
    } catch (error) {
      console.error('Error al eliminar cuenta por cobrar:', error);
    }
  };

  const calculateTotals = () => {
    const totalSinIVA = cuentas.reduce((acc, c) => acc + parseFloat(c.monto_sin_iva || 0), 0);
    const totalConIVA = cuentas.reduce((acc, c) => acc + parseFloat(c.monto_con_iva || 0), 0);
    return { totalSinIVA, totalConIVA };
  };

  const { totalSinIVA, totalConIVA } = calculateTotals();

  // Filtrar cuentas por mes (suponiendo que la propiedad "fecha" está disponible)
  const cuentasFiltradas = filterByMonth
    ? cuentas.filter((c) => new Date(c.fecha).getMonth() + 1 === parseInt(filterByMonth))
    : cuentas;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(amount);
  };

  return (
    <Container sx={{ py: 4, maxWidth: '1200px' }}>
      {/* Título Impactante */}
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
          textShadow: `
            1px 1px 0 #000,
            3px 3px 0 rgba(0,0,0,0.2)
          `,
        }}
      >
        Cuentas por Cobrar
      </Typography>

      {/* Botón para abrir el formulario */}
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

      {/* Diálogo para el Formulario */}
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

      {/* Totales en Cards */}
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
              Total sin IVA
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
              Total con IVA
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
            {cuentasFiltradas.map((c) => (
              <TableRow key={c.id} sx={{ '&:hover': { backgroundColor: '#ececec' } }}>
                <TableCell>
                  {proyectos.find((p) => p.id === c.proyecto_id)?.nombre || 'N/A'}
                </TableCell>
                <TableCell>{c.concepto}</TableCell>
                <TableCell>{formatCurrency(c.monto_sin_iva)}</TableCell>
                <TableCell>{formatCurrency(c.monto_con_iva)}</TableCell>
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
                  </Box>
                </TableCell>
              </TableRow>
            ))}
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
    </Container>
  );
};

export default CuentasCobrarForm;
