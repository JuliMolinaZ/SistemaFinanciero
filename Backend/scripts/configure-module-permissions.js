// scripts/configure-module-permissions.js - Script para configurar permisos detallados por módulo
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
    Super_Administrador: { read: true, create: true, update: true, delete: true, export: true, approve: true },
    Gerente: { read: true, create: true, update: true, delete: false, export: true, approve: true },
    Admin: { read: true, create: false, update: false, delete: false, export: false, approve: false },
    Desarrollador: { read: true, create: false, update: false, delete: false, export: false, approve: false },
    Contador: { read: false, create: false, update: false, delete: false, export: false, approve: false },
    Invitado: { read: false, create: false, update: false, delete: false, export: false, approve: false }
  },

  // Gestión de Roles - Solo Super Admin y Gerente
  roles: {
    Super_Administrador: { read: true, create: true, update: true, delete: true, export: true, approve: true },
    Gerente: { read: true, create: true, update: true, delete: false, export: true, approve: true },
    Admin: { read: true, create: false, update: false, delete: false, export: false, approve: false },
    Desarrollador: { read: true, create: false, update: false, delete: false, export: false, approve: false },
    Contador: { read: false, create: false, update: false, delete: false, export: false, approve: false },
    Invitado: { read: false, create: false, update: false, delete: false, export: false, approve: false }
  },

  // Configuración del Sistema - Solo Super Admin y Gerente
  configuracion: {
    Super_Administrador: { read: true, create: true, update: true, delete: true, export: true, approve: true },
    Gerente: { read: true, create: true, update: true, delete: false, export: true, approve: true },
    Admin: { read: true, create: false, update: false, delete: false, export: false, approve: false },
    Desarrollador: { read: true, create: false, update: false, delete: false, export: false, approve: false },
    Contador: { read: false, create: false, update: false, delete: false, export: false, approve: false },
    Invitado: { read: false, create: false, update: false, delete: false, export: false, approve: false }
  },

  // Auditoría - Solo Super Admin y Gerente
  auditoria: {
    Super_Administrador: { read: true, create: false, update: false, delete: false, export: true, approve: false },
    Gerente: { read: true, create: false, update: false, delete: false, export: true, approve: false },
    Admin: { read: true, create: false, update: false, delete: false, export: false, approve: false },
    Desarrollador: { read: true, create: false, update: false, delete: false, export: false, approve: false },
    Contador: { read: false, create: false, update: false, delete: false, export: false, approve: false },
    Invitado: { read: false, create: false, update: false, delete: false, export: false, approve: false }
  },

  // =====================================================
  // MÓDULOS DE GESTIÓN DE NEGOCIO
  // =====================================================
  
  // Gestión de Clientes - Acceso amplio
  clientes: {
    Super_Administrador: { read: true, create: true, update: true, delete: true, export: true, approve: true },
    Gerente: { read: true, create: true, update: true, delete: true, export: true, approve: true },
    Admin: { read: true, create: true, update: true, delete: true, export: true, approve: true },
    Desarrollador: { read: true, create: false, update: false, delete: false, export: false, approve: false },
    Contador: { read: true, create: false, update: false, delete: false, export: false, approve: false },
    Invitado: { read: true, create: false, update: false, delete: false, export: false, approve: false }
  },

  // Gestión de Proyectos - Acceso amplio
  proyectos: {
    Super_Administrador: { read: true, create: true, update: true, delete: true, export: true, approve: true },
    Gerente: { read: true, create: true, update: true, delete: true, export: true, approve: true },
    Admin: { read: true, create: true, update: true, delete: true, export: true, approve: true },
    Desarrollador: { read: true, create: false, update: false, delete: false, export: false, approve: false },
    Contador: { read: true, create: false, update: false, delete: false, export: false, approve: false },
    Invitado: { read: true, create: false, update: false, delete: false, export: false, approve: false }
  },

  // Fases de Proyectos - Acceso amplio
  fases: {
    Super_Administrador: { read: true, create: true, update: true, delete: true, export: true, approve: true },
    Gerente: { read: true, create: true, update: true, delete: true, export: true, approve: true },
    Admin: { read: true, create: true, update: true, delete: true, export: true, approve: true },
    Desarrollador: { read: true, create: false, update: false, delete: false, export: false, approve: false },
    Contador: { read: true, create: false, update: false, delete: false, export: false, approve: false },
    Invitado: { read: true, create: false, update: false, delete: false, export: false, approve: false }
  },

  // =====================================================
  // MÓDULOS FINANCIEROS Y CONTABLES
  // =====================================================
  
  // Cuentas por Pagar - Acceso financiero
  cuentas_por_pagar: {
    Super_Administrador: { read: true, create: true, update: true, delete: true, export: true, approve: true },
    Gerente: { read: true, create: true, update: true, delete: true, export: true, approve: true },
    Admin: { read: true, create: true, update: true, delete: true, export: true, approve: true },
    Desarrollador: { read: false, create: false, update: false, delete: false, export: false, approve: false },
    Contador: { read: true, create: true, update: true, delete: true, export: true, approve: true },
    Invitado: { read: false, create: false, update: false, delete: false, export: false, approve: false }
  },

  // Cuentas por Cobrar - Acceso financiero
  cuentas_por_cobrar: {
    Super_Administrador: { read: true, create: true, update: true, delete: true, export: true, approve: true },
    Gerente: { read: true, create: true, update: true, delete: true, export: true, approve: true },
    Admin: { read: true, create: true, update: true, delete: true, export: true, approve: true },
    Desarrollador: { read: false, create: false, update: false, delete: false, export: false, approve: false },
    Contador: { read: true, create: true, update: true, delete: true, export: true, approve: true },
    Invitado: { read: false, create: false, update: false, delete: false, export: false, approve: false }
  },

  // Contabilidad - Solo contadores y administradores
  contabilidad: {
    Super_Administrador: { read: true, create: true, update: true, delete: true, export: true, approve: true },
    Gerente: { read: true, create: true, update: true, delete: true, export: true, approve: true },
    Admin: { read: true, create: true, update: true, delete: true, export: true, approve: true },
    Desarrollador: { read: false, create: false, update: false, delete: false, export: false, approve: false },
    Contador: { read: true, create: true, update: true, delete: true, export: true, approve: true },
    Invitado: { read: false, create: false, update: false, delete: false, export: false, approve: false }
  },

  // Impuestos IMSS - Solo contadores y administradores
  impuestos_imss: {
    Super_Administrador: { read: true, create: true, update: true, delete: true, export: true, approve: true },
    Gerente: { read: true, create: true, update: true, delete: true, export: true, approve: true },
    Admin: { read: true, create: true, update: true, delete: true, export: true, approve: true },
    Desarrollador: { read: false, create: false, update: false, delete: false, export: false, approve: false },
    Contador: { read: true, create: true, update: true, delete: true, export: true, approve: true },
    Invitado: { read: false, create: false, update: false, delete: false, export: false, approve: false }
  },

  // Costos Fijos - Solo contadores y administradores
  costos_fijos: {
    Super_Administrador: { read: true, create: true, update: true, delete: true, export: true, approve: true },
    Gerente: { read: true, create: true, update: true, delete: true, export: true, approve: true },
    Admin: { read: true, create: true, update: true, delete: true, export: true, approve: true },
    Desarrollador: { read: false, create: false, update: false, delete: false, export: false, approve: false },
    Contador: { read: true, create: true, update: true, delete: true, export: true, approve: true },
    Invitado: { read: false, create: false, update: false, delete: false, export: false, approve: false }
  },

  // =====================================================
  // MÓDULOS DE OPERACIONES
  // =====================================================
  
  // Categorías - Acceso amplio
  categorias: {
    Super_Administrador: { read: true, create: true, update: true, delete: true, export: true, approve: true },
    Gerente: { read: true, create: true, update: true, delete: true, export: true, approve: true },
    Admin: { read: true, create: true, update: true, delete: true, export: true, approve: true },
    Desarrollador: { read: true, create: false, update: false, delete: false, export: false, approve: false },
    Contador: { read: true, create: true, update: true, delete: true, export: true, approve: true },
    Invitado: { read: true, create: false, update: false, delete: false, export: false, approve: false }
  },

  // Proveedores - Acceso amplio
  proveedores: {
    Super_Administrador: { read: true, create: true, update: true, delete: true, export: true, approve: true },
    Gerente: { read: true, create: true, update: true, delete: true, export: true, approve: true },
    Admin: { read: true, create: true, update: true, delete: true, export: true, approve: true },
    Desarrollador: { read: true, create: false, update: false, delete: false, export: false, approve: false },
    Contador: { read: true, create: true, update: true, delete: true, export: true, approve: true },
    Invitado: { read: true, create: false, update: false, delete: false, export: false, approve: false }
  },

  // =====================================================
  // MÓDULOS DE REPORTES Y ANÁLISIS
  // =====================================================
  
  // Dashboard - Acceso amplio
  dashboard: {
    Super_Administrador: { read: true, create: false, update: false, delete: false, export: true, approve: false },
    Gerente: { read: true, create: false, update: false, delete: false, export: true, approve: false },
    Admin: { read: true, create: false, update: false, delete: false, export: true, approve: false },
    Desarrollador: { read: true, create: false, update: false, delete: false, export: false, approve: false },
    Contador: { read: true, create: false, update: false, delete: false, export: true, approve: false },
    Invitado: { read: true, create: false, update: false, delete: false, export: false, approve: false }
  },

  // Reportes - Acceso limitado
  reportes: {
    Super_Administrador: { read: true, create: true, update: true, delete: true, export: true, approve: true },
    Gerente: { read: true, create: true, update: true, delete: true, export: true, approve: true },
    Admin: { read: true, create: true, update: true, delete: false, export: true, approve: false },
    Desarrollador: { read: true, create: false, update: false, delete: false, export: false, approve: false },
    Contador: { read: true, create: false, update: false, delete: false, export: true, approve: false },
    Invitado: { read: false, create: false, update: false, delete: false, export: false, approve: false }
  },

  // Gráficos en Tiempo Real - Acceso amplio
  realtime_graph: {
    Super_Administrador: { read: true, create: false, update: false, delete: false, export: true, approve: false },
    Gerente: { read: true, create: false, update: false, delete: false, export: true, approve: false },
    Admin: { read: true, create: false, update: false, delete: false, export: true, approve: false },
    Desarrollador: { read: true, create: false, update: false, delete: false, export: false, approve: false },
    Contador: { read: true, create: false, update: false, delete: false, export: true, approve: false },
    Invitado: { read: true, create: false, update: false, delete: false, export: false, approve: false }
  },

  // =====================================================
  // MÓDULOS ESPECIALIZADOS
  // =====================================================
  
  // Cotizaciones - Acceso de gestión
  cotizaciones: {
    Super_Administrador: { read: true, create: true, update: true, delete: true, export: true, approve: true },
    Gerente: { read: true, create: true, update: true, delete: true, export: true, approve: true },
    Admin: { read: true, create: true, update: true, delete: true, export: true, approve: true },
    Desarrollador: { read: false, create: false, update: false, delete: false, export: false, approve: false },
    Contador: { read: true, create: false, update: false, delete: false, export: false, approve: false },
    Invitado: { read: false, create: false, update: false, delete: false, export: false, approve: false }
  },

  // Facturas Emitidas - Acceso de gestión
  emitidas: {
    Super_Administrador: { read: true, create: true, update: true, delete: true, export: true, approve: true },
    Gerente: { read: true, create: true, update: true, delete: true, export: true, approve: true },
    Admin: { read: true, create: true, update: true, delete: true, export: true, approve: true },
    Desarrollador: { read: false, create: false, update: false, delete: false, export: false, approve: false },
    Contador: { read: true, create: true, update: true, delete: true, export: true, approve: true },
    Invitado: { read: false, create: false, update: false, delete: false, export: false, approve: false }
  },

  // Recuperación - Acceso de gestión
  recuperacion: {
    Super_Administrador: { read: true, create: true, update: true, delete: true, export: true, approve: true },
    Gerente: { read: true, create: true, update: true, delete: true, export: true, approve: true },
    Admin: { read: true, create: true, update: true, delete: true, export: true, approve: true },
    Desarrollador: { read: false, create: false, update: false, delete: false, export: false, approve: false },
    Contador: { read: true, create: true, update: true, delete: true, export: true, approve: true },
    Invitado: { read: false, create: false, update: false, delete: false, export: false, approve: false }
  },

  // Flow Recovery V2 - Acceso de gestión
  flow_recovery_v2: {
    Super_Administrador: { read: true, create: true, update: true, delete: true, export: true, approve: true },
    Gerente: { read: true, create: true, update: true, delete: true, export: true, approve: true },
    Admin: { read: true, create: true, update: true, delete: true, export: true, approve: true },
    Desarrollador: { read: false, create: false, update: false, delete: false, export: false, approve: false },
    Contador: { read: true, create: true, update: true, delete: true, export: true, approve: true },
    Invitado: { read: false, create: false, update: false, delete: false, export: false, approve: false }
  },

  // MoneyFlow Recovery - Acceso de gestión
  moneyflow_recovery: {
    Super_Administrador: { read: true, create: true, update: true, delete: true, export: true, approve: true },
    Gerente: { read: true, create: true, update: true, delete: true, export: true, approve: true },
    Admin: { read: true, create: true, update: true, delete: true, export: true, approve: true },
    Desarrollador: { read: false, create: false, update: false, delete: false, export: false, approve: false },
    Contador: { read: true, create: true, update: true, delete: true, export: true, approve: true },
    Invitado: { read: false, create: false, update: false, delete: false, export: false, approve: false }
  },

  // Complementos de Pago - Acceso de gestión
  complementos_pago: {
    Super_Administrador: { read: true, create: true, update: true, delete: true, export: true, approve: true },
    Gerente: { read: true, create: true, update: true, delete: true, export: true, approve: true },
    Admin: { read: true, create: true, update: true, delete: true, export: true, approve: true },
    Desarrollador: { read: false, create: false, update: false, delete: false, export: false, approve: false },
    Contador: { read: true, create: true, update: true, delete: true, export: true, approve: true },
    Invitado: { read: false, create: false, update: false, delete: false, export: false, approve: false }
  },

  // Costos de Proyectos - Acceso de gestión
  project_costs: {
    Super_Administrador: { read: true, create: true, update: true, delete: true, export: true, approve: true },
    Gerente: { read: true, create: true, update: true, delete: true, export: true, approve: true },
    Admin: { read: true, create: true, update: true, delete: true, export: true, approve: true },
    Desarrollador: { read: false, create: false, update: false, delete: false, export: false, approve: false },
    Contador: { read: true, create: true, update: true, delete: true, export: true, approve: true },
    Invitado: { read: false, create: false, update: false, delete: false, export: false, approve: false }
  },

  // Horas Extra - Acceso de gestión
  horas_extra: {
    Super_Administrador: { read: true, create: true, update: true, delete: true, export: true, approve: true },
    Gerente: { read: true, create: true, update: true, delete: true, export: true, approve: true },
    Admin: { read: true, create: true, update: true, delete: true, export: true, approve: true },
    Desarrollador: { read: false, create: false, update: false, delete: false, export: false, approve: false },
    Contador: { read: true, create: false, update: false, delete: false, export: false, approve: false },
    Invitado: { read: false, create: false, update: false, delete: false, export: false, approve: false }
  },

  // Gestión de Activos - Acceso de gestión
  assets: {
    Super_Administrador: { read: true, create: true, update: true, delete: true, export: true, approve: true },
    Gerente: { read: true, create: true, update: true, delete: true, export: true, approve: true },
    Admin: { read: true, create: true, update: true, delete: true, export: true, approve: true },
    Desarrollador: { read: true, create: false, update: false, delete: false, export: false, approve: false },
    Contador: { read: true, create: false, update: false, delete: false, export: false, approve: false },
    Invitado: { read: true, create: false, update: false, delete: false, export: false, approve: false }
  },

  // Permisos del Sistema - Solo Super Admin y Gerente
  permisos: {
    Super_Administrador: { read: true, create: true, update: true, delete: true, export: true, approve: true },
    Gerente: { read: true, create: true, update: true, delete: false, export: true, approve: true },
    Admin: { read: true, create: false, update: false, delete: false, export: false, approve: false },
    Desarrollador: { read: true, create: false, update: false, delete: false, export: false, approve: false },
    Contador: { read: false, create: false, update: false, delete: false, export: false, approve: false },
    Invitado: { read: false, create: false, update: false, delete: false, export: false, approve: false }
  }
};

// =====================================================
// FUNCIÓN PRINCIPAL DE CONFIGURACIÓN
// =====================================================

async function configureModulePermissions() {
  try {

    // Obtener todos los roles
    const roles = await prisma.roles.findMany({
      where: { is_active: true },
      orderBy: { level: 'asc' }
    });

    // Para cada rol, configurar permisos por módulo
    for (const role of roles) {

      // Obtener la configuración de permisos para este rol
      let roleKey;
      switch (role.name) {
        case 'Super Administrador':
          roleKey = 'Super_Administrador';
          break;
        case 'Gerente':
          roleKey = 'Gerente';
          break;
        case 'Admin':
          roleKey = 'Admin';
          break;
        case 'Desarrollador':
          roleKey = 'Desarrollador';
          break;
        case 'Contador':
          roleKey = 'Contador';
          break;
        case 'Invitado':
          roleKey = 'Invitado';
          break;
        default:
          roleKey = role.name.replace(/\s+/g, '_');
      }
      
      const rolePermissions = modulePermissions[roleKey];
      
      if (!rolePermissions) {

        continue;
      }

      // Para cada módulo, configurar permisos
      for (const [moduleName, permissions] of Object.entries(rolePermissions)) {

        // Crear o actualizar el permiso
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
          await prisma.rolePermissions.upsert({
            where: {
              role_id_module: {
                role_id: role.id,
                module: moduleName
              }
            },
            update: {
              can_read: permissions.read,
              can_create: permissions.create,
              can_update: permissions.update,
              can_delete: permissions.delete,
              can_export: permissions.export,
              can_approve: permissions.approve,
              updated_at: new Date()
            },
            create: permissionData
          });

        } catch (error) {
          console.error(`    ❌ Error configurando permisos para ${moduleName}:`, error.message);
        }
      }
    }

    // Mostrar resumen de permisos configurados
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

          if (permission.can_create) permissions.push('➕ Crear');
          if (permission.can_update) permissions.push('✏️ Editar');
          if (permission.can_delete) permissions.push('🗑️ Eliminar');
          if (permission.can_export) permissions.push('📤 Exportar');
          if (permission.can_approve) permissions.push('✅ Aprobar');

        } else {

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
  configureModulePermissions()
    .then(() => {

      process.exit(0);
    })
    .catch((error) => {
      console.error('\n❌ Error en la ejecución:', error);
      process.exit(1);
    });
}

module.exports = { configureModulePermissions };
