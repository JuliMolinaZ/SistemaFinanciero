// src/modules/Proyectos/ProjectModule.js
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
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';

const ProjectModule = () => {
  // Estados para proyectos, clientes, costos y formularios
  const [projects, setProjects] = useState([]);
  const [clients, setClients] = useState([]);
  const [costs, setCosts] = useState([]);
  const [newCost, setNewCost] = useState({ concepto: '', factura: '', monto: '' });
  const [selectedProject, setSelectedProject] = useState(null);
  const [openProjectDialog, setOpenProjectDialog] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingProjectId, setEditingProjectId] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '',
    cliente_id: '',
    monto_sin_iva: '',
    monto_con_iva: '',
  });

  useEffect(() => {
    fetchProjects();
    fetchClients();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await axios.get('https://sigma.runsolutions-services.com/api/projects');
      setProjects(response.data);
    } catch (error) {
      console.error('Error al obtener proyectos:', error);
    }
  };

  const fetchClients = async () => {
    try {
      const response = await axios.get('https://sigma.runsolutions-services.com/api/clients');
      setClients(response.data);
    } catch (error) {
      console.error('Error al obtener clientes:', error);
    }
  };

  const fetchCosts = async (projectId) => {
    try {
      const response = await axios.get(`https://sigma.runsolutions-services.com/api/project-costs/${projectId}`);
      setCosts(response.data);
    } catch (error) {
      console.error('Error al obtener los costos:', error);
    }
  };

  // Manejo de costos
  const handleAddCost = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`/api/project-costs/${selectedProject.id}`, newCost);
      fetchCosts(selectedProject.id);
      setNewCost({ concepto: '', factura: '', monto: '' });
    } catch (error) {
      console.error('Error al agregar costo:', error);
    }
  };

  const handleEditCost = async (costId) => {
    // Utilizando prompts para simplificar; se podría implementar otro Dialog
    const updatedConcept = prompt('Ingrese el nuevo concepto:');
    const updatedAmount = prompt('Ingrese el nuevo monto (MXN):');
    const updatedInvoice = prompt('Ingrese la nueva factura (opcional):');
    if (!updatedConcept || !updatedAmount) {
      alert('El concepto y el monto son obligatorios.');
      return;
    }
    try {
      await axios.put(`/api/project-costs/${costId}`, {
        concepto: updatedConcept,
        monto: parseFloat(updatedAmount),
        factura: updatedInvoice || null,
      });
      fetchCosts(selectedProject.id);
      alert('Costo actualizado correctamente.');
    } catch (error) {
      console.error('Error al actualizar el costo:', error);
      alert('No se pudo actualizar el costo.');
    }
  };

  const handleDeleteCost = async (costId) => {
    if (!window.confirm('¿Está seguro de que desea eliminar este costo?')) return;
    try {
      await axios.delete(`/api/project-costs/${costId}`);
      fetchCosts(selectedProject.id);
      alert('Costo eliminado correctamente.');
    } catch (error) {
      console.error('Error al eliminar el costo:', error);
      alert('No se pudo eliminar el costo.');
    }
  };

  // Seleccionar un proyecto para ver detalles
  const handleSelectProject = (project) => {
    setSelectedProject(project);
    fetchCosts(project.id);
  };

  const closeProjectDetails = () => {
    setSelectedProject(null);
    setCosts([]);
  };

  // Diálogo para registrar/editar proyecto
  const toggleProjectDialog = () => {
    setOpenProjectDialog(!openProjectDialog);
    if (!openProjectDialog) {
      setIsEditing(false);
      setEditingProjectId(null);
      setFormData({ nombre: '', cliente_id: '', monto_sin_iva: '', monto_con_iva: '' });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
      ...(name === 'monto_sin_iva' && {
        monto_con_iva: (parseFloat(value) * 1.16).toFixed(2),
      }),
    }));
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
    }).format(amount);
  };

  const calculateTotalProjects = () => {
    return projects.reduce((total, project) => total + parseFloat(project.monto_sin_iva || 0), 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await axios.put(`/api/projects/${editingProjectId}`, formData);
      } else {
        await axios.post('/api/projects', formData);
      }
      fetchProjects();
      toggleProjectDialog();
    } catch (error) {
      console.error('Error al registrar proyecto:', error);
    }
  };

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
        Proyectos
      </Typography>

      {/* Botón para abrir el formulario */}
      <Grid container justifyContent="center" spacing={2} sx={{ mb: 3 }}>
        <Grid item>
          <Button
            variant="contained"
            onClick={toggleProjectDialog}
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
            Crear Proyecto
          </Button>
        </Grid>
      </Grid>

      {/* Diálogo para el formulario del proyecto */}
      <Dialog open={openProjectDialog} onClose={toggleProjectDialog} fullWidth maxWidth="sm">
        <DialogTitle
          sx={{
            p: 2,
            background: 'linear-gradient(90deg, #ff6b6b, #f94d9a)',
            color: '#fff',
            fontWeight: 'bold',
            position: 'relative',
          }}
        >
          {isEditing ? 'Editar Proyecto' : 'Registrar Proyecto'}
          <IconButton
            aria-label="close"
            onClick={toggleProjectDialog}
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
              label="Nombre del Proyecto"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              fullWidth
              required
              variant="outlined"
              sx={{ backgroundColor: '#fff', borderRadius: 1 }}
            />
            <TextField
              select
              margin="normal"
              label="Cliente"
              name="cliente_id"
              value={formData.cliente_id}
              onChange={handleChange}
              fullWidth
              required
              variant="outlined"
              sx={{ backgroundColor: '#fff', borderRadius: 1 }}
            >
              <MenuItem value="">
                <em>Seleccione un cliente</em>
              </MenuItem>
              {clients.map((client) => (
                <MenuItem key={client.id} value={client.id}>
                  {client.nombre}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              margin="normal"
              label="Monto sin IVA"
              name="monto_sin_iva"
              type="number"
              value={formData.monto_sin_iva}
              onChange={handleChange}
              fullWidth
              required
              variant="outlined"
              sx={{ backgroundColor: '#fff', borderRadius: 1 }}
            />
            <TextField
              margin="normal"
              label="Monto con IVA"
              name="monto_con_iva"
              type="number"
              value={formData.monto_con_iva}
              InputProps={{ readOnly: true }}
              fullWidth
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
            <Button onClick={toggleProjectDialog} sx={{ color: '#007bff', fontWeight: 'bold' }}>
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
              {isEditing ? 'Actualizar Proyecto' : 'Registrar Proyecto'}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>

      {/* Total de Proyectos */}
      <Box
        sx={{
          mt: 3,
          p: 2,
          border: '1px solid #ddd',
          borderRadius: '8px',
          background: '#fefefe',
          boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)',
          textAlign: 'center',
          maxWidth: 800,
          mx: 'auto',
        }}
      >
        <Typography
          variant="h6"
          sx={{
            textTransform: 'uppercase',
            letterSpacing: 1,
            color: '#333',
            mb: 1,
          }}
        >
          Total de Proyectos
        </Typography>
        <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#007bff' }}>
          {formatCurrency(calculateTotalProjects())}
        </Typography>
      </Box>

      {/* Tabla de Proyectos */}
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
        Proyectos Registrados
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
              <TableCell sx={{ fontWeight: 'bold', color: '#333' }}>Nombre</TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: '#333' }}>Cliente</TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: '#333' }}>Total del Proyecto</TableCell>
              <TableCell align="center" sx={{ fontWeight: 'bold', color: '#333' }}>
                Acciones
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {projects.map((project) => (
              <TableRow
                key={project.id}
                sx={{
                  backgroundColor: '#fff',
                  '&:hover': { backgroundColor: '#ececec' },
                  cursor: 'pointer',
                }}
                onClick={() => handleSelectProject(project)}
              >
                <TableCell>{project.nombre}</TableCell>
                <TableCell>
                  {clients.find((client) => client.id === project.cliente_id)?.nombre || 'Sin asignar'}
                </TableCell>
                <TableCell>{formatCurrency(project.monto_sin_iva)}</TableCell>
                <TableCell align="center">
                  <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                    <IconButton
                      sx={{
                        backgroundColor: '#ffc107',
                        '&:hover': { backgroundColor: '#e0a800' },
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingProjectId(project.id);
                        setFormData({
                          nombre: project.nombre,
                          cliente_id: project.cliente_id,
                          monto_sin_iva: project.monto_sin_iva,
                          monto_con_iva: project.monto_con_iva,
                        });
                        setOpenProjectDialog(true);
                      }}
                    >
                      <EditIcon />
                    </IconButton>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Tarjeta de Detalles del Proyecto */}
      {selectedProject && (
        <>
          <Box
            sx={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              zIndex: 1000,
            }}
            onClick={closeProjectDetails}
          />
          <Box
            sx={{
              position: 'fixed',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              background: '#fff',
              p: 3,
              borderRadius: '12px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              width: '90%',
              maxWidth: '400px',
              zIndex: 1001,
              animation: 'fadeIn 0.3s ease-in-out',
            }}
          >
            <IconButton
              onClick={closeProjectDetails}
              sx={{
                position: 'absolute',
                top: 8,
                right: 8,
                color: '#888',
                '&:hover': { color: '#333' },
              }}
            >
              <CloseIcon />
            </IconButton>
            <Typography variant="h5" sx={{ textAlign: 'center', fontWeight: 'bold', mb: 2 }}>
              Detalles del Proyecto
            </Typography>
            <Typography variant="body1" sx={{ mb: 1 }}>
              <strong>Nombre:</strong> {selectedProject.nombre}
            </Typography>
            <Typography variant="body1" sx={{ mb: 1 }}>
              <strong>Cliente:</strong>{' '}
              {clients.find((client) => client.id === selectedProject.cliente_id)?.nombre}
            </Typography>
            <Typography variant="body1" sx={{ mb: 1 }}>
              <strong>Monto sin IVA:</strong> {formatCurrency(selectedProject.monto_sin_iva)}
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              <strong>Monto Restante:</strong>{' '}
              {formatCurrency(
                parseFloat(selectedProject.monto_sin_iva) -
                  costs.reduce((acc, cost) => acc + parseFloat(cost.monto), 0)
              )}
            </Typography>

            <Typography variant="h6" sx={{ textAlign: 'center', fontWeight: 'bold', mb: 1 }}>
              Costos Asociados
            </Typography>
            {costs.map((cost) => (
              <Box
                key={cost.id}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  my: 1,
                  p: 1,
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                }}
              >
                <Typography variant="body2">
                  {cost.concepto}: {formatCurrency(cost.monto)}
                  {cost.factura && ` (Factura: ${cost.factura})`}
                </Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <IconButton
                    size="small"
                    sx={{
                      backgroundColor: '#ffc107',
                      '&:hover': { backgroundColor: '#e0a800' },
                    }}
                    onClick={() => handleEditCost(cost.id)}
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton
                    size="small"
                    sx={{
                      backgroundColor: '#f44336',
                      '&:hover': { backgroundColor: '#d32f2f' },
                    }}
                    onClick={() => handleDeleteCost(cost.id)}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Box>
              </Box>
            ))}

            <Box component="form" onSubmit={handleAddCost} sx={{ mt: 2 }}>
              <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 'bold' }}>
                Agregar Costo
              </Typography>
              <TextField
                margin="dense"
                label="Concepto"
                value={newCost.concepto}
                onChange={(e) => setNewCost({ ...newCost, concepto: e.target.value })}
                fullWidth
                required
                variant="outlined"
                size="small"
              />
              <TextField
                margin="dense"
                label="Factura (Opcional)"
                value={newCost.factura}
                onChange={(e) => setNewCost({ ...newCost, factura: e.target.value })}
                fullWidth
                variant="outlined"
                size="small"
              />
              <TextField
                margin="dense"
                label="Monto"
                type="number"
                value={newCost.monto}
                onChange={(e) => setNewCost({ ...newCost, monto: e.target.value })}
                fullWidth
                required
                variant="outlined"
                size="small"
              />
              <Button
                type="submit"
                variant="contained"
                sx={{
                  mt: 1,
                  backgroundColor: '#f44336',
                  '&:hover': { backgroundColor: '#d32f2f' },
                  width: '100%',
                }}
              >
                Agregar Costo
              </Button>
            </Box>
          </Box>
        </>
      )}
    </Container>
  );
};

export default ProjectModule;







