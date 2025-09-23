// 🎭 CONFIRM DIALOG - MODAL DE CONFIRMACIÓN PERSONALIZADO
// ======================================================

import React from 'react';
import { 
  AlertTriangle, 
  CheckCircle, 
  Info, 
  XCircle, 
  X,
  Loader2
} from 'lucide-react';

// 🎨 TIPOS DE CONFIRMACIÓN
const CONFIRM_TYPES = {
  danger: {
    icon: XCircle,
    iconColor: 'text-red-500',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
    buttonColor: 'bg-red-600 hover:bg-red-700',
    buttonText: 'Eliminar'
  },
  warning: {
    icon: AlertTriangle,
    iconColor: 'text-yellow-500',
    bgColor: 'bg-yellow-50',
    borderColor: 'border-yellow-200',
    buttonColor: 'bg-yellow-600 hover:bg-yellow-700',
    buttonText: 'Continuar'
  },
  info: {
    icon: Info,
    iconColor: 'text-blue-500',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    buttonColor: 'bg-blue-600 hover:bg-blue-700',
    buttonText: 'Aceptar'
  },
  success: {
    icon: CheckCircle,
    iconColor: 'text-green-500',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    buttonColor: 'bg-green-600 hover:bg-green-700',
    buttonText: 'Confirmar'
  }
};

// 🎭 COMPONENTE PRINCIPAL
const ConfirmDialog = ({
  open = false,
  onClose,
  onConfirm,
  title = 'Confirmar acción',
  message = '¿Estás seguro de que deseas continuar?',
  confirmText,
  cancelText = 'Cancelar',
  type = 'danger',
  loading = false,
  destructive = false,
  className = ''
}) => {
  const config = CONFIRM_TYPES[type] || CONFIRM_TYPES.danger;
  const Icon = config.icon;
  const finalConfirmText = confirmText || config.buttonText;

  const handleConfirm = () => {
    if (!loading) {
      onConfirm?.();
    }
  };

  const handleCancel = () => {
    if (!loading) {
      onClose?.();
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget && !loading) {
      onClose?.();
    }
  };

  if (!open) return null;

  return (
    <div
      onClick={handleBackdropClick}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        animation: 'fadeIn 0.2s ease-out'
      }}
    >
      {/* Backdrop */}
      <div 
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          backdropFilter: 'blur(4px)',
          animation: 'fadeIn 0.2s ease-out'
        }}
      />
      
      {/* Modal */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '448px',
          animation: 'slideIn 0.3s ease-out'
        }}
      >
        <div style={{
          backgroundColor: 'white',
          borderRadius: '16px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          border: `2px solid ${config.borderColor === 'border-red-200' ? '#fecaca' : config.borderColor === 'border-yellow-200' ? '#fde68a' : config.borderColor === 'border-blue-200' ? '#bfdbfe' : '#e5e7eb'}`,
          overflow: 'hidden',
          minWidth: '320px'
        }}>
          {/* Header */}
          <div style={{
            padding: '24px',
            backgroundColor: config.bgColor === 'bg-red-50' ? '#fef2f2' : config.bgColor === 'bg-yellow-50' ? '#fffbeb' : config.bgColor === 'bg-blue-50' ? '#eff6ff' : '#f9fafb',
            borderBottom: `1px solid ${config.borderColor === 'border-red-200' ? '#fecaca' : config.borderColor === 'border-yellow-200' ? '#fde68a' : config.borderColor === 'border-blue-200' ? '#bfdbfe' : '#e5e7eb'}`
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                padding: '8px',
                borderRadius: '50%',
                backgroundColor: config.bgColor === 'bg-red-50' ? '#fef2f2' : config.bgColor === 'bg-yellow-50' ? '#fffbeb' : config.bgColor === 'bg-blue-50' ? '#eff6ff' : '#f9fafb',
                border: `1px solid ${config.borderColor === 'border-red-200' ? '#fecaca' : config.borderColor === 'border-yellow-200' ? '#fde68a' : config.borderColor === 'border-blue-200' ? '#bfdbfe' : '#e5e7eb'}`
              }}>
                <Icon style={{ 
                  width: '24px', 
                  height: '24px', 
                  color: config.iconColor === 'text-red-500' ? '#ef4444' : config.iconColor === 'text-yellow-500' ? '#f59e0b' : config.iconColor === 'text-blue-500' ? '#3b82f6' : '#6b7280'
                }} />
              </div>
              <div style={{ flex: 1 }}>
                <h3 style={{
                  fontSize: '18px',
                  fontWeight: '600',
                  color: '#111827',
                  margin: 0
                }}>
                  {title}
                </h3>
              </div>
              {!loading && (
                <button
                  onClick={handleCancel}
                  style={{
                    padding: '4px',
                    borderRadius: '50%',
                    border: 'none',
                    backgroundColor: 'transparent',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = '#f3f4f6'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                >
                  <X style={{ width: '20px', height: '20px', color: '#9ca3af' }} />
                </button>
              )}
            </div>
          </div>

          {/* Content */}
          <div style={{ padding: '24px' }}>
            <p style={{
              color: '#374151',
              lineHeight: '1.6',
              margin: 0,
              whiteSpace: 'pre-line'
            }}>
              {message}
            </p>
          </div>

          {/* Actions */}
          <div style={{
            padding: '24px',
            backgroundColor: '#f9fafb',
            borderTop: '1px solid #e5e7eb',
            display: 'flex',
            gap: '12px',
            justifyContent: 'flex-end'
          }}>
            <button
              onClick={handleCancel}
              disabled={loading}
              style={{
                padding: '8px 16px',
                fontSize: '14px',
                fontWeight: '500',
                color: '#374151',
                backgroundColor: 'white',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.5 : 1,
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => !loading && (e.target.style.backgroundColor = '#f9fafb')}
              onMouseLeave={(e) => !loading && (e.target.style.backgroundColor = 'white')}
            >
              {cancelText}
            </button>
            <button
              onClick={handleConfirm}
              disabled={loading}
              style={{
                padding: '8px 16px',
                fontSize: '14px',
                fontWeight: '500',
                color: 'white',
                backgroundColor: config.buttonColor === 'bg-red-600 hover:bg-red-700' ? '#dc2626' : config.buttonColor === 'bg-yellow-600 hover:bg-yellow-700' ? '#d97706' : config.buttonColor === 'bg-blue-600 hover:bg-blue-700' ? '#2563eb' : '#059669',
                border: 'none',
                borderRadius: '8px',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.5 : 1,
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
              onMouseEnter={(e) => {
                if (!loading) {
                  e.target.style.backgroundColor = config.buttonColor === 'bg-red-600 hover:bg-red-700' ? '#b91c1c' : config.buttonColor === 'bg-yellow-600 hover:bg-yellow-700' ? '#b45309' : config.buttonColor === 'bg-blue-600 hover:bg-blue-700' ? '#1d4ed8' : '#047857';
                }
              }}
              onMouseLeave={(e) => {
                if (!loading) {
                  e.target.style.backgroundColor = config.buttonColor === 'bg-red-600 hover:bg-red-700' ? '#dc2626' : config.buttonColor === 'bg-yellow-600 hover:bg-yellow-700' ? '#d97706' : config.buttonColor === 'bg-blue-600 hover:bg-blue-700' ? '#2563eb' : '#059669';
                }
              }}
            >
              {loading && <Loader2 style={{ width: '16px', height: '16px', animation: 'spin 1s linear infinite' }} />}
              {finalConfirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;

// 🎨 ESTILOS CSS PARA ANIMACIONES
const styles = `
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  
  @keyframes slideIn {
    from { 
      opacity: 0;
      transform: scale(0.95) translateY(-10px);
    }
    to { 
      opacity: 1;
      transform: scale(1) translateY(0);
    }
  }
  
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`;

// Inyectar estilos si no existen
if (typeof document !== 'undefined' && !document.getElementById('confirm-dialog-styles')) {
  const styleSheet = document.createElement('style');
  styleSheet.id = 'confirm-dialog-styles';
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
}
