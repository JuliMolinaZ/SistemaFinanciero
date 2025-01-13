import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ContabilidadForm.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';

const ContabilidadForm = () => {
  const [movimientos, setMovimientos] = useState([]);
  const [movimiento, setMovimiento] = useState({
    fecha: '',
    concepto: '',
    monto: ''
  });
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchMovimientos();
  }, []);

  const fetchMovimientos = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/contabilidad');
      setMovimientos(response.data);
    } catch (error) {
      console.error('Error al obtener movimientos contables:', error);
    }
  };

  const toggleForm = () => {
    if (showForm) {
      setIsEditing(false);
      setEditingId(null);
      setMovimiento({ fecha: '', concepto: '', monto: '' });
    }
    setShowForm(!showForm);
  };

  const handleChange = (e) => {
    setMovimiento({ ...movimiento, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await axios.put(`http://localhost:5000/api/contabilidad/${editingId}`, movimiento);
      } else {
        await axios.post('http://localhost:5000/api/contabilidad', movimiento);
      }
      setMovimiento({ fecha: '', concepto: '', monto: '' });
      setIsEditing(false);
      setEditingId(null);
      fetchMovimientos();
      toggleForm();
    } catch (error) {
      console.error('Error al registrar movimiento contable:', error);
    }
  };

  const handleEdit = (id) => {
    const movimientoToEdit = movimientos.find((m) => m.id === id);
    setMovimiento(movimientoToEdit);
    setIsEditing(true);
    setEditingId(id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm('¿Estás seguro de que deseas eliminar este movimiento contable?');
    if (!confirmDelete) return;

    try {
      await axios.delete(`http://localhost:5000/api/contabilidad/${id}`);
      setMovimientos(movimientos.filter((m) => m.id !== id));
    } catch (error) {
      console.error('Error al eliminar movimiento contable:', error);
    }
  };

  return (
    <section className="contabilidad-module">
      <h2>Módulo Contable</h2>
      <button onClick={toggleForm} className="toggle-form-button">
        {showForm ? 'Cerrar formulario' : 'Registrar Movimiento'}
      </button>

      {showForm && (
        <form onSubmit={handleSubmit} className="contabilidad-form">
          <label htmlFor="fecha">Fecha:</label>
          <input
            type="date"
            id="fecha"
            name="fecha"
            value={movimiento.fecha}
            onChange={handleChange}
            required
          />

          <label htmlFor="concepto">Concepto:</label>
          <input
            type="text"
            id="concepto"
            name="concepto"
            value={movimiento.concepto}
            onChange={handleChange}
            required
          />

          <label htmlFor="monto">Monto:</label>
          <input
            type="number"
            id="monto"
            name="monto"
            value={movimiento.monto}
            onChange={handleChange}
            required
          />

          <button type="submit" className="submit-button">
            {isEditing ? 'Actualizar Movimiento' : 'Registrar Movimiento'}
          </button>
        </form>
      )}

      <h3>Movimientos Contables Registrados</h3>
      <table className="contabilidad-table">
        <thead>
          <tr>
            <th>Fecha</th>
            <th>Concepto</th>
            <th>Monto</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {movimientos.map((m) => (
            <tr key={m.id}>
              <td>{new Date(m.fecha).toLocaleDateString()}</td>
              <td>{m.concepto}</td>
              <td>{m.monto}</td>
              <td className="actions">
                <button
                  className="icon-button edit-button"
                  onClick={() => handleEdit(m.id)}
                >
                  <FontAwesomeIcon icon={faEdit} />
                </button>
                <button
                  className="icon-button delete-button"
                  onClick={() => handleDelete(m.id)}
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

export default ContabilidadForm;