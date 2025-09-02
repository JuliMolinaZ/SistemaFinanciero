#!/usr/bin/env node

console.log('🧪 Probando el servidor...\n');

// Verificar dependencias
const requiredModules = [
  'express',
  'cors', 
  'helmet',
  'express-rate-limit',
  'compression',
  '@prisma/client'
];

console.log('📋 Verificando dependencias...');

for (const module of requiredModules) {
  try {
    require(module);
    console.log(`✅ ${module} - OK`);
  } catch (error) {
    console.log(`❌ ${module} - FALTANTE: ${error.message}`);
  }
}

console.log('\n📋 Verificando archivos de configuración...');

const fs = require('fs');
const path = require('path');

const requiredFiles = [
  'src/config/app.js',
  'src/config/database.js',
  'src/app.js',
  'src/server.js',
  '.env'
];

for (const file of requiredFiles) {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file} - EXISTE`);
  } else {
    console.log(`❌ ${file} - NO EXISTE`);
  }
}

console.log('\n📋 Verificando estructura de directorios...');

const requiredDirs = [
  'src/controllers',
  'src/routes',
  'src/middlewares',
  'src/services',
  'src/utils'
];

for (const dir of requiredDirs) {
  if (fs.existsSync(dir)) {
    const files = fs.readdirSync(dir).length;
    console.log(`✅ ${dir} - EXISTE (${files} archivos)`);
  } else {
    console.log(`❌ ${dir} - NO EXISTE`);
  }
}

console.log('\n🎯 Estado del servidor:');
console.log('   Si todos los archivos y dependencias están OK,');
console.log('   puedes ejecutar: npm run dev');
console.log('\n💡 Si hay dependencias faltantes, ejecuta: npm install'); 