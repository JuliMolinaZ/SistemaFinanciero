import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './CostosFijos.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';

const CostosFijos = () => {
  const [costosFijos, setCostosFijos] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingCostoId, setEditingCostoId] = useState(null);
  const [formData, setFormData] = useState({
    colaborador: '',
    puesto: '',
    monto_usd: '',
    comentarios: '',
    fecha: '',
  });
  const [mesFiltro, setMesFiltro] = useState('');
  const [tipoCambio] = useState(20);
  const [porcentajeUtilidad, setPorcentajeUtilidad] = useState(30);
  const [resultadoUtilidad, setResultadoUtilidad] = useState(0);

  useEffect(() => {
    fetchCostosFijos();
  }, [mesFiltro]);

  useEffect(() => {
    calcularUtilidad();
  }, [costosFijos, porcentajeUtilidad]);

  const fetchCostosFijos = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/costos-fijos', {
        params: { mes: mesFiltro },
      });
      setCostosFijos(response.data);
    } catch (error) {
      console.error('Error al obtener costos fijos:', error.response?.data || error.message);
    }
  };

  const toggleForm = () => {
    setShowForm(!showForm);
    setFormData({
      colaborador: '',
      puesto: '',
      monto_usd: '',
      comentarios: '',
      fecha: '',
    });
    setIsEditing(false);
    setEditingCostoId(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const monto_mxn = formData.monto_usd * tipoCambio;
    const impuestos_imss = monto_mxn * 0.35;

    try {
      if (isEditing) {
        await axios.put(`http://localhost:5000/api/costos-fijos/${editingCostoId}`, {
          ...formData,
          monto_mxn,
          impuestos_imss,
        });
      } else {
        await axios.post('http://localhost:5000/api/costos-fijos', {
          ...formData,
          monto_mxn,
          impuestos_imss,
        });
      }
      fetchCostosFijos();
      toggleForm();
    } catch (error) {
      console.error('Error al enviar el formulario:', error.response?.data || error.message);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm('¿Estás seguro de que quieres eliminar este costo fijo?');
    if (!confirmDelete) return;

    try {
      await axios.delete(`http://localhost:5000/api/costos-fijos/${id}`);
      setCostosFijos(costosFijos.filter((costo) => costo.id !== id));
    } catch (error) {
      console.error('Error al eliminar el costo fijo:', error.response?.data || error.message);
    }
  };

  const handleEdit = (costo) => {
    setIsEditing(true);
    setEditingCostoId(costo.id);
    setFormData({
      colaborador: costo.colaborador,
      puesto: costo.puesto,
      monto_usd: costo.monto_usd,
      comentarios: costo.comentarios,
      fecha: costo.fecha,
    });
    setShowForm(true);
  };

  const calcularUtilidad = () => {
    const totalCostos = costosFijos.reduce((acc, costo) => acc + costo.monto_mxn, 0);
    setResultadoUtilidad(totalCostos * (porcentajeUtilidad / 100));
  };

  return (
    <section className="costos-fijos-module">
      <h2>Costos Fijos</h2>

      <div className="filtro-mes-container">
        <label>Filtrar por mes:</label>
        <select
          value={mesFiltro}
          onChange={(e) => setMesFiltro(e.target.value)}
          className="filtro-mes-select"
        >
          <option value="">Todos</option>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((mes) => (
            <option key={mes} value={mes}>
              {new Date(0, mes - 1).toLocaleString('es', { month: 'long' })}
            </option>
          ))}
        </select>
      </div>

      <button onClick={toggleForm} className="toggle-form-button">
        {showForm ? 'Cerrar formulario' : 'Registrar costo fijo'}
      </button>

      {showForm && (
        <form onSubmit={handleSubmit} className="costos-fijos-form">
          <label>Colaborador:</label>
          <input
            type="text"
            name="colaborador"
            value={formData.colaborador}
            onChange={handleChange}
            required
          />

          <label>Puesto:</label>
          <input
            type="text"
            name="puesto"
            value={formData.puesto}
            onChange={handleChange}
            required
          />

          <label>Monto en USD:</label>
          <input
            type="number"
            name="monto_usd"
            value={formData.monto_usd}
            onChange={handleChange}
            required
          />

          <label>Fecha:</label>
          <input
            type="date"
            name="fecha"
            value={formData.fecha}
            onChange={handleChange}
            required
          />

          <label>Comentarios:</label>
          <textarea
            name="comentarios"
            value={formData.comentarios}
            onChange={handleChange}
          />

          <div className="button-container">
            <button type="submit">{isEditing ? 'Actualizar Costo Fijo' : 'Registrar Costo Fijo'}</button>
          </div>
        </form>
      )}

      <div className="utilidad-container">
        <h3>Porcentajes de Utilidad</h3>
        <label>Seleccionar porcentaje:</label>
        <select
          value={porcentajeUtilidad}
          onChange={(e) => setPorcentajeUtilidad(Number(e.target.value))}
          className="utilidad-select"
        >
          {[30, 40, 50, 60, 80, 100, 120].map((porcentaje) => (
            <option key={porcentaje} value={porcentaje}>
              {porcentaje}%
            </option>
          ))}
        </select>
        <p>
          Resultado de utilidad: <strong>${resultadoUtilidad.toFixed(2)} MXN</strong>
        </p>
      </div>

      <h3>Costos Fijos Registrados</h3>
      <table className="costos-fijos-table">
        <thead>
          <tr>
            <th>Colaborador</th>
            <th>Puesto</th>
            <th>Monto USD</th>
            <th>Monto MXN</th>
            <th>Impuestos</th>
            <th>Comentarios</th>
            <th>Fecha</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {costosFijos.map((costo) => (
            <tr key={costo.id}>
              <td>{costo.colaborador}</td>
              <td>{costo.puesto}</td>
              <td>{costo.monto_usd}</td>
              <td>{costo.monto_mxn}</td>
              <td>{costo.impuestos_imss}</td>
              <td>{costo.comentarios}</td>
              <td>{new Date(costo.fecha).toLocaleDateString()}</td>
              <td className="actions">
                <button className="icon-button edit-button" onClick={() => handleEdit(costo)}>
                  <FontAwesomeIcon icon={faEdit} />
                </button>
                <button className="icon-button delete-button" onClick={() => handleDelete(costo.id)}>
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

export default CostosFijos;





