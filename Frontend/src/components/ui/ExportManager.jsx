// 📊 EXPORT MANAGER - EXCEL/PDF EXPORT FUNCTIONALITY
// =================================================

import React, { useState } from 'react';
import { Download, FileText, FileSpreadsheet, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useModernToast } from './ModernToast';

// 📊 EXPORT TO EXCEL
const exportToExcel = (projects, groups) => {
  try {
    // Create CSV content
    const headers = [
      'ID',
      'Proyecto',
      'Descripción',
      'Cliente',
      'Estado',
      'Prioridad',
      'Progreso (%)',
      'Fecha Inicio',
      'Fecha Fin',
      'Equipo Operaciones',
      'Equipo TI',
      'Fase Actual'
    ];

    const csvContent = [
      headers.join(','),
      ...projects.map(project => [
        project.id,
        `"${project.nombre}"`,
        `"${project.descripcion || ''}"`,
        `"${project.client?.nombre || 'Sin cliente'}"`,
        project.status || '',
        project.priority || '',
        project.progress || 0,
        project.start_date || '',
        project.end_date || '',
        project.members?.filter(m => m.team_type === 'operations').length || 0,
        project.members?.filter(m => m.team_type === 'it').length || 0,
        project.current_phase?.name || 'Sin fase'
      ].join(','))
    ].join('\n');

    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `proyectos_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    return true;
  } catch (error) {
    console.error('Error exporting to Excel:', error);
    return false;
  }
};

// 📄 EXPORT TO PDF
const exportToPDF = (projects, groups) => {
  try {
    // Create HTML content for PDF
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Reporte de Proyectos</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          .header { text-align: center; margin-bottom: 30px; }
          .group { margin-bottom: 30px; }
          .group-title { background: #f5f5f5; padding: 10px; font-weight: bold; }
          table { width: 100%; border-collapse: collapse; margin-top: 10px; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; font-size: 12px; }
          th { background-color: #f2f2f2; }
          .progress { background: #e0e0e0; height: 10px; border-radius: 5px; overflow: hidden; }
          .progress-fill { height: 100%; background: #4CAF50; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Reporte de Proyectos</h1>
          <p>Generado el ${new Date().toLocaleDateString('es-ES')}</p>
        </div>
        
        ${groups.map(group => `
          <div class="group">
            <div class="group-title">${group.clientName} (${group.count} proyectos)</div>
            <table>
              <thead>
                <tr>
                  <th>Proyecto</th>
                  <th>Estado</th>
                  <th>Prioridad</th>
                  <th>Progreso</th>
                  <th>Fecha Fin</th>
                </tr>
              </thead>
              <tbody>
                ${group.projects.map(project => `
                  <tr>
                    <td><strong>${project.nombre}</strong><br><small>${project.descripcion || ''}</small></td>
                    <td>${project.status || ''}</td>
                    <td>${project.priority || ''}</td>
                    <td>
                      <div class="progress">
                        <div class="progress-fill" style="width: ${project.progress || 0}%"></div>
                      </div>
                      ${project.progress || 0}%
                    </td>
                    <td>${project.end_date ? new Date(project.end_date).toLocaleDateString('es-ES') : 'N/A'}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        `).join('')}
      </body>
      </html>
    `;

    // Open in new window for printing/PDF
    const printWindow = window.open('', '_blank');
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    printWindow.focus();
    
    // Trigger print dialog
    setTimeout(() => {
      printWindow.print();
    }, 250);

    return true;
  } catch (error) {
    console.error('Error exporting to PDF:', error);
    return false;
  }
};

// 📊 EXPORT DROPDOWN COMPONENT
const ExportDropdown = ({ projects, groups, onClose }) => (
  <motion.div
    className="export-dropdown"
    initial={{ opacity: 0, scale: 0.95, y: -10 }}
    animate={{ opacity: 1, scale: 1, y: 0 }}
    exit={{ opacity: 0, scale: 0.95, y: -10 }}
    transition={{ duration: 0.15 }}
  >
    <div className="export-dropdown-header">
      <h3 className="export-dropdown-title">Exportar Proyectos</h3>
      <button className="export-dropdown-close" onClick={onClose}>
        <X className="export-icon" />
      </button>
    </div>
    
    <div className="export-dropdown-content">
      <button
        className="export-option"
        onClick={() => {
          const success = exportToExcel(projects, groups);
          if (success) {

            toast.success({
              title: 'Exportación exitosa',
              description: 'Los datos se exportaron a Excel correctamente'
            });
          } else {
            toast.error({
              title: 'Error de exportación',
              description: 'No se pudo exportar a Excel'
            });
          }
          onClose();
        }}
      >
        <FileSpreadsheet className="export-option-icon" />
        <div className="export-option-text">
          <span className="export-option-title">Excel (CSV)</span>
          <span className="export-option-description">Datos tabulares para análisis</span>
        </div>
      </button>
      
      <button
        className="export-option"
        onClick={() => {
          const success = exportToPDF(projects, groups);
          if (success) {

            toast.success({
              title: 'PDF generado',
              description: 'El reporte se abrió en una nueva ventana'
            });
          } else {
            toast.error({
              title: 'Error de exportación',
              description: 'No se pudo generar el PDF'
            });
          }
          onClose();
        }}
      >
        <FileText className="export-option-icon" />
        <div className="export-option-text">
          <span className="export-option-title">PDF</span>
          <span className="export-option-description">Reporte visual completo</span>
        </div>
      </button>
    </div>
  </motion.div>
);

// 📊 MAIN EXPORT MANAGER COMPONENT
const ExportManager = ({ projects = [], groups = [] }) => {
  const [isOpen, setIsOpen] = useState(false);
  const toast = useModernToast();

  return (
    <div className="export-manager">
      <button
        className="export-trigger"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Exportar datos"
        title="Exportar a Excel o PDF"
      >
        <Download className="export-trigger-icon" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div 
              className="export-overlay"
              onClick={() => setIsOpen(false)}
            />
            <ExportDropdown
              projects={projects}
              groups={groups}
              onClose={() => setIsOpen(false)}
            />
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ExportManager;
