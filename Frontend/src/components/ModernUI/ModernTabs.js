import React from 'react';
import { Tabs, Tab, Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import { motion } from 'framer-motion';

const StyledTabs = styled(Tabs)(({ theme }) => ({
  '& .MuiTabs-indicator': {
    backgroundColor: '#4ecdc4',
    height: 3,
    borderRadius: '2px 2px 0 0',
  },
  
  '& .MuiTabs-flexContainer': {
    gap: theme.spacing(1),
  }
}));

const StyledTab = styled(Tab)(({ theme }) => ({
  minHeight: 48,
  minWidth: 120,
  borderRadius: '8px 8px 0 0',
  color: '#7f8c8d',
  fontWeight: 600,
  fontSize: '0.875rem',
  textTransform: 'none',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  
  '&:hover': {
    color: '#4ecdc4',
    backgroundColor: 'rgba(78, 205, 196, 0.1)',
  },
  
  '&.Mui-selected': {
    color: '#4ecdc4',
    backgroundColor: 'rgba(78, 205, 196, 0.1)',
  },
  
  '& .MuiTab-iconWrapper': {
    marginRight: theme.spacing(1),
    '& .MuiSvgIcon-root': {
      fontSize: '1.25rem',
    }
  }
}));

const TabPanel = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  background: 'rgba(255, 255, 255, 0.9)',
  borderRadius: '0 0 12px 12px',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  borderTop: 'none',
  minHeight: 200,
}));

const ModernTabs = ({
  tabs = [],
  value = 0,
  onChange,
  orientation = 'horizontal',
  variant = 'standard',
  centered = false,
  fullWidth = false,
  ...props
}) => {
  const handleChange = (event, newValue) => {
    if (onChange) {
      onChange(event, newValue);
    }
  };

  return (
    <Box sx={{ width: '100%' }}>
      <StyledTabs
        value={value}
        onChange={handleChange}
        orientation={orientation}
        variant={variant}
        centered={centered}
        fullWidth={fullWidth}
        {...props}
      >
        {tabs.map((tab, index) => (
          <StyledTab
            key={index}
            label={tab.label}
            icon={tab.icon}
            iconPosition={tab.iconPosition || 'start'}
            disabled={tab.disabled}
            sx={tab.sx}
          />
        ))}
      </StyledTabs>
      
      {tabs.map((tab, index) => (
        <TabPanel
          key={index}
          role="tabpanel"
          hidden={value !== index}
          id={`tabpanel-${index}`}
          aria-labelledby={`tab-${index}`}
        >
          {value === index && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {tab.content}
            </motion.div>
          )}
        </TabPanel>
      ))}
    </Box>
  );
};

export default ModernTabs; 