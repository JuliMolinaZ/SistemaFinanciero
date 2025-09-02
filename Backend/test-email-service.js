const { sendEmail, verifyConnection, sendTestEmail } = require('./src/services/emailService');

async function testEmailService() {
  try {
    console.log('🧪 Probando servicio de email...');
    
    // 1. Verificar conexión
    console.log('\n1️⃣ Verificando conexión...');
    const connectionOk = await verifyConnection();
    
    if (!connectionOk) {
      console.log('❌ No se pudo verificar la conexión de email');
      console.log('💡 Verifica las variables de entorno:');
      console.log('   - GMAIL_USER');
      console.log('   - GMAIL_APP_PASSWORD');
      return;
    }
    
    // 2. Enviar email de prueba
    console.log('\n2️⃣ Enviando email de prueba...');
    const testEmail = process.env.GMAIL_USER || 'tu-email@gmail.com';
    
    if (testEmail === 'tu-email@gmail.com') {
      console.log('⚠️  No se configuró GMAIL_USER, usando email de prueba');
      console.log('💡 Configura las variables de entorno para enviar emails reales');
      return;
    }
    
    const result = await sendTestEmail(testEmail);
    
    if (result.success) {
      console.log('✅ Email de prueba enviado exitosamente');
      console.log('   Message ID:', result.messageId);
      console.log('   Revisa tu bandeja de entrada en:', testEmail);
    }
    
  } catch (error) {
    console.error('❌ Error probando servicio de email:', error.message);
    
    if (error.code === 'EAUTH') {
      console.log('\n🔐 Error de autenticación:');
      console.log('   - Verifica que GMAIL_USER sea correcto');
      console.log('   - Verifica que GMAIL_APP_PASSWORD sea válido');
      console.log('   - Asegúrate de usar una contraseña de aplicación, no tu contraseña normal');
    }
    
    if (error.code === 'ECONNECTION') {
      console.log('\n🌐 Error de conexión:');
      console.log('   - Verifica tu conexión a internet');
      console.log('   - Verifica que Gmail no esté bloqueado');
    }
  }
}

// Ejecutar la función
testEmailService();
