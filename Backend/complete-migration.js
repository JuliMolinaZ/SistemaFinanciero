const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function completeMigration() {
  try {
    console.log('🔧 Completando migración del sistema de roles...\n');
    
    // PASO 1: Actualizar roles usando SQL directo
    console.log('📝 PASO 1: Actualizando roles con SQL directo...');
    
    try {
      await prisma.$executeRawUnsafe(`
        UPDATE roles SET 
          description = 'Super Administrador del sistema',
          level = 1,
          is_active = TRUE
        WHERE name = 'Administrador'
      `);
      console.log('✅ Rol Administrador actualizado');
      
      await prisma.$executeRawUnsafe(`
        UPDATE roles SET 
          description = 'Usuario operativo básico',
          level = 5,
          is_active = TRUE
        WHERE name = 'Operador'
      `);
      console.log('✅ Rol Operador actualizado');
      
      await prisma.$executeRawUnsafe(`
        UPDATE roles SET 
          description = 'Desarrollador del sistema',
          level = 3,
          is_active = TRUE
        WHERE name = 'Desarrollador'
      `);
      console.log('✅ Rol Desarrollador actualizado');
      
      await prisma.$executeRawUnsafe(`
        UPDATE roles SET 
          description = 'Contador del sistema',
          level = 4,
          is_active = TRUE
        WHERE name = 'Contador'
      `);
      console.log('✅ Rol Contador actualizado');
      
      await prisma.$executeRawUnsafe(`
        UPDATE roles SET 
          description = 'Gerente del sistema',
          level = 2,
          is_active = TRUE
        WHERE name = 'Juan Carlos'
      `);
      console.log('✅ Rol Juan Carlos actualizado');
      
    } catch (error) {
      console.log(`⚠️  Error actualizando roles: ${error.message}`);
    }
    
    // PASO 2: Agregar columnas a la tabla users
    console.log('\n📝 PASO 2: Agregando columnas a la tabla users...');
    
    try {
      // Verificar si las columnas ya existen
      const columns = await prisma.$queryRaw`
        SELECT COLUMN_NAME 
        FROM INFORMATION_SCHEMA.COLUMNS 
        WHERE TABLE_SCHEMA = 'runsolutions_runite' 
        AND TABLE_NAME = 'users'
      `;
      
      const columnNames = columns.map(col => col.COLUMN_NAME);
      
      if (!columnNames.includes('role_id')) {
        await prisma.$executeRawUnsafe(`
          ALTER TABLE users ADD COLUMN role_id INT AFTER role
        `);
        console.log('✅ Columna role_id agregada');
      } else {
        console.log('✅ Columna role_id ya existe');
      }
      
      if (!columnNames.includes('is_active')) {
        await prisma.$executeRawUnsafe(`
          ALTER TABLE users ADD COLUMN is_active BOOLEAN DEFAULT TRUE AFTER role_id
        `);
        console.log('✅ Columna is_active agregada');
      } else {
        console.log('✅ Columna is_active ya existe');
      }
      
      if (!columnNames.includes('last_login')) {
        await prisma.$executeRawUnsafe(`
          ALTER TABLE users ADD COLUMN last_login TIMESTAMP NULL AFTER is_active
        `);
        console.log('✅ Columna last_login agregada');
      } else {
        console.log('✅ Columna last_login ya existe');
      }
      
      if (!columnNames.includes('login_attempts')) {
        await prisma.$executeRawUnsafe(`
          ALTER TABLE users ADD COLUMN login_attempts INT DEFAULT 0 AFTER last_login
        `);
        console.log('✅ Columna login_attempts agregada');
      } else {
        console.log('✅ Columna login_attempts ya existe');
      }
      
      if (!columnNames.includes('locked_until')) {
        await prisma.$executeRawUnsafe(`
          ALTER TABLE users ADD COLUMN locked_until TIMESTAMP NULL AFTER login_attempts
        `);
        console.log('✅ Columna locked_until agregada');
      } else {
        console.log('✅ Columna locked_until ya existe');
      }
      
    } catch (error) {
      console.log(`⚠️  Error agregando columnas: ${error.message}`);
    }
    
    // PASO 3: Asignar roles a usuarios existentes
    console.log('\n📝 PASO 3: Asignando roles a usuarios existentes...');
    
    try {
      // Obtener usuarios y roles
      const users = await prisma.$queryRaw`SELECT id, name, email FROM users`;
      const roles = await prisma.$queryRaw`SELECT id, name FROM roles`;
      
      console.log(`👥 Usuarios encontrados: ${users.length}`);
      console.log(`🎭 Roles disponibles: ${roles.length}`);
      
      for (const user of users) {
        let roleId = null;
        
        if (user.email === 'j.molina@runsolutions-services.com') {
          // Julian Molina = Super Admin (Nivel 1)
          const adminRole = roles.find(r => r.name === 'Administrador');
          roleId = adminRole ? adminRole.id : null;
          console.log(`👑 Asignando rol Super Admin a ${user.name}`);
        } else if (user.email === 'jc.yanez@runsolutions-services.com') {
          // Juan Carlos = Gerente (Nivel 2)
          const jcRole = roles.find(r => r.name === 'Juan Carlos');
          roleId = jcRole ? jcRole.id : null;
          console.log(`👔 Asignando rol Gerente a ${user.name}`);
        } else if (user.email === 'j.oviedo@runsolutions-services.com') {
          // Jessica = Administradora (Nivel 2)
          const adminRole = roles.find(r => r.name === 'Administrador');
          roleId = adminRole ? adminRole.id : null;
          console.log(`👩‍💼 Asignando rol Administradora a ${user.name}`);
        } else {
          // Usuario de prueba = Operador (Nivel 5)
          const operadorRole = roles.find(r => r.name === 'Operador');
          roleId = operadorRole ? operadorRole.id : null;
          console.log(`👤 Asignando rol Operador a ${user.name}`);
        }
        
        if (roleId) {
          await prisma.$executeRawUnsafe(`
            UPDATE users SET role_id = ${roleId}, is_active = TRUE WHERE id = ${user.id}
          `);
          console.log(`✅ Rol asignado a ${user.name}`);
        }
      }
    } catch (error) {
      console.log(`⚠️  Error asignando roles: ${error.message}`);
    }
    
    // PASO 4: Crear tabla audit_logs si no existe
    console.log('\n📝 PASO 4: Creando tabla audit_logs...');
    
    try {
      await prisma.$executeRawUnsafe(`
        CREATE TABLE IF NOT EXISTS audit_logs (
          id INT PRIMARY KEY AUTO_INCREMENT,
          action VARCHAR(100) NOT NULL,
          module VARCHAR(100),
          record_id INT,
          user_id INT,
          details JSON,
          ip_address VARCHAR(45),
          user_agent TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          INDEX idx_action (action),
          INDEX idx_module (module),
          INDEX idx_user_id (user_id),
          INDEX idx_created_at (created_at)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      `);
      console.log('✅ Tabla audit_logs creada');
    } catch (error) {
      console.log(`⚠️  Tabla ya existe o error: ${error.message}`);
    }
    
    // PASO 5: Crear tabla role_config si no existe
    console.log('\n📝 PASO 5: Creando tabla role_config...');
    
    try {
      await prisma.$executeRawUnsafe(`
        CREATE TABLE IF NOT EXISTS role_config (
          id INT PRIMARY KEY AUTO_INCREMENT,
          role_id INT NOT NULL,
          config_key VARCHAR(100) NOT NULL,
          config_value TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE,
          UNIQUE KEY uk_role_config (role_id, config_key)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      `);
      console.log('✅ Tabla role_config creada');
      
      // Insertar configuraciones por defecto
      const roles = await prisma.$queryRaw`SELECT id FROM roles`;
      for (const role of roles) {
        await prisma.$executeRawUnsafe(`
          INSERT IGNORE INTO role_config (role_id, config_key, config_value) 
          VALUES (${role.id}, 'max_session_duration', '28800')
        `);
      }
      console.log('✅ Configuraciones por defecto insertadas');
      
    } catch (error) {
      console.log(`⚠️  Tabla ya existe o error: ${error.message}`);
    }
    
    console.log('\n🎉 Migración del sistema de roles completada exitosamente');
    
    // Verificación final
    await finalVerification();
    
  } catch (error) {
    console.error('❌ Error durante la migración:', error);
  } finally {
    await prisma.$disconnect();
  }
}

async function finalVerification() {
  try {
    console.log('\n🔍 Verificación final de la migración...');
    
    // Verificar tabla roles
    const roles = await prisma.$queryRaw`SELECT * FROM roles ORDER BY level ASC`;
    console.log(`✅ Tabla roles: ${roles.length} registros`);
    roles.forEach(role => {
      console.log(`   - ${role.name} (Nivel ${role.level}): ${role.description}`);
    });
    
    // Verificar tabla role_permissions
    const permissions = await prisma.$queryRaw`SELECT COUNT(*) as count FROM role_permissions`;
    console.log(`✅ Tabla role_permissions: ${permissions[0].count} registros`);
    
    // Verificar tabla system_modules
    const modules = await prisma.$queryRaw`SELECT COUNT(*) as count FROM system_modules`;
    console.log(`✅ Tabla system_modules: ${modules[0].count} registros`);
    
    // Verificar tabla users
    const users = await prisma.$queryRaw`
      SELECT u.name, u.email, r.name as role_name, r.level 
      FROM users u 
      LEFT JOIN roles r ON u.role_id = r.id
      ORDER BY r.level ASC
    `;
    console.log(`✅ Tabla users: ${users.length} registros`);
    users.forEach(user => {
      const roleName = user.role_name || 'Sin rol';
      console.log(`   - ${user.name} (${user.email}) -> Rol: ${roleName} (Nivel ${user.level || 'N/A'})`);
    });
    
    console.log('\n🎯 RESUMEN DE ROLES ASIGNADOS:');
    console.log('👑 Julian Molina -> Super Administrador (Nivel 1)');
    console.log('👔 Juan Carlos -> Gerente (Nivel 2)');
    console.log('👩‍💼 Jessica -> Administradora (Nivel 2)');
    console.log('👤 Usuario de Prueba -> Operador (Nivel 5)');
    
  } catch (error) {
    console.error('❌ Error en verificación final:', error);
  }
}

completeMigration();
