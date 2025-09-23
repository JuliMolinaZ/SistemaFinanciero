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
      subject: `🚀 SIGMA - Nueva tarea asignada: ${task.title}`,
      html: `
        <!DOCTYPE html>
        <html lang="es">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>SIGMA - Nueva Tarea Asignada</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
            body { 
              font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
              line-height: 1.6; 
              color: #1a1a1a; 
              margin: 0; 
              padding: 0; 
              background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
            }
            .email-container { 
              max-width: 600px; 
              margin: 20px auto; 
              background: white; 
              border-radius: 20px; 
              overflow: hidden; 
              box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
            }
            .header { 
              background: linear-gradient(135deg, #1e293b 0%, #334155 50%, #475569 100%); 
              color: white; 
              padding: 40px 30px; 
              text-align: center; 
              position: relative;
            }
            .header::before {
              content: '';
              position: absolute;
              top: 0;
              left: 0;
              right: 0;
              bottom: 0;
              background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="25" cy="25" r="1" fill="rgba(255,255,255,0.1)"/><circle cx="75" cy="75" r="1" fill="rgba(255,255,255,0.1)"/><circle cx="50" cy="10" r="1" fill="rgba(255,255,255,0.1)"/><circle cx="10" cy="60" r="1" fill="rgba(255,255,255,0.1)"/><circle cx="90" cy="40" r="1" fill="rgba(255,255,255,0.1)"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
              opacity: 0.3;
            }
            .sigma-logo {
              font-size: 32px;
              font-weight: 800;
              margin-bottom: 8px;
              position: relative;
              z-index: 1;
              text-shadow: 0 2px 4px rgba(0,0,0,0.3);
            }
            .sigma-tagline {
              font-size: 14px;
              opacity: 0.9;
              font-weight: 500;
              position: relative;
              z-index: 1;
            }
            .content { 
              padding: 40px 30px; 
              background: white;
            }
            .greeting {
              font-size: 24px;
              font-weight: 700;
              color: #1e293b;
              margin-bottom: 16px;
            }
            .intro-text {
              font-size: 16px;
              color: #64748b;
              margin-bottom: 30px;
              line-height: 1.7;
            }
            .task-card { 
              background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%); 
              padding: 30px; 
              border-radius: 16px; 
              margin: 30px 0; 
              border: 1px solid #e2e8f0;
              position: relative;
              overflow: hidden;
            }
            .task-card::before {
              content: '';
              position: absolute;
              top: 0;
              left: 0;
              width: 4px;
              height: 100%;
              background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
            }
            .task-card.priority-high::before { background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); }
            .task-card.priority-medium::before { background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); }
            .task-card.priority-low::before { background: linear-gradient(135deg, #10b981 0%, #059669 100%); }
            .task-title {
              font-size: 20px;
              font-weight: 700;
              color: #1e293b;
              margin-bottom: 16px;
              display: flex;
              align-items: center;
              gap: 12px;
            }
            .task-info {
              display: grid;
              gap: 12px;
              margin-top: 20px;
            }
            .info-row {
              display: flex;
              align-items: center;
              gap: 12px;
              font-size: 14px;
            }
            .info-label {
              font-weight: 600;
              color: #475569;
              min-width: 80px;
            }
            .info-value {
              color: #1e293b;
            }
            .priority-badge, .status-badge { 
              display: inline-flex;
              align-items: center;
              gap: 6px;
              padding: 8px 16px; 
              border-radius: 20px; 
              font-size: 13px; 
              font-weight: 600;
              text-transform: uppercase;
              letter-spacing: 0.5px;
            }
            .priority-high { background: #fef2f2; color: #dc2626; border: 1px solid #fecaca; }
            .priority-medium { background: #fffbeb; color: #d97706; border: 1px solid #fed7aa; }
            .priority-low { background: #f0fdf4; color: #059669; border: 1px solid #bbf7d0; }
            .status-todo { background: #f1f5f9; color: #475569; border: 1px solid #cbd5e1; }
            .status-in_progress { background: #eff6ff; color: #2563eb; border: 1px solid #bfdbfe; }
            .status-review { background: #fffbeb; color: #d97706; border: 1px solid #fed7aa; }
            .status-done { background: #f0fdf4; color: #059669; border: 1px solid #bbf7d0; }
            .cta-section {
              text-align: center;
              margin: 40px 0;
            }
            .cta-button { 
              display: inline-flex;
              align-items: center;
              gap: 8px;
              background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%); 
              color: white; 
              padding: 16px 32px; 
              text-decoration: none; 
              border-radius: 12px; 
              font-weight: 600;
              font-size: 16px;
              box-shadow: 0 4px 14px 0 rgba(59, 130, 246, 0.4);
              transition: all 0.3s ease;
            }
            .cta-button:hover {
              transform: translateY(-2px);
              box-shadow: 0 8px 25px 0 rgba(59, 130, 246, 0.6);
            }
            .footer { 
              background: #f8fafc;
              padding: 30px; 
              text-align: center; 
              color: #64748b; 
              font-size: 14px;
              border-top: 1px solid #e2e8f0;
            }
            .footer-logo {
              font-size: 18px;
              font-weight: 700;
              color: #1e293b;
              margin-bottom: 8px;
            }
            .footer-text {
              margin: 8px 0;
              line-height: 1.6;
            }
            .divider {
              height: 1px;
              background: linear-gradient(90deg, transparent 0%, #e2e8f0 50%, transparent 100%);
              margin: 30px 0;
            }
          </style>
        </head>
        <body>
          <div class="email-container">
            <div class="header">
              <div class="sigma-logo">Σ SIGMA</div>
              <div class="sigma-tagline">Sistema Integrado de Gestión y Administración</div>
            </div>
            
            <div class="content">
              <div class="greeting">¡Hola ${assignee.name}! 👋</div>
              <div class="intro-text">
                Se te ha asignado una nueva tarea en el proyecto <strong>${project.nombre || project.name}</strong>. 
                Revisa los detalles a continuación y comienza a trabajar en ella.
              </div>
              
              <div class="task-card priority-${task.priority || 'medium'}">
                <div class="task-title">
                  📝 ${task.title}
                </div>
                
                ${task.description ? `
                  <div style="margin-bottom: 20px; padding: 16px; background: rgba(59, 130, 246, 0.05); border-radius: 8px; border-left: 3px solid #3b82f6;">
                    <strong style="color: #1e293b;">Descripción:</strong><br>
                    <span style="color: #475569; line-height: 1.6;">${task.description}</span>
                  </div>
                ` : ''}
                
                <div class="task-info">
                  <div class="info-row">
                    <span class="info-label">📁 Proyecto:</span>
                    <span class="info-value">${project.nombre || project.name}</span>
                  </div>
                  
                  <div class="info-row">
                    <span class="info-label">⚡ Prioridad:</span>
                    <span class="priority-badge priority-${task.priority || 'medium'}">
                      ${task.priority === 'high' ? '🔴 Alta' : task.priority === 'medium' ? '🟡 Media' : '🟢 Baja'}
                    </span>
                  </div>
                  
                  <div class="info-row">
                    <span class="info-label">📊 Estado:</span>
                    <span class="status-badge status-${task.status || 'todo'}">
                      ${task.status === 'todo' ? '📋 Por Hacer' : 
                        task.status === 'in_progress' ? '🚀 En Progreso' : 
                        task.status === 'review' ? '👀 En Revisión' : 
                        '✅ Completada'}
                    </span>
                  </div>
                  
                  ${task.due_date ? `
                    <div class="info-row">
                      <span class="info-label">📅 Fecha límite:</span>
                      <span class="info-value">${new Date(task.due_date).toLocaleDateString('es-ES', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}</span>
                    </div>
                  ` : ''}
                </div>
              </div>
              
              <div class="divider"></div>
              
              <div class="cta-section">
                <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/project-management" class="cta-button">
                  🚀 Acceder a SIGMA
                </a>
                <div style="margin-top: 16px; font-size: 14px; color: #64748b;">
                  Haz clic para ver la tarea en el sistema
                </div>
              </div>
            </div>
            
            <div class="footer">
              <div class="footer-logo">Σ SIGMA</div>
              <div class="footer-text">Sistema Integrado de Gestión y Administración</div>
              <div class="footer-text">Este es un email automático del sistema SIGMA de RunSolutions.</div>
              <div class="footer-text">Si tienes alguna pregunta, contacta al administrador del proyecto.</div>
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
