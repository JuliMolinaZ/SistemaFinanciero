// 🧪 ENDPOINT DE PRUEBA PARA NOTIFICACIONES DE TAREAS
// ==================================================

const express = require('express');
const router = express.Router();
const { 
  sendTaskAssignmentNotification, 
  sendTaskStatusChangeNotification, 
  sendTaskCreatedNotification 
} = require('../services/taskNotificationService');

// Datos de prueba
const testTask = {
  id: 999,
  title: '🧪 Tarea de Prueba - Sistema de Notificaciones',
  description: 'Esta es una tarea de prueba para verificar que el sistema de notificaciones por email funciona correctamente.',
  status: 'in_progress',
  priority: 'high',
  due_date: new Date('2024-12-31'),
  project_id: 1
};

const testAssignee = {
  id: 1,
  name: 'Usuario de Prueba',
  email: 'prueba@ejemplo.com' // Cambiar por un email real para probar
};

const testProject = {
  id: 1,
  nombre: 'Proyecto de Prueba'
};

/**
 * Probar notificación de creación de tarea
 */
router.post('/test-created', async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email es requerido para la prueba'
      });
    }

    const testAssigneeWithEmail = {
      ...testAssignee,
      email: email
    };

    await sendTaskCreatedNotification(testTask, testAssigneeWithEmail, testProject);
    
    res.json({
      success: true,
      message: 'Notificación de creación enviada exitosamente',
      data: {
        task: testTask.title,
        recipient: email,
        type: 'task_created'
      }
    });

  } catch (error) {
    console.error('❌ Error en prueba de creación:', error);
    res.status(500).json({
      success: false,
      message: 'Error enviando notificación de prueba',
      error: error.message
    });
  }
});

/**
 * Probar notificación de asignación de tarea
 */
router.post('/test-assignment', async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email es requerido para la prueba'
      });
    }

    const testAssigneeWithEmail = {
      ...testAssignee,
      email: email
    };

    await sendTaskAssignmentNotification(testTask, testAssigneeWithEmail, testProject);
    
    res.json({
      success: true,
      message: 'Notificación de asignación enviada exitosamente',
      data: {
        task: testTask.title,
        recipient: email,
        type: 'task_assignment'
      }
    });

  } catch (error) {
    console.error('❌ Error en prueba de asignación:', error);
    res.status(500).json({
      success: false,
      message: 'Error enviando notificación de prueba',
      error: error.message
    });
  }
});

/**
 * Probar notificación de cambio de estado
 */
router.post('/test-status-change', async (req, res) => {
  try {
    const { email, oldStatus = 'todo', newStatus = 'in_progress' } = req.body;
    
    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email es requerido para la prueba'
      });
    }

    const testAssigneeWithEmail = {
      ...testAssignee,
      email: email
    };

    await sendTaskStatusChangeNotification(
      testTask, 
      oldStatus, 
      newStatus, 
      testAssigneeWithEmail, 
      testProject
    );
    
    res.json({
      success: true,
      message: 'Notificación de cambio de estado enviada exitosamente',
      data: {
        task: testTask.title,
        recipient: email,
        oldStatus,
        newStatus,
        type: 'task_status_change'
      }
    });

  } catch (error) {
    console.error('❌ Error en prueba de cambio de estado:', error);
    res.status(500).json({
      success: false,
      message: 'Error enviando notificación de prueba',
      error: error.message
    });
  }
});

/**
 * Probar todas las notificaciones
 */
router.post('/test-all', async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email es requerido para la prueba'
      });
    }

    const testAssigneeWithEmail = {
      ...testAssignee,
      email: email
    };

    const results = [];

    // Prueba 1: Creación
    try {
      await sendTaskCreatedNotification(testTask, testAssigneeWithEmail, testProject);
      results.push({ type: 'task_created', success: true });
    } catch (error) {
      results.push({ type: 'task_created', success: false, error: error.message });
    }

    // Prueba 2: Asignación
    try {
      await sendTaskAssignmentNotification(testTask, testAssigneeWithEmail, testProject);
      results.push({ type: 'task_assignment', success: true });
    } catch (error) {
      results.push({ type: 'task_assignment', success: false, error: error.message });
    }

    // Prueba 3: Cambio de estado
    try {
      await sendTaskStatusChangeNotification(
        testTask, 
        'todo', 
        'in_progress', 
        testAssigneeWithEmail, 
        testProject
      );
      results.push({ type: 'task_status_change', success: true });
    } catch (error) {
      results.push({ type: 'task_status_change', success: false, error: error.message });
    }
    
    res.json({
      success: true,
      message: 'Pruebas de notificaciones completadas',
      data: {
        recipient: email,
        results
      }
    });

  } catch (error) {
    console.error('❌ Error en pruebas completas:', error);
    res.status(500).json({
      success: false,
      message: 'Error ejecutando pruebas de notificaciones',
      error: error.message
    });
  }
});

module.exports = router;
