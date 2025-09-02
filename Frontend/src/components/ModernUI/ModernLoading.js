import React from 'react';
import { Box, Typography, CircularProgress, LinearProgress } from '@mui/material';
import { styled } from '@mui/material/styles';
import { motion } from 'framer-motion';

const LoadingContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: 200,
  padding: theme.spacing(4),
  background: 'rgba(255, 255, 255, 0.9)',
  borderRadius: 16,
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(255, 255, 255, 0.2)',
}));

const StyledCircularProgress = styled(CircularProgress)(({ theme }) => ({
  color: '#4ecdc4',
  '& .MuiCircularProgress-circle': {
    strokeLinecap: 'round',
  }
}));

const StyledLinearProgress = styled(LinearProgress)(({ theme }) => ({
  height: 8,
  borderRadius: 4,
  backgroundColor: 'rgba(78, 205, 196, 0.1)',
  '& .MuiLinearProgress-bar': {
    borderRadius: 4,
    background: 'linear-gradient(90deg, #4ecdc4, #45b7d1)',
  }
}));

const ShimmerBox = styled(Box)(({ theme }) => ({
  background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
  backgroundSize: '200% 100%',
  animation: 'shimmer 1.5s infinite',
  borderRadius: 8,
  
  '@keyframes shimmer': {
    '0%': {
      backgroundPosition: '-200px 0',
    },
    '100%': {
      backgroundPosition: 'calc(200px + 100%) 0',
    },
  }
}));

const ModernLoading = ({
  type = 'circular',
  message = 'Cargando...',
  progress,
  size = 'medium',
  fullScreen = false,
  ...props
}) => {
  const getSize = () => {
    switch (size) {
      case 'small': return 24;
      case 'large': return 60;
      default: return 40;
    }
  };

  const LoadingContent = () => (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      {type === 'circular' && (
        <Box sx={{ textAlign: 'center' }}>
          <StyledCircularProgress size={getSize()} />
          {message && (
            <Typography
              variant="body2"
              sx={{
                mt: 2,
                color: '#7f8c8d',
                fontWeight: 500
              }}
            >
              {message}
            </Typography>
          )}
        </Box>
      )}

      {type === 'linear' && (
        <Box sx={{ width: '100%' }}>
          <StyledLinearProgress 
            variant={progress !== undefined ? 'determinate' : 'indeterminate'}
            value={progress}
          />
          {message && (
            <Typography
              variant="body2"
              sx={{
                mt: 1,
                color: '#7f8c8d',
                fontWeight: 500,
                textAlign: 'center'
              }}
            >
              {message}
            </Typography>
          )}
        </Box>
      )}

      {type === 'skeleton' && (
        <Box sx={{ width: '100%' }}>
          <ShimmerBox sx={{ height: 20, mb: 1 }} />
          <ShimmerBox sx={{ height: 16, mb: 1, width: '80%' }} />
          <ShimmerBox sx={{ height: 16, width: '60%' }} />
        </Box>
      )}

      {type === 'dots' && (
        <Box sx={{ textAlign: 'center' }}>
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, mb: 2 }}>
            {[0, 1, 2].map((index) => (
              <motion.div
                key={index}
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 1, 0.5]
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  delay: index * 0.2
                }}
              >
                <Box
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    bgcolor: '#4ecdc4'
                  }}
                />
              </motion.div>
            ))}
          </Box>
          {message && (
            <Typography
              variant="body2"
              sx={{
                color: '#7f8c8d',
                fontWeight: 500
              }}
            >
              {message}
            </Typography>
          )}
        </Box>
      )}
    </motion.div>
  );

  if (fullScreen) {
    return (
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: 'rgba(0, 0, 0, 0.5)',
          backdropFilter: 'blur(5px)',
          zIndex: 9999
        }}
      >
        <LoadingContainer>
          <LoadingContent />
        </LoadingContainer>
      </Box>
    );
  }

  return (
    <LoadingContainer {...props}>
      <LoadingContent />
    </LoadingContainer>
  );
};

export default ModernLoading; 