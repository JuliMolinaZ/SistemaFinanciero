import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './CategoriasForm.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';

const CategoriasForm = () => {
  const [categorias, setCategorias] = useState([]);
  const [categoria, setCategoria] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchCategorias();
  }, []);

  const fetchCategorias = async () => {
    try {
      const response = await axios.get('https://sigma.runsolutions-services.com/api/categorias');
      setCategorias(response.data);
    } catch (error) {
      console.error('Error al obtener categorías:', error);
    }
  };

  const toggleForm = () => {
    setShowForm(!showForm);
    setIsEditing(false);
    setEditingId(null);
    setCategoria('');
  };

  const handleChange = (e) => {
    setCategoria(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await axios.put(`/api/categorias/${editingId}`, { nombre: categoria });
      } else {
        await axios.post('/api/categorias', { nombre: categoria });
      }
      fetchCategorias();
      toggleForm();
    } catch (error) {
      console.error('Error al registrar/actualizar categoría:', error);
    }
  };

  const handleEdit = (categoria) => {
    setCategoria(categoria.nombre);
    setIsEditing(true);
    setEditingId(categoria.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Estás seguro de que quieres eliminar esta categoría?")) return;

    try {
      await axios.delete(`/api/categorias/${id}`);
      fetchCategorias();
    } catch (error) {
      console.error('Error al eliminar categoría:', error);
    }
  };

  return (
    <section className="categorias-module">
      <h2>Módulo Categorías</h2>
      <button className="toggle-form-button" onClick={toggleForm}>
        {showForm ? 'Cerrar formulario' : 'Registrar Categoría'}
      </button>
      {showForm && (
        <form onSubmit={handleSubmit} className="categorias-form">
          <label htmlFor="nombreCategoria">Nombre de la Categoría:</label>
          <input
            type="text"
            id="nombreCategoria"
            name="nombreCategoria"
            value={categoria}
            onChange={handleChange}
            required
          />
          <button type="submit" className="submit-button">
            {isEditing ? 'Actualizar Categoría' : 'Registrar Categoría'}
          </button>
        </form>
      )}

      <h3>Categorías Registradas</h3>
      <table className="categorias-table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {categorias.map((categoria) => (
            <tr key={categoria.id}>
              <td>{categoria.nombre}</td>
              <td className="actions">
                <button
                  className="icon-button edit-button"
                  onClick={() => handleEdit(categoria)}
                >
                  <FontAwesomeIcon icon={faEdit} />
                </button>
                <button
                  className="icon-button delete-button"
                  onClick={() => handleDelete(categoria.id)}
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

export default CategoriasForm;