// 🎪 PROJECT DIALOG WORKING - MODAL CENTRADO AL VIEWPORT
// ======================================================

import React, { useState, useEffect } from 'react';
import {
  X,
  Edit2,
  Trash2,
  Eye,
  Calendar,
  User,
  Users,
  Target,
  Clock,
  Activity,
  Settings,
  Save,
  AlertTriangle,
  Plus,
  Minus,
  UserPlus,
  Search,
  Check,
  ChevronDown,
  MapPin,
  Mail,
  Phone,
  Building,
  Star,
  TrendingUp,
  BarChart3,
  Zap,
  Award,
  Shield,
  Crown
} from 'lucide-react';
import { ProjectDialog, ProjectDialogHeader, ProjectDialogContent } from './ProjectDialog';
import { useModernToast } from './ModernToast';
import './project-dialog.css';
import './project-drawer.css'; // Reutilizar estilos existentes

// 🎯 BUTTON COMPONENT (reutilizado)
const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  icon: Icon,
  onClick,
  className = '',
  ...props
}) => (
  <button
    className={`pd-btn pd-btn--${variant} pd-btn--${size} ${loading ? 'pd-btn--loading' : ''} ${className}`}
    disabled={disabled || loading}
    onClick={onClick}
    {...props}
  >
    {loading ? (
      <div className="pd-spinner" />
    ) : Icon ? (
      <Icon className="pd-btn-icon" />
    ) : null}
    <span>{children}</span>
  </button>
);

// 🏷️ BADGE COMPONENT (reutilizado)
const Badge = ({ children, variant = 'default', className = '', ...props }) => (
  <span className={`pd-badge pd-badge--${variant} ${className}`} {...props}>
    {children}
  </span>
);

// 📊 PROGRESS SLIDER (reutilizado)
const ProgressSlider = ({ value, onChange, disabled = false }) => {
  const [localValue, setLocalValue] = useState(value);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleChange = (e) => {
    const newValue = parseInt(e.target.value);
    setLocalValue(newValue);
    if (!isDragging) {
      onChange?.(newValue);
    }
  };

  const handleMouseDown = () => setIsDragging(true);
  const handleMouseUp = () => {
    setIsDragging(false);
    if (localValue !== value) {
      onChange?.(localValue);
    }
  };

  return (
    <div className="pd-progress-slider">
      <div className="pd-slider-container">
        <input
          type="range"
          min="0"
          max="100"
          value={localValue}
          onChange={handleChange}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          disabled={disabled}
          className="pd-slider"
        />
        <div className="pd-slider-track">
          <div
            className="pd-slider-fill"
            style={{ width: `${localValue}%` }}
          />
        </div>
      </div>
      <div className="pd-slider-value">
        <input
          type="number"
          min="0"
          max="100"
          value={localValue}
          onChange={(e) => {
            const newValue = Math.max(0, Math.min(100, parseInt(e.target.value) || 0));
            setLocalValue(newValue);
            onChange?.(newValue);
          }}
          disabled={disabled}
          className="pd-progress-input"
        />
        <span>%</span>
      </div>
    </div>
  );
};

// 🗂️ TAB SYSTEM (reutilizado)
const TabButton = ({ active, onClick, icon: Icon, children, disabled = false }) => (
  <button
    className={`pd-tab ${active ? 'pd-tab--active' : ''}`}
    onClick={onClick}
    disabled={disabled}
  >
    {Icon && <Icon className="pd-tab-icon" />}
    <span>{children}</span>
  </button>
);

// ⚠️ CONFIRM DIALOG (adaptado para modal)
const ConfirmDialog = ({ open, onClose, onConfirm, title, message, confirmText = "Eliminar", variant = "danger" }) => (
  <ProjectDialog open={open} onClose={onClose}>
    <ProjectDialogHeader onClose={onClose} showCloseButton={false}>
      <div className="pd-confirm-header">
        <AlertTriangle className="pd-confirm-icon pd-confirm-icon--danger" />
        <h3 className="pd-confirm-title">{title}</h3>
      </div>
    </ProjectDialogHeader>
    <ProjectDialogContent scrollable={false}>
      <p className="pd-confirm-message">{message}</p>
      <div className="pd-confirm-actions">
        <Button variant="ghost" onClick={onClose}>
          Cancelar
        </Button>
        <Button variant={variant} onClick={onConfirm}>
          {confirmText}
        </Button>
      </div>
    </ProjectDialogContent>
  </ProjectDialog>
);

// 👥 TEAM MANAGER COMPONENT
const TeamManager = ({
  open,
  onClose,
  availableUsers,
  currentMembers = [],
  onAddMember,
  loading,
  searchTerm,
  onSearchChange
}) => {
  const [selectedTeamType, setSelectedTeamType] = useState('operations');

  const filteredUsers = availableUsers.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role.toLowerCase().includes(searchTerm.toLowerCase())
  ).filter(user =>
    !currentMembers.some(member => member.user_id === user.id)
  );

  return (
    <ProjectDialog open={open} onClose={onClose}>
      <ProjectDialogHeader onClose={onClose}>
        <div className="pd-team-manager-header">
          <div className="pd-team-manager-icon">
            <UserPlus className="pd-icon" />
          </div>
          <div>
            <h3 className="pd-team-manager-title">Gestión de Equipo</h3>
            <p className="pd-team-manager-subtitle">Agregar miembros al proyecto</p>
          </div>
        </div>
      </ProjectDialogHeader>
      <ProjectDialogContent>
        <div className="pd-team-manager-content">
          {/* Search Bar */}
          <div className="pd-search-section">
            <div className="pd-search-container">
              <Search className="pd-search-icon" />
              <input
                type="text"
                placeholder="Buscar por nombre, email o rol..."
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pd-search-input"
              />
            </div>
          </div>

          {/* Team Type Selection */}
          <div className="pd-team-type-section">
            <label className="pd-team-type-label">Tipo de equipo:</label>
            <div className="pd-team-type-options">
              <button
                className={`pd-team-type-btn ${selectedTeamType === 'operations' ? 'pd-team-type-btn--active' : ''}`}
                onClick={() => setSelectedTeamType('operations')}
              >
                <Users className="pd-team-type-icon" />
                Operaciones
              </button>
              <button
                className={`pd-team-type-btn ${selectedTeamType === 'it' ? 'pd-team-type-btn--active' : ''}`}
                onClick={() => setSelectedTeamType('it')}
              >
                <Settings className="pd-team-type-icon" />
                Tecnología
              </button>
            </div>
          </div>

          {/* Users List */}
          <div className="pd-users-section">
            <h4 className="pd-users-title">Usuarios disponibles ({filteredUsers.length})</h4>
            <div className="pd-users-grid">
              {loading ? (
                <div className="pd-loading-users">
                  <div className="pd-spinner" />
                  <p>Cargando usuarios...</p>
                </div>
              ) : filteredUsers.length > 0 ? (
                filteredUsers.map(user => (
                  <div key={user.id} className="pd-user-card">
                    <div className="pd-user-avatar">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="pd-user-info">
                      <h5 className="pd-user-name">{user.name}</h5>
                      <p className="pd-user-email">{user.email}</p>
                      <span className="pd-user-role">{user.role}</span>
                    </div>
                    <button
                      onClick={() => onAddMember(user.id, selectedTeamType)}
                      className="pd-add-user-btn"
                      title={`Agregar a ${selectedTeamType === 'operations' ? 'Operaciones' : 'Tecnología'}`}
                    >
                      <Plus className="pd-icon" />
                    </button>
                  </div>
                ))
              ) : (
                <div className="pd-no-users">
                  <UserPlus className="pd-no-users-icon" />
                  <p className="pd-no-users-text">No hay usuarios disponibles</p>
                  <p className="pd-no-users-subtitle">
                    {searchTerm ? 'Intenta con otros términos de búsqueda' : 'Todos los usuarios ya están asignados'}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </ProjectDialogContent>
    </ProjectDialog>
  );
};

// 🎨 COLOR UTILITY FUNCTIONS
const hexToHsl = (hex) => {
  const r = parseInt(hex.substr(1, 2), 16) / 255;
  const g = parseInt(hex.substr(3, 2), 16) / 255;
  const b = parseInt(hex.substr(5, 2), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;

  if (max === min) {
    h = s = 0;
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }

  return [h * 360, s * 100, l * 100];
};

const hslToHex = (h, s, l) => {
  l /= 100;
  const a = s * Math.min(l, 1 - l) / 100;
  const f = n => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color).toString(16).padStart(2, '0');
  };
  return `#${f(0)}${f(8)}${f(4)}`;
};

const adjustColor = (hexColor, lightnessDelta) => {
  if (!hexColor || !hexColor.startsWith('#')) return hexColor || '#3B82F6';

  try {
    const [h, s, l] = hexToHsl(hexColor);
    const newL = Math.max(0, Math.min(100, l + lightnessDelta));
    return hslToHex(h, s, newL);
  } catch (error) {
    console.error('Error adjusting color:', error);
    return hexColor || '#3B82F6';
  }
};

const getClientColors = (clientColor) => {
  const baseColor = clientColor || '#3B82F6';

  // Validar que tenemos un color válido
  if (!baseColor || typeof baseColor !== 'string') {
    console.warn('Invalid client color provided:', clientColor);
    return {
      base: '#3B82F6',
      dark: '#2563eb',
      light: '#93c5fd',
      lighter: '#dbeafe',
      darker: '#1d4ed8'
    };
  }

  return {
    base: baseColor,
    dark: adjustColor(baseColor, -20), // 20% más oscuro para las cards del cliente
    light: adjustColor(baseColor, 30),  // 30% más claro para los proyectos
    lighter: adjustColor(baseColor, 45), // 45% más claro para fondos
    darker: adjustColor(baseColor, -35)  // 35% más oscuro para bordes
  };
};

// 📊 MAIN PROJECT DIALOG WORKING COMPONENT
const ProjectDialogWorking = ({
  open,
  onClose,
  project,
  onUpdate,
  onDelete,
  phases = [],
  initialEditMode = false
}) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isEditing, setIsEditing] = useState(initialEditMode);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editData, setEditData] = useState({});
  const [availableClients, setAvailableClients] = useState([]);
  const [availablePhases, setAvailablePhases] = useState([]);
  const [loadingData, setLoadingData] = useState(false);

  // 👥 Team Management States
  const [showTeamManager, setShowTeamManager] = useState(false);
  const [availableUsers, setAvailableUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);

  const toast = useModernToast();

  // 🛡️ Early return if no project when modal is open
  if (!project && open) {
    console.warn('ProjectDialogWorking: No project provided while modal is open');
    return null;
  }

  // 🛡️ Default project data to prevent null errors
  const safeProject = project || {
    id: null,
    nombre: '',
    descripcion: '',
    status: 'planning',
    priority: 'medium',
    progress: 0,
    start_date: '',
    end_date: '',
    client: null,
    cliente_id: null,
    current_phase_id: null,
    members: []
  };

  // 🎨 Get client color scheme
  const clientColors = getClientColors(safeProject?.client?.color || editData.client_color);

  // 📋 Cargar datos de clientes y fases cuando se abre el modal
  useEffect(() => {
    if (open && isEditing) {
      loadClientsAndPhases();
    }
  }, [open, isEditing]);

  const loadClientsAndPhases = async () => {
    setLoadingData(true);
    try {
      // Cargar clientes
      console.log('🔍 Cargando clientes...');
      const clientsResponse = await fetch('http://localhost:8765/api/clientes', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (clientsResponse.ok) {
        const clientsData = await clientsResponse.json();
        console.log('✅ Clientes cargados:', clientsData);
        setAvailableClients(clientsData.data || clientsData || []);
      } else {
        console.error('❌ Error cargando clientes:', clientsResponse.status);
        setAvailableClients([
          { id: 1, nombre: 'Cliente Ejemplo 1', color: '#3B82F6' },
          { id: 2, nombre: 'Cliente Ejemplo 2', color: '#10B981' },
          { id: 3, nombre: 'Cliente Ejemplo 3', color: '#F59E0B' }
        ]);
      }

      // Cargar fases
      console.log('🔍 Cargando fases...');
      const phasesResponse = await fetch('http://localhost:8765/api/phases', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (phasesResponse.ok) {
        const phasesData = await phasesResponse.json();
        console.log('✅ Fases cargadas:', phasesData);
        setAvailablePhases(phasesData.data || phasesData || []);
      } else {
        console.error('❌ Error cargando fases:', phasesResponse.status);
        setAvailablePhases([
          { id: 1, nombre: 'Planificación' },
          { id: 2, nombre: 'Desarrollo' },
          { id: 3, nombre: 'Testing' },
          { id: 4, nombre: 'Despliegue' },
          { id: 5, nombre: 'Completado' }
        ]);
      }
    } catch (error) {
      console.error('Error cargando datos:', error);
      setAvailableClients([
        { id: 1, nombre: 'Cliente Ejemplo 1', color: '#3B82F6' },
        { id: 2, nombre: 'Cliente Ejemplo 2', color: '#10B981' },
        { id: 3, nombre: 'Cliente Ejemplo 3', color: '#F59E0B' }
      ]);
      setAvailablePhases([
        { id: 1, nombre: 'Planificación' },
        { id: 2, nombre: 'Desarrollo' },
        { id: 3, nombre: 'Testing' },
        { id: 4, nombre: 'Despliegue' },
        { id: 5, nombre: 'Completado' }
      ]);

      toast.error({
        title: 'Error de conexión',
        description: 'Usando datos de ejemplo. Verifica la conexión al servidor.'
      });
    } finally {
      setLoadingData(false);
    }
  };

  // 👥 Load Available Users for Team Management
  const loadAvailableUsers = async () => {
    setLoadingUsers(true);
    try {
      const response = await fetch('http://localhost:8765/api/users', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      });

      if (response.ok) {
        const userData = await response.json();
        console.log('✅ Usuarios cargados:', userData);
        setAvailableUsers(userData.data || userData || []);
      } else {
        // Mock users for development
        setAvailableUsers([
          { id: 1, name: 'Ana García', email: 'ana@empresa.com', role: 'Project Manager' },
          { id: 2, name: 'Carlos López', email: 'carlos@empresa.com', role: 'Developer' },
          { id: 3, name: 'María Torres', email: 'maria@empresa.com', role: 'Designer' },
          { id: 4, name: 'Juan Pérez', email: 'juan@empresa.com', role: 'DevOps' },
          { id: 5, name: 'Laura Sánchez', email: 'laura@empresa.com', role: 'QA Tester' }
        ]);
      }
    } catch (error) {
      console.error('Error loading users:', error);
      // Mock users for development
      setAvailableUsers([
        { id: 1, name: 'Ana García', email: 'ana@empresa.com', role: 'Project Manager' },
        { id: 2, name: 'Carlos López', email: 'carlos@empresa.com', role: 'Developer' },
        { id: 3, name: 'María Torres', email: 'maria@empresa.com', role: 'Designer' },
        { id: 4, name: 'Juan Pérez', email: 'juan@empresa.com', role: 'DevOps' },
        { id: 5, name: 'Laura Sánchez', email: 'laura@empresa.com', role: 'QA Tester' }
      ]);
    } finally {
      setLoadingUsers(false);
    }
  };

  // 👥 Team Management Functions
  const handleAddMember = async (userId, teamType) => {
    try {
      const response = await fetch(`http://localhost:8765/api/projects-working/projects/${safeProject.id}/members`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ user_id: userId, team_type: teamType })
      });

      const data = await response.json();

      if (data.success) {
        console.log('✅ Miembro agregado:', data.data);
        onUpdate?.(data.data);
        toast.success({
          title: 'Miembro agregado',
          description: 'El miembro se agregó correctamente al equipo'
        });
      } else {
        toast.error({
          title: 'Error al agregar miembro',
          description: data.message || 'No se pudo agregar el miembro'
        });
      }
    } catch (error) {
      console.error('Error adding member:', error);
      toast.error({
        title: 'Error de conexión',
        description: 'No se pudo conectar con el servidor'
      });
    }
  };

  const handleRemoveMember = async (memberId) => {
    try {
      const response = await fetch(`http://localhost:8765/api/projects-working/projects/${safeProject.id}/members/${memberId}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      const data = await response.json();

      if (data.success) {
        console.log('✅ Miembro removido:', data.data);
        onUpdate?.(data.data);
        toast.success({
          title: 'Miembro removido',
          description: 'El miembro se removió correctamente del equipo'
        });
      } else {
        toast.error({
          title: 'Error al remover miembro',
          description: data.message || 'No se pudo remover el miembro'
        });
      }
    } catch (error) {
      console.error('Error removing member:', error);
      toast.error({
        title: 'Error de conexión',
        description: 'No se pudo conectar con el servidor'
      });
    }
  };

  // Initialize edit data when project changes
  useEffect(() => {
    if (project && typeof project === 'object') {
      setEditData({
        nombre: safeProject.nombre || '',
        descripcion: safeProject.descripcion || '',
        status: safeProject.status || 'planning',
        priority: safeProject.priority || 'medium',
        progress: safeProject.progress || 0,
        start_date: safeProject.start_date || '',
        end_date: safeProject.end_date || '',
        cliente_id: safeProject.cliente_id || safeProject.client_id || '',
        current_phase_id: safeProject.current_phase_id || '',
        client_color: (safeProject.client && safeProject.client.color) ? safeProject.client.color : '#3B82F6'
      });
    } else {
      // Initialize with default values if no project
      setEditData({
        nombre: '',
        descripcion: '',
        status: 'planning',
        priority: 'medium',
        progress: 0,
        start_date: '',
        end_date: '',
        cliente_id: '',
        current_phase_id: '',
        client_color: '#3B82F6'
      });
    }
  }, [project]);

  // Reset states when modal closes
  useEffect(() => {
    if (!open) {
      setActiveTab('overview');
      setIsEditing(false);
      setShowDeleteConfirm(false);
    } else {
      setIsEditing(initialEditMode);
    }
  }, [open, initialEditMode]);

  // Handle edit mode toggle
  const handleEditToggle = () => {
    if (isEditing) {
      setEditData({
        nombre: safeProject.nombre || '',
        descripcion: safeProject.descripcion || '',
        status: safeProject.status || 'planning',
        priority: safeProject.priority || 'medium',
        progress: safeProject.progress || 0,
        start_date: safeProject.start_date || '',
        end_date: safeProject.end_date || '',
        cliente_id: safeProject.cliente_id || '',
        current_phase_id: safeProject.current_phase_id || '',
        client_color: (safeProject.client && safeProject.client.color) ? safeProject.client.color : '#3B82F6'
      });
    }
    setIsEditing(!isEditing);
  };

  // Handle save changes
  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch(`http://localhost:8765/api/projects-working/projects/${safeProject.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(editData)
      });

      const data = await response.json();

      if (data.success) {
        console.log('✅ Proyecto actualizado:', data.data);
        setIsEditing(false);
        onUpdate?.(data.data);
        toast.success({
          title: 'Proyecto actualizado',
          description: 'Los cambios se guardaron correctamente'
        });
      } else {
        console.error('❌ Error al guardar:', data.message);
        toast.error({
          title: 'Error al guardar',
          description: data.message || 'No se pudieron guardar los cambios'
        });
      }
    } catch (error) {
      console.error('Error saving project:', error);
      toast.error({
        title: 'Error de conexión',
        description: 'No se pudo conectar con el servidor'
      });
    } finally {
      setSaving(false);
    }
  };

  // Handle inline updates (progress)
  const handleInlineUpdate = async (field, value) => {
    try {
      const response = await fetch(`http://localhost:8765/api/projects-working/projects/${safeProject.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ [field]: value })
      });

      const data = await response.json();

      if (data.success) {
        console.log('✅ Campo actualizado:', field, value);
        onUpdate?.(data.data);
        toast.success({
          title: field === 'progress' ? 'Progreso actualizado' : 'Campo actualizado',
          description: `${field === 'progress' ? 'Progreso' : 'Campo'} actualizado correctamente`
        });
      } else {
        console.error('❌ Error al actualizar:', data.message);
        toast.error({
          title: 'Error al actualizar',
          description: data.message || 'No se pudo actualizar'
        });
      }
    } catch (error) {
      console.error('Error updating project:', error);
      toast.error({
        title: 'Error de conexión',
        description: 'No se pudo conectar con el servidor'
      });
    }
  };

  // Handle delete
  const handleDelete = async () => {
    try {
      const response = await fetch(`http://localhost:8765/api/projects-working/projects/${safeProject.id}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      const data = await response.json();

      if (data.success) {
        console.log('✅ Proyecto eliminado:', data.data);
        onDelete?.(project);
        onClose();
        toast.success({
          title: 'Proyecto eliminado',
          description: 'El proyecto se eliminó correctamente'
        });
      } else {
        console.error('❌ Error al eliminar:', data.message);
        toast.error({
          title: 'Error al eliminar',
          description: data.message || 'No se pudo eliminar el proyecto'
        });
      }
    } catch (error) {
      console.error('Error deleting project:', error);
      toast.error({
        title: 'Error de conexión',
        description: 'No se pudo conectar con el servidor'
      });
    } finally {
      setShowDeleteConfirm(false);
    }
  };

  // Format functions (reutilizadas)
  const getStatusBadge = (status) => {
    const variants = {
      active: 'success',
      planning: 'warning',
      completed: 'neutral',
      on_hold: 'neutral'
    };

    const labels = {
      active: 'Activo',
      planning: 'Planificación',
      completed: 'Completado',
      on_hold: 'En Pausa'
    };

    return <Badge variant={variants[status] || 'neutral'}>{labels[status] || status}</Badge>;
  };

  const getPriorityBadge = (priority) => {
    const variants = {
      high: 'danger',
      urgent: 'danger',
      medium: 'warning',
      low: 'success'
    };

    const labels = {
      high: 'Alta',
      urgent: 'Urgente',
      medium: 'Media',
      low: 'Baja'
    };

    return <Badge variant={variants[priority] || 'neutral'}>{labels[priority] || priority}</Badge>;
  };

  const formatDate = (date) => {
    if (!date) return 'N/A';
    try {
      const d = new Date(date);
      if (isNaN(d.getTime())) return 'N/A';
      return d.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return 'N/A';
    }
  };

  const formatDateForInput = (date) => {
    if (!date) return '';
    try {
      const d = new Date(date);
      if (isNaN(d.getTime())) return '';
      return d.toISOString().split('T')[0];
    } catch {
      return '';
    }
  };

  const calculateDaysRemaining = (endDate) => {
    if (!endDate) return null;
    try {
      const end = new Date(endDate);
      const now = new Date();
      const diffTime = end - now;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays;
    } catch {
      return null;
    }
  };

  if (!project) return null;

  return (
    <>
      <ProjectDialog
        open={open}
        onClose={onClose}
        title={safeProject.nombre}
      >
        {/* Header */}
        <ProjectDialogHeader onClose={onClose}>
          {/* Header Top Row */}
          <div className="pd-header-top">
            <div className="pd-header-info">
              <Eye className="pd-header-icon" />
              <div>
                {isEditing ? (
                  <input
                    type="text"
                    value={editData.nombre}
                    onChange={(e) => setEditData(prev => ({ ...prev, nombre: e.target.value }))}
                    className="pd-header-title-edit"
                    placeholder="Nombre del proyecto..."
                  />
                ) : (
                  <h2 id="dialog-title" className="pd-header-title">
                    {safeProject.nombre}
                  </h2>
                )}
                <p className="pd-header-subtitle">
                  {safeProject.client?.nombre || 'Sin cliente'}
                </p>
              </div>
            </div>

            <div className="pd-header-actions">
              {!isEditing ? (
                <>
                  <Button
                    variant="outline"
                    icon={Edit2}
                    onClick={handleEditToggle}
                    size="sm"
                  >
                    Editar
                  </Button>
                  <Button
                    variant="danger"
                    icon={Trash2}
                    onClick={() => setShowDeleteConfirm(true)}
                    size="sm"
                  >
                    Eliminar
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="ghost"
                    onClick={handleEditToggle}
                    size="sm"
                  >
                    Cancelar
                  </Button>
                  <Button
                    variant="primary"
                    icon={Save}
                    onClick={handleSave}
                    loading={saving}
                    size="sm"
                  >
                    Guardar
                  </Button>
                </>
              )}
            </div>
          </div>

          {/* Tabs */}
          <div className="pd-tabs">
            <button
              className={`pd-tab-button ${activeTab === 'overview' ? 'pd-tab-button--active' : ''}`}
              onClick={() => setActiveTab('overview')}
            >
              <Eye className="pd-tab-icon" />
              Overview
            </button>
            <button
              className={`pd-tab-button ${activeTab === 'activity' ? 'pd-tab-button--active' : ''}`}
              onClick={() => setActiveTab('activity')}
            >
              <Activity className="pd-tab-icon" />
              Actividad
            </button>
          </div>
        </ProjectDialogHeader>

        {/* Content */}
        <ProjectDialogContent>
          {activeTab === 'overview' && (
            <div
              className="pd-overview pd-overview--redesigned"
              style={{
                '--client-color': clientColors.base,
                '--client-color-dark': clientColors.dark,
                '--client-color-light': clientColors.light,
                '--client-color-lighter': clientColors.lighter,
                '--client-color-darker': clientColors.darker
              }}
            >

              {/* 📝 INFORMACIÓN BÁSICA */}
              <div
                className="pd-section pd-section--basic pd-section--client-themed"
                style={{
                  borderColor: clientColors.light,
                  background: `linear-gradient(135deg, ${clientColors.lighter} 0%, var(--pd-surface-2) 100%)`
                }}
              >
                <div className="pd-section-header">
                  <div className="pd-section-header-content">
                    <div
                      className="pd-section-icon-wrapper"
                      style={{
                        backgroundColor: `${clientColors.base}20`,
                        borderColor: clientColors.light
                      }}
                    >
                      <Edit2
                        className="pd-section-header-icon"
                        style={{ color: clientColors.base }}
                      />
                    </div>
                    <div>
                      <h3 className="pd-section-title">Información Básica</h3>
                      <p className="pd-section-subtitle">Detalles principales del proyecto</p>
                    </div>
                  </div>
                </div>

                <div className="pd-section-content">
                  {/* Description */}
                  <div className="pd-field-group pd-field-group--full">
                    <label className="pd-field-label">
                      <Edit2 className="pd-field-icon" />
                      Descripción del proyecto
                    </label>
                    {isEditing ? (
                      <textarea
                        value={editData.descripcion}
                        onChange={(e) => setEditData(prev => ({ ...prev, descripcion: e.target.value }))}
                        className="pd-textarea pd-textarea--enhanced"
                        rows="4"
                        placeholder="Describe los objetivos y alcance del proyecto..."
                      />
                    ) : (
                      <div className="pd-field-value pd-field-value--description">
                        {safeProject.descripcion ? (
                          <p>{safeProject.descripcion}</p>
                        ) : (
                          <p className="pd-text-muted">Sin descripción</p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* 🎯 ESTADO Y PROGRESO */}
              <div
                className="pd-section pd-section--status pd-section--client-themed"
                style={{
                  borderColor: clientColors.light,
                  background: `linear-gradient(135deg, ${clientColors.lighter} 0%, var(--pd-surface-2) 100%)`
                }}
              >
                <div className="pd-section-header">
                  <div className="pd-section-header-content">
                    <div
                      className="pd-section-icon-wrapper pd-section-icon-wrapper--status"
                      style={{
                        backgroundColor: `${clientColors.base}20`,
                        borderColor: clientColors.light
                      }}
                    >
                      <Target
                        className="pd-section-header-icon"
                        style={{ color: clientColors.base }}
                      />
                    </div>
                    <div>
                      <h3 className="pd-section-title">Estado y Progreso</h3>
                      <p className="pd-section-subtitle">Estado actual y avance del proyecto</p>
                    </div>
                  </div>
                </div>

                <div className="pd-section-content">
                  <div className="pd-status-grid">
                    {/* Status */}
                    <div
                      className="pd-status-card pd-status-card--client-themed"
                      style={{
                        borderColor: clientColors.light,
                        background: `linear-gradient(135deg, ${clientColors.lighter} 0%, var(--pd-surface) 100%)`
                      }}
                    >
                      <div className="pd-status-card-header">
                        <Target
                          className="pd-status-card-icon"
                          style={{ color: clientColors.base }}
                        />
                        <span className="pd-status-card-title">Estado</span>
                      </div>
                      {isEditing ? (
                        <select
                          value={editData.status}
                          onChange={(e) => setEditData(prev => ({ ...prev, status: e.target.value }))}
                          className="pd-select pd-select--status"
                        >
                          <option value="planning">🔵 Planificación</option>
                          <option value="active">🟢 Activo</option>
                          <option value="completed">✅ Completado</option>
                          <option value="on_hold">🟡 En Pausa</option>
                          <option value="cancelled">🔴 Cancelado</option>
                        </select>
                      ) : (
                        <div className="pd-status-card-content">
                          {getStatusBadge(safeProject.status)}
                        </div>
                      )}
                    </div>

                    {/* Priority */}
                    <div
                      className="pd-status-card pd-status-card--client-themed"
                      style={{
                        borderColor: clientColors.light,
                        background: `linear-gradient(135deg, ${clientColors.lighter} 0%, var(--pd-surface) 100%)`
                      }}
                    >
                      <div className="pd-status-card-header">
                        <AlertTriangle
                          className="pd-status-card-icon"
                          style={{ color: clientColors.base }}
                        />
                        <span className="pd-status-card-title">Prioridad</span>
                      </div>
                      {isEditing ? (
                        <select
                          value={editData.priority}
                          onChange={(e) => setEditData(prev => ({ ...prev, priority: e.target.value }))}
                          className="pd-select pd-select--priority"
                        >
                          <option value="low">🟢 Baja</option>
                          <option value="medium">🟡 Media</option>
                          <option value="high">🟠 Alta</option>
                          <option value="critical">🔴 Crítica</option>
                        </select>
                      ) : (
                        <div className="pd-status-card-content">
                          {getPriorityBadge(safeProject.priority)}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Progress - Full Width */}
                  <div
                    className="pd-progress-section pd-progress-section--client-themed"
                    style={{
                      borderColor: clientColors.light,
                      background: `linear-gradient(135deg, ${clientColors.lighter} 0%, var(--pd-surface) 100%)`
                    }}
                  >
                    <div className="pd-progress-header">
                      <label className="pd-field-label pd-field-label--progress">
                        <Activity
                          className="pd-field-icon"
                          style={{ color: clientColors.base }}
                        />
                        Progreso del proyecto
                      </label>
                      <div
                        className="pd-progress-percentage"
                        style={{ color: clientColors.base }}
                      >
                        {(safeProject.progress || editData.progress || 0)}%
                      </div>
                    </div>
                    {isEditing ? (
                      <div className="pd-progress-edit-container">
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={editData.progress || 0}
                          onChange={(e) => setEditData(prev => ({ ...prev, progress: parseInt(e.target.value) }))}
                          className="pd-range-slider pd-range-slider--enhanced"
                        />
                        <div className="pd-progress-markers">
                          <span>0%</span>
                          <span>25%</span>
                          <span>50%</span>
                          <span>75%</span>
                          <span>100%</span>
                        </div>
                      </div>
                    ) : (
                      <div className="pd-progress-display">
                        <ProgressSlider
                          value={safeProject.progress || 0}
                          onChange={(value) => handleInlineUpdate('progress', value)}
                          disabled={false}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* 👥 ASIGNACIONES */}
              <div
                className="pd-section pd-section--assignments pd-section--client-themed"
                style={{
                  borderColor: clientColors.light,
                  background: `linear-gradient(135deg, ${clientColors.lighter} 0%, var(--pd-surface-2) 100%)`
                }}
              >
                <div className="pd-section-header">
                  <div className="pd-section-header-content">
                    <div
                      className="pd-section-icon-wrapper pd-section-icon-wrapper--assignments"
                      style={{
                        backgroundColor: `${clientColors.base}20`,
                        borderColor: clientColors.light
                      }}
                    >
                      <Users
                        className="pd-section-header-icon"
                        style={{ color: clientColors.base }}
                      />
                    </div>
                    <div>
                      <h3 className="pd-section-title">Asignaciones</h3>
                      <p className="pd-section-subtitle">Cliente, equipo y configuración del proyecto</p>
                    </div>
                  </div>
                </div>

                <div className="pd-section-content">
                  <div className="pd-assignments-grid">
                    {/* Client */}
                    <div
                      className="pd-assignment-card pd-assignment-card--client-themed"
                      style={{
                        borderColor: clientColors.light,
                        background: `linear-gradient(135deg, ${clientColors.lighter} 0%, var(--pd-surface) 100%)`
                      }}
                    >
                      <div className="pd-assignment-card-header">
                        <User
                          className="pd-assignment-card-icon"
                          style={{ color: clientColors.base }}
                        />
                        <span className="pd-assignment-card-title">Cliente</span>
                      </div>
                      {isEditing ? (
                        <div className="pd-client-edit-enhanced">
                          <select
                            value={editData.cliente_id || ''}
                            onChange={(e) => {
                              const selectedClient = availableClients.find(c => c.id === parseInt(e.target.value));
                              setEditData(prev => ({
                                ...prev,
                                cliente_id: e.target.value ? parseInt(e.target.value) : null,
                                client_color: selectedClient?.color || '#3B82F6'
                              }));
                            }}
                            className="pd-select pd-select--client"
                            disabled={loadingData}
                          >
                            <option value="">Seleccionar cliente...</option>
                            {availableClients.map(client => (
                              <option key={client.id} value={client.id}>
                                {client.nombre}
                              </option>
                            ))}
                          </select>
                          <div className="pd-color-section">
                            <label className="pd-color-label">Color del cliente</label>
                            <div className="pd-color-picker-enhanced">
                              <input
                                type="color"
                                value={editData.client_color}
                                onChange={(e) => setEditData(prev => ({ ...prev, client_color: e.target.value }))}
                                className="pd-color-input"
                                title="Seleccionar color del cliente"
                              />
                              <div
                                className="pd-color-preview-enhanced"
                                style={{ backgroundColor: editData.client_color }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="pd-assignment-card-content">
                          {safeProject.client ? (
                            <div className="pd-client-display-enhanced">
                              {safeProject.client?.color && (
                                <div
                                  className="pd-client-color-badge"
                                  style={{ backgroundColor: safeProject.client?.color }}
                                ></div>
                              )}
                              <span className="pd-client-name">{safeProject.client?.nombre}</span>
                            </div>
                          ) : (
                            <span className="pd-text-muted">Sin cliente asignado</span>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Current Phase */}
                    <div
                      className="pd-assignment-card pd-assignment-card--client-themed"
                      style={{
                        borderColor: clientColors.light,
                        background: `linear-gradient(135deg, ${clientColors.lighter} 0%, var(--pd-surface) 100%)`
                      }}
                    >
                      <div className="pd-assignment-card-header">
                        <Settings
                          className="pd-assignment-card-icon"
                          style={{ color: clientColors.base }}
                        />
                        <span className="pd-assignment-card-title">Fase Actual</span>
                      </div>
                      {isEditing ? (
                        <select
                          value={editData.current_phase_id || ''}
                          onChange={(e) => setEditData(prev => ({
                            ...prev,
                            current_phase_id: e.target.value ? parseInt(e.target.value) : null
                          }))}
                          className="pd-select pd-select--phase"
                          disabled={loadingData}
                        >
                          <option value="">Seleccionar fase...</option>
                          {availablePhases.map(phase => (
                            <option key={phase.id} value={phase.id}>
                              {phase.nombre}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <div className="pd-assignment-card-content">
                          <Badge variant="neutral">
                            {safeProject.current_phase?.name || 'Sin fase'}
                          </Badge>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* 📅 FECHAS Y CRONOGRAMA */}
              <div
                className="pd-section pd-section--timeline pd-section--client-themed"
                style={{
                  borderColor: clientColors.light,
                  background: `linear-gradient(135deg, ${clientColors.lighter} 0%, var(--pd-surface-2) 100%)`
                }}
              >
                <div className="pd-section-header">
                  <div className="pd-section-header-content">
                    <div
                      className="pd-section-icon-wrapper pd-section-icon-wrapper--timeline"
                      style={{
                        backgroundColor: `${clientColors.base}20`,
                        borderColor: clientColors.light
                      }}
                    >
                      <Calendar
                        className="pd-section-header-icon"
                        style={{ color: clientColors.base }}
                      />
                    </div>
                    <div>
                      <h3 className="pd-section-title">Cronograma</h3>
                      <p className="pd-section-subtitle">Fechas de inicio y finalización del proyecto</p>
                    </div>
                  </div>
                </div>

                <div className="pd-section-content">
                  <div className="pd-timeline-grid">
                    {/* Start Date */}
                    <div
                      className="pd-timeline-card pd-timeline-card--client-themed"
                      style={{
                        borderColor: clientColors.light,
                        background: `linear-gradient(135deg, ${clientColors.lighter} 0%, var(--pd-surface) 100%)`
                      }}
                    >
                      <div className="pd-timeline-card-header">
                        <Calendar
                          className="pd-timeline-card-icon pd-timeline-card-icon--start"
                          style={{ color: clientColors.base }}
                        />
                        <span className="pd-timeline-card-title">Fecha de Inicio</span>
                      </div>
                      {isEditing ? (
                        <input
                          type="date"
                          value={formatDateForInput(editData.start_date)}
                          onChange={(e) => setEditData(prev => ({ ...prev, start_date: e.target.value }))}
                          className="pd-input pd-input--date"
                        />
                      ) : (
                        <div className="pd-timeline-card-content">
                          <div className="pd-date-info">
                            <span className="pd-date-display">
                              {formatDate(safeProject.start_date)}
                            </span>
                            {safeProject.start_date && (
                              <span className="pd-date-badge pd-date-badge--start">
                                <Calendar className="pd-date-badge-icon" />
                                Inicio
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* End Date */}
                    <div
                      className="pd-timeline-card pd-timeline-card--client-themed"
                      style={{
                        borderColor: clientColors.light,
                        background: `linear-gradient(135deg, ${clientColors.lighter} 0%, var(--pd-surface) 100%)`
                      }}
                    >
                      <div className="pd-timeline-card-header">
                        <Clock
                          className="pd-timeline-card-icon pd-timeline-card-icon--end"
                          style={{ color: clientColors.base }}
                        />
                        <span className="pd-timeline-card-title">Fecha de Finalización</span>
                      </div>
                      {isEditing ? (
                        <input
                          type="date"
                          value={formatDateForInput(editData.end_date)}
                          onChange={(e) => setEditData(prev => ({ ...prev, end_date: e.target.value }))}
                          className="pd-input pd-input--date"
                        />
                      ) : (
                        <div className="pd-timeline-card-content">
                          <div className="pd-date-info">
                            <span className="pd-date-display">
                              {formatDate(safeProject.end_date)}
                            </span>
                            {safeProject.end_date && (
                              <div className="pd-date-details">
                                <span className="pd-date-badge pd-date-badge--end">
                                  <Clock className="pd-date-badge-icon" />
                                  Final
                                </span>
                                {(() => {
                                  const daysRemaining = calculateDaysRemaining(safeProject.end_date);
                                  if (daysRemaining !== null) {
                                    return (
                                      <span className={`pd-days-remaining ${
                                        daysRemaining < 0 ? 'pd-days-remaining--overdue' :
                                        daysRemaining <= 7 ? 'pd-days-remaining--urgent' :
                                        daysRemaining <= 30 ? 'pd-days-remaining--warning' :
                                        'pd-days-remaining--normal'
                                      }`}>
                                        {daysRemaining < 0 ?
                                          `${Math.abs(daysRemaining)} días atrasado` :
                                          daysRemaining === 0 ? 'Vence hoy' :
                                          `${daysRemaining} días restantes`
                                        }
                                      </span>
                                    );
                                  }
                                  return null;
                                })()}
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* 👥 EQUIPO DEL PROYECTO */}
              <div
                className="pd-section pd-section--team pd-section--client-themed"
                style={{
                  borderColor: clientColors.light,
                  background: `linear-gradient(135deg, ${clientColors.lighter} 0%, var(--pd-surface-2) 100%)`
                }}
              >
                <div className="pd-section-header">
                  <div className="pd-section-header-content">
                    <div
                      className="pd-section-icon-wrapper pd-section-icon-wrapper--team"
                      style={{
                        backgroundColor: `${clientColors.base}20`,
                        borderColor: clientColors.light
                      }}
                    >
                      <Users
                        className="pd-section-header-icon"
                        style={{ color: clientColors.base }}
                      />
                    </div>
                    <div>
                      <h3 className="pd-section-title">Equipo del Proyecto</h3>
                      <p className="pd-section-subtitle">Miembros asignados y distribución por áreas</p>
                    </div>
                  </div>
                </div>

                <div className="pd-section-content">
                  <div className="pd-team-enhanced">
                    {/* Team Controls */}
                    <div className="pd-team-controls">
                      <div
                        className="pd-team-overview pd-team-overview--client-themed"
                        style={{
                          borderColor: clientColors.light,
                          background: `linear-gradient(135deg, ${clientColors.lighter} 0%, var(--pd-surface) 100%)`
                        }}
                      >
                        <div className="pd-team-total">
                          <Users
                            className="pd-team-total-icon"
                            style={{ color: clientColors.base }}
                          />
                          <span
                            className="pd-team-total-number"
                            style={{ color: clientColors.base }}
                          >
                            {safeProject.members ? safeProject.members.length : 0}
                          </span>
                          <span className="pd-team-total-label">
                            {safeProject.members && safeProject.members.length === 1 ? 'miembro' : 'miembros'}
                          </span>
                        </div>
                        {isEditing && (
                          <button
                            onClick={() => {
                              loadAvailableUsers();
                              setShowTeamManager(true);
                            }}
                            className="pd-add-member-btn"
                          >
                            <UserPlus className="pd-icon" />
                            Agregar miembro
                          </button>
                        )}
                      </div>

                      {safeProject.members && safeProject.members.length > 0 && (
                        <div className="pd-team-stats-enhanced">
                          <div
                            className="pd-team-stat-card pd-team-stat-card--operations pd-team-stat-card--client-themed"
                            style={{
                              borderColor: clientColors.light,
                              background: `linear-gradient(135deg, ${clientColors.lighter} 0%, var(--pd-surface) 100%)`
                            }}
                          >
                            <div className="pd-team-stat-header">
                              <div className="pd-team-stat-icon">👥</div>
                              <span className="pd-team-stat-label">Operaciones</span>
                            </div>
                            <div className="pd-team-stat-content">
                              <span className="pd-team-stat-number">
                                {safeProject.members.filter(m => m.team_type === 'operations').length}
                              </span>
                              <div className="pd-team-stat-bar">
                                <div
                                  className="pd-team-stat-fill pd-team-stat-fill--operations"
                                  style={{
                                    width: `${(safeProject.members.filter(m => m.team_type === 'operations').length / safeProject.members.length) * 100}%`
                                  }}
                                />
                              </div>
                            </div>
                          </div>
                          <div
                            className="pd-team-stat-card pd-team-stat-card--it pd-team-stat-card--client-themed"
                            style={{
                              borderColor: clientColors.light,
                              background: `linear-gradient(135deg, ${clientColors.lighter} 0%, var(--pd-surface) 100%)`
                            }}
                          >
                            <div className="pd-team-stat-header">
                              <div className="pd-team-stat-icon">💻</div>
                              <span className="pd-team-stat-label">Tecnología</span>
                            </div>
                            <div className="pd-team-stat-content">
                              <span className="pd-team-stat-number">
                                {safeProject.members.filter(m => m.team_type === 'it').length}
                              </span>
                              <div className="pd-team-stat-bar">
                                <div
                                  className="pd-team-stat-fill pd-team-stat-fill--it"
                                  style={{
                                    width: `${(safeProject.members.filter(m => m.team_type === 'it').length / safeProject.members.length) * 100}%`
                                  }}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {safeProject.members && safeProject.members.length > 0 ? (
                      <div className="pd-team-members-enhanced">
                        {safeProject.members.map((member, index) => (
                          <div key={member.id || index} className="pd-team-member-enhanced">
                            <div className="pd-member-avatar-enhanced">
                              {((member.user && member.user.name) ? member.user.name : 'U').charAt(0).toUpperCase()}
                            </div>
                            <div className="pd-member-info-enhanced">
                              <span className="pd-member-name-enhanced">
                                {(member.user && member.user.name) ? member.user.name : `Usuario ${member.user_id || 'Desconocido'}`}
                              </span>
                              <div className="pd-member-details">
                                <span className={`pd-member-role-enhanced pd-member-role-enhanced--${member.team_type}`}>
                                  {member.team_type === 'operations' ? 'Operaciones' : 'Tecnología'}
                                </span>
                                {member.user && member.user.email && (
                                  <span className="pd-member-email">
                                    <Mail className="pd-member-email-icon" />
                                    {member.user.email}
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className="pd-member-actions">
                              {isEditing && (
                                <button
                                  onClick={() => handleRemoveMember(member.id)}
                                  className="pd-remove-member-btn"
                                  title="Remover del equipo"
                                >
                                  <Minus className="pd-icon" />
                                </button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="pd-team-empty">
                        <div className="pd-team-empty-icon">👥</div>
                        <p className="pd-team-empty-text">Sin equipo asignado</p>
                        <p className="pd-team-empty-subtitle">
                          {isEditing ?
                            'Haz clic en "Agregar miembro" para comenzar a formar el equipo' :
                            'Los miembros del equipo aparecerán aquí una vez asignados'
                          }
                        </p>
                        {isEditing && (
                          <button
                            onClick={() => {
                              loadAvailableUsers();
                              setShowTeamManager(true);
                            }}
                            className="pd-team-empty-btn"
                          >
                            <UserPlus className="pd-icon" />
                            Agregar primer miembro
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'activity' && (
            <div className="pd-activity">
              <div className="pd-activity-empty">
                <Activity className="pd-activity-empty-icon" />
                <h3 className="pd-activity-empty-title">Historial de Actividad</h3>
                <p className="pd-activity-empty-description">
                  El historial de cambios y actividades del proyecto aparecerá aquí.
                  Esta funcionalidad estará disponible próximamente.
                </p>
              </div>
            </div>
          )}
        </ProjectDialogContent>
      </ProjectDialog>

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        open={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDelete}
        title="Eliminar Proyecto"
        message={`¿Estás seguro de que deseas eliminar el proyecto "${safeProject.nombre}"? Esta acción no se puede deshacer.`}
        confirmText="Eliminar"
        variant="danger"
      />

      {/* Team Manager Dialog */}
      <TeamManager
        open={showTeamManager}
        onClose={() => {
          setShowTeamManager(false);
          setSearchTerm('');
        }}
        availableUsers={availableUsers}
        currentMembers={safeProject.members || []}
        onAddMember={(userId, teamType) => {
          handleAddMember(userId, teamType);
          setShowTeamManager(false);
          setSearchTerm('');
        }}
        loading={loadingUsers}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
      />
    </>
  );
};

export default ProjectDialogWorking;