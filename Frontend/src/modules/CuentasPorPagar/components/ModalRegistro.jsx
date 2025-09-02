// src/modules/CuentasPorPagar/components/ModalRegistro.jsx
import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
  Typography,
  IconButton,
  useTheme,
  Chip,
  Alert,
  Divider,
  Card,
  CardContent,
  Avatar,
  Tooltip,
  LinearProgress,
  InputAdornment,
  CircularProgress
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  Close as CloseIcon,
  Add as AddIcon,
  Edit as EditIcon,
  AttachMoney as AttachMoneyIcon,
  Business as BusinessIcon,
  Category as CategoryIcon,
  Schedule as ScheduleIcon,
  Description as DescriptionIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Calculate as CalculateIcon,
  Receipt as ReceiptIcon,
  AccountBalance as AccountBalanceIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

// Componentes estilizados ultra-modernos
const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    borderRadius: 24,
    background: 'linear-gradient(135deg, rgba(255,255,255,0.98) 0%, rgba(255,255,255,0.95) 100%)',
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(255,255,255,0.4)',
    boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
    maxWidth: '900px',
    width: '100%',
    maxHeight: '90vh',
    position: 'relative',
    overflow: 'hidden',
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: '4px',
      background: 'linear-gradient(90deg, #667eea, #764ba2, #f093fb, #f5576c)',
      borderRadius: '24px 24px 0 0'
    }
  }
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: 16,
    background: 'rgba(255,255,255,0.8)',
    backdropFilter: 'blur(10px)',
    border: '2px solid rgba(102, 126, 234, 0.1)',
    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
    '&:hover': {
      background: 'rgba(255,255,255,0.95)',
      borderColor: 'rgba(102, 126, 234, 0.3)',
      transform: 'translateY(-2px)',
      boxShadow: '0 8px 25px rgba(102, 126, 234, 0.15)'
    },
    '&.Mui-focused': {
      background: 'rgba(255,255,255,1)',
      borderColor: '#667eea',
      boxShadow: '0 0 0 4px rgba(102, 126, 234, 0.1), 0 8px 25px rgba(102, 126, 234, 0.2)',
      transform: 'translateY(-2px)'
    }
  },
  '& .MuiInputLabel-root': {
    fontWeight: 600,
    color: '#667eea',
    '&.Mui-focused': {
      color: '#667eea',
      fontWeight: 700
    }
  }
}));

const StyledFormControl = styled(FormControl)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: 16,
    background: 'rgba(255,255,255,0.8)',
    backdropFilter: 'blur(10px)',
    border: '2px solid rgba(102, 126, 234, 0.1)',
    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
    '&:hover': {
      background: 'rgba(255,255,255,0.95)',
      borderColor: 'rgba(102, 126, 234, 0.3)',
      transform: 'translateY(-2px)',
      boxShadow: '0 8px 25px rgba(102, 126, 234, 0.15)'
    },
    '&.Mui-focused': {
      background: 'rgba(255,255,255,1)',
      borderColor: '#667eea',
      boxShadow: '0 0 0 4px rgba(102, 126, 234, 0.1), 0 8px 25px rgba(102, 126, 234, 0.2)',
      transform: 'translateY(-2px)'
    }
  },
  '& .MuiInputLabel-root': {
    fontWeight: 600,
    color: '#667eea',
    '&.Mui-focused': {
      color: '#667eea',
      fontWeight: 700
    }
  }
}));

const ActionButton = styled(Button)(({ theme, variant = 'contained', color = 'primary' }) => ({
  borderRadius: 16,
  textTransform: 'none',
  fontWeight: 700,
  padding: theme.spacing(1.5, 4),
  fontSize: '1rem',
  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: '-100%',
    width: '100%',
    height: '100%',
    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
    transition: 'left 0.5s'
  },
  '&:hover::before': {
    left: '100%'
  },
  '&:hover': {
    transform: 'translateY(-3px) scale(1.02)',
    boxShadow: '0 12px 40px rgba(0,0,0,0.2)'
  }
}));

const SummaryCard = styled(Card)(({ theme, type = 'info' }) => ({
  background: type === 'success' 
    ? 'linear-gradient(135deg, rgba(76, 175, 80, 0.1), rgba(139, 195, 74, 0.1))' 
    : type === 'warning' 
      ? 'linear-gradient(135deg, rgba(255, 152, 0, 0.1), rgba(255, 193, 7, 0.1))' 
      : 'linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1))',
  border: `2px solid ${type === 'success' 
    ? 'rgba(76, 175, 80, 0.3)' 
    : type === 'warning' 
      ? 'rgba(255, 152, 0, 0.3)' 
      : 'rgba(102, 126, 234, 0.3)'}`,
  borderRadius: 20,
  padding: theme.spacing(2),
  textAlign: 'center',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 8px 25px rgba(0,0,0,0.1)'
  }
}));

const ModalRegistro = ({
  open,
  onClose,
  cuenta = null, // Valor por defecto para evitar null
  onSuccess,
  onError
}) => {
  const theme = useTheme();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    concepto: '',
    monto_neto: '',
    monto_con_iva: '',
    requiere_iva: true,
    categoria: '',
    proveedor_id: '',
    fecha: '',
    fecha_vencimiento: '',
    estado: 'porPagar',
    notas: '',
    numero_factura: '',
    moneda: 'MXN'
  });

  const [errors, setErrors] = useState({});
  const [proveedores, setProveedores] = useState([]);
  const [categorias, setCategorias] = useState([]);

  // Inicializar formData cuando se abre el modal o cambia la cuenta
  useEffect(() => {
    if (open) {
      if (cuenta) {
        // Modo edición
        setFormData({
          concepto: cuenta.concepto || '',
          monto_neto: cuenta.monto_neto || cuenta.monto || '',
          monto_con_iva: cuenta.monto_con_iva || cuenta.monto || '',
          requiere_iva: cuenta.requiere_iva !== false,
          categoria: cuenta.categoria || '',
          proveedor_id: cuenta.proveedor_id || '',
          fecha: cuenta.fecha || '',
          fecha_vencimiento: cuenta.fecha_vencimiento || '',
          estado: cuenta.estado || 'porPagar',
          notas: cuenta.notas || '',
          numero_factura: cuenta.numero_factura || '',
          moneda: cuenta.moneda || 'MXN'
        });
      } else {
        // Modo creación
        setFormData({
          concepto: '',
          monto_neto: '',
          monto_con_iva: '',
          requiere_iva: true,
          categoria: '',
          proveedor_id: '',
          fecha: new Date().toISOString().split('T')[0],
          fecha_vencimiento: '',
          estado: 'porPagar',
          notas: '',
          numero_factura: '',
          moneda: 'MXN'
        });
      }
      setErrors({});
    }
  }, [open, cuenta]);

  // Calcular IVA automáticamente
  const montoConIva = useMemo(() => {
    if (!formData.monto_neto || !formData.requiere_iva) return formData.monto_neto;
    const neto = parseFloat(formData.monto_neto) || 0;
    return (neto * 1.16).toFixed(2);
  }, [formData.monto_neto, formData.requiere_iva]);

  // Actualizar monto con IVA cuando cambie el neto
  useEffect(() => {
    if (formData.requiere_iva && formData.monto_neto) {
      setFormData(prev => ({
        ...prev,
        monto_con_iva: montoConIva
      }));
    }
  }, [montoConIva, formData.requiere_iva]);

  // Cargar datos de proveedores y categorías
  useEffect(() => {
    const cargarDatosFiltros = async () => {
      if (open) {
        try {
          // Cargar categorías
          const responseCategorias = await axios.get(`http://localhost:5001/api/categorias`);
          if (responseCategorias.data.success) {
            setCategorias(responseCategorias.data.data || []);
          }

          // Cargar proveedores
          const responseProveedores = await axios.get(`http://localhost:5001/api/proveedores`);
          if (responseProveedores.data.success) {
            setProveedores(responseProveedores.data.data || []);
          }
        } catch (error) {
          console.error('Error al cargar datos de filtros:', error);
          // En caso de error, mostrar mensaje al usuario
          onError('Error al cargar proveedores y categorías');
        }
      }
    };

    cargarDatosFiltros();
  }, [open]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Limpiar error del campo
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.concepto.trim()) {
      newErrors.concepto = 'El concepto es requerido';
    }
    
    if (!formData.monto_neto || parseFloat(formData.monto_neto) <= 0) {
      newErrors.monto_neto = 'El monto neto debe ser mayor a 0';
    }
    
    if (!formData.fecha) {
      newErrors.fecha = 'La fecha es requerida';
    }
    
    if (!formData.fecha_vencimiento) {
      newErrors.fecha_vencimiento = 'La fecha de vencimiento es requerida';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    try {
      // Simular envío
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const message = cuenta ? 'Cuenta actualizada correctamente' : 'Cuenta creada correctamente';
      onSuccess(message);
    } catch (error) {
      onError('Error al procesar la cuenta');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    if (!amount) return '$0.00';
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: formData.moneda
    }).format(amount);
  };

  if (!open) return null;

  return (
    <StyledDialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      TransitionComponent={motion.div}
      transition={{
        type: "spring",
        damping: 25,
        stiffness: 300
      }}
    >
      <DialogTitle sx={{ 
        background: 'linear-gradient(135deg, #667eea, #764ba2)',
        color: '#fff',
        borderRadius: 0,
        pb: 3
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {cuenta ? (
              <>
                <EditIcon sx={{ fontSize: '2rem' }} />
                <Typography variant="h5" sx={{ fontWeight: 700 }}>
                  Editar Cuenta por Pagar
                </Typography>
              </>
            ) : (
              <>
                <AddIcon sx={{ fontSize: '2rem' }} />
                <Typography variant="h5" sx={{ fontWeight: 700 }}>
                  Nueva Cuenta por Pagar
                </Typography>
              </>
            )}
          </Box>
          
          <IconButton
            onClick={onClose}
            sx={{
              color: '#fff',
              '&:hover': {
                background: 'rgba(255,255,255,0.1)',
                transform: 'scale(1.1)'
              }
            }}
          >
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ p: 4, overflow: 'auto', maxHeight: 'calc(90vh - 200px)' }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {/* Información Principal */}
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: '#667eea' }}>
                📋 Información Principal
              </Typography>
            </Grid>

            <Grid item xs={12} md={8}>
              <StyledTextField
                fullWidth
                label="Concepto de la cuenta"
                value={formData.concepto}
                onChange={(e) => handleInputChange('concepto', e.target.value)}
                error={!!errors.concepto}
                helperText={errors.concepto}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <DescriptionIcon sx={{ color: 'action.active' }} />
                    </InputAdornment>
                  )
                }}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <StyledTextField
                fullWidth
                label="Número de Factura"
                value={formData.numero_factura}
                onChange={(e) => handleInputChange('numero_factura', e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <ReceiptIcon sx={{ color: 'action.active' }} />
                    </InputAdornment>
                  )
                }}
              />
            </Grid>

            {/* Montos y IVA */}
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: '#667eea' }}>
                💰 Montos y IVA
              </Typography>
            </Grid>

            <Grid item xs={12} md={4}>
              <StyledTextField
                fullWidth
                label="Monto Neto"
                type="number"
                value={formData.monto_neto}
                onChange={(e) => handleInputChange('monto_neto', e.target.value)}
                error={!!errors.monto_neto}
                helperText={errors.monto_neto}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <AttachMoneyIcon sx={{ color: 'action.active' }} />
                    </InputAdornment>
                  )
                }}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <StyledTextField
                fullWidth
                label="Monto con IVA"
                type="number"
                value={formData.monto_con_iva}
                onChange={(e) => handleInputChange('monto_con_iva', e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <AccountBalanceIcon sx={{ color: 'action.active' }} />
                    </InputAdornment>
                  )
                }}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <Box sx={{ display: 'flex', alignItems: 'center', height: '100%', pl: 2 }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.requiere_iva}
                      onChange={(e) => handleInputChange('requiere_iva', e.target.checked)}
                      sx={{
                        '& .MuiSwitch-switchBase.Mui-checked': {
                          color: '#667eea'
                        }
                      }}
                    />
                  }
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <CalculateIcon sx={{ fontSize: '1.2rem', color: '#667eea' }} />
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        Requiere IVA
                      </Typography>
                    </Box>
                  }
                />
              </Box>
            </Grid>

            {/* Fechas */}
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: '#667eea' }}>
                📅 Fechas
              </Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <StyledTextField
                fullWidth
                label="Fecha de la cuenta"
                type="date"
                value={formData.fecha}
                onChange={(e) => handleInputChange('fecha', e.target.value)}
                error={!!errors.fecha}
                helperText={errors.fecha}
                InputLabelProps={{ shrink: true }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <ScheduleIcon sx={{ color: 'action.active' }} />
                    </InputAdornment>
                  )
                }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <StyledTextField
                fullWidth
                label="Fecha de vencimiento"
                type="date"
                value={formData.fecha_vencimiento}
                onChange={(e) => handleInputChange('fecha_vencimiento', e.target.value)}
                error={!!errors.fecha_vencimiento}
                helperText={errors.fecha_vencimiento}
                InputLabelProps={{ shrink: true }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <ScheduleIcon sx={{ color: 'action.active' }} />
                    </InputAdornment>
                  )
                }}
              />
            </Grid>

            {/* Categorización */}
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: '#667eea' }}>
                🏷️ Categorización
              </Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <StyledFormControl fullWidth>
                <InputLabel>Proveedor</InputLabel>
                <Select
                  value={formData.proveedor_id}
                  onChange={(e) => handleInputChange('proveedor_id', e.target.value)}
                  label="Proveedor"
                >
                  <MenuItem value="">
                    <em>Seleccionar proveedor</em>
                  </MenuItem>
                  {proveedores.map((prov) => (
                    <MenuItem key={prov.id} value={prov.id}>
                      {prov.nombre}
                    </MenuItem>
                  ))}
                </Select>
              </StyledFormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <StyledFormControl fullWidth>
                <InputLabel>Categoría</InputLabel>
                <Select
                  value={formData.categoria}
                  onChange={(e) => handleInputChange('categoria', e.target.value)}
                  label="Categoría"
                >
                  <MenuItem value="">
                    <em>Seleccionar categoría</em>
                  </MenuItem>
                  {categorias.map((cat) => (
                    <MenuItem key={cat.id} value={cat.id}>
                      {cat.nombre}
                    </MenuItem>
                  ))}
                </Select>
              </StyledFormControl>
            </Grid>

            {/* Estado y Notas */}
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: '#667eea' }}>
                📝 Estado y Notas
              </Typography>
            </Grid>

            <Grid item xs={12} md={4}>
              <StyledFormControl fullWidth>
                <InputLabel>Estado</InputLabel>
                <Select
                  value={formData.estado}
                  onChange={(e) => handleInputChange('estado', e.target.value)}
                  label="Estado"
                >
                  <MenuItem value="porPagar">Por Pagar</MenuItem>
                  <MenuItem value="pagada">Pagada</MenuItem>
                  <MenuItem value="parcial">Pago Parcial</MenuItem>
                </Select>
              </StyledFormControl>
            </Grid>

            <Grid item xs={12} md={8}>
              <StyledTextField
                fullWidth
                label="Notas adicionales"
                value={formData.notas}
                onChange={(e) => handleInputChange('notas', e.target.value)}
                multiline
                rows={2}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <DescriptionIcon sx={{ color: 'action.active' }} />
                    </InputAdornment>
                  )
                }}
              />
            </Grid>

            {/* Resumen de Montos */}
            <Grid item xs={12}>
              <Box sx={{ mt: 2 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={4}>
                    <SummaryCard type="info">
                      <Typography variant="h6" sx={{ fontWeight: 700, color: '#667eea' }}>
                        {formatCurrency(formData.monto_neto)}
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        Monto Neto
                      </Typography>
                    </SummaryCard>
                  </Grid>
                  
                  <Grid item xs={12} md={4}>
                    <SummaryCard type="warning">
                      <Typography variant="h6" sx={{ fontWeight: 700, color: '#ff9800' }}>
                        {formatCurrency((parseFloat(formData.monto_neto || 0) * 0.16).toFixed(2))}
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        IVA (16%)
                      </Typography>
                    </SummaryCard>
                  </Grid>
                  
                  <Grid item xs={12} md={4}>
                    <SummaryCard type="success">
                      <Typography variant="h6" sx={{ fontWeight: 700, color: '#4caf50' }}>
                        {formatCurrency(formData.monto_con_iva)}
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        Total a Pagar
                      </Typography>
                    </SummaryCard>
                  </Grid>
                </Grid>
              </Box>
            </Grid>
          </Grid>
        </form>
      </DialogContent>

      <DialogActions sx={{ p: 4, pt: 2 }}>
        <Box sx={{ display: 'flex', gap: 2, width: '100%', justifyContent: 'flex-end' }}>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <ActionButton
              variant="outlined"
              onClick={onClose}
              startIcon={<CancelIcon />}
              sx={{
                border: '2px solid rgba(102, 126, 234, 0.3)',
                color: '#667eea',
                '&:hover': {
                  borderColor: '#667eea',
                  background: 'rgba(102, 126, 234, 0.05)'
                }
              }}
            >
              Cancelar
            </ActionButton>
          </motion.div>

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <ActionButton
              type="submit"
              variant="contained"
              onClick={handleSubmit}
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />}
              sx={{
                background: 'linear-gradient(135deg, #667eea, #764ba2)',
                color: '#fff',
                '&:hover': {
                  background: 'linear-gradient(135deg, #5a6fd8, #6a4190)'
                },
                '&:disabled': {
                  background: 'rgba(0,0,0,0.12)',
                  color: 'rgba(0,0,0,0.38)'
                }
              }}
            >
              {loading ? 'Guardando...' : (cuenta ? 'Actualizar' : 'Crear')}
            </ActionButton>
          </motion.div>
        </Box>
      </DialogActions>

      {loading && (
        <LinearProgress
          sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: 4,
            '& .MuiLinearProgress-bar': {
              background: 'linear-gradient(90deg, #667eea, #764ba2)'
            }
          }}
        />
      )}
    </StyledDialog>
  );
};

export default ModalRegistro;
