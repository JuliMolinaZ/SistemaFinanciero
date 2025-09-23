const nodemailer = require('nodemailer');

// Configuración del transportador de email
const createTransporter = () => {
  // Usar SMTP directo de Gmail (más confiable para dominios corporativos)
  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
    console.log('🔧 Usando configuración SMTP directa');
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
      }
    });
  }

  // Fallback a servicio Gmail (para desarrollo)
  console.log('🔧 Usando servicio Gmail como fallback');
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER || 'tu-email@gmail.com',
      pass: process.env.GMAIL_APP_PASSWORD || 'tu-app-password'
    }
  });
};

// Función para enviar email
const sendEmail = async (emailData) => {
  try {
    // Modo desarrollo: solo simular envío si las credenciales no están configuradas
    if (process.env.NODE_ENV === 'development' && !process.env.GMAIL_APP_PASSWORD) {
      console.log('🧪 MODO DESARROLLO: Simulando envío de email...');
      console.log('   Desde:', process.env.EMAIL_FROM || 'RunSolutions <noreply@runsolutions-services.com>');
      console.log('   Hacia:', emailData.to);
      console.log('   Asunto:', emailData.subject);
      console.log('   📝 Contenido HTML:', emailData.html.substring(0, 100) + '...');
      console.log('✅ Email simulado enviado exitosamente');
      
      return {
        success: true,
        messageId: 'simulated-' + Date.now(),
        response: 'Email simulado en modo desarrollo'
      };
    }

    const transporter = createTransporter();
    
    const mailOptions = {
      from: process.env.EMAIL_FROM || 'RunSolutions <noreply@runsolutions-services.com>',
      to: emailData.to,
      subject: emailData.subject,
      html: emailData.html,
      text: emailData.text || emailData.html.replace(/<[^>]*>/g, '') // Versión texto plano
    };

    console.log('📧 Enviando email real...');
    console.log('   Desde:', mailOptions.from);
    console.log('   Hacia:', mailOptions.to);
    console.log('   Asunto:', mailOptions.subject);

    const result = await transporter.sendMail(mailOptions);
    
    console.log('✅ Email enviado exitosamente');
    console.log('   Message ID:', result.messageId);
    console.log('   Respuesta:', result.response);
    
    return {
      success: true,
      messageId: result.messageId,
      response: result.response
    };

  } catch (error) {
    console.error('❌ Error enviando email:', error);
    
    // En modo desarrollo, simular éxito si hay error de autenticación
    if (process.env.NODE_ENV === 'development' && error.code === 'EAUTH') {
      console.log('❌ ERROR DE AUTENTICACIÓN GMAIL:');
      console.log('   📧 Email que NO se pudo enviar:');
      console.log('   Desde:', process.env.EMAIL_FROM || 'RunSolutions <noreply@runsolutions-services.com>');
      console.log('   Hacia:', emailData.to);
      console.log('   Asunto:', emailData.subject);
      console.log('   📝 Contenido:', emailData.html.substring(0, 200) + '...');
      console.log('');
      console.log('🔧 SOLUCIÓN REQUERIDA:');
      console.log('   1. Generar nueva App Password en Gmail');
      console.log('   2. Actualizar GMAIL_APP_PASSWORD en config.env');
      console.log('   3. Reiniciar el servidor');
      console.log('');
      console.log('🧪 Simulando envío para continuar desarrollo...');
      
      return {
        success: true,
        messageId: 'simulated-auth-error-' + Date.now(),
        response: 'Email simulado debido a error de autenticación - REQUIERE NUEVA APP PASSWORD'
      };
    }
    
    throw error;
  }
};

// Función para verificar conexión
const verifyConnection = async () => {
  try {
    const transporter = createTransporter();
    await transporter.verify();
    console.log('✅ Conexión de email verificada correctamente');
    return true;
  } catch (error) {
    console.error('❌ Error verificando conexión de email:', error);
    return false;
  }
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
