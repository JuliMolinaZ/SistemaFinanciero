#!/usr/bin/env node

const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

async function createSecurityTables() {
  const prisma = new PrismaClient();
  
  try {

    await prisma.$connect();

    const sqlPath = path.join(__dirname, '..', 'sql', 'create-security-tables.sql');
    
    if (!fs.existsSync(sqlPath)) {
      throw new Error('Archivo SQL no encontrado: ' + sqlPath);
    }
    
    const sqlContent = fs.readFileSync(sqlPath, 'utf8');

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

        }
      } catch (error) {
        errorCount++;

        // Continuar con el siguiente comando
      }
    }

    if (errorCount === 0) {

    } else {

    }

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

        } else {

        }
      } catch (error) {

      }
    }

    try {
      const configCount = await prisma.securityConfig.count();

    } catch (error) {

    }

  } catch (error) {
    console.error('❌ Error durante la creación de tablas:', error);
    console.error('\n💡 Posibles soluciones:');
    console.error('   1. Verificar permisos de la base de datos');
    console.error('   2. Verificar que el usuario tenga permisos CREATE');
    console.error('   3. Ejecutar el script manualmente en PHPMyAdmin');
    
  } finally {
    await prisma.$disconnect();

  }
}

// Ejecutar script
createSecurityTables(); 