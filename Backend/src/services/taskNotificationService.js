// 📧 SERVICIO DE NOTIFICACIONES PARA TAREAS
// ==========================================

const { sendEmail } = require('./emailService');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * Enviar notificación cuando se asigna una tarea a un usuario
 */
const sendTaskAssignmentNotification = async (task, assignee, project) => {
  try {
    if (!assignee || !assignee.email) {
      console.log('⚠️ No se puede enviar notificación: usuario sin email');
      return;
    }

    const emailData = {
      to: assignee.email,
      subject: `📋 Nueva tarea asignada: ${task.title}`,
      html: `
        <!DOCTYPE html>
        <html lang="es">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Nueva Tarea Asignada</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; }
            .task-card { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #667eea; }
            .priority-high { border-left-color: #e74c3c; }
            .priority-medium { border-left-color: #f39c12; }
            .priority-low { border-left-color: #27ae60; }
            .button { display: inline-block; background: #667eea; color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; margin: 20px 0; font-weight: bold; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
            .status-badge { display: inline-block; padding: 8px 16px; border-radius: 20px; font-size: 14px; font-weight: bold; }
            .status-todo { background: #6c757d; color: white; }
            .status-in_progress { background: #007bff; color: white; }
            .status-review { background: #ffc107; color: black; }
            .status-done { background: #28a745; color: white; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>📋 Nueva Tarea Asignada</h1>
              <p>Sistema de Gestión de Proyectos - RunSolutions</p>
            </div>
            
            <div class="content">
              <h2>¡Hola ${assignee.name}!</h2>
              <p>Se te ha asignado una nueva tarea en el proyecto <strong>${project.nombre || project.name}</strong>.</p>
              
              <div class="task-card priority-${task.priority || 'medium'}">
                <h3>📝 ${task.title}</h3>
                <p><strong>Descripción:</strong> ${task.description || 'Sin descripción'}</p>
                <p><strong>Proyecto:</strong> ${project.nombre || project.name}</p>
                <p><strong>Prioridad:</strong> 
                  <span class="status-badge priority-${task.priority || 'medium'}">
                    ${task.priority === 'high' ? '🔴 Alta' : task.priority === 'medium' ? '🟡 Media' : '🟢 Baja'}
                  </span>
                </p>
                <p><strong>Estado:</strong> 
                  <span class="status-badge status-${task.status || 'todo'}">
                    ${task.status === 'todo' ? '📋 Por Hacer' : 
                      task.status === 'in_progress' ? '🚀 En Progreso' : 
                      task.status === 'review' ? '👀 En Revisión' : 
                      '✅ Completada'}
                  </span>
                </p>
                ${task.due_date ? `<p><strong>Fecha límite:</strong> ${new Date(task.due_date).toLocaleDateString('es-ES')}</p>` : ''}
              </div>
              
              <p>Puedes acceder a la tarea desde el sistema de gestión de proyectos.</p>
              
              <div style="text-align: center;">
                <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/project-management" class="button">
                  🚀 Ver Tarea en el Sistema
                </a>
              </div>
            </div>
            
            <div class="footer">
              <p>Este es un email automático del sistema RunSolutions.</p>
              <p>Si tienes alguna pregunta, contacta al administrador del proyecto.</p>
            </div>
          </div>
        </body>
        </html>
      `
    };

    await sendEmail(emailData);
    console.log(`✅ Notificación de asignación enviada a ${assignee.email}`);
    
  } catch (error) {
    console.error('❌ Error enviando notificación de asignación:', error);
  }
};

/**
 * Enviar notificación cuando cambia el estado de una tarea
 */
const sendTaskStatusChangeNotification = async (task, oldStatus, newStatus, assignee, project) => {
  try {
    if (!assignee || !assignee.email) {
      console.log('⚠️ No se puede enviar notificación: usuario sin email');
      return;
    }

    const getStatusLabel = (status) => {
      switch (status) {
        case 'todo': return '📋 Por Hacer';
        case 'in_progress': return '🚀 En Progreso';
        case 'review': return '👀 En Revisión';
        case 'done': return '✅ Completada';
        default: return status;
      }
    };

    const getStatusColor = (status) => {
      switch (status) {
        case 'todo': return '#6c757d';
        case 'in_progress': return '#007bff';
        case 'review': return '#ffc107';
        case 'done': return '#28a745';
        default: return '#667eea';
      }
    };

    const emailData = {
      to: assignee.email,
      subject: `🔄 Tarea actualizada: ${task.title} - ${getStatusLabel(newStatus)}`,
      html: `
        <!DOCTYPE html>
        <html lang="es">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Tarea Actualizada</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; }
            .task-card { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #667eea; }
            .status-change { background: #e8f4fd; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #007bff; }
            .status-old { color: #6c757d; text-decoration: line-through; }
            .status-new { color: ${getStatusColor(newStatus)}; font-weight: bold; }
            .button { display: inline-block; background: #667eea; color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; margin: 20px 0; font-weight: bold; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🔄 Tarea Actualizada</h1>
              <p>Sistema de Gestión de Proyectos - RunSolutions</p>
            </div>
            
            <div class="content">
              <h2>¡Hola ${assignee.name}!</h2>
              <p>La tarea <strong>"${task.title}"</strong> ha cambiado de estado en el proyecto <strong>${project.nombre || project.name}</strong>.</p>
              
              <div class="status-change">
                <h3>📊 Cambio de Estado</h3>
                <p><strong>Estado anterior:</strong> <span class="status-old">${getStatusLabel(oldStatus)}</span></p>
                <p><strong>Estado actual:</strong> <span class="status-new">${getStatusLabel(newStatus)}</span></p>
              </div>
              
              <div class="task-card">
                <h3>📝 ${task.title}</h3>
                <p><strong>Descripción:</strong> ${task.description || 'Sin descripción'}</p>
                <p><strong>Proyecto:</strong> ${project.nombre || project.name}</p>
                <p><strong>Prioridad:</strong> ${task.priority === 'high' ? '🔴 Alta' : task.priority === 'medium' ? '🟡 Media' : '🟢 Baja'}</p>
                ${task.due_date ? `<p><strong>Fecha límite:</strong> ${new Date(task.due_date).toLocaleDateString('es-ES')}</p>` : ''}
              </div>
              
              <p>Puedes acceder a la tarea desde el sistema de gestión de proyectos.</p>
              
              <div style="text-align: center;">
                <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/project-management" class="button">
                  🚀 Ver Tarea en el Sistema
                </a>
              </div>
            </div>
            
            <div class="footer">
              <p>Este es un email automático del sistema RunSolutions.</p>
              <p>Si tienes alguna pregunta, contacta al administrador del proyecto.</p>
            </div>
          </div>
        </body>
        </html>
      `
    };

    await sendEmail(emailData);
    console.log(`✅ Notificación de cambio de estado enviada a ${assignee.email}`);
    
  } catch (error) {
    console.error('❌ Error enviando notificación de cambio de estado:', error);
  }
};

/**
 * Enviar notificación cuando se crea una nueva tarea
 */
const sendTaskCreatedNotification = async (task, assignee, project) => {
  try {
    if (!assignee || !assignee.email) {
      console.log('⚠️ No se puede enviar notificación: usuario sin email');
      return;
    }

    const emailData = {
      to: assignee.email,
      subject: `✨ Nueva tarea creada: ${task.title}`,
      html: `
        <!DOCTYPE html>
        <html lang="es">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Nueva Tarea Creada</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #28a745 0%, #20c997 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; }
            .task-card { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #28a745; }
            .button { display: inline-block; background: #28a745; color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; margin: 20px 0; font-weight: bold; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>✨ Nueva Tarea Creada</h1>
              <p>Sistema de Gestión de Proyectos - RunSolutions</p>
            </div>
            
            <div class="content">
              <h2>¡Hola ${assignee.name}!</h2>
              <p>Se ha creado una nueva tarea y se te ha asignado en el proyecto <strong>${project.nombre || project.name}</strong>.</p>
              
              <div class="task-card">
                <h3>📝 ${task.title}</h3>
                <p><strong>Descripción:</strong> ${task.description || 'Sin descripción'}</p>
                <p><strong>Proyecto:</strong> ${project.nombre || project.name}</p>
                <p><strong>Prioridad:</strong> ${task.priority === 'high' ? '🔴 Alta' : task.priority === 'medium' ? '🟡 Media' : '🟢 Baja'}</p>
                <p><strong>Estado:</strong> 📋 Por Hacer</p>
                ${task.due_date ? `<p><strong>Fecha límite:</strong> ${new Date(task.due_date).toLocaleDateString('es-ES')}</p>` : ''}
              </div>
              
              <p>Puedes acceder a la tarea desde el sistema de gestión de proyectos.</p>
              
              <div style="text-align: center;">
                <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/project-management" class="button">
                  🚀 Ver Tarea en el Sistema
                </a>
              </div>
            </div>
            
            <div class="footer">
              <p>Este es un email automático del sistema RunSolutions.</p>
              <p>Si tienes alguna pregunta, contacta al administrador del proyecto.</p>
            </div>
          </div>
        </body>
        </html>
      `
    };

    await sendEmail(emailData);
    console.log(`✅ Notificación de creación enviada a ${assignee.email}`);
    
  } catch (error) {
    console.error('❌ Error enviando notificación de creación:', error);
  }
};

module.exports = {
  sendTaskAssignmentNotification,
  sendTaskStatusChangeNotification,
  sendTaskCreatedNotification
};
