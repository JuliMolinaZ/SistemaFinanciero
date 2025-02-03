// src/modules/Cotizaciones/CotizacionesForm.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencilAlt, faTrashAlt, faFilePdf } from '@fortawesome/free-solid-svg-icons';
import './CotizacionesForm.css';

const CotizacionesForm = () => {
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  // Estados para cotizaciones, proyectos y clientes
  const [cotizaciones, setCotizaciones] = useState([]);
  const [projects, setProjects] = useState([]);
  const [clients, setClients] = useState([]);

  // Estados para modal, formulario y notificaciones
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    cliente: '',
    proyecto: '',
    montoSinIVA: '',
    montoConIVA: '',
    descripcion: '',
    estado: 'No creada'
  });
  const [documento, setDocumento] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [message, setMessage] = useState('');

  // Efecto para borrar el mensaje después de 5 segundos (ajusta el tiempo a tu preferencia)
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage('');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  // Función para formatear números a pesos mexicanos
  const formatCurrency = (value) => {
    const number = parseFloat(value);
    if (isNaN(number)) return value;
    return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(number);
  };

  // Función para obtener cotizaciones
  const fetchCotizaciones = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/cotizaciones`);
      console.log('Cotizaciones recibidas:', response.data);
      setCotizaciones(response.data);
    } catch (error) {
      console.error('Error al obtener cotizaciones:', error);
    }
  };

  // Función para obtener proyectos
  const fetchProjects = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/projects`);
      console.log('Proyectos recibidos:', response.data);
      setProjects(response.data);
    } catch (error) {
      console.error('Error al obtener proyectos:', error);
    }
  };

  // Función para obtener clientes
  const fetchClients = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/clients`);
      console.log('Clientes recibidos:', response.data);
      setClients(response.data);
    } catch (error) {
      console.error('Error al obtener clientes:', error);
    }
  };

  useEffect(() => {
    fetchCotizaciones();
    fetchProjects();
    fetchClients();
  }, []);

  // Función para asignar color de fila según el estado
  const getRowColor = (estado) => {
    switch (estado) {
      case 'No creada':
        return '#fff3cd';
      case 'En proceso de aceptación':
        return '#d1ecf1';
      case 'Aceptada por cliente':
        return '#d4edda';
      case 'No aceptada':
        return '#f8d7da';
      default:
        return 'transparent';
    }
  };

  // Función auxiliar para obtener el nombre del cliente por su ID
  // Se espera que el endpoint /api/clients/:clientId retorne un objeto con la propiedad "nombre"
  const getClientNameById = async (clientId) => {
    try {
      const response = await axios.get(`${API_URL}/api/clients/${clientId}`);
      const data = response.data;
      return data && data.nombre ? data.nombre : clientId;
    } catch (error) {
      console.error('Error al obtener nombre del cliente:', error);
      return clientId;
    }
  };

  // Manejo de cambios en los campos del formulario
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'montoSinIVA') {
      const monto = parseFloat(value);
      setFormData((prev) => ({
        ...prev,
        montoSinIVA: value,
        montoConIVA: !isNaN(monto) ? (monto * 1.16).toFixed(2) : ''
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Manejo del cambio para el archivo PDF
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setDocumento(e.target.files[0]);
    }
  };

  // Envío del formulario (crear o actualizar)
  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('cliente', formData.cliente);
    data.append('proyecto', formData.proyecto);
    data.append('montoSinIVA', formData.montoSinIVA);
    data.append('montoConIVA', formData.montoConIVA);
    data.append('descripcion', formData.descripcion);
    data.append('estado', formData.estado);
    if (documento) {
      data.append('documento', documento);
    }
    try {
      let response;
      if (editingId) {
        response = await axios.put(`${API_URL}/api/cotizaciones/${editingId}`, data, {
          headers: { 'Content-Type': 'multipart/form-data' },
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setUploadProgress(percentCompleted);
          },
        });
        setMessage('Cotización actualizada con éxito.');
      } else {
        response = await axios.post(`${API_URL}/api/cotizaciones`, data, {
          headers: { 'Content-Type': 'multipart/form-data' },
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setUploadProgress(percentCompleted);
          },
        });
        setMessage('Cotización creada con éxito.');
      }

      // Reiniciar formulario y actualizar la lista
      setShowModal(false);
      setEditingId(null);
      setFormData({
        cliente: '',
        proyecto: '',
        montoSinIVA: '',
        montoConIVA: '',
        descripcion: '',
        estado: 'No creada'
      });
      setDocumento(null);
      setUploadProgress(0);
      fetchCotizaciones();
    } catch (error) {
      console.error('Error al crear cotización:', error);
      setMessage('Error al crear cotización.');
    }
  };

  // Manejo para editar: llena el formulario con los datos de la cotización seleccionada
  const handleEdit = (id) => {
    const cot = cotizaciones.find((c) => c.id === id);
    if (cot) {
      setFormData({
        cliente: cot.cliente,
        proyecto: cot.proyecto,
        montoSinIVA: cot.monto_neto,
        montoConIVA: cot.monto_con_iva,
        descripcion: cot.descripcion,
        estado: cot.estado,
      });
      setEditingId(id);
      setShowModal(true);
    }
  };

  // Manejo para eliminar cotización
  const handleDelete = async (id) => {
    if (window.confirm('¿Está seguro de que desea eliminar esta cotización?')) {
      try {
        await axios.delete(`${API_URL}/api/cotizaciones/${id}`);
        fetchCotizaciones();
      } catch (error) {
        console.error('Error al eliminar cotización:', error);
      }
    }
  };

  // Función para abrir el modal para crear nueva cotización
  const handleOpenForm = () => {
    setShowModal(true);
    setEditingId(null);
    setFormData({
      cliente: '',
      proyecto: '',
      montoSinIVA: '',
      montoConIVA: '',
      descripcion: '',
      estado: 'No creada'
    });
    setDocumento(null);
  };

  return (
    <div className="cotizaciones-module">
      <h2>Cotizaciones</h2>
      {/* Notificación temporal */}
      {message && <div className="notification">{message}</div>}
      
      <button className="toggle-form-button" onClick={handleOpenForm}>
        Crear Cotización
      </button>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-form-container">
            <button
              type="button"
              className="close-modal-button"
              onClick={() => setShowModal(false)}
            >
              &times;
            </button>
            <form onSubmit={handleSubmit} className="cotizaciones-form">
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="cliente">Cliente:</label>
                  <select
                    id="cliente"
                    name="cliente"
                    value={formData.cliente}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Seleccione un cliente...</option>
                    {clients.map((client) => (
                      <option key={client.id} value={client.id}>
                        {client.nombre || client.razonSocial || client.nombreCompleto}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="proyecto">Proyecto:</label>
                  <select
                    id="proyecto"
                    name="proyecto"
                    value={formData.proyecto}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Seleccione un proyecto...</option>
                    {projects.map((project) => (
                      <option key={project.id} value={project.id}>
                        {project.nombre || project.titulo || project.proyecto}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="montoSinIVA">Monto sin IVA:</label>
                  <input
                    type="number"
                    id="montoSinIVA"
                    name="montoSinIVA"
                    value={formData.montoSinIVA}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="montoConIVA">Monto con IVA:</label>
                  <input
                    type="number"
                    id="montoConIVA"
                    name="montoConIVA"
                    value={formData.montoConIVA}
                    readOnly
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="descripcion">Descripción:</label>
                  <textarea
                    id="descripcion"
                    name="descripcion"
                    value={formData.descripcion}
                    onChange={handleInputChange}
                    rows="4"
                  ></textarea>
                </div>
                <div className="form-group">
                  <label htmlFor="documento">Adjuntar Cotización (PDF):</label>
                  <input
                    type="file"
                    id="documento"
                    name="documento"
                    accept="application/pdf"
                    onChange={handleFileChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="estado">Estado:</label>
                  <select
                    id="estado"
                    name="estado"
                    value={formData.estado}
                    onChange={handleInputChange}
                  >
                    <option value="No creada">No creada</option>
                    <option value="En proceso de aceptación">En proceso de aceptación</option>
                    <option value="Aceptada por cliente">Aceptada por cliente</option>
                    <option value="No aceptada">No aceptada</option>
                  </select>
                </div>
              </div>
              {uploadProgress > 0 && (
                <div className="progress">Subiendo: {uploadProgress}%</div>
              )}
              <div className="form-buttons">
                <button type="submit" className="submit-button">
                  {editingId ? 'Actualizar Cotización' : 'Crear Cotización'}
                </button>
                <button
                  type="button"
                  className="cancel-button"
                  onClick={() => setShowModal(false)}
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <table className="cotizaciones-table">
        <thead>
          <tr>
            <th>Cliente</th>
            <th>Proyecto</th>
            <th>Monto sin IVA</th>
            <th>Monto con IVA</th>
            <th>Descripción</th>
            <th>Estado</th>
            <th>Documento</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {cotizaciones.length > 0 ? (
            cotizaciones.map((cot) => {
              const clientObj = clients.find((c) => String(c.id) === String(cot.cliente));
              const clientName = clientObj
                ? clientObj.nombre || clientObj.razonSocial || clientObj.nombreCompleto
                : cot.cliente;
              const proj = projects.find((p) => String(p.id) === String(cot.proyecto));
              const projectName = proj ? (proj.nombre || proj.titulo || proj.proyecto) : cot.proyecto;
              return (
                <tr key={cot.id} style={{ backgroundColor: getRowColor(cot.estado) }}>
                  <td>{clientName}</td>
                  <td>{projectName}</td>
                  <td>{formatCurrency(cot.monto_neto)}</td>
                  <td>{formatCurrency(cot.monto_con_iva)}</td>
                  <td>{cot.descripcion}</td>
                  <td>{cot.estado}</td>
                  <td>
                    {cot.documento ? (
                      <a
                        href={`${API_URL}/uploads/${cot.documento}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="view-pdf-button"
                      >
                        <FontAwesomeIcon icon={faFilePdf} />
                      </a>
                    ) : (
                      <button className="view-pdf-button disabled" disabled>
                        <FontAwesomeIcon icon={faFilePdf} />
                      </button>
                    )}
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button
                        className="icon-button edit-button"
                        onClick={() => handleEdit(cot.id)}
                      >
                        <FontAwesomeIcon icon={faPencilAlt} />
                      </button>
                      <button
                        className="icon-button delete-button"
                        onClick={() => handleDelete(cot.id)}
                      >
                        <FontAwesomeIcon icon={faTrashAlt} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan="8" style={{ textAlign: 'center' }}>
                No hay cotizaciones registradas.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default CotizacionesForm;






