// src/modules/Usuarios/UsersList.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './UsersList.css'; // Asegúrate de incluir este archivo CSS

const UsersList = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('https://sigma.runsolutions-services.com/api/usuarios');
      const data = response.data.map((user) => ({
        ...user,
        avatar: user.avatar || '/assets/avatars/default-avatar.png', // Asegúrate de tener un avatar por defecto
      }));
      setUsers(data);
    } catch (error) {
      console.error('Error al obtener usuarios:', error);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("¿ESTÁS SEGURO QUE QUIERES ELIMINAR ESTE USUARIO?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`/api/usuarios/${id}`);
      setUsers(users.filter((user) => user.id !== id));
    } catch (error) {
      console.error('Error al eliminar el usuario:', error);
    }
  };

  return (
    <section className="users-section">
      <h2 className="users-title">Usuarios</h2>
      <div className="users-grid">
        {users.map((user) => (
          <div className="user-card" key={user.id}>
            <img
              src={user.avatar}
              alt="Avatar"
              className="user-avatar"
            />
            <div className="user-info">
              <p className="user-name">{user.name}</p>
              <p className="user-role">{user.role}</p>
              <p className="user-email">{user.email}</p>
            </div>
            <button
              className="delete-button"
              onClick={() => handleDelete(user.id)}
            >
              Eliminar
            </button>
          </div>
        ))}
      </div>
    </section>
  );
};

export default UsersList;
