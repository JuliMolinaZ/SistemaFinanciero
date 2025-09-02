const { PrismaClient } = require('@prisma/client');
require('dotenv').config({ path: './config.env' });

const prisma = new PrismaClient();

async function fixTablesSimple() {
  try {
    console.log('🔧 Creando tablas faltantes de manera simple...\n');

    // =====================================================
    // 1. CREAR TABLA role_permissions
    // =====================================================
    console.log('📋 Creando tabla role_permissions...');
    
    try {
      await prisma.$executeRaw`DROP TABLE IF EXISTS role_permissions`;
      await prisma.$executeRaw`
        CREATE TABLE role_permissions (
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
      console.log(`❌ Error creando role_permissions: ${error.message}`);
      throw error;
    }

    // =====================================================
    // 2. CREAR TABLA system_modules
    // =====================================================
    console.log('\n📋 Creando tabla system_modules...');
    
    try {
      await prisma.$executeRaw`DROP TABLE IF EXISTS system_modules`;
      await prisma.$executeRaw`
        CREATE TABLE system_modules (
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
      console.log(`❌ Error creando system_modules: ${error.message}`);
      throw error;
    }

    // =====================================================
    // 3. INSERTAR MÓDULOS BÁSICOS
    // =====================================================
    console.log('\n📋 Insertando módulos básicos...');
    
    const basicModules = [
      ['usuarios', 'Gestión de Usuarios', 'Administración de usuarios, roles y permisos', 'people', '/usuarios', 1],
      ['clientes', 'Gestión de Clientes', 'Administración de clientes y contactos', 'business', '/clientes', 0],
      ['proyectos', 'Gestión de Proyectos', 'Administración de proyectos y fases', 'work', '/proyectos', 1],
      ['contabilidad', 'Contabilidad', 'Gestión contable y financiera', 'account_balance', '/contabilidad', 1],
      ['costos_fijos', 'Costos Fijos', 'Administración de costos fijos', 'trending_up', '/costos-fijos', 1],
      ['cotizaciones', 'Cotizaciones', 'Gestión de cotizaciones y presupuestos', 'description', '/cotizaciones', 1],
      ['cuentas_por_cobrar', 'Cuentas por Cobrar', 'Gestión de cuentas por cobrar', 'account_balance_wallet', '/cuentas-cobrar', 0],
      ['cuentas_por_pagar', 'Cuentas por Pagar', 'Gestión de cuentas por pagar', 'payment', '/cuentas-pagar', 1],
      ['proveedores', 'Proveedores', 'Administración de proveedores', 'local_shipping', '/proveedores', 0],
      ['categorias', 'Categorías', 'Administración de categorías', 'category', '/categorias', 0],
      ['fases', 'Fases de Proyectos', 'Administración de fases de proyectos', 'timeline', '/fases', 0],
      ['recuperacion', 'Recuperación', 'Gestión de recuperación de costos', 'restore', '/recuperacion', 1],
      ['flow_recovery_v2', 'Flow Recovery V2', 'Sistema avanzado de recuperación', 'sync', '/flow-recovery', 1],
      ['emitidas', 'Facturas Emitidas', 'Gestión de facturas emitidas', 'receipt', '/emitidas', 1],
      ['permisos', 'Permisos del Sistema', 'Administración de permisos y accesos', 'security', '/permisos', 1],
      ['reportes', 'Reportes', 'Generación y visualización de reportes', 'assessment', '/reportes', 1],
      ['auditoria', 'Auditoría', 'Logs de auditoría del sistema', 'history', '/auditoria', 1]
    ];

    for (const [name, displayName, description, icon, route, requiresApproval] of basicModules) {
      try {
        await prisma.$executeRaw`
          INSERT INTO system_modules (name, display_name, description, icon, route, requires_approval)
          VALUES (?, ?, ?, ?, ?, ?)
        `, name, displayName, description, icon, route, requiresApproval;
        console.log(`   - Módulo ${name} insertado`);
      } catch (error) {
        if (error.message.includes('Duplicate entry')) {
          console.log(`   - Módulo ${name} ya existe`);
        } else {
          console.log(`   - Error con módulo ${name}: ${error.message}`);
        }
      }
    }

    // =====================================================
    // 4. ASIGNAR PERMISOS BÁSICOS
    // =====================================================
    console.log('\n📋 Asignando permisos básicos...');
    
    try {
      // Obtener roles
      const roles = await prisma.roles.findMany();
      console.log(`   - Encontrados ${roles.length} roles`);

      // Obtener módulos
      const modules = await prisma.$queryRaw`SELECT name FROM system_modules`;
      console.log(`   - Encontrados ${modules.length} módulos`);

      // Para cada rol, asignar permisos básicos
      for (const role of roles) {
        console.log(`   - Configurando permisos para: ${role.name}`);
        
        for (const module of modules) {
          try {
            let canRead = false, canCreate = false, canUpdate = false, canDelete = false, canExport = false, canApprove = false;

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

            // Insertar permiso usando SQL directo
            await prisma.$executeRaw`
              INSERT INTO role_permissions 
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
      console.log('✅ Permisos básicos asignados');
    } catch (error) {
      console.log(`❌ Error asignando permisos: ${error.message}`);
    }

    // =====================================================
    // 5. VERIFICACIÓN FINAL
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

fixTablesSimple();
