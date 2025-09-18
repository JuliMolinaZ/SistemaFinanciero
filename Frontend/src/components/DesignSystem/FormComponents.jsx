// 📝 COMPONENTES DE FORMULARIOS UNIFICADOS
// ======================================

import React, { useState, useEffect, forwardRef } from 'react';
import {
  Box,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Switch,
  FormControlLabel,
  Checkbox,
  Radio,
  RadioGroup,
  Chip,
  Autocomplete,
  DatePicker,
  Typography,
  IconButton,
  InputAdornment,
  Tooltip,
  Stack,
  alpha
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Clear as ClearIcon,
  CalendarToday as CalendarIcon,
  Search as SearchIcon,
  Add as AddIcon
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { designTheme, styleUtils } from './theme';
import { UnifiedInput, UnifiedButton, UnifiedCard, UnifiedAlert } from './BaseComponents';

// 🎯 LAYOUT DE FORMULARIO UNIFICADO
export const UnifiedFormLayout = ({
  title,
  subtitle,
  children,
  actions,
  loading = false,
  error = null,
  success = null,
  onSubmit,
  className
}) => {
  return (
    <UnifiedCard variant="glass" className={className}>
      <Box sx={{ p: designTheme.spacing.xl }}>
        {/* Header del formulario */}
        {(title || subtitle) && (
          <Box sx={{ mb: designTheme.spacing.xl }}>
            {title && (
              <Typography
                variant="h3"
                sx={{
                  ...designTheme.typography.h3,
                  ...styleUtils.createTextGradient([
                    designTheme.colors.semantic.primary[400],
                    designTheme.colors.semantic.primary[600]
                  ]),
                  mb: designTheme.spacing.sm
                }}
              >
                {title}
              </Typography>
            )}
            {subtitle && (
              <Typography
                variant="body1"
                sx={{
                  color: designTheme.colors.semantic.neutral[600],
                  ...designTheme.typography.body1
                }}
              >
                {subtitle}
              </Typography>
            )}
          </Box>
        )}

        {/* Alertas de estado */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              style={{ marginBottom: designTheme.spacing.lg }}
            >
              <UnifiedAlert severity="error" title="Error">
                {error}
              </UnifiedAlert>
            </motion.div>
          )}

          {success && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              style={{ marginBottom: designTheme.spacing.lg }}
            >
              <UnifiedAlert severity="success" title="Éxito">
                {success}
              </UnifiedAlert>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Contenido del formulario */}
        <Box
          component="form"
          onSubmit={onSubmit}
          sx={{
            '& .MuiGrid-item': {
              mb: designTheme.spacing.lg
            }
          }}
        >
          {children}

          {/* Acciones del formulario */}
          {actions && (
            <Box
              sx={{
                mt: designTheme.spacing.xl,
                pt: designTheme.spacing.lg,
                borderTop: `1px solid ${designTheme.colors.semantic.neutral[200]}`,
                display: 'flex',
                gap: designTheme.spacing.md,
                justifyContent: 'flex-end',
                flexWrap: 'wrap'
              }}
            >
              {actions}
            </Box>
          )}
        </Box>
      </Box>
    </UnifiedCard>
  );
};

// 🔘 SELECT UNIFICADO
export const UnifiedSelect = ({
  label,
  options = [],
  value,
  onChange,
  error,
  helperText,
  required = false,
  multiple = false,
  placeholder = 'Seleccionar...',
  className,
  ...props
}) => {
  const baseStyles = {
    '& .MuiOutlinedInput-root': {
      borderRadius: designTheme.borderRadius.lg,
      background: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(10px)',
      transition: `all ${designTheme.animations.duration.normal} ${designTheme.animations.easing.easeOut}`,
      '& fieldset': {
        border: `2px solid ${error ? designTheme.colors.semantic.danger[400] : designTheme.colors.semantic.neutral[300]}`,
        transition: `all ${designTheme.animations.duration.normal} ${designTheme.animations.easing.easeOut}`,
      },
      '&:hover fieldset': {
        border: `2px solid ${error ? designTheme.colors.semantic.danger[500] : designTheme.colors.semantic.primary[400]}`,
      },
      '&.Mui-focused fieldset': {
        border: `2px solid ${error ? designTheme.colors.semantic.danger[400] : designTheme.colors.semantic.primary[400]}`,
        boxShadow: error ? designTheme.shadows.focusDanger : designTheme.shadows.focus,
      }
    },
    '& .MuiInputLabel-root': {
      color: designTheme.colors.semantic.neutral[600],
      fontWeight: 500,
      fontSize: designTheme.typography.fontSize.sm,
      '&.Mui-focused': {
        color: error ? designTheme.colors.semantic.danger[400] : designTheme.colors.semantic.primary[400],
        fontWeight: 600,
      }
    },
    '& .MuiFormHelperText-root': {
      fontSize: designTheme.typography.fontSize.xs,
      fontWeight: 500,
      marginTop: designTheme.spacing.xs,
      color: error ? designTheme.colors.semantic.danger[400] : designTheme.colors.semantic.neutral[500]
    }
  };

  return (
    <FormControl fullWidth error={!!error} className={className}>
      <InputLabel sx={{ color: designTheme.colors.semantic.neutral[600] }}>
        {label} {required && '*'}
      </InputLabel>
      <Select
        value={value || (multiple ? [] : '')}
        onChange={onChange}
        label={label}
        multiple={multiple}
        sx={baseStyles}
        displayEmpty
        renderValue={(selected) => {
          if (!selected || (Array.isArray(selected) && selected.length === 0)) {
            return <em style={{ color: designTheme.colors.semantic.neutral[500] }}>{placeholder}</em>;
          }

          if (multiple) {
            return (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {selected.map((value) => {
                  const option = options.find(opt => opt.value === value);
                  return (
                    <Chip
                      key={value}
                      label={option ? option.label : value}
                      size="small"
                      sx={{
                        background: designTheme.gradients.primary,
                        color: designTheme.colors.semantic.primary[900]
                      }}
                    />
                  );
                })}
              </Box>
            );
          }

          const option = options.find(opt => opt.value === selected);
          return option ? option.label : selected;
        }}
        {...props}
      >
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {multiple && (
              <Checkbox
                checked={Array.isArray(value) && value.indexOf(option.value) > -1}
                sx={{ mr: 1 }}
              />
            )}
            {option.label}
          </MenuItem>
        ))}
      </Select>
      {(error || helperText) && (
        <FormHelperText>{error || helperText}</FormHelperText>
      )}
    </FormControl>
  );
};

// 🔒 INPUT DE CONTRASEÑA UNIFICADO
export const UnifiedPasswordInput = ({
  label = 'Contraseña',
  showStrengthMeter = false,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [strength, setStrength] = useState(0);

  const calculateStrength = (password) => {
    let score = 0;
    if (password.length >= 8) score += 1;
    if (/[a-z]/.test(password)) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;
    return score;
  };

  useEffect(() => {
    if (showStrengthMeter && props.value) {
      setStrength(calculateStrength(props.value));
    }
  }, [props.value, showStrengthMeter]);

  const strengthColors = {
    0: designTheme.colors.semantic.neutral[300],
    1: designTheme.colors.semantic.danger[400],
    2: designTheme.colors.semantic.warning[400],
    3: designTheme.colors.semantic.warning[500],
    4: designTheme.colors.semantic.success[400],
    5: designTheme.colors.semantic.success[500]
  };

  const strengthLabels = {
    0: 'Sin contraseña',
    1: 'Muy débil',
    2: 'Débil',
    3: 'Regular',
    4: 'Fuerte',
    5: 'Muy fuerte'
  };

  return (
    <Box>
      <UnifiedInput
        {...props}
        label={label}
        type={showPassword ? 'text' : 'password'}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                onClick={() => setShowPassword(!showPassword)}
                edge="end"
                sx={{ color: designTheme.colors.semantic.neutral[600] }}
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          )
        }}
      />

      {showStrengthMeter && props.value && (
        <Box sx={{ mt: 1 }}>
          <Box sx={{ display: 'flex', gap: 1, mb: 0.5 }}>
            {[1, 2, 3, 4, 5].map((level) => (
              <Box
                key={level}
                sx={{
                  height: 4,
                  flex: 1,
                  borderRadius: designTheme.borderRadius.sm,
                  backgroundColor: level <= strength
                    ? strengthColors[strength]
                    : designTheme.colors.semantic.neutral[200],
                  transition: `all ${designTheme.animations.duration.normal}`
                }}
              />
            ))}
          </Box>
          <Typography
            variant="caption"
            sx={{
              color: strengthColors[strength],
              fontWeight: 500
            }}
          >
            {strengthLabels[strength]}
          </Typography>
        </Box>
      )}
    </Box>
  );
};

// 🔍 CAMPO DE BÚSQUEDA UNIFICADO
export const UnifiedSearchInput = ({
  placeholder = 'Buscar...',
  onSearch,
  onClear,
  debounceMs = 300,
  className,
  ...props
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedTerm, setDebouncedTerm] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedTerm(searchTerm);
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [searchTerm, debounceMs]);

  useEffect(() => {
    if (onSearch) {
      onSearch(debouncedTerm);
    }
  }, [debouncedTerm, onSearch]);

  const handleClear = () => {
    setSearchTerm('');
    if (onClear) {
      onClear();
    }
  };

  return (
    <UnifiedInput
      {...props}
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      placeholder={placeholder}
      className={className}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon sx={{ color: designTheme.colors.semantic.neutral[500] }} />
          </InputAdornment>
        ),
        endAdornment: searchTerm && (
          <InputAdornment position="end">
            <IconButton
              onClick={handleClear}
              size="small"
              sx={{ color: designTheme.colors.semantic.neutral[500] }}
            >
              <ClearIcon />
            </IconButton>
          </InputAdornment>
        )
      }}
    />
  );
};

// 📅 SELECTOR DE FECHA UNIFICADO
export const UnifiedDatePicker = ({
  label,
  value,
  onChange,
  error,
  helperText,
  className,
  ...props
}) => {
  return (
    <Box className={className}>
      <UnifiedInput
        {...props}
        label={label}
        value={value ? value.toISOString().split('T')[0] : ''}
        onChange={(e) => {
          const date = e.target.value ? new Date(e.target.value) : null;
          onChange(date);
        }}
        type="date"
        error={error}
        helperText={helperText}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <CalendarIcon sx={{ color: designTheme.colors.semantic.neutral[500] }} />
            </InputAdornment>
          )
        }}
        InputLabelProps={{
          shrink: true
        }}
      />
    </Box>
  );
};

// 🏷️ SELECTOR DE TAGS UNIFICADO
export const UnifiedTagSelector = ({
  label,
  value = [],
  onChange,
  options = [],
  placeholder = 'Seleccionar tags...',
  allowCustom = false,
  error,
  helperText,
  className
}) => {
  const [inputValue, setInputValue] = useState('');

  const handleAddCustomTag = () => {
    if (allowCustom && inputValue.trim() && !value.includes(inputValue.trim())) {
      onChange([...value, inputValue.trim()]);
      setInputValue('');
    }
  };

  return (
    <Box className={className}>
      <Autocomplete
        multiple
        value={value}
        onChange={(_, newValue) => onChange(newValue)}
        inputValue={inputValue}
        onInputChange={(_, newInputValue) => setInputValue(newInputValue)}
        options={options}
        freeSolo={allowCustom}
        renderTags={(value, getTagProps) =>
          value.map((option, index) => (
            <Chip
              {...getTagProps({ index })}
              key={option}
              label={option}
              sx={{
                background: designTheme.gradients.primary,
                color: designTheme.colors.semantic.primary[900],
                '& .MuiChip-deleteIcon': {
                  color: designTheme.colors.semantic.primary[800]
                }
              }}
            />
          ))
        }
        renderInput={(params) => (
          <UnifiedInput
            {...params}
            label={label}
            placeholder={placeholder}
            error={error}
            helperText={helperText}
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <>
                  {allowCustom && inputValue.trim() && (
                    <InputAdornment position="end">
                      <Tooltip title="Agregar tag personalizado">
                        <IconButton
                          onClick={handleAddCustomTag}
                          size="small"
                          sx={{ color: designTheme.colors.semantic.primary[500] }}
                        >
                          <AddIcon />
                        </IconButton>
                      </Tooltip>
                    </InputAdornment>
                  )}
                  {params.InputProps.endAdornment}
                </>
              )
            }}
          />
        )}
        sx={{
          '& .MuiAutocomplete-paper': {
            borderRadius: designTheme.borderRadius.lg,
            ...styleUtils.createGlassStyle('secondary'),
            backdropFilter: 'blur(20px)'
          }
        }}
      />
    </Box>
  );
};

// 🔄 TOGGLE UNIFICADO
export const UnifiedToggle = ({
  label,
  description,
  checked,
  onChange,
  disabled = false,
  className
}) => {
  return (
    <FormControlLabel
      control={
        <Switch
          checked={checked}
          onChange={onChange}
          disabled={disabled}
          sx={{
            '& .MuiSwitch-switchBase.Mui-checked': {
              color: designTheme.colors.semantic.primary[500],
              '&:hover': {
                backgroundColor: alpha(designTheme.colors.semantic.primary[500], 0.08),
              },
            },
            '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
              backgroundColor: designTheme.colors.semantic.primary[500],
            },
            '& .MuiSwitch-track': {
              borderRadius: designTheme.borderRadius.full,
            }
          }}
        />
      }
      label={
        <Box>
          <Typography variant="body1" sx={{ fontWeight: 500 }}>
            {label}
          </Typography>
          {description && (
            <Typography variant="body2" sx={{ color: designTheme.colors.semantic.neutral[600] }}>
              {description}
            </Typography>
          )}
        </Box>
      }
      className={className}
    />
  );
};

export default {
  UnifiedFormLayout,
  UnifiedSelect,
  UnifiedPasswordInput,
  UnifiedSearchInput,
  UnifiedDatePicker,
  UnifiedTagSelector,
  UnifiedToggle
};