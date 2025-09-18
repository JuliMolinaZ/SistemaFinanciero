import React from 'react';
import './UnifiedSystemDemo.css';

/**
 * 🎯 COMPONENTE DE DEMOSTRACIÓN DEL SISTEMA UNIFICADO
 * 
 * Este componente demuestra el uso correcto de:
 * - Tokens de diseño unificados
 * - Contenedores sin gradientes
 * - Inputs con contraste AA
 * - Tabs con jerarquía clara
 * - Badges soft consistentes
 * - Botones con un solo acento
 */
const UnifiedSystemDemo = () => {
  const [activeTab, setActiveTab] = React.useState('overview');
  const [formData, setFormData] = React.useState({
    projectName: '',
    status: 'planificacion',
    priority: 'media'
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const priorities = [
    { value: 'baja', label: 'Baja', color: 'success' },
    { value: 'media', label: 'Media', color: 'warning' },
    { value: 'alta', label: 'Alta', color: 'danger' },
    { value: 'critica', label: 'Crítica', color: 'critical' }
  ];

  const statuses = [
    { value: 'planificacion', label: 'Planificación' },
    { value: 'activo', label: 'Activo' },
    { value: 'completado', label: 'Completado' }
  ];

  return (
    <div className="unified-demo">
      {/* ✅ CONTENEDOR MODAL/SHEET */}
      <div className="modal-wrapper">
        {/* ✅ HEADER CON TABS */}
        <header className="modal-header">
          <h2 className="text-base-semibold">Proyecto de Ejemplo</h2>
          <div className="modal-tablist">
            <nav className="tabs-nav">
              <button 
                className={activeTab === 'overview' ? 'tab-active' : 'tab-inactive'}
                onClick={() => setActiveTab('overview')}
              >
                Overview
              </button>
              <button 
                className={activeTab === 'details' ? 'tab-active' : 'tab-inactive'}
                onClick={() => setActiveTab('details')}
              >
                Detalles
              </button>
              <button 
                className={activeTab === 'team' ? 'tab-active' : 'tab-inactive'}
                onClick={() => setActiveTab('team')}
              >
                Equipo
              </button>
            </nav>
          </div>
        </header>

        {/* ✅ CONTENIDO CON SECCIONES */}
        <div className="modal-content">
          {activeTab === 'overview' && (
            <>
              {/* ✅ SECCIÓN CON HEADER E ICONO */}
              <section className="section-container">
                <header className="section-header">
                  <svg className="section-icon" viewBox="0 0 16 16" fill="currentColor">
                    <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zM5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293 5.354 4.646z"/>
                  </svg>
                  <h3 className="section-title">Información General</h3>
                </header>

                {/* ✅ INPUTS UNIFICADOS */}
                <div className="form-grid">
                  <div className="form-field">
                    <label className="form-label">Nombre del Proyecto</label>
                    <input
                      type="text"
                      name="projectName"
                      value={formData.projectName}
                      onChange={handleInputChange}
                      placeholder="Ingresa el nombre del proyecto..."
                      className="input-base"
                    />
                  </div>

                  <div className="form-field">
                    <label className="form-label">Estado</label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      className="input-base"
                    >
                      {statuses.map(status => (
                        <option key={status.value} value={status.value}>
                          {status.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-field">
                    <label className="form-label">Prioridad</label>
                    <select
                      name="priority"
                      value={formData.priority}
                      onChange={handleInputChange}
                      className="input-base priority-select"
                    >
                      {priorities.map(priority => (
                        <option key={priority.value} value={priority.value}>
                          {priority.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </section>

              <div className="divider"></div>

              {/* ✅ SECCIÓN DE BADGES */}
              <section className="section-container">
                <header className="section-header">
                  <svg className="section-icon" viewBox="0 0 16 16" fill="currentColor">
                    <path d="M2 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v13.5a.5.5 0 0 1-.777.416L8 13.101l-5.223 2.815A.5.5 0 0 1 2 15.5V2zm2-1a1 1 0 0 0-1 1v12.566l4.723-2.482a.5.5 0 0 1 .554 0L13 14.566V2a1 1 0 0 0-1-1H4z"/>
                  </svg>
                  <h3 className="section-title">Estados y Prioridades</h3>
                </header>

                <div className="badges-demo">
                  <div className="badge-group">
                    <span className="text-sm-secondary">Estados:</span>
                    <span className="badge-soft">Planificación</span>
                    <span className="badge-soft">Activo</span>
                    <span className="badge-soft">Completado</span>
                  </div>

                  <div className="badge-group">
                    <span className="text-sm-secondary">Prioridades:</span>
                    <span className="badge-soft">
                      <span className="priority-dot priority-low"></span>
                      Baja
                    </span>
                    <span className="badge-soft">
                      <span className="priority-dot priority-medium"></span>
                      Media
                    </span>
                    <span className="badge-soft">
                      <span className="priority-dot priority-high"></span>
                      Alta
                    </span>
                    <span className="badge-soft">
                      <span className="priority-dot priority-critical"></span>
                      Crítica
                    </span>
                  </div>
                </div>
              </section>
            </>
          )}

          {activeTab === 'details' && (
            <section className="section-container">
              <header className="section-header">
                <svg className="section-icon" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M14 1a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H4.414A2 2 0 0 0 3 11.586l-2 2V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12.793a.5.5 0 0 0 .854.353l2.853-2.853A1 1 0 0 1 4.414 12H14a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"/>
                </svg>
                <h3 className="section-title">Descripción del Proyecto</h3>
              </header>

              <div className="form-field">
                <label className="form-label">Descripción</label>
                <textarea
                  className="input-base"
                  rows="6"
                  placeholder="Describe el proyecto..."
                  style={{ minHeight: '120px', resize: 'vertical' }}
                />
              </div>

              <div className="form-field">
                <label className="form-label">Progreso</label>
                <div className="progress-container">
                  <div className="progress-track">
                    <div className="progress-fill" style={{ width: '65%' }}></div>
                  </div>
                  <span className="tabular-nums text-sm-secondary">65%</span>
                </div>
              </div>
            </section>
          )}

          {activeTab === 'team' && (
            <section className="section-container">
              <header className="section-header">
                <svg className="section-icon" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M7 14s-1 0-1-1 1-4 5-4 5 3 5 4-1 1-1 1H7zm4-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"/>
                  <path fillRule="evenodd" d="M5.216 14A2.238 2.238 0 0 1 5 13c0-1.355.68-2.75 1.936-3.72A6.325 6.325 0 0 0 5 9c-4 0-5 3-5 4s1 1 1 1h4.216z"/>
                  <path d="M4.5 8a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z"/>
                </svg>
                <h3 className="section-title">Miembros del Equipo</h3>
              </header>

              <p className="text-sm-secondary">Información del equipo aparecerá aquí.</p>
            </section>
          )}
        </div>

        {/* ✅ FOOTER CON BOTONES */}
        <footer className="modal-footer">
          <button className="btn-outline">
            Cancelar
          </button>
          <button className="btn-outline">
            Editar
          </button>
          <button className="btn-primary">
            Guardar
          </button>
        </footer>
      </div>
    </div>
  );
};

export default UnifiedSystemDemo;
