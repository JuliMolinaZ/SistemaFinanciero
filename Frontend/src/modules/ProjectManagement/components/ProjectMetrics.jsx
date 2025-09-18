// 📊 MÉTRICAS DE PROYECTOS - REFACTORIZADO CON DISEÑO UNIFICADO
// ==============================================================

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Box,
  Typography,
  Grid,
  LinearProgress,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Avatar,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  alpha
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Assignment as AssignmentIcon,
  Group as GroupIcon,
  Schedule as ScheduleIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  Star as StarIcon,
  Flag as FlagIcon,
  Timeline as TimelineIcon,
  Assessment as AssessmentIcon,
  Speed as SpeedIcon,
  Diamond as DiamondIcon,
  PlayArrow as PlayIcon,
  Pause as PauseIcon,
  BarChart as BarChartIcon,
  PieChart as PieChartIcon
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

// 🎨 Importar sistema de diseño unificado
import {
  UnifiedCard,
  UnifiedButton,
  UnifiedInput,
  UnifiedAlert,
  UnifiedSkeleton,
  UnifiedMetric
} from '../../../components/DesignSystem/BaseComponents';
import {
  UnifiedSelect,
  UnifiedFormLayout
} from '../../../components/DesignSystem/FormComponents';
import { designTheme, styleUtils } from '../../../components/DesignSystem';

// 📊 COMPONENTE DE MÉTRICA UNIFICADO
const MetricCard = React.memo(({ title, value, icon, color, subtitle, trend, loading = false, variant = 'default' }) => {
  const getTrendIcon = () => {
    if (!trend || trend === 0) return null;
    return trend > 0 ? <TrendingUpIcon /> : <TrendingDownIcon />;
  };

  const getTrendColor = () => {
    if (!trend || trend === 0) return designTheme.colors.semantic.neutral[500];
    return trend > 0 ? designTheme.colors.semantic.success[400] : designTheme.colors.semantic.danger[400];
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      whileHover={{ y: -4 }}
    >
      <UnifiedCard
        variant="glass"
        sx={{
          height: '100%',
          position: 'relative',
          '&:hover': {
            boxShadow: designTheme.shadows.glow,
            '&::before': {
              opacity: 1,
            }
          },
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: `linear-gradient(90deg, ${color} 0%, ${alpha(color, 0.8)} 100%)`,
            opacity: 0.7,
            transition: `opacity ${designTheme.animations.duration.normal}`
          },
          transition: `all ${designTheme.animations.duration.normal}`
        }}
      >
        <Box sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
            <Box sx={{
              p: 1.5,
              borderRadius: designTheme.borderRadius.lg,
              background: `linear-gradient(135deg, ${color} 0%, ${alpha(color, 0.8)} 100%)`,
              mr: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: `0 8px 25px ${alpha(color, 0.4)}`,
            }}>
              {React.cloneElement(icon, {
                sx: {
                  color: designTheme.colors.semantic.neutral[50],
                  fontSize: '1.5rem'
                }
              })}
            </Box>
            <Box sx={{ flexGrow: 1 }}>
              {loading ? (
                <UnifiedSkeleton width={100} height={40} />
              ) : (
                <Typography variant="h3" component="div" sx={{
                  ...designTheme.typography.h3,
                  fontWeight: 700,
                  color: designTheme.colors.semantic.neutral[800],
                  fontSize: '2rem',
                  lineHeight: 1.2,
                  mb: 0.5
                }}>
                  {value}
                </Typography>
              )}
              <Typography variant="body2" sx={{
                color: designTheme.colors.semantic.neutral[600],
                fontWeight: 500,
                fontSize: '0.875rem'
              }}>
                {title}
              </Typography>
            </Box>
            {trend !== undefined && !loading && (
              <Box sx={{ display: 'flex', alignItems: 'center', ml: 1 }}>
                <Box sx={{
                  display: 'flex',
                  alignItems: 'center',
                  p: 1,
                  borderRadius: designTheme.borderRadius.md,
                  backgroundColor: alpha(getTrendColor(), 0.1),
                  border: `1px solid ${alpha(getTrendColor(), 0.2)}`
                }}>
                  {getTrendIcon() && React.cloneElement(getTrendIcon(), {
                    sx: { color: getTrendColor(), fontSize: 16, mr: 0.5 }
                  })}
                  <Typography variant="caption" sx={{
                    fontWeight: 700,
                    fontSize: '0.75rem',
                    color: getTrendColor()
                  }}>
                    {Math.abs(trend)}%
                  </Typography>
                </Box>
              </Box>
            )}
          </Box>
          {subtitle && !loading && (
            <Typography variant="body2" sx={{
              color: designTheme.colors.semantic.neutral[600],
              fontWeight: 500,
              fontSize: '0.875rem'
            }}>
              {subtitle}
            </Typography>
          )}
        </Box>
      </UnifiedCard>
    </motion.div>
  );
});

MetricCard.displayName = 'MetricCard';

// 📈 COMPONENTE DE GRÁFICO UNIFICADO
const ChartCard = React.memo(({ title, children, height = 300, loading = false }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4 }}
  >
    <UnifiedCard variant="glass">
      <Box sx={{ p: 3 }}>
        <Typography variant="h6" component="h3" sx={{
          ...designTheme.typography.h6,
          fontWeight: 700,
          mb: 3,
          color: designTheme.colors.semantic.neutral[800],
          display: 'flex',
          alignItems: 'center',
          gap: 1
        }}>
          <BarChartIcon sx={{ color: designTheme.colors.semantic.primary[500] }} />
          {title}
        </Typography>
        {loading ? (
          <UnifiedSkeleton height={height} />
        ) : (
          <Box sx={{ height }}>
            {children}
          </Box>
        )}
      </Box>
    </UnifiedCard>
  </motion.div>
));

ChartCard.displayName = 'ChartCard';

// 🎯 COMPONENTE PRINCIPAL DE MÉTRICAS
const ProjectMetrics = ({
  projects = [],
  tasks = [],
  sprints = [],
  analytics = null
}) => {
  const [selectedProject, setSelectedProject] = useState('');
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 🎨 Colores para gráficos
  const CHART_COLORS = useMemo(() => [
    designTheme.colors.semantic.primary[400],
    designTheme.colors.semantic.success[400],
    designTheme.colors.semantic.warning[400],
    designTheme.colors.semantic.danger[400],
    designTheme.colors.semantic.neutral[500],
    designTheme.colors.semantic.primary[600]
  ], []);

  useEffect(() => {
    if (selectedProject) {
      loadMetrics();
    }
  }, [selectedProject]);

  const loadMetrics = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/project-management/projects-debug/${selectedProject}/metrics`);
      if (response.ok) {
        const data = await response.json();
        setMetrics(data.data);
      } else {
        throw new Error('Error al cargar las métricas');
      }
    } catch (err) {
      console.error('Error cargando métricas:', err);
      setError(err.message);
      // Mock data para desarrollo
      setMetrics({
        overview: {
          totalTasks: 45,
          completedTasks: 32,
          inProgressTasks: 8,
          todoTasks: 5,
          progress: 71,
          activeMembers: 6,
          completionRate: 89
        },
        tasks: {
          byPriority: {
            critical: 3,
            high: 12,
            medium: 18,
            low: 12
          },
          byStatus: {
            todo: 5,
            in_progress: 8,
            review: 4,
            done: 32
          },
          overdue: 2
        },
        time: {
          estimated: 240,
          actual: 198,
          efficiency: 82
        }
      });
    } finally {
      setLoading(false);
    }
  }, [selectedProject]);

  const getStatusColor = useCallback((status) => {
    switch (status) {
      case 'active': return designTheme.colors.semantic.success[400];
      case 'planning': return designTheme.colors.semantic.primary[400];
      case 'on_hold': return designTheme.colors.semantic.warning[400];
      case 'completed': return designTheme.colors.semantic.neutral[500];
      case 'cancelled': return designTheme.colors.semantic.danger[400];
      default: return designTheme.colors.semantic.neutral[400];
    }
  }, []);

  const getPriorityColor = useCallback((priority) => {
    switch (priority) {
      case 'critical': return designTheme.colors.semantic.danger[400];
      case 'high': return designTheme.colors.semantic.warning[400];
      case 'medium': return designTheme.colors.semantic.primary[400];
      case 'low': return designTheme.colors.semantic.success[400];
      default: return designTheme.colors.semantic.neutral[400];
    }
  }, []);

  const getPriorityLabel = useCallback((priority) => {
    switch (priority) {
      case 'critical': return 'Crítica';
      case 'high': return 'Alta';
      case 'medium': return 'Media';
      case 'low': return 'Baja';
      default: return priority;
    }
  }, []);

  // 📊 Preparar datos para gráficos
  const priorityChartData = useMemo(() => {
    if (!metrics?.tasks?.byPriority) return [];
    return Object.entries(metrics.tasks.byPriority).map(([priority, count]) => ({
      name: getPriorityLabel(priority),
      value: count,
      color: getPriorityColor(priority)
    }));
  }, [metrics, getPriorityLabel, getPriorityColor]);

  const timeChartData = useMemo(() => {
    if (!metrics?.time) return [];
    return [
      {
        name: 'Tiempo Estimado',
        value: metrics.time.estimated || 0,
        fill: designTheme.colors.semantic.primary[400]
      },
      {
        name: 'Tiempo Real',
        value: metrics.time.actual || 0,
        fill: designTheme.colors.semantic.success[400]
      }
    ];
  }, [metrics]);

  if (loading && !metrics) {
    return (
      <Box>
        <UnifiedCard variant="glass" sx={{ mb: 3 }}>
          <Box sx={{ p: 3 }}>
            <UnifiedSkeleton width={200} height={40} />
            <UnifiedSkeleton width={300} height={20} />
          </Box>
        </UnifiedCard>
        <Grid container spacing={3}>
          {[1, 2, 3, 4].map((item) => (
            <Grid item xs={12} sm={6} md={3} key={item}>
              <UnifiedSkeleton height={120} />
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  }

  return (
    <Box>
      {/* 🔍 Selección de proyecto */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <UnifiedCard variant="glass" sx={{ mb: 3 }}>
          <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              <UnifiedSelect
                label="Seleccionar Proyecto"
                value={selectedProject}
                onChange={(e) => setSelectedProject(e.target.value)}
                options={projects.map(project => ({
                  value: project.id,
                  label: project.nombre || project.name
                }))}
                sx={{ minWidth: 250 }}
              />
            </Box>
          </Box>
        </UnifiedCard>
      </motion.div>

      {/* 🚨 Error */}
      {error && (
        <UnifiedAlert severity="error" sx={{ mb: 3 }}>
          {error}
        </UnifiedAlert>
      )}

      {/* 📊 Contenido principal */}
      {!selectedProject ? (
        <UnifiedAlert severity="info">
          Selecciona un proyecto para ver sus métricas.
        </UnifiedAlert>
      ) : metrics ? (
        <>
          {/* 📈 Métricas generales */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <Box sx={{ mb: 4 }}>
              <Typography variant="h4" component="h2" sx={{
                ...designTheme.typography.h4,
                ...styleUtils.createTextGradient([
                  designTheme.colors.semantic.primary[400],
                  designTheme.colors.semantic.primary[600]
                ]),
                fontWeight: 700,
                mb: 3,
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}>
                <AssessmentIcon sx={{ fontSize: '2rem' }} />
                Métricas Generales
              </Typography>

              <Grid container spacing={3}>
                <Grid item xs={12} sm={6} md={3}>
                  <MetricCard
                    title="Total Tareas"
                    value={metrics.overview?.totalTasks || 0}
                    icon={<AssignmentIcon />}
                    color={designTheme.colors.semantic.primary[500]}
                    subtitle={`${metrics.overview?.completedTasks || 0} completadas`}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <MetricCard
                    title="Progreso"
                    value={`${metrics.overview?.progress || 0}%`}
                    icon={<SpeedIcon />}
                    color={designTheme.colors.semantic.success[500]}
                    subtitle="del proyecto completado"
                    trend={5}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <MetricCard
                    title="Miembros"
                    value={metrics.overview?.activeMembers || 0}
                    icon={<GroupIcon />}
                    color={designTheme.colors.semantic.warning[500]}
                    subtitle="en el equipo"
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <MetricCard
                    title="Eficiencia"
                    value={`${metrics.time?.efficiency || 0}%`}
                    icon={<DiamondIcon />}
                    color={designTheme.colors.semantic.danger[500]}
                    subtitle="tiempo estimado vs real"
                    trend={-3}
                  />
                </Grid>
              </Grid>
            </Box>
          </motion.div>

          {/* 📊 Gráficos */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            {/* Tareas por prioridad */}
            <Grid item xs={12} md={6}>
              <ChartCard title="Tareas por Prioridad" loading={loading}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={priorityChartData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {priorityChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <RechartsTooltip
                      contentStyle={{
                        backgroundColor: designTheme.colors.semantic.neutral[50],
                        border: `1px solid ${designTheme.colors.semantic.neutral[200]}`,
                        borderRadius: designTheme.borderRadius.md,
                        boxShadow: designTheme.shadows.lg
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </ChartCard>
            </Grid>

            {/* Seguimiento de tiempo */}
            <Grid item xs={12} md={6}>
              <ChartCard title="Seguimiento de Tiempo" loading={loading}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={timeChartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={designTheme.colors.semantic.neutral[200]} />
                    <XAxis dataKey="name" stroke={designTheme.colors.semantic.neutral[600]} />
                    <YAxis stroke={designTheme.colors.semantic.neutral[600]} />
                    <RechartsTooltip
                      contentStyle={{
                        backgroundColor: designTheme.colors.semantic.neutral[50],
                        border: `1px solid ${designTheme.colors.semantic.neutral[200]}`,
                        borderRadius: designTheme.borderRadius.md,
                        boxShadow: designTheme.shadows.lg
                      }}
                    />
                    <Bar dataKey="value" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartCard>
            </Grid>
          </Grid>

          {/* 📋 Métricas detalladas */}
          <Grid container spacing={3}>
            {/* Estado de tareas */}
            <Grid item xs={12} md={6}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.4 }}
              >
                <UnifiedCard variant="glass">
                  <Box sx={{ p: 3 }}>
                    <Typography variant="h6" component="h3" sx={{
                      ...designTheme.typography.h6,
                      fontWeight: 700,
                      mb: 3,
                      color: designTheme.colors.semantic.neutral[800],
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1
                    }}>
                      <TimelineIcon sx={{ color: designTheme.colors.semantic.primary[500] }} />
                      Estado de Tareas
                    </Typography>
                    <List>
                      <ListItem>
                        <ListItemIcon>
                          <CheckCircleIcon sx={{ color: designTheme.colors.semantic.success[400] }} />
                        </ListItemIcon>
                        <ListItemText
                          primary="Completadas"
                          secondary={`${metrics.overview?.completedTasks || 0} tareas`}
                          primaryTypographyProps={{
                            fontWeight: 600,
                            color: designTheme.colors.semantic.neutral[800]
                          }}
                          secondaryTypographyProps={{
                            color: designTheme.colors.semantic.neutral[600]
                          }}
                        />
                        <Box sx={{ minWidth: 100 }}>
                          <LinearProgress
                            variant="determinate"
                            value={metrics.overview?.totalTasks > 0 ?
                              (metrics.overview.completedTasks / metrics.overview.totalTasks) * 100 : 0
                            }
                            sx={{
                              height: 8,
                              borderRadius: designTheme.borderRadius.md,
                              backgroundColor: alpha(designTheme.colors.semantic.success[400], 0.2),
                              '& .MuiLinearProgress-bar': {
                                backgroundColor: designTheme.colors.semantic.success[400],
                                borderRadius: designTheme.borderRadius.md,
                              }
                            }}
                          />
                        </Box>
                      </ListItem>
                      <ListItem>
                        <ListItemIcon>
                          <PlayIcon sx={{ color: designTheme.colors.semantic.primary[400] }} />
                        </ListItemIcon>
                        <ListItemText
                          primary="En Progreso"
                          secondary={`${metrics.overview?.inProgressTasks || 0} tareas`}
                          primaryTypographyProps={{
                            fontWeight: 600,
                            color: designTheme.colors.semantic.neutral[800]
                          }}
                          secondaryTypographyProps={{
                            color: designTheme.colors.semantic.neutral[600]
                          }}
                        />
                        <Box sx={{ minWidth: 100 }}>
                          <LinearProgress
                            variant="determinate"
                            value={metrics.overview?.totalTasks > 0 ?
                              (metrics.overview.inProgressTasks / metrics.overview.totalTasks) * 100 : 0
                            }
                            sx={{
                              height: 8,
                              borderRadius: designTheme.borderRadius.md,
                              backgroundColor: alpha(designTheme.colors.semantic.primary[400], 0.2),
                              '& .MuiLinearProgress-bar': {
                                backgroundColor: designTheme.colors.semantic.primary[400],
                                borderRadius: designTheme.borderRadius.md,
                              }
                            }}
                          />
                        </Box>
                      </ListItem>
                      <ListItem>
                        <ListItemIcon>
                          <InfoIcon sx={{ color: designTheme.colors.semantic.warning[400] }} />
                        </ListItemIcon>
                        <ListItemText
                          primary="Por Hacer"
                          secondary={`${metrics.overview?.todoTasks || 0} tareas`}
                          primaryTypographyProps={{
                            fontWeight: 600,
                            color: designTheme.colors.semantic.neutral[800]
                          }}
                          secondaryTypographyProps={{
                            color: designTheme.colors.semantic.neutral[600]
                          }}
                        />
                        <Box sx={{ minWidth: 100 }}>
                          <LinearProgress
                            variant="determinate"
                            value={metrics.overview?.totalTasks > 0 ?
                              (metrics.overview.todoTasks / metrics.overview.totalTasks) * 100 : 0
                            }
                            sx={{
                              height: 8,
                              borderRadius: designTheme.borderRadius.md,
                              backgroundColor: alpha(designTheme.colors.semantic.warning[400], 0.2),
                              '& .MuiLinearProgress-bar': {
                                backgroundColor: designTheme.colors.semantic.warning[400],
                                borderRadius: designTheme.borderRadius.md,
                              }
                            }}
                          />
                        </Box>
                      </ListItem>
                    </List>
                  </Box>
                </UnifiedCard>
              </motion.div>
            </Grid>

            {/* Rendimiento del equipo */}
            <Grid item xs={12} md={6}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.5 }}
              >
                <UnifiedCard variant="glass">
                  <Box sx={{ p: 3 }}>
                    <Typography variant="h6" component="h3" sx={{
                      ...designTheme.typography.h6,
                      fontWeight: 700,
                      mb: 3,
                      color: designTheme.colors.semantic.neutral[800],
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1
                    }}>
                      <GroupIcon sx={{ color: designTheme.colors.semantic.primary[500] }} />
                      Rendimiento del Equipo
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                      <Box>
                        <Typography variant="body2" sx={{
                          color: designTheme.colors.semantic.neutral[600],
                          fontWeight: 500,
                          fontSize: '0.875rem',
                          mb: 0.5
                        }}>
                          Tareas Completadas
                        </Typography>
                        <Typography variant="h3" sx={{
                          ...designTheme.typography.h3,
                          color: designTheme.colors.semantic.primary[500],
                          fontWeight: 700
                        }}>
                          {metrics.overview?.completedTasks || 0}
                        </Typography>
                      </Box>
                      <Divider sx={{ borderColor: designTheme.colors.semantic.neutral[200] }} />
                      <Box>
                        <Typography variant="body2" sx={{
                          color: designTheme.colors.semantic.neutral[600],
                          fontWeight: 500,
                          fontSize: '0.875rem',
                          mb: 0.5
                        }}>
                          Tareas Vencidas
                        </Typography>
                        <Typography variant="h3" sx={{
                          ...designTheme.typography.h3,
                          color: designTheme.colors.semantic.danger[500],
                          fontWeight: 700
                        }}>
                          {metrics.tasks?.overdue || 0}
                        </Typography>
                      </Box>
                      <Divider sx={{ borderColor: designTheme.colors.semantic.neutral[200] }} />
                      <Box>
                        <Typography variant="body2" sx={{
                          color: designTheme.colors.semantic.neutral[600],
                          fontWeight: 500,
                          fontSize: '0.875rem',
                          mb: 0.5
                        }}>
                          Tasa de Completado
                        </Typography>
                        <Typography variant="h3" sx={{
                          ...designTheme.typography.h3,
                          color: designTheme.colors.semantic.success[500],
                          fontWeight: 700
                        }}>
                          {metrics.overview?.completionRate || 0}%
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </UnifiedCard>
              </motion.div>
            </Grid>
          </Grid>
        </>
      ) : null}
    </Box>
  );
};

export default React.memo(ProjectMetrics);