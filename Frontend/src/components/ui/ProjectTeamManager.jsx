import React, { useState, useMemo } from 'react';
import { Search, UserPlus, X, Mail, User, Plus, Trash2 } from 'lucide-react';

const ProjectTeamManager = ({
  users = [],
  selectedUsers = [],
  onUserToggle,
  maxHeight = '300px'
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddSelector, setShowAddSelector] = useState(false);

  // Debug: ver estructura de usuarios
  // console.log('ProjectTeamManager - selectedUsers:', selectedUsers);
  // console.log('ProjectTeamManager - users:', users);

  // Filtrar usuarios que NO están en el proyecto y que tienen perfil completo
  const availableUsers = useMemo(() => {
    const notInProject = users.filter(user => {
      // Excluir usuarios que ya están en el proyecto
      const isInProject = selectedUsers.some(selected => 
        selected.user_id === user.id || selected.id === user.id
      );
      
      // Excluir usuarios invitados sin perfil completo
      const hasCompleteProfile = user.name && user.name.trim() !== '' && 
                                 user.email && user.email.trim() !== '';
      
      return !isInProject && hasCompleteProfile;
    });
    
    if (!searchQuery.trim()) return notInProject;
    
    const query = searchQuery.toLowerCase();
    return notInProject.filter(user =>
      user.name?.toLowerCase().includes(query) ||
      user.email?.toLowerCase().includes(query) ||
      user.lastname?.toLowerCase().includes(query)
    );
  }, [users, selectedUsers, searchQuery]);

  const handleAddUser = (user) => {
    onUserToggle(user);
    setSearchQuery('');
    setShowAddSelector(false);
  };

  const handleRemoveUser = (user) => {
    onUserToggle(user);
  };

  return (
    <div className="project-team-manager">
      {/* Sección de miembros actuales */}
      <div className="project-team-current">
        <div className="project-team-header">
          <h4 className="project-team-title">
            <User size={18} />
            Miembros del Proyecto ({selectedUsers.length})
          </h4>
          <button
            type="button"
            onClick={() => setShowAddSelector(!showAddSelector)}
            className="project-team-add-btn"
          >
            <Plus size={16} />
            Agregar Miembro
          </button>
        </div>

        {selectedUsers.length === 0 ? (
          <div className="project-team-empty">
            <User size={24} />
            <span>No hay miembros asignados al proyecto</span>
          </div>
        ) : (
          <div className="project-team-members">
            {selectedUsers.map((user) => (
              <div key={user.id} className="project-team-member">
                <div className="project-team-member-info">
                  <div className="project-team-avatar">
                    {user.user?.name ? user.user.name[0].toUpperCase() : 
                     user.user?.email ? user.user.email[0].toUpperCase() : 
                     user.name ? user.name[0].toUpperCase() :
                     user.email ? user.email[0].toUpperCase() : 'U'}
                  </div>
                  <div className="project-team-details">
                    <div className="project-team-name">
                      {user.user?.name || user.name || 'Sin nombre'} {user.user?.lastname || user.lastname || ''}
                    </div>
                    <div className="project-team-email">
                      <Mail size={12} />
                      {user.user?.email || user.email || 'Sin email'}
                    </div>
                  </div>
                </div>
                <div className="project-team-actions">
                  <span className="project-team-role">
                    {user.rol || 'Usuario'}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemoveUser(user)}
                    className="project-team-remove-btn"
                    title="Remover del proyecto"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal para agregar miembros */}
      {showAddSelector && (
        <div className="project-team-modal-overlay" onClick={() => setShowAddSelector(false)}>
          <div className="project-team-modal" onClick={(e) => e.stopPropagation()}>
            <div className="project-team-modal-header">
              <h5 className="project-team-modal-title">
                <UserPlus size={18} />
                Agregar Miembros al Proyecto
              </h5>
              <button
                type="button"
                onClick={() => setShowAddSelector(false)}
                className="project-team-modal-close"
              >
                <X size={18} />
              </button>
            </div>

            <div className="project-team-modal-search">
              <Search size={16} />
              <input
                type="text"
                placeholder="Buscar usuarios por nombre o email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="project-team-modal-search-input"
                autoFocus
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="project-team-modal-search-clear"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            <div className="project-team-modal-content">
              {availableUsers.length === 0 ? (
                <div className="project-team-modal-empty">
                  <User size={32} />
                  <h4>No hay usuarios disponibles</h4>
                  <p>
                    {searchQuery 
                      ? 'No se encontraron usuarios con ese criterio de búsqueda' 
                      : 'No hay usuarios disponibles para agregar al proyecto'
                    }
                  </p>
                </div>
              ) : (
                <div className="project-team-modal-list">
                  {availableUsers.map((user) => (
                    <div key={user.id} className="project-team-modal-item">
                      <div className="project-team-modal-user-info">
                        <div className="project-team-modal-avatar">
                          {user.name ? user.name[0].toUpperCase() :
                           user.email ? user.email[0].toUpperCase() : 'U'}
                        </div>
                        <div className="project-team-modal-details">
                        <div className="project-team-modal-name">
                          {user.name} {user.lastname || ''}
                        </div>
                          <div className="project-team-modal-email">
                            <Mail size={12} />
                            {user.email || 'Sin email'}
                          </div>
                        </div>
                      </div>
                      <div className="project-team-modal-actions">
                        <span className="project-team-modal-role">
                          {user.role || user.rol || 'Usuario'}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleAddUser(user)}
                          className="project-team-modal-add-btn"
                        >
                          <Plus size={14} />
                          Agregar
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="project-team-modal-footer">
              <button
                type="button"
                onClick={() => setShowAddSelector(false)}
                className="project-team-modal-cancel-btn"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectTeamManager;
