// 🎨 DEMO VISUAL DEL SISTEMA DE DISEÑO OPTIMIZADO
// ================================================

import React, { useState } from 'react';
import { Box, Grid, Typography, Stack, Switch, FormControlLabel } from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  Assignment as AssignmentIcon,
  CheckCircle as CheckCircleIcon,
  Speed as SpeedIcon,
  EmojiEvents as TrophyIcon,
  Group as GroupIcon,
  Assessment as AssessmentIcon,
  Folder as FolderIcon,
  Add as PlusIcon,
  Download as DownloadIcon,
  Settings as SettingsIcon
} from '@mui/icons-material';

// 🎨 Importar componentes del sistema de diseño
import {
  StatCard,
  Badge,
  Progress,
  QuickAction,
  EmptyState,
  Skeleton
} from './index';
import { designTheme, styleUtils } from './theme';

// 🌓 TOGGLE TEMA
const ThemeToggle = ({ isDark, onToggle }) => (
  <FormControlLabel
    control={
      <Switch
        checked={isDark}
        onChange={onToggle}
        sx={{
          '& .MuiSwitch-switchBase.Mui-checked': {
            color: 'var(--primary)',
          },
          '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
            backgroundColor: 'var(--primary)',
          },
        }}
      />
    }
    label={
      <Typography sx={{ color: 'var(--text-secondary)' }}>
        {isDark ? 'Tema Oscuro' : 'Tema Claro'}
      </Typography>
    }
  />
);

// 🎯 COMPONENTE DEMO PRINCIPAL
const DesignSystemDemo = () => {
  const [isDarkTheme, setIsDarkTheme] = useState(true);
  const [showSkeleton, setShowSkeleton] = useState(false);

  // Alternar tema
  const handleThemeToggle = () => {
    const newTheme = !isDarkTheme ? 'dark' : 'light';
    setIsDarkTheme(!isDarkTheme);

    // Aplicar variables CSS del tema
    const variables = styleUtils.createCSSVariables(newTheme);
    Object.entries(variables).forEach(([key, value]) => {
      document.documentElement.style.setProperty(key, value);
    });

    // Aplicar atributo data-theme
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  // Datos de ejemplo para las métricas
  const mockMetrics = [
    {
      title: 'Ingresos Totales',
      value: '$125,847',
      deltaPct: 12.5,
      deltaTrend: 'up',
      helpText: 'vs. mes anterior',
      icon: <TrendingUpIcon />
    },
    {
      title: 'Proyectos Activos',
      value: '47',
      deltaPct: 8,
      deltaTrend: 'up',
      helpText: '3 nuevos',
      icon: <AssignmentIcon />
    },
    {
      title: 'Tareas Completadas',
      value: '89%',
      deltaPct: -2,
      deltaTrend: 'down',
      helpText: 'de 234 tareas',
      icon: <CheckCircleIcon />
    },
    {
      title: 'Rendimiento',
      value: '95.2%',
      deltaPct: 0,
      deltaTrend: 'neutral',
      helpText: 'uptime',
      icon: <SpeedIcon />
    }
  ];

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: 'var(--bg)',
        color: 'var(--text-primary)',
        padding: { xs: 2, md: 4 },
        transition: 'all var(--transition-normal)'
      }}
    >
      {/* 🎯 Header del Demo */}
      <Box
        sx={{
          ...styleUtils.createCardStyles('elevated'),
          mb: 6,
          textAlign: 'center'
        }}
      >
        <Typography
          variant="h2"
          sx={{
            fontSize: designTheme.typography.fontSize['4xl'],
            fontWeight: designTheme.typography.fontWeight.bold,
            color: 'var(--text-primary)',
            mb: 2,
            background: styleUtils.createGradient('135deg', ['primary', 'success']),
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}
        >
          Sistema de Diseño Profesional
        </Typography>

        <Typography
          variant="h6"
          sx={{
            fontSize: designTheme.typography.fontSize.lg,
            color: 'var(--text-secondary)',
            mb: 4,
            maxWidth: 600,
            mx: 'auto',
            lineHeight: designTheme.typography.lineHeight.relaxed
          }}
        >
          Componentes optimizados con contraste WCAG AA, tokens CSS sistemáticos y microinteracciones elegantes
        </Typography>

        <Box sx={{ display: 'flex', gap: 3, justifyContent: 'center', flexWrap: 'wrap' }}>
          <ThemeToggle isDark={isDarkTheme} onToggle={handleThemeToggle} />
          <FormControlLabel
            control={
              <Switch
                checked={showSkeleton}
                onChange={(e) => setShowSkeleton(e.target.checked)}
              />
            }
            label={
              <Typography sx={{ color: 'var(--text-secondary)' }}>
                Estados de Carga
              </Typography>
            }
          />
        </Box>
      </Box>

      {/* 📊 DEMO DE STATCARDS */}
      <Box sx={{ mb: 6 }}>
        <Typography
          variant="h4"
          sx={{
            fontSize: designTheme.typography.fontSize['2xl'],
            fontWeight: designTheme.typography.fontWeight.semibold,
            color: 'var(--text-primary)',
            mb: 4
          }}
        >
          📊 Métricas con StatCards
        </Typography>

        <Grid container spacing={4}>
          {showSkeleton ? (
            [1, 2, 3, 4].map(i => (
              <Grid item xs={12} sm={6} lg={3} key={i}>
                <Skeleton height="140px" />
              </Grid>
            ))
          ) : (
            mockMetrics.map((metric, index) => (
              <Grid item xs={12} sm={6} lg={3} key={index}>
                <StatCard {...metric} />
              </Grid>
            ))
          )}
        </Grid>
      </Box>

      {/* 🏷️ DEMO DE BADGES */}
      <Box sx={{ mb: 6 }}>
        <Typography
          variant="h4"
          sx={{
            fontSize: designTheme.typography.fontSize['2xl'],
            fontWeight: designTheme.typography.fontWeight.semibold,
            color: 'var(--text-primary)',
            mb: 4
          }}
        >
          🏷️ Sistema de Badges Semánticos
        </Typography>

        <Box sx={styleUtils.createCardStyles('default')}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" sx={{ color: 'var(--text-primary)', mb: 2 }}>
                Estados del Sistema
              </Typography>
              <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap>
                <Badge variant="primary" size="md">Activo</Badge>
                <Badge variant="success" size="md">Completado</Badge>
                <Badge variant="warning" size="md">Pendiente</Badge>
                <Badge variant="danger" size="md">Error</Badge>
                <Badge variant="neutral" size="md">Inactivo</Badge>
              </Stack>
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="h6" sx={{ color: 'var(--text-primary)', mb: 2 }}>
                Tamaños Disponibles
              </Typography>
              <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap" useFlexGap>
                <Badge variant="primary" size="sm">Small</Badge>
                <Badge variant="primary" size="md">Medium</Badge>
                <Badge variant="primary" size="lg">Large</Badge>
              </Stack>
            </Grid>
          </Grid>
        </Box>
      </Box>

      {/* 📊 DEMO DE PROGRESS */}
      <Box sx={{ mb: 6 }}>
        <Typography
          variant="h4"
          sx={{
            fontSize: designTheme.typography.fontSize['2xl'],
            fontWeight: designTheme.typography.fontWeight.semibold,
            color: 'var(--text-primary)',
            mb: 4
          }}
        >
          📊 Barras de Progreso Accesibles
        </Typography>

        <Box sx={styleUtils.createCardStyles('default')}>
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Stack spacing={4}>
                <Progress
                  value={25}
                  max={100}
                  showLabel={true}
                  label="Progreso Básico"
                  variant="primary"
                />
                <Progress
                  value={65}
                  max={100}
                  showLabel={true}
                  label="Progreso Intermedio"
                  variant="warning"
                />
                <Progress
                  value={90}
                  max={100}
                  showLabel={true}
                  label="Casi Completado"
                  variant="success"
                />
              </Stack>
            </Grid>

            <Grid item xs={12} md={6}>
              <Stack spacing={4}>
                <Progress
                  value={15}
                  max={100}
                  showLabel={true}
                  label="Estado Crítico"
                  variant="danger"
                  size="lg"
                />
                <Progress
                  value={45}
                  max={100}
                  showLabel={true}
                  label="Tamaño Mediano"
                  variant="primary"
                  size="md"
                />
                <Progress
                  value={75}
                  max={100}
                  showLabel={true}
                  label="Tamaño Pequeño"
                  variant="success"
                  size="sm"
                />
              </Stack>
            </Grid>
          </Grid>
        </Box>
      </Box>

      {/* ⚡ DEMO DE QUICKACTIONS */}
      <Box sx={{ mb: 6 }}>
        <Typography
          variant="h4"
          sx={{
            fontSize: designTheme.typography.fontSize['2xl'],
            fontWeight: designTheme.typography.fontWeight.semibold,
            color: 'var(--text-primary)',
            mb: 4
          }}
        >
          ⚡ Acciones Rápidas
        </Typography>

        <Box sx={styleUtils.createCardStyles('default')}>
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" sx={{ color: 'var(--text-primary)', mb: 3 }}>
                Variantes
              </Typography>
              <Stack spacing={2}>
                <QuickAction
                  variant="primary"
                  icon={<PlusIcon />}
                >
                  Crear Nuevo
                </QuickAction>
                <QuickAction
                  variant="secondary"
                  icon={<DownloadIcon />}
                >
                  Descargar
                </QuickAction>
                <QuickAction
                  variant="ghost"
                  icon={<SettingsIcon />}
                >
                  Configurar
                </QuickAction>
              </Stack>
            </Grid>

            <Grid item xs={12} md={4}>
              <Typography variant="h6" sx={{ color: 'var(--text-primary)', mb: 3 }}>
                Tamaños
              </Typography>
              <Stack spacing={2}>
                <QuickAction variant="primary" size="sm" icon={<PlusIcon />}>
                  Pequeño
                </QuickAction>
                <QuickAction variant="primary" size="md" icon={<PlusIcon />}>
                  Mediano
                </QuickAction>
                <QuickAction variant="primary" size="lg" icon={<PlusIcon />}>
                  Grande
                </QuickAction>
              </Stack>
            </Grid>

            <Grid item xs={12} md={4}>
              <Typography variant="h6" sx={{ color: 'var(--text-primary)', mb: 3 }}>
                Estados
              </Typography>
              <Stack spacing={2}>
                <QuickAction variant="primary" icon={<PlusIcon />}>
                  Normal
                </QuickAction>
                <QuickAction variant="primary" icon={<PlusIcon />} disabled>
                  Deshabilitado
                </QuickAction>
              </Stack>
            </Grid>
          </Grid>
        </Box>
      </Box>

      {/* 📭 DEMO DE EMPTY STATE */}
      <Box sx={{ mb: 6 }}>
        <Typography
          variant="h4"
          sx={{
            fontSize: designTheme.typography.fontSize['2xl'],
            fontWeight: designTheme.typography.fontWeight.semibold,
            color: 'var(--text-primary)',
            mb: 4
          }}
        >
          📭 Estados Vacíos
        </Typography>

        <EmptyState
          icon={FolderIcon}
          title="No hay contenido disponible"
          description="Parece que aún no tienes ningún elemento aquí. ¡Crea tu primer elemento para comenzar!"
          actionLabel="Crear Elemento"
          actionIcon={PlusIcon}
        />
      </Box>

      {/* 🎨 INFORMACIÓN DEL SISTEMA */}
      <Box sx={styleUtils.createCardStyles('elevated')}>
        <Typography
          variant="h4"
          sx={{
            fontSize: designTheme.typography.fontSize['2xl'],
            fontWeight: designTheme.typography.fontWeight.semibold,
            color: 'var(--text-primary)',
            mb: 4
          }}
        >
          🎨 Especificaciones del Sistema
        </Typography>

        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Typography variant="h6" sx={{ color: 'var(--text-primary)', mb: 2 }}>
              ✅ Características Implementadas
            </Typography>
            <Stack spacing={1}>
              <Typography sx={{ color: 'var(--text-secondary)' }}>
                • Contraste WCAG AA compliant (≥4.5:1)
              </Typography>
              <Typography sx={{ color: 'var(--text-secondary)' }}>
                • Variables CSS sistemáticas con HSL
              </Typography>
              <Typography sx={{ color: 'var(--text-secondary)' }}>
                • Componentes profesionales reutilizables
              </Typography>
              <Typography sx={{ color: 'var(--text-secondary)' }}>
                • Tokens de diseño escalables
              </Typography>
              <Typography sx={{ color: 'var(--text-secondary)' }}>
                • Microinteracciones suaves
              </Typography>
              <Typography sx={{ color: 'var(--text-secondary)' }}>
                • Estados de carga elegantes
              </Typography>
              <Typography sx={{ color: 'var(--text-secondary)' }}>
                • Tema claro/oscuro dinámico
              </Typography>
            </Stack>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="h6" sx={{ color: 'var(--text-primary)', mb: 2 }}>
              🎯 Componentes Disponibles
            </Typography>
            <Stack spacing={1}>
              <Badge variant="primary" size="sm">StatCard</Badge>
              <Badge variant="success" size="sm">Badge</Badge>
              <Badge variant="warning" size="sm">Progress</Badge>
              <Badge variant="danger" size="sm">QuickAction</Badge>
              <Badge variant="neutral" size="sm">EmptyState</Badge>
              <Badge variant="primary" size="sm">Skeleton</Badge>
            </Stack>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default DesignSystemDemo;