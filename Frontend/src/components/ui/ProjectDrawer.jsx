// 🎨 PROJECT DRAWER - ENTERPRISE SHEET DETACHED CON PORTAL
// ========================================================

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X as CloseIcon,
  Edit as EditIcon,
  Trash2 as DeleteIcon,
  Save as SaveIcon,
  AlertTriangle as AlertIcon,
  FileText as FileTextIcon,
  Building2 as Building2Icon,
  Activity as ActivityIcon,
  CalendarDays as CalendarIcon,
  User as UserIcon,
  Target as TargetIcon
} from 'lucide-react';

// import { useNotify } from '../../hooks/useNotify';

// 🎨 ANIMATION VARIANTS
const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 }
};

const sheetVariants = {
  hidden: {
    x: '100%'
  },
  visible: {
    x: 0,
    transition: {
      duration: 0.3,
      ease: 'easeOut'
    }
  },
  exit: {
    x: '100%',
    transition: {
      duration: 0.2
    }
  }
};

// 🚫 SCROLL LOCK UTILITY SIMPLIFICADO
const disableBodyScroll = () => {
  document.body.style.overflow = 'hidden';
};

const enableBodyScroll = () => {
  document.body.style.overflow = '';
};

// 🧩 COMPONENTE SECTION REUTILIZABLE
const Section = ({ title, icon: Icon, children, className = '' }) => (
  <section className={`rounded-xl border border-[--border] bg-[--surface-2] p-4 md:p-5 ${className}`}>
    <header className="flex items-center gap-2 mb-3">
      <Icon className="size-4 text-[--text-secondary]" />
      <h3 className="text-sm font-semibold text-[--text-primary]">{title}</h3>
    </header>
    {children}
  </section>
);

// 🏷️ COMPONENTE BADGE
const Badge = ({ variant = 'neutral', children, className = '' }) => {
  const variants = {
    success: 'bg-green-500/10 text-green-600 border-green-500/20',
    warning: 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20',
    danger: 'bg-red-500/10 text-red-600 border-red-500/20',
    neutral: 'bg-[--surface-2] text-[--text-secondary] border-[--border]',
    primary: 'bg-blue-500/10 text-blue-600 border-blue-500/20'
  };

  return (
    <span className={`
      inline-flex items-center h-6 px-2.5 rounded-full text-xs font-medium border
      ${variants[variant]} ${className}
    `}>
      {children}
    </span>
  );
};

// 🔘 COMPONENTE BUTTON
const Button = ({
  variant = 'default',
  size = 'default',
  children,
  onClick,
  disabled = false,
  className = '',
  ...props
}) => {
  const variants = {
    default: 'bg-[--surface-2] text-[--text-primary] border-[--border] hover:bg-[--surface-3]',
    outline: 'bg-transparent text-[--text-primary] border-[--border] hover:bg-[--surface-2]',
    destructive: 'bg-red-600 text-white border-red-600 hover:bg-red-700',
    ghost: 'bg-transparent text-[--text-secondary] border-transparent hover:bg-[--surface-2]'
  };

  const sizes = {
    default: 'h-9 px-4 py-2 text-sm',
    sm: 'h-8 px-3 py-1.5 text-xs',
    lg: 'h-10 px-6 py-2.5 text-base',
    icon: 'h-9 w-9 p-0'
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        inline-flex items-center justify-center rounded-lg border font-medium
        transition-colors duration-150
        focus-visible:ring-2 focus-visible:ring-[--primary] focus-visible:ring-offset-2 focus-visible:ring-offset-[--surface]
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variants[variant]} ${sizes[size]} ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
};

// 📑 COMPONENTE TABS
const TabList = ({ activeTab, onTabChange, children, className = '' }) => (
  <div className={`sticky top-0 z-[1] bg-[--surface] px-5 border-b border-[--border] ${className}`}>
    <div className="flex space-x-1" role="tablist">
      {children}
    </div>
  </div>
);

const Tab = ({ value, isActive, onClick, children }) => (
  <button
    role="tab"
    aria-selected={isActive}
    onClick={() => onClick(value)}
    className={`
      relative px-4 py-3 text-sm font-medium transition-colors duration-150
      focus-visible:ring-2 focus-visible:ring-[--primary] focus-visible:ring-offset-2 focus-visible:ring-offset-[--surface]
      ${isActive
        ? 'text-[--primary] border-b-2 border-[--primary]'
        : 'text-[--text-secondary] hover:text-[--text-primary]'
      }
    `}
  >
    {children}
  </button>
);

// 🎯 COMPONENTE PRINCIPAL
export function ProjectDrawer({
  open,
  onClose,
  project,
  onUpdate,
  onDelete,
  loading = false
}) {
  // const notify = useNotify();
  const notify = {
  };
  const [activeTab, setActiveTab] = useState('overview');
  const [editMode, setEditMode] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editData, setEditData] = useState({});
  const [saving, setSaving] = useState(false);
  const sheetRef = useRef(null);

  // 🔒 Focus trap y scroll lock simplificado
  useEffect(() => {
    if (open) {
      // Scroll lock simple
      disableBodyScroll();

      // Focus simple con delay
      const timer = setTimeout(() => {
        const firstButton = sheetRef.current?.querySelector('button');
        if (firstButton) {
          firstButton.focus();
        }
      }, 150);

      return () => {
        clearTimeout(timer);
        enableBodyScroll();
      };
    }
  }, [open]);

  // 📝 Inicializar datos de edición
  useEffect(() => {
    if (project && editMode) {
      setEditData({
        nombre: project.nombre || '',
        descripcion: project.descripcion || '',
        cliente_id: project.cliente_id || '',
        methodology_id: project.methodology_id || '',
        project_manager_id: project.project_manager_id || '',
        priority: project.priority || 'medium',
        status: project.status || 'planning',
        start_date: project.start_date ? project.start_date.split('T')[0] : '',
        end_date: project.end_date ? project.end_date.split('T')[0] : ''
      });
    }
  }, [project, editMode]);

  // ⌨️ Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (!open) return;

      if (event.key === 'Escape') {
        onClose();
      } else if (event.key === 'e' && !editMode) {
        setEditMode(true);
      } else if ((event.metaKey || event.ctrlKey) && event.key === 'Backspace') {
        event.preventDefault();
        setDeleteDialogOpen(true);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open, editMode, onClose]);

  // 🔄 Handlers
  const handleTabChange = useCallback((newValue) => {
    setActiveTab(newValue);
  }, []);

  const handleEditToggle = useCallback(() => {
    setEditMode(!editMode);
    if (editMode) {
      setEditData({});
    }
  }, [editMode]);

  const handleInputChange = useCallback((field, value) => {
    setEditData(prev => ({ ...prev, [field]: value }));
  }, []);

  const handleSave = useCallback(async () => {
    try {
      setSaving(true);
      await onUpdate(project.id, editData);

      notify.success({
        title: 'Proyecto actualizado',
        description: 'Los cambios se guardaron exitosamente'
      });

      setEditMode(false);
      setEditData({});
    } catch (error) {
      notify.error({
        title: 'Error al actualizar',
        description: error.message || 'No se pudieron guardar los cambios'
      });
    } finally {
      setSaving(false);
    }
  }, [project?.id, editData, onUpdate, notify]);

  const handleDelete = useCallback(async () => {
    try {
      await onDelete(project.id);

      notify.success({
        title: 'Proyecto eliminado',
        description: 'El proyecto se eliminó exitosamente'
      });

      setDeleteDialogOpen(false);
      onClose();
    } catch (error) {
      notify.error({
        title: 'Error al eliminar',
        description: error.message || 'No se pudo eliminar el proyecto'
      });
    }
  }, [project?.id, onDelete, notify, onClose]);

  // 🎨 Status badge variant
  const getStatusVariant = (status) => {
    switch (status) {
      case 'active': return 'success';
      case 'completed': return 'success';
      case 'on_hold': return 'warning';
      case 'cancelled': return 'danger';
      default: return 'neutral';
    }
  };

  // 🎨 Priority badge variant
  const getPriorityVariant = (priority) => {
    switch (priority) {
      case 'low': return 'success';
      case 'medium': return 'warning';
      case 'high': return 'danger';
      case 'urgent': return 'danger';
      default: return 'neutral';
    }
  };

  if (!project) {

    return null;
  }

  const sheetContent = (
    <AnimatePresence>
      {open && (
        <>
          {/* 🌫️ OVERLAY */}
          <motion.div
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-0 z-[60] bg-black/50"
            onClick={onClose}
            style={{ position: 'fixed' }}
          />

          {/* 📋 SHEET CONTENT */}
          <motion.div
            ref={sheetRef}
            variants={sheetVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            role="dialog"
            aria-modal="true"
            aria-labelledby="project-title"
            aria-describedby="project-description"
            className="
              fixed right-0 top-0 bottom-0
              z-[70] w-[400px] max-w-[90vw]
              bg-white dark:bg-gray-800 shadow-2xl border-l border-gray-200 dark:border-gray-700
              overflow-hidden flex flex-col
            "
            style={{ position: 'fixed' }}
          >
            {/* 🔝 HEADER */}
            <header className="px-5 pt-4 pb-3 border-b border-[--border] bg-[--surface]">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1 min-w-0">
                  <h2
                    id="project-title"
                    className="text-xl font-semibold text-[--text-primary] truncate mb-1"
                  >
                    {project.nombre}
                  </h2>
                  <p className="text-sm text-[--text-secondary]">
                    {project.client?.nombre || 'Sin cliente asignado'}
                  </p>
                </div>

                <div className="flex items-center gap-2 ml-4">
                  {!editMode ? (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleEditToggle}
                      aria-label="Editar proyecto (tecla: e)"
                    >
                      <EditIcon className="size-4 mr-1.5" />
                      Editar
                    </Button>
                  ) : (
                    <div className="flex gap-2">
                      <Button
                        variant="default"
                        size="sm"
                        onClick={handleSave}
                        disabled={saving}
                      >
                        <SaveIcon className="size-4 mr-1.5" />
                        Guardar
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleEditToggle}
                        disabled={saving}
                      >
                        Cancelar
                      </Button>
                    </div>
                  )}

                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => setDeleteDialogOpen(true)}
                    aria-label="Eliminar proyecto (⌘+Backspace)"
                  >
                    <DeleteIcon className="size-4 mr-1.5" />
                    Eliminar
                  </Button>

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={onClose}
                    aria-label="Cerrar"
                  >
                    <CloseIcon className="size-4" />
                  </Button>
                </div>
              </div>

              {/* 🏷️ BADGES META */}
              <div className="flex flex-wrap gap-2">
                <Badge variant={getStatusVariant(project.status)}>
                  {project.status || 'planning'}
                </Badge>
                <Badge variant={getPriorityVariant(project.priority)}>
                  {project.priority || 'medium'}
                </Badge>
                {project.progress !== undefined && (
                  <Badge variant="neutral">
                    <span className="tabular-nums">{project.progress}%</span>
                  </Badge>
                )}
              </div>
            </header>

            {/* 📑 TABS */}
            <TabList activeTab={activeTab} onTabChange={handleTabChange}>
              <Tab
                value="overview"
                isActive={activeTab === 'overview'}
                onClick={handleTabChange}
              >
                <FileTextIcon className="size-4 mr-2" />
                Overview
              </Tab>
              <Tab
                value="activity"
                isActive={activeTab === 'activity'}
                onClick={handleTabChange}
              >
                <ActivityIcon className="size-4 mr-2" />
                Actividad
              </Tab>
            </TabList>

            {/* 📄 CONTENT */}
            <div className="flex-1 overflow-y-auto">
              <AnimatePresence mode="wait">
                {activeTab === 'overview' && (
                  <OverviewTab
                    key="overview"
                    project={project}
                    editMode={editMode}
                    editData={editData}
                    onInputChange={handleInputChange}
                    loading={loading}
                  />
                )}

                {activeTab === 'activity' && (
                  <ActivityTab
                    key="activity"
                    project={project}
                    loading={loading}
                  />
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* 🗑️ DELETE CONFIRMATION DIALOG */}
          {deleteDialogOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 z-[80] flex items-center justify-center p-4"
              onClick={() => setDeleteDialogOpen(false)}
              style={{ position: 'fixed' }}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-[--surface] rounded-2xl border border-[--border] p-6 max-w-md w-full shadow-2xl"
                role="dialog"
                aria-labelledby="delete-title"
                aria-describedby="delete-description"
                style={{ position: 'relative' }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-red-500/10 rounded-full flex items-center justify-center">
                    <AlertIcon className="size-5 text-red-600" />
                  </div>
                  <div>
                    <h3 id="delete-title" className="text-lg font-semibold text-[--text-primary]">
                      Confirmar eliminación
                    </h3>
                    <p id="delete-description" className="text-sm text-[--text-secondary]">
                      Esta acción no se puede deshacer.
                    </p>
                  </div>
                </div>

                <p className="text-[--text-primary] mb-6">
                  ¿Estás seguro de que quieres eliminar el proyecto{' '}
                  <strong className="font-semibold">{project.nombre}</strong>?
                </p>

                <div className="flex justify-end gap-3">
                  <Button
                    variant="ghost"
                    onClick={() => setDeleteDialogOpen(false)}
                  >
                    Cancelar
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={handleDelete}
                  >
                    Eliminar proyecto
                  </Button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </>
      )}
    </AnimatePresence>
  );

  // 🌐 RENDER EN PORTAL AL BODY
  return createPortal(sheetContent, document.body);
}

// 📋 OVERVIEW TAB COMPONENT
function OverviewTab({ project, editMode, editData, onInputChange, loading }) {
  if (loading) {
    return (
      <div className="p-5 space-y-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="rounded-xl bg-[--surface-2] border border-[--border] p-4 animate-pulse">
            <div className="h-4 bg-[--surface-3] rounded mb-3 w-1/3"></div>
            <div className="space-y-2">
              <div className="h-3 bg-[--surface-3] rounded w-full"></div>
              <div className="h-3 bg-[--surface-3] rounded w-2/3"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.2 }}
      className="p-5 space-y-4"
    >
      {/* 📝 INFORMACIÓN DEL PROYECTO */}
      <Section title="Información del Proyecto" icon={FileTextIcon}>
        <div className="space-y-4">
          {/* Nombre y Descripción */}
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium text-[--text-primary] mb-2">
                Nombre del proyecto
              </label>
              {editMode ? (
                <input
                  type="text"
                  value={editData.nombre || ''}
                  onChange={(e) => onInputChange('nombre', e.target.value)}
                  className="w-full px-3 py-2 bg-[--surface-3] border border-[--border] rounded-lg text-[--text-primary] placeholder-[--text-secondary] focus:ring-2 focus:ring-[--primary] focus:ring-offset-2 focus:ring-offset-[--surface-2] focus:border-transparent"
                  placeholder="Nombre del proyecto"
                />
              ) : (
                <p className="text-[--text-primary] font-medium">{project.nombre}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-[--text-primary] mb-2">
                Descripción
              </label>
              {editMode ? (
                <textarea
                  value={editData.descripcion || ''}
                  onChange={(e) => onInputChange('descripcion', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 bg-[--surface-3] border border-[--border] rounded-lg text-[--text-primary] placeholder-[--text-secondary] focus:ring-2 focus:ring-[--primary] focus:ring-offset-2 focus:ring-offset-[--surface-2] focus:border-transparent resize-none"
                  placeholder="Descripción del proyecto"
                />
              ) : (
                <p className="text-[--text-secondary]">
                  {project.descripcion || 'Sin descripción'}
                </p>
              )}
            </div>
          </div>

          {/* Estado y Prioridad */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[--text-primary] mb-2">
                Estado
              </label>
              {editMode ? (
                <select
                  value={editData.status || 'planning'}
                  onChange={(e) => onInputChange('status', e.target.value)}
                  className="w-full px-3 py-2 bg-[--surface-3] border border-[--border] rounded-lg text-[--text-primary] focus:ring-2 focus:ring-[--primary] focus:ring-offset-2 focus:ring-offset-[--surface-2] focus:border-transparent"
                >
                  <option value="planning">Planificación</option>
                  <option value="active">Activo</option>
                  <option value="on_hold">En Pausa</option>
                  <option value="completed">Completado</option>
                  <option value="cancelled">Cancelado</option>
                </select>
              ) : (
                <Badge variant={getStatusVariant(project.status)}>
                  {project.status || 'planning'}
                </Badge>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-[--text-primary] mb-2">
                Prioridad
              </label>
              {editMode ? (
                <select
                  value={editData.priority || 'medium'}
                  onChange={(e) => onInputChange('priority', e.target.value)}
                  className="w-full px-3 py-2 bg-[--surface-3] border border-[--border] rounded-lg text-[--text-primary] focus:ring-2 focus:ring-[--primary] focus:ring-offset-2 focus:ring-offset-[--surface-2] focus:border-transparent"
                >
                  <option value="low">Baja</option>
                  <option value="medium">Media</option>
                  <option value="high">Alta</option>
                  <option value="urgent">Urgente</option>
                </select>
              ) : (
                <Badge variant={getPriorityVariant(project.priority)}>
                  {project.priority || 'medium'}
                </Badge>
              )}
            </div>
          </div>
        </div>
      </Section>

      {/* 👥 CLIENTE Y EQUIPO */}
      <Section title="Cliente y Equipo" icon={Building2Icon}>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[--text-primary] mb-2">
              Cliente
            </label>
            <p className="text-[--text-secondary]">
              {project.client?.nombre || 'Sin cliente asignado'}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-[--text-primary] mb-2">
              Project Manager
            </label>
            <div className="flex items-center gap-2">
              <UserIcon className="size-4 text-[--text-secondary]" />
              <span className="text-[--text-secondary]">
                {project.project_manager?.name || 'Sin PM asignado'}
              </span>
            </div>
          </div>

          {project.members && project.members.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-[--text-primary] mb-2">
                Miembros del equipo
              </label>
              <div className="flex flex-wrap gap-2">
                {project.members?.map(member => (
                  <Badge key={member.id} variant="neutral">
                    {member.user?.name || 'Usuario'} ({member.team_type === 'operations' ? 'Operaciones' : 'TI'})
                  </Badge>
                )) || []}
              </div>
            </div>
          )}
        </div>
      </Section>

      {/* 📊 FASE Y PROGRESO */}
      <Section title="Fase y Progreso" icon={TargetIcon}>
        <div className="space-y-4">
          {project.progress !== undefined && (
            <div>
              <label className="block text-sm font-medium text-[--text-primary] mb-2">
                Progreso
              </label>
              <div className="flex items-center gap-3">
                <div className="flex-1 bg-[--surface-3] rounded-full h-2">
                  <div
                    className="bg-[--primary] h-2 rounded-full transition-all duration-300"
                    style={{ width: `${project.progress}%` }}
                  />
                </div>
                <span className="text-sm font-medium text-[--text-primary] tabular-nums">
                  {project.progress}%
                </span>
              </div>
            </div>
          )}

          {project.methodology && (
            <div>
              <label className="block text-sm font-medium text-[--text-primary] mb-2">
                Metodología
              </label>
              <Badge variant="primary">
                {project.methodology?.name || 'Sin metodología'}
              </Badge>
            </div>
          )}
        </div>
      </Section>

      {/* 📅 FECHAS */}
      <Section title="Fechas" icon={CalendarIcon}>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-[--text-primary] mb-2">
              Fecha de inicio
            </label>
            {editMode ? (
              <input
                type="date"
                value={editData.start_date || ''}
                onChange={(e) => onInputChange('start_date', e.target.value)}
                className="w-full px-3 py-2 bg-[--surface-3] border border-[--border] rounded-lg text-[--text-primary] focus:ring-2 focus:ring-[--primary] focus:ring-offset-2 focus:ring-offset-[--surface-2] focus:border-transparent"
              />
            ) : (
              <p className="text-[--text-secondary] tabular-nums">
                {project.start_date
                  ? new Date(project.start_date).toLocaleDateString('es-ES', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })
                  : 'No definida'
                }
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-[--text-primary] mb-2">
              Fecha de fin
            </label>
            {editMode ? (
              <input
                type="date"
                value={editData.end_date || ''}
                onChange={(e) => onInputChange('end_date', e.target.value)}
                className="w-full px-3 py-2 bg-[--surface-3] border border-[--border] rounded-lg text-[--text-primary] focus:ring-2 focus:ring-[--primary] focus:ring-offset-2 focus:ring-offset-[--surface-2] focus:border-transparent"
              />
            ) : (
              <p className="text-[--text-secondary] tabular-nums">
                {project.end_date
                  ? new Date(project.end_date).toLocaleDateString('es-ES', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })
                  : 'No definida'
                }
              </p>
            )}
          </div>
        </div>
      </Section>
    </motion.div>
  );
}

// 📈 ACTIVITY TAB COMPONENT
function ActivityTab({ project, loading }) {
  if (loading) {
    return (
      <div className="p-5 space-y-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex gap-3 animate-pulse">
            <div className="w-8 h-8 bg-[--surface-3] rounded-full"></div>
            <div className="flex-1 space-y-2">
              <div className="h-3 bg-[--surface-3] rounded w-1/3"></div>
              <div className="h-3 bg-[--surface-3] rounded w-2/3"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.2 }}
      className="p-5"
    >
      <Section title="Actividad Reciente" icon={ActivityIcon}>
        <div className="text-center py-8">
          <ActivityIcon className="size-12 text-[--text-secondary] mx-auto mb-3 opacity-50" />
          <p className="text-[--text-secondary]">
            Funcionalidad de actividad en desarrollo
          </p>
          <p className="text-sm text-[--text-tertiary] mt-1">
            Aquí se mostrarán los cambios y actualizaciones del proyecto
          </p>
        </div>
      </Section>
    </motion.div>
  );
}

// 🎨 Helper functions (moved outside component to avoid recreating)
const getStatusVariant = (status) => {
  switch (status) {
    case 'active': return 'success';
    case 'completed': return 'success';
    case 'on_hold': return 'warning';
    case 'cancelled': return 'danger';
    default: return 'neutral';
  }
};

const getPriorityVariant = (priority) => {
  switch (priority) {
    case 'low': return 'success';
    case 'medium': return 'warning';
    case 'high': return 'danger';
    case 'urgent': return 'danger';
    default: return 'neutral';
  }
};

export default ProjectDrawer;