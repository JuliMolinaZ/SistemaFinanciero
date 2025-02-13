// src/modules/Permisos/PermisosModule.js
import React, { useEffect, useState, useContext, useMemo } from 'react';
import axios from 'axios';
import {
  Box,
  Button,
  CircularProgress,
  Paper,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  useTheme,
  Snackbar,
  Alert,
  Slide,
} from '@mui/material';
import { GlobalContext } from '../../context/GlobalState';

// Transición deslizante desde la derecha
function SlideTransition(props) {
  return <Slide {...props} direction="left" />;
}

const PermisosModule = () => {
  const { permisos, setPermisos } = useContext(GlobalContext);
  const [localPermisos, setLocalPermisos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const theme = useTheme();

  // URL del API
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  useEffect(() => {
    const fetchPermisos = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/permisos`);
        setPermisos(response.data);
        // Convertir el valor de acceso_administrador a booleano (si es numérico)
        const permisosConvertidos = response.data.map(p => ({
          ...p,
          acceso_administrador: Boolean(p.acceso_administrador),
        }));
        setLocalPermisos(permisosConvertidos);
      } catch (error) {
        console.error('Error al obtener los permisos:', error.response?.data || error.message);
        setSnackbar({ open: true, message: 'Error al obtener los permisos.', severity: 'error' });
      } finally {
        setLoading(false);
      }
    };

    fetchPermisos();
  }, [API_URL, setPermisos]);

  // Verifica si hay cambios comparando el estado global con el local
  const hasChanges = useMemo(() => {
    if (!permisos || permisos.length === 0) return false;
    return localPermisos.some((localPermiso) => {
      const original = permisos.find((p) => p.modulo === localPermiso.modulo);
      // Convertimos ambos a booleano para comparar
      return original && Boolean(original.acceso_administrador) !== localPermiso.acceso_administrador;
    });
  }, [localPermisos, permisos]);

  const handleToggle = (modulo) => {
    setLocalPermisos((prev) =>
      prev.map((permiso) =>
        permiso.modulo === modulo
          ? { ...permiso, acceso_administrador: !permiso.acceso_administrador }
          : permiso
      )
    );
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // Se actualiza cada permiso; se envía la propiedad como booleano
      await Promise.all(
        localPermisos.map((permiso) =>
          axios.put(`${API_URL}/api/permisos/${permiso.modulo}`, {
            acceso_administrador: Boolean(permiso.acceso_administrador),
          })
        )
      );
      setPermisos(localPermisos);
      setSnackbar({ open: true, message: 'Cambios guardados exitosamente.', severity: 'success' });
    } catch (error) {
      console.error('Error al guardar cambios:', error.response?.data || error.message);
      setSnackbar({ open: true, message: 'Error al guardar cambios.', severity: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') return;
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        background: 'linear-gradient(135deg, #f8f9fa, #e9ecef)',
        minHeight: '100vh',
        py: 4,
      }}
    >
      <Box
        sx={{
          maxWidth: '900px',
          mx: 'auto',
          backgroundColor: 'white',
          p: { xs: 2, md: 4 },
          borderRadius: 2,
          boxShadow: 3,
        }}
      >
        <Typography
          variant="h4"
          gutterBottom
          sx={{
            color: theme.palette.primary.dark,
            fontWeight: 'bold',
            mb: 2,
            textShadow: '1px 1px 2px rgba(0,0,0,0.2)',
          }}
        >
          Administración de Permisos
        </Typography>
        <Typography variant="subtitle1" sx={{ mb: 3, color: theme.palette.text.secondary }}>
          Activa o desactiva los permisos para que los módulos sean visibles para el Administrador.
        </Typography>
        <TableContainer
          component={Paper}
          sx={{
            mb: 3,
            borderRadius: 2,
            boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
          }}
        >
          <Table>
            <TableHead sx={{ backgroundColor: theme.palette.primary.main }}>
              <TableRow>
                <TableCell sx={{ color: 'white', fontWeight: 'bold', fontSize: '1rem' }}>
                  Módulo
                </TableCell>
                <TableCell align="center" sx={{ color: 'white', fontWeight: 'bold', fontSize: '1rem' }}>
                  Acceso Administrador
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {localPermisos.map((permiso) => (
                <TableRow
                  key={permiso.modulo}
                  hover
                  sx={{
                    '&:nth-of-type(even)': { backgroundColor: '#f5f5f5' },
                  }}
                >
                  <TableCell sx={{ fontSize: '1rem', fontWeight: 500 }}>{permiso.modulo}</TableCell>
                  <TableCell align="center">
                    <Switch
                      checked={permiso.acceso_administrador}
                      onChange={() => handleToggle(permiso.modulo)}
                      color="primary"
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSave}
            disabled={!hasChanges || saving}
            sx={{ minWidth: 150, textTransform: 'none', fontWeight: 'bold', boxShadow: 2 }}
          >
            {saving ? 'Guardando...' : 'Guardar Cambios'}
          </Button>
        </Box>
      </Box>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        TransitionComponent={SlideTransition}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbar.severity} variant="filled" sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default PermisosModule;
