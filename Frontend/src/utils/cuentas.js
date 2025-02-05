// src/utils/cuentas.js
export const calcularTotalesCuentasPagar = (cuentas) => {
    return cuentas.reduce(
      (totales, cuenta) => {
        const montoConIVA = parseFloat(cuenta.monto_con_iva) || 0;
        // Calcular monto sin IVA (suponiendo IVA 16%)
        const montoSinIVA = montoConIVA / 1.16;
        // Si la cuenta está pagada, usamos el monto total; de lo contrario, usamos pagos_parciales
        const pagado = cuenta.pagado ? montoConIVA : (parseFloat(cuenta.pagos_parciales) || 0);
        const restante = montoConIVA - (parseFloat(cuenta.pagos_parciales) || 0);
        return {
          totalPagado: totales.totalPagado + pagado,
          totalPorPagar: totales.totalPorPagar + (restante > 0 ? restante : 0),
          totalSinIVA: totales.totalSinIVA + montoSinIVA,
        };
      },
      { totalPagado: 0, totalPorPagar: 0, totalSinIVA: 0 }
    );
  };
  // src/utils/cuentas.js
export const calcularTotalesRecuperacion = (recuperaciones) => {
    const totalRecuperado = recuperaciones
      .filter(r => Number(r.recuperado) === 1)
      .reduce((acc, curr) => acc + parseFloat(curr.monto || 0), 0);
    const totalPorRecuperar = recuperaciones
      .filter(r => Number(r.recuperado) !== 1)
      .reduce((sum, r) => sum + parseFloat(r.monto || 0), 0);
    return { totalRecuperado, totalPorRecuperar };
  };
  
  