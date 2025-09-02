import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Chip,
  Grid,
  Alert,
  AlertTitle,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  LinearProgress,
  Skeleton
} from '@mui/material';
import {
  Security as SecurityIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  Lock as LockIcon,
  LockOpen as LockOpenIcon,
  Refresh as RefreshIcon,
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Download as DownloadIcon,
  Approve as ApproveIcon
} from '@mui/icons-material';
import axios from 'axios';

const UserPermissionsStatus = ({ userId, showDetails = false }) => {
  const [permissions, setPermissions] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [detailsDialog, setDetailsDialog] = useState(false);

  useEffect(() => {
    if (userId) {
      fetchUserPermissions();
    }
  }, [userId]);

  const fetchUserPermissions = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/roles/user/permissions`);
      
      if (response.data.success) {
        setPermissions(response.data.data);
        setError(null);
      }
    } catch (err) {
      setError('Error al cargar los permisos del usuario');
    } finally {
      setLoading(false);
    }
  };

  const getPermissionIcon = (permission, value) => {
    if (value) {
      return <CheckCircleIcon color="success" />;
    }
    return <CancelIcon color="disabled" />;
  };

  const getPermissionColor = (permission, value) => {
    if (value) {
      return 'success';
    }
    return 'default';
  };

  const getModuleIcon = (moduleName) => {
    const iconMap = {
      usuarios: <SecurityIcon />,
      clientes: <InfoIcon />,
      proyectos: <EditIcon />,
      contabilidad: <VisibilityIcon />,
      costos_fijos: <EditIcon />,
      cotizaciones: <EditIcon />,
      cuentas_por_cobrar: <VisibilityIcon />,
      cuentas_por_pagar: <VisibilityIcon />,
      proveedores: <InfoIcon />,
      categorias: <EditIcon />,
      fases: <EditIcon />,
      recuperacion: <EditIcon />,
      flow_recovery_v2: <EditIcon />,
      realtime_graph: <VisibilityIcon />,
      emitidas: <EditIcon />,
      permisos: <SecurityIcon />,
      dashboard: <VisibilityIcon />,
      reportes: <VisibilityIcon />,
      auditoria: <VisibilityIcon />
    };
    
    return iconMap[moduleName] || <InfoIcon />;
  };

  const getModuleDisplayName = (moduleName) => {
    const nameMap = {
      usuarios: 'Gestión de Usuarios',
      clientes: 'Gestión de Clientes',
      proyectos: 'Gestión de Proyectos',
      contabilidad: 'Contabilidad',
      costos_fijos: 'Costos Fijos',
      cotizaciones: 'Cotizaciones',
      cuentas_por_cobrar: 'Cuentas por Cobrar',
      cuentas_por_pagar: 'Cuentas por Pagar',
      proveedores: 'Proveedores',
      categorias: 'Categorías',
      fases: 'Fases de Proyectos',
      recuperacion: 'Recuperación',
      flow_recovery_v2: 'Flow Recovery V2',
      realtime_graph: 'Gráficos en Tiempo Real',
      emitidas: 'Facturas Emitidas',
      permisos: 'Permisos del Sistema',
      dashboard: 'Dashboard',
      reportes: 'Reportes',
      auditoria: 'Auditoría'
    };
    
    return nameMap[moduleName] || moduleName;
  };

  if (loading) {
    return (
      <Card>
        <CardContent>
          <Skeleton variant="text" width="60%" height={32} />
          <Skeleton variant="text" width="40%" height={24} />
          <Box sx={{ mt: 2 }}>
            <Skeleton variant="rectangular" height={60} />
          </Box>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Alert severity="error">
        <AlertTitle>Error</AlertTitle>
        {error}
        <Button onClick={fetchUserPermissions} sx={{ ml: 2 }}>
          Reintentar
        </Button>
      </Alert>
    );
  }

  if (!permissions || Object.keys(permissions).length === 0) {
    return (
      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <LockIcon color="warning" />
            <Typography variant="h6" color="warning.main">
              Usuario Sin Permisos Asignados
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Este usuario no tiene permisos asignados. Contacta al administrador para asignar un rol.
          </Typography>
          <Alert severity="warning">
            <AlertTitle>Acceso Restringido</AlertTitle>
            El usuario no podrá acceder a ningún módulo del sistema hasta que se le asigne un rol.
          </Alert>
        </CardContent>
      </Card>
    );
  }

  // Calcular estadísticas de permisos
  const totalModules = Object.keys(permissions).length;
  const totalPermissions = Object.values(permissions).reduce((acc, module) => {
    return acc + Object.values(module).filter(Boolean).length;
  }, 0);
  const maxPossiblePermissions = totalModules * 6; // 6 tipos de permisos por módulo
  const permissionPercentage = Math.round((totalPermissions / maxPossiblePermissions) * 100);

  const permissionTypes = [
    { key: 'can_read', label: 'Leer', icon: <VisibilityIcon /> },
    { key: 'can_create', label: 'Crear', icon: <EditIcon /> },
    { key: 'can_update', label: 'Actualizar', icon: <EditIcon /> },
    { key: 'can_delete', label: 'Eliminar', icon: <DeleteIcon /> },
    { key: 'can_export', label: 'Exportar', icon: <DownloadIcon /> },
    { key: 'can_approve', label: 'Aprobar', icon: <ApproveIcon /> }
  ];

  return (
    <>
      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <SecurityIcon color="primary" />
              <Typography variant="h6">
                Estado de Permisos del Usuario
              </Typography>
            </Box>
            <Button
              size="small"
              startIcon={<RefreshIcon />}
              onClick={fetchUserPermissions}
              variant="outlined"
            >
              Actualizar
            </Button>
          </Box>

          {/* Barra de progreso de permisos */}
          <Box sx={{ mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
              <Typography variant="body2" color="text.secondary">
                Nivel de Acceso del Usuario
              </Typography>
              <Typography variant="body2" fontWeight="bold">
                {permissionPercentage}%
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={permissionPercentage}
              sx={{ height: 8, borderRadius: 4 }}
            />
            <Typography variant="caption" color="text.secondary">
              {totalPermissions} de {maxPossiblePermissions} permisos disponibles
            </Typography>
          </Box>

          {/* Resumen de permisos */}
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'grey.50', borderRadius: 2 }}>
                <Typography variant="h4" color="primary">
                  {totalModules}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Módulos Accesibles
                </Typography>
              </Box>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'grey.50', borderRadius: 2 }}>
                <Typography variant="h4" color="success.main">
                  {totalPermissions}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Permisos Otorgados
                </Typography>
              </Box>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'grey.50', borderRadius: 2 }}>
                <Typography variant="h4" color="warning.main">
                  {maxPossiblePermissions - totalPermissions}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Permisos Restringidos
                </Typography>
              </Box>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'grey.50', borderRadius: 2 }}>
                <Typography variant="h4" color="info.main">
                  {permissionPercentage}%
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Nivel de Acceso
                </Typography>
              </Box>
            </Grid>
          </Grid>

          {/* Módulos con permisos */}
          <Box sx={{ mt: 3 }}>
            <Typography variant="subtitle1" gutterBottom>
              Módulos y Permisos Asignados
            </Typography>
            
            <Grid container spacing={2}>
              {Object.entries(permissions).map(([moduleName, modulePermissions]) => {
                const grantedPermissions = Object.values(modulePermissions).filter(Boolean).length;
                const totalModulePermissions = Object.keys(modulePermissions).length;
                const modulePercentage = Math.round((grantedPermissions / totalModulePermissions) * 100);
                
                return (
                  <Grid item xs={12} sm={6} md={4} key={moduleName}>
                    <Card variant="outlined" sx={{ height: '100%' }}>
                      <CardContent sx={{ p: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                          {getModuleIcon(moduleName)}
                          <Typography variant="subtitle2" fontWeight="bold">
                            {getModuleDisplayName(moduleName)}
                          </Typography>
                        </Box>
                        
                        <Box sx={{ mb: 2 }}>
                          <Typography variant="caption" color="text.secondary">
                            {grantedPermissions} de {totalModulePermissions} permisos
                          </Typography>
                          <LinearProgress
                            variant="determinate"
                            value={modulePercentage}
                            sx={{ height: 4, borderRadius: 2, mt: 1 }}
                          />
                        </Box>
                        
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {permissionTypes.map(({ key, label, icon }) => (
                            <Chip
                              key={key}
                              label={label}
                              size="small"
                              icon={icon}
                              color={getPermissionColor(key, modulePermissions[key])}
                              variant={modulePermissions[key] ? 'filled' : 'outlined'}
                            />
                          ))}
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                );
              })}
            </Grid>
          </Box>

          {showDetails && (
            <Box sx={{ mt: 3, textAlign: 'center' }}>
              <Button
                variant="outlined"
                onClick={() => setDetailsDialog(true)}
                startIcon={<VisibilityIcon />}
              >
                Ver Detalles Completos
              </Button>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Modal de detalles */}
      <Dialog open={detailsDialog} onClose={() => setDetailsDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          Detalles Completos de Permisos
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <List>
              {Object.entries(permissions).map(([moduleName, modulePermissions], index) => (
                <React.Fragment key={moduleName}>
                  <ListItem>
                    <ListItemIcon>
                      {getModuleIcon(moduleName)}
                    </ListItemIcon>
                    <ListItemText
                      primary={getModuleDisplayName(moduleName)}
                      secondary={`Módulo: ${moduleName}`}
                    />
                  </ListItem>
                  
                  <Box sx={{ ml: 4, mb: 2 }}>
                    <Grid container spacing={1}>
                      {permissionTypes.map(({ key, label, icon }) => (
                        <Grid item xs={6} sm={4} key={key}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            {getPermissionIcon(key, modulePermissions[key])}
                            <Typography variant="body2">
                              {label}: {modulePermissions[key] ? 'Permitido' : 'Denegado'}
                            </Typography>
                          </Box>
                        </Grid>
                      ))}
                    </Grid>
                  </Box>
                  
                  {index < Object.keys(permissions).length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDetailsDialog(false)}>
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default UserPermissionsStatus;
