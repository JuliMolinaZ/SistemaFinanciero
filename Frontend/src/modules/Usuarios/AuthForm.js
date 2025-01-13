// src/modules/Usuarios/AuthForm.js
import React, { useContext } from 'react';
import { GlobalContext } from '../../context/GlobalState';
import { auth, googleProvider } from '../../firebase';
import { signInWithPopup } from 'firebase/auth';
import axios from 'axios';
import { motion } from 'framer-motion'; // Biblioteca para animaciones

const AuthForm = () => {
  const { setCurrentUser, setProfileData, setProfileComplete } = useContext(GlobalContext);

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      // Verificación del dominio permitido
      if (user.email && user.email.endsWith('@runsolutions-services.com')) {
        setCurrentUser(user);

        try {
          // Consultar el perfil del usuario por firebase_uid
          const userResponse = await axios.get(`http://localhost:5000/api/usuarios/firebase/${user.uid}`);
          const userData = userResponse.data;

          setProfileData(userData);
          if (userData.role && userData.role.trim() !== '') {
            setProfileComplete(true);
          } else {
            setProfileComplete(false);
          }
        } catch (error) {
          if (error.response && error.response.status === 404) {
            const payload = {
              firebase_uid: user.uid,
              email: user.email,
              name: user.displayName,
              role: '',
              avatar: user.photoURL || null
            };
            const createResponse = await axios.post('http://localhost:5000/api/usuarios', payload);
            console.log('Usuario creado:', createResponse.data);

            setProfileData(createResponse.data);
            setProfileComplete(false);
          } else {
            console.error('Error al obtener usuario:', error);
          }
        }
      } else {
        alert('El dominio de correo no está autorizado. Por favor, utiliza un correo de runsolutions-services.com.');
        await auth.signOut();
      }
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  };

  return (
    <div className="auth-container">
      <motion.div
        className="auth-card"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h2>¡Bienvenido!</h2>
        <p>Inicia sesión para continuar</p>
        <motion.button
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
