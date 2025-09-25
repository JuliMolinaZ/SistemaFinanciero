// src/components/ChartWrapper/ChartWrapper.js
import React from 'react';
import { Bar, Doughnut } from 'react-chartjs-2';
import PropTypes from 'prop-types';
import './ChartWrapper.css';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
  Title,
} from 'chart.js';

// Registrar los componentes de Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend, Title);

const ChartWrapper = React.memo(({ title, type, data, options, legend }) => {
  // Verificar que 'data' y 'data.labels' existen
  if (!data || !data.labels) {
    return (
      <div className="chart-item">
        <h3>{title}</h3>
        <p className="error-message">Datos no disponibles para esta gráfica.</p>
      </div>
    );
  }

  return (
    <div className="chart-item">
      <h3>{title}</h3>
      {type === 'bar' ? (
        <Bar data={data} options={options} />
      ) : (
        <Doughnut data={data} options={options} />
      )}
      {legend && <div className="chart-legend">{legend}</div>}
    </div>
  );
});

ChartWrapper.propTypes = {
  title: PropTypes.string.isRequired,
  type: PropTypes.oneOf(['bar', 'doughnut']).isRequired,
  data: PropTypes.object.isRequired,
  options: PropTypes.object,
  legend: PropTypes.node,
};

ChartWrapper.defaultProps = {
  options: {},
  legend: null,
};

export default ChartWrapper;

