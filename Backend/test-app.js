#!/usr/bin/env node

console.log('🧪 Probando solo la aplicación (sin servidor)...\n');

try {
  console.log('📋 Importando la aplicación...');
  const app = require('./src/app');
  console.log('✅ Aplicación importada exitosamente');
  
  console.log('\n📋 Verificando que app sea una función...');
  if (typeof app === 'function') {
    console.log('✅ app es una función válida');
  } else {
    console.log('❌ app no es una función');
  }
  
  console.log('\n🎉 ¡La aplicación se carga correctamente!');
  
} catch (error) {
  console.error('❌ Error cargando la aplicación:', error.message);
  console.error('Stack:', error.stack);
} 