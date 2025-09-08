// src/modules/Home/Home.js
import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { GlobalContext } from '../../context/GlobalState';
import {
  Container,
  Box,
  Typography,
  Card,
  CardContent,
  CardActionArea,
  Grid,
  useMediaQuery,
} from '@mui/material';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import {
  MdDashboard,
  MdPeople,
  MdPayment,
  MdFolder,
  MdSettings,
  MdShowChart,
} from 'react-icons/md';

const modulesData = [
  { name: 'Inicio', route: '/', icon: <MdDashboard size={40} /> },
  { name: 'Clientes', route: '/clientes', icon: <MdPeople size={40} /> },
  { name: 'Proyectos', route: '/proyectos', icon: <MdFolder size={40} /> },
  { name: 'Proveedores', route: '/proveedores', icon: <MdFolder size={40} /> },
  { name: 'Cuentas por Pagar', route: '/cuentas-pagar', icon: <MdPayment size={40} /> },
  { name: 'Costos Fijos', route: '/costos-fijos', icon: <MdPayment size={40} /> },
  { name: 'Cuentas por Cobrar', route: '/cuentas-cobrar', icon: <MdPayment size={40} /> },
  { name: 'Contabilidad', route: '/contabilidad', icon: <MdSettings size={40} /> },
  { name: 'Categorías', route: '/categorias', icon: <MdFolder size={40} /> },
  { name: 'Requisiciones', route: '/requisiciones', icon: <MdDashboard size={40} /> },
  { name: 'Recuperación', route: '/recuperacion', icon: <MdPayment size={40} /> },
  { name: 'Usuarios', route: '/usuarios', icon: <MdPeople size={40} /> },
  { name: 'Permisos', route: '/permisos', icon: <MdSettings size={40} /> },
  { name: 'Realtime Graph', route: '/realtime-graph', icon: <MdShowChart size={40} /> },
  { name: 'Facturas Emitidas', route: '/emitidas', icon: <MdFolder size={40} /> },
  { name: 'Cotizaciones', route: '/cotizaciones', icon: <MdFolder size={40} /> },
  { name: 'Flow Recovery V2', route: '/flow-recovery-v2', icon: <MdPayment size={40} /> },
  { name: 'Horas Extra', route: '/horas-extra', icon: <MdDashboard size={40} /> },
];

const Home = () => {
  const { profileData } = useContext(GlobalContext);
  const isMobile = useMediaQuery('(max-width:600px)');
  const navigate = useNavigate();
  const [quote, setQuote] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const motivationalQuotes = [
    "El éxito no es la clave de la felicidad. La felicidad es la clave del éxito.",
    "Cree en ti mismo y todo será posible.",
    "Cada día es una nueva oportunidad para crecer.",
    "Nunca dejes de aprender, porque la vida nunca deja de enseñar.",
    "La disciplina es el puente entre las metas y los logros.",
    "Haz de cada día tu obra maestra.",
    "La actitud es una pequeña cosa que marca una gran diferencia.",
  ];

  useEffect(() => {
    const timer = setTimeout(() => {
      const date = new Date();
      const index = date.getDate() % motivationalQuotes.length;
      setQuote(motivationalQuotes[index]);
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Container
      maxWidth={false}
      disableGutters
      sx={{
        width: '100%',
        minHeight: '100vh',
        pt: '100px', // Espacio para el header fijo
        pb: '40px',
        backgroundColor: '#000',
        color: '#fff',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
      }}
    >
      {/* Sección superior: Logo y bienvenida */}
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 4 }}>
        <Box
          sx={{
            width: isMobile ? 120 : 150,
            height: isMobile ? 120 : 150,
            mb: 2,
            borderRadius: '50%',
            overflow: 'hidden',
            border: '3px solid #444',
            boxShadow: '0 4px 12px rgba(0,0,0,0.7)',
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
        <Typography
          variant="h3"
          sx={{
            fontWeight: 'bold',
            textShadow: '0 0 10px rgba(0,229,255,0.8)',
            fontSize: { xs: '1.8rem', sm: '2.5rem' },
          }}
        >
          {profileData?.name || 'Usuario'}, bienvenido a <span style={{ color: '#ffd700' }}>SIGMA</span>
        </Typography>
      </Box>

      {/* Línea divisoria */}
      <Box
        sx={{
          width: '90%',
          maxWidth: 1000,
          borderBottom: '2px solid #fff',
          mb: 4,
        }}
      />

      {/* Sección de Tarjetas para Módulos */}
      <Box sx={{ width: '90%', maxWidth: 1000 }}>
        <Grid container spacing={3}>
          {modulesData.map((module, idx) => (
            <Grid item xs={12} sm={6} md={4} key={idx}>
              <Card
                sx={{
                  background: 'linear-gradient(90deg, #ff6b6b, #f94d9a)',
                  color: '#fff',
                  transition: 'transform 0.3s, box-shadow 0.3s',
                  '&:hover': { transform: 'scale(1.05)', boxShadow: '0 8px 16px rgba(0,0,0,0.3)' },
                }}
              >
                <CardActionArea onClick={() => navigate(module.route)}>
                  <CardContent>
                    <Box sx={{ mb: 2 }}>{module.icon}</Box>
                    <Typography variant="h6">{module.name}</Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Container>
  );
};

export default Home;
