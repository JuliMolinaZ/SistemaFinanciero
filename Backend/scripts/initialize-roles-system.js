// scripts/initialize-roles-system.js - Script para inicializar el sistema de roles y permisos
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// =====================================================
// ROLES DEL SISTEMA
// =====================================================

const systemRoles = [
  {
    name: 'Super Administrador',
    description: 'Acceso completo al sistema. Puede hacer TODO y ver TODO.',
    level: 1,
    is_active: true
  },
  {
    name: 'Gerente',
    description: 'Gerente del sistema con acceso amplio a la gestión y configuración.',
    level: 2,
    is_active: true
  },
  {
    name: 'Admin',
    description: 'Administrador con acceso a la mayoría de funcionalidades del sistema.',
    level: 3,
    is_active: true
  },
  {
    name: 'Desarrollador',
    description: 'Desarrollador con acceso a módulos técnicos y de desarrollo.',
    level: 4,
    is_active: true
  },
  {
    name: 'Contador',
    description: 'Contador con acceso a módulos financieros y contables.',
    level: 5,
    is_active: true
  },
  {
    name: 'Invitado',
    description: 'Usuario invitado con acceso limitado al sistema.',
    level: 6,
    is_active: true
  }
];

// =====================================================
// MÓDULOS DEL SISTEMA
// =====================================================

const systemModules = [
  {
    name: 'usuarios',
    display_name: 'Gestión de Usuarios',
    description: 'Módulo para gestionar usuarios del sistema',
    icon: 'people',
    route: '/usuarios',
    is_active: true,
    requires_approval: false
  },
  {
    name: 'roles',
    display_name: 'Gestión de Roles',
    description: 'Módulo para gestionar roles y permisos del sistema',
    icon: 'security',
    route: '/roles',
    is_active: true,
    requires_approval: true
  },
  {
    name: 'clientes',
    display_name: 'Gestión de Clientes',
    description: 'Módulo para gestionar clientes del sistema',
    icon: 'business',
    route: '/clientes',
    is_active: true,
    requires_approval: false
  },
  {
    name: 'proyectos',
    display_name: 'Gestión de Proyectos',
    description: 'Módulo para gestionar proyectos del sistema',
    icon: 'work',
    route: '/proyectos',
    is_active: true,
    requires_approval: false
  },
  {
    name: 'cuentas_por_pagar',
    display_name: 'Cuentas por Pagar',
    description: 'Módulo para gestionar cuentas por pagar',
    icon: 'account_balance',
    route: '/cuentas-por-pagar',
    is_active: true,
    requires_approval: true
  },
  {
    name: 'cuentas_por_cobrar',
    display_name: 'Cuentas por Cobrar',
    description: 'Módulo para gestionar cuentas por cobrar',
    icon: 'account_balance_wallet',
    route: '/cuentas-por-cobrar',
    is_active: true,
    requires_approval: true
  },
  {
    name: 'contabilidad',
    display_name: 'Contabilidad',
    description: 'Módulo para gestión contable',
    icon: 'calculate',
    route: '/contabilidad',
    is_active: true,
    requires_approval: true
  },
  {
    name: 'impuestos_imss',
    display_name: 'Impuestos IMSS',
    description: 'Módulo para gestión de impuestos IMSS',
    icon: 'receipt',
    route: '/impuestos-imss',
    is_active: true,
    requires_approval: true
  },
  {
    name: 'costos_fijos',
    display_name: 'Costos Fijos',
    description: 'Módulo para gestión de costos fijos',
    icon: 'trending_up',
    route: '/costos-fijos',
    is_active: true,
    requires_approval: true
  },
  {
    name: 'categorias',
    display_name: 'Categorías',
    description: 'Módulo para gestión de categorías',
    icon: 'category',
    route: '/categorias',
    is_active: true,
    requires_approval: false
  },
  {
    name: 'proveedores',
    display_name: 'Proveedores',
    description: 'Módulo para gestión de proveedores',
    icon: 'local_shipping',
    route: '/proveedores',
    is_active: true,
    requires_approval: false
  },
  {
    name: 'reportes',
    display_name: 'Reportes',
    description: 'Módulo para generación de reportes',
    icon: 'assessment',
    route: '/reportes',
    is_active: true,
    requires_approval: true
  },
  {
    name: 'configuracion',
    display_name: 'Configuración',
    description: 'Módulo para configuración del sistema',
    icon: 'settings',
    route: '/configuracion',
    is_active: true,
    requires_approval: true
  }
];

// =====================================================
// PERMISOS POR ROL
// =====================================================

const getRolePermissions = (roleName) => {
  const permissions = [];
  
  systemModules.forEach(module => {
    let can_read = false;
    let can_create = false;
    let can_update = false;
    let can_delete = false;
    let can_export = false;
    let can_approve = false;

    switch (roleName) {
      case 'Super Administrador':
        // Super Admin tiene todos los permisos
        can_read = true;
        can_create = true;
        can_update = true;
        can_delete = true;
        can_export = true;
        can_approve = true;
        break;
        
      case 'Gerente':
        // Gerente tiene acceso amplio
        can_read = true;
        can_create = true;
        can_update = true;
        can_delete = true;
        can_export = true;
        can_approve = true;
        break;
        
      case 'Admin':
        // Admin tiene acceso a la mayoría de funcionalidades
        can_read = true;
        can_create = true;
        can_update = true;
        can_delete = module.name !== 'usuarios' && module.name !== 'roles'; // No puede eliminar usuarios ni roles
        can_export = true;
        can_approve = module.name !== 'roles'; // No puede aprobar cambios en roles
        break;
        
      case 'Desarrollador':
        // Desarrollador tiene acceso técnico
        can_read = ['usuarios', 'roles', 'configuracion', 'reportes'].includes(module.name);
        can_create = ['configuracion', 'reportes'].includes(module.name);
        can_update = ['configuracion', 'reportes'].includes(module.name);
        can_delete = false;
        can_export = ['reportes'].includes(module.name);
        can_approve = false;
        break;
        
      case 'Contador':
        // Contador tiene acceso a módulos financieros
        can_read = ['cuentas_por_pagar', 'cuentas_por_cobrar', 'contabilidad', 'impuestos_imss', 'costos_fijos', 'categorias', 'proveedores', 'reportes'].includes(module.name);
        can_create = ['cuentas_por_pagar', 'cuentas_por_cobrar', 'contabilidad', 'impuestos_imss', 'costos_fijos', 'categorias', 'proveedores'].includes(module.name);
        can_update = ['cuentas_por_pagar', 'cuentas_por_cobrar', 'contabilidad', 'impuestos_imss', 'costos_fijos', 'categorias', 'proveedores'].includes(module.name);
        can_delete = ['cuentas_por_pagar', 'cuentas_por_cobrar', 'contabilidad', 'impuestos_imss', 'costos_fijos'].includes(module.name);
        can_export = ['cuentas_por_pagar', 'cuentas_por_cobrar', 'contabilidad', 'impuestos_imss', 'costos_fijos', 'reportes'].includes(module.name);
        can_approve = ['cuentas_por_pagar', 'cuentas_por_cobrar', 'contabilidad', 'impuestos_imss', 'costos_fijos'].includes(module.name);
        break;
        
      case 'Invitado':
        // Invitado tiene acceso muy limitado
        can_read = ['categorias', 'proveedores'].includes(module.name);
        can_create = false;
        can_update = false;
        can_delete = false;
        can_export = false;
        can_approve = false;
        break;
        
      default:
        // Por defecto, sin permisos
        can_read = false;
        can_create = false;
        can_update = false;
        can_delete = false;
        can_export = false;
        can_approve = false;
    }

    permissions.push({
      module: module.name,
      can_read,
      can_create,
      can_update,
      can_delete,
      can_export,
      can_approve
    });
  });
  
  return permissions;
};

// =====================================================
// FUNCIÓN PRINCIPAL DE INICIALIZACIÓN
// =====================================================

async function initializeRolesSystem() {
  try {
    console.log('🚀 Iniciando sistema de roles y permisos...');
    
    // 1. Crear módulos del sistema
    console.log('📦 Creando módulos del sistema...');
    for (const module of systemModules) {
      const existingModule = await prisma.systemModules.findUnique({
        where: { name: module.name }
      });
      
      if (!existingModule) {
        await prisma.systemModules.create({
          data: module
        });
        console.log(`✅ Módulo creado: ${module.display_name}`);
      } else {
        console.log(`ℹ️ Módulo ya existe: ${module.display_name}`);
      }
    }
    
    // 2. Crear roles del sistema
    console.log('👥 Creando roles del sistema...');
    for (const role of systemRoles) {
      const existingRole = await prisma.roles.findUnique({
        where: { name: role.name }
      });
      
      if (!existingRole) {
        await prisma.roles.create({
          data: role
        });
        console.log(`✅ Rol creado: ${role.name}`);
      } else {
        console.log(`ℹ️ Rol ya existe: ${role.name}`);
      }
    }
    
    // 3. Configurar permisos para cada rol
    console.log('🔐 Configurando permisos para cada rol...');
    for (const role of systemRoles) {
      const dbRole = await prisma.roles.findUnique({
        where: { name: role.name }
      });
      
      if (dbRole) {
        const permissions = getRolePermissions(role.name);
        
        for (const permission of permissions) {
          // Crear o actualizar permiso
          await prisma.rolePermissions.upsert({
                      where: {
            role_id_module: {
              role_id: dbRole.id,
              module: permission.module
            }
          },
            update: {
              can_read: permission.can_read,
              can_create: permission.can_create,
              can_update: permission.can_update,
              can_delete: permission.can_delete,
              can_export: permission.can_export,
              can_approve: permission.can_approve,
              updated_at: new Date()
            },
            create: {
              role_id: dbRole.id,
              module: permission.module,
              can_read: permission.can_read,
              can_create: permission.can_create,
              can_update: permission.can_update,
              can_delete: permission.can_delete,
              can_export: permission.can_export,
              can_approve: permission.can_approve,
              created_at: new Date(),
              updated_at: new Date()
            }
          });
        }
        
        console.log(`✅ Permisos configurados para: ${role.name}`);
      }
    }
    
    console.log('🎉 Sistema de roles y permisos inicializado exitosamente!');
    
  } catch (error) {
    console.error('❌ Error al inicializar sistema de roles:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// =====================================================
// EJECUTAR SCRIPT
// =====================================================

if (require.main === module) {
  initializeRolesSystem()
    .then(() => {
      console.log('✅ Script ejecutado exitosamente');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Error en la ejecución:', error);
      process.exit(1);
    });
}

module.exports = { initializeRolesSystem };
