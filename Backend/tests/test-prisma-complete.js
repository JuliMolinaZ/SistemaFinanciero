const { PrismaClient } = require('@prisma/client');

async function testPrismaComplete() {
  const prisma = new PrismaClient();
  
  try {

    await prisma.$connect();

    // Contar usuarios
    try {
      const userCount = await prisma.user.count();

    } catch (error) {

    }
    
    // Contar clientes
    try {
      const clientCount = await prisma.client.count();

    } catch (error) {

    }
    
    // Contar proyectos
    try {
      const projectCount = await prisma.project.count();

    } catch (error) {

    }
    
    // Contar cuentas por pagar
    try {
      const cuentaPagarCount = await prisma.cuentaPagar.count();

    } catch (error) {

    }

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

      projectsWithClients.forEach(project => {

      });
    } catch (error) {

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

      cuentasWithProviders.forEach(cuenta => {

      });
    } catch (error) {

    }

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

      projectsWithAmounts.forEach(project => {

      });
    } catch (error) {

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

      pendingCuentas.forEach(cuenta => {

      });
    } catch (error) {

    }

    // Estadísticas generales
    try {
      const [totalUsers, totalClients, totalProjects, totalCuentasPagar, totalCuentasCobrar] = await Promise.all([
        prisma.user.count(),
        prisma.client.count(),
        prisma.project.count(),
        prisma.cuentaPagar.count(),
        prisma.cuentaCobrar.count()
      ]);

    } catch (error) {

    }

  } catch (error) {
    console.error('❌ Error en la prueba completa:', error);
    console.error('\n💡 Posibles soluciones:');
    console.error('   1. Verificar la conexión a la base de datos');
    console.error('   2. Verificar las credenciales en .env');
    console.error('   3. Verificar que el schema esté sincronizado');
    
  } finally {
    await prisma.$disconnect();

  }
}

// Ejecutar prueba completa
testPrismaComplete(); 