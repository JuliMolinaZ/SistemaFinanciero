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
    const modified = {};
    Object.keys(current).forEach(key => {
      // Solo incluir campos que realmente han cambiado
      if (current[key] !== original[key]) {
        // No enviar campos vacíos que podrían sobrescribir datos existentes
        if (current[key] !== '' && current[key] !== null && current[key] !== undefined) {
          modified[key] = current[key];
        }
      }
    });

    return modified;
  };

  // Estados del componente
  const [flows, setFlows] = useState([]);
  const [filteredFlows, setFilteredFlows] = useState([]);
  const [clients, setClients] = useState([]);
  const [projects, setProjects] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClient, setSelectedClient] = useState('');
  const [selectedProject, setSelectedProject] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [formData, setFormData] = useState({
    fecha: new Date().toISOString().split('T')[0],
    estado: 'pendiente',
    prioridad: 'media',
    recuperado: false
  });
  const [originalFlowData, setOriginalFlowData] = useState(null);
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

  }, [isPending]);

  return (
    <StyledContainer maxWidth="xl">
      <Box sx={{ position: 'relative', zIndex: 1 }}>
        <Grid container spacing={3}>
          {/* Header con botón de agregar */}
          <Grid item xs={12}>
            <Box sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 3
            }}>
              <Typography variant="h4" sx={{
                fontWeight: 700,
                color: '#fff',
                textShadow: '0 2px 4px rgba(0,0,0,0.3)'
              }}>
                Flow Recovery V2
              </Typography>
              <Button
                onClick={() => {
                  setIsEditing(false);
                  setEditingFlowId(null);
                  setFormData({
                    fecha: new Date().toISOString().split('T')[0],
                    estado: 'pendiente',
                    prioridad: 'media',
                    recuperado: false
                  });
                  setOpenFlowDialog(true);
                }}
                startIcon={<AddIcon />}

              >
                Nuevo Flow
              </Button>
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

                />
              </Grid>
              <Grid item xs={12} md={8}>
                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                  <IconButton
                    onClick={fetchFlows}

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
                          {filteredFlows.map((flow, index) => {

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

                                    size="small"
                                  />
                                </TableCell>
                                <TableCell>
                                  <StyledChip
                                    label={flow.recuperado ? 'Recuperado' : 'Pendiente'}

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

          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ p: 0 }}>
          <Box sx={{ p: 3 }}>
            <form onSubmit={(e) => {

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

          >
            Cancelar
          </Button>
          <Button
            onClick={() => {

              if (isEditing) {

                handleUpdateFlow();
              } else {

                handleCreateFlow();
              }
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

                  />
                  <StyledChip
                    label={viewingFlow.categoria || 'Sin categoría'}
                    status="default"
                    size="small"

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

          >
            Cerrar
          </Button>
          <Button
            onClick={() => {
              handleCloseViewDetails();
              handleEdit(viewingFlow);
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

        >
          {snackbar.message}
        </Alert>
      </Snackbar>
      </Box>
    </StyledContainer>
  );
};

export default FlowRecoveryV2Module;
