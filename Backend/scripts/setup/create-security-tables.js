#!/usr/bin/env node

const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

console.log('🔧 Creando tablas de seguridad...\n');

async function createSecurityTables() {
  const prisma = new PrismaClient();
  
  try {
    console.log('📋 1. Conectando a la base de datos...');
    await prisma.$connect();
    console.log('✅ Conexión exitosa!');
    
    console.log('\n📋 2. Leyendo script SQL...');
    const sqlPath = path.join(__dirname, '..', 'sql', 'create-security-tables.sql');
    
    if (!fs.existsSync(sqlPath)) {
      throw new Error('Archivo SQL no encontrado: ' + sqlPath);
    }
    
    const sqlContent = fs.readFileSync(sqlPath, 'utf8');
    console.log('✅ Script SQL leído correctamente');
    
    console.log('\n📋 3. Ejecutando script SQL...');
    
    // Dividir el script en comandos individuales
    const commands = sqlContent
      .split(';')
      .map(cmd => cmd.trim())
      .filter(cmd => cmd.length > 0 && !cmd.startsWith('--'));
    
    let successCount = 0;
    let errorCount = 0;
    
    for (const command of commands) {
      try {
        if (command.trim()) {
          await prisma.$executeRawUnsafe(command);
          successCount++;
          console.log(`   ✅ Comando ejecutado: ${command.substring(0, 50)}...`);
        }
      } catch (error) {
        errorCount++;
        console.log(`   ❌ Error en comando: ${error.message}`);
        // Continuar con el siguiente comando
      }
    }
    
    console.log(`\n📊 Resumen de ejecución:`);
    console.log(`   ✅ Comandos exitosos: ${successCount}`);
    console.log(`   ❌ Comandos con error: ${errorCount}`);
    
    if (errorCount === 0) {
      console.log('\n🎉 ¡Todas las tablas de seguridad creadas exitosamente!');
    } else {
      console.log('\n⚠️  Algunos comandos tuvieron errores, pero el proceso continuó.');
    }
    
    console.log('\n📋 4. Verificando tablas creadas...');
    
    const securityTables = [
      'audit_logs',
      'jwt_tokens', 
      'user_sessions',
      'failed_login_attempts',
      'password_changes',
      'user_permissions',
      'security_logs',
      'security_config',
      'backup_metadata',
      'performance_indexes'
    ];
    
    for (const tableName of securityTables) {
      try {
        const result = await prisma.$queryRaw`SHOW TABLES LIKE ${tableName}`;
        if (result.length > 0) {
          console.log(`   ✅ Tabla ${tableName} existe`);
        } else {
          console.log(`   ❌ Tabla ${tableName} NO existe`);
        }
      } catch (error) {
        console.log(`   ❌ Error verificando ${tableName}: ${error.message}`);
      }
    }
    
    console.log('\n📋 5. Verificando configuración de seguridad...');
    
    try {
      const configCount = await prisma.securityConfig.count();
      console.log(`   ✅ Configuraciones de seguridad: ${configCount}`);
    } catch (error) {
      console.log(`   ❌ Error verificando configuración: ${error.message}`);
    }
    
    console.log('\n🎉 ¡Proceso completado!');
    console.log('\n📋 Próximos pasos:');
    console.log('   1. Ejecutar: npx prisma generate');
    console.log('   2. Probar las nuevas funcionalidades');
    console.log('   3. Configurar las rutas de seguridad');
    
  } catch (error) {
    console.error('❌ Error durante la creación de tablas:', error);
    console.error('\n💡 Posibles soluciones:');
    console.error('   1. Verificar permisos de la base de datos');
    console.error('   2. Verificar que el usuario tenga permisos CREATE');
    console.error('   3. Ejecutar el script manualmente en PHPMyAdmin');
    
  } finally {
    await prisma.$disconnect();
    console.log('\n🔌 Conexión cerrada');
  }
}

// Ejecutar script
createSecurityTables(); 