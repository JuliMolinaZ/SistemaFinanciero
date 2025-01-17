/* File: ContabilidadForm.js */
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
    monto: '',
    tipo: 'cargo',
    facturaPDF: null,
    facturaXML: null,
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
      setMovimiento({ fecha: '', concepto: '', monto: '', tipo: 'cargo', facturaPDF: null, facturaXML: null });
    }
    setShowForm(!showForm);
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if(name === 'facturaPDF' || name === 'facturaXML') {
      setMovimiento(prev => ({ ...prev, [name]: files[0] }));
    } else {
      setMovimiento(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('fecha', movimiento.fecha);
      formData.append('concepto', movimiento.concepto);
      formData.append('monto', movimiento.monto);
      formData.append('tipo', movimiento.tipo);
      if(movimiento.facturaPDF) formData.append('facturaPDF', movimiento.facturaPDF);
      if(movimiento.facturaXML) formData.append('facturaXML', movimiento.facturaXML);

      if (isEditing) {
        await axios.put(`http://localhost:5000/api/contabilidad/${editingId}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else {
        await axios.post('http://localhost:5000/api/contabilidad', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }
      setMovimiento({ fecha: '', concepto: '', monto: '', tipo: 'cargo', facturaPDF: null, facturaXML: null });
      setIsEditing(false);
      setEditingId(null);
      fetchMovimientos();
      toggleForm();
    } catch (error) {
      console.error('Error al registrar movimiento contable:', error);
    }
  };

  // Helper para formatear la fecha a yyyy-MM-dd para inputs de tipo date
  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const yyyy = date.getFullYear();
    let mm = date.getMonth() + 1;
    let dd = date.getDate();
    if(dd < 10) dd = '0' + dd;
    if(mm < 10) mm = '0' + mm;
    return `${yyyy}-${mm}-${dd}`;
  };

  const handleEdit = (id) => {
    const movimientoToEdit = movimientos.find((m) => m.id === id);
    setMovimiento({
      fecha: formatDate(movimientoToEdit.fecha),
      concepto: movimientoToEdit.concepto || '',
      monto: movimientoToEdit.monto || '',
      tipo: movimientoToEdit.tipo || 'cargo',
      facturaPDF: null,
      facturaXML: null,
    });
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

  const downloadXLS = () => {
    window.location.href = 'http://localhost:5000/api/contabilidad/xls';
  };

  const isMovimientoCompleto = (mov) => {
    return mov.facturaPDF && mov.facturaXML;
  };

  return (
    <section className="contabilidad-module">
      <h2>Módulo Contable</h2>
      <button onClick={toggleForm} className="toggle-form-button">
        {showForm ? 'Cerrar formulario' : 'Registrar Movimiento'}
      </button>
      <button onClick={downloadXLS} className="toggle-form-button">
        Descargar XLS
      </button>

      {showForm && (
        <form onSubmit={handleSubmit} className="contabilidad-form">
          <label htmlFor="fecha">Fecha:</label>
          <input
            type="date"
            id="fecha"
            name="fecha"
            value={movimiento.fecha || ''}
            onChange={handleChange}
            required
          />

          <label htmlFor="concepto">Concepto:</label>
          <input
            type="text"
            id="concepto"
            name="concepto"
            value={movimiento.concepto || ''}
            onChange={handleChange}
            required
          />

          <label htmlFor="monto">Monto:</label>
          <input
            type="number"
            id="monto"
            name="monto"
            value={movimiento.monto || ''}
            onChange={handleChange}
            required
          />

          <label htmlFor="tipo">Tipo:</label>
          <select
            id="tipo"
            name="tipo"
            value={movimiento.tipo || 'cargo'}
            onChange={handleChange}
            required
          >
            <option value="cargo">Cargo</option>
            <option value="abono">Abono</option>
          </select>

          <label htmlFor="facturaPDF">Factura PDF:</label>
          <input
            type="file"
            id="facturaPDF"
            name="facturaPDF"
            accept="application/pdf"
            onChange={handleChange}
          />

          <label htmlFor="facturaXML">Factura XML:</label>
          <input
            type="file"
            id="facturaXML"
            name="facturaXML"
            accept=".xml"
            onChange={handleChange}
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
            <th>Tipo</th>
            <th>Completo</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {movimientos.map((m) => (
            <tr key={m.id}>
              <td>{m.fecha ? new Date(m.fecha).toLocaleDateString() : 'Sin fecha'}</td>
              <td>{m.concepto}</td>
              <td>{m.monto}</td>
              <td>{m.tipo}</td>
              <td>{isMovimientoCompleto(m) ? 'Completo' : 'Incompleto'}</td>
              <td className="actions">
                {m.facturaPDF ? (
                  <a href={m.facturaPDF} target="_blank" rel="noopener noreferrer">
                    <button className="icon-button pdf-button" title="Ver PDF">📄</button>
                  </a>
                ) : (
                  <button className="icon-button pdf-button disabled" title="PDF no cargado" disabled>📄</button>
                )}
                {m.facturaXML ? (
                  <a href={m.facturaXML} target="_blank" rel="noopener noreferrer">
                    <button className="icon-button xml-button" title="Ver XML">📄</button>
                  </a>
                ) : (
                  <button className="icon-button xml-button disabled" title="XML no cargado" disabled>📄</button>
                )}
                <button className="icon-button edit-button" onClick={() => handleEdit(m.id)}>
                  <FontAwesomeIcon icon={faEdit} />
                </button>
                <button className="icon-button delete-button" onClick={() => handleDelete(m.id)}>
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