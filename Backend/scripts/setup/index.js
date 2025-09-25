#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const scripts = {
  'setup-prisma': 'Configurar Prisma y generar cliente',
  'create-security-tables': 'Crear tablas de seguridad',
  'create-tables-simple': 'Crear tablas de seguridad (método simplificado)',
  'test-connection': 'Probar conexión a la base de datos',
  'test-prisma': 'Probar funcionalidad de Prisma',
  'test-security': 'Probar funcionalidades de seguridad'
};

function showMenu() {

  Object.entries(scripts).forEach(([script, description], index) => {

  });

}

function runScript(scriptName) {
  const scriptPath = path.join(__dirname, `${scriptName}.js`);
  
  if (!fs.existsSync(scriptPath)) {
    console.error(`❌ Script no encontrado: ${scriptPath}`);
    return;
  }

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

  } else {
    console.error('❌ Número de script inválido');
    showMenu();
  }
} else {
  showMenu();
} 