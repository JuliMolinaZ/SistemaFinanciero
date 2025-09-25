// src/modules/CuentasPorPagar/components/Filtros.jsx
import React, { useState, useMemo } from 'react';
import {
  Box,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Chip,
  Typography,
  IconButton,
  Tooltip,
  useTheme,
  useMediaQuery,
  Collapse,
  Fade,
  Zoom,
  Paper,
  Divider,
  Slider,
  Switch,
  FormControlLabel,
  ToggleButton,
  ToggleButtonGroup,
  Badge,
  Avatar,
  Card,
  CardContent,
  Alert,
  LinearProgress
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  FilterList as FilterListIcon,
  Clear as ClearIcon,
  Search as SearchIcon,
  DateRange as DateRangeIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  CalendarToday as CalendarIcon,
  AccountBalance as AccountBalanceIcon,
  Payment as PaymentIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Tune as TuneIcon,
  Analytics as AnalyticsIcon,
  Speed as SpeedIcon,
  FilterAlt as FilterAltIcon,
  Business as BusinessIcon,
  AccessTime as AccessTimeIcon,
  MonetizationOn as MonetizationOnIcon,
  Category as CategoryIcon
} from '@mui/icons-material';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';

// Componentes estilizados ultra-modernos y organizados
const FilterContainer = styled(Box)(({ theme }) => ({
  background: 'rgba(255, 255, 255, 0.98)',
  backdropFilter: 'blur(20px)',
  border: '1px solid rgba(102, 126, 234, 0.1)',
  borderRadius: 24,
  boxShadow: '0 12px 40px rgba(0,0,0,0.08)',
  padding: theme.spacing(4),
  position: 'relative',
  overflow: 'hidden'
}));

const FilterHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: theme.spacing(4),
  paddingBottom: theme.spacing(3),
  borderBottom: '2px solid rgba(102, 126, 234, 0.15)'
}));

const FilterTitle = styled(Typography)(({ theme }) => ({
  background: 'linear-gradient(135deg, #667eea, #764ba2)',
  backgroundClip: 'text',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  fontWeight: 800,
  fontSize: '2rem',
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(2)
}));

const FilterBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    background: 'linear-gradient(135deg, #667eea, #764ba2)',
    color: '#fff',
    fontWeight: 700,
    fontSize: '0.875rem',
    minWidth: '28px',
    height: '28px',
    borderRadius: '14px'
  }
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  background: 'linear-gradient(135deg, #667eea, #764ba2)',
  backgroundClip: 'text',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  fontWeight: 700,
  fontSize: '1.25rem',
  marginBottom: theme.spacing(3),
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1.5),
  paddingBottom: theme.spacing(1),
  borderBottom: '1px solid rgba(102, 126, 234, 0.1)'
}));

const QuickFilterSection = styled(Box)(({ theme }) => ({
  background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.03), rgba(118, 75, 162, 0.03))',
  borderRadius: 20,
  padding: theme.spacing(3),
  border: '1px solid rgba(102, 126, 234, 0.08)',
  marginBottom: theme.spacing(4)
}));

const QuickFilterGroup = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2)
}));

const QuickFilterRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(2),
  flexWrap: 'wrap',
  alignItems: 'center'
}));

const QuickFilterChip = styled(Chip)(({ theme, active, variant = 'default' }) => ({
  background: active
    ? 'linear-gradient(135deg, #667eea, #764ba2)'
    : variant === 'time' 
      ? 'rgba(255, 193, 7, 0.1)'
      : variant === 'money'
      ? 'rgba(76, 175, 80, 0.1)'
      : variant === 'status'
      ? 'rgba(255, 87, 34, 0.1)'
      : 'rgba(102, 126, 234, 0.08)',
  color: active 
    ? '#fff' 
    : variant === 'time'
      ? '#f57c00'
      : variant === 'money'
      ? '#2e7d32'
      : variant === 'status'
      ? '#d84315'
      : '#667eea',
  fontWeight: 600,
  fontSize: '0.875rem',
  borderRadius: 16,
  padding: theme.spacing(1, 2),
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  cursor: 'pointer',
  border: `2px solid ${active 
    ? 'transparent' 
    : variant === 'time'
      ? 'rgba(255, 193, 7, 0.3)'
      : variant === 'money'
      ? 'rgba(76, 175, 80, 0.3)'
      : variant === 'status'
      ? 'rgba(255, 87, 34, 0.3)'
      : 'rgba(102, 126, 234, 0.2)'}`,
  '&:hover': {
    transform: 'translateY(-2px) scale(1.02)',
    boxShadow: `0 8px 25px ${active 
      ? 'rgba(102, 126, 234, 0.4)' 
      : variant === 'time'
        ? 'rgba(255, 193, 7, 0.3)'
        : variant === 'money'
        ? 'rgba(76, 175, 80, 0.3)'
        : variant === 'status'
        ? 'rgba(255, 87, 34, 0.3)'
        : 'rgba(102, 126, 234, 0.3)'}`,
    borderColor: active 
      ? 'transparent' 
      : variant === 'time'
        ? 'rgba(255, 193, 7, 0.5)'
        : variant === 'money'
        ? 'rgba(76, 175, 80, 0.5)'
        : variant === 'status'
        ? 'rgba(255, 87, 34, 0.5)'
        : 'rgba(102, 126, 234, 0.4)'
  }
}));

const StyledFormControl = styled(FormControl)(({ theme, variant = 'outlined' }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: 16,
    background: 'rgba(255,255,255,0.9)',
    backdropFilter: 'blur(10px)',
    border: '2px solid rgba(102, 126, 234, 0.15)',
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

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: 16,
    background: 'rgba(255,255,255,0.9)',
    backdropFilter: 'blur(10px)',
    border: '2px solid rgba(102, 126, 234, 0.15)',
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

const FilterSection = styled(Box)(({ theme }) => ({
  background: 'rgba(255, 255, 255, 0.7)',
  borderRadius: 20,
  padding: theme.spacing(3),
  border: '1px solid rgba(102, 126, 234, 0.08)',
  marginBottom: theme.spacing(4)
}));

const Filtros = ({
  filtroMes,
  setFiltroMes,
  fechaInicio,
  setFechaInicio,
  fechaFin,
  setFechaFin,
  estadoFiltro,
  setEstadoFiltro,
  montoMinimo,
  setMontoMinimo,
  montoMaximo,
  setMontoMaximo,
  proveedorFiltro,
  setProveedorFiltro,
  categoriaFiltro,
  setCategoriaFiltro,
  categorias = [],
  proveedores = []
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  
  // Filtros rápidos organizados por categorías
  const [quickFilters, setQuickFilters] = useState({
    // Filtros de tiempo
    thisMonth: false,
    lastMonth: false,
    thisQuarter: false,
    thisWeek: false,
    nextWeek: false,
    overdue: false,
    
    // Filtros de monto
    highAmount: false,
    lowAmount: false,
    mediumAmount: false,
    
    // Filtros de estado
    urgent: false,
    normal: false
  });

  const handleClearFilters = () => {
    setFiltroMes('');
    setFechaInicio('');
    setFechaFin('');
    setEstadoFiltro('');
    setMontoMinimo('');
    setMontoMaximo('');
    setProveedorFiltro('');
    setCategoriaFiltro('');
    setQuickFilters({
      thisMonth: false,
      lastMonth: false,
      thisQuarter: false,
      thisWeek: false,
      nextWeek: false,
      overdue: false,
      highAmount: false,
      lowAmount: false,
      mediumAmount: false,
      urgent: false,
      normal: false
    });
  };

  const hasActiveFilters = filtroMes || fechaInicio || fechaFin || estadoFiltro ||
    montoMinimo || montoMaximo || proveedorFiltro || categoriaFiltro ||
    Object.values(quickFilters).some(v => v);

  const activeFilterCount = [
    filtroMes,
    fechaInicio,
    fechaFin,
    estadoFiltro,
    montoMinimo,
    montoMaximo,
    proveedorFiltro,
    categoriaFiltro,
    ...Object.values(quickFilters)
  ].filter(Boolean).length;

  const meses = [
    { value: 1, label: 'Enero', emoji: '❄️' },
    { value: 2, label: 'Febrero', emoji: '💝' },
    { value: 3, label: 'Marzo', emoji: '🌸' },
    { value: 4, label: 'Abril', emoji: '🌧️' },
    { value: 5, label: 'Mayo', emoji: '🌺' },
    { value: 6, label: 'Junio', emoji: '☀️' },
    { value: 7, label: 'Julio', emoji: '🏖️' },
    { value: 8, label: 'Agosto', emoji: '🌻' },
    { value: 9, label: 'Septiembre', emoji: '🍂' },
    { value: 10, label: 'Octubre', emoji: '🎃' },
    { value: 11, label: 'Noviembre', emoji: '🦃' },
    { value: 12, label: 'Diciembre', emoji: '🎄' }
  ];

  const estados = [
    { value: '', label: 'Todos los estados', icon: '🔍' },
    { value: '0', label: 'Por Pagar', icon: '⏳' },
    { value: '1', label: 'Pagadas', icon: '✅' }
  ];

  const handleQuickFilter = (filterType) => {
    setQuickFilters(prev => {
      const newFilters = { ...prev, [filterType]: !prev[filterType] };

      // Aplicar lógica de filtros rápidos
      if (newFilters.thisMonth) {
        const currentMonth = new Date().getMonth() + 1;
        setFiltroMes(currentMonth.toString());
      }

      if (newFilters.lastMonth) {
        const lastMonth = new Date().getMonth() === 0 ? 12 : new Date().getMonth();
        setFiltroMes(lastMonth.toString());
      }

      if (newFilters.thisQuarter) {
        const currentQuarter = Math.ceil((new Date().getMonth() + 1) / 3);
        // Implementar lógica de trimestre
      }

      return newFilters;
    });
  };

  return (
    <FilterContainer>
      {/* Header con título y badge */}
      <FilterHeader>
        <FilterTitle>
          <FilterAltIcon sx={{ fontSize: '2.5rem' }} />
          Filtros de Búsqueda
          <FilterBadge badgeContent={activeFilterCount} color="primary">
            <Avatar sx={{
              bgcolor: 'rgba(102, 126, 234, 0.1)',
              color: '#667eea',
              width: 48,
              height: 48
            }}>
              <FilterListIcon />
            </Avatar>
          </FilterBadge>
        </FilterTitle>

        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <Tooltip title="Filtros Avanzados">
            <IconButton
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              sx={{
                background: 'rgba(102, 126, 234, 0.1)',
                color: '#667eea',
                width: 48,
                height: 48,
                '&:hover': {
                  background: 'rgba(102, 126, 234, 0.2)',
                  transform: 'scale(1.1)'
                }
              }}
            >
              {showAdvancedFilters ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </IconButton>
          </Tooltip>

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <ActionButton
              variant="outlined"
              onClick={handleClearFilters}
              disabled={!hasActiveFilters}
              sx={{
                border: '2px solid rgba(244, 67, 54, 0.3)',
                color: '#f44336',
                '&:hover': {
                  borderColor: '#f44336',
                  background: 'rgba(244, 67, 54, 0.1)'
                }
              }}
              startIcon={<ClearIcon />}
            >
              Limpiar Filtros
            </ActionButton>
          </motion.div>
        </Box>
      </FilterHeader>

      {/* Filtros Rápidos - Organizados por categorías */}
      <QuickFilterSection>
        <SectionTitle>
          <AccessTimeIcon sx={{ fontSize: '1.5rem' }} />
          🚀 Filtros Rápidos
        </SectionTitle>
        
        <QuickFilterGroup>
          {/* Filtros de Tiempo */}
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2, color: '#f57c00' }}>
              ⏰ Filtros de Tiempo
            </Typography>
            <QuickFilterRow>
              <QuickFilterChip
                active={quickFilters.thisMonth}
                variant="time"
                label="Este Mes"
                onClick={() => handleQuickFilter('thisMonth')}
                icon={<CalendarIcon />}
              />
              <QuickFilterChip
                active={quickFilters.lastMonth}
                variant="time"
                label="Mes Pasado"
                onClick={() => handleQuickFilter('lastMonth')}
                icon={<TrendingDownIcon />}
              />
              <QuickFilterChip
                active={quickFilters.thisQuarter}
                variant="time"
                label="Este Trimestre"
                onClick={() => handleQuickFilter('thisQuarter')}
                icon={<AnalyticsIcon />}
              />
              <QuickFilterChip
                active={quickFilters.thisWeek}
                variant="time"
                label="Esta Semana"
                onClick={() => handleQuickFilter('thisWeek')}
                icon={<CalendarIcon />}
              />
              <QuickFilterChip
                active={quickFilters.nextWeek}
                variant="time"
                label="Próxima Semana"
                onClick={() => handleQuickFilter('nextWeek')}
                icon={<CalendarIcon />}
              />
              <QuickFilterChip
                active={quickFilters.overdue}
                variant="time"
                label="Vencidas"
                onClick={() => handleQuickFilter('overdue')}
                icon={<WarningIcon />}
              />
            </QuickFilterRow>
          </Box>

          {/* Filtros de Monto */}
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2, color: '#2e7d32' }}>
              💰 Filtros de Monto
            </Typography>
            <QuickFilterRow>
              <QuickFilterChip
                active={quickFilters.highAmount}
                variant="money"
                label="Monto Alto (>$100k)"
                onClick={() => handleQuickFilter('highAmount')}
                icon={<TrendingUpIcon />}
              />
              <QuickFilterChip
                active={quickFilters.mediumAmount}
                variant="money"
                label="Monto Medio ($10k-$100k)"
                onClick={() => handleQuickFilter('mediumAmount')}
                icon={<AccountBalanceIcon />}
              />
              <QuickFilterChip
                active={quickFilters.lowAmount}
                variant="money"
                label="Monto Bajo (<$10k)"
                onClick={() => handleQuickFilter('lowAmount')}
                icon={<TrendingDownIcon />}
              />
            </QuickFilterRow>
          </Box>

          {/* Filtros de Estado */}
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2, color: '#d84315' }}>
              🏷️ Filtros de Estado
            </Typography>
            <QuickFilterRow>
              <QuickFilterChip
                active={quickFilters.urgent}
                variant="status"
                label="Urgente"
                onClick={() => handleQuickFilter('urgent')}
                icon={<WarningIcon />}
              />
              <QuickFilterChip
                active={quickFilters.normal}
                variant="status"
                label="Normal"
                onClick={() => handleQuickFilter('normal')}
                icon={<CheckCircleIcon />}
              />
            </QuickFilterRow>
          </Box>
        </QuickFilterGroup>
      </QuickFilterSection>

      {/* Filtros Principales */}
      <FilterSection>
        <SectionTitle>
          <SearchIcon sx={{ fontSize: '1.5rem' }} />
          🔍 Filtros Principales
        </SectionTitle>
        
        <Grid container spacing={3}>
          {/* Filtro por mes */}
          <Grid item xs={12} sm={6} md={3}>
            <motion.div whileHover={{ scale: 1.02 }}>
              <StyledFormControl fullWidth>
                <InputLabel>📅 Mes</InputLabel>
                <Select
                  value={filtroMes}
                  onChange={(e) => setFiltroMes(e.target.value)}
                  label="📅 Mes"
                >
                  <MenuItem value="">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <CalendarIcon sx={{ color: 'text.secondary' }} />
                      Todos los meses
                    </Box>
                  </MenuItem>
                  {meses.map((mes) => (
                    <MenuItem key={mes.value} value={mes.value}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <span>{mes.emoji}</span>
                        {mes.label}
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </StyledFormControl>
            </motion.div>
          </Grid>

          {/* Filtro por fecha inicio */}
          <Grid item xs={12} sm={6} md={3}>
            <motion.div whileHover={{ scale: 1.02 }}>
              <StyledTextField
                fullWidth
                label="📅 Desde"
                type="date"
                value={fechaInicio}
                onChange={(e) => setFechaInicio(e.target.value)}
                InputLabelProps={{ shrink: true }}
                InputProps={{
                  startAdornment: <DateRangeIcon sx={{ mr: 1, color: 'action.active' }} />
                }}
              />
            </motion.div>
          </Grid>

          {/* Filtro por fecha fin */}
          <Grid item xs={12} sm={6} md={3}>
            <motion.div whileHover={{ scale: 1.02 }}>
              <StyledTextField
                fullWidth
                label="📅 Hasta"
                type="date"
                value={fechaFin}
                onChange={(e) => setFechaFin(e.target.value)}
                InputLabelProps={{ shrink: true }}
                InputProps={{
                  startAdornment: <DateRangeIcon sx={{ mr: 1, color: 'action.active' }} />
                }}
              />
            </motion.div>
          </Grid>

          {/* Filtro por estado */}
          <Grid item xs={12} sm={6} md={3}>
            <motion.div whileHover={{ scale: 1.02 }}>
              <StyledFormControl fullWidth>
                <InputLabel>🏷️ Estado</InputLabel>
                <Select
                  value={estadoFiltro}
                  onChange={(e) => setEstadoFiltro(e.target.value)}
                  label="🏷️ Estado"
                >
                  {estados.map((estado) => (
                    <MenuItem key={estado.value} value={estado.value}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <span>{estado.icon}</span>
                        {estado.label}
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </StyledFormControl>
            </motion.div>
          </Grid>

          {/* Filtro por proveedor */}
          <Grid item xs={12} sm={6} md={3}>
            <motion.div whileHover={{ scale: 1.02 }}>
              <StyledFormControl fullWidth>
                <InputLabel>🏢 Proveedor</InputLabel>
                <Select
                  value={proveedorFiltro}
                  onChange={(e) => setProveedorFiltro(e.target.value)}
                  label="🏢 Proveedor"
                >
                  <MenuItem value="">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <BusinessIcon sx={{ color: 'text.secondary' }} />
                      Todos los proveedores
                    </Box>
                  </MenuItem>
                  {proveedores.map((proveedor) => (
                    <MenuItem key={proveedor.id} value={proveedor.id}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <BusinessIcon sx={{ color: 'text.secondary' }} />
                        {proveedor.nombre}
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </StyledFormControl>
            </motion.div>
          </Grid>

          {/* Filtro por categoría */}
          <Grid item xs={12} sm={6} md={3}>
            <motion.div whileHover={{ scale: 1.02 }}>
              <StyledFormControl fullWidth>
                <InputLabel>🏷️ Categoría</InputLabel>
                <Select
                  value={categoriaFiltro}
                  onChange={(e) => setCategoriaFiltro(e.target.value)}
                  label="🏷️ Categoría"
                >
                  <MenuItem value="">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <CategoryIcon sx={{ color: 'text.secondary' }} />
                      Todas las categorías
                    </Box>
                  </MenuItem>
                  {categorias.map((categoria) => (
                    <MenuItem key={categoria.id} value={categoria.id}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <CategoryIcon sx={{ color: 'text.secondary' }} />
                        {categoria.nombre}
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </StyledFormControl>
            </motion.div>
          </Grid>
        </Grid>
      </FilterSection>

      {/* Filtros de Monto */}
      <FilterSection>
        <SectionTitle>
          <MonetizationOnIcon sx={{ fontSize: '1.5rem' }} />
          💰 Filtros de Monto
        </SectionTitle>
        
        <Grid container spacing={3}>
          {/* Filtro por monto mínimo */}
          <Grid item xs={12} sm={6} md={3}>
            <motion.div whileHover={{ scale: 1.02 }}>
              <StyledTextField
                fullWidth
                label="💰 Monto Mínimo"
                type="number"
                value={montoMinimo}
                onChange={(e) => setMontoMinimo(e.target.value)}
                InputProps={{
                  startAdornment: <TrendingUpIcon sx={{ mr: 1, color: 'action.active' }} />
                }}
              />
            </motion.div>
          </Grid>

          {/* Filtro por monto máximo */}
          <Grid item xs={12} sm={6} md={3}>
            <motion.div whileHover={{ scale: 1.02 }}>
              <StyledTextField
                fullWidth
                label="💰 Monto Máximo"
                type="number"
                value={montoMaximo}
                onChange={(e) => setMontoMaximo(e.target.value)}
                InputProps={{
                  startAdornment: <TrendingDownIcon sx={{ mr: 1, color: 'action.active' }} />
                }}
              />
            </motion.div>
          </Grid>
        </Grid>
      </FilterSection>

      {/* Filtros Avanzados */}
      <Collapse in={showAdvancedFilters}>
        <Fade in={showAdvancedFilters}>
          <FilterSection>
            <SectionTitle>
              <TuneIcon sx={{ fontSize: '1.5rem' }} />
              ⚙️ Filtros Avanzados
            </SectionTitle>

            <Grid container spacing={3}>
              {/* Rango de montos */}
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2, color: 'text.secondary' }}>
                  💰 Rango de Montos
                </Typography>
                <Box sx={{ px: 2 }}>
                  <Slider
                    value={[0, 1000000]}
                    onChange={() => {}}
                    valueLabelDisplay="auto"
                    min={0}
                    max={1000000}
                    step={10000}
                    valueLabelFormat={(value) => `$${value.toLocaleString()}`}
                    sx={{
                      '& .MuiSlider-thumb': {
                        background: 'linear-gradient(135deg, #667eea, #764ba2)',
                        boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)'
                      },
                      '& .MuiSlider-track': {
                        background: 'linear-gradient(135deg, #667eea, #764ba2)'
                      },
                      '& .MuiSlider-rail': {
                        background: 'rgba(102, 126, 234, 0.2)'
                      }
                    }}
                  />
                </Box>
              </Grid>

              {/* Opciones adicionales */}
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2, color: 'text.secondary' }}>
                  🔧 Opciones Adicionales
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <FormControlLabel
                    control={<Switch color="primary" />}
                    label="Solo cuentas vencidas"
                  />
                  <FormControlLabel
                    control={<Switch color="primary" />}
                    label="Incluir cuentas pagadas"
                  />
                  <FormControlLabel
                    control={<Switch color="primary" />}
                    label="Ordenar por fecha"
                  />
                </Box>
              </Grid>
            </Grid>
          </FilterSection>
        </Fade>
      </Collapse>

      {/* Resumen de filtros activos */}
      {hasActiveFilters && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Box sx={{
            mt: 3,
            p: 3,
            bgcolor: 'rgba(102, 126, 234, 0.1)',
            borderRadius: 3,
            border: '1px solid rgba(102, 126, 234, 0.2)',
            textAlign: 'center'
          }}>
            <Typography variant="h6" sx={{ color: '#667eea', fontWeight: 700, mb: 1 }}>
              🎯 Filtros Activos
            </Typography>
            <Typography variant="body1" sx={{ color: '#667eea', fontWeight: 600 }}>
              {activeFilterCount} filtro(s) aplicado(s) - Los resultados se actualizarán automáticamente
            </Typography>
          </Box>
        </motion.div>
      )}
    </FilterContainer>
  );
};

export default Filtros;

