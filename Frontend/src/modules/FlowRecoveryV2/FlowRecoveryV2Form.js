import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './FlowRecoveryV2Form.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';

const FlowRecoveryV2Form = () => {
  const [records, setRecords] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [proyectos, setProyectos] = useState([]);
  const [record, setRecord] = useState({
    concepto: '',
    monto: '',
    fecha: '',
    cliente_id: '',
    proyecto_id: '',
  });
  const [total, setTotal] = useState(0);
  const [totalPorRecuperar, setTotalPorRecuperar] = useState(0);
  const [filterByMonth, setFilterByMonth] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const formatterMXN = new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
    minimumFractionDigits: 2,
  });

  // Ajusta la URL base según tu configuración
  const API_URL = 'https://sigma.runsolutions-services.com/api/flowRecoveryV2';

  useEffect(() => {
    fetchRecords();
    fetchClientes();
    fetchProyectos();
  }, []);

  useEffect(() => {
    const totalRecuperado = records
      .filter(r => r.recuperado)
      .reduce((acc, curr) => acc + parseFloat(curr.monto || 0), 0);
    setTotal(totalRecuperado);

    const totalNoRecuperado = records
      .filter(r => !r.recuperado)
      .reduce((sum, r) => sum + parseFloat(r.monto || 0), 0);
    setTotalPorRecuperar(totalNoRecuperado);
  }, [records]);

  const fetchRecords = async () => {
    try {
      const response = await axios.get(API_URL);
      setRecords(response.data);
    } catch (error) {
      console.error('Error al obtener registros:', error);
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
    if (!showForm) {
      // Reinicia el formulario para un nuevo registro al abrir la tarjeta
      setIsEditing(false);
      setEditingId(null);
      setRecord({
        concepto: '',
        monto: '',
        fecha: '',
        cliente_id: '',
        proyecto_id: '',
      });
    }
  };

  const handleChange = (e) => {
    setRecord({ ...record, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await axios.put(`${API_URL}/${editingId}`, record);
      } else {
        await axios.post(API_URL, record);
      }
      fetchRecords();
      toggleForm(); // Cierra la tarjeta después de enviar
    } catch (error) {
      console.error('Error al registrar registro:', error);
    }
  };

  const handleEdit = (rec) => {
    setRecord({
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
    if (!window.confirm('¿Estás seguro de que deseas eliminar este registro?')) return;
    try {
      await axios.delete(`${API_URL}/${id}`);
      fetchRecords();
    } catch (error) {
      console.error('Error al eliminar registro:', error);
    }
  };

  const toggleRecuperado = async (id) => {
    try {
      await axios.put(`${API_URL}/${id}/toggle`);
      fetchRecords();
    } catch (error) {
      console.error('Error al alternar estado:', error);
    }
  };

  const recordsFiltrados = filterByMonth
    ? records.filter(r => new Date(r.fecha).getMonth() + 1 === parseInt(filterByMonth))
    : records;

  return (
    <section className="flowrecoveryv2-module">
      <h2>Flow Recovery V2</h2>
      <button className="toggle-form-button" onClick={toggleForm}>
        {showForm ? 'Ocultar Formulario' : 'Registrar Registro'}
      </button>

      {/* Tarjeta overlay con el formulario */}
      {showForm && (
        <div className="record-card">
          <button className="close-card-button" onClick={toggleForm}>×</button>
          <form onSubmit={handleSubmit} className="flowrecoveryv2-form">
            <label htmlFor="concepto">Concepto:</label>
            <input
              type="text"
              id="concepto"
              name="concepto"
              value={record.concepto}
              onChange={handleChange}
              required
            />

            <label htmlFor="monto">Monto:</label>
            <input
              type="number"
              id="monto"
              name="monto"
              value={record.monto}
              onChange={handleChange}
              required
            />

            <label htmlFor="fecha">Fecha:</label>
            <input
              type="date"
              id="fecha"
              name="fecha"
              value={record.fecha}
              onChange={handleChange}
              required
            />

            <label htmlFor="cliente_id">Cliente:</label>
            <select
              id="cliente_id"
              name="cliente_id"
              value={record.cliente_id}
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
              value={record.proyecto_id}
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
              {isEditing ? 'Actualizar Registro' : 'Registrar Registro'}
            </button>
          </form>
        </div>
      )}

      <div className="totals-filter-container">
        <div className="totals">
          <div className="total-card">
            <h4>Total Recuperado</h4>
            <p className="total-value recovered">{formatterMXN.format(total)}</p>
          </div>
          <div className="total-card">
            <h4>Total Por Recuperar</h4>
            <p className="total-value not-recovered">{formatterMXN.format(totalPorRecuperar)}</p>
          </div>
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

      <h3>Registros</h3>
      <table className="flowrecoveryv2-table">
        <thead>
          <tr>
            <th>Concepto</th>
            <th className="text-right">Monto</th>
            <th>Fecha</th>
            <th className="text-center">Recuperado</th>
            <th>Cliente</th>
            <th>Proyecto</th>
            <th className="text-center">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {recordsFiltrados.map((rec) => (
            <tr key={rec.id}>
              <td>{rec.concepto}</td>
              <td className="text-right">{formatterMXN.format(parseFloat(rec.monto) || 0)}</td>
              <td>{rec.fecha ? new Date(rec.fecha).toLocaleDateString('es-MX') : 'Sin fecha'}</td>
              <td className="text-center">
                <button
                  onClick={() => toggleRecuperado(rec.id)}
                  className={`toggle-button ${rec.recuperado ? 'toggle-yes' : 'toggle-no'}`}
                >
                  {rec.recuperado ? 'Sí' : 'No'}
                </button>
              </td>
              <td>{rec.cliente_nombre || 'Sin asignar'}</td>
              <td>{rec.proyecto_nombre || 'Sin asignar'}</td>
              <td className="actions text-center">
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

export default FlowRecoveryV2Form;




