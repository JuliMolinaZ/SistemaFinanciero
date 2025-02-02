// src/modules/Contabilidad/ContabilidadForm.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ContabilidadForm.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faFilePdf, faFileExcel } from '@fortawesome/free-solid-svg-icons';

function ContabilidadForm() {
  const [movimientos, setMovimientos] = useState([]);
  const [movimiento, setMovimiento] = useState({
    fecha: '',
    concepto: '',
    cargo: '',
    abono: '',
    notas: '',
    tipo: 'cargo',
    facturaPDF: null,
    facturaXML: null,
  });
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');

  // Lee la variable de entorno (si no existe, usar "http://localhost:5000")
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  useEffect(() => {
    fetchMovimientos();
  }, []);

  // Obtener la lista de movimientos desde el backend
  const fetchMovimientos = async () => {
    try {
      // Usamos la URL base para concatenar "/api/contabilidad"
      const response = await axios.get(`${API_URL}/api/contabilidad`);
      setMovimientos(response.data);
    } catch (error) {
      console.error('Error al obtener movimientos:', error);
      alert('No se pudo obtener los movimientos.');
    }
  };

  // Mostrar/ocultar el formulario
  const toggleForm = () => {
    if (showForm) resetFormulario();
    setShowForm(!showForm);
  };

  // Resetear el formulario
  const resetFormulario = () => {
    setIsEditing(false);
    setEditingId(null);
    setMovimiento({
      fecha: '',
      concepto: '',
      cargo: '',
      abono: '',
      notas: '',
      tipo: 'cargo',
      facturaPDF: null,
      facturaXML: null,
    });
    setError('');
  };

  // Manejo de campos de formulario
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'facturaPDF' || name === 'facturaXML') {
      setMovimiento((prev) => ({ ...prev, [name]: files[0] }));
    } else if (name === 'tipo') {
      // Al cambiar de cargo a abono, limpiamos los valores
      setMovimiento((prev) => ({ ...prev, tipo: value, cargo: '', abono: '' }));
    } else {
      setMovimiento((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Enviar el formulario (POST o PUT)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const cargo = parseFloat(movimiento.cargo) || 0;
    const abono = parseFloat(movimiento.abono) || 0;

    // Validación: Solo cargo o abono > 0
    if ((cargo > 0 && abono > 0) || (cargo === 0 && abono === 0)) {
      setError('Debe ingresar solo un valor en "Cargo" o "Abono" y mayor a 0.');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('fecha', movimiento.fecha);
      formData.append('concepto', movimiento.concepto);
      formData.append('cargo', cargo);
      formData.append('abono', abono);
      formData.append('tipo', movimiento.tipo);
      formData.append('notas', movimiento.notas || '');
      if (movimiento.facturaPDF) formData.append('facturaPDF', movimiento.facturaPDF);
      if (movimiento.facturaXML) formData.append('facturaXML', movimiento.facturaXML);

      if (isEditing) {
        // Actualizar (PUT)
        await axios.put(`${API_URL}/api/contabilidad/${editingId}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      } else {
        // Registrar (POST)
        await axios.post(`${API_URL}/api/contabilidad`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      }

      resetFormulario();
      fetchMovimientos();
      setShowForm(false);
    } catch (error) {
      console.error('Error al registrar movimiento:', error);
      setError('Ocurrió un error al procesar la solicitud.');
    }
  };

  // Darle formato a la fecha para el input type="date"
  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const yyyy = date.getFullYear();
    let mm = date.getMonth() + 1;
    let dd = date.getDate();
    if (mm < 10) mm = `0${mm}`;
    if (dd < 10) dd = `0${dd}`;
    return `${yyyy}-${mm}-${dd}`;
  };

  // Preparar para editar un movimiento
  const handleEdit = (id) => {
    const movToEdit = movimientos.find((m) => m.id === id);
    setMovimiento({
      fecha: formatDate(movToEdit.fecha),
      concepto: movToEdit.concepto || '',
      cargo: movToEdit.cargo ? movToEdit.cargo.toString() : '',
      abono: movToEdit.abono ? movToEdit.abono.toString() : '',
      notas: movToEdit.notas || '',
      tipo: movToEdit.tipo || 'cargo',
      facturaPDF: null,
      facturaXML: null,
    });
    setIsEditing(true);
    setEditingId(id);
    setShowForm(true);
    setError('');
  };

  // Eliminar movimiento
  const handleDelete = async (id) => {
    if (!window.confirm('¿Seguro que deseas eliminar este movimiento?')) return;
    try {
      await axios.delete(`${API_URL}/api/contabilidad/${id}`);
      setMovimientos(movimientos.filter((m) => m.id !== id));
    } catch (error) {
      console.error('Error al eliminar movimiento:', error);
      alert('Error al eliminar movimiento');
    }
  };

  // Descargar XLS
  const downloadXLS = () => {
    // Abre en nueva pestaña
    window.open(`${API_URL}/api/contabilidad/download/xls`, '_blank');
    // O para forzar descarga en la misma ventana:
    // window.location.href = `${API_URL}/api/contabilidad/download/xls`;
  };

  // Dar formato de moneda
  const formatCurrency = (value) =>
    new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(value);

  return (
    <section className="contabilidad-module">
      <h2>Movimientos Contables</h2>
      <div className="buttons-container">
        <button onClick={toggleForm} className="toggle-form-button">
          {showForm ? 'Cerrar formulario' : 'Registrar Movimiento'}
        </button>
        <button onClick={downloadXLS} className="toggle-form-button">
          Descargar XLS
        </button>
      </div>

      <form onSubmit={handleSubmit} className={`contabilidad-form ${!showForm ? 'hidden' : ''}`}>
        {error && <p className="error-message">{error}</p>}

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

        <div className="amount-fields">
          <div className="field">
            <label htmlFor="cargo">Cargo:</label>
            <input
              type="number"
              id="cargo"
              name="cargo"
              value={movimiento.cargo}
              onChange={handleChange}
              min="0"
              step="0.01"
              disabled={movimiento.tipo !== 'cargo'}
            />
          </div>
          <div className="field">
            <label htmlFor="abono">Abono:</label>
            <input
              type="number"
              id="abono"
              name="abono"
              value={movimiento.abono}
              onChange={handleChange}
              min="0"
              step="0.01"
              disabled={movimiento.tipo !== 'abono'}
            />
          </div>
        </div>

        <label htmlFor="tipo">Tipo:</label>
        <select
          id="tipo"
          name="tipo"
          value={movimiento.tipo}
          onChange={handleChange}
          required
        >
          <option value="cargo">Cargo</option>
          <option value="abono">Abono</option>
        </select>

        <label htmlFor="notas">Notas:</label>
        <textarea
          id="notas"
          name="notas"
          value={movimiento.notas}
          onChange={handleChange}
          rows="3"
        />

        <label htmlFor="facturaPDF">Factura PDF:</label>
        <input
          type="file"
          id="facturaPDF"
          name="facturaPDF"
          accept="application/pdf"
          onChange={handleChange}
        />

        <label htmlFor="facturaXML">Factura XML, XLSX o CSV:</label>
        <input
          type="file"
          id="facturaXML"
          name="facturaXML"
          accept=".xml,.xlsx,.csv"
          onChange={handleChange}
        />

        <button type="submit" className="submit-button">
          {isEditing ? 'Actualizar Movimiento' : 'Registrar Movimiento'}
        </button>
      </form>

      <h3>Movimientos Contables Registrados</h3>
      <table className="contabilidad-table">
        <thead>
          <tr>
            <th>Fecha</th>
            <th>Concepto</th>
            <th>Cargo</th>
            <th>Abono</th>
            <th>Monto</th>
            <th>Saldo</th>
            <th>Status</th>
            <th>Notas</th>
            <th>PDF</th>
            <th>Excel/XML</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {movimientos.map((m) => (
            <tr key={m.id}>
              <td>
                {m.fecha
                  ? new Date(m.fecha).toLocaleDateString('es-MX')
                  : 'Sin fecha'}
              </td>
              <td>{m.concepto}</td>
              <td>{m.cargo > 0 ? formatCurrency(m.cargo) : '-'}</td>
              <td>{m.abono > 0 ? formatCurrency(m.abono) : '-'}</td>
              <td>{formatCurrency(m.monto)}</td>
              <td>{m.saldo ? formatCurrency(m.saldo) : '0.00'}</td>
              <td>{m.status}</td>
              <td>{m.notas}</td>
              <td>
                {m.facturaPDF ? (
                  <a
                    href={`${API_URL}/uploads/${m.facturaPDF}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <button className="icon-button pdf-button" title="Ver PDF">
                      <FontAwesomeIcon icon={faFilePdf} />
                    </button>
                  </a>
                ) : (
                  <button className="icon-button pdf-button disabled" disabled>
                    <FontAwesomeIcon icon={faFilePdf} />
                  </button>
                )}
              </td>
              <td>
                {m.facturaXML ? (
                  <a
                    href={`${API_URL}/uploads/${m.facturaXML}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <button
                      className="icon-button excel-button"
                      title="Ver Excel/XML"
                    >
                      <FontAwesomeIcon icon={faFileExcel} />
                    </button>
                  </a>
                ) : (
                  <button className="icon-button excel-button disabled" disabled>
                    <FontAwesomeIcon icon={faFileExcel} />
                  </button>
                )}
              </td>
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
}

export default ContabilidadForm;




