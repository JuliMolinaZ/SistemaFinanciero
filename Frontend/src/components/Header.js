// src/components/Header.js
import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { GlobalContext } from '../context/GlobalState';
import { auth } from '../firebase';
import './Header.css';

const Header = () => {
  const { profileData, setCurrentUser, setProfileComplete, setProfileData } = useContext(GlobalContext);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [logo, setLogo] = useState('SigmaBlack.jpeg'); // Estado para el logo
  const navigate = useNavigate();

  useEffect(() => {
    const logos = ['SigmaBlack.jpeg', 'SigmaRed.jpeg'];
    let currentIndex = 0;

    // Función para alternar el logo
    const switchLogo = () => {
      currentIndex = (currentIndex + 1) % logos.length;
      setLogo(logos[currentIndex]);

      // Cambia el favicon dinámicamente
      const faviconElement = document.querySelector("link[rel='icon']");
      if (faviconElement) {
        faviconElement.href = logos[currentIndex];
      }
    };

    // Intervalo de cambio cada 2 horas
    const intervalId = setInterval(switchLogo, 7200000);

    // Limpieza del intervalo al desmontar el componente
    return () => clearInterval(intervalId);
  }, []);

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
      console.error('Error al cerrar sesión:', error);
    }
  };

  return (
    <header className="header">
      <div className="logo-container">
        <img src={logo} alt="Logo" className="logo" />
      </div>
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

