import React from 'react';
import { Card, CardContent, CardActions, Box, Typography, Chip, IconButton } from '@mui/material';
import { styled } from '@mui/material/styles';
import { motion } from 'framer-motion';

const StyledCard = styled(Card)(({ theme, variant = 'default' }) => ({
  position: 'relative',
  borderRadius: 16,
  background: variant === 'glass' 
    ? 'rgba(255, 255, 255, 0.1)'
    : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  backdropFilter: variant === 'glass' ? 'blur(10px)' : 'none',
  border: variant === 'glass' ? '1px solid rgba(255, 255, 255, 0.2)' : 'none',
  boxShadow: variant === 'glass' 
    ? '0 8px 32px 0 rgba(31, 38, 135, 0.37)'
    : '0 20px 40px rgba(0,0,0,0.1)',
  overflow: 'hidden',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  cursor: 'pointer',
  
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '4px',
    background: 'linear-gradient(90deg, #ff6b6b, #4ecdc4, #45b7d1, #96ceb4)',
    backgroundSize: '400% 400%',
    animation: 'gradientShift 3s ease infinite',
  },
  
  '&:hover': {
    transform: 'translateY(-8px) scale(1.02)',
    boxShadow: variant === 'glass'
      ? '0 20px 60px rgba(31, 38, 135, 0.5)'
      : '0 30px 60px rgba(0,0,0,0.2)',
  },
  
  '@keyframes gradientShift': {
    '0%': { backgroundPosition: '0% 50%' },
    '50%': { backgroundPosition: '100% 50%' },
    '100%': { backgroundPosition: '0% 50%' },
  }
}));

const ModernCard = ({ 
  children, 
  title, 
  subtitle, 
  badges = [], 
  actions = [], 
  variant = 'default',
  onClick,
  elevation = 3,
  ...props 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <StyledCard 
        variant={variant} 
        elevation={elevation}
        onClick={onClick}
        {...props}
      >
        {(title || subtitle || badges.length > 0) && (
          <CardContent sx={{ pb: badges.length > 0 ? 1 : 2 }}>
            {title && (
              <Typography 
                variant="h6" 
                sx={{ 
                  fontWeight: 700,
                  color: variant === 'glass' ? '#fff' : '#1a1a1a',
                  mb: subtitle ? 0.5 : 1,
                  fontSize: '1.1rem'
                }}
              >
                {title}
              </Typography>
            )}
            
            {subtitle && (
              <Typography 
                variant="body2" 
                sx={{ 
                  color: variant === 'glass' ? 'rgba(255,255,255,0.8)' : '#666',
                  mb: 1,
                  fontSize: '0.9rem'
                }}
              >
                {subtitle}
              </Typography>
            )}
            
            {badges.length > 0 && (
              <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', mt: 1 }}>
                {badges.map((badge, index) => (
                  <Chip
                    key={index}
                    label={badge.label}
                    size="small"
                    sx={{
                      backgroundColor: badge.color || '#4ecdc4',
                      color: '#fff',
                      fontWeight: 600,
                      fontSize: '0.75rem',
                      '& .MuiChip-label': {
                        px: 1,
                      }
                    }}
                  />
                ))}
              </Box>
            )}
          </CardContent>
        )}
        
        {children}
        
        {actions.length > 0 && (
          <CardActions sx={{ pt: 0, pb: 2, px: 2 }}>
            {actions.map((action, index) => (
              <IconButton
                key={index}
                onClick={(e) => {
                  e.stopPropagation();
                  action.onClick();
                }}
                sx={{
                  color: action.color || '#4ecdc4',
                  '&:hover': {
                    backgroundColor: `${action.color || '#4ecdc4'}20`,
                  }
                }}
              >
                {action.icon}
              </IconButton>
            ))}
          </CardActions>
        )}
      </StyledCard>
    </motion.div>
  );
};

export default ModernCard; 