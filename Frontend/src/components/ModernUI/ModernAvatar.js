import React from 'react';
import { Avatar, Box, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { motion } from 'framer-motion';
import PersonIcon from '@mui/icons-material/Person';

const StyledAvatar = styled(Avatar)(({ theme, size = 'medium', status }) => ({
  position: 'relative',
  border: '3px solid rgba(255, 255, 255, 0.9)',
  boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  
  '&:hover': {
    transform: 'scale(1.05)',
    boxShadow: '0 8px 30px rgba(0,0,0,0.15)',
  },
  
  '&::after': status ? {
    content: '""',
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 12,
    height: 12,
    borderRadius: '50%',
    border: '2px solid white',
    backgroundColor: status === 'online' ? '#27ae60' : 
                   status === 'offline' ? '#e74c3c' : 
                   status === 'away' ? '#f39c12' : '#95a5a6',
  } : {},
}));

const ModernAvatar = ({
  src,
  alt,
  size = 'medium',
  status,
  name,
  email,
  showDetails = false,
  onClick,
  ...props
}) => {
  const getSize = () => {
    switch (size) {
      case 'small': return 32;
      case 'large': return 80;
      case 'xlarge': return 120;
      default: return 48;
    }
  };

  const getInitials = (name) => {
    if (!name) return '?';
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'online': return '#27ae60';
      case 'offline': return '#e74c3c';
      case 'away': return '#f39c12';
      default: return '#95a5a6';
    }
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <StyledAvatar
          src={src}
          alt={alt || name}
          size={size}
          status={status}
          onClick={onClick}
          sx={{
            width: getSize(),
            height: getSize(),
            fontSize: getSize() * 0.4,
            bgcolor: src ? 'transparent' : '#4ecdc4',
            ...props.sx
          }}
          {...props}
        >
          {!src && (name ? getInitials(name) : <PersonIcon />)}
        </StyledAvatar>
        
        {showDetails && (name || email) && (
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            {name && (
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 600,
                  color: '#2c3e50',
                  lineHeight: 1.2
                }}
              >
                {name}
              </Typography>
            )}
            {email && (
              <Typography
                variant="caption"
                sx={{
                  color: '#7f8c8d',
                  fontSize: '0.75rem'
                }}
              >
                {email}
              </Typography>
            )}
            {status && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
                <Box
                  sx={{
                    width: 6,
                    height: 6,
                    borderRadius: '50%',
                    bgcolor: getStatusColor(status)
                  }}
                />
                <Typography
                  variant="caption"
                  sx={{
                    color: '#7f8c8d',
                    fontSize: '0.7rem',
                    textTransform: 'capitalize'
                  }}
                >
                  {status}
                </Typography>
              </Box>
            )}
          </Box>
        )}
      </Box>
    </motion.div>
  );
};

export default ModernAvatar; 