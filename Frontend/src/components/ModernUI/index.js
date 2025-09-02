// Componentes modernos de UI reutilizables
export { default as ModernCard } from './ModernCard';
export { default as ModernTable } from './ModernTable';
export { default as ModernDataTable } from './ModernDataTable'; // Nueva tabla de datos avanzada
export { default as ModernForm } from './ModernForm'; // Nuevo formulario avanzado
export { default as ModernDialog } from './ModernDialog';
export { default as ModernButton } from './ModernButton';
export { default as ModernTextField } from './ModernTextField';
export { default as ModernHeader } from './ModernHeader';
export { default as ModernSearch } from './ModernSearch';
export { default as ModernStats } from './ModernStats';
export { default as ModernLoading } from './ModernLoading';
export { default as ModernSnackbar } from './ModernSnackbar';
export { default as ModernAvatar } from './ModernAvatar';
export { default as ModernBadge } from './ModernBadge';
export { default as ModernTabs } from './ModernTabs';
export { default as ModernChart } from './ModernChart';
export { default as ModernPagination } from './ModernPagination'; 

// ========================================
// COMPONENTES UNIFICADOS REUTILIZABLES
// ========================================
export {
  // Componentes Base
  UnifiedContainer,
  UnifiedCard,
  UnifiedTableContainer,
  UnifiedTable,
  UnifiedActionButton,
  UnifiedSearchField,
  UnifiedChip,
  
  // Componentes Funcionales
  UnifiedHeader,
  UnifiedDataTable,
  UnifiedForm,
  UnifiedSnackbar,
  
  // Hooks Personalizados
  useDebounce,
  useDataCache,
  
  // Utilidades
  formatCurrency,
  formatDate,
  validations
} from './UnifiedComponents'; 