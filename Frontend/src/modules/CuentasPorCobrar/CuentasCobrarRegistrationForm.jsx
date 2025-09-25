import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  Snackbar,
  CircularProgress,
  Card,
  CardContent,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox,
  useTheme,
  useMediaQuery,
  Divider,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Chip,
  Avatar,
  IconButton,
  Tooltip,
  Fade,
  Zoom,
  Paper,
  Stack,
  InputAdornment,
  Autocomplete,
  Switch,
  FormGroup
} from '@mui/material';
import {
  AccountBalance,
  Add,
  Save,
  Cancel,
  CheckCircle,
  Warning,
  Info,
  ErrorOutline,
  Refresh,
  Assignment,
  Payment,
  Business,
  Category,
  CalendarToday,
  AttachMoney,
  Receipt,
  Description,
  LocalAtm,
  AccountBox,
  Phone,
  Email,
  LocationOn,
  CreditCard,
  ReceiptLong,
  FileUpload,
  CloudUpload,
  Delete,
  Edit
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { motion, AnimatePresence } from 'framer-motion';

// Componentes estilizados
const StyledCard = styled(Card)(({ theme }) => ({
  background: 'rgba(255,255,255,0.98)',
  backdropFilter: 'blur(25px)',
  border: '2px solid rgba(255,255,255,0.4)',
  borderRadius: 24,
  boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
  height: '100%',
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.05), rgba(118, 75, 162, 0.05))',
    pointerEvents: 'none'
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    top: '-50%',
    left: '-50%',
    width: '200%',
    height: '200%',
    background: 'radial-gradient(circle, rgba(102, 126, 234, 0.1) 1px, transparent 1px)',
    backgroundSize: '30px 30px',
    animation: 'drift 20s linear infinite',
    pointerEvents: 'none'
  },
  '@keyframes drift': {
    '0%': { transform: 'translate(-50%, -50%) rotate(0deg)' },
    '100%': { transform: 'translate(-50%, -50%) rotate(360deg)' }
  }
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: 16,
    background: 'rgba(255,255,255,0.8)',
    backdropFilter: 'blur(10px)',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    '&:hover': {
      background: 'rgba(255,255,255,0.9)',
      transform: 'translateY(-2px)',
      boxShadow: '0 8px 25px rgba(102, 126, 234, 0.15)'
    },
    '&:hover .MuiOutlinedInput-notchedOutline': {
      borderColor: '#667eea',
      borderWidth: 2
    },
    '&.Mui-focused': {
      background: 'rgba(255,255,255,0.95)',
      transform: 'translateY(-4px)',
      boxShadow: '0 12px 35px rgba(102, 126, 234, 0.25)'
    },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
      borderColor: '#667eea',
      borderWidth: 3,
      boxShadow: '0 0 0 4px rgba(102, 126, 234, 0.1)'
    },
  },
  '& .MuiInputLabel-root': {
    fontWeight: 600,
    color: '#2c3e50'
  },
  '& .MuiInputLabel-root.Mui-focused': {
    color: '#667eea',
    fontWeight: 700
  }
}));

const StyledButton = styled(Button)(({ theme, color }) => ({
  background: `linear-gradient(135deg, ${color}, ${color}dd)`,
  color: '#fff',
  borderRadius: 16,
  padding: theme.spacing(2, 4),
  fontWeight: 800,
  fontSize: '1.1rem',
  textTransform: 'none',
  boxShadow: `0 12px 30px ${color}40`,
  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
  position: 'relative',
  overflow: 'hidden',
  backdropFilter: 'blur(10px)',
  border: `2px solid ${color}30`,
  '&:hover': {
    transform: 'translateY(-4px) scale(1.05)',
    boxShadow: `0 20px 40px ${color}50`,
    '&::before': {
      opacity: 1,
      transform: 'scale(1)'
    }
  },
  '&:active': {
    transform: 'translateY(-2px) scale(1.02)'
  },
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: `linear-gradient(45deg, transparent, rgba(255,255,255,0.3), transparent)`,
    transform: 'scale(0)',
    opacity: 0,
    transition: 'all 0.3s ease'
  },
  '& .MuiButton-startIcon': {
    fontSize: '1.3rem',
    filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))'
  }
}));

const SectionCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: 20,
  boxShadow: '0 12px 40px rgba(0,0,0,0.12)',
  border: '2px solid rgba(255,255,255,0.3)',
  marginBottom: theme.spacing(3),
  background: 'rgba(255,255,255,0.95)',
  backdropFilter: 'blur(20px)',
  position: 'relative',
  overflow: 'hidden',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 20px 50px rgba(0,0,0,0.15)',
    '&::before': {
      opacity: 1
    }
  },
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.05), rgba(118, 75, 162, 0.05))',
    opacity: 0,
    transition: 'opacity 0.3s ease',
    pointerEvents: 'none'
  }
}));

const CuentasCobrarRegistrationForm = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  
  // Estados para datos del formulario simplificado
  const [cuenta, setCuenta] = useState({
    // Información básica
    concepto: '',
    descripcion: '',
    monto_neto: '',
    monto_con_iva: '',
    requiere_iva: false,
    categoria: '',
    subcategoria: '',
    
    // Información de cliente
    cliente_id: '',
    cliente_nombre: '',
    cliente_rfc: '',
    
    // Fechas
    fecha: '',
    fecha_vencimiento: '',
    
    // Estado por defecto
    cobrado: false,
    autorizado: false
  });

  // Estados para datos de referencia
  const [clientes, setClientes] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [subcategorias, setSubcategorias] = useState([]);
  const [loadingData, setLoadingData] = useState(true);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Cargar datos iniciales
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoadingData(true);
        const [clientesRes, categoriasRes] = await Promise.all([
          axios.get('/api/clientes'),
          axios.get('/api/categorias')
        ]);
        
        // Asegurar que los datos sean arrays
        const clientesData = Array.isArray(clientesRes.data?.data) ? clientesRes.data.data : clientesRes.data;
        const categoriasData = Array.isArray(categoriasRes.data?.data) ? categoriasRes.data.data : categoriasRes.data;

        setClientes(clientesData);
        setCategorias(categoriasData);
        
        // Generar subcategorías basadas en categorías
        const subcats = [
          'Ventas', 'Servicios', 'Productos', 'Consultoría', 'Mantenimiento',
          'Capacitación', 'Marketing', 'Transporte', 'Alimentación', 'Hospedaje',
          'Software', 'Hardware', 'Otros'
        ];
        setSubcategorias(subcats);
        
      } catch (error) {
        console.error('Error cargando datos:', error);
        setSnackbar({
          open: true,
          message: 'Error cargando datos de referencia',
          severity: 'error'
        });
      } finally {
        setLoadingData(false);
      }
    };
    
    fetchData();
  }, []);

  // Manejar cambios en el formulario
  const handleChange = (field, value) => {
    setCuenta(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Manejar selección de cliente
  const handleClienteChange = (cliente) => {
    if (cliente) {
      setCuenta(prev => ({
        ...prev,
        cliente_id: cliente.id,
        cliente_nombre: cliente.nombre,
        cliente_rfc: cliente.rfc || ''
      }));
    } else {
      setCuenta(prev => ({
        ...prev,
        cliente_id: '',
        cliente_nombre: '',
        cliente_rfc: ''
      }));
    }
  };

  // Calcular IVA automáticamente
  const handleMontoNetoChange = (value) => {
    const montoNeto = parseFloat(value) || 0;
    const montoConIva = cuenta.requiere_iva ? montoNeto * 1.16 : montoNeto;
    
    setCuenta(prev => ({
      ...prev,
      monto_neto: value,
      monto_con_iva: montoConIva.toFixed(2)
    }));
  };

  // Manejar envío del formulario
  const handleSubmit = async () => {
    try {
      setLoading(true);
      
      // Validaciones básicas
      if (!cuenta.concepto || !cuenta.monto_con_iva || !cuenta.fecha) {
        setSnackbar({
          open: true,
          message: 'Por favor completa los campos obligatorios',
          severity: 'error'
        });
        return;
      }

      // Preparar datos para envío (solo campos esenciales)
      const cuentaData = {
        concepto: cuenta.concepto,
        descripcion: cuenta.descripcion,
        monto_neto: parseFloat(cuenta.monto_neto) || 0,
        monto_con_iva: parseFloat(cuenta.monto_con_iva) || 0,
        requiere_iva: cuenta.requiere_iva,
        categoria: cuenta.categoria,
        subcategoria: cuenta.subcategoria,
        cliente_id: cuenta.cliente_id || null,
        fecha: cuenta.fecha,
        fecha_vencimiento: cuenta.fecha_vencimiento || null,
        cobrado: false, // Siempre se crea como pendiente
        autorizado: false // Siempre se crea como no autorizada
      };

      const response = await axios.post('/api/cuentas-cobrar', cuentaData);
      
      setSnackbar({
        open: true,
        message: 'Cuenta por cobrar registrada exitosamente',
        severity: 'success'
      });

      // Limpiar formulario
      setCuenta({
        concepto: '',
        descripcion: '',
        monto_neto: '',
        monto_con_iva: '',
        requiere_iva: false,
        categoria: '',
        subcategoria: '',
        cliente_id: '',
        cliente_nombre: '',
        cliente_rfc: '',
        fecha: '',
        fecha_vencimiento: '',
        cobrado: false,
        autorizado: false
      });
      
      setActiveStep(0);

      // Recargar la tabla después de crear la cuenta
      if (window.refreshCuentasCobrar) {
        window.refreshCuentasCobrar();
      }

    } catch (error) {
      console.error('Error registrando cuenta:', error);
      setSnackbar({
        open: true,
        message: error.response?.data?.message || 'Error registrando la cuenta',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  // Pasos del formulario simplificados
  const steps = [
    {
      label: 'Información Básica',
      description: 'Datos principales de la cuenta',
      icon: <Assignment />
    },
    {
      label: 'Cliente',
      description: 'Seleccionar cliente',
      icon: <Business />
    },
    {
      label: 'Fechas',
      description: 'Fechas importantes',
      icon: <CalendarToday />
    }
  ];

  // Renderizar contenido del paso
  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <SectionCard>
            <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
              <Assignment sx={{ color: '#667eea' }} />
              Información Básica
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <StyledTextField
                  fullWidth
                  label="Concepto *"
                  value={cuenta.concepto}
                  onChange={(e) => handleChange('concepto', e.target.value)}
                  placeholder="Ej: Venta de productos para cliente X"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Description />
                      </InputAdornment>
                    )
                  }}
                />
              </Grid>
              
              <Grid item xs={12}>
                <StyledTextField
                  fullWidth
                  label="Descripción detallada"
                  value={cuenta.descripcion}
                  onChange={(e) => handleChange('descripcion', e.target.value)}
                  multiline
                  rows={3}
                  placeholder="Descripción detallada de la cuenta por cobrar..."
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <StyledTextField
                  fullWidth
                  label="Monto Neto *"
                  type="number"
                  value={cuenta.monto_neto}
                  onChange={(e) => handleMontoNetoChange(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <AttachMoney />
                      </InputAdornment>
                    )
                  }}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <StyledTextField
                  fullWidth
                  label="Monto con IVA"
                  type="number"
                  value={cuenta.monto_con_iva}
                  onChange={(e) => handleChange('monto_con_iva', e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LocalAtm />
                      </InputAdornment>
                    )
                  }}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Categoría *</InputLabel>
                  <Select
                    value={cuenta.categoria}
                    onChange={(e) => handleChange('categoria', e.target.value)}
                    label="Categoría"
                    startAdornment={<Category />}
                  >
                    {categorias.map(cat => (
                      <MenuItem key={cat.id || cat} value={cat.nombre || cat}>
                        {cat.nombre || cat}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Subcategoría</InputLabel>
                  <Select
                    value={cuenta.subcategoria}
                    onChange={(e) => handleChange('subcategoria', e.target.value)}
                    label="Subcategoría"
                  >
                    {subcategorias.map(subcat => (
                      <MenuItem key={subcat} value={subcat}>
                        {subcat}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={cuenta.requiere_iva}
                      onChange={(e) => handleChange('requiere_iva', e.target.checked)}
                    />
                  }
                  label="Requiere IVA (16%)"
                />
              </Grid>
            </Grid>
          </SectionCard>
        );

      case 1:
        return (
          <SectionCard>
            <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
              <Business sx={{ color: '#667eea' }} />
              Seleccionar Cliente
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Autocomplete
                  options={clientes}
                  getOptionLabel={(option) => option.nombre || ''}
                  value={clientes.find(c => c.id === cuenta.cliente_id) || null}
                  onChange={(event, newValue) => handleClienteChange(newValue)}
                  renderInput={(params) => (
                    <StyledTextField
                      {...params}
                      label="Seleccionar Cliente *"
                      placeholder="Buscar cliente..."
                    />
                  )}
                  renderOption={(props, option) => (
                    <Box component="li" {...props}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar sx={{ width: 32, height: 32, bgcolor: '#667eea' }}>
                          {option.nombre?.charAt(0) || '?'}
                        </Avatar>
                        <Box>
                          <Typography variant="body1" fontWeight={600}>
                            {option.nombre}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {option.rfc} • {option.email}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  )}
                />
              </Grid>
              
              {cuenta.cliente_id && (
                <Grid item xs={12}>
                  <Alert severity="info" sx={{ borderRadius: 2 }}>
                    <Typography variant="body2">
                      <strong>Cliente seleccionado:</strong> {cuenta.cliente_nombre}
                      {cuenta.cliente_rfc && ` (${cuenta.cliente_rfc})`}
                    </Typography>
                  </Alert>
                </Grid>
              )}
            </Grid>
          </SectionCard>
        );

      case 2:
        return (
          <SectionCard>
            <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
              <CalendarToday sx={{ color: '#667eea' }} />
              Fechas Importantes
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <StyledTextField
                  fullWidth
                  label="Fecha de la cuenta *"
                  type="date"
                  value={cuenta.fecha}
                  onChange={(e) => handleChange('fecha', e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  helperText="Fecha cuando se generó la cuenta"
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <StyledTextField
                  fullWidth
                  label="Fecha de vencimiento"
                  type="date"
                  value={cuenta.fecha_vencimiento}
                  onChange={(e) => handleChange('fecha_vencimiento', e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  helperText="Fecha límite para el cobro (opcional)"
                />
              </Grid>
              
              <Grid item xs={12}>
                <Alert severity="info" sx={{ borderRadius: 2 }}>
                  <Typography variant="body2">
                    <strong>Nota:</strong> La cuenta se creará como "Pendiente" por defecto. 
                    Podrás marcar como cobrada y agregar más detalles después desde la lista de cuentas.
                  </Typography>
                </Alert>
              </Grid>
            </Grid>
          </SectionCard>
        );

      default:
        return null;
    }
  };

  if (loadingData) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  return (
    <StyledCard>
      <CardContent>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" sx={{ 
            fontWeight: 700, 
            color: '#2c3e50', 
            textAlign: 'center',
            mb: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 2
          }}>
            <AccountBalance sx={{ fontSize: '2rem', color: '#667eea' }} />
            Registro de Cuentas por Cobrar
          </Typography>
          <Typography variant="body1" sx={{ textAlign: 'center', color: '#7f8c8d' }}>
            Complete todos los campos para registrar una nueva cuenta por cobrar
          </Typography>
        </Box>

        <Stepper activeStep={activeStep} orientation={isMobile ? 'vertical' : 'horizontal'}>
          {steps.map((step, index) => (
            <Step key={step.label}>
              <StepLabel
                icon={step.icon}
                sx={{
                  '& .MuiStepLabel-label': {
                    fontWeight: activeStep === index ? 600 : 400
                  }
                }}
              >
                {step.label}
              </StepLabel>
              {isMobile && (
                <StepContent>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {step.description}
                  </Typography>
                  {renderStepContent(index)}
                </StepContent>
              )}
            </Step>
          ))}
        </Stepper>

        {!isMobile && (
          <Box sx={{ mt: 4 }}>
            {renderStepContent(activeStep)}
          </Box>
        )}

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
          <Button
            disabled={activeStep === 0}
            onClick={() => setActiveStep(activeStep - 1)}
            variant="outlined"
            startIcon={<Cancel />}
            sx={{ borderRadius: 2 }}
          >
            Anterior
          </Button>
          
          <Box sx={{ display: 'flex', gap: 2 }}>
            {activeStep === steps.length - 1 ? (
              <StyledButton
                color="#27ae60"
                onClick={handleSubmit}
                disabled={loading}
                startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <Save />}
              >
                {loading ? 'Creando Cuenta...' : 'Crear Cuenta por Cobrar'}
              </StyledButton>
            ) : (
              <StyledButton
                color="#667eea"
                onClick={() => setActiveStep(activeStep + 1)}
                startIcon={<CheckCircle />}
              >
                Siguiente
              </StyledButton>
            )}
          </Box>
        </Box>

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
      </CardContent>
    </StyledCard>
  );
};

export default CuentasCobrarRegistrationForm;

