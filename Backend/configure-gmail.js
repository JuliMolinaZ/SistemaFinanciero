const fs = require('fs');
const readline = require('readline');
const { verifyConnection, sendTestEmail } = require('./src/services/emailService');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

async function configureGmail() {
  console.log('🚀 CONFIGURACIÓN DE GMAIL PARA RUNSOLUTIONS');
  console.log('=============================================\n');
  
  try {
    // 1. Solicitar email de Gmail
    const gmailUser = await question('📧 Ingresa tu email de Gmail: ');
    
    if (!gmailUser.includes('@gmail.com')) {
      console.log('❌ Error: Debe ser un email de Gmail válido');
      rl.close();
      return;
    }
    
    console.log('\n📋 INSTRUCCIONES PARA GENERAR CONTRASEÑA DE APLICACIÓN:');
    console.log('1. Ve a tu cuenta de Gmail');
    console.log('2. Activa la verificación en 2 pasos (si no está activada)');
    console.log('3. Ve a "Contraseñas de aplicación"');
    console.log('4. Selecciona "Correo" como aplicación');
    console.log('5. Copia la contraseña generada (16 caracteres)\n');
    
    // 2. Solicitar contraseña de aplicación
    const appPassword = await question('🔑 Ingresa la contraseña de aplicación de Gmail: ');
    
    if (appPassword.length !== 16) {
      console.log('⚠️  Advertencia: La contraseña de aplicación debe tener 16 caracteres');
      console.log('   ¿Estás seguro de que quieres continuar? (s/n)');
      const confirm = await question('   Respuesta: ');
      if (confirm.toLowerCase() !== 's' && confirm.toLowerCase() !== 'si') {
        console.log('❌ Configuración cancelada');
        rl.close();
        return;
      }
    }
    
    // 3. Actualizar archivo de configuración
    console.log('\n🔧 Actualizando archivo de configuración...');
    
    let configContent = fs.readFileSync('config.env', 'utf8');
    
    // Reemplazar variables
    configContent = configContent.replace(
      /GMAIL_USER=.*/g,
      `GMAIL_USER=${gmailUser}`
    );
    
    configContent = configContent.replace(
      /GMAIL_APP_PASSWORD=.*/g,
      `GMAIL_APP_PASSWORD=${appPassword}`
    );
    
    fs.writeFileSync('config.env', configContent);
    
    console.log('✅ Archivo de configuración actualizado');
    
    // 4. Probar conexión
    console.log('\n🧪 Probando conexión con Gmail...');
    
    // Establecer variables de entorno temporalmente
    process.env.GMAIL_USER = gmailUser;
    process.env.GMAIL_APP_PASSWORD = appPassword;
    
    const connectionOk = await verifyConnection();
    
    if (connectionOk) {
      console.log('✅ Conexión exitosa con Gmail');
      
      // 5. Enviar email de prueba
      console.log('\n📧 Enviando email de prueba...');
      
      try {
        const result = await sendTestEmail(gmailUser);
        
        if (result.success) {
          console.log('✅ Email de prueba enviado exitosamente');
          console.log('   Message ID:', result.messageId);
          console.log('   Revisa tu bandeja de entrada en:', gmailUser);
        }
      } catch (emailError) {
        console.log('⚠️  No se pudo enviar email de prueba:', emailError.message);
      }
      
    } else {
      console.log('❌ No se pudo conectar con Gmail');
      console.log('💡 Verifica:');
      console.log('   - Que la verificación en 2 pasos esté activada');
      console.log('   - Que la contraseña de aplicación sea correcta');
      console.log('   - Que no haya bloqueos de seguridad en tu cuenta');
    }
    
    // 6. Mostrar resumen
    console.log('\n📊 RESUMEN DE CONFIGURACIÓN:');
    console.log('   Email configurado:', gmailUser);
    console.log('   Contraseña de app:', appPassword ? '✅ Configurada' : '❌ No configurada');
    console.log('   Conexión Gmail:', connectionOk ? '✅ Exitosa' : '❌ Fallida');
    
    if (connectionOk) {
      console.log('\n🎉 ¡Configuración completada exitosamente!');
      console.log('   Ahora puedes registrar usuarios y se enviarán emails automáticamente');
    } else {
      console.log('\n⚠️  Configuración incompleta');
      console.log('   Revisa los errores y vuelve a ejecutar el script');
    }
    
  } catch (error) {
    console.error('❌ Error durante la configuración:', error.message);
  } finally {
    rl.close();
  }
}

function question(query) {
  return new Promise((resolve) => {
    rl.question(query, resolve);
  });
}

// Ejecutar la función
configureGmail();
