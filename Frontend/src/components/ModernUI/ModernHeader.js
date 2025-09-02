import React from 'react';
import { Box, Typography, Grid, Paper, Chip, IconButton } from '@mui/material';
import { styled } from '@mui/material/styles';
import { motion } from 'framer-motion';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import PeopleIcon from '@mui/icons-material/People';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import AssignmentIcon from '@mui/icons-material/Assignment';

const HeaderContainer = styled(Box)(({ theme }) => ({
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  borderRadius: 20,
  padding: theme.spacing(4),
  marginBottom: theme.spacing(4),
  position: 'relative',
  overflow: 'hidden',
  
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.05"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
    opacity: 0.3,
  }
}));

const StatCard = styled(Paper)(({ theme }) => ({
  background: 'rgba(255, 255, 255, 0.1)',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  borderRadius: 16,
  padding: theme.spacing(3),
  textAlign: 'center',
  transition: 'all 0.3s ease',
  cursor: 'pointer',
  
  '&:hover': {
    transform: 'translateY(-5px)',
    background: 'rgba(255, 255, 255, 0.15)',
    boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
  }
}));

const ModernHeader = ({ 
  title, 
  subtitle, 
  stats = [], 
  actions = [],
  variant = 'default' 
}) => {
  const defaultStats = [
    { label: 'Total Usuarios', value: '1,234', icon: <PeopleIcon />, color: '#4ecdc4' },
    { label: 'Proyectos Activos', value: '56', icon: <AssignmentIcon />, color: '#45b7d1' },
    { label: 'Ingresos Mensuales', value: '$45,678', icon: <AttachMoneyIcon />, color: '#96ceb4' },
    { label: 'Crecimiento', value: '+12.5%', icon: <TrendingUpIcon />, color: '#ff6b6b' }
  ];

  const displayStats = stats.length > 0 ? stats : defaultStats;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <HeaderContainer>
        <Box sx={{ position: 'relative', zIndex: 1 }}>
          {/* Título Principal */}
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <Typography
                variant="h3"
                sx={{
                  fontWeight: 800,
                  color: '#fff',
                  textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
                  mb: 1,
                  fontSize: { xs: '2rem', md: '3rem' }
                }}
              >
                {title}
              </Typography>
            </motion.div>
            
            {subtitle && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    color: 'rgba(255,255,255,0.9)',
                    fontWeight: 400,
                    fontSize: { xs: '1rem', md: '1.25rem' }
                  }}
                >
                  {subtitle}
                </Typography>
              </motion.div>
            )}
          </Box>

          {/* Estadísticas */}
          <Grid container spacing={3} sx={{ mb: 3 }}>
            {displayStats.map((stat, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 * index }}
                >
                  <StatCard>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mb: 2
                      }}
                    >
                      <Box
                        sx={{
                          backgroundColor: stat.color,
                          borderRadius: '50%',
                          p: 1,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          mr: 2
                        }}
                      >
                        <Box sx={{ color: '#fff', fontSize: '1.5rem' }}>
                          {stat.icon}
                        </Box>
                      </Box>
                    </Box>
                    
                    <Typography
                      variant="h4"
                      sx={{
                        fontWeight: 700,
                        color: '#fff',
                        mb: 0.5,
                        fontSize: { xs: '1.5rem', md: '2rem' }
                      }}
                    >
                      {stat.value}
                    </Typography>
                    
                    <Typography
                      variant="body2"
                      sx={{
                        color: 'rgba(255,255,255,0.8)',
                        fontWeight: 500
                      }}
                    >
                      {stat.label}
                    </Typography>
                  </StatCard>
                </motion.div>
              </Grid>
            ))}
          </Grid>

          {/* Acciones */}
          {actions.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
                {actions.map((action, index) => (
                  <Chip
                    key={index}
                    label={action.label}
                    onClick={action.onClick}
                    icon={action.icon}
                    sx={{
                      backgroundColor: 'rgba(255,255,255,0.2)',
                      color: '#fff',
                      fontWeight: 600,
                      cursor: 'pointer',
                      '&:hover': {
                        backgroundColor: 'rgba(255,255,255,0.3)',
                      }
                    }}
                  />
                ))}
              </Box>
            </motion.div>
          )}
        </Box>
      </HeaderContainer>
    </motion.div>
  );
};

export default ModernHeader; 