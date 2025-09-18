// 🚀 FAB NEW PROJECT - ENTERPRISE DESIGN
// =====================================

import React, { useEffect } from 'react';
import { Plus } from 'lucide-react';
import './enterprise-system.css';

// 🎯 FLOATING ACTION BUTTON ENTERPRISE
export default function FabNewProject({ 
  useModal = false, 
  onOpen,
  hidden = false,
  className = '',
  ...props 
}) {
  
  // 🎹 Atajo: ⌘/Ctrl + N
  useEffect(() => {
    const handleKeyDown = (e) => {
      const cmdOrCtrl = e.metaKey || e.ctrlKey;
      if (cmdOrCtrl && e.key.toLowerCase() === 'n') {
        e.preventDefault();
        if (useModal) {
          onOpen?.();
        } else {
          // Navegar a la ruta de nuevo proyecto
          window.location.href = '/projects/new';
        }
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [useModal, onOpen]);

  const handleClick = () => {
    if (useModal) {
      onOpen?.();
    } else {
      // Navegar a la ruta de nuevo proyecto
      window.location.href = '/projects/new';
    }
  };

  if (hidden) {
    return null;
  }

  return (
    <div className={`enterprise-fab-container ${className}`} {...props}>
      {/* Etiqueta pill (aparece en hover/focus) */}
      <span
        className="enterprise-fab-tooltip"
        role="tooltip"
        id="fab-newproject-tip"
      >
        Nuevo proyecto
      </span>

      <button
        aria-label="Crear nuevo proyecto"
        aria-describedby="fab-newproject-tip"
        onClick={handleClick}
        className="enterprise-fab"
      >
        <Plus className="enterprise-fab-icon" strokeWidth={2} />
      </button>
    </div>
  );
}
