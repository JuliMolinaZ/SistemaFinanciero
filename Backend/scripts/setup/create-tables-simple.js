#!/usr/bin/env node

const { PrismaClient } = require('@prisma/client');

console.log('🔧 Creando tablas de seguridad (método simplificado)...\n');

async function createTablesSimple() {
  const prisma = new PrismaClient();
  
  try {
    console.log('📋 1. Conectando a la base de datos...');
    await prisma.$connect();
    console.log('✅ Conexión exitosa!');
    
    console.log('\n📋 2. Creando tablas de seguridad...');
    
    const tables = [
      {
        name: 'audit_logs',
        sql: `
          CREATE TABLE IF NOT EXISTS audit_logs (
            id int NOT NULL AUTO_INCREMENT,
            user_id int DEFAULT NULL,
            user_email varchar(255) DEFAULT NULL,
            action varchar(100) NOT NULL,
            table_name varchar(100) DEFAULT NULL,
            record_id int DEFAULT NULL,
            old_data json DEFAULT NULL,
            new_data json DEFAULT NULL,
            ip_address varchar(45) DEFAULT NULL,
            user_agent text,
            details json DEFAULT NULL,
            created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (id),
            KEY idx_audit_user_id (user_id),
            KEY idx_audit_action (action),
            KEY idx_audit_created_at (created_at)
          ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        `
      },
      {
        name: 'jwt_tokens',
        sql: `
          CREATE TABLE IF NOT EXISTS jwt_tokens (
            id int NOT NULL AUTO_INCREMENT,
            user_id int NOT NULL,
            token_hash varchar(255) NOT NULL,
            expires_at timestamp NOT NULL,
            is_revoked tinyint(1) NOT NULL DEFAULT 0,
            created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (id),
            KEY idx_jwt_user_id (user_id),
            KEY idx_jwt_token_hash (token_hash),
            KEY idx_jwt_expires_at (expires_at)
          ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        `
      },
      {
        name: 'security_config',
        sql: `
          CREATE TABLE IF NOT EXISTS security_config (
            id int NOT NULL AUTO_INCREMENT,
            config_key varchar(100) NOT NULL,
            config_value text,
            description text,
            updated_by varchar(255) DEFAULT NULL,
            updated_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            PRIMARY KEY (id),
            UNIQUE KEY uk_config_key (config_key)
          ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        `
      },
      {
        name: 'security_logs',
        sql: `
          CREATE TABLE IF NOT EXISTS security_logs (
            id int NOT NULL AUTO_INCREMENT,
            event_type varchar(100) NOT NULL,
            severity varchar(20) NOT NULL DEFAULT 'MEDIUM',
            user_id int DEFAULT NULL,
            ip_address varchar(45) DEFAULT NULL,
            user_agent text,
            details json DEFAULT NULL,
            created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (id),
            KEY idx_security_event_type (event_type),
            KEY idx_security_severity (severity),
            KEY idx_security_created_at (created_at)
          ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        `
      }
    ];
    
    for (const table of tables) {
      try {
        console.log(`   📋 Creando tabla: ${table.name}`);
        await prisma.$executeRawUnsafe(table.sql);
        console.log(`   ✅ Tabla ${table.name} creada exitosamente`);
      } catch (error) {
        console.log(`   ❌ Error creando ${table.name}: ${error.message}`);
      }
    }
    
    console.log('\n📋 3. Insertando configuración de seguridad...');
    
    try {
      const configSQL = `
        INSERT IGNORE INTO security_config (config_key, config_value, description) VALUES
        ('max_login_attempts', '5', 'Máximo número de intentos de login fallidos'),
        ('lockout_duration_minutes', '30', 'Duración del bloqueo en minutos'),
        ('session_timeout_minutes', '1440', 'Timeout de sesión en minutos (24 horas)'),
        ('jwt_expiration_hours', '24', 'Expiración de JWT en horas'),
        ('audit_log_retention_days', '90', 'Días de retención de logs de auditoría'),
        ('rate_limit_requests_per_minute', '100', 'Límite de requests por minuto')
      `;
      
      await prisma.$executeRawUnsafe(configSQL);
      console.log('   ✅ Configuración de seguridad insertada');
    } catch (error) {
      console.log(`   ❌ Error insertando configuración: ${error.message}`);
    }
    
    console.log('\n📋 4. Verificando tablas creadas...');
    
    for (const table of tables) {
      try {
        const result = await prisma.$queryRawUnsafe(`SHOW TABLES LIKE '${table.name}'`);
        if (result.length > 0) {
          console.log(`   ✅ Tabla ${table.name} existe`);
        } else {
          console.log(`   ❌ Tabla ${table.name} NO existe`);
        }
      } catch (error) {
        console.log(`   ❌ Error verificando ${table.name}: ${error.message}`);
      }
    }
    
    console.log('\n🎉 ¡Proceso completado!');
    console.log('\n📋 Próximos pasos:');
    console.log('   1. Ejecutar: npx prisma generate');
    console.log('   2. Probar las nuevas funcionalidades');
    console.log('   3. Configurar las rutas de seguridad');
    
  } catch (error) {
    console.error('❌ Error durante la creación de tablas:', error);
    
  } finally {
    await prisma.$disconnect();
    console.log('\n🔌 Conexión cerrada');
  }
}

// Ejecutar script
createTablesSimple(); 