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
    console.log('🔍 DEBUG getModifiedFields:');
    console.log('  - Original:', original);
    console.log('  - Current:', current);
    
    const modified = {};
    Object.keys(current).forEach(key => {
      console.log(`  - Comparando campo "${key}":`);
      console.log(`    Original: "${original[key]}" (tipo: ${typeof original[key]})`);
      console.log(`    Current: "${current[key]}" (tipo: ${typeof current[key]})`);
      console.log(`    Son iguales: ${current[key] === original[key]}`);
      
      // Solo incluir campos que realmente han cambiado
      if (current[key] !== original[key]) {
        console.log(`    ✅ Campo "${key}" ha cambiado`);
        // No enviar campos vacíos que podrían sobrescribir datos existentes
        if (current[key] !== '' && current[key] !== null && current[key] !== undefined) {
          modified[key] = current[key];
          console.log(`    ✅ Campo "${key}" agregado a modifiedFields`);
        } else if (original[key] !== '' && original[key] !== null && original[key] !== undefined) {
          // Si el campo original tenía valor y ahora está vacío, mantener el original
          console.log(`Campo ${key} se mantiene con valor original:`, original[key]);
        }
      } else {
        console.log(`    ❌ Campo "${key}" NO ha cambiado`);
      }
    });
    
    console.log('📊 RESULTADO FINAL:');
    console.log('  - Campos originales:', original);
    console.log('  - Campos actuales:', current);
    console.log('  - Campos modificados:', modified);
    console.log('  - Total de campos modificados:', Object.keys(modified).length);
    
    return modified;
  };

  // Estados
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
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



  // Estados para clientes y fases
  const [clients, setClients] = useState([]);
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
      console.log('Proyectos obtenidos:', response.data); // Debug
      
      // La API puede devolver { success: true, data: [...], total: X } o directamente un array
      const projectsData = response.data.success && Array.isArray(response.data.data) 
        ? response.data.data 
        : response.data;
      
      const projectsWithNames = projectsData.map(project => ({
        ...project,
        cliente_nombre: project.client?.nombre || 'Sin cliente'
        // No forzar valor por defecto para estado, usar el valor real de la BD
      }));
      
      console.log('Proyectos procesados:', projectsWithNames); // Debug
      console.log('Ejemplo de proyecto:', projectsWithNames[0]); // Debug del primer proyecto
      
      // Log adicional para verificar estados
      console.log('🔍 Estados de proyectos recibidos:');
      projectsWithNames.slice(0, 3).forEach(project => {
        console.log(`  - Proyecto ID ${project.id}: estado = "${project.estado}"`);
      });
      
      setProjects(projectsWithNames);
      setFilteredProjects(projectsWithNames);
    } catch (error) {
      console.error('Error al obtener proyectos:', error);
      setSnackbar({ open: true, message: 'Error al obtener proyectos', severity: 'error' });
    }
  }, []);

  // Función para obtener clientes
  const fetchClients = useCallback(async () => {
    try {
      const response = await axios.get('/api/clients');
      console.log('Respuesta de clientes:', response.data); // Debug
      
      // La API devuelve { success: true, data: [...], total: 19 }
      if (response.data.success && Array.isArray(response.data.data)) {
        setClients(response.data.data);
        console.log('Clientes cargados:', response.data.data.length);
      } else if (Array.isArray(response.data)) {
        // Fallback: si la respuesta es directamente un array
        setClients(response.data);
        console.log('Clientes cargados (fallback):', response.data.length);
      } else {
        console.warn('La respuesta de clientes no es válida:', response.data);
        setClients([]);
      }
    } catch (error) {
      console.error('Error al obtener clientes:', error);
      setClients([]); // Asegurar que siempre sea un array
    }
  }, []);

  // Función para obtener costos del proyecto
  const fetchCosts = useCallback(async (projectId) => {
    // Implementar si es necesario
  }, []);

  // Efectos
  useEffect(() => {
    fetchProjects();
    fetchClients();
  }, [fetchProjects, fetchClients]);

  // Filtrado de proyectos
  useEffect(() => {
    const filtered = projects.filter(project =>
      project.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.cliente_nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.estado?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProjects(filtered);
  }, [projects, searchTerm]);

  // Estadísticas mejoradas
  const stats = useMemo(() => [
    {
      label: 'Total Proyectos',
      value: projects.length,
      color: '#667eea',
      icon: <AssignmentIcon />
    },
    {
      label: 'Total Montos con IVA',
      value: formatCurrency(projects.reduce((sum, p) => sum + (parseFloat(p.monto_con_iva) || 0), 0)),
      color: '#f39c12',
      icon: <AttachMoneyIcon />
    },
    {
      label: 'Proyectos Activos',
      value: projects.filter(p => p.estado === 'activo').length,
      color: '#27ae60',
      icon: <TrendingUpIcon />
    },
    {
      label: 'Completados',
      value: projects.filter(p => p.estado === 'completado').length,
      color: '#9b59b6',
      icon: <CheckCircleIcon />
    }
  ], [projects]);

  // Handlers
  const handleCloseDialog = useCallback(() => {
    setOpenProjectDialog(false);
    setIsEditing(false);
    setEditingProjectId(null);
    setOriginalProjectData(null);
    setFormData({
      nombre: '',
      cliente_id: '',
      monto_sin_iva: '',
      monto_con_iva: '',
      phase_id: '',
      estado: 'activo',
      descripcion: ''
    });
  }, []);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    
    console.log(`🔄 Campo cambiado: ${name} = ${value}`);
    
    if (name === 'monto_sin_iva') {
      // Calcular automáticamente el monto con IVA (16%)
      const montoSinIva = parseFloat(value) || 0;
      const montoConIva = montoSinIva * 1.16;
      
      setFormData(prev => {
        const newData = {
          ...prev,
          [name]: value,
          monto_con_iva: montoConIva.toFixed(2)
        };
        console.log('Nuevos datos del formulario (monto):', newData);
        return newData;
      });
    } else {
      setFormData(prev => {
        const newData = { ...prev, [name]: value };
        console.log('Nuevos datos del formulario:', newData);
        return newData;
      });
    }
  }, []);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    console.log('🚀 handleSubmit ejecutado');
    console.log('  - isEditing:', isEditing);
    console.log('  - editingProjectId:', editingProjectId);
    console.log('  - formData:', formData);
    console.log('  - originalProjectData:', originalProjectData);
    
    try {
      if (isEditing) {
        console.log('🔄 MODO EDICIÓN ACTIVADO');
        console.log('  - editingProjectId:', editingProjectId);
        console.log('  - originalProjectData:', originalProjectData);
        console.log('  - formData actual:', formData);
        
        // Verificar que tenemos datos originales
        if (!originalProjectData) {
          console.log('❌ ERROR: No hay datos originales para comparar');
          setSnackbar({ open: true, message: 'Error: No hay datos originales para comparar', severity: 'error' });
          return;
        }
        
        // Enviar solo los campos modificados
        const modifiedFields = getModifiedFields(originalProjectData, formData);
        console.log('📋 Campos modificados:', modifiedFields);
        
        if (Object.keys(modifiedFields).length === 0) {
          console.log('⚠️ No hay cambios para guardar');
          setSnackbar({ open: true, message: 'No hay cambios para guardar.', severity: 'info' });
          return;
        }
        
        console.log('Enviando actualización al backend:', {
          projectId: editingProjectId,
          modifiedFields: modifiedFields
        });
        
        console.log('🔍 Detalle de la petición PUT:', {
          url: `/api/projects/${editingProjectId}`,
          data: modifiedFields,
          headers: { 'Content-Type': 'application/json' }
        });
        
        const response = await axios.put(`/api/projects/${editingProjectId}`, modifiedFields);
        console.log('✅ Respuesta del backend:', response.data);
        setSnackbar({ open: true, message: 'Proyecto actualizado exitosamente.', severity: 'success' });
        
        console.log('🔄 Refrescando lista de proyectos...');
        await fetchProjects();
        console.log('✅ Lista de proyectos refrescada');
      } else {
        console.log('🆕 MODO CREACIÓN ACTIVADO');
        await axios.post('/api/projects', formData);
        setSnackbar({ open: true, message: 'Proyecto creado exitosamente.', severity: 'success' });
        
        console.log('🔄 Refrescando lista de proyectos...');
        await fetchProjects();
        console.log('✅ Lista de proyectos refrescada');
      }
      
      handleCloseDialog();
    } catch (error) {
      console.error('Error al guardar proyecto:', error);
      setSnackbar({ open: true, message: 'Error al guardar proyecto.', severity: 'error' });
    }
  }, [isEditing, editingProjectId, formData, originalProjectData, fetchProjects, handleCloseDialog]);

  const handleDelete = useCallback(async (project) => {
    if (window.confirm(`¿Estás seguro de que quieres eliminar el proyecto "${project.nombre}"?`)) {
      try {
        await axios.delete(`/api/projects/${project.id}`);
        setSnackbar({ open: true, message: 'Proyecto eliminado exitosamente.', severity: 'success' });
        fetchProjects();
      } catch (error) {
        console.error('Error al eliminar proyecto:', error);
        setSnackbar({ open: true, message: 'Error al eliminar proyecto.', severity: 'error' });
      }
    }
  }, [fetchProjects]);

  const handleEdit = useCallback((project) => {
    console.log('🎯 handleEdit ejecutado para proyecto:', project);
    
    setIsEditing(true);
    setEditingProjectId(project.id);
    
    // Almacenar datos originales para comparación (sin valores por defecto)
    const originalData = {
      nombre: project.nombre,
      cliente_id: project.cliente_id,
      monto_sin_iva: project.monto_sin_iva,
      monto_con_iva: project.monto_con_iva,
      phase_id: project.phase_id,
      estado: project.estado,
      descripcion: project.descripcion
    };
    
    setOriginalProjectData(originalData);
    
    // Establecer datos del formulario (con valores por defecto para campos vacíos)
    const formDataToSet = {
      nombre: project.nombre || '',
      cliente_id: project.cliente_id || '',
      monto_sin_iva: project.monto_sin_iva || '',
      monto_con_iva: project.monto_con_iva || '',
      phase_id: project.phase_id || '',
      estado: project.estado || 'activo',
      descripcion: project.descripcion || ''
    };
    
    setFormData(formDataToSet);
    
    console.log('📋 Datos originales almacenados:', originalData);
    console.log('📝 FormData establecido:', formDataToSet);
    console.log('✅ Estado de edición activado');
    
    setOpenProjectDialog(true);
  }, []);

  const handleView = useCallback((project) => {
    setSelectedProject(project);
    fetchCosts(project.id);
    setActiveTab(0);
  }, [fetchCosts]);

  const handleViewDetails = useCallback((project) => {
    setViewingProject(project);
    setViewDetailsOpen(true);
  }, []);

  const handleCloseViewDetails = useCallback(() => {
    setViewDetailsOpen(false);
    setViewingProject(null);
  }, []);

  const handleSnackbarClose = useCallback(() => {
    setSnackbar(prev => ({ ...prev, open: false }));
  }, []);



  return (
    <StyledContainer maxWidth="xl">
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Header con estadísticas */}
          <Box sx={{ mb: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Box>
                <Typography variant="h3" sx={{ 
                  fontWeight: 800, 
                  color: '#fff',
                  textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                  mb: 1
                }}>
                  Gestión de Proyectos
                </Typography>
                <Typography variant="h6" sx={{ 
                  color: 'rgba(255,255,255,0.8)',
                  fontWeight: 400
                }}>
                  Administra proyectos, costos y fases de desarrollo
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', gap: 2 }}>
                <ExportButton 
                  modules={[
                    { id: 'projects', name: 'Proyectos', description: 'Información de proyectos y fases' }
                  ]}
                  onExport={async (exportData) => {
                    console.log('Exportando proyectos:', exportData);
                    
                    try {
                      // Preguntar al usuario si quiere exportar solo los filtrados o todos
                      const exportFiltered = window.confirm(
                        `¿Qué quieres exportar?\n\n` +
                        `• Solo proyectos filtrados (${filteredProjects.length} proyectos)\n` +
                        `• Todos los proyectos (${projects.length} proyectos)\n\n` +
                        `Haz clic en "Aceptar" para exportar solo los filtrados, o "Cancelar" para exportar todos.`
                      );
                      
                      // Usar los datos filtrados o todos según la elección del usuario
                      const projectsData = exportFiltered ? filteredProjects : projects;
                      
                      if (projectsData.length === 0) {
                        setSnackbar({ 
                          open: true, 
                          message: 'No hay proyectos para exportar', 
                          severity: 'warning' 
                        });
                        return;
                      }
                      
                      // Crear contenido del archivo según el formato
                      let content, filename, mimeType;
                      
                      if (exportData.format === 'csv') {
                        const headers = ['ID', 'Nombre', 'Cliente', 'Monto Sin IVA', 'Monto Con IVA', 'Fase', 'Estado', 'Fecha Creación', 'Descripción'];
                        const csvContent = [
                          headers.join(','),
                          ...projectsData.map(project => [
                            project.id,
                            (project.nombre || '').replace(/,/g, ';'),
                            (project.cliente_nombre || '').replace(/,/g, ';'),
                            project.monto_sin_iva || '',
                            project.monto_con_iva || '',
                            (project.phase_nombre || '').replace(/,/g, ';'),
                            (project.estado || '').replace(/,/g, ';'),
                            project.created_at ? new Date(project.created_at).toLocaleDateString() : '',
                            (project.descripcion || '').replace(/,/g, ';')
                          ].join(','))
                        ].join('\n');
                        
                        content = csvContent;
                        filename = `proyectos_${new Date().toISOString().split('T')[0]}.csv`;
                        mimeType = 'text/csv';
                      } else if (exportData.format === 'excel') {
                        const headers = ['ID', 'Nombre', 'Cliente', 'Monto Sin IVA', 'Monto Con IVA', 'Fase', 'Estado', 'Fecha Creación', 'Descripción'];
                        const tsvContent = [
                          headers.join('\t'),
                          ...projectsData.map(project => [
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
                        message: `Proyectos exportados exitosamente: ${projectsData.length} proyectos en formato ${exportData.format.toUpperCase()}`, 
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
                  }}
                />


                <IconButton
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
                  sx={{
                    background: 'linear-gradient(135deg, #27ae60, #229954)',
                    color: '#fff',
                    borderRadius: 2,
                    px: 3,
                    py: 1,
                    '&:hover': {
                      background: 'linear-gradient(135deg, #229954, #1e8449)',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 4px 12px rgba(39, 174, 96, 0.3)'
                    }
                  }}
                >
                  <AddIcon sx={{ mr: 1 }} />
                  Agregar Proyecto
                </IconButton>
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
          </Box>

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

          {/* Tabla de Proyectos - Ocupa todo el ancho */}
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
                          <Typography variant="body1" sx={{ mb: 1 }}>
                            <strong>Estado:</strong> 
                            <Box component="span" sx={{ 
                              display: 'inline-flex', 
                              alignItems: 'center', 
                              gap: 1, 
                              ml: 1,
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
                          </Typography>
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