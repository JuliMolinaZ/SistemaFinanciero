const { PrismaClient } = require('@prisma/client');
require('dotenv').config({ path: './config.env' });

const prisma = new PrismaClient();

async function insertModulesSimple() {
  try {
    console.log('📋 Insertando módulos del sistema...\n');

    // Insertar módulos uno por uno usando SQL directo
    const modules = [
      "INSERT INTO system_modules (name, display_name, description, icon, route, requires_approval) VALUES ('usuarios', 'Gestión de Usuarios', 'Administración de usuarios, roles y permisos', 'people', '/usuarios', 1)",
      "INSERT INTO system_modules (name, display_name, description, icon, route, requires_approval) VALUES ('clientes', 'Gestión de Clientes', 'Administración de clientes y contactos', 'business', '/clientes', 0)",
      "INSERT INTO system_modules (name, display_name, description, icon, route, requires_approval) VALUES ('proyectos', 'Gestión de Proyectos', 'Administración de proyectos y fases', 'work', '/proyectos', 1)",
      "INSERT INTO system_modules (name, display_name, description, icon, route, requires_approval) VALUES ('contabilidad', 'Contabilidad', 'Gestión contable y financiera', 'account_balance', '/contabilidad', 1)",
      "INSERT INTO system_modules (name, display_name, description, icon, route, requires_approval) VALUES ('costos_fijos', 'Costos Fijos', 'Administración de costos fijos', 'trending_up', '/costos-fijos', 1)",
      "INSERT INTO system_modules (name, display_name, description, icon, route, requires_approval) VALUES ('cotizaciones', 'Cotizaciones', 'Gestión de cotizaciones y presupuestos', 'description', '/cotizaciones', 1)",
      "INSERT INTO system_modules (name, display_name, description, icon, route, requires_approval) VALUES ('cuentas_por_cobrar', 'Cuentas por Cobrar', 'Gestión de cuentas por cobrar', 'account_balance_wallet', '/cuentas-cobrar', 0)",
      "INSERT INTO system_modules (name, display_name, description, icon, route, requires_approval) VALUES ('cuentas_por_pagar', 'Cuentas por Pagar', 'Gestión de cuentas por pagar', 'payment', '/cuentas-pagar', 1)",
      "INSERT INTO system_modules (name, display_name, description, icon, route, requires_approval) VALUES ('proveedores', 'Proveedores', 'Administración de proveedores', 'local_shipping', '/proveedores', 0)",
      "INSERT INTO system_modules (name, display_name, description, icon, route, requires_approval) VALUES ('categorias', 'Categorías', 'Administración de categorías', 'category', '/categorias', 0)",
      "INSERT INTO system_modules (name, display_name, description, icon, route, requires_approval) VALUES ('fases', 'Fases de Proyectos', 'Administración de fases de proyectos', 'timeline', '/fases', 0)",
      "INSERT INTO system_modules (name, display_name, description, icon, route, requires_approval) VALUES ('recuperacion', 'Recuperación', 'Gestión de recuperación de costos', 'restore', '/recuperacion', 1)",
      "INSERT INTO system_modules (name, display_name, description, icon, route, requires_approval) VALUES ('flow_recovery_v2', 'Flow Recovery V2', 'Sistema avanzado de recuperación', 'sync', '/flow-recovery', 1)",
      "INSERT INTO system_modules (name, display_name, description, icon, route, requires_approval) VALUES ('emitidas', 'Facturas Emitidas', 'Gestión de facturas emitidas', 'receipt', '/emitidas', 1)",
      "INSERT INTO system_modules (name, display_name, description, icon, route, requires_approval) VALUES ('permisos', 'Permisos del Sistema', 'Administración de permisos y accesos', 'security', '/permisos', 1)",
      "INSERT INTO system_modules (name, display_name, description, icon, route, requires_approval) VALUES ('reportes', 'Reportes', 'Generación y visualización de reportes', 'assessment', '/reportes', 1)",
      "INSERT INTO system_modules (name, display_name, description, icon, route, requires_approval) VALUES ('auditoria', 'Auditoría', 'Logs de auditoría del sistema', 'history', '/auditoria', 1)"
    ];

    for (const sql of modules) {
      try {
        await prisma.$executeRawUnsafe(sql);
        console.log(`✅ Módulo insertado: ${sql.split("'")[1]}`);
      } catch (error) {
        if (error.message.includes('Duplicate entry')) {
          console.log(`⚠️  Módulo ya existe: ${sql.split("'")[1]}`);
        } else {
          console.log(`❌ Error insertando módulo: ${error.message}`);
        }
      }
    }

    console.log('\n📋 Verificando módulos insertados...');
    try {
      const moduleCount = await prisma.$queryRaw`SELECT COUNT(*) as count FROM system_modules`;
      console.log(`✅ Total de módulos: ${moduleCount[0].count}`);
    } catch (error) {
      console.log(`❌ Error contando módulos: ${error.message}`);
    }

  } catch (error) {
    console.error('❌ Error general:', error);
  } finally {
    await prisma.$disconnect();
  }
}

insertModulesSimple();
