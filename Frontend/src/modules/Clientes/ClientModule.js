// src/modules/Clientes/ClientModule.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ClientModule.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';

const ClientModule = () => {
  const [clients, setClients] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingClientId, setEditingClientId] = useState(null);
  const [formData, setFormData] = useState({
    run_cliente: '',
    nombre: '',
    rfc: '',
    direccion: ''
  });

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/clients');
      setClients(response.data);
    } catch (error) {
      console.error('Error al obtener clientes:', error);
    }
  };

  const toggleForm = () => {
    if (showForm) {
      setIsEditing(false);
      setEditingClientId(null);
      setFormData({ run_cliente: '', nombre: '', rfc: '', direccion: '' });
    }
    setShowForm(!showForm);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await axios.put(`http://localhost:5000/api/clients/${editingClientId}`, formData);
      } else {
        await axios.post('http://localhost:5000/api/clients', formData);
      }
      setFormData({ run_cliente: '', nombre: '', rfc: '', direccion: '' });
      setShowForm(false);
      setIsEditing(false);
      setEditingClientId(null);
      fetchClients();
    } catch (error) {
      console.error('Error al enviar el formulario:', error);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("¿Estás seguro de que quieres eliminar este cliente?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`http://localhost:5000/api/clients/${id}`);
      setClients(clients.filter((client) => client.id !== id));
    } catch (error) {
      console.error('Error al eliminar el cliente:', error);
    }
  };

  const handleEdit = (client) => {
    setIsEditing(true);
    setEditingClientId(client.id);
    setFormData({
      run_cliente: client.run_cliente,
      nombre: client.nombre,
      rfc: client.rfc,
      direccion: client.direccion
    });
    setShowForm(true);
  };

  return (
    <section className="client-module">
      <h2>Clientes</h2>
      <button onClick={toggleForm} className="toggle-form-button">
        {showForm ? 'Cerrar formulario' : 'Crear clientes'}
      </button>

      {showForm && (
        <form onSubmit={handleSubmit} className="client-form">
          <label>ID RUN CLIENTE:</label>
          <input
            type="text"
            name="run_cliente"
            value={formData.run_cliente}
            onChange={handleChange}
            required
          />

          <label>NOMBRE CLIENTE:</label>
          <input
            type="text"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            required
          />

          <label>RFC:</label>
          <input
            type="text"
            name="rfc"
            value={formData.rfc}
            onChange={handleChange}
            required
          />

          <label>DIRECCIÓN:</label>
          <textarea
            name="direccion"
            value={formData.direccion}
            onChange={handleChange}
            required
          />

          <div className="button-container">
            <button type="submit">
              {isEditing ? 'Actualizar Cliente' : 'Registrar Cliente'}
            </button>
          </div>
        </form>
      )}

      <h3>Clientes Registrados</h3>
      <table className="clients-table">
        <thead>
          <tr>
            <th>Cliente ID</th>
            <th>Nombre</th>
            <th>RFC</th>
            <th>Dirección</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {clients.map((client) => (
            <tr key={client.id}>
              <td>{client.run_cliente}</td>
              <td>{client.nombre}</td>
              <td>{client.rfc}</td>
              <td>{client.direccion}</td>
              <td className="actions">
                <button
                  className="icon-button edit-button"
                  onClick={() => handleEdit(client)}>
                  <FontAwesomeIcon icon={faEdit} />
                </button>
                <button
                  className="icon-button delete-button"
                  onClick={() => handleDelete(client.id)}>
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

export default ClientModule;
