// Backend/src/services/userNotificationService.js
// =====================================================
// SERVICIO DE NOTIFICACIONES PARA USUARIOS
// =====================================================

const { sendEmail } = require('./emailService');

/**
 * Enviar email de invitación a nuevo usuario
 */
const sendUserInvitationNotification = async (user, invitedBy) => {
  try {

    const emailData = {
      to: user.email,
      subject: `🎉 SIGMA - ¡Bienvenido al equipo!`,
      html: `
        <!DOCTYPE html>
        <html lang="es">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>SIGMA - Invitación al Equipo</title>
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
            .welcome-card { 
              background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%); 
              padding: 30px; 
              border-radius: 16px; 
              margin: 30px 0; 
              border: 1px solid #e2e8f0;
              position: relative;
              overflow: hidden;
            }
            .welcome-card::before {
              content: '';
              position: absolute;
              top: 0;
              left: 0;
              width: 4px;
              height: 100%;
              background: linear-gradient(135deg, #10b981 0%, #059669 100%);
            }
            .welcome-title {
              font-size: 20px;
              font-weight: 700;
              color: #1e293b;
              margin-bottom: 16px;
              display: flex;
              align-items: center;
              gap: 12px;
            }
            .user-info {
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
            .role-badge { 
              display: inline-flex;
              align-items: center;
              gap: 6px;
              padding: 8px 16px; 
              border-radius: 20px; 
              font-size: 13px; 
              font-weight: 600;
              text-transform: uppercase;
              letter-spacing: 0.5px;
              background: #eff6ff; 
              color: #2563eb; 
              border: 1px solid #bfdbfe;
            }
            .cta-section {
              text-align: center;
              margin: 40px 0;
            }
            .cta-button { 
              display: inline-flex;
              align-items: center;
              gap: 8px;
              background: linear-gradient(135deg, #10b981 0%, #059669 100%); 
              color: white; 
              padding: 16px 32px; 
              text-decoration: none; 
              border-radius: 12px; 
              font-weight: 600;
              font-size: 16px;
              box-shadow: 0 4px 14px 0 rgba(16, 185, 129, 0.4);
              transition: all 0.3s ease;
            }
            .cta-button:hover {
              transform: translateY(-2px);
              box-shadow: 0 8px 25px 0 rgba(16, 185, 129, 0.6);
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
            .next-steps {
              background: rgba(59, 130, 246, 0.05);
              padding: 20px;
              border-radius: 12px;
              border-left: 4px solid #3b82f6;
              margin: 20px 0;
            }
            .next-steps h3 {
              color: #1e293b;
              margin-bottom: 12px;
              font-size: 16px;
            }
            .next-steps ul {
              margin: 0;
              padding-left: 20px;
              color: #475569;
            }
            .next-steps li {
              margin-bottom: 8px;
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
              <div class="greeting">¡Bienvenido al equipo! 🎉</div>
              <div class="intro-text">
                Has sido invitado a formar parte del equipo de <strong>RunSolutions</strong> y ahora tienes acceso al sistema SIGMA. 
                Estamos emocionados de tenerte a bordo.
              </div>
              
              <div class="welcome-card">
                <div class="welcome-title">
                  👋 ${user.name || 'Usuario'}
                </div>
                
                <div class="user-info">
                  <div class="info-row">
                    <span class="info-label">📧 Email:</span>
                    <span class="info-value">${user.email}</span>
                  </div>
                  
                  <div class="info-row">
                    <span class="info-label">👤 Rol:</span>
                    <span class="role-badge">
                      ${user.role === 'desarrollador' ? '💻 Desarrollador' : 
                        user.role === 'operador' ? '⚙️ Operador' : 
                        user.role === 'administrador' ? '👑 Administrador' : 
                        user.role === 'gerente' ? '📊 Gerente' : 
                        user.role === 'pm' ? '📋 Project Manager' : 
                        '👤 Usuario'}
                    </span>
                  </div>
                  
                  <div class="info-row">
                    <span class="info-label">👨‍💼 Invitado por:</span>
                    <span class="info-value">${invitedBy.name || 'Administrador'}</span>
                  </div>
                </div>
              </div>
              
              <div class="next-steps">
                <h3>🚀 Próximos pasos:</h3>
                <ul>
                  <li>Completa tu perfil en el sistema</li>
                  <li>Configura tu contraseña de acceso</li>
                  <li>Explora los módulos disponibles según tu rol</li>
                  <li>Comienza a trabajar en proyectos asignados</li>
                </ul>
              </div>
              
              <div class="divider"></div>
              
              <div class="cta-section">
                <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/complete-profile/${user.firebase_uid}" class="cta-button">
                  🚀 Completar Perfil
                </a>
                <div style="margin-top: 16px; font-size: 14px; color: #64748b;">
                  Haz clic para configurar tu cuenta y comenzar a usar SIGMA
                </div>
              </div>
            </div>
            
            <div class="footer">
              <div class="footer-logo">Σ SIGMA</div>
              <div class="footer-text">Sistema Integrado de Gestión y Administración</div>
              <div class="footer-text">Este es un email automático del sistema SIGMA de RunSolutions.</div>
              <div class="footer-text">Si tienes alguna pregunta, contacta al administrador del sistema.</div>
            </div>
          </div>
        </body>
        </html>
      `
    };

    const result = await sendEmail(emailData);

    return result;

  } catch (error) {
    console.error('❌ Error enviando notificación de invitación:', error);
    throw error;
  }
};

/**
 * Enviar email de bienvenida después de completar perfil
 */
const sendUserWelcomeNotification = async (user) => {
  try {

    const emailData = {
      to: user.email,
      subject: `🎉 SIGMA - ¡Perfil completado exitosamente!`,
      html: `
        <!DOCTYPE html>
        <html lang="es">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>SIGMA - Perfil Completado</title>
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
              background: linear-gradient(135deg, #10b981 0%, #059669 100%); 
              color: white; 
              padding: 40px 30px; 
              text-align: center; 
            }
            .sigma-logo {
              font-size: 32px;
              font-weight: 800;
              margin-bottom: 8px;
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
              text-align: center;
            }
            .success-message {
              background: #f0fdf4;
              border: 1px solid #bbf7d0;
              border-radius: 12px;
              padding: 20px;
              margin: 20px 0;
              text-align: center;
            }
            .success-icon {
              font-size: 48px;
              margin-bottom: 16px;
            }
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
            }
            .footer { 
              background: #f8fafc;
              padding: 30px; 
              text-align: center; 
              color: #64748b; 
              font-size: 14px;
            }
          </style>
        </head>
        <body>
          <div class="email-container">
            <div class="header">
              <div class="sigma-logo">Σ SIGMA</div>
              <div style="font-size: 14px; opacity: 0.9;">Sistema Integrado de Gestión y Administración</div>
            </div>
            
            <div class="content">
              <div class="greeting">¡Perfil Completado! 🎉</div>
              
              <div class="success-message">
                <div class="success-icon">✅</div>
                <h3 style="color: #059669; margin: 0 0 8px 0;">¡Excelente trabajo!</h3>
                <p style="margin: 0; color: #047857;">Tu perfil ha sido configurado exitosamente y ya tienes acceso completo a SIGMA.</p>
              </div>
              
              <p style="text-align: center; color: #64748b; font-size: 16px;">
                Ahora puedes comenzar a usar todas las funcionalidades disponibles según tu rol en el sistema.
              </p>
              
              <div class="cta-section">
                <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}" class="cta-button">
                  🚀 Acceder a SIGMA
                </a>
              </div>
            </div>
            
            <div class="footer">
              <div style="font-size: 18px; font-weight: 700; color: #1e293b; margin-bottom: 8px;">Σ SIGMA</div>
              <div>Sistema Integrado de Gestión y Administración</div>
            </div>
          </div>
        </body>
        </html>
      `
    };

    const result = await sendEmail(emailData);

    return result;

  } catch (error) {
    console.error('❌ Error enviando email de bienvenida:', error);
    throw error;
  }
};

module.exports = {
  sendUserInvitationNotification,
  sendUserWelcomeNotification
};
