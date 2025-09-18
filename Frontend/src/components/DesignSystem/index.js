// 🎨 SISTEMA DE DISEÑO UNIFICADO - PROYECTO MANAGEMENT
// ===================================================

// Importar tema y utilidades desde archivo separado
import { designTheme, styleUtils } from './theme';

// 📦 EXPORTAR TODOS LOS COMPONENTES DEL SISTEMA DE DISEÑO
export { default as BaseComponents } from './BaseComponents';
export { default as FormComponents } from './FormComponents';

// 🏗️ EXPORTAR COMPONENTES PROFESIONALES OPTIMIZADOS
export {
  StatCard,
  Badge,
  Progress,
  QuickAction,
  EmptyState,
  Skeleton
} from './ProfessionalComponents';

// 🎨 EXPORTAR TEMA Y UTILIDADES
export { designTheme, styleUtils };

// Exportar designTheme como default
export default designTheme;