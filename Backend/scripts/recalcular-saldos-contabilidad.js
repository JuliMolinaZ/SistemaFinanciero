// Script para recalcular todos los saldos contables
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function recalcularSaldosContabilidad() {
  try {
    console.log('🔄 Iniciando recálculo de saldos contables...');
    
    // Obtener todos los movimientos ordenados por fecha e ID
    const movimientos = await prisma.contabilidad.findMany({
      orderBy: [
        { fecha: 'asc' },
        { id: 'asc' }
      ]
    });

    if (movimientos.length === 0) {
      console.log('ℹ️ No hay movimientos contables para recalcular');
      return;
    }

    console.log(`📊 Total de movimientos encontrados: ${movimientos.length}`);
    
    let saldoAcumulado = 0;
    const movimientosActualizados = [];

    // Recalcular saldos
    for (const movimiento of movimientos) {
      console.log(`\n📝 Procesando movimiento ${movimiento.id}: ${movimiento.concepto}`);
      console.log(`   Fecha: ${movimiento.fecha.toLocaleDateString('es-MX')}`);
      console.log(`   Monto: $${movimiento.monto}`);
      console.log(`   Tipo: ${movimiento.tipo}`);
      console.log(`   Saldo anterior: $${saldoAcumulado.toFixed(2)}`);
      
      // Calcular cargo y abono según el tipo
      let cargo = 0;
      let abono = 0;
      
      if (movimiento.tipo === 'ingreso' || movimiento.tipo === 'Ingreso') {
        abono = parseFloat(movimiento.monto) || 0;
        saldoAcumulado += abono;
        console.log(`   ➕ Abono: $${abono.toFixed(2)}`);
      } else if (movimiento.tipo === 'egreso' || movimiento.tipo === 'Egreso') {
        cargo = parseFloat(movimiento.monto) || 0;
        saldoAcumulado -= cargo;
        console.log(`   ➖ Cargo: $${cargo.toFixed(2)}`);
      } else {
        // Si no se especifica tipo, usar el campo monto directamente
        if (parseFloat(movimiento.monto) > 0) {
          abono = parseFloat(movimiento.monto);
          saldoAcumulado += abono;
          console.log(`   ➕ Abono (por monto positivo): $${abono.toFixed(2)}`);
        } else {
          cargo = Math.abs(parseFloat(movimiento.monto));
          saldoAcumulado -= cargo;
          console.log(`   ➖ Cargo (por monto negativo): $${cargo.toFixed(2)}`);
        }
      }

      console.log(`   💰 Nuevo saldo: $${saldoAcumulado.toFixed(2)}`);

      // Actualizar el movimiento con los nuevos valores
      const movimientoActualizado = await prisma.contabilidad.update({
        where: { id: movimiento.id },
        data: {
          cargo: cargo,
          abono: abono,
          saldo: parseFloat(saldoAcumulado.toFixed(2))
        }
      });

      movimientosActualizados.push(movimientoActualizado);
      console.log(`   ✅ Movimiento ${movimiento.id} actualizado`);
    }

    console.log('\n🎉 Recálculo completado exitosamente!');
    console.log(`📊 Total de movimientos procesados: ${movimientosActualizados.length}`);
    console.log(`💰 Saldo final: $${saldoAcumulado.toFixed(2)}`);
    
    // Mostrar resumen de tipos
    const resumenTipos = {};
    movimientos.forEach(mov => {
      const tipo = mov.tipo || 'Sin tipo';
      if (!resumenTipos[tipo]) {
        resumenTipos[tipo] = { count: 0, total: 0 };
      }
      resumenTipos[tipo].count++;
      resumenTipos[tipo].total += parseFloat(mov.monto) || 0;
    });

    console.log('\n📋 Resumen por tipos:');
    Object.entries(resumenTipos).forEach(([tipo, info]) => {
      console.log(`   ${tipo}: ${info.count} movimientos - $${info.total.toFixed(2)}`);
    });

    // Verificar que los saldos sean correctos
    console.log('\n🔍 Verificando saldos...');
    const movimientosVerificados = await prisma.contabilidad.findMany({
      orderBy: [{ id: 'asc' }]
    });

    let saldoVerificado = 0;
    for (const mov of movimientosVerificados) {
      if (mov.tipo === 'ingreso' || mov.tipo === 'Ingreso') {
        saldoVerificado += parseFloat(mov.abono) || 0;
      } else if (mov.tipo === 'egreso' || mov.tipo === 'Egreso') {
        saldoVerificado -= parseFloat(mov.cargo) || 0;
      } else {
        if (parseFloat(mov.monto) > 0) {
          saldoVerificado += parseFloat(mov.monto);
        } else {
          saldoVerificado -= Math.abs(parseFloat(mov.monto));
        }
      }
    }

    console.log(`💰 Saldo verificado: $${saldoVerificado.toFixed(2)}`);
    
    if (Math.abs(saldoVerificado - saldoAcumulado) < 0.01) {
      console.log('✅ Los saldos son consistentes!');
    } else {
      console.log('⚠️ Hay una discrepancia en los saldos');
      console.log(`   Diferencia: $${(saldoVerificado - saldoAcumulado).toFixed(2)}`);
    }

  } catch (error) {
    console.error('❌ Error durante el recálculo:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar el script
if (require.main === module) {
  recalcularSaldosContabilidad()
    .then(() => {
      console.log('\n✅ Script ejecutado exitosamente');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n❌ Error en la ejecución del script:', error);
      process.exit(1);
    });
}

module.exports = { recalcularSaldosContabilidad };
