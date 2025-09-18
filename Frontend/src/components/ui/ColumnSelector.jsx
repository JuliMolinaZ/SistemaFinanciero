// 🎛️ COLUMN SELECTOR - CONFIGURAR VISIBILIDAD DE COLUMNAS
// ======================================================

import React, { useState } from 'react';
import { Settings, Eye, EyeOff, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// 🎛️ COLUMN SELECTOR DROPDOWN
const ColumnSelectorDropdown = ({ 
  columnVisibility, 
  onVisibilityChange, 
  onClose 
}) => {
  const columns = [
    { key: 'status', label: 'Estado', icon: Eye },
    { key: 'priority', label: 'Prioridad', icon: Eye },
    { key: 'progress', label: 'Progreso', icon: Eye },
    { key: 'team', label: 'Equipo', icon: Eye },
    { key: 'phase', label: 'Fase', icon: Eye },
    { key: 'date', label: 'Fecha Fin', icon: Eye }
  ];

  const handleToggle = (columnKey) => {
    onVisibilityChange({
      ...columnVisibility,
      [columnKey]: !columnVisibility[columnKey]
    });
  };

  const handleShowAll = () => {
    const allVisible = columns.reduce((acc, col) => ({
      ...acc,
      [col.key]: true
    }), {});
    onVisibilityChange(allVisible);
  };

  const handleHideAll = () => {
    const allHidden = columns.reduce((acc, col) => ({
      ...acc,
      [col.key]: false
    }), {});
    onVisibilityChange(allHidden);
  };

  return (
    <motion.div
      className="column-selector-dropdown"
      initial={{ opacity: 0, scale: 0.95, y: -10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: -10 }}
      transition={{ duration: 0.15 }}
    >
      <div className="column-selector-header">
        <h3 className="column-selector-title">Configurar Columnas</h3>
        <button className="column-selector-close" onClick={onClose}>
          <X className="column-selector-icon" />
        </button>
      </div>
      
      <div className="column-selector-content">
        {/* Quick Actions */}
        <div className="column-selector-actions">
          <button className="column-selector-action" onClick={handleShowAll}>
            <Eye className="column-selector-action-icon" />
            Mostrar Todas
          </button>
          <button className="column-selector-action" onClick={handleHideAll}>
            <EyeOff className="column-selector-action-icon" />
            Ocultar Todas
          </button>
        </div>

        {/* Column Options */}
        <div className="column-selector-options">
          {columns.map((column) => (
            <label key={column.key} className="column-selector-option">
              <input
                type="checkbox"
                checked={columnVisibility[column.key] !== false}
                onChange={() => handleToggle(column.key)}
                className="column-selector-checkbox"
              />
              <div className="column-selector-option-content">
                <span className="column-selector-option-label">{column.label}</span>
                {columnVisibility[column.key] !== false ? (
                  <Eye className="column-selector-option-icon" />
                ) : (
                  <EyeOff className="column-selector-option-icon column-selector-option-icon--hidden" />
                )}
              </div>
            </label>
          ))}
        </div>

        {/* Info */}
        <div className="column-selector-info">
          <p className="column-selector-info-text">
            Las columnas "Proyecto" y "Acciones" siempre están visibles
          </p>
        </div>
      </div>
    </motion.div>
  );
};

// 🎛️ MAIN COLUMN SELECTOR COMPONENT
const ColumnSelector = ({ columnVisibility, onVisibilityChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="column-selector">
      <button
        className="column-selector-trigger"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Configurar columnas"
        title="Mostrar/ocultar columnas"
      >
        <Settings className="column-selector-trigger-icon" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div 
              className="column-selector-overlay"
              onClick={() => setIsOpen(false)}
            />
            <ColumnSelectorDropdown
              columnVisibility={columnVisibility}
              onVisibilityChange={onVisibilityChange}
              onClose={() => setIsOpen(false)}
            />
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ColumnSelector;
