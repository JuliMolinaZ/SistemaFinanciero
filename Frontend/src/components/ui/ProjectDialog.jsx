// 🎪 PROJECT DIALOG - MODAL CENTRADO CON PORTAL
// ================================================

import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// 🔒 SCROLL LOCK UTILITY
const useScrollLock = (isLocked) => {
  useEffect(() => {
    if (isLocked) {
      const originalStyle = window.getComputedStyle(document.body).overflow;
      const originalPaddingRight = window.getComputedStyle(document.body).paddingRight;

      // Calcular el ancho de la scrollbar
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

      // Bloquear scroll y compensar la scrollbar
      document.body.style.overflow = 'hidden';
      document.body.style.paddingRight = `${parseInt(originalPaddingRight) + scrollbarWidth}px`;

      return () => {
        document.body.style.overflow = originalStyle;
        document.body.style.paddingRight = originalPaddingRight;
      };
    }
  }, [isLocked]);
};

// 🎯 FOCUS TRAP UTILITY
const useFocusTrap = (isActive, containerRef) => {
  useEffect(() => {
    if (!isActive || !containerRef.current) return;

    const container = containerRef.current;
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    if (focusableElements.length === 0) return;

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    // Focus inicial
    firstElement.focus();

    const handleTabKey = (e) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };

    container.addEventListener('keydown', handleTabKey);
    return () => container.removeEventListener('keydown', handleTabKey);
  }, [isActive]);
};

// 📱 MAIN DIALOG COMPONENT
export const ProjectDialog = ({
  open,
  onClose,
  children,
  title = "Proyecto",
  className = "",
  ...props
}) => {
  const dialogRef = useRef(null);
  const overlayRef = useRef(null);

  // Hooks para accesibilidad
  useScrollLock(open);
  useFocusTrap(open, dialogRef);

  // Manejar tecla Escape
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && open) {
        onClose?.();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [open, onClose]);

  // Manejar click en overlay
  const handleOverlayClick = (e) => {
    if (e.target === overlayRef.current) {
      onClose?.();
    }
  };

  if (!open) return null;

  const dialogContent = (
    <AnimatePresence>
      {open && (
        <div className="pd-portal-container">
          {/* Overlay */}
          <motion.div
            ref={overlayRef}
            className="pd-dialog-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={handleOverlayClick}
          >
            {/* Dialog Container */}
            <div className="pd-dialog-container">
              <motion.div
                ref={dialogRef}
                className={`pd-dialog-content ${className}`}
                role="dialog"
                aria-modal="true"
                aria-labelledby="dialog-title"
                initial={{
                  opacity: 0,
                  scale: 0.95,
                  y: 20
                }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  y: 0
                }}
                exit={{
                  opacity: 0,
                  scale: 0.95,
                  y: 20
                }}
                transition={{
                  type: 'spring',
                  damping: 25,
                  stiffness: 300,
                  duration: 0.2
                }}
                onClick={(e) => e.stopPropagation()}
                {...props}
              >
                {children}
              </motion.div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );

  // Renderizar usando Portal
  return createPortal(dialogContent, document.body);
};

// 🎨 DIALOG HEADER COMPONENT
export const ProjectDialogHeader = ({
  children,
  onClose,
  className = "",
  showCloseButton = true
}) => (
  <header className={`pd-dialog-header ${className}`}>
    <div className="pd-dialog-header-content">
      {children}
    </div>
    {showCloseButton && (
      <button
        className="pd-dialog-close"
        onClick={onClose}
        aria-label="Cerrar"
        type="button"
      >
        <X className="pd-icon" />
      </button>
    )}
  </header>
);

// 📄 DIALOG CONTENT COMPONENT
export const ProjectDialogContent = ({
  children,
  className = "",
  scrollable = true
}) => (
  <div className={`pd-dialog-body ${scrollable ? 'pd-dialog-body--scrollable' : ''} ${className}`}>
    {children}
  </div>
);

// 🦶 DIALOG FOOTER COMPONENT
export const ProjectDialogFooter = ({
  children,
  className = ""
}) => (
  <footer className={`pd-dialog-footer ${className}`}>
    {children}
  </footer>
);

export default ProjectDialog;