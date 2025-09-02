// components/DashboardComponents/ProjectsDashboard.jsx
import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  LinearProgress,
  Paper,
  Button,
  IconButton,
  Tooltip,
  Badge,
  AvatarGroup,
  Divider
} from '@mui/material';
import {
  Assignment,
  Schedule,
  AttachMoney,
  Group,
  TrendingUp,
  TrendingDown,
  CheckCircle,
  Warning,
  Error,
  PlayArrow,
  Pause,
  Done,
  MoreVert,
  Visibility,
  Edit,
  Timeline,
  Business,
  Person,
  CalendarToday,
  Speed
} from '@mui/icons-material';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import { styled } from '@mui/material/styles';

const ProjectCard = styled(Card)(({ theme, status = 'active' }) => {
  const statusColors = {
    active: { bg: '#f0fdf4', border: '#22c55e', accent: '#16a34a' },
    completed: { bg: '#f8fafc', border: '#64748b', accent: '#475569' },
    delayed: { bg: '#fef2f2', border: '#ef4444', accent: '#dc2626' },
    paused: { bg: '#fefce8', border: '#eab308', accent: '#ca8a04' }
  };

  const colors = statusColors[status];

  return {
    background: colors.bg,
    border: `2px solid ${colors.border}`,
    borderRadius: 16,
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    position: 'relative',
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: `0 8px 25px ${colors.accent}30`
    },
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: 4,
      background: colors.accent,
      borderRadius: '14px 14px 0 0'
    }
  };
});

const ProjectMetric = ({ title, value, subtitle, icon, color = '#22c55e', trend }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Card sx={{ 
        borderRadius: 3, 
        background: 'linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)',
        border: `2px solid ${color}20`,
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: `0 8px 25px ${color}30`
        }
      }}>
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Avatar sx={{ bgcolor: color, width: 48, height: 48 }}>
              {icon}
            </Avatar>
            {trend && (
              <Chip
                label={`${trend > 0 ? '+' : ''}${trend}%`}
                color={trend > 0 ? 'success' : 'error'}
                size="small"
                icon={trend > 0 ? <TrendingUp fontSize="small" /> : <TrendingDown fontSize="small" />}
              />
            )}
          </Box>
          <Typography variant="h4" fontWeight="bold" color={color} mb={1}>
            {value}
          </Typography>
          <Typography variant="h6" fontWeight="600" mb={1}>
            {title}
          </Typography>
          {subtitle && (
            <Typography variant="body2" color="text.secondary">
              {subtitle}
            </Typography>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

const ProjectItem = ({ project, index }) => {
  const getStatusColor = (status) => {
    const colors = {
      'En Progreso': '#22c55e',
      'Completado': '#64748b',
      'Retrasado': '#ef4444',
      'Pausado': '#eab308',
      'Planificación': '#3b82f6'
    };
    return colors[status] || '#64748b';
  };

  const getStatusIcon = (status) => {
    const icons = {
      'En Progreso': <PlayArrow />,
      'Completado': <Done />,
      'Retrasado': <Error />,
      'Pausado': <Pause />,
      'Planificación': <Schedule />
    };
    return icons[status] || <Assignment />;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <ProjectCard status={project.status.toLowerCase().replace(' ', '')}>
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
            <Box sx={{ flex: 1 }}>
              <Typography variant="h6" fontWeight="bold" mb={1}>
                {project.name}
              </Typography>
              <Typography variant="body2" color="text.secondary" mb={2}>
                {project.description}
              </Typography>
              
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <Chip
                  icon={getStatusIcon(project.status)}
                  label={project.status}
                  size="small"
                  sx={{
                    bgcolor: `${getStatusColor(project.status)}20`,
                    color: getStatusColor(project.status),
                    fontWeight: 600
                  }}
                />
                <Chip
                  icon={<Business fontSize="small" />}
                  label={project.client}
                  size="small"
                  variant="outlined"
                />
              </Box>
            </Box>
            
            <IconButton size="small">
              <MoreVert />
            </IconButton>
          </Box>

          <Grid container spacing={2} mb={2}>
            <Grid item xs={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <AttachMoney fontSize="small" color="success" />
                <Typography variant="body2" fontWeight="600">
                  ${project.budget?.toLocaleString()}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CalendarToday fontSize="small" color="action" />
                <Typography variant="body2">
                  {project.deadline}
                </Typography>
              </Box>
            </Grid>
          </Grid>

          <Box sx={{ mb: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2" color="text.secondary">
                Progreso
              </Typography>
              <Typography variant="body2" fontWeight="bold">
                {project.progress}%
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={project.progress}
              sx={{
                height: 6,
                borderRadius: 3,
                backgroundColor: `${getStatusColor(project.status)}20`,
                '& .MuiLinearProgress-bar': {
                  backgroundColor: getStatusColor(project.status),
                  borderRadius: 3
                }
              }}
            />
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <AvatarGroup max={3} sx={{ '& .MuiAvatar-root': { width: 28, height: 28 } }}>
              {project.team?.map((member, idx) => (
                <Avatar key={idx} sx={{ fontSize: '0.8rem' }}>
                  {member.name[0]}
                </Avatar>
              ))}
            </AvatarGroup>
            
            <Box sx={{ display: 'flex', gap: 1 }}>
              <IconButton size="small" color="primary">
                <Visibility fontSize="small" />
              </IconButton>
              <IconButton size="small" color="success">
                <Edit fontSize="small" />
              </IconButton>
            </Box>
          </Box>
        </CardContent>
      </ProjectCard>
    </motion.div>
  );
};

const ProjectsTimeline = ({ projects }) => {
  const timelineData = [
    { month: 'Oct', planned: 8, completed: 6, delayed: 1 },
    { month: 'Nov', planned: 10, completed: 8, delayed: 2 },
    { month: 'Dic', planned: 12, completed: 10, delayed: 1 },
    { month: 'Ene', planned: 9, completed: 7, delayed: 2 },
    { month: 'Feb', planned: 11, completed: 9, delayed: 1 },
    { month: 'Mar', planned: 13, completed: 11, delayed: 2 }
  ];

  return (
    <Card sx={{ borderRadius: 3, height: '100%' }}>
      <CardContent sx={{ p: 3 }}>
        <Typography variant="h6" fontWeight="bold" mb={3}>
          📈 Timeline de Proyectos
        </Typography>
        
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={timelineData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="month" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <RechartsTooltip 
              contentStyle={{
                backgroundColor: 'rgba(255,255,255,0.95)',
                border: 'none',
                borderRadius: 8,
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
              }}
            />
            <Legend />
            
            <Bar dataKey="planned" name="Planificados" fill="#94a3b8" />
            <Bar dataKey="completed" name="Completados" fill="#22c55e" />
            <Bar dataKey="delayed" name="Retrasados" fill="#ef4444" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

const ProjectsOverview = ({ data }) => {
  const statusData = [
    { name: 'En Progreso', value: 8, color: '#22c55e' },
    { name: 'Completados', value: 15, color: '#64748b' },
    { name: 'Planificación', value: 3, color: '#3b82f6' },
    { name: 'Retrasados', value: 2, color: '#ef4444' },
    { name: 'Pausados', value: 1, color: '#eab308' }
  ];

  return (
    <Card sx={{ borderRadius: 3, height: '100%' }}>
      <CardContent sx={{ p: 3 }}>
        <Typography variant="h6" fontWeight="bold" mb={3}>
          🎯 Resumen de Proyectos
        </Typography>
        
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <RechartsTooltip />
              </PieChart>
            </ResponsiveContainer>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <List sx={{ p: 0 }}>
              {statusData.map((status, index) => (
                <ListItem key={index} sx={{ px: 0, py: 1 }}>
                  <ListItemAvatar>
                    <Box
                      sx={{
                        width: 16,
                        height: 16,
                        borderRadius: '50%',
                        backgroundColor: status.color
                      }}
                    />
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2" fontWeight="600">
                          {status.name}
                        </Typography>
                        <Typography variant="body2" fontWeight="bold">
                          {status.value}
                        </Typography>
                      </Box>
                    }
                  />
                </ListItem>
              ))}
            </List>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

const TeamPerformance = ({ teams }) => {
  const performanceData = [
    { team: 'Frontend', efficiency: 92, projects: 8, onTime: 87 },
    { team: 'Backend', efficiency: 88, projects: 6, onTime: 93 },
    { team: 'Mobile', efficiency: 85, projects: 4, onTime: 80 },
    { team: 'DevOps', efficiency: 90, projects: 3, onTime: 95 },
    { team: 'QA', efficiency: 94, projects: 12, onTime: 89 }
  ];

  return (
    <Card sx={{ borderRadius: 3, height: '100%' }}>
      <CardContent sx={{ p: 3 }}>
        <Typography variant="h6" fontWeight="bold" mb={3}>
          👥 Performance por Equipo
        </Typography>
        
        <ResponsiveContainer width="100%" height={300}>
          <RadarChart data={performanceData}>
            <PolarGrid />
            <PolarAngleAxis dataKey="team" tick={{ fontSize: 12 }} />
            <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fontSize: 10 }} />
            <Radar
              name="Eficiencia"
              dataKey="efficiency"
              stroke="#22c55e"
              fill="#22c55e"
              fillOpacity={0.3}
              strokeWidth={2}
            />
            <Radar
              name="Puntualidad"
              dataKey="onTime"
              stroke="#3b82f6"
              fill="#3b82f6"
              fillOpacity={0.2}
              strokeWidth={2}
            />
            <Legend />
          </RadarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

const ProjectsDashboard = ({ kpis, projectsData }) => {
  const [selectedFilter, setSelectedFilter] = useState('all');

  // Datos de ejemplo para proyectos
  const mockProjects = [
    {
      id: 1,
      name: 'E-commerce Platform',
      description: 'Desarrollo completo de plataforma de comercio electrónico',
      client: 'TechCorp Solutions',
      status: 'En Progreso',
      progress: 75,
      budget: 45000,
      deadline: '2024-12-15',
      team: [
        { name: 'Juan Pérez', role: 'Frontend' },
        { name: 'María García', role: 'Backend' },
        { name: 'Carlos López', role: 'QA' }
      ]
    },
    {
      id: 2,
      name: 'Mobile Banking App',
      description: 'Aplicación móvil para servicios bancarios',
      client: 'Innovation Labs',
      status: 'Retrasado',
      progress: 45,
      budget: 65000,
      deadline: '2024-11-30',
      team: [
        { name: 'Ana Rodríguez', role: 'Mobile' },
        { name: 'Luis Martín', role: 'Backend' }
      ]
    },
    {
      id: 3,
      name: 'CRM Dashboard',
      description: 'Dashboard administrativo para gestión de clientes',
      client: 'Digital Dynamics',
      status: 'Completado',
      progress: 100,
      budget: 28000,
      deadline: '2024-10-20',
      team: [
        { name: 'Elena Vázquez', role: 'Fullstack' }
      ]
    },
    {
      id: 4,
      name: 'IoT Monitoring System',
      description: 'Sistema de monitoreo para dispositivos IoT',
      client: 'Future Systems',
      status: 'Planificación',
      progress: 15,
      budget: 52000,
      deadline: '2025-02-28',
      team: [
        { name: 'Roberto Silva', role: 'IoT' },
        { name: 'Carmen Torres', role: 'DevOps' }
      ]
    }
  ];

  const projectMetrics = {
    totalProjects: 29,
    activeProjects: 8,
    completedThisMonth: 6,
    averageProgress: 78,
    totalBudget: 1250000,
    teamEfficiency: 89
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h4" gutterBottom fontWeight="bold" mb={4}>
        🚀 Dashboard de Proyectos
      </Typography>

      {/* Métricas principales */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={6} md={4}>
          <ProjectMetric
            title="Proyectos Activos"
            value={projectMetrics.activeProjects}
            subtitle="En desarrollo"
            icon={<Assignment />}
            color="#22c55e"
            trend={12}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <ProjectMetric
            title="Completados"
            value={projectMetrics.completedThisMonth}
            subtitle="Este mes"
            icon={<CheckCircle />}
            color="#3b82f6"
            trend={8}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <ProjectMetric
            title="Eficiencia del Equipo"
            value={`${projectMetrics.teamEfficiency}%`}
            subtitle="Promedio general"
            icon={<Speed />}
            color="#8b5cf6"
            trend={3}
          />
        </Grid>
      </Grid>

      {/* Timeline y resumen */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} lg={8}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <ProjectsTimeline />
          </motion.div>
        </Grid>
        <Grid item xs={12} lg={4}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <ProjectsOverview />
          </motion.div>
        </Grid>
      </Grid>

      {/* Performance del equipo */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <TeamPerformance />
          </motion.div>
        </Grid>
      </Grid>

      {/* Lista de proyectos */}
      <Box mb={3}>
        <Typography variant="h5" fontWeight="bold" mb={3}>
          📋 Proyectos Activos
        </Typography>
        
        <Grid container spacing={3}>
          {mockProjects.map((project, index) => (
            <Grid item xs={12} md={6} lg={4} key={project.id}>
              <ProjectItem project={project} index={index} />
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
};

export default ProjectsDashboard;