// src/modules/CategoriasForm.js
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
  Tooltip,
  CircularProgress,
  Slide,
  Snackbar,
  Alert,
} from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faClose } from '@fortawesome/free-solid-svg-icons';

// Componente de transición utilizando Slide para evitar el error de scrollTop
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

// Componente para el título principal
const TitleHeader = () => (
  <Typography
    variant="h3"
    component="h1"
    sx={{
      textAlign: 'center',
      mb: 4,
      color: 'var(--color-titulo, #e63946)', // Rojo para el título
      fontWeight: 'bold',
      textTransform: 'capitalize',
    }}
  >
    Módulo Categorías
  </Typography>
);

// Componente del formulario dentro de un Dialog
const CategoryFormDialog = ({
  open,
  onClose,
  categoryValue,
  onChange,
  onSubmit,
  isEditing,
}) => (
  <Dialog
    open={open}
    onClose={onClose}
    fullWidth
    maxWidth="sm"
    TransitionComponent={Transition}
    keepMounted
  >
    <DialogTitle
      sx={{
        p: 2,
        background: 'linear-gradient(90deg, #ff6b6b, #f94d9a)',
        color: '#fff',
        fontWeight: 'bold',
        position: 'relative',
      }}
    >
      {isEditing ? 'Actualizar Categoría' : 'Registrar Categoría'}
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
    <Box
      component="form"
      onSubmit={onSubmit}
      sx={{ p: 3, backgroundColor: '#fff' }}
    >
      <TextField
        label="Nombre de la Categoría"
        name="categoria"
        value={categoryValue}
        onChange={onChange}
        fullWidth
        required
        variant="outlined"
        sx={{ backgroundColor: '#f9f9f9', borderRadius: 1 }}
      />
    </Box>
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
        {isEditing ? 'Actualizar Categoría' : 'Registrar Categoría'}
      </Button>
    </DialogActions>
  </Dialog>
);

// Componente para la tabla de categorías
const CategoriesTable = ({ categorias, onEdit, onDelete }) => (
  <TableContainer
    component={Paper}
    sx={{
      width: '100%',
      maxWidth: 800,
      mt: 4,
      mb: 4,
      borderRadius: 2,
      boxShadow: 2,
      mx: 'auto',
    }}
  >
    <Table>
      <TableHead sx={{ backgroundColor: '#f4f4f4' }}>
        <TableRow>
          <TableCell sx={{ fontWeight: 'bold', color: '#333' }}>
            Nombre
          </TableCell>
          <TableCell sx={{ fontWeight: 'bold', color: '#333', textAlign: 'center' }}>
            Acciones
          </TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {categorias.map((cat) => (
          <TableRow key={cat.id} sx={{ '&:hover': { backgroundColor: '#f9f9f9' } }}>
            <TableCell>{cat.nombre}</TableCell>
            <TableCell sx={{ textAlign: 'center' }}>
              <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                <Tooltip title="Editar">
                  <IconButton
                    onClick={() => onEdit(cat)}
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
                    onClick={() => onDelete(cat.id)}
                    sx={{
                      backgroundColor: '#f44336',
                      color: '#fff',
                      '&:hover': { backgroundColor: '#d32f2f' },
                    }}
                  >
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
);

// Componente principal
const CategoriasForm = () => {
  const [categorias, setCategorias] = useState([]);
  const [categoria, setCategoria] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  useEffect(() => {
    fetchCategorias();
  }, []);

  const fetchCategorias = async () => {
    try {
      const response = await axios.get(
        'https://sigma.runsolutions-services.com/api/categorias'
      );
      setCategorias(response.data);
    } catch (error) {
      console.error('Error al obtener categorías:', error);
      setSnackbar({
        open: true,
        message: 'Error al obtener categorías',
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleForm = () => {
    setShowForm((prev) => !prev);
    if (showForm) {
      // Al cerrar el formulario, reiniciamos los valores
      setIsEditing(false);
      setEditingId(null);
      setCategoria('');
    }
  };

  const handleChange = (e) => {
    setCategoria(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await axios.put(
          `https://sigma.runsolutions-services.com/api/categorias/${editingId}`,
          { nombre: categoria }
        );
        setSnackbar({
          open: true,
          message: 'Categoría actualizada correctamente',
          severity: 'success',
        });
      } else {
        await axios.post(
          'https://sigma.runsolutions-services.com/api/categorias',
          { nombre: categoria }
        );
        setSnackbar({
          open: true,
          message: 'Categoría registrada correctamente',
          severity: 'success',
        });
      }
      fetchCategorias();
      toggleForm();
    } catch (error) {
      console.error('Error al registrar/actualizar categoría:', error);
      setSnackbar({
        open: true,
        message: 'Error al registrar/actualizar categoría',
        severity: 'error',
      });
    }
  };

  const handleEdit = (categoriaObj) => {
    setCategoria(categoriaObj.nombre);
    setIsEditing(true);
    setEditingId(categoriaObj.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Estás seguro de que quieres eliminar esta categoría?"))
      return;
    try {
      await axios.delete(
        `https://sigma.runsolutions-services.com/api/categorias/${id}`
      );
      setSnackbar({
        open: true,
        message: 'Categoría eliminada correctamente',
        severity: 'success',
      });
      fetchCategorias();
    } catch (error) {
      console.error('Error al eliminar categoría:', error);
      setSnackbar({
        open: true,
        message: 'Error al eliminar categoría',
        severity: 'error',
      });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  return (
    <Container
      sx={{
        py: 4,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        minHeight: '100vh',
        backgroundColor: 'var(--color-fondo, #f5f5f5)',
      }}
    >
      <TitleHeader />
      <Button
        onClick={toggleForm}
        variant="contained"
        sx={{
          backgroundColor: '#007bff',
          color: '#fff',
          px: 3,
          py: 1,
          fontSize: '1rem',
          fontWeight: 'bold',
          borderRadius: 2,
          transition: 'background 0.3s',
          '&:hover': { backgroundColor: '#0056b3' },
          mb: 2,
        }}
      >
        {showForm ? 'Cerrar formulario' : 'Registrar Categoría'}
      </Button>
      {showForm && (
        <CategoryFormDialog
          open={showForm}
          onClose={toggleForm}
          categoryValue={categoria}
          onChange={handleChange}
          onSubmit={handleSubmit}
          isEditing={isEditing}
        />
      )}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <CategoriesTable
          categorias={categorias}
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
        <Alert
          onClose={handleCloseSnackbar}
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

export default CategoriasForm;