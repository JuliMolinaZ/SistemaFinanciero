// src/modules/Clientes/ClientModule.js
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
  InputAdornment,
  Button
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { motion, AnimatePresence } from 'framer-motion';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import DownloadIcon from '@mui/icons-material/Download';
import BusinessIcon from '@mui/icons-material/Business';
import PeopleIcon from '@mui/icons-material/People';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CloseIcon from '@mui/icons-material/Close';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import RefreshIcon from '@mui/icons-material/Refresh';
import { getCountries, getStates, getCities, getPhoneCode } from '../../utils/geoData';
import ExportButton from '../../components/ExportButton';

// Componentes estilizados modernos
const StyledContainer = styled(Container)(({ theme }) => ({
  paddingTop: theme.spacing(3),
  paddingBottom: theme.spacing(3),
  minHeight: '100vh',
  background: 'var(--surface)',
  position: 'relative'
}));

const StyledCard = styled(Card)(({ theme }) => ({
  background: 'var(--surface-2)',
  border: '1px solid var(--border)',
  borderRadius: 16,
  boxShadow: 'var(--shadow-md)',
  color: 'var(--text-primary)',
  transition: 'var(--transition-fast)',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: 'var(--shadow-lg)'
  }
}));

const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  borderRadius: 16,
  overflow: 'hidden',
  boxShadow: 'var(--shadow-md)',
  background: 'var(--surface-2)',
  border: '1px solid var(--border)'
}));

const StyledTable = styled(Table)(({ theme }) => ({
  '& .MuiTableHead-root': {
    background: 'var(--surface-3)',
    borderBottom: '1px solid var(--border)',
    '& .MuiTableCell-head': {
      color: 'var(--text-primary)',
      fontWeight: 700,
      fontSize: '0.875rem',
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
      borderBottom: 'none',
      padding: theme.spacing(2)
    }
  },
  '& .MuiTableBody-root': {
    '& .MuiTableRow-root': {
      transition: 'var(--transition-fast)',
      color: 'var(--text-primary)',
      '&:hover': {
        background: 'var(--surface-3)',
        transform: 'scale(1.01)'
      },
      '&:nth-of-type(even)': {
        background: 'var(--surface)'
      }
    },
    '& .MuiTableCell-body': {
      borderBottom: '1px solid var(--divider)',
      padding: theme.spacing(2),
      fontSize: '0.875rem',
      color: 'var(--text-primary)'
    }
  }
}));

const StyledSearchField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: 12,
    background: 'var(--surface-3)',
    border: '1px solid var(--border)',
    color: 'var(--text-primary)',
    transition: 'var(--transition-fast)',
    '& input::placeholder': {
      color: 'var(--text-secondary)'
    },
    '&:hover': {
      borderColor: 'var(--primary)'
    },
    '&.Mui-focused': {
      borderColor: 'var(--primary)',
      boxShadow: '0 0 0 2px var(--primary), 0 0 0 4px var(--surface)'
    }
  }
}));

const StyledSelect = styled(FormControl)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: 12,
    background: 'var(--surface-3)',
    border: '1px solid var(--border)',
    color: 'var(--text-primary)',
    transition: 'var(--transition-fast)',
    '&:hover': {
      borderColor: 'var(--primary)'
    },
    '&.Mui-focused': {
      borderColor: 'var(--primary)',
      boxShadow: '0 0 0 2px var(--primary), 0 0 0 4px var(--surface)'
    }
  }
}));

const StyledChip = styled(Chip)(({ theme, status }) => ({
  borderRadius: 20,
  fontWeight: 500,
  fontSize: '0.75rem',
  height: '1.5rem',
  background: 'var(--surface-3)',
  border: '1px solid var(--border)',
  color: status === 'active' ? 'var(--success)' : 'var(--danger)',
  boxShadow: 'none',
  '&:hover': {
    background: 'var(--surface-2)'
  },
  '& .MuiChip-label': {
    color: 'inherit'
  }
}));

const StyledAvatar = styled(Avatar)(({ theme }) => ({
  width: 48,
  height: 48,
  border: '2px solid var(--border)',
  boxShadow: 'var(--shadow-sm)',
  background: 'var(--primary)',
  color: 'white',
  fontSize: '1.25rem',
  fontWeight: 700
}));

const ActionButton = styled(IconButton)(({ color }) => ({
  width: 36,
  height: 36,
  margin: '0 2px',
  background: color || 'var(--surface-3)',
  color: color ? 'white' : 'var(--text-primary)',
  border: '1px solid var(--border)',
  transition: 'var(--transition-fast)',
  '&:hover': {
    background: color ? color : 'var(--surface-2)',
    filter: color ? 'brightness(1.1)' : 'none',
    transform: 'translateY(-1px)',
    boxShadow: 'var(--shadow-sm)'
  }
}));

// Componente de skeleton optimizado
const ClientRowSkeleton = React.memo(() => (
  <TableRow>
    <TableCell>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Skeleton variant="circular" width={48} height={48} />
        <Box>
          <Skeleton variant="text" width={120} height={20} />
          <Skeleton variant="text" width={150} height={16} />
        </Box>
      </Box>
    </TableCell>
    <TableCell>
      <Skeleton variant="text" width={100} height={20} />
    </TableCell>
    <TableCell>
      <Skeleton variant="text" width={80} height={20} />
    </TableCell>
    <TableCell>
      <Skeleton variant="text" width={200} height={20} />
    </TableCell>
    <TableCell>
      <Skeleton variant="text" width={100} height={20} />
    </TableCell>
    <TableCell>
      <Skeleton variant="rectangular" width={60} height={24} sx={{ borderRadius: 1 }} />
    </TableCell>
    <TableCell>
      <Box sx={{ display: 'flex', gap: 1 }}>
        <Skeleton variant="circular" width={36} height={36} />
        <Skeleton variant="circular" width={36} height={36} />
        <Skeleton variant="circular" width={36} height={36} />
      </Box>
    </TableCell>
  </TableRow>
));

// Hook personalizado para debounce
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

// Hook personalizado para cache de datos
const useDataCache = () => {
  const [cache, setCache] = useState(new Map());
  const [cacheTime, setCacheTime] = useState(new Map());

  const getCachedData = useCallback((key) => {
    const data = cache.get(key);
    const time = cacheTime.get(key);
    if (data && time && Date.now() - time < 30000) { // 30 segundos cache
      return data;
    }
    return null;
  }, [cache, cacheTime]);

  const setCachedData = useCallback((key, data) => {
    setCache(prev => new Map(prev).set(key, data));
    setCacheTime(prev => new Map(prev).set(key, Date.now()));
  }, []);

  return { getCachedData, setCachedData };
};

const ClientModule = () => {
  // Estados optimizados
  const [clients, setClients] = useState([]);
  const [filteredClients, setFilteredClients] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingClientId, setEditingClientId] = useState(null);
  const [originalClientData, setOriginalClientData] = useState(null); // Nuevo estado para datos originales
  const [formData, setFormData] = useState({
    run_cliente: '',
    nombre: '',
    rfc: '',
    pais: '',
    estado: '',
    ciudad: '',
    direccion: '',
    telefono: '',
    email: '',
    status: 'activo'
  });
  
  // Estados para selectores geográficos
  const [countries] = useState(getCountries());
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [phoneCode, setPhoneCode] = useState('');
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [isPending, startTransition] = useTransition();
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [viewingClient, setViewingClient] = useState(null);

  // Hooks personalizados
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const { getCachedData, setCachedData } = useDataCache();

      const API_URL = `${process.env.REACT_APP_API_URL || 'https://sigma.runsolutions-services.com'}/api/clients`;
  
  

  // Estadísticas optimizadas - Total, Activos e Inactivos
  const stats = useMemo(() => {
    const totalClients = clients.length;
    const activeClients = clients.filter(client => client.status === 'activo').length;
    const inactiveClients = clients.filter(client => client.status === 'inactivo').length;
    
    return [
      { 
        label: 'Total Clientes', 
        value: totalClients.toString(), 
        icon: <PeopleIcon />, 
        color: '#4ecdc4' 
      },
      { 
        label: 'Clientes Activos', 
        value: activeClients.toString(), 
        icon: <CheckCircleIcon />, 
        color: '#27ae60' 
      },
      { 
        label: 'Clientes Inactivos', 
        value: inactiveClients.toString(), 
        icon: <CancelIcon />, 
        color: '#e74c3c' 
      }
    ];
  }, [clients]);

  // Fetch simplificado
  const fetchClients = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(API_URL);
      
      // Verificar la estructura de la respuesta y extraer los datos correctamente
      let clientsData;
      if (response.data && response.data.success && Array.isArray(response.data.data)) {
        clientsData = response.data.data;
      } else if (Array.isArray(response.data)) {
        clientsData = response.data;
      } else {
        clientsData = [];
      }
      
      if (clientsData.length > 0) {
        const clientsWithStatus = clientsData.map(client => ({
          ...client,
          status: client.status || 'activo' // Usar el status de la base de datos o 'activo' por defecto
        }));
        setClients(clientsWithStatus);
      } else {
        setClients([]);
      }
      
    } catch (error) {
      setClients([]);
    } finally {
      setLoading(false);
    }
  }, [API_URL]);

  // Filtrado optimizado con useTransition
  const filterClients = useCallback(() => {
    startTransition(() => {
      let filtered = clients;

      // Filtro por búsqueda
      if (debouncedSearchTerm) {
        filtered = filtered.filter(client =>
          client.nombre?.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
          client.run_cliente?.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
          client.rfc?.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
          client.pais?.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
          client.estado?.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
          client.ciudad?.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
        );
      }

      // Filtro por estado
      if (statusFilter !== 'all') {
        filtered = filtered.filter(client => client.status === statusFilter);
      }

      setFilteredClients(filtered);
    });
  }, [clients, debouncedSearchTerm, statusFilter]);

  // Efectos optimizados
  useEffect(() => {
    fetchClients();
  }, []); // Solo una vez al montar

  useEffect(() => {
    filterClients();
  }, [filterClients]);



  // Datos paginados memoizados
  const paginatedClients = useMemo(() => {
    return filteredClients;
  }, [filteredClients]);

  // Handlers optimizados
  const handleOpenDialog = useCallback(() => {
    setIsEditing(false);
    setEditingClientId(null);
    setFormData({ 
      run_cliente: '', 
      nombre: '', 
      rfc: '', 
      pais: '',
      estado: '',
      ciudad: '',
      direccion: '', 
      telefono: '',
      email: '',
      status: 'activo'
    });
    setOpenDialog(true);
  }, []);

  const handleCloseDialog = useCallback(() => {
    setOpenDialog(false);
    setIsEditing(false);
    setEditingClientId(null);
    setOriginalClientData(null); // Limpiar datos originales
    setFormData({ 
      run_cliente: '', 
      nombre: '', 
      rfc: '', 
      pais: '',
      estado: '',
      ciudad: '',
      direccion: '', 
      telefono: '',
      email: '',
      status: 'activo'
    });
  }, []);

  const handleChange = useCallback((e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  }, []);
  
  // Función para manejar cambio de país
  const handleCountryChange = useCallback((country) => {
    setFormData(prev => ({ 
      ...prev, 
      pais: country,
      estado: '',
      ciudad: ''
    }));
    
    // Actualizar estados y código telefónico
    const newStates = getStates(country);
    setStates(newStates);
    setCities([]);
    setPhoneCode(getPhoneCode(country));
  }, []);
  
  // Función para manejar cambio de estado
  const handleStateChange = useCallback((state) => {
    setFormData(prev => ({ 
      ...prev, 
      estado: state,
      ciudad: ''
    }));
    
    // Actualizar ciudades
    const newCities = getCities(formData.pais, state);
    setCities(newCities);
  }, [formData.pais]);
  
  // Función para manejar cambio de ciudad
  const handleCityChange = useCallback((city) => {
    setFormData(prev => ({ 
      ...prev, 
      ciudad: city
    }));
  }, []);

  // Función para obtener solo los campos modificados
  const getModifiedFields = useCallback((originalData, newData) => {
    const modifiedFields = {};
    
    // Solo incluir campos que realmente cambiaron
    Object.keys(newData).forEach(key => {
      const originalValue = originalData[key] || '';
      const newValue = newData[key] || '';
      
      // Solo incluir si el valor cambió
      if (originalValue !== newValue) {
        modifiedFields[key] = newValue;
      }
    });
    
    return modifiedFields;
  }, []);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    
    try {
      if (isEditing) {
        // Solo enviar campos modificados
        const modifiedFields = getModifiedFields(originalClientData, formData);
        
        if (Object.keys(modifiedFields).length === 0) {
          setSnackbar({ open: true, message: 'No hay cambios para guardar.', severity: 'info' });
          handleCloseDialog();
          return;
        }
        
        const response = await axios.put(`${API_URL}/${editingClientId}`, modifiedFields);
        setSnackbar({ open: true, message: 'Cliente actualizado exitosamente.', severity: 'success' });
      } else {
        const response = await axios.post(API_URL, formData);
        setSnackbar({ open: true, message: 'Cliente creado exitosamente.', severity: 'success' });
      }
      
      // Forzar recarga inmediata
      await fetchClients();
      
      handleCloseDialog();
    } catch (error) {
      setSnackbar({ open: true, message: 'Error al guardar cliente.', severity: 'error' });
    }
  }, [isEditing, editingClientId, formData, API_URL, fetchClients, handleCloseDialog, originalClientData, getModifiedFields]);

  const handleDelete = useCallback(async (client) => {
    if (window.confirm(`¿Estás seguro de que quieres eliminar al cliente "${client.nombre}"?`)) {
      try {
        await axios.delete(`${API_URL}/${client.id}`);
        setSnackbar({ open: true, message: 'Cliente eliminado exitosamente.', severity: 'success' });
        fetchClients();
          } catch (error) {
      setSnackbar({ open: true, message: 'Error al eliminar cliente.', severity: 'error' });
    }
    }
  }, [API_URL, fetchClients]);

  const handleEdit = useCallback((client) => {
    setIsEditing(true);
    setEditingClientId(client.id);
    setOriginalClientData(client); // Guardar datos originales
    
    const formDataToSet = {
      run_cliente: client.run_cliente || '',
      nombre: client.nombre || '',
      rfc: client.rfc || '',
      pais: client.pais || '',
      estado: client.estado || '',
      ciudad: client.ciudad || '',
      direccion: client.direccion || '',
      telefono: client.telefono || '',
      email: client.email || '',
      status: client.status || 'activo' // Asegúrate de que el status se mantenga
    };
    
    setFormData(formDataToSet);
    
    // Cargar selectores geográficos si hay país
    if (client.pais) {
      console.log('🌍 País encontrado:', client.pais);
      const newStates = getStates(client.pais);
      setStates(newStates);
      setPhoneCode(getPhoneCode(client.pais));
      
      if (client.estado) {
        console.log('🏛️ Estado encontrado:', client.estado);
        const newCities = getCities(client.pais, client.estado);
        setCities(newCities);
      }
    } else {
      console.log('🌍 Sin país, estableciendo estados y ciudades vacíos');
      setStates([]);
      setCities([]);
      setPhoneCode('');
    }
    
    setOpenDialog(true);
  }, []);

  const handleView = useCallback((client) => {
    setViewingClient(client);
    setViewDialogOpen(true);
  }, []);

  const handleSnackbarClose = useCallback(() => {
    setSnackbar(prev => ({ ...prev, open: false }));
  }, []);

  const handleCloseViewDialog = useCallback(() => {
    setViewDialogOpen(false);
    setViewingClient(null);
  }, []);

  return (
    <StyledContainer maxWidth="xl">
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Header con estadísticas y acciones */}
          <Box sx={{ mb: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Box>
                <Typography variant="h3" sx={{ 
                  fontWeight: 800, 
                  color: '#fff',
                  textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                  mb: 1
                }}>
                  Clientes
                </Typography>
                <Typography variant="h6" sx={{ 
                  color: 'rgba(255,255,255,0.8)',
                  fontWeight: 400
                }}>
                  Administra la información de clientes y sus proyectos
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', gap: 2 }}>
                <ExportButton 
                  modules={[
                    { id: 'clients', name: 'Clientes', description: 'Información de clientes y contactos' }
                  ]}
                  onExport={async (exportData) => {
                    try {
                      // Preguntar al usuario si quiere exportar solo los filtrados o todos
                      const exportFiltered = window.confirm(
                        `¿Qué quieres exportar?\n\n` +
                        `• Solo clientes filtrados (${filteredClients.length} clientes)\n` +
                        `• Todos los clientes (${clients.length} clientes)\n\n` +
                        `Haz clic en "Aceptar" para exportar solo los filtrados, o "Cancelar" para exportar todos.`
                      );
                      
                      // Usar los datos filtrados o todos según la elección del usuario
                      const clientsData = exportFiltered ? filteredClients : clients;
                      
                      if (clientsData.length === 0) {
                        setSnackbar({ 
                          open: true, 
                          message: 'No hay clientes para exportar', 
                          severity: 'warning' 
                        });
                        return;
                      }
                      
                      // Crear contenido del archivo según el formato
                      let content, filename, mimeType;
                      
                      if (exportData.format === 'csv') {
                        // Crear CSV
                        const headers = ['ID', 'RUN', 'Nombre', 'RFC', 'País', 'Estado', 'Ciudad', 'Dirección', 'Teléfono', 'Email', 'Estado', 'Fecha Creación'];
                        const csvContent = [
                          headers.join(','),
                          ...clientsData.map(client => [
                            client.id,
                            client.run_cliente || '',
                            client.nombre || '',
                            client.rfc || '',
                            client.pais || '',
                            client.estado || '',
                            client.ciudad || '',
                            (client.direccion || '').replace(/,/g, ';'),
                            client.telefono || '',
                            client.email || '',
                            client.status || 'activo',
                            client.created_at ? new Date(client.created_at).toLocaleDateString() : ''
                          ].join(','))
                        ].join('\n');
                        
                        content = csvContent;
                        filename = `clientes_${new Date().toISOString().split('T')[0]}.csv`;
                        mimeType = 'text/csv';
                      } else if (exportData.format === 'excel') {
                        // Crear archivo Excel simple (TSV para compatibilidad)
                        const headers = ['ID', 'RUN', 'Nombre', 'RFC', 'País', 'Estado', 'Ciudad', 'Dirección', 'Teléfono', 'Email', 'Estado', 'Fecha Creación'];
                        const tsvContent = [
                          headers.join('\t'),
                          ...clientsData.map(client => [
                            client.id,
                            client.run_cliente || '',
                            client.nombre || '',
                            client.rfc || '',
                            client.pais || '',
                            client.estado || '',
                            client.ciudad || '',
                            (client.direccion || '').replace(/\t/g, ' '),
                            client.telefono || '',
                            client.email || '',
                            client.status || 'activo',
                            client.created_at ? new Date(client.created_at).toLocaleDateString() : ''
                          ].join('\t'))
                        ].join('\n');
                        
                        content = tsvContent;
                        filename = `clientes_${new Date().toISOString().split('T')[0]}.tsv`;
                        mimeType = 'text/tab-separated-values';
                      } else {
                        // Crear archivo HTML que se puede imprimir como PDF
                        const htmlContent = `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reporte de Clientes</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #333; padding-bottom: 20px; }
        .client-section { margin-bottom: 30px; border: 1px solid #ddd; padding: 15px; border-radius: 8px; }
        .client-title { font-size: 18px; font-weight: bold; color: #333; margin-bottom: 15px; }
        .client-details { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
        .detail-item { margin-bottom: 8px; }
        .detail-label { font-weight: bold; color: #666; }
        .separator { border-top: 1px solid #eee; margin: 20px 0; }
        @media print { 
            body { margin: 0; }
            .client-section { break-inside: avoid; }
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>📊 REPORTE DE CLIENTES</h1>
        <p><strong>Fecha de exportación:</strong> ${new Date().toLocaleString()}</p>
        <p><strong>Total de clientes:</strong> ${clientsData.length}</p>
    </div>
    
    ${clientsData.map((client, index) => `
    <div class="client-section">
        <div class="client-title">👤 Cliente ${index + 1}: ${client.nombre || 'N/A'}</div>
        <div class="client-details">
            <div class="detail-item">
                <span class="detail-label">ID:</span> ${client.id}
            </div>
            <div class="detail-item">
                <span class="detail-label">RUN:</span> ${client.run_cliente || 'N/A'}
            </div>
            <div class="detail-item">
                <span class="detail-label">RFC:</span> ${client.rfc || 'N/A'}
            </div>
            <div class="detail-item">
                <span class="detail-label">País:</span> ${client.pais || 'N/A'}
            </div>
            <div class="detail-item">
                <span class="detail-label">Estado:</span> ${client.estado || 'N/A'}
            </div>
            <div class="detail-item">
                <span class="detail-label">Ciudad:</span> ${client.ciudad || 'N/A'}
            </div>
            <div class="detail-item">
                <span class="detail-label">Dirección:</span> ${client.direccion || 'N/A'}
            </div>
            <div class="detail-item">
                <span class="detail-label">Teléfono:</span> ${client.telefono || 'N/A'}
            </div>
            <div class="detail-item">
                <span class="detail-label">Email:</span> ${client.email || 'N/A'}
            </div>
            <div class="detail-item">
                <span class="detail-label">Estado:</span> 
                <span style="color: ${client.status === 'activo' ? '#27ae60' : '#e74c3c'}; font-weight: bold;">
                    ${client.status || 'activo'}
                </span>
            </div>
            <div class="detail-item">
                <span class="detail-label">Fecha Creación:</span> 
                ${client.created_at ? new Date(client.created_at).toLocaleDateString() : 'N/A'}
            </div>
        </div>
    </div>
    `).join('')}
    
    <div class="separator"></div>
    <p style="text-align: center; color: #666; margin-top: 30px;">
        Reporte generado el ${new Date().toLocaleString()}
    </p>
</body>
</html>`;
                        
                        content = htmlContent;
                        filename = `clientes_${new Date().toISOString().split('T')[0]}.html`;
                        mimeType = 'text/html';
                      }
                      
                      // Crear y descargar el archivo
                      const blob = new Blob([content], { type: mimeType });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = filename;
                      document.body.appendChild(a);
                      a.click();
                      document.body.removeChild(a);
                      URL.revokeObjectURL(url);
                      
                      // Mostrar mensaje de éxito
                      setSnackbar({ 
                        open: true, 
                        message: `Exportación completada: ${filename} (${clientsData.length} clientes - ${exportFiltered ? 'Filtrados' : 'Todos'})`, 
                        severity: 'success' 
                      });
                      
                    } catch (error) {
                      console.error('Error al exportar:', error);
                      setSnackbar({ 
                        open: true, 
                        message: 'Error al exportar los datos', 
                        severity: 'error' 
                      });
                    }
                  }}
                  variant="outlined"
                  size="medium"
                  sx={{
                    border: '2px solid #fff',
                    color: '#fff',
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    '&:hover': {
                      borderColor: '#fff',
                      backgroundColor: 'rgba(255,255,255,0.2)',
                      transform: 'translateY(-2px)'
                    }
                  }}
                />
                <IconButton
                  onClick={handleOpenDialog}
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
                  Agregar Cliente
                </IconButton>
              </Box>
            </Box>
            
            {/* Stats optimizados - Solo Total Clientes */}
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
                  placeholder="Buscar por nombre, RUN o RFC..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon sx={{ mr: 1, color: '#667eea' }} />
                      </InputAdornment>
                    ),
                    sx: {
                      borderRadius: 2,
                      backgroundColor: 'rgba(255,255,255,0.9)',
                    }
                  }}
                />
              </Grid>
              
              <Grid item xs={12} md={3}>
                <FormControl fullWidth>
                  <InputLabel>Filtrar por Estado</InputLabel>
                  <Select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    label="Filtrar por Estado"
                    sx={{
                      borderRadius: 2,
                      backgroundColor: 'rgba(255,255,255,0.9)',
                    }}
                  >
                    <MenuItem value="all">Todos los Estados</MenuItem>
                    <MenuItem value="activo">Solo Activos</MenuItem>
                    <MenuItem value="inactivo">Solo Inactivos</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} md={3}>
                <FormControl fullWidth>
                  <InputLabel>Filtrar por País</InputLabel>
                  <Select
                    value={formData.pais || ''}
                    onChange={(e) => {
                      const country = e.target.value;
                      setFormData(prev => ({ ...prev, pais: country }));
                      // También actualizar el filtro de búsqueda
                      if (country) {
                        setSearchTerm(prev => prev ? `${prev} ${country}` : country);
                      }
                    }}
                    label="Filtrar por País"
                    sx={{
                      borderRadius: 2,
                      backgroundColor: 'rgba(255,255,255,0.9)',
                    }}
                  >
                    <MenuItem value="">Todos los países</MenuItem>
                    {countries.map((country) => (
                      <MenuItem key={country.value} value={country.value}>
                        {country.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} md={2}>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <IconButton
                    onClick={fetchClients}
                    sx={{
                      background: 'linear-gradient(135deg, #667eea, #764ba2)',
                      color: '#fff',
                      borderRadius: 2,
                      px: 3,
                      py: 1,
                      '&:hover': {
                        background: 'linear-gradient(135deg, #5a6fd8, #6a4190)',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)'
                      }
                    }}
                  >
                    <RefreshIcon />
                  </IconButton>
                  <IconButton
                    onClick={() => {
                      setSearchTerm('');
                      setStatusFilter('all');
                      setFormData(prev => ({ ...prev, pais: '' }));
                    }}
                    sx={{
                      background: 'linear-gradient(135deg, #e74c3c, #c0392b)',
                      color: '#fff',
                      borderRadius: 2,
                      px: 3,
                      py: 1,
                      '&:hover': {
                        background: 'linear-gradient(135deg, #d63031, #a93226)',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 4px 12px rgba(231, 76, 60, 0.3)'
                      }
                    }}
                  >
                    <FilterListIcon />
                  </IconButton>
                </Box>
              </Grid>
            </Grid>
          </StyledCard>

          {/* Tabla de Clientes */}
          <StyledCard>
            <Box sx={{ p: 3, borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#2c3e50' }}>
                Lista de Clientes
              </Typography>
              <Typography variant="body2" sx={{ color: '#7f8c8d', mt: 0.5 }}>
                {filteredClients.length} clientes encontrados
              </Typography>
            </Box>
            
            <StyledTableContainer>
              <StyledTable>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 700, color: '#2c3e50' }}>Cliente</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: '#2c3e50' }}>RUN</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: '#2c3e50' }}>RFC</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: '#2c3e50' }}>Ubicación</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: '#2c3e50' }}>Contacto</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: '#2c3e50' }}>Fecha Creación</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: '#2c3e50' }}>Estado</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: '#2c3e50' }}>Acciones</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {loading ? (
                    Array.from({ length: 5 }).map((_, index) => (
                      <ClientRowSkeleton key={index} />
                    ))
                  ) : (
                    <AnimatePresence>
                      {paginatedClients.map((client, index) => (
                        <motion.tr
                          key={client.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ delay: index * 0.05 }}
                          component={TableRow}
                        >
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                              <StyledAvatar>
                                {client.nombre?.charAt(0)?.toUpperCase() || 'C'}
                              </StyledAvatar>
                              <Box>
                                <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#2c3e50' }}>
                                  {client.nombre || 'Sin nombre'}
                                </Typography>
                                <Typography variant="caption" sx={{ color: '#7f8c8d' }}>
                                  ID: {client.id}
                                </Typography>
                              </Box>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" sx={{ fontWeight: 500 }}>
                              {client.run_cliente || 'N/A'}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" sx={{ fontWeight: 500 }}>
                              {client.rfc || 'N/A'}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                              {client.ciudad && (
                                <Typography variant="body2" sx={{ fontWeight: 500, color: '#2c3e50' }}>
                                  {client.ciudad}
                                </Typography>
                              )}
                              {client.estado && (
                                <Typography variant="caption" sx={{ color: '#7f8c8d' }}>
                                  {client.estado}
                                </Typography>
                              )}
                              {client.pais && (
                                <Typography variant="caption" sx={{ color: '#7f8c8d' }}>
                                  {client.pais}
                                </Typography>
                              )}
                              {!client.ciudad && !client.estado && !client.pais && (
                                <Typography variant="body2" sx={{ color: '#7f8c8d' }}>
                                  Sin ubicación
                                </Typography>
                              )}
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                              {client.telefono && (
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                  <PhoneIcon sx={{ fontSize: 14, color: '#27ae60' }} />
                                  <Typography variant="caption" sx={{ color: '#27ae60' }}>
                                    {client.telefono}
                                  </Typography>
                                </Box>
                              )}
                              {client.email && (
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                  <EmailIcon sx={{ fontSize: 14, color: '#3498db' }} />
                                  <Typography variant="caption" sx={{ color: '#3498db' }}>
                                    {client.email}
                                  </Typography>
                                </Box>
                              )}
                              {!client.telefono && !client.email && (
                                <Typography variant="caption" sx={{ color: '#7f8c8d' }}>
                                  Sin contacto
                                </Typography>
                              )}
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" sx={{ color: '#7f8c8d' }}>
                              {client.created_at ? new Date(client.created_at).toLocaleDateString() : 'N/A'}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={client.status === 'activo' ? 'Activo' : 'Inactivo'}
                              size="small"
                              sx={{
                                backgroundColor: client.status === 'activo' ? '#27ae60' : '#e74c3c',
                                color: 'white',
                                fontWeight: 600,
                                '& .MuiChip-label': {
                                  px: 1
                                }
                              }}
                            />
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', gap: 0.5 }}>
                              <Tooltip title="Ver detalles">
                                <ActionButton
                                  color="#45b7d1"
                                  onClick={() => handleView(client)}
                                  size="small"
                                >
                                  <VisibilityIcon sx={{ fontSize: 16 }} />
                                </ActionButton>
                              </Tooltip>
                              <Tooltip title="Editar cliente">
                                <ActionButton
                                  color="#f39c12"
                                  onClick={() => handleEdit(client)}
                                  size="small"
                                >
                                  <EditIcon sx={{ fontSize: 16 }} />
                                </ActionButton>
                              </Tooltip>
                              <Tooltip title="Eliminar cliente">
                                <ActionButton
                                  color="#e74c3c"
                                  onClick={() => handleDelete(client)}
                                  size="small"
                                >
                                  <DeleteIcon sx={{ fontSize: 16 }} />
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

          {/* Diálogo de Cliente */}
          <Dialog
            open={openDialog}
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
              {isEditing ? 'Editar Cliente' : 'Nuevo Cliente'}
            </DialogTitle>
            <DialogContent>
              <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
                <Grid container spacing={3}>
                  {/* Información básica */}
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="RUN"
                      name="run_cliente"
                      value={formData.run_cliente}
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
                    <TextField
                      fullWidth
                      label="RFC"
                      name="rfc"
                      value={formData.rfc}
                      onChange={handleChange}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          backgroundColor: 'rgba(255,255,255,0.9)',
                        }
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Nombre"
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
                  
                  {/* Información geográfica */}
                  <Grid item xs={12} md={4}>
                    <FormControl fullWidth>
                      <InputLabel>País</InputLabel>
                      <Select
                        value={formData.pais}
                        onChange={(e) => handleCountryChange(e.target.value)}
                        label="País"
                        sx={{
                          borderRadius: 2,
                          backgroundColor: 'rgba(255,255,255,0.9)',
                        }}
                      >
                        {countries.map((country) => (
                          <MenuItem key={country.value} value={country.value}>
                            {country.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  
                  <Grid item xs={12} md={4}>
                    <FormControl fullWidth>
                      <InputLabel>Estado</InputLabel>
                      <Select
                        value={formData.estado}
                        onChange={(e) => handleStateChange(e.target.value)}
                        label="Estado"
                        disabled={!formData.pais}
                        sx={{
                          borderRadius: 2,
                          backgroundColor: 'rgba(255,255,255,0.9)',
                        }}
                      >
                        {states.map((state) => (
                          <MenuItem key={state.value} value={state.value}>
                            {state.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  
                  <Grid item xs={12} md={4}>
                    <FormControl fullWidth>
                      <InputLabel>Ciudad</InputLabel>
                      <Select
                        value={formData.ciudad}
                        onChange={(e) => handleCityChange(e.target.value)}
                        label="Ciudad"
                        disabled={!formData.estado}
                        sx={{
                          borderRadius: 2,
                          backgroundColor: 'rgba(255,255,255,0.9)',
                        }}
                      >
                        {cities.map((city) => (
                          <MenuItem key={city.value} value={city.value}>
                            {city.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Dirección"
                      name="direccion"
                      value={formData.direccion}
                      onChange={handleChange}
                      multiline
                      rows={2}
                      placeholder="Calle, número, colonia, código postal..."
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          backgroundColor: 'rgba(255,255,255,0.9)',
                        }
                      }}
                    />
                  </Grid>
                  
                  {/* Información de contacto */}
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Teléfono"
                      name="telefono"
                      value={formData.telefono}
                      onChange={handleChange}
                      placeholder={phoneCode ? `${phoneCode} 123 456 7890` : 'Teléfono'}
                      InputProps={{
                        startAdornment: phoneCode && (
                          <InputAdornment position="start">
                            <Chip 
                              label={phoneCode} 
                              size="small" 
                              sx={{ 
                                background: 'linear-gradient(135deg, #27ae60, #229954)',
                                color: 'white',
                                fontWeight: 600
                              }} 
                            />
                          </InputAdornment>
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
                  
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="correo@empresa.com"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          backgroundColor: 'rgba(255,255,255,0.9)',
                        }
                      }}
                    />
                  </Grid>
                  
                  {/* Estado del cliente */}
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth>
                      <InputLabel>Estado</InputLabel>
                      <Select
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        label="Estado"
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
                            Activo
                          </Box>
                        </MenuItem>
                        <MenuItem value="inactivo">
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Box sx={{ 
                              width: 8, 
                              height: 8, 
                              borderRadius: '50%', 
                              backgroundColor: '#e74c3c' 
                            }} />
                            Inactivo
                          </Box>
                        </MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
              </Box>
            </DialogContent>
            <DialogActions sx={{ p: 3 }}>
              <IconButton
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
              </IconButton>
              <IconButton
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
              </IconButton>
            </DialogActions>
          </Dialog>

          {/* Modal de Detalles del Cliente */}
          <Dialog 
            open={viewDialogOpen} 
            onClose={handleCloseViewDialog}
            maxWidth="md"
            fullWidth
          >
            <DialogTitle sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: '#fff',
              fontWeight: 700
            }}>
              👤 Detalles del Cliente
              <IconButton onClick={handleCloseViewDialog} sx={{ color: '#fff' }}>
                <CloseIcon />
              </IconButton>
            </DialogTitle>
            
            <DialogContent sx={{ p: 3 }}>
              {viewingClient && (
                <Box>
                  {/* Header del cliente */}
                  <Box sx={{ 
                    textAlign: 'center', 
                    mb: 3, 
                    p: 3, 
                    background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
                    borderRadius: 2,
                    border: '1px solid rgba(102, 126, 234, 0.2)'
                  }}>
                    <Typography variant="h4" sx={{ fontWeight: 800, color: '#2c3e50', mb: 1 }}>
                      {viewingClient.nombre}
                    </Typography>
                    <Chip 
                      label={viewingClient.status || 'activo'} 
                      color={viewingClient.status === 'activo' ? 'success' : 'error'}
                      sx={{ fontWeight: 600 }}
                    />
                  </Box>

                  {/* Información del cliente en grid */}
                  <Grid container spacing={3}>
                    {/* Información básica */}
                    <Grid item xs={12} md={6}>
                      <Typography variant="h6" sx={{ mb: 2, color: '#34495e', fontWeight: 600 }}>
                        📋 Información Básica
                      </Typography>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', p: 2, background: 'rgba(102, 126, 234, 0.05)', borderRadius: 1 }}>
                          <Typography variant="body2" sx={{ fontWeight: 600, color: '#7f8c8d' }}>ID:</Typography>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>{viewingClient.id}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', p: 2, background: 'rgba(102, 126, 234, 0.05)', borderRadius: 1 }}>
                          <Typography variant="body2" sx={{ fontWeight: 600, color: '#7f8c8d' }}>RUN:</Typography>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>{viewingClient.run_cliente || 'N/A'}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', p: 2, background: 'rgba(102, 126, 234, 0.05)', borderRadius: 1 }}>
                          <Typography variant="body2" sx={{ fontWeight: 600, color: '#7f8c8d' }}>RFC:</Typography>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>{viewingClient.rfc || 'N/A'}</Typography>
                        </Box>
                      </Box>
                    </Grid>

                    {/* Información de contacto */}
                    <Grid item xs={12} md={6}>
                      <Typography variant="h6" sx={{ mb: 2, color: '#34495e', fontWeight: 600 }}>
                        📞 Información de Contacto
                      </Typography>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', p: 2, background: 'rgba(102, 126, 234, 0.05)', borderRadius: 1 }}>
                          <Typography variant="body2" sx={{ fontWeight: 600, color: '#7f8c8d' }}>Teléfono:</Typography>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>{viewingClient.telefono || 'N/A'}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', p: 2, background: 'rgba(102, 126, 234, 0.05)', borderRadius: 1 }}>
                          <Typography variant="body2" sx={{ fontWeight: 600, color: '#7f8c8d' }}>Email:</Typography>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>{viewingClient.email || 'N/A'}</Typography>
                        </Box>
                      </Box>
                    </Grid>

                    {/* Información geográfica */}
                    <Grid item xs={12}>
                      <Typography variant="h6" sx={{ mb: 2, color: '#34495e', fontWeight: 600 }}>
                        🌍 Información Geográfica
                      </Typography>
                      <Grid container spacing={2}>
                        <Grid item xs={12} md={4}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', p: 2, background: 'rgba(102, 126, 234, 0.05)', borderRadius: 1 }}>
                            <Typography variant="body2" sx={{ fontWeight: 600, color: '#7f8c8d' }}>País:</Typography>
                            <Typography variant="body2" sx={{ fontWeight: 500 }}>{viewingClient.pais || 'N/A'}</Typography>
                          </Box>
                        </Grid>
                        <Grid item xs={12} md={4}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', p: 2, background: 'rgba(102, 126, 234, 0.05)', borderRadius: 1 }}>
                            <Typography variant="body2" sx={{ fontWeight: 600, color: '#7f8c8d' }}>Estado:</Typography>
                            <Typography variant="body2" sx={{ fontWeight: 500 }}>{viewingClient.estado || 'N/A'}</Typography>
                          </Box>
                        </Grid>
                        <Grid item xs={12} md={4}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', p: 2, background: 'rgba(12, 126, 234, 0.05)', borderRadius: 1 }}>
                            <Typography variant="body2" sx={{ fontWeight: 600, color: '#7f8c8d' }}>Ciudad:</Typography>
                            <Typography variant="body2" sx={{ fontWeight: 500 }}>{viewingClient.ciudad || 'N/A'}</Typography>
                          </Box>
                        </Grid>
                      </Grid>
                    </Grid>

                    {/* Dirección completa */}
                    <Grid item xs={12}>
                      <Typography variant="h6" sx={{ mb: 2, color: '#34495e', fontWeight: 600 }}>
                        🏠 Dirección
                      </Typography>
                      <Box sx={{ p: 2, background: 'rgba(102, 126, 234, 0.05)', borderRadius: 1 }}>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {viewingClient.direccion || 'No especificada'}
                        </Typography>
                      </Box>
                    </Grid>

                    {/* Información adicional */}
                    <Grid item xs={12}>
                      <Typography variant="h6" sx={{ mb: 2, color: '#34495e', fontWeight: 600 }}>
                        📅 Información Adicional
                      </Typography>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', p: 2, background: 'rgba(102, 126, 234, 0.05)', borderRadius: 1 }}>
                        <Typography variant="body2" sx={{ fontWeight: 600, color: '#7f8c8d' }}>Fecha de Creación:</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {viewingClient.created_at ? new Date(viewingClient.created_at).toLocaleDateString() : 'N/A'}
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </Box>
              )}
            </DialogContent>
            
            <DialogActions sx={{ p: 3, gap: 2 }}>
              <Button
                onClick={handleCloseViewDialog}
                variant="outlined"
                sx={{
                  border: '1px solid rgba(102, 126, 234, 0.3)',
                  color: '#667eea',
                  '&:hover': {
                    borderColor: '#667eea',
                    background: 'rgba(102, 126, 234, 0.05)'
                  }
                }}
              >
                Cerrar
              </Button>
              <Button
                onClick={() => {
                  handleCloseViewDialog();
                  handleEdit(viewingClient);
                }}
                variant="contained"
                startIcon={<EditIcon />}
                sx={{
                  background: 'linear-gradient(135deg, #667eea, #764ba2)',
                  color: '#fff',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #5a6fd8, #6a4190)'
                  }
                }}
              >
                Editar Cliente
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

export default ClientModule;


