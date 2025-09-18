// 🎪 PROJECT DRAWER - VERSIÓN QUE FUNCIONA
// =======================================

import React, { useState, useEffect, useRef, useContext } from 'react';
import { 
  X, 
  Edit2, 
  Trash2, 
  Eye, 
  Calendar, 
  User, 
  Users, 
  Target,
  Clock,
  Activity,
  Settings,
  Save,
  AlertTriangle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useModernToast } from './ModernToast';
import { GlobalContext } from '../../context/GlobalState';
import './project-drawer.css';

// 🔒 SCROLL LOCK UTILITY
const useScrollLock = (isLocked) => {
  useEffect(() => {
    if (isLocked) {
      const originalStyle = window.getComputedStyle(document.body).overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalStyle;
      };
    }
  }, [isLocked]);
};

// 🎯 BUTTON COMPONENT
const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md',
  disabled = false,
  loading = false,
  icon: Icon,
  onClick,
  className = '',
  ...props 
}) => (
  <button
    className={`pd-btn pd-btn--${variant} pd-btn--${size} ${loading ? 'pd-btn--loading' : ''} ${className}`}
    disabled={disabled || loading}
    onClick={onClick}
    {...props}
  >
    {loading ? (
      <div className="pd-spinner" />
    ) : Icon ? (
      <Icon className="pd-btn-icon" />
    ) : null}
    <span>{children}</span>
  </button>
);

// 🏷️ BADGE COMPONENT
const Badge = ({ children, variant = 'default', className = '', ...props }) => (
  <span className={`pd-badge pd-badge--${variant} ${className}`} {...props}>
    {children}
  </span>
);

// 📊 PROGRESS SLIDER
const ProgressSlider = ({ value, onChange, disabled = false }) => {
  const [localValue, setLocalValue] = useState(value);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleChange = (e) => {
    const newValue = parseInt(e.target.value);
    setLocalValue(newValue);
    if (!isDragging) {
      onChange?.(newValue);
    }
  };

  const handleMouseDown = () => setIsDragging(true);
  const handleMouseUp = () => {
    setIsDragging(false);
    if (localValue !== value) {
      onChange?.(localValue);
    }
  };

  return (
    <div className="pd-progress-slider">
      <div className="pd-slider-container">
        <input
          type="range"
          min="0"
          max="100"
          value={localValue}
          onChange={handleChange}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          disabled={disabled}
          className="pd-slider"
        />
        <div className="pd-slider-track">
          <div 
            className="pd-slider-fill"
            style={{ width: `${localValue}%` }}
          />
        </div>
      </div>
      <div className="pd-slider-value">
        <input
          type="number"
          min="0"
          max="100"
          value={localValue}
          onChange={(e) => {
            const newValue = Math.max(0, Math.min(100, parseInt(e.target.value) || 0));
            setLocalValue(newValue);
            onChange?.(newValue);
          }}
          disabled={disabled}
          className="pd-progress-input"
        />
        <span>%</span>
      </div>
    </div>
  );
};

// 🗂️ TAB SYSTEM
const TabButton = ({ active, onClick, icon: Icon, children, disabled = false }) => (
  <button
    className={`pd-tab ${active ? 'pd-tab--active' : ''}`}
    onClick={onClick}
    disabled={disabled}
  >
    {Icon && <Icon className="pd-tab-icon" />}
    <span>{children}</span>
  </button>
);

// ⚠️ CONFIRM DIALOG
const ConfirmDialog = ({ open, onClose, onConfirm, title, message, confirmText = "Eliminar", variant = "danger" }) => (
  <AnimatePresence>
    {open && (
      <motion.div
        className="pd-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        style={{ zIndex: 60 }}
      >
        <motion.div
          className="pd-confirm-dialog"
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="pd-confirm-header">
            <AlertTriangle className="pd-confirm-icon pd-confirm-icon--danger" />
            <h3 className="pd-confirm-title">{title}</h3>
          </div>
          <p className="pd-confirm-message">{message}</p>
          <div className="pd-confirm-actions">
            <Button variant="ghost" onClick={onClose}>
              Cancelar
            </Button>
            <Button variant={variant} onClick={onConfirm}>
              {confirmText}
            </Button>
          </div>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

// 📊 MAIN PROJECT DRAWER COMPONENT
const ProjectDrawerWorking = ({
  open, 
  onClose, 
  project, 
  onUpdate,
  onDelete,
  phases = [],
  initialEditMode = false
}) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isEditing, setIsEditing] = useState(initialEditMode);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editData, setEditData] = useState({});
  const [availableClients, setAvailableClients] = useState([]);
  const [availablePhases, setAvailablePhases] = useState([]);
  const [loadingData, setLoadingData] = useState(false);
  
  const drawerRef = useRef(null);
  const toast = useModernToast();
  const [containerBounds, setContainerBounds] = useState(null);
  

  // 🔒 Scroll management completamente libre - NO bloquear nada
  useEffect(() => {
    // NO aplicar ningún scroll lock
    // El drawer debe permitir scroll libre tanto dentro como fuera
    return () => {
      // Cleanup si es necesario
    };
  }, [open]);

  // 📐 Detectar y centrar en el área del módulo cuando se abre
  useEffect(() => {
    if (open) {
      const updateBounds = () => {
        const bounds = detectModuleContainer();
        setContainerBounds(bounds);
        console.log('🎯 Drawer reposicionado:', bounds);
      };

      // Detectar inmediatamente y con múltiples intentos para asegurar DOM cargado
      const detectWithRetry = () => {
        updateBounds();
        // Reintentar después de animaciones y renderizados
        setTimeout(updateBounds, 100);
        setTimeout(updateBounds, 300);
      };

      detectWithRetry();

      // Actualizar al redimensionar ventana
      window.addEventListener('resize', updateBounds);

      // Observar cambios en el sidebar (usar MutationObserver para detectar cambios de clase)
      const sidebarObserver = new MutationObserver(() => {
        console.log('🔄 Cambio detectado en sidebar, reposicionando drawer...');
        setTimeout(updateBounds, 50);
      });

      // Observar cambios en elementos que podrían afectar el layout
      const elementsToObserve = [
        document.querySelector('[class*="sidebar"]'),
        document.querySelector('[class*="Sidebar"]'),
        document.querySelector('aside'),
        document.querySelector('nav'),
        document.querySelector('header'),
        document.body
      ].filter(Boolean);

      elementsToObserve.forEach(element => {
        if (element) {
          sidebarObserver.observe(element, {
            attributes: true,
            attributeFilter: ['class', 'style'],
            childList: true,
            subtree: false
          });
        }
      });

      return () => {
        window.removeEventListener('resize', updateBounds);
        sidebarObserver.disconnect();
      };
    }
  }, [open]);

  // 🎯 Detectar el área real del contenido del módulo
  const detectModuleContainer = () => {
    console.log('🔍 Iniciando detección del contenedor del módulo...');

    // 1. Detectar información del sidebar para calcular área disponible
    const sidebarInfo = detectSidebarState();
    console.log('📏 Estado del sidebar detectado:', sidebarInfo);

    // 2. Buscar el contenedor del módulo de gestión de proyectos en orden de especificidad
    const selectors = [
      '.project-management-enterprise',
      '[class*="ProjectManagement"]',
      '[class*="UnifiedContainer"]',
      '[class*="MuiContainer"]',
      'main[class*="content"]',
      'main',
      '[class*="main-content"]',
      '[class*="content-area"]',
      '[class*="Container"]',
      '.App > div:last-child',
      '#root > div:last-child'
    ];

    let moduleContainer = null;
    let selectorUsed = null;

    for (const selector of selectors) {
      const elements = document.querySelectorAll(selector);
      // Tomar el elemento más grande que no sea el overlay del drawer
      for (const element of elements) {
        if (element && !element.closest('.pd-overlay') && !element.classList.contains('pd-drawer')) {
          const rect = element.getBoundingClientRect();
          if (rect.width > 200 && rect.height > 200) { // Filtrar elementos muy pequeños
            moduleContainer = element;
            selectorUsed = selector;
            break;
          }
        }
      }
      if (moduleContainer) break;
    }

    if (moduleContainer) {
      const rect = moduleContainer.getBoundingClientRect();
      console.log(`📐 Contenedor encontrado con selector: ${selectorUsed}`);
      console.log('📊 Dimensiones del contenedor:', {
        element: moduleContainer.tagName + (moduleContainer.className ? '.' + moduleContainer.className.split(' ').join('.') : ''),
        x: Math.round(rect.x),
        y: Math.round(rect.y),
        width: Math.round(rect.width),
        height: Math.round(rect.height),
        centerX: Math.round(rect.x + rect.width / 2),
        centerY: Math.round(rect.y + rect.height / 2)
      });

      // Ajustar el centro considerando el área real disponible (evitar header y sidebar)
      const adjustedBounds = adjustForLayoutElements(rect, sidebarInfo);

      return adjustedBounds;
    }

    // Fallback: calcular área disponible basada en layout conocido
    console.log('⚠️ No se encontró contenedor específico, usando cálculo de fallback');
    return calculateFallbackBounds(sidebarInfo);
  };

  // 🔍 Detectar el estado actual del sidebar
  const detectSidebarState = () => {
    const headerHeight = 80; // Header fijo conocido
    let sidebarWidth = 0;
    let sidebarState = 'hidden';

    // Buscar el sidebar
    const sidebarSelectors = [
      '[class*="sidebar"]',
      '[class*="Sidebar"]',
      'aside',
      'nav[class*="nav"]',
      '.MuiDrawer-root',
      '[class*="drawer"]'
    ];

    for (const selector of sidebarSelectors) {
      const sidebar = document.querySelector(selector);
      if (sidebar) {
        const rect = sidebar.getBoundingClientRect();
        const styles = window.getComputedStyle(sidebar);

        // Determinar si el sidebar está visible y su ancho
        if (styles.display !== 'none' && styles.visibility !== 'hidden' && rect.width > 10) {
          sidebarWidth = rect.width;

          // Determinar estado basado en ancho
          if (rect.width > 250) {
            sidebarState = 'expanded';
          } else if (rect.width > 50) {
            sidebarState = 'collapsed';
          } else {
            sidebarState = 'hidden';
          }

          console.log(`📋 Sidebar encontrado: ${selector}, ancho: ${rect.width}px, estado: ${sidebarState}`);
          break;
        }
      }
    }

    return {
      width: sidebarWidth,
      state: sidebarState,
      headerHeight
    };
  };

  // 🎯 Ajustar bounds considerando header y sidebar
  const adjustForLayoutElements = (containerRect, sidebarInfo) => {
    // Calcular el área real disponible para el contenido
    const availableLeft = Math.max(containerRect.x, sidebarInfo.width);
    const availableTop = Math.max(containerRect.y, sidebarInfo.headerHeight);
    const availableRight = Math.min(containerRect.x + containerRect.width, window.innerWidth);
    const availableBottom = Math.min(containerRect.y + containerRect.height, window.innerHeight);

    const availableWidth = availableRight - availableLeft;
    const availableHeight = availableBottom - availableTop;

    // Calcular el ancho máximo seguro del drawer (80% del área disponible, max 650px)
    const maxDrawerWidth = Math.min(availableWidth * 0.8, 650);

    // Calcular los límites seguros para el centro del drawer
    const safeLeftLimit = availableLeft + (maxDrawerWidth / 2) + 20;
    const safeRightLimit = availableRight - (maxDrawerWidth / 2) - 20;
    const safeTopLimit = availableTop + 200; // Mitad de altura mínima del drawer
    const safeBottomLimit = availableBottom - 200;

    // Centro propuesto
    let centerX = availableLeft + availableWidth / 2;
    let centerY = availableTop + availableHeight / 2;

    // Ajustar si está fuera de los límites seguros
    centerX = Math.max(safeLeftLimit, Math.min(centerX, safeRightLimit));
    centerY = Math.max(safeTopLimit, Math.min(centerY, safeBottomLimit));

    const adjustedBounds = {
      centerX: Math.round(centerX),
      centerY: Math.round(centerY),
      width: Math.round(availableWidth),
      height: Math.round(availableHeight),
      maxDrawerWidth: Math.round(maxDrawerWidth),
      sidebarState: sidebarInfo.state,
      sidebarWidth: sidebarInfo.width,
      availableArea: {
        left: availableLeft,
        top: availableTop,
        right: availableRight,
        bottom: availableBottom
      },
      safeLimits: {
        left: safeLeftLimit,
        right: safeRightLimit,
        top: safeTopLimit,
        bottom: safeBottomLimit
      }
    };

    console.log('🎯 Área ajustada para layout:', adjustedBounds);
    console.log('🔢 Cálculos de posicionamiento:', {
      'Centro original': { x: availableLeft + availableWidth / 2, y: availableTop + availableHeight / 2 },
      'Centro ajustado': { x: centerX, y: centerY },
      'Ancho máximo drawer': maxDrawerWidth,
      'Límites seguros': { left: safeLeftLimit, right: safeRightLimit },
      'Área disponible': { width: availableWidth, height: availableHeight }
    });
    return adjustedBounds;
  };

  // 📐 Calcular bounds de fallback cuando no se encuentra contenedor específico
  const calculateFallbackBounds = (sidebarInfo) => {
    const availableLeft = sidebarInfo.width;
    const availableTop = sidebarInfo.headerHeight;
    const availableWidth = window.innerWidth - sidebarInfo.width;
    const availableHeight = window.innerHeight - sidebarInfo.headerHeight;

    // Calcular ancho máximo seguro
    const maxDrawerWidth = Math.min(availableWidth * 0.8, 650);

    // Límites seguros para el fallback
    const safeLeftLimit = availableLeft + (maxDrawerWidth / 2) + 20;
    const safeRightLimit = window.innerWidth - (maxDrawerWidth / 2) - 20;
    const safeTopLimit = availableTop + 200;
    const safeBottomLimit = window.innerHeight - 200;

    let centerX = availableLeft + availableWidth / 2;
    let centerY = availableTop + availableHeight / 2;

    // Ajustar a límites seguros
    centerX = Math.max(safeLeftLimit, Math.min(centerX, safeRightLimit));
    centerY = Math.max(safeTopLimit, Math.min(centerY, safeBottomLimit));

    const fallbackBounds = {
      centerX: Math.round(centerX),
      centerY: Math.round(centerY),
      width: Math.round(availableWidth),
      height: Math.round(availableHeight),
      maxDrawerWidth: Math.round(maxDrawerWidth),
      sidebarState: sidebarInfo.state,
      sidebarWidth: sidebarInfo.width,
      fallback: true
    };

    console.log('🔄 Bounds de fallback calculados:', fallbackBounds);
    return fallbackBounds;
  };

  // 📋 Cargar datos de clientes y fases cuando se abre el drawer
  useEffect(() => {
    if (open && isEditing) {
      loadClientsAndPhases();
    }
  }, [open, isEditing]);

  const loadClientsAndPhases = async () => {
    setLoadingData(true);
    try {
      // Cargar clientes
      console.log('🔍 Cargando clientes...');
      const clientsResponse = await fetch('http://localhost:8765/api/clientes', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (clientsResponse.ok) {
        const clientsData = await clientsResponse.json();
        console.log('✅ Clientes cargados:', clientsData);
        setAvailableClients(clientsData.data || clientsData || []);
      } else {
        console.error('❌ Error cargando clientes:', clientsResponse.status);
        // Datos mock como fallback
        setAvailableClients([
          { id: 1, nombre: 'Cliente Ejemplo 1', color: '#3B82F6' },
          { id: 2, nombre: 'Cliente Ejemplo 2', color: '#10B981' },
          { id: 3, nombre: 'Cliente Ejemplo 3', color: '#F59E0B' }
        ]);
      }

      // Cargar fases
      console.log('🔍 Cargando fases...');
      const phasesResponse = await fetch('http://localhost:8765/api/phases', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (phasesResponse.ok) {
        const phasesData = await phasesResponse.json();
        console.log('✅ Fases cargadas:', phasesData);
        setAvailablePhases(phasesData.data || phasesData || []);
      } else {
        console.error('❌ Error cargando fases:', phasesResponse.status);
        // Datos mock como fallback
        setAvailablePhases([
          { id: 1, nombre: 'Planificación' },
          { id: 2, nombre: 'Desarrollo' },
          { id: 3, nombre: 'Testing' },
          { id: 4, nombre: 'Despliegue' },
          { id: 5, nombre: 'Completado' }
        ]);
      }
    } catch (error) {
      console.error('Error cargando datos:', error);
      // Usar datos mock en caso de error
      setAvailableClients([
        { id: 1, nombre: 'Cliente Ejemplo 1', color: '#3B82F6' },
        { id: 2, nombre: 'Cliente Ejemplo 2', color: '#10B981' },
        { id: 3, nombre: 'Cliente Ejemplo 3', color: '#F59E0B' }
      ]);
      setAvailablePhases([
        { id: 1, nombre: 'Planificación' },
        { id: 2, nombre: 'Desarrollo' },
        { id: 3, nombre: 'Testing' },
        { id: 4, nombre: 'Despliegue' },
        { id: 5, nombre: 'Completado' }
      ]);
      
      toast.error({
        title: 'Error de conexión',
        description: 'Usando datos de ejemplo. Verifica la conexión al servidor.'
      });
    } finally {
      setLoadingData(false);
    }
  };

  // Initialize edit data when project changes
  useEffect(() => {
    if (project) {
      setEditData({
        nombre: project.nombre || '',
        descripcion: project.descripcion || '',
        status: project.status || 'planning',
        priority: project.priority || 'medium',
        progress: project.progress || 0,
        start_date: project.start_date || '',
        end_date: project.end_date || '',
        cliente_id: project.cliente_id || '',
        current_phase_id: project.current_phase_id || '',
        client_color: project.client?.color || '#3B82F6' // Color por defecto azul
      });
    }
  }, [project]);

  // Reset states when drawer closes
  useEffect(() => {
    if (!open) {
      setActiveTab('overview');
      setIsEditing(false);
      setShowDeleteConfirm(false);
    } else {
      // Set initial edit mode when drawer opens
      setIsEditing(initialEditMode);
    }
  }, [open, initialEditMode]);

  // Handle edit mode toggle
  const handleEditToggle = () => {
    if (isEditing) {
      // Cancel editing - reset data
      setEditData({
        nombre: project.nombre || '',
        descripcion: project.descripcion || '',
        status: project.status || 'planning',
        priority: project.priority || 'medium',
        progress: project.progress || 0,
        start_date: project.start_date || '',
        end_date: project.end_date || '',
        cliente_id: project.cliente_id || '',
        current_phase_id: project.current_phase_id || '',
        client_color: project.client?.color || '#3B82F6'
      });
    }
    setIsEditing(!isEditing);
  };

  // Handle save changes
  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch(`http://localhost:8765/api/projects-working/projects/${project.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(editData)
      });

      const data = await response.json();
      
      if (data.success) {
        console.log('✅ Proyecto actualizado:', data.data);
        setIsEditing(false);
        onUpdate?.(data.data);
        toast.success({
          title: 'Proyecto actualizado',
          description: 'Los cambios se guardaron correctamente'
        });
      } else {
        console.error('❌ Error al guardar:', data.message);
        toast.error({
          title: 'Error al guardar',
          description: data.message || 'No se pudieron guardar los cambios'
        });
      }
    } catch (error) {
      console.error('Error saving project:', error);
      toast.error({
        title: 'Error de conexión',
        description: 'No se pudo conectar con el servidor'
      });
    } finally {
      setSaving(false);
    }
  };

  // Handle inline updates (progress)
  const handleInlineUpdate = async (field, value) => {
    try {
      const response = await fetch(`http://localhost:8765/api/projects-working/projects/${project.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ [field]: value })
      });

      const data = await response.json();
      
      if (data.success) {
        console.log('✅ Campo actualizado:', field, value);
        onUpdate?.(data.data);
        toast.success({
          title: field === 'progress' ? 'Progreso actualizado' : 'Campo actualizado',
          description: `${field === 'progress' ? 'Progreso' : 'Campo'} actualizado correctamente`
        });
      } else {
        console.error('❌ Error al actualizar:', data.message);
        toast.error({
          title: 'Error al actualizar',
          description: data.message || 'No se pudo actualizar'
        });
      }
    } catch (error) {
      console.error('Error updating project:', error);
      toast.error({
        title: 'Error de conexión',
        description: 'No se pudo conectar con el servidor'
      });
    }
  };

  // Handle delete
  const handleDelete = async () => {
    try {
      const response = await fetch(`http://localhost:8765/api/projects-working/projects/${project.id}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      const data = await response.json();
      
      if (data.success) {
        console.log('✅ Proyecto eliminado:', data.data);
        onDelete?.(project);
        onClose();
        toast.success({
          title: 'Proyecto eliminado',
          description: 'El proyecto se eliminó correctamente'
        });
      } else {
        console.error('❌ Error al eliminar:', data.message);
        toast.error({
          title: 'Error al eliminar',
          description: data.message || 'No se pudo eliminar el proyecto'
        });
      }
    } catch (error) {
      console.error('Error deleting project:', error);
      toast.error({
        title: 'Error de conexión',
        description: 'No se pudo conectar con el servidor'
      });
    } finally {
      setShowDeleteConfirm(false);
    }
  };

  // Format functions
  const getStatusBadge = (status) => {
    const variants = {
      active: 'success',
      planning: 'warning',
      completed: 'neutral',
      on_hold: 'neutral'
    };
    
    const labels = {
      active: 'Activo',
      planning: 'Planificación',
      completed: 'Completado',
      on_hold: 'En Pausa'
    };

    return <Badge variant={variants[status] || 'neutral'}>{labels[status] || status}</Badge>;
  };

  const getPriorityBadge = (priority) => {
    const variants = {
      high: 'danger',
      urgent: 'danger',
      medium: 'warning',
      low: 'success'
    };
    
    const labels = {
      high: 'Alta',
      urgent: 'Urgente',
      medium: 'Media',
      low: 'Baja'
    };

    return <Badge variant={variants[priority] || 'neutral'}>{labels[priority] || priority}</Badge>;
  };

  const formatDate = (date) => {
    if (!date) return 'N/A';
    try {
      return new Date(date).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return 'N/A';
    }
  };

  if (!project) return null;

  return (
    <>
      <AnimatePresence>
        {open && (
          <>
            {/* Overlay */}
            <motion.div
              className="pd-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
            />
            
            {/* Drawer */}
            <motion.div
              ref={drawerRef}
              className={`pd-drawer ${containerBounds?.sidebarState ? `pd-drawer--sidebar-${containerBounds.sidebarState}` : ''}`}
              role="dialog"
              aria-modal="true"
              aria-labelledby="drawer-title"
              aria-describedby="drawer-description"
              initial={{ 
                opacity: 0,
                scale: 0.9
              }}
              animate={{ 
                opacity: 1,
                scale: 1
              }}
              exit={{ 
                opacity: 0,
                scale: 0.95
              }}
              transition={{ 
                type: 'spring', 
                damping: 25, 
                stiffness: 300,
                duration: 0.3
              }}
              style={containerBounds ? {
                // Posicionamiento seguro calculado
                left: `${containerBounds.centerX}px`,
                top: `${containerBounds.centerY}px`,
                transform: 'translate(-50%, -50%)',
                position: 'fixed',
                zIndex: 9999,
                // Usar el ancho máximo calculado de forma segura
                width: `${containerBounds.maxDrawerWidth || 650}px`,
                maxHeight: `${Math.min(containerBounds.height - 40, window.innerHeight * 0.9)}px`,
                // Protecciones adicionales
                maxWidth: `calc(100vw - 40px)`,
                minWidth: '320px'
              } : {
                // Fallback por defecto si no hay bounds detectados
                position: 'fixed',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                zIndex: 9999,
                maxWidth: 'calc(100vw - 2rem)',
                maxHeight: 'calc(100vh - 2rem)'
              }}
            >
              {/* Header */}
              <div className="pd-header">
                <div className="pd-header-content">
                  <div className="pd-header-info">
                    <Eye className="pd-header-icon" />
                    <div>
                      {isEditing ? (
                        <input
                          type="text"
                          value={editData.nombre}
                          onChange={(e) => setEditData(prev => ({ ...prev, nombre: e.target.value }))}
                          className="pd-header-title-edit"
                          placeholder="Nombre del proyecto..."
                        />
                      ) : (
                        <h2 id="drawer-title" className="pd-header-title">
                          {project.nombre}
                        </h2>
                      )}
                      <p id="drawer-description" className="pd-header-subtitle">
                        {project.client?.nombre || 'Sin cliente'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="pd-header-actions">
                    {!isEditing ? (
                      <>
                        <Button
                          variant="outline"
                          icon={Edit2}
                          onClick={handleEditToggle}
                          size="sm"
                        >
                          Editar
                        </Button>
                        <Button
                          variant="danger"
                          icon={Trash2}
                          onClick={() => setShowDeleteConfirm(true)}
                          size="sm"
                        >
                          Eliminar
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button
                          variant="ghost"
                          onClick={handleEditToggle}
                          size="sm"
                        >
                          Cancelar
                        </Button>
                        <Button
                          variant="primary"
                          icon={Save}
                          onClick={handleSave}
                          loading={saving}
                          size="sm"
                        >
                          Guardar
                        </Button>
                      </>
                    )}
                    
                    <button
                      className="pd-close-btn"
                      onClick={onClose}
                      aria-label="Cerrar"
                    >
                      <X className="pd-icon" />
                    </button>
                  </div>
                </div>

                {/* Tabs */}
                <div className="pd-tabs">
                  <TabButton
                    active={activeTab === 'overview'}
                    onClick={() => setActiveTab('overview')}
                    icon={Eye}
                  >
                    Overview
                  </TabButton>
                  <TabButton
                    active={activeTab === 'activity'}
                    onClick={() => setActiveTab('activity')}
                    icon={Activity}
                  >
                    Actividad
                  </TabButton>
                </div>
              </div>

              {/* Content */}
              <div className="pd-content">
                {activeTab === 'overview' && (
                  <div className="pd-overview pd-overview--improved">
                    
                    {/* SECCIÓN PRINCIPAL - 2 COLUMNAS */}
                    <div className="pd-main-section">
                      
                      {/* COLUMNA IZQUIERDA - INFO BÁSICA */}
                      <div className="pd-column pd-column--left">
                        
                        {/* Description */}
                        <div className="pd-field-group">
                          <label className="pd-field-label">Descripción</label>
                          {isEditing ? (
                            <textarea
                              value={editData.descripcion}
                              onChange={(e) => setEditData(prev => ({ ...prev, descripcion: e.target.value }))}
                              className="pd-textarea"
                              rows="3"
                              placeholder="Descripción del proyecto..."
                            />
                          ) : (
                            <p className="pd-field-value">
                              {project.descripcion || 'Sin descripción'}
                            </p>
                          )}
                        </div>
                        
                        {/* Status & Priority - En fila */}
                        <div className="pd-field-row">
                          {/* Status */}
                          <div className="pd-field-group">
                            <label className="pd-field-label">
                              <Target className="pd-field-icon" />
                              Estado
                            </label>
                            {isEditing ? (
                              <select
                                value={editData.status}
                                onChange={(e) => setEditData(prev => ({ ...prev, status: e.target.value }))}
                                className="pd-select"
                              >
                                <option value="planning">Planificación</option>
                                <option value="active">Activo</option>
                                <option value="completed">Completado</option>
                                <option value="on_hold">En Pausa</option>
                                <option value="cancelled">Cancelado</option>
                              </select>
                            ) : (
                              <div className="pd-field-value">
                                {getStatusBadge(project.status)}
                              </div>
                            )}
                          </div>

                          {/* Priority */}
                          <div className="pd-field-group">
                            <label className="pd-field-label">
                              <AlertTriangle className="pd-field-icon" />
                              Prioridad
                            </label>
                            {isEditing ? (
                              <select
                                value={editData.priority}
                                onChange={(e) => setEditData(prev => ({ ...prev, priority: e.target.value }))}
                                className="pd-select"
                              >
                                <option value="low">Baja</option>
                                <option value="medium">Media</option>
                                <option value="high">Alta</option>
                                <option value="critical">Crítica</option>
                              </select>
                            ) : (
                              <div className="pd-field-value">
                                {getPriorityBadge(project.priority)}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Progress */}
                        <div className="pd-field-group">
                          <label className="pd-field-label">
                            <Target className="pd-field-icon" />
                            Progreso
                          </label>
                          {isEditing ? (
                            <div className="pd-field-progress-edit">
                              <input
                                type="range"
                                min="0"
                                max="100"
                                value={editData.progress || 0}
                                onChange={(e) => setEditData(prev => ({ ...prev, progress: parseInt(e.target.value) }))}
                                className="pd-range-slider"
                              />
                              <span className="pd-progress-value">{editData.progress || 0}%</span>
                            </div>
                          ) : (
                            <ProgressSlider
                              value={project.progress || 0}
                              onChange={(value) => handleInlineUpdate('progress', value)}
                              disabled={false}
                            />
                          )}
                        </div>
                        
                      </div>
                      
                      {/* COLUMNA DERECHA - ASIGNACIONES */}
                      <div className="pd-column pd-column--right">
                      
                        {/* Client */}
                        <div className="pd-field-group">
                          <label className="pd-field-label">
                            <User className="pd-field-icon" />
                            Cliente
                          </label>
                          {isEditing ? (
                            <div className="pd-client-edit-container">
                              <select
                                value={editData.cliente_id || ''}
                                onChange={(e) => {
                                  const selectedClient = availableClients.find(c => c.id === parseInt(e.target.value));
                                  setEditData(prev => ({ 
                                    ...prev, 
                                    cliente_id: e.target.value ? parseInt(e.target.value) : null,
                                    client_color: selectedClient?.color || '#3B82F6'
                                  }));
                                }}
                                className="pd-select"
                                disabled={loadingData}
                              >
                                <option value="">Seleccionar cliente...</option>
                                {availableClients.map(client => (
                                  <option key={client.id} value={client.id}>
                                    {client.nombre}
                                  </option>
                                ))}
                              </select>
                              {/* Color Picker para el cliente */}
                              <div className="pd-color-picker-container">
                                <label className="pd-color-picker-label">Color:</label>
                                <input
                                  type="color"
                                  value={editData.client_color}
                                  onChange={(e) => setEditData(prev => ({ ...prev, client_color: e.target.value }))}
                                  className="pd-color-picker"
                                  title="Seleccionar color del cliente"
                                />
                                <div 
                                  className="pd-color-preview"
                                  style={{ backgroundColor: editData.client_color }}
                                ></div>
                              </div>
                            </div>
                          ) : (
                            <div className="pd-field-value">
                              <div className="pd-client-display">
                                {project.client?.color && (
                                  <div 
                                    className="pd-client-color-indicator"
                                    style={{ backgroundColor: project.client.color }}
                                  ></div>
                                )}
                                <span>{project.client?.nombre || 'Sin cliente'}</span>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Current Phase */}
                        <div className="pd-field-group">
                          <label className="pd-field-label">
                            <Settings className="pd-field-icon" />
                            Fase Actual
                          </label>
                          {isEditing ? (
                            <select
                              value={editData.current_phase_id || ''}
                              onChange={(e) => setEditData(prev => ({ 
                                ...prev, 
                                current_phase_id: e.target.value ? parseInt(e.target.value) : null
                              }))}
                              className="pd-select"
                              disabled={loadingData}
                            >
                              <option value="">Seleccionar fase...</option>
                              {availablePhases.map(phase => (
                                <option key={phase.id} value={phase.id}>
                                  {phase.nombre}
                                </option>
                              ))}
                            </select>
                          ) : (
                            <div className="pd-field-value">
                              <Badge variant="neutral">
                                {project.current_phase?.name || 'Sin fase'}
                              </Badge>
                            </div>
                          )}
                        </div>

                        {/* Fechas - En fila */}
                        <div className="pd-field-row">
                          <div className="pd-field-group">
                            <label className="pd-field-label">
                              <Calendar className="pd-field-icon" />
                              Fecha Inicio
                            </label>
                            {isEditing ? (
                              <input
                                type="date"
                                value={editData.start_date ? (
                                  editData.start_date.includes('T') ? 
                                  editData.start_date.split('T')[0] : 
                                  editData.start_date
                                ) : ''}
                                onChange={(e) => setEditData(prev => ({ ...prev, start_date: e.target.value }))}
                                className="pd-input"
                                placeholder="Fecha de inicio"
                              />
                            ) : (
                              <p className="pd-field-value">
                                {formatDate(project.start_date)}
                              </p>
                            )}
                          </div>

                          <div className="pd-field-group">
                            <label className="pd-field-label">
                              <Clock className="pd-field-icon" />
                              Fecha Fin
                            </label>
                            {isEditing ? (
                              <input
                                type="date"
                                value={editData.end_date ? (
                                  editData.end_date.includes('T') ? 
                                  editData.end_date.split('T')[0] : 
                                  editData.end_date
                                ) : ''}
                                onChange={(e) => setEditData(prev => ({ ...prev, end_date: e.target.value }))}
                                className="pd-input"
                                placeholder="Fecha de finalización"
                              />
                            ) : (
                              <p className="pd-field-value">
                                {formatDate(project.end_date)}
                              </p>
                            )}
                          </div>
                        </div>
                        
                      </div>
                    </div>

                    {/* SECCIÓN DE EQUIPO */}
                    <div className="pd-team-section">
                      <h4 className="pd-section-title">
                        <Users className="pd-section-icon" />
                        Equipo del Proyecto
                      </h4>

                      {/* Team */}
                      <div className="pd-field-group">
                      <label className="pd-field-label">
                        <Users className="pd-field-icon" />
                        Equipo
                      </label>
                      <div className="pd-team-info">
                        {project.members && project.members.length > 0 ? (
                          <>
                            <div className="pd-team-stats">
                              <div className="pd-team-stat">
                                <span className="pd-team-stat-label">Operaciones:</span>
                                <span className="pd-team-stat-value">
                                  {project.members.filter(m => m.team_type === 'operations').length}
                                </span>
                              </div>
                              <div className="pd-team-stat">
                                <span className="pd-team-stat-label">TI:</span>
                                <span className="pd-team-stat-value">
                                  {project.members.filter(m => m.team_type === 'it').length}
                                </span>
                              </div>
                            </div>
                            <div className="pd-team-members">
                              {project.members.slice(0, 5).map((member, index) => (
                                <div key={member.id || index} className="pd-team-member">
                                  <div className="pd-member-avatar">
                                    {((member.user && member.user.name) ? member.user.name : 'U').charAt(0).toUpperCase()}
                                  </div>
                                  <div className="pd-member-info">
                                    <span className="pd-member-name">
                                      {(member.user && member.user.name) ? member.user.name : `Usuario ${member.user_id || 'Desconocido'}`}
                                    </span>
                                    <span className="pd-member-role">
                                      {member.team_type === 'operations' ? 'Operaciones' : 'TI'}
                                    </span>
                                  </div>
                                </div>
                              ))}
                              {project.members.length > 5 && (
                                <div className="pd-team-more">
                                  +{project.members.length - 5} más
                                </div>
                              )}
                            </div>
                          </>
                        ) : (
                          <p className="pd-field-value pd-text-muted">Sin equipo asignado</p>
                        )}
                      </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'activity' && (
                  <div className="pd-activity">
                    <div className="pd-activity-empty">
                      <Activity className="pd-activity-empty-icon" />
                      <h3 className="pd-activity-empty-title">Historial de Actividad</h3>
                      <p className="pd-activity-empty-description">
                        El historial de cambios y actividades del proyecto aparecerá aquí.
                        Esta funcionalidad estará disponible próximamente.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        open={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDelete}
        title="Eliminar Proyecto"
        message={`¿Estás seguro de que deseas eliminar el proyecto "${project.nombre}"? Esta acción no se puede deshacer.`}
        confirmText="Eliminar"
        variant="danger"
      />
    </>
  );
};

export default ProjectDrawerWorking;
