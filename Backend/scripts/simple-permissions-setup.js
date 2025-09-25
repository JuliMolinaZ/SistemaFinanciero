// scripts/simple-permissions-setup.js - Script simple para configurar permisos
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function setupSimplePermissions() {
  try {

    // Obtener roles
    const roles = await prisma.roles.findMany({
      where: { is_active: true },
      orderBy: { level: 'asc' }
    });

    // Configurar permisos para Super Administrador
    const superAdmin = roles.find(r => r.name === 'Super Administrador');
    if (superAdmin) {

      const modules = ['usuarios', 'roles', 'configuracion', 'auditoria', 'clientes', 'proyectos', 'fases', 
                      'cuentas_por_pagar', 'cuentas_por_cobrar', 'contabilidad', 'impuestos_imss', 'costos_fijos',
                      'categorias', 'proveedores', 'dashboard', 'reportes', 'realtime_graph', 'cotizaciones',
                      'emitidas', 'recuperacion', 'flow_recovery_v2', 'moneyflow_recovery', 'complementos_pago',
                      'project_costs', 'horas_extra', 'assets', 'permisos'];
      
      for (const module of modules) {
        try {
          await prisma.rolePermissions.create({
            data: {
              role_id: superAdmin.id,
              module: module,
              can_read: true,
              can_create: true,
              can_update: true,
              can_delete: true,
              can_export: true,
              can_approve: true,
              created_at: new Date(),
              updated_at: new Date()
            }
          });

        } catch (error) {

        }
      }
    }

    // Configurar permisos para Gerente
    const gerente = roles.find(r => r.name === 'Gerente');
    if (gerente) {

      const gerenteModules = {
        'usuarios': { read: true, create: true, update: true, delete: false, export: true, approve: true },
        'roles': { read: true, create: true, update: true, delete: false, export: true, approve: true },
        'configuracion': { read: true, create: true, update: true, delete: false, export: true, approve: true },
        'auditoria': { read: true, create: false, update: false, delete: false, export: true, approve: false },
        'clientes': { read: true, create: true, update: true, delete: true, export: true, approve: true },
        'proyectos': { read: true, create: true, update: true, delete: true, export: true, approve: true },
        'fases': { read: true, create: true, update: true, delete: true, export: true, approve: true },
        'cuentas_por_pagar': { read: true, create: true, update: true, delete: true, export: true, approve: true },
        'cuentas_por_cobrar': { read: true, create: true, update: true, delete: true, export: true, approve: true },
        'contabilidad': { read: true, create: true, update: true, delete: true, export: true, approve: true },
        'impuestos_imss': { read: true, create: true, update: true, delete: true, export: true, approve: true },
        'costos_fijos': { read: true, create: true, update: true, delete: true, export: true, approve: true },
        'categorias': { read: true, create: true, update: true, delete: true, export: true, approve: true },
        'proveedores': { read: true, create: true, update: true, delete: true, export: true, approve: true },
        'dashboard': { read: true, create: false, update: false, delete: false, export: true, approve: false },
        'reportes': { read: true, create: true, update: true, delete: true, export: true, approve: true },
        'realtime_graph': { read: true, create: false, update: false, delete: false, export: true, approve: false },
        'cotizaciones': { read: true, create: true, update: true, delete: true, export: true, approve: true },
        'emitidas': { read: true, create: true, update: true, delete: true, export: true, approve: true },
        'recuperacion': { read: true, create: true, update: true, delete: true, export: true, approve: true },
        'flow_recovery_v2': { read: true, create: true, update: true, delete: true, export: true, approve: true },
        'moneyflow_recovery': { read: true, create: true, update: true, delete: true, export: true, approve: true },
        'complementos_pago': { read: true, create: true, update: true, delete: true, export: true, approve: true },
        'project_costs': { read: true, create: true, update: true, delete: true, export: true, approve: true },
        'horas_extra': { read: true, create: true, update: true, delete: true, export: true, approve: true },
        'assets': { read: true, create: true, update: true, delete: true, export: true, approve: true },
        'permisos': { read: true, create: true, update: true, delete: false, export: true, approve: true }
      };

      for (const [module, permissions] of Object.entries(gerenteModules)) {
        try {
          await prisma.rolePermissions.create({
            data: {
              role_id: gerente.id,
              module: module,
              can_read: permissions.read,
              can_create: permissions.create,
              can_update: permissions.update,
              can_delete: permissions.delete,
              can_export: permissions.export,
              can_approve: permissions.approve,
              created_at: new Date(),
              updated_at: new Date()
            }
          });

        } catch (error) {

        }
      }
    }

    // Configurar permisos para Admin
    const admin = roles.find(r => r.name === 'Admin');
    if (admin) {

      const adminModules = {
        'usuarios': { read: true, create: false, update: false, delete: false, export: false, approve: false },
        'roles': { read: true, create: false, update: false, delete: false, export: false, approve: false },
        'configuracion': { read: true, create: false, update: false, delete: false, export: false, approve: false },
        'auditoria': { read: true, create: false, update: false, delete: false, export: false, approve: false },
        'clientes': { read: true, create: true, update: true, delete: true, export: true, approve: true },
        'proyectos': { read: true, create: true, update: true, delete: true, export: true, approve: true },
        'fases': { read: true, create: true, update: true, delete: true, export: true, approve: true },
        'cuentas_por_pagar': { read: true, create: true, update: true, delete: true, export: true, approve: true },
        'cuentas_por_cobrar': { read: true, create: true, update: true, delete: true, export: true, approve: true },
        'contabilidad': { read: true, create: true, update: true, delete: true, export: true, approve: true },
        'impuestos_imss': { read: true, create: true, update: true, delete: true, export: true, approve: true },
        'costos_fijos': { read: true, create: true, update: true, delete: true, export: true, approve: true },
        'categorias': { read: true, create: true, update: true, delete: true, export: true, approve: true },
        'proveedores': { read: true, create: true, update: true, delete: true, export: true, approve: true },
        'dashboard': { read: true, create: false, update: false, delete: false, export: true, approve: false },
        'reportes': { read: true, create: true, update: true, delete: false, export: true, approve: false },
        'realtime_graph': { read: true, create: false, update: false, delete: false, export: true, approve: false },
        'cotizaciones': { read: true, create: true, update: true, delete: true, export: true, approve: true },
        'emitidas': { read: true, create: true, update: true, delete: true, export: true, approve: true },
        'recuperacion': { read: true, create: true, update: true, delete: true, export: true, approve: true },
        'flow_recovery_v2': { read: true, create: true, update: true, delete: true, export: true, approve: true },
        'moneyflow_recovery': { read: true, create: true, update: true, delete: true, export: true, approve: true },
        'complementos_pago': { read: true, create: true, update: true, delete: true, export: true, approve: true },
        'project_costs': { read: true, create: true, update: true, delete: true, export: true, approve: true },
        'horas_extra': { read: true, create: true, update: true, delete: true, export: true, approve: true },
        'assets': { read: true, create: true, update: true, delete: true, export: true, approve: true },
        'permisos': { read: true, create: false, update: false, delete: false, export: false, approve: false }
      };

      for (const [module, permissions] of Object.entries(adminModules)) {
        try {
          await prisma.rolePermissions.create({
            data: {
              role_id: admin.id,
              module: module,
              can_read: permissions.read,
              can_create: permissions.create,
              can_update: permissions.update,
              can_delete: permissions.delete,
              can_export: permissions.export,
              can_approve: permissions.approve,
              created_at: new Date(),
              updated_at: new Date()
            }
          });

        } catch (error) {

        }
      }
    }

    // Configurar permisos para Contador
    const contador = roles.find(r => r.name === 'Contador');
    if (contador) {

      const contadorModules = {
        'usuarios': { read: false, create: false, update: false, delete: false, export: false, approve: false },
        'roles': { read: false, create: false, update: false, delete: false, export: false, approve: false },
        'configuracion': { read: false, create: false, update: false, delete: false, export: false, approve: false },
        'auditoria': { read: false, create: false, update: false, delete: false, export: false, approve: false },
        'clientes': { read: true, create: false, update: false, delete: false, export: false, approve: false },
        'proyectos': { read: true, create: false, update: false, delete: false, export: false, approve: false },
        'fases': { read: true, create: false, update: false, delete: false, export: false, approve: false },
        'cuentas_por_pagar': { read: true, create: true, update: true, delete: true, export: true, approve: true },
        'cuentas_por_cobrar': { read: true, create: true, update: true, delete: true, export: true, approve: true },
        'contabilidad': { read: true, create: true, update: true, delete: true, export: true, approve: true },
        'impuestos_imss': { read: true, create: true, update: true, delete: true, export: true, approve: true },
        'costos_fijos': { read: true, create: true, update: true, delete: true, export: true, approve: true },
        'categorias': { read: true, create: true, update: true, delete: true, export: true, approve: true },
        'proveedores': { read: true, create: true, update: true, delete: true, export: true, approve: true },
        'dashboard': { read: true, create: false, update: false, delete: false, export: true, approve: false },
        'reportes': { read: true, create: false, update: false, delete: false, export: true, approve: false },
        'realtime_graph': { read: true, create: false, update: false, delete: false, export: true, approve: false },
        'cotizaciones': { read: true, create: false, update: false, delete: false, export: false, approve: false },
        'emitidas': { read: true, create: true, update: true, delete: true, export: true, approve: true },
        'recuperacion': { read: true, create: true, update: true, delete: true, export: true, approve: true },
        'flow_recovery_v2': { read: true, create: true, update: true, delete: true, export: true, approve: true },
        'moneyflow_recovery': { read: true, create: true, update: true, delete: true, export: true, approve: true },
        'complementos_pago': { read: true, create: true, update: true, delete: true, export: true, approve: true },
        'project_costs': { read: true, create: true, update: true, delete: true, export: true, approve: true },
        'horas_extra': { read: true, create: false, update: false, delete: false, export: false, approve: false },
        'assets': { read: true, create: false, update: false, delete: false, export: false, approve: false },
        'permisos': { read: false, create: false, update: false, delete: false, export: false, approve: false }
      };

      for (const [module, permissions] of Object.entries(contadorModules)) {
        try {
          await prisma.rolePermissions.create({
            data: {
              role_id: contador.id,
              module: module,
              can_read: permissions.read,
              can_create: permissions.create,
              can_update: permissions.update,
              can_delete: permissions.delete,
              can_export: permissions.export,
              can_approve: permissions.approve,
              created_at: new Date(),
              updated_at: new Date()
            }
          });

        } catch (error) {

        }
      }
    }

    // Configurar permisos para Desarrollador
    const desarrollador = roles.find(r => r.name === 'Desarrollador');
    if (desarrollador) {

      const desarrolladorModules = {
        'usuarios': { read: true, create: false, update: false, delete: false, export: false, approve: false },
        'roles': { read: true, create: false, update: false, delete: false, export: false, approve: false },
        'configuracion': { read: true, create: false, update: false, delete: false, export: false, approve: false },
        'auditoria': { read: true, create: false, update: false, delete: false, export: false, approve: false },
        'clientes': { read: true, create: false, update: false, delete: false, export: false, approve: false },
        'proyectos': { read: true, create: false, update: false, delete: false, export: false, approve: false },
        'fases': { read: true, create: false, update: false, delete: false, export: false, approve: false },
        'cuentas_por_pagar': { read: false, create: false, update: false, delete: false, export: false, approve: false },
        'cuentas_por_cobrar': { read: false, create: false, update: false, delete: false, export: false, approve: false },
        'contabilidad': { read: false, create: false, update: false, delete: false, export: false, approve: false },
        'impuestos_imss': { read: false, create: false, update: false, delete: false, export: false, approve: false },
        'costos_fijos': { read: false, create: false, update: false, delete: false, export: false, approve: false },
        'categorias': { read: true, create: false, update: false, delete: false, export: false, approve: false },
        'proveedores': { read: true, create: false, update: false, delete: false, export: false, approve: false },
        'dashboard': { read: true, create: false, update: false, delete: false, export: false, approve: false },
        'reportes': { read: true, create: false, update: false, delete: false, export: false, approve: false },
        'realtime_graph': { read: true, create: false, update: false, delete: false, export: false, approve: false },
        'cotizaciones': { read: false, create: false, update: false, delete: false, export: false, approve: false },
        'emitidas': { read: false, create: false, update: false, delete: false, export: false, approve: false },
        'recuperacion': { read: false, create: false, update: false, delete: false, export: false, approve: false },
        'flow_recovery_v2': { read: false, create: false, update: false, delete: false, export: false, approve: false },
        'moneyflow_recovery': { read: false, create: false, update: false, delete: false, export: false, approve: false },
        'complementos_pago': { read: false, create: false, update: false, delete: false, export: false, approve: false },
        'project_costs': { read: false, create: false, update: false, delete: false, export: false, approve: false },
        'horas_extra': { read: false, create: false, update: false, delete: false, export: false, approve: false },
        'assets': { read: true, create: false, update: false, delete: false, export: false, approve: false },
        'permisos': { read: true, create: false, update: false, delete: false, export: false, approve: false }
      };

      for (const [module, permissions] of Object.entries(desarrolladorModules)) {
        try {
          await prisma.rolePermissions.create({
            data: {
              role_id: desarrollador.id,
              module: module,
              can_read: permissions.read,
              can_create: permissions.create,
              can_update: permissions.update,
              can_delete: permissions.delete,
              can_export: permissions.export,
              can_approve: permissions.approve,
              created_at: new Date(),
              updated_at: new Date()
            }
          });

        } catch (error) {

        }
      }
    }

    // Configurar permisos para Invitado
    const invitado = roles.find(r => r.name === 'Invitado');
    if (invitado) {

      const invitadoModules = {
        'usuarios': { read: false, create: false, update: false, delete: false, export: false, approve: false },
        'roles': { read: false, create: false, update: false, delete: false, export: false, approve: false },
        'configuracion': { read: false, create: false, update: false, delete: false, export: false, approve: false },
        'auditoria': { read: false, create: false, update: false, delete: false, export: false, approve: false },
        'clientes': { read: true, create: false, update: false, delete: false, export: false, approve: false },
        'proyectos': { read: true, create: false, update: false, delete: false, export: false, approve: false },
        'fases': { read: true, create: false, update: false, delete: false, export: false, approve: false },
        'cuentas_por_pagar': { read: false, create: false, update: false, delete: false, export: false, approve: false },
        'cuentas_por_cobrar': { read: false, create: false, update: false, delete: false, export: false, approve: false },
        'contabilidad': { read: false, create: false, update: false, delete: false, export: false, approve: false },
        'impuestos_imss': { read: false, create: false, update: false, delete: false, export: false, approve: false },
        'costos_fijos': { read: false, create: false, update: false, delete: false, export: false, approve: false },
        'categorias': { read: true, create: false, update: false, delete: false, export: false, approve: false },
        'proveedores': { read: true, create: false, update: false, delete: false, export: false, approve: false },
        'dashboard': { read: true, create: false, update: false, delete: false, export: false, approve: false },
        'reportes': { read: false, create: false, update: false, delete: false, export: false, approve: false },
        'realtime_graph': { read: true, create: false, update: false, delete: false, export: false, approve: false },
        'cotizaciones': { read: false, create: false, update: false, delete: false, export: false, approve: false },
        'emitidas': { read: false, create: false, update: false, delete: false, export: false, approve: false },
        'recuperacion': { read: false, create: false, update: false, delete: false, export: false, approve: false },
        'flow_recovery_v2': { read: false, create: false, update: false, delete: false, export: false, approve: false },
        'moneyflow_recovery': { read: false, create: false, update: false, delete: false, export: false, approve: false },
        'complementos_pago': { read: false, create: false, update: false, delete: false, export: false, approve: false },
        'project_costs': { read: false, create: false, update: false, delete: false, export: false, approve: false },
        'horas_extra': { read: false, create: false, update: false, delete: false, export: false, approve: false },
        'assets': { read: true, create: false, update: false, delete: false, export: false, approve: false },
        'permisos': { read: false, create: false, update: false, delete: false, export: false, approve: false }
      };

      for (const [module, permissions] of Object.entries(invitadoModules)) {
        try {
          await prisma.rolePermissions.create({
            data: {
              role_id: invitado.id,
              module: module,
              can_read: permissions.read,
              can_create: permissions.create,
              can_update: permissions.update,
              can_delete: permissions.delete,
              can_export: permissions.export,
              can_approve: permissions.approve,
              created_at: new Date(),
              updated_at: new Date()
            }
          });

        } catch (error) {

        }
      }
    }

    // Mostrar resumen
    await showPermissionsSummary();
    
  } catch (error) {
    console.error('❌ Error en la configuración:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

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

if (require.main === module) {
  setupSimplePermissions()
    .then(() => {

      process.exit(0);
    })
    .catch((error) => {
      console.error('\n❌ Error en la ejecución:', error);
      process.exit(1);
    });
}

module.exports = { setupSimplePermissions };
