// 📋 MANAGE PHASES DIALOG - VERSIÓN SIMPLIFICADA CON MATERIAL-UI
// ==============================================================

import React, { useState, useEffect, useCallback } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Card,
  CardContent,
  Typography,
  Box,
  IconButton,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  DragIndicator as DragIcon
} from '@mui/icons-material';

// 🎯 COMPONENTE PRINCIPAL
const ManagePhasesDialogSimple = ({
  isOpen,
  onClose,
  projectId,
  projectName = 'Proyecto',
  onPhasesUpdated
}) => {
  const [phases, setPhases] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingPhase, setEditingPhase] = useState(null);
  const [newPhase, setNewPhase] = useState({ name: '', isAdding: false });
  const [currentPhaseId, setCurrentPhaseId] = useState(null);

  // 🔄 Cargar fases del proyecto
  const loadPhases = useCallback(async () => {
    if (!projectId) return;

    setLoading(true);
    try {
      // Fases por defecto para cualquier proyecto
      const defaultPhases = [
        { id: 'phase-1', name: 'Planificación', position: 0 },
        { id: 'phase-2', name: 'Desarrollo', position: 1 },
        { id: 'phase-3', name: 'Testing', position: 2 },
        { id: 'phase-4', name: 'Despliegue', position: 3 },
        { id: 'phase-5', name: 'Completado', position: 4 }
      ];
      
      setPhases(defaultPhases);
      setCurrentPhaseId(defaultPhases[1].id); // Desarrollo como fase actual

    } catch (error) {
      console.error('Error loading phases:', error);
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  // Cargar fases al abrir el modal
  useEffect(() => {
    if (isOpen && projectId) {
      loadPhases();
    }
  }, [isOpen, projectId, loadPhases]);

  // ➕ Agregar nueva fase
  const handleAddPhase = async () => {
    if (!newPhase.name.trim()) {
      alert('❌ El nombre de la fase es obligatorio');
      return;
    }

    if (phases.some(phase => phase.name.toLowerCase() === newPhase.name.trim().toLowerCase())) {
      alert('❌ Ya existe una fase con ese nombre');
      return;
    }

    setSaving(true);
    try {
      const newPhaseData = {
        id: Date.now(), // ID temporal
        name: newPhase.name.trim(),
        position: phases.length
      };

      setPhases(prev => [...prev, newPhaseData]);
      setNewPhase({ name: '', isAdding: false });

      alert('✅ Fase agregada exitosamente');
    } catch (error) {
      console.error('Error adding phase:', error);
      alert('❌ Error al agregar la fase');
    } finally {
      setSaving(false);
    }
  };

  // ✏️ Actualizar fase
  const handleUpdatePhase = async (phaseId, newName) => {
    if (!newName.trim()) {
      alert('❌ El nombre de la fase es obligatorio');
      return;
    }

    setSaving(true);
    try {
      setPhases(prev => 
        prev.map(phase => 
          phase.id === phaseId 
            ? { ...phase, name: newName.trim() }
            : phase
        )
      );
      setEditingPhase(null);

      alert('✅ Fase actualizada exitosamente');
    } catch (error) {
      console.error('Error updating phase:', error);
      alert('❌ Error al actualizar la fase');
    } finally {
      setSaving(false);
    }
  };

  // 🗑️ Eliminar fase
  const handleDeletePhase = async (phaseId) => {
    const phase = phases.find(p => p.id === phaseId);
    if (!phase) return;

    if (phases.length === 1) {
      alert('❌ No se puede eliminar la única fase del proyecto');
      return;
    }

    if (currentPhaseId === phaseId) {
      alert('❌ No se puede eliminar la fase actual');
      return;
    }

    if (window.confirm(`¿Estás seguro de que deseas eliminar la fase "${phase.name}"?`)) {
      setSaving(true);
      try {
        setPhases(prev => prev.filter(p => p.id !== phaseId));

        alert('✅ Fase eliminada exitosamente');
      } catch (error) {
        console.error('Error deleting phase:', error);
        alert('❌ Error al eliminar la fase');
      } finally {
        setSaving(false);
      }
    }
  };

  // 🎯 Componente de fase individual
  const PhaseItem = ({ phase, index }) => {
    const isEditing = editingPhase === phase.id;
    const isCurrent = currentPhaseId === phase.id;
    const [editName, setEditName] = useState(phase.name);

    return (
      <ListItem
        sx={{
          border: 1,
          borderColor: isCurrent ? 'primary.main' : 'divider',
          borderRadius: 2,
          mb: 1,
          bgcolor: isCurrent ? 'primary.50' : 'background.paper'
        }}
      >
        <DragIcon sx={{ mr: 1, color: 'text.secondary' }} />
        
        <ListItemText
          primary={
            isEditing ? (
              <TextField
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                size="small"
                fullWidth
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleUpdatePhase(phase.id, editName);
                  } else if (e.key === 'Escape') {
                    setEditingPhase(null);
                    setEditName(phase.name);
                  }
                }}
                autoFocus
              />
            ) : (
              <Box display="flex" alignItems="center" gap={1}>
                <Typography variant="body1" fontWeight={isCurrent ? 600 : 400}>
                  {index + 1}. {phase.name}
                </Typography>
                {isCurrent && (
                  <Chip 
                    label="Actual" 
                    color="primary" 
                    size="small"
                    sx={{ fontSize: '0.75rem' }}
                  />
                )}
              </Box>
            )
          }
        />
        
        <ListItemSecondaryAction>
          <Box display="flex" gap={0.5}>
            {isEditing ? (
              <>
                <IconButton
                  size="small"
                  onClick={() => handleUpdatePhase(phase.id, editName)}
                  disabled={saving}
                >
                  <SaveIcon fontSize="small" />
                </IconButton>
                <IconButton
                  size="small"
                  onClick={() => {
                    setEditingPhase(null);
                    setEditName(phase.name);
                  }}
                  disabled={saving}
                >
                  <CancelIcon fontSize="small" />
                </IconButton>
              </>
            ) : (
              <>
                <IconButton
                  size="small"
                  onClick={() => setEditingPhase(phase.id)}
                  disabled={saving}
                >
                  <EditIcon fontSize="small" />
                </IconButton>
                <IconButton
                  size="small"
                  onClick={() => handleDeletePhase(phase.id)}
                  disabled={saving || phases.length === 1 || currentPhaseId === phase.id}
                  color="error"
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </>
            )}
          </Box>
        </ListItemSecondaryAction>
      </ListItem>
    );
  };

  return (
    <Dialog 
      open={isOpen} 
      onClose={onClose} 
      maxWidth="md" 
      fullWidth
      PaperProps={{
        sx: { minHeight: '500px' }
      }}
    >
      <DialogTitle>
        <Typography variant="h6" component="div">
          📋 Gestionar Fases - {projectName}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Administra las fases del proyecto. Puedes agregar, editar o eliminar fases.
        </Typography>
      </DialogTitle>

      <DialogContent>
        {loading ? (
          <Box display="flex" justifyContent="center" py={4}>
            <Typography>Cargando fases...</Typography>
          </Box>
        ) : (
          <>
            {/* Lista de fases existentes */}
            <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>
              Fases del Proyecto ({phases.length})
            </Typography>
            
            <List>
              {phases.map((phase, index) => (
                <PhaseItem key={phase.id} phase={phase} index={index} />
              ))}
            </List>

            {/* Agregar nueva fase */}
            <Card sx={{ mt: 3, border: '2px dashed', borderColor: 'divider' }}>
              <CardContent>
                {newPhase.isAdding ? (
                  <Box display="flex" gap={1} alignItems="center">
                    <TextField
                      placeholder="Nombre de la nueva fase..."
                      value={newPhase.name}
                      onChange={(e) => setNewPhase(prev => ({ ...prev, name: e.target.value }))}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleAddPhase();
                        } else if (e.key === 'Escape') {
                          setNewPhase({ name: '', isAdding: false });
                        }
                      }}
                      size="small"
                      fullWidth
                      autoFocus
                      disabled={saving}
                    />
                    <IconButton
                      onClick={handleAddPhase}
                      disabled={saving || !newPhase.name.trim()}
                      color="primary"
                    >
                      <SaveIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => setNewPhase({ name: '', isAdding: false })}
                      disabled={saving}
                    >
                      <CancelIcon />
                    </IconButton>
                  </Box>
                ) : (
                  <Button
                    variant="outlined"
                    startIcon={<AddIcon />}
                    onClick={() => setNewPhase(prev => ({ ...prev, isAdding: true }))}
                    disabled={saving}
                    fullWidth
                    sx={{ 
                      borderStyle: 'dashed',
                      color: 'text.secondary',
                      '&:hover': {
                        color: 'primary.main',
                        borderColor: 'primary.main'
                      }
                    }}
                  >
                    Agregar Nueva Fase
                  </Button>
                )}
              </CardContent>
            </Card>
          </>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} variant="outlined">
          Cerrar
        </Button>
        <Button 
          onClick={() => {
            if (onPhasesUpdated) {
              onPhasesUpdated();
            }
            onClose();
          }}
          variant="contained"
        >
          Guardar Cambios
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ManagePhasesDialogSimple;
