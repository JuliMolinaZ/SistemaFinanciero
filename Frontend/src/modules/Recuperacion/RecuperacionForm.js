import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './RecuperacionForm.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { calcularTotalesRecuperacion } from '../../utils/cuentas';

// Formateador de moneda MXN
const formatterMXN = new Intl.NumberFormat('es-MX', {
  style: 'currency',
  currency: 'MXN',
  minimumFractionDigits: 2,
});

const RecuperacionForm = () => {
  const [recuperaciones, setRecuperaciones] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [proyectos, setProyectos] = useState([]);
  const [recuperacion, setRecuperacion] = useState({
    concepto: '',
    monto: '',
    fecha: '',
    cliente_id: '',
    proyecto_id: '',
  });
  // Se almacenan los totales globales (sin aplicar filtro)
  const [totales, setTotales] = useState({ totalRecuperado: 0, totalPorRecuperar: 0 });
  // Opcional: estado para aplicar filtros por mes en la vista de la tabla
  const [filterByMonth, setFilterByMonth] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Al montar el componente se traen las recuperaciones, clientes y proyectos
  useEffect(() => {
    fetchRecuperaciones();
    fetchClientes();
    fetchProyectos();
  }, []);

  // Cada vez que cambie el arreglo de recuperaciones, se recalculan los totales globales
  useEffect(() => {
    const { totalRecuperado, totalPorRecuperar } = calcularTotalesRecuperacion(recuperaciones);
    setTotales({ totalRecuperado, totalPorRecuperar });
  }, [recuperaciones]);

  const fetchRecuperaciones = async () => {
    try {
      const response = await axios.get('https://sigma.runsolutions-services.com/api/recuperacion');
      setRecuperaciones(response.data);
    } catch (error) {
      console.error('Error al obtener recuperaciones:', error);
    }
  };

  const fetchClientes = async () => {
    try {
      const response = await axios.get('https://sigma.runsolutions-services.com/api/clients');
      setClientes(response.data);
    } catch (error) {
      console.error('Error al obtener clientes:', error);
    }
  };

  const fetchProyectos = async () => {
    try {
      const response = await axios.get('https://sigma.runsolutions-services.com/api/projects');
      setProyectos(response.data);
    } catch (error) {
      console.error('Error al obtener proyectos:', error);
    }
  };

  const toggleForm = () => {
    setShowForm(!showForm);
    setIsEditing(false);
    setEditingId(null);
    setRecuperacion({
      concepto: '',
      monto: '',
      fecha: '',
      cliente_id: '',
      proyecto_id: '',
    });
  };

  const handleChange = (e) => {
    setRecuperacion({ ...recuperacion, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await axios.put(`https://sigma.runsolutions-services.com/api/recuperacion/${editingId}`, recuperacion);
      } else {
        await axios.post('https://sigma.runsolutions-services.com/api/recuperacion', recuperacion);
      }
      fetchRecuperaciones();
      toggleForm();
    } catch (error) {
      console.error('Error al registrar recuperación:', error);
    }
  };

  const handleEdit = (rec) => {
    setRecuperacion({
      concepto: rec.concepto || '',
      monto: rec.monto || '',
      fecha: rec.fecha || '',
      cliente_id: rec.cliente_id || '',
      proyecto_id: rec.proyecto_id || '',
    });
    setIsEditing(true);
    setEditingId(rec.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar esta recuperación?')) return;
    try {
      await axios.delete(`https://sigma.runsolutions-services.com/api/recuperacion/${id}`);
      fetchRecuperaciones();
    } catch (error) {
      console.error('Error al eliminar recuperación:', error);
    }
  };

  const toggleRecuperado = async (id) => {
    try {
      await axios.put(`https://sigma.runsolutions-services.com/api/recuperacion/${id}/toggle`);
      fetchRecuperaciones();
    } catch (error) {
      console.error('Error al alternar estado de recuperado:', error);
    }
  };

  // Aplicar filtro por mes, si se ha seleccionado uno
  const recuperacionesFiltradas = filterByMonth
    ? recuperaciones.filter(r => new Date(r.fecha).getMonth() + 1 === parseInt(filterByMonth))
    : recuperaciones;

  return (
    <section className="recuperacion-module">
      <h2>MoneyFlow Recovery</h2>
      <button className="toggle-form-button" onClick={toggleForm}>
        {showForm ? 'Cerrar formulario' : 'Registrar Recuperación'}
      </button>

      {showForm && (
        <form onSubmit={handleSubmit} className="recuperacion-form">
          <label htmlFor="concepto">Concepto:</label>
          <input
            type="text"
            id="concepto"
            name="concepto"
            value={recuperacion.concepto || ''}
            onChange={handleChange}
            required
          />

          <label htmlFor="monto">Monto:</label>
          <input
            type="number"
            id="monto"
            name="monto"
            value={recuperacion.monto || ''}
            onChange={handleChange}
            required
          />

          <label htmlFor="fecha">Fecha:</label>
          <input
            type="date"
            id="fecha"
            name="fecha"
            value={recuperacion.fecha || ''}
            onChange={handleChange}
            required
          />

          <label htmlFor="cliente_id">Cliente:</label>
          <select
            id="cliente_id"
            name="cliente_id"
            value={recuperacion.cliente_id || ''}
            onChange={handleChange}
            required
          >
            <option value="">Seleccione un cliente</option>
            {clientes.map((cliente) => (
              <option key={cliente.id} value={cliente.id}>
                {cliente.nombre}
              </option>
            ))}
          </select>

          <label htmlFor="proyecto_id">Proyecto:</label>
          <select
            id="proyecto_id"
            name="proyecto_id"
            value={recuperacion.proyecto_id || ''}
            onChange={handleChange}
            required
          >
            <option value="">Seleccione un proyecto</option>
            {proyectos.map((proyecto) => (
              <option key={proyecto.id} value={proyecto.id}>
                {proyecto.nombre}
              </option>
            ))}
          </select>

          <button type="submit" className="submit-button">
            {isEditing ? 'Actualizar Recuperación' : 'Registrar Recuperación'}
          </button>
        </form>
      )}

      <div className="totals-filter-container">
        <div className="totals">
          <h3>
            Total Recuperado:{' '}
            <span className="total-value recovered">
              {formatterMXN.format(totales.totalRecuperado)}
            </span>
          </h3>
          <h3>
            Total Por Recuperar:{' '}
            <span className="total-value not-recovered">
              {formatterMXN.format(totales.totalPorRecuperar)}
            </span>
          </h3>
        </div>
        <div className="filter-month">
          <label htmlFor="filterByMonth">Filtrar por Mes:</label>
          <select
            id="filterByMonth"
            value={filterByMonth}
            onChange={(e) => setFilterByMonth(e.target.value)}
          >
            <option value="">Todos los meses</option>
            {Array.from({ length: 12 }, (_, i) => (
              <option key={i + 1} value={i + 1}>
                {new Date(0, i).toLocaleString('es', { month: 'long' })}
              </option>
            ))}
          </select>
        </div>
      </div>

      <h3>Recuperaciones Registradas</h3>
      <table className="recuperacion-table">
        <thead>
          <tr>
            <th>Concepto</th>
            <th>Monto</th>
            <th>Fecha</th>
            <th>Recuperado</th>
            <th>Cliente</th>
            <th>Proyecto</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {recuperacionesFiltradas.map((rec) => (
            <tr key={rec.id}>
              <td>{rec.concepto}</td>
              <td>{formatterMXN.format(parseFloat(rec.monto) || 0)}</td>
              <td>{rec.fecha ? new Date(rec.fecha).toLocaleDateString('es-MX') : 'Sin fecha'}</td>
              <td>
                <button 
                  onClick={() => toggleRecuperado(rec.id)}
                  className={`toggle-button ${rec.recuperado ? 'toggle-yes' : 'toggle-no'}`}
                >
                  {rec.recuperado ? 'Sí' : 'No'}
                </button>
              </td>
              <td>{rec.cliente_nombre || 'Sin asignar'}</td>
              <td>{rec.proyecto_nombre || 'Sin asignar'}</td>
              <td className="actions">
                <button className="icon-button edit-button" onClick={() => handleEdit(rec)}>
                  <FontAwesomeIcon icon={faEdit} />
                </button>
                <button className="icon-button delete-button" onClick={() => handleDelete(rec.id)}>
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
};

export default RecuperacionForm;


