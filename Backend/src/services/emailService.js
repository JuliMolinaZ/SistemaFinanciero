const nodemailer = require('nodemailer');
const sgMail = require('@sendgrid/mail');

// Configurar SendGrid
if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

// Función para enviar email con SendGrid
const sendEmailWithSendGrid = async (emailData) => {
  if (!process.env.SENDGRID_API_KEY) {
    throw new Error('SendGrid API Key no configurada');
  }

  const msg = {
    to: emailData.to,
    from: {
      email: process.env.SENDGRID_FROM_EMAIL || 'noreply@runsolutions-services.com',
      name: process.env.SENDGRID_FROM_NAME || 'RunSolutions'
    },
    subject: emailData.subject,
    html: emailData.html,
    text: emailData.text || emailData.html.replace(/<[^>]*>/g, '')
  };

  const result = await sgMail.send(msg);

  return {
    success: true,
    messageId: result[0].headers['x-message-id'] || 'sendgrid-' + Date.now(),
    response: `SendGrid: ${result[0].statusCode}`,
    provider: 'sendgrid'
  };
};

// Configuración del transportador de email SMTP (fallback)
const createTransporter = () => {
  // Usar SMTP directo de Gmail (fallback para cuando SendGrid falle)
  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {

    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT || 587,
      secure: false, // TLS
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      },
      tls: {
        rejectUnauthorized: false
      },
      connectionTimeout: 10000, // 10 segundos
      greetingTimeout: 5000,    // 5 segundos
      socketTimeout: 10000      // 10 segundos
    });
  }

  // Fallback a servicio Gmail (para desarrollo)

  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER || 'tu-email@gmail.com',
      pass: process.env.GMAIL_APP_PASSWORD || 'tu-app-password'
    },
    connectionTimeout: 10000, // 10 segundos
    greetingTimeout: 5000,    // 5 segundos
    socketTimeout: 10000      // 10 segundos
  });
};

// Función para enviar email con sistema de fallback
const sendEmail = async (emailData) => {
  const errors = [];

  try {
    // 1. INTENTAR SENDGRID PRIMERO (recomendado para producción)
    if (process.env.SENDGRID_API_KEY) {
      try {
        console.log('🚀 Intentando envío con SendGrid (proveedor principal)...');
        const result = await sendEmailWithSendGrid(emailData);

        return result;
      } catch (sendgridError) {
        console.warn('⚠️ SendGrid falló:', sendgridError.message);
        errors.push(`SendGrid: ${sendgridError.message}`);
      }
    } else {
      console.log('⚠️ SendGrid no configurado (SENDGRID_API_KEY no encontrada)');
    }

    // 2. FALLBACK A SMTP SI SENDGRID FALLA
    if (process.env.SMTP_PASS || process.env.GMAIL_APP_PASSWORD) {
      try {

        const transporter = createTransporter();

        const mailOptions = {
          from: process.env.EMAIL_FROM || 'RunSolutions <noreply@runsolutions-services.com>',
          to: emailData.to,
          subject: emailData.subject,
          html: emailData.html,
          text: emailData.text || emailData.html.replace(/<[^>]*>/g, '')
        };

        const result = await transporter.sendMail(mailOptions);

        return {
          success: true,
          messageId: result.messageId,
          response: result.response,
          provider: 'smtp'
        };

      } catch (smtpError) {
        console.warn('⚠️ SMTP también falló:', smtpError.message);
        errors.push(`SMTP: ${smtpError.message}`);
      }
    } else {
      console.log('⚠️ SMTP no configurado (credenciales no encontradas)');
    }

    // 3. SI TODO FALLA, SIMULAR ENVÍO EN DESARROLLO
    if (process.env.NODE_ENV === 'development') {

      console.log('   📝 Contenido HTML:', emailData.html.substring(0, 100) + '...');
      console.log('⚠️ ERRORES DE PROVEEDORES:', errors.join(', '));

      return {
        success: true,
        messageId: 'simulated-dev-' + Date.now(),
        response: 'Email simulado en desarrollo - proveedores no disponibles',
        provider: 'simulation',
        errors
      };
    }

    // 4. EN PRODUCCIÓN, LANZAR ERROR SI TODOS LOS PROVEEDORES FALLAN
    throw new Error(`Todos los proveedores de email fallaron: ${errors.join(', ')}`);

  } catch (error) {
    console.error('❌ Error crítico enviando email:', error);

    // En desarrollo, siempre simular para no bloquear flujo
    if (process.env.NODE_ENV === 'development') {

      return {
        success: true,
        messageId: 'simulated-error-' + Date.now(),
        response: 'Email simulado debido a error crítico - REVISAR CONFIGURACIÓN',
        provider: 'simulation',
        originalError: error.message
      };
    }

    throw error;
  }
};

// Función para verificar conexión de proveedores
const verifyConnection = async () => {
  const results = {
    sendgrid: false,
    smtp: false,
    overall: false
  };

  // Verificar SendGrid
  if (process.env.SENDGRID_API_KEY) {
    try {

      const testEmail = {
        to: 'test@test.com',
        subject: 'Test SendGrid Connection',
        html: '<p>Test</p>'
      };

      // Solo probar la configuración, no enviar realmente
      const msg = {
        to: testEmail.to,
        from: {
          email: process.env.SENDGRID_FROM_EMAIL || 'noreply@runsolutions-services.com',
          name: process.env.SENDGRID_FROM_NAME || 'RunSolutions'
        },
        subject: testEmail.subject,
        html: testEmail.html
      };

      // SendGrid no tiene un método verify directo, pero podemos validar la API Key
      if (process.env.SENDGRID_API_KEY.startsWith('SG.')) {
        results.sendgrid = true;

      } else {

      }
    } catch (error) {

    }
  } else {

  }

  // Verificar SMTP
  if (process.env.SMTP_PASS || process.env.GMAIL_APP_PASSWORD) {
    try {

      const transporter = createTransporter();
      await transporter.verify();
      results.smtp = true;

    } catch (error) {

    }
  } else {

  }

  results.overall = results.sendgrid || results.smtp;

  if (results.overall) {

  } else {

  }

  return results;
};

// Función para enviar email de prueba
const sendTestEmail = async (toEmail) => {
  try {
    const testEmailData = {
      to: toEmail,
      subject: '🧪 Email de Prueba - RunSolutions',
      html: `
        <!DOCTYPE html>
        <html lang="es">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Email de Prueba</title>
        </head>
        <body>
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h1 style="color: #667eea;">🧪 Email de Prueba</h1>
            <p>Este es un email de prueba para verificar que el sistema de emails está funcionando correctamente.</p>
            <p><strong>Fecha:</strong> ${new Date().toLocaleString('es-ES')}</p>
            <p><strong>Servidor:</strong> ${process.env.NODE_ENV || 'development'}</p>
            <hr>
            <p style="color: #666; font-size: 12px;">
              Sistema RunSolutions - Email de prueba automático
            </p>
          </div>
        </body>
        </html>
      `
    };

    return await sendEmail(testEmailData);
  } catch (error) {
    console.error('❌ Error enviando email de prueba:', error);
    throw error;
  }
};

module.exports = {
  sendEmail,
  verifyConnection,
  sendTestEmail
};
