// src/modules/Clientes/ClientModule.js
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
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tooltip,
  Grid,
  InputAdornment,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';

const ClientModule = () => {
  const [clients, setClients] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingClientId, setEditingClientId] = useState(null);
  const [formData, setFormData] = useState({
    run_cliente: '',
    nombre: '',
    rfc: '',
    direccion: '',
  });
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      const response = await axios.get('https://sigma.runsolutions-services.com/api/clients');
      setClients(response.data);
    } catch (error) {
      console.error('Error al obtener clientes:', error);
    }
  };

  const handleOpenDialog = () => {
    if (!openDialog) {
      setIsEditing(false);
      setEditingClientId(null);
      setFormData({ run_cliente: '', nombre: '', rfc: '', direccion: '' });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setIsEditing(false);
    setEditingClientId(null);
    setFormData({ run_cliente: '', nombre: '', rfc: '', direccion: '' });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await axios.put(`/api/clients/${editingClientId}`, formData);
      } else {
        await axios.post('/api/clients', formData);
      }
      handleCloseDialog();
      fetchClients();
    } catch (error) {
      console.error('Error al enviar el formulario:', error);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("¿Estás seguro de que quieres eliminar este cliente?");
    if (!confirmDelete) return;
    try {
      await axios.delete(`/api/clients/${id}`);
      setClients(clients.filter((client) => client.id !== id));
    } catch (error) {
      console.error('Error al eliminar el cliente:', error);
    }
  };

  const handleEdit = (client) => {
    setIsEditing(true);
    setEditingClientId(client.id);
    setFormData({
      run_cliente: client.run_cliente,
      nombre: client.nombre,
      rfc: client.rfc,
      direccion: client.direccion,
    });
    setOpenDialog(true);
  };

  // Filtrar clientes según el texto de búsqueda
  const filteredClients = clients.filter((client) =>
    client.nombre.toLowerCase().includes(searchText.toLowerCase()) ||
    client.run_cliente.toLowerCase().includes(searchText.toLowerCase()) ||
    client.rfc.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <Container sx={{ py: 4 }}>
      {/* Título 3D Impactante */}
      <Typography
        variant="h3"
        gutterBottom
        sx={{
          textAlign: 'center',
          textTransform: 'uppercase',
          fontWeight: 'bold',
          letterSpacing: 2,
          color: '#e63946',
          mb: 4,
          textShadow: `
            1px 1px 0 #000,
            3px 3px 0 rgba(0,0,0,0.2)
          `,
        }}
      >
        Clientes
      </Typography>

      {/* Botón de Acción */}
      <Grid container spacing={2} justifyContent="center" sx={{ mb: 3 }}>
        <Grid item>
          <Button
            variant="contained"
            onClick={handleOpenDialog}
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
            Crear Cliente
          </Button>
        </Grid>
      </Grid>

      {/* Campo de búsqueda */}
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'center' }}>
        <TextField
          placeholder="Buscar cliente..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          variant="outlined"
          size="small"
          sx={{
            width: { xs: '90%', sm: '50%' },
            '& .MuiOutlinedInput-root': {
              borderRadius: '8px',
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      {/* Dialogo Impactante para el Formulario */}
      <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth maxWidth="sm">
        <DialogTitle
          sx={{
            p: 2,
            background: 'linear-gradient(90deg, #ff6b6b, #f94d9a)',
            color: '#fff',
            fontWeight: 'bold',
            position: 'relative',
          }}
        >
          {isEditing ? 'Editar Cliente' : 'Registrar Cliente'}
          <IconButton
            aria-label="close"
            onClick={handleCloseDialog}
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
              margin="normal"
              label="ID RUN CLIENTE"
              name="run_cliente"
              value={formData.run_cliente}
              onChange={handleChange}
              fullWidth
              required
              variant="outlined"
              sx={{
                backgroundColor: '#fff',
                borderRadius: 1,
                // Resaltar el ID con color vibrante
                '& input': { color: '#ff5722', fontWeight: 'bold' },
              }}
            />
            <TextField
              margin="normal"
              label="Nombre Cliente"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              fullWidth
              required
              variant="outlined"
              sx={{ backgroundColor: '#fff', borderRadius: 1 }}
            />
            <TextField
              margin="normal"
              label="RFC"
              name="rfc"
              value={formData.rfc}
              onChange={handleChange}
              fullWidth
              required
              variant="outlined"
              sx={{ backgroundColor: '#fff', borderRadius: 1 }}
            />
            <TextField
              margin="normal"
              label="Dirección"
              name="direccion"
              value={formData.direccion}
              onChange={handleChange}
              fullWidth
              multiline
              rows={3}
              required
              variant="outlined"
              sx={{ backgroundColor: '#fff', borderRadius: 1 }}
            />
          </DialogContent>
          <DialogActions
            sx={{
              backgroundColor: '#f5f5f5',
              p: 2,
              justifyContent: 'space-between',
            }}
          >
            <Button onClick={handleCloseDialog} sx={{ color: '#007bff', fontWeight: 'bold' }}>
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
              {isEditing ? 'Actualizar Cliente' : 'Registrar Cliente'}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>

      {/* Encabezado para la tabla */}
      <Typography
        variant="h5"
        gutterBottom
        sx={{
          mt: 6,
          textAlign: 'center',
          fontWeight: 'bold',
          letterSpacing: 1,
          textShadow: '1px 1px 2px rgba(0,0,0,0.3)',
        }}
      >
        Clientes Registrados
      </Typography>

      {/* Tabla de Clientes con funciones extras */}
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
              <TableCell sx={{ fontWeight: 'bold', color: '#333' }}>ID RUN CLIENTE</TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: '#333' }}>Nombre</TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: '#333' }}>RFC</TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: '#333' }}>Dirección</TableCell>
              <TableCell align="center" sx={{ fontWeight: 'bold', color: '#333' }}>
                Acciones
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredClients.map((client, index) => (
              <TableRow
                key={client.id}
                sx={{
                  backgroundColor: index % 2 === 0 ? '#fff' : '#f9f9f9',
                  transition: 'background-color 0.3s ease',
                  '&:hover': { backgroundColor: '#ececec' },
                }}
              >
                <TableCell sx={{ color: '#ff5722', fontWeight: 'bold' }}>
                  {client.run_cliente}
                </TableCell>
                <TableCell>{client.nombre}</TableCell>
                <TableCell>{client.rfc}</TableCell>
                <TableCell>{client.direccion}</TableCell>
                <TableCell align="center">
                  <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                    <Tooltip title="Editar">
                      <IconButton
                        sx={{
                          backgroundColor: '#ffc107',
                          '&:hover': { backgroundColor: '#e0a800' },
                        }}
                        onClick={() => handleEdit(client)}
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Eliminar">
                      <IconButton
                        sx={{
                          backgroundColor: '#f44336',
                          '&:hover': { backgroundColor: '#d32f2f' },
                        }}
                        onClick={() => handleDelete(client.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
            {filteredClients.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  <Typography variant="body1" color="textSecondary">
                    No se encontraron clientes.
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

export default ClientModule;


