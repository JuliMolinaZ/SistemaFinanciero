// src/modules/Proyectos/ProjectModule.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ProjectModule.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faTimes } from '@fortawesome/free-solid-svg-icons';

const ProjectModule = () => {
  const [projects, setProjects] = useState([]);
  const [clients, setClients] = useState([]);
  const [costs, setCosts] = useState([]);
  const [newCost, setNewCost] = useState({ concepto: '', factura: '', monto: '' });
  const [selectedProject, setSelectedProject] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingProjectId, setEditingProjectId] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '',
    cliente_id: '',
    monto_sin_iva: '',
    monto_con_iva: '',
  });

  useEffect(() => {
    fetchProjects();
    fetchClients();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await axios.get('https://sigma.runsolutions-services.com/api/projects');
      setProjects(response.data);
    } catch (error) {
      console.error('Error al obtener proyectos:', error);
    }
  };

  const fetchClients = async () => {
    try {
      const response = await axios.get('https://sigma.runsolutions-services.com/api/clients');
      setClients(response.data);
    } catch (error) {
      console.error('Error al obtener clientes:', error);
    }
  };

  const fetchCosts = async (projectId) => {
    try {
      const response = await axios.get(`https://sigma.runsolutions-services.com/api/project-costs/${projectId}`);
      setCosts(response.data);
    } catch (error) {
      console.error('Error al obtener los costos:', error);
    }
  };

  const handleAddCost = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`/api/project-costs/${selectedProject.id}`, newCost);
      fetchCosts(selectedProject.id);
      setNewCost({ concepto: '', factura: '', monto: '' });
    } catch (error) {
      console.error('Error al agregar costo:', error);
    }
  };

  const handleEditCost = async (costId) => {
    const updatedConcept = prompt('Ingrese el nuevo concepto:');
    const updatedAmount = prompt('Ingrese el nuevo monto (MXN):');
    const updatedInvoice = prompt('Ingrese la nueva factura (opcional):');

    if (!updatedConcept || !updatedAmount) {
      alert('El concepto y el monto son obligatorios.');
      return;
    }

    try {
      await axios.put(`/api/project-costs/${costId}`, {
        concepto: updatedConcept,
        monto: parseFloat(updatedAmount),
        factura: updatedInvoice || null,
      });
      fetchCosts(selectedProject.id);
      alert('Costo actualizado correctamente.');
    } catch (error) {
      console.error('Error al actualizar el costo:', error);
      alert('No se pudo actualizar el costo.');
    }
  };

  const handleDeleteCost = async (costId) => {
    const confirmDelete = window.confirm('¿Está seguro de que desea eliminar este costo?');
    if (!confirmDelete) return;
    try {
      await axios.delete(`/api/project-costs/${costId}`);
      fetchCosts(selectedProject.id);
      alert('Costo eliminado correctamente.');
    } catch (error) {
      console.error('Error al eliminar el costo:', error);
      alert('No se pudo eliminar el costo.');
    }
  };

  const handleSelectProject = (project) => {
    setSelectedProject(project);
    fetchCosts(project.id);
  };

  const closeCard = () => {
    setSelectedProject(null);
    setCosts([]);
  };

  const toggleFormOverlay = () => {
    setShowForm(!showForm);
    if (!showForm) {
      setIsEditing(false);
      setEditingProjectId(null);
      setFormData({ nombre: '', cliente_id: '', monto_sin_iva: '', monto_con_iva: '' });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
      ...(name === 'monto_sin_iva' && {
        monto_con_iva: (parseFloat(value) * 1.16).toFixed(2),
      }),
    }));
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
    }).format(amount);
  };

  const calculateTotalProjects = () => {
    return projects.reduce((total, project) => total + parseFloat(project.monto_sin_iva || 0), 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await axios.put(`/api/projects/${editingProjectId}`, formData);
      } else {
        await axios.post('/api/projects', formData);
      }
      fetchProjects();
      toggleFormOverlay(); // Cierra el overlay al enviar el formulario
    } catch (error) {
      console.error('Error al registrar proyecto:', error);
    }
  };

  return (
    <section className="project-module">
      <h2>PROYECTOS</h2>
      <button onClick={toggleFormOverlay} className="toggle-form-button">
        {showForm ? 'Cerrar formulario' : 'Crear proyecto'}
      </button>

      {/* Overlay con tarjeta para el formulario */}
      {showForm && (
        <div className="form-overlay">
          <div className="dropdown-form">
            <button className="close-card-button" onClick={toggleFormOverlay}>
              <FontAwesomeIcon icon={faTimes} />
            </button>
            <form className="project-form" onSubmit={handleSubmit}>
              <label>Nombre del Proyecto:</label>
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                required
              />

              <label>Cliente:</label>
              <select
                name="cliente_id"
                value={formData.cliente_id}
                onChange={handleChange}
                required
              >
                <option value="">Seleccione un cliente</option>
                {clients.map((client) => (
                  <option key={client.id} value={client.id}>
                    {client.nombre}
                  </option>
                ))}
              </select>

              <label>Monto sin IVA:</label>
              <input
                type="number"
                name="monto_sin_iva"
                value={formData.monto_sin_iva}
                onChange={handleChange}
                required
              />

              <label>Monto con IVA:</label>
              <input
                type="number"
                name="monto_con_iva"
                value={formData.monto_con_iva}
                readOnly
              />

              <button type="submit" className="submit-button">
                {isEditing ? 'Actualizar Proyecto' : 'Registrar Proyecto'}
              </button>
            </form>
          </div>
        </div>
      )}

      <div className="total-projects">
        <h4>Total de Proyectos</h4>
        <p>{formatCurrency(calculateTotalProjects())}</p>
      </div>

      <h3>Proyectos Registrados</h3>
      <table className="projects-table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Cliente</th>
            <th>Total del Proyecto</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {projects.map((project) => (
            <tr key={project.id} onClick={() => handleSelectProject(project)}>
              <td>{project.nombre}</td>
              <td>
                {clients.find((client) => client.id === project.cliente_id)?.nombre || 'Sin asignar'}
              </td>
              <td>{formatCurrency(project.monto_sin_iva)}</td>
              <td>
                <button
                  className="icon-button edit-button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setEditingProjectId(project.id);
                    setFormData({
                      nombre: project.nombre,
                      cliente_id: project.cliente_id,
                      monto_sin_iva: project.monto_sin_iva,
                      monto_con_iva: project.monto_con_iva,
                    });
                    setShowForm(true);
                  }}
                >
                  <FontAwesomeIcon icon={faEdit} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedProject && (
        <>
          <div className="overlay" onClick={closeCard}></div>
          <div className="project-details-card">
            <button className="close-button" onClick={closeCard}>
              &times;
            </button>
            <h3>Detalles del Proyecto</h3>
            <p>
              <strong>Nombre:</strong> {selectedProject.nombre}
            </p>
            <p>
              <strong>Cliente:</strong>{' '}
              {clients.find((client) => client.id === selectedProject.cliente_id)?.nombre}
            </p>
            <p>
              <strong>Monto sin IVA:</strong> {formatCurrency(selectedProject.monto_sin_iva)}
            </p>
            <p>
              <strong>Monto Restante:</strong>{' '}
              {formatCurrency(
                parseFloat(selectedProject.monto_sin_iva) -
                  costs.reduce((acc, cost) => acc + parseFloat(cost.monto), 0)
              )}
            </p>

            <h4>Costos Asociados</h4>
            <ul>
              {costs.map((cost) => (
                <li key={cost.id}>
                  <span>
                    {cost.concepto}: {formatCurrency(cost.monto)}{' '}
                    {cost.factura && `(Factura: ${cost.factura})`}
                  </span>
                  <div>
                    <button
                      className="icon-button edit-button"
                      onClick={() => handleEditCost(cost.id)}
                    >
                      <FontAwesomeIcon icon={faEdit} />
                    </button>
                    <button
                      className="icon-button delete-button"
                      onClick={() => handleDeleteCost(cost.id)}
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </div>
                </li>
              ))}
            </ul>

            <form onSubmit={handleAddCost}>
              <h4>Agregar Costo</h4>
              <input
                type="text"
                placeholder="Concepto"
                value={newCost.concepto}
                onChange={(e) => setNewCost({ ...newCost, concepto: e.target.value })}
                required
              />
              <input
                type="text"
                placeholder="Factura (Opcional)"
                value={newCost.factura}
                onChange={(e) => setNewCost({ ...newCost, factura: e.target.value })}
              />
              <input
                type="number"
                placeholder="Monto"
                value={newCost.monto}
                onChange={(e) => setNewCost({ ...newCost, monto: e.target.value })}
                required
              />
              <button type="submit" className="submit-button">
                Agregar Costo
              </button>
            </form>
          </div>
        </>
      )}
    </section>
  );
};

export default ProjectModule;






