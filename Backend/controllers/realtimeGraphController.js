const db = require('../config/db');

const realtimeGraphController = {
  getGraphData: async (req, res) => {
    try {
      console.log('Iniciando consultas para gráficos...');

      // Cuentas por Cobrar
      const [cuentasPorCobrar] = await db.query(
        'SELECT IFNULL(SUM(monto_con_iva), 0) AS total FROM cuentas_por_cobrar'
      );
      console.log('Cuentas por Cobrar:', cuentasPorCobrar);

      // Cuentas Pagadas y Por Pagar
      const [cuentasPagarResultados] = await db.query(`
        SELECT 
          SUM(CASE WHEN pagado = 1 THEN monto_con_iva ELSE 0 END) AS cuentasPagadas,
          SUM(CASE WHEN pagado = 0 THEN monto_con_iva ELSE 0 END) AS cuentasPorPagar
        FROM cuentas_por_pagar
      `);
      console.log('Cuentas por Pagar:', cuentasPagarResultados);

      // MoneyFlow Recovery (Recuperado y Por Recuperar)
      const [moneyFlowResultados] = await db.query(`
        SELECT 
          SUM(CASE WHEN recuperado = 1 THEN monto ELSE 0 END) AS totalRecuperado,
          SUM(CASE WHEN recuperado = 0 THEN monto ELSE 0 END) AS totalPorRecuperar
        FROM recuperacion
      `);
      console.log('MoneyFlow Recovery:', moneyFlowResultados);

      // Costos Fijos
      const [costosFijosResultados] = await db.query(`
        SELECT 
          IFNULL(SUM(monto_mxn), 0) AS costosFijosMXN,
          IFNULL(SUM(monto_usd), 0) AS costosFijosUSD
        FROM costos_fijos
      `);
      console.log('Costos Fijos:', costosFijosResultados);

      // Responder con los datos procesados
      res.json({
        cuentasPorCobrar: parseFloat(cuentasPorCobrar[0].total) || 0,
        cuentasPagadas: parseFloat(cuentasPagarResultados[0].cuentasPagadas) || 0,
        cuentasPorPagar: parseFloat(cuentasPagarResultados[0].cuentasPorPagar) || 0,
        totalRecuperado: parseFloat(moneyFlowResultados[0].totalRecuperado) || 0,
        totalPorRecuperar: parseFloat(moneyFlowResultados[0].totalPorRecuperar) || 0,
        costosFijosMXN: parseFloat(costosFijosResultados[0].costosFijosMXN) || 0,
        costosFijosUSD: parseFloat(costosFijosResultados[0].costosFijosUSD) || 0,
      });
    } catch (error) {
      console.error('Error al obtener los datos del gráfico:', error);
      res.status(500).json({ error: 'Error al obtener los datos del gráfico.', details: error.message });
    }
  },
};

module.exports = realtimeGraphController;





