import React, { useState, useEffect, useCallback, useMemo, useTransition } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Paper,
  Chip,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Snackbar,
  Alert,
  Card,
  CardContent,
  Divider,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  Download as DownloadIcon,
  AttachMoney as AttachMoneyIcon,
  CalendarToday as CalendarIcon,
  Business as BusinessIcon,
  Description as DescriptionIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  AccountBalance as AccountBalanceIcon,
  FilterList as FilterListIcon,
  Assignment as AssignmentIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { motion } from 'framer-motion';
import axios from 'axios';
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
  background: 'rgba(255, 255, 255, 0.95)',
  backdropFilter: 'blur(20px)',
  border: '1px solid rgba(255, 255, 255, 0.3)',
  borderRadius: 16,
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15)'
  }
}));

const StyledChip = styled(Chip)(({ theme, status }) => ({
  backgroundColor: status === 'pagado' ? '#4caf50' : 
                  status === 'vencido' ? '#f44336' : '#ff9800',
  color: 'white',
  fontWeight: 600,
  '& .MuiChip-label': {
    color: 'white'
  }
}));

const StyledButton = styled(Button)(({ theme }) => ({
  borderRadius: theme.spacing(2),
  textTransform: 'none',
  fontWeight: 600,
  boxShadow: theme.shadows[4],
  '&:hover': {
    boxShadow: theme.shadows[8],
    transform: 'translateY(-2px)'
  },
  transition: 'all 0.3s ease'
}));

const ImpuestosIMSSModule = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  // Configuración de axios
  const API_BASE = process.env.REACT_APP_API_URL || 'https://sigma.runsolutions-services.com';
  
  // Estados
  const [impuestos, setImpuestos] = useState([]);
  const [filteredImpuestos, setFilteredImpuestos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingImpuestoId, setEditingImpuestoId] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [isPending, startTransition] = useTransition();
  const [proveedores, setProveedores] = useState([]);
  const [proveedoresLoading, setProveedoresLoading] = useState(true);
  const [proveedoresError, setProveedoresError] = useState(null);
  const [selectedImpuesto, setSelectedImpuesto] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  // Estado del formulario
  const [formData, setFormData] = useState({
    concepto: '',
    tipo_impuesto: '',
    monto_base: '',
    monto_impuesto: '',
    monto_total: '',
    fecha_vencimiento: '',
    periodo: '',
    proveedor_id: '',
    comentarios: ''
  });

  // Estados de filtros
  const [filters, setFilters] = useState({
    search: '',
    tipo_impuesto: '',
    estado: '',
    proveedor: ''
  });

  // Estados de estadísticas
  const [stats, setStats] = useState({
    total_impuestos: 0,
    impuestos_pagados: 0,
    impuestos_pendientes: 0,
    impuestos_vencidos: 0,
    total_monto: 0,
    total_monto_pagado: 0,
    total_monto_pendiente: 0,
    total_monto_vencido: 0
  });

  // Tipos de impuestos disponibles
  const tiposImpuesto = [
    'ISR',
    'IVA',
    'IMSS',
    'INFONAVIT',
    'ISN',
    'IEPS',
    'Otros'
  ];

  // Estados disponibles
  const estados = [
    'pendiente',
    'pagado',
    'vencido'
  ];

  // Efectos
  useEffect(() => {
    fetchImpuestos();
    fetchProveedores();
    fetchStats();
  }, []);

  useEffect(() => {
    filterImpuestos();
  }, [impuestos, filters]);

  // Funciones
  const fetchImpuestos = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/impuestos-imss');
      setImpuestos(response.data);
    } catch (error) {
      console.error('Error al obtener impuestos:', error);
      setSnackbar({
        open: true,
        message: 'Error al obtener impuestos',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchProveedores = useCallback(async () => {
    try {
      setProveedoresLoading(true);
      const response = await axios.get('/api/proveedores');
      // Asegurar que siempre sea un array
      if (Array.isArray(response.data)) {
        setProveedores(response.data);
      } else if (response.data && Array.isArray(response.data.data)) {
        setProveedores(response.data.data);
      } else {
        console.warn('Respuesta de proveedores no es un array:', response.data);
        setProveedores([]);
      }
    } catch (error) {
      console.error('Error al obtener proveedores:', error);
      setProveedores([]);
      setProveedoresError(error.message || 'Error al cargar proveedores');
    } finally {
      setProveedoresLoading(false);
    }
  }, []);

  const fetchStats = useCallback(async () => {
    try {
      const response = await axios.get('/api/impuestos-imss/stats');
      setStats(response.data);
    } catch (error) {
      console.error('Error al obtener estadísticas:', error);
    }
  }, []);

  const filterImpuestos = useCallback(() => {
    let filtered = [...impuestos];

    if (filters.search) {
      filtered = filtered.filter(imp => 
        imp.concepto?.toLowerCase().includes(filters.search.toLowerCase()) ||
        imp.tipo_impuesto?.toLowerCase().includes(filters.search.toLowerCase()) ||
        imp.proveedor_nombre?.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    if (filters.tipo_impuesto) {
      filtered = filtered.filter(imp => imp.tipo_impuesto === filters.tipo_impuesto);
    }

    if (filters.estado) {
      filtered = filtered.filter(imp => imp.estado === filters.estado);
    }

    if (filters.proveedor) {
      filtered = filtered.filter(imp => imp.proveedor_id === parseInt(filters.proveedor));
    }

    setFilteredImpuestos(filtered);
  }, [impuestos, filters]);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    
    try {
      if (isEditing) {
        await axios.put(`/api/impuestos-imss/${editingImpuestoId}`, formData);
        setSnackbar({
          open: true,
          message: 'Impuesto actualizado exitosamente',
          severity: 'success'
        });
      } else {
        await axios.post('/api/impuestos-imss', formData);
        setSnackbar({
          open: true,
          message: 'Impuesto creado exitosamente',
          severity: 'success'
        });
      }
      
      await fetchImpuestos();
      await fetchStats();
      handleCloseDialog();
    } catch (error) {
      console.error('Error al guardar impuesto:', error);
      setSnackbar({
        open: true,
        message: 'Error al guardar impuesto',
        severity: 'error'
      });
    }
  }, [isEditing, editingImpuestoId, formData, fetchImpuestos, fetchStats]);

  const handleEdit = useCallback((impuesto) => {
    setIsEditing(true);
    setEditingImpuestoId(impuesto.id);
    setFormData({
      concepto: impuesto.concepto || '',
      tipo_impuesto: impuesto.tipo_impuesto || '',
      monto_base: impuesto.monto_base || '',
      monto_impuesto: impuesto.monto_impuesto || '',
      monto_total: impuesto.monto_total || '',
      fecha_vencimiento: impuesto.fecha_vencimiento ? impuesto.fecha_vencimiento.split('T')[0] : '',
      periodo: impuesto.periodo || '',
      proveedor_id: impuesto.proveedor_id || '',
      comentarios: impuesto.comentarios || ''
    });
    setOpenDialog(true);
  }, []);

  const handleDelete = useCallback(async (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este impuesto?')) {
      try {
        await axios.delete(`/api/impuestos-imss/${id}`);
        setSnackbar({
          open: true,
          message: 'Impuesto eliminado exitosamente',
          severity: 'success'
        });
        await fetchImpuestos();
        await fetchStats();
      } catch (error) {
        console.error('Error al eliminar impuesto:', error);
        setSnackbar({
          open: true,
          message: 'Error al eliminar impuesto',
          severity: 'error'
        });
      }
    }
  }, [fetchImpuestos, fetchStats]);

  const handleViewDetails = useCallback((impuesto) => {
    setSelectedImpuesto(impuesto);
    setShowDetails(true);
  }, []);

  const handleCloseDialog = useCallback(() => {
    setOpenDialog(false);
    setIsEditing(false);
    setEditingImpuestoId(null);
    setFormData({
      concepto: '',
      tipo_impuesto: '',
      monto_base: '',
      monto_impuesto: '',
      monto_total: '',
      fecha_vencimiento: '',
      periodo: '',
      proveedor_id: '',
      comentarios: ''
    });
  }, []);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }, []);

  const handleFilterChange = useCallback((name, value) => {
    setFilters(prev => ({ ...prev, [name]: value }));
  }, []);

  const formatCurrency = useCallback((amount) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(amount || 0);
  }, []);

  const formatDate = useCallback((dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('es-MX');
  }, []);

  const getStatusColor = useCallback((status) => {
    switch (status) {
      case 'pagado':
        return { bg: '#4caf50', text: '#ffffff' };
      case 'vencido':
        return { bg: '#f44336', text: '#ffffff' };
      default:
        return { bg: '#ff9800', text: '#ffffff' };
    }
  }, []);

  const getTipoImpuestoColor = useCallback((tipo) => {
    const colors = {
      'ISR': { bg: '#2196f3', text: '#ffffff' },
      'IVA': { bg: '#9c27b0', text: '#ffffff' },
      'IMSS': { bg: '#ff5722', text: '#ffffff' },
      'INFONAVIT': { bg: '#795548', text: '#ffffff' },
      'ISN': { bg: '#607d8b', text: '#ffffff' },
      'IEPS': { bg: '#e91e63', text: '#ffffff' },
      'Otros': { bg: '#6c757d', text: '#ffffff' }
    };
    return colors[tipo] || { bg: '#6c757d', text: '#ffffff' };
  }, []);

  // Memoización de datos procesados
  const processedImpuestos = useMemo(() => {
    return filteredImpuestos.map(imp => ({
      ...imp,
      monto_total_formatted: formatCurrency(imp.monto_total),
      fecha_vencimiento_formatted: formatDate(imp.fecha_vencimiento),
      fecha_pago_formatted: formatDate(imp.fecha_pago),
      created_at_formatted: formatDate(imp.created_at)
    }));
  }, [filteredImpuestos, formatCurrency, formatDate]);

  // Función de exportación
  const onExport = useCallback(async () => {
    try {
      const response = await axios.get('/api/impuestos-imss/export', {
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `impuestos_imss_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
      setSnackbar({
        open: true,
        message: 'Reporte exportado exitosamente',
        severity: 'success'
      });
    } catch (error) {
      console.error('Error al exportar:', error);
      setSnackbar({
        open: true,
        message: 'Error al exportar reporte',
        severity: 'error'
      });
    }
  }, []);

  return (
    <StyledContainer maxWidth="xl">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Box sx={{ mb: 4, textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold', color: 'white' }}>
            Impuestos e IMSS
          </Typography>
          <Typography variant="h6" sx={{ color: 'white', opacity: 0.9 }}>
            Gestión integral de obligaciones fiscales y de seguridad social
          </Typography>
        </Box>
      </motion.div>

      {/* Botones de acción */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <Box sx={{ mb: 3, display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
          <StyledButton
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setOpenDialog(true)}
            sx={{
              backgroundColor: '#4caf50',
              '&:hover': { backgroundColor: '#45a049' }
            }}
          >
            Nuevo Impuesto
          </StyledButton>
          
          <ExportButton
            onExport={onExport}
            data={filteredImpuestos}
            filename="impuestos_imss"
            moduleName="Impuestos e IMSS"
          />
        </Box>
      </motion.div>

      {/* KPIs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <StyledCard>
              <CardContent sx={{ position: 'relative', zIndex: 2, textAlign: 'center' }}>
                <Typography variant="h4" component="div" sx={{ fontWeight: 'bold', mb: 1, color: 'primary.main' }}>
                  {stats.total_impuestos}
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
                  Total Impuestos
                </Typography>
                <AttachMoneyIcon sx={{ fontSize: 40, color: 'primary.main', opacity: 0.7 }} />
              </CardContent>
            </StyledCard>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <StyledCard>
              <CardContent sx={{ position: 'relative', zIndex: 2, textAlign: 'center' }}>
                <Typography variant="h4" component="div" sx={{ fontWeight: 'bold', mb: 1, color: '#4caf50' }}>
                  {stats.impuestos_pagados}
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
                  Pagados
                </Typography>
                <CheckCircleIcon sx={{ fontSize: 40, color: '#4caf50', opacity: 0.7 }} />
              </CardContent>
            </StyledCard>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <StyledCard>
              <CardContent sx={{ position: 'relative', zIndex: 2, textAlign: 'center' }}>
                <Typography variant="h4" component="div" sx={{ fontWeight: 'bold', mb: 1, color: '#ff9800' }}>
                  {stats.impuestos_pendientes}
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
                  Pendientes
                </Typography>
                <WarningIcon sx={{ fontSize: 40, color: '#ff9800', opacity: 0.7 }} />
              </CardContent>
            </StyledCard>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <StyledCard>
              <CardContent sx={{ position: 'relative', zIndex: 2, textAlign: 'center' }}>
                <Typography variant="h4" component="div" sx={{ fontWeight: 'bold', mb: 1, color: '#f44336' }}>
                  {stats.impuestos_vencidos}
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
                  Vencidos
                </Typography>
                <ErrorIcon sx={{ fontSize: 40, color: '#f44336', opacity: 0.7 }} />
              </CardContent>
            </StyledCard>
          </Grid>
          
          {/* Quinto KPI - Monto Total */}
          <Grid item xs={12} sm={6} md={3}>
            <StyledCard>
              <CardContent sx={{ position: 'relative', zIndex: 2, textAlign: 'center' }}>
                <Typography variant="h4" component="div" sx={{ fontWeight: 'bold', mb: 1, color: '#9c27b0' }}>
                  ${formatCurrency(stats.total_monto)}
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
                  Monto Total
                </Typography>
                <AccountBalanceIcon sx={{ fontSize: 40, color: '#9c27b0', opacity: 0.7 }} />
              </CardContent>
            </StyledCard>
          </Grid>
        </Grid>
      </motion.div>

      {/* Filtros */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
      >
        <StyledCard sx={{ mb: 4 }}>
          <CardContent sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1, color: 'primary.main', fontWeight: 'bold' }}>
              <FilterListIcon color="primary" /> Filtros de Búsqueda
            </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                label="Buscar"
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                placeholder="Concepto, tipo o proveedor..."
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth>
                <InputLabel>Tipo de Impuesto</InputLabel>
                <Select
                  value={filters.tipo_impuesto}
                  onChange={(e) => handleFilterChange('tipo_impuesto', e.target.value)}
                  label="Tipo de Impuesto"
                >
                  <MenuItem value="">Todos</MenuItem>
                  {tiposImpuesto.map(tipo => (
                    <MenuItem key={tipo} value={tipo}>{tipo}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth>
                <InputLabel>Estado</InputLabel>
                <Select
                  value={filters.estado}
                  onChange={(e) => handleFilterChange('estado', e.target.value)}
                  label="Estado"
                >
                  <MenuItem value="">Todos</MenuItem>
                  {estados.map(estado => (
                    <MenuItem key={estado} value={estado}>{estado}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
                                <FormControl fullWidth>
                    <InputLabel>Proveedor</InputLabel>
                    <Select
                      value={filters.proveedor}
                      onChange={(e) => handleFilterChange('proveedor', e.target.value)}
                      label="Proveedor"
                      disabled={proveedoresLoading}
                    >
                      <MenuItem value="">Todos</MenuItem>
                      {proveedoresLoading && (
                        <MenuItem disabled>Cargando proveedores...</MenuItem>
                      )}
                      {!proveedoresLoading && Array.isArray(proveedores) && proveedores.map(prov => (
                        <MenuItem key={prov.id} value={prov.id}>{prov.nombre}</MenuItem>
                      ))}
                      {!proveedoresLoading && proveedoresError && (
                        <MenuItem disabled>Error: {proveedoresError}</MenuItem>
                      )}
                    </Select>
                  </FormControl>
            </Grid>
          </Grid>
          </CardContent>
        </StyledCard>
      </motion.div>

      {/* Tabla */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
      >
        <StyledCard>
          <CardContent sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1, color: 'primary.main', fontWeight: 'bold' }}>
              <AssignmentIcon color="primary" /> Lista de Impuestos e IMSS
            </Typography>
            <TableContainer sx={{ borderRadius: 2, overflow: 'hidden' }}>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: 'primary.main' }}>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Concepto</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Tipo</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Monto Total</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Estado</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Vencimiento</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Proveedor</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {processedImpuestos.map((impuesto) => (
                  <TableRow key={impuesto.id} hover>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {impuesto.concepto}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {impuesto.periodo}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={impuesto.tipo_impuesto}
                        size="small"
                        sx={{
                          backgroundColor: getTipoImpuestoColor(impuesto.tipo_impuesto).bg,
                          color: getTipoImpuestoColor(impuesto.tipo_impuesto).text,
                          fontWeight: 600
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {impuesto.monto_total_formatted}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <StyledChip
                        label={impuesto.estado_detallado}
                        status={impuesto.estado}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {impuesto.fecha_vencimiento_formatted}
                      </Typography>
                      {impuesto.dias_vencido > 0 && (
                        <Typography variant="caption" color="error">
                          {impuesto.dias_vencido} días vencido
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {impuesto.proveedor_nombre || 'N/A'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <IconButton
                          size="small"
                          onClick={() => handleViewDetails(impuesto)}
                          sx={{ color: 'primary.main' }}
                        >
                          <VisibilityIcon />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => handleEdit(impuesto)}
                          sx={{ color: 'warning.main' }}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => handleDelete(impuesto.id)}
                          sx={{ color: 'error.main' }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            </TableContainer>
          </CardContent>
        </StyledCard>
      </motion.div>

      {/* Diálogo de creación/edición */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {isEditing ? 'Editar Impuesto' : 'Nuevo Impuesto'}
        </DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Concepto"
                  name="concepto"
                  value={formData.concepto}
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required>
                  <InputLabel>Tipo de Impuesto</InputLabel>
                  <Select
                    name="tipo_impuesto"
                    value={formData.tipo_impuesto}
                    onChange={handleChange}
                    label="Tipo de Impuesto"
                  >
                    {tiposImpuesto.map(tipo => (
                      <MenuItem key={tipo} value={tipo}>{tipo}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Monto Base"
                  name="monto_base"
                  type="number"
                  value={formData.monto_base}
                  onChange={handleChange}
                  inputProps={{ step: "0.01", min: "0" }}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Monto Impuesto"
                  name="monto_impuesto"
                  type="number"
                  value={formData.monto_impuesto}
                  onChange={handleChange}
                  inputProps={{ step: "0.01", min: "0" }}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Monto Total"
                  name="monto_total"
                  type="number"
                  value={formData.monto_total}
                  onChange={handleChange}
                  required
                  inputProps={{ step: "0.01", min: "0" }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Fecha de Vencimiento"
                  name="fecha_vencimiento"
                  type="date"
                  value={formData.fecha_vencimiento}
                  onChange={handleChange}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Periodo"
                  name="periodo"
                  value={formData.periodo}
                  onChange={handleChange}
                  required
                  placeholder="Ej: Enero 2024"
                />
              </Grid>
                              <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Proveedor</InputLabel>
                    <Select
                      name="proveedor_id"
                      value={formData.proveedor_id}
                      onChange={handleChange}
                      label="Proveedor"
                      disabled={proveedoresLoading}
                    >
                      <MenuItem value="">Sin proveedor</MenuItem>
                      {proveedoresLoading && (
                        <MenuItem disabled>Cargando proveedores...</MenuItem>
                      )}
                      {!proveedoresLoading && Array.isArray(proveedores) && proveedores.map(prov => (
                        <MenuItem key={prov.id} value={prov.id}>{prov.nombre}</MenuItem>
                      ))}
                      {!proveedoresLoading && proveedoresError && (
                        <MenuItem disabled>Error: {proveedoresError}</MenuItem>
                      )}
                    </Select>
                  </FormControl>
                </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Comentarios"
                  name="comentarios"
                  value={formData.comentarios}
                  onChange={handleChange}
                  multiline
                  rows={3}
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancelar</Button>
          <Button onClick={handleSubmit} variant="contained">
            {isEditing ? 'Actualizar' : 'Crear'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Diálogo de detalles mejorado */}
      <Dialog 
        open={showDetails} 
        onClose={() => setShowDetails(false)} 
        maxWidth="lg" 
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
          }
        }}
      >
        <DialogTitle sx={{ 
          background: 'linear-gradient(135deg, #667eea, #764ba2)',
          color: '#fff',
          borderRadius: 0,
          pb: 2
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <AttachMoneyIcon sx={{ fontSize: '2rem' }} />
              <Typography variant="h5" sx={{ fontWeight: 700 }}>
                Detalles del Impuesto
              </Typography>
            </Box>
            <IconButton 
              onClick={() => setShowDetails(false)}
              sx={{ 
                color: '#fff',
                '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' }
              }}
            >
              <ErrorIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        
        <DialogContent sx={{ mt: 2, p: 3 }}>
          {selectedImpuesto && (
            <Box>
              {/* Información Principal */}
              <Card sx={{ p: 3, mb: 3, background: 'rgba(255,255,255,0.9)' }}>
                <Typography variant="h6" sx={{ fontWeight: 700, color: '#2c3e50', mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                  📋 Información General
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={8}>
                    <Typography variant="subtitle2" sx={{ color: '#7f8c8d', fontWeight: 600, mb: 1 }}>
                      Concepto
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 600, color: '#2c3e50', mb: 2 }}>
                      {selectedImpuesto.concepto}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Typography variant="subtitle2" sx={{ color: '#7f8c8d', fontWeight: 600, mb: 1 }}>
                      Tipo de Impuesto
                    </Typography>
                    <Chip
                      label={selectedImpuesto.tipo_impuesto}
                      size="medium"
                      sx={{
                        backgroundColor: getTipoImpuestoColor(selectedImpuesto.tipo_impuesto).bg,
                        color: getTipoImpuestoColor(selectedImpuesto.tipo_impuesto).text,
                        fontWeight: 700,
                        fontSize: '0.9rem',
                        px: 2
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle2" sx={{ color: '#7f8c8d', fontWeight: 600, mb: 1 }}>
                      Periodo
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600, color: '#2c3e50' }}>
                      {selectedImpuesto.periodo}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle2" sx={{ color: '#7f8c8d', fontWeight: 600, mb: 1 }}>
                      Estado
                    </Typography>
                    <StyledChip
                      label={selectedImpuesto.estado_detallado}
                      status={selectedImpuesto.estado}
                      size="medium"
                      sx={{ fontWeight: 700 }}
                    />
                  </Grid>
                </Grid>
              </Card>

              {/* Información Financiera */}
              <Card sx={{ p: 3, mb: 3, background: 'rgba(255,255,255,0.9)' }}>
                <Typography variant="h6" sx={{ fontWeight: 700, color: '#2c3e50', mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                  💰 Información Financiera
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={4}>
                    <Box sx={{ textAlign: 'center', p: 2, borderRadius: 2, background: 'rgba(102, 126, 234, 0.1)' }}>
                      <Typography variant="subtitle2" sx={{ color: '#7f8c8d', fontWeight: 600, mb: 1 }}>
                        Monto Base
                      </Typography>
                      <Typography variant="h5" sx={{ fontWeight: 700, color: '#667eea' }}>
                        {formatCurrency(selectedImpuesto.monto_base)}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Box sx={{ textAlign: 'center', p: 2, borderRadius: 2, background: 'rgba(255, 152, 0, 0.1)' }}>
                      <Typography variant="subtitle2" sx={{ color: '#7f8c8d', fontWeight: 600, mb: 1 }}>
                        Monto Impuesto
                      </Typography>
                      <Typography variant="h5" sx={{ fontWeight: 700, color: '#ff9800' }}>
                        {formatCurrency(selectedImpuesto.monto_impuesto)}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Box sx={{ textAlign: 'center', p: 2, borderRadius: 2, background: 'rgba(76, 175, 80, 0.1)' }}>
                      <Typography variant="subtitle2" sx={{ color: '#7f8c8d', fontWeight: 600, mb: 1 }}>
                        Monto Total
                      </Typography>
                      <Typography variant="h5" sx={{ fontWeight: 700, color: '#4caf50' }}>
                        {formatCurrency(selectedImpuesto.monto_total)}
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Card>

              {/* Fechas y Estado */}
              <Card sx={{ p: 3, mb: 3, background: 'rgba(255,255,255,0.9)' }}>
                <Typography variant="h6" sx={{ fontWeight: 700, color: '#2c3e50', mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                  📅 Fechas y Estado
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Box sx={{ p: 2, borderRadius: 2, background: 'rgba(156, 39, 176, 0.1)' }}>
                      <Typography variant="subtitle2" sx={{ color: '#7f8c8d', fontWeight: 600, mb: 1 }}>
                        Fecha de Vencimiento
                      </Typography>
                      <Typography variant="h6" sx={{ fontWeight: 700, color: '#9c27b0' }}>
                        {formatDate(selectedImpuesto.fecha_vencimiento)}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Box sx={{ p: 2, borderRadius: 2, background: 'rgba(63, 81, 181, 0.1)' }}>
                      <Typography variant="subtitle2" sx={{ color: '#7f8c8d', fontWeight: 600, mb: 1 }}>
                        Autorizado
                      </Typography>
                      <Chip
                        label={selectedImpuesto.autorizado ? 'Sí' : 'No'}
                        color={selectedImpuesto.autorizado ? 'success' : 'error'}
                        size="medium"
                        sx={{ fontWeight: 700 }}
                      />
                    </Box>
                  </Grid>
                </Grid>
              </Card>

              {/* Información del Proveedor */}
              {selectedImpuesto.proveedor_nombre && (
                <Card sx={{ p: 3, mb: 3, background: 'rgba(255,255,255,0.9)' }}>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: '#2c3e50', mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                    🏢 Información del Proveedor
                  </Typography>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <Typography variant="subtitle2" sx={{ color: '#7f8c8d', fontWeight: 600, mb: 1 }}>
                        Nombre
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 600, color: '#2c3e50' }}>
                        {selectedImpuesto.proveedor_nombre}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Typography variant="subtitle2" sx={{ color: '#7f8c8d', fontWeight: 600, mb: 1 }}>
                        RFC
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 600, color: '#2c3e50' }}>
                        {selectedImpuesto.proveedor_rfc}
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="subtitle2" sx={{ color: '#7f8c8d', fontWeight: 600, mb: 1 }}>
                        Dirección
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 600, color: '#2c3e50' }}>
                        {selectedImpuesto.proveedor_direccion}
                      </Typography>
                    </Grid>
                  </Grid>
                </Card>
              )}

              {/* Comentarios */}
              {selectedImpuesto.comentarios && (
                <Card sx={{ p: 3, background: 'rgba(255,255,255,0.9)' }}>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: '#2c3e50', mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                    💬 Comentarios
                  </Typography>
                  <Box sx={{ p: 2, borderRadius: 2, background: 'rgba(102, 126, 234, 0.05)', border: '1px solid rgba(102, 126, 234, 0.1)' }}>
                    <Typography variant="body1" sx={{ color: '#2c3e50', fontStyle: 'italic' }}>
                      {selectedImpuesto.comentarios}
                    </Typography>
                  </Box>
                </Card>
              )}
            </Box>
          )}
        </DialogContent>
        
        <DialogActions sx={{ p: 3, background: 'rgba(255,255,255,0.9)' }}>
          <Button 
            onClick={() => setShowDetails(false)}
            variant="contained"
            sx={{
              background: 'linear-gradient(135deg, #667eea, #764ba2)',
              color: '#fff',
              fontWeight: 600,
              px: 4,
              py: 1.5,
              borderRadius: 2,
              '&:hover': {
                background: 'linear-gradient(135deg, #5a6fd8, #6a4190)'
              }
            }}
          >
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </StyledContainer>
  );
};

export default ImpuestosIMSSModule;
