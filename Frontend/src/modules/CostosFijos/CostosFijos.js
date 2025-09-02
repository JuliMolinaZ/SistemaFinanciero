// src/modules/CostosFijos/CostosFijos.jsx
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import axios from 'axios';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Grid,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tooltip,
  Snackbar,
  Alert,
  Chip,
  Avatar,
  Card,
  CardContent,
  Skeleton,
  InputAdornment,
  Collapse,
  Fade,
  Zoom
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
  LabelList,
  ReferenceLine,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import ExportButton from '../../components/ExportButton';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import RefreshIcon from '@mui/icons-material/Refresh';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SendIcon from '@mui/icons-material/Send';
import VisibilityIcon from '@mui/icons-material/Visibility';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import ScheduleIcon from '@mui/icons-material/Schedule';
import BusinessIcon from '@mui/icons-material/Business';
import CloseIcon from '@mui/icons-material/Close';
import DownloadIcon from '@mui/icons-material/Download';

// Configuración de axios
const API_BASE = 'http://localhost:5001';

// Formateadores de moneda
const formatterMXN = new Intl.NumberFormat('es-MX', {
  style: 'currency',
  currency: 'MXN',
  minimumFractionDigits: 2,
});
const formatterUSD = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
});

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

const StyledChip = styled(Chip)(({ theme, status }) => ({
  borderRadius: 8,
  fontWeight: 600,
  fontSize: '0.75rem',
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
  background: status === 'sent' 
    ? 'linear-gradient(135deg, #27ae60, #2ecc71)' 
    : 'linear-gradient(135deg, #e74c3c, #c0392b)',
  color: '#fff',
  boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
  '&:hover': {
    transform: 'translateY(-1px)',
    boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
  }
}));

// Componente de skeleton optimizado
const CostoRowSkeleton = React.memo(() => (
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
      <Skeleton variant="text" width={120} height={20} />
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

// Tooltip personalizado para la gráfica
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <Box
        sx={{
          backgroundColor: 'rgba(255,255,255,0.95)',
          border: '1px solid #ccc',
          p: 1,
          borderRadius: 1,
          boxShadow: 1,
        }}
      >
        <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
          {label}
        </Typography>
        {payload.map((entry, index) => (
          <Typography key={`item-${index}`} sx={{ color: entry.color }}>
            {entry.name}: {formatterMXN.format(entry.value)}
          </Typography>
        ))}
      </Box>
    );
  }
  return null;
};

// Componente de la gráfica moderna
const ChartComponent = ({ dataGrafica, totalCostos, porcentajeUtilidad }) => (
  <StyledCard sx={{ p: 3, mb: 3 }}>
    <Typography variant="h6" sx={{ fontWeight: 700, color: '#2c3e50', mb: 2, textAlign: 'center' }}>
      Análisis de Costos Fijos
    </Typography>
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={dataGrafica} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
        <defs>
          <linearGradient id="colorCostosFijos" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#667eea" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#667eea" stopOpacity={0.3} />
          </linearGradient>
          <linearGradient id="colorCostosFijosUtilidad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#27ae60" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#27ae60" stopOpacity={0.3} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.1)" />
        <XAxis dataKey="name" tick={{ fill: "#2c3e50", fontSize: 12 }} />
        <YAxis tick={{ fill: "#2c3e50", fontSize: 12 }}>
          <text
            x={-50}
            y={10}
            angle={-90}
            textAnchor="middle"
            fill="#2c3e50"
            fontSize="12px"
          >
            Monto en MXN
          </text>
        </YAxis>
        <RechartsTooltip 
          content={<CustomTooltip />}
          cursor={{ fill: 'rgba(102, 126, 234, 0.1)' }}
        />
        <Legend verticalAlign="top" height={36} />
        <Bar
          dataKey="Costos Fijos"
          fill="url(#colorCostosFijos)"
          animationDuration={1500}
          radius={[8, 8, 0, 0]}
        >
          <LabelList dataKey="Costos Fijos" position="top" formatter={(value) => formatterMXN.format(value)} />
        </Bar>
        <Bar
          dataKey="Costos Fijos + Utilidad"
          fill="url(#colorCostosFijosUtilidad)"
          animationDuration={1500}
          radius={[8, 8, 0, 0]}
        >
          <LabelList dataKey="Costos Fijos + Utilidad" position="top" formatter={(value) => formatterMXN.format(value)} />
        </Bar>
        {totalCostos > 0 && (
          <ReferenceLine
            y={totalCostos}
            stroke="#e74c3c"
            strokeDasharray="3 3"
            strokeWidth={2}
            label={{
              position: 'insideTopRight',
              value: `Total: ${formatterMXN.format(totalCostos)}`,
              fill: '#e74c3c',
              fontSize: 11,
              fontWeight: 'bold',
            }}
          />
        )}
      </BarChart>
    </ResponsiveContainer>
  </StyledCard>
);

// Componente para mostrar totales y utilidad moderna
const TotalsComponent = ({ totalCostos, porcentajeUtilidad, setPorcentajeUtilidad, resultadoUtilidad }) => (
  <Grid container spacing={3} sx={{ mb: 3 }}>
    <Grid item xs={12} md={4}>
      <StyledCard sx={{ p: 3, textAlign: 'center' }}>
        <Box sx={{ color: '#667eea', mb: 2 }}>
          <AttachMoneyIcon sx={{ fontSize: '3rem' }} />
        </Box>
        <Typography variant="h4" sx={{ fontWeight: 800, color: '#2c3e50', mb: 1 }}>
          {formatterMXN.format(totalCostos)}
        </Typography>
        <Typography variant="body2" sx={{ color: '#7f8c8d', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          Total Costos Fijos
        </Typography>
      </StyledCard>
    </Grid>
    
    <Grid item xs={12} md={4}>
      <StyledCard sx={{ p: 3, textAlign: 'center' }}>
        <Box sx={{ color: '#27ae60', mb: 2 }}>
          <TrendingUpIcon sx={{ fontSize: '3rem' }} />
        </Box>
        <Typography variant="h4" sx={{ fontWeight: 800, color: '#2c3e50', mb: 1 }}>
          {formatterMXN.format(resultadoUtilidad)}
        </Typography>
        <Typography variant="body2" sx={{ color: '#7f8c8d', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          Utilidad ({porcentajeUtilidad}%)
        </Typography>
      </StyledCard>
    </Grid>
    
    <Grid item xs={12} md={4}>
      <StyledCard sx={{ p: 3, textAlign: 'center' }}>
        <Box sx={{ color: '#f39c12', mb: 2 }}>
          <AccountBalanceIcon sx={{ fontSize: '3rem' }} />
        </Box>
        <Typography variant="h4" sx={{ fontWeight: 800, color: '#2c3e50', mb: 1 }}>
          {formatterMXN.format(totalCostos + resultadoUtilidad)}
        </Typography>
        <Typography variant="body2" sx={{ color: '#7f8c8d', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          Total + Utilidad
        </Typography>
      </StyledCard>
    </Grid>
    
    <Grid item xs={12}>
      <StyledCard sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="h6" sx={{ fontWeight: 700, color: '#2c3e50', mb: 2 }}>
          Configurar Porcentaje de Utilidad
        </Typography>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Porcentaje de Utilidad</InputLabel>
          <Select
            value={porcentajeUtilidad}
            label="Porcentaje de Utilidad"
            onChange={(e) => setPorcentajeUtilidad(Number(e.target.value))}
          >
            {[30, 40, 50, 60, 80, 100, 120].map((porcentaje) => (
              <MenuItem key={porcentaje} value={porcentaje}>
                {porcentaje}%
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </StyledCard>
    </Grid>
  </Grid>
);

// Componente del formulario moderno
const FixedCostFormDialog = ({ open, onClose, isEditing, formData, onChange, onSubmit }) => (
  <Dialog 
    open={open} 
    onClose={onClose} 
    fullWidth 
    maxWidth="md"
    PaperProps={{
      sx: {
        borderRadius: 3,
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      }
    }}
  >
    <DialogTitle sx={{ fontWeight: 700, color: '#2c3e50', textAlign: 'center' }}>
      {isEditing ? 'Actualizar Costo Fijo' : 'Registrar Nuevo Costo Fijo'}
    </DialogTitle>
    <DialogContent>
      <Box component="form" onSubmit={onSubmit} sx={{ mt: 2 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextField
              label="Colaborador"
              name="colaborador"
              value={formData.colaborador}
              onChange={onChange}
              fullWidth
              required
              variant="outlined"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <BusinessIcon color="action" />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              label="Puesto"
              name="puesto"
              value={formData.puesto}
              onChange={onChange}
              fullWidth
              required
              variant="outlined"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <AccountBalanceIcon color="action" />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              label="Monto en USD"
              name="monto_usd"
              type="number"
              value={formData.monto_usd}
              onChange={onChange}
              fullWidth
              required
              inputProps={{ step: "0.01", min: "0" }}
              variant="outlined"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <AttachMoneyIcon color="action" />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              label="Fecha"
              name="fecha"
              type="date"
              value={formData.fecha}
              onChange={onChange}
              fullWidth
              required
              InputLabelProps={{ shrink: true }}
              variant="outlined"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <ScheduleIcon color="action" />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Comentarios"
              name="comentarios"
              value={formData.comentarios}
              onChange={onChange}
              fullWidth
              multiline
              rows={3}
              variant="outlined"
              placeholder="Agregar comentarios adicionales sobre el costo fijo..."
            />
          </Grid>
        </Grid>
      </Box>
    </DialogContent>
    <DialogActions sx={{ p: 3, justifyContent: 'center', gap: 2 }}>
      <Button
        variant="outlined"
        onClick={onClose}
        sx={{
          border: '1px solid rgba(102, 126, 234, 0.3)',
          color: '#667eea',
          px: 3,
          '&:hover': {
            borderColor: '#667eea',
            background: 'rgba(102, 126, 234, 0.05)'
          }
        }}
      >
        Cancelar
      </Button>
      <Button
        type="submit"
        onClick={onSubmit}
        variant="contained"
        sx={{
          background: 'linear-gradient(135deg, #667eea, #764ba2)',
          color: '#fff',
          px: 4,
          py: 1.5,
          fontWeight: 'bold',
          borderRadius: 2,
          '&:hover': {
            background: 'linear-gradient(135deg, #5a6fd8, #6a4190)',
            transform: 'translateY(-2px)',
            boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)'
          }
        }}
      >
        {isEditing ? 'Actualizar' : 'Crear Costo Fijo'}
      </Button>
    </DialogActions>
  </Dialog>
);

// Componente para la tabla de costos fijos moderna
const FixedCostTable = ({ costosFijos, handleEdit, handleDelete, handleEnviarACuenta, loading, totalRegistros }) => (
  <StyledCard>
    <Box sx={{ p: 3, borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
      <Typography variant="h6" sx={{ fontWeight: 700, color: '#2c3e50' }}>
        Lista de Costos Fijos
      </Typography>
      <Typography variant="body2" sx={{ color: '#7f8c8d', mt: 0.5 }}>
        {totalRegistros} costos registrados
      </Typography>
    </Box>
    
    <StyledTableContainer>
      <StyledTable>
        <TableHead>
          <TableRow>
            <TableCell>COLABORADOR</TableCell>
            <TableCell>PUESTO</TableCell>
            <TableCell>MONTO USD</TableCell>
            <TableCell>MONTO MXN</TableCell>
            <TableCell>IMPUESTOS</TableCell>
            <TableCell>COMENTARIOS</TableCell>
            <TableCell>FECHA</TableCell>
            <TableCell align="center">ACCIONES</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {loading ? (
            Array.from({ length: 5 }).map((_, index) => (
              <CostoRowSkeleton key={index} />
            ))
          ) : (
            <AnimatePresence>
              {costosFijos && costosFijos.length > 0 ? costosFijos.map((costo, index) => (
                <motion.tr
                  key={costo.id}
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
                        {costo.colaborador?.charAt(0)?.toUpperCase() || 'C'}
                      </Avatar>
                      <Box>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#2c3e50' }}>
                          {costo.colaborador}
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#7f8c8d' }}>
                          ID: {costo.id}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {costo.puesto}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: '#27ae60' }}>
                      {formatterUSD.format(costo.monto_usd)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: '#f39c12' }}>
                      {formatterMXN.format(costo.monto_mxn)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: '#e74c3c' }}>
                      {formatterMXN.format(costo.impuestos_imss)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ color: '#7f8c8d', maxWidth: 200 }}>
                      {costo.comentarios || 'Sin comentarios'}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ color: '#7f8c8d' }}>
                      {new Date(costo.fecha).toLocaleDateString('es-MX')}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 0.5 }}>
                      <Tooltip title="Enviar a Cuentas por Pagar">
                        <span>
                          <ActionButton
                            color={costo.cuenta_creada ? "#95a5a6" : "#27ae60"}
                            onClick={() => handleEnviarACuenta(costo)}
                            disabled={costo.cuenta_creada}
                          >
                            <SendIcon fontSize="small" />
                          </ActionButton>
                        </span>
                      </Tooltip>
                      <Tooltip title="Editar costo">
                        <ActionButton
                          color="#f39c12"
                          onClick={() => handleEdit(costo)}
                        >
                          <EditIcon fontSize="small" />
                        </ActionButton>
                      </Tooltip>
                      <Tooltip title="Eliminar costo">
                        <ActionButton
                          color="#e74c3c"
                          onClick={() => handleDelete(costo.id)}
                        >
                          <DeleteIcon fontSize="small" />
                        </ActionButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </motion.tr>
              )) : (
                <TableRow>
                  <TableCell colSpan={8} align="center">
                    <Typography variant="body2" color="textSecondary">
                      No hay costos fijos registrados
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </AnimatePresence>
          )}
        </TableBody>
      </StyledTable>
    </StyledTableContainer>
  </StyledCard>
);

const CostosFijos = () => {
  const [costosFijos, setCostosFijos] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingCostoId, setEditingCostoId] = useState(null);
  const [formData, setFormData] = useState({
    colaborador: '',
    puesto: '',
    monto_usd: '',
    comentarios: '',
    fecha: '',
  });
  const [mesFiltro, setMesFiltro] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const tipoCambio = 20;
  const [porcentajeUtilidad, setPorcentajeUtilidad] = useState(40);
  const [resultadoUtilidad, setResultadoUtilidad] = useState(0);
  const [totalCostos, setTotalCostos] = useState(0);
  const [loading, setLoading] = useState(true);

  // Estado para notificaciones
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') return;
    setSnackbar({ ...snackbar, open: false });
  };

  useEffect(() => {
    console.log('🚀 Componente CostosFijos montado, llamando a fetchCostosFijos...');
    fetchCostosFijos();
  }, [mesFiltro]);

  useEffect(() => {
    console.log('📊 Estado costosFijos actualizado:', costosFijos.length, 'registros');
  }, [costosFijos]);

  useEffect(() => {
    calcularUtilidad();
  }, [costosFijos, porcentajeUtilidad]);

  const fetchCostosFijos = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE}/api/costos-fijos`, {
        params: { mes: mesFiltro },
      });
      
      // Verificar que la respuesta tenga la estructura correcta
      if (response.data.success && response.data.data) {
        const costos = response.data.data.map((costo) => ({
          ...costo,
          monto_mxn: parseFloat(costo.monto_mxn) || 0,
          monto_usd: parseFloat(costo.monto_usd) || 0,
          impuestos_imss: parseFloat(costo.impuestos_imss) || 0,
          cuenta_creada: costo.cuenta_creada,
        }));
        setCostosFijos(costos);
        console.log('✅ Costos fijos cargados:', costos.length, 'registros');
      } else {
        console.error('❌ Respuesta de API inválida:', response.data);
        setSnackbar({ open: true, message: 'Error en la estructura de datos de la API.', severity: 'error' });
      }
    } catch (error) {
      console.error('❌ Error al obtener costos fijos:', error.response?.data || error.message);
      setSnackbar({ open: true, message: 'Error al obtener costos fijos.', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const toggleForm = () => {
    setShowForm((prev) => !prev);
    if (showForm) {
      setFormData({
        colaborador: '',
        puesto: '',
        monto_usd: '',
        comentarios: '',
        fecha: '',
      });
      setIsEditing(false);
      setEditingCostoId(null);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const monto_usd = parseFloat(formData.monto_usd) || 0;
    const monto_mxn = monto_usd * tipoCambio;
    const impuestos_imss = monto_mxn * 0.35;
    try {
      if (isEditing) {
        await axios.put(`${API_BASE}/api/costos-fijos/${editingCostoId}`, {
          ...formData,
          monto_usd,
          monto_mxn,
          impuestos_imss,
        });
        setSnackbar({ open: true, message: 'Costo fijo actualizado exitosamente.', severity: 'success' });
      } else {
        await axios.post(`${API_BASE}/api/costos-fijos`, {
          ...formData,
          monto_usd,
          monto_mxn,
          impuestos_imss,
        });
        setSnackbar({ open: true, message: 'Costo fijo registrado exitosamente.', severity: 'success' });
      }
      fetchCostosFijos();
      toggleForm();
    } catch (error) {
      console.error('Error al enviar el formulario:', error.response?.data || error.message);
      setSnackbar({ open: true, message: 'Error al enviar el formulario.', severity: 'error' });
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm('¿Estás seguro de que quieres eliminar este costo fijo?');
    if (!confirmDelete) return;
    try {
      await axios.delete(`${API_BASE}/api/costos-fijos/${id}`);
      setCostosFijos(prev => prev.filter(costo => costo.id !== id));
      setSnackbar({ open: true, message: 'Costo fijo eliminado exitosamente.', severity: 'success' });
    } catch (error) {
      console.error('Error al eliminar el costo fijo:', error.response?.data || error.message);
      setSnackbar({ open: true, message: 'Error al eliminar el costo fijo.', severity: 'error' });
    }
  };

  const handleEdit = (costo) => {
    setIsEditing(true);
    setEditingCostoId(costo.id);
    setFormData({
      colaborador: costo.colaborador,
      puesto: costo.puesto,
      monto_usd: costo.monto_usd,
      comentarios: costo.comentarios,
      fecha: costo.fecha,
    });
    setShowForm(true);
  };

  const handleEnviarACuenta = async (costo) => {
    if (costo.cuenta_creada) return;
    try {
      const response = await axios.post(`${API_BASE}/api/costos-fijos/${costo.id}/enviar`);
      setSnackbar({ open: true, message: response.data.message, severity: 'success' });
      // Actualizar el estado local para marcar este costo como enviado
      setCostosFijos(costosFijos.map(item => item.id === costo.id ? { ...item, cuenta_creada: 1 } : item));
    } catch (error) {
      console.error('Error al enviar a cuentas por pagar:', error.response?.data || error.message);
      setSnackbar({ open: true, message: 'Error al enviar a cuentas por pagar', severity: 'error' });
    }
  };

  const calcularUtilidad = () => {
    const total = costosFijos.reduce((acc, costo) => acc + (isNaN(costo.monto_mxn) ? 0 : costo.monto_mxn), 0);
    setTotalCostos(total);
    const utilidad = total * (porcentajeUtilidad / 100);
    setResultadoUtilidad(utilidad);
  };

  // Filtrado de costos fijos
  const costosFiltrados = useMemo(() => {
    let filtered = costosFijos || [];

    // Filtro por búsqueda
    if (searchTerm) {
      filtered = filtered.filter(costo =>
        costo.colaborador?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        costo.puesto?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filtered;
  }, [costosFijos, searchTerm]);

  const dataGrafica =
    costosFiltrados.length > 0
      ? [
          {
            name: mesFiltro ? `Mes ${mesFiltro}` : 'Total',
            'Costos Fijos': totalCostos,
            'Costos Fijos + Utilidad': totalCostos + resultadoUtilidad,
          },
        ]
      : [];

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
                  Costos Fijos
                </Typography>
                <Typography variant="h6" sx={{ 
                  color: 'rgba(255,255,255,0.8)',
                  fontWeight: 400
                }}>
                  Gestiona los costos fijos de la empresa y analiza la rentabilidad
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', gap: 2 }}>
                <IconButton
                  onClick={fetchCostosFijos}
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
                
                <IconButton
                  onClick={toggleForm}
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
                  Nuevo Costo
                </IconButton>
                
                <ExportButton 
                  modules={[
                    { id: 'costos-fijos', name: 'Costos Fijos', description: 'Información de costos fijos y colaboradores' }
                  ]}
                  onExport={async (exportData) => {
                    console.log('Exportando costos fijos:', exportData);
                    
                    try {
                      // Preguntar al usuario si quiere exportar solo los filtrados o todos
                      const exportFiltered = window.confirm(
                        `¿Qué quieres exportar?\n\n` +
                        `• Solo costos filtrados (${costosFiltrados.length} costos)\n` +
                        `• Todos los costos (${costosFijos.length} costos)\n\n` +
                        `Haz clic en "Aceptar" para exportar solo los filtrados, o "Cancelar" para exportar todos.`
                      );
                      
                      // Usar los datos filtrados o todos según la elección del usuario
                      const costosData = exportFiltered ? costosFiltrados : costosFijos;
                      
                      if (costosData.length === 0) {
                        setSnackbar({ 
                          open: true, 
                          message: 'No hay costos fijos para exportar', 
                          severity: 'warning' 
                        });
                        return;
                      }
                      
                      // Crear contenido del archivo según el formato
                      let content, filename, mimeType;
                      
                      if (exportData.format === 'csv') {
                        const headers = ['ID', 'Colaborador', 'Puesto', 'Monto USD', 'Monto MXN', 'Impuestos IMSS', 'Fecha', 'Comentarios', 'Cuenta Creada'];
                        const csvContent = [
                          headers.join(','),
                          ...costosData.map(costo => [
                            costo.id,
                            (costo.colaborador || '').replace(/,/g, ';'),
                            (costo.puesto || '').replace(/,/g, ';'),
                            costo.monto_usd || '',
                            costo.monto_mxn || '',
                            costo.impuestos_imss || '',
                            costo.fecha ? new Date(costo.fecha).toLocaleDateString() : '',
                            (costo.comentarios || '').replace(/,/g, ';'),
                            costo.cuenta_creada ? 'Sí' : 'No'
                          ].join(','))
                        ].join('\n');
                        
                        content = csvContent;
                        filename = `costos_fijos_${new Date().toISOString().split('T')[0]}.csv`;
                        mimeType = 'text/csv';
                      } else if (exportData.format === 'excel') {
                        const headers = ['ID', 'Colaborador', 'Puesto', 'Monto USD', 'Monto MXN', 'Impuestos IMSS', 'Fecha', 'Comentarios', 'Cuenta Creada'];
                        const tsvContent = [
                          headers.join('\t'),
                          ...costosData.map(costo => [
                            costo.id,
                            (costo.colaborador || '').replace(/\t/g, ' '),
                            (costo.puesto || '').replace(/\t/g, ' '),
                            costo.monto_usd || '',
                            costo.monto_mxn || '',
                            costo.impuestos_imss || '',
                            costo.fecha ? new Date(costo.fecha).toLocaleDateString() : '',
                            (costo.comentarios || '').replace(/\t/g, ' '),
                            costo.cuenta_creada ? 'Sí' : 'No'
                          ].join('\t'))
                        ].join('\n');
                        
                        content = tsvContent;
                        filename = `costos_fijos_${new Date().toISOString().split('T')[0]}.tsv`;
                        mimeType = 'text/tab-separated-values';
                      } else {
                        const htmlContent = `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reporte de Costos Fijos</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #333; padding-bottom: 20px; }
        .costo-section { margin-bottom: 30px; border: 1px solid #ddd; padding: 15px; border-radius: 8px; }
        .costo-title { font-size: 18px; font-weight: bold; color: #333; margin-bottom: 15px; }
        .costo-details { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
        .detail-item { margin-bottom: 8px; }
        .detail-label { font-weight: bold; color: #666; }
    </style>
</head>
<body>
    <div class="header">
        <h1>💰 REPORTE DE COSTOS FIJOS</h1>
        <p><strong>Fecha de exportación:</strong> ${new Date().toLocaleString()}</p>
        <p><strong>Total de costos:</strong> ${costosData.length}</p>
    </div>
    
    ${costosData.map((costo, index) => `
    <div class="costo-section">
        <div class="costo-title">👤 Costo ${index + 1}: ${costo.colaborador || 'N/A'}</div>
        <div class="costo-details">
            <div class="detail-item">
                <span class="detail-label">ID:</span> ${costo.id}
            </div>
            <div class="detail-item">
                <span class="detail-label">Puesto:</span> ${costo.puesto || 'N/A'}
            </div>
            <div class="detail-item">
                <span class="detail-label">Monto USD:</span> ${costo.monto_usd ? formatterUSD.format(costo.monto_usd) : 'N/A'}
            </div>
            <div class="detail-label">Monto MXN:</span> ${costo.monto_mxn ? formatterMXN.format(costo.monto_mxn) : 'N/A'}
            </div>
            <div class="detail-item">
                <span class="detail-label">Impuestos IMSS:</span> ${costo.impuestos_imss ? formatterMXN.format(costo.impuestos_imss) : 'N/A'}
            </div>
            <div class="detail-item">
                <span class="detail-label">Fecha:</span> ${costo.fecha ? new Date(costo.fecha).toLocaleDateString() : 'N/A'}
            </div>
            <div class="detail-item">
                <span class="detail-label">Comentarios:</span> ${costo.comentarios || 'N/A'}
            </div>
            <div class="detail-item">
                <span class="detail-label">Cuenta Creada:</span> 
                <span style="color: ${costo.cuenta_creada ? '#27ae60' : '#e74c3c'}; font-weight: bold;">
                    ${costo.cuenta_creada ? 'Sí' : 'No'}
                </span>
            </div>
        </div>
    </div>
    `).join('')}
</body>
</html>`;
                        
                        content = htmlContent;
                        filename = `costos_fijos_${new Date().toISOString().split('T')[0]}.html`;
                        mimeType = 'text/html';
                      }
                      
                      // Descargar archivo
                      const blob = new Blob([content], { type: mimeType });
                      const url = window.URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = filename;
                      document.body.appendChild(a);
                      a.click();
                      window.URL.revokeObjectURL(url);
                      document.body.removeChild(a);
                      
                      setSnackbar({ 
                        open: true, 
                        message: `Costos fijos exportados exitosamente: ${costosData.length} costos en formato ${exportData.format.toUpperCase()}`, 
                        severity: 'success' 
                      });
                    } catch (error) {
                      console.error('Error al exportar:', error);
                      setSnackbar({ 
                        open: true, 
                        message: 'Error al exportar costos fijos', 
                        severity: 'error' 
                      });
                    }
                  }}
                />
              </Box>
            </Box>
          </Box>

          {/* Filtros y búsqueda */}
          <StyledCard sx={{ p: 3, mb: 3 }}>
            <Grid container spacing={3} alignItems="center">
              <Grid item xs={12} md={6}>
                <StyledSearchField
                  fullWidth
                  placeholder="Buscar por colaborador o puesto..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{
                    startAdornment: <SearchIcon sx={{ mr: 1, color: '#667eea' }} />
                  }}
                />
              </Grid>
              
              <Grid item xs={12} md={4}>
                <FormControl fullWidth>
                  <InputLabel>Filtrar por mes</InputLabel>
                  <Select
                    value={mesFiltro}
                    onChange={(e) => setMesFiltro(e.target.value)}
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
              
              <Grid item xs={12} md={2}>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button
                    onClick={toggleForm}
                    variant="contained"
                    startIcon={<AddIcon />}
                    sx={{
                      background: 'linear-gradient(135deg, #667eea, #764ba2)',
                      color: '#fff',
                      borderRadius: 2,
                      px: 3,
                      py: 1.5,
                      fontWeight: 'bold',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #5a6fd8, #6a4190)',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)'
                      }
                    }}
                  >
                    Nuevo Costo
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </StyledCard>

          {/* Contenido Principal */}
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 8 }}>
              <CircularProgress size={60} />
            </Box>
          ) : (
            <>
              <ChartComponent dataGrafica={dataGrafica} totalCostos={totalCostos} porcentajeUtilidad={porcentajeUtilidad} />
              <TotalsComponent
                totalCostos={totalCostos}
                porcentajeUtilidad={porcentajeUtilidad}
                setPorcentajeUtilidad={setPorcentajeUtilidad}
                resultadoUtilidad={resultadoUtilidad}
              />
              <FixedCostTable
                costosFijos={costosFiltrados}
                handleEdit={handleEdit}
                handleDelete={handleDelete}
                handleEnviarACuenta={handleEnviarACuenta}
                loading={loading}
                totalRegistros={costosFiltrados ? costosFiltrados.length : 0}
              />
            </>
          )}

          {/* Diálogo del formulario */}
          <FixedCostFormDialog
            open={showForm}
            onClose={toggleForm}
            isEditing={isEditing}
            formData={formData}
            onChange={handleChange}
            onSubmit={handleSubmit}
          />

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

export default CostosFijos;
