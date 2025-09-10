// Script para limpiar datos de prueba de cuentas por pagar
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function cleanupTestData() {
  try {
    console.log('🧹 Iniciando limpieza de datos de prueba...');
    
    // Identificar cuentas de prueba por patrones comunes
    const testPatterns = [
      'test',
      'prueba',
      'ejemplo',
      'demo',
      'sample',
      'temporal',
      'temp',
      'borrar',
      'eliminar'
    ];
    
    // Buscar cuentas que coincidan con patrones de prueba
    const testCuentas = await prisma.cuentaPagar.findMany({
      where: {
        OR: [
          {
            concepto: {
              contains: 'test',
              mode: 'insensitive'
            }
          },
          {
            concepto: {
              contains: 'prueba',
              mode: 'insensitive'
            }
          },
          {
            concepto: {
              contains: 'ejemplo',
              mode: 'insensitive'
            }
          },
          {
            concepto: {
              contains: 'demo',
              mode: 'insensitive'
            }
          },
          {
            concepto: {
              contains: 'sample',
              mode: 'insensitive'
            }
          },
          {
            concepto: {
              contains: 'temporal',
              mode: 'insensitive'
            }
          },
          {
            concepto: {
              contains: 'temp',
              mode: 'insensitive'
            }
          },
          {
            concepto: {
              contains: 'borrar',
              mode: 'insensitive'
            }
          },
          {
            concepto: {
              contains: 'eliminar',
              mode: 'insensitive'
            }
          },
          // Cuentas con monto 0 (posiblemente de prueba)
          {
            monto_con_iva: 0
          },
          // Cuentas sin proveedor asignado (posiblemente de prueba)
          {
            proveedor_id: null
          }
        ]
      }
    });
    
    console.log(`📊 Encontradas ${testCuentas.length} cuentas que podrían ser de prueba`);
    
    if (testCuentas.length === 0) {
      console.log('✅ No se encontraron datos de prueba para eliminar');
      return;
    }
    
    // Mostrar las cuentas que se van a eliminar
    console.log('\n📋 Cuentas que se eliminarán:');
    testCuentas.forEach((cuenta, index) => {
      console.log(`${index + 1}. ID: ${cuenta.id} | Concepto: ${cuenta.concepto} | Monto: $${cuenta.monto_con_iva} | Proveedor: ${cuenta.proveedor_id ? 'Asignado' : 'Sin asignar'}`);
    });
    
    // Confirmar eliminación
    console.log('\n⚠️  ADVERTENCIA: Esta acción eliminará permanentemente las cuentas de prueba.');
    console.log('💡 Si estás seguro, descomenta la siguiente línea en el código:');
    console.log('// await prisma.cuentaPagar.deleteMany({ where: { id: { in: testCuentas.map(c => c.id) } } });');
    
    // Descomenta la siguiente línea para ejecutar la eliminación real
    // await prisma.cuentaPagar.deleteMany({
    //   where: {
    //     id: {
    //       in: testCuentas.map(c => c.id)
    //     }
    //   }
    // });
    
    // console.log(`✅ Se eliminaron ${testCuentas.length} cuentas de prueba`);
    
    // Mostrar estadísticas después de la limpieza
    const totalCuentas = await prisma.cuentaPagar.count();
    const cuentasConProveedor = await prisma.cuentaPagar.count({
      where: {
        proveedor_id: {
          not: null
        }
      }
    });
    const cuentasPagadas = await prisma.cuentaPagar.count({
      where: {
        pagado: true
      }
    });
    
    console.log('\n📊 Estadísticas después de la limpieza:');
    console.log(`- Total de cuentas: ${totalCuentas}`);
    console.log(`- Cuentas con proveedor: ${cuentasConProveedor}`);
    console.log(`- Cuentas pagadas: ${cuentasPagadas}`);
    console.log(`- Cuentas pendientes: ${totalCuentas - cuentasPagadas}`);
    
  } catch (error) {
    console.error('❌ Error durante la limpieza:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar la limpieza
cleanupTestData();
