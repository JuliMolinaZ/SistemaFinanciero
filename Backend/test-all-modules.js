// test-all-modules.js
const { prisma } = require('./src/config/database');

async function testAllModules() {
  console.log('🚀 Iniciando prueba de todos los módulos...\n');
  
  try {
    // 1. PROVEEDORES
    console.log('🔍 Probando módulo PROVEEDORES...');
    const proveedores = await prisma.provider.findMany({ take: 5 });
    console.log(`✅ Proveedores: ${proveedores.length} registros encontrados`);
    if (proveedores.length > 0) {
      console.log(`📊 Primer proveedor: ${proveedores[0].nombre}`);
    }
    console.log('');
    
    // 2. COSTOS FIJOS
    console.log('🔍 Probando módulo COSTOS FIJOS...');
    const costosFijos = await prisma.costoFijo.findMany({ take: 5 });
    console.log(`✅ Costos Fijos: ${costosFijos.length} registros encontrados`);
    if (costosFijos.length > 0) {
      console.log(`📊 Primer costo fijo: ${costosFijos[0].colaborador} - $${costosFijos[0].monto_mxn}`);
    }
    console.log('');
    
    // 3. RECUPERACIÓN
    console.log('🔍 Probando módulo RECUPERACIÓN...');
    const recuperaciones = await prisma.recuperacion.findMany({ take: 5 });
    console.log(`✅ Recuperaciones: ${recuperaciones.length} registros encontrados`);
    if (recuperaciones.length > 0) {
      console.log(`📊 Primera recuperación: ${recuperaciones[0].concepto} - $${recuperaciones[0].monto}`);
    }
    console.log('');
    
    // 4. CONTABILIDAD
    console.log('🔍 Probando módulo CONTABILIDAD...');
    const contabilidad = await prisma.contabilidad.findMany({ take: 5 });
    console.log(`✅ Contabilidad: ${contabilidad.length} registros encontrados`);
    if (contabilidad.length > 0) {
      console.log(`📊 Primer movimiento: ${contabilidad[0].concepto} - $${contabilidad[0].monto}`);
    }
    console.log('');
    
    // 5. CATEGORÍAS
    console.log('🔍 Probando módulo CATEGORÍAS...');
    const categorias = await prisma.categoria.findMany({ take: 5 });
    console.log(`✅ Categorías: ${categorias.length} registros encontrados`);
    if (categorias.length > 0) {
      console.log(`📊 Primera categoría: ${categorias[0].nombre}`);
    }
    console.log('');
    
    // 6. FACTURAS EMITIDAS
    console.log('🔍 Probando módulo FACTURAS EMITIDAS...');
    const emitidas = await prisma.emitidas.findMany({ take: 5 });
    console.log(`✅ Facturas Emitidas: ${emitidas.length} registros encontrados`);
    if (emitidas.length > 0) {
      console.log(`📊 Primera factura: ${emitidas[0].razonSocial} - $${emitidas[0].total}`);
    }
    console.log('');
    
    // 7. COTIZACIONES
    console.log('🔍 Probando módulo COTIZACIONES...');
    const cotizaciones = await prisma.cotizacion.findMany({ take: 5 });
    console.log(`✅ Cotizaciones: ${cotizaciones.length} registros encontrados`);
    if (cotizaciones.length > 0) {
      console.log(`📊 Primera cotización: Cliente ${cotizaciones[0].cliente} - $${cotizaciones[0].monto_con_iva}`);
    }
    console.log('');
    
    // 8. FLOW RECOVERY V2
    console.log('🔍 Probando módulo FLOW RECOVERY V2...');
    const flowRecovery = await prisma.flow_recovery_v2.findMany({ take: 5 });
    console.log(`✅ Flow Recovery V2: ${flowRecovery.length} registros encontrados`);
    if (flowRecovery.length > 0) {
      console.log(`📊 Primer registro: ${flowRecovery[0].concepto} - $${flowRecovery[0].monto}`);
    }
    console.log('');
    
    // 9. CUENTAS POR PAGAR (ya sabemos que funciona)
    console.log('🔍 Probando módulo CUENTAS POR PAGAR...');
    const cuentasPagar = await prisma.cuentaPagar.findMany({ take: 5 });
    console.log(`✅ Cuentas por Pagar: ${cuentasPagar.length} registros encontrados`);
    if (cuentasPagar.length > 0) {
      console.log(`📊 Primera cuenta: ${cuentasPagar[0].concepto} - $${cuentasPagar[0].monto_con_iva}`);
    }
    console.log('');
    
    // 10. CUENTAS POR COBRAR
    console.log('🔍 Probando módulo CUENTAS POR COBRAR...');
    const cuentasCobrar = await prisma.cuentaCobrar.findMany({ take: 5 });
    console.log(`✅ Cuentas por Cobrar: ${cuentasCobrar.length} registros encontrados`);
    if (cuentasCobrar.length > 0) {
      console.log(`📊 Primera cuenta: ${cuentasCobrar[0].concepto} - $${cuentasCobrar[0].monto_con_iva}`);
    }
    console.log('');
    
    console.log('🎉 ¡Todas las pruebas completadas exitosamente!');
    
  } catch (error) {
    console.error('❌ Error durante las pruebas:', error);
    console.error('🔍 Detalles del error:', {
      message: error.message,
      code: error.code,
      meta: error.meta
    });
  } finally {
    await prisma.$disconnect();
    console.log('✅ Conexión cerrada');
  }
}

testAllModules();
