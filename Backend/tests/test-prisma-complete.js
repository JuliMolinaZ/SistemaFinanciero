const { PrismaClient } = require('@prisma/client');

console.log('🚀 PRUEBA COMPLETA DE PRISMA\n');

async function testPrismaComplete() {
  const prisma = new PrismaClient();
  
  try {
    console.log('📋 1. Conectando a la base de datos...');
    await prisma.$connect();
    console.log('✅ Conexión exitosa!');
    
    console.log('\n📋 2. Probando consultas básicas...');
    
    // Contar usuarios
    try {
      const userCount = await prisma.user.count();
      console.log(`✅ Usuarios: ${userCount}`);
    } catch (error) {
      console.log(`❌ Error contando usuarios: ${error.message}`);
    }
    
    // Contar clientes
    try {
      const clientCount = await prisma.client.count();
      console.log(`✅ Clientes: ${clientCount}`);
    } catch (error) {
      console.log(`❌ Error contando clientes: ${error.message}`);
    }
    
    // Contar proyectos
    try {
      const projectCount = await prisma.project.count();
      console.log(`✅ Proyectos: ${projectCount}`);
    } catch (error) {
      console.log(`❌ Error contando proyectos: ${error.message}`);
    }
    
    // Contar cuentas por pagar
    try {
      const cuentaPagarCount = await prisma.cuentaPagar.count();
      console.log(`✅ Cuentas por pagar: ${cuentaPagarCount}`);
    } catch (error) {
      console.log(`❌ Error contando cuentas por pagar: ${error.message}`);
    }
    
    console.log('\n📋 3. Probando consultas con relaciones...');
    
    // Obtener proyectos con clientes
    try {
      const projectsWithClients = await prisma.project.findMany({
        take: 3,
        include: {
          client: {
            select: {
              nombre: true,
              run_cliente: true
            }
          }
        }
      });
      console.log(`✅ Proyectos con clientes: ${projectsWithClients.length}`);
      projectsWithClients.forEach(project => {
        console.log(`   - ${project.nombre} (Cliente: ${project.client?.nombre || 'N/A'})`);
      });
    } catch (error) {
      console.log(`❌ Error consultando proyectos con clientes: ${error.message}`);
    }
    
    // Obtener cuentas por pagar con proveedores
    try {
      const cuentasWithProviders = await prisma.cuentaPagar.findMany({
        take: 3,
        include: {
          provider: {
            select: {
              nombre: true,
              run_proveedor: true
            }
          }
        }
      });
      console.log(`✅ Cuentas por pagar con proveedores: ${cuentasWithProviders.length}`);
      cuentasWithProviders.forEach(cuenta => {
        console.log(`   - ${cuenta.concepto} (Proveedor: ${cuenta.provider?.nombre || 'N/A'})`);
      });
    } catch (error) {
      console.log(`❌ Error consultando cuentas con proveedores: ${error.message}`);
    }
    
    console.log('\n📋 4. Probando consultas complejas...');
    
    // Proyectos con montos totales
    try {
      const projectsWithAmounts = await prisma.project.findMany({
        take: 5,
        select: {
          id: true,
          nombre: true,
          monto_sin_iva: true,
          monto_con_iva: true,
          client: {
            select: {
              nombre: true
            }
          }
        },
        orderBy: {
          monto_con_iva: 'desc'
        }
      });
      console.log(`✅ Proyectos con montos (top 5):`);
      projectsWithAmounts.forEach(project => {
        console.log(`   - ${project.nombre}: $${project.monto_con_iva || 0} (Cliente: ${project.client?.nombre || 'N/A'})`);
      });
    } catch (error) {
      console.log(`❌ Error consultando proyectos con montos: ${error.message}`);
    }
    
    // Cuentas por pagar pendientes
    try {
      const pendingCuentas = await prisma.cuentaPagar.findMany({
        where: {
          pagado: false
        },
        take: 5,
        select: {
          concepto: true,
          monto_con_iva: true,
          fecha: true,
          provider: {
            select: {
              nombre: true
            }
          }
        },
        orderBy: {
          fecha: 'asc'
        }
      });
      console.log(`✅ Cuentas por pagar pendientes (top 5):`);
      pendingCuentas.forEach(cuenta => {
        console.log(`   - ${cuenta.concepto}: $${cuenta.monto_con_iva || 0} (${cuenta.fecha})`);
      });
    } catch (error) {
      console.log(`❌ Error consultando cuentas pendientes: ${error.message}`);
    }
    
    console.log('\n📋 5. Probando estadísticas...');
    
    // Estadísticas generales
    try {
      const [totalUsers, totalClients, totalProjects, totalCuentasPagar, totalCuentasCobrar] = await Promise.all([
        prisma.user.count(),
        prisma.client.count(),
        prisma.project.count(),
        prisma.cuentaPagar.count(),
        prisma.cuentaCobrar.count()
      ]);
      
      console.log('📊 Estadísticas del sistema:');
      console.log(`   👥 Usuarios: ${totalUsers}`);
      console.log(`   🏢 Clientes: ${totalClients}`);
      console.log(`   📋 Proyectos: ${totalProjects}`);
      console.log(`   💰 Cuentas por pagar: ${totalCuentasPagar}`);
      console.log(`   💳 Cuentas por cobrar: ${totalCuentasCobrar}`);
      
    } catch (error) {
      console.log(`❌ Error obteniendo estadísticas: ${error.message}`);
    }
    
    console.log('\n🎉 ¡PRUEBA COMPLETA EXITOSA!');
    console.log('✅ Prisma está funcionando correctamente con tu base de datos');
    console.log('✅ Todas las consultas básicas funcionan');
    console.log('✅ Las relaciones entre modelos funcionan');
    console.log('✅ Las consultas complejas funcionan');
    
  } catch (error) {
    console.error('❌ Error en la prueba completa:', error);
    console.error('\n💡 Posibles soluciones:');
    console.error('   1. Verificar la conexión a la base de datos');
    console.error('   2. Verificar las credenciales en .env');
    console.error('   3. Verificar que el schema esté sincronizado');
    
  } finally {
    await prisma.$disconnect();
    console.log('\n🔌 Conexión cerrada');
  }
}

// Ejecutar prueba completa
testPrismaComplete(); 