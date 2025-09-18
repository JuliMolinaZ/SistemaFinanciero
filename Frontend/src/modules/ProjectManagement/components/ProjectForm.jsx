// 📝 FORMULARIO DE PROYECTOS UNIFICADO - REFACTORIZADO
// ===================================================

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Box,
  Grid,
  Typography,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tooltip,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Collapse
} from '@mui/material';
import {
  Add as AddIcon,
  Remove as RemoveIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Info as InfoIcon,
  Receipt as ReceiptIcon,
  Calculate as CalculateIcon,
  PictureAsPdf as PdfIcon,
  AttachMoney as MoneyIcon,
  Business as BusinessIcon,
  Assignment as AssignmentIcon,
  Timeline as TimelineIcon,
  Group as GroupIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Settings as SettingsIcon
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

// Import del componente de gestión de fases
import ManagePhasesDialog from '../../../components/modals/ManagePhasesDialog';

// 🎨 Importar sistema de diseño unificado
import {
  UnifiedFormLayout,
  UnifiedInput,
  UnifiedSelect,
  UnifiedDatePicker,
  UnifiedTagSelector,
  UnifiedToggle
} from '../../../components/DesignSystem/FormComponents';
import {
  UnifiedButton,
  UnifiedCard,
  UnifiedAlert,
  UnifiedMetric,
  UnifiedBadge as Badge
} from '../../../components/DesignSystem/BaseComponents';
import { designTheme, styleUtils } from '../../../components/DesignSystem';

// 🎯 CONFIGURACIÓN DE PASOS DEL FORMULARIO
const FORM_STEPS = [
  {
    label: 'Información Básica',
    description: 'Datos generales del proyecto',
    icon: <AssignmentIcon />
  },
  {
    label: 'Cliente y Metodología',
    description: 'Selección de cliente y metodología',
    icon: <BusinessIcon />
  },
  {
    label: 'Fechas y Presupuesto',
    description: 'Planificación temporal y financiera',
    icon: <TimelineIcon />
  },
  {
    label: 'Servicios y Cotización',
    description: 'Detalles de servicios y cálculos',
    icon: <ReceiptIcon />
  },
  {
    label: 'Equipo de Trabajo',
    description: 'Asignación de miembros y roles',
    icon: <GroupIcon />
  }
];

// 🔧 HOOK PARA GESTIÓN DEL FORMULARIO
const useProjectForm = (initialData = {}, onSubmit) => {
  const [formData, setFormData] = useState({
    // Información básica
    nombre: '',
    descripcion: '',
    priority: 'medium',

    // Cliente y metodología
    cliente_id: '',
    methodology_id: '',
    project_manager_id: '',

    // Fases
    current_phase_id: '',
    phases: [],

    // Fechas y presupuesto
    start_date: null,
    end_date: null,
    budget: 0,

    // Servicios y cotización
    services: [{ description: '', quantity: 1, unit_price: 0, subtotal: 0 }],
    iva_percentage: 16,
    monto_sin_iva: 0,
    monto_con_iva: 0,

    // Equipo
    members: [],

    // Configuración
    terms_conditions: '',
    ...initialData
  });

  const [state, setState] = useState({
    currentStep: 0,
    loading: false,
    errors: {},
    touched: {},
    calculationResults: null,
    showAdvanced: false,
    showManagePhases: false
  });

  // 📊 Cálculos automáticos
  const calculateTotals = useCallback(() => {
    const subtotal = formData.services.reduce((sum, service) =>
      sum + (service.subtotal || 0), 0);
    const ivaAmount = subtotal * (formData.iva_percentage / 100);
    const total = subtotal + ivaAmount;

    const calculations = {
      subtotal: parseFloat(subtotal.toFixed(2)),
      ivaAmount: parseFloat(ivaAmount.toFixed(2)),
      total: parseFloat(total.toFixed(2))
    };

    setState(prev => ({ ...prev, calculationResults: calculations }));

    setFormData(prev => ({
      ...prev,
      monto_sin_iva: calculations.subtotal,
      monto_con_iva: calculations.total,
      budget: calculations.total
    }));

    return calculations;
  }, [formData.services, formData.iva_percentage]);

  // 🔄 Efecto para recalcular totales
  useEffect(() => {
    calculateTotals();
  }, [calculateTotals]);

  // ✅ Validación de paso
  const validateStep = useCallback((step) => {
    const newErrors = {};

    switch (step) {
      case 0:
        if (!formData.nombre.trim()) newErrors.nombre = 'El nombre es obligatorio';
        if (formData.nombre.length < 3) newErrors.nombre = 'El nombre debe tener al menos 3 caracteres';
        break;
      case 1:
        if (!formData.cliente_id) newErrors.cliente_id = 'Debe seleccionar un cliente';
        break;
      case 2:
        if (formData.start_date && formData.end_date && formData.start_date >= formData.end_date) {
          newErrors.end_date = 'La fecha de fin debe ser posterior a la fecha de inicio';
        }
        break;
      case 3:
        if (formData.services.length === 0) {
          newErrors.services = 'Debe agregar al menos un servicio';
        }
        break;
    }

    setState(prev => ({ ...prev, errors: newErrors }));
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  // 📝 Actualizar campo
  const updateField = useCallback((field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setState(prev => ({
      ...prev,
      touched: { ...prev.touched, [field]: true },
      errors: { ...prev.errors, [field]: null }
    }));
  }, []);

  // ➕ Gestión de servicios
  const addService = useCallback(() => {
    setFormData(prev => ({
      ...prev,
      services: [...prev.services, { description: '', quantity: 1, unit_price: 0, subtotal: 0 }]
    }));
  }, []);

  const removeService = useCallback((index) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.filter((_, i) => i !== index)
    }));
  }, []);

  const updateService = useCallback((index, field, value) => {
    setFormData(prev => {
      const newServices = [...prev.services];
      newServices[index] = { ...newServices[index], [field]: value };

      // Recalcular subtotal del servicio
      if (field === 'quantity' || field === 'unit_price') {
        const quantity = field === 'quantity' ? value : newServices[index].quantity;
        const unitPrice = field === 'unit_price' ? value : newServices[index].unit_price;
        newServices[index].subtotal = quantity * unitPrice;
      }

      return { ...prev, services: newServices };
    });
  }, []);

  // 🚶 Navegación de pasos
  const nextStep = useCallback(() => {
    if (validateStep(state.currentStep)) {
      setState(prev => ({
        ...prev,
        currentStep: Math.min(prev.currentStep + 1, FORM_STEPS.length - 1)
      }));
    }
  }, [state.currentStep, validateStep]);

  const prevStep = useCallback(() => {
    setState(prev => ({
      ...prev,
      currentStep: Math.max(prev.currentStep - 1, 0)
    }));
  }, []);

  const goToStep = useCallback((step) => {
    setState(prev => ({ ...prev, currentStep: step }));
  }, []);

  // 📋 Gestión de fases
  const loadProjectPhases = useCallback(async (projectId) => {
    if (!projectId) {
      // Para nuevo proyecto, usar fases por defecto
      const defaultPhases = [
        { id: 'temp-1', name: 'Backlog', position: 0 },
        { id: 'temp-2', name: 'Planificación', position: 1 },
        { id: 'temp-3', name: 'En desarrollo', position: 2 },
        { id: 'temp-4', name: 'QA', position: 3 },
        { id: 'temp-5', name: 'Revisión', position: 4 },
        { id: 'temp-6', name: 'Completado', position: 5 }
      ];
      setFormData(prev => ({
        ...prev,
        phases: defaultPhases,
        current_phase_id: defaultPhases[0].id
      }));
      return;
    }

    try {
      const response = await fetch(`/api/projects/${projectId}/phases`);
      const data = await response.json();

      if (data.success) {
        setFormData(prev => ({
          ...prev,
          phases: data.data.phases || [],
          current_phase_id: data.data.current_phase?.id || ''
        }));
      }
    } catch (error) {
      console.error('Error loading phases:', error);
    }
  }, []);

  const toggleManagePhases = useCallback(() => {
    setState(prev => ({ ...prev, showManagePhases: !prev.showManagePhases }));
  }, []);

  const handlePhasesUpdated = useCallback(() => {
    if (initialData.id) {
      loadProjectPhases(initialData.id);
    }
  }, [initialData.id, loadProjectPhases]);

  // Cargar fases al inicializar
  useEffect(() => {
    if (initialData.id) {
      loadProjectPhases(initialData.id);
    } else {
      loadProjectPhases(null); // Carga fases por defecto para nuevo proyecto
    }
  }, [initialData.id, loadProjectPhases]);

  // 💾 Envío del formulario
  const handleSubmit = useCallback(async (e) => {
    e?.preventDefault();

    // Validar todos los pasos
    let isValid = true;
    for (let i = 0; i < FORM_STEPS.length; i++) {
      if (!validateStep(i)) {
        isValid = false;
        setState(prev => ({ ...prev, currentStep: i }));
        break;
      }
    }

    if (!isValid) return;

    setState(prev => ({ ...prev, loading: true }));

    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Error al enviar formulario:', error);
      setState(prev => ({
        ...prev,
        errors: { submit: error.message || 'Error al guardar el proyecto' }
      }));
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  }, [formData, onSubmit, validateStep]);

  return {
    formData,
    state,
    updateField,
    addService,
    removeService,
    updateService,
    nextStep,
    prevStep,
    goToStep,
    handleSubmit,
    calculateTotals,
    toggleManagePhases,
    handlePhasesUpdated
  };
};

// 🎨 COMPONENTE PRINCIPAL DEL FORMULARIO
const ProjectForm = ({ initialData, onSubmit, onCancel, isEditing = false }) => {
  const {
    formData,
    state,
    updateField,
    addService,
    removeService,
    updateService,
    nextStep,
    prevStep,
    goToStep,
    handleSubmit,
    calculateTotals,
    toggleManagePhases,
    handlePhasesUpdated
  } = useProjectForm(initialData, onSubmit);

  // 🎯 Datos mock para selects
  const mockOptions = useMemo(() => ({
    clients: [
      { value: 1, label: 'Tech Solutions Inc.' },
      { value: 2, label: 'RAYMOND' },
      { value: 3, label: 'Digital Innovations' }
    ],
    methodologies: [
      { value: 1, label: 'Kanban' },
      { value: 2, label: 'Scrum' },
      { value: 3, label: 'Waterfall' }
    ],
    managers: [
      { value: 1, label: 'Juan Pérez' },
      { value: 2, label: 'María García' },
      { value: 3, label: 'Carlos López' }
    ],
    roles: [
      { value: 1, label: 'Frontend Developer' },
      { value: 2, label: 'Backend Developer' },
      { value: 3, label: 'UI/UX Designer' },
      { value: 4, label: 'Project Manager' }
    ]
  }), []);

  // 📋 Renderizado de cada paso
  const renderStepContent = () => {
    switch (state.currentStep) {
      case 0:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <UnifiedInput
                label="Nombre del Proyecto"
                value={formData.nombre}
                onChange={(e) => updateField('nombre', e.target.value)}
                error={state.errors.nombre}
                required
                placeholder="Ej: Sistema de Gestión Empresarial"
              />
            </Grid>
            <Grid item xs={12}>
              <UnifiedInput
                label="Descripción"
                value={formData.descripcion}
                onChange={(e) => updateField('descripcion', e.target.value)}
                multiline
                rows={4}
                placeholder="Describe el objetivo y alcance del proyecto..."
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <UnifiedSelect
                label="Prioridad"
                value={formData.priority}
                onChange={(e) => updateField('priority', e.target.value)}
                options={[
                  { value: 'low', label: 'Baja' },
                  { value: 'medium', label: 'Media' },
                  { value: 'high', label: 'Alta' },
                  { value: 'critical', label: 'Crítica' }
                ]}
              />
            </Grid>
          </Grid>
        );

      case 1:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <UnifiedSelect
                label="Cliente"
                value={formData.cliente_id}
                onChange={(e) => updateField('cliente_id', e.target.value)}
                options={mockOptions.clients}
                error={state.errors.cliente_id}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <UnifiedSelect
                label="Metodología"
                value={formData.methodology_id}
                onChange={(e) => updateField('methodology_id', e.target.value)}
                options={mockOptions.methodologies}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <UnifiedSelect
                label="Gerente de Proyecto"
                value={formData.project_manager_id}
                onChange={(e) => updateField('project_manager_id', e.target.value)}
                options={mockOptions.managers}
              />
            </Grid>

            {/* Selección de fase actual */}
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-end' }}>
                <Box sx={{ flex: 1 }}>
                  <UnifiedSelect
                    label="Fase Actual"
                    value={formData.current_phase_id}
                    onChange={(e) => updateField('current_phase_id', e.target.value)}
                    options={formData.phases.map(phase => ({
                      value: phase.id,
                      label: phase.name
                    }))}
                    placeholder="Seleccionar fase inicial..."
                  />
                </Box>
                <Tooltip title="Gestionar Fases">
                  <UnifiedButton
                    variant="secondary"
                    icon={<SettingsIcon />}
                    onClick={toggleManagePhases}
                    size="small"
                    disabled={!isEditing && !initialData.id}
                  >
                    Gestionar
                  </UnifiedButton>
                </Tooltip>
              </Box>
            </Grid>

            {/* Información sobre las fases */}
            <Grid item xs={12}>
              <UnifiedCard variant="soft" sx={{ p: 2 }}>
                <Typography variant="body2" sx={{ color: designTheme.colors.semantic.neutral[600], mb: 1 }}>
                  📋 Fases del Proyecto ({formData.phases.length})
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {formData.phases.map((phase, index) => (
                    <Badge
                      key={phase.id}
                      variant={phase.id === formData.current_phase_id ? "primary" : "soft"}
                      sx={{ fontSize: '0.75rem' }}
                    >
                      {index + 1}. {phase.name}
                    </Badge>
                  ))}
                </Box>
                {formData.phases.length === 0 && (
                  <Typography variant="body2" sx={{ color: designTheme.colors.semantic.neutral[500], fontStyle: 'italic' }}>
                    Se crearán fases por defecto al crear el proyecto
                  </Typography>
                )}
              </UnifiedCard>
            </Grid>
          </Grid>
        );

      case 2:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <UnifiedDatePicker
                label="Fecha de Inicio"
                value={formData.start_date}
                onChange={(date) => updateField('start_date', date)}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <UnifiedDatePicker
                label="Fecha de Fin"
                value={formData.end_date}
                onChange={(date) => updateField('end_date', date)}
                error={state.errors.end_date}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <UnifiedInput
                label="Presupuesto Estimado"
                value={formData.budget}
                onChange={(e) => updateField('budget', parseFloat(e.target.value) || 0)}
                type="number"
                InputProps={{
                  startAdornment: <MoneyIcon sx={{ mr: 1, color: designTheme.colors.semantic.neutral[500] }} />
                }}
              />
            </Grid>
          </Grid>
        );

      case 3:
        return (
          <Box>
            {/* Header de servicios */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Servicios del Proyecto
              </Typography>
              <UnifiedButton
                variant="secondary"
                icon={<AddIcon />}
                onClick={addService}
                size="small"
              >
                Agregar Servicio
              </UnifiedButton>
            </Box>

            {/* Lista de servicios */}
            <Box sx={{ mb: 3 }}>
              <AnimatePresence>
                {formData.services.map((service, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <UnifiedCard
                      variant="solid"
                      sx={{ mb: 2, p: 2 }}
                    >
                      <Grid container spacing={2} alignItems="center">
                        <Grid item xs={12} md={4}>
                          <UnifiedInput
                            label="Descripción del Servicio"
                            value={service.description}
                            onChange={(e) => updateService(index, 'description', e.target.value)}
                            placeholder="Ej: Desarrollo Frontend"
                            size="small"
                          />
                        </Grid>
                        <Grid item xs={6} md={2}>
                          <UnifiedInput
                            label="Cantidad"
                            value={service.quantity}
                            onChange={(e) => updateService(index, 'quantity', parseInt(e.target.value) || 0)}
                            type="number"
                            size="small"
                          />
                        </Grid>
                        <Grid item xs={6} md={2}>
                          <UnifiedInput
                            label="Precio Unitario"
                            value={service.unit_price}
                            onChange={(e) => updateService(index, 'unit_price', parseFloat(e.target.value) || 0)}
                            type="number"
                            size="small"
                          />
                        </Grid>
                        <Grid item xs={8} md={2}>
                          <Typography variant="h6" sx={{ color: designTheme.colors.semantic.primary[500] }}>
                            ${service.subtotal.toFixed(2)}
                          </Typography>
                        </Grid>
                        <Grid item xs={4} md={2}>
                          <Tooltip title="Eliminar servicio">
                            <IconButton
                              onClick={() => removeService(index)}
                              color="error"
                              disabled={formData.services.length === 1}
                            >
                              <RemoveIcon />
                            </IconButton>
                          </Tooltip>
                        </Grid>
                      </Grid>
                    </UnifiedCard>
                  </motion.div>
                ))}
              </AnimatePresence>
            </Box>

            {/* Configuración de IVA */}
            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={12} md={6}>
                <UnifiedInput
                  label="Porcentaje de IVA (%)"
                  value={formData.iva_percentage}
                  onChange={(e) => updateField('iva_percentage', parseFloat(e.target.value) || 0)}
                  type="number"
                />
              </Grid>
            </Grid>

            {/* Resumen financiero */}
            {state.calculationResults && (
              <UnifiedCard variant="gradient" sx={{ mt: 3 }}>
                <Box sx={{ p: 3 }}>
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>
                    Resumen Financiero
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={4}>
                      <UnifiedMetric
                        title="Subtotal"
                        value={`$${state.calculationResults.subtotal.toFixed(2)}`}
                        variant="glass"
                      />
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <UnifiedMetric
                        title={`IVA (${formData.iva_percentage}%)`}
                        value={`$${state.calculationResults.ivaAmount.toFixed(2)}`}
                        variant="glass"
                      />
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <UnifiedMetric
                        title="Total"
                        value={`$${state.calculationResults.total.toFixed(2)}`}
                        variant="glass"
                      />
                    </Grid>
                  </Grid>
                </Box>
              </UnifiedCard>
            )}
          </Box>
        );

      case 4:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Miembros del Equipo
              </Typography>
              <UnifiedTagSelector
                label="Seleccionar Miembros"
                value={formData.members}
                onChange={(members) => updateField('members', members)}
                options={mockOptions.roles.map(role => role.label)}
                allowCustom={false}
                placeholder="Buscar y seleccionar roles..."
              />
            </Grid>
            <Grid item xs={12}>
              <UnifiedInput
                label="Términos y Condiciones"
                value={formData.terms_conditions}
                onChange={(e) => updateField('terms_conditions', e.target.value)}
                multiline
                rows={6}
                placeholder="Especifica los términos y condiciones del proyecto..."
              />
            </Grid>
          </Grid>
        );

      default:
        return null;
    }
  };

  // 🎯 Acciones del formulario
  const formActions = [
    <UnifiedButton
      key="cancel"
      variant="secondary"
      onClick={onCancel}
      disabled={state.loading}
    >
      Cancelar
    </UnifiedButton>,

    state.currentStep > 0 && (
      <UnifiedButton
        key="prev"
        variant="secondary"
        onClick={prevStep}
        disabled={state.loading}
      >
        Anterior
      </UnifiedButton>
    ),

    state.currentStep < FORM_STEPS.length - 1 ? (
      <UnifiedButton
        key="next"
        variant="primary"
        onClick={nextStep}
        disabled={state.loading}
      >
        Siguiente
      </UnifiedButton>
    ) : (
      <UnifiedButton
        key="submit"
        variant="success"
        icon={<SaveIcon />}
        onClick={handleSubmit}
        loading={state.loading}
      >
        {isEditing ? 'Actualizar Proyecto' : 'Crear Proyecto'}
      </UnifiedButton>
    )
  ].filter(Boolean);

  return (
    <UnifiedFormLayout
      title={isEditing ? 'Editar Proyecto' : 'Nuevo Proyecto'}
      subtitle={`Paso ${state.currentStep + 1} de ${FORM_STEPS.length}: ${FORM_STEPS[state.currentStep].description}`}
      onSubmit={handleSubmit}
      actions={formActions}
      error={state.errors.submit}
      loading={state.loading}
    >
      {/* Stepper horizontal */}
      <Box sx={{ mb: 4 }}>
        <Stepper activeStep={state.currentStep} alternativeLabel>
          {FORM_STEPS.map((step, index) => (
            <Step key={index}>
              <StepLabel
                onClick={() => goToStep(index)}
                sx={{
                  cursor: 'pointer',
                  '& .MuiStepLabel-label': {
                    fontSize: designTheme.typography.body2.fontSize,
                    fontWeight: state.currentStep === index ? 600 : 400,
                    color: state.currentStep === index
                      ? designTheme.colors.semantic.primary[500]
                      : designTheme.colors.semantic.neutral[600]
                  }
                }}
              >
                {step.label}
              </StepLabel>
            </Step>
          ))}
        </Stepper>
      </Box>

      {/* Contenido del paso actual */}
      <AnimatePresence mode="wait">
        <motion.div
          key={state.currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          {renderStepContent()}
        </motion.div>
      </AnimatePresence>

      {/* Modal de gestión de fases */}
      <ManagePhasesDialog
        isOpen={state.showManagePhases}
        onClose={toggleManagePhases}
        projectId={initialData.id}
        projectName={formData.nombre || 'Nuevo Proyecto'}
        onPhasesUpdated={handlePhasesUpdated}
      />
    </UnifiedFormLayout>
  );
};

export default ProjectForm;