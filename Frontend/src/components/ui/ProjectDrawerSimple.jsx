// 🐛 PROJECT DRAWER SIMPLE - PARA DEBUG
// =====================================

import React from 'react';
import { createPortal } from 'react-dom';
import { X as CloseIcon } from 'lucide-react';

export function ProjectDrawerSimple({ open, onClose, project }) {

  if (!open || !project) return null;

  const content = (
    <>
      {/* OVERLAY */}
      <div
        className="fixed inset-0 bg-black/50 z-[60]"
        onClick={onClose}
        style={{ position: 'fixed' }}
      />

      {/* SHEET */}
      <div
        className="fixed right-0 top-0 bottom-0 w-[400px] max-w-[90vw] bg-white shadow-xl z-[70] flex flex-col"
        style={{ position: 'fixed' }}
      >
        {/* HEADER */}
        <div className="p-4 border-b bg-gray-50 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-900">
            {project.nombre}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100"
          >
            <CloseIcon className="w-5 h-5" />
          </button>
        </div>

        {/* CONTENT */}
        <div className="flex-1 p-4 overflow-y-auto">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Descripción</label>
              <p className="text-gray-600 mt-1">
                {project.descripcion || 'Sin descripción'}
              </p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">Estado</label>
              <p className="text-gray-600 mt-1">
                {project.status || 'N/A'}
              </p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">Progreso</label>
              <p className="text-gray-600 mt-1">
                {project.progress || 0}%
              </p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">Cliente</label>
              <p className="text-gray-600 mt-1">
                {project.client?.nombre || project.cliente_nombre || 'Sin cliente'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );

  return createPortal(content, document.body);
}

export default ProjectDrawerSimple;