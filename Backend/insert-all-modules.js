const { PrismaClient } = require('@prisma/client');
require('dotenv').config({ path: './config.env' });

const prisma = new PrismaClient();

async function insertAllModules() {
  try {
    console.log('🚀 Insertando todos los módulos del sistema...\n');

    // Lista completa de módulos del sistema
    const allModules = [
      // Módulos principales
      { 
        name: 'usuarios', 
        display_name: 'Gestión de Usuarios', 
        description: 'Administración de usuarios, roles y permisos del sistema',
        icon: 'people',
        route: '/usuarios',
        requires_approval: true
      },
      { 
        name: 'clientes', 
        display_name: 'Gestión de Clientes', 
        description: 'Administración de clientes y contactos',
        icon: 'business',
        route: '/clientes',
        requires_approval: false
      },
      { 
        name: 'proyectos', 
        display_name: 'Gestión de Proyectos', 
        description: 'Administración de proyectos y fases',
        icon: 'work',
        route: '/proyectos',
        requires_approval: true
      },
      { 
        name: 'proveedores', 
        display_name: 'Gestión de Proveedores', 
        description: 'Administración de proveedores y contactos',
        icon: 'local_shipping',
        route: '/proveedores',
        requires_approval: false
      },
      
      // Módulos financieros
      { 
        name: 'contabilidad', 
        display_name: 'Contabilidad', 
        description: 'Gestión contable y financiera del sistema',
        icon: 'account_balance',
        route: '/contabilidad',
        requires_approval: true
      },
      { 
        name: 'cuentas_por_pagar', 
        display_name: 'Cuentas por Pagar', 
        description: 'Gestión de cuentas por pagar y obligaciones',
        icon: 'payment',
        route: '/cuentas-pagar',
        requires_approval: true
      },
      { 
        name: 'cuentas_por_cobrar', 
        display_name: 'Cuentas por Cobrar', 
        description: 'Gestión de cuentas por cobrar y facturación',
        icon: 'account_balance_wallet',
        route: '/cuentas-cobrar',
        requires_approval: false
      },
      { 
        name: 'costos_fijos', 
        display_name: 'Costos Fijos', 
        description: 'Administración de costos fijos y gastos recurrentes',
        icon: 'trending_up',
        route: '/costos-fijos',
        requires_approval: true
      },
      
      // Módulos de gestión
      { 
        name: 'categorias', 
        display_name: 'Gestión de Categorías', 
        description: 'Administración de categorías y clasificaciones',
        icon: 'category',
        route: '/categorias',
        requires_approval: false
      },
      { 
        name: 'fases', 
        display_name: 'Fases de Proyectos', 
        description: 'Gestión de fases y etapas de proyectos',
        icon: 'timeline',
        route: '/fases',
        requires_approval: false
      },
      { 
        name: 'cotizaciones', 
        display_name: 'Cotizaciones', 
        description: 'Gestión de cotizaciones y presupuestos',
        icon: 'description',
        route: '/cotizaciones',
        requires_approval: true
      },
      { 
        name: 'assets', 
        display_name: 'Gestión de Activos', 
        description: 'Administración de activos y recursos',
        icon: 'inventory',
        route: '/assets',
        requires_approval: false
      },
      
      // Módulos de recuperación
      { 
        name: 'recuperacion', 
        display_name: 'Recuperación', 
        description: 'Módulo de recuperación de flujo de dinero',
        icon: 'sync',
        route: '/recuperacion',
        requires_approval: true
      },
      { 
        name: 'flow_recovery_v2', 
        display_name: 'Flow Recovery V2', 
        description: 'Sistema de recuperación de flujo avanzado',
        icon: 'sync_alt',
        route: '/flow-recovery-v2',
        requires_approval: true
      },
      { 
        name: 'moneyflow_recovery', 
        display_name: 'MoneyFlow Recovery', 
        description: 'Gestión de recuperación de flujo de dinero',
        icon: 'account_balance',
        route: '/moneyflow-recovery',
        requires_approval: true
      },
      
      // Módulos adicionales
      { 
        name: 'emitidas', 
        display_name: 'Facturas Emitidas', 
        description: 'Gestión de facturas emitidas y documentos',
        icon: 'receipt',
        route: '/emitidas',
        requires_approval: false
      },
      { 
        name: 'complementos_pago', 
        display_name: 'Complementos de Pago', 
        description: 'Gestión de complementos de pago',
        icon: 'receipt_long',
        route: '/complementos-pago',
        requires_approval: true
      },
      { 
        name: 'impuestos_imss', 
        display_name: 'Impuestos IMSS', 
        description: 'Gestión de impuestos IMSS y obligaciones',
        icon: 'account_balance',
        route: '/impuestos-imss',
        requires_approval: true
      },
      { 
        name: 'project_costs', 
        display_name: 'Costos de Proyectos', 
        description: 'Gestión de costos específicos por proyecto',
        icon: 'calculate',
        route: '/project-costs',
        requires_approval: true
      },
      
      // Módulos de sistema
      { 
        name: 'permisos', 
        display_name: 'Permisos del Sistema', 
        description: 'Gestión de permisos y configuraciones',
        icon: 'security',
        route: '/permisos',
        requires_approval: true
      },
      { 
        name: 'reportes', 
        display_name: 'Reportes', 
        description: 'Generación de reportes y estadísticas',
        icon: 'assessment',
        route: '/reportes',
        requires_approval: false
      },
      { 
        name: 'configuracion', 
        display_name: 'Configuración', 
        description: 'Configuración general del sistema',
        icon: 'settings',
        route: '/configuracion',
        requires_approval: true
      },
      { 
        name: 'horas_extra', 
        display_name: 'Horas Extra', 
        description: 'Gestión de horas extra y tiempo adicional',
        icon: 'schedule',
        route: '/horas-extra',
        requires_approval: true
      }
    ];

    console.log(`📋 Total de módulos a insertar: ${allModules.length}\n`);

    // Insertar módulos uno por uno
    for (const module of allModules) {
      try {
        // Verificar si el módulo ya existe
        const existingModule = await prisma.systemModules.findUnique({
          where: { name: module.name }
        });

        if (existingModule) {
          console.log(`✅ Módulo "${module.display_name}" ya existe (${module.name})`);
        } else {
          // Insertar nuevo módulo
          const newModule = await prisma.systemModules.create({
            data: {
              name: module.name,
              display_name: module.display_name,
              description: module.description,
              icon: module.icon,
              route: module.route,
              requires_approval: module.requires_approval,
              is_active: true
            }
          });
          console.log(`✅ Módulo "${module.display_name}" insertado exitosamente (ID: ${newModule.id})`);
        }
      } catch (error) {
        console.error(`❌ Error al insertar módulo "${module.display_name}":`, error.message);
      }
    }

    // Verificar módulos insertados
    const totalModules = await prisma.systemModules.count();
    console.log(`\n📊 Total de módulos en la base de datos: ${totalModules}`);

    // Mostrar resumen
    const activeModules = await prisma.systemModules.findMany({
      where: { is_active: true },
      select: { name: true, display_name: true, requires_approval: true }
    });

    console.log('\n📋 Resumen de módulos activos:');
    activeModules.forEach(module => {
      const approvalStatus = module.requires_approval ? '🔒 Requiere Aprobación' : '🔓 Sin Aprobación';
      console.log(`   • ${module.display_name} (${module.name}) - ${approvalStatus}`);
    });

    console.log('\n🎉 Inserción de módulos completada exitosamente!');

  } catch (error) {
    console.error('❌ Error general:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar la función
insertAllModules();
