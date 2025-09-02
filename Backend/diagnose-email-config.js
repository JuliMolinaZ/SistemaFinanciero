const fs = require('fs');
const path = require('path');

console.log('🔍 DIAGNÓSTICO DE CONFIGURACIÓN DE EMAIL');
console.log('==========================================\n');

// 1. Verificar archivo config.env
console.log('1️⃣ ARCHIVO CONFIG.ENV:');
try {
  const configPath = path.join(__dirname, 'config.env');
  if (fs.existsSync(configPath)) {
    const configContent = fs.readFileSync(configPath, 'utf8');
    
    // Extraer variables de email
    const gmailUser = configContent.match(/GMAIL_USER=(.+)/);
    const gmailPass = configContent.match(/GMAIL_APP_PASSWORD=(.+)/);
    const smtpHost = configContent.match(/SMTP_HOST=(.+)/);
    const smtpUser = configContent.match(/SMTP_USER=(.+)/);
    const smtpPass = configContent.match(/SMTP_PASS=(.+)/);
    
    console.log('   ✅ Archivo encontrado');
    console.log('   📧 GMAIL_USER:', gmailUser ? gmailUser[1] : '❌ No configurado');
    console.log('   🔑 GMAIL_APP_PASSWORD:', gmailPass ? (gmailPass[1].length > 10 ? '✅ Configurado' : gmailPass[1]) : '❌ No configurado');
    console.log('   🌐 SMTP_HOST:', smtpHost ? smtpHost[1] : '❌ No configurado');
    console.log('   👤 SMTP_USER:', smtpUser ? smtpUser[1] : '❌ No configurado');
    console.log('   🔐 SMTP_PASS:', smtpPass ? (smtpPass[1].length > 10 ? '✅ Configurado' : smtpPass[1]) : '❌ No configurado');
  } else {
    console.log('   ❌ Archivo no encontrado');
  }
} catch (error) {
  console.log('   ❌ Error leyendo archivo:', error.message);
}

// 2. Verificar variables de entorno
console.log('\n2️⃣ VARIABLES DE ENTORNO:');
console.log('   📧 GMAIL_USER:', process.env.GMAIL_USER || '❌ No definida');
console.log('   🔑 GMAIL_APP_PASSWORD:', process.env.GMAIL_APP_PASSWORD || '❌ No definida');
console.log('   🌐 SMTP_HOST:', process.env.SMTP_HOST || '❌ No definida');
console.log('   👤 SMTP_USER:', process.env.SMTP_USER || '❌ No definida');
console.log('   🔐 SMTP_PASS:', process.env.SMTP_PASS || '❌ No definida');
console.log('   🔧 NODE_ENV:', process.env.NODE_ENV || '❌ No definida');

// 3. Verificar configuración del servidor
console.log('\n3️⃣ CONFIGURACIÓN DEL SERVIDOR:');
try {
  const serverPath = path.join(__dirname, 'server.js');
  if (fs.existsSync(serverPath)) {
    const serverContent = fs.readFileSync(serverPath, 'utf8');
    
    if (serverContent.includes('require(\'./src/config/env\')')) {
      console.log('   ✅ Configuración personalizada cargada');
    } else {
      console.log('   ❌ Configuración personalizada NO cargada');
    }
    
    if (serverContent.includes('dotenv')) {
      console.log('   ✅ dotenv cargado');
    } else {
      console.log('   ❌ dotenv NO cargado');
    }
  } else {
    console.log('   ❌ server.js no encontrado');
  }
} catch (error) {
  console.log('   ❌ Error verificando servidor:', error.message);
}

// 4. Recomendaciones
console.log('\n4️⃣ RECOMENDACIONES:');
console.log('   💡 Para dominios corporativos, usar SMTP directo');
console.log('   💡 Verificar que la verificación en 2 pasos esté activada');
console.log('   💡 Usar contraseña de aplicación, NO contraseña normal');
console.log('   💡 Reiniciar servidor después de cambiar config.env');

console.log('\n🔍 Diagnóstico completado');
