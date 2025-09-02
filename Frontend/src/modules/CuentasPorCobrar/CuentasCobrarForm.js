import React, { useState, useEffect, useCallback, useMemo } from 'react';
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
  Collapse
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
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import BusinessIcon from '@mui/icons-material/Business';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import TimelineIcon from '@mui/icons-material/Timeline';
import RefreshIcon from '@mui/icons-material/Refresh';
import PaymentIcon from '@mui/icons-material/Payment';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CloseIcon from '@mui/icons-material/Close';

// Configuración de axios
const API_BASE = 'http://localhost:5001';

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
  '& .MuiTableHead-root': {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    '& .MuiTableCell-head': {
      color: '#fff',
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
      transition: 'all 0.2s ease',
      '&:hover': {
        background: 'rgba(102, 126, 234, 0.05)',
        transform: 'scale(1.01)'
      },
      '&:nth-of-type(even)': {
        background: 'rgba(0,0,0,0.02)'
      }
    },
    '& .MuiTableCell-body': {
      borderBottom: '1px solid rgba(0,0,0,0.05)',
      padding: theme.spacing(2),
      fontSize: '0.875rem'
    }
  }
}));

const StyledSearchField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: 12,
    background: 'rgba(255,255,255,0.9)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255,255,255,0.3)',
    transition: 'all 0.3s ease',
    '&:hover': {
      background: 'rgba(255,255,255,0.95)',
      borderColor: 'rgba(102, 126, 234, 0.5)'
    },
    '&.Mui-focused': {
      background: 'rgba(255,255,255,1)',
      borderColor: '#667eea',
      boxShadow: '0 0 0 3px rgba(102, 126, 234, 0.1)'
    }
  }
}));

const StyledChip = styled(Chip)(({ theme, status }) => ({
  borderRadius: 8,
  fontWeight: 600,
  fontSize: '0.75rem',
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
  background: status === 'cobrado' 
    ? 'linear-gradient(135deg, #27ae60, #2ecc71)' 
    : status === 'vencido'
    ? 'linear-gradient(135deg, #e74c3c, #c0392b)'
    : status === 'cancelado'
    ? 'linear-gradient(135deg, #95a5a6, #7f8c8d)'
    : 'linear-gradient(135deg, #f39c12, #e67e22)', // pendiente por defecto
  color: '#fff',
  boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
  '&:hover': {
    transform: 'translateY(-1px)',
    boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
  }
}));

const ActionButton = styled(IconButton)(({ color }) => ({
  width: 36,
  height: 36,
  margin: '0 2px',
  background: color,
  color: '#fff',
  transition: 'all 0.15s ease',
  '&:hover': {
    background: color,
    transform: 'translateY(-1px)',
    boxShadow: '0 3px 8px rgba(0,0,0,0.15)'
  }
}));

// Componente de skeleton optimizado
const CuentaRowSkeleton = React.memo(() => (
  <TableRow>
    <TableCell>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Skeleton variant="circular" width={48} height={48} />
        <Box>
          <Skeleton variant="text" width={150} height={20} />
          <Skeleton variant="text" width={100} height={16} />
        </Box>
      </Box>
    </TableCell>
    <TableCell>
      <Skeleton variant="text" width={120} height={20} />
    </TableCell>
    <TableCell>
      <Skeleton variant="text" width={100} height={20} />
    </TableCell>
    <TableCell>
      <Skeleton variant="text" width={100} height={20} />
    </TableCell>
    <TableCell>
      <Skeleton variant="text" width={80} height={20} />
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

const CuentasCobrarForm = () => {
  // Estados principales
  const [cuentas, setCuentas] = useState([]);
  const [proyectos, setProyectos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [monthFilter, setMonthFilter] = useState('');
  
  // Estados del formulario
  const [openDialog, setOpenDialog] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    proyecto_id: '',
    concepto: '',
    monto_sin_iva: '',
    monto_con_iva: '',
    fecha: '',
    estado: 'pendiente'
  });

  // Estados de complementos
  const [expandedRows, setExpandedRows] = useState([]);
  const [complementosByCuenta, setComplementosByCuenta] = useState({});
  const [openComplementoDialog, setOpenComplementoDialog] = useState(false);
  const [selectedCuentaId, setSelectedCuentaId] = useState(null);
  
  // Estado para diálogo de detalles
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const [selectedCuenta, setSelectedCuenta] = useState(null);
  const [complemento, setComplemento] = useState({
    fecha_pago: '',
    concepto: '',
    monto_sin_iva: '',
    monto_con_iva: ''
  });

  // Estados de notificaciones
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Funciones de formateo
  const formatCurrency = useCallback((amount) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(amount || 0);
  }, []);

  const formatDate = useCallback((dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-MX', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }, []);

  // Funciones de API
  const fetchCuentas = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE}/api/cuentas-cobrar`);
      setCuentas(response.data);
    } catch (error) {
      console.error('Error al obtener cuentas por cobrar:', error);
      setSnackbar({
        open: true,
        message: 'Error al obtener cuentas por cobrar',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchProyectos = useCallback(async () => {
    try {
      const response = await axios.get(`${API_BASE}/api/projects`);
      setProyectos(response.data);
    } catch (error) {
      console.error('Error al obtener proyectos:', error);
    }
  }, []);

  const fetchComplementos = useCallback(async (cuentaId) => {
    try {
      const response = await axios.get(`${API_BASE}/api/complementos-pago/${cuentaId}`);
      setComplementosByCuenta(prev => ({
        ...prev,
        [cuentaId]: response.data
      }));
    } catch (error) {
      console.error('Error al obtener complementos:', error);
    }
  }, []);

  // Cálculos memoizados
  const { totalSinIVA, totalConIVA, totalPendiente } = useMemo(() => {
    const totalSinIVA = cuentas.reduce((acc, c) => acc + parseFloat(c.monto_sin_iva || 0), 0);
    const totalConIVA = cuentas.reduce((acc, c) => acc + parseFloat(c.monto_con_iva || 0), 0);
    
    // Calcular total pendiente
    const totalPendiente = cuentas.reduce((acc, c) => {
      const complementos = complementosByCuenta[c.id] || [];
      const totalPagado = complementos.reduce((sum, comp) => sum + parseFloat(comp.monto_sin_iva || 0), 0);
      return acc + (parseFloat(c.monto_sin_iva || 0) - totalPagado);
    }, 0);

    return { totalSinIVA, totalConIVA, totalPendiente };
  }, [cuentas, complementosByCuenta]);

  // Filtrado memoizado
  const cuentasFiltradas = useMemo(() => {
    let filtered = cuentas;

    // Filtro por búsqueda
    if (searchTerm) {
      filtered = filtered.filter(cuenta =>
        cuenta.concepto?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        proyectos.find(p => p.id === cuenta.proyecto_id)?.nombre?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtro por mes
    if (monthFilter) {
      filtered = filtered.filter(cuenta => 
        new Date(cuenta.fecha).getMonth() + 1 === parseInt(monthFilter)
      );
    }

    // Filtro por estado
    if (statusFilter !== 'all') {
      filtered = filtered.filter(cuenta => {
        const complementos = complementosByCuenta[cuenta.id] || [];
        const totalPagado = complementos.reduce((sum, comp) => sum + parseFloat(comp.monto_sin_iva || 0), 0);
        const montoTotal = parseFloat(cuenta.monto_sin_iva || 0);
        
        if (statusFilter === 'paid') return totalPagado >= montoTotal;
        if (statusFilter === 'partial') return totalPagado > 0 && totalPagado < montoTotal;
        if (statusFilter === 'pending') return totalPagado === 0;
        return true;
      });
    }

    return filtered;
  }, [cuentas, searchTerm, monthFilter, statusFilter, complementosByCuenta, proyectos]);

  // Efectos
  useEffect(() => {
    fetchCuentas();
    fetchProyectos();
  }, [fetchCuentas, fetchProyectos]);

  // Handlers
  const handleOpenDialog = useCallback(() => {
    setIsEditing(false);
    setEditingId(null);
    setFormData({
      proyecto_id: '',
      concepto: '',
      monto_sin_iva: '',
      monto_con_iva: '',
      fecha: '',
      estado: 'pendiente'
    });
    setOpenDialog(true);
  }, []);

  const handleCloseDialog = useCallback(() => {
    setOpenDialog(false);
    setIsEditing(false);
    setEditingId(null);
  }, []);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
      ...(name === 'monto_sin_iva' && {
        monto_con_iva: (parseFloat(value) * 1.16 || 0).toFixed(2)
      })
    }));
  }, []);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await axios.put(`${API_BASE}/api/cuentas-cobrar/${editingId}`, formData);
        setSnackbar({ open: true, message: 'Cuenta actualizada exitosamente', severity: 'success' });
      } else {
        await axios.post(`${API_BASE}/api/cuentas-cobrar`, formData);
        setSnackbar({ open: true, message: 'Cuenta creada exitosamente', severity: 'success' });
      }
      fetchCuentas();
      handleCloseDialog();
    } catch (error) {
      console.error('Error al guardar cuenta:', error);
      setSnackbar({ open: true, message: 'Error al guardar cuenta', severity: 'error' });
    }
  }, [isEditing, editingId, formData, fetchCuentas, handleCloseDialog]);

  const handleEdit = useCallback((cuenta) => {
    setIsEditing(true);
    setEditingId(cuenta.id);
    setFormData({
      proyecto_id: cuenta.proyecto_id || '',
      concepto: cuenta.concepto || '',
      monto_sin_iva: cuenta.monto_sin_iva || '',
      monto_con_iva: cuenta.monto_con_iva || '',
      fecha: cuenta.fecha || '',
      estado: cuenta.estado || 'pendiente'
    });
    setOpenDialog(true);
  }, []);

  const handleDelete = useCallback(async (cuenta) => {
    if (window.confirm(`¿Estás seguro de que quieres eliminar la cuenta "${cuenta.concepto}"?`)) {
      try {
        await axios.delete(`${API_BASE}/api/cuentas-cobrar/${cuenta.id}`);
        setSnackbar({ open: true, message: 'Cuenta eliminada exitosamente', severity: 'success' });
        fetchCuentas();
      } catch (error) {
        console.error('Error al eliminar cuenta:', error);
        setSnackbar({ open: true, message: 'Error al eliminar cuenta', severity: 'error' });
      }
    }
  }, [fetchCuentas]);

  const handleExportExcel = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (statusFilter !== 'all') {
        params.append('estado', statusFilter);
      }
      if (monthFilter) {
        const currentYear = new Date().getFullYear();
        const startDate = new Date(currentYear, monthFilter - 1, 1);
        const endDate = new Date(currentYear, monthFilter, 0);
        params.append('fecha_inicio', startDate.toISOString().split('T')[0]);
        params.append('fecha_fin', endDate.toISOString().split('T')[0]);
      }
      
      const url = `${API_BASE}/api/cuentas-cobrar/export/excel?${params.toString()}`;
      window.open(url, '_blank');
      
      setSnackbar({ 
        open: true, 
        message: 'Reporte Excel generado exitosamente', 
        severity: 'success' 
      });
    } catch (error) {
      console.error('Error al exportar reporte:', error);
      setSnackbar({ 
        open: true, 
        message: 'Error al generar reporte Excel', 
        severity: 'error' 
      });
    }
  }, [statusFilter, monthFilter]);

  const handleExpandClick = useCallback((cuentaId) => {
    const cuenta = cuentas.find(c => c.id === cuentaId);
    if (cuenta) {
      setSelectedCuenta(cuenta);
      setOpenDetailsDialog(true);
      // Cargar complementos si no están cargados
      if (!complementosByCuenta[cuentaId]) {
        fetchComplementos(cuentaId);
      }
    }
  }, [cuentas, complementosByCuenta, fetchComplementos]);

  const handleCloseDetailsDialog = useCallback(() => {
    setOpenDetailsDialog(false);
    setSelectedCuenta(null);
  }, []);

  const handleOpenComplementoDialog = useCallback((cuentaId) => {
    setSelectedCuentaId(cuentaId);
    setComplemento({
      fecha_pago: '',
      concepto: '',
      monto_sin_iva: '',
      monto_con_iva: ''
    });
    setOpenComplementoDialog(true);
  }, []);

  const handleCloseComplementoDialog = useCallback(() => {
    setOpenComplementoDialog(false);
    setSelectedCuentaId(null);
  }, []);

  const handleComplementoChange = useCallback((e) => {
    const { name, value } = e.target;
    setComplemento(prev => ({
      ...prev,
      [name]: value,
      ...(name === 'monto_sin_iva' && {
        monto_con_iva: (parseFloat(value) * 1.16 || 0).toFixed(2)
      })
    }));
  }, []);

  const handleComplementoSubmit = useCallback(async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_BASE}/api/complementos-pago/${selectedCuentaId}`, complemento);
      setSnackbar({ open: true, message: 'Complemento agregado exitosamente', severity: 'success' });
      fetchComplementos(selectedCuentaId);
      handleCloseComplementoDialog();
    } catch (error) {
      console.error('Error al agregar complemento:', error);
      setSnackbar({ open: true, message: 'Error al agregar complemento', severity: 'error' });
    }
  }, [selectedCuentaId, complemento, fetchComplementos, handleCloseComplementoDialog]);

  const handleDeleteComplemento = useCallback(async (complementoId, cuentaId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este complemento?')) {
      try {
        await axios.delete(`${API_BASE}/api/complementos-pago/${complementoId}`);
        setSnackbar({ open: true, message: 'Complemento eliminado exitosamente', severity: 'success' });
        fetchComplementos(cuentaId);
      } catch (error) {
        console.error('Error al eliminar complemento:', error);
        setSnackbar({ open: true, message: 'Error al eliminar complemento', severity: 'error' });
      }
    }
  }, [fetchComplementos]);

  const handleSnackbarClose = useCallback(() => {
    setSnackbar(prev => ({ ...prev, open: false }));
  }, []);

  // Estadísticas
  const stats = useMemo(() => [
    { 
      label: 'Total Cuentas', 
      value: cuentas.length.toString(), 
      icon: <AssignmentIcon />, 
      color: '#4ecdc4' 
    },
    { 
      label: 'Total Sin IVA', 
      value: formatCurrency(totalSinIVA), 
      icon: <AttachMoneyIcon />, 
      color: '#27ae60' 
    },
    { 
      label: 'Total Con IVA', 
      value: formatCurrency(totalConIVA), 
      icon: <TrendingUpIcon />, 
      color: '#f39c12' 
    },
    { 
      label: 'Pendiente', 
      value: formatCurrency(totalPendiente), 
      icon: <ScheduleIcon />, 
      color: '#e74c3c' 
    }
  ], [cuentas.length, totalSinIVA, totalConIVA, totalPendiente, formatCurrency]);

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
                  Cuentas por Cobrar
                </Typography>
                <Typography variant="h6" sx={{ 
                  color: 'rgba(255,255,255,0.8)',
                  fontWeight: 400
                }}>
                  Gestiona las cuentas pendientes de cobro y complementos de pago
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', gap: 2 }}>
                <IconButton
                  onClick={fetchCuentas}
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
            </Box>
            
            {/* Botones principales */}
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'flex-end', 
              alignItems: 'center',
              mb: 3
            }}>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <IconButton
                  onClick={handleOpenDialog}
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
                  <AddIcon sx={{ mr: 1 }} />
                  Nueva Cuenta
                </IconButton>
                
                <IconButton
                  onClick={handleExportExcel}
                  sx={{
                    background: 'linear-gradient(135deg, #27ae60, #2ecc71)',
                    color: '#fff',
                    borderRadius: 2,
                    px: 3,
                    py: 1,
                    '&:hover': {
                      background: 'linear-gradient(135deg, #229954, #27ae60)',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 4px 12px rgba(39, 174, 96, 0.3)'
                    }
                  }}
                >
                  <DownloadIcon sx={{ mr: 1 }} />
                  Exportar Informe
                </IconButton>
              </Box>
            </Box>
            
            {/* Stats */}
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
                <StyledSearchField
                  fullWidth
                  placeholder="Buscar por concepto o proyecto..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{
                    startAdornment: <SearchIcon sx={{ mr: 1, color: '#667eea' }} />
                  }}
                />
              </Grid>
              
              <Grid item xs={12} md={4}>
                <FormControl fullWidth>
                  <InputLabel>Filtrar por estado</InputLabel>
                  <Select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    label="Filtrar por estado"
                  >
                    <MenuItem value="all">Todos los estados</MenuItem>
                    <MenuItem value="pending">Pendientes</MenuItem>
                    <MenuItem value="partial">Parcialmente pagados</MenuItem>
                    <MenuItem value="paid">Pagados</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} md={4}>
                <FormControl fullWidth>
                  <InputLabel>Filtrar por mes</InputLabel>
                  <Select
                    value={monthFilter}
                    onChange={(e) => setMonthFilter(e.target.value)}
                    label="Filtrar por mes"
                  >
                    <MenuItem value="">Todos los meses</MenuItem>
                    {Array.from({ length: 12 }, (_, i) => (
                      <MenuItem key={i + 1} value={i + 1}>
                        {new Date(0, i).toLocaleString('default', { month: 'long' })}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </StyledCard>

          {/* Contenido Principal */}
          <Grid container spacing={3}>
            {/* Lista de Cuentas */}
            <Grid item xs={12}>
              <StyledCard>
                <Box sx={{ p: 3, borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: '#2c3e50' }}>
                    Lista de Cuentas por Cobrar
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#7f8c8d', mt: 0.5 }}>
                    {cuentasFiltradas.length} cuentas encontradas
                  </Typography>
                </Box>
                
                <StyledTableContainer>
                  <StyledTable>
                    <TableHead>
                      <TableRow>
                        <TableCell>PROYECTO</TableCell>
                        <TableCell>CONCEPTO</TableCell>
                        <TableCell>MONTO SIN IVA</TableCell>
                        <TableCell>MONTO CON IVA</TableCell>
                        <TableCell>FECHA</TableCell>
                        <TableCell>ESTADO</TableCell>
                        <TableCell align="center">ACCIONES</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {loading ? (
                        Array.from({ length: 5 }).map((_, index) => (
                          <CuentaRowSkeleton key={index} />
                        ))
                      ) : (
                        <AnimatePresence>
                          {cuentasFiltradas.map((cuenta, index) => {
                            const complementos = complementosByCuenta[cuenta.id] || [];
                            const totalPagado = complementos.reduce((sum, comp) => sum + parseFloat(comp.monto_sin_iva || 0), 0);
                            const montoTotal = parseFloat(cuenta.monto_sin_iva || 0);
                            const saldoPendiente = montoTotal - totalPagado;
                            
                            let status = 'pending';
                            if (totalPagado >= montoTotal) status = 'paid';
                            else if (totalPagado > 0) status = 'partial';

                            return (
                              <React.Fragment key={cuenta.id}>
                                <motion.tr
                                  initial={{ opacity: 0, y: 20 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  exit={{ opacity: 0, y: -20 }}
                                  transition={{ delay: index * 0.05 }}
                                  component={TableRow}
                                >
                                  <TableCell>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                      <Avatar sx={{ 
                                        bgcolor: '#667eea',
                                        width: 48,
                                        height: 48
                                      }}>
                                        {proyectos.find(p => p.id === cuenta.proyecto_id)?.nombre?.charAt(0)?.toUpperCase() || 'P'}
                                      </Avatar>
                                      <Box>
                                        <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#2c3e50' }}>
                                          {proyectos.find(p => p.id === cuenta.proyecto_id)?.nombre || 'N/A'}
                                        </Typography>
                                        <Typography variant="caption" sx={{ color: '#7f8c8d' }}>
                                          ID: {cuenta.id}
                                        </Typography>
                                      </Box>
                                    </Box>
                                  </TableCell>
                                  <TableCell>
                                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                      {cuenta.concepto}
                                    </Typography>
                                  </TableCell>
                                  <TableCell>
                                    <Typography variant="body2" sx={{ fontWeight: 600, color: '#27ae60' }}>
                                      {formatCurrency(cuenta.monto_sin_iva)}
                                    </Typography>
                                    {totalPagado > 0 && (
                                      <Typography variant="caption" sx={{ color: '#f39c12' }}>
                                        Pagado: {formatCurrency(totalPagado)}
                                      </Typography>
                                    )}
                                  </TableCell>
                                  <TableCell>
                                    <Typography variant="body2" sx={{ fontWeight: 600, color: '#f39c12' }}>
                                      {formatCurrency(cuenta.monto_con_iva)}
                                    </Typography>
                                    {saldoPendiente > 0 && (
                                      <Typography variant="caption" sx={{ color: '#e74c3c' }}>
                                        Pendiente: {formatCurrency(saldoPendiente)}
                                      </Typography>
                                    )}
                                  </TableCell>
                                  <TableCell>
                                    <Typography variant="body2" sx={{ color: '#7f8c8d' }}>
                                      {formatDate(cuenta.fecha)}
                                    </Typography>
                                  </TableCell>
                                  <TableCell>
                                    <StyledChip
                                      label={cuenta.estado || 'pendiente'}
                                      status={cuenta.estado || 'pendiente'}
                                      size="small"
                                    />
                                  </TableCell>
                                  <TableCell align="center">
                                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 0.5 }}>
                                      <Tooltip title="Ver detalles">
                                        <ActionButton
                                          color="#45b7d1"
                                          onClick={() => handleExpandClick(cuenta.id)}
                                        >
                                          <VisibilityIcon fontSize="small" />
                                        </ActionButton>
                                      </Tooltip>
                                      <Tooltip title="Editar cuenta">
                                        <ActionButton
                                          color="#f39c12"
                                          onClick={() => handleEdit(cuenta)}
                                        >
                                          <EditIcon fontSize="small" />
                                        </ActionButton>
                                      </Tooltip>
                                      <Tooltip title="Agregar complemento">
                                        <ActionButton
                                          color="#27ae60"
                                          onClick={() => handleOpenComplementoDialog(cuenta.id)}
                                        >
                                          <PaymentIcon fontSize="small" />
                                        </ActionButton>
                                      </Tooltip>
                                      <Tooltip title="Eliminar cuenta">
                                        <ActionButton
                                          color="#e74c3c"
                                          onClick={() => handleDelete(cuenta)}
                                        >
                                          <DeleteIcon fontSize="small" />
                                        </ActionButton>
                                      </Tooltip>
                                    </Box>
                                  </TableCell>
                                </motion.tr>
                              </React.Fragment>
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

          {/* Diálogo de Cuenta */}
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
              {isEditing ? 'Editar Cuenta' : 'Nueva Cuenta'}
            </DialogTitle>
            <DialogContent>
              <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <FormControl fullWidth>
                      <InputLabel>Proyecto</InputLabel>
                      <Select
                        name="proyecto_id"
                        value={formData.proyecto_id}
                        onChange={handleChange}
                        label="Proyecto"
                        required
                      >
                        {proyectos.map((proyecto) => (
                          <MenuItem key={proyecto.id} value={proyecto.id}>
                            {proyecto.nombre}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Concepto"
                      name="concepto"
                      value={formData.concepto}
                      onChange={handleChange}
                      required
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Monto Sin IVA"
                      name="monto_sin_iva"
                      type="number"
                      value={formData.monto_sin_iva}
                      onChange={handleChange}
                      required
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Monto Con IVA"
                      name="monto_con_iva"
                      type="number"
                      value={formData.monto_con_iva}
                      InputProps={{ readOnly: true }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Fecha"
                      name="fecha"
                      type="date"
                      value={formData.fecha}
                      onChange={handleChange}
                      required
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <FormControl fullWidth>
                      <InputLabel>Estado</InputLabel>
                      <Select
                        name="estado"
                        value={formData.estado}
                        onChange={handleChange}
                        label="Estado"
                        required
                      >
                        <MenuItem value="pendiente">Pendiente</MenuItem>
                        <MenuItem value="cobrado">Cobrado</MenuItem>
                        <MenuItem value="vencido">Vencido</MenuItem>
                        <MenuItem value="cancelado">Cancelado</MenuItem>
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

          {/* Diálogo de Complemento */}
          <Dialog
            open={openComplementoDialog}
            onClose={handleCloseComplementoDialog}
            maxWidth="sm"
            fullWidth
            PaperProps={{
              sx: {
                borderRadius: 3,
                background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
              }
            }}
          >
            <DialogTitle sx={{ fontWeight: 700, color: '#2c3e50' }}>
              Agregar Complemento de Pago
            </DialogTitle>
            <DialogContent>
              <Box component="form" onSubmit={handleComplementoSubmit} sx={{ mt: 2 }}>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Fecha de Pago"
                      name="fecha_pago"
                      type="date"
                      value={complemento.fecha_pago}
                      onChange={handleComplementoChange}
                      required
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                                         <TextField
                       fullWidth
                       label="Concepto"
                       name="concepto"
                       value={complemento.concepto}
                       onChange={handleComplementoChange}
                       required
                     />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Monto Sin IVA"
                      name="monto_sin_iva"
                      type="number"
                      value={complemento.monto_sin_iva}
                      onChange={handleComplementoChange}
                      required
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Monto Con IVA"
                      name="monto_con_iva"
                      type="number"
                      value={complemento.monto_con_iva}
                      InputProps={{ readOnly: true }}
                    />
                  </Grid>
                </Grid>
              </Box>
            </DialogContent>
            <DialogActions sx={{ p: 3 }}>
              <IconButton
                variant="outlined"
                onClick={handleCloseComplementoDialog}
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
                onClick={handleComplementoSubmit}
                sx={{
                  background: 'linear-gradient(135deg, #667eea, #764ba2)',
                  color: '#fff',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #5a6fd8, #6a4190)'
                  }
                }}
              >
                Agregar Complemento
              </IconButton>
            </DialogActions>
          </Dialog>

          {/* Diálogo de Detalles */}
          <Dialog
            open={openDetailsDialog}
            onClose={handleCloseDetailsDialog}
            maxWidth="md"
            fullWidth
            PaperProps={{
              sx: {
                borderRadius: 16,
                background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
              }
            }}
          >
            <DialogTitle sx={{ 
              fontWeight: 700, 
              color: '#2c3e50',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <AccountBalanceIcon sx={{ color: '#667eea' }} />
                Detalles de la Cuenta por Cobrar
              </Box>
              <IconButton
                onClick={handleCloseDetailsDialog}
                sx={{ color: '#667eea' }}
              >
                <CloseIcon />
              </IconButton>
            </DialogTitle>
            <DialogContent>
              {selectedCuenta && (
                <Box sx={{ mt: 2 }}>
                  <Grid container spacing={3}>
                    {/* Información Principal */}
                    <Grid item xs={12}>
                      <StyledCard sx={{ p: 3, mb: 3 }}>
                        <Typography variant="h6" sx={{ fontWeight: 700, color: '#2c3e50', mb: 2 }}>
                          Información de la Cuenta
                        </Typography>
                        <Grid container spacing={2}>
                          <Grid item xs={12} md={6}>
                            <Typography variant="body2" sx={{ color: '#7f8c8d', fontWeight: 500 }}>
                              ID:
                            </Typography>
                            <Typography variant="body1" sx={{ fontWeight: 600, color: '#2c3e50' }}>
                              {selectedCuenta.id}
                            </Typography>
                          </Grid>
                          <Grid item xs={12} md={6}>
                            <Typography variant="body2" sx={{ color: '#7f8c8d', fontWeight: 500 }}>
                              Estado:
                            </Typography>
                            <StyledChip
                              label={selectedCuenta.estado || 'pendiente'}
                              status={selectedCuenta.estado || 'pendiente'}
                              size="small"
                            />
                          </Grid>
                          <Grid item xs={12}>
                            <Typography variant="body2" sx={{ color: '#7f8c8d', fontWeight: 500 }}>
                              Concepto:
                            </Typography>
                            <Typography variant="body1" sx={{ fontWeight: 600, color: '#2c3e50' }}>
                              {selectedCuenta.concepto}
                            </Typography>
                          </Grid>
                          <Grid item xs={12} md={6}>
                            <Typography variant="body2" sx={{ color: '#7f8c8d', fontWeight: 500 }}>
                              Monto Sin IVA:
                            </Typography>
                            <Typography variant="body1" sx={{ fontWeight: 600, color: '#27ae60' }}>
                              {formatCurrency(selectedCuenta.monto_sin_iva)}
                            </Typography>
                          </Grid>
                          <Grid item xs={12} md={6}>
                            <Typography variant="body2" sx={{ color: '#7f8c8d', fontWeight: 500 }}>
                              Monto Con IVA:
                            </Typography>
                            <Typography variant="body1" sx={{ fontWeight: 600, color: '#f39c12' }}>
                              {formatCurrency(selectedCuenta.monto_con_iva)}
                            </Typography>
                          </Grid>
                          <Grid item xs={12}>
                            <Typography variant="body2" sx={{ color: '#7f8c8d', fontWeight: 500 }}>
                              Fecha:
                            </Typography>
                            <Typography variant="body1" sx={{ fontWeight: 600, color: '#2c3e50' }}>
                              {formatDate(selectedCuenta.fecha)}
                            </Typography>
                          </Grid>
                        </Grid>
                      </StyledCard>
                    </Grid>

                    {/* Información del Proyecto */}
                    {selectedCuenta.proyecto_id && (
                      <Grid item xs={12}>
                        <StyledCard sx={{ p: 3, mb: 3 }}>
                          <Typography variant="h6" sx={{ fontWeight: 700, color: '#2c3e50', mb: 2 }}>
                            Información del Proyecto
                          </Typography>
                          <Grid container spacing={2}>
                            <Grid item xs={12} md={6}>
                              <Typography variant="body2" sx={{ color: '#7f8c8d', fontWeight: 500 }}>
                                Nombre del Proyecto:
                              </Typography>
                              <Typography variant="body1" sx={{ fontWeight: 600, color: '#2c3e50' }}>
                                {proyectos.find(p => p.id === selectedCuenta.proyecto_id)?.nombre || 'N/A'}
                              </Typography>
                            </Grid>
                            <Grid item xs={12} md={6}>
                              <Typography variant="body2" sx={{ color: '#7f8c8d', fontWeight: 500 }}>
                                Cliente:
                              </Typography>
                              <Typography variant="body1" sx={{ fontWeight: 600, color: '#2c3e50' }}>
                                {proyectos.find(p => p.id === selectedCuenta.proyecto_id)?.cliente || 'N/A'}
                              </Typography>
                            </Grid>
                          </Grid>
                        </StyledCard>
                      </Grid>
                    )}

                    {/* Complementos de Pago */}
                    <Grid item xs={12}>
                      <StyledCard sx={{ p: 3 }}>
                        <Typography variant="h6" sx={{ fontWeight: 700, color: '#2c3e50', mb: 2 }}>
                          Complementos de Pago
                        </Typography>
                        {complementosByCuenta[selectedCuenta.id] && complementosByCuenta[selectedCuenta.id].length > 0 ? (
                          <Table size="small">
                            <TableHead>
                              <TableRow>
                                <TableCell>Fecha</TableCell>
                                <TableCell>Concepto</TableCell>
                                <TableCell>Monto Sin IVA</TableCell>
                                <TableCell>Monto Con IVA</TableCell>
                                <TableCell align="center">Acciones</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {complementosByCuenta[selectedCuenta.id].map((comp) => (
                                <TableRow key={comp.id}>
                                  <TableCell>{formatDate(comp.fecha_pago)}</TableCell>
                                  <TableCell>{comp.concepto}</TableCell>
                                  <TableCell>{formatCurrency(comp.monto_sin_iva)}</TableCell>
                                  <TableCell>{formatCurrency(comp.monto_con_iva)}</TableCell>
                                  <TableCell align="center">
                                    <IconButton
                                      size="small"
                                      color="error"
                                      onClick={() => handleDeleteComplemento(comp.id, selectedCuenta.id)}
                                    >
                                      <DeleteIcon fontSize="small" />
                                    </IconButton>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        ) : (
                          <Typography variant="body2" color="textSecondary" sx={{ textAlign: 'center', py: 2 }}>
                            No hay complementos registrados
                          </Typography>
                        )}
                        
                        <Box sx={{ mt: 2, textAlign: 'center' }}>
                          <IconButton
                            onClick={() => {
                              setSelectedCuentaId(selectedCuenta.id);
                              setOpenComplementoDialog(true);
                              handleCloseDetailsDialog();
                            }}
                            sx={{
                              background: 'linear-gradient(135deg, #27ae60, #2ecc71)',
                              color: '#fff',
                              '&:hover': {
                                background: 'linear-gradient(135deg, #229954, #27ae60)',
                              }
                            }}
                          >
                            <PaymentIcon sx={{ mr: 1 }} />
                            Agregar Complemento
                          </IconButton>
                        </Box>
                      </StyledCard>
                    </Grid>
                  </Grid>
                </Box>
              )}
            </DialogContent>
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

export default CuentasCobrarForm;