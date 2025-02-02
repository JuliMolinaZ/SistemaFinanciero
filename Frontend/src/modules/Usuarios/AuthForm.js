// src/modules/Usuarios/AuthForm.js
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion'; // Biblioteca para animaciones
import { auth, googleProvider } from '../../firebase';
import { signInWithPopup } from 'firebase/auth';
import axios from 'axios';
import './AuthForm.css';

const AuthForm = ({ setCurrentUser, setProfileData, setProfileComplete }) => {
  const [logo, setLogo] = useState('/SigmaRed.jpeg'); // Logo inicial

  // Cambia el logo cada 2 horas
  useEffect(() => {
    const updateLogo = () => {
      const currentTime = new Date().getHours();
      setLogo(currentTime % 4 < 2 ? '/SigmaRed.jpeg' : '/SigmaBlack.jpeg');
    };
    updateLogo(); // Llama una vez al cargar
    const interval = setInterval(updateLogo, 2 * 60 * 60 * 1000); // Cambia cada 2 horas
    return () => clearInterval(interval);
  }, []);

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      if (user.email && user.email.endsWith('@runsolutions-services.com')) {
        try {
          const userResponse = await axios.get(`https://sigma.runsolutions-services.com/api/usuarios/firebase/${user.uid}`);
          setProfileData(userResponse.data);
          setProfileComplete(!!userResponse.data.role);
          setCurrentUser(user);
        } catch (error) {
          if (error.response && error.response.status === 404) {
            const payload = {
              firebase_uid: user.uid,
              email: user.email,
              name: user.displayName,
              role: '',
              avatar: user.photoURL || null,
            };
            const createResponse = await axios.post('/api/usuarios', payload);
            setProfileData(createResponse.data);
            setProfileComplete(false);
            setCurrentUser(user);
          } else {
            console.error('Error al consultar usuario:', error);
          }
        }
      } else {
        alert('El dominio no está autorizado. Usa un correo de runsolutions-services.com.');
        await auth.signOut();
      }
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      alert('No se pudo iniciar sesión. Intenta nuevamente.');
    }
  };

  return (
    <div className="auth-container">
      <motion.div
        className="auth-card"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        <div className="auth-logo">
          <motion.img
            src={logo}
            alt="Logo de Sigma"
            initial={{ rotate: 0 }}
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </div>
        <h2>¡Bienvenido a SIGMA!</h2>
        <p>Inicia sesión con tu cuenta para continuar.</p>
        <motion.button
          className="auth-button"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleGoogleSignIn}
        >
          Ingresar con Gmail
        </motion.button>
      </motion.div>
    </div>
  );
};

export default AuthForm;

