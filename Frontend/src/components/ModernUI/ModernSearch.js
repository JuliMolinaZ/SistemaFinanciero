import React, { useState } from 'react';
import { Box, InputAdornment, Chip, Collapse } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import ClearIcon from '@mui/icons-material/Clear';
import ModernTextField from './ModernTextField';

const ModernSearch = ({
  placeholder = "Buscar...",
  onSearch,
  filters = [],
  onFilterChange,
  value = '',
  onChange,
  ...props
}) => {
  const [showFilters, setShowFilters] = useState(false);
  const [activeFilters, setActiveFilters] = useState({});

  const handleSearch = (searchTerm) => {
    if (onSearch) {
      onSearch(searchTerm, activeFilters);
    }
  };

  const handleFilterToggle = (filterKey, filterValue) => {
    const newFilters = { ...activeFilters };
    if (newFilters[filterKey] === filterValue) {
      delete newFilters[filterKey];
    } else {
      newFilters[filterKey] = filterValue;
    }
    setActiveFilters(newFilters);
    if (onFilterChange) {
      onFilterChange(newFilters);
    }
  };

  const clearFilters = () => {
    setActiveFilters({});
    if (onFilterChange) {
      onFilterChange({});
    }
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
        <ModernTextField
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          startIcon={<SearchIcon sx={{ color: '#4ecdc4' }} />}
          endIcon={
            <InputAdornment position="end">
              {filters.length > 0 && (
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <FilterListIcon
                    sx={{ 
                      color: showFilters ? '#4ecdc4' : '#7f8c8d',
                      cursor: 'pointer',
                      transition: 'color 0.3s ease'
                    }}
                    onClick={() => setShowFilters(!showFilters)}
                  />
                </motion.div>
              )}
            </InputAdornment>
          }
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              handleSearch(value);
            }
          }}
          {...props}
        />
      </Box>

      <Collapse in={showFilters}>
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Box sx={{ mt: 2, p: 2, bgcolor: 'rgba(255,255,255,0.8)', borderRadius: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Box sx={{ fontWeight: 600, color: '#2c3e50' }}>Filtros</Box>
              {Object.keys(activeFilters).length > 0 && (
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Chip
                    label="Limpiar"
                    size="small"
                    onClick={clearFilters}
                    icon={<ClearIcon />}
                    sx={{
                      bgcolor: '#e74c3c',
                      color: 'white',
                      '&:hover': { bgcolor: '#c0392b' }
                    }}
                  />
                </motion.div>
              )}
            </Box>
            
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {filters.map((filter) => (
                <motion.div
                  key={filter.key}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Chip
                    label={filter.label}
                    size="small"
                    onClick={() => handleFilterToggle(filter.key, filter.value)}
                    sx={{
                      bgcolor: activeFilters[filter.key] === filter.value ? '#4ecdc4' : 'rgba(78, 205, 196, 0.1)',
                      color: activeFilters[filter.key] === filter.value ? 'white' : '#4ecdc4',
                      border: '1px solid rgba(78, 205, 196, 0.3)',
                      '&:hover': {
                        bgcolor: activeFilters[filter.key] === filter.value ? '#45b7d1' : 'rgba(78, 205, 196, 0.2)',
                      }
                    }}
                  />
                </motion.div>
              ))}
            </Box>
          </Box>
        </motion.div>
      </Collapse>

      <AnimatePresence>
        {Object.keys(activeFilters).length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <Box sx={{ mt: 1, display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {Object.entries(activeFilters).map(([key, value]) => {
                const filter = filters.find(f => f.key === key);
                return (
                  <Chip
                    key={key}
                    label={`${filter?.label}: ${value}`}
                    size="small"
                    onDelete={() => handleFilterToggle(key, value)}
                    sx={{
                      bgcolor: '#4ecdc4',
                      color: 'white',
                      fontSize: '0.75rem',
                      '& .MuiChip-deleteIcon': {
                        color: 'white',
                        '&:hover': { color: '#f0f0f0' }
                      }
                    }}
                  />
                );
              })}
            </Box>
          </motion.div>
        )}
      </AnimatePresence>
    </Box>
  );
};

export default ModernSearch; 