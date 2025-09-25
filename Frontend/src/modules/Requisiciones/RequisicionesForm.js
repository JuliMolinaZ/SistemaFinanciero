// src/modules/Requisiciones/RequisicionesModule.js
import React, { useState, useEffect, useCallback } from 'react';
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
  Switch,
  Snackbar,
  Alert,
  CircularProgress,
  TablePagination,
  InputAdornment,
} from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faClose, faSearch } from '@fortawesome/free-solid-svg-icons';

// Configuración de la URL base para la API
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8765';

// Formateador de moneda MXN
const formatterMXN = new Intl.NumberFormat('es-MX', {
  style: 'currency',
  currency: 'MXN',
  minimumFractionDigits: 2,
});

// ─────────────────────────────────────────────
// Componente: RequisicionesFormDialog
// ─────────────────────────────────────────────
const RequisicionesFormDialog = ({ open, onClose, isEditing, formData, onChange, onSubmit }) => {

  return (
    <Dialog
      open={open}
      onClose={() => { onClose(); }}
      fullWidth
      maxWidth="sm"
      TransitionProps={{ timeout: 300 }}
    >
      <DialogTitle
        sx={{
          background: 'linear-gradient(90deg, #ff6b6b, #f94d9a)',
          color: '#fff',
          fontWeight: 'bold',
          position: 'relative',
          py: 2,
        }}
      >
        {isEditing ? 'Actualizar Requisición' : 'Registrar Requisición'}
        <IconButton
          onClick={() => { onClose(); }}
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
      <form
        onSubmit={(e) => {

          onSubmit(e);
        }}
      >
        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Concepto"
                name="concepto"
                value={formData.concepto}
                onChange={(e) => {

                  onChange(e);
                }}
                fullWidth
                required
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Solicitante"
                name="solicitante"
                value={formData.solicitante}
                onChange={(e) => {

                  onChange(e);
                }}
                fullWidth
                required
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Justificación"
                name="justificacion"
                value={formData.justificacion}
                onChange={(e) => {

                  onChange(e);
                }}
                fullWidth
                required
                multiline
                rows={3}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Área"
                name="area"
                value={formData.area}
                onChange={(e) => {

                  onChange(e);
                }}
                fullWidth
                required
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Fecha requerida"
                name="fecha_requerida"
                type="date"
                value={formData.fecha_requerida}
                onChange={(e) => {

                  onChange(e);
                }}
                fullWidth
                required
                InputLabelProps={{ shrink: true }}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Costos"
                name="costos"
                type="number"
                value={formData.costos}
                onChange={(e) => {

                  onChange(e);
                }}
                fullWidth
                required
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Link de cotizaciones (opcional)"
                name="link_cotizaciones"
                value={formData.link_cotizaciones}
                onChange={(e) => {

                  onChange(e);
                }}
                fullWidth
                variant="outlined"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', p: 2 }}>
          <Button
            // Además de type="submit", agregamos onClick para confirmar que se hace clic
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
            {isEditing ? 'Actualizar Requisición' : 'Registrar Requisición'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

// ─────────────────────────────────────────────
// Componente: RequisicionesTable
// ─────────────────────────────────────────────
const RequisicionesTable = ({ requisiciones, onEdit, onDelete, onToggleApproval }) => {

  const [page, setPage] = useState(0);
  const rowsPerPage = 5;

  const handleChangePage = (event, newPage) => {

    setPage(newPage);
  };

  return (
    <>
      <TableContainer component={Paper} sx={{ mt: 2, borderRadius: 2, boxShadow: 2 }}>
        <Table>
          <TableHead sx={{ backgroundColor: '#333' }}>
            <TableRow>
              <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Concepto</TableCell>
              <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Solicitante</TableCell>
              <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Área</TableCell>
              <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Fecha Requerida</TableCell>
              <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Costos</TableCell>
              <TableCell sx={{ color: '#fff', fontWeight: 'bold' }} align="center">
                Aprob. Gerente
              </TableCell>
              <TableCell sx={{ color: '#fff', fontWeight: 'bold' }} align="center">
                Aprob. Dirección
              </TableCell>
              <TableCell sx={{ color: '#fff', fontWeight: 'bold' }} align="center">
                Acciones
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {requisiciones
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((req) => {

                return (
                  <TableRow key={req.id} hover>
                    <TableCell>{req.concepto}</TableCell>
                    <TableCell>{req.solicitante}</TableCell>
                    <TableCell>{req.area}</TableCell>
                    <TableCell>
                      {req.fecha_requerida ? new Date(req.fecha_requerida).toLocaleDateString() : '-'}
                    </TableCell>
                    <TableCell>{formatterMXN.format(parseFloat(req.costos) || 0)}</TableCell>
                    <TableCell align="center">
                      <Switch
                        checked={!!req.aceptacion_gerente}
                        onChange={() => {

                          onToggleApproval(req.id, 'gerente');
                        }}
                        color="primary"
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Switch
                        checked={!!req.aceptacion_direccion}
                        onChange={() => {

                          onToggleApproval(req.id, 'direccion');
                        }}
                        color="primary"
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                        <Tooltip title="Editar">
                          <IconButton onClick={() => { onEdit(req); }} color="info">
                            <FontAwesomeIcon icon={faEdit} />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Eliminar">
                          <IconButton onClick={() => { onDelete(req.id); }} color="error">
                            <FontAwesomeIcon icon={faTrash} />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        component="div"
        count={requisiciones.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[]}
      />
    </>
  );
};

// ─────────────────────────────────────────────
// Componente Principal: RequisicionesModule
// ─────────────────────────────────────────────
const RequisicionesModule = () => {

  const [requisiciones, setRequisiciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    concepto: '',
    solicitante: '',
    justificacion: '',
    area: '',
    fecha_requerida: '',
    costos: '',
    link_cotizaciones: '',
    aceptacion_gerente: false,
    aceptacion_direccion: false,
  });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [searchText, setSearchText] = useState('');

  // Función para obtener requisiciones desde el backend
  const fetchRequisiciones = useCallback(async () => {

    try {
      setLoading(true);

      const response = await axios.get(`${API_URL}/api/requisiciones`);

      setRequisiciones(response.data);
    } catch (error) {
      console.error(">>> fetchRequisiciones: Error al obtener requisiciones:", error);
      setSnackbar({ open: true, message: 'Error al cargar requisiciones', severity: 'error' });
    } finally {
      setLoading(false);

    }
  }, []);

  useEffect(() => {

    fetchRequisiciones();
  }, [fetchRequisiciones]);

  // Manejo de cambios en los inputs del formulario
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  // Abre o cierra el formulario y resetea si se cierra
  const toggleForm = () => {

    setShowForm((prev) => !prev);
    if (showForm) {

      setIsEditing(false);
      setEditingId(null);
      resetForm();
    }
  };

  const resetForm = () => {

    setFormData({
      concepto: '',
      solicitante: '',
      justificacion: '',
      area: '',
      fecha_requerida: '',
      costos: '',
      link_cotizaciones: '',
      aceptacion_gerente: false,
      aceptacion_direccion: false,
    });
  };

  // Envía el formulario para crear o actualizar la requisición
  const handleSubmitForm = async (e) => {
    e.preventDefault();

    try {
      if (isEditing) {

        await axios.put(`${API_URL}/api/requisiciones/${editingId}`, formData);

        setSnackbar({ open: true, message: 'Requisición actualizada', severity: 'success' });
      } else {

        await axios.post(`${API_URL}/api/requisiciones`, formData);

        setSnackbar({ open: true, message: 'Requisición creada', severity: 'success' });
      }
      await fetchRequisiciones();
      setShowForm(false);
      resetForm();
    } catch (error) {
      console.error(">>> handleSubmitForm: Error al enviar requisición:", error);
      setSnackbar({ open: true, message: 'Error al enviar requisición', severity: 'error' });
    }
  };

  // Prepara el formulario para editar
  const handleEdit = (req) => {

    setFormData({
      concepto: req.concepto,
      solicitante: req.solicitante,
      justificacion: req.justificacion,
      area: req.area,
      fecha_requerida: req.fecha_requerida,
      costos: req.costos,
      link_cotizaciones: req.link_cotizaciones,
      aceptacion_gerente: !!req.aceptacion_gerente,
      aceptacion_direccion: !!req.aceptacion_direccion,
    });
    setIsEditing(true);
    setEditingId(req.id);
    setShowForm(true);
  };

  // Función para eliminar una requisición
  const handleDelete = async (id) => {

    if (window.confirm('¿Estás seguro de eliminar esta requisición?')) {
      try {
        await axios.delete(`${API_URL}/api/requisiciones/${id}`);

        setSnackbar({ open: true, message: 'Requisición eliminada', severity: 'success' });
        await fetchRequisiciones();
      } catch (error) {
        console.error(">>> handleDelete: Error al eliminar requisición:", error);
        setSnackbar({ open: true, message: 'Error al eliminar requisición', severity: 'error' });
      }
    } else {

    }
  };

  // Alterna la aprobación de gerente o dirección
  const handleToggleApproval = async (id, tipo) => {

    try {
      const reqItem = requisiciones.find((r) => r.id === id);
      if (!reqItem) {

        return;
      }
      const updatedData = {
        concepto: reqItem.concepto,
        solicitante: reqItem.solicitante,
        justificacion: reqItem.justificacion,
        area: reqItem.area,
        fecha_requerida: reqItem.fecha_requerida,
        costos: reqItem.costos,
        link_cotizaciones: reqItem.link_cotizaciones,
        aceptacion_gerente: tipo === 'gerente' ? !reqItem.aceptacion_gerente : reqItem.aceptacion_gerente,
        aceptacion_direccion: tipo === 'direccion' ? !reqItem.aceptacion_direccion : reqItem.aceptacion_direccion,
      };

      await axios.put(`${API_URL}/api/requisiciones/${id}`, updatedData);

      setSnackbar({ open: true, message: 'Aprobación actualizada', severity: 'success' });
      await fetchRequisiciones();
    } catch (error) {
      console.error(">>> handleToggleApproval: Error al actualizar aprobación:", error);
      setSnackbar({ open: true, message: 'Error al actualizar aprobación', severity: 'error' });
    }
  };

  const filteredRequisiciones = requisiciones.filter((r) =>
    r.concepto.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <Container sx={{ py: 4, backgroundColor: '#f0f2f5', minHeight: '100vh' }}>
      <Typography variant="h3" align="center" sx={{ mb: 4, color: '#333', fontWeight: 'bold' }}>
        Requisiciones
      </Typography>
      {/* Buscador */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
        <TextField
          placeholder="Buscar por concepto..."
          value={searchText}
          onChange={(e) => {

            setSearchText(e.target.value);
          }}
          variant="outlined"
          size="small"
          sx={{ width: { xs: '100%', md: '400px' } }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <FontAwesomeIcon icon={faSearch} />
              </InputAdornment>
            ),
          }}
        />
      </Box>
      {/* Botón para abrir el formulario */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
        <Button
          variant="contained"
          color="success"
          onClick={() => { 

            setShowForm(true); 
          }}
          sx={{ boxShadow: 2, textTransform: 'none', px: 4, py: 1 }}
        >
          Nueva Requisición
        </Button>
      </Box>
      {showForm && (
        <RequisicionesFormDialog
          open={showForm}
          onClose={() => {

            setShowForm(false);
            resetForm();
          }}
          isEditing={isEditing}
          formData={formData}
          onChange={handleInputChange}
          onSubmit={handleSubmitForm}
        />
      )}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <RequisicionesTable
          requisiciones={filteredRequisiciones}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onToggleApproval={handleToggleApproval}
        />
      )}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => {

          setSnackbar({ ...snackbar, open: false });
        }}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => {

            setSnackbar({ ...snackbar, open: false });
          }}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default RequisicionesModule;

