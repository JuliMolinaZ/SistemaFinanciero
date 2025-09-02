#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔧 SCRIPTS DE CONFIGURACIÓN DEL SISTEMA FINANCIERO\n');

const scripts = {
  'setup-prisma': 'Configurar Prisma y generar cliente',
  'create-security-tables': 'Crear tablas de seguridad',
  'create-tables-simple': 'Crear tablas de seguridad (método simplificado)',
  'test-connection': 'Probar conexión a la base de datos',
  'test-prisma': 'Probar funcionalidad de Prisma',
  'test-security': 'Probar funcionalidades de seguridad'
};

function showMenu() {
  console.log('📋 Scripts disponibles:\n');
  
  Object.entries(scripts).forEach(([script, description], index) => {
    console.log(`${index + 1}. ${script} - ${description}`);
  });
  
  console.log('\n0. Salir');
  console.log('\n💡 Uso: node scripts/setup/index.js <número>');
}

function runScript(scriptName) {
  const scriptPath = path.join(__dirname, `${scriptName}.js`);
  
  if (!fs.existsSync(scriptPath)) {
    console.error(`❌ Script no encontrado: ${scriptPath}`);
    return;
  }
  
  console.log(`🚀 Ejecutando: ${scriptName}\n`);
  
  try {
    execSync(`node ${scriptPath}`, { 
      stdio: 'inherit',
      cwd: path.join(__dirname, '..', '..')
    });
  } catch (error) {
    console.error(`❌ Error ejecutando ${scriptName}:`, error.message);
  }
}

// Obtener argumento de línea de comandos
const scriptNumber = process.argv[2];

if (scriptNumber) {
  const scriptNames = Object.keys(scripts);
  const index = parseInt(scriptNumber) - 1;
  
  if (index >= 0 && index < scriptNames.length) {
    runScript(scriptNames[index]);
  } else if (scriptNumber === '0') {
    console.log('👋 ¡Hasta luego!');
  } else {
    console.error('❌ Número de script inválido');
    showMenu();
  }
} else {
  showMenu();
} 