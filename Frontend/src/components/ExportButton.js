import React, { useState } from 'react';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Typography,
  Box,
  CircularProgress,
  Alert,
  Chip,
  IconButton
} from '@mui/material';
import { styled } from '@mui/material/styles';
import DownloadIcon from '@mui/icons-material/Download';
import ExcelIcon from '@mui/icons-material/TableChart';
import CsvIcon from '@mui/icons-material/Description';
import PdfIcon from '@mui/icons-material/PictureAsPdf';
import CloseIcon from '@mui/icons-material/Close';

const StyledButton = styled(Button)(({ theme }) => ({
  background: 'linear-gradient(135deg, #667eea, #764ba2)',
  color: '#fff',
  borderRadius: 8,
  padding: '12px 24px',
  fontWeight: 600,
  textTransform: 'none',
  boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)',
  '&:hover': {
    background: 'linear-gradient(135deg, #5a6fd8, #6a4190)',
    boxShadow: '0 6px 20px rgba(102, 126, 234, 0.4)',
    transform: 'translateY(-2px)'
  }
}));

const ExportButton = ({ 
  modules = [], 
  onExport, 
  variant = 'contained',
  size = 'medium',
  disabled = false,
  sx = {}
}) => {
  const [open, setOpen] = useState(false);
  const [selectedModules, setSelectedModules] = useState([]);
  const [exportFormat, setExportFormat] = useState('excel');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Módulos disponibles por defecto
  const defaultModules = [
    { id: 'clients', name: 'Clientes', description: 'Información de clientes y contactos' },
    { id: 'projects', name: 'Proyectos', description: 'Proyectos y sus estados' },
    { id: 'providers', name: 'Proveedores', description: 'Proveedores y servicios' },
    { id: 'cuentas-pagar', name: 'Cuentas por Pagar', description: 'Obligaciones pendientes' },
    { id: 'cuentas-cobrar', name: 'Cuentas por Cobrar', description: 'Cobros pendientes' },
    { id: 'contabilidad', name: 'Contabilidad', description: 'Registros contables' }
  ];

  const availableModules = modules.length > 0 ? modules : defaultModules;

  const handleOpen = () => {
    setSelectedModules(availableModules.map(m => m.id));
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedModules([]);
    setError(null);
  };

  const handleModuleToggle = (moduleId) => {
    setSelectedModules(prev => 
      prev.includes(moduleId) 
        ? prev.filter(id => id !== moduleId)
        : [...prev, moduleId]
    );
  };

  const handleSelectAll = () => {
    setSelectedModules(availableModules.map(m => m.id));
  };

  const handleDeselectAll = () => {
    setSelectedModules([]);
  };

  const handleExport = async () => {
    if (selectedModules.length === 0) {
      setError('Debes seleccionar al menos un módulo para exportar');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const exportData = {
        modules: selectedModules,
        format: exportFormat,
        timestamp: new Date().toISOString()
      };

      if (onExport) {
        await onExport(exportData);
      } else {
        // Exportación por defecto
        await defaultExport(exportData);
      }

      handleClose();
    } catch (err) {
      setError(err.message || 'Error al exportar los datos');
    } finally {
      setLoading(false);
    }
  };

  const defaultExport = async (exportData) => {

    // Simular delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Crear y descargar archivo de ejemplo
    const content = `Módulos exportados: ${exportData.modules.join(', ')}\nFormato: ${exportFormat}\nFecha: ${new Date().toLocaleString()}`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `reporte_${exportFormat}_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getFormatIcon = (format) => {
    switch (format) {
      case 'excel':
        return <ExcelIcon />;
      case 'csv':
        return <CsvIcon />;
      case 'pdf':
        return <PdfIcon />;
      default:
        return <DownloadIcon />;
    }
  };

  const getFormatLabel = (format) => {
    switch (format) {
      case 'excel':
        return 'Excel (.xlsx)';
      case 'csv':
        return 'CSV (.csv)';
      case 'pdf':
        return 'PDF (.pdf)';
      default:
        return 'Archivo';
    }
  };

  return (
    <>
      <StyledButton
        variant={variant}
        size={size}
        disabled={disabled}
        onClick={handleOpen}
        startIcon={<DownloadIcon />}
        sx={sx}
      >
        Exportar Informe
      </StyledButton>

      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          fontWeight: 700,
          color: '#2c3e50'
        }}>
          📊 Exportar Informe del Sistema
          <IconButton onClick={handleClose} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent>
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" sx={{ mb: 2, color: '#34495e' }}>
              Selecciona el formato de exportación
            </Typography>
            <FormControl fullWidth>
              <InputLabel>Formato de archivo</InputLabel>
              <Select
                value={exportFormat}
                onChange={(e) => setExportFormat(e.target.value)}
                label="Formato de archivo"
              >
                <MenuItem value="excel">
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <ExcelIcon sx={{ color: '#217346' }} />
                    Excel (.xlsx)
                  </Box>
                </MenuItem>
                <MenuItem value="csv">
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CsvIcon sx={{ color: '#ff6b35' }} />
                    CSV (.csv)
                  </Box>
                </MenuItem>
                <MenuItem value="pdf">
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <PdfIcon sx={{ color: '#d32f2f' }} />
                    PDF (.pdf)
                  </Box>
                </MenuItem>
              </Select>
            </FormControl>
          </Box>

          <Box sx={{ mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" sx={{ color: '#34495e' }}>
                Módulos a exportar
              </Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button size="small" onClick={handleSelectAll} variant="outlined">
                  Seleccionar Todo
                </Button>
                <Button size="small" onClick={handleDeselectAll} variant="outlined">
                  Deseleccionar Todo
                </Button>
              </Box>
            </Box>

            <FormGroup sx={{ maxHeight: 300, overflowY: 'auto' }}>
              {availableModules.map((module) => (
                <FormControlLabel
                  key={module.id}
                  control={
                    <Checkbox
                      checked={selectedModules.includes(module.id)}
                      onChange={() => handleModuleToggle(module.id)}
                      sx={{
                        color: '#667eea',
                        '&.Mui-checked': {
                          color: '#667eea'
                        }
                      }}
                    />
                  }
                  label={
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                        {module.name}
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#7f8c8d' }}>
                        {module.description}
                      </Typography>
                    </Box>
                  }
                />
              ))}
            </FormGroup>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, p: 2, backgroundColor: 'rgba(255,255,255,0.7)', borderRadius: 2 }}>
            <Typography variant="body2" sx={{ color: '#7f8c8d' }}>
              Módulos seleccionados:
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {selectedModules.map(moduleId => {
                const module = availableModules.find(m => m.id === moduleId);
                return (
                  <Chip
                    key={moduleId}
                    label={module?.name || moduleId}
                    size="small"
                    sx={{
                      backgroundColor: '#667eea',
                      color: 'white',
                      fontWeight: 500
                    }}
                  />
                );
              })}
            </Box>
          </Box>
        </DialogContent>

        <DialogActions sx={{ p: 3, gap: 2 }}>
          <Button
            onClick={handleClose}
            variant="outlined"
            sx={{
              border: '1px solid rgba(102, 126, 234, 0.3)',
              color: '#667eea',
              '&:hover': {
                borderColor: '#667eea',
                background: 'rgba(102, 126, 234, 0.05)'
              }
            }}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleExport}
            variant="contained"
            disabled={loading || selectedModules.length === 0}
            startIcon={loading ? <CircularProgress size={20} /> : getFormatIcon(exportFormat)}
            sx={{
              background: 'linear-gradient(135deg, #667eea, #764ba2)',
              color: '#fff',
              '&:hover': {
                background: 'linear-gradient(135deg, #5a6fd8, #6a4190)'
              }
            }}
          >
            {loading ? 'Exportando...' : `Exportar ${getFormatLabel(exportFormat)}`}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ExportButton;
