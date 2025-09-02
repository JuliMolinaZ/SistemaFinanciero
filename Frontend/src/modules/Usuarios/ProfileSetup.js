// src/modules/Usuarios/ProfileSetup.js
import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { GlobalContext } from '../../context/GlobalState';

import avatar1 from '../../assets/avatars/avatar1.svg';
import avatar2 from '../../assets/avatars/avatar2.svg';
import avatar3 from '../../assets/avatars/avatar3.svg';
import avatar4 from '../../assets/avatars/avatar4.svg';
import avatar5 from '../../assets/avatars/avatar5.svg';
import avatar6 from '../../assets/avatars/avatar6.svg';

const avatarOptions = [avatar1, avatar2, avatar3, avatar4, avatar5, avatar6];

const ProfileSetup = () => {
  const { currentUser, setProfileData, setProfileComplete } = useContext(GlobalContext);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: currentUser?.displayName || '',
    role: '',
    avatar: ''
  });

  const [roles, setRoles] = useState([]);

  useEffect(() => {
    axios.get('/api/roles')
      .then(response => {
        // Verificar la estructura de la respuesta
        if (response.data && response.data.success && Array.isArray(response.data.data)) {
          setRoles(response.data.data);
        } else if (Array.isArray(response.data)) {
          setRoles(response.data);
        } else {
          setRoles([]);
        }
      })

  }, []);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAvatarSelect = (avatar) => {
    setForm({ ...form, avatar });
  };

  const handleImageUpload = e => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm({ ...form, avatar: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();

    const profile = {
      name: form.name,
      role: form.role,
      avatar: form.avatar
    };

    try {
      const response = await axios.put(`/api/usuarios/firebase/${currentUser.uid}`, profile);

      setProfileData(response.data);
      setProfileComplete(true);
      navigate('/');
    } catch (error) {
      alert('Error actualizando perfil. Intenta nuevamente más tarde.');
    }
  };

  return (
    <section>
      <h2>Completa tu perfil</h2>
      <form onSubmit={handleSubmit}>
        <label>Nombre:</label>
        <input type="text" name="name" value={form.name} onChange={handleChange} required />

        <label>Correo electrónico:</label>
        <input type="email" value={currentUser.email} disabled />

        <label>Rol en la empresa:</label>
        <select name="role" value={form.role} onChange={handleChange} required>
          <option value="">Selecciona un rol</option>
          {roles.map(role => (
            <option key={role.id} value={role.name}>{role.name}</option>
          ))}
        </select>

        <label>Selecciona un avatar:</label>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
          {avatarOptions.map((avatarSrc, index) => (
            <img
              key={index}
              src={avatarSrc}
              alt={`Avatar ${index + 1}`}
              style={{
                width: '50px',
                height: '50px',
                borderRadius: '50%',
                border: form.avatar === avatarSrc ? '2px solid #ff6b6b' : '2px solid transparent',
                cursor: 'pointer'
              }}
              onClick={() => handleAvatarSelect(avatarSrc)}
            />
          ))}
        </div>

        <label>O carga tu propia imagen:</label>
        <input type="file" accept="image/*" onChange={handleImageUpload} />

        <button type="submit">Guardar perfil</button>
      </form>
    </section>
  );
};

export default ProfileSetup;

