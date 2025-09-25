// 🚀 TASK MANAGEMENT UNIFIED - COMPONENTE SIMPLIFICADO CON CSS UNIFICADO
// =====================================================================

import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import TaskBoardDragDrop from '../../../components/TaskBoard/TaskBoardDragDrop';
import TaskCard from './TaskCard';
import TaskFormModal from './TaskFormModal';
import ConfirmDialog from '../../../components/ui/ConfirmDialog';
import taskManagementService from '../../../services/taskManagementService';
import useNotifications from '../../../hooks/useNotifications';
import useConfirm from '../../../hooks/useConfirm';
import '../ProjectManagementUnified.css';

// 🎯 COMPONENTE PRINCIPAL TASK MANAGEMENT
const TaskManagementUnified = ({ projectId, projectName, onClose, projects = [], onProjectSelect }) => {
  const { notify } = useNotifications();
  const { confirmState, handleConfirm, handleCancel } = useConfirm();

  // Estados principales
  const [tasks, setTasks] = useState([]);
  const [tasksByStatus, setTasksByStatus] = useState({
    todo: [],
    in_progress: [],
    review: [],
    done: []
  });
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Estados de UI
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  // Cargar datos iniciales
  useEffect(() => {
    if (projectId) {
      loadTasks();
      loadUsers();
    }
  }, [projectId]);

  // Función para cargar tareas
  const loadTasks = useCallback(async () => {
    try {
      setLoading(true);
      const response = await taskManagementService.getTasksByProject(projectId);
      const tasksData = response.data?.tasks || [];

      setTasks(tasksData);

      // Organizar por estado
      const organized = {
        todo: tasksData.filter(task => task.status === 'todo'),
        in_progress: tasksData.filter(task => task.status === 'in_progress'),
        review: tasksData.filter(task => task.status === 'review'),
        done: tasksData.filter(task => task.status === 'done')
      };

      setTasksByStatus(organized);
      setError(null);
    } catch (err) {
      console.error('❌ Error cargando tareas:', err);
      setError('Error al cargar las tareas');
      notify.error({
        title: 'Error',
        description: 'No se pudieron cargar las tareas'
      });
    } finally {
      setLoading(false);
    }
  }, [projectId, notify]);

  // Función para actualizar estado de tarea con drag & drop
  const updateTaskStatus = useCallback(async (taskId, newStatus) => {
    try {
      // Actualizar UI optimísticamente
      setTasks(prev => prev.map(task =>
        task.id === taskId ? { ...task, status: newStatus } : task
      ));

      // Reorganizar por estado
      const updatedTasks = tasks.map(task =>
        task.id === taskId ? { ...task, status: newStatus } : task
      );

      const organized = {
        todo: updatedTasks.filter(task => task.status === 'todo'),
        in_progress: updatedTasks.filter(task => task.status === 'in_progress'),
        review: updatedTasks.filter(task => task.status === 'review'),
        done: updatedTasks.filter(task => task.status === 'done')
      };

      setTasksByStatus(organized);

      // Actualizar en backend
      await taskManagementService.updateTask(taskId, { status: newStatus });

      notify.success({
        title: 'Tarea actualizada',
        description: 'El estado de la tarea se actualizó correctamente'
      });

    } catch (err) {
      console.error('❌ Error actualizando estado:', err);

      // Revertir cambio optimista
      await loadTasks();

      notify.error({
        title: 'Error',
        description: 'No se pudo actualizar el estado de la tarea'
      });
    }
  }, [tasks, notify, loadTasks]);

  // Función para cargar usuarios
  const loadUsers = useCallback(async () => {
    try {
      const response = await taskManagementService.getUsersByProject(projectId);
      const usersData = response.data || [];

      setUsers(usersData);
    } catch (err) {
      console.error('❌ Error cargando usuarios:', err);
    }
  }, [projectId]);

  // Función para crear/editar tarea
  const handleTaskSubmit = useCallback(async (taskData) => {
    try {
      if (editingTask) {
        // Editar tarea existente
        await taskManagementService.updateTask(editingTask.id, taskData);
        notify.success({
          title: 'Tarea actualizada',
          description: 'La tarea se actualizó correctamente'
        });
      } else {
        // Crear nueva tarea
        await taskManagementService.createTask({
          ...taskData,
          project_id: projectId
        });
        notify.success({
          title: 'Tarea creada',
          description: 'La tarea se creó correctamente'
        });
      }
      
      setShowTaskForm(false);
      setEditingTask(null);
      loadTasks(); // Recargar tareas
    } catch (err) {
      console.error('❌ Error guardando tarea:', err);
      notify.error({
        title: 'Error',
        description: 'No se pudo guardar la tarea'
      });
    }
  }, [editingTask, projectId, notify, loadTasks]);

  // Función para eliminar tarea
  const handleTaskDelete = useCallback(async (taskId) => {
    try {
      await taskManagementService.deleteTask(taskId);
      notify.success({
        title: 'Tarea eliminada',
        description: 'La tarea se eliminó correctamente'
      });
      loadTasks(); // Recargar tareas
    } catch (err) {
      console.error('❌ Error eliminando tarea:', err);
      notify.error({
        title: 'Error',
        description: 'No se pudo eliminar la tarea'
      });
    }
  }, [notify, loadTasks]);

  // Usar el nuevo TaskBoardDragDrop como componente principal
  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', p: 2 }}>

      {/* TaskBoard con Drag & Drop mejorado */}
      <Box sx={{ flex: 1, overflow: 'hidden' }}>
        <TaskBoardDragDrop
          projectId={projectId}
          projectName={projectName}
          onTaskCreate={(task) => {

          }}
          onTaskUpdate={(task) => {

          }}
          onTaskDelete={(taskId) => {

          }}
        />
      </Box>
    </Box>
  );
};

export default TaskManagementUnified;
