// components/DashboardComponents/AdvancedFilters.jsx
import React, { useState, useCallback } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  IconButton,
  Tooltip,
  Collapse,
  Button,
  Switch,
  FormControlLabel,
  Slider,
  DatePicker,
  Autocomplete,
  Divider,
  Badge,
  Fab
} from '@mui/material';
import {
  FilterList,
  Clear,
  Save,
  Restore,
  ExpandMore,
  ExpandLess,
  Search,
  CalendarToday,
  AttachMoney,
  Business,
  Assignment,
  Person,
  TrendingUp,
  Settings,
  Bookmark,
  BookmarkBorder
} from '@mui/icons-material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';
import { motion, AnimatePresence } from 'framer-motion';
import { styled } from '@mui/material/styles';
import { es } from 'date-fns/locale';

const FilterCard = styled(Card)(({ theme, active }) => ({
  borderRadius: 12,
  background: active 
    ? 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)'
    : 'rgba(255, 255, 255, 0.9)',
  backdropFilter: 'blur(10px)',
  border: `1px solid ${active ? '#667eea' : 'rgba(0,0,0,0.1)'}`,
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 8px 25px rgba(0,0,0,0.1)'
  }
}));

const FilterChip = styled(Chip)(({ theme }) => ({
  margin: theme.spacing(0.5),
  background: 'rgba(102, 126, 234, 0.1)',
  color: '#667eea',
  border: '1px solid rgba(102, 126, 234, 0.3)',
  '& .MuiChip-deleteIcon': {
    color: '#667eea'
  },
  '&:hover': {
    background: 'rgba(102, 126, 234, 0.2)'
  }
}));

const QuickFilterButton = styled(Button)(({ theme, active }) => ({
  borderRadius: 20,
  textTransform: 'none',
  fontWeight: 600,
  padding: '8px 16px',
  background: active 
    ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    : 'rgba(255, 255, 255, 0.8)',
  color: active ? 'white' : '#667eea',
  border: `1px solid ${active ? 'transparent' : '#667eea'}`,
  transition: 'all 0.3s ease',
  '&:hover': {
    background: active 
      ? 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)'
      : 'rgba(102, 126, 234, 0.1)',
    transform: 'translateY(-1px)'
  }
}));

const AdvancedFilters = ({ onFiltersChange, initialFilters = {}, data = {} }) => {
  const [filters, setFilters] = useState({
    dateRange: initialFilters.dateRange || [null, null],
    amountRange: initialFilters.amountRange || [0, 1000000],
    status: initialFilters.status || [],
    clients: initialFilters.clients || [],
    projects: initialFilters.projects || [],
    categories: initialFilters.categories || [],
    searchTerm: initialFilters.searchTerm || '',
    customFilters: initialFilters.customFilters || {},
    ...initialFilters
  });

  const [expandedSections, setExpandedSections] = useState({
    basic: true,
    financial: false,
    operational: false,
    advanced: false
  });

  const [savedFilters, setSavedFilters] = useState([]);
  const [quickFilters, setQuickFilters] = useState([
    { id: 'today', label: 'Hoy', active: false },
    { id: 'week', label: 'Esta Semana', active: false },
    { id: 'month', label: 'Este Mes', active: false },
    { id: 'quarter', label: 'Trimestre', active: false },
    { id: 'high-value', label: 'Alto Valor', active: false },
    { id: 'pending', label: 'Pendientes', active: false }
  ]);

  // Opciones para los filtros
  const statusOptions = [
    { value: 'active', label: 'Activo', color: '#10b981' },
    { value: 'pending', label: 'Pendiente', color: '#f59e0b' },
    { value: 'completed', label: 'Completado', color: '#3b82f6' },
    { value: 'cancelled', label: 'Cancelado', color: '#ef4444' }
  ];

  const categoryOptions = [
    { value: 'revenue', label: 'Ingresos', icon: '💰' },
    { value: 'expenses', label: 'Gastos', icon: '📊' },
    { value: 'projects', label: 'Proyectos', icon: '🚀' },
    { value: 'clients', label: 'Clientes', icon: '👥' }
  ];

  // Handlers
  const handleFilterChange = useCallback((filterType, value) => {
    const newFilters = {
      ...filters,
      [filterType]: value
    };
    setFilters(newFilters);
    onFiltersChange?.(newFilters);
  }, [filters, onFiltersChange]);

  const handleQuickFilter = (filterId) => {
    const newQuickFilters = quickFilters.map(filter => ({
      ...filter,
      active: filter.id === filterId ? !filter.active : filter.active
    }));
    setQuickFilters(newQuickFilters);

    // Aplicar filtros rápidos
    let newFilters = { ...filters };
    const now = new Date();

    switch (filterId) {
      case 'today':
        newFilters.dateRange = [
          new Date(now.getFullYear(), now.getMonth(), now.getDate()),
          new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59)
        ];
        break;
      case 'week':
        const weekStart = new Date(now.setDate(now.getDate() - now.getDay()));
        const weekEnd = new Date(now.setDate(now.getDate() - now.getDay() + 6));
        newFilters.dateRange = [weekStart, weekEnd];
        break;
      case 'month':
        newFilters.dateRange = [
          new Date(now.getFullYear(), now.getMonth(), 1),
          new Date(now.getFullYear(), now.getMonth() + 1, 0)
        ];
        break;
      case 'high-value':
        newFilters.amountRange = [50000, 1000000];
        break;
      case 'pending':
        newFilters.status = ['pending'];
        break;
      default:
        break;
    }

    setFilters(newFilters);
    onFiltersChange?.(newFilters);
  };

  const clearFilters = () => {
    const clearedFilters = {
      dateRange: [null, null],
      amountRange: [0, 1000000],
      status: [],
      clients: [],
      projects: [],
      categories: [],
      searchTerm: '',
      customFilters: {}
    };
    setFilters(clearedFilters);
    setQuickFilters(prev => prev.map(f => ({ ...f, active: false })));
    onFiltersChange?.(clearedFilters);
  };

  const saveCurrentFilters = () => {
    const filterName = `Filtros ${new Date().toLocaleDateString()}`;
    setSavedFilters(prev => [
      ...prev,
      { id: Date.now(), name: filterName, filters: { ...filters } }
    ]);
  };

  const loadSavedFilters = (savedFilter) => {
    setFilters(savedFilter.filters);
    onFiltersChange?.(savedFilter.filters);
  };

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Contar filtros activos
  const activeFiltersCount = Object.values(filters).flat().filter(Boolean).length;

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
      <Box sx={{ p: 2 }}>
        {/* Header con Quick Actions */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box>
            <Typography variant="h5" fontWeight="bold">
              🔍 Filtros Avanzados
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Personaliza tu vista de datos
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Badge badgeContent={activeFiltersCount} color="primary">
              <FilterList />
            </Badge>
            
            <Tooltip title="Guardar Filtros">
              <IconButton onClick={saveCurrentFilters} color="primary">
                <Save />
              </IconButton>
            </Tooltip>
            
            <Tooltip title="Limpiar Filtros">
              <IconButton onClick={clearFilters} color="error">
                <Clear />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        {/* Filtros Rápidos */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom fontWeight="600">
            ⚡ Filtros Rápidos
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {quickFilters.map((filter) => (
              <QuickFilterButton
                key={filter.id}
                active={filter.active}
                onClick={() => handleQuickFilter(filter.id)}
                size="small"
              >
                {filter.label}
              </QuickFilterButton>
            ))}
          </Box>
        </Box>

        {/* Filtros Básicos */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <FilterCard active={expandedSections.basic}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" fontWeight="600">
                  🔤 Filtros Básicos
                </Typography>
                <IconButton onClick={() => toggleSection('basic')}>
                  {expandedSections.basic ? <ExpandLess /> : <ExpandMore />}
                </IconButton>
              </Box>
              
              <Collapse in={expandedSections.basic}>
                <Grid container spacing={3}>
                  {/* Búsqueda por texto */}
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Búsqueda Global"
                      placeholder="Buscar en todos los campos..."
                      value={filters.searchTerm}
                      onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
                      InputProps={{
                        startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />
                      }}
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                    />
                  </Grid>

                  {/* Filtro por estado */}
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth>
                      <InputLabel>Estado</InputLabel>
                      <Select
                        multiple
                        value={filters.status}
                        onChange={(e) => handleFilterChange('status', e.target.value)}
                        renderValue={(selected) => (
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                            {selected.map((value) => {
                              const option = statusOptions.find(o => o.value === value);
                              return (
                                <Chip 
                                  key={value} 
                                  label={option?.label || value}
                                  size="small"
                                  sx={{ 
                                    bgcolor: `${option?.color}20`,
                                    color: option?.color 
                                  }}
                                />
                              );
                            })}
                          </Box>
                        )}
                        sx={{ borderRadius: 2 }}
                      >
                        {statusOptions.map((option) => (
                          <MenuItem key={option.value} value={option.value}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Box 
                                sx={{ 
                                  width: 12, 
                                  height: 12, 
                                  borderRadius: '50%', 
                                  bgcolor: option.color 
                                }} 
                              />
                              {option.label}
                            </Box>
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
              </Collapse>
            </CardContent>
          </FilterCard>
        </motion.div>

        {/* Filtros Financieros */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <FilterCard active={expandedSections.financial} sx={{ mt: 2 }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" fontWeight="600">
                  💰 Filtros Financieros
                </Typography>
                <IconButton onClick={() => toggleSection('financial')}>
                  {expandedSections.financial ? <ExpandLess /> : <ExpandMore />}
                </IconButton>
              </Box>
              
              <Collapse in={expandedSections.financial}>
                <Grid container spacing={3}>
                  {/* Rango de fechas */}
                  <Grid item xs={12} md={6}>
                    <Typography variant="body2" sx={{ mb: 1, fontWeight: 600 }}>
                      📅 Rango de Fechas
                    </Typography>
                    <DateRangePicker
                      value={filters.dateRange}
                      onChange={(newValue) => handleFilterChange('dateRange', newValue)}
                      renderInput={(startProps, endProps) => (
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <TextField {...startProps} size="small" />
                          <TextField {...endProps} size="small" />
                        </Box>
                      )}
                    />
                  </Grid>

                  {/* Rango de montos */}
                  <Grid item xs={12} md={6}>
                    <Typography variant="body2" sx={{ mb: 1, fontWeight: 600 }}>
                      💵 Rango de Montos
                    </Typography>
                    <Box sx={{ px: 2 }}>
                      <Slider
                        value={filters.amountRange}
                        onChange={(e, newValue) => handleFilterChange('amountRange', newValue)}
                        valueLabelDisplay="auto"
                        min={0}
                        max={1000000}
                        step={1000}
                        valueLabelFormat={(value) => `$${value.toLocaleString()}`}
                        sx={{
                          '& .MuiSlider-thumb': {
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                          },
                          '& .MuiSlider-track': {
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                          }
                        }}
                      />
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                        <Typography variant="caption">
                          ${filters.amountRange[0].toLocaleString()}
                        </Typography>
                        <Typography variant="caption">
                          ${filters.amountRange[1].toLocaleString()}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                </Grid>
              </Collapse>
            </CardContent>
          </FilterCard>
        </motion.div>

        {/* Filtros Operacionales */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <FilterCard active={expandedSections.operational} sx={{ mt: 2 }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" fontWeight="600">
                  🏢 Filtros Operacionales
                </Typography>
                <IconButton onClick={() => toggleSection('operational')}>
                  {expandedSections.operational ? <ExpandLess /> : <ExpandMore />}
                </IconButton>
              </Box>
              
              <Collapse in={expandedSections.operational}>
                <Grid container spacing={3}>
                  {/* Filtro por categorías */}
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth>
                      <InputLabel>Categorías</InputLabel>
                      <Select
                        multiple
                        value={filters.categories}
                        onChange={(e) => handleFilterChange('categories', e.target.value)}
                        renderValue={(selected) => (
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                            {selected.map((value) => {
                              const option = categoryOptions.find(o => o.value === value);
                              return (
                                <Chip
                                  key={value}
                                  label={`${option?.icon} ${option?.label || value}`}
                                  size="small"
                                />
                              );
                            })}
                          </Box>
                        )}
                      >
                        {categoryOptions.map((option) => (
                          <MenuItem key={option.value} value={option.value}>
                            {option.icon} {option.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>

                  {/* Autocompletado para clientes */}
                  <Grid item xs={12} md={6}>
                    <Autocomplete
                      multiple
                      options={data.clients || []}
                      getOptionLabel={(option) => option.nombre || option}
                      value={filters.clients}
                      onChange={(e, newValue) => handleFilterChange('clients', newValue)}
                      renderInput={(params) => (
                        <TextField {...params} label="Clientes" placeholder="Seleccionar clientes..." />
                      )}
                      renderTags={(value, getTagProps) =>
                        value.map((option, index) => (
                          <FilterChip
                            key={index}
                            label={option.nombre || option}
                            {...getTagProps({ index })}
                            icon={<Business />}
                          />
                        ))
                      }
                    />
                  </Grid>
                </Grid>
              </Collapse>
            </CardContent>
          </FilterCard>
        </motion.div>

        {/* Filtros Guardados */}
        {savedFilters.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
          >
            <FilterCard sx={{ mt: 2 }}>
              <CardContent>
                <Typography variant="h6" fontWeight="600" sx={{ mb: 2 }}>
                  📌 Filtros Guardados
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {savedFilters.map((savedFilter) => (
                    <FilterChip
                      key={savedFilter.id}
                      label={savedFilter.name}
                      onClick={() => loadSavedFilters(savedFilter)}
                      onDelete={() => setSavedFilters(prev => 
                        prev.filter(f => f.id !== savedFilter.id)
                      )}
                      icon={<Bookmark />}
                      clickable
                    />
                  ))}
                </Box>
              </CardContent>
            </FilterCard>
          </motion.div>
        )}

        {/* Resumen de filtros activos */}
        <AnimatePresence>
          {activeFiltersCount > 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
            >
              <Box sx={{ 
                position: 'fixed', 
                bottom: 20, 
                left: 20, 
                zIndex: 1000,
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(10px)',
                borderRadius: 3,
                p: 2,
                boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                border: '1px solid rgba(102, 126, 234, 0.2)'
              }}>
                <Typography variant="body2" fontWeight="600" color="primary">
                  {activeFiltersCount} filtro{activeFiltersCount > 1 ? 's' : ''} activo{activeFiltersCount > 1 ? 's' : ''}
                </Typography>
              </Box>
            </motion.div>
          )}
        </AnimatePresence>
      </Box>
    </LocalizationProvider>
  );
};

export default AdvancedFilters;