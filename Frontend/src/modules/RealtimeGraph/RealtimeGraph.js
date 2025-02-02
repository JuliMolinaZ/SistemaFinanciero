// src/modules/RealtimeGraph/RealtimeGraph.js
import React, { useMemo } from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import useGraphData from '../../hooks/useGraphData';
import ChartWrapper from '../../components/ChartWrapper/ChartWrapper';
import './RealtimeGraph.css';

const RealtimeGraph = () => {
  const { graphData, isLoading, error } = useGraphData('https://sigma.runsolutions-services.com/api/graph');

  console.log('graphData en RealtimeGraph:', graphData);

  // Configuraciones comunes para los gráficos de barras
  const commonBarOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 1000,
      easing: 'easeOutQuart',
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(0,0,0,0.7)',
        titleFont: { size: 16, weight: 'bold' },
        bodyFont: { size: 14 },
        callbacks: {
          label: function (context) {
            const label = context.dataset.label || '';
            const value = context.parsed.y !== undefined ? context.parsed.y : context.parsed;
            return `${label}: $${value.toLocaleString()}`;
          },
        },
      },
      title: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          color: '#555',
          callback: function (value) {
            return `$${value.toLocaleString()}`;
          },
        },
        grid: {
          color: 'rgba(0,0,0,0.05)',
        },
      },
      x: {
        ticks: {
          color: '#555',
        },
        grid: {
          display: false,
        },
      },
    },
  };

  // Configuración específica para gráfico de dona
  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#555',
          font: {
            size: 14,
            weight: 'bold',
          },
        },
      },
      tooltip: {
        backgroundColor: 'rgba(0,0,0,0.7)',
        titleFont: { size: 16, weight: 'bold' },
        bodyFont: { size: 14 },
        callbacks: {
          label: function (context) {
            const label = context.label || '';
            const value = context.parsed || 0;
            return `${label}: $${value.toLocaleString()}`;
          },
        },
      },
      title: {
        display: false,
      },
    },
  };

  // Preparar datos para las gráficas utilizando useMemo
  const barDataCuentasPorCobrar = useMemo(() => {
    if (!graphData) return null;
    const data = {
      labels: ['Monto Total'],
      datasets: [
        {
          label: 'Cuentas por Cobrar',
          data: [graphData.cuentasPorCobrar],
          backgroundColor: 'rgba(75, 192, 192, 0.6)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1,
          borderRadius: 5,
          maxBarThickness: 50,
        },
      ],
    };
    console.log('barDataCuentasPorCobrar:', data);
    return data;
  }, [graphData]);

  const barDataCuentasPorPagar = useMemo(() => {
    if (!graphData) return null;
    const data = {
      labels: ['Pagadas', 'Por Pagar'],
      datasets: [
        {
          label: 'Cuentas',
          data: [graphData.cuentasPagadas, graphData.cuentasPorPagar],
          backgroundColor: [
            'rgba(54, 162, 235, 0.6)',
            'rgba(255, 99, 132, 0.6)',
          ],
          borderColor: [
            'rgba(54, 162, 235, 1)',
            'rgba(255, 99, 132, 1)',
          ],
          borderWidth: 1,
          borderRadius: 5,
          maxBarThickness: 50,
        },
      ],
    };
    console.log('barDataCuentasPorPagar:', data);
    return data;
  }, [graphData]);

  const barDataMoneyFlow = useMemo(() => {
    if (!graphData) return null;
    const data = {
      labels: ['Recuperado', 'Por Recuperar'],
      datasets: [
        {
          label: 'Dinero',
          data: [graphData.totalRecuperado, graphData.totalPorRecuperar],
          backgroundColor: [
            'rgba(75, 192, 192, 0.6)',
            'rgba(255, 206, 86, 0.6)',
          ],
          borderColor: [
            'rgba(75, 192, 192, 1)',
            'rgba(255, 206, 86, 1)',
          ],
          borderWidth: 1,
          borderRadius: 5,
          maxBarThickness: 50,
        },
      ],
    };
    console.log('barDataMoneyFlow:', data);
    return data;
  }, [graphData]);

  const doughnutDataCostosFijos = useMemo(() => {
    if (!graphData) return null;
    const data = {
      labels: ['MXN', 'USD'],
      datasets: [
        {
          data: [graphData.costosFijosMXN, graphData.costosFijosUSD],
          backgroundColor: [
            'rgba(255, 99, 132, 0.6)',
            'rgba(54, 162, 235, 0.6)',
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
          ],
          borderWidth: 1,
        },
      ],
    };
    console.log('doughnutDataCostosFijos:', data);
    return data;
  }, [graphData]);

  // Última actualización
  const lastUpdated = useMemo(() => {
    if (!graphData) return null;
    return new Date().toLocaleTimeString();
  }, [graphData]);

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Dashboard Interactivo</h1>
      {isLoading ? (
        <div className="charts-skeleton">
          <Skeleton height={400} width={400} />
          <Skeleton height={400} width={400} />
          <Skeleton height={400} width={400} />
          <Skeleton height={400} width={400} />
        </div>
      ) : error ? (
        <div className="error-message">
          <p>{error}</p>
        </div>
      ) : (
        graphData && (
          <>
            <div className="last-updated">Última actualización: {lastUpdated}</div>
            <div className="dashboard-grid">
              {/* Gráfico de Barras para Cuentas por Cobrar */}
              <ChartWrapper
                title="Cuentas por Cobrar"
                type="bar"
                data={barDataCuentasPorCobrar}
                options={commonBarOptions}
                legend={
                  <p className="chart-legend">
                    Total: <span className="chart-value">${graphData.cuentasPorCobrar.toLocaleString()}</span>
                  </p>
                }
              />

              {/* Gráfico de Barras para Cuentas por Pagar */}
              <ChartWrapper
                title="Cuentas por Pagar"
                type="bar"
                data={barDataCuentasPorPagar}
                options={commonBarOptions}
                legend={
                  <div className="chart-legend">
                    <p>
                      Pagadas: <span className="chart-value">${graphData.cuentasPagadas.toLocaleString()}</span>
                    </p>
                    <p>
                      Por Pagar: <span className="chart-value">${graphData.cuentasPorPagar.toLocaleString()}</span>
                    </p>
                  </div>
                }
              />

              {/* Gráfico de Barras para MoneyFlow Recovery */}
              <ChartWrapper
                title="MoneyFlow Recovery"
                type="bar"
                data={barDataMoneyFlow}
                options={commonBarOptions}
                legend={
                  <div className="chart-legend">
                    <p>
                      Recuperado: <span className="chart-value">${graphData.totalRecuperado.toLocaleString()}</span>
                    </p>
                    <p>
                      Por Recuperar: <span className="chart-value">${graphData.totalPorRecuperar.toLocaleString()}</span>
                    </p>
                  </div>
                }
              />

              {/* Gráfico de Dona para Costos Fijos */}
              <ChartWrapper
                title="Costos Fijos"
                type="doughnut"
                data={doughnutDataCostosFijos}
                options={doughnutOptions}
                legend={
                  <div className="chart-legend">
                    <p>
                      MXN: <span className="chart-value">${graphData.costosFijosMXN.toLocaleString()}</span>
                    </p>
                    <p>
                      USD: <span className="chart-value">${graphData.costosFijosUSD.toLocaleString()}</span>
                    </p>
                  </div>
                }
              />
            </div>
          </>
        )
      )}
    </div>
  );
};

export default RealtimeGraph;












