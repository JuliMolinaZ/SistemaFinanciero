import React from 'react';
import { Box, IconButton, Typography, Select, MenuItem } from '@mui/material';
import { styled } from '@mui/material/styles';
import { motion } from 'framer-motion';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import LastPageIcon from '@mui/icons-material/LastPage';

const PaginationContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: theme.spacing(2),
  background: 'rgba(255, 255, 255, 0.9)',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  borderRadius: 12,
  boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
}));

const StyledIconButton = styled(IconButton)(({ theme, disabled }) => ({
  width: 40,
  height: 40,
  borderRadius: 8,
  color: disabled ? '#bdc3c7' : '#4ecdc4',
  backgroundColor: disabled ? 'rgba(189, 195, 199, 0.1)' : 'rgba(78, 205, 196, 0.1)',
  border: `1px solid ${disabled ? 'rgba(189, 195, 199, 0.3)' : 'rgba(78, 205, 196, 0.3)'}`,
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  
  '&:hover': {
    backgroundColor: disabled ? 'rgba(189, 195, 199, 0.1)' : 'rgba(78, 205, 196, 0.2)',
    transform: disabled ? 'none' : 'translateY(-2px)',
    boxShadow: disabled ? 'none' : '0 4px 12px rgba(78, 205, 196, 0.3)',
  },
  
  '&:active': {
    transform: disabled ? 'none' : 'translateY(0)',
  }
}));

const PageInfo = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(2),
  color: '#2c3e50',
  fontWeight: 500,
}));

const StyledSelect = styled(Select)(({ theme }) => ({
  minWidth: 80,
  '& .MuiOutlinedInput-root': {
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    border: '1px solid rgba(78, 205, 196, 0.3)',
    '&:hover': {
      borderColor: '#4ecdc4',
    },
    '&.Mui-focused': {
      borderColor: '#4ecdc4',
      boxShadow: '0 0 0 3px rgba(78, 205, 196, 0.1)',
    }
  },
  '& .MuiSelect-select': {
    color: '#2c3e50',
    fontWeight: 500,
  }
}));

const ModernPagination = ({
  count,
  page,
  rowsPerPage,
  rowsPerPageOptions = [5, 10, 25, 50],
  onPageChange,
  onRowsPerPageChange,
  showFirstButton = true,
  showLastButton = true,
  showRowsPerPage = true,
  showPageInfo = true,
  ...props
}) => {
  const totalPages = Math.ceil(count / rowsPerPage);
  const startItem = page * rowsPerPage + 1;
  const endItem = Math.min((page + 1) * rowsPerPage, count);

  const handleFirstPage = () => {
    if (onPageChange) {
      onPageChange(0);
    }
  };

  const handlePreviousPage = () => {
    if (onPageChange && page > 0) {
      onPageChange(page - 1);
    }
  };

  const handleNextPage = () => {
    if (onPageChange && page < totalPages - 1) {
      onPageChange(page + 1);
    }
  };

  const handleLastPage = () => {
    if (onPageChange) {
      onPageChange(totalPages - 1);
    }
  };

  const handleRowsPerPageChange = (event) => {
    if (onRowsPerPageChange) {
      onRowsPerPageChange(event.target.value);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <PaginationContainer {...props}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {showFirstButton && (
            <StyledIconButton
              onClick={handleFirstPage}
              disabled={page === 0}
              aria-label="Primera página"
            >
              <FirstPageIcon />
            </StyledIconButton>
          )}
          
          <StyledIconButton
            onClick={handlePreviousPage}
            disabled={page === 0}
            aria-label="Página anterior"
          >
            <KeyboardArrowLeftIcon />
          </StyledIconButton>
          
          <StyledIconButton
            onClick={handleNextPage}
            disabled={page >= totalPages - 1}
            aria-label="Página siguiente"
          >
            <KeyboardArrowRightIcon />
          </StyledIconButton>
          
          {showLastButton && (
            <StyledIconButton
              onClick={handleLastPage}
              disabled={page >= totalPages - 1}
              aria-label="Última página"
            >
              <LastPageIcon />
            </StyledIconButton>
          )}
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {showPageInfo && (
            <PageInfo>
              <Typography variant="body2">
                {startItem}-{endItem} de {count}
              </Typography>
            </PageInfo>
          )}
          
          {showRowsPerPage && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="body2" color="text.secondary">
                Filas por página:
              </Typography>
              <StyledSelect
                value={rowsPerPage}
                onChange={handleRowsPerPageChange}
                size="small"
              >
                {rowsPerPageOptions.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </StyledSelect>
            </Box>
          )}
        </Box>
      </PaginationContainer>
    </motion.div>
  );
};

export default ModernPagination; 