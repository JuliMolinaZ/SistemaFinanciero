// src/components/LoadingScreen.js
import React from 'react';
import { Box, Typography, Container } from '@mui/material';
import { motion } from 'framer-motion';

const LoadingScreen = () => {
  return (
    <Container
      maxWidth={false}
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Partículas de fondo animadas */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          overflow: 'hidden',
          zIndex: 0,
        }}
      >
        {[...Array(20)].map((_, index) => (
          <motion.div
            key={index}
            style={{
              position: 'absolute',
              width: Math.random() * 4 + 2,
              height: Math.random() * 4 + 2,
              background: 'rgba(79, 172, 254, 0.6)',
              borderRadius: '50%',
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -100, 0],
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              delay: Math.random() * 2,
              ease: 'easeInOut',
            }}
          />
        ))}
      </Box>

      {/* Contenido principal */}
      <Box
        sx={{
          position: 'relative',
          zIndex: 1,
          textAlign: 'center',
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          borderRadius: 4,
          padding: 6,
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
        }}
      >
        {/* Logo animado */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 1, ease: 'easeOut' }}
          style={{ marginBottom: '2rem' }}
        >
          <Box
            component="img"
            src="/SigmaRed.jpeg"
            alt="Sigma Logo"
            sx={{
              width: 120,
              height: 120,
              borderRadius: '50%',
              border: '3px solid rgba(79, 172, 254, 0.3)',
              boxShadow: '0 0 30px rgba(79, 172, 254, 0.5)',
            }}
          />
        </motion.div>

        {/* Título animado */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <Typography
            variant="h2"
            sx={{
              fontWeight: 900,
              background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
              backgroundSize: '200% 200%',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              animation: 'gradientShift 3s ease infinite',
              mb: 2,
              '@keyframes gradientShift': {
                '0%, 100%': { backgroundPosition: '0% 50%' },
                '50%': { backgroundPosition: '100% 50%' },
              },
            }}
          >
            SIGMA
          </Typography>
        </motion.div>

        {/* Subtítulo */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <Typography
            variant="h6"
            sx={{
              color: 'rgba(255, 255, 255, 0.8)',
              fontWeight: 400,
              mb: 4,
              letterSpacing: 1,
            }}
          >
            Sistema Integral de Gestión y Manejo Administrativo
          </Typography>
        </motion.div>

        {/* Spinner de carga */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 0.7 }}
        >
          <Box
            sx={{
              position: 'relative',
              width: 80,
              height: 80,
              margin: '0 auto',
              mb: 3,
            }}
          >
            {/* Círculo exterior */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                border: '3px solid rgba(79, 172, 254, 0.2)',
                borderTop: '3px solid #4facfe',
                borderRadius: '50%',
              }}
            />
            
            {/* Círculo interior */}
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
              style={{
                position: 'absolute',
                top: '15px',
                left: '15px',
                width: '50px',
                height: '50px',
                border: '2px solid rgba(240, 147, 251, 0.2)',
                borderTop: '2px solid #f093fb',
                borderRadius: '50%',
              }}
            />
            
            {/* Punto central */}
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '8px',
                height: '8px',
                background: '#00f2fe',
                borderRadius: '50%',
                boxShadow: '0 0 10px rgba(0, 242, 254, 0.8)',
              }}
            />
          </Box>
        </motion.div>

        {/* Texto de carga */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 1 }}
        >
          <Typography
            variant="body1"
            sx={{
              color: 'rgba(255, 255, 255, 0.7)',
              fontWeight: 500,
              mb: 2,
            }}
          >
            Inicializando sistema...
          </Typography>
        </motion.div>

        {/* Barra de progreso */}
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: '100%' }}
          transition={{ duration: 2, delay: 1.2 }}
          style={{
            width: '300px',
            height: '4px',
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '2px',
            overflow: 'hidden',
            margin: '0 auto',
          }}
        >
          <motion.div
            animate={{ x: ['-100%', '100%'] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            style={{
              width: '100%',
              height: '100%',
              background: 'linear-gradient(90deg, #4facfe, #00f2fe, #f093fb)',
              borderRadius: '2px',
            }}
          />
        </motion.div>

        {/* Información del sistema */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.5 }}
        >
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              gap: 3,
              mt: 4,
              pt: 3,
              borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            <Box sx={{ textAlign: 'center' }}>
              <Typography
                variant="h6"
                sx={{
                  color: '#4facfe',
                  fontWeight: 700,
                  fontSize: '1.2rem',
                }}
              >
                v2.0.0
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  color: 'rgba(255, 255, 255, 0.6)',
                  display: 'block',
                }}
              >
                Versión
              </Typography>
            </Box>
            
            <Box sx={{ textAlign: 'center' }}>
              <Typography
                variant="h6"
                sx={{
                  color: '#00d4aa',
                  fontWeight: 700,
                  fontSize: '1.2rem',
                }}
              >
                React
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  color: 'rgba(255, 255, 255, 0.6)',
                  display: 'block',
                }}
              >
                Frontend
              </Typography>
            </Box>
            
            <Box sx={{ textAlign: 'center' }}>
              <Typography
                variant="h6"
                sx={{
                  color: '#f093fb',
                  fontWeight: 700,
                  fontSize: '1.2rem',
                }}
              >
                Node.js
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  color: 'rgba(255, 255, 255, 0.6)',
                  display: 'block',
                }}
              >
                Backend
              </Typography>
            </Box>
          </Box>
        </motion.div>
      </Box>

      {/* Efecto de ondas en la parte inferior */}
      <Box
        sx={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: '100%',
          height: '100px',
          overflow: 'hidden',
        }}
      >
        <motion.div
          animate={{
            x: ['-100%', '100%'],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'linear',
          }}
          style={{
            position: 'absolute',
            bottom: 0,
            width: '200%',
            height: '100%',
            background: 'linear-gradient(90deg, transparent, rgba(79, 172, 254, 0.1), transparent)',
            transform: 'skewX(-15deg)',
          }}
        />
      </Box>
    </Container>
  );
};

export default LoadingScreen;
