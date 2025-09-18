// 🚀 FAB CONTEXTUAL - CAMBIA SEGÚN LA PESTAÑA ACTIVA
// ==================================================

import React, { useEffect } from 'react';
import { Plus, CheckSquare, Clock, BarChart3, LayoutDashboard } from 'lucide-react';
import './enterprise-system.css';

// 🎯 CONFIGURACIÓN DE FAB POR PESTAÑA
const FAB_CONFIG = {
  'Dashboard': {
    icon: LayoutDashboard,
    label: 'Vista general',
    action: 'overview',
    hidden: true // No mostrar FAB en dashboard
  },
  'Proyectos': {
    icon: Plus,
    label: 'Nuevo proyecto',
    action: 'createProject',
    shortcut: 'p'
  },
  'Tareas': {
    icon: CheckSquare,
    label: 'Nueva tarea',
    action: 'createTask',
    shortcut: 't'
  },
  'Sprints': {
    icon: Clock,
    label: 'Nuevo sprint',
    action: 'createSprint',
    shortcut: 's'
  },
  'Analytics': {
    icon: BarChart3,
    label: 'Exportar reporte',
    action: 'exportReport',
    shortcut: 'r'
  }
};

// 🎯 FAB CONTEXTUAL ENTERPRISE
export default function ContextualFab({ 
  activeTab = 'Dashboard',
  onAction,
  className = '',
  ...props 
}) {
  
  const config = FAB_CONFIG[activeTab];
  
  // 🎹 Atajos contextuales: ⌘/Ctrl + [letra]
  useEffect(() => {
    const handleKeyDown = (e) => {
      const cmdOrCtrl = e.metaKey || e.ctrlKey;
      
      if (cmdOrCtrl && config?.shortcut && e.key.toLowerCase() === config.shortcut) {
        e.preventDefault();
        handleAction();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeTab, config]);

  const handleAction = () => {
    if (!config) return;
    
    console.log(`🚀 Ejecutando acción: ${config.action} desde pestaña: ${activeTab}`);
    
    // Ejecutar acción específica
    switch (config.action) {
      case 'createProject':
        onAction?.('createProject');
        break;
      case 'createTask':
        onAction?.('createTask');
        break;
      case 'createSprint':
        onAction?.('createSprint');
        break;
      case 'exportReport':
        onAction?.('exportReport');
        break;
      default:
        console.log('Acción no definida:', config.action);
    }
  };

  // No mostrar FAB si está configurado como oculto
  if (!config || config.hidden) {
    return null;
  }

  const Icon = config.icon;

  return (
    <div className={`enterprise-fab-container ${className}`} {...props}>
      {/* Etiqueta contextual */}
      <span
        className="enterprise-fab-tooltip"
        role="tooltip"
        id={`fab-${config.action}-tip`}
      >
        {config.label}
        {config.shortcut && (
          <span className="enterprise-fab-shortcut">
            ⌘{config.shortcut.toUpperCase()}
          </span>
        )}
      </span>

      <button
        aria-label={config.label}
        aria-describedby={`fab-${config.action}-tip`}
        onClick={handleAction}
        className="enterprise-fab"
        data-action={config.action}
      >
        <Icon className="enterprise-fab-icon" strokeWidth={2} />
      </button>
    </div>
  );
}
