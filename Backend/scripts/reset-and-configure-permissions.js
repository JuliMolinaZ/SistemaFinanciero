// scripts/reset-and-configure-permissions.js - Script para resetear y configurar permisos detallados
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// =====================================================
// CONFIGURACIÓN DE PERMISOS POR MÓDULO Y ROL
// =====================================================

const modulePermissions = {
  // =====================================================
  // MÓDULOS DE ADMINISTRACIÓN DEL SISTEMA
  // =====================================================
  
  // Gestión de Usuarios - Solo Super Admin y Gerente
  usuarios: {
    'Super Administrador': { read: true, create: true, update: true, delete: true, export: true, approve: true },
    'Gerente': { read: true, create: true, update: true, delete: false, export: true, approve: true },
    'Admin': { read: true, create: false, update: false, delete: false, export: false, approve: false },
    'Desarrollador': { read: true, create: false, update: false, delete: false, export: false, approve: false },
    'Contador': { read: false, create: false, update: false, delete: false, export: false, approve: false },
    'Invitado': { read: false, create: false, update: false, delete: false, export: false, approve: false }
  },

  // Gestión de Roles - Solo Super Admin y Gerente
  roles: {
    'Super Administrador': { read: true, create: true, update: true, delete: true, export: true, approve: true },
    'Gerente': { read: true, create: true, update: true, delete: false, export: true, approve: true },
    'Admin': { read: true, create: false, update: false, delete: false, export: false, approve: false },
    'Desarrollador': { read: true, create: false, update: false, delete: false, export: false, approve: false },
    'Contador': { read: false, create: false, update: false, delete: false, export: false, approve: false },
    'Invitado': { read: false, create: false, update: false, delete: false, export: false, approve: false }
  },

  // Configuración del Sistema - Solo Super Admin y Gerente
  configuracion: {
    'Super Administrador': { read: true, create: true, update: true, delete: true, export: true, approve: true },
    'Gerente': { read: true, create: true, update: true, delete: false, export: true, approve: true },
    'Admin': { read: true, create: false, update: false, delete: false, export: false, approve: false },
    'Desarrollador': { read: true, create: false, update: false, delete: false, export: false, approve: false },
    'Contador': { read: false, create: false, update: false, delete: false, export: false, approve: false },
    'Invitado': { read: false, create: false, update: false, delete: false, export: false, approve: false }
  },

  // Auditoría - Solo Super Admin y Gerente
  auditoria: {
    'Super Administrador': { read: true, create: false, update: false, delete: false, export: true, approve: false },
    'Gerente': { read: true, create: false, update: false, delete: false, export: true, approve: false },
    'Admin': { read: true, create: false, update: false, delete: false, export: false, approve: false },
    'Desarrollador': { read: true, create: false, update: false, delete: false, export: false, approve: false },
    'Contador': { read: false, create: false, update: false, delete: false, export: false, approve: false },
    'Invitado': { read: false, create: false, update: false, delete: false, export: false, approve: false }
  },

  // =====================================================
  // MÓDULOS DE GESTIÓN DE NEGOCIO
  // =====================================================
  
  // Gestión de Clientes - Acceso amplio
  clientes: {
    'Super Administrador': { read: true, create: true, update: true, delete: true, export: true, approve: true },
    'Gerente': { read: true, create: true, update: true, delete: true, export: true, approve: true },
    'Admin': { read: true, create: true, update: true, delete: true, export: true, approve: true },
    'Desarrollador': { read: true, create: false, update: false, delete: false, export: false, approve: false },
    'Contador': { read: true, create: false, update: false, delete: false, export: false, approve: false },
    'Invitado': { read: true, create: false, update: false, delete: false, export: false, approve: false }
  },

  // Gestión de Proyectos - Acceso amplio
  proyectos: {
    'Super Administrador': { read: true, create: true, update: true, delete: true, export: true, approve: true },
    'Gerente': { read: true, create: true, update: true, delete: true, export: true, approve: true },
    'Admin': { read: true, create: true, update: true, delete: true, export: true, approve: true },
    'Desarrollador': { read: true, create: false, update: false, delete: false, export: false, approve: false },
    'Contador': { read: true, create: false, update: false, delete: false, export: false, approve: false },
    'Invitado': { read: true, create: false, update: false, delete: false, export: false, approve: false }
  },

  // Fases de Proyectos - Acceso amplio
  fases: {
    'Super Administrador': { read: true, create: true, update: true, delete: true, export: true, approve: true },
    'Gerente': { read: true, create: true, update: true, delete: true, export: true, approve: true },
    'Admin': { read: true, create: true, update: true, delete: true, export: true, approve: true },
    'Desarrollador': { read: true, create: false, update: false, delete: false, export: false, approve: false },
    'Contador': { read: true, create: false, update: false, delete: false, export: false, approve: false },
    'Invitado': { read: true, create: false, update: false, delete: false, export: false, approve: false }
  },

  // =====================================================
  // MÓDULOS FINANCIEROS Y CONTABLES
  // =====================================================
  
  // Cuentas por Pagar - Acceso financiero
  cuentas_por_pagar: {
    'Super Administrador': { read: true, create: true, update: true, delete: true, export: true, approve: true },
    'Gerente': { read: true, create: true, update: true, delete: true, export: true, approve: true },
    'Admin': { read: true, create: true, update: true, delete: true, export: true, approve: true },
    'Desarrollador': { read: false, create: false, update: false, delete: false, export: false, approve: false },
    'Contador': { read: true, create: true, update: true, delete: true, export: true, approve: true },
    'Invitado': { read: false, create: false, update: false, delete: false, export: false, approve: false }
  },

  // Cuentas por Cobrar - Acceso financiero
  cuentas_por_cobrar: {
    'Super Administrador': { read: true, create: true, update: true, delete: true, export: true, approve: true },
    'Gerente': { read: true, create: true, update: true, delete: true, export: true, approve: true },
    'Admin': { read: true, create: true, update: true, delete: true, export: true, approve: true },
    'Desarrollador': { read: false, create: false, update: false, delete: false, export: false, approve: false },
    'Contador': { read: true, create: true, update: true, delete: true, export: true, approve: true },
    'Invitado': { read: false, create: false, update: false, delete: false, export: false, approve: false }
  },

  // Contabilidad - Solo contadores y administradores
  contabilidad: {
    'Super Administrador': { read: true, create: true, update: true, delete: true, export: true, approve: true },
    'Gerente': { read: true, create: true, update: true, delete: true, export: true, approve: true },
    'Admin': { read: true, create: true, update: true, delete: true, export: true, approve: true },
    'Desarrollador': { read: false, create: false, update: false, delete: false, export: false, approve: false },
    'Contador': { read: true, create: true, update: true, delete: true, export: true, approve: true },
    'Invitado': { read: false, create: false, update: false, delete: false, export: false, approve: false }
  },

  // Impuestos IMSS - Solo contadores y administradores
  impuestos_imss: {
    'Super Administrador': { read: true, create: true, update: true, delete: true, export: true, approve: true },
    'Gerente': { read: true, create: true, update: true, delete: true, export: true, approve: true },
    'Admin': { read: true, create: true, update: true, delete: true, export: true, approve: true },
    'Desarrollador': { read: false, create: false, update: false, delete: false, export: false, approve: false },
    'Contador': { read: true, create: true, update: true, delete: true, export: true, approve: true },
    'Invitado': { read: false, create: false, update: false, delete: false, export: false, approve: false }
  },

  // Costos Fijos - Solo contadores y administradores
  costos_fijos: {
    'Super Administrador': { read: true, create: true, update: true, delete: true, export: true, approve: true },
    'Gerente': { read: true, create: true, update: true, delete: true, export: true, approve: true },
    'Admin': { read: true, create: true, update: true, delete: true, export: true, approve: true },
    'Desarrollador': { read: false, create: false, update: false, delete: false, export: false, approve: false },
    'Contador': { read: true, create: true, update: true, delete: true, export: true, approve: true },
    'Invitado': { read: false, create: false, update: false, delete: false, export: false, approve: false }
  },

  // =====================================================
  // MÓDULOS DE OPERACIONES
  // =====================================================
  
  // Categorías - Acceso amplio
  categorias: {
    'Super Administrador': { read: true, create: true, update: true, delete: true, export: true, approve: true },
    'Gerente': { read: true, create: true, update: true, delete: true, export: true, approve: true },
    'Admin': { read: true, create: true, update: true, delete: true, export: true, approve: true },
    'Desarrollador': { read: true, create: false, update: false, delete: false, export: false, approve: false },
    'Contador': { read: true, create: true, update: true, delete: true, export: true, approve: true },
    'Invitado': { read: true, create: false, update: false, delete: false, export: false, approve: false }
  },

  // Proveedores - Acceso amplio
  proveedores: {
    'Super Administrador': { read: true, create: true, update: true, delete: true, export: true, approve: true },
    'Gerente': { read: true, create: true, update: true, delete: true, export: true, approve: true },
    'Admin': { read: true, create: true, update: true, delete: true, export: true, approve: true },
    'Desarrollador': { read: true, create: false, update: false, delete: false, export: false, approve: false },
    'Contador': { read: true, create: true, update: true, delete: true, export: true, approve: true },
    'Invitado': { read: true, create: false, update: false, delete: false, export: false, approve: false }
  },

  // =====================================================
  // MÓDULOS DE REPORTES Y ANÁLISIS
  // =====================================================
  
  // Dashboard - Acceso amplio
  dashboard: {
    'Super Administrador': { read: true, create: false, update: false, delete: false, export: true, approve: false },
    'Gerente': { read: true, create: false, update: false, delete: false, export: true, approve: false },
    'Admin': { read: true, create: false, update: false, delete: false, export: true, approve: false },
    'Desarrollador': { read: true, create: false, update: false, delete: false, export: false, approve: false },
    'Contador': { read: true, create: false, update: false, delete: false, export: true, approve: false },
    'Invitado': { read: true, create: false, update: false, delete: false, export: false, approve: false }
  },

  // Reportes - Acceso limitado
  reportes: {
    'Super Administrador': { read: true, create: true, update: true, delete: true, export: true, approve: true },
    'Gerente': { read: true, create: true, update: true, delete: true, export: true, approve: true },
    'Admin': { read: true, create: true, update: true, delete: false, export: true, approve: false },
    'Desarrollador': { read: true, create: false, update: false, delete: false, export: false, approve: false },
    'Contador': { read: true, create: false, update: false, delete: false, export: true, approve: false },
    'Invitado': { read: false, create: false, update: false, delete: false, export: false, approve: false }
  },

  // Gráficos en Tiempo Real - Acceso amplio
  realtime_graph: {
    'Super Administrador': { read: true, create: false, update: false, delete: false, export: true, approve: false },
    'Gerente': { read: true, create: false, update: false, delete: false, export: true, approve: false },
    'Admin': { read: true, create: false, update: false, delete: false, export: true, approve: false },
    'Desarrollador': { read: true, create: false, update: false, delete: false, export: false, approve: false },
    'Contador': { read: true, create: false, update: false, delete: false, export: true, approve: false },
    'Invitado': { read: true, create: false, update: false, delete: false, export: false, approve: false }
  },

  // =====================================================
  // MÓDULOS ESPECIALIZADOS
  // =====================================================
  
  // Cotizaciones - Acceso de gestión
  cotizaciones: {
    'Super Administrador': { read: true, create: true, update: true, delete: true, export: true, approve: true },
    'Gerente': { read: true, create: true, update: true, delete: true, export: true, approve: true },
    'Admin': { read: true, create: true, update: true, delete: true, export: true, approve: true },
    'Desarrollador': { read: false, create: false, update: false, delete: false, export: false, approve: false },
    'Contador': { read: true, create: false, update: false, delete: false, export: false, approve: false },
    'Invitado': { read: false, create: false, update: false, delete: false, export: false, approve: false }
  },

  // Facturas Emitidas - Acceso de gestión
  emitidas: {
    'Super Administrador': { read: true, create: true, update: true, delete: true, export: true, approve: true },
    'Gerente': { read: true, create: true, update: true, delete: true, export: true, approve: true },
    'Admin': { read: true, create: true, update: true, delete: true, export: true, approve: true },
    'Desarrollador': { read: false, create: false, update: false, delete: false, export: false, approve: false },
    'Contador': { read: true, create: true, update: true, delete: true, export: true, approve: true },
    'Invitado': { read: false, create: false, update: false, delete: false, export: false, approve: false }
  },

  // Recuperación - Acceso de gestión
  recuperacion: {
    'Super Administrador': { read: true, create: true, update: true, delete: true, export: true, approve: true },
    'Gerente': { read: true, create: true, update: true, delete: true, export: true, approve: true },
    'Admin': { read: true, create: true, update: true, delete: true, export: true, approve: true },
    'Desarrollador': { read: false, create: false, update: false, delete: false, export: false, approve: false },
    'Contador': { read: true, create: true, update: true, delete: true, export: true, approve: true },
    'Invitado': { read: false, create: false, update: false, delete: false, export: false, approve: false }
  },

  // Flow Recovery V2 - Acceso de gestión
  flow_recovery_v2: {
    'Super Administrador': { read: true, create: true, update: true, delete: true, export: true, approve: true },
    'Gerente': { read: true, create: true, update: true, delete: true, export: true, approve: true },
    'Admin': { read: true, create: true, update: true, delete: true, export: true, approve: true },
    'Desarrollador': { read: false, create: false, update: false, delete: false, export: false, approve: false },
    'Contador': { read: true, create: true, update: true, delete: true, export: true, approve: true },
    'Invitado': { read: false, create: false, update: false, delete: false, export: false, approve: false }
  },

  // MoneyFlow Recovery - Acceso de gestión
  moneyflow_recovery: {
    'Super Administrador': { read: true, create: true, update: true, delete: true, export: true, approve: true },
    'Gerente': { read: true, create: true, update: true, delete: true, export: true, approve: true },
    'Admin': { read: true, create: true, update: true, delete: true, export: true, approve: true },
    'Desarrollador': { read: false, create: false, update: false, delete: false, export: false, approve: false },
    'Contador': { read: true, create: true, update: true, delete: true, export: true, approve: true },
    'Invitado': { read: false, create: false, update: false, delete: false, export: false, approve: false }
  },

  // Complementos de Pago - Acceso de gestión
  complementos_pago: {
    'Super Administrador': { read: true, create: true, update: true, delete: true, export: true, approve: true },
    'Gerente': { read: true, create: true, update: true, delete: true, export: true, approve: true },
    'Admin': { read: true, create: true, update: true, delete: true, export: true, approve: true },
    'Desarrollador': { read: false, create: false, update: false, delete: false, export: false, approve: false },
    'Contador': { read: true, create: true, update: true, delete: true, export: true, approve: true },
    'Invitado': { read: false, create: false, update: false, delete: false, export: false, approve: false }
  },

  // Costos de Proyectos - Acceso de gestión
  project_costs: {
    'Super Administrador': { read: true, create: true, update: true, delete: true, export: true, approve: true },
    'Gerente': { read: true, create: true, update: true, delete: true, export: true, approve: true },
    'Admin': { read: true, create: true, update: true, delete: true, export: true, approve: true },
    'Desarrollador': { read: false, create: false, update: false, delete: false, export: false, approve: false },
    'Contador': { read: true, create: true, update: true, delete: true, export: true, approve: true },
    'Invitado': { read: false, create: false, update: false, delete: false, export: false, approve: false }
  },

  // Horas Extra - Acceso de gestión
  horas_extra: {
    'Super Administrador': { read: true, create: true, update: true, delete: true, export: true, approve: true },
    'Gerente': { read: true, create: true, update: true, delete: true, export: true, approve: true },
    'Admin': { read: true, create: true, update: true, delete: true, export: true, approve: true },
    'Desarrollador': { read: false, create: false, update: false, delete: false, export: false, approve: false },
    'Contador': { read: true, create: false, update: false, delete: false, export: false, approve: false },
    'Invitado': { read: false, create: false, update: false, delete: false, export: false, approve: false }
  },

  // Gestión de Activos - Acceso de gestión
  assets: {
    'Super Administrador': { read: true, create: true, update: true, delete: true, export: true, approve: true },
    'Gerente': { read: true, create: true, update: true, delete: true, export: true, approve: true },
    'Admin': { read: true, create: true, update: true, delete: true, export: true, approve: true },
    'Desarrollador': { read: true, create: false, update: false, delete: false, export: false, approve: false },
    'Contador': { read: true, create: false, update: false, delete: false, export: false, approve: false },
    'Invitado': { read: true, create: false, update: false, delete: false, export: false, approve: false }
  },

  // Permisos del Sistema - Solo Super Admin y Gerente
  permisos: {
    'Super Administrador': { read: true, create: true, update: true, delete: true, export: true, approve: true },
    'Gerente': { read: true, create: true, update: true, delete: false, export: true, approve: true },
    'Admin': { read: true, create: false, update: false, delete: false, export: false, approve: false },
    'Desarrollador': { read: true, create: false, update: false, delete: false, export: false, approve: false },
    'Contador': { read: false, create: false, update: false, delete: false, export: false, approve: false },
    'Invitado': { read: false, create: false, update: false, delete: false, export: false, approve: false }
  }
};

// =====================================================
// FUNCIÓN PRINCIPAL DE CONFIGURACIÓN
// =====================================================

async function resetAndConfigurePermissions() {
  try {
    console.log('🚀 Iniciando reset y configuración de permisos...');
    
    // 1. LIMPIAR TODOS LOS PERMISOS EXISTENTES
    console.log('\n🗑️ Limpiando permisos existentes...');
    const deletedCount = await prisma.rolePermissions.deleteMany({});
    console.log(`✅ ${deletedCount.count} permisos eliminados`);
    
    // 2. OBTENER TODOS LOS ROLES
    const roles = await prisma.roles.findMany({
      where: { is_active: true },
      orderBy: { level: 'asc' }
    });

    console.log(`\n📋 ${roles.length} roles encontrados`);

    // 3. CONFIGURAR PERMISOS PARA CADA ROL
    for (const role of roles) {
      console.log(`\n🔐 Configurando permisos para rol: ${role.name}`);
      
      // Obtener la configuración de permisos para este rol
      const rolePermissions = modulePermissions[role.name];
      
      if (!rolePermissions) {
        console.log(`⚠️ No hay configuración de permisos para el rol: ${role.name}`);
        continue;
      }

      // Para cada módulo, configurar permisos
      for (const [moduleName, permissions] of Object.entries(rolePermissions)) {
        console.log(`  📦 Configurando módulo: ${moduleName}`);
        
        // Crear el permiso
        const permissionData = {
          role_id: role.id,
          module: moduleName,
          can_read: permissions.read,
          can_create: permissions.create,
          can_update: permissions.update,
          can_delete: permissions.delete,
          can_export: permissions.export,
          can_approve: permissions.approve,
          created_at: new Date(),
          updated_at: new Date()
        };

        try {
          await prisma.rolePermissions.create({
            data: permissionData
          });

          console.log(`    ✅ Permisos configurados para ${moduleName}`);
        } catch (error) {
          console.error(`    ❌ Error configurando permisos para ${moduleName}:`, error.message);
        }
      }
    }

    console.log('\n🎉 Configuración de permisos completada exitosamente!');
    
    // 4. MOSTRAR RESUMEN DE PERMISOS CONFIGURADOS
    await showPermissionsSummary();
    
  } catch (error) {
    console.error('❌ Error en la configuración de permisos:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// =====================================================
// FUNCIÓN PARA MOSTRAR RESUMEN DE PERMISOS
// =====================================================

async function showPermissionsSummary() {
  try {
    console.log('\n📊 RESUMEN DE PERMISOS CONFIGURADOS:');
    console.log('=====================================');

    const roles = await prisma.roles.findMany({
      where: { is_active: true },
      include: {
        role_permissions: true,
        _count: {
          select: { users: true }
        }
      },
      orderBy: { level: 'asc' }
    });

    for (const role of roles) {
      console.log(`\n👤 ${role.name} (Nivel ${role.level}) - ${role._count.users} usuarios`);
      console.log('─'.repeat(50));
      
      const modules = await prisma.systemModules.findMany({
        where: { is_active: true },
        orderBy: { name: 'asc' }
      });

      for (const module of modules) {
        const permission = role.role_permissions.find(p => p.module === module.name);
        
        if (permission) {
          const permissions = [];
          if (permission.can_read) permissions.push('📖 Ver');
          if (permission.can_create) permissions.push('➕ Crear');
          if (permission.can_update) permissions.push('✏️ Editar');
          if (permission.can_delete) permissions.push('🗑️ Eliminar');
          if (permission.can_export) permissions.push('📤 Exportar');
          if (permission.can_approve) permissions.push('✅ Aprobar');
          
          console.log(`  📦 ${module.display_name}: ${permissions.join(' | ')}`);
        } else {
          console.log(`  📦 ${module.display_name}: ❌ Sin acceso`);
        }
      }
    }

  } catch (error) {
    console.error('❌ Error mostrando resumen:', error);
  }
}

// =====================================================
// EJECUTAR SCRIPT
// =====================================================

if (require.main === module) {
  resetAndConfigurePermissions()
    .then(() => {
      console.log('\n✅ Script ejecutado exitosamente');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n❌ Error en la ejecución:', error);
      process.exit(1);
    });
}

module.exports = { resetAndConfigurePermissions };
