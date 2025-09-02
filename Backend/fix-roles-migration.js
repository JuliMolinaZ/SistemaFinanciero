const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function fixRolesMigration() {
  try {
    console.log('🔧 Corrigiendo migración del sistema de roles...\n');
    
    // PASO 1: Agregar columnas faltantes a la tabla roles
    console.log('📝 PASO 1: Agregando columnas a la tabla roles...');
    
    try {
      await prisma.$executeRawUnsafe(`
        ALTER TABLE roles 
        ADD COLUMN description TEXT AFTER name,
        ADD COLUMN level INT DEFAULT 5 AFTER description,
        ADD COLUMN is_active BOOLEAN DEFAULT TRUE AFTER level,
        ADD COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP AFTER is_active,
        ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP AFTER created_at
      `);
      console.log('✅ Columnas agregadas a la tabla roles');
    } catch (error) {
      console.log(`⚠️  Columnas ya existen o error: ${error.message}`);
    }
    
    // PASO 2: Actualizar roles existentes con información
    console.log('\n📝 PASO 2: Actualizando roles existentes...');
    
    const roleUpdates = [
      { id: 1, name: 'Administrador', description: 'Super Administrador del sistema', level: 1, is_active: true },
      { id: 2, name: 'Operador', description: 'Usuario operativo básico', level: 5, is_active: true },
      { id: 3, name: 'Desarrollador', description: 'Desarrollador del sistema', level: 3, is_active: true },
      { id: 4, name: 'Contador', description: 'Contador del sistema', level: 4, is_active: true },
      { id: 5, name: 'Juan Carlos', description: 'Gerente del sistema', level: 2, is_active: true }
    ];
    
    for (const roleUpdate of roleUpdates) {
      try {
        await prisma.roles.update({
          where: { id: roleUpdate.id },
          data: {
            description: roleUpdate.description,
            level: roleUpdate.level,
            is_active: roleUpdate.is_active
          }
        });
        console.log(`✅ Rol ${roleUpdate.name} actualizado`);
      } catch (error) {
        console.log(`⚠️  Error actualizando rol ${roleUpdate.name}: ${error.message}`);
      }
    }
    
    // PASO 3: Crear tabla system_modules
    console.log('\n📝 PASO 3: Creando tabla system_modules...');
    
    try {
      await prisma.$executeRawUnsafe(`
        CREATE TABLE IF NOT EXISTS system_modules (
          id INT PRIMARY KEY AUTO_INCREMENT,
          name VARCHAR(100) NOT NULL UNIQUE,
          display_name VARCHAR(150) NOT NULL,
          description TEXT,
          route VARCHAR(100),
          requires_approval BOOLEAN DEFAULT FALSE,
          is_active BOOLEAN DEFAULT TRUE,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      `);
      console.log('✅ Tabla system_modules creada');
    } catch (error) {
      console.log(`⚠️  Tabla ya existe o error: ${error.message}`);
    }
    
    // PASO 4: Insertar módulos del sistema
    console.log('\n📝 PASO 4: Insertando módulos del sistema...');
    
    const modules = [
      { name: 'usuarios', display_name: 'Gestión de Usuarios', description: 'Administración de usuarios y roles', route: '/usuarios' },
      { name: 'clientes', display_name: 'Gestión de Clientes', description: 'Administración de clientes', route: '/clientes' },
      { name: 'proyectos', display_name: 'Gestión de Proyectos', description: 'Administración de proyectos', route: '/proyectos' },
      { name: 'contabilidad', display_name: 'Contabilidad', description: 'Módulo de contabilidad', route: '/contabilidad' },
      { name: 'costos_fijos', display_name: 'Costos Fijos', description: 'Administración de costos fijos', route: '/costos-fijos' },
      { name: 'cotizaciones', display_name: 'Cotizaciones', description: 'Gestión de cotizaciones', route: '/cotizaciones' },
      { name: 'cuentas_por_cobrar', display_name: 'Cuentas por Cobrar', description: 'Gestión de cuentas por cobrar', route: '/cuentas-cobrar' },
      { name: 'cuentas_por_pagar', display_name: 'Cuentas por Pagar', description: 'Gestión de cuentas por pagar', route: '/cuentas-pagar' },
      { name: 'proveedores', display_name: 'Proveedores', description: 'Gestión de proveedores', route: '/proveedores' },
      { name: 'categorias', display_name: 'Categorías', description: 'Gestión de categorías', route: '/categorias' },
      { name: 'fases', display_name: 'Fases de Proyectos', description: 'Gestión de fases', route: '/fases' },
      { name: 'recuperacion', display_name: 'Recuperación', description: 'Módulo de recuperación', route: '/recuperacion' },
      { name: 'flow_recovery_v2', display_name: 'Flow Recovery V2', description: 'Sistema de recuperación avanzado', route: '/flow-recovery' },

      { name: 'emitidas', display_name: 'Facturas Emitidas', description: 'Gestión de facturas emitidas', route: '/emitidas' },
      { name: 'permisos', display_name: 'Permisos del Sistema', description: 'Gestión de permisos', route: '/permisos' },

      { name: 'reportes', display_name: 'Reportes', description: 'Generación de reportes', route: '/reportes' },
      { name: 'auditoria', display_name: 'Auditoría', description: 'Logs de auditoría', route: '/auditoria' }
    ];
    
    for (const module of modules) {
      try {
        await prisma.$executeRawUnsafe(`
          INSERT IGNORE INTO system_modules (name, display_name, description, route) 
          VALUES ('${module.name}', '${module.display_name}', '${module.description}', '${module.route}')
        `);
        console.log(`✅ Módulo ${module.display_name} insertado`);
      } catch (error) {
        console.log(`⚠️  Error insertando módulo ${module.display_name}: ${error.message}`);
      }
    }
    
    // PASO 5: Crear tabla role_permissions
    console.log('\n📝 PASO 5: Creando tabla role_permissions...');
    
    try {
      await prisma.$executeRawUnsafe(`
        CREATE TABLE IF NOT EXISTS role_permissions (
          id INT PRIMARY KEY AUTO_INCREMENT,
          role_id INT NOT NULL,
          module VARCHAR(100) NOT NULL,
          can_read BOOLEAN DEFAULT FALSE,
          can_create BOOLEAN DEFAULT FALSE,
          can_update BOOLEAN DEFAULT FALSE,
          can_delete BOOLEAN DEFAULT FALSE,
          can_export BOOLEAN DEFAULT FALSE,
          can_approve BOOLEAN DEFAULT FALSE,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE,
          UNIQUE KEY uk_role_module (role_id, module)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      `);
      console.log('✅ Tabla role_permissions creada');
    } catch (error) {
      console.log(`⚠️  Tabla ya existe o error: ${error.message}`);
    }
    
    // PASO 6: Asignar permisos por defecto
    console.log('\n📝 PASO 6: Asignando permisos por defecto...');
    
    try {
      const roles = await prisma.roles.findMany();
      const modulesData = await prisma.$queryRaw`SELECT name FROM system_modules`;
      
      for (const role of roles) {
        for (const module of modulesData) {
          let permissions = {
            can_read: false,
            can_create: false,
            can_update: false,
            can_delete: false,
            can_export: false,
            can_approve: false
          };
          
          // Configurar permisos según el nivel del rol
          if (role.level === 1) { // Super Admin
            permissions = {
              can_read: true, can_create: true, can_update: true,
              can_delete: true, can_export: true, can_approve: true
            };
          } else if (role.level === 2) { // Admin/Gerente
            permissions = {
              can_read: true, can_create: true, can_update: true,
              can_delete: false, can_export: true, can_approve: true
            };
          } else if (role.level === 3) { // Desarrollador
            permissions = {
              can_read: true, can_create: true, can_update: true,
              can_delete: false, can_export: true, can_approve: false
            };
          } else if (role.level === 4) { // Contador
            permissions = {
              can_read: true, can_create: false, can_update: false,
              can_delete: false, can_export: true, can_approve: false
            };
          } else { // Operador
            permissions = {
              can_read: true, can_create: false, can_update: false,
              can_delete: false, can_export: false, can_approve: false
            };
          }
          
          try {
            await prisma.$executeRawUnsafe(`
              INSERT IGNORE INTO role_permissions 
              (role_id, module, can_read, can_create, can_update, can_delete, can_export, can_approve)
              VALUES (${role.id}, '${module.name}', ${permissions.can_read}, ${permissions.can_create}, 
                     ${permissions.can_update}, ${permissions.can_delete}, ${permissions.can_export}, ${permissions.can_approve})
            `);
          } catch (error) {
            console.log(`⚠️  Error insertando permisos para ${role.name} en ${module.name}: ${error.message}`);
          }
        }
        console.log(`✅ Permisos asignados para rol ${role.name}`);
      }
    } catch (error) {
      console.log(`⚠️  Error asignando permisos: ${error.message}`);
    }
    
    // PASO 7: Agregar role_id a la tabla users si no existe
    console.log('\n📝 PASO 7: Verificando estructura de la tabla users...');
    
    try {
      await prisma.$executeRawUnsafe(`
        ALTER TABLE users 
        ADD COLUMN IF NOT EXISTS role_id INT AFTER role,
        ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE AFTER role_id,
        ADD COLUMN IF NOT EXISTS last_login TIMESTAMP NULL AFTER is_active,
        ADD COLUMN IF NOT EXISTS login_attempts INT DEFAULT 0 AFTER last_login,
        ADD COLUMN IF NOT EXISTS locked_until TIMESTAMP NULL AFTER login_attempts
      `);
      console.log('✅ Estructura de tabla users verificada');
    } catch (error) {
      console.log(`⚠️  Error verificando estructura de users: ${error.message}`);
    }
    
    // PASO 8: Asignar roles a usuarios existentes
    console.log('\n📝 PASO 8: Asignando roles a usuarios existentes...');
    
    try {
      const users = await prisma.users.findMany();
      const roles = await prisma.roles.findMany();
      
      for (const user of users) {
        let roleId = null;
        
        if (user.email === 'j.molina@runsolutions-services.com') {
          // Julian Molina = Super Admin (Nivel 1)
          roleId = roles.find(r => r.name === 'Administrador')?.id;
          console.log(`👑 Asignando rol Super Admin a ${user.name}`);
        } else if (user.email === 'jc.yanez@runsolutions-services.com') {
          // Juan Carlos = Gerente (Nivel 2)
          roleId = roles.find(r => r.name === 'Juan Carlos')?.id;
          console.log(`👔 Asignando rol Gerente a ${user.name}`);
        } else if (user.email === 'j.oviedo@runsolutions-services.com') {
          // Jessica = Administradora (Nivel 2)
          roleId = roles.find(r => r.name === 'Administrador')?.id;
          console.log(`👩‍💼 Asignando rol Administradora a ${user.name}`);
        } else {
          // Usuario de prueba = Operador (Nivel 5)
          roleId = roles.find(r => r.name === 'Operador')?.id;
          console.log(`👤 Asignando rol Operador a ${user.name}`);
        }
        
        if (roleId) {
          await prisma.users.update({
            where: { id: user.id },
            data: { 
              role_id: roleId,
              is_active: true
            }
          });
          console.log(`✅ Rol asignado a ${user.name}`);
        }
      }
    } catch (error) {
      console.log(`⚠️  Error asignando roles: ${error.message}`);
    }
    
    console.log('\n🎉 Migración del sistema de roles completada y corregida');
    
  } catch (error) {
    console.error('❌ Error durante la migración:', error);
  } finally {
    await prisma.$disconnect();
  }
}

fixRolesMigration();
