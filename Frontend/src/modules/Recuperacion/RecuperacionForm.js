// src/modules/Recuperacion/RecuperacionForm.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tooltip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Snackbar,
  Alert,
  CircularProgress,
  TablePagination,
  InputAdornment,
} from '@mui/material';
import { Autocomplete } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faClose, faSearch } from '@fortawesome/free-solid-svg-icons';
import { calcularTotalesRecuperacion } from '../../utils/cuentas';

// Formateador de moneda MXN
const formatterMXN = new Intl.NumberFormat('es-MX', {
  style: 'currency',
  currency: 'MXN',
  minimumFractionDigits: 2,
});

// Opciones para el filtro de mes
const monthOptions = Array.from({ length: 12 }, (_, i) => ({
  label: new Date(0, i).toLocaleString('es', { month: 'long' }),
  value: i + 1,
}));

// ─────────────────────────────────────────────
// RecuperacionFormDialog: Formulario en diálogo para crear/editar
// ─────────────────────────────────────────────
const RecuperacionFormDialog = ({
  open,
  onClose,
  isEditing,
  formData,
  onChange,
  onSubmit,
  clientes,
  proyectos,
}) => {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm" TransitionProps={{ timeout: 300 }}>
      <DialogTitle
        sx={{
          background: 'linear-gradient(90deg, #ff6b6b, #f94d9a)',
          color: '#fff',
          fontWeight: 'bold',
          position: 'relative',
          py: 2,
        }}
      >
        {isEditing ? 'Actualizar Recuperación' : 'Registrar Recuperación'}
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
      <form onSubmit={onSubmit}>
        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Concepto"
                name="concepto"
                value={formData.concepto}
                onChange={onChange}
                fullWidth
                required
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Monto"
                name="monto"
                type="number"
                value={formData.monto}
                onChange={onChange}
                fullWidth
                required
                inputProps={{ step: '0.01', min: '0' }}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Fecha"
                name="fecha"
                type="date"
                value={formData.fecha}
                onChange={onChange}
                fullWidth
                required
                InputLabelProps={{ shrink: true }}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth required variant="outlined">
                <InputLabel id="cliente-label">Cliente</InputLabel>
                <Select
                  labelId="cliente-label"
                  name="cliente_id"
                  value={formData.cliente_id}
                  onChange={onChange}
                  label="Cliente"
                >
                  <MenuItem value="">
                    <em>Seleccione un cliente</em>
                  </MenuItem>
                  {clientes.map((cliente) => (
                    <MenuItem key={cliente.id} value={cliente.id}>
                      {cliente.nombre}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth required variant="outlined">
                <InputLabel id="proyecto-label">Proyecto</InputLabel>
                <Select
                  labelId="proyecto-label"
                  name="proyecto_id"
                  value={formData.proyecto_id}
                  onChange={onChange}
                  label="Proyecto"
                >
                  <MenuItem value="">
                    <em>Seleccione un proyecto</em>
                  </MenuItem>
                  {proyectos.map((proyecto) => (
                    <MenuItem key={proyecto.id} value={proyecto.id}>
                      {proyecto.nombre}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', p: 2 }}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            sx={{
              px: 4,
              py: 1.2,
              fontWeight: 'bold',
              borderRadius: 2,
              boxShadow: 2,
              transition: 'all 0.3s ease',
              '&:hover': { transform: 'scale(1.05)' },
            }}
          >
            {isEditing ? 'Actualizar Recuperación' : 'Registrar Recuperación'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

// ─────────────────────────────────────────────
// RecuperacionTable: Tabla de recuperaciones con paginación
// ─────────────────────────────────────────────
const RecuperacionTable = ({ recuperaciones, onEdit, onDelete, onToggleRecuperado }) => {
  const [page, setPage] = useState(0);
  const rowsPerPage = 5;

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  return (
    <>
      <TableContainer component={Paper} sx={{ mt: 2, borderRadius: 2, boxShadow: 2 }}>
        <Table>
          <TableHead sx={{ backgroundColor: 'grey.800' }}>
            <TableRow>
              <TableCell sx={{ color: '#fff' }}>Concepto</TableCell>
              <TableCell sx={{ color: '#fff' }} align="right">
                Monto
              </TableCell>
              <TableCell sx={{ color: '#fff' }}>Fecha</TableCell>
              <TableCell sx={{ color: '#fff' }} align="center">
                Recuperado
              </TableCell>
              <TableCell sx={{ color: '#fff' }}>Cliente</TableCell>
              <TableCell sx={{ color: '#fff' }}>Proyecto</TableCell>
              <TableCell sx={{ color: '#fff' }} align="center">
                Acciones
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {recuperaciones
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((rec) => (
                <TableRow key={rec.id} hover>
                  <TableCell>{rec.concepto}</TableCell>
                  <TableCell align="right">{formatterMXN.format(parseFloat(rec.monto) || 0)}</TableCell>
                  <TableCell>
                    {rec.fecha ? new Date(rec.fecha).toLocaleDateString('es-MX') : 'Sin fecha'}
                  </TableCell>
                  <TableCell align="center">
                    <Button
                      variant="outlined"
                      size="small"
                      color={rec.recuperado ? 'success' : 'error'}
                      onClick={() => onToggleRecuperado(rec.id)}
                    >
                      {rec.recuperado ? 'Sí' : 'No'}
                    </Button>
                  </TableCell>
                  <TableCell>{rec.cliente_nombre || 'Sin asignar'}</TableCell>
                  <TableCell>{rec.proyecto_nombre || 'Sin asignar'}</TableCell>
                  <TableCell align="center">
                    <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                      <Tooltip title="Editar">
                        <IconButton color="info" onClick={() => onEdit(rec)}>
                          <FontAwesomeIcon icon={faEdit} />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Eliminar">
                        <IconButton color="error" onClick={() => onDelete(rec.id)}>
                          <FontAwesomeIcon icon={faTrash} />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        component="div"
        count={recuperaciones.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[]}
      />
    </>
  );
};

// ─────────────────────────────────────────────
// Componente Principal: RecuperacionForm
// ─────────────────────────────────────────────
const RecuperacionForm = () => {
  const [recuperaciones, setRecuperaciones] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [proyectos, setProyectos] = useState([]);
  const [formData, setFormData] = useState({
    concepto: '',
    monto: '',
    fecha: '',
    cliente_id: '',
    proyecto_id: '',
  });
  const [totales, setTotales] = useState({ totalRecuperado: 0, totalPorRecuperar: 0 });
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(true);

  // Estado para Snackbar (notificaciones)
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Carga inicial de datos
  useEffect(() => {
    fetchRecuperaciones();
    fetchClientes();
    fetchProyectos();
  }, []);

  // Recalcular totales cada vez que cambien las recuperaciones
  useEffect(() => {
    const { totalRecuperado, totalPorRecuperar } = calcularTotalesRecuperacion(recuperaciones);
    setTotales({ totalRecuperado, totalPorRecuperar });
  }, [recuperaciones]);

  const fetchRecuperaciones = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/recuperacion');
      setRecuperaciones(response.data);
    } catch (error) {
      console.error('Error al obtener recuperaciones:', error);
      setSnackbar({ open: true, message: 'Error al cargar recuperaciones', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const fetchClientes = async () => {
    try {
      const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8765';
      const response = await axios.get(`${API_BASE_URL}/api/clients`);
      setClientes(response.data);
    } catch (error) {
      console.error('Error al obtener clientes:', error);
    }
  };

  const fetchProyectos = async () => {
    try {
      const response = await axios.get('/api/projects');
      setProyectos(response.data);
    } catch (error) {
      console.error('Error al obtener proyectos:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const toggleForm = () => {
    setShowForm((prev) => !prev);
    setIsEditing(false);
    setEditingId(null);
    setFormData({
      concepto: '',
      monto: '',
      fecha: '',
      cliente_id: '',
      proyecto_id: '',
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await axios.put(`/api/recuperacion/${editingId}`, formData);
        setSnackbar({ open: true, message: 'Recuperación actualizada correctamente', severity: 'success' });
      } else {
        await axios.post('/api/recuperacion', formData);
        setSnackbar({ open: true, message: 'Recuperación registrada correctamente', severity: 'success' });
      }
      fetchRecuperaciones();
      toggleForm();
    } catch (error) {
      console.error('Error al registrar/actualizar recuperación:', error);
      setSnackbar({ open: true, message: 'Error en la operación', severity: 'error' });
    }
  };

  const handleEdit = (rec) => {
    setFormData({
      concepto: rec.concepto || '',
      monto: rec.monto || '',
      fecha: rec.fecha || '',
      cliente_id: rec.cliente_id || '',
      proyecto_id: rec.proyecto_id || '',
    });
    setIsEditing(true);
    setEditingId(rec.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar esta recuperación?')) return;
    try {
      await axios.delete(`/api/recuperacion/${id}`);
      setSnackbar({ open: true, message: 'Recuperación eliminada', severity: 'success' });
      fetchRecuperaciones();
    } catch (error) {
      console.error('Error al eliminar recuperación:', error);
      setSnackbar({ open: true, message: 'Error al eliminar', severity: 'error' });
    }
  };

  const handleToggleRecuperado = async (id) => {
    try {
      await axios.put(`/api/recuperacion/${id}/toggle`);
      setSnackbar({ open: true, message: 'Estado de recuperación alternado', severity: 'success' });
      fetchRecuperaciones();
    } catch (error) {
      console.error('Error al alternar estado de recuperado:', error);
      setSnackbar({ open: true, message: 'Error al alternar estado', severity: 'error' });
    }
  };

  // Filtrar por mes (si se selecciona) y búsqueda por concepto
  const recuperacionesFiltradas = selectedMonth
    ? recuperaciones.filter((r) => new Date(r.fecha).getMonth() + 1 === selectedMonth.value)
    : recuperaciones;

  const finalRecuperaciones = recuperacionesFiltradas.filter((rec) =>
    rec.concepto.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <Container sx={{ py: 4, backgroundColor: '#f0f2f5', minHeight: '100vh' }}>
      <Typography variant="h3" align="center" sx={{ mb: 4, color: 'red', fontWeight: 'bold' }}>
        MoneyFlow Recovery
      </Typography>

      {/* Cuadro de Totales */}
      <Box
        sx={{
          maxWidth: 400,
          mx: 'auto',
          mb: 4,
          p: 3,
          borderRadius: 2,
          boxShadow: 3,
          backgroundColor: '#fff',
          textAlign: 'center',
        }}
      >
        <Typography variant="h6">
          Total Recuperado:{' '}
          <span style={{ color: 'green', fontWeight: 'bold' }}>
            {formatterMXN.format(totales.totalRecuperado)}
          </span>
        </Typography>
        <Typography variant="h6" sx={{ mt: 1 }}>
          Total Por Recuperar:{' '}
          <span style={{ color: 'red', fontWeight: 'bold' }}>
            {formatterMXN.format(totales.totalPorRecuperar)}
          </span>
        </Typography>
      </Box>

      {/* Filtros: Botón para abrir formulario, Autocomplete para mes y búsqueda */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          gap: 2,
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 2,
        }}
      >
        <Button
          variant="contained"
          color="success"
          onClick={toggleForm}
          sx={{ transition: 'all 0.3s ease', '&:hover': { transform: 'scale(1.05)' } }}
        >
          {showForm ? 'Cerrar formulario' : 'Registrar Recuperación'}
        </Button>
        <Box sx={{ width: { xs: '100%', md: 250 } }}>
          <Autocomplete
            options={monthOptions}
            value={selectedMonth}
            onChange={(event, newValue) => setSelectedMonth(newValue)}
            renderInput={(params) => <TextField {...params} label="Filtrar por Mes" variant="outlined" />}
            clearOnEscape
          />
        </Box>
        <Box sx={{ width: { xs: '100%', md: 250 } }}>
          <TextField
            variant="outlined"
            placeholder="Buscar por concepto..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            size="small"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <FontAwesomeIcon icon={faSearch} />
                </InputAdornment>
              ),
            }}
            fullWidth
          />
        </Box>
      </Box>

      {/* Diálogo con el formulario */}
      <RecuperacionFormDialog
        open={showForm}
        onClose={toggleForm}
        isEditing={isEditing}
        formData={formData}
        onChange={handleChange}
        onSubmit={handleSubmit}
        clientes={clientes}
        proyectos={proyectos}
      />

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <Typography variant="h5" sx={{ mt: 4, mb: 2 }}>
            Recuperaciones Registradas
          </Typography>
          <RecuperacionTable
            recuperaciones={finalRecuperaciones}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onToggleRecuperado={handleToggleRecuperado}
          />
        </>
      )}

      {/* Snackbar para notificaciones */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default RecuperacionForm;