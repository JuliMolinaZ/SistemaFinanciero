import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar, Pie, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import './RealtimeGraph.css';

// Registrar los componentes de Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

const RealtimeGraph = () => {
  const [graphData, setGraphData] = useState(null);

  useEffect(() => {
    const fetchGraphData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/graph');
        console.log('Datos obtenidos del backend:', response.data);

        setGraphData({
          cuentasPorCobrar: response.data.cuentasPorCobrar || 0,
          cuentasPagadas: response.data.cuentasPagadas || 0,
          cuentasPorPagar: response.data.cuentasPorPagar || 0,
          totalRecuperado: response.data.totalRecuperado || 0,
          totalPorRecuperar: response.data.totalPorRecuperar || 0,
          costosFijosMXN: response.data.costosFijosMXN || 0,
          costosFijosUSD: response.data.costosFijosUSD || 0,
        });
      } catch (error) {
        console.error('Error al obtener los datos del gráfico:', error);
      }
    };

    fetchGraphData();
    const interval = setInterval(fetchGraphData, 5000); // Actualización automática
    return () => clearInterval(interval);
  }, []);

  if (!graphData) {
    return <div className="loading">Cargando gráficos...</div>;
  }

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Dashboard Interactivo</h1>
      <div className="dashboard-grid">
        {/* Gráfico de Barras para Cuentas por Cobrar */}
        <div className="chart-item">
          <h3>Cuentas por Cobrar</h3>
          <Bar
            data={{
              labels: ['Monto Total'],
              datasets: [
                {
                  label: 'Cuentas por Cobrar',
                  data: [graphData.cuentasPorCobrar],
                  backgroundColor: 'rgba(75, 192, 192, 0.6)',
                  borderColor: 'rgba(75, 192, 192, 1)',
                  borderWidth: 1,
                },
              ],
            }}
            options={{
              responsive: true,
              plugins: { legend: { display: false } },
              scales: { y: { beginAtZero: true } },
            }}
          />
          <p className="chart-legend">
            Total: <span className="chart-value">${graphData.cuentasPorCobrar.toLocaleString()}</span>
          </p>
        </div>

        {/* Gráfico de Barras para Cuentas por Pagar */}
        <div className="chart-item">
          <h3>Cuentas por Pagar</h3>
          <Bar
            data={{
              labels: ['Pagadas', 'Por Pagar'],
              datasets: [
                {
                  label: 'Cuentas',
                  data: [graphData.cuentasPagadas, graphData.cuentasPorPagar],
                  backgroundColor: ['rgba(54, 162, 235, 0.6)', 'rgba(255, 99, 132, 0.6)'],
                  borderColor: ['rgba(54, 162, 235, 1)', 'rgba(255, 99, 132, 1)'],
                  borderWidth: 1,
                },
              ],
            }}
            options={{
              responsive: true,
              plugins: { legend: { display: false } },
              scales: { y: { beginAtZero: true } },
            }}
          />
          <div className="chart-legend">
            <p>
              Pagadas: <span className="chart-value">${graphData.cuentasPagadas.toLocaleString()}</span>
            </p>
            <p>
              Por Pagar: <span className="chart-value">${graphData.cuentasPorPagar.toLocaleString()}</span>
            </p>
          </div>
        </div>

        {/* Gráfico de Barras para MoneyFlow Recovery */}
        <div className="chart-item">
          <h3>MoneyFlow Recovery</h3>
          <Bar
            data={{
              labels: ['Recuperado', 'Por Recuperar'],
              datasets: [
                {
                  label: 'Dinero',
                  data: [graphData.totalRecuperado, graphData.totalPorRecuperar],
                  backgroundColor: ['rgba(75, 192, 192, 0.6)', 'rgba(255, 206, 86, 0.6)'],
                  borderColor: ['rgba(75, 192, 192, 1)', 'rgba(255, 206, 86, 1)'],
                  borderWidth: 1,
                },
              ],
            }}
            options={{
              responsive: true,
              plugins: { legend: { display: false } },
              scales: { y: { beginAtZero: true } },
            }}
          />
          <div className="chart-legend">
            <p>
              Recuperado: <span className="chart-value">${graphData.totalRecuperado.toLocaleString()}</span>
            </p>
            <p>
              Por Recuperar: <span className="chart-value">${graphData.totalPorRecuperar.toLocaleString()}</span>
            </p>
          </div>
        </div>

        {/* Gráfico de Dona para Costos Fijos */}
        <div className="chart-item">
          <h3>Costos Fijos</h3>
          <Doughnut
            data={{
              labels: ['MXN', 'USD'],
              datasets: [
                {
                  data: [graphData.costosFijosMXN, graphData.costosFijosUSD],
                  backgroundColor: ['rgba(255, 99, 132, 0.6)', 'rgba(54, 162, 235, 0.6)'],
                  borderColor: ['rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)'],
                  borderWidth: 1,
                },
              ],
            }}
            options={{
              responsive: true,
              plugins: { legend: { display: true, position: 'top' } },
            }}
          />
          <div className="chart-legend">
            <p>
              MXN: <span className="chart-value">${graphData.costosFijosMXN.toLocaleString()}</span>
            </p>
            <p>
              USD: <span className="chart-value">${graphData.costosFijosUSD.toLocaleString()}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RealtimeGraph;







