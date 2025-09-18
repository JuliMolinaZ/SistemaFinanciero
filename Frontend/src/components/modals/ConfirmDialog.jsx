// ⚠️ CONFIRM DIALOG - MODAL DE CONFIRMACIÓN
// ========================================

import React from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { Button } from '../ui/Button';
import '../ui/enterprise-system.css';

// 🎯 COMPONENTE PRINCIPAL
const ConfirmDialog = ({
  open,
  onOpenChange,
  title = 'Confirmar acción',
  description,
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
  variant = 'primary', // 'primary' | 'destructive'
  onConfirm,
  loading = false
}) => {
  if (!open) return null;

  const handleConfirm = async () => {
    if (onConfirm) {
      await onConfirm();
    }
  };

  const isDestructive = variant === 'destructive';

  return (
    <div className="enterprise-modal-overlay" onClick={() => onOpenChange(false)}>
      <div className="enterprise-modal-content enterprise-modal-content--sm" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="enterprise-modal-header">
          <div className="enterprise-modal-header-content">
            <AlertTriangle 
              className={`enterprise-modal-icon ${isDestructive ? 'enterprise-modal-icon--danger' : ''}`}
              size={24} 
            />
            <h2 className={`enterprise-modal-title ${isDestructive ? 'enterprise-modal-title--danger' : ''}`}>
              {title}
            </h2>
          </div>
          <button
            className="enterprise-icon-button"
            onClick={() => onOpenChange(false)}
            aria-label="Cerrar"
            disabled={loading}
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="enterprise-modal-body">
          <div className="enterprise-confirm-description">
            {typeof description === 'string' ? (
              <p>{description}</p>
            ) : (
              description
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="enterprise-modal-footer">
          <Button 
            variant="ghost" 
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            {cancelLabel}
          </Button>
          <Button 
            variant={isDestructive ? 'destructive' : 'primary'}
            onClick={handleConfirm}
            loading={loading}
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
