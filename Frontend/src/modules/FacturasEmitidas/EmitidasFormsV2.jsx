import React, { useState, useEffect, useCallback, useMemo, useTransition } from 'react';
import axios from 'axios';
import {
  Container, Box, Typography, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Grid, Snackbar, Alert, Chip, Avatar, IconButton, Tooltip,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Skeleton,
  Select, MenuItem, FormControl, InputLabel, Card, CardContent, Zoom, Button,
  InputAdornment, Switch, FormControlLabel
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { motion, AnimatePresence } from 'framer-motion';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import ReceiptIcon from '@mui/icons-material/Receipt';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import ScheduleIcon from '@mui/icons-material/Schedule';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import BusinessIcon from '@mui/icons-material/Business';
import TimelineIcon from '@mui/icons-material/Timeline';
import RefreshIcon from '@mui/icons-material/Refresh';
import CloseIcon from '@mui/icons-material/Close';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PendingIcon from '@mui/icons-material/Pending';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import TableChartIcon from '@mui/icons-material/TableChart';
import DownloadIcon from '@mui/icons-material/Download';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import AssignmentIcon from '@mui/icons-material/Assignment';

// ========================================
// COMPONENTES ESTILIZADOS IDÉNTICOS A PROYECTOS
// ========================================

// Animación CSS para el ícono de refresh
const spinAnimation = `
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`;

// Botón de acción estilizado
const ActionButton = styled(IconButton)(({ color = '#667eea' }) => ({
  width: 36,
  height: 36,
  background: color,
  color: '#fff',
  transition: 'all 0.3s ease',
  '&:hover': {
    background: color,
    transform: 'translateY(-2px)',
    boxShadow: `0 4px 12px ${color}40`
  }
}));

// Chip estilizado para estados
const StyledChip = styled(Chip)(({ status }) => ({
  background: status === 'activa' || status === true 
    ? 'linear-gradient(135deg, #27ae60 0%, #2ecc71 100%)'
    : 'linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)',
  color: '#fff',
  fontWeight: 600,
  borderRadius: 12,
  '& .MuiChip-label': {
    fontSize: '0.75rem',
    padding: '4px 8px'
  }
}));

// Skeleton para filas de facturas
const FacturaRowSkeleton = () => (
  <TableRow>
    <TableCell>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Skeleton variant="circular" width={48} height={48} />
        <Box>
          <Skeleton variant="text" width={120} height={24} />
          <Skeleton variant="text" width={80} height={16} />
        </Box>
      </Box>
    </TableCell>
    <TableCell>
      <Skeleton variant="text" width={150} height={20} />
    </TableCell>
    <TableCell>
      <Skeleton variant="text" width={100} height={24} />
    </TableCell>
    <TableCell>
      <Skeleton variant="text" width={100} height={20} />
    </TableCell>
    <TableCell>
      <Skeleton variant="rectangular" width={80} height={24} sx={{ borderRadius: 12 }} />
    </TableCell>
    <TableCell align="center">
      <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
        <Skeleton variant="circular" width={36} height={36} />
        <Skeleton variant="circular" width={36} height={36} />
        <Skeleton variant="circular" width={36} height={36} />
      </Box>
    </TableCell>
  </TableRow>
);

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
    // Cache más largo para mejor rendimiento
    if (data && time && Date.now() - time < 300000) { // 5 minutos
      return data;
    }
    return null;
  }, [cache, cacheTime]);

  const setCachedData = useCallback((key, data) => {
    setCache(prev => new Map(prev).set(key, data));
    setCacheTime(prev => new Map(prev).set(key, Date.now()));
  }, []);

  const updateCachedData = useCallback((key, updater) => {
    setCache(prev => {
      const newCache = new Map(prev);
      const currentData = newCache.get(key) || [];
      newCache.set(key, updater(currentData));
      return newCache;
    });
  }, []);

  return { getCachedData, setCachedData, updateCachedData };
};

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











const EmitidasFormsV2 = () => {
  // Agregar estilos CSS para animaciones
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = spinAnimation;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);



  const [facturas, setFacturas] = useState([]);
  const [filteredFacturas, setFilteredFacturas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingFactura, setEditingFactura] = useState(null);
  const [formData, setFormData] = useState({
    rfcReceptor: '',
    razonSocial: '',
    subtotal: '',
    iva: '',
    total: '',
    fechaEmision: new Date().toISOString().split('T')[0],
    claveSat: '',
    descripcion: '',
    facturaAdmon: false,
    pue: false,
    ppd: false,
    facturasPDF: [],
    facturasXML: [],
    comprobantesPago: [],
    complementosPDF: [],
    complementosXML: []
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [isPending, startTransition] = useTransition();
  const [optimisticUpdates, setOptimisticUpdates] = useState(new Set());
  const [selectedFiles, setSelectedFiles] = useState({
    facturasPDF: [],
    facturasXML: [],
    comprobantesPago: [],
    complementosPDF: [],
    complementosXML: []
  });

  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const { getCachedData, setCachedData, updateCachedData } = useDataCache();

  const stats = useMemo(() => [
    { 
      label: 'Total Facturas', 
      value: facturas.length.toString(), 
      icon: <ReceiptIcon />, 
      color: '#3498db' 
    },
    { 
      label: 'Total Emitido', 
      value: `$${facturas.reduce((sum, f) => sum + parseFloat(f.total || 0), 0).toLocaleString('es-MX', { minimumFractionDigits: 2 })}`, 
      icon: <AttachMoneyIcon />, 
      color: '#27ae60' 
    },
    { 
      label: 'Promedio por Factura', 
      value: facturas.length > 0 ? `$${(facturas.reduce((sum, f) => sum + parseFloat(f.total || 0), 0) / facturas.length).toLocaleString('es-MX', { minimumFractionDigits: 2 })}` : '$0.00', 
      icon: <TrendingUpIcon />, 
      color: '#f39c12' 
    },
    { 
      label: 'IVA Total', 
      value: `$${facturas.reduce((sum, f) => sum + parseFloat(f.iva || 0), 0).toLocaleString('es-MX', { minimumFractionDigits: 2 })}`, 
      icon: <BusinessIcon />, 
      color: '#e74c3c' 
    }
  ], [facturas]);

  const fetchFacturas = useCallback(async () => {
    try {
      setLoading(true);
      const cached = getCachedData('facturas');
      if (cached) {
        setFacturas(cached);
        setFilteredFacturas(cached);
        setLoading(false);
        return;
      }
      const response = await axios.get('/api/emitidas');
      if (response.data?.success) {
        setFacturas(response.data.data);
        setFilteredFacturas(response.data.data);
        setCachedData('facturas', response.data.data);
      } else {
        setFacturas([]);
        setFilteredFacturas([]);
      }
    } catch (error) {
      console.error('Error al obtener facturas:', error);
      setFacturas([]);
      setFilteredFacturas([]);
    } finally {
      setLoading(false);
    }
  }, [getCachedData, setCachedData]);

  const createFactura = useCallback(async (data) => {
    try {
      // Preparar FormData para archivos
      const formData = new FormData();
      
      // Agregar campos de texto
      Object.keys(data).forEach(key => {
        if (key !== 'facturasPDF' && key !== 'facturasXML' && key !== 'comprobantesPago' && key !== 'complementosPDF' && key !== 'complementosXML') {
          formData.append(key, data[key]);
        }
      });
      
      // Agregar archivos
      if (data.facturasPDF && data.facturasPDF.length > 0) {
        data.facturasPDF.forEach(file => {
          formData.append('facturasPDF', file);
        });
      }
      if (data.facturasXML && data.facturasXML.length > 0) {
        data.facturasXML.forEach(file => {
          formData.append('facturasXML', file);
        });
      }
      if (data.comprobantesPago && data.comprobantesPago.length > 0) {
        data.comprobantesPago.forEach(file => {
          formData.append('comprobantesPago', file);
        });
      }
      if (data.complementosPDF && data.complementosPDF.length > 0) {
        data.complementosPDF.forEach(file => {
          formData.append('complementosPDF', file);
        });
      }
      if (data.complementosXML && data.complementosXML.length > 0) {
        data.complementosXML.forEach(file => {
          formData.append('complementosXML', file);
        });
      }

      // Actualización optimista - agregar inmediatamente a la UI
      const tempId = Date.now();
      const newFactura = {
        id: tempId,
        ...data,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      // Actualizar estado inmediatamente
      setFacturas(prev => [newFactura, ...prev]);
      setFilteredFacturas(prev => [newFactura, ...prev]);
      
      // Actualizar cache inmediatamente
      updateCachedData('facturas', prev => [newFactura, ...prev]);
      
      // Marcar como actualización optimista
      setOptimisticUpdates(prev => new Set(prev).add(tempId));

      // Llamar a la API con FormData
      const response = await axios.post('/api/emitidas', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      if (response.data?.success) {
        // Reemplazar con datos reales del servidor
        const realFactura = response.data.data;
        setFacturas(prev => prev.map(fact => 
          fact.id === tempId ? realFactura : fact
        ));
        setFilteredFacturas(prev => prev.map(fact => 
          fact.id === tempId ? realFactura : fact
        ));
        updateCachedData('facturas', prev => prev.map(fact => 
          fact.id === tempId ? realFactura : fact
        ));
        
        // Remover indicador de actualización optimista
        setOptimisticUpdates(prev => {
          const newSet = new Set(prev);
          newSet.delete(tempId);
          return newSet;
        });

        setSnackbar({ open: true, message: 'Factura creada exitosamente', severity: 'success' });
        return true;
      } else {
        // Si la API no retorna success, también revertir
        throw new Error('API no retornó success');
      }
    } catch (error) {
      console.error('Error al crear factura:', error);
      
      // Revertir cambios en caso de error
      setFacturas(prev => prev.filter(fact => fact.id !== tempId));
      setFilteredFacturas(prev => prev.filter(fact => fact.id !== tempId));
      updateCachedData('facturas', prev => prev.filter(fact => fact.id !== tempId));
      
      // Remover indicador de actualización optimista
      setOptimisticUpdates(prev => {
        const newSet = new Set(prev);
        newSet.delete(tempId);
        return newSet;
      });

      setSnackbar({ open: true, message: 'Error al crear factura', severity: 'error' });
      return false;
    }
  }, [updateCachedData]);

  const updateFactura = useCallback(async (id, data) => {
    try {
      // Actualización optimista - actualizar inmediatamente en la UI
      const updatedFactura = {
        ...data,
        id: parseInt(id),
        updated_at: new Date().toISOString()
      };

      // Actualizar estado inmediatamente
      setFacturas(prev => prev.map(fact => 
        fact.id === parseInt(id) ? { ...fact, ...updatedFactura } : fact
      ));
      setFilteredFacturas(prev => prev.map(fact => 
        fact.id === parseInt(id) ? { ...fact, ...updatedFactura } : fact
      ));
      
      // Actualizar cache inmediatamente
      updateCachedData('facturas', prev => prev.map(fact => 
        fact.id === parseInt(id) ? { ...fact, ...updatedFactura } : fact
      ));
      
      // Marcar como actualización optimista
      setOptimisticUpdates(prev => new Set(prev).add(parseInt(id)));

      // Preparar FormData para archivos
      const formData = new FormData();
      
      // Agregar campos de texto
      Object.keys(data).forEach(key => {
        if (key !== 'facturasPDF' && key !== 'facturasXML' && key !== 'comprobantesPago' && key !== 'complementosPDF' && key !== 'complementosXML') {
          formData.append(key, data[key]);
        }
      });
      
      // Agregar archivos
      if (data.facturasPDF && data.facturasPDF.length > 0) {
        data.facturasPDF.forEach(file => {
          formData.append('facturasPDF', file);
        });
      }
      if (data.facturasXML && data.facturasXML.length > 0) {
        data.facturasXML.forEach(file => {
          formData.append('facturasXML', file);
        });
      }
      if (data.comprobantesPago && data.comprobantesPago.length > 0) {
        data.comprobantesPago.forEach(file => {
          formData.append('comprobantesPago', file);
        });
      }
      if (data.complementosPDF && data.complementosPDF.length > 0) {
        data.complementosPDF.forEach(file => {
          formData.append('complementosPDF', file);
        });
      }
      if (data.complementosXML && data.complementosXML.length > 0) {
        data.complementosXML.forEach(file => {
          formData.append('complementosXML', file);
        });
      }



      // Llamar a la API con FormData
      const response = await axios.put(`/api/emitidas/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      if (response.data?.success) {
        // Confirmar con datos reales del servidor
        const realFactura = response.data.data;
        setFacturas(prev => prev.map(fact => 
          fact.id === parseInt(id) ? realFactura : fact
        ));
        setFilteredFacturas(prev => prev.map(fact => 
          fact.id === parseInt(id) ? realFactura : fact
        ));
        updateCachedData('facturas', prev => prev.map(fact => 
          fact.id === parseInt(id) ? realFactura : fact
        ));
        
        // Remover indicador de actualización optimista
        setOptimisticUpdates(prev => {
          const newSet = new Set(prev);
          newSet.delete(parseInt(id));
          return newSet;
        });

        setSnackbar({ open: true, message: 'Factura actualizada exitosamente', severity: 'success' });
        return true;
      }
    } catch (error) {
      console.error('Error al actualizar factura:', error);
      
      // Revertir cambios en caso de error
      fetchFacturas();

      setSnackbar({ open: true, message: 'Error al actualizar factura', severity: 'error' });
      return false;
    }
  }, [updateCachedData, fetchFacturas]);

  const deleteFactura = useCallback(async (factura) => {
    if (window.confirm(`¿Estás seguro de eliminar la factura "${factura.rfcReceptor}"?`)) {
      try {
        // Actualización optimista - eliminar inmediatamente de la UI
        setFacturas(prev => prev.filter(fact => fact.id !== factura.id));
        setFilteredFacturas(prev => prev.filter(fact => fact.id !== factura.id));
        
        // Actualizar cache inmediatamente
        updateCachedData('facturas', prev => prev.filter(fact => fact.id !== factura.id));
        
        // Marcar como eliminación optimista
        setOptimisticUpdates(prev => new Set(prev).add(factura.id));

        // Llamar a la API
        const response = await axios.delete(`/api/emitidas/${factura.id}`);
        if (response.data?.success) {
          setSnackbar({ open: true, message: 'Factura eliminada exitosamente', severity: 'success' });
        }
      } catch (error) {
        console.error('Error al eliminar factura:', error);
        
        // Revertir cambios en caso de error
        setFacturas(prev => [...prev, factura]);
        setFilteredFacturas(prev => [...prev, factura]);
        updateCachedData('facturas', prev => [...prev, factura]);
        
        // Remover indicador de eliminación optimista
        setOptimisticUpdates(prev => {
          const newSet = new Set(prev);
          newSet.delete(factura.id);
          return newSet;
        });

        setSnackbar({ open: true, message: 'Error al eliminar factura', severity: 'error' });
      }
    }
  }, [updateCachedData]);

  useEffect(() => {
    startTransition(() => {
      let filtered = facturas;
      if (searchTerm) {
        filtered = filtered.filter(factura =>
          factura.rfcReceptor?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          factura.razonSocial?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          factura.claveSat?.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
      if (statusFilter !== 'all') {
        filtered = filtered.filter(factura => factura.facturaAdmon === (statusFilter === 'true'));
      }
      setFilteredFacturas(filtered);
    });
  }, [facturas, debouncedSearchTerm, statusFilter]);

  const handleCreateFactura = () => {
    setEditingFactura(null);
    setFormData({
      rfcReceptor: '',
      razonSocial: '',
      subtotal: '',
      iva: '',
      total: '',
      fechaEmision: new Date().toISOString().split('T')[0],
      claveSat: '',
      descripcion: '',
      facturaAdmon: false,
      pue: false,
      ppd: false
    });
    setShowForm(true);
  };

  const handleEditFactura = (factura) => {
    setEditingFactura(factura);
    setFormData({
      rfcReceptor: factura.rfcReceptor || '',
      razonSocial: factura.razonSocial || '',
      subtotal: factura.subtotal || '',
      iva: factura.iva || '',
      total: factura.total || '',
      fechaEmision: factura.fechaEmision ? new Date(factura.fechaEmision).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      claveSat: factura.claveSat || '',
      descripcion: factura.descripcion || '',
      facturaAdmon: factura.facturaAdmon || false,
      pue: factura.pue || false,
      ppd: factura.ppd || false
    });
    setShowForm(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    
    // Combinar formData con selectedFiles para incluir archivos
    const dataWithFiles = {
      ...formData,
      ...selectedFiles
    };
    
    if (editingFactura) {
      const success = await updateFactura(editingFactura.id, dataWithFiles);
      if (success) {
        setShowForm(false);
        setEditingFactura(null);
      }
    } else {
      const success = await createFactura(dataWithFiles);
      if (success) setShowForm(false);
    }
  };

  // Funciones para manejo de archivos
  const handleFileChange = (field, files) => {
    setSelectedFiles(prev => ({
      ...prev,
      [field]: Array.from(files)
    }));
  };

  const getFilePreview = (file) => {
    if (file.type.includes('pdf')) {
      return { icon: <PictureAsPdfIcon />, label: 'PDF' };
    } else if (file.type.includes('xml') || file.type.includes('excel') || file.type.includes('spreadsheet')) {
      return { icon: <TableChartIcon />, label: 'Excel/XML' };
    }
    return { icon: <FileUploadIcon />, label: 'Archivo' };
  };

  const getFileUrl = (filename) => {
    const baseURL = process.env.REACT_APP_API_URL || 'https://sigma.runsolutions-services.com';
    return `${baseURL}/uploads/${filename}`;
  };

  const deleteFile = useCallback(async (filename, field) => {
    try {
      const response = await axios.delete(`/api/emitidas/files/${filename}`);
      if (response.data.success) {
        // Actualizar la factura localmente removiendo el archivo
        setFacturas(prev => prev.map(factura => {
          if (factura[field] && factura[field].includes(filename)) {
            return {
              ...factura,
              [field]: factura[field].filter(f => f !== filename)
            };
          }
          return factura;
        }));
        setSnackbar({ open: true, message: 'Archivo eliminado correctamente', severity: 'success' });
      }
    } catch (error) {
      console.error('Error al eliminar archivo:', error);
      setSnackbar({ open: true, message: 'Error al eliminar archivo', severity: 'error' });
    }
  }, []);

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingFactura(null);
    setFormData({
      rfcReceptor: '',
      razonSocial: '',
      subtotal: '',
      iva: '',
      total: '',
      fechaEmision: new Date().toISOString().split('T')[0],
      claveSat: '',
      descripcion: '',
      facturaAdmon: false,
      pue: false,
      ppd: false,
      facturasPDF: [],
      facturasXML: [],
      comprobantesPago: [],
      complementosPDF: [],
      complementosXML: []
    });
    setSelectedFiles({
      facturasPDF: [],
      facturasXML: [],
      comprobantesPago: [],
      complementosPDF: [],
      complementosXML: []
    });
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  useEffect(() => {
    fetchFacturas();
  }, [fetchFacturas]);

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
            <ReceiptIcon sx={{ mr: 2, verticalAlign: 'middle' }} />
            Facturas Emitidas
          </Typography>
          <Typography
            variant="h6"
            sx={{
              color: 'rgba(255,255,255,0.9)',
              fontWeight: 400,
              opacity: 0.9
            }}
          >
            Gestiona y controla las facturas emitidas a clientes
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
                  placeholder="Buscar facturas..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{
                    startAdornment: <SearchIcon sx={{ color: '#7f8c8d', mr: 1 }} />
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <StyledSelect fullWidth>
                  <InputLabel>Filtrar por Tipo</InputLabel>
                  <Select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    label="Filtrar por Tipo"
                  >
                    <MenuItem value="all">Todas</MenuItem>
                    <MenuItem value="true">Administrativas</MenuItem>
                    <MenuItem value="false">Operativas</MenuItem>
                  </Select>
                </StyledSelect>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={handleCreateFactura}
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
                  Nueva Factura
                </Button>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Button
                  variant="outlined"
                  startIcon={loading ? <RefreshIcon sx={{ animation: 'spin 2s linear infinite' }} /> : <RefreshIcon />}
                  onClick={fetchFacturas}
                  disabled={loading}
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
                  {loading ? 'Actualizando...' : 'Actualizar'}
                </Button>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Button
                  variant="outlined"
                  startIcon={<DownloadIcon />}
                  onClick={() => {
                    // Función para exportar informe
                    const csvContent = [
                      ['RFC Receptor', 'Razón Social', 'Total', 'Fecha Emisión', 'Tipo'],
                      ...facturas.map(f => [
                        f.rfcReceptor || '',
                        f.razonSocial || '',
                        f.total || '0',
                        f.fechaEmision ? new Date(f.fechaEmision).toLocaleDateString('es-MX') : 'N/A',
                        f.facturaAdmon ? 'Administrativa' : 'Operativa'
                      ])
                    ].map(row => row.join(',')).join('\n');
                    
                    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
                    const link = document.createElement('a');
                    const url = URL.createObjectURL(blob);
                    link.setAttribute('href', url);
                    link.setAttribute('download', `facturas_emitidas_${new Date().toISOString().split('T')[0]}.csv`);
                    link.style.visibility = 'hidden';
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                  }}
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
                  Exportar Informe
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
                  <TableCell>Factura</TableCell>
                  <TableCell>Total</TableCell>
                  <TableCell>Tipo</TableCell>
                  <TableCell>Cliente</TableCell>
                  <TableCell>Fecha</TableCell>
                  <TableCell>Archivos</TableCell>
                  <TableCell align="center">Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  Array.from({ length: 8 }).map((_, index) => (
                    <FacturaRowSkeleton key={index} />
                  ))
                ) : filteredFacturas.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      <Box sx={{ p: 4, textAlign: 'center' }}>
                        <ReceiptIcon sx={{ fontSize: 60, color: '#bdc3c8', mb: 2 }} />
                        <Typography variant="h6" sx={{ color: '#7f8c8d', mb: 1 }}>
                          No hay facturas emitidas
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#95a5a6' }}>
                          Comienza emitiendo la primera factura
                        </Typography>
                      </Box>
                    </TableCell>
                  </TableRow>
                ) : (
                  <AnimatePresence>
                    {filteredFacturas.map((factura, index) => (
                      <motion.tr
                        key={factura.id}
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
                                background: factura.facturaAdmon ? 
                                  'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' :
                                  'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
                                fontWeight: 700,
                                fontSize: '1.2rem',
                                opacity: optimisticUpdates.has(factura.id) ? 0.7 : 1
                              }}
                            >
                              {factura.facturaAdmon ? 'A' : 'O'}
                            </Avatar>
                            <Box>
                              <Typography variant="subtitle1" sx={{ 
                                fontWeight: 600, 
                                color: '#2c3e50',
                                opacity: optimisticUpdates.has(factura.id) ? 0.7 : 1
                              }}>
                                {factura.rfcReceptor}
                              </Typography>
                              <Typography variant="body2" sx={{ color: '#7f8c8d' }}>
                                ID: {factura.id}
                              </Typography>
                              {optimisticUpdates.has(factura.id) && (
                                <Chip
                                  label="Actualizando..."
                                  size="small"
                                  color="warning"
                                  sx={{ fontSize: '0.7rem' }}
                                />
                              )}
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Typography variant="h6" sx={{ 
                            fontWeight: 700,
                            color: '#27ae60'
                          }}>
                            ${parseFloat(factura.total || 0).toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <StyledChip
                            label={factura.facturaAdmon ? 'Administrativa' : 'Operativa'}
                            status={factura.facturaAdmon ? 'pagada' : 'pendiente'}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" sx={{ 
                            color: '#7f8c8d',
                            fontWeight: 500,
                            textTransform: 'capitalize'
                          }}>
                            {factura.razonSocial || 'Sin cliente'}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" sx={{ color: '#7f8c8d' }}>
                            {factura.fechaEmision ? new Date(factura.fechaEmision).toLocaleDateString('es-MX') : 'N/A'}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, alignItems: 'center' }}>
                            {/* Factura PDF */}
                            {factura.facturasPDF && factura.facturasPDF.length > 0 && (
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
                                    onClick={() => window.open(getFileUrl(factura.facturasPDF[0]), '_blank')}
                                    sx={{ color: '#e74c3c' }}
                                  >
                                    <ReceiptIcon fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                                <Tooltip title="Descargar PDF">
                                  <IconButton
                                    size="small"
                                    onClick={() => window.open(getFileUrl(factura.facturasPDF[0], 'download'), '_blank')}
                                    sx={{ color: '#3498db' }}
                                  >
                                    <DownloadIcon fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                                <Tooltip title={factura.facturasPDF[0]}>
                                  <Typography variant="caption" sx={{ color: '#e74c3c', fontWeight: 600, cursor: 'pointer' }}>
                                    PDF
                                  </Typography>
                                </Tooltip>
                                <Tooltip title="Eliminar PDF">
                                  <IconButton
                                    size="small"
                                    onClick={() => deleteFile(factura.facturasPDF[0], 'facturasPDF')}
                                    sx={{ color: '#e74c3c' }}
                                  >
                                    <DeleteIcon fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                              </Box>
                            )}
                            
                            {/* Factura XML/Excel */}
                            {factura.facturasXML && factura.facturasXML.length > 0 && (
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
                                    onClick={() => window.open(getFileUrl(factura.facturasXML[0]), '_blank')}
                                    sx={{ color: '#27ae60' }}
                                  >
                                    <AssignmentIcon fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                                <Tooltip title="Descargar archivo">
                                  <IconButton
                                    size="small"
                                    onClick={() => window.open(getFileUrl(factura.facturasXML[0], 'download'), '_blank')}
                                    sx={{ color: '#3498db' }}
                                  >
                                    <DownloadIcon fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                                <Tooltip title={factura.facturasXML[0]}>
                                  <Typography variant="caption" sx={{ color: '#27ae60', fontWeight: 600, cursor: 'pointer' }}>
                                    {factura.facturasXML[0].split('.').pop()?.toUpperCase()}
                                  </Typography>
                                </Tooltip>
                                <Tooltip title="Eliminar archivo">
                                  <IconButton
                                    size="small"
                                    onClick={() => deleteFile(factura.facturasXML[0], 'facturasXML')}
                                    sx={{ color: '#27ae60' }}
                                  >
                                    <DeleteIcon fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                              </Box>
                            )}
                            
                            {(!factura.facturasPDF || factura.facturasPDF.length === 0) && 
                             (!factura.facturasXML || factura.facturasXML.length === 0) && (
                              <Typography variant="caption" sx={{ color: '#bdc3c8', fontStyle: 'italic' }}>
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
                                onClick={() => handleEditFactura(factura)}
                              >
                                <VisibilityIcon fontSize="small" />
                              </ActionButton>
                            </Tooltip>
                            <Tooltip title="Editar factura">
                              <ActionButton
                                color="#f39c12"
                                onClick={() => handleEditFactura(factura)}
                              >
                                <EditIcon fontSize="small" />
                              </ActionButton>
                            </Tooltip>
                            <Tooltip title="Eliminar factura">
                              <ActionButton
                                color="#e74c3c"
                                onClick={() => deleteFactura(factura)}
                              >
                                <DeleteIcon fontSize="small" />
                              </ActionButton>
                            </Tooltip>
                            
                            {/* Botones de archivos */}
                            {factura.facturasPDF && factura.facturasPDF.length > 0 && (
                              <Tooltip title="Ver PDF">
                                <ActionButton
                                  color="#e74c3c"
                                  onClick={() => window.open(getFileUrl(factura.facturasPDF[0]), '_blank')}
                                >
                                  <OpenInNewIcon fontSize="small" />
                                </ActionButton>
                              </Tooltip>
                            )}
                            
                            {factura.facturasXML && factura.facturasXML.length > 0 && (
                              <Tooltip title="Ver archivo">
                                <ActionButton
                                  color="#3498db"
                                  onClick={() => window.open(getFileUrl(factura.facturasXML[0]), '_blank')}
                                >
                                  <OpenInNewIcon fontSize="small" />
                                </ActionButton>
                              </Tooltip>
                            )}
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
          {editingFactura ? '✏️ Editar Factura' : '➕ Nueva Factura'}
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
                  name="rfcReceptor"
                  label="RFC Receptor"
                  value={formData.rfcReceptor}
                  onChange={(e) => setFormData({ ...formData, rfcReceptor: e.target.value })}
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
                  name="razonSocial"
                  label="Razón Social"
                  value={formData.razonSocial}
                  onChange={(e) => setFormData({ ...formData, razonSocial: e.target.value })}
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
                  name="iva"
                  label="IVA"
                  type="number"
                  value={formData.iva}
                  onChange={(e) => setFormData({ ...formData, iva: e.target.value })}
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
                <TextField
                  name="total"
                  label="Total"
                  type="number"
                  value={formData.total}
                  onChange={(e) => setFormData({ ...formData, total: e.target.value })}
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
                <TextField
                  name="fechaEmision"
                  label="Fecha de Emisión"
                  type="date"
                  value={formData.fechaEmision}
                  onChange={(e) => setFormData({ ...formData, fechaEmision: e.target.value })}
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
                <TextField
                  name="claveSat"
                  label="Clave SAT"
                  value={formData.claveSat}
                  onChange={(e) => setFormData({ ...formData, claveSat: e.target.value })}
                  fullWidth
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
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <input
                      type="checkbox"
                      id="facturaAdmon"
                      checked={formData.facturaAdmon}
                      onChange={(e) => setFormData({ ...formData, facturaAdmon: e.target.checked })}
                      style={{ marginRight: '8px' }}
                    />
                    <label htmlFor="facturaAdmon">Factura Administrativa</label>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <input
                      type="checkbox"
                      id="pue"
                      checked={formData.pue}
                      onChange={(e) => setFormData({ ...formData, pue: e.target.checked })}
                      style={{ marginRight: '8px' }}
                    />
                    <label htmlFor="pue">PUE</label>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <input
                      type="checkbox"
                      id="ppd"
                      checked={formData.ppd}
                      onChange={(e) => setFormData({ ...formData, ppd: e.target.checked })}
                      style={{ marginRight: '8px' }}
                    />
                    <label htmlFor="ppd">PPD</label>
                  </Box>
                </Box>
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
              <Grid item xs={12}>
                <Typography variant="h6" sx={{ mb: 2, color: '#2c3e50', fontWeight: 600 }}>
                  📁 Archivos de la Factura
                </Typography>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" sx={{ mb: 1, color: '#7f8c8d', fontWeight: 500 }}>
                    Facturas PDF
                  </Typography>
                  <input
                    type="file"
                    multiple
                    accept=".pdf"
                    onChange={(e) => handleFileChange('facturasPDF', e.target.files)}
                    style={{ display: 'none' }}
                    id="facturasPDF"
                  />
                  <label htmlFor="facturasPDF">
                    <Button
                      variant="outlined"
                      component="span"
                      startIcon={<FileUploadIcon />}
                      sx={{
                        borderColor: '#667eea',
                        color: '#667eea',
                        borderRadius: 12,
                        px: 3,
                        py: 1.5,
                        '&:hover': {
                          borderColor: '#764ba2',
                          background: 'rgba(102, 126, 234, 0.1)'
                        }
                      }}
                    >
                      Seleccionar PDFs
                    </Button>
                  </label>
                  {selectedFiles.facturasPDF.length > 0 && (
                    <Box sx={{ mt: 1 }}>
                      {selectedFiles.facturasPDF.map((file, index) => (
                        <Chip
                          key={index}
                          label={`${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)`}
                          onDelete={() => {
                            const newFiles = selectedFiles.facturasPDF.filter((_, i) => i !== index);
                            setSelectedFiles(prev => ({ ...prev, facturasPDF: newFiles }));
                          }}
                          sx={{ mr: 1, mb: 1 }}
                        />
                      ))}
                    </Box>
                  )}
                </Box>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" sx={{ mb: 1, color: '#7f8c8d', fontWeight: 500 }}>
                    Facturas XML
                  </Typography>
                  <input
                    type="file"
                    multiple
                    accept=".xml,.xlsx,.xls,.csv"
                    onChange={(e) => handleFileChange('facturasXML', e.target.files)}
                    style={{ display: 'none' }}
                    id="facturasXML"
                  />
                  <label htmlFor="facturasXML">
                    <Button
                      variant="outlined"
                      component="span"
                      startIcon={<FileUploadIcon />}
                      sx={{
                        borderColor: '#667eea',
                        color: '#667eea',
                        borderRadius: 12,
                        px: 3,
                        py: 1.5,
                        '&:hover': {
                          borderColor: '#764ba2',
                          background: 'rgba(102, 126, 234, 0.1)'
                        }
                      }}
                    >
                      Seleccionar XMLs/Excel
                    </Button>
                  </label>
                  {selectedFiles.facturasXML.length > 0 && (
                    <Box sx={{ mt: 1 }}>
                      {selectedFiles.facturasXML.map((file, index) => (
                        <Chip
                          key={index}
                          label={`${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)`}
                          onDelete={() => {
                            const newFiles = selectedFiles.facturasXML.filter((_, i) => i !== index);
                            setSelectedFiles(prev => ({ ...prev, facturasXML: newFiles }));
                          }}
                          sx={{ mr: 1, mb: 1 }}
                        />
                      ))}
                    </Box>
                  )}
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
            {editingFactura ? 'Actualizar' : 'Crear'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Indicador de operaciones optimistas */}
      {optimisticUpdates.size > 0 && (
        <Box
          sx={{
            position: 'fixed',
            top: 20,
            right: 20,
            zIndex: 9999,
            background: 'rgba(255, 193, 7, 0.9)',
            color: '#000',
            px: 2,
            py: 1,
            borderRadius: 2,
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 193, 7, 0.3)',
            display: 'flex',
            alignItems: 'center',
            gap: 1
          }}
        >
          <RefreshIcon sx={{ animation: 'spin 2s linear infinite' }} />
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            {optimisticUpdates.size} actualización{optimisticUpdates.size > 1 ? 'es' : ''} en progreso...
          </Typography>
        </Box>
      )}

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

export default EmitidasFormsV2;
