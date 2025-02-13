// src/modules/Cotizaciones/CotizacionesForm.js
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
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  IconButton,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Tooltip,
  CircularProgress,
  Snackbar,
  Alert,
} from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencilAlt, faTrashAlt, faFilePdf, faClose } from '@fortawesome/free-solid-svg-icons';

// URL base (usa la variable de entorno o localhost)
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// ------------------------------------------------------------------
// COMPONENTE: TitleHeader
// ------------------------------------------------------------------
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
    Cotizaciones
  </Typography>
);

// ------------------------------------------------------------------
// COMPONENTE: CotizacionFormDialog
// (Formulario para crear/editar cotización en un Dialog)
// ------------------------------------------------------------------
const CotizacionFormDialog = ({
  open,
  onClose,
  formData,
  onInputChange,
  onFileChange,
  onSubmit,
  isEditing,
  projects,
  clients,
  uploadProgress,
}) => (
  <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm" keepMounted>
    <DialogTitle
      sx={{
        p: 2,
        background: 'linear-gradient(90deg, #ff6b6b, #f94d9a)',
        color: '#fff',
        fontWeight: 'bold',
        position: 'relative',
      }}
    >
      {isEditing ? 'Actualizar Cotización' : 'Registrar Cotización'}
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
          <FormControl fullWidth required>
            <InputLabel id="cliente-label">Cliente</InputLabel>
            <Select
              labelId="cliente-label"
              name="cliente"
              value={formData.cliente}
              label="Cliente"
              onChange={onInputChange}
            >
              <MenuItem value="">
                <em>Seleccione un cliente...</em>
              </MenuItem>
              {clients.map((client) => (
                <MenuItem key={client.id} value={client.id}>
                  {client.nombre || client.razonSocial || client.nombreCompleto}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth required>
            <InputLabel id="proyecto-label">Proyecto</InputLabel>
            <Select
              labelId="proyecto-label"
              name="proyecto"
              value={formData.proyecto}
              label="Proyecto"
              onChange={onInputChange}
            >
              <MenuItem value="">
                <em>Seleccione un proyecto...</em>
              </MenuItem>
              {projects.map((project) => (
                <MenuItem key={project.id} value={project.id}>
                  {project.nombre || project.titulo || project.proyecto}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Monto sin IVA"
            name="montoSinIVA"
            type="number"
            value={formData.montoSinIVA}
            onChange={onInputChange}
            fullWidth
            required
            inputProps={{ min: 0, step: "0.01" }}
            variant="outlined"
            sx={{ backgroundColor: '#f9f9f9', borderRadius: 1 }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Monto con IVA"
            name="montoConIVA"
            type="number"
            value={formData.montoConIVA}
            InputProps={{ readOnly: true }}
            fullWidth
            variant="outlined"
            sx={{ backgroundColor: '#f9f9f9', borderRadius: 1 }}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Descripción"
            name="descripcion"
            value={formData.descripcion}
            onChange={onInputChange}
            fullWidth
            multiline
            rows={4}
            variant="outlined"
            sx={{ backgroundColor: '#f9f9f9', borderRadius: 1 }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel id="estado-label">Estado</InputLabel>
            <Select
              labelId="estado-label"
              name="estado"
              value={formData.estado}
              label="Estado"
              onChange={onInputChange}
            >
              <MenuItem value="No creada">No creada</MenuItem>
              <MenuItem value="En proceso de aceptación">En proceso de aceptación</MenuItem>
              <MenuItem value="Aceptada por cliente">Aceptada por cliente</MenuItem>
              <MenuItem value="No aceptada">No aceptada</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Button variant="outlined" component="label" fullWidth>
            Adjuntar Cotización (PDF)
            <input
              type="file"
              name="documento"
              accept="application/pdf"
              hidden
              onChange={onFileChange}
            />
          </Button>
        </Grid>
      </Grid>
      {uploadProgress > 0 && (
        <Box sx={{ mt: 2, textAlign: 'center' }}>
          <Typography variant="body2">Subiendo: {uploadProgress}%</Typography>
        </Box>
      )}
    </DialogContent>
    <DialogActions sx={{ p: 2, justifyContent: 'center', backgroundColor: '#fff' }}>
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
        {isEditing ? 'Actualizar Cotización' : 'Crear Cotización'}
      </Button>
    </DialogActions>
  </Dialog>
);

// ------------------------------------------------------------------
// COMPONENTE: CotizacionTable
// (Tabla para mostrar las cotizaciones registradas)
// ------------------------------------------------------------------
const CotizacionTable = ({ cotizaciones, clients, projects, onEdit, onDelete }) => {
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

  // Función auxiliar para formatear números a moneda
  const formatCurrency = (value) => {
    const num = parseFloat(value);
    if (isNaN(num)) return value;
    return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(num);
  };

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
        <TableHead sx={{ backgroundColor: '#343a40' }}>
          <TableRow>
            <TableCell sx={{ fontWeight: 'bold', color: '#fff' }}>Cliente</TableCell>
            <TableCell sx={{ fontWeight: 'bold', color: '#fff' }}>Proyecto</TableCell>
            <TableCell sx={{ fontWeight: 'bold', color: '#fff' }}>Monto sin IVA</TableCell>
            <TableCell sx={{ fontWeight: 'bold', color: '#fff' }}>Monto con IVA</TableCell>
            <TableCell sx={{ fontWeight: 'bold', color: '#fff' }}>Descripción</TableCell>
            <TableCell sx={{ fontWeight: 'bold', color: '#fff' }}>Estado</TableCell>
            <TableCell sx={{ fontWeight: 'bold', color: '#fff' }}>Documento</TableCell>
            <TableCell sx={{ fontWeight: 'bold', color: '#fff', textAlign: 'center' }}>Acciones</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {cotizaciones.length > 0 ? (
            cotizaciones.map((cot) => {
              const clientObj = clients.find((c) => String(c.id) === String(cot.cliente));
              const clientName = clientObj
                ? clientObj.nombre || clientObj.razonSocial || clientObj.nombreCompleto
                : cot.cliente;
              const proj = projects.find((p) => String(p.id) === String(cot.proyecto));
              const projectName = proj ? (proj.nombre || proj.titulo || proj.proyecto) : cot.proyecto;
              return (
                <TableRow key={cot.id} sx={{ '&:hover': { backgroundColor: '#fefefe' } }}>
                  <TableCell>{clientName}</TableCell>
                  <TableCell>{projectName}</TableCell>
                  <TableCell>{formatCurrency(cot.montoSinIVA)}</TableCell>
                  <TableCell>{formatCurrency(cot.montoConIVA)}</TableCell>
                  <TableCell>{cot.descripcion}</TableCell>
                  <TableCell>{cot.estado}</TableCell>
                  <TableCell>
                    {cot.documento ? (
                      <a href={`${API_URL}/uploads/${cot.documento}`} target="_blank" rel="noopener noreferrer">
                        <Tooltip title="Ver PDF">
                          <IconButton sx={{ backgroundColor: '#d32f2f', color: '#fff', '&:hover': { backgroundColor: '#b71c1c' } }}>
                            <FontAwesomeIcon icon={faFilePdf} />
                          </IconButton>
                        </Tooltip>
                      </a>
                    ) : (
                      <IconButton disabled sx={{ opacity: 0.5 }}>
                        <FontAwesomeIcon icon={faFilePdf} />
                      </IconButton>
                    )}
                  </TableCell>
                  <TableCell sx={{ textAlign: 'center' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                      <Tooltip title="Editar">
                        <IconButton
                          onClick={() => onEdit(cot.id)}
                          sx={{ backgroundColor: '#ffc107', color: '#fff', '&:hover': { backgroundColor: '#e0a800' } }}
                        >
                          <FontAwesomeIcon icon={faPencilAlt} />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Eliminar">
                        <IconButton
                          onClick={() => onDelete(cot.id)}
                          sx={{ backgroundColor: '#f44336', color: '#fff', '&:hover': { backgroundColor: '#d32f2f' } }}
                        >
                          <FontAwesomeIcon icon={faTrashAlt} />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              );
            })
          ) : (
            <TableRow>
              <TableCell colSpan={8} sx={{ textAlign: 'center' }}>
                No hay cotizaciones registradas.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

// ------------------------------------------------------------------
// COMPONENTE PRINCIPAL: CotizacionesForm
// ------------------------------------------------------------------
const CotizacionesForm = () => {
  const [cotizaciones, setCotizaciones] = useState([]);
  const [projects, setProjects] = useState([]);
  const [clients, setClients] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    cliente: '',
    proyecto: '',
    montoSinIVA: '',
    montoConIVA: '',
    descripcion: '',
    estado: 'No creada',
  });
  const [documento, setDocumento] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [loading, setLoading] = useState(true);
  // Estado para notificaciones (Snackbar)
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') return;
    setSnackbar({ ...snackbar, open: false });
  };

  // Obtener datos iniciales
  useEffect(() => {
    fetchCotizaciones();
    fetchProjects();
    fetchClients();
  }, []);

  const fetchCotizaciones = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/cotizaciones`);
      setCotizaciones(response.data);
    } catch (error) {
      console.error('Error al obtener cotizaciones:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProjects = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/projects`);
      setProjects(response.data);
    } catch (error) {
      console.error('Error al obtener proyectos:', error);
    }
  };

  const fetchClients = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/clients`);
      setClients(response.data);
    } catch (error) {
      console.error('Error al obtener clientes:', error);
    }
  };

  // Actualizar campos del formulario
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'montoSinIVA') {
      const monto = parseFloat(value);
      setFormData((prev) => ({
        ...prev,
        montoSinIVA: value,
        montoConIVA: !isNaN(monto) ? (monto * 1.16).toFixed(2) : '',
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setDocumento(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('cliente', formData.cliente);
    data.append('proyecto', formData.proyecto);
    data.append('montoSinIVA', formData.montoSinIVA);
    data.append('montoConIVA', formData.montoConIVA);
    data.append('descripcion', formData.descripcion);
    data.append('estado', formData.estado);
    if (documento) {
      data.append('documento', documento);
    }
    try {
      if (editingId) {
        await axios.put(`${API_URL}/api/cotizaciones/${editingId}`, data, {
          headers: { 'Content-Type': 'multipart/form-data' },
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setUploadProgress(percentCompleted);
          },
        });
        setSnackbar({ open: true, message: 'Cotización actualizada con éxito.', severity: 'success' });
      } else {
        await axios.post(`${API_URL}/api/cotizaciones`, data, {
          headers: { 'Content-Type': 'multipart/form-data' },
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setUploadProgress(percentCompleted);
          },
        });
        setSnackbar({ open: true, message: 'Cotización creada con éxito.', severity: 'success' });
      }
      setShowModal(false);
      setEditingId(null);
      setFormData({
        cliente: '',
        proyecto: '',
        montoSinIVA: '',
        montoConIVA: '',
        descripcion: '',
        estado: 'No creada',
      });
      setDocumento(null);
      setUploadProgress(0);
      fetchCotizaciones();
    } catch (error) {
      console.error('Error al crear cotización:', error);
      setSnackbar({ open: true, message: 'Error al crear cotización.', severity: 'error' });
    }
  };

  const handleEdit = (id) => {
    const cot = cotizaciones.find((c) => c.id === id);
    if (cot) {
      setFormData({
        cliente: cot.cliente,
        proyecto: cot.proyecto,
        montoSinIVA: cot.montoSinIVA,
        montoConIVA: cot.montoConIVA,
        descripcion: cot.descripcion,
        estado: cot.estado,
      });
      setEditingId(id);
      setShowModal(true);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Está seguro de que desea eliminar esta cotización?')) {
      try {
        await axios.delete(`${API_URL}/api/cotizaciones/${id}`);
        fetchCotizaciones();
        setSnackbar({ open: true, message: 'Cotización eliminada con éxito.', severity: 'success' });
      } catch (error) {
        console.error('Error al eliminar cotización:', error);
        setSnackbar({ open: true, message: 'Error al eliminar cotización.', severity: 'error' });
      }
    }
  };

  const handleOpenForm = () => {
    setShowModal(true);
    setEditingId(null);
    setFormData({
      cliente: '',
      proyecto: '',
      montoSinIVA: '',
      montoConIVA: '',
      descripcion: '',
      estado: 'No creada',
    });
    setDocumento(null);
  };

  // Funciones auxiliares para formatear fecha y moneda
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

  const formatCurrency = (value) => {
    const num = parseFloat(value);
    if (isNaN(num)) return value;
    return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(num);
  };

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
      <Button
        onClick={handleOpenForm}
        variant="contained"
        sx={{
          backgroundColor: 'var(--color-boton-principal, #007bff)',
          color: '#fff',
          px: 3,
          py: 1,
          fontSize: '1rem',
          fontWeight: 'bold',
          borderRadius: 2,
          transition: 'background 0.3s',
          '&:hover': { backgroundColor: 'var(--color-boton-principal-hover, #0056b3)' },
          mb: 2,
          display: 'block',
          mx: 'auto',
        }}
      >
        Crear Cotización
      </Button>
      {showModal && (
        <CotizacionFormDialog
          open={showModal}
          onClose={() => setShowModal(false)}
          formData={formData}
          onInputChange={handleInputChange}
          onFileChange={handleFileChange}
          onSubmit={handleSubmit}
          isEditing={!!editingId}
          projects={projects}
          clients={clients}
          uploadProgress={uploadProgress}
        />
      )}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <CotizacionTable
          cotizaciones={cotizaciones}
          clients={clients}
          projects={projects}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} variant="filled" sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default CotizacionesForm;





