// src/components/Header.js
import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { GlobalContext } from '../context/GlobalState';
import { auth } from '../firebase';        // Importa el objeto auth de Firebase
import './Header.css';

const Header = () => {
  const { profileData, setCurrentUser, setProfileComplete, setProfileData } = useContext(GlobalContext);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  const handleLogout = async () => {
    try {
      // Cierra sesión en Firebase
      await auth.signOut();

      // Limpia el estado global
      setCurrentUser(null);
      setProfileComplete(false);
      setProfileData(null);
      setDropdownOpen(false);

      // Redirige al inicio o a la página de autenticación
      navigate('/');
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  return (
    <header>
      <h1>Sistema de Gestión Financiera</h1>
      {profileData && (
        <div className="profileContainer">
          <div className="profileInfo" onClick={toggleDropdown}>
            <img
              src={profileData.avatar || 'default-avatar.png'}
              alt="Avatar"
              className="avatar"
            />
            <div className="userDetails">
              <div>{profileData.name}</div>
              <div className="userRole">{profileData.role}</div>
            </div>
          </div>
          {dropdownOpen && (
            <div className="dropdownMenu">
              <ul className="menuList">
                <li
                  className="menuItem"
                  onClick={() => {
                    navigate('/mi-perfil');
                    setDropdownOpen(false);
                  }}
                >
                  Mi perfil
                </li>
                <li className="menuItem" onClick={handleLogout}>
                  Salir
                </li>
                <li className="menuItem" onClick={() => { /* Acción Soporte */ }}>
                  Soporte
                </li>
              </ul>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;
