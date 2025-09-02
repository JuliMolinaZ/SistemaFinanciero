import React from 'react';
import { Box, Typography, Grid, Paper, Chip } from '@mui/material';
import CoolAvatar from './CoolAvatar';

// Componente de demostración de avatares
const AvatarShowcase = () => {
  // Usuarios de ejemplo para mostrar diferentes tipos de avatares
  const demoUsers = [
    {
      name: 'Jessica Oviedo',
      email: 'j.oviedo@runsolutions-services.com',
      roles: { name: 'Super Administrador' }
    },
    {
      name: 'Juan Carlos Yanez',
      email: 'jc.yanez@runsolutions-services.com',
      roles: { name: 'Super Administrador' }
    },
    {
      name: 'Julian Molina',
      email: 'j.molina@runsolutions-services.com',
      roles: { name: 'Super Administrador' }
    },
    {
      name: 'Usuario de Prueba',
      email: 'test@example.com',
      roles: { name: 'Invitado' }
    },
    {
      name: 'Gerente de Proyectos',
      email: 'gerente@empresa.com',
      roles: { name: 'Gerente' }
    },
    {
      name: 'Director Financiero',
      email: 'director@empresa.com',
      roles: { name: 'Director' }
    }
  ];

  // Variantes de avatar disponibles
  const variants = ['auto', 'dicebear', 'boring', 'gradient', 'initials'];

  return (
    <Box sx={{ p: 4, background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)', minHeight: '100vh' }}>
      <Typography variant="h3" component="h1" textAlign="center" gutterBottom fontWeight={700} color="#1e293b">
        🎨 Galería de Avatares Geniales
      </Typography>
      
      <Typography variant="h6" textAlign="center" color="#64748b" sx={{ mb: 6 }}>
        Diferentes estilos de avatares generados automáticamente para cada usuario
      </Typography>

      {/* Mostrar diferentes variantes */}
      <Box sx={{ mb: 6 }}>
        <Typography variant="h5" gutterBottom fontWeight={600} color="#1e293b" sx={{ mb: 3 }}>
          🔄 Variantes de Avatar Disponibles
        </Typography>
        
        <Grid container spacing={3}>
          {variants.map((variant) => (
            <Grid item xs={12} sm={6} md={4} key={variant}>
              <Paper 
                elevation={3} 
                sx={{ 
                  p: 3, 
                  textAlign: 'center',
                  background: 'rgba(255,255,255,0.9)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: 3
                }}
              >
                <Typography variant="h6" gutterBottom fontWeight={600} color="#667eea" textTransform="capitalize">
                  {variant}
                </Typography>
                
                <Box display="flex" justifyContent="center" mb={2}>
                  <CoolAvatar 
                    user={demoUsers[0]}
                    size={80}
                    variant={variant}
                    showTooltip={false}
                  />
                </Box>
                
                <Chip 
                  label={variant === 'auto' ? 'Rotación Automática' : variant}
                  color="primary"
                  variant="outlined"
                  size="small"
                />
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Mostrar usuarios con diferentes roles */}
      <Box>
        <Typography variant="h5" gutterBottom fontWeight={600} color="#1e293b" sx={{ mb: 3 }}>
          👥 Usuarios con Diferentes Roles
        </Typography>
        
        <Grid container spacing={3}>
          {demoUsers.map((user, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Paper 
                elevation={3} 
                sx={{ 
                  p: 3,
                  background: 'rgba(255,255,255,0.9)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: 3,
                  transition: 'transform 0.2s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-4px)'
                  }
                }}
              >
                <Box display="flex" alignItems="center" gap={2} mb={2}>
                  <CoolAvatar 
                    user={user}
                    size={60}
                    variant="auto"
                    showTooltip={true}
                  />
                  <Box>
                    <Typography variant="h6" fontWeight={600} color="#1e293b">
                      {user.name}
                    </Typography>
                    <Typography variant="body2" color="#64748b">
                      {user.email}
                    </Typography>
                  </Box>
                </Box>
                
                <Chip 
                  label={user.roles.name}
                  color={
                    user.roles.name.includes('Super') ? 'warning' :
                    user.roles.name.includes('Gerente') ? 'info' :
                    user.roles.name.includes('Director') ? 'success' :
                    'default'
                  }
                  variant="outlined"
                  size="small"
                  sx={{ fontWeight: 600 }}
                />
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Información técnica */}
      <Box sx={{ mt: 6, p: 4, background: 'rgba(255,255,255,0.8)', borderRadius: 3 }}>
        <Typography variant="h6" gutterBottom fontWeight={600} color="#1e293b">
          🛠️ Características Técnicas
        </Typography>
        
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Typography variant="body1" color="#64748b" paragraph>
              <strong>🎨 Estilos Disponibles:</strong>
            </Typography>
            <ul style={{ color: '#64748b', marginLeft: '20px' }}>
              <li><strong>DiceBear:</strong> Avatares geométricos únicos con colores vibrantes</li>
              <li><strong>Boring Avatars:</strong> Patrones de colores consistentes y elegantes</li>
              <li><strong>Gradientes:</strong> Fondos con gradientes personalizados y letras</li>
              <li><strong>Auto:</strong> Rotación automática entre estilos</li>
            </ul>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Typography variant="body1" color="#64748b" paragraph>
              <strong>🔧 Funcionalidades:</strong>
            </Typography>
            <ul style={{ color: '#64748b', marginLeft: '20px' }}>
              <li><strong>Indicador de Rol:</strong> Icono en la esquina inferior derecha</li>
              <li><strong>Colores por Rol:</strong> Cada rol tiene su color distintivo</li>
              <li><strong>Tooltips:</strong> Información del usuario al hacer hover</li>
              <li><strong>Animaciones:</strong> Efectos de hover y transiciones suaves</li>
            </ul>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default AvatarShowcase;
