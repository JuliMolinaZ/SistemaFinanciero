#!/usr/bin/env node

// =====================================================
// SCRIPT DE CONFIGURACIÓN MANUAL DE PRISMA
// =====================================================

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

// Colores para la consola
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

const log = (message, color = 'reset') => {
  console.log(`${colors[color]}${message}${colors.reset}`);
};

const logSuccess = (message) => log(`✅ ${message}`, 'green');
const logError = (message) => log(`❌ ${message}`, 'red');
const logWarning = (message) => log(`⚠️  ${message}`, 'yellow');
const logInfo = (message) => log(`ℹ️  ${message}`, 'blue');
const logStep = (message) => log(`\n🔧 ${message}`, 'cyan');

// Función para ejecutar comandos
const runCommand = (command, description) => {
  try {
    logStep(description);
    execSync(command, { stdio: 'inherit', cwd: __dirname });
    logSuccess(`Comando ejecutado: ${command}`);
    return true;
  } catch (error) {
    logError(`Error ejecutando: ${command}`);
    logError(error.message);
    return false;
  }
};

// Función para verificar si existe un archivo
const fileExists = (filePath) => {
  return fs.existsSync(path.join(__dirname, filePath));
};

// Función principal
const main = async () => {
  log('🚀 INICIANDO CONFIGURACIÓN MANUAL DE PRISMA', 'bright');
  log('====================================================', 'bright');
  
  // Verificar archivos necesarios
  logStep('Verificando archivos necesarios...');
  
  if (!fileExists('prisma/schema.prisma')) {
    logError('No se encontró el archivo schema.prisma');
    logInfo('Asegúrate de estar en el directorio Backend/');
    return;
  }
  
  if (!fileExists('config.env')) {
    logError('No se encontró el archivo config.env');
    logInfo('Crea el archivo config.env con tu configuración de base de datos');
    return;
  }
  
  logSuccess('Archivos necesarios encontrados');
  
  // Paso 1: Instalar dependencias si no están instaladas
  if (!fileExists('node_modules')) {
    logStep('Instalando dependencias...');
    if (!runCommand('npm install', 'Instalando dependencias de npm')) {
      return;
    }
  } else {
    logSuccess('Dependencias ya instaladas');
  }
  
  // Paso 2: Generar cliente de Prisma
  logStep('Generando cliente de Prisma...');
  if (!runCommand('npx prisma generate', 'Generando cliente de Prisma')) {
    return;
  }
  
  // Paso 3: Verificar conexión a la base de datos
  logStep('Verificando conexión a la base de datos...');
  if (!runCommand('npx prisma db pull', 'Verificando conexión y sincronizando schema')) {
    logWarning('No se pudo conectar a la base de datos');
    logInfo('Verifica tu configuración en config.env');
    logInfo('Asegúrate de que MySQL esté corriendo y la base de datos exista');
    return;
  }
  
  // Paso 4: Crear las tablas si no existen
  logStep('Creando tablas en la base de datos...');
  if (!runCommand('npx prisma db push', 'Creando/actualizando tablas en la base de datos')) {
    logWarning('No se pudieron crear las tablas');
    logInfo('Verifica que tengas permisos de escritura en la base de datos');
    return;
  }
  
  // Paso 5: Insertar datos iniciales
  if (fileExists('prisma/seed.js')) {
    logStep('Insertando datos iniciales...');
    if (!runCommand('npx prisma db seed', 'Insertando datos iniciales')) {
      logWarning('No se pudieron insertar los datos iniciales');
      logInfo('Puedes ejecutar el seed manualmente más tarde');
    }
  }
  
  // Paso 6: Verificar que todo funcione
  logStep('Verificando instalación...');
  try {
    const { PrismaClient } = require('./src/config/database');
    const prisma = new PrismaClient();
    
    // Probar conexión
    await prisma.$connect();
    logSuccess('Conexión a la base de datos exitosa');
    
    // Probar consultas básicas
    const userCount = await prisma.user.count();
    const rolesCount = await prisma.roles.count();
    const permisosCount = await prisma.permisos.count();
    
    logSuccess(`Usuarios en la base de datos: ${userCount}`);
    logSuccess(`Roles en la base de datos: ${rolesCount}`);
    logSuccess(`Permisos en la base de datos: ${permisosCount}`);
    
    await prisma.$disconnect();
    
  } catch (error) {
    logError('Error verificando la instalación');
    logError(error.message);
    return;
  }
  
  log('\n🎉 ¡CONFIGURACIÓN COMPLETADA EXITOSAMENTE!', 'bright');
  log('====================================================', 'bright');
  logSuccess('Prisma está configurado y funcionando');
  logSuccess('Tu base de datos está sincronizada');
  logSuccess('Puedes iniciar tu servidor con: npm start');
  
  log('\n📋 PRÓXIMOS PASOS:', 'bright');
  logInfo('1. Inicia tu servidor: npm start');
  logInfo('2. Prueba la API en: http://localhost:8765/api/test-db');
  logInfo('3. Verifica los usuarios en: http://localhost:8765/api/usuarios');
  logInfo('4. Verifica los roles en: http://localhost:8765/api/roles');
  logInfo('5. Verifica los permisos en: http://localhost:8765/api/permisos');
  
  log('\n🔧 COMANDOS ÚTILES:', 'bright');
  logInfo('npx prisma studio - Abrir interfaz visual de la base de datos');
  logInfo('npx prisma db pull - Sincronizar schema desde la base de datos');
  logInfo('npx prisma db push - Aplicar cambios del schema a la base de datos');
  logInfo('npx prisma generate - Regenerar cliente de Prisma');
  logInfo('npx prisma migrate dev - Crear y aplicar migraciones');
};

// Ejecutar script
main().catch(error => {
  logError('Error inesperado:');
  logError(error.message);
  process.exit(1);
}); 