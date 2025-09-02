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
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Card,
  Badge,
  Switch,
  FormControlLabel,
  Skeleton,
  Fade,
  Zoom,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Add as AddIcon,
  Search as SearchIcon,
  Download as DownloadIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Visibility as VisibilityIcon,
  Business as BusinessIcon,
  People as PeopleIcon,
  AttachMoney as AttachMoneyIcon,
  TrendingUp as TrendingUpIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  LocationOn as LocationOnIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Refresh as RefreshIcon,
  AutoAwesome as AutoAwesomeIcon,
  VerifiedUser as VerifiedUserIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  ThumbUp as ThumbUpIcon,
  ThumbDown as ThumbDownIcon,
  Share as ShareIcon,
  Print as PrintIcon,
  ContentCopy as ContentCopyIcon,
  Link as LinkIcon,
  QrCode as QrCodeIcon,
  Code as CodeIcon,
  DataObject as DataObjectIcon,
  Storage as StorageIcon,
  Security as SecurityIcon,
  VpnKey as VpnKeyIcon,
  SupervisedUserCircle as SupervisedUserCircleIcon,
  Home as HomeIcon,
  Apartment as ApartmentIcon,
  Store as StoreIcon,
  LocalHospital as LocalHospitalIcon,
  LocalPolice as LocalPoliceIcon,
  LocalFireDepartment as LocalFireDepartmentIcon,
  LocalShipping as LocalShippingIcon,
  LocalTaxi as LocalTaxiIcon,
  LocalAirport as LocalAirportIcon,
  LocalHotel as LocalHotelIcon,
  LocalRestaurant as LocalRestaurantIcon,
  LocalBar as LocalBarIcon,
  LocalCafe as LocalCafeIcon,
  LocalGasStation as LocalGasStationIcon,
  LocalParking as LocalParkingIcon,
  LocalPhone as LocalPhoneIcon,
  LocalPrintshop as LocalPrintshopIcon,
  LocalPostOffice as LocalPostOfficeIcon,
  LocalLibrary as LocalLibraryIcon,
  LocalMall as LocalMallIcon,
  LocalMovies as LocalMoviesIcon,
  LocalTheater as LocalTheaterIcon,
  LocalConvenienceStore as LocalConvenienceStoreIcon,
  LocalFlorist as LocalFloristIcon,
  LocalPizza as LocalPizzaIcon,
  LocalLaundryService as LocalLaundryServiceIcon,
  LocalCarWash as LocalCarWashIcon,
  LocalAtm as LocalAtmIcon,
  LocalBank as LocalBankIcon,
  LocalOffer as LocalOfferIcon,
  LocalGroceryStore as LocalGroceryStoreIcon,
  LocalPharmacy as LocalPharmacyIcon
} from '@mui/icons-material';

// Importar los nuevos componentes ModernUI
import { ModernDataTable, ModernForm } from '../../components/ModernUI';

// ===== COMPONENTES ESTILIZADOS =====
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

// ===== CONFIGURACIÓN DE COLUMNAS PARA LA TABLA =====
const getTableColumns = () => [
  {
    field: 'avatar',
    header: 'Cliente',
    width: 12 / 6, // 2 columnas
    render: (value, row) => (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Avatar
          src={row.logo}
          sx={{
            width: 48,
            height: 48,
            background: row.tipo === 'empresa' 
              ? 'linear-gradient(135deg, #667eea, #764ba2)' 
              : row.tipo === 'gobierno'
              ? 'linear-gradient(135deg, #f093fb, #f5576c)'
              : 'linear-gradient(135deg, #4facfe, #00f2fe)'
          }}
        >
          {row.nombre?.charAt(0)?.toUpperCase() || 'C'}
        </Avatar>
        <Box>
          <Typography variant="body1" sx={{ fontWeight: 600, color: '#2c3e50' }}>
            {row.nombre}
          </Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary', fontStyle: 'italic' }}>
            {row.tipo === 'empresa' ? '🏢 Empresa' : 
             row.tipo === 'gobierno' ? '🏛️ Gobierno' : '👤 Persona Física'}
          </Typography>
        </Box>
      </Box>
    )
  },
  {
    field: 'contacto',
    header: 'Información de Contacto',
    width: 12 / 6, // 2 columnas
    render: (value, row) => (
      <Box>
        <Typography variant="body2" sx={{ fontWeight: 500, color: '#2c3e50' }}>
          {row.email}
        </Typography>
        {row.telefono && (
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            📞 {row.telefono}
          </Typography>
        )}
        {row.direccion && (
          <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
            📍 {row.direccion}
          </Typography>
        )}
        {row.website && (
          <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
            🌐 {row.website}
          </Typography>
        )}
      </Box>
    )
  },
  {
    field: 'fiscal',
    header: 'Información Fiscal',
    width: 12 / 6, // 2 columnas
    render: (value, row) => (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        <Chip
          label={`RFC: ${row.rfc || 'N/A'}`}
          size="small"
          variant="outlined"
          sx={{ 
            background: 'rgba(102, 126, 234, 0.1)',
            borderColor: 'rgba(102, 126, 234, 0.3)',
            color: '#667eea'
          }}
        />
        {row.regimen_fiscal && (
          <Chip
            label={row.regimen_fiscal}
            size="small"
            variant="outlined"
            sx={{ 
              background: 'rgba(76, 175, 80, 0.1)',
              borderColor: 'rgba(76, 175, 80, 0.3)',
              color: '#4caf50'
            }}
          />
        )}
        {row.actividad_economica && (
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            {row.actividad_economica}
          </Typography>
        )}
      </Box>
    )
  },
  {
    field: 'estado',
    header: 'Estado y Clasificación',
    width: 12 / 6, // 2 columnas
    render: (value, row) => (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        <Chip
          label={row.activo ? 'Activo' : 'Inactivo'}
          color={row.activo ? 'success' : 'default'}
          size="small"
        />
        {row.categoria && (
          <Chip
            label={row.categoria}
            size="small"
            variant="outlined"
            sx={{ 
              background: 'rgba(255, 193, 7, 0.1)',
              borderColor: 'rgba(255, 193, 7, 0.3)',
              color: '#ffc107'
            }}
          />
        )}
        {row.prioridad && (
          <Chip
            label={`Prioridad: ${row.prioridad}`}
            size="small"
            variant="outlined"
            sx={{ 
              background: row.prioridad === 'alta' ? 'rgba(244, 67, 54, 0.1)' :
                       row.prioridad === 'media' ? 'rgba(255, 193, 7, 0.1)' :
                       'rgba(76, 175, 80, 0.1)',
              borderColor: row.prioridad === 'alta' ? 'rgba(244, 67, 54, 0.3)' :
                          row.prioridad === 'media' ? 'rgba(255, 193, 7, 0.3)' :
                          'rgba(76, 175, 80, 0.3)',
              color: row.prioridad === 'alta' ? '#f44336' :
                     row.prioridad === 'media' ? '#ffc107' : '#4caf50'
            }}
          />
        )}
      </Box>
    )
  },
  {
    field: 'financiero',
    header: 'Información Financiera',
    width: 12 / 6, // 2 columnas
    render: (value, row) => (
      <Box>
        <Typography variant="body2" sx={{ fontWeight: 500, color: '#2c3e50' }}>
          Límite de Crédito: ${(row.limite_credito || 0).toLocaleString()}
        </Typography>
        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
          Saldo Actual: ${(row.saldo_actual || 0).toLocaleString()}
        </Typography>
        {row.condiciones_pago && (
          <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
            Condiciones: {row.condiciones_pago}
          </Typography>
        )}
        {row.ultimo_pago && (
          <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
            Último Pago: {new Date(row.ultimo_pago).toLocaleDateString()}
          </Typography>
        )}
      </Box>
    )
  },
  {
    field: 'estadisticas',
    header: 'Estadísticas',
    width: 12 / 6, // 2 columnas
    render: (value, row) => (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <StarIcon sx={{ fontSize: 16, color: '#ffc107' }} />
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            {row.rating || 0}/5
          </Typography>
        </Box>
        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
          Proyectos: {row.proyectos_completados || 0}
        </Typography>
        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
          Facturas: {row.facturas_emitidas || 0}
        </Typography>
        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
          Días de Crédito: {row.dias_credito || 0}
        </Typography>
      </Box>
    )
  }
];

// ===== CONFIGURACIÓN DE CAMPOS PARA EL FORMULARIO =====
const getFormFields = () => [
  {
    name: 'nombre',
    label: 'Nombre/Razón Social',
    type: 'text',
    required: true,
    width: 6,
    props: {
      startIcon: <BusinessIcon />,
      placeholder: 'Ingresa el nombre completo o razón social'
    }
  },
  {
    name: 'tipo',
    label: 'Tipo de Cliente',
    type: 'select',
    required: true,
    width: 6,
    props: {
      startIcon: <PeopleIcon />,
      options: [
        { value: 'empresa', label: '🏢 Empresa' },
        { value: 'gobierno', label: '🏛️ Gobierno' },
        { value: 'persona', label: '👤 Persona Física' }
      ]
    }
  },
  {
    name: 'rfc',
    label: 'RFC',
    type: 'text',
    required: true,
    width: 6,
    props: {
      startIcon: <VerifiedUserIcon />,
      placeholder: 'ABCD123456EFG'
    }
  },
  {
    name: 'email',
    label: 'Correo Electrónico',
    type: 'email',
    required: true,
    width: 6,
    props: {
      startIcon: <EmailIcon />,
      placeholder: 'cliente@empresa.com'
    }
  },
  {
    name: 'telefono',
    label: 'Teléfono',
    type: 'tel',
    width: 6,
    props: {
      startIcon: <PhoneIcon />,
      placeholder: '+52 55 1234 5678'
    }
  },
  {
    name: 'website',
    label: 'Sitio Web',
    type: 'text',
    width: 6,
    props: {
      startIcon: <LinkIcon />,
      placeholder: 'https://www.empresa.com'
    }
  },
  {
    name: 'direccion',
    label: 'Dirección',
    type: 'text',
    width: 6,
    props: {
      startIcon: <LocationOnIcon />,
      placeholder: 'Calle, Ciudad, Estado, CP'
    }
  },
  {
    name: 'pais',
    label: 'País',
    type: 'select',
    width: 6,
    props: {
      startIcon: <LocationOnIcon />,
      options: [
        { value: 'MX', label: '🇲🇽 México' },
        { value: 'US', label: '🇺🇸 Estados Unidos' },
        { value: 'CA', label: '🇨🇦 Canadá' },
        { value: 'ES', label: '🇪🇸 España' }
      ]
    }
  },
  {
    name: 'regimen_fiscal',
    label: 'Régimen Fiscal',
    type: 'select',
    width: 6,
    props: {
      startIcon: <BusinessIcon />,
      options: [
        { value: '601', label: '601 - General de Ley Personas Morales' },
        { value: '603', label: '603 - Personas Morales con Fines no Lucrativos' },
        { value: '605', label: '605 - Sueldos y Salarios e Ingresos Asimilados a Salarios' },
        { value: '606', label: '606 - Arrendamiento' },
        { value: '608', label: '608 - Demás ingresos' },
        { value: '609', label: '609 - Consolidación' },
        { value: '610', label: '610 - Residentes en el Extranjero sin Establecimiento Permanente' },
        { value: '611', label: '611 - Ingresos por Dividendos (socios y accionistas)' },
        { value: '612', label: '612 - Personas Físicas con Actividades Empresariales y Profesionales' },
        { value: '614', label: '614 - Ingresos por intereses' },
        { value: '616', label: '616 - Sin obligaciones fiscales' },
        { value: '620', label: '620 - Sociedades Cooperativas de Producción que optan por diferir sus ingresos' },
        { value: '621', label: '621 - Incorporación Fiscal' },
        { value: '622', label: '622 - Actividades Agrícolas, Ganaderas, Silvícolas y Pesqueras' },
        { value: '623', label: '623 - Opcional para Grupos de Sociedades' },
        { value: '624', label: '624 - Coordinados' },
        { value: '625', label: '625 - Régimen de las Actividades Empresariales con ingresos a través de Plataformas Tecnológicas' },
        { value: '626', label: '626 - Régimen Simplificado de Confianza' }
      ]
    }
  },
  {
    name: 'actividad_economica',
    label: 'Actividad Económica',
    type: 'text',
    width: 6,
    props: {
      startIcon: <WorkIcon />,
      placeholder: 'Comercio, Servicios, Manufactura...'
    }
  },
  {
    name: 'categoria',
    label: 'Categoría',
    type: 'select',
    width: 6,
    props: {
      startIcon: <StarIcon />,
      options: [
        { value: 'premium', label: '⭐ Premium' },
        { value: 'gold', label: '🥇 Gold' },
        { value: 'silver', label: '🥈 Silver' },
        { value: 'bronze', label: '🥉 Bronze' },
        { value: 'standard', label: '📋 Standard' }
      ]
    }
  },
  {
    name: 'prioridad',
    label: 'Prioridad',
    type: 'select',
    width: 6,
    props: {
      startIcon: <TrendingUpIcon />,
      options: [
        { value: 'alta', label: '🔴 Alta' },
        { value: 'media', label: '🟡 Media' },
        { value: 'baja', label: '🟢 Baja' }
      ]
    }
  },
  {
    name: 'limite_credito',
    label: 'Límite de Crédito',
    type: 'number',
    width: 6,
    props: {
      startIcon: <AttachMoneyIcon />,
      placeholder: '0.00',
      min: 0,
      step: 0.01
    }
  },
  {
    name: 'condiciones_pago',
    label: 'Condiciones de Pago',
    type: 'select',
    width: 6,
    props: {
      startIcon: <AttachMoneyIcon />,
      options: [
        { value: 'contado', label: '💰 Contado' },
        { value: '15_dias', label: '📅 15 días' },
        { value: '30_dias', label: '📅 30 días' },
        { value: '45_dias', label: '📅 45 días' },
        { value: '60_dias', label: '📅 60 días' },
        { value: '90_dias', label: '📅 90 días' }
      ]
    }
  },
  {
    name: 'dias_credito',
    label: 'Días de Crédito',
    type: 'number',
    width: 6,
    props: {
      startIcon: <CalendarTodayIcon />,
      placeholder: '0',
      min: 0,
      step: 1
    }
  },
  {
    name: 'activo',
    label: 'Cliente Activo',
    type: 'switch',
    width: 6,
    props: {
      startIcon: <VerifiedUserIcon />
    }
  },
  {
    name: 'observaciones',
    label: 'Observaciones',
    type: 'textarea',
    width: 12,
    props: {
      rows: 3,
      placeholder: 'Notas adicionales sobre el cliente...'
    }
  }
];

// ===== COMPONENTE PRINCIPAL =====
const ClientModuleV2 = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  // ===== ESTADOS PRINCIPALES =====
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  
  // ===== CONFIGURACIONES =====
  const tableColumns = useMemo(() => getTableColumns(), []);
  const formFields = useMemo(() => getFormFields(), []);
  
  // ===== EFECTOS =====
  useEffect(() => {
    fetchClients();
  }, []);
  
  // ===== FUNCIONES DE API =====
  const fetchClients = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.get('/api/clientes');
      setClients(response.data);
    } catch (err) {
      setError('Error al cargar los clientes');
      setSnackbar({
        open: true,
        message: 'Error al cargar los clientes',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  }, []);
  
  const createClient = useCallback(async (clientData) => {
    try {
      const response = await axios.post('/api/clientes', clientData);
      setClients(prev => [...prev, response.data]);
      setShowForm(false);
      setSnackbar({
        open: true,
        message: 'Cliente creado exitosamente',
        severity: 'success'
      });
    } catch (err) {
      setSnackbar({
        open: true,
        message: 'Error al crear el cliente',
        severity: 'error'
      });
      throw err;
    }
  }, []);
  
  const updateClient = useCallback(async (clientData) => {
    try {
      const response = await axios.put(`/api/clientes/${clientData.id}`, clientData);
      setClients(prev => prev.map(client => 
        client.id === clientData.id ? response.data : client
      ));
      setShowForm(false);
      setEditingClient(null);
      setSnackbar({
        open: true,
        message: 'Cliente actualizado exitosamente',
        severity: 'success'
      });
    } catch (err) {
      setSnackbar({
        open: true,
        message: 'Error al actualizar el cliente',
        severity: 'error'
      });
      throw err;
    }
  }, []);
  
  const deleteClient = useCallback(async (client) => {
    try {
      await axios.delete(`/api/clientes/${client.id}`);
      setClients(prev => prev.filter(c => c.id !== client.id));
      setSnackbar({
        open: true,
        message: 'Cliente eliminado exitosamente',
        severity: 'success'
      });
    } catch (err) {
      setSnackbar({
        open: true,
        message: 'Error al eliminar el cliente',
        severity: 'error'
      });
    }
  }, []);
  
  // ===== MANEJADORES DE EVENTOS =====
  const handleCreateClient = useCallback(() => {
    setEditingClient(null);
    setShowForm(true);
  }, []);
  
  const handleEditClient = useCallback((client) => {
    setEditingClient(client);
    setShowForm(true);
  }, []);
  
  const handleViewClient = useCallback((client) => {
    // Implementar vista detallada del cliente
  }, []);
  
  const handleFormSubmit = useCallback(async (formData) => {
    try {
      if (editingClient) {
        await updateClient({ ...formData, id: editingClient.id });
      } else {
        await createClient(formData);
      }
    } catch (error) {
      // El error ya se maneja en las funciones individuales
    }
  }, [editingClient, createClient, updateClient]);
  
  const handleFormCancel = useCallback(() => {
    setShowForm(false);
    setEditingClient(null);
  }, []);
  
  const handleFormReset = useCallback(() => {
    // Implementar reset del formulario
  }, []);
  
  const handleAutoSave = useCallback(async (formData) => {
    try {
      if (editingClient) {
        await updateClient({ ...formData, id: editingClient.id });
      }
    } catch (error) {
      // Auto-save error handled silently
    }
  }, [editingClient, updateClient]);
  
  // ===== VALORES INICIALES DEL FORMULARIO =====
  const getInitialValues = useCallback(() => {
    if (editingClient) {
      return {
        nombre: editingClient.nombre || '',
        tipo: editingClient.tipo || 'empresa',
        rfc: editingClient.rfc || '',
        email: editingClient.email || '',
        telefono: editingClient.telefono || '',
        website: editingClient.website || '',
        direccion: editingClient.direccion || '',
        pais: editingClient.pais || 'MX',
        regimen_fiscal: editingClient.regimen_fiscal || '',
        actividad_economica: editingClient.actividad_economica || '',
        categoria: editingClient.categoria || 'standard',
        prioridad: editingClient.prioridad || 'media',
        limite_credito: editingClient.limite_credito || 0,
        condiciones_pago: editingClient.condiciones_pago || 'contado',
        dias_credito: editingClient.dias_credito || 0,
        activo: editingClient.activo !== undefined ? editingClient.activo : true,
        observaciones: editingClient.observaciones || ''
      };
    }
    
    return {
      nombre: '',
      tipo: 'empresa',
      rfc: '',
      email: '',
      telefono: '',
      website: '',
      direccion: '',
      pais: 'MX',
      regimen_fiscal: '',
      actividad_economica: '',
      categoria: 'standard',
      prioridad: 'media',
      limite_credito: 0,
      condiciones_pago: 'contado',
      dias_credito: 0,
      activo: true,
      observaciones: ''
    };
  }, [editingClient]);
  
  return (
    <StyledContainer maxWidth="xl">
      {/* ===== HEADER PRINCIPAL ===== */}
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Typography variant="h3" sx={{ 
            fontWeight: 800, 
            color: '#fff',
            mb: 2,
            textShadow: '0 2px 4px rgba(0,0,0,0.3)'
          }}>
            🏢 Gestión de Clientes
          </Typography>
          <Typography variant="h6" sx={{ 
            color: 'rgba(255,255,255,0.9)',
            fontWeight: 400
          }}>
            Administra clientes, contactos y relaciones comerciales
          </Typography>
        </motion.div>
      </Box>
      
      {/* ===== TABLA PRINCIPAL ===== */}
      <StyledCard sx={{ mb: 4 }}>
        <ModernDataTable
          data={clients}
          loading={loading}
          error={error}
          columns={tableColumns}
          enableFilters={true}
          enableSearch={true}
          enableQuickFilters={true}
          enableActions={true}
          enableSelection={true}
          enableExport={true}
          enablePagination={true}
          pageSize={10}
          variant="elevated"
          onEdit={handleEditClient}
          onDelete={deleteClient}
          onView={handleViewClient}
          onRefresh={fetchClients}
          onCreate={handleCreateClient}
          emptyStateConfig={{
            title: "No hay clientes registrados",
            subtitle: "Comienza agregando el primer cliente al sistema",
            icon: <BusinessIcon />
          }}
          loadingConfig={{
            rows: 8,
            columns: 6
          }}
        />
      </StyledCard>
      
      {/* ===== FORMULARIO MODAL ===== */}
      <Dialog
        open={showForm}
        onClose={handleFormCancel}
        maxWidth="md"
        fullWidth
        fullScreen={isMobile}
        TransitionComponent={Zoom}
      >
        <DialogTitle sx={{ 
          background: 'linear-gradient(135deg, #667eea, #764ba2)',
          color: '#fff',
          textAlign: 'center'
        }}>
          {editingClient ? '✏️ Editar Cliente' : '➕ Crear Nuevo Cliente'}
        </DialogTitle>
        
        <DialogContent sx={{ p: 0 }}>
          <ModernForm
            fields={formFields}
            initialValues={getInitialValues()}
            onSubmit={handleFormSubmit}
            onCancel={handleFormCancel}
            onReset={handleFormReset}
            onSave={handleFormSubmit}
            onAutoSave={editingClient ? handleAutoSave : false}
            autoSaveInterval={30000}
            variant="card"
            layout="grid"
            columns={2}
            spacing={3}
            title={editingClient ? 'Editar Cliente' : 'Nuevo Cliente'}
            subtitle={editingClient ? 'Modifica la información del cliente' : 'Completa la información del nuevo cliente'}
            submitText={editingClient ? 'Actualizar' : 'Crear'}
            saveText="Guardar Cambios"
            cancelText="Cancelar"
            resetText="Limpiar"
          />
        </DialogContent>
      </Dialog>
      
      {/* ===== NOTIFICACIONES ===== */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
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

export default ClientModuleV2;
