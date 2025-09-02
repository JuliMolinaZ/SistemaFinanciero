import React from 'react';
import { 
  Container, Box, Typography, Button, Dialog, DialogTitle, DialogContent, 
  DialogActions, TextField, Grid, TableContainer, Table, TableHead, 
  TableRow, TableCell, TableBody, Paper, IconButton, Tooltip, 
  CircularProgress, Snackbar, Alert, Chip, Avatar, Card, CardContent,
  useTheme, useMediaQuery
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Edit as EditIcon, Delete as DeleteIcon, Visibility as VisibilityIcon,
  Add as AddIcon, Close as CloseIcon, Refresh as RefreshIcon,
  Download as DownloadIcon, Search as SearchIcon, FilterList as FilterListIcon
} from '@mui/icons-material';

// ========================================
// COMPONENTES BASE REUTILIZABLES
// ========================================

// 1. CONTAINER UNIFICADO
export const UnifiedContainer = styled(Container)(({ theme }) => ({
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

// 2. CARD UNIFICADO
export const UnifiedCard = styled(Card)(({ theme }) => ({
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

// 3. TABLA UNIFICADA
export const UnifiedTableContainer = styled(TableContainer)(({ theme }) => ({
  borderRadius: 16,
  overflow: 'hidden',
  boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
  background: 'rgba(255,255,255,0.98)',
  backdropFilter: 'blur(20px)'
}));

export const UnifiedTable = styled(Table)(({ theme }) => ({
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

// 4. BOTONES DE ACCIÓN UNIFICADOS
export const UnifiedActionButton = styled(IconButton)(({ color }) => ({
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

// 5. CAMPO DE BÚSQUEDA UNIFICADO
export const UnifiedSearchField = styled(TextField)(({ theme }) => ({
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

// 6. CHIP UNIFICADO
export const UnifiedChip = styled(Chip)(({ status }) => ({
  borderRadius: 12,
  fontWeight: 600,
  textTransform: 'uppercase',
  fontSize: '0.75rem',
  background: status === 'active' ? 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' :
              status === 'completed' ? 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)' :
              status === 'pending' ? 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)' :
              'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
  color: '#fff',
  boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
}));

// ========================================
// COMPONENTES FUNCIONALES REUTILIZABLES
// ========================================

// 7. HEADER UNIFICADO
export const UnifiedHeader = ({ title, subtitle, icon, onRefresh, onCreate, stats = [] }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Box sx={{ mb: 4 }}>
      {/* Título Principal */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <Typography
            variant={isMobile ? 'h4' : 'h3'}
            component="h1"
            sx={{
              fontWeight: 800,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 1,
              textTransform: 'capitalize'
            }}
          >
            {icon} {title}
          </Typography>
          {subtitle && (
            <Typography
              variant="h6"
              sx={{
                color: 'rgba(255,255,255,0.8)',
                fontWeight: 400,
                opacity: 0.9
              }}
            >
              {subtitle}
            </Typography>
          )}
        </Box>
      </motion.div>

      {/* Estadísticas */}
      {stats.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Grid container spacing={2} sx={{ mb: 3 }}>
            {stats.map((stat, index) => (
              <Grid item xs={6} sm={3} key={index}>
                <UnifiedCard>
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
                </UnifiedCard>
              </Grid>
            ))}
          </Grid>
        </motion.div>
      )}

      {/* Barra de Acciones */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <Box sx={{ 
          display: 'flex', 
          gap: 2, 
          justifyContent: 'center',
          flexWrap: 'wrap'
        }}>
          {onCreate && (
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={onCreate}
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
              Crear Nuevo
            </Button>
          )}
          {onRefresh && (
            <Button
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={onRefresh}
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
          )}
        </Box>
      </motion.div>
    </Box>
  );
};

// 8. TABLA DE DATOS UNIFICADA
export const UnifiedDataTable = ({ 
  data = [], 
  columns = [], 
  loading = false, 
  onEdit, 
  onDelete, 
  onView,
  emptyMessage = "No hay datos disponibles",
  emptyIcon = <SearchIcon />
}) => {
  if (loading) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <CircularProgress size={40} />
        <Typography sx={{ mt: 2, color: '#7f8c8d' }}>
          Cargando datos...
        </Typography>
      </Box>
    );
  }

  if (data.length === 0) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Box sx={{ color: '#bdc3c7', mb: 2 }}>
          {emptyIcon}
        </Box>
        <Typography variant="h6" sx={{ color: '#7f8c8d', mb: 1 }}>
          {emptyMessage}
        </Typography>
        <Typography variant="body2" sx={{ color: '#95a5a6' }}>
          Comienza agregando el primer elemento
        </Typography>
      </Box>
    );
  }

  return (
    <UnifiedTableContainer>
      <UnifiedTable>
        <TableHead>
          <TableRow>
            {columns.map((column) => (
              <TableCell key={column.id} align={column.align || 'left'}>
                {column.label}
              </TableCell>
            ))}
            {(onEdit || onDelete || onView) && (
              <TableCell align="center">Acciones</TableCell>
            )}
          </TableRow>
        </TableHead>
        <TableBody>
          <AnimatePresence>
            {data.map((row, index) => (
              <motion.tr
                key={row.id || index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                component={TableRow}
              >
                {columns.map((column) => (
                  <TableCell key={column.id} align={column.align || 'left'}>
                    {column.render ? column.render(row) : row[column.id]}
                  </TableCell>
                ))}
                {(onEdit || onDelete || onView) && (
                  <TableCell align="center">
                    <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                      {onView && (
                        <Tooltip title="Ver detalles">
                          <UnifiedActionButton
                            color="#45b7d1"
                            onClick={() => onView(row)}
                          >
                            <VisibilityIcon fontSize="small" />
                          </UnifiedActionButton>
                        </Tooltip>
                      )}
                      {onEdit && (
                        <Tooltip title="Editar">
                          <UnifiedActionButton
                            color="#f39c12"
                            onClick={() => onEdit(row)}
                          >
                            <EditIcon fontSize="small" />
                          </UnifiedActionButton>
                        </Tooltip>
                      )}
                      {onDelete && (
                        <Tooltip title="Eliminar">
                          <UnifiedActionButton
                            color="#e74c3c"
                            onClick={() => onDelete(row)}
                          >
                            <DeleteIcon fontSize="small" />
                          </UnifiedActionButton>
                        </Tooltip>
                      )}
                    </Box>
                  </TableCell>
                )}
              </motion.tr>
            ))}
          </AnimatePresence>
        </TableBody>
      </UnifiedTable>
    </UnifiedTableContainer>
  );
};

// 9. FORMULARIO UNIFICADO
export const UnifiedForm = ({
  open,
  onClose,
  title,
  isEditing,
  children,
  onSubmit,
  submitText = 'Guardar',
  cancelText = 'Cancelar',
  loading = false
}) => {
  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="md" 
      fullWidth
      TransitionComponent={motion.div}
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
        {isEditing ? '✏️ Editar ' : '➕ Crear '}{title}
        <IconButton
          onClick={onClose}
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
        <Box component="form" onSubmit={onSubmit} sx={{ p: 3 }}>
          {children}
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 3, gap: 2 }}>
        <Button
          onClick={onClose}
          variant="outlined"
          sx={{
            borderRadius: 12,
            px: 3,
            py: 1.5,
            fontWeight: 600
          }}
        >
          {cancelText}
        </Button>
        <Button
          type="submit"
          variant="contained"
          disabled={loading}
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
          {loading ? <CircularProgress size={20} /> : submitText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// 10. SNACKBAR UNIFICADO
export const UnifiedSnackbar = ({ open, message, severity, onClose }) => {
  return (
    <Snackbar
      open={open}
      autoHideDuration={6000}
      onClose={onClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
    >
      <Alert
        onClose={onClose}
        severity={severity}
        variant="filled"
        sx={{
          borderRadius: 12,
          fontWeight: 600,
          boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
        }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
};

// ========================================
// HOOKS PERSONALIZADOS REUTILIZABLES
// ========================================

// 11. HOOK DE DEBOUNCE
export const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = React.useState(value);

  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

// 12. HOOK DE CACHE
export const useDataCache = () => {
  const [cache, setCache] = React.useState(new Map());
  const [cacheTime, setCacheTime] = React.useState(new Map());

  const getCachedData = React.useCallback((key) => {
    const data = cache.get(key);
    const time = cacheTime.get(key);
    if (data && time && Date.now() - time < 30000) {
      return data;
    }
    return null;
  }, [cache, cacheTime]);

  const setCachedData = React.useCallback((key, data) => {
    setCache(prev => new Map(prev).set(key, data));
    setCacheTime(prev => new Map(prev).set(key, Date.now()));
  }, []);

  return { getCachedData, setCachedData };
};

// ========================================
// UTILIDADES REUTILIZABLES
// ========================================

// 13. FORMATEADOR DE MONEDA
export const formatCurrency = (value) => {
  if (!value) return '$0.00';
  return new Intl.NumberFormat('es-MX', { 
    style: 'currency', 
    currency: 'MXN' 
  }).format(value);
};

// 14. FORMATEADOR DE FECHA
export const formatDate = (date) => {
  if (!date) return 'N/A';
  return new Date(date).toLocaleDateString('es-MX', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

// 15. VALIDACIONES COMUNES
export const validations = {
  required: (value) => value ? null : 'Este campo es requerido',
  email: (value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value) ? null : 'Email inválido';
  },
  minLength: (min) => (value) => 
    value && value.length >= min ? null : `Mínimo ${min} caracteres`,
  maxLength: (max) => (value) => 
    value && value.length <= max ? null : `Máximo ${max} caracteres`
};
