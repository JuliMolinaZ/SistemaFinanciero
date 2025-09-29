// src/modules/Proyectos/ProyectosForm.js
import React, { useState, useEffect, useCallback, useMemo, useTransition } from 'react';
import axios from 'axios';
import {
  Container,
  Box,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  Snackbar,
  Alert,
  Chip,
  Avatar,
  IconButton,
  Tooltip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Skeleton,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Card,
  CardContent,
  Fade,
  Zoom,
  Button
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { motion, AnimatePresence } from 'framer-motion';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import DownloadIcon from '@mui/icons-material/Download';
import AssignmentIcon from '@mui/icons-material/Assignment';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import ScheduleIcon from '@mui/icons-material/Schedule';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import BusinessIcon from '@mui/icons-material/Business';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import TimelineIcon from '@mui/icons-material/Timeline';
import RefreshIcon from '@mui/icons-material/Refresh';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CloseIcon from '@mui/icons-material/Close';
import ExportButton from '../../components/ExportButton';

// Componentes estilizados modernos
const StyledContainer = styled(Container)(({ theme }) => ({
  paddingTop: theme.spacing(3),
  paddingBottom: theme.spacing(3),
  minHeight: '100vh',
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  position: 'relative',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.05"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
    pointerEvents: 'none'
  }
}));

const StyledCard = styled(Card)(({ theme }) => ({
  background: 'rgba(255,255,255,0.95)',
  backdropFilter: 'blur(20px)',
  border: '1px solid rgba(255,255,255,0.3)',
  borderRadius: 16,
  boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 12px 40px rgba(0,0,0,0.15)'
  }
}));

const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  borderRadius: 16,
  overflow: 'hidden',
  boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
  background: 'rgba(255,255,255,0.98)',
  backdropFilter: 'blur(20px)'
}));

const StyledTable = styled(Table)(({ theme }) => ({
  '& .MuiTableCell-head': {
    backgroundColor: 'rgba(102, 126, 234, 0.1)',
    color: '#2c3e50',
    fontWeight: 700,
    fontSize: '0.875rem',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  },
  '& .MuiTableCell-body': {
    fontSize: '0.875rem',
    color: '#34495e'
  }
}));

const StyledChip = styled(Chip)(({ theme, status }) => ({
  backgroundColor: status === 'activo' ? '#27ae60' :
                 status === 'en_progreso' ? '#3498db' :
                 status === 'pausado' ? '#e74c3c' :
                 status === 'completado' ? '#9b59b6' : 
                 status === 'default' ? '#95a5a6' : '#95a5a6',
  color: '#fff',
  fontWeight: 600,
  fontSize: '0.75rem',
  minWidth: '80px',
  '& .MuiChip-label': {
    px: 1,
    textAlign: 'center'
  }
}));

const ActionButton = styled(IconButton)(({ theme, color }) => ({
  backgroundColor: color,
  color: '#fff',
  width: 32,
  height: 32,
  '&:hover': {
    backgroundColor: color,
    transform: 'scale(1.1)',
    boxShadow: `0 4px 12px ${color}40`
  },
  transition: 'all 0.2s ease'
}));

const ProjectModule = () => {
  // Función de formato de moneda
  const formatCurrency = (amount) => {
    if (!amount || isNaN(amount)) return '$0.00';
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 2
    }).format(amount);
  };

  // Función para obtener el color del estado
  const getStatusColor = (status) => {
    switch (status) {
      case 'activo':
        return { bg: '#27ae60', text: 'white' };
      case 'en_progreso':
        return { bg: '#3498db', text: 'white' };
      case 'pausado':
        return { bg: '#e74c3c', text: 'white' };
      case 'completado':
        return { bg: '#9b59b6', text: 'white' };
      default:
        return { bg: '#95a5a6', text: 'white' };
    }
  };

  // Función para obtener el color de la fase
  const getPhaseColor = (phaseName) => {
    switch (phaseName?.toLowerCase()) {
      case 'planeación':
      case 'planeacion':
        return { bg: '#e67e22', text: 'white' }; // Naranja
      case 'desarrollo':
        return { bg: '#2980b9', text: 'white' }; // Azul
      case 'pruebas':
        return { bg: '#f39c12', text: 'white' }; // Amarillo
      case 'entrega':
        return { bg: '#8e44ad', text: 'white' }; // Morado
      default:
        return { bg: '#95a5a6', text: 'white' }; // Gris
    }
  };

  // Función para obtener solo los campos modificados
  const getModifiedFields = (original, current) => {
    const modified = {};
    Object.keys(current).forEach(key => {
      // Solo incluir campos que realmente han cambiado
      if (current[key] !== original[key]) {
        // No enviar campos vacíos que podrían sobrescribir datos existentes
        if (current[key] !== '' && current[key] !== null && current[key] !== undefined) {
          modified[key] = current[key];
        }
      }
    });
    return modified;
  };

  // Estados del componente
  const [projects, setProjects] = useState([]);
  const [clients, setClients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClient, setSelectedClient] = useState('');
  const [selectedPhase, setSelectedPhase] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [openProjectDialog, setOpenProjectDialog] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingProjectId, setEditingProjectId] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [viewDetailsOpen, setViewDetailsOpen] = useState(false);
  const [viewingProject, setViewingProject] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [isPending, startTransition] = useTransition();

  // Estados del formulario
  const [formData, setFormData] = useState({
    nombre: '',
    cliente_id: '',
    monto_sin_iva: '',
    monto_con_iva: '',
    phase_id: '',
    estado: 'activo',
    descripcion: ''
  });

  // Estado para almacenar datos originales del proyecto (para edición)
  const [originalProjectData, setOriginalProjectData] = useState(null);

  // Estados para fases (clients ya declarado arriba)
  const [phases] = useState([
    { id: 1, nombre: 'Planeación', descripcion: 'Fase inicial del proyecto donde se realiza la planeación.' },
    { id: 2, nombre: 'Desarrollo', descripcion: 'Fase donde se implementan las actividades del proyecto.' },
    { id: 3, nombre: 'Pruebas', descripcion: 'Fase donde se realizan pruebas al producto o servicio.' },
    { id: 4, nombre: 'Entrega', descripcion: 'Fase final donde se entrega el producto o servicio.' }
  ]);

  // Función para obtener proyectos
  const fetchProjects = useCallback(async () => {
    try {
      const response = await axios.get('/api/projects');
      const projectsData = response.data.success && Array.isArray(response.data.data)
        ? response.data.data
        : response.data;
      setProjects(projectsData);
    } catch (error) {
      console.error('Error al obtener proyectos:', error);
    }
  }, []);

  // useEffect para cargar proyectos
  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  // Función para obtener clientes
  const fetchClients = useCallback(async () => {
    try {
      const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8765';
      const response = await axios.get(`${API_BASE_URL}/api/clients`);
      const clientsData = response.data.success && Array.isArray(response.data.data)
        ? response.data.data
        : response.data;
      setClients(clientsData);
    } catch (error) {
      console.error('Error al obtener clientes:', error);
    }
  }, []);

  // useEffect para cargar clientes
  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  // Estados calculados para estadísticas
  const stats = useMemo(() => {
    const totalProjects = projects.length;
    const totalAmount = projects.reduce((sum, project) => sum + (project.monto_sin_iva || 0), 0);
    const activeProjects = projects.filter(project => project.estado === 'activo').length;
    const completedProjects = projects.filter(project => project.estado === 'completado').length;

    return [
      {
        label: 'Total Proyectos',
        value: totalProjects,
        icon: <AssignmentIcon />,
        color: '#3498db'
      },
      {
        label: 'Monto Total',
        value: formatCurrency(totalAmount),
        icon: <AttachMoneyIcon />,
        color: '#27ae60'
      },
      {
        label: 'Activos',
        value: activeProjects,
        icon: <TrendingUpIcon />,
        color: '#e74c3c'
      },
      {
        label: 'Completados',
        value: completedProjects,
        icon: <CheckCircleIcon />,
        color: '#f39c12'
      }
    ];
  }, [projects]);

  // Filtros para proyectos
  const filteredProjects = useMemo(() => {
    return projects.filter(project => {
      const matchesSearch = !searchTerm ||
        project.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.cliente_nombre?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesClient = !selectedClient || project.cliente_id === selectedClient;
      const matchesPhase = !selectedPhase || project.phase_id === selectedPhase;
      const matchesStatus = !selectedStatus || project.estado === selectedStatus;

      return matchesSearch && matchesClient && matchesPhase && matchesStatus;
    });
  }, [projects, searchTerm, selectedClient, selectedPhase, selectedStatus]);

  // Función para manejar cambios en el formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const newData = { ...prev, [name]: value };

      // Calcular IVA automáticamente
      if (name === 'monto_sin_iva') {
        const montoSinIva = parseFloat(value) || 0;
        const iva = montoSinIva * 0.16;
        newData.monto_con_iva = (montoSinIva + iva).toFixed(2);
      }

      return newData;
    });
  };

  // Función para crear proyecto
  const handleCreateProject = async () => {
    try {
      const response = await axios.post('/api/projects', formData);
      if (response.data.success) {
        setSnackbar({ open: true, message: 'Proyecto creado exitosamente', severity: 'success' });
        setOpenProjectDialog(false);
        resetForm();
        fetchProjects();
      }
    } catch (error) {
      console.error('Error al crear proyecto:', error);
      setSnackbar({ open: true, message: 'Error al crear proyecto', severity: 'error' });
    }
  };

  // Función para actualizar proyecto
  const handleUpdateProject = async () => {
    try {
      const modifiedFields = getModifiedFields(originalProjectData, formData);
      if (Object.keys(modifiedFields).length === 0) {
        setSnackbar({ open: true, message: 'No hay cambios para guardar', severity: 'info' });
        return;
      }

      const response = await axios.put(`/api/projects/${editingProjectId}`, modifiedFields);
      if (response.data.success) {
        setSnackbar({ open: true, message: 'Proyecto actualizado exitosamente', severity: 'success' });
        setOpenProjectDialog(false);
        resetForm();
        fetchProjects();
      }
    } catch (error) {
      console.error('Error al actualizar proyecto:', error);
      setSnackbar({ open: true, message: 'Error al actualizar proyecto', severity: 'error' });
    }
  };

  // Función para eliminar proyecto
  const handleDelete = async (project) => {
    if (window.confirm(`¿Estás seguro de eliminar el proyecto "${project.nombre}"?`)) {
      try {
        const response = await axios.delete(`/api/projects/${project.id}`);
        if (response.data.success) {
          setSnackbar({ open: true, message: 'Proyecto eliminado exitosamente', severity: 'success' });
          fetchProjects();
        }
      } catch (error) {
        console.error('Error al eliminar proyecto:', error);
        setSnackbar({ open: true, message: 'Error al eliminar proyecto', severity: 'error' });
      }
    }
  };

  // Función para editar proyecto
  const handleEdit = (project) => {
    setIsEditing(true);
    setEditingProjectId(project.id);

    const projectData = {
      nombre: project.nombre || '',
      cliente_id: project.cliente_id || '',
      monto_sin_iva: project.monto_sin_iva || '',
      monto_con_iva: project.monto_con_iva || '',
      phase_id: project.phase_id || '',
      estado: project.estado || 'activo',
      descripcion: project.descripcion || ''
    };

    setOriginalProjectData(projectData);
    setFormData(projectData);
    setOpenProjectDialog(true);
  };

  // Función para ver detalles
  const handleViewDetails = (project) => {
    setViewingProject(project);
    setViewDetailsOpen(true);
  };

  // Función para cerrar detalles
  const handleCloseViewDetails = () => {
    setViewDetailsOpen(false);
    setViewingProject(null);
  };

  // Función para resetear formulario
  const resetForm = () => {
    setFormData({
      nombre: '',
      cliente_id: '',
      monto_sin_iva: '',
      monto_con_iva: '',
      phase_id: '',
      estado: 'activo',
      descripcion: ''
    });
    setIsEditing(false);
    setEditingProjectId(null);
    setOriginalProjectData(null);
  };

  // Función para manejar envío del formulario
  const handleSubmit = (e) => {
    e.preventDefault();
    if (isEditing) {
      handleUpdateProject();
    } else {
      handleCreateProject();
    }
  };

  // Función para cerrar diálogo
  const handleCloseDialog = () => {
    setOpenProjectDialog(false);
    resetForm();
  };

  // Función para cerrar snackbar
  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Función para exportar datos
  const handleExport = useCallback(async (exportData) => {
    try {
      let content = '';
      let filename = '';
      let mimeType = '';

      if (exportData.format === 'csv') {
        const headers = ['ID', 'Nombre', 'Cliente', 'Monto Sin IVA', 'Monto Con IVA', 'Fase', 'Estado', 'Fecha Creación', 'Descripción'];
        const csvContent = [
          headers.join(','),
          ...projects.map(project => [
            project.id,
            (project.nombre || '').replace(/,/g, ' '),
            (project.cliente_nombre || '').replace(/,/g, ' '),
            project.monto_sin_iva || '',
            project.monto_con_iva || '',
            (project.phase_nombre || '').replace(/,/g, ' '),
            (project.estado || '').replace(/,/g, ' '),
            project.created_at ? new Date(project.created_at).toLocaleDateString() : '',
            (project.descripcion || '').replace(/,/g, ' ')
          ].join(','))
        ].join('\n');
        
        content = csvContent;
        filename = `proyectos_${new Date().toISOString().split('T')[0]}.csv`;
        mimeType = 'text/csv';
      } else if (exportData.format === 'excel') {
        const headers = ['ID', 'Nombre', 'Cliente', 'Monto Sin IVA', 'Monto Con IVA', 'Fase', 'Estado', 'Fecha Creación', 'Descripción'];
        const tsvContent = [
          headers.join('\t'),
          ...projects.map(project => [
            project.id,
            (project.nombre || '').replace(/\t/g, ' '),
            (project.cliente_nombre || '').replace(/\t/g, ' '),
            project.monto_sin_iva || '',
            project.monto_con_iva || '',
            (project.phase_nombre || '').replace(/\t/g, ' '),
            (project.estado || '').replace(/\t/g, ' '),
            project.created_at ? new Date(project.created_at).toLocaleDateString() : '',
            (project.descripcion || '').replace(/\t/g, ' ')
          ].join('\t'))
        ].join('\n');
        
        content = tsvContent;
        filename = `proyectos_${new Date().toISOString().split('T')[0]}.tsv`;
        mimeType = 'text/tab-separated-values';
      } else {
                        const htmlContent = `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reporte de Proyectos</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #333; padding-bottom: 20px; }
        .project-section { margin-bottom: 30px; border: 1px solid #ddd; padding: 15px; border-radius: 8px; }
        .project-title { font-size: 18px; font-weight: bold; color: #333; margin-bottom: 15px; }
        .project-details { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
        .detail-item { margin-bottom: 8px; }
        .detail-label { font-weight: bold; color: #666; }
    </style>
</head>
<body>
    <div class="header">
        <h1>📊 REPORTE DE PROYECTOS</h1>
        <p><strong>Fecha de exportación:</strong> ${new Date().toLocaleString()}</p>
        <p><strong>Total de proyectos:</strong> ${projectsData.length}</p>
    </div>
    
    ${projectsData.map((project, index) => `
    <div class="project-section">
        <div class="project-title">📋 Proyecto ${index + 1}: ${project.nombre || 'N/A'}</div>
        <div class="project-details">
            <div class="detail-item">
                <span class="detail-label">ID:</span> ${project.id}
            </div>
            <div class="detail-item">
                <span class="detail-label">Cliente:</span> ${project.cliente_nombre || 'N/A'}
            </div>
            <div class="detail-item">
                <span class="detail-label">Monto Sin IVA:</span> ${project.monto_sin_iva ? formatCurrency(project.monto_sin_iva) : 'N/A'}
            </div>
            <div class="detail-item">
                <span class="detail-label">Monto Con IVA:</span> ${project.monto_con_iva ? formatCurrency(project.monto_con_iva) : 'N/A'}
            </div>
            <div class="detail-item">
                <span class="detail-label">Fase:</span> ${project.phase_nombre || 'N/A'}
            </div>
            <div class="detail-item">
                <span class="detail-label">Estado:</span> 
                <span style="color: ${project.estado === 'activo' ? '#27ae60' : '#e74c3c'}; font-weight: bold;">
                    ${project.estado || 'N/A'}
                </span>
            </div>
            <div class="detail-item">
                <span class="detail-label">Descripción:</span> ${project.descripcion || 'N/A'}
            </div>
            <div class="detail-item">
                <span class="detail-label">Fecha Creación:</span> ${project.created_at ? new Date(project.created_at).toLocaleDateString() : 'N/A'}
            </div>
        </div>
    </div>
    `).join('')}
</body>
</html>`;
                        
        content = htmlContent;
        filename = `proyectos_${new Date().toISOString().split('T')[0]}.html`;
        mimeType = 'text/html';
      }

      // Descargar archivo
      const blob = new Blob([content], { type: mimeType });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      setSnackbar({
        open: true,
        message: `Proyectos exportados exitosamente: ${filteredProjects.length} proyectos en formato ${exportData.format.toUpperCase()}`,
        severity: 'success'
      });
    } catch (error) {
      console.error('Error al exportar:', error);
      setSnackbar({
        open: true,
        message: 'Error al exportar proyectos',
        severity: 'error'
      });
    }
  }, [filteredProjects]);

  return (
    <StyledContainer maxWidth="xl">
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Header con botón de agregar */}
          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12}>
              <Box sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 3
              }}>
                <Typography variant="h4" sx={{
                  fontWeight: 700,
                  color: '#fff',
                  textShadow: '0 2px 4px rgba(0,0,0,0.3)'
                }}>
                  Gestión de Proyectos
                </Typography>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <ExportButton
                    data={filteredProjects}
                    filename="proyectos"
                    onExport={handleExport}
                  />
                  <Button
                    onClick={() => {
                      setIsEditing(false);
                      setEditingProjectId(null);
                      setFormData({
                        nombre: '',
                        cliente_id: '',
                        monto_sin_iva: '',
                        monto_con_iva: '',
                        phase_id: '',
                        estado: 'activo',
                        descripcion: ''
                      });
                      setOpenProjectDialog(true);
                    }}
                    variant="contained"
                    startIcon={<AddIcon />}
                    sx={{
                      background: 'linear-gradient(135deg, #27ae60, #229954)',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #229954, #1e8449)'
                      }
                    }}
                  >
                    Agregar Proyecto
                  </Button>
                </Box>
              </Box>
            
            {/* Stats optimizados */}
            <Grid container spacing={2} sx={{ mb: 2 }}>
              {stats.map((stat, index) => (
                <Grid item xs={6} md={3} key={index}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <StyledCard sx={{ 
                      p: 2, 
                      textAlign: 'center',
                      background: 'rgba(255,255,255,0.95)',
                      backdropFilter: 'blur(20px)',
                      border: '1px solid rgba(255,255,255,0.3)',
                      position: 'relative',
                      overflow: 'hidden',
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: '3px',
                        background: stat.color,
                        borderRadius: '2px'
                      }
                    }}>
                      <Box sx={{ 
                        color: stat.color, 
                        mb: 1,
                        display: 'flex',
                        justifyContent: 'center',
                        '& svg': {
                          fontSize: '2rem',
                          filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'
                        }
                      }}>
                        {stat.icon}
                      </Box>
                      <Typography variant="h4" sx={{ 
                        fontWeight: 800, 
                        color: '#2c3e50',
                        mb: 0.5,
                        textShadow: '0 1px 2px rgba(0,0,0,0.1)'
                      }}>
                        {stat.value}
                      </Typography>
                      <Typography variant="body2" sx={{ 
                        color: '#7f8c8d',
                        fontWeight: 500,
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                        fontSize: '0.75rem'
                      }}>
                        {stat.label}
                      </Typography>
                    </StyledCard>
                  </motion.div>
                </Grid>
              ))}
            </Grid>

          {/* Filtros y búsqueda */}
          <StyledCard sx={{ p: 3, mb: 3 }}>
            <Grid container spacing={3} alignItems="center">
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  placeholder="Buscar por nombre, cliente o estado..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <SearchIcon sx={{ color: 'rgba(102, 126, 234, 0.5)', mr: 1 }} />
                    )
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      backgroundColor: 'rgba(255,255,255,0.9)',
                    }
                  }}
                />
              </Grid>
              <Grid item xs={12} md={8}>
                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                  <IconButton
                    onClick={fetchProjects}
                    sx={{
                      background: 'rgba(255,255,255,0.2)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255,255,255,0.3)',
                      color: '#fff',
                      '&:hover': {
                        background: 'rgba(255,255,255,0.3)',
                        transform: 'scale(1.05)'
                      }
                    }}
                  >
                    <RefreshIcon />
                  </IconButton>
                </Box>
              </Grid>
            </Grid>
          </StyledCard>
            </Grid>
          </Grid>

          {/* Tabla de Proyectos - Ocupa todo el ancho */}
          <Grid container spacing={3}>
          <Grid item xs={12}>
              <StyledCard>
                <StyledTableContainer>
                  <StyledTable>
                    <TableHead>
                      <TableRow>
                        <TableCell>ID</TableCell>
                        <TableCell>NOMBRE</TableCell>
                        <TableCell>CLIENTE</TableCell>
                        <TableCell>MONTO SIN IVA</TableCell>
                        <TableCell>MONTO CON IVA</TableCell>
                        <TableCell>FASE</TableCell>
                        <TableCell>ESTADO</TableCell>
                        <TableCell align="center">ACCIONES</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {isPending ? (
                        Array.from({ length: 5 }).map((_, index) => (
                          <TableRow key={index}>
                            <TableCell><Skeleton width={40} /></TableCell>
                            <TableCell><Skeleton width={120} /></TableCell>
                            <TableCell><Skeleton width={100} /></TableCell>
                            <TableCell><Skeleton width={80} /></TableCell>
                            <TableCell><Skeleton width={80} /></TableCell>
                            <TableCell><Skeleton width={80} /></TableCell>
                            <TableCell><Skeleton width={60} /></TableCell>
                            <TableCell><Skeleton width={100} /></TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <AnimatePresence>
                          {filteredProjects.map((project, index) => (
                            <motion.tr
                              key={project.id}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -20 }}
                              transition={{ delay: index * 0.05 }}
                              component={TableRow}
                            >
                              <TableCell>{project.id}</TableCell>
                              <TableCell>
                                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                  {project.nombre}
                                </Typography>
                              </TableCell>
                              <TableCell>
                                <Typography variant="body2">
                                  {project.cliente_nombre || 'Sin cliente'}
                                </Typography>
                              </TableCell>
                              <TableCell>
                                <Typography variant="body2" sx={{ color: '#27ae60', fontWeight: 600 }}>
                                  {formatCurrency(project.monto_sin_iva)}
                                </Typography>
                              </TableCell>
                              <TableCell>
                                <Typography variant="body2" sx={{ color: '#f39c12', fontWeight: 600 }}>
                                  {formatCurrency(project.monto_con_iva)}
                                </Typography>
                              </TableCell>
                            <TableCell>
                              <StyledChip
                                label={project.phases?.nombre || 'Sin fase'}
                                sx={{
                                  backgroundColor: getPhaseColor(project.phases?.nombre).bg,
                                  color: getPhaseColor(project.phases?.nombre).text,
                                  fontWeight: 600,
                                  minWidth: 80,
                                  textAlign: 'center'
                                }}
                                size="small"
                              />
                            </TableCell>
                            <TableCell>
                              <StyledChip
                                label={project.estado === 'activo' ? 'Activo' : 
                                      project.estado === 'en_progreso' ? 'En Progreso' :
                                      project.estado === 'pausado' ? 'Pausado' :
                                      project.estado === 'completado' ? 'Completado' : 
                                      project.estado || 'Sin estado'}
                                sx={{
                                  backgroundColor: getStatusColor(project.estado).bg,
                                  color: getStatusColor(project.estado).text,
                                  fontWeight: 600,
                                  minWidth: 80,
                                  textAlign: 'center'
                                }}
                                size="small"
                              />
                            </TableCell>
                              <TableCell align="center">
                                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 0.5 }}>
                                  <Tooltip title="Ver detalles">
                                    <ActionButton
                                      color="#45b7d1"
                                      onClick={() => handleViewDetails(project)}
                                    >
                                      <VisibilityIcon fontSize="small" />
                                    </ActionButton>
                                  </Tooltip>
                                  <Tooltip title="Editar proyecto">
                                    <ActionButton
                                      color="#f39c12"
                                      onClick={() => handleEdit(project)}
                                    >
                                      <EditIcon fontSize="small" />
                                    </ActionButton>
                                  </Tooltip>
                                  <Tooltip title="Eliminar proyecto">
                                    <ActionButton
                                      color="#e74c3c"
                                      onClick={() => handleDelete(project)}
                                    >
                                      <DeleteIcon fontSize="small" />
                                    </ActionButton>
                                  </Tooltip>
                                </Box>
                              </TableCell>
                            </motion.tr>
                          ))}
                        </AnimatePresence>
                      )}
                    </TableBody>
                  </StyledTable>
                </StyledTableContainer>
              </StyledCard>
            </Grid>

            {/* Detalles del Proyecto Seleccionado */}
            {selectedProject && (
              <Grid item xs={12} lg={4}>
                <motion.div
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <StyledCard sx={{ mb: 3 }}>
                    <Box sx={{ p: 3, borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                      <Typography variant="h6" sx={{ fontWeight: 700, color: '#2c3e50', mb: 1 }}>
                        {selectedProject.nombre}
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#7f8c8d', mb: 2 }}>
                        Cliente: {selectedProject.cliente_nombre}
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                        <StyledChip
                          label={selectedProject.estado === 'activo' ? 'Activo' : 
                                selectedProject.estado === 'en_progreso' ? 'En Progreso' :
                                selectedProject.estado === 'completado' ? 'Completado' : 'Pausado'}
                          status={selectedProject.estado}
                          size="small"
                        />
                        <StyledChip
                          label={selectedProject.phase_nombre}
                          status="active"
                          size="small"
                        />
                      </Box>
                    </Box>
                    
                    <Box sx={{ p: 3 }}>
                      <Grid container spacing={2}>
                        <Grid item xs={6}>
                          <Typography variant="body2" sx={{ color: '#7f8c8d', mb: 0.5 }}>
                            Monto Sin IVA
                          </Typography>
                          <Typography variant="h6" sx={{ fontWeight: 600, color: '#27ae60' }}>
                            {formatCurrency(selectedProject.monto_sin_iva)}
                          </Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="body2" sx={{ color: '#7f8c8d', mb: 0.5 }}>
                            Monto Con IVA
                          </Typography>
                          <Typography variant="h6" sx={{ fontWeight: 600, color: '#f39c12' }}>
                            {formatCurrency(selectedProject.monto_con_iva)}
                          </Typography>
                        </Grid>
                      </Grid>
                      
                      <Box sx={{ mt: 3, display: 'flex', gap: 1 }}>
                        <Tooltip title="Editar proyecto">
                          <ActionButton
                            color="#f39c12"
                            onClick={() => handleEdit(selectedProject)}
                          >
                            <EditIcon fontSize="small" />
                          </ActionButton>
                        </Tooltip>
                      </Box>
                    </Box>
                  </StyledCard>
                </motion.div>
              </Grid>
            )}
          </Grid>

          {/* Diálogo de Proyecto */}
          <Dialog
            open={openProjectDialog}
            onClose={handleCloseDialog}
            maxWidth="md"
            fullWidth
            PaperProps={{
              sx: {
                borderRadius: 3,
                background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
              }
            }}
          >
            <DialogTitle sx={{ fontWeight: 700, color: '#2c3e50' }}>
              {isEditing ? 'Editar Proyecto' : 'Nuevo Proyecto'}
            </DialogTitle>
            <DialogContent>
              <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
                <Grid container spacing={3}>
                  {/* Información básica */}
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Nombre del Proyecto"
                      name="nombre"
                      value={formData.nombre}
                      onChange={handleChange}
                      required
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          backgroundColor: 'rgba(255,255,255,0.9)',
                        }
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth>
                      <InputLabel>Cliente</InputLabel>
                      <Select
                        name="cliente_id"
                        value={formData.cliente_id}
                        onChange={handleChange}
                        label="Cliente"
                        required
                        sx={{
                          borderRadius: 2,
                          backgroundColor: 'rgba(255,255,255,0.9)',
                        }}
                      >
                        <MenuItem value="">
                          <em>Seleccionar cliente</em>
                        </MenuItem>
                        {Array.isArray(clients) && clients.length > 0 ? (
                          clients.map((client) => (
                            <MenuItem key={client.id} value={client.id}>
                              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                  {client.nombre}
                                </Typography>
                                {client.empresa && (
                                  <Typography variant="caption" sx={{ color: '#7f8c8d' }}>
                                    {client.empresa}
                                  </Typography>
                                )}
                              </Box>
                            </MenuItem>
                          ))
                        ) : (
                          <MenuItem disabled>
                            <Typography variant="body2" sx={{ color: '#7f8c8d', fontStyle: 'italic' }}>
                              No hay clientes disponibles
                            </Typography>
                          </MenuItem>
                        )}
                      </Select>
                    </FormControl>
                  </Grid>
                  
                  {/* Montos */}
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Monto Sin IVA"
                      name="monto_sin_iva"
                      type="number"
                      value={formData.monto_sin_iva}
                      onChange={handleChange}
                      required
                      helperText="Se calculará automáticamente el IVA (16%)"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          backgroundColor: 'rgba(255,255,255,0.9)',
                        }
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Monto Con IVA (Calculado)"
                      name="monto_con_iva"
                      type="number"
                      value={formData.monto_con_iva}
                      onChange={handleChange}
                      disabled
                      helperText="Calculado automáticamente"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          backgroundColor: 'rgba(240,240,240,0.9)',
                          '&.Mui-disabled': {
                            backgroundColor: 'rgba(240,240,240,0.9)',
                          }
                        }
                      }}
                    />
                  </Grid>
                  
                  {/* Fase y Estado */}
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth>
                      <InputLabel>Fase del Proyecto</InputLabel>
                      <Select
                        name="phase_id"
                        value={formData.phase_id}
                        onChange={handleChange}
                        label="Fase del Proyecto"
                        sx={{
                          borderRadius: 2,
                          backgroundColor: 'rgba(255,255,255,0.9)',
                        }}
                      >
                        <MenuItem value="">
                          <em>Seleccionar fase</em>
                        </MenuItem>
                        {phases.map((phase) => {
                          const phaseColor = getPhaseColor(phase.nombre);
                          return (
                            <MenuItem key={phase.id} value={phase.id}>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Box sx={{ 
                                  width: 8, 
                                  height: 8, 
                                  borderRadius: '50%', 
                                  backgroundColor: phaseColor.bg 
                                }} />
                                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                  <Typography variant="body2" sx={{ fontWeight: 600, color: phaseColor.bg }}>
                                    {phase.nombre}
                                  </Typography>
                                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                    {phase.descripcion}
                                  </Typography>
                                </Box>
                              </Box>
                            </MenuItem>
                          );
                        })}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth>
                      <InputLabel>Estado del Proyecto</InputLabel>
                      <Select
                        name="estado"
                        value={formData.estado}
                        onChange={handleChange}
                        label="Estado del Proyecto"
                        sx={{
                          borderRadius: 2,
                          backgroundColor: 'rgba(255,255,255,0.9)',
                        }}
                      >
                        <MenuItem value="activo">
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Box sx={{ 
                              width: 8, 
                              height: 8, 
                              borderRadius: '50%', 
                              backgroundColor: '#27ae60' 
                            }} />
                            <Typography sx={{ color: '#27ae60', fontWeight: 600 }}>Activo</Typography>
                          </Box>
                        </MenuItem>
                        <MenuItem value="en_progreso">
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Box sx={{ 
                              width: 8, 
                              height: 8, 
                              borderRadius: '50%', 
                              backgroundColor: '#3498db' 
                            }} />
                            <Typography sx={{ color: '#3498db', fontWeight: 600 }}>En Progreso</Typography>
                          </Box>
                        </MenuItem>
                        <MenuItem value="pausado">
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Box sx={{ 
                              width: 8, 
                              height: 8, 
                              borderRadius: '50%', 
                              backgroundColor: '#e74c3c' 
                            }} />
                            <Typography sx={{ color: '#e74c3c', fontWeight: 600 }}>Pausado</Typography>
                          </Box>
                        </MenuItem>
                        <MenuItem value="completado">
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Box sx={{ 
                              width: 8, 
                              height: 8, 
                              borderRadius: '50%', 
                              backgroundColor: '#9b59b6' 
                            }} />
                            <Typography sx={{ color: '#9b59b6', fontWeight: 600 }}>Completado</Typography>
                          </Box>
                        </MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Descripción del Proyecto"
                      name="descripcion"
                      value={formData.descripcion}
                      onChange={handleChange}
                      multiline
                      rows={4}
                      placeholder="Describe los detalles, objetivos y alcance del proyecto..."
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          backgroundColor: 'rgba(255,255,255,0.9)',
                        }
                      }}
                    />
                  </Grid>
                </Grid>
              </Box>
            </DialogContent>
            <DialogActions sx={{ p: 3 }}>
              <Button
                variant="outlined"
                onClick={handleCloseDialog}
                sx={{
                  border: '1px solid rgba(102, 126, 234, 0.3)',
                  color: '#667eea',
                  '&:hover': {
                    borderColor: '#667eea',
                    background: 'rgba(102, 126, 234, 0.05)'
                  }
                }}
              >
                Cancelar
              </Button>
              <Button
                variant="contained"
                onClick={handleSubmit}
                sx={{
                  background: 'linear-gradient(135deg, #667eea, #764ba2)',
                  color: '#fff',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #5a6fd8, #6a4190)'
                  }
                }}
              >
                {isEditing ? 'Actualizar' : 'Crear'}
              </Button>
            </DialogActions>
          </Dialog>

          {/* Diálogo para Ver Detalles */}
          <Dialog
            open={viewDetailsOpen}
            onClose={handleCloseViewDetails}
            maxWidth="md"
            fullWidth
            PaperProps={{
              sx: {
                borderRadius: 3,
                background: 'linear-gradient(135deg, #667eea, #764ba2)',
                color: '#fff'
              }
            }}
          >
            <DialogTitle sx={{ 
              borderBottom: '1px solid rgba(255,255,255,0.2)',
              pb: 2,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <Typography variant="h5" sx={{ fontWeight: 600 }}>
                Detalles del Proyecto
              </Typography>
              <IconButton
                onClick={handleCloseViewDetails}
                sx={{ color: 'rgba(255,255,255,0.8)' }}
              >
                <CloseIcon />
              </IconButton>
            </DialogTitle>
            
            <DialogContent sx={{ pt: 3 }}>
              {viewingProject && (
                <Box sx={{ color: '#fff' }}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <Box sx={{ mb: 3 }}>
                        <Typography variant="subtitle2" sx={{ 
                          color: 'rgba(255,255,255,0.7)', 
                          mb: 1,
                          fontSize: '0.875rem',
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px'
                        }}>
                          Información Básica
                        </Typography>
                        <Box sx={{ 
                          backgroundColor: 'rgba(255,255,255,0.1)', 
                          p: 2, 
                          borderRadius: 2,
                          border: '1px solid rgba(255,255,255,0.2)'
                        }}>
                          <Typography variant="body1" sx={{ mb: 1 }}>
                            <strong>Nombre:</strong> {viewingProject.nombre}
                          </Typography>
                          <Typography variant="body1" sx={{ mb: 1 }}>
                            <strong>Cliente:</strong> {viewingProject.cliente_nombre || 'No asignado'}
                          </Typography>
                          <Box sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="body1" component="span">
                              <strong>Estado:</strong>
                            </Typography>
                            <Box component="span" sx={{ 
                              display: 'inline-flex', 
                              alignItems: 'center', 
                              gap: 1, 
                              px: 1.5,
                              py: 0.5,
                              borderRadius: 1,
                              backgroundColor: viewingProject.estado === 'activo' ? 'rgba(39, 174, 96, 0.2)' :
                                             viewingProject.estado === 'en_progreso' ? 'rgba(52, 152, 219, 0.2)' :
                                             viewingProject.estado === 'pausado' ? 'rgba(231, 76, 60, 0.2)' :
                                             'rgba(155, 89, 182, 0.2)',
                              border: viewingProject.estado === 'activo' ? '1px solid rgba(39, 174, 96, 0.5)' :
                                      viewingProject.estado === 'en_progreso' ? '1px solid rgba(52, 152, 219, 0.5)' :
                                      viewingProject.estado === 'pausado' ? '1px solid rgba(231, 76, 60, 0.5)' :
                                      '1px solid rgba(155, 89, 182, 0.5)',
                              color: viewingProject.estado === 'activo' ? '#27ae60' :
                                     viewingProject.estado === 'en_progreso' ? '#3498db' :
                                     viewingProject.estado === 'pausado' ? '#e74c3c' :
                                     '#9b59b6'
                            }}>
                              {viewingProject.estado === 'activo' ? 'Activo' :
                               viewingProject.estado === 'en_progreso' ? 'En Progreso' :
                               viewingProject.estado === 'pausado' ? 'Pausado' :
                               viewingProject.estado === 'completado' ? 'Completado' : viewingProject.estado}
                            </Box>
                          </Box>
                          <Typography variant="body1">
                            <strong>Fase:</strong> {viewingProject.phase_nombre || 'No asignada'}
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>
                    
                    <Grid item xs={12} md={6}>
                      <Box sx={{ mb: 3 }}>
                        <Typography variant="subtitle2" sx={{ 
                          color: 'rgba(255,255,255,0.7)', 
                          mb: 1,
                          fontSize: '0.875rem',
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px'
                        }}>
                          Información Financiera
                        </Typography>
                        <Box sx={{ 
                          backgroundColor: 'rgba(255,255,255,0.1)', 
                          p: 2, 
                          borderRadius: 2,
                          border: '1px solid rgba(255,255,255,0.2)'
                        }}>
                          <Typography variant="body1" sx={{ mb: 1 }}>
                            <strong>Monto Sin IVA:</strong> {formatCurrency(viewingProject.monto_sin_iva)}
                          </Typography>
                          <Typography variant="body1" sx={{ mb: 1 }}>
                            <strong>Monto Con IVA:</strong> {formatCurrency(viewingProject.monto_con_iva)}
                          </Typography>
                          <Typography variant="body1">
                            <strong>IVA:</strong> {formatCurrency((viewingProject.monto_con_iva || 0) - (viewingProject.monto_sin_iva || 0))}
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>
                    
                    {viewingProject.descripcion && (
                      <Grid item xs={12}>
                        <Box sx={{ mb: 3 }}>
                          <Typography variant="subtitle2" sx={{ 
                            color: 'rgba(255,255,255,0.7)', 
                            mb: 1,
                            fontSize: '0.875rem',
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px'
                          }}>
                            Descripción del Proyecto
                          </Typography>
                          <Box sx={{ 
                            backgroundColor: 'rgba(255,255,255,0.1)', 
                            p: 2, 
                            borderRadius: 2,
                            border: '1px solid rgba(255,255,255,0.2)'
                          }}>
                            <Typography variant="body1" sx={{ 
                              lineHeight: 1.6,
                              whiteSpace: 'pre-wrap'
                            }}>
                              {viewingProject.descripcion}
                            </Typography>
                          </Box>
                        </Box>
                      </Grid>
                    )}
                    
                    <Grid item xs={12}>
                      <Box sx={{ 
                        backgroundColor: 'rgba(255,255,255,0.1)', 
                        p: 2, 
                        borderRadius: 2,
                        border: '1px solid rgba(255,255,255,0.2)',
                        textAlign: 'center'
                      }}>
                        <Typography variant="body2" sx={{ 
                          color: 'rgba(255,255,255,0.7)',
                          mb: 1
                        }}>
                          Fecha de Creación
                        </Typography>
                        <Typography variant="body1">
                          {viewingProject.created_at ? 
                            new Date(viewingProject.created_at).toLocaleDateString('es-CL', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            }) : 'No disponible'
                          }
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </Box>
              )}
            </DialogContent>
            
            <DialogActions sx={{ p: 3, borderTop: '1px solid rgba(255,255,255,0.2)' }}>
              <Button
                variant="outlined"
                onClick={handleCloseViewDetails}
                sx={{
                  border: '1px solid rgba(255,255,255,0.3)',
                  color: '#fff',
                  '&:hover': {
                    borderColor: '#fff',
                    background: 'rgba(255,255,255,0.1)'
                  }
                }}
              >
                Cerrar
              </Button>
              <Button
                variant="contained"
                onClick={() => {
                  handleCloseViewDetails();
                  handleEdit(viewingProject);
                }}
                sx={{
                  background: 'linear-gradient(135deg, #667eea, #764ba2)',
                  color: '#fff',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #5a6fd8, #6a4190)'
                  }
                }}
              >
                Editar Proyecto
              </Button>
            </DialogActions>
          </Dialog>

          {/* Snackbar para notificaciones */}
          <Snackbar
            open={snackbar.open}
            autoHideDuration={6000}
            onClose={handleSnackbarClose}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          >
            <Alert 
              onClose={handleSnackbarClose} 
              severity={snackbar.severity}
              sx={{ borderRadius: 2 }}
            >
              {snackbar.message}
            </Alert>
          </Snackbar>
        </motion.div>
      </AnimatePresence>
    </StyledContainer>
  );
};

export default ProjectModule;