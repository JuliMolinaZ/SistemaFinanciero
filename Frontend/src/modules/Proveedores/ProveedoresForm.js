import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ProveedoresForm.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';

const ProveedorModule = () => {
  const [proveedores, setProveedores] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingProveedorId, setEditingProveedorId] = useState(null);
  const [formData, setFormData] = useState({
    run_proveedor: '',
    nombre: '',
    direccion: '',
    elemento: '',
    datos_bancarios: '',
    contacto: '',
  });

  useEffect(() => {
    fetchProveedores();
  }, []);

  const fetchProveedores = async () => {
    try {
      const response = await axios.get('https://sigma.runsolutions-services.com/api/proveedores');
      setProveedores(response.data);
    } catch (error) {
      console.error('Error al obtener proveedores:', error);
    }
  };

  const toggleForm = () => {
    if (showForm) {
      resetForm();
    }
    setShowForm(!showForm);
  };

  const resetForm = () => {
    setIsEditing(false);
    setEditingProveedorId(null);
    setFormData({
      run_proveedor: '',
      nombre: '',
      direccion: '',
      elemento: '',
      datos_bancarios: '',
      contacto: '',
    });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await axios.put(`/api/proveedores/${editingProveedorId}`, formData);
      } else {
        await axios.post('/api/proveedores', formData);
      }
      fetchProveedores();
      toggleForm();
    } catch (error) {
      console.error('Error al enviar el formulario:', error);
    }
  };

  const handleEdit = (proveedor) => {
    setIsEditing(true);
    setEditingProveedorId(proveedor.id);
    setFormData({
      run_proveedor: proveedor.run_proveedor,
      nombre: proveedor.nombre,
      direccion: proveedor.direccion,
      elemento: proveedor.elemento,
      datos_bancarios: proveedor.datos_bancarios || '',
      contacto: proveedor.contacto || '',
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("¿Estás seguro de que quieres eliminar este proveedor?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`/api/proveedores/${id}`);
      fetchProveedores();
    } catch (error) {
      console.error('Error al eliminar el proveedor:', error);
    }
  };

  return (
    <section className="proveedores-module">
      <h2>Proveedores</h2>
      <button onClick={toggleForm} className="toggle-form-button">
        {showForm ? 'Cerrar formulario' : 'Crear proveedor'}
      </button>

      {showForm && (
        <form onSubmit={handleSubmit} className="proveedores-form">
          <label>ID RUN PROVEEDOR:</label>
          <input
            type="text"
            name="run_proveedor"
            value={formData.run_proveedor}
            onChange={handleChange}
            required
          />

          <label>NOMBRE PROVEEDOR:</label>
          <input
            type="text"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            required
          />

          <label>ELEMENTO:</label>
          <input
            type="text"
            name="elemento"
            value={formData.elemento}
            onChange={handleChange}
            required
          />

          <label>DATOS BANCARIOS:</label>
          <input
            type="text"
            name="datos_bancarios"
            value={formData.datos_bancarios}
            onChange={handleChange}
            required
          />

          <label>CONTACTO:</label>
          <input
            type="text"
            name="contacto"
            value={formData.contacto}
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

          <button type="submit" className="submit-button">
            {isEditing ? 'Actualizar Proveedor' : 'Registrar Proveedor'}
          </button>
        </form>
      )}

      <h3>Proveedores Registrados</h3>
      <table className="proveedores-table">
        <thead>
          <tr>
            <th>RUN Proveedor</th>
            <th>Nombre</th>
            <th>Elemento</th>
            <th>Datos Bancarios</th>
            <th>Contacto</th>
            <th>Dirección</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {proveedores.map((proveedor) => (
            <tr key={proveedor.id}>
              <td>{proveedor.run_proveedor}</td>
              <td>{proveedor.nombre}</td>
              <td>{proveedor.elemento}</td>
              <td>{proveedor.datos_bancarios}</td>
              <td>{proveedor.contacto}</td>
              <td>{proveedor.direccion}</td>
              <td className="actions">
                <button
                  className="icon-button edit-button"
                  onClick={() => handleEdit(proveedor)}
                >
                  <FontAwesomeIcon icon={faEdit} />
                </button>
                <button
                  className="icon-button delete-button"
                  onClick={() => handleDelete(proveedor.id)}
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

export default ProveedorModule;
