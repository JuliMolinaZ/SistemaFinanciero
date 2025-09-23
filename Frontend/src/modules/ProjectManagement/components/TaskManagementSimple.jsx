// 🎯 TASK MANAGEMENT SIMPLE - VERSIÓN SIMPLIFICADA PARA PRUEBAS
// =============================================================

import React from 'react';
import { X } from 'lucide-react';

const TaskManagementSimple = ({ projectId, projectName, onClose }) => {
  console.log('🎯 TaskManagementSimple renderizado con:', { projectId, projectName });

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Gestión de Tareas - PRUEBA
            </h2>
            <p className="text-gray-600">Proyecto: {projectName} (ID: {projectId})</p>
          </div>
          
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">¡El submódulo de tareas está funcionando!</h3>
          <p className="text-gray-600 mb-4">
            Este es un componente de prueba para verificar que la integración funcione correctamente.
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-blue-800">
              <strong>Proyecto ID:</strong> {projectId}
            </p>
            <p className="text-blue-800">
              <strong>Nombre del Proyecto:</strong> {projectName}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskManagementSimple;
