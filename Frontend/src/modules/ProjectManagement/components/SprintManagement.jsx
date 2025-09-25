// 🏃‍♂️ GESTIÓN DE SPRINTS - REFACTORIZADO CON DISEÑO UNIFICADO
// ============================================================

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Box,
  Typography,
  Grid,
  Chip,
  LinearProgress,
  IconButton,
  Tooltip,
  Dialog,
  Alert,
  Badge,
  alpha
} from '@mui/material';
import {
  Add as AddIcon,
  PlayArrow as PlayIcon,
  Pause as PauseIcon,
  CheckCircle as CheckCircleIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  Schedule as ScheduleIcon,
  Assignment as AssignmentIcon,
  Group as GroupIcon,
  Timeline as TimelineIcon,
  Assessment as AssessmentIcon,
  Flag as FlagIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  MoreVert as MoreVertIcon
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

// 🎨 Importar sistema de diseño unificado
import {
  UnifiedCard,
  UnifiedButton,
  UnifiedInput,
  UnifiedAlert,
  UnifiedSkeleton
} from '../../../components/DesignSystem/BaseComponents';
import {
  UnifiedSelect,
  UnifiedFormLayout
} from '../../../components/DesignSystem/FormComponents';
import { designTheme, styleUtils } from '../../../components/DesignSystem';
import { TaskFormActionButtons } from './TaskFormStyleButtons';

// 🏃‍♂️ CARD DE SPRINT UNIFICADO
const SprintCard = React.memo(({ sprint, index, onEdit, onStart, onComplete }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return designTheme.colors.semantic.success[400];
      case 'planning': return designTheme.colors.semantic.primary[400];
      case 'completed': return designTheme.colors.semantic.neutral[500];
      case 'cancelled': return designTheme.colors.semantic.danger[400];
      default: return designTheme.colors.semantic.neutral[400];
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'active': return 'Activo';
      case 'planning': return 'Planificación';
      case 'completed': return 'Completado';
      case 'cancelled': return 'Cancelado';
      default: return status;
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active': return <PlayIcon sx={{ fontSize: 16 }} />;
      case 'planning': return <InfoIcon sx={{ fontSize: 16 }} />;
      case 'completed': return <CheckCircleIcon sx={{ fontSize: 16 }} />;
      case 'cancelled': return <WarningIcon sx={{ fontSize: 16 }} />;
      default: return <InfoIcon sx={{ fontSize: 16 }} />;
    }
  };

  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('es-CL');
  };

  const calculateSprintProgress = () => {
    const totalTasks = sprint.tasks?.length || 0;
    const completedTasks = sprint.tasks?.filter(task => task.status === 'done').length || 0;
    return totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  };

  const progress = calculateSprintProgress();
  const isOverdue = sprint.end_date && new Date(sprint.end_date) < new Date() && sprint.status === 'active';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      whileHover={{ y: -4 }}
    >
      <UnifiedCard
        variant="glass"
        sx={{
          height: '100%',
          position: 'relative',
          border: isOverdue ? `1px solid ${designTheme.colors.semantic.danger[400]}` : undefined,
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '5px',
            background: isOverdue
              ? designTheme.gradients.danger
              : `linear-gradient(90deg, ${getStatusColor(sprint.status)} 0%, ${alpha(getStatusColor(sprint.status), 0.8)} 100%)`,
          },
          '&:hover': {
            transform: 'translateY(-8px) scale(1.02)',
            boxShadow: isOverdue ? designTheme.shadows.glowDanger : designTheme.shadows.glow,
          },
          transition: `all ${designTheme.animations.duration.normal}`
        }}
      >
        <Box sx={{ p: 3 }}>
          {/* Header */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="h6" component="h3" sx={{
                fontWeight: 700,
                mb: 1,
                color: designTheme.colors.semantic.neutral[800],
                fontSize: '1.125rem',
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}>
                {sprint.name}
                {isOverdue && (
                  <Chip
                    icon={<FlagIcon />}
                    label="Vencido"
                    sx={{
                      backgroundColor: designTheme.colors.semantic.danger[400],
                      color: designTheme.colors.semantic.neutral[900],
                      fontWeight: 600,
                      fontSize: '0.75rem',
                      height: 20,
                      borderRadius: designTheme.borderRadius.md,
                    }}
                    size="small"
                  />
                )}
              </Typography>
              <Chip
                icon={getStatusIcon(sprint.status)}
                label={getStatusLabel(sprint.status)}
                sx={{
                  backgroundColor: getStatusColor(sprint.status),
                  color: designTheme.colors.semantic.neutral[900],
                  fontWeight: 600,
                  fontSize: '0.8rem',
                  height: 32,
                  borderRadius: designTheme.borderRadius.md,
                  boxShadow: `0 8px 20px ${alpha(getStatusColor(sprint.status), 0.4)}`,
                  '&:hover': {
                    transform: 'scale(1.08) translateY(-1px)',
                  },
                  transition: `all ${designTheme.animations.duration.normal}`
                }}
                size="small"
              />
            </Box>
            <IconButton size="small" sx={{ color: designTheme.colors.semantic.neutral[600] }}>
              <MoreVertIcon />
            </IconButton>
          </Box>

          {/* Description */}
          {sprint.description && (
            <Typography
              variant="body2"
              sx={{
                mb: 2,
                color: designTheme.colors.semantic.neutral[600],
                fontSize: '0.875rem',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden'
              }}
            >
              {sprint.description}
            </Typography>
          )}

          {/* Goal */}
          {sprint.goal && (
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" sx={{
                fontWeight: 600,
                mb: 0.5,
                color: designTheme.colors.semantic.neutral[600],
                fontSize: '0.875rem'
              }}>
                Objetivo:
              </Typography>
              <Typography variant="body2" sx={{
                color: designTheme.colors.semantic.neutral[800],
                fontSize: '0.875rem',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden'
              }}>
                {sprint.goal}
              </Typography>
            </Box>
          )}

          {/* Progress */}
          <Box sx={{ mb: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2" sx={{
                color: designTheme.colors.semantic.neutral[600],
                fontWeight: 500,
                fontSize: '0.875rem'
              }}>
                Progreso
              </Typography>
              <Typography variant="body2" sx={{
                fontWeight: 700,
                color: designTheme.colors.semantic.neutral[800],
                fontSize: '0.875rem'
              }}>
                {progress}%
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={progress}
              sx={{
                height: 10,
                borderRadius: designTheme.borderRadius.md,
                backgroundColor: alpha(designTheme.colors.semantic.neutral[300], 0.3),
                '& .MuiLinearProgress-bar': {
                  borderRadius: designTheme.borderRadius.md,
                  background: isOverdue
                    ? designTheme.gradients.danger
                    : `linear-gradient(90deg, ${getStatusColor(sprint.status)} 0%, ${alpha(getStatusColor(sprint.status), 0.8)} 100%)`,
                  boxShadow: `0 4px 15px ${alpha(isOverdue ? designTheme.colors.semantic.danger[400] : getStatusColor(sprint.status), 0.4)}`,
                }
              }}
            />
          </Box>

          {/* Dates */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Box>
              <Typography variant="caption" sx={{
                color: designTheme.colors.semantic.neutral[600],
                fontSize: '0.75rem',
                fontWeight: 500
              }}>
                Inicio
              </Typography>
              <Typography variant="body2" sx={{
                fontWeight: 600,
                color: designTheme.colors.semantic.neutral[800],
                fontSize: '0.875rem'
              }}>
                {formatDate(sprint.start_date)}
              </Typography>
            </Box>
            <Box>
              <Typography variant="caption" sx={{
                color: designTheme.colors.semantic.neutral[600],
                fontSize: '0.75rem',
                fontWeight: 500
              }}>
                Fin
              </Typography>
              <Typography variant="body2" sx={{
                fontWeight: 600,
                color: isOverdue ? designTheme.colors.semantic.danger[600] : designTheme.colors.semantic.neutral[800],
                fontSize: '0.875rem'
              }}>
                {formatDate(sprint.end_date)}
              </Typography>
            </Box>
          </Box>

          {/* Stats */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <AssignmentIcon sx={{ fontSize: 16, color: designTheme.colors.semantic.neutral[600] }} />
              <Typography variant="body2" sx={{
                color: designTheme.colors.semantic.neutral[600],
                fontWeight: 500,
                fontSize: '0.875rem'
              }}>
                {sprint._count?.tasks || 0} tareas
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <GroupIcon sx={{ fontSize: 16, color: designTheme.colors.semantic.neutral[600] }} />
              <Typography variant="body2" sx={{
                color: designTheme.colors.semantic.neutral[600],
                fontWeight: 500,
                fontSize: '0.875rem'
              }}>
                {sprint._count?.dailies || 0} dailies
              </Typography>
            </Box>
          </Box>

          {/* Actions */}
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', alignItems: 'center' }}>
            {/* Botones de estado del sprint */}
            {sprint.status === 'planning' && (
              <UnifiedButton
                variant="success"
                icon={<PlayIcon />}
                onClick={() => onStart && onStart(sprint.id)}
                size="small"
                sx={{ flexGrow: 1 }}
              >
                Iniciar
              </UnifiedButton>
            )}
            {sprint.status === 'active' && (
              <UnifiedButton
                variant="primary"
                icon={<CheckCircleIcon />}
                onClick={() => onComplete && onComplete(sprint.id)}
                size="small"
                sx={{ flexGrow: 1 }}
              >
                Completar
              </UnifiedButton>
            )}
            
            {/* Botones de acciones con estilo del formulario de tareas */}
            <TaskFormActionButtons
              onEdit={() => onEdit && onEdit(sprint)}
              showLabels={false}
              size="small"
              disabled={{
                view: false,
                edit: false
              }}
            />
          </Box>
        </Box>
      </UnifiedCard>
    </motion.div>
  );
});

SprintCard.displayName = 'SprintCard';

// 🎯 COMPONENTE PRINCIPAL DE GESTIÓN DE SPRINTS
const SprintManagement = ({
  projects = [],
  sprints = [],
  onSprintStart,
  onSprintComplete
}) => {
  const [localSprints, setLocalSprints] = useState(sprints);
  const [selectedProject, setSelectedProject] = useState('');
  const [loading, setLoading] = useState(false);
  const [showSprintForm, setShowSprintForm] = useState(false);
  const [selectedSprint, setSelectedSprint] = useState(null);

  // Sincronizar sprints locales con props
  useEffect(() => {
    setLocalSprints(sprints);
  }, [sprints]);

  // Cargar sprints cuando cambie el proyecto
  useEffect(() => {
    if (selectedProject) {
      loadSprints();
    }
  }, [selectedProject]);

  const loadSprints = useCallback(async () => {
    if (!selectedProject) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/project-management/projects-debug/${selectedProject}/sprints`);
      if (response.ok) {
        const data = await response.json();
        setLocalSprints(data.data || []);
      }
    } catch (error) {
      console.error('Error cargando sprints:', error);
    } finally {
      setLoading(false);
    }
  }, [selectedProject]);

  const handleCreateSprint = useCallback(() => {
    setSelectedSprint(null);
    setShowSprintForm(true);
  }, []);

  const handleEditSprint = useCallback((sprint) => {
    setSelectedSprint(sprint);
    setShowSprintForm(true);
  }, []);

  const handleSprintSaved = useCallback((savedSprint) => {
    if (selectedSprint) {
      setLocalSprints(prev => prev.map(s => s.id === savedSprint.id ? savedSprint : s));
    } else {
      setLocalSprints(prev => [savedSprint, ...prev]);
    }
    setShowSprintForm(false);
    setSelectedSprint(null);
  }, [selectedSprint]);

  const handleStartSprint = useCallback(async (sprintId) => {
    try {
      const response = await fetch(`/api/project-management/sprints/${sprintId}/start`, {
        method: 'POST'
      });

      if (response.ok) {
        await loadSprints();
        if (onSprintStart) onSprintStart(sprintId);
      }
    } catch (error) {
      console.error('Error iniciando sprint:', error);
    }
  }, [loadSprints, onSprintStart]);

  const handleCompleteSprint = useCallback(async (sprintId) => {
    try {
      const response = await fetch(`/api/project-management/sprints/${sprintId}/complete`, {
        method: 'POST'
      });

      if (response.ok) {
        await loadSprints();
        if (onSprintComplete) onSprintComplete(sprintId);
      }
    } catch (error) {
      console.error('Error completando sprint:', error);
    }
  }, [loadSprints, onSprintComplete]);

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
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
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

              {selectedProject && (
                <UnifiedButton
                  variant="primary"
                  icon={<AddIcon />}
                  onClick={handleCreateSprint}
                >
                  Nuevo Sprint
                </UnifiedButton>
              )}
            </Box>
          </Box>
        </UnifiedCard>
      </motion.div>

      {/* 🏃‍♂️ Grid de Sprints */}
      {selectedProject ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          {loading ? (
            <Grid container spacing={3}>
              {[1, 2, 3, 4].map((item) => (
                <Grid item xs={12} sm={6} md={4} key={item}>
                  <UnifiedSkeleton height={400} />
                </Grid>
              ))}
            </Grid>
          ) : localSprints.length === 0 ? (
            <UnifiedAlert severity="info">
              No hay sprints disponibles para este proyecto. ¡Crea el primer sprint!
            </UnifiedAlert>
          ) : (
            <Grid container spacing={3}>
              <AnimatePresence>
                {localSprints.map((sprint, index) => (
                  <Grid item xs={12} sm={6} md={4} key={sprint.id}>
                    <SprintCard
                      sprint={sprint}
                      index={index}
                      onEdit={handleEditSprint}
                      onStart={handleStartSprint}
                      onComplete={handleCompleteSprint}
                    />
                  </Grid>
                ))}
              </AnimatePresence>
            </Grid>
          )}
        </motion.div>
      ) : (
        <UnifiedAlert severity="info">
          Selecciona un proyecto para ver sus sprints.
        </UnifiedAlert>
      )}

      {/* 📝 Formulario de Sprint */}
      <Dialog
        open={showSprintForm}
        onClose={() => setShowSprintForm(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            ...styleUtils.createGlassStyle('secondary'),
            border: `1px solid ${designTheme.colors.semantic.neutral[200]}`,
            boxShadow: designTheme.shadows.xxl,
          }
        }}
      >
        <SprintForm
          sprint={selectedSprint}
          projectId={selectedProject}
          onSave={handleSprintSaved}
          onCancel={() => setShowSprintForm(false)}
        />
      </Dialog>
    </Box>
  );
};

// 📝 FORMULARIO DE SPRINT UNIFICADO
const SprintForm = ({ sprint, projectId, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    start_date: '',
    end_date: '',
    goal: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (sprint) {
      setFormData({
        name: sprint.name || '',
        description: sprint.description || '',
        start_date: sprint.start_date ? sprint.start_date.split('T')[0] : '',
        end_date: sprint.end_date ? sprint.end_date.split('T')[0] : '',
        goal: sprint.goal || ''
      });
    }
  }, [sprint]);

  const handleInputChange = useCallback((field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  }, []);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const submitData = {
        ...formData,
        project_id: projectId
      };

      const url = sprint ? `/api/project-management/sprints/${sprint.id}` : '/api/project-management/sprints';
      const method = sprint ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData)
      });

      if (response.ok) {
        const result = await response.json();
        onSave(result.data);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al guardar el sprint');
      }
    } catch (err) {
      console.error('Error guardando sprint:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [formData, projectId, sprint, onSave]);

  return (
    <UnifiedFormLayout
      title={sprint ? 'Editar Sprint' : 'Nuevo Sprint'}
      onSubmit={handleSubmit}
      error={error}
      actions={[
        <UnifiedButton
          key="cancel"
          variant="secondary"
          onClick={onCancel}
          disabled={loading}
        >
          Cancelar
        </UnifiedButton>,
        <UnifiedButton
          key="submit"
          variant="primary"
          type="submit"
          loading={loading}
        >
          {sprint ? 'Actualizar' : 'Crear'}
        </UnifiedButton>
      ]}
    >
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <UnifiedInput
            label="Nombre del Sprint"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            required
            placeholder="Ej: Sprint 1 - Configuración Inicial"
            fullWidth
          />
        </Grid>

        <Grid item xs={12}>
          <UnifiedInput
            label="Descripción"
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            multiline
            rows={3}
            placeholder="Describe los objetivos y alcance del sprint"
            fullWidth
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <UnifiedInput
            label="Fecha de Inicio"
            type="date"
            value={formData.start_date}
            onChange={(e) => handleInputChange('start_date', e.target.value)}
            InputLabelProps={{ shrink: true }}
            fullWidth
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <UnifiedInput
            label="Fecha de Fin"
            type="date"
            value={formData.end_date}
            onChange={(e) => handleInputChange('end_date', e.target.value)}
            InputLabelProps={{ shrink: true }}
            fullWidth
          />
        </Grid>

        <Grid item xs={12}>
          <UnifiedInput
            label="Objetivo del Sprint"
            value={formData.goal}
            onChange={(e) => handleInputChange('goal', e.target.value)}
            multiline
            rows={2}
            placeholder="¿Qué se espera lograr en este sprint?"
            fullWidth
          />
        </Grid>
      </Grid>
    </UnifiedFormLayout>
  );
};

export default React.memo(SprintManagement);