// 🧪 RUTA DE PRUEBA PARA NOTIFICACIONES DE TAREAS
// ================================================

const express = require('express');
const router = express.Router();
const { 
  sendTaskAssignmentNotification, 
  sendTaskStatusChangeNotification, 
  sendTaskCreatedNotification 
} = require('../services/taskNotificationService');

/**
 * Probar envío de notificación de asignación de tarea
 */
router.post('/test-assignment', async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email es requerido'
      });
    }

    // Datos de prueba
    const testTask = {
      id: 999,
      title: 'Tarea de Prueba - SIGMA',
      description: 'Esta es una tarea de prueba para verificar que el sistema de notificaciones por email funcione correctamente.',
      status: 'todo',
      priority: 'high',
      assigned_to: 1,
      due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 días desde ahora
      project_id: 1
    };

    const testAssignee = {
      id: 1,
      name: 'Usuario de Prueba',
      email: email
    };

    const testProject = {
      id: 1,
      nombre: 'Proyecto SIGMA de Prueba'
    };

    console.log('🧪 Enviando email de prueba a:', email);
    
    await sendTaskAssignmentNotification(testTask, testAssignee, testProject);

    res.json({
      success: true,
      message: `Email de prueba enviado exitosamente a ${email}`,
      data: {
        task: testTask.title,
        assignee: testAssignee.name,
        project: testProject.nombre
      }
    });

  } catch (error) {
    console.error('❌ Error en prueba de notificación:', error);
    res.status(500).json({
      success: false,
      message: 'Error enviando email de prueba',
      error: error.message
    });
  }
});

/**
 * Probar envío de notificación de cambio de estado
 */
router.post('/test-status-change', async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email es requerido'
      });
    }

    // Datos de prueba
    const testTask = {
      id: 999,
      title: 'Tarea Actualizada - SIGMA',
      description: 'Esta tarea ha cambiado de estado en el sistema SIGMA.',
      status: 'in_progress',
      priority: 'medium',
      assigned_to: 1,
      due_date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      project_id: 1
    };

    const testAssignee = {
      id: 1,
      name: 'Usuario de Prueba',
      email: email
    };

    const testProject = {
      id: 1,
      nombre: 'Proyecto SIGMA de Prueba'
    };

    console.log('🧪 Enviando email de cambio de estado a:', email);
    
    await sendTaskStatusChangeNotification(testTask, 'todo', 'in_progress', testAssignee, testProject);

    res.json({
      success: true,
      message: `Email de cambio de estado enviado exitosamente a ${email}`,
      data: {
        task: testTask.title,
        oldStatus: 'todo',
        newStatus: 'in_progress',
        assignee: testAssignee.name,
        project: testProject.nombre
      }
    });

  } catch (error) {
    console.error('❌ Error en prueba de cambio de estado:', error);
    res.status(500).json({
      success: false,
      message: 'Error enviando email de cambio de estado',
      error: error.message
    });
  }
});

/**
 * Probar conexión con Gmail
 */
router.get('/test-connection', async (req, res) => {
  try {
    const { verifyConnection } = require('../services/emailService');
    
    const isConnected = await verifyConnection();
    
    res.json({
      success: true,
      message: 'Conexión con Gmail verificada',
      connected: isConnected
    });

  } catch (error) {
    console.error('❌ Error verificando conexión:', error);
    res.status(500).json({
      success: false,
      message: 'Error verificando conexión con Gmail',
      error: error.message
    });
  }
});

module.exports = router;