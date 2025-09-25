// Script para recalcular todos los saldos contables
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function recalcularSaldosContabilidad() {
  try {

    // Obtener todos los movimientos ordenados por fecha e ID
    const movimientos = await prisma.contabilidad.findMany({
      orderBy: [
        { fecha: 'asc' },
        { id: 'asc' }
      ]
    });

    if (movimientos.length === 0) {

      return;
    }

    let saldoAcumulado = 0;
    const movimientosActualizados = [];

    // Recalcular saldos
    for (const movimiento of movimientos) {

      // Calcular cargo y abono según el tipo
      let cargo = 0;
      let abono = 0;
      
      if (movimiento.tipo === 'ingreso' || movimiento.tipo === 'Ingreso') {
        abono = parseFloat(movimiento.monto) || 0;
        saldoAcumulado += abono;

      } else if (movimiento.tipo === 'egreso' || movimiento.tipo === 'Egreso') {
        cargo = parseFloat(movimiento.monto) || 0;
        saldoAcumulado -= cargo;

      } else {
        // Si no se especifica tipo, usar el campo monto directamente
        if (parseFloat(movimiento.monto) > 0) {
          abono = parseFloat(movimiento.monto);
          saldoAcumulado += abono;

        } else {
          cargo = Math.abs(parseFloat(movimiento.monto));
          saldoAcumulado -= cargo;

        }
      }

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

    }

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

    Object.entries(resumenTipos).forEach(([tipo, info]) => {

    });

    // Verificar que los saldos sean correctos

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

    if (Math.abs(saldoVerificado - saldoAcumulado) < 0.01) {

    } else {

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

      process.exit(0);
    })
    .catch((error) => {
      console.error('\n❌ Error en la ejecución del script:', error);
      process.exit(1);
    });
}

module.exports = { recalcularSaldosContabilidad };
