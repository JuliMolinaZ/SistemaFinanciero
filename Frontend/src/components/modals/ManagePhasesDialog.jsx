// 📋 MANAGE PHASES DIALOG - GESTIÓN COMPLETA DE FASES POR PROYECTO
// =================================================================

import React, { useState, useEffect, useCallback } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  Button,
  Input,
  Card,
  Badge,
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  toast
} from '../ui/components';
import {
  GripVertical,
  Plus,
  Edit2,
  Trash2,
  Save,
  X,
  AlertTriangle,
  Check
} from 'lucide-react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const ManagePhasesDialog = ({
  isOpen,
  onClose,
  projectId,
  projectName,
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
      const response = await fetch(`/api/projects/${projectId}/phases`);
      const data = await response.json();

      if (data.success) {
        setPhases(data.data.phases || []);
        setCurrentPhaseId(data.data.current_phase?.id || null);
      } else {
        toast.error('Error al cargar las fases');
      }
    } catch (error) {
      console.error('Error loading phases:', error);
      toast.error('Error al cargar las fases');
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

  // 🔀 Manejar reordenamiento con drag & drop
  const handleDragEnd = useCallback((result) => {
    if (!result.destination) return;

    const items = Array.from(phases);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // Actualizar posiciones
    const updatedPhases = items.map((phase, index) => ({
      ...phase,
      position: index
    }));

    setPhases(updatedPhases);
  }, [phases]);

  // ➕ Agregar nueva fase
  const handleAddPhase = async () => {
    if (!newPhase.name.trim()) {
      toast.error('El nombre de la fase es obligatorio');
      return;
    }

    if (newPhase.name.length < 2) {
      toast.error('El nombre debe tener al menos 2 caracteres');
      return;
    }

    if (newPhase.name.length > 100) {
      toast.error('El nombre no puede exceder 100 caracteres');
      return;
    }

    // Verificar duplicados
    if (phases.some(phase => phase.name.toLowerCase() === newPhase.name.trim().toLowerCase())) {
      toast.error('Ya existe una fase con ese nombre');
      return;
    }

    setSaving(true);
    try {
      const response = await fetch(`/api/projects/${projectId}/phases`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newPhase.name.trim() })
      });

      const data = await response.json();

      if (data.success) {
        setPhases(prev => [...prev, data.data]);
        setNewPhase({ name: '', isAdding: false });
        toast.success('Fase creada exitosamente');
      } else {
        toast.error(data.message || 'Error al crear la fase');
      }
    } catch (error) {
      console.error('Error adding phase:', error);
      toast.error('Error al crear la fase');
    } finally {
      setSaving(false);
    }
  };

  // ✏️ Actualizar fase (renombrar)
  const handleUpdatePhase = async (phaseId, newName) => {
    if (!newName.trim()) {
      toast.error('El nombre de la fase es obligatorio');
      return;
    }

    if (newName.length < 2) {
      toast.error('El nombre debe tener al menos 2 caracteres');
      return;
    }

    if (newName.length > 100) {
      toast.error('El nombre no puede exceder 100 caracteres');
      return;
    }

    // Verificar duplicados (excluyendo la fase actual)
    if (phases.some(phase =>
      phase.id !== phaseId &&
      phase.name.toLowerCase() === newName.trim().toLowerCase()
    )) {
      toast.error('Ya existe una fase con ese nombre');
      return;
    }

    setSaving(true);
    try {
      const response = await fetch(`/api/projects/${projectId}/phases/${phaseId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newName.trim() })
      });

      const data = await response.json();

      if (data.success) {
        setPhases(prev => prev.map(phase =>
          phase.id === phaseId
            ? { ...phase, name: newName.trim() }
            : phase
        ));
        setEditingPhase(null);
        toast.success('Fase actualizada exitosamente');
      } else {
        toast.error(data.message || 'Error al actualizar la fase');
      }
    } catch (error) {
      console.error('Error updating phase:', error);
      toast.error('Error al actualizar la fase');
    } finally {
      setSaving(false);
    }
  };

  // 🗑️ Eliminar fase
  const handleDeletePhase = async (phaseId) => {
    setSaving(true);
    try {
      const response = await fetch(`/api/projects/${projectId}/phases/${phaseId}`, {
        method: 'DELETE'
      });

      const data = await response.json();

      if (data.success) {
        setPhases(prev => prev.filter(phase => phase.id !== phaseId));
        toast.success('Fase eliminada exitosamente');
      } else {
        toast.error(data.message || 'Error al eliminar la fase');
      }
    } catch (error) {
      console.error('Error deleting phase:', error);
      toast.error('Error al eliminar la fase');
    } finally {
      setSaving(false);
    }
  };

  // 💾 Guardar reordenamiento
  const handleSaveOrder = async () => {
    if (phases.every((phase, index) => phase.position === index)) {
      toast.info('No hay cambios en el orden');
      return;
    }

    setSaving(true);
    try {
      const reorderData = phases.map((phase, index) => ({
        phaseId: phase.id,
        position: index
      }));

      const response = await fetch(`/api/projects/${projectId}/phases/reorder`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phases: reorderData })
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Orden guardado exitosamente');
        if (onPhasesUpdated) {
          onPhasesUpdated();
        }
      } else {
        toast.error(data.message || 'Error al guardar el orden');
      }
    } catch (error) {
      console.error('Error saving order:', error);
      toast.error('Error al guardar el orden');
    } finally {
      setSaving(false);
    }
  };

  // 🎨 Componente de fase individual
  const PhaseItem = ({ phase, index }) => {
    const [editName, setEditName] = useState(phase.name);
    const isEditing = editingPhase === phase.id;
    const isCurrent = currentPhaseId === phase.id;
    const isOnlyPhase = phases.length === 1;

    return (
      <Draggable draggableId={phase.id} index={index}>
        {(provided, snapshot) => (
          <Card
            ref={provided.innerRef}
            {...provided.draggableProps}
            className={`
              p-4 mb-3 transition-all duration-200
              ${snapshot.isDragging ? 'shadow-lg ring-2 ring-[--primary]' : ''}
              ${isCurrent ? 'ring-1 ring-[--success] bg-[--surface-2]' : 'bg-[--surface-1]'}
              hover:bg-[--surface-2]
            `}
          >
            <div className="flex items-center gap-3">
              {/* Drag Handle */}
              <div
                {...provided.dragHandleProps}
                className="text-[--text-tertiary] hover:text-[--text-secondary] cursor-grab active:cursor-grabbing"
              >
                <GripVertical className="w-4 h-4" />
              </div>

              {/* Posición */}
              <div className="w-8 h-8 rounded-full bg-[--surface-3] flex items-center justify-center text-sm font-semibold text-[--text-secondary]">
                {index + 1}
              </div>

              {/* Nombre de la fase */}
              <div className="flex-1">
                {isEditing ? (
                  <div className="flex items-center gap-2">
                    <Input
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleUpdatePhase(phase.id, editName);
                        } else if (e.key === 'Escape') {
                          setEditName(phase.name);
                          setEditingPhase(null);
                        }
                      }}
                      className="text-sm"
                      autoFocus
                      disabled={saving}
                      maxLength={100}
                    />
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleUpdatePhase(phase.id, editName)}
                      disabled={saving || !editName.trim()}
                    >
                      <Check className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        setEditName(phase.name);
                        setEditingPhase(null);
                      }}
                      disabled={saving}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-[--text-primary]">
                      {phase.name}
                    </span>
                    {isCurrent && (
                      <Badge variant="success" className="text-xs">
                        Actual
                      </Badge>
                    )}
                  </div>
                )}
              </div>

              {/* Acciones */}
              {!isEditing && (
                <div className="flex items-center gap-1">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      setEditingPhase(phase.id);
                      setEditName(phase.name);
                    }}
                    disabled={saving}
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        size="sm"
                        variant="ghost"
                        disabled={saving || isCurrent || isOnlyPhase}
                        className={isCurrent || isOnlyPhase ? 'opacity-50 cursor-not-allowed' : ''}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle className="flex items-center gap-2">
                          <AlertTriangle className="w-5 h-5 text-[--danger]" />
                          Confirmar eliminación
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          ¿Estás seguro de que quieres eliminar la fase "<strong>{phase.name}</strong>"?
                          Esta acción no se puede deshacer.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDeletePhase(phase.id)}
                          className="bg-[--danger] hover:bg-[--danger-hover]"
                        >
                          Eliminar
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              )}
            </div>

            {/* Información adicional para fase actual */}
            {isCurrent && !isEditing && (
              <div className="mt-2 pt-2 border-t border-[--border-subtle]">
                <p className="text-xs text-[--text-tertiary]">
                  {isCurrent && isOnlyPhase
                    ? 'Esta es la única fase y no puede eliminarse'
                    : 'Esta es la fase actual del proyecto'
                  }
                </p>
              </div>
            )}
          </Card>
        )}
      </Draggable>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-[--text-primary]">
            Gestionar Fases - {projectName}
          </DialogTitle>
          <p className="text-sm text-[--text-secondary]">
            Arrastra las fases para reordenarlas, edita los nombres o añade nuevas fases.
          </p>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto py-4">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[--primary]"></div>
            </div>
          ) : (
            <>
              {/* Lista de fases */}
              <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="phases">
                  {(provided) => (
                    <div {...provided.droppableProps} ref={provided.innerRef}>
                      {phases.map((phase, index) => (
                        <PhaseItem
                          key={phase.id}
                          phase={phase}
                          index={index}
                        />
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>

              {/* Agregar nueva fase */}
              <Card className="p-4 mt-4 border-2 border-dashed border-[--border]">
                {newPhase.isAdding ? (
                  <div className="flex items-center gap-2">
                    <Input
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
                      autoFocus
                      disabled={saving}
                      maxLength={100}
                    />
                    <Button
                      size="sm"
                      onClick={handleAddPhase}
                      disabled={saving || !newPhase.name.trim()}
                    >
                      <Check className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setNewPhase({ name: '', isAdding: false })}
                      disabled={saving}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ) : (
                  <Button
                    variant="ghost"
                    className="w-full text-[--text-secondary] hover:text-[--text-primary]"
                    onClick={() => setNewPhase(prev => ({ ...prev, isAdding: true }))}
                    disabled={saving}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Añadir nueva fase
                  </Button>
                )}
              </Card>
            </>
          )}
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={saving}
          >
            Cerrar
          </Button>
          <Button
            onClick={handleSaveOrder}
            disabled={saving || loading || phases.every((phase, index) => phase.position === index)}
            className="bg-[--primary] hover:bg-[--primary-hover]"
          >
            {saving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Guardando...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Guardar Cambios
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ManagePhasesDialog;