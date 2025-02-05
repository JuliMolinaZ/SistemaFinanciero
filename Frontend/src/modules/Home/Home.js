// src/modules/Home/Home.js
import React, { useContext, useState, useEffect } from 'react';
import { GlobalContext } from '../../context/GlobalState';
import {
  Container,
  Box,
  Typography,
  Card,
  CardContent,
  useMediaQuery,
} from '@mui/material';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const Home = () => {
  const { profileData } = useContext(GlobalContext);
  const isMobile = useMediaQuery('(max-width:600px)');

  // Lista de frases de motivación
  const motivationalQuotes = [
    "El éxito no es la clave de la felicidad. La felicidad es la clave del éxito.",
    "Cree en ti mismo y todo será posible.",
    "Cada día es una nueva oportunidad para crecer.",
    "Nunca dejes de aprender, porque la vida nunca deja de enseñar.",
    "La disciplina es el puente entre las metas y los logros.",
    "Haz de cada día tu obra maestra.",
    "La actitud es una pequeña cosa que marca una gran diferencia.",
  ];

  // Estado para la frase del día
  const [quote, setQuote] = useState("");
  // Estado de carga
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchQuote = () => {
      const date = new Date();
      const index = date.getDate() % motivationalQuotes.length;
      setQuote(motivationalQuotes[index]);
      setIsLoading(false);
    };

    const timer = setTimeout(fetchQuote, 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Container
      maxWidth={false}
      disableGutters
      sx={{
        width: '100%',
        minHeight: '100vh',
        pt: '100px', // Espacio superior para evitar que el contenido quede oculto tras el header
        pb: '40px',
        backgroundColor: '#000', // Fondo negro
        color: '#fff',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        boxSizing: 'border-box',
      }}
    >
      {/* Logotipo */}
      <Box
        sx={{
          width: isMobile ? 120 : 150,
          height: isMobile ? 120 : 150,
          mb: 4,
          borderRadius: '50%',
          overflow: 'hidden',
          border: '3px solid #444',
          backgroundColor: '#fff',
          boxShadow: '0 4px 12px rgba(0,0,0,0.7)',
          transition: 'transform 0.3s ease, box-shadow 0.3s ease',
          '&:hover': {
            transform: 'scale(1.05)',
            boxShadow: '0 6px 16px rgba(0,0,0,0.9)',
          },
        }}
      >
        {isLoading ? (
          <Skeleton circle={true} height={isMobile ? 120 : 150} width={isMobile ? 120 : 150} />
        ) : (
          <Box
            component="img"
            src="/SigmaRed.jpeg"
            alt="Logo de Sigma"
            sx={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transition: 'transform 0.3s ease',
              '&:hover': { transform: 'rotate(10deg)' },
            }}
          />
        )}
      </Box>

      {/* Título de Bienvenida */}
      <Typography
        variant="h3"
        sx={{
          mb: 2,
          fontWeight: 'bold',
          textShadow: '0 0 10px rgba(0,229,255,0.8)',
          fontSize: { xs: '1.8rem', sm: '2.5rem' },
          transition: 'text-shadow 0.3s ease',
          '&:hover': { textShadow: '0 0 20px rgba(0,229,255,1)' },
        }}
      >
        {isLoading ? (
          <Skeleton width={300} />
        ) : (
          <span>{profileData?.name || 'Usuario'}, bienvenido a </span>
        )}
        {!isLoading && <span style={{ color: '#ffd700' }}> SIGMA</span>}
      </Typography>

      {/* Subtítulo */}
      <Typography
        variant="subtitle1"
        sx={{
          mb: 4,
          maxWidth: 600,
          mx: 'auto',
          opacity: 0.9,
          fontSize: { xs: '1rem', sm: '1.2rem' },
        }}
      >
        {isLoading ? <Skeleton width={400} /> : 'Sistema Integral de Gestión y Manejo Administrativo.'}
      </Typography>

      {/* Cita Motivacional */}
      <Card
        sx={{
          background: 'rgba(255,255,255,0.1)',
          backdropFilter: 'blur(4px)',
          borderRadius: 2,
          boxShadow: '0 4px 14px rgba(0,0,0,0.8)',
          maxWidth: 800,
          width: '90%',
          p: 2,
          transition: 'transform 0.3s ease, box-shadow 0.3s ease',
          '&:hover': {
            transform: 'translateY(-5px)',
            boxShadow: '0 8px 18px rgba(0,0,0,1)',
          },
        }}
      >
        <CardContent>
          {isLoading ? (
            <Skeleton width={500} height={80} />
          ) : (
            <Typography
              variant="h5"
              component="p"
              sx={{ fontStyle: 'italic', color: '#ccc', px: 1 }}
            >
              "{quote}"
            </Typography>
          )}
        </CardContent>
      </Card>

      {/* Detalle decorativo adicional */}
      <Box
        sx={{
          mt: 6,
          width: '90%',
          maxWidth: 800,
          height: 4,
          background: 'linear-gradient(90deg, #ffd700, #ff8c00)',
          borderRadius: 2,
          boxShadow: '0 2px 8px rgba(0,0,0,0.5)',
          transition: 'opacity 0.3s ease',
          opacity: 0.8,
          '&:hover': { opacity: 1 },
        }}
      />
    </Container>
  );
};

export default Home;
