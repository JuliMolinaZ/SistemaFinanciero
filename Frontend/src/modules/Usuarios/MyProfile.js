import React, { useState, useContext, useEffect } from 'react';
import { GlobalContext } from '../../context/GlobalState';
import './MyProfile.css'; // Archivo CSS para los estilos

// Importa los avatares directamente si están en `src/assets/avatars`
import avatar1 from '../../assets/avatars/avatar1.svg';
import avatar2 from '../../assets/avatars/avatar2.svg';
import avatar3 from '../../assets/avatars/avatar3.svg';
import avatar4 from '../../assets/avatars/avatar4.svg';
import avatar5 from '../../assets/avatars/avatar5.svg';
import avatar6 from '../../assets/avatars/avatar6.svg';

const roles = ["Administrador", "Developer", "Contador", "QA"]; // Ajusta según tus roles
const avatars = [avatar1, avatar2, avatar3, avatar4, avatar5, avatar6]; // Arreglo de avatares importados

const MyProfile = () => {
  const { profileData, setProfileData } = useContext(GlobalContext);
  const [form, setForm] = useState({
    name: '',
    role: '',
    avatar: ''
  });
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    if (profileData) {
      setForm({
        name: profileData.name || '',
        role: profileData.role || '',
        avatar: profileData.avatar || avatars[0] // Selecciona el primer avatar por defecto
      });
    }
  }, [profileData]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAvatarUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm({ ...form, avatar: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAvatarSelect = (avatar) => {
    setForm({ ...form, avatar }); // Actualiza el avatar seleccionado
    setModalOpen(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setProfileData({
      ...profileData,
      name: form.name,
      role: form.role,
      avatar: form.avatar
    });
    alert('Perfil actualizado');
  };

  if (!profileData) {
    return <div>Cargando...</div>;
  }

  return (
    <section className="profile-container">
      <form onSubmit={handleSubmit} className="profile-form">
        <div className="avatar-section" onClick={() => setModalOpen(true)}>
          <img
            src={form.avatar || avatars[0]} // Muestra el avatar actual o uno por defecto
            alt="Avatar"
            className="avatar-image"
          />
          <p className="change-avatar-text">Haz clic para cambiar avatar</p>
        </div>
        <div className="form-group">
          <label>Nombre:</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Correo electrónico:</label>
          <input
            type="email"
            value={profileData.email}
            disabled
          />
        </div>
        <div className="form-group">
          <label>Rol en la empresa:</label>
          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            required
          >
            <option value="">Selecciona un rol</option>
            {roles.map((role, idx) => (
              <option key={idx} value={role}>{role}</option>
            ))}
          </select>
        </div>
        <button type="submit" className="save-button">Guardar cambios</button>
      </form>

      {modalOpen && (
        <div className="modal-overlay" onClick={() => setModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Selecciona un avatar</h3>
            <div className="avatar-options">
              {avatars.map((avatar, idx) => (
                <img
                  key={idx}
                  src={avatar}
                  alt={`Avatar ${idx + 1}`}
                  className="avatar-option"
                  onClick={() => handleAvatarSelect(avatar)}
                />
              ))}
            </div>
            <div className="file-upload">
              <label htmlFor="file-upload" className="file-upload-label">
                Subir desde tu computadora
              </label>
              <input
                type="file"
                id="file-upload"
                accept="image/*"
                onChange={handleAvatarUpload}
              />
            </div>
            <button className="close-button" onClick={() => setModalOpen(false)}>
              Cerrar
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default MyProfile;
