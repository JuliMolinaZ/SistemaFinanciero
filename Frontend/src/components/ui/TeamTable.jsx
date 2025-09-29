import React, { useState, useMemo } from 'react';
import { Search, UserPlus, X, Mail, User } from 'lucide-react';

const TeamTable = ({
  users = [],
  selectedUsers = [],
  onUserToggle,
  maxHeight = '320px'
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const filteredUsers = useMemo(() => {
    if (!searchQuery.trim()) return users;
    const query = searchQuery.toLowerCase();
    return users.filter(user =>
      user.nombre?.toLowerCase().includes(query) ||
      user.email?.toLowerCase().includes(query) ||
      user.apellido?.toLowerCase().includes(query)
    );
  }, [users, searchQuery]);

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedUsers = filteredUsers.slice(startIndex, startIndex + itemsPerPage);

  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, itemsPerPage]);

  const isSelected = (userId) => selectedUsers.some(u => u.id === userId);

  const handleSelectAll = () => {
    const allSelected = paginatedUsers.every(u => isSelected(u.id));
    paginatedUsers.forEach(user => {
      if (allSelected !== isSelected(user.id)) {
        onUserToggle(user);
      }
    });
  };

  return (
    <div className="team-table">
      <div className="team-table__header">
        <div className="team-table__search">
          <Search size={16} />
          <input
            type="text"
            placeholder="Buscar por nombre o email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="team-table__search-input"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="team-table__search-clear" type="button">
              <X size={14} />
            </button>
          )}
        </div>
        <div className="team-table__controls">
          <select
            value={itemsPerPage}
            onChange={(e) => setItemsPerPage(Number(e.target.value))}
            className="team-table__per-page"
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
          <span className="team-table__count">{filteredUsers.length} usuarios</span>
        </div>
      </div>

      <div className="team-table__container" style={{ maxHeight }}>
        {filteredUsers.length === 0 ? (
          <div className="team-table__empty">
            <User size={24} />
            <span>No se encontraron usuarios</span>
          </div>
        ) : (
          <table className="team-table__table">
            <thead>
              <tr>
                <th className="team-table__header-cell team-table__header-cell--checkbox">
                  <input
                    type="checkbox"
                    checked={paginatedUsers.length > 0 && paginatedUsers.every(u => isSelected(u.id))}
                    onChange={handleSelectAll}
                    className="team-table__checkbox"
                  />
                </th>
                <th className="team-table__header-cell">Usuario</th>
                <th className="team-table__header-cell">Email</th>
                <th className="team-table__header-cell">Rol</th>
              </tr>
            </thead>
            <tbody>
              {paginatedUsers.map((user) => (
                <tr key={user.id} className="team-table__row">
                  <td className="team-table__cell team-table__cell--checkbox">
                    <input
                      type="checkbox"
                      checked={isSelected(user.id)}
                      onChange={() => onUserToggle(user)}
                      className="team-table__checkbox"
                    />
                  </td>
                  <td className="team-table__cell">
                    <div className="team-table__user">
                      <div className="team-table__avatar">
                        {(user.nombre || user.email || '?')[0].toUpperCase()}
                      </div>
                      <div className="team-table__user-info">
                        <div className="team-table__name">
                          {user.nombre} {user.apellido}
                        </div>
                        <div className="team-table__username">
                          @{user.nombre?.toLowerCase() || user.email?.split('@')[0]}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="team-table__cell">
                    <div className="team-table__email">
                      <Mail size={14} />
                      <span>{user.email || 'Sin email'}</span>
                    </div>
                  </td>
                  <td className="team-table__cell">
                    <span className={`team-table__role team-table__role--${user.rol || 'user'}`}>
                      {user.rol || 'Usuario'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {totalPages > 1 && (
        <div className="team-table__pagination">
          <div className="team-table__pagination-info">
            Página {currentPage} de {totalPages} • {filteredUsers.length} resultados
          </div>
          <div className="team-table__pagination-controls">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="team-table__page-btn"
              type="button"
            >
              Anterior
            </button>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="team-table__page-btn"
              type="button"
            >
              Siguiente
            </button>
          </div>
        </div>
      )}

      {selectedUsers.length > 0 && (
        <div className="team-table__selected">
          <div className="team-table__selected-header">
            <UserPlus size={16} />
            <span>{selectedUsers.length} seleccionado{selectedUsers.length !== 1 ? 's' : ''}</span>
          </div>
          <div className="team-table__selected-list">
            {selectedUsers.map((user) => (
              <div key={user.id} className="team-table__selected-item">
                <span>{user.nombre} {user.apellido}</span>
                <button
                  onClick={() => onUserToggle(user)}
                  className="team-table__remove-btn"
                  type="button"
                  aria-label={`Remover ${user.nombre}`}
                >
                  <X size={12} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamTable;