// src/modules/Home/Home.js
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, CircularProgress } from '@mui/material';
import { motion } from 'framer-motion';

const Home = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirigir automáticamente al Dashboard Ultra
    const timer = setTimeout(() => {
      navigate('/dashboard-ultra');
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white'
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        style={{ textAlign: 'center' }}
      >
        <Typography variant="h2" component="h1" gutterBottom>
          🚀 Dashboard Ultra
        </Typography>
        
        <Typography variant="h5" sx={{ mb: 4, opacity: 0.9 }}>
          Redirigiendo al Dashboard Ultra...
        </Typography>
        
        <CircularProgress size={60} sx={{ color: 'white', mb: 3 }} />
        
        <Typography variant="body1" sx={{ opacity: 0.8 }}>
          Todas las funcionalidades del Dashboard Premium han sido integradas en el Dashboard Ultra
        </Typography>
        
        <Typography variant="body2" sx={{ mt: 2, opacity: 0.7 }}>
          Si no eres redirigido automáticamente, haz clic en "Dashboard Ultra" en el menú
        </Typography>
      </motion.div>
    </Box>
  );
};

export default Home;
