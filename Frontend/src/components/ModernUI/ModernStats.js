import React from 'react';
import { Box, Typography, Grid, Paper } from '@mui/material';
import { styled } from '@mui/material/styles';
import { motion } from 'framer-motion';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';

const StatCard = styled(Paper)(({ theme, color = '#4ecdc4' }) => ({
  background: 'rgba(255, 255, 255, 0.9)',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  borderRadius: 16,
  padding: theme.spacing(3),
  textAlign: 'center',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  cursor: 'pointer',
  position: 'relative',
  overflow: 'hidden',
  
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '4px',
    background: `linear-gradient(90deg, ${color}, ${color}dd)`,
  },
  
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
    '& .stat-icon': {
      transform: 'scale(1.1)',
    }
  }
}));

const IconContainer = styled(Box)(({ color = '#4ecdc4' }) => ({
  width: 60,
  height: 60,
  borderRadius: '50%',
  background: `linear-gradient(135deg, ${color}, ${color}dd)`,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  margin: '0 auto 16px',
  transition: 'transform 0.3s ease',
  
  '& .MuiSvgIcon-root': {
    fontSize: 28,
    color: 'white',
  }
}));

const ModernStats = ({ stats = [], columns = 4, ...props }) => {
  const getTrendIcon = (trend) => {
    if (trend > 0) {
      return <TrendingUpIcon sx={{ color: '#27ae60', fontSize: 16 }} />;
    } else if (trend < 0) {
      return <TrendingDownIcon sx={{ color: '#e74c3c', fontSize: 16 }} />;
    }
    return null;
  };

  const getTrendColor = (trend) => {
    if (trend > 0) return '#27ae60';
    if (trend < 0) return '#e74c3c';
    return '#7f8c8d';
  };

  return (
    <Grid container spacing={3} {...props}>
      {stats.map((stat, index) => (
        <Grid item xs={12} sm={6} md={12 / columns} key={index}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <StatCard color={stat.color}>
              <IconContainer color={stat.color} className="stat-icon">
                {stat.icon}
              </IconContainer>
              
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 700,
                  color: '#2c3e50',
                  mb: 1,
                  fontSize: { xs: '1.5rem', md: '2rem' }
                }}
              >
                {stat.value}
              </Typography>
              
              <Typography
                variant="body2"
                sx={{
                  color: '#7f8c8d',
                  fontWeight: 500,
                  mb: 1,
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}
              >
                {stat.label}
              </Typography>
              
              {stat.trend !== undefined && (
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}>
                  {getTrendIcon(stat.trend)}
                  <Typography
                    variant="caption"
                    sx={{
                      color: getTrendColor(stat.trend),
                      fontWeight: 600,
                      fontSize: '0.75rem'
                    }}
                  >
                    {stat.trend > 0 ? '+' : ''}{stat.trend}%
                  </Typography>
                </Box>
              )}
              
              {stat.subtitle && (
                <Typography
                  variant="caption"
                  sx={{
                    color: '#95a5a6',
                    display: 'block',
                    mt: 1
                  }}
                >
                  {stat.subtitle}
                </Typography>
              )}
            </StatCard>
          </motion.div>
        </Grid>
      ))}
    </Grid>
  );
};

export default ModernStats; 