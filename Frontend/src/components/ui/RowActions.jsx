// 🎬 ROW ACTIONS - ACCIONES DE TABLA ENTERPRISE
// =============================================

import React, { useState, useContext } from 'react';
import { Eye, Pencil, FileText, Trash2 } from 'lucide-react';
import { IconButton } from './Button';
import { TableButtonGroup } from './ButtonGroup';
import './button-group.css';
import ProjectViewDialog from '../modals/ProjectViewDialog';
import ProjectFormDialog from '../modals/ProjectFormDialog';
import ConfirmDialog from '../modals/ConfirmDialog';
import projectManagementService from '../../services/projectManagementService';
import { useNotify } from '../../hooks/useNotify.js';
import { GlobalContext } from '../../context/GlobalState';

// 🎯 COMPONENTE PRINCIPAL - ROW ACTIONS
const RowActions = ({ project, onUpdate }) => {
  const notify = useNotify();
  const { profileData } = useContext(GlobalContext);

  // 🔐 Verificar si el usuario actual puede eliminar este proyecto
  const canDeleteProject = () => {
    // Si no hay información del usuario o del proyecto, no permitir
    if (!profileData || !project) {
      return false;
    }

    // Si el proyecto no tiene created_by, no permitir eliminar
    if (!project.created_by) {
      return false;
    }

    // Solo el creador puede eliminar el proyecto
    return profileData.id === project.created_by;
  };

  // Estados de modales
  const [openView, setOpenView] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);

  // Estados de loading
  const [loading, setLoading] = useState({
    edit: false,
    delete: false,
    report: false
  });

  // 📊 Manejar exportación de reporte
  const handleExportReport = async () => {
    try {
      setLoading(prev => ({ ...prev, report: true }));

      // Simular descarga de PDF
      const link = document.createElement('a');
      link.href = `data:text/plain;charset=utf-8,Reporte del proyecto: ${project.nombre}`;
      link.download = `reporte-${project.nombre.toLowerCase().replace(/\s+/g, '-')}.txt`;
      link.click();
      
      // Notificación de éxito
      setTimeout(() => {
        notify.success({
          title: 'Reporte exportado',
          description: `Reporte de "${project.nombre}" descargado exitosamente`
        });
      }, 500);
      
    } catch (error) {
      console.error('❌ Error exportando reporte:', error);
      notify.error({
        title: 'Error al exportar reporte',
        description: 'No se pudo generar el reporte del proyecto'
      });
    } finally {
      setLoading(prev => ({ ...prev, report: false }));
    }
  };

  // ✏️ Manejar edición de proyecto
  const handleEditSubmit = async (projectData) => {
    try {
      setLoading(prev => ({ ...prev, edit: true }));
      
      const result = await projectManagementService.updateProject(project.id, projectData);

      notify.success({
        title: 'Proyecto actualizado',
        description: `Los cambios en "${project.nombre}" se guardaron correctamente`
      });
      
      // Callback para actualizar la lista
      if (onUpdate) {
        onUpdate();
      }
      
      setOpenEdit(false);
      
    } catch (error) {
      console.error('❌ Error actualizando proyecto:', error);
      notify.error({
        title: 'Error al actualizar proyecto',
        description: error.message || 'No se pudieron guardar los cambios',
        error
      });
    } finally {
      setLoading(prev => ({ ...prev, edit: false }));
    }
  };

  // 🗑️ Manejar eliminación de proyecto
  const handleDeleteConfirm = async () => {
    try {
      setLoading(prev => ({ ...prev, delete: true }));
      
      const result = await projectManagementService.deleteProject(project.id);

      notify.success({
        title: 'Proyecto eliminado',
        description: `"${project.nombre}" fue eliminado permanentemente`
      });
      
      // Callback para actualizar la lista
      if (onUpdate) {
        onUpdate();
      }
      
      setOpenDelete(false);
      
    } catch (error) {
      console.error('❌ Error eliminando proyecto:', error);
      notify.error({
        title: 'Error al eliminar proyecto',
        description: error.message || 'No se pudo eliminar el proyecto',
        error
      });
    } finally {
      setLoading(prev => ({ ...prev, delete: false }));
    }
  };

  return (
    <>
      {/* 🎬 BUTTON GROUP COMPACTO */}
      <TableButtonGroup aria-label={`Acciones para ${project.nombre}`}>
        {/* Ver */}
        <IconButton
          size="table"
          variant="ghost"
          tooltip="Ver proyecto"
          aria-label={`Ver proyecto ${project.nombre}`}
          onClick={() => setOpenView(true)}
        >
          <Eye size={16} strokeWidth={1.8} />
        </IconButton>

        {/* Editar */}
        <IconButton
          size="table"
          variant="outline"
          tooltip="Editar proyecto"
          aria-label={`Editar proyecto ${project.nombre}`}
          onClick={() => setOpenEdit(true)}
          loading={loading.edit}
        >
          <Pencil size={16} strokeWidth={1.8} />
        </IconButton>

        {/* Reporte */}
        <IconButton
          size="table"
          variant="ghost"
          tooltip="Exportar reporte"
          aria-label={`Exportar reporte de ${project.nombre}`}
          onClick={handleExportReport}
          loading={loading.report}
        >
          <FileText size={16} strokeWidth={1.8} />
        </IconButton>

        {/* Eliminar - Solo si el usuario es el creador */}
        {canDeleteProject() && (
          <IconButton
            size="table"
            variant="ghost"
            tooltip="Eliminar proyecto"
            aria-label={`Eliminar proyecto ${project.nombre}`}
            onClick={() => setOpenDelete(true)}
            loading={loading.delete}
            className="table-action-delete"
          >
            <Trash2 size={16} strokeWidth={1.8} />
          </IconButton>
        )}
      </TableButtonGroup>

      {/* 📋 MODALES */}
      
      {/* Modal Ver */}
      <ProjectViewDialog
        open={openView}
        onOpenChange={setOpenView}
        project={project}
      />

      {/* Modal Editar (reutiliza el formulario) */}
      <ProjectFormDialog
        mode="edit"
        open={openEdit}
        onOpenChange={setOpenEdit}
        initialValues={project}
        onSubmit={handleEditSubmit}
        submitLabel="Guardar cambios"
        loading={loading.edit}
      />

      {/* Modal Eliminar con confirmación */}
      <ConfirmDialog
        open={openDelete}
        onOpenChange={setOpenDelete}
        title="Eliminar proyecto"
        description={
          <>
            ¿Estás seguro de que deseas eliminar el proyecto <strong>"{project.nombre}"</strong>?
            <br /><br />
            Esta acción no se puede deshacer y se eliminarán todos los datos relacionados.
          </>
        }
        confirmLabel="Eliminar"
        cancelLabel="Cancelar"
        variant="destructive"
        onConfirm={handleDeleteConfirm}
        loading={loading.delete}
      />
    </>
  );
};

export default RowActions;
