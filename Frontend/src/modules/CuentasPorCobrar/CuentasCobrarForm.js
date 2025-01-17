/* File: CuentasCobrarForm.js */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './CuentasCobrarForm.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';

const CuentasCobrarForm = () => {
  const [cuentas, setCuentas] = useState([]);
  const [proyectos, setProyectos] = useState([]);
  const [cuenta, setCuenta] = useState({
    proyecto_id: '',
    concepto: '',
    monto_sin_iva: '',
    monto_con_iva: ''
  });
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [filterByMonth, setFilterByMonth] = useState('');

  useEffect(() => {
    fetchCuentas();
    fetchProyectos();
  }, []);

  const fetchCuentas = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/cuentas-cobrar');
      setCuentas(response.data);
    } catch (error) {
      console.error('Error al obtener cuentas por cobrar:', error);
    }
  };

  const fetchProyectos = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/projects');
      setProyectos(response.data);
    } catch (error) {
      console.error('Error al obtener proyectos:', error);
    }
  };

  const toggleForm = () => {
    if (showForm) {
      setIsEditing(false);
      setEditingId(null);
      setCuenta({
        proyecto_id: '',
        concepto: '',
        monto_sin_iva: '',
        monto_con_iva: ''
      });
    }
    setShowForm(!showForm);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCuenta(prev => ({
      ...prev,
      [name]: value,
      ...(name === 'monto_sin_iva' && {
        monto_con_iva: (parseFloat(value) * 1.16).toFixed(2)  // Cálculo automático del IVA
      })
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await axios.put(`http://localhost:5000/api/cuentas-cobrar/${editingId}`, cuenta);
      } else {
        await axios.post('http://localhost:5000/api/cuentas-cobrar', cuenta);
      }
      setCuenta({
        proyecto_id: '',
        concepto: '',
        monto_sin_iva: '',
        monto_con_iva: ''
      });
      setIsEditing(false);
      setEditingId(null);
      fetchCuentas();
      toggleForm();
    } catch (error) {
      console.error('Error al registrar cuenta por cobrar:', error);
    }
  };

  const handleEdit = (id) => {
    const cuentaToEdit = cuentas.find((c) => c.id === id);
    setCuenta(cuentaToEdit);
    setIsEditing(true);
    setEditingId(id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm('¿Estás seguro de que deseas eliminar esta cuenta por cobrar?');
    if (!confirmDelete) return;

    try {
      await axios.delete(`http://localhost:5000/api/cuentas-cobrar/${id}`);
      setCuentas(cuentas.filter((c) => c.id !== id));
    } catch (error) {
      console.error('Error al eliminar cuenta por cobrar:', error);
    }
  };

  // Filtrar cuentas por mes si se ha seleccionado un mes
  const cuentasFiltradas = filterByMonth
    ? cuentas.filter(c => new Date(c.fecha).getMonth() + 1 === parseInt(filterByMonth))
    : cuentas;

  return (
    <section className="cuentas-cobrar-module">
      <h2>Módulo Cuentas por Cobrar</h2>
      <button onClick={toggleForm} className="toggle-form-button">
        {showForm ? 'Cerrar formulario' : 'Registrar Cuenta'}
      </button>

      {showForm && (
        <form onSubmit={handleSubmit} className="cuentas-form">
          <label htmlFor="proyecto_id">Proyecto:</label>
          <select
            id="proyecto_id"
            name="proyecto_id"
            value={cuenta.proyecto_id}
            onChange={handleChange}
            required
          >
            <option value="">Seleccione un proyecto</option>
            {proyectos.map((p) => (
              <option key={p.id} value={p.id}>
                {p.nombre}
              </option>
            ))}
          </select>

          <label htmlFor="concepto">Concepto:</label>
          <input
            type="text"
            id="concepto"
            name="concepto"
            value={cuenta.concepto}
            onChange={handleChange}
            required
          />

          <label htmlFor="monto_sin_iva">Monto sin IVA:</label>
          <input
            type="number"
            id="monto_sin_iva"
            name="monto_sin_iva"
            value={cuenta.monto_sin_iva}
            onChange={handleChange}
            required
          />

          <label htmlFor="monto_con_iva">Monto con IVA:</label>
          <input
            type="number"
            id="monto_con_iva"
            name="monto_con_iva"
            value={cuenta.monto_con_iva}
            readOnly
          />

          <button type="submit" className="submit-button">
            {isEditing ? 'Actualizar Cuenta' : 'Registrar Cuenta'}
          </button>
        </form>
      )}

      <div>
        <label htmlFor="filterByMonth">Filtrar por Mes:</label>
        <select
          id="filterByMonth"
          value={filterByMonth}
          onChange={(e) => setFilterByMonth(e.target.value)}
        >
          <option value="">Todos los meses</option>
          {Array.from({ length: 12 }, (_, i) => (
            <option key={i + 1} value={i + 1}>
              {new Date(0, i).toLocaleString('default', { month: 'long' })}
            </option>
          ))}
        </select>
      </div>

      <h3>Cuentas por Cobrar Registradas</h3>
      <table className="cuentas-table">
        <thead>
          <tr>
            <th>Proyecto</th>
            <th>Concepto</th>
            <th>Monto sin IVA</th>
            <th>Monto con IVA</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {cuentasFiltradas.map((c) => (
            <tr key={c.id}>
              <td>{proyectos.find((p) => p.id === c.proyecto_id)?.nombre || 'N/A'}</td>
              <td>{c.concepto}</td>
              <td>{c.monto_sin_iva}</td>
              <td>{c.monto_con_iva}</td>
              <td className="actions">
                <button
                  className="icon-button edit-button"
                  onClick={() => handleEdit(c.id)}
                >
                  <FontAwesomeIcon icon={faEdit} />
                </button>
                <button
                  className="icon-button delete-button"
                  onClick={() => handleDelete(c.id)}
                >
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

export default CuentasCobrarForm;
