const { PrismaClient } = require('@prisma/client');
require('dotenv').config({ path: './config.env' });

const prisma = new PrismaClient();

async function createMissingTables() {
  try {
    console.log('🚀 Creando tablas faltantes del sistema de roles...\n');

    // =====================================================
    // 1. CREAR TABLA role_permissions
    // =====================================================
    console.log('📋 Creando tabla role_permissions...');
    
    try {
      await prisma.$executeRaw`
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
          UNIQUE KEY uk_role_module (role_id, module),
          
          INDEX idx_role_permissions_role (role_id),
          INDEX idx_role_permissions_module (module)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      `;
      console.log('✅ Tabla role_permissions creada exitosamente');
    } catch (error) {
      if (error.message.includes('already exists')) {
        console.log('✅ Tabla role_permissions ya existe');
      } else {
        console.log(`❌ Error creando role_permissions: ${error.message}`);
        throw error;
      }
    }

    // =====================================================
    // 2. CREAR TABLA system_modules
    // =====================================================
    console.log('\n📋 Creando tabla system_modules...');
    
    try {
      await prisma.$executeRaw`
        CREATE TABLE IF NOT EXISTS system_modules (
          id INT PRIMARY KEY AUTO_INCREMENT,
          name VARCHAR(100) NOT NULL UNIQUE,
          display_name VARCHAR(255) NOT NULL,
          description TEXT,
          icon VARCHAR(100),
          route VARCHAR(255),
          is_active BOOLEAN DEFAULT TRUE,
          requires_approval BOOLEAN DEFAULT FALSE,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          
          INDEX idx_modules_active (is_active),
          INDEX idx_modules_route (route)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      `;
      console.log('✅ Tabla system_modules creada exitosamente');
    } catch (error) {
      if (error.message.includes('already exists')) {
        console.log('✅ Tabla system_modules ya existe');
      } else {
        console.log(`❌ Error creando system_modules: ${error.message}`);
        throw error;
      }
    }

    // =====================================================
    // 3. INSERTAR MÓDULOS DEL SISTEMA
    // =====================================================
    console.log('\n📋 Insertando módulos del sistema...');
    
    const modules = [
      ['usuarios', 'Gestión de Usuarios', 'Administración de usuarios, roles y permisos', 'people', '/usuarios', true],
      ['clientes', 'Gestión de Clientes', 'Administración de clientes y contactos', 'business', '/clientes', false],
      ['proyectos', 'Gestión de Proyectos', 'Administración de proyectos y fases', 'work', '/proyectos', true],
      ['contabilidad', 'Contabilidad', 'Gestión contable y financiera', 'account_balance', '/contabilidad', true],
      ['costos_fijos', 'Costos Fijos', 'Administración de costos fijos', 'trending_up', '/costos-fijos', true],
      ['cotizaciones', 'Cotizaciones', 'Gestión de cotizaciones y presupuestos', 'description', '/cotizaciones', true],
      ['cuentas_por_cobrar', 'Cuentas por Cobrar', 'Gestión de cuentas por cobrar', 'account_balance_wallet', '/cuentas-cobrar', false],
      ['cuentas_por_pagar', 'Cuentas por Pagar', 'Gestión de cuentas por pagar', 'payment', '/cuentas-pagar', true],
      ['proveedores', 'Proveedores', 'Administración de proveedores', 'local_shipping', '/proveedores', false],
      ['categorias', 'Categorías', 'Administración de categorías', 'category', '/categorias', false],
      ['fases', 'Fases de Proyectos', 'Administración de fases de proyectos', 'timeline', '/fases', false],
      ['recuperacion', 'Recuperación', 'Gestión de recuperación de costos', 'restore', '/recuperacion', true],
      ['flow_recovery_v2', 'Flow Recovery V2', 'Sistema avanzado de recuperación', 'sync', '/flow-recovery', true],
      ['emitidas', 'Facturas Emitidas', 'Gestión de facturas emitidas', 'receipt', '/emitidas', true],
      ['permisos', 'Permisos del Sistema', 'Administración de permisos y accesos', 'security', '/permisos', true],
      ['reportes', 'Reportes', 'Generación y visualización de reportes', 'assessment', '/reportes', true],
      ['auditoria', 'Auditoría', 'Logs de auditoría del sistema', 'history', '/auditoria', true]
    ];

    for (const [name, displayName, description, icon, route, requiresApproval] of modules) {
      try {
        await prisma.$executeRaw`
          INSERT IGNORE INTO system_modules (name, display_name, description, icon, route, requires_approval)
          VALUES (?, ?, ?, ?, ?, ?)
        `, name, displayName, description, icon, route, requiresApproval ? 1 : 0;
      } catch (error) {
        if (error.message.includes('Duplicate entry')) {
          console.log(`   - Módulo ${name} ya existe`);
        } else {
          console.log(`   - Error insertando módulo ${name}: ${error.message}`);
        }
      }
    }
    console.log('✅ Módulos del sistema insertados');

    // =====================================================
    // 4. ACTUALIZAR ROLES EXISTENTES CON INFORMACIÓN MEJORADA
    // =====================================================
    console.log('\n📋 Actualizando roles existentes...');
    
    try {
      // Actualizar Super Administrador
      await prisma.$executeRaw`
        UPDATE roles SET 
          description = 'Acceso completo al sistema',
          level = 1,
          is_active = TRUE
        WHERE name = 'Super Administrador'
      `;
      console.log('   - Super Administrador actualizado');

      // Actualizar Contador
      await prisma.$executeRaw`
        UPDATE roles SET 
          description = 'Gestión contable y financiera',
          level = 2,
          is_active = TRUE
        WHERE name = 'Contador'
      `;
      console.log('   - Contador actualizado');

      // Actualizar Desarrollador
      await prisma.$executeRaw`
        UPDATE roles SET 
          description = 'Desarrollo y mantenimiento técnico',
          level = 3,
          is_active = TRUE
        WHERE name = 'Desarrollador'
      `;
      console.log('   - Desarrollador actualizado');

      // Actualizar Invitado
      await prisma.$executeRaw`
        UPDATE roles SET 
          description = 'Acceso básico de solo lectura',
          level = 5,
          is_active = TRUE
        WHERE name = 'Invitado'
      `;
      console.log('   - Invitado actualizado');

      // Actualizar Gerente
      await prisma.$executeRaw`
        UPDATE roles SET 
          description = 'Gestión de proyectos y operaciones',
          level = 2,
          is_active = TRUE
        WHERE name = 'Gerente'
      `;
      console.log('   - Gerente actualizado');

      console.log('✅ Roles actualizados exitosamente');
    } catch (error) {
      console.log(`❌ Error actualizando roles: ${error.message}`);
    }

    // =====================================================
    // 5. ASIGNAR PERMISOS POR ROL
    // =====================================================
    console.log('\n📋 Asignando permisos por rol...');
    
    try {
      // Obtener roles y módulos
      const roles = await prisma.roles.findMany();
      const systemModules = await prisma.$queryRaw`SELECT name FROM system_modules`;

      for (const role of roles) {
        console.log(`   - Asignando permisos para rol: ${role.name}`);
        
        for (const module of systemModules) {
          try {
            let canRead, canCreate, canUpdate, canDelete, canExport, canApprove;

            // Configurar permisos según el rol
            switch (role.name) {
              case 'Super Administrador':
                canRead = canCreate = canUpdate = canDelete = canExport = canApprove = true;
                break;
              
              case 'Contador':
                canRead = canCreate = canUpdate = canExport = true;
                canDelete = module.name !== 'proyectos';
                canApprove = module.name !== 'usuarios' && module.name !== 'permisos' && module.name !== 'auditoria';
                break;
              
              case 'Gerente':
                canRead = canCreate = canUpdate = canExport = true;
                canDelete = module.name !== 'usuarios' && module.name !== 'permisos' && module.name !== 'auditoria';
                canApprove = module.name !== 'usuarios' && module.name !== 'permisos' && module.name !== 'auditoria';
                break;
              
              case 'Desarrollador':
                canRead = true;
                canCreate = canUpdate = module.name !== 'usuarios' && module.name !== 'permisos' && module.name !== 'auditoria' && module.name !== 'contabilidad' && module.name !== 'costos_fijos';
                canDelete = module.name !== 'usuarios' && module.name !== 'permisos' && module.name !== 'auditoria' && module.name !== 'contabilidad' && module.name !== 'costos_fijos' && module.name !== 'proyectos';
                canExport = true;
                canApprove = false;
                break;
              
              case 'Invitado':
                canRead = module.name !== 'usuarios' && module.name !== 'permisos' && module.name !== 'auditoria' && module.name !== 'contabilidad' && module.name !== 'costos_fijos';
                canCreate = canUpdate = canDelete = canExport = canApprove = false;
                break;
              
              default:
                canRead = canCreate = canUpdate = canDelete = canExport = canApprove = false;
            }

            // Insertar permiso
            await prisma.$executeRaw`
              INSERT IGNORE INTO role_permissions 
              (role_id, module, can_read, can_create, can_update, can_delete, can_export, can_approve)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            `, role.id, module.name, canRead ? 1 : 0, canCreate ? 1 : 0, canUpdate ? 1 : 0, 
                canDelete ? 1 : 0, canExport ? 1 : 0, canApprove ? 1 : 0;

          } catch (error) {
            if (!error.message.includes('Duplicate entry')) {
              console.log(`     - Error con módulo ${module.name}: ${error.message}`);
            }
          }
        }
      }
      console.log('✅ Permisos asignados exitosamente');
    } catch (error) {
      console.log(`❌ Error asignando permisos: ${error.message}`);
    }

    // =====================================================
    // 6. VERIFICACIÓN FINAL
    // =====================================================
    console.log('\n🔍 Verificación final...');
    
    try {
      const roleCount = await prisma.roles.count();
      const permissionCount = await prisma.$queryRaw`SELECT COUNT(*) as count FROM role_permissions`;
      const moduleCount = await prisma.$queryRaw`SELECT COUNT(*) as count FROM system_modules`;

      console.log(`✅ Roles: ${roleCount}`);
      console.log(`✅ Permisos: ${permissionCount[0].count}`);
      console.log(`✅ Módulos: ${moduleCount[0].count}`);

      console.log('\n🎉 ¡Sistema de roles configurado exitosamente!');
      console.log('📋 Próximos pasos:');
      console.log('   1. Reiniciar el servidor backend');
      console.log('   2. Probar los endpoints de roles');
      console.log('   3. Verificar que los middlewares de permisos funcionen');

    } catch (error) {
      console.log(`❌ Error en verificación final: ${error.message}`);
    }

  } catch (error) {
    console.error('❌ Error general:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createMissingTables();
