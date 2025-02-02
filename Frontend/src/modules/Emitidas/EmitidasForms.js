// src/modules/Emitidas/EmitidasForms.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './EmitidasForms.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faFilePdf, faFileCode } from '@fortawesome/free-solid-svg-icons';

const EmitidasForms = () => {
  const [cfdiList, setCfdiList] = useState([]);
  const [cfdiData, setCfdiData] = useState({
    rfcReceptor: '',
    razonSocial: '',
    fechaEmision: '',
    subtotal: '',
    iva: '',
    total: '',
    claveSat: '',
    descripcion: '',
    facturaAdmon: false,
    pue: false,
    ppd: false,
    pagos: [],
    facturasPDF: [],
    facturasXML: [],
    comprobantesPago: [],
    complementosPDF: [],
    complementosXML: [],
  });
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');

  // Lee la variable de entorno (si no existe, usar "http://localhost:5000")
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  useEffect(() => {
    fetchCfdis();
  }, []);

  // Obtener la lista de CFDIs desde el backend
  const fetchCfdis = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/emitidas`);
      setCfdiList(response.data);
    } catch (error) {
      console.error('Error al obtener CFDIs:', error);
      alert('No se pudo obtener los CFDIs.');
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
    setCfdiData({
      rfcReceptor: '',
      razonSocial: '',
      fechaEmision: '',
      subtotal: '',
      iva: '',
      total: '',
      claveSat: '',
      descripcion: '',
      facturaAdmon: false,
      pue: false,
      ppd: false,
      pagos: [],
      facturasPDF: [],
      facturasXML: [],
      comprobantesPago: [],
      complementosPDF: [],
      complementosXML: [],
    });
    setError('');
  };

  // Manejo de campos de formulario
  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    if (files && files.length) {
      setCfdiData((prev) => ({
        ...prev,
        [name]: Array.from(files),
      }));
      return;
    }

    if (type === 'checkbox') {
      setCfdiData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setCfdiData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Agregar un pago vacío al arreglo "pagos"
  const handleAddPago = () => {
    setCfdiData((prev) => ({
      ...prev,
      pagos: [...prev.pagos, { monto: '', fechaPago: '' }],
    }));
  };

  // Eliminar un pago específico por índice
  const handleRemovePago = (index) => {
    setCfdiData((prev) => ({
      ...prev,
      pagos: prev.pagos.filter((_, i) => i !== index),
    }));
  };

  // Actualizar un campo específico de un pago
  const handlePagoChange = (index, field, val) => {
    setCfdiData((prev) => {
      const pagosActualizados = [...prev.pagos];
      pagosActualizados[index][field] = val;
      return { ...prev, pagos: pagosActualizados };
    });
  };

  // Preparar para editar un CFDI
  const handleEdit = (id) => {
    const cfdiToEdit = cfdiList.find((c) => c.id === id);
    setCfdiData({
      rfcReceptor: cfdiToEdit.rfcReceptor,
      razonSocial: cfdiToEdit.razonSocial,
      fechaEmision: formatDate(cfdiToEdit.fechaEmision),
      subtotal: cfdiToEdit.subtotal,
      iva: cfdiToEdit.iva,
      total: cfdiToEdit.total,
      claveSat: cfdiToEdit.claveSat,
      descripcion: cfdiToEdit.descripcion,
      facturaAdmon: cfdiToEdit.facturaAdmon,
      pue: cfdiToEdit.pue,
      ppd: cfdiToEdit.ppd,
      pagos: cfdiToEdit.pagos || [],
      facturasPDF: [],
      facturasXML: [],
      comprobantesPago: [],
      complementosPDF: [],
      complementosXML: [],
    });
    setIsEditing(true);
    setEditingId(id);
    setShowForm(true);
    setError('');
  };

  // Eliminar CFDI
  const handleDelete = async (id) => {
    if (!window.confirm('¿Seguro que deseas eliminar este CFDI?')) return;
    try {
      await axios.delete(`${API_URL}/api/emitidas/${id}`);
      setCfdiList(cfdiList.filter((c) => c.id !== id));
    } catch (error) {
      console.error('Error al eliminar CFDI:', error);
      alert('Error al eliminar CFDI');
    }
  };

  // Manejo del envío del formulario (Crear o Actualizar)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const formData = new FormData();

      // Campos de texto / bool
      formData.append('rfcReceptor', cfdiData.rfcReceptor);
      formData.append('razonSocial', cfdiData.razonSocial);
      formData.append('fechaEmision', cfdiData.fechaEmision);
      formData.append('subtotal', cfdiData.subtotal);
      formData.append('iva', cfdiData.iva);
      formData.append('total', cfdiData.total);
      formData.append('claveSat', cfdiData.claveSat);
      formData.append('descripcion', cfdiData.descripcion);
      formData.append('facturaAdmon', cfdiData.facturaAdmon);
      formData.append('pue', cfdiData.pue);
      formData.append('ppd', cfdiData.ppd);

      // Pagos (arreglo) como JSON string
      formData.append('pagos', JSON.stringify(cfdiData.pagos));

      // Archivos múltiples: iterar cada array
      cfdiData.facturasPDF.forEach((file) => {
        formData.append('facturasPDF', file);
      });
      cfdiData.facturasXML.forEach((file) => {
        formData.append('facturasXML', file);
      });
      cfdiData.comprobantesPago.forEach((file) => {
        formData.append('comprobantesPago', file);
      });
      cfdiData.complementosPDF.forEach((file) => {
        formData.append('complementosPDF', file);
      });
      cfdiData.complementosXML.forEach((file) => {
        formData.append('complementosXML', file);
      });

      if (isEditing) {
        // Actualizar (PUT)
        await axios.put(`${API_URL}/api/emitidas/${editingId}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      } else {
        // Crear (POST)
        await axios.post(`${API_URL}/api/emitidas`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      }

      resetFormulario();
      fetchCfdis();
      setShowForm(false);
    } catch (err) {
      console.error(err);
      setError('Error al enviar CFDI');
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

  // Dar formato a números (por ejemplo, moneda)
  const formatCurrency = (value) =>
    new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(value);

  return (
    <section className="emitidas-module">
      <h2>CFDIs Emitidos</h2>
      <div className="buttons-container">
        <button onClick={toggleForm} className="toggle-form-button">
          {showForm ? 'Cerrar formulario' : 'Registrar CFDI'}
        </button>
      </div>

      {/* Formulario */}
      {showForm && (
        <form onSubmit={handleSubmit} className="cfdi-form">
          <h3>{isEditing ? 'Editar CFDI' : 'Registrar CFDI'}</h3>

          {error && <p className="error-message">{error}</p>}

          {/* RFC Receptor */}
          <div className="form-group">
            <label>RFC Receptor</label>
            <input
              type="text"
              name="rfcReceptor"
              value={cfdiData.rfcReceptor}
              onChange={handleChange}
              required
            />
          </div>

          {/* Razón Social */}
          <div className="form-group">
            <label>Nombre o Razón Social del Receptor</label>
            <input
              type="text"
              name="razonSocial"
              value={cfdiData.razonSocial}
              onChange={handleChange}
              required
            />
          </div>

          {/* Fecha de Emisión */}
          <div className="form-group">
            <label>Fecha de Emisión</label>
            <input
              type="date"
              name="fechaEmision"
              value={cfdiData.fechaEmision}
              onChange={handleChange}
              required
            />
          </div>

          {/* Subtotal */}
          <div className="form-group">
            <label>Subtotal</label>
            <input
              type="number"
              name="subtotal"
              value={cfdiData.subtotal}
              onChange={handleChange}
              min="0"
              step="0.01"
              required
            />
          </div>

          {/* IVA */}
          <div className="form-group">
            <label>IVA</label>
            <input
              type="number"
              name="iva"
              value={cfdiData.iva}
              onChange={handleChange}
              min="0"
              step="0.01"
              required
            />
          </div>

          {/* Total */}
          <div className="form-group">
            <label>Total</label>
            <input
              type="number"
              name="total"
              value={cfdiData.total}
              onChange={handleChange}
              min="0"
              step="0.01"
              required
            />
          </div>

          {/* Clave SAT */}
          <div className="form-group">
            <label>Clave SAT</label>
            <input
              type="text"
              name="claveSat"
              value={cfdiData.claveSat}
              onChange={handleChange}
              required
            />
          </div>

          {/* Descripción */}
          <div className="form-group">
            <label>Descripción</label>
            <textarea
              name="descripcion"
              rows="3"
              value={cfdiData.descripcion}
              onChange={handleChange}
            ></textarea>
          </div>

          {/* Checkboxes */}
          <div className="checkboxes-row">
            <label>
              <input
                type="checkbox"
                name="facturaAdmon"
                checked={cfdiData.facturaAdmon}
                onChange={handleChange}
              />
              Factura-Admon
            </label>
            <label>
              <input
                type="checkbox"
                name="pue"
                checked={cfdiData.pue}
                onChange={handleChange}
              />
              PUE
            </label>
            <label>
              <input
                type="checkbox"
                name="ppd"
                checked={cfdiData.ppd}
                onChange={handleChange}
              />
              PPD
            </label>
          </div>

          {/* Pagos múltiples */}
          <div className="form-group">
            <label>Pagos</label>
            {cfdiData.pagos.map((p, index) => (
              <div key={index} className="pago-row">
                <input
                  type="number"
                  placeholder="Monto de pago"
                  value={p.monto}
                  onChange={(e) => handlePagoChange(index, 'monto', e.target.value)}
                  min="0"
                  step="0.01"
                />
                <input
                  type="date"
                  placeholder="Fecha de pago"
                  value={p.fechaPago}
                  onChange={(e) => handlePagoChange(index, 'fechaPago', e.target.value)}
                />
                <button type="button" onClick={() => handleRemovePago(index)}>
                  Eliminar
                </button>
              </div>
            ))}
            <button type="button" onClick={handleAddPago}>
              Agregar Pago
            </button>
          </div>

          {/* Archivos múltiples */}
          <div className="form-group">
            <label>Factura PDF (múltiples)</label>
            <input
              type="file"
              name="facturasPDF"
              accept="application/pdf"
              multiple
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Factura XML (múltiples)</label>
            <input
              type="file"
              name="facturasXML"
              accept=".xml"
              multiple
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Comprobante de pago (múltiples)</label>
            <input
              type="file"
              name="comprobantesPago"
              multiple
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Complemento de pago PDF (múltiples)</label>
            <input
              type="file"
              name="complementosPDF"
              accept="application/pdf"
              multiple
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Complemento de pago XML (múltiples)</label>
            <input
              type="file"
              name="complementosXML"
              accept=".xml"
              multiple
              onChange={handleChange}
            />
          </div>

          {/* Botón para Enviar */}
          <button type="submit" className="submit-button">
            {isEditing ? 'Actualizar CFDI' : 'Guardar CFDI'}
          </button>
        </form>
      )}

      {/* Tabla de CFDIs registrados */}
      <h3>CFDIs Registrados</h3>
      <table className="cfdi-table">
        <thead>
          <tr>
            <th>RFC Receptor</th>
            <th>Razón Social</th>
            <th>Fecha Emisión</th>
            <th>Subtotal</th>
            <th>IVA</th>
            <th>Total</th>
            <th>Clave SAT</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {cfdiList.map((cfdi) => (
            <tr key={cfdi.id}>
              <td>{cfdi.rfcReceptor}</td>
              <td>{cfdi.razonSocial}</td>
              <td>{new Date(cfdi.fechaEmision).toLocaleDateString('es-MX')}</td>
              <td>{formatCurrency(cfdi.subtotal)}</td>
              <td>{formatCurrency(cfdi.iva)}</td>
              <td>{formatCurrency(cfdi.total)}</td>
              <td>{cfdi.claveSat}</td>
              <td className="actions">
                <button
                  className="icon-button edit-button"
                  onClick={() => handleEdit(cfdi.id)}
                  title="Editar CFDI"
                >
                  <FontAwesomeIcon icon={faEdit} />
                </button>
                <button
                  className="icon-button delete-button"
                  onClick={() => handleDelete(cfdi.id)}
                  title="Eliminar CFDI"
                >
                  <FontAwesomeIcon icon={faTrash} />
                </button>
                {/* Opcional: Botones para ver archivos PDF/XML */}
                {cfdi.facturasPDF && cfdi.facturasPDF.length > 0 && (
                  <a
                    href={`${API_URL}/uploads/${cfdi.facturasPDF[0]}`} // Asumiendo que almacenas los nombres de archivos
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <button className="icon-button pdf-button" title="Ver Factura PDF">
                      <FontAwesomeIcon icon={faFilePdf} />
                    </button>
                  </a>
                )}
                {cfdi.facturasXML && cfdi.facturasXML.length > 0 && (
                  <a
                    href={`${API_URL}/uploads/${cfdi.facturasXML[0]}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <button className="icon-button xml-button" title="Ver Factura XML">
                      <FontAwesomeIcon icon={faFileCode} /> {/* Reemplazado faFileXml por faFileCode */}
                    </button>
                  </a>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
};

export default EmitidasForms;

