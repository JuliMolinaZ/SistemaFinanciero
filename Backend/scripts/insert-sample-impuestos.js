// Script para insertar datos de prueba en la tabla de impuestos e IMSS
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function insertSampleImpuestos() {
  try {
    console.log('🚀 Iniciando inserción de datos de prueba...');
    
    // Verificar si ya hay datos
    const existingCount = await prisma.$queryRaw`SELECT COUNT(*) as total FROM impuestos_imss`;
    if (existingCount[0].total > 0) {
      console.log(`✅ Ya existen ${existingCount[0].total} registros en la tabla`);
      return;
    }
    
    // Datos de ejemplo
    const sampleData = [
      {
        concepto: 'ISR Mensual Enero 2024',
        tipo_impuesto: 'ISR',
        monto_base: 50000.00,
        monto_impuesto: 5000.00,
        monto_total: 55000.00,
        fecha_vencimiento: '2024-02-17',
        periodo: 'Enero 2024',
        estado: 'pendiente',
        comentarios: 'ISR retenido a empleados'
      },
      {
        concepto: 'IVA Mensual Enero 2024',
        tipo_impuesto: 'IVA',
        monto_base: 100000.00,
        monto_impuesto: 16000.00,
        monto_total: 116000.00,
        fecha_vencimiento: '2024-02-17',
        periodo: 'Enero 2024',
        estado: 'pendiente',
        comentarios: 'IVA retenido de facturas'
      },
      {
        concepto: 'Cuotas IMSS Enero 2024',
        tipo_impuesto: 'IMSS',
        monto_base: 25000.00,
        monto_impuesto: 3750.00,
        monto_total: 28750.00,
        fecha_vencimiento: '2024-02-17',
        periodo: 'Enero 2024',
        estado: 'pendiente',
        comentarios: 'Cuotas patronales IMSS'
      },
      {
        concepto: 'INFONAVIT Enero 2024',
        tipo_impuesto: 'INFONAVIT',
        monto_base: 15000.00,
        monto_impuesto: 1500.00,
        monto_total: 16500.00,
        fecha_vencimiento: '2024-02-17',
        periodo: 'Enero 2024',
        estado: 'pendiente',
        comentarios: 'Cuotas patronales INFONAVIT'
      },
      {
        concepto: 'ISR Mensual Febrero 2024',
        tipo_impuesto: 'ISR',
        monto_base: 52000.00,
        monto_impuesto: 5200.00,
        monto_total: 57200.00,
        fecha_vencimiento: '2024-03-17',
        periodo: 'Febrero 2024',
        estado: 'pagado',
        fecha_pago: '2024-03-15',
        comentarios: 'ISR retenido a empleados - PAGADO'
      },
      {
        concepto: 'IVA Mensual Febrero 2024',
        tipo_impuesto: 'IVA',
        monto_base: 105000.00,
        monto_impuesto: 16800.00,
        monto_total: 121800.00,
        fecha_vencimiento: '2024-03-17',
        periodo: 'Febrero 2024',
        estado: 'pagado',
        fecha_pago: '2024-03-16',
        comentarios: 'IVA retenido de facturas - PAGADO'
      },
      {
        concepto: 'Cuotas IMSS Febrero 2024',
        tipo_impuesto: 'IMSS',
        monto_base: 26000.00,
        monto_impuesto: 3900.00,
        monto_total: 29900.00,
        fecha_vencimiento: '2024-03-17',
        periodo: 'Febrero 2024',
        estado: 'pagado',
        fecha_pago: '2024-03-14',
        comentarios: 'Cuotas patronales IMSS - PAGADO'
      },
      {
        concepto: 'ISR Mensual Marzo 2024',
        tipo_impuesto: 'ISR',
        monto_base: 48000.00,
        monto_impuesto: 4800.00,
        monto_total: 52800.00,
        fecha_vencimiento: '2024-04-17',
        periodo: 'Marzo 2024',
        estado: 'vencido',
        comentarios: 'ISR retenido a empleados - VENCIDO'
      },
      {
        concepto: 'IVA Mensual Marzo 2024',
        tipo_impuesto: 'IVA',
        monto_base: 95000.00,
        monto_impuesto: 15200.00,
        monto_total: 110200.00,
        fecha_vencimiento: '2024-04-17',
        periodo: 'Marzo 2024',
        estado: 'vencido',
        comentarios: 'IVA retenido de facturas - VENCIDO'
      },
      {
        concepto: 'Cuotas IMSS Marzo 2024',
        tipo_impuesto: 'IMSS',
        monto_base: 24000.00,
        monto_impuesto: 3600.00,
        monto_total: 27600.00,
        fecha_vencimiento: '2024-04-17',
        periodo: 'Marzo 2024',
        estado: 'vencido',
        comentarios: 'Cuotas patronales IMSS - VENCIDO'
      }
    ];
    
    console.log(`📝 Insertando ${sampleData.length} registros de prueba...`);
    
    for (const data of sampleData) {
      await prisma.$executeRaw`
        INSERT INTO impuestos_imss (
          concepto, tipo_impuesto, monto_base, monto_impuesto, monto_total, 
          fecha_vencimiento, periodo, estado, fecha_pago, comentarios
        ) VALUES (
          ${data.concepto}, ${data.tipo_impuesto}, ${data.monto_base}, 
          ${data.monto_impuesto}, ${data.monto_total}, ${data.fecha_vencimiento}, 
          ${data.periodo}, ${data.estado}, ${data.fecha_pago || null}, ${data.comentarios}
        )
      `;
      console.log(`✅ Impuesto insertado: ${data.concepto}`);
    }
    
    console.log('✅ Datos de ejemplo insertados exitosamente');
    
    // Verificar la inserción
    const finalCount = await prisma.$queryRaw`SELECT COUNT(*) as total FROM impuestos_imss`;
    console.log(`📊 Total de registros en la tabla: ${finalCount[0].total}`);
    
    // Mostrar estadísticas por estado
    const statsByStatus = await prisma.$queryRaw`
      SELECT estado, COUNT(*) as total, SUM(monto_total) as monto_total
      FROM impuestos_imss 
      GROUP BY estado
    `;
    
    console.log('\n📊 Estadísticas por estado:');
    statsByStatus.forEach(stat => {
      console.log(`  ${stat.estado}: ${stat.total} registros - $${stat.monto_total.toFixed(2)}`);
    });
    
    console.log('\n🎉 Proceso completado exitosamente');
    
  } catch (error) {
    console.error('❌ Error durante la inserción:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar el script
if (require.main === module) {
  insertSampleImpuestos()
    .then(() => {
      console.log('✅ Script ejecutado exitosamente');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Error en la ejecución del script:', error);
      process.exit(1);
    });
}

module.exports = { insertSampleImpuestos };
