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
  Tabs,
  Tab,
  Divider,
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
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import ScheduleIcon from '@mui/icons-material/Schedule';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import StoreIcon from '@mui/icons-material/Store';
import TimelineIcon from '@mui/icons-material/Timeline';
import RefreshIcon from '@mui/icons-material/Refresh';
import AssignmentIcon from '@mui/icons-material/Assignment';
import CloseIcon from '@mui/icons-material/Close';
import ReceiptIcon from '@mui/icons-material/Receipt';
import PaymentIcon from '@mui/icons-material/Payment';

// ========================================
// COMPONENTES ESTILIZADOS IDÉNTICOS A PROYECTOS
// ========================================

// Container con el mismo estilo que Proyectos
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

// Card con el mismo estilo que Proyectos
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

// Tabla con el mismo estilo que Proyectos
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

// Campo de búsqueda con el mismo estilo que Proyectos
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

// Select con el mismo estilo que Proyectos
const StyledSelect = styled(FormControl)(({ theme }) => ({
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

// Botones de acción con el mismo estilo que Proyectos
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

// Chip con el mismo estilo que Proyectos
const StyledChip = styled(Chip)(({ status }) => ({
  borderRadius: 12,
  fontWeight: 600,
  textTransform: 'uppercase',
  fontSize: '0.75rem',
  background: status === 'ingreso' ? 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' :
              status === 'egreso' ? 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)' :
              status === 'pendiente' ? 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)' :
              'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  color: '#fff',
  boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
}));

// Skeleton con el mismo estilo que Proyectos
const ContabilidadRowSkeleton = React.memo(() => (
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
      <Skeleton variant="text" width={80} height={20} />
    </TableCell>
    <TableCell>
      <Skeleton variant="rectangular" width={80} height={24} sx={{ borderRadius: 1 }} />
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

// Hooks personalizados idénticos a Proyectos
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

const useDataCache = () => {
  const [cache, setCache] = useState(new Map());
  const [cacheTime, setCacheTime] = useState(new Map());

  const getCachedData = useCallback((key) => {
    const data = cache.get(key);
    const time = cacheTime.get(key);
    if (data && time && Date.now() - time < 30000) {
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

const ContabilidadFormV2 = () => {
  // Estados optimizados como en Proyectos
  const [contabilidad, setContabilidad] = useState([]);
  const [filteredContabilidad, setFilteredContabilidad] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingRegistro, setEditingRegistro] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedRegistro, setSelectedRegistro] = useState(null);
  const [formData, setFormData] = useState({
    concepto: '',
    monto: '',
    tipo: 'ingreso',
    categoria: '',
    fecha: new Date().toISOString().split('T')[0],
    descripcion: '',
    estado: 'pendiente'
  });

  // Estado para archivos
  const [selectedFiles, setSelectedFiles] = useState({
    facturaPDF: null,
    facturaXML: null
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [tipoFilter, setTipoFilter] = useState('all');
  const [categoriaFilter, setCategoriaFilter] = useState('all');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [isPending, startTransition] = useTransition();

  // Hooks personalizados
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const { getCachedData, setCachedData } = useDataCache();

  // Estadísticas optimizadas como en Proyectos
  const stats = useMemo(() => {
    const ingresos = contabilidad.filter(r => r.tipo === 'ingreso').reduce((sum, r) => sum + parseFloat(r.monto || 0), 0);
    const egresos = contabilidad.filter(r => r.tipo === 'egreso').reduce((sum, r) => sum + parseFloat(r.monto || 0), 0);
    const balance = ingresos - egresos;
    
    return [
      { 
        label: 'Total Ingresos', 
        value: `$${ingresos.toLocaleString('es-MX', { minimumFractionDigits: 2 })}`, 
        icon: <TrendingUpIcon />, 
        color: '#27ae60' 
      },
      { 
        label: 'Total Egresos', 
        value: `$${egresos.toLocaleString('es-MX', { minimumFractionDigits: 2 })}`, 
        icon: <TrendingDownIcon />, 
        color: '#e74c3c' 
      },
      { 
        label: 'Balance Neto', 
        value: `$${balance.toLocaleString('es-MX', { minimumFractionDigits: 2 })}`, 
        icon: <AccountBalanceIcon />, 
        color: balance >= 0 ? '#2ecc71' : '#e74c3c' 
      },
      { 
        label: 'Total Registros', 
        value: contabilidad.length.toString(), 
        icon: <ReceiptIcon />, 
        color: '#3498db' 
      }
    ];
  }, [contabilidad]);

  // Funciones de API optimizadas como en Proyectos
  const fetchContabilidad = useCallback(async () => {
    try {
      setLoading(true);
      const cached = getCachedData('contabilidad');
      if (cached) {
        setContabilidad(cached);
        setFilteredContabilidad(cached);
        setLoading(false);
        return;
      }

      const response = await axios.get('/api/contabilidad');
      if (response.data && response.data.success) {
        setContabilidad(response.data.data);
        setFilteredContabilidad(response.data.data);
        setCachedData('contabilidad', response.data.data);
      } else {
        setContabilidad([]);
        setFilteredContabilidad([]);
      }
    } catch (error) {
      console.error('Error al obtener registros contables:', error);
      setContabilidad([]);
      setFilteredContabilidad([]);
    } finally {
      setLoading(false);
    }
  }, [getCachedData, setCachedData]);

  const createRegistro = useCallback(async (data) => {
    try {
      // Crear FormData para enviar archivos
      const formData = new FormData();
      
      // Agregar campos de texto
      Object.keys(data).forEach(key => {
        formData.append(key, data[key]);
      });
      
      // Agregar archivos si existen
      if (selectedFiles.facturaPDF) {
        formData.append('facturaPDF', selectedFiles.facturaPDF);
      }
      if (selectedFiles.facturaXML) {
        formData.append('facturaXML', selectedFiles.facturaXML);
      }

      const response = await axios.post('/api/contabilidad', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      if (response.data && response.data.success) {
        setSnackbar({
          open: true,
          message: 'Registro contable creado exitosamente',
          severity: 'success'
        });
        fetchContabilidad();
        // Limpiar archivos seleccionados
        setSelectedFiles({ facturaPDF: null, facturaXML: null });
        return true;
      }
    } catch (error) {
      console.error('Error al crear registro contable:', error);
      setSnackbar({
        open: true,
        message: 'Error al crear registro contable',
        severity: 'error'
      });
      return false;
    }
  }, [fetchContabilidad, selectedFiles]);

  const updateRegistro = useCallback(async (id, data) => {
    try {
      // Crear FormData para enviar archivos
      const formData = new FormData();
      
      // Agregar campos de texto
      Object.keys(data).forEach(key => {
        formData.append(key, data[key]);
      });
      
      // Agregar archivos si existen
      if (selectedFiles.facturaPDF) {
        formData.append('facturaPDF', selectedFiles.facturaPDF);
      }
      if (selectedFiles.facturaXML) {
        formData.append('facturaXML', selectedFiles.facturaXML);
      }

      const response = await axios.put(`/api/contabilidad/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      if (response.data && response.data.success) {
        setSnackbar({
          open: true,
          message: 'Registro contable actualizado exitosamente',
          severity: 'success'
        });
        fetchContabilidad();
        // Limpiar archivos seleccionados
        setSelectedFiles({ facturaPDF: null, facturaXML: null });
        return true;
      }
    } catch (error) {
      console.error('Error al actualizar registro contable:', error);
      setSnackbar({
        open: true,
        message: 'Error al actualizar registro contable',
        severity: 'error'
      });
      return false;
    }
  }, [fetchContabilidad, selectedFiles]);

  const deleteRegistro = useCallback(async (registro) => {
    if (window.confirm(`¿Estás seguro de eliminar el registro "${registro.concepto}"?`)) {
      try {
        const response = await axios.delete(`/api/contabilidad/${registro.id}`);
        if (response.data && response.data.success) {
          setSnackbar({
            open: true,
            message: 'Registro contable eliminado exitosamente',
            severity: 'success'
          });
          fetchContabilidad();
        }
      } catch (error) {
        console.error('Error al eliminar registro contable:', error);
        setSnackbar({
          open: true,
          message: 'Error al eliminar registro contable',
          severity: 'error'
        });
      }
    }
  }, [fetchContabilidad]);



  // Funciones para manejar archivos
  const deleteFile = useCallback(async (filename, field) => {
    if (!filename) return;
    
    if (window.confirm(`¿Estás seguro de eliminar el archivo "${filename}"?`)) {
      try {
        const response = await axios.delete(`/api/contabilidad/files/${filename}`);
        if (response.data && response.data.success) {
          setSnackbar({
            open: true,
            message: `Archivo ${filename} eliminado exitosamente`,
            severity: 'success'
          });
          // Actualizar la lista de registros
          fetchContabilidad();
        }
      } catch (error) {
        console.error('Error al eliminar archivo:', error);
        setSnackbar({
          open: true,
          message: `Error al eliminar archivo ${filename}`,
          severity: 'error'
        });
      }
    }
  }, [fetchContabilidad]);

  const handleFileChange = (field, file) => {
    if (!file) return;
    
    // Validar tamaño del archivo (máximo 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      setSnackbar({
        open: true,
        message: `El archivo es demasiado grande. Máximo 10MB permitido.`,
        severity: 'error'
      });
      return;
    }
    
    // Validar tipo de archivo
    if (field === 'facturaPDF' && file.type !== 'application/pdf') {
      setSnackbar({
        open: true,
        message: 'Solo se permiten archivos PDF para facturas.',
        severity: 'error'
      });
      return;
    }
    
    if (field === 'facturaXML') {
      const allowedTypes = [
        'text/xml',
        'application/xml',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // XLSX
        'text/csv',
        'application/vnd.ms-excel' // CSV alternativo
      ];
      
      if (!allowedTypes.includes(file.type)) {
        setSnackbar({
          open: true,
          message: 'Solo se permiten archivos XML, XLSX o CSV para facturas.',
          severity: 'error'
        });
        return;
      }
    }
    
    setSelectedFiles(prev => ({
      ...prev,
      [field]: file
    }));
    
    setSnackbar({
      open: true,
      message: `Archivo ${file.name} seleccionado correctamente.`,
      severity: 'success'
    });
  };

  const handleFileRemove = (field) => {
    const fileName = selectedFiles[field]?.name;
    setSelectedFiles(prev => ({
      ...prev,
      [field]: null
    }));
    
    if (fileName) {
      setSnackbar({
        open: true,
        message: `Archivo ${fileName} removido.`,
        severity: 'info'
      });
    }
  };

  // Función helper para construir URLs de archivos
  const getFileUrl = (filename, type = 'files') => {
    if (!filename) return null;
    
    // Detectar si estamos en desarrollo local o producción
    const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    const baseURL = isLocalhost ? 'http://localhost:5001' : 'https://sigma.runsolutions-services.com';
    
    const url = `${baseURL}/api/contabilidad/${type}/${filename}`;
    return url;
  };

  const getFilePreview = (filename, field) => {
    if (!filename) return null;
    
    const fileUrl = getFileUrl(filename, 'files');
    const ext = filename.split('.').pop()?.toLowerCase();
    
    if (['jpg', 'jpeg', 'png', 'gif'].includes(ext)) {
      return (
        <img 
          src={fileUrl} 
          alt="Vista previa" 
          style={{ maxWidth: '100px', maxHeight: '100px', objectFit: 'cover' }}
        />
      );
    } else if (ext === 'pdf') {
      return (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <ReceiptIcon color="primary" />
          <Typography variant="body2" sx={{ fontWeight: 600, color: '#e74c3c' }}>PDF</Typography>
        </Box>
      );
    } else if (['xlsx', 'xls'].includes(ext)) {
      return (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <AssignmentIcon color="primary" />
          <Typography variant="body2" sx={{ fontWeight: 600, color: '#27ae60' }}>EXCEL</Typography>
        </Box>
      );
    } else if (ext === 'xml') {
      return (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <AssignmentIcon color="primary" />
          <Typography variant="body2" sx={{ fontWeight: 600, color: '#f39c12' }}>XML</Typography>
        </Box>
      );
    } else if (ext === 'csv') {
      return (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <AssignmentIcon color="primary" />
          <Typography variant="body2" sx={{ fontWeight: 600, color: '#3498db' }}>CSV</Typography>
        </Box>
      );
    } else {
      return (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <AssignmentIcon color="primary" />
          <Typography variant="body2" sx={{ fontWeight: 600, color: '#7f8c8d' }}>{ext?.toUpperCase()}</Typography>
        </Box>
      );
    }
  };

  // Filtros y búsqueda como en Proyectos
  useEffect(() => {
    startTransition(() => {
      let filtered = contabilidad;

      if (searchTerm) {
        filtered = filtered.filter(registro =>
          registro.concepto.toLowerCase().includes(searchTerm.toLowerCase()) ||
          registro.descripcion?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          registro.categoria?.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      if (tipoFilter !== 'all') {
        filtered = filtered.filter(registro => registro.tipo === tipoFilter);
      }

      if (categoriaFilter !== 'all') {
        filtered = filtered.filter(registro => registro.categoria === categoriaFilter);
      }

      setFilteredContabilidad(filtered);
    });
  }, [contabilidad, debouncedSearchTerm, tipoFilter, categoriaFilter]);

  // Manejadores de eventos
  const handleCreateRegistro = () => {
    setEditingRegistro(null);
    setFormData({
      concepto: '',
      monto: '',
      tipo: 'ingreso',
      categoria: '',
      fecha: new Date().toISOString().split('T')[0],
      descripcion: '',
      estado: 'pendiente'
    });
    
    // Limpiar archivos seleccionados
    setSelectedFiles({
      facturaPDF: null,
      facturaXML: null
    });
    
    setShowForm(true);
  };

  const handleViewDetails = (registro) => {
    setSelectedRegistro(registro);
    setShowDetails(true);
  };

  const handleEditRegistro = (registro) => {
    setEditingRegistro(registro);
    setFormData({
      concepto: registro.concepto || '',
      monto: registro.monto || '',
      tipo: registro.tipo || 'ingreso',
      categoria: registro.categoria || '',
      fecha: registro.fecha ? new Date(registro.fecha).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      descripcion: registro.descripcion || '',
      estado: registro.estado || 'pendiente'
    });
    
    // Limpiar archivos seleccionados al editar
    setSelectedFiles({
      facturaPDF: null,
      facturaXML: null
    });
    
    setShowForm(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    
    if (editingRegistro) {
      const success = await updateRegistro(editingRegistro.id, formData);
      if (success) {
        setShowForm(false);
        setEditingRegistro(null);
      }
    } else {
      const success = await createRegistro(formData);
      if (success) {
        setShowForm(false);
      }
    }
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingRegistro(null);
    setFormData({
      concepto: '',
      monto: '',
      tipo: 'ingreso',
      categoria: '',
      fecha: new Date().toISOString().split('T')[0],
      descripcion: '',
      estado: 'pendiente'
    });
    
    // Limpiar archivos seleccionados
    setSelectedFiles({
      facturaPDF: null,
      facturaXML: null
    });
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Efectos
  useEffect(() => {
    fetchContabilidad();
  }, [fetchContabilidad]);

  return (
    <StyledContainer maxWidth="xl">
      {/* Header con estadísticas como en Proyectos */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography
            variant="h3"
            component="h1"
            sx={{
              fontWeight: 800,
              color: '#ffffff',
              mb: 2,
              textTransform: 'capitalize',
              textShadow: '0 2px 4px rgba(0,0,0,0.3)'
            }}
          >
            <AccountBalanceIcon sx={{ mr: 2, verticalAlign: 'middle' }} />
            Contabilidad
          </Typography>
          <Typography
            variant="h6"
            sx={{
              color: 'rgba(255,255,255,0.9)',
              fontWeight: 400,
              opacity: 0.9
            }}
          >
            Control y gestión de la contabilidad del sistema
          </Typography>
        </Box>
      </motion.div>

      {/* Estadísticas como en Proyectos */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {stats.map((stat, index) => (
            <Grid item xs={6} sm={3} key={index}>
              <StyledCard>
                <CardContent sx={{ textAlign: 'center', p: 2 }}>
                  <Box sx={{ color: stat.color, mb: 1 }}>
                    {stat.icon}
                  </Box>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: '#2c3e50', mb: 0.5 }}>
                    {stat.value}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#7f8c8d', fontWeight: 500 }}>
                    {stat.label}
                  </Typography>
                </CardContent>
              </StyledCard>
            </Grid>
          ))}
        </Grid>
      </motion.div>

      {/* Barra de acciones como en Proyectos */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <StyledCard sx={{ mb: 4 }}>
          <CardContent>
            <Grid container spacing={3} alignItems="center">
              <Grid item xs={12} sm={6} md={3}>
                <StyledSearchField
                  fullWidth
                  placeholder="Buscar registros..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{
                    startAdornment: <SearchIcon sx={{ color: '#7f8c8d', mr: 1 }} />
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={2}>
                <StyledSelect fullWidth>
                  <InputLabel>Filtrar por Tipo</InputLabel>
                  <Select
                    value={tipoFilter}
                    onChange={(e) => setTipoFilter(e.target.value)}
                    label="Filtrar por Tipo"
                  >
                    <MenuItem value="all">Todos</MenuItem>
                    <MenuItem value="ingreso">Ingresos</MenuItem>
                    <MenuItem value="egreso">Egresos</MenuItem>
                  </Select>
                </StyledSelect>
              </Grid>
              <Grid item xs={12} sm={6} md={2}>
                <StyledSelect fullWidth>
                  <InputLabel>Filtrar por Categoría</InputLabel>
                  <Select
                    value={categoriaFilter}
                    onChange={(e) => setCategoriaFilter(e.target.value)}
                    label="Filtrar por Categoría"
                  >
                    <MenuItem value="all">Todas</MenuItem>
                    <MenuItem value="ventas">Ventas</MenuItem>
                    <MenuItem value="compras">Compras</MenuItem>
                    <MenuItem value="gastos">Gastos</MenuItem>
                    <MenuItem value="servicios">Servicios</MenuItem>
                  </Select>
                </StyledSelect>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={handleCreateRegistro}
                  sx={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    borderRadius: 12,
                    px: 3,
                    py: 1.5,
                    fontWeight: 600,
                    boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: '0 6px 20px rgba(102, 126, 234, 0.4)'
                    }
                  }}
                >
                  Nuevo Registro
                </Button>
              </Grid>
              <Grid item xs={12} sm={6} md={2}>
                <Button
                  variant="outlined"
                  startIcon={<RefreshIcon />}
                  onClick={fetchContabilidad}
                  sx={{
                    borderColor: 'rgba(255,255,255,0.3)',
                    color: '#fff',
                    borderRadius: 12,
                    px: 3,
                    py: 1.5,
                    fontWeight: 600,
                    '&:hover': {
                      borderColor: '#fff',
                      background: 'rgba(255,255,255,0.1)'
                    }
                  }}
                >
                  Actualizar
                </Button>
              </Grid>

            </Grid>
          </CardContent>
        </StyledCard>
      </motion.div>

      {/* Tabla de datos como en Proyectos */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
      >
        <StyledCard>
          <StyledTableContainer>
            <StyledTable>
              <TableHead>
                <TableRow>
                  <TableCell>Concepto</TableCell>
                  <TableCell>Monto</TableCell>
                  <TableCell>Tipo</TableCell>
                  <TableCell>Categoría</TableCell>
                  <TableCell>Fecha</TableCell>
                  <TableCell>Estado</TableCell>
                  <TableCell>Archivos</TableCell>
                  <TableCell align="center">Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  Array.from({ length: 8 }).map((_, index) => (
                    <ContabilidadRowSkeleton key={index} />
                  ))
                ) : filteredContabilidad.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} align="center">
                      <Box sx={{ p: 4, textAlign: 'center' }}>
                        <AccountBalanceIcon sx={{ fontSize: 60, color: '#bdc3c7', mb: 2 }} />
                        <Typography variant="h6" sx={{ color: '#7f8c8d', mb: 1 }}>
                          No hay registros contables
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#95a5a6' }}>
                          Comienza agregando el primer registro contable
                        </Typography>
                      </Box>
                    </TableCell>
                  </TableRow>
                ) : (
                  <AnimatePresence>
                    {filteredContabilidad.map((registro, index) => (
                      <motion.tr
                        key={registro.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        component={TableRow}
                      >
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Avatar
                              sx={{
                                width: 48,
                                height: 48,
                                background: registro.tipo === 'ingreso' ? 
                                  'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' :
                                  'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
                                fontWeight: 700,
                                fontSize: '1.2rem'
                              }}
                            >
                              {registro.tipo === 'ingreso' ? 'I' : 'E'}
                            </Avatar>
                            <Box>
                              <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#2c3e50' }}>
                                {registro.concepto}
                              </Typography>
                              <Typography variant="body2" sx={{ color: '#7f8c8d' }}>
                                ID: {registro.id}
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Typography variant="h6" sx={{ 
                            fontWeight: 700,
                            color: registro.tipo === 'ingreso' ? '#27ae60' : '#e74c3c'
                          }}>
                            ${parseFloat(registro.monto || 0).toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <StyledChip
                            label={registro.tipo === 'ingreso' ? 'Ingreso' : 'Egreso'}
                            status={registro.tipo}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" sx={{ 
                            color: '#7f8c8d',
                            fontWeight: 500,
                            textTransform: 'capitalize'
                          }}>
                            {registro.categoria || 'Sin categoría'}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" sx={{ color: '#7f8c8d' }}>
                            {registro.fecha ? new Date(registro.fecha).toLocaleDateString('es-MX') : 'N/A'}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <StyledChip
                            label={registro.estado === 'pendiente' ? 'Pendiente' : 'Completado'}
                            status={registro.estado}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, alignItems: 'center' }}>
                            {/* Factura PDF */}
                            {registro.facturaPDF && (
                              <Box sx={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                gap: 1,
                                p: 1,
                                borderRadius: 2,
                                background: 'rgba(231, 76, 60, 0.1)',
                                border: '1px solid rgba(231, 76, 60, 0.3)'
                              }}>
                                <Tooltip title="Ver PDF">
                                  <IconButton
                                    size="small"
                                    onClick={() => window.open(getFileUrl(registro.facturaPDF, 'files'), '_blank')}
                                    sx={{ color: '#e74c3c' }}
                                  >
                                    <ReceiptIcon fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                                <Tooltip title="Descargar PDF">
                                  <IconButton
                                    size="small"
                                    onClick={() => window.open(getFileUrl(registro.facturaPDF, 'download'), '_blank')}
                                    sx={{ color: '#3498db' }}
                                  >
                                    <DownloadIcon fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                                <Tooltip title={registro.facturaPDF}>
                                  <Typography variant="caption" sx={{ color: '#e74c3c', fontWeight: 600, cursor: 'pointer' }}>
                                    PDF
                                  </Typography>
                                </Tooltip>
                                <Tooltip title="Eliminar PDF">
                                  <IconButton
                                    size="small"
                                    onClick={() => deleteFile(registro.facturaPDF, 'facturaPDF')}
                                    sx={{ color: '#e74c3c' }}
                                  >
                                    <DeleteIcon fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                              </Box>
                            )}
                            
                            {/* Factura XML/Excel */}
                            {registro.facturaXML && (
                              <Box sx={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                gap: 1,
                                p: 1,
                                borderRadius: 2,
                                background: 'rgba(39, 174, 96, 0.1)',
                                border: '1px solid rgba(39, 174, 96, 0.3)'
                              }}>
                                <Tooltip title="Ver archivo">
                                  <IconButton
                                    size="small"
                                    onClick={() => window.open(getFileUrl(registro.facturaXML, 'files'), '_blank')}
                                    sx={{ color: '#27ae60' }}
                                  >
                                    <AssignmentIcon fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                                <Tooltip title="Descargar archivo">
                                  <IconButton
                                    size="small"
                                    onClick={() => window.open(getFileUrl(registro.facturaXML, 'download'), '_blank')}
                                    sx={{ color: '#3498db' }}
                                  >
                                    <DownloadIcon fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                                <Tooltip title={registro.facturaXML}>
                                  <Typography variant="caption" sx={{ color: '#27ae60', fontWeight: 600, cursor: 'pointer' }}>
                                    {registro.facturaXML.split('.').pop()?.toUpperCase()}
                                  </Typography>
                                </Tooltip>
                                <Tooltip title="Eliminar archivo">
                                  <IconButton
                                    size="small"
                                    onClick={() => deleteFile(registro.facturaXML, 'facturaXML')}
                                    sx={{ color: '#27ae60' }}
                                  >
                                    <DeleteIcon fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                              </Box>
                            )}
                            
                            {!registro.facturaPDF && !registro.facturaXML && (
                              <Typography variant="caption" sx={{ color: '#bdc3c7', fontStyle: 'italic' }}>
                                Sin archivos
                              </Typography>
                            )}
                          </Box>
                        </TableCell>
                        <TableCell align="center">
                          <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                            <Tooltip title="Ver detalles">
                              <ActionButton
                                color="#45b7d1"
                                onClick={() => handleViewDetails(registro)}
                              >
                                <VisibilityIcon fontSize="small" />
                              </ActionButton>
                            </Tooltip>
                            <Tooltip title="Editar registro">
                              <ActionButton
                                color="#f39c12"
                                onClick={() => handleEditRegistro(registro)}
                              >
                                <EditIcon fontSize="small" />
                              </ActionButton>
                            </Tooltip>
                            <Tooltip title="Eliminar registro">
                              <ActionButton
                                color="#e74c3c"
                                onClick={() => deleteRegistro(registro)}
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
      </motion.div>

      {/* Formulario modal como en Proyectos */}
      <Dialog
        open={showForm}
        onClose={handleFormCancel}
        maxWidth="md"
        fullWidth
        TransitionComponent={Zoom}
        PaperProps={{
          sx: {
            borderRadius: 16,
            overflow: 'hidden'
          }
        }}
      >
        <DialogTitle
          sx={{
            p: 3,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: '#fff',
            fontWeight: 700,
            position: 'relative'
          }}
        >
          {editingRegistro ? '✏️ Editar Registro Contable' : '➕ Nuevo Registro Contable'}
          <IconButton
            onClick={handleFormCancel}
            sx={{
              position: 'absolute',
              right: 16,
              top: 16,
              color: '#fff',
              '&:hover': { 
                color: '#ffeb3b',
                transform: 'rotate(90deg)',
                transition: 'transform 0.3s ease'
              }
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ p: 0 }}>
          <Box component="form" onSubmit={handleFormSubmit} sx={{ p: 3 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="concepto"
                  label="Concepto"
                  value={formData.concepto}
                  onChange={(e) => setFormData({ ...formData, concepto: e.target.value })}
                  fullWidth
                  required
                  variant="outlined"
                  sx={{
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
                  variant="outlined"
                  InputProps={{
                    startAdornment: <Typography sx={{ color: '#7f8c8d', mr: 1 }}>$</Typography>
                  }}
                  sx={{
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
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <StyledSelect fullWidth required>
                  <InputLabel>Tipo de Movimiento</InputLabel>
                  <Select
                    name="tipo"
                    value={formData.tipo}
                    onChange={(e) => setFormData({ ...formData, tipo: e.target.value })}
                    label="Tipo de Movimiento"
                  >
                    <MenuItem value="ingreso">Ingreso</MenuItem>
                    <MenuItem value="egreso">Egreso</MenuItem>
                  </Select>
                </StyledSelect>
              </Grid>
              <Grid item xs={12} sm={6}>
                <StyledSelect fullWidth required>
                  <InputLabel>Categoría</InputLabel>
                  <Select
                    name="categoria"
                    value={formData.categoria}
                    onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
                    label="Categoría"
                  >
                    <MenuItem value="ventas">Ventas</MenuItem>
                    <MenuItem value="compras">Compras</MenuItem>
                    <MenuItem value="gastos">Gastos</MenuItem>
                    <MenuItem value="servicios">Servicios</MenuItem>
                    <MenuItem value="otros">Otros</MenuItem>
                  </Select>
                </StyledSelect>
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
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                  sx={{
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
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <StyledSelect fullWidth required>
                  <InputLabel>Estado</InputLabel>
                  <Select
                    name="estado"
                    value={formData.estado}
                    onChange={(e) => setFormData({ ...formData, estado: e.target.value })}
                    label="Estado"
                  >
                    <MenuItem value="pendiente">Pendiente</MenuItem>
                    <MenuItem value="completado">Completado</MenuItem>
                  </Select>
                </StyledSelect>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  name="descripcion"
                  label="Descripción"
                  value={formData.descripcion}
                  onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                  fullWidth
                  multiline
                  rows={3}
                  variant="outlined"
                  sx={{
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
                  }}
                />
              </Grid>

              {/* Campos de archivos */}
              <Grid item xs={12} sm={6}>
                <Box>
                  <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600, color: '#2c3e50' }}>
                    Factura PDF
                    <Typography component="span" variant="caption" sx={{ ml: 1, color: '#7f8c8d' }}>
                      (Máx. 10MB)
                    </Typography>
                  </Typography>
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={(e) => handleFileChange('facturaPDF', e.target.files[0])}
                    style={{ display: 'none' }}
                    id="facturaPDF-input"
                  />
                  <label htmlFor="facturaPDF-input">
                    <Button
                      variant="outlined"
                      component="span"
                      startIcon={<ReceiptIcon />}
                      sx={{
                        borderRadius: 12,
                        px: 3,
                        py: 1.5,
                        fontWeight: 600,
                        borderColor: '#667eea',
                        color: '#667eea',
                        '&:hover': {
                          borderColor: '#5a6fd8',
                          background: 'rgba(102, 126, 234, 0.1)'
                        }
                      }}
                    >
                      Seleccionar PDF
                    </Button>
                  </label>
                  {selectedFiles.facturaPDF && (
                    <Box sx={{ 
                      mt: 1, 
                      p: 1, 
                      borderRadius: 2,
                      background: 'rgba(231, 76, 60, 0.1)',
                      border: '1px solid rgba(231, 76, 60, 0.3)',
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: 1 
                    }}>
                      <Typography variant="body2" color="success.main" sx={{ fontWeight: 600 }}>
                        ✓ {selectedFiles.facturaPDF.name}
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#7f8c8d' }}>
                        ({(selectedFiles.facturaPDF.size / 1024 / 1024).toFixed(2)} MB)
                      </Typography>
                      <IconButton
                        size="small"
                        onClick={() => handleFileRemove('facturaPDF')}
                        sx={{ color: '#e74c3c' }}
                      >
                        <CloseIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  )}
                  <Typography variant="caption" sx={{ color: '#7f8c8d', fontStyle: 'italic', mt: 1, display: 'block' }}>
                    Tipos permitidos: PDF
                  </Typography>
                </Box>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Box>
                  <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600, color: '#2c3e50' }}>
                    Factura XML/Excel/CSV
                    <Typography component="span" variant="caption" sx={{ ml: 1, color: '#7f8c8d' }}>
                      (Máx. 10MB)
                    </Typography>
                  </Typography>
                  <input
                    type="file"
                    accept=".xml,.xlsx,.csv"
                    onChange={(e) => handleFileChange('facturaXML', e.target.files[0])}
                    style={{ display: 'none' }}
                    id="facturaXML-input"
                  />
                  <label htmlFor="facturaXML-input">
                    <Button
                      variant="outlined"
                      component="span"
                      startIcon={<AssignmentIcon />}
                      sx={{
                        borderRadius: 12,
                        px: 3,
                        py: 1.5,
                        fontWeight: 600,
                        borderColor: '#667eea',
                        color: '#667eea',
                        '&:hover': {
                          borderColor: '#5a6fd8',
                          background: 'rgba(102, 126, 234, 0.1)'
                        }
                      }}
                    >
                      Seleccionar Archivo
                    </Button>
                  </label>
                  {selectedFiles.facturaXML && (
                    <Box sx={{ 
                      mt: 1, 
                      p: 1, 
                      borderRadius: 2,
                      background: 'rgba(39, 174, 96, 0.1)',
                      border: '1px solid rgba(39, 174, 96, 0.3)',
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: 1 
                    }}>
                      <Typography variant="body2" color="success.main" sx={{ fontWeight: 600 }}>
                        ✓ {selectedFiles.facturaXML.name}
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#7f8c8d' }}>
                        ({(selectedFiles.facturaXML.size / 1024 / 1024).toFixed(2)} MB)
                      </Typography>
                      <IconButton
                        size="small"
                        onClick={() => handleFileRemove('facturaXML')}
                        sx={{ color: '#e74c3c' }}
                      >
                        <CloseIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  )}
                  <Typography variant="caption" sx={{ color: '#7f8c8d', fontStyle: 'italic', mt: 1, display: 'block' }}>
                    Tipos permitidos: XML, XLSX, CSV
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3, gap: 2 }}>
          <Button
            onClick={handleFormCancel}
            variant="outlined"
            sx={{
              borderRadius: 12,
              px: 3,
              py: 1.5,
              fontWeight: 600
            }}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="contained"
            onClick={handleFormSubmit}
            sx={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              borderRadius: 12,
              px: 3,
              py: 1.5,
              fontWeight: 600,
              boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 6px 20px rgba(102, 126, 234, 0.4)'
              }
            }}
          >
            {editingRegistro ? 'Actualizar' : 'Crear'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal de detalles del registro */}
      <Dialog
        open={showDetails}
        onClose={() => setShowDetails(false)}
        maxWidth="md"
        fullWidth
        TransitionComponent={Zoom}
        PaperProps={{
          sx: {
            borderRadius: 16,
            overflow: 'hidden'
          }
        }}
      >
        <DialogTitle
          sx={{
            p: 3,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: '#fff',
            fontWeight: 700,
            position: 'relative'
          }}
        >
          👁️ Detalles del Registro Contable
          <IconButton
            onClick={() => setShowDetails(false)}
            sx={{
              position: 'absolute',
              right: 16,
              top: 16,
              color: '#fff',
              '&:hover': { 
                color: '#ffeb3b',
                transform: 'rotate(90deg)',
                transition: 'transform 0.3s ease'
              }
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          {selectedRegistro && (
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" sx={{ color: '#7f8c8d', mb: 1 }}>
                  Concepto
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#2c3e50' }}>
                  {selectedRegistro.concepto}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" sx={{ color: '#7f8c8d', mb: 1 }}>
                  Monto
                </Typography>
                <Typography variant="h6" sx={{ 
                  fontWeight: 700,
                  color: selectedRegistro.tipo === 'ingreso' ? '#27ae60' : '#e74c3c'
                }}>
                  ${parseFloat(selectedRegistro.monto || 0).toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" sx={{ color: '#7f8c8d', mb: 1 }}>
                  Tipo
                </Typography>
                <StyledChip
                  label={selectedRegistro.tipo === 'ingreso' ? 'Ingreso' : 'Egreso'}
                  status={selectedRegistro.tipo}
                  size="medium"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" sx={{ color: '#7f8c8d', mb: 1 }}>
                  Categoría
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 500, color: '#2c3e50' }}>
                  {selectedRegistro.categoria || 'Sin categoría'}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" sx={{ color: '#7f8c8d', mb: 1 }}>
                  Fecha
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 500, color: '#2c3e50' }}>
                  {selectedRegistro.fecha ? new Date(selectedRegistro.fecha).toLocaleDateString('es-MX') : 'N/A'}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" sx={{ color: '#7f8c8d', mb: 1 }}>
                  Estado
                </Typography>
                <StyledChip
                  label={selectedRegistro.estado === 'pendiente' ? 'Pendiente' : 'Completado'}
                  status={selectedRegistro.estado}
                  size="medium"
                />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle2" sx={{ color: '#7f8c8d', mb: 1 }}>
                  Descripción
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 500, color: '#2c3e50' }}>
                  {selectedRegistro.descripcion || 'Sin descripción'}
                </Typography>
              </Grid>
              
              {/* Sección de archivos */}
              <Grid item xs={12}>
                <Typography variant="h6" sx={{ color: '#2c3e50', mb: 2, fontWeight: 600 }}>
                  📎 Archivos Adjuntos
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {selectedRegistro.facturaPDF && (
                    <Box sx={{ 
                      p: 2, 
                      borderRadius: 2,
                      background: 'rgba(231, 76, 60, 0.1)',
                      border: '1px solid rgba(231, 76, 60, 0.3)'
                    }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                        <ReceiptIcon color="error" />
                        <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#e74c3c' }}>
                          Factura PDF
                        </Typography>
                      </Box>
                      <Typography variant="body2" sx={{ color: '#7f8c8d', mb: 1 }}>
                        {selectedRegistro.facturaPDF}
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button
                          size="small"
                          variant="outlined"
                          onClick={() => window.open(getFileUrl(selectedRegistro.facturaPDF, 'files'), '_blank')}
                          startIcon={<VisibilityIcon />}
                        >
                          Ver PDF
                        </Button>
                        <Button
                          size="small"
                          variant="outlined"
                          onClick={() => window.open(getFileUrl(selectedRegistro.facturaPDF, 'download'), '_blank')}
                          startIcon={<DownloadIcon />}
                        >
                          Descargar
                        </Button>
                      </Box>
                    </Box>
                  )}
                  
                  {selectedRegistro.facturaXML && (
                    <Box sx={{ 
                      p: 2, 
                      borderRadius: 2,
                      background: 'rgba(39, 174, 96, 0.1)',
                      border: '1px solid rgba(39, 174, 96, 0.3)'
                    }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                        <AssignmentIcon color="success" />
                        <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#27ae60' }}>
                          Factura XML/Excel
                        </Typography>
                      </Box>
                      <Typography variant="body2" sx={{ color: '#7f8c8d', mb: 1 }}>
                        {selectedRegistro.facturaXML}
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button
                          size="small"
                          variant="outlined"
                          onClick={() => window.open(getFileUrl(selectedRegistro.facturaXML, 'files'), '_blank')}
                          startIcon={<VisibilityIcon />}
                        >
                          Ver archivo
                        </Button>
                        <Button
                          size="small"
                          variant="outlined"
                          onClick={() => window.open(getFileUrl(selectedRegistro.facturaXML, 'download'), '_blank')}
                          startIcon={<DownloadIcon />}
                        >
                          Descargar
                        </Button>
                      </Box>
                    </Box>
                  )}
                  
                  {!selectedRegistro.facturaPDF && !selectedRegistro.facturaXML && (
                    <Typography variant="body2" sx={{ color: '#bdc3c7', fontStyle: 'italic', textAlign: 'center', py: 2 }}>
                      No hay archivos adjuntos
                    </Typography>
                  )}
                </Box>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3, gap: 2 }}>
          <Button
            onClick={() => setShowDetails(false)}
            variant="outlined"
            sx={{
              borderRadius: 12,
              px: 3,
              py: 1.5,
              fontWeight: 600
            }}
          >
            Cerrar
          </Button>
          <Button
            variant="contained"
            onClick={() => {
              setShowDetails(false);
              handleEditRegistro(selectedRegistro);
            }}
            sx={{
              background: 'linear-gradient(135deg, #f39c12 0%, #e67e22 100%)',
              borderRadius: 12,
              px: 3,
              py: 1.5,
              fontWeight: 600,
              boxShadow: '0 4px 15px rgba(243, 156, 18, 0.3)',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 6px 20px rgba(243, 156, 18, 0.4)'
              }
            }}
          >
            ✏️ Editar Registro
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar de notificaciones */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbar.severity}
          variant="filled"
          sx={{
            borderRadius: 12,
            fontWeight: 600,
            boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </StyledContainer>
  );
};

export default ContabilidadFormV2;
