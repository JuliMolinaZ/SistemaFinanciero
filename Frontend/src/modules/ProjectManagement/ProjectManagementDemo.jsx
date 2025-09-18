// <¯ PROJECT MANAGEMENT DEMO - PRUEBAS DE ACCESIBILIDAD Y RESPONSIVE
// ==================================================================

import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Paper,
  Stack,
  Alert,
  Chip,
  Grid,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  Check as CheckIcon,
  Phone as PhoneIcon,
  Tablet as TabletIcon,
  Desktop as DesktopIcon,
  Accessible as AccessibleIcon,
  Security as SecurityIcon,
  Speed as SpeedIcon
} from '@mui/icons-material';

import { ProjectManagementPage } from './ProjectManagementPage';
import { NotificationProvider } from '../../components/ui/NotificationSystem';

// <¯ DEMO COMPONENT
export function ProjectManagementDemo() {
  const [showDemo, setShowDemo] = useState(false);
  const [viewMode, setViewMode] = useState('full'); // full, tablet, mobile

  if (showDemo) {
    return (
      <Box sx={{
        width: viewMode === 'mobile' ? '375px' : viewMode === 'tablet' ? '768px' : '100%',
        height: '100vh',
        margin: '0 auto',
        border: viewMode !== 'full' ? '2px solid #ccc' : 'none',
        borderRadius: viewMode !== 'full' ? 2 : 0,
        overflow: 'hidden'
      }}>
        <ProjectManagementPage />

        {/* <® CONTROLS FLOTANTES */}
        <Box
          sx={{
            position: 'fixed',
            top: 16,
            left: 16,
            zIndex: 10000,
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            borderRadius: 2,
            p: 1
          }}
        >
          <Stack direction="row" spacing={1}>
            <Button
              variant={viewMode === 'full' ? 'contained' : 'outlined'}
              size="small"
              startIcon={<DesktopIcon />}
              onClick={() => setViewMode('full')}
              sx={{ color: 'white', borderColor: 'white' }}
            >
              Desktop
            </Button>
            <Button
              variant={viewMode === 'tablet' ? 'contained' : 'outlined'}
              size="small"
              startIcon={<TabletIcon />}
              onClick={() => setViewMode('tablet')}
              sx={{ color: 'white', borderColor: 'white' }}
            >
              Tablet
            </Button>
            <Button
              variant={viewMode === 'mobile' ? 'contained' : 'outlined'}
              size="small"
              startIcon={<PhoneIcon />}
              onClick={() => setViewMode('mobile')}
              sx={{ color: 'white', borderColor: 'white' }}
            >
              Mobile
            </Button>
            <Button
              variant="outlined"
              size="small"
              onClick={() => setShowDemo(false)}
              sx={{ color: 'white', borderColor: 'white' }}
            >
              Volver
            </Button>
          </Stack>
        </Box>
      </Box>
    );
  }

  return (
    <NotificationProvider>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* = HEADER */}
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
            <¯ Project Management - Ultra Profesional
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
            Sistema completo de gestión de proyectos con WCAG AA, responsive design y UX profesional
          </Typography>

          <Button
            variant="contained"
            size="large"
            onClick={() => setShowDemo(true)}
            sx={{
              px: 4,
              py: 2,
              fontSize: '1.1rem',
              textTransform: 'none'
            }}
          >
            =€ Ver Demo Interactivo
          </Button>
        </Box>

        {/* =Ê FEATURES IMPLEMENTADAS */}
        <Grid container spacing={4} sx={{ mb: 6 }}>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, height: '100%' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <AccessibleIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6" fontWeight={600}>
                  Accesibilidad WCAG AA
                </Typography>
              </Box>
              <List dense>
                <ListItem disablePadding>
                  <ListItemIcon><CheckIcon color="success" fontSize="small" /></ListItemIcon>
                  <ListItemText primary="Focus trap en modales" />
                </ListItem>
                <ListItem disablePadding>
                  <ListItemIcon><CheckIcon color="success" fontSize="small" /></ListItemIcon>
                  <ListItemText primary="ARIA labels completos" />
                </ListItem>
                <ListItem disablePadding>
                  <ListItemIcon><CheckIcon color="success" fontSize="small" /></ListItemIcon>
                  <ListItemText primary="Navegación por teclado" />
                </ListItem>
                <ListItem disablePadding>
                  <ListItemIcon><CheckIcon color="success" fontSize="small" /></ListItemIcon>
                  <ListItemText primary="Contraste optimizado" />
                </ListItem>
              </List>
            </Paper>
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, height: '100%' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <PhoneIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6" fontWeight={600}>
                  Responsive Design
                </Typography>
              </Box>
              <List dense>
                <ListItem disablePadding>
                  <ListItemIcon><CheckIcon color="success" fontSize="small" /></ListItemIcon>
                  <ListItemText primary="Mobile-first approach" />
                </ListItem>
                <ListItem disablePadding>
                  <ListItemIcon><CheckIcon color="success" fontSize="small" /></ListItemIcon>
                  <ListItemText primary="Breakpoints optimizados" />
                </ListItem>
                <ListItem disablePadding>
                  <ListItemIcon><CheckIcon color="success" fontSize="small" /></ListItemIcon>
                  <ListItemText primary="Safe area margins" />
                </ListItem>
                <ListItem disablePadding>
                  <ListItemIcon><CheckIcon color="success" fontSize="small" /></ListItemIcon>
                  <ListItemText primary="Drawer despegado" />
                </ListItem>
              </List>
            </Paper>
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, height: '100%' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <SpeedIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6" fontWeight={600}>
                  Performance & UX
                </Typography>
              </Box>
              <List dense>
                <ListItem disablePadding>
                  <ListItemIcon><CheckIcon color="success" fontSize="small" /></ListItemIcon>
                  <ListItemText primary="Lazy loading" />
                </ListItem>
                <ListItem disablePadding>
                  <ListItemIcon><CheckIcon color="success" fontSize="small" /></ListItemIcon>
                  <ListItemText primary="Optimistic updates" />
                </ListItem>
                <ListItem disablePadding>
                  <ListItemIcon><CheckIcon color="success" fontSize="small" /></ListItemIcon>
                  <ListItemText primary="Error boundaries" />
                </ListItem>
                <ListItem disablePadding>
                  <ListItemIcon><CheckIcon color="success" fontSize="small" /></ListItemIcon>
                  <ListItemText primary="Loading states" />
                </ListItem>
              </List>
            </Paper>
          </Grid>
        </Grid>

        {/* =Ë COMPONENTES DETALLADOS */}
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
          Componentes Implementados
        </Typography>

        <Stack spacing={3}>
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6" fontWeight={600}>
                =Ê DataTableGrouped - Tabla Agrupada con Sticky Headers
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Stack spacing={2}>
                <Typography>
                  Tabla ultra-profesional con agrupación por cliente, headers pegajosos y navegación completa.
                </Typography>
                <Box>
                  <Stack direction="row" spacing={1} flexWrap="wrap">
                    <Chip label="Sticky Headers" color="primary" variant="outlined" />
                    <Chip label="Agrupación por Cliente" color="primary" variant="outlined" />
                    <Chip label="Búsqueda en Tiempo Real" color="primary" variant="outlined" />
                    <Chip label="Ordenamiento Dinámico" color="primary" variant="outlined" />
                    <Chip label="Collapsible Groups" color="primary" variant="outlined" />
                    <Chip label="Progress Indicators" color="primary" variant="outlined" />
                    <Chip label="Team Chips" color="primary" variant="outlined" />
                    <Chip label="Action Buttons" color="primary" variant="outlined" />
                  </Stack>
                </Box>
              </Stack>
            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6" fontWeight={600}>
                <¨ ProjectDrawer - Edge Sheet Despegado
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Stack spacing={2}>
                <Typography>
                  Drawer lateral con márgenes seguros, tabs profesionales y edición inline.
                </Typography>
                <Box>
                  <Stack direction="row" spacing={1} flexWrap="wrap">
                    <Chip label="Edge Sheet Design" color="secondary" variant="outlined" />
                    <Chip label="Safe Area Margins" color="secondary" variant="outlined" />
                    <Chip label="Tab Navigation" color="secondary" variant="outlined" />
                    <Chip label="Inline Editing" color="secondary" variant="outlined" />
                    <Chip label="Focus Trap" color="secondary" variant="outlined" />
                    <Chip label="Scroll Lock" color="secondary" variant="outlined" />
                    <Chip label="Form Validation" color="secondary" variant="outlined" />
                    <Chip label="Delete Confirmation" color="secondary" variant="outlined" />
                  </Stack>
                </Box>
              </Stack>
            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6" fontWeight={600}>
                = NotificationSystem - Profesional
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Stack spacing={2}>
                <Typography>
                  Sistema de notificaciones completamente customizable con animaciones suaves.
                </Typography>
                <Box>
                  <Stack direction="row" spacing={1} flexWrap="wrap">
                    <Chip label="Framer Motion" color="success" variant="outlined" />
                    <Chip label="Auto Dismiss" color="success" variant="outlined" />
                    <Chip label="Progress Bars" color="success" variant="outlined" />
                    <Chip label="Custom Actions" color="success" variant="outlined" />
                    <Chip label="Stacked Notifications" color="success" variant="outlined" />
                    <Chip label="Error Normalization" color="success" variant="outlined" />
                  </Stack>
                </Box>
              </Stack>
            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6" fontWeight={600}>
                < API Service - Robusto
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Stack spacing={2}>
                <Typography>
                  Servicio API completo con manejo de errores, validaciones y helpers.
                </Typography>
                <Box>
                  <Stack direction="row" spacing={1} flexWrap="wrap">
                    <Chip label="Error Handling" color="warning" variant="outlined" />
                    <Chip label="Data Validation" color="warning" variant="outlined" />
                    <Chip label="API Normalization" color="warning" variant="outlined" />
                    <Chip label="HTTP Helpers" color="warning" variant="outlined" />
                    <Chip label="Query Builders" color="warning" variant="outlined" />
                    <Chip label="Response Caching" color="warning" variant="outlined" />
                  </Stack>
                </Box>
              </Stack>
            </AccordionDetails>
          </Accordion>
        </Stack>

        {/* =€ CTA FINAL */}
        <Box sx={{ textAlign: 'center', mt: 8, py: 6, bgcolor: 'grey.50', borderRadius: 3 }}>
          <Typography variant="h5" gutterBottom fontWeight={600}>
            ¿Listo para ver el sistema en acción?
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Prueba todas las funcionalidades en el demo interactivo con diferentes dispositivos.
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={() => setShowDemo(true)}
            sx={{
              px: 6,
              py: 2,
              fontSize: '1.2rem',
              textTransform: 'none'
            }}
          >
            <¯ Iniciar Demo
          </Button>
        </Box>
      </Container>
    </NotificationProvider>
  );
}

export default ProjectManagementDemo;