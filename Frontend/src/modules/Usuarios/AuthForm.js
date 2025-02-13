// src/modules/Usuarios/AuthForm.js
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { auth, googleProvider } from '../../firebase';
import { signInWithPopup } from 'firebase/auth';
import axios from 'axios';
import {
  Container,
  Box,
  Typography,
  Button,
} from '@mui/material';

const AuthForm = ({ setCurrentUser, setProfileData, setProfileComplete }) => {
  const [logo, setLogo] = useState('/SigmaRed.jpeg');

  // Actualiza el logo cada 2 horas
  useEffect(() => {
    const updateLogo = () => {
      const currentTime = new Date().getHours();
      setLogo(currentTime % 4 < 2 ? '/SigmaRed.jpeg' : '/SigmaBlack.jpeg');
    };
    updateLogo();
    const interval = setInterval(updateLogo, 2 * 60 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      // Verifica que el dominio sea correcto
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
            const createResponse = await axios.post('https://sigma.runsolutions-services.com/api/usuarios', payload);
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
    <Container
      maxWidth={false}
      disableGutters
      sx={{
        height: '100vh',
        width: '100vw',
        background: 'linear-gradient(135deg, #ff6b6b, #f94d9a)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        p: 2,
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        style={{
          background: 'white',
          color: '#333',
          padding: '2rem',
          borderRadius: '12px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
          textAlign: 'center',
          width: '100%',
          maxWidth: '400px',
        }}
      >
        <Box sx={{ mb: 2 }}>
          <motion.img
            src={logo}
            alt="Logo de Sigma"
            initial={{ rotate: 0 }}
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            style={{ width: '100px', marginBottom: '1rem' }}
          />
        </Box>
        <Typography variant="h4" sx={{ color: '#f94d9a', mb: 1, fontWeight: 'bold' }}>
          ¡Bienvenido a SIGMA!
        </Typography>
        <Typography variant="body1" sx={{ color: '#666', mb: 3 }}>
          Inicia sesión con tu cuenta para continuar.
        </Typography>
        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
          <Button
            variant="contained"
            sx={{
              background: 'linear-gradient(90deg, #ff6b6b, #f94d9a)',
              color: 'white',
              padding: '0.75rem 1.5rem',
              borderRadius: 2,
              textTransform: 'none',
              boxShadow: 3,
            }}
            onClick={handleGoogleSignIn}
          >
            Ingresar con Gmail
          </Button>
        </motion.div>
      </motion.div>
    </Container>
  );
};

export default AuthForm;


