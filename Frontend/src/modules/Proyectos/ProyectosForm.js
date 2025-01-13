import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ProjectModule.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';

const ProjectModule = () => {
  const [projects, setProjects] = useState([]);
  const [clients, setClients] = useState([]);
  const [phases, setPhases] = useState([]);
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
  const [selectedPhase, setSelectedPhase] = useState(null);

  useEffect(() => {
    fetchProjects();
    fetchClients();
    fetchPhases();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/projects');
      setProjects(response.data);
    } catch (error) {
      console.error('Error al obtener proyectos:', error);
    }
  };

  const fetchClients = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/clients');
      setClients(response.data);
    } catch (error) {
      console.error('Error al obtener clientes:', error);
    }
  };

  const fetchPhases = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/phases');
      setPhases(response.data);
    } catch (error) {
      console.error('Error al obtener fases:', error);
    }
  };

  const toggleForm = () => {
    if (showForm) {
      setIsEditing(false);
      setEditingProjectId(null);
      setFormData({ nombre: '', cliente_id: '', monto_sin_iva: '', monto_con_iva: '' });
    }
    setShowForm(!showForm);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
      monto_con_iva: name === 'monto_sin_iva' ? (value * 1.16).toFixed(2) : formData.monto_con_iva, // Calcula automáticamente el monto con IVA
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await axios.put(`http://localhost:5000/api/projects/${editingProjectId}`, formData);
      } else {
        await axios.post('http://localhost:5000/api/projects', formData);
      }
      setFormData({ nombre: '', cliente_id: '', monto_sin_iva: '', monto_con_iva: '' });
      setShowForm(false);
      setIsEditing(false);
      setEditingProjectId(null);
      fetchProjects();
    } catch (error) {
      console.error('Error al enviar el formulario:', error);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm('¿Estás seguro de que quieres eliminar este proyecto?');
    if (!confirmDelete) return;

    try {
      await axios.delete(`http://localhost:5000/api/projects/${id}`);
      setProjects(projects.filter((project) => project.id !== id));
    } catch (error) {
      console.error('Error al eliminar el proyecto:', error);
    }
  };

  const handleEdit = (project) => {
    setIsEditing(true);
    setEditingProjectId(project.id);
    setFormData({
      nombre: project.nombre,
      cliente_id: project.cliente_id,
      monto_sin_iva: project.monto_sin_iva,
      monto_con_iva: project.monto_con_iva,
    });
    setShowForm(true);
  };

  const handleSelectProject = (project) => {
    setSelectedProject(project);
    setSelectedPhase(project.phase_id || '');
  };

  const calculateProjectTotal = (projectId) => {
    const project = projects.find((proj) => proj.id === projectId);
    const projectPhases = phases.filter((phase) => phase.project_id === projectId);
    const totalPhases = projectPhases.reduce((acc, phase) => acc + parseFloat(phase.monto || 0), 0);
    return parseFloat(project?.monto_sin_iva || 0) + totalPhases;
  };

  const handleAssignPhase = async () => {
    if (!selectedPhase || !selectedProject) {
      alert('Por favor selecciona una fase y un proyecto.');
      return;
    }
    try {
      await axios.put(`http://localhost:5000/api/projects/${selectedProject.id}/phase`, {
        phaseId: selectedPhase,
      });

      setProjects((prevProjects) =>
        prevProjects.map((project) =>
          project.id === selectedProject.id ? { ...project, phase_id: selectedPhase } : project
        )
      );

      alert('Fase asignada correctamente');
      setSelectedProject(null);
      setSelectedPhase(null);
    } catch (error) {
      console.error('Error al asignar fase:', error);
      alert('Ocurrió un error al asignar la fase.');
    }
  };

  const closeCard = () => {
    setSelectedProject(null);
    setSelectedPhase(null);
  };

  return (
    <section className="project-module">
      <h2>Proyectos</h2>
      <button onClick={toggleForm} className="toggle-form-button">
        {showForm ? 'Cerrar formulario' : 'Crear proyecto'}
      </button>

      {showForm && (
        <form onSubmit={handleSubmit} className="project-form">
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
      )}

      <h3>Proyectos Registrados</h3>
      <table className="projects-table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Cliente</th>
            <th>Total del Proyecto</th>
            <th>Fase Actual</th>
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
              <td>${calculateProjectTotal(project.id).toFixed(2)}</td>
              <td>
                {phases.find((phase) => phase.id === project.phase_id)?.nombre || 'Sin asignar'}
              </td>
              <td className="actions">
                <button
                  className="icon-button edit-button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEdit(project);
                  }}
                >
                  <FontAwesomeIcon icon={faEdit} />
                </button>
                <button
                  className="icon-button delete-button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(project.id);
                  }}
                >
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedProject && (
        <>
          <div className="overlay" onClick={closeCard}></div>
          <div className="project-card">
            <button className="close-button" onClick={closeCard}>
              &times;
            </button>
            <h3>Información del Proyecto</h3>
            <p><strong>Nombre:</strong> {selectedProject.nombre}</p>
            <p>
              <strong>Cliente:</strong>{' '}
              {clients.find((client) => client.id === selectedProject.cliente_id)?.nombre || 'Sin asignar'}
            </p>
            <p><strong>Monto sin IVA:</strong> {selectedProject.monto_sin_iva}</p>
            <p><strong>Monto con IVA:</strong> {selectedProject.monto_con_iva}</p>
            <p><strong>Total del Proyecto:</strong> ${calculateProjectTotal(selectedProject.id).toFixed(2)}</p>

            <h4>Fases Predefinidas</h4>
            <select
              value={selectedPhase}
              onChange={(e) => setSelectedPhase(Number(e.target.value))}
            >
              <option value="">Seleccione una fase</option>
              {phases.map((phase) => (
                <option key={phase.id} value={phase.id}>
                  {phase.nombre}
                </option>
              ))}
            </select>
            <button className="submit-button" onClick={handleAssignPhase}>
              Asignar Fase
            </button>
          </div>
        </>
      )}
    </section>
  );
};

export default ProjectModule;
