import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Grid,
  FormControl,
  FormControlLabel,
  FormHelperText,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  Switch,
  Radio,
  RadioGroup,
  Chip,
  Avatar,
  IconButton,
  Tooltip,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Card,
  CardContent,
  Divider,
  Alert,
  Snackbar,
  CircularProgress,
  LinearProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Tabs,
  Tab,
  useTheme,
  useMediaQuery,
  Fade,
  Zoom,
  Collapse,
  Grow
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  Save as SaveIcon,
  Send as SendIcon,
  Clear as ClearIcon,
  Refresh as RefreshIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Add as AddIcon,
  Remove as RemoveIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  CloudUpload as CloudUploadIcon,
  AttachFile as AttachFileIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  AutoAwesome as AutoAwesomeIcon,
  Settings as SettingsIcon,
  Tune as TuneIcon,
  ViewColumn as ViewColumnIcon,
  FilterList as FilterListIcon,
  Sort as SortIcon,
  Search as SearchIcon,
  CalendarToday as CalendarIcon,
  LocationOn as LocationOnIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  Business as BusinessIcon,
  Person as PersonIcon,
  Lock as LockIcon,
  Public as PublicIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  ThumbUp as ThumbUpIcon,
  ThumbDown as ThumbDownIcon,
  Share as ShareIcon,
  Print as PrintIcon,
  Download as DownloadIcon,
  Upload as UploadIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  ContentCopy as ContentCopyIcon,
  Link as LinkIcon,
  QrCode as QrCodeIcon,
  Code as CodeIcon,
  DataObject as DataObjectIcon,
  Storage as StorageIcon,
  Security as SecurityIcon,
  VpnKey as VpnKeyIcon,
  VerifiedUser as VerifiedUserIcon,
  AdminPanelSettings as AdminPanelSettingsIcon,
  SupervisedUserCircle as SupervisedUserCircleIcon,
  Group as GroupIcon,
  Work as WorkIcon,
  School as SchoolIcon,
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
import { motion, AnimatePresence } from 'framer-motion';

// ===== COMPONENTES ESTILIZADOS =====
const StyledFormContainer = styled(Box)(({ theme, variant = 'default' }) => ({
  padding: variant === 'compact' ? theme.spacing(2) : theme.spacing(4),
  background: variant === 'glass' 
    ? 'rgba(255,255,255,0.1)' 
    : variant === 'card'
    ? 'rgba(255,255,255,0.95)'
    : 'transparent',
  backdropFilter: variant === 'glass' ? 'blur(20px)' : 'none',
  borderRadius: variant === 'rounded' ? 24 : 16,
  border: variant === 'glass' 
    ? '1px solid rgba(255,255,255,0.2)' 
    : variant === 'card'
    ? '1px solid rgba(0,0,0,0.1)'
    : 'none',
  boxShadow: variant === 'card' ? '0 8px 32px rgba(0,0,0,0.1)' : 'none',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  
  '&:hover': {
    boxShadow: variant === 'card' ? '0 12px 40px rgba(0,0,0,0.15)' : 'none',
    transform: variant === 'card' ? 'translateY(-2px)' : 'none'
  }
}));

const StyledFormField = styled(Box)(({ theme, variant = 'default', hasError = false }) => ({
  marginBottom: theme.spacing(3),
  position: 'relative',
  
  '& .MuiFormControl-root': {
    width: '100%',
    '& .MuiOutlinedInput-root': {
      borderRadius: variant === 'rounded' ? 16 : 12,
      background: variant === 'glass' 
        ? 'rgba(255,255,255,0.9)' 
        : 'rgba(255,255,255,0.95)',
      backdropFilter: 'blur(10px)',
      border: `2px solid ${hasError 
        ? '#f44336' 
        : variant === 'glass' 
        ? 'rgba(102, 126, 234, 0.2)' 
        : 'rgba(102, 126, 234, 0.15)'}`,
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      
      '&:hover': {
        background: 'rgba(255,255,255,0.98)',
        borderColor: hasError 
          ? '#d32f2f' 
          : 'rgba(102, 126, 234, 0.4)',
        transform: 'translateY(-1px)',
        boxShadow: hasError 
          ? '0 4px 15px rgba(244, 67, 54, 0.2)' 
          : '0 4px 15px rgba(102, 126, 234, 0.2)'
      },
      
      '&.Mui-focused': {
        background: 'rgba(255,255,255,1)',
        borderColor: hasError ? '#f44336' : '#667eea',
        boxShadow: hasError 
          ? '0 0 0 3px rgba(244, 67, 54, 0.1), 0 4px 15px rgba(244, 67, 54, 0.3)' 
          : '0 0 0 3px rgba(102, 126, 234, 0.1), 0 4px 15px rgba(102, 126, 234, 0.3)',
        transform: 'translateY(-1px)'
      }
    },
    
    '& .MuiInputLabel-root': {
      fontWeight: 600,
      color: hasError ? '#f44336' : '#667eea',
      fontSize: '0.875rem',
      '&.Mui-focused': {
        color: hasError ? '#f44336' : '#667eea',
        fontWeight: 700
      }
    },
    
    '& .MuiFormHelperText-root': {
      marginLeft: 0,
      marginTop: theme.spacing(0.5),
      fontSize: '0.75rem',
      fontWeight: 500
    }
  }
}));

const StyledButton = styled(Button)(({ theme, variant = 'default', color = 'primary' }) => {
  const getColorScheme = () => {
    switch (color) {
      case 'success': return { bg: '#22c55e', hover: '#16a34a' };
      case 'warning': return { bg: '#f59e0b', hover: '#d97706' };
      case 'error': return { bg: '#ef4444', hover: '#dc2626' };
      case 'info': return { bg: '#3b82f6', hover: '#2563eb' };
      default: return { bg: '#667eea', hover: '#5a6fd8' };
    }
  };
  
  const colorScheme = getColorScheme();
  
  return {
    borderRadius: variant === 'rounded' ? 24 : 12,
    textTransform: 'none',
    fontWeight: 600,
    padding: variant === 'compact' ? theme.spacing(1, 2) : theme.spacing(1.5, 3),
    fontSize: variant === 'compact' ? '0.875rem' : '1rem',
    background: variant === 'gradient' 
      ? `linear-gradient(135deg, ${colorScheme.bg}, ${colorScheme.hover})`
      : colorScheme.bg,
    color: '#fff',
    border: variant === 'outlined' ? `2px solid ${colorScheme.bg}` : 'none',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    
    '&:hover': {
      background: variant === 'gradient' 
        ? `linear-gradient(135deg, ${colorScheme.hover}, ${colorScheme.bg})`
        : colorScheme.hover,
      transform: 'translateY(-2px)',
      boxShadow: `0 8px 25px rgba(${colorScheme.bg}, 0.4)`
    },
    
    '&:active': {
      transform: 'translateY(0) scale(0.98)'
    },
    
    '&.Mui-disabled': {
      background: 'rgba(0,0,0,0.12)',
      color: 'rgba(0,0,0,0.38)',
      transform: 'none',
      boxShadow: 'none'
    }
  };
});

const StyledStep = styled(Step)(({ theme, active = false, completed = false }) => ({
  '& .MuiStepLabel-root': {
    '& .MuiStepLabel-label': {
      color: active ? '#667eea' : completed ? '#22c55e' : 'text.secondary',
      fontWeight: active || completed ? 600 : 400,
      fontSize: '0.875rem'
    },
    '& .MuiStepLabel-iconContainer': {
      '& .MuiStepIcon-root': {
        color: active ? '#667eea' : completed ? '#22c55e' : 'text.secondary',
        fontSize: '1.5rem'
      }
    }
  }
}));

// ===== COMPONENTES DE VALIDACIÓN =====
const ValidationIcon = ({ isValid, isDirty, size = 'small' }) => {
  if (!isDirty) return null;
  
  return (
    <Box sx={{ 
      position: 'absolute', 
      right: 8, 
      top: '50%', 
      transform: 'translateY(-50%)',
      zIndex: 1
    }}>
      {isValid ? (
        <CheckCircleIcon sx={{ color: '#22c55e', fontSize: size === 'small' ? 16 : 20 }} />
      ) : (
        <ErrorIcon sx={{ color: '#f44336', fontSize: size === 'small' ? 16 : 20 }} />
      )}
    </Box>
  );
};

const FieldError = ({ error, variant = 'default' }) => {
  if (!error) return null;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
    >
      <FormHelperText 
        error 
        sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 0.5,
          fontSize: '0.75rem',
          fontWeight: 500,
          mt: 0.5
        }}
      >
        <ErrorIcon sx={{ fontSize: 14 }} />
        {error}
      </FormHelperText>
    </motion.div>
  );
};

// ===== COMPONENTE DE CAMPO DE FORMULARIO =====
const FormField = ({
  field,
  value,
  onChange,
  onBlur,
  error,
  touched,
  variant = 'default',
  size = 'medium',
  fullWidth = true,
  disabled = false,
  required = false,
  autoFocus = false,
  placeholder,
  helperText,
  startIcon,
  endIcon,
  multiline = false,
  rows = 1,
  maxRows,
  type = 'text',
  select = false,
  options = [],
  checkbox = false,
  switch: switchField = false,
  radio = false,
  radioOptions = [],
  date = false,
  time = false,
  datetime = false,
  file = false,
  accept,
  multiple = false,
  password = false,
  showPasswordToggle = false,
  number = false,
  min,
  max,
  step,
  slider = false,
  sliderMarks = false,
  sliderValueLabelDisplay = 'auto',
  minSlider,
  maxSlider,
  stepSlider,
  textarea = false,
  richText = false,
  code = false,
  language = 'javascript',
  autocomplete = false,
  autocompleteOptions = [],
  chips = false,
  chipOptions = [],
  rating = false,
  maxRating = 5,
  color = false,
  colorOptions = [],
  phone = false,
  countryCode = '+1',
  currency = false,
  currencyCode = 'USD',
  percentage = false,
  decimal = false,
  decimalPlaces = 2,
  scientific = false,
  binary = false,
  octal = false,
  hexadecimal = false,
  custom = false,
  customRender,
  conditional = false,
  condition,
  conditionValue,
  conditionField,
  conditionOperator = 'equals',
  conditionType = 'field',
  conditionCustom,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [localValue, setLocalValue] = useState(value);
  const [isDirty, setIsDirty] = useState(false);
  
  // ===== LÓGICA DE CAMPOS CONDICIONALES =====
  const shouldShow = useMemo(() => {
    if (!conditional) return true;
    
    if (conditionType === 'field') {
      const fieldValue = conditionField;
      switch (conditionOperator) {
        case 'equals': return fieldValue === conditionValue;
        case 'not_equals': return fieldValue !== conditionValue;
        case 'contains': return String(fieldValue).includes(conditionValue);
        case 'not_contains': return !String(fieldValue).includes(conditionValue);
        case 'greater_than': return Number(fieldValue) > Number(conditionValue);
        case 'less_than': return Number(fieldValue) < Number(conditionValue);
        case 'greater_than_or_equal': return Number(fieldValue) >= Number(conditionValue);
        case 'less_than_or_equal': return Number(fieldValue) <= Number(conditionValue);
        case 'starts_with': return String(fieldValue).startsWith(conditionValue);
        case 'ends_with': return String(fieldValue).endsWith(conditionValue);
        case 'is_empty': return !fieldValue || fieldValue === '';
        case 'is_not_empty': return fieldValue && fieldValue !== '';
        case 'is_null': return fieldValue === null;
        case 'is_not_null': return fieldValue !== null;
        case 'is_true': return fieldValue === true;
        case 'is_false': return fieldValue === false;
        case 'in_array': return Array.isArray(conditionValue) && conditionValue.includes(fieldValue);
        case 'not_in_array': return Array.isArray(conditionValue) && !conditionValue.includes(fieldValue);
        case 'regex': return new RegExp(conditionValue).test(fieldValue);
        case 'custom': return conditionCustom ? conditionCustom(fieldValue, conditionValue) : true;
        default: return true;
      }
    }
    
    return true;
  }, [conditional, conditionType, conditionField, conditionValue, conditionOperator, conditionCustom]);
  
  // ===== MANEJADORES DE EVENTOS =====
  const handleChange = useCallback((event) => {
    const newValue = event.target.value;
    setLocalValue(newValue);
    setIsDirty(true);
    onChange?.(newValue);
  }, [onChange]);
  
  const handleBlur = useCallback(() => {
    onBlur?.();
  }, [onBlur]);
  
  const handlePasswordToggle = useCallback(() => {
    setShowPassword(!showPassword);
  }, [showPassword]);
  
  // ===== RENDERIZADO CONDICIONAL =====
  if (!shouldShow) return null;
  
  // ===== RENDERIZADO DE CAMPOS ESPECIALES =====
  if (custom && customRender) {
    return customRender({ value, onChange, error, touched, ...props });
  }
  
  if (rating) {
    return (
      <StyledFormField variant={variant} hasError={!!error}>
        <Typography variant="body2" sx={{ mb: 1, fontWeight: 600, color: '#667eea' }}>
          {field.label} {required && '*'}
        </Typography>
        <Box sx={{ display: 'flex', gap: 0.5 }}>
          {[...Array(maxRating)].map((_, index) => (
            <IconButton
              key={index}
              size="small"
              onClick={() => handleChange({ target: { value: index + 1 } })}
              sx={{ color: (index + 1) <= value ? '#ffc107' : 'rgba(0,0,0,0.26)' }}
            >
              {index < value ? <Star /> : <StarBorder />}
            </IconButton>
          ))}
        </Box>
        <FieldError error={error} />
      </StyledFormField>
    );
  }
  
  if (chips) {
    return (
      <StyledFormField variant={variant} hasError={!!error}>
        <Typography variant="body2" sx={{ mb: 1, fontWeight: 600, color: '#667eea' }}>
          {field.label} {required && '*'}
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {chipOptions.map((option) => (
            <Chip
              key={option.value}
              label={option.label}
              onClick={() => handleChange({ target: { value: option.value } })}
              color={value === option.value ? 'primary' : 'default'}
              variant={value === option.value ? 'filled' : 'outlined'}
              sx={{ cursor: 'pointer' }}
            />
          ))}
        </Box>
        <FieldError error={error} />
      </StyledFormField>
    );
  }
  
  if (slider) {
    return (
      <StyledFormField variant={variant} hasError={!!error}>
        <Typography variant="body2" sx={{ mb: 1, fontWeight: 600, color: '#667eea' }}>
          {field.label} {required && '*'}
        </Typography>
        <Box sx={{ px: 2 }}>
          <Slider
            value={value || 0}
            onChange={(_, newValue) => handleChange({ target: { value: newValue } })}
            min={minSlider}
            max={maxSlider}
            step={stepSlider}
            marks={sliderMarks}
            valueLabelDisplay={sliderValueLabelDisplay}
            sx={{
              '& .MuiSlider-thumb': {
                background: 'linear-gradient(135deg, #667eea, #764ba2)',
                boxShadow: '0 2px 8px rgba(102, 126, 234, 0.3)'
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
        <FieldError error={error} />
      </StyledFormField>
    );
  }
  
  // ===== RENDERIZADO DE CAMPOS ESTÁNDAR =====
  const commonProps = {
    fullWidth,
    size: size === 'small' ? 'small' : 'medium',
    disabled,
    required,
    autoFocus,
    placeholder,
    helperText,
    error: !!error,
    variant: 'outlined',
    onBlur: handleBlur,
    ...props
  };
  
  if (select) {
    return (
      <StyledFormField variant={variant} hasError={!!error}>
        <FormControl {...commonProps}>
          <InputLabel>{field.label} {required && '*'}</InputLabel>
          <Select
            value={value || ''}
            onChange={handleChange}
            label={`${field.label} ${required ? '*' : ''}`}
            startAdornment={startIcon}
            endAdornment={endIcon}
          >
            {options.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.icon && <Box component="span" sx={{ mr: 1 }}>{option.icon}</Box>}
                {option.label}
              </MenuItem>
            ))}
          </Select>
          <FieldError error={error} />
        </FormControl>
      </StyledFormField>
    );
  }
  
  if (checkbox) {
    return (
      <StyledFormField variant={variant} hasError={!!error}>
        <FormControlLabel
          control={
            <Checkbox
              checked={!!value}
              onChange={handleChange}
              disabled={disabled}
              color="primary"
            />
          }
          label={`${field.label} ${required && '*'}`}
          sx={{ 
            '& .MuiFormControlLabel-label': { 
              fontWeight: 600, 
              color: '#667eea' 
            } 
          }}
        />
        <FieldError error={error} />
      </StyledFormField>
    );
  }
  
  if (switchField) {
    return (
      <StyledFormField variant={variant} hasError={!!error}>
        <FormControlLabel
          control={
            <Switch
              checked={!!value}
              onChange={handleChange}
              disabled={disabled}
              color="primary"
            />
          }
          label={`${field.label} ${required && '*'}`}
          sx={{ 
            '& .MuiFormControlLabel-label': { 
              fontWeight: 600, 
              color: '#667eea' 
            } 
          }}
        />
        <FieldError error={error} />
      </StyledFormField>
    );
  }
  
  if (radio) {
    return (
      <StyledFormField variant={variant} hasError={!!error}>
        <Typography variant="body2" sx={{ mb: 1, fontWeight: 600, color: '#667eea' }}>
          {field.label} {required && '*'}
        </Typography>
        <RadioGroup
          value={value || ''}
          onChange={handleChange}
          row
        >
          {radioOptions.map((option) => (
            <FormControlLabel
              key={option.value}
              value={option.value}
              control={<Radio color="primary" />}
              label={option.label}
            />
          ))}
        </RadioGroup>
        <FieldError error={error} />
      </StyledFormField>
    );
  }
  
  // ===== CAMPO DE TEXTO ESTÁNDAR =====
  const inputType = password && !showPassword ? 'password' : type;
  
  return (
    <StyledFormField variant={variant} hasError={!!error}>
      <TextField
        {...commonProps}
        type={inputType}
        value={value || ''}
        onChange={handleChange}
        multiline={multiline || textarea}
        rows={rows}
        maxRows={maxRows}
        InputProps={{
          startAdornment: startIcon,
          endAdornment: (
            <>
              {password && showPasswordToggle && (
                <IconButton
                  onClick={handlePasswordToggle}
                  edge="end"
                  size="small"
                >
                  {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                </IconButton>
              )}
              {endIcon}
              <ValidationIcon isValid={!error} isDirty={isDirty} size={size} />
            </>
          )
        }}
      />
      <FieldError error={error} />
    </StyledFormField>
  );
};

// ===== COMPONENTE PRINCIPAL MODERNFORM =====
const ModernForm = ({
  // Configuración del formulario
  fields = [],
  initialValues = {},
  validationSchema = null,
  
  // Configuración de pasos
  steps = null,
  currentStep = 0,
  onStepChange = null,
  
  // Configuración de acciones
  onSubmit,
  onCancel,
  onReset,
  onSave,
  onAutoSave = false,
  autoSaveInterval = 30000, // 30 segundos
  
  // Configuración de validación
  validateOnChange = true,
  validateOnBlur = true,
  validateOnSubmit = true,
  
  // Configuración de UI
  variant = 'default',
  size = 'medium',
  layout = 'grid', // 'grid', 'vertical', 'tabs', 'accordion'
  columns = 2,
  spacing = 3,
  
  // Configuración de campos
  showLabels = true,
  showRequired = true,
  showErrors = true,
  showSuccess = false,
  
  // Configuración de botones
  submitText = 'Enviar',
  cancelText = 'Cancelar',
  resetText = 'Limpiar',
  saveText = 'Guardar',
  
  // Configuración de estado
  loading = false,
  submitting = false,
  success = false,
  error = null,
  
  // Personalización
  title,
  subtitle,
  description,
  icon,
  
  // Props adicionales
  ...props
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  // ===== ESTADOS PRINCIPALES =====
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isDirty, setIsDirty] = useState(false);
  const [autoSaveStatus, setAutoSaveStatus] = useState('idle'); // 'idle', 'saving', 'saved', 'error'
  
  // ===== REFS =====
  const autoSaveTimeoutRef = useRef(null);
  const formRef = useRef(null);
  
  // ===== EFECTOS =====
  useEffect(() => {
    if (onAutoSave && autoSaveInterval > 0) {
      autoSaveTimeoutRef.current = setTimeout(() => {
        handleAutoSave();
      }, autoSaveInterval);
      
      return () => {
        if (autoSaveTimeoutRef.current) {
          clearTimeout(autoSaveTimeoutRef.current);
        }
      };
    }
  }, [values, onAutoSave, autoSaveInterval]);
  
  // ===== FUNCIONES DE VALIDACIÓN =====
  const validateField = useCallback(async (fieldName, value) => {
    if (!validationSchema) return null;
    
    try {
      await validationSchema.validateAt(fieldName, { [fieldName]: value });
      return null;
    } catch (validationError) {
      return validationError.message;
    }
  }, [validationSchema]);
  
  const validateForm = useCallback(async (valuesToValidate = values) => {
    if (!validationSchema) return {};
    
    try {
      await validationSchema.validate(valuesToValidate, { abortEarly: false });
      return {};
    } catch (validationErrors) {
      const newErrors = {};
      validationErrors.inner.forEach((error) => {
        newErrors[error.path] = error.message;
      });
      return newErrors;
    }
  }, [validationSchema, values]);
  
  // ===== FUNCIONES DE MANIPULACIÓN =====
  const handleFieldChange = useCallback(async (fieldName, value) => {
    setValues(prev => ({ ...prev, [fieldName]: value }));
    setIsDirty(true);
    
    if (validateOnChange) {
      const fieldError = await validateField(fieldName, value);
      setErrors(prev => ({ ...prev, [fieldName]: fieldError }));
    }
  }, [validateOnChange, validateField]);
  
  const handleFieldBlur = useCallback(async (fieldName) => {
    setTouched(prev => ({ ...prev, [fieldName]: true }));
    
    if (validateOnBlur) {
      const fieldError = await validateField(fieldName, values[fieldName]);
      setErrors(prev => ({ ...prev, [fieldName]: fieldError }));
    }
  }, [validateOnBlur, validateField, values]);
  
  const handleSubmit = useCallback(async (event) => {
    event?.preventDefault();
    
    if (validateOnSubmit) {
      const newErrors = await validateForm();
      setErrors(newErrors);
      
      if (Object.keys(newErrors).length > 0) {
        return;
      }
    }
    
    onSubmit?.(values);
  }, [validateOnSubmit, validateForm, onSubmit, values]);
  
  const handleCancel = useCallback(() => {
    onCancel?.();
  }, [onCancel]);
  
  const handleReset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
    setIsDirty(false);
    onReset?.();
  }, [initialValues, onReset]);
  
  const handleSave = useCallback(async () => {
    if (validateOnSubmit) {
      const newErrors = await validateForm();
      setErrors(newErrors);
      
      if (Object.keys(newErrors).length > 0) {
        return;
      }
    }
    
    onSave?.(values);
  }, [validateOnSubmit, validateForm, onSave, values]);
  
  const handleAutoSave = useCallback(async () => {
    if (!onAutoSave || !isDirty) return;
    
    setAutoSaveStatus('saving');
    
    try {
      await onAutoSave(values);
      setAutoSaveStatus('saved');
      setIsDirty(false);
      
      // Resetear estado después de 3 segundos
      setTimeout(() => setAutoSaveStatus('idle'), 3000);
    } catch (error) {
      setAutoSaveStatus('error');
      
      // Resetear estado después de 5 segundos
      setTimeout(() => setAutoSaveStatus('idle'), 5000);
    }
  }, [onAutoSave, values, isDirty]);
  
  // ===== RENDERIZADO DE CAMPOS =====
  const renderField = useCallback((field) => {
    const fieldValue = values[field.name];
    const fieldError = errors[field.name];
    const fieldTouched = touched[field.name];
    
    return (
      <FormField
        key={field.name}
        field={field}
        value={fieldValue}
        onChange={(value) => handleFieldChange(field.name, value)}
        onBlur={() => handleFieldBlur(field.name)}
        error={showErrors && fieldTouched ? fieldError : null}
        touched={fieldTouched}
        variant={variant}
        size={size}
        {...field.props}
      />
    );
  }, [values, errors, touched, showErrors, handleFieldChange, handleFieldBlur, variant, size]);
  
  // ===== RENDERIZADO DE PASOS =====
  const renderSteps = useCallback(() => {
    if (!steps) return null;
    
    return (
      <Box sx={{ mb: 4 }}>
        <Stepper activeStep={currentStep} orientation={isMobile ? 'vertical' : 'horizontal'}>
          {steps.map((step, index) => (
            <StyledStep key={index} active={index === currentStep} completed={index < currentStep}>
              <StepLabel>{step.label}</StepLabel>
            </StyledStep>
          ))}
        </Stepper>
      </Box>
    );
  }, [steps, currentStep, isMobile]);
  
  // ===== RENDERIZADO DE LAYOUT =====
  const renderFields = useCallback(() => {
    if (layout === 'tabs') {
      return (
        <Box sx={{ width: '100%' }}>
          <Tabs value={0} sx={{ mb: 3 }}>
            <Tab label="Información General" />
          </Tabs>
          <Box sx={{ p: 2 }}>
            <Grid container spacing={spacing}>
              {fields.map((field) => (
                <Grid item xs={12} md={field.width || 12 / columns} key={field.name}>
                  {renderField(field)}
                </Grid>
              ))}
            </Grid>
          </Box>
        </Box>
      );
    }
    
    if (layout === 'accordion') {
      return (
        <Box sx={{ width: '100%' }}>
          <Accordion defaultExpanded>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6">{title || 'Formulario'}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={spacing}>
                {fields.map((field) => (
                  <Grid item xs={12} md={field.width || 12 / columns} key={field.name}>
                    {renderField(field)}
                  </Grid>
                ))}
              </Grid>
            </AccordionDetails>
          </Accordion>
        </Box>
      );
    }
    
    if (layout === 'vertical') {
      return (
        <Box sx={{ width: '100%' }}>
          {fields.map((field) => (
            <Box key={field.name} sx={{ mb: spacing }}>
              {renderField(field)}
            </Box>
          ))}
        </Box>
      );
    }
    
    // Layout por defecto: grid
    return (
      <Grid container spacing={spacing}>
        {fields.map((field) => (
          <Grid item xs={12} md={field.width || 12 / columns} key={field.name}>
            {renderField(field)}
          </Grid>
        ))}
      </Grid>
    );
  }, [layout, fields, columns, spacing, renderField, title]);
  
  // ===== RENDERIZADO DE BOTONES =====
  const renderActions = useCallback(() => {
    return (
      <Box sx={{ 
        display: 'flex', 
        gap: 2, 
        justifyContent: 'flex-end',
        mt: 4,
        pt: 3,
        borderTop: '1px solid rgba(0,0,0,0.1)'
      }}>
        {onCancel && (
          <StyledButton
            variant="outlined"
            onClick={handleCancel}
            disabled={loading || submitting}
            color="error"
          >
            {cancelText}
          </StyledButton>
        )}
        
        {onReset && (
          <StyledButton
            variant="outlined"
            onClick={handleReset}
            disabled={loading || submitting}
            color="warning"
          >
            {resetText}
          </StyledButton>
        )}
        
        {onSave && (
          <StyledButton
            onClick={handleSave}
            disabled={loading || submitting}
            color="info"
            startIcon={submitting ? <CircularProgress size={16} /> : <SaveIcon />}
          >
            {saveText}
          </StyledButton>
        )}
        
        {onSubmit && (
          <StyledButton
            onClick={handleSubmit}
            disabled={loading || submitting}
            color="primary"
            startIcon={submitting ? <CircularProgress size={16} /> : <SendIcon />}
          >
            {submitText}
          </StyledButton>
        )}
      </Box>
    );
  }, [onCancel, onReset, onSave, onSubmit, loading, submitting, handleCancel, handleReset, handleSave, handleSubmit, cancelText, resetText, saveText, submitText]);
  
  // ===== RENDERIZADO DE ESTADO DE AUTO-GUARDADO =====
  const renderAutoSaveStatus = useCallback(() => {
    if (!onAutoSave) return null;
    
    return (
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: 1,
        mb: 2,
        p: 1,
        borderRadius: 1,
        background: autoSaveStatus === 'saving' ? 'rgba(255, 193, 7, 0.1)' :
                   autoSaveStatus === 'saved' ? 'rgba(76, 175, 80, 0.1)' :
                   autoSaveStatus === 'error' ? 'rgba(244, 67, 54, 0.1)' : 'transparent',
        border: `1px solid ${
          autoSaveStatus === 'saving' ? 'rgba(255, 193, 7, 0.3)' :
          autoSaveStatus === 'saved' ? 'rgba(76, 175, 80, 0.3)' :
          autoSaveStatus === 'error' ? 'rgba(244, 67, 54, 0.3)' : 'transparent'
        }`
      }}>
        {autoSaveStatus === 'saving' && (
          <>
            <CircularProgress size={16} sx={{ color: '#ffc107' }} />
            <Typography variant="caption" sx={{ color: '#ffc107' }}>
              Guardando...
            </Typography>
          </>
        )}
        
        {autoSaveStatus === 'saved' && (
          <>
            <CheckCircleIcon sx={{ fontSize: 16, color: '#4caf50' }} />
            <Typography variant="caption" sx={{ color: '#4caf50' }}>
              Guardado automáticamente
            </Typography>
          </>
        )}
        
        {autoSaveStatus === 'error' && (
          <>
            <ErrorIcon sx={{ fontSize: 16, color: '#f44336' }} />
            <Typography variant="caption" sx={{ color: '#f44336' }}>
              Error al guardar
            </Typography>
          </>
        )}
      </Box>
    );
  }, [onAutoSave, autoSaveStatus]);
  
  return (
    <StyledFormContainer variant={variant} {...props}>
      <form ref={formRef} onSubmit={handleSubmit}>
        {/* Header del formulario */}
        {(title || subtitle || description || icon) && (
          <Box sx={{ mb: 4, textAlign: 'center' }}>
            {icon && (
              <Box sx={{ mb: 2 }}>
                {icon}
              </Box>
            )}
            
            {title && (
              <Typography variant="h4" sx={{ mb: 1, fontWeight: 700, color: '#667eea' }}>
                {title}
              </Typography>
            )}
            
            {subtitle && (
              <Typography variant="h6" sx={{ mb: 1, color: 'text.secondary', fontWeight: 500 }}>
                {subtitle}
              </Typography>
            )}
            
            {description && (
              <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                {description}
              </Typography>
            )}
          </Box>
        )}
        
        {/* Estado de auto-guardado */}
        {renderAutoSaveStatus()}
        
        {/* Pasos del formulario */}
        {renderSteps()}
        
        {/* Campos del formulario */}
        {renderFields()}
        
        {/* Acciones del formulario */}
        {renderActions()}
      </form>
    </StyledFormContainer>
  );
};

export default ModernForm;
