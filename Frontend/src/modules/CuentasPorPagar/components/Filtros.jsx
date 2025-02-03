// src/modules/CuentasPorPagar/components/Filtros.jsx
import React from 'react';

const Filtros = ({
  filtroMes,
  setFiltroMes,
  fechaInicio,
  setFechaInicio,
  fechaFin,
  setFechaFin,
  estadoFiltro,
  setEstadoFiltro,
  handleClearFilters
}) => {
  return (
    <div className="filtros">
      <div className="filtro-item">
        <label htmlFor="filtroMes">Mes:</label>
        <select
          id="filtroMes"
          value={filtroMes}
          onChange={(e) => setFiltroMes(e.target.value)}
        >
          <option value="">Todos</option>
          {Array.from({ length: 12 }, (_, i) => (
            <option key={i + 1} value={i + 1}>
              {new Date(0, i).toLocaleString('default', { month: 'short' })}
            </option>
          ))}
        </select>
      </div>
      <div className="filtro-item">
        <label>Desde:</label>
        <input
          type="date"
          value={fechaInicio}
          onChange={(e) => setFechaInicio(e.target.value)}
        />
      </div>
      <div className="filtro-item">
        <label>Hasta:</label>
        <input
          type="date"
          value={fechaFin}
          onChange={(e) => setFechaFin(e.target.value)}
        />
      </div>
      <div className="filtro-item">
        <label htmlFor="estadoFiltro">Estado:</label>
        <select
          id="estadoFiltro"
          value={estadoFiltro}
          onChange={(e) => setEstadoFiltro(e.target.value)}
        >
          <option value="">Todos</option>
          <option value="pagadas">Pagadas</option>
          <option value="pendientes">Pendientes</option>
        </select>
      </div>
      <div className="filtro-item">
        <button onClick={handleClearFilters} className="clear-filters-button">
          Borrar
        </button>
      </div>
    </div>
  );
};

export default React.memo(Filtros);
