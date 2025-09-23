import React from 'react';
import { LayoutDashboard, ClipboardList, Users2, Clock3, TrendingUp } from 'lucide-react';
import './nav-tokens.css';

// 🎯 TIPOS PROFESIONALES
type NavItem = {
  label: 'Dashboard' | 'Proyectos' | 'Tareas' | 'Sprints' | 'Analytics';
  icon: React.ComponentType<any>;
  href: string;
  badge?: number;
  disabled?: boolean;
};

// 🧭 COMPONENTE PRINCIPAL - NAVEGACIÓN PROFESIONAL
export function NavTabs({ 
  current, 
  onTabChange,
  userRole = 'administrador' // Rol por defecto
}: { 
  current: NavItem['label'];
  onTabChange?: (tab: NavItem['label']) => void;
  userRole?: string;
}) {
  // 🎯 Filtrar tabs según el rol del usuario
  const getAllItems = (): NavItem[] => [
    { label: 'Dashboard', icon: LayoutDashboard, href: '/projects' },
    { label: 'Proyectos', icon: ClipboardList, href: '/projects/list', badge: 3 },
    { label: 'Tareas', icon: Users2, href: '/projects/tasks', badge: 2 },
    { label: 'Sprints', icon: Clock3, href: '/projects/sprints', badge: 1 },
    { label: 'Analytics', icon: TrendingUp, href: '/projects/analytics' },
  ];

  const getFilteredItems = (): NavItem[] => {
    const allItems = getAllItems();

    // Mostrar todas las pestañas para todos los roles
    return allItems;
  };

  const items = getFilteredItems();

  return (
    <nav 
      className="nav-container"
      aria-label="Navegación de gestión de proyectos"
      role="tablist"
    >
      {items.map((item) => (
        <NavTab
          key={item.label}
          {...item}
          active={item.label === current}
          onTabChange={onTabChange}
        />
      ))}
    </nav>
  );
}

// 🎨 COMPONENTE TAB INDIVIDUAL - DISEÑO PROFESIONAL
function NavTab({
  label,
  icon: Icon,
  href,
  badge,
  disabled = false,
  active = false,
  onTabChange
}: NavItem & {
  active?: boolean;
  onTabChange?: (tab: string) => void;
}) {
  
  const handleClick = (e: React.MouseEvent) => {
    if (disabled) return;
    
    if (onTabChange) {
      e.preventDefault();
      onTabChange(label);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;
    
    if ((e.key === 'Enter' || e.key === ' ') && onTabChange) {
      e.preventDefault();
      onTabChange(label);
    }
  };

  return (
    <a
      href={href}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      aria-current={active ? 'page' : undefined}
      aria-disabled={disabled || undefined}
      role="tab"
      tabIndex={disabled ? -1 : 0}
      className={`nav-tab ${active ? 'nav-tab--active' : ''} ${disabled ? 'nav-tab--disabled' : ''}`}
    >
      {/* 🎯 CONTENEDOR DE ICONO CON ESPACIO FIJO */}
      <div className="nav-tab__icon-container">
        <Icon 
          size={20}
          strokeWidth={1.75}
          className="nav-tab__icon"
          aria-hidden="true"
        />
        
        {/* 🏷️ BADGE PILL PROFESIONAL */}
        {typeof badge === 'number' && badge > 0 && (
          <span 
            className="nav-tab__badge"
            aria-label={`${badge} elementos`}
          >
            {badge}
          </span>
        )}
      </div>

      {/* 📝 LABEL CON TIPOGRAFÍA PROFESIONAL */}
      <span className="nav-tab__label">
        {label}
      </span>

      {/* 🎨 INDICADOR ACTIVO */}
      {active && <span className="nav-tab__indicator" aria-hidden="true" />}
    </a>
  );
}
