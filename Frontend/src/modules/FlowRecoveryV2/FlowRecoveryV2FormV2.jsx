// src/modules/FlowRecoveryV2/FlowRecoveryV2FormV2.jsx
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

// Componentes estilizados modernos IDÉNTICOS a PROYECTOS
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
  backgroundColor: status === 'recuperado' ? '#27ae60' :
                 status === 'pendiente' ? '#3498db' :
                 status === 'en_proceso' ? '#e74c3c' :
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

const FlowRecoveryV2Module = () => {
  // Función de formato de moneda IDÉNTICA a PROYECTOS
  const formatCurrency = (amount) => {
    if (!amount || isNaN(amount)) return '$0.00';
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 2
    }).format(amount);
  };

  // Función para obtener el color del estado IDÉNTICA a PROYECTOS
  const getStatusColor = (status) => {
    switch (status) {
      case 'recuperado':
        return { bg: '#27ae60', text: 'white' };
      case 'pendiente':
        return { bg: '#3498db', text: 'white' };
      case 'en_proceso':
        return { bg: '#e74c3c', text: 'white' };
      case 'completado':
        return { bg: '#9b59b6', text: 'white' };
      default:
        return { bg: '#95a5a6', text: 'white' };
    }
  };

  // Función para obtener solo los campos modificados IDÉNTICA a PROYECTOS
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

  // Estados IDÉNTICOS a PROYECTOS
  const [flows, setFlows] = useState([]);
  const [filteredFlows, setFilteredFlows] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [openFlowDialog, setOpenFlowDialog] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingFlowId, setEditingFlowId] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [viewDetailsOpen, setViewDetailsOpen] = useState(false);
  const [viewingFlow, setViewingFlow] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [isPending, startTransition] = useTransition();

  // Log para debug del estado isPending
  useEffect(() => {
    console.log('🔍 Frontend - Estado isPending cambiado:', isPending);
  }, [isPending]);

  // Log para debug del estado flows
  useEffect(() => {
    console.log('🔍 Frontend - Estado flows cambiado:', flows);
    console.log('🔍 Frontend - flows.length:', flows.length);
    console.log('🔍 Frontend - flows es array:', Array.isArray(flows));
    if (flows.length > 0) {
      console.log('🔍 Frontend - Primer flow en estado:', flows[0]);
    }
  }, [flows]);

  // Log para debug del estado filteredFlows
  useEffect(() => {
    console.log('🔍 Frontend - Estado filteredFlows cambiado:', filteredFlows);
    console.log('🔍 Frontend - filteredFlows.length:', filteredFlows.length);
    console.log('🔍 Frontend - filteredFlows es array:', Array.isArray(filteredFlows));
    if (filteredFlows.length > 0) {
      console.log('🔍 Frontend - Primer filteredFlow en estado:', filteredFlows[0]);
    }
  }, [filteredFlows]);

  // Estados del formulario IDÉNTICOS a PROYECTOS
  const [formData, setFormData] = useState({
    concepto: '',
    monto: '',
    fecha: new Date().toISOString().split('T')[0],
    cliente_id: '',
    proyecto_id: '',
    categoria: '',
    estado: 'pendiente',
    descripcion: '',
    prioridad: 'media',
    notas: '',
    fecha_vencimiento: '',
    recuperado: false
  });

  // Estado para almacenar datos originales del flow (para edición)
  const [originalFlowData, setOriginalFlowData] = useState(null);

  // Estados para clientes y proyectos
  const [clients, setClients] = useState([]);
  const [projects, setProjects] = useState([]);

  // Función para obtener flows IDÉNTICA a PROYECTOS
  const fetchFlows = useCallback(async () => {
    try {
      console.log('🔍 Frontend - Iniciando fetchFlows...');
      const response = await axios.get('/api/flowRecoveryV2');
      console.log('🔍 Frontend - Response completa:', response);
      console.log('🔍 Frontend - Response.status:', response.status);
      console.log('🔍 Frontend - Response.headers:', response.headers);
      console.log('🔍 Frontend - Response.data:', response.data);
      console.log('🔍 Frontend - Response.data.success:', response.data.success);
      console.log('🔍 Frontend - Response.data.data:', response.data.data);
      console.log('🔍 Frontend - Response.data.data.length:', response.data.data?.length);
      
      // La API puede devolver { success: true, data: [...], total: X } o directamente un array
      const flowsData = response.data.success && Array.isArray(response.data.data) 
        ? response.data.data 
        : response.data;
      
      console.log('🔍 Frontend - flowsData extraído:', flowsData);
      console.log('🔍 Frontend - flowsData es array:', Array.isArray(flowsData));
      
      console.log('🔍 Frontend - Procesando flows individuales...');
      const flowsWithNames = flowsData.map((flow, index) => {
        console.log(`🔍 Frontend - Procesando flow ${index + 1}:`, flow);
        const processedFlow = {
          ...flow,
          cliente_nombre: flow.clients?.nombre || 'Sin cliente',
          proyecto_nombre: flow.projects?.nombre || 'Sin proyecto'
        };
        console.log(`🔍 Frontend - Flow ${index + 1} procesado:`, processedFlow);
        return processedFlow;
      });
      
      console.log('🔍 Frontend - flowsWithNames procesado:', flowsWithNames);
      console.log('🔍 Frontend - Primer flow:', flowsWithNames[0]);
      
      // Log adicional para verificar estados
      console.log('🔍 Frontend - Estados de flows recibidos:');
      flowsWithNames.slice(0, 3).forEach(flow => {
        console.log(`  - Flow ID ${flow.id}: recuperado = "${flow.recuperado}"`);
      });
      
      console.log('🔍 Frontend - Estableciendo flows en estado...');
      console.log('🔍 Frontend - flowsWithNames a establecer:', flowsWithNames);
      setFlows(flowsWithNames);
      setFilteredFlows(flowsWithNames);
      console.log('🔍 Frontend - Estados establecidos correctamente');
      console.log('🔍 Frontend - setFlows y setFilteredFlows llamados');
    } catch (error) {
      console.error('❌ Frontend - Error al obtener flows:', error);
      setSnackbar({ open: true, message: 'Error al obtener flows', severity: 'error' });
    }
  }, []);

  // Función para obtener clientes IDÉNTICA a PROYECTOS
  const fetchClients = useCallback(async () => {
    try {
      const response = await axios.get('/api/clients');
      const clientsData = response.data.success && Array.isArray(response.data.data) 
        ? response.data.data 
        : response.data;
      setClients(clientsData);
    } catch (error) {
      console.error('Error al obtener clientes:', error);
    }
  }, []);

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

  // Función para crear flow IDÉNTICA a PROYECTOS
  const handleCreateFlow = async () => {
    try {
      console.log('🔍 Frontend - handleCreateFlow iniciado');
      console.log('🔍 Frontend - formData a enviar:', formData);
      console.log('🔍 Frontend - URL de la API:', '/api/flowRecoveryV2');
      
      const response = await axios.post('/api/flowRecoveryV2', formData);
      console.log('🔍 Frontend - handleCreateFlow respuesta exitosa:', response.data);
      
      if (response.data.success) {
        setSnackbar({ open: true, message: 'Flow creado exitosamente', severity: 'success' });
        setOpenFlowDialog(false);
        resetForm();
        fetchFlows();
      } else {
        console.warn('🔍 Frontend - handleCreateFlow: response.data.success es false:', response.data);
      }
    } catch (error) {
      console.error('🔍 Frontend - handleCreateFlow error:', error);
      console.error('🔍 Frontend - handleCreateFlow error.response:', error.response);
      console.error('🔍 Frontend - handleCreateFlow error.message:', error.message);
      setSnackbar({ open: true, message: 'Error al crear flow', severity: 'error' });
    }
  };

  // Función para actualizar flow IDÉNTICA a PROYECTOS
  const handleUpdateFlow = async () => {
    try {
      console.log('🔍 Frontend - handleUpdateFlow iniciado');
      console.log('🔍 Frontend - editingFlowId:', editingFlowId);
      console.log('🔍 Frontend - originalFlowData:', originalFlowData);
      console.log('🔍 Frontend - formData actual:', formData);
      
      const modifiedFields = getModifiedFields(originalFlowData, formData);
      console.log('🔍 Frontend - Campos modificados para actualización:', modifiedFields);
      
      if (Object.keys(modifiedFields).length === 0) {
        console.log('🔍 Frontend - No hay cambios para guardar');
        setSnackbar({ open: true, message: 'No hay cambios para guardar', severity: 'info' });
        return;
      }

      console.log('🔍 Frontend - URL de la API:', `/api/flowRecoveryV2/${editingFlowId}`);
      const response = await axios.put(`/api/flowRecoveryV2/${editingFlowId}`, modifiedFields);
      console.log('🔍 Frontend - handleUpdateFlow respuesta exitosa:', response.data);
      
      if (response.data.success) {
        setSnackbar({ open: true, message: 'Flow actualizado exitosamente', severity: 'success' });
        setOpenFlowDialog(false);
        resetForm();
        fetchFlows();
      } else {
        console.warn('🔍 Frontend - handleUpdateFlow: response.data.success es false:', response.data);
      }
    } catch (error) {
      console.error('🔍 Frontend - handleUpdateFlow error:', error);
      console.error('🔍 Frontend - handleUpdateFlow error.response:', error.response);
      console.error('🔍 Frontend - handleUpdateFlow error.message:', error.message);
      setSnackbar({ open: true, message: 'Error al actualizar flow', severity: 'error' });
    }
  };

  // Función para eliminar flow IDÉNTICA a PROYECTOS
  const handleDelete = async (flow) => {
    console.log('🔍 Frontend - handleDelete iniciado para flow:', flow);
    
    if (window.confirm(`¿Estás seguro de eliminar el flow "${flow.concepto}"?`)) {
      try {
        console.log('🔍 Frontend - Usuario confirmó eliminación');
        console.log('🔍 Frontend - URL de la API:', `/api/flowRecoveryV2/${flow.id}`);
        
        const response = await axios.delete(`/api/flowRecoveryV2/${flow.id}`);
        console.log('🔍 Frontend - handleDelete respuesta exitosa:', response.data);
        
        if (response.data.success) {
          setSnackbar({ open: true, message: 'Flow eliminado exitosamente', severity: 'success' });
          fetchFlows();
        } else {
          console.warn('🔍 Frontend - handleDelete: response.data.success es false:', response.data);
        }
      } catch (error) {
        console.error('🔍 Frontend - handleDelete error:', error);
        console.error('🔍 Frontend - handleDelete error.response:', error.response);
        console.error('🔍 Frontend - handleDelete error.message:', error.message);
        setSnackbar({ open: true, message: 'Error al eliminar flow', severity: 'error' });
      }
    } else {
      console.log('🔍 Frontend - Usuario canceló la eliminación');
    }
  };

  // Función para editar flow IDÉNTICA a PROYECTOS
  const handleEdit = (flow) => {
    console.log('🔍 Frontend - handleEdit iniciado para flow:', flow);
    console.log('🔍 Frontend - Estado antes del edit:', { isEditing, editingFlowId, openFlowDialog });
    
    setIsEditing(true);
    setEditingFlowId(flow.id);
    
    const flowData = {
      concepto: flow.concepto || '',
      monto: flow.monto || '',
      fecha: flow.fecha ? new Date(flow.fecha).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      cliente_id: flow.cliente_id || '',
      proyecto_id: flow.proyecto_id || '',
      categoria: flow.categoria || '',
      estado: flow.estado || 'pendiente',
      descripcion: flow.descripcion || '',
      prioridad: flow.prioridad || 'media',
      notas: flow.notas || '',
      fecha_vencimiento: flow.fecha_vencimiento ? new Date(flow.fecha_vencimiento).toISOString().split('T')[0] : '',
      recuperado: flow.recuperado || false
    };
    
    console.log('🔍 Frontend - Datos del flow a editar:', flowData);
    
    setOriginalFlowData(flowData);
    setFormData(flowData);
    setOpenFlowDialog(true);
    
    console.log('🔍 Frontend - Estado después del edit:', { isEditing: true, editingFlowId: flow.id, openFlowDialog: true });
  };

  // Función para ver detalles IDÉNTICA a PROYECTOS
  const handleViewDetails = (flow) => {
    console.log('🔍 Frontend - handleViewDetails iniciado para flow:', flow);
    console.log('🔍 Frontend - Estado antes de ver detalles:', { viewingFlow, viewDetailsOpen });
    setViewingFlow(flow);
    setViewDetailsOpen(true);
    console.log('🔍 Frontend - Estado después de ver detalles:', { viewingFlow: flow, viewDetailsOpen: true });
  };

  // Función para cerrar detalles IDÉNTICA a PROYECTOS
  const handleCloseViewDetails = () => {
    console.log('🔍 Frontend - handleCloseViewDetails ejecutado');
    setViewDetailsOpen(false);
    setViewingFlow(null);
  };

  // Función para resetear formulario IDÉNTICA a PROYECTOS
  const resetForm = () => {
    console.log('🔍 Frontend - resetForm ejecutado');
    console.log('🔍 Frontend - Estado antes del reset:', { isEditing, editingFlowId, openFlowDialog });
    
    setFormData({
      concepto: '',
      monto: '',
      fecha: new Date().toISOString().split('T')[0],
      cliente_id: '',
      proyecto_id: '',
      categoria: '',
      estado: 'pendiente',
      descripcion: '',
      prioridad: 'media',
      notas: '',
      fecha_vencimiento: '',
      recuperado: false
    });
    setIsEditing(false);
    setEditingFlowId(null);
    setOriginalFlowData(null);
    
    console.log('🔍 Frontend - Estado después del reset:', { isEditing: false, editingFlowId: null, openFlowDialog: false });
  };

  // Función para manejar envío del formulario IDÉNTICA a PROYECTOS
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('🔍 Frontend - handleSubmit ejecutado');
    console.log('🔍 Frontend - isEditing:', isEditing);
    console.log('🔍 Frontend - formData actual:', formData);
    
    if (isEditing) {
      console.log('🔍 Frontend - Llamando a handleUpdateFlow');
      handleUpdateFlow();
    } else {
      console.log('🔍 Frontend - Llamando a handleCreateFlow');
      handleCreateFlow();
    }
  };

  // Función para cerrar diálogo IDÉNTICA a PROYECTOS
  const handleCloseDialog = () => {
    console.log('🔍 Frontend - handleCloseDialog ejecutado');
    console.log('🔍 Frontend - Estado antes de cerrar:', { openFlowDialog, isEditing, editingFlowId });
    setOpenFlowDialog(false);
    resetForm();
    console.log('🔍 Frontend - Estado después de cerrar:', { openFlowDialog: false, isEditing: false, editingFlowId: null });
  };

  // Función para cerrar snackbar IDÉNTICA a PROYECTOS
  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Efecto para filtros IDÉNTICO a PROYECTOS
  useEffect(() => {
    console.log('🔍 Frontend - useEffect filtros ejecutándose...');
    console.log('🔍 Frontend - flows en estado:', flows);
    console.log('🔍 Frontend - searchTerm:', searchTerm);
    console.log('🔍 Frontend - Stack trace del useEffect filtros:', new Error().stack);
    
    let filtered = flows;

    if (searchTerm) {
      filtered = filtered.filter(flow =>
        flow.concepto?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        flow.cliente_nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        flow.categoria?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    console.log('🔍 Frontend - filtered resultante:', filtered);
    setFilteredFlows(filtered);
  }, [flows, searchTerm]);

  // Efectos para cargar datos IDÉNTICOS a PROYECTOS
  useEffect(() => {
    fetchClients();
    fetchProjects();
  }, [fetchClients, fetchProjects]);

  useEffect(() => {
    console.log('🔍 Frontend - useEffect fetchFlows ejecutándose...');
    fetchFlows();
  }, [fetchFlows]);

  // Monitorear cambios en el estado del diálogo
  useEffect(() => {
    console.log('🔍 Frontend - useEffect openFlowDialog cambiado:', openFlowDialog);
    console.log('🔍 Frontend - Estado completo del diálogo:', { openFlowDialog, isEditing, editingFlowId, viewingFlow });
    
    // Agregar stack trace para identificar qué función cambió el estado
    if (openFlowDialog) {
      console.log('🔍 Frontend - Diálogo ABIERTO - Stack trace:', new Error().stack);
    } else {
      console.log('🔍 Frontend - Diálogo CERRADO - Stack trace:', new Error().stack);
    }
  }, [openFlowDialog, isEditing, editingFlowId, viewingFlow]);

  // Estadísticas IDÉNTICAS a PROYECTOS
  const stats = useMemo(() => [
    { 
      label: 'Total Flows', 
      value: flows.length.toString(), 
      icon: <TrendingUpIcon />, 
      color: '#667eea' 
    },
    { 
      label: 'Monto Total', 
      value: formatCurrency(flows.reduce((sum, f) => sum + parseFloat(f.monto || 0), 0)), 
      icon: <AttachMoneyIcon />, 
      color: '#27ae60' 
    },
    { 
      label: 'Recuperados', 
      value: flows.filter(f => f.recuperado).length.toString(), 
      icon: <CheckCircleIcon />, 
      color: '#2e7d32' 
    },
    { 
      label: 'Pendientes', 
      value: flows.filter(f => !f.recuperado).length.toString(), 
      icon: <ScheduleIcon />, 
      color: '#f39c12' 
    }
  ], [flows]);

  return (
    <StyledContainer maxWidth="xl">
      <Grid container spacing={3}>
        {/* Header y estadísticas - IDÉNTICO a PROYECTOS */}
        <Grid item xs={12}>
          <Box sx={{ mb: 3 }}>
            {/* Header principal */}
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              mb: 3,
              flexWrap: 'wrap',
              gap: 2
            }}>
              <Box>
                <Typography variant="h3" sx={{ 
                  fontWeight: 800, 
                  color: '#fff',
                  mb: 1,
                  textShadow: '0 2px 4px rgba(0,0,0,0.3)'
                }}>
                  Flow Recovery V2
                </Typography>
                <Typography variant="h6" sx={{ 
                  color: 'rgba(255,255,255,0.9)',
                  fontWeight: 400
                }}>
                  Gestión de flujos de recuperación del sistema
                </Typography>
              </Box>
              
              {/* Botones de acción - IDÉNTICOS a PROYECTOS */}
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Button
                  onClick={async () => {
                    console.log('🧪 PRUEBA SIMPLE - CLIC DETECTADO');
                    
                    try {
                      const response = await axios.get('/api/flowRecoveryV2');
                      console.log('✅ Prueba simple exitosa:', response.data);
                      setSnackbar({ 
                        open: true, 
                        message: 'Prueba simple exitosa', 
                        severity: 'success' 
                      });
                    } catch (error) {
                      console.error('❌ Error en prueba simple:', error);
                      setSnackbar({ 
                        open: true, 
                        message: 'Error en prueba simple: ' + error.message, 
                        severity: 'error' 
                      });
                    }
                  }}
                  variant="contained"
                  sx={{
                    background: 'linear-gradient(135deg, #9b59b6, #8e44ad)',
                    color: '#fff',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #8e44ad, #7d3c98)'
                    }
                  }}
                >
                  🧪 SIMPLE
                </Button>
                <Button
                  onClick={async () => {
                    console.log('🧪 PRUEBA CREAR - CLIC DETECTADO');
                    
                    try {
                      const testData = {
                        concepto: 'Prueba Crear - ' + new Date().toISOString(),
                        monto: 999.99,
                        fecha: new Date().toISOString().split('T')[0],
                        categoria: 'Prueba',
                        estado: 'pendiente',
                        descripcion: 'Descripción de prueba',
                        prioridad: 'media',
                        notas: 'Notas de prueba',
                        recuperado: false
                      };
                      
                      console.log('📝 Datos de prueba a enviar:', testData);
                      
                      const response = await axios.post('/api/flowRecoveryV2', testData);
                      console.log('✅ Prueba crear exitosa:', response.data);
                      setSnackbar({ 
                        open: true, 
                        message: 'Prueba crear exitosa: ' + response.data.message, 
                        severity: 'success' 
                      });
                      
                      // Recargar los datos
                      fetchFlows();
                    } catch (error) {
                      console.error('❌ Error en prueba crear:', error);
                      console.error('❌ Error response:', error.response);
                      setSnackbar({ 
                        open: true, 
                        message: 'Error en prueba crear: ' + (error.response?.data?.message || error.message), 
                        severity: 'error' 
                      });
                    }
                  }}
                  variant="contained"
                  sx={{
                    background: 'linear-gradient(135deg, #e74c3c, #c0392b)',
                    color: '#fff',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #c0392b, #a93226)'
                    }
                  }}
                >
                  🧪 CREAR
                </Button>
                <IconButton
                  onClick={() => {
                    console.log('🔍 Frontend - Botón Agregar Flow clickeado');
                    console.log('🔍 Frontend - Estado actual:', { openFlowDialog, isEditing, editingFlowId, viewingFlow });
                    console.log('🔍 Frontend - Stack trace del click:', new Error().stack);
                    
                    setIsEditing(false);
                    setEditingFlowId(null);
                    setFormData({
                      concepto: '',
                      monto: '',
                      fecha: new Date().toISOString().split('T')[0],
                      cliente_id: '',
                      proyecto_id: '',
                      categoria: '',
                      estado: 'pendiente',
                      descripcion: '',
                      prioridad: 'media',
                      notas: '',
                      fecha_vencimiento: '',
                      recuperado: false
                    });
                    setOpenFlowDialog(true);
                    console.log('🔍 Frontend - Estado después del click:', { openFlowDialog: true, isEditing: false, editingFlowId: null, viewingFlow: null });
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
                  Agregar Flow
                </IconButton>
              </Box>
            </Box>
            
            {/* Stats optimizados - IDÉNTICOS a PROYECTOS */}
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

          {/* Filtros y búsqueda - IDÉNTICOS a PROYECTOS */}
          <StyledCard sx={{ p: 3, mb: 3 }}>
            <Grid container spacing={3} alignItems="center">
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  placeholder="Buscar por concepto, cliente o categoría..."
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
                    onClick={fetchFlows}
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

        {/* Tabla de Flows - IDÉNTICA a PROYECTOS */}
        <Grid item xs={12}>
          <StyledCard>
            <StyledTableContainer>
              <StyledTable>
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>CONCEPTO</TableCell>
                    <TableCell>CLIENTE</TableCell>
                    <TableCell>PROYECTO</TableCell>
                    <TableCell>MONTO</TableCell>
                    <TableCell>CATEGORÍA</TableCell>
                    <TableCell>ESTADO</TableCell>
                    <TableCell>RECUPERADO</TableCell>
                    <TableCell align="center">ACCIONES</TableCell>
                  </TableRow>
                </TableHead>
                                    <TableBody>
                      {console.log('🔍 Frontend - Renderizando tabla, filteredFlows:', filteredFlows)}
                      {isPending ? (
                        Array.from({ length: 5 }).map((_, index) => (
                          <TableRow key={index}>
                            <TableCell><Skeleton width={40} /></TableCell>
                            <TableCell><Skeleton width={120} /></TableCell>
                            <TableCell><Skeleton width={100} /></TableCell>
                            <TableCell><Skeleton width={100} /></TableCell>
                            <TableCell><Skeleton width={80} /></TableCell>
                            <TableCell><Skeleton width={80} /></TableCell>
                            <TableCell><Skeleton width={60} /></TableCell>
                            <TableCell><Skeleton width={60} /></TableCell>
                            <TableCell><Skeleton width={100} /></TableCell>
                          </TableRow>
                        ))
                      ) : (
                                                <AnimatePresence>
                          {console.log('🔍 Frontend - Renderizando filas, filteredFlows.length:', filteredFlows.length)}
                          {filteredFlows.map((flow, index) => {
                            console.log(`🔍 Frontend - Renderizando flow ${index + 1}:`, flow);
                            return (
                              <motion.tr
                                key={flow.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ delay: index * 0.05 }}
                                component={TableRow}
                              >
                                <TableCell>{flow.id}</TableCell>
                                <TableCell>
                                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                    {flow.concepto}
                                  </Typography>
                                </TableCell>
                                <TableCell>
                                  <Typography variant="body2">
                                    {flow.cliente_nombre || 'Sin cliente'}
                                  </Typography>
                                </TableCell>
                                <TableCell>
                                  <Typography variant="body2">
                                    {flow.proyecto_nombre || 'Sin proyecto'}
                                  </Typography>
                                </TableCell>
                                <TableCell>
                                  <Typography variant="body2" sx={{ color: '#27ae60', fontWeight: 600 }}>
                                    {formatCurrency(flow.monto)}
                                  </Typography>
                                </TableCell>
                                <TableCell>
                                  <Typography variant="body2">
                                    {flow.categoria || 'Sin categoría'}
                                  </Typography>
                                </TableCell>
                                <TableCell>
                                  <StyledChip
                                    label={flow.estado || 'pendiente'}
                                    sx={{
                                      backgroundColor: getStatusColor(flow.estado || 'pendiente').bg,
                                      color: getStatusColor(flow.estado || 'pendiente').text,
                                      fontWeight: 600,
                                      minWidth: 80,
                                      textAlign: 'center'
                                    }}
                                    size="small"
                                  />
                                </TableCell>
                                <TableCell>
                                  <StyledChip
                                    label={flow.recuperado ? 'Recuperado' : 'Pendiente'}
                                    sx={{
                                      backgroundColor: getStatusColor(flow.recuperado ? 'recuperado' : 'pendiente').bg,
                                      color: getStatusColor(flow.estado || 'pendiente').text,
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
                                        onClick={() => handleViewDetails(flow)}
                                      >
                                        <VisibilityIcon fontSize="small" />
                                      </ActionButton>
                                    </Tooltip>
                                    <Tooltip title="Editar flow">
                                      <ActionButton
                                        color="#f39c12"
                                        onClick={() => handleEdit(flow)}
                                      >
                                        <EditIcon fontSize="small" />
                                      </ActionButton>
                                    </Tooltip>
                                    <Tooltip title="Eliminar flow">
                                      <ActionButton
                                        color="#e74c3c"
                                        onClick={() => handleDelete(flow)}
                                      >
                                        <DeleteIcon fontSize="small" />
                                      </ActionButton>
                                    </Tooltip>
                                  </Box>
                                </TableCell>
                              </motion.tr>
                            );
                          })}
                        </AnimatePresence>
                  )}
                </TableBody>
              </StyledTable>
            </StyledTableContainer>
          </StyledCard>
        </Grid>


      </Grid>

      {/* Modal de formulario - IDÉNTICO a PROYECTOS */}
      <Dialog
        open={openFlowDialog}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
        TransitionComponent={Zoom}
        PaperProps={{
          borderRadius: 16,
          overflow: 'hidden'
        }}
      >
        <DialogTitle sx={{ p: 3, position: 'relative' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <AssignmentIcon sx={{ color: '#667eea' }} />
            <Typography variant="h5" sx={{ fontWeight: 600, color: '#2c3e50' }}>
              {isEditing ? 'Editar Flow' : 'Nuevo Flow'}
            </Typography>
          </Box>
          <IconButton
            onClick={handleCloseDialog}
            sx={{
              position: 'absolute',
              right: 16,
              top: 16,
              color: '#7f8c8d'
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ p: 0 }}>
          <Box sx={{ p: 3 }}>
            {console.log('🔍 Frontend - Renderizando formulario, openFlowDialog:', openFlowDialog)}
            {console.log('🔍 Frontend - Renderizando formulario, isEditing:', isEditing)}
            {console.log('🔍 Frontend - Renderizando formulario, formData:', formData)}
            <form onSubmit={(e) => {
              console.log('🔍 Frontend - Formulario onSubmit ejecutado');
              console.log('🔍 Frontend - Evento del formulario:', e);
              console.log('🔍 Frontend - Stack trace del onSubmit:', new Error().stack);
              handleSubmit(e);
            }}>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    name="concepto"
                    label="Concepto"
                    value={formData.concepto}
                    onChange={(e) => setFormData({ ...formData, concepto: e.target.value })}
                    fullWidth
                    required
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 12,
                        background: 'rgba(255,255,255,0.9)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255,255,255,0.3)',
                        '&:hover': {
                          background: 'rgba(255,255,255,0.95)',
                          borderColor: 'rgba(102, 126, 234, 0.5)'
                        }
                      }
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    name="monto"
                    label="Monto"
                    type="number"
                    value={formData.monto}
                    onChange={(e) => setFormData({ ...formData, monto: e.target.value })}
                    fullWidth
                    required
                    inputProps={{ min: 0, step: 0.01 }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 12,
                        background: 'rgba(255,255,255,0.9)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255,255,255,0.3)',
                        '&:hover': {
                          background: 'rgba(255,255,255,0.95)',
                          borderColor: 'rgba(102, 126, 234, 0.5)'
                        }
                      }
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    name="fecha"
                    label="Fecha"
                    type="date"
                    value={formData.fecha}
                    onChange={(e) => setFormData({ ...formData, fecha: e.target.value })}
                    fullWidth
                    required
                    InputLabelProps={{ shrink: true }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 12,
                        background: 'rgba(255,255,255,0.9)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255,255,255,0.3)',
                        '&:hover': {
                          background: 'rgba(255,255,255,0.95)',
                          borderColor: 'rgba(102, 126, 234, 0.5)'
                        }
                      }
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Cliente</InputLabel>
                    <Select
                      name="cliente_id"
                      value={formData.cliente_id}
                      onChange={(e) => setFormData({ ...formData, cliente_id: e.target.value })}
                      label="Cliente"
                      sx={{
                        borderRadius: 12,
                        background: 'rgba(255,255,255,0.9)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255,255,255,0.3)'
                      }}
                    >
                      {clients.map((cliente) => (
                        <MenuItem key={cliente.id} value={cliente.id}>
                          {cliente.nombre}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Proyecto</InputLabel>
                    <Select
                      name="proyecto_id"
                      value={formData.proyecto_id}
                      onChange={(e) => setFormData({ ...formData, proyecto_id: e.target.value })}
                      label="Proyecto"
                      sx={{
                        borderRadius: 12,
                        background: 'rgba(255,255,255,0.9)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255,255,255,0.3)'
                      }}
                    >
                      {projects.map((project) => (
                        <MenuItem key={project.id} value={project.id}>
                          {project.nombre}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    name="categoria"
                    label="Categoría"
                    value={formData.categoria}
                    onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
                    fullWidth
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 12,
                        background: 'rgba(255,255,255,0.9)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255,255,255,0.3)',
                        '&:hover': {
                          background: 'rgba(255,255,255,0.95)',
                          borderColor: 'rgba(102, 126, 234, 0.5)'
                        }
                      }
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Estado</InputLabel>
                    <Select
                      name="estado"
                      value={formData.estado}
                      onChange={(e) => setFormData({ ...formData, estado: e.target.value })}
                      label="Estado"
                      sx={{
                        borderRadius: 12,
                        background: 'rgba(255,255,255,0.9)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255,255,255,0.3)'
                      }}
                    >
                      <MenuItem value="pendiente">Pendiente</MenuItem>
                      <MenuItem value="en_proceso">En Proceso</MenuItem>
                      <MenuItem value="completado">Completado</MenuItem>
                      <MenuItem value="cancelado">Cancelado</MenuItem>
                      <MenuItem value="pausado">Pausado</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    name="descripcion"
                    label="Descripción"
                    value={formData.descripcion}
                    onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                    fullWidth
                    multiline
                    rows={3}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 12,
                        background: 'rgba(255,255,255,0.9)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255,255,255,0.3)',
                        '&:hover': {
                          background: 'rgba(255,255,255,0.95)',
                          borderColor: 'rgba(102, 126, 234, 0.5)'
                        }
                      }
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Prioridad</InputLabel>
                    <Select
                      name="prioridad"
                      value={formData.prioridad}
                      onChange={(e) => setFormData({ ...formData, prioridad: e.target.value })}
                      label="Prioridad"
                      sx={{
                        borderRadius: 12,
                        background: 'rgba(255,255,255,0.9)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255,255,255,0.3)'
                      }}
                    >
                      <MenuItem value="baja">Baja</MenuItem>
                      <MenuItem value="media">Media</MenuItem>
                      <MenuItem value="alta">Alta</MenuItem>
                      <MenuItem value="urgente">Urgente</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    name="notas"
                    label="Notas"
                    value={formData.notas}
                    onChange={(e) => setFormData({ ...formData, notas: e.target.value })}
                    fullWidth
                    multiline
                    rows={3}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 12,
                        background: 'rgba(255,255,255,0.9)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255,255,255,0.3)',
                        '&:hover': {
                          background: 'rgba(255,255,255,0.95)',
                          borderColor: 'rgba(102, 126, 234, 0.5)'
                        }
                      }
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    name="fecha_vencimiento"
                    label="Fecha de Vencimiento"
                    type="date"
                    value={formData.fecha_vencimiento}
                    onChange={(e) => setFormData({ ...formData, fecha_vencimiento: e.target.value })}
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 12,
                        background: 'rgba(255,255,255,0.9)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255,255,255,0.3)',
                        '&:hover': {
                          background: 'rgba(255,255,255,0.95)',
                          borderColor: 'rgba(102, 126, 234, 0.5)'
                        }
                      }
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <input
                      type="checkbox"
                      id="recuperado"
                      checked={formData.recuperado}
                      onChange={(e) => setFormData({ ...formData, recuperado: e.target.checked })}
                    />
                    <label htmlFor="recuperado">Marcar como recuperado</label>
                  </Box>
                </Grid>
              </Grid>
            </form>
          </Box>
        </DialogContent>
        <DialogActions sx={{ gap: 2, p: 3 }}>
          <Button
            onClick={handleCloseDialog}
            sx={{
              borderRadius: 12,
              px: 3,
              py: 1.5,
              fontWeight: 600,
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 8px 25px rgba(0,0,0,0.15)'
              },
              transition: 'all 0.3s ease'
            }}
          >
            Cancelar
          </Button>
          <Button
            onClick={() => {
              console.log('🔍 Frontend - Botón de envío clickeado');
              console.log('🔍 Frontend - formData actual:', formData);
              console.log('🔍 Frontend - isEditing:', isEditing);
              
              if (isEditing) {
                console.log('🔍 Frontend - Llamando a handleUpdateFlow');
                handleUpdateFlow();
              } else {
                console.log('🔍 Frontend - Llamando a handleCreateFlow');
                handleCreateFlow();
              }
            }}
            variant="contained"
            sx={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              borderRadius: 12,
              px: 3,
              py: 1.5,
              fontWeight: 600,
              boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 8px 25px rgba(102, 126, 234, 0.4)'
              },
              transition: 'all 0.3s ease'
            }}
          >
            {isEditing ? 'Actualizar' : 'Crear'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal de Detalles del Flow - IDÉNTICO a PROYECTOS */}
      <Dialog
        open={viewDetailsOpen}
        onClose={handleCloseViewDetails}
        maxWidth="md"
        fullWidth
        TransitionComponent={Zoom}
        PaperProps={{
          borderRadius: 16,
          overflow: 'hidden',
          sx: {
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: '#fff'
          }
        }}
      >
        <DialogTitle sx={{ 
          p: 3, 
          position: 'relative',
          borderBottom: '1px solid rgba(255,255,255,0.2)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <AssignmentIcon sx={{ color: 'rgba(255,255,255,0.9)' }} />
            <Typography variant="h5" sx={{ fontWeight: 700 }}>
              Detalles del Flow
            </Typography>
          </Box>
          <IconButton
            onClick={handleCloseViewDetails}
            sx={{
              color: 'rgba(255,255,255,0.8)',
              '&:hover': {
                backgroundColor: 'rgba(255,255,255,0.1)'
              }
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        
        <DialogContent sx={{ p: 0 }}>
          {viewingFlow && (
            <Box sx={{ p: 3 }}>
              {/* Header del flow */}
              <Box sx={{ 
                textAlign: 'center', 
                mb: 3, 
                p: 3, 
                background: 'rgba(255,255,255,0.1)',
                borderRadius: 2,
                border: '1px solid rgba(255,255,255,0.2)'
              }}>
                <Typography variant="h4" sx={{ fontWeight: 800, color: '#fff', mb: 1 }}>
                  {viewingFlow.concepto}
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center', mb: 2 }}>
                  <StyledChip
                    label={viewingFlow.recuperado ? 'Recuperado' : 'Pendiente'}
                    status={viewingFlow.recuperado ? 'recuperado' : 'pendiente'}
                    size="small"
                    sx={{
                      backgroundColor: viewingFlow.recuperado ? '#27ae60' : '#3498db',
                      color: '#fff',
                      fontWeight: 600
                    }}
                  />
                  <StyledChip
                    label={viewingFlow.categoria || 'Sin categoría'}
                    status="default"
                    size="small"
                    sx={{
                      backgroundColor: '#95a5a6',
                      color: '#fff',
                      fontWeight: 600
                    }}
                  />
                </Box>
                <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.9)' }}>
                  Cliente: {viewingFlow.cliente_nombre || 'Sin cliente'}
                </Typography>
                <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.9)' }}>
                  Proyecto: {viewingFlow.proyecto_nombre || 'Sin proyecto'}
                </Typography>
              </Box>

              {/* Información detallada del flow */}
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Box sx={{ 
                    p: 2, 
                    background: 'rgba(255,255,255,0.1)', 
                    borderRadius: 2,
                    border: '1px solid rgba(255,255,255,0.2)'
                  }}>
                    <Typography variant="h6" sx={{ color: '#27ae60', fontWeight: 600, mb: 1 }}>
                      Monto
                    </Typography>
                    <Typography variant="h4" sx={{ color: '#fff', fontWeight: 800 }}>
                      {formatCurrency(viewingFlow.monto)}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Box sx={{ 
                    p: 2, 
                    background: 'rgba(255,255,255,0.1)', 
                    borderRadius: 2,
                    border: '1px solid rgba(255,255,255,0.2)'
                  }}>
                    <Typography variant="h6" sx={{ color: '#f39c12', fontWeight: 600, mb: 1 }}>
                      Fecha
                    </Typography>
                    <Typography variant="h4" sx={{ color: '#fff', fontWeight: 800 }}>
                      {viewingFlow.fecha ? new Date(viewingFlow.fecha).toLocaleDateString('es-MX') : 'N/A'}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Box sx={{ 
                    p: 2, 
                    background: 'rgba(255,255,255,0.1)', 
                    borderRadius: 2,
                    border: '1px solid rgba(255,255,255,0.2)'
                  }}>
                    <Typography variant="h6" sx={{ color: '#9b59b6', fontWeight: 600, mb: 1 }}>
                      Estado
                    </Typography>
                    <Typography variant="h6" sx={{ color: '#fff', fontWeight: 600 }}>
                      {viewingFlow.estado || 'pendiente'}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Box sx={{ 
                    p: 2, 
                    background: 'rgba(255,255,255,0.1)', 
                    borderRadius: 2,
                    border: '1px solid rgba(255,255,255,0.2)'
                  }}>
                    <Typography variant="h6" sx={{ color: '#e74c3c', fontWeight: 600, mb: 1 }}>
                      Prioridad
                    </Typography>
                    <Typography variant="h6" sx={{ color: '#fff', fontWeight: 600 }}>
                      {viewingFlow.prioridad || 'media'}
                    </Typography>
                  </Box>
                </Grid>
                {viewingFlow.descripcion && (
                  <Grid item xs={12}>
                    <Box sx={{ 
                      p: 2, 
                      background: 'rgba(255,255,255,0.1)', 
                      borderRadius: 2,
                      border: '1px solid rgba(255,255,255,0.2)'
                    }}>
                      <Typography variant="h6" sx={{ color: '#fff', fontWeight: 600, mb: 1 }}>
                        Descripción
                      </Typography>
                      <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.9)' }}>
                        {viewingFlow.descripcion}
                      </Typography>
                    </Box>
                  </Grid>
                )}
                {viewingFlow.notas && (
                  <Grid item xs={12}>
                    <Box sx={{ 
                      p: 2, 
                      background: 'rgba(255,255,255,0.1)', 
                      borderRadius: 2,
                      border: '1px solid rgba(255,255,255,0.2)'
                    }}>
                      <Typography variant="h6" sx={{ color: '#fff', fontWeight: 600, mb: 1 }}>
                        Notas
                      </Typography>
                      <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.9)' }}>
                        {viewingFlow.notas}
                      </Typography>
                    </Box>
                  </Grid>
                )}
                {viewingFlow.fecha_vencimiento && (
                  <Grid item xs={12}>
                    <Box sx={{ 
                      p: 2, 
                      background: 'rgba(255,255,255,0.1)', 
                      borderRadius: 2,
                      border: '1px solid rgba(255,255,255,0.2)'
                    }}>
                      <Typography variant="h6" sx={{ color: '#fff', fontWeight: 600, mb: 1 }}>
                        Fecha de Vencimiento
                      </Typography>
                      <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.9)' }}>
                        {new Date(viewingFlow.fecha_vencimiento).toLocaleDateString('es-MX')}
                      </Typography>
                    </Box>
                  </Grid>
                )}
              </Grid>
            </Box>
          )}
        </DialogContent>
        
        <DialogActions sx={{ 
          gap: 2, 
          p: 3, 
          borderTop: '1px solid rgba(255,255,255,0.2)',
          background: 'rgba(255,255,255,0.05)'
        }}>
          <Button
            onClick={handleCloseViewDetails}
            sx={{
              borderRadius: 12,
              px: 3,
              py: 1.5,
              fontWeight: 600,
              border: '1px solid rgba(255,255,255,0.3)',
              color: '#fff',
              '&:hover': {
                borderColor: '#fff',
                background: 'rgba(255,255,255,0.1)'
              },
              transition: 'all 0.3s ease'
            }}
          >
            Cerrar
          </Button>
          <Button
            onClick={() => {
              handleCloseViewDetails();
              handleEdit(viewingFlow);
            }}
            variant="contained"
            sx={{
              background: 'linear-gradient(135deg, #f39c12, #e67e22)',
              borderRadius: 12,
              px: 3,
              py: 1.5,
              fontWeight: 600,
              boxShadow: '0 4px 12px rgba(243, 156, 18, 0.3)',
              '&:hover': {
                background: 'linear-gradient(135deg, #e67e22, #d35400)',
                transform: 'translateY(-2px)',
                boxShadow: '0 8px 25px rgba(243, 156, 18, 0.4)'
              },
              transition: 'all 0.3s ease'
            }}
          >
            Editar Flow
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar de notificaciones - IDÉNTICO a PROYECTOS */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          variant="filled"
          sx={{
            borderRadius: 12,
            fontWeight: 600,
            boxShadow: '0 8px 25px rgba(0,0,0,0.15)'
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </StyledContainer>
  );
};

export default FlowRecoveryV2Module;
