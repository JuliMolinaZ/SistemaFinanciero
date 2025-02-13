// src/modules/Proveedores/ProveedorModule.jsx
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
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  IconButton,
  Fade,
  Snackbar,
  Alert,
  Slide,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';

// Función de transición para el Snackbar
function SlideTransition(props) {
  return <Slide {...props} direction="left" />;
}

// Título principal
const TitleHeader = () => (
  <Typography
    variant="h2"
    component="h1"
    sx={{
      textAlign: 'center',
      fontWeight: 'bold',
      color: 'var(--color-secondary, #e63946)',
      mb: 4,
      textTransform: 'capitalize',
      letterSpacing: 1,
    }}
  >
    Proveedores
  </Typography>
);

// Formulario de Proveedor en Dialog
const ProviderForm = ({ open, onClose, isEditing, formData, onChange, onSubmit }) => {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle
        sx={{
          p: 2,
          background: 'linear-gradient(90deg, #ff6b6b, #f94d9a)',
          color: '#fff',
          fontWeight: 'bold',
          position: 'relative',
        }}
      >
        {isEditing ? 'Actualizar Proveedor' : 'Registrar Proveedor'}
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
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <Box component="form" onSubmit={onSubmit} sx={{ p: 3, backgroundColor: '#fff' }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              label="ID RUN Proveedor"
              name="run_proveedor"
              value={formData.run_proveedor}
              onChange={onChange}
              fullWidth
              required
              variant="outlined"
              sx={{ backgroundColor: '#f9f9f9', borderRadius: 1 }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Nombre Proveedor"
              name="nombre"
              value={formData.nombre}
              onChange={onChange}
              fullWidth
              required
              variant="outlined"
              sx={{ backgroundColor: '#f9f9f9', borderRadius: 1 }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Elemento"
              name="elemento"
              value={formData.elemento}
              onChange={onChange}
              fullWidth
              required
              variant="outlined"
              sx={{ backgroundColor: '#f9f9f9', borderRadius: 1 }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Datos Bancarios"
              name="datos_bancarios"
              value={formData.datos_bancarios}
              onChange={onChange}
              fullWidth
              required
              variant="outlined"
              sx={{ backgroundColor: '#f9f9f9', borderRadius: 1 }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Contacto"
              name="contacto"
              value={formData.contacto}
              onChange={onChange}
              fullWidth
              required
              variant="outlined"
              sx={{ backgroundColor: '#f9f9f9', borderRadius: 1 }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Dirección"
              name="direccion"
              value={formData.direccion}
              onChange={onChange}
              fullWidth
              required
              variant="outlined"
              multiline
              rows={3}
              sx={{ backgroundColor: '#f9f9f9', borderRadius: 1 }}
            />
          </Grid>
        </Grid>
        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
          <Button
            type="submit"
            variant="contained"
            sx={{
              backgroundColor: 'var(--color-primary, #007bff)',
              px: 4,
              py: 1.2,
              fontWeight: 'bold',
              borderRadius: 2,
              boxShadow: 3,
              transition: 'all 0.3s ease',
              '&:hover': {
                backgroundColor: 'var(--color-primary-hover, #0056b3)',
                transform: 'scale(1.05)',
              },
            }}
          >
            {isEditing ? 'Actualizar Proveedor' : 'Registrar Proveedor'}
          </Button>
        </Box>
      </Box>
    </Dialog>
  );
};

// Tabla de Proveedores
const ProvidersTable = ({ proveedores, onEdit, onDelete }) => (
  <>
    <Typography
      variant="h5"
      sx={{
        mt: 4,
        textAlign: 'center',
        fontWeight: 'bold',
        textTransform: 'capitalize',
        color: 'var(--color-text, #333)',
        mb: 2,
      }}
    >
      Proveedores Registrados
    </Typography>
    <TableContainer
      component={Paper}
      sx={{
        maxWidth: 1000,
        mx: 'auto',
        borderRadius: 2,
        boxShadow: 3,
        overflow: 'hidden',
      }}
    >
      <Table>
        <TableHead sx={{ backgroundColor: 'var(--color-table-header, #f4f4f4)' }}>
          <TableRow>
            <TableCell>RUN Proveedor</TableCell>
            <TableCell>Nombre</TableCell>
            <TableCell>Elemento</TableCell>
            <TableCell>Datos Bancarios</TableCell>
            <TableCell>Contacto</TableCell>
            <TableCell>Dirección</TableCell>
            <TableCell align="center">Acciones</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {proveedores.map((prov) => (
            <TableRow
              key={prov.id}
              sx={{
                '&:hover': { backgroundColor: 'var(--color-table-row-hover, #f1f1f1)' },
              }}
            >
              <TableCell>{prov.run_proveedor}</TableCell>
              <TableCell>{prov.nombre}</TableCell>
              <TableCell>{prov.elemento}</TableCell>
              <TableCell>{prov.datos_bancarios}</TableCell>
              <TableCell>{prov.contacto}</TableCell>
              <TableCell>{prov.direccion}</TableCell>
              <TableCell align="center">
                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                  <IconButton
                    onClick={() => onEdit(prov)}
                    sx={{
                      backgroundColor: 'var(--color-success, #4caf50)',
                      color: '#fff',
                      '&:hover': {
                        backgroundColor: 'var(--color-success-hover, #45a049)',
                      },
                    }}
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton
                    onClick={() => onDelete(prov.id)}
                    sx={{
                      backgroundColor: 'var(--color-danger, #f44336)',
                      color: '#fff',
                      '&:hover': {
                        backgroundColor: 'var(--color-danger-hover, #d32f2f)',
                      },
                    }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Box>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  </>
);

const ProveedorModule = () => {
  const [proveedores, setProveedores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingProveedorId, setEditingProveedorId] = useState(null);
  const [formData, setFormData] = useState({
    run_proveedor: '',
    nombre: '',
    direccion: '',
    elemento: '',
    datos_bancarios: '',
    contacto: '',
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') return;
    setSnackbar({ ...snackbar, open: false });
  };

  useEffect(() => {
    fetchProveedores();
  }, []);

  const fetchProveedores = async () => {
    try {
      const response = await axios.get('https://sigma.runsolutions-services.com/api/proveedores');
      setProveedores(response.data);
    } catch (error) {
      console.error('Error al obtener proveedores:', error);
      setSnackbar({
        open: true,
        message: 'Error al obtener proveedores.',
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setIsEditing(false);
    setEditingProveedorId(null);
    setFormData({
      run_proveedor: '',
      nombre: '',
      direccion: '',
      elemento: '',
      datos_bancarios: '',
      contacto: '',
    });
  };

  const toggleForm = () => {
    if (showForm) {
      resetForm();
    }
    setShowForm((prev) => !prev);
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await axios.put(`https://sigma.runsolutions-services.com/api/proveedores/${editingProveedorId}`, formData);
        setSnackbar({
          open: true,
          message: 'Proveedor actualizado exitosamente.',
          severity: 'success',
        });
      } else {
        await axios.post('https://sigma.runsolutions-services.com/api/proveedores', formData);
        setSnackbar({
          open: true,
          message: 'Proveedor registrado exitosamente.',
          severity: 'success',
        });
      }
      fetchProveedores();
      toggleForm();
    } catch (error) {
      console.error('Error al enviar el formulario:', error.response?.data || error.message);
      setSnackbar({
        open: true,
        message: 'Error al enviar el formulario.',
        severity: 'error',
      });
    }
  };

  const handleEdit = (proveedor) => {
    setIsEditing(true);
    setEditingProveedorId(proveedor.id);
    setFormData({
      run_proveedor: proveedor.run_proveedor,
      nombre: proveedor.nombre,
      direccion: proveedor.direccion,
      elemento: proveedor.elemento,
      datos_bancarios: proveedor.datos_bancarios || '',
      contacto: proveedor.contacto || '',
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm('¿Estás seguro de que quieres eliminar este proveedor?');
    if (!confirmDelete) return;
    try {
      await axios.delete(`https://sigma.runsolutions-services.com/api/proveedores/${id}`);
      fetchProveedores();
      setSnackbar({
        open: true,
        message: 'Proveedor eliminado exitosamente.',
        severity: 'success',
      });
    } catch (error) {
      console.error('Error al eliminar el proveedor:', error.response?.data || error.message);
      setSnackbar({
        open: true,
        message: 'Error al eliminar el proveedor.',
        severity: 'error',
      });
    }
  };

  return (
    <Container
      sx={{
        py: 4,
        backgroundColor: '#f7f7f7',
        minHeight: '100vh',
      }}
    >
      <Fade in={!loading} timeout={600}>
        <Box>
          <TitleHeader />

          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
            <Button
              onClick={toggleForm}
              variant="contained"
              sx={{
                backgroundColor: 'var(--color-primary, #007bff)',
                color: '#fff',
                px: 3,
                py: 1.2,
                fontSize: '1rem',
                fontWeight: 'bold',
                borderRadius: 2,
                boxShadow: 3,
                transition: 'background 0.3s, transform 0.3s',
                '&:hover': {
                  backgroundColor: 'var(--color-primary-hover, #0056b3)',
                  transform: 'scale(1.05)',
                },
              }}
            >
              {showForm ? 'Cerrar formulario' : 'Crear proveedor'}
            </Button>
          </Box>

          <ProviderForm
            open={showForm}
            onClose={toggleForm}
            isEditing={isEditing}
            formData={formData}
            onChange={handleChange}
            onSubmit={handleSubmit}
          />

          <ProvidersTable
            proveedores={proveedores}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </Box>
      </Fade>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        TransitionComponent={SlideTransition}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default ProveedorModule;
