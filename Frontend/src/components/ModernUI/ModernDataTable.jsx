import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tooltip,
  Chip,
  Typography,
  Avatar,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  useTheme,
  useMediaQuery,
  Grid,
  InputAdornment,
  Collapse,
  Fade,
  Divider,
  Badge,
  Card,
  CardContent,
  Skeleton,
  LinearProgress,
  Alert,
  Snackbar,
  Menu,
  ListItemIcon,
  ListItemText,
  Checkbox,
  FormGroup,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Tabs,
  Tab,
  Pagination,
  Select as MuiSelect,
  FormControlLabel as MuiFormControlLabel,
  Switch as MuiSwitch
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  FilterList as FilterListIcon,
  Clear as ClearIcon,
  Search as SearchIcon,
  DateRange as DateRangeIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  CalendarToday as CalendarIcon,
  Business as BusinessIcon,
  Tune as TuneIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Refresh as RefreshIcon,
  AutoAwesome as AutoAwesomeIcon,
  Download as DownloadIcon,
  FileDownload as FileDownloadIcon,
  Settings as SettingsIcon,
  ViewColumn as ViewColumnIcon,
  Sort as SortIcon,
  FilterAlt as FilterAltIcon,
  MoreVert as MoreVertIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  Error as ErrorIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

// ===== COMPONENTES ESTILIZADOS MEJORADOS =====
const StyledTableContainer = styled(TableContainer)(({ theme, variant = 'default' }) => ({
  borderRadius: variant === 'rounded' ? 24 : 16,
  overflow: 'hidden',
  boxShadow: variant === 'elevated' 
    ? '0 8px 32px rgba(0,0,0,0.15)' 
    : '0 4px 20px rgba(0,0,0,0.1)',
  background: variant === 'glass' 
    ? 'rgba(255,255,255,0.8)' 
    : 'rgba(255,255,255,0.98)',
  backdropFilter: variant === 'glass' ? 'blur(20px)' : 'blur(10px)',
  border: variant === 'glass' 
    ? '1px solid rgba(255,255,255,0.3)' 
    : '1px solid rgba(0,0,0,0.05)',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  
  '&:hover': {
    boxShadow: variant === 'elevated' 
      ? '0 12px 40px rgba(0,0,0,0.2)' 
      : '0 6px 25px rgba(0,0,0,0.15)',
    transform: variant === 'elevated' ? 'translateY(-2px)' : 'none'
  }
}));

const StyledTable = styled(Table)(({ theme, variant = 'default' }) => ({
  '& .MuiTableHead-root': {
    background: variant === 'gradient' 
      ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      : variant === 'solid'
      ? '#667eea'
      : 'rgba(102, 126, 234, 0.1)',
    '& .MuiTableCell-head': {
      color: variant === 'gradient' || variant === 'solid' ? '#fff' : '#667eea',
      fontWeight: 700,
      fontSize: '0.875rem',
      textTransform: variant === 'gradient' ? 'uppercase' : 'none',
      letterSpacing: variant === 'gradient' ? '0.5px' : 'normal',
      borderBottom: 'none',
      padding: theme.spacing(2),
      position: 'sticky',
      top: 0,
      zIndex: 10,
      backdropFilter: 'blur(10px)'
    }
  },
  '& .MuiTableBody-root': {
    '& .MuiTableRow-root': {
      transition: 'all 0.2s ease',
      cursor: 'pointer',
      '&:hover': {
        background: 'rgba(102, 126, 234, 0.05)',
        transform: 'scale(1.005)',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      },
      '&:nth-of-type(even)': {
        background: 'rgba(0,0,0,0.02)'
      },
      '&.selected': {
        background: 'rgba(102, 126, 234, 0.1)',
        borderLeft: '4px solid #667eea'
      },
      '&.highlighted': {
        background: 'rgba(255, 193, 7, 0.1)',
        borderLeft: '4px solid #ffc107'
      }
    },
    '& .MuiTableCell-body': {
      borderBottom: '1px solid rgba(0,0,0,0.05)',
      padding: theme.spacing(2),
      fontSize: '0.875rem',
      transition: 'all 0.2s ease'
    }
  }
}));

const ActionButton = styled(IconButton)(({ color, variant = 'default', size = 'medium' }) => ({
  width: variant === 'compact' ? 32 : 36,
  height: variant === 'compact' ? 32 : 36,
  margin: '0 2px',
  background: color,
  color: '#fff',
  transition: 'all 0.15s ease',
  borderRadius: variant === 'rounded' ? '50%' : '8px',
  
  '&:hover': {
    background: color,
    transform: 'translateY(-1px) scale(1.05)',
    boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
  },
  
  '&:active': {
    transform: 'translateY(0) scale(0.95)'
  }
}));

const FilterRow = styled(TableRow)(({ theme }) => ({
  background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.05), rgba(118, 75, 162, 0.05))',
  '& .MuiTableCell-root': {
    borderBottom: '1px solid rgba(102, 126, 234, 0.1)',
    padding: theme.spacing(1.5),
    background: 'transparent'
  }
}));

const InlineFilterField = styled(TextField)(({ theme, variant = 'default' }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: variant === 'rounded' ? 16 : 12,
    background: variant === 'glass' 
      ? 'rgba(255,255,255,0.9)' 
      : 'rgba(255,255,255,0.95)',
    backdropFilter: 'blur(10px)',
    border: `2px solid ${variant === 'glass' 
      ? 'rgba(102, 126, 234, 0.2)' 
      : 'rgba(102, 126, 234, 0.15)'}`,
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    fontSize: '0.875rem',
    
    '&:hover': {
      background: 'rgba(255,255,255,0.98)',
      borderColor: 'rgba(102, 126, 234, 0.4)',
      transform: 'translateY(-1px)',
      boxShadow: '0 4px 15px rgba(102, 126, 234, 0.2)'
    },
    
    '&.Mui-focused': {
      background: 'rgba(255,255,255,1)',
      borderColor: '#667eea',
      boxShadow: '0 0 0 3px rgba(102, 126, 234, 0.1), 0 4px 15px rgba(102, 126, 234,0.3)',
      transform: 'translateY(-1px)'
    }
  },
  
  '& .MuiInputLabel-root': {
    fontWeight: 600,
    color: '#667eea',
    fontSize: '0.75rem',
    '&.Mui-focused': {
      color: '#667eea',
      fontWeight: 700
    }
  }
}));

const QuickFilterChip = styled(Chip)(({ theme, active, variant = 'default', color = 'primary' }) => {
  const getColorScheme = () => {
    switch (color) {
      case 'success': return { bg: '#22c55e', border: '#16a34a' };
      case 'warning': return { bg: '#f59e0b', border: '#d97706' };
      case 'error': return { bg: '#ef4444', border: '#dc2626' };
      case 'info': return { bg: '#3b82f6', border: '#2563eb' };
      default: return { bg: '#667eea', border: '#5a6fd8' };
    }
  };
  
  const colorScheme = getColorScheme();
  
  return {
    background: active
      ? `linear-gradient(135deg, ${colorScheme.bg}, ${colorScheme.border})`
      : `rgba(${colorScheme.bg}, 0.1)`,
    color: active ? '#fff' : colorScheme.bg,
    fontWeight: 600,
    fontSize: '0.75rem',
    borderRadius: 12,
    padding: theme.spacing(0.5, 1.5),
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    cursor: 'pointer',
    border: `2px solid ${active ? 'transparent' : `rgba(${colorScheme.bg}, 0.3)`}`,
    
    '&:hover': {
      transform: 'translateY(-1px) scale(1.02)',
      boxShadow: `0 4px 15px rgba(${colorScheme.bg}, 0.3)`,
      borderColor: `rgba(${colorScheme.bg}, 0.5)`
    }
  };
});

// ===== COMPONENTES DE CARGA MEJORADOS =====
const LoadingSkeleton = ({ rows = 8, columns = 6, variant = 'default' }) => (
  <Box sx={{ p: 2 }}>
    <Box sx={{ mb: 3 }}>
      <Skeleton variant="rectangular" height={40} sx={{ borderRadius: 2, mb: 2 }} />
      <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} variant="rectangular" width={100} height={32} sx={{ borderRadius: 16 }} />
        ))}
      </Box>
    </Box>
    
    <StyledTableContainer variant={variant}>
      <StyledTable>
        <TableHead>
          <TableRow>
            {[...Array(columns)].map((_, i) => (
              <TableCell key={i}>
                <Skeleton variant="text" width={120} height={20} />
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {[...Array(rows)].map((_, index) => (
            <TableRow key={index}>
              {[...Array(columns)].map((_, i) => (
                <TableCell key={i}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {i === 0 && (
                      <Skeleton variant="circular" width={32} height={32} />
                    )}
                    <Skeleton variant="text" width={i === 0 ? 120 : 100} height={20} />
                  </Box>
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </StyledTable>
    </StyledTableContainer>
  </Box>
);

// ===== COMPONENTE DE ESTADO VACÍO MEJORADO =====
const EmptyState = ({ 
  hasFilters, 
  onRefresh, 
  onCreate, 
  title = "No hay datos disponibles",
  subtitle = "Comienza agregando tu primer elemento",
  icon: Icon = AutoAwesomeIcon,
  variant = 'default'
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
  >
    <Box sx={{ 
      textAlign: 'center', 
      py: 6, 
      px: 4,
      background: variant === 'glass' 
        ? 'rgba(255,255,255,0.1)' 
        : 'linear-gradient(135deg, rgba(102, 126, 234, 0.05), rgba(118, 75, 162, 0.05))',
      borderRadius: 3,
      border: variant === 'glass' 
        ? '1px solid rgba(255,255,255,0.2)' 
        : '1px solid rgba(102, 126, 234, 0.1)',
      mt: 2,
      backdropFilter: variant === 'glass' ? 'blur(20px)' : 'none'
    }}>
      {hasFilters ? (
        <>
          <SearchIcon sx={{ fontSize: '4rem', color: '#667eea', mb: 2, opacity: 0.7 }} />
          <Typography variant="h5" sx={{ mb: 2, color: '#667eea', fontWeight: 700 }}>
            No se encontraron resultados
          </Typography>
          <Typography variant="body1" sx={{ mb: 3, color: 'text.secondary' }}>
            Intenta ajustar los filtros de búsqueda
          </Typography>
          <Button
            variant="outlined"
            onClick={onRefresh}
            startIcon={<RefreshIcon />}
            sx={{
              borderColor: '#667eea',
              color: '#667eea',
              '&:hover': {
                borderColor: '#5a6fd8',
                background: 'rgba(102, 126, 234, 0.05)'
              }
            }}
          >
            Reintentar
          </Button>
        </>
      ) : (
        <>
          <Icon sx={{ fontSize: '4rem', color: '#667eea', mb: 2, opacity: 0.7 }} />
          <Typography variant="h5" sx={{ mb: 2, color: '#667eea', fontWeight: 700 }}>
            {title}
          </Typography>
          <Typography variant="body1" sx={{ mb: 3, color: 'text.secondary' }}>
            {subtitle}
          </Typography>
          {onCreate && (
            <Button
              variant="contained"
              onClick={onCreate}
              startIcon={<Icon />}
              sx={{
                background: 'linear-gradient(135deg, #667eea, #764ba2)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #5a6fd8, #6a4190)'
                }
              }}
            >
              Crear Primero
            </Button>
          )}
        </>
      )}
    </Box>
  </motion.div>
);

// ===== COMPONENTE PRINCIPAL MODERNDATATABLE =====
const ModernDataTable = ({
  // Datos y estado
  data = [],
  loading = false,
  error = null,
  
  // Configuración de columnas
  columns = [],
  defaultSort = { field: 'id', direction: 'asc' },
  
  // Funciones de callback
  onEdit,
  onDelete,
  onView,
  onRefresh,
  onCreate,
  onRowClick,
  onSelectionChange,
  
  // Configuración de filtros
  enableFilters = true,
  enableSearch = true,
  enableQuickFilters = true,
  enableAdvancedFilters = false,
  
  // Configuración de acciones
  enableActions = true,
  enableSelection = false,
  enableExport = false,
  
  // Configuración de paginación
  enablePagination = true,
  pageSize = 10,
  pageSizeOptions = [5, 10, 25, 50],
  
  // Configuración visual
  variant = 'default',
  elevation = 3,
  compact = false,
  
  // Personalización
  emptyStateConfig = {},
  loadingConfig = {},
  
  // Props adicionales
  ...props
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  // ===== ESTADOS PRINCIPALES =====
  const [filters, setFilters] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [quickFilters, setQuickFilters] = useState({});
  const [advancedFilters, setAdvancedFilters] = useState({});
  const [sortConfig, setSortConfig] = useState(defaultSort);
  const [selectedRows, setSelectedRows] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(pageSize);
  
  // ===== ESTADOS DE UI =====
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  
  const [columnVisibility, setColumnVisibility] = useState(
    columns.reduce((acc, col) => ({ ...acc, [col.field]: col.visible !== false }), {})
  );
  
  // ===== REFS =====
  const tableRef = useRef(null);
  const filterTimeoutRef = useRef(null);
  
  // ===== EFECTOS =====
  useEffect(() => {
    if (error) {
      setSnackbar({
        open: true,
        message: error,
        severity: 'error'
      });
    }
  }, [error]);
  
  // ===== FUNCIONES DE FILTRADO Y ORDENAMIENTO =====
  const filteredAndSortedData = useMemo(() => {
    let result = [...data];
    
    // Aplicar filtros de búsqueda
    if (searchTerm) {
      result = result.filter(item => 
        Object.values(item).some(value => 
          String(value).toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
    
    // Aplicar filtros personalizados
    Object.entries(filters).forEach(([field, value]) => {
      if (value) {
        result = result.filter(item => {
          const itemValue = item[field];
          if (typeof value === 'string') {
            return String(itemValue).toLowerCase().includes(value.toLowerCase());
          }
          return itemValue === value;
        });
      }
    });
    
    // Aplicar filtros rápidos
    Object.entries(quickFilters).forEach(([filterType, isActive]) => {
      if (isActive) {
        switch (filterType) {
          case 'thisMonth':
            result = result.filter(item => {
              const date = new Date(item.fecha || item.created_at);
              const now = new Date();
              return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
            });
            break;
          case 'overdue':
            result = result.filter(item => {
              const dueDate = new Date(item.fecha_vencimiento || item.due_date);
              return dueDate < new Date();
            });
            break;
          case 'highAmount':
            result = result.filter(item => {
              const amount = parseFloat(item.monto || item.amount || 0);
              return amount > 10000;
            });
            break;
          case 'urgent':
            result = result.filter(item => 
              item.priority === 'high' || item.estado === 'urgente'
            );
            break;
        }
      }
    });
    
    // Aplicar ordenamiento
    if (sortConfig.field) {
      result.sort((a, b) => {
        const aValue = a[sortConfig.field];
        const bValue = b[sortConfig.field];
        
        if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }
    
    return result;
  }, [data, searchTerm, filters, quickFilters, sortConfig]);
  
  // ===== FUNCIONES DE MANIPULACIÓN =====
  const handleFilterChange = useCallback((field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
    setCurrentPage(1);
  }, []);
  
  const handleQuickFilter = useCallback((filterType) => {
    setQuickFilters(prev => ({ ...prev, [filterType]: !prev[filterType] }));
    setCurrentPage(1);
  }, []);
  
  const handleSort = useCallback((field) => {
    setSortConfig(prev => ({
      field,
      direction: prev.field === field && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  }, []);
  
  const handleRowSelection = useCallback((rowId) => {
    setSelectedRows(prev => {
      if (prev.includes(rowId)) {
        return prev.filter(id => id !== rowId);
      } else {
        return [...prev, rowId];
      }
    });
  }, []);
  
  const handleSelectAll = useCallback(() => {
    if (selectedRows.length === filteredAndSortedData.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(filteredAndSortedData.map(row => row.id));
    }
  }, [selectedRows.length, filteredAndSortedData]);
  
  const clearFilters = useCallback(() => {
    setFilters({});
    setSearchTerm('');
    setQuickFilters({});
    setAdvancedFilters({});
    setCurrentPage(1);
    
    setSnackbar({
      open: true,
      message: 'Filtros limpiados correctamente',
      severity: 'info'
    });
  }, []);
  
  // ===== FUNCIONES DE EXPORTACIÓN =====
  const handleExport = useCallback((format) => {
    // Implementar lógica de exportación según el formato
    console.log(`Exportando en formato: ${format}`);
    setSnackbar({
      open: true,
      message: `Exportando datos en formato ${format}`,
      severity: 'success'
    });
  }, []);
  
  // ===== FUNCIONES DE PAGINACIÓN =====
  const paginatedData = useMemo(() => {
    if (!enablePagination) return filteredAndSortedData;
    
    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    return filteredAndSortedData.slice(startIndex, endIndex);
  }, [filteredAndSortedData, currentPage, rowsPerPage, enablePagination]);
  
  const totalPages = Math.ceil(filteredAndSortedData.length / rowsPerPage);
  
  // ===== RENDERIZADO CONDICIONAL =====
  if (loading) {
    return <LoadingSkeleton {...loadingConfig} />;
  }
  
  return (
    <Box>
      {/* ===== HEADER PRINCIPAL ===== */}
      <Box sx={{ 
        mb: 3, 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 2
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, color: '#667eea' }}>
            📊 Tabla de Datos
          </Typography>
          <Badge badgeContent={filteredAndSortedData.length} color="primary" sx={{
            '& .MuiBadge-badge': {
              background: 'linear-gradient(135deg, #667eea, #764ba2)',
              color: '#fff'
            }
          }}>
            <Chip 
              label={`${data?.length || 0} total`} 
              size="small" 
              sx={{ background: 'rgba(102, 126, 234, 0.1)', color: '#667eea' }}
            />
          </Badge>
        </Box>
        
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          {/* Botón de filtros */}
          {enableFilters && (
            <Button
              variant={showFilters ? "contained" : "outlined"}
              onClick={() => setShowFilters(!showFilters)}
              startIcon={<FilterListIcon />}
              size="small"
              sx={{
                background: showFilters ? 'linear-gradient(135deg, #667eea, #764ba2)' : 'transparent',
                borderColor: '#667eea',
                color: showFilters ? '#fff' : '#667eea',
                '&:hover': {
                  background: showFilters ? 'linear-gradient(135deg, #5a6fd8, #6a4190)' : 'rgba(102, 126, 234, 0.1)'
                }
              }}
            >
              {showFilters ? 'Ocultar Filtros' : 'Mostrar Filtros'}
            </Button>
          )}
          
          {/* Botón de filtros avanzados */}
          {enableAdvancedFilters && (
            <Button
              variant={showAdvancedFilters ? "contained" : "outlined"}
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              startIcon={<TuneIcon />}
              size="small"
              sx={{
                background: showAdvancedFilters ? 'linear-gradient(135deg, #667eea, #764ba2)' : 'transparent',
                borderColor: '#667eea',
                color: showAdvancedFilters ? '#fff' : '#667eea'
              }}
            >
              Avanzado
            </Button>
          )}
          
          {/* Botón de limpiar filtros */}
          {(Object.keys(filters).length > 0 || searchTerm || Object.values(quickFilters).some(v => v)) && (
            <Button
              variant="outlined"
              onClick={clearFilters}
              startIcon={<ClearIcon />}
              size="small"
              sx={{
                borderColor: '#f44336',
                color: '#f44336',
                '&:hover': {
                  borderColor: '#d32f2f',
                  background: 'rgba(244, 67, 54, 0.05)'
                }
              }}
            >
              Limpiar
            </Button>
          )}
          
          {/* Botón de exportar */}
          {enableExport && (
            <Button
              variant="outlined"
              onClick={() => setShowAdvancedFilters(true)}
              startIcon={<DownloadIcon />}
              size="small"
              sx={{
                borderColor: '#4caf50',
                color: '#4caf50',
                '&:hover': {
                  borderColor: '#388e3c',
                  background: 'rgba(76, 175, 80, 0.05)'
                }
              }}
            >
              Exportar
            </Button>
          )}
          
          {/* Botón de crear */}
          {onCreate && (
            <Button
              variant="contained"
              onClick={onCreate}
              startIcon={<AutoAwesomeIcon />}
              size="small"
              sx={{
                background: 'linear-gradient(135deg, #667eea, #764ba2)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #5a6fd8, #6a4190)'
                }
              }}
            >
              Crear
            </Button>
          )}
          
          {/* Botón de refrescar */}
          <Tooltip title="Actualizar datos">
            <IconButton
              onClick={onRefresh}
              sx={{
                background: 'rgba(102, 126, 234, 0.1)',
                color: '#667eea',
                '&:hover': {
                  background: 'rgba(102, 126, 234, 0.2)',
                  transform: 'scale(1.1)'
                }
              }}
            >
              <RefreshIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* ===== BARRA DE BÚSQUEDA ===== */}
      {enableSearch && (
        <Box sx={{ mb: 2 }}>
          <TextField
            fullWidth
            placeholder="Buscar en todos los campos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: '#667eea' }} />
                </InputAdornment>
              ),
              endAdornment: searchTerm && (
                <InputAdornment position="end">
                  <IconButton
                    size="small"
                    onClick={() => setSearchTerm('')}
                    sx={{ color: '#667eea' }}
                  >
                    <ClearIcon />
                  </IconButton>
                </InputAdornment>
              )
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 16,
                background: 'rgba(255,255,255,0.9)',
                backdropFilter: 'blur(10px)',
                border: '2px solid rgba(102, 126, 234, 0.15)',
                '&:hover': {
                  borderColor: 'rgba(102, 126, 234, 0.3)',
                  boxShadow: '0 4px 15px rgba(102, 126, 234, 0.1)'
                },
                '&.Mui-focused': {
                  borderColor: '#667eea',
                  boxShadow: '0 0 0 3px rgba(102, 126, 234, 0.1)'
                }
              }
            }}
          />
        </Box>
      )}

      {/* ===== FILTROS RÁPIDOS ===== */}
      {enableQuickFilters && (
        <Box sx={{ mb: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          <QuickFilterChip
            active={quickFilters.thisMonth}
            color="info"
            label="Este Mes"
            onClick={() => handleQuickFilter('thisMonth')}
            icon={<CalendarIcon />}
          />
          <QuickFilterChip
            active={quickFilters.overdue}
            color="error"
            label="Vencidas"
            onClick={() => handleQuickFilter('overdue')}
            icon={<WarningIcon />}
          />
          <QuickFilterChip
            active={quickFilters.highAmount}
            color="success"
            label="Monto Alto"
            onClick={() => handleQuickFilter('highAmount')}
            icon={<TrendingUpIcon />}
          />
          <QuickFilterChip
            active={quickFilters.urgent}
            color="warning"
            label="Urgente"
            onClick={() => handleQuickFilter('urgent')}
            icon={<ErrorIcon />}
          />
        </Box>
      )}

      {/* ===== TABLA PRINCIPAL ===== */}
      <StyledTableContainer variant={variant} elevation={elevation}>
        <StyledTable ref={tableRef} variant={variant}>
          <TableHead>
            <TableRow>
              {/* Checkbox de selección múltiple */}
              {enableSelection && (
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selectedRows.length === filteredAndSortedData.length && filteredAndSortedData.length > 0}
                    indeterminate={selectedRows.length > 0 && selectedRows.length < filteredAndSortedData.length}
                    onChange={handleSelectAll}
                    sx={{ color: '#667eea' }}
                  />
                </TableCell>
              )}
              
              {/* Encabezados de columnas */}
              {columns
                .filter(col => columnVisibility[col.field])
                .map((column) => (
                  <TableCell 
                    key={column.field}
                    align={column.align || 'left'}
                    sortDirection={sortConfig.field === column.field ? sortConfig.direction : false}
                    sx={{ 
                      cursor: column.sortable !== false ? 'pointer' : 'default',
                      userSelect: 'none'
                    }}
                    onClick={() => column.sortable !== false && handleSort(column.field)}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {column.header}
                      </Typography>
                      {column.sortable !== false && (
                        <SortIcon 
                          sx={{ 
                            fontSize: 16, 
                            opacity: sortConfig.field === column.field ? 1 : 0.3,
                            transform: sortConfig.field === column.field && sortConfig.direction === 'desc' ? 'rotate(180deg)' : 'none'
                          }} 
                        />
                      )}
                    </Box>
                  </TableCell>
                ))}
              
              {/* Columna de acciones */}
              {enableActions && (
                <TableCell align="center" sx={{ minWidth: 120 }}>
                  Acciones
                </TableCell>
              )}
            </TableRow>
          </TableHead>
          
          {/* Fila de filtros inline */}
          {showFilters && (
            <FilterRow>
              {enableSelection && <TableCell />}
              
              {columns
                .filter(col => columnVisibility[col.field])
                .map((column) => (
                  <TableCell key={column.field}>
                    {column.filterType === 'select' ? (
                      <FormControl size="small" fullWidth>
                        <Select
                          value={filters[column.field] || ''}
                          onChange={(e) => handleFilterChange(column.field, e.target.value)}
                          displayEmpty
                          sx={{ fontSize: '0.875rem' }}
                        >
                          <MenuItem value="">Todos</MenuItem>
                          {column.filterOptions?.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                              {option.label}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    ) : column.filterType === 'date' ? (
                      <TextField
                        size="small"
                        type="date"
                        value={filters[column.field] || ''}
                        onChange={(e) => handleFilterChange(column.field, e.target.value)}
                        sx={{ fontSize: '0.875rem' }}
                      />
                    ) : (
                      <TextField
                        size="small"
                        placeholder={`Filtrar ${column.header}...`}
                        value={filters[column.field] || ''}
                        onChange={(e) => handleFilterChange(column.field, e.target.value)}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <SearchIcon sx={{ fontSize: 16, color: '#667eea' }} />
                            </InputAdornment>
                          )
                        }}
                        sx={{ fontSize: '0.875rem' }}
                      />
                    )}
                  </TableCell>
                ))}
              
              {enableActions && (
                <TableCell align="center">
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    Filtros activos
                  </Typography>
                </TableCell>
              )}
            </FilterRow>
          )}

          {/* Cuerpo de la tabla */}
          <TableBody>
            <AnimatePresence>
              {paginatedData.map((row, index) => (
                <motion.tr
                  key={row.id || index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.05 }}
                  component={TableRow}
                  className={`
                    ${selectedRows.includes(row.id) ? 'selected' : ''}
                    ${row.highlighted ? 'highlighted' : ''}
                  `}
                  onClick={() => onRowClick?.(row)}
                  sx={{
                    cursor: onRowClick ? 'pointer' : 'default',
                    '&.selected': {
                      background: 'rgba(102, 126, 234, 0.1)',
                      borderLeft: '4px solid #667eea'
                    },
                    '&.highlighted': {
                      background: 'rgba(255, 193, 7, 0.1)',
                      borderLeft: '4px solid #ffc107'
                    }
                  }}
                >
                  {/* Checkbox de selección */}
                  {enableSelection && (
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={selectedRows.includes(row.id)}
                        onChange={() => handleRowSelection(row.id)}
                        onClick={(e) => e.stopPropagation()}
                        sx={{ color: '#667eea' }}
                      />
                    </TableCell>
                  )}
                  
                  {/* Celdas de datos */}
                  {columns
                    .filter(col => columnVisibility[col.field])
                    .map((column) => (
                      <TableCell key={column.field} align={column.align || 'left'}>
                        {column.render ? (
                          column.render(row[column.field], row, index)
                        ) : (
                          <Box>
                            <Typography variant="body2" sx={{ fontWeight: 500 }}>
                              {row[column.field] || '-'}
                            </Typography>
                            {column.subtitle && (
                              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                {column.subtitle(row)}
                              </Typography>
                            )}
                          </Box>
                        )}
                      </TableCell>
                    ))}
                  
                  {/* Columna de acciones */}
                  {enableActions && (
                    <TableCell align="center">
                      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 0.5 }}>
                        {onView && (
                          <Tooltip title="Ver detalles">
                            <ActionButton
                              color="rgba(33, 150, 243, 0.8)"
                              onClick={(e) => {
                                e.stopPropagation();
                                onView(row);
                              }}
                              size="small"
                            >
                              <VisibilityIcon fontSize="small" />
                            </ActionButton>
                          </Tooltip>
                        )}
                        
                        {onEdit && (
                          <Tooltip title="Editar">
                            <ActionButton
                              color="rgba(255, 193, 7, 0.8)"
                              onClick={(e) => {
                                e.stopPropagation();
                                onEdit(row);
                              }}
                              size="small"
                            >
                              <EditIcon fontSize="small" />
                            </ActionButton>
                          </Tooltip>
                        )}
                        
                        {onDelete && (
                          <Tooltip title="Eliminar">
                            <ActionButton
                              color="rgba(244, 67, 54, 0.8)"
                              onClick={(e) => {
                                e.stopPropagation();
                                onDelete(row);
                              }}
                              size="small"
                            >
                              <DeleteIcon fontSize="small" />
                            </ActionButton>
                          </Tooltip>
                        )}
                      </Box>
                    </TableCell>
                  )}
                </motion.tr>
              ))}
            </AnimatePresence>
          </TableBody>
        </StyledTable>
      </StyledTableContainer>

      {/* ===== PAGINACIÓN ===== */}
      {enablePagination && totalPages > 1 && (
        <Box sx={{ 
          mt: 3, 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 2
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Mostrando {((currentPage - 1) * rowsPerPage) + 1} - {Math.min(currentPage * rowsPerPage, filteredAndSortedData.length)} de {filteredAndSortedData.length} resultados
            </Typography>
            
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <Select
                value={rowsPerPage}
                onChange={(e) => {
                  setRowsPerPage(e.target.value);
                  setCurrentPage(1);
                }}
                sx={{ fontSize: '0.875rem' }}
              >
                {pageSizeOptions.map((size) => (
                  <MenuItem key={size} value={size}>
                    {size} por página
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
          
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={(_, page) => setCurrentPage(page)}
            color="primary"
            showFirstButton
            showLastButton
            size={isMobile ? 'small' : 'medium'}
          />
        </Box>
      )}

      {/* ===== ESTADO VACÍO ===== */}
      {filteredAndSortedData.length === 0 && !loading && (
        <EmptyState 
          hasFilters={Object.keys(filters).length > 0 || searchTerm || Object.values(quickFilters).some(v => v)}
          onRefresh={onRefresh}
          onCreate={onCreate}
          {...emptyStateConfig}
        />
      )}

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
    </Box>
  );
};

export default ModernDataTable;
