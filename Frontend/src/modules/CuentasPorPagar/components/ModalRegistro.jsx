// src/modules/CuentasPorPagar/components/ModalRegistro.jsx
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

const ModalRegistro = ({
  isEditing,
  cuenta,
  handleChange,
  handleCheckboxChange,
  handleSubmit,
  toggleFormModal,
  proveedores,
  categorias
}) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content form-modal">
        <button onClick={toggleFormModal} className="close-modal-button">
          <FontAwesomeIcon icon={faTimes} />
        </button>
        <h3 className="modal-title">{isEditing ? 'Actualizar Cuenta' : 'Registrar Cuenta'}</h3>
        <form onSubmit={handleSubmit} className="cuentas-form">
          <div className="form-grid">
            <div className="field-group">
              <label htmlFor="concepto">Concepto:</label>
              <input
                type="text"
                id="concepto"
                name="concepto"
                value={cuenta.concepto}
                onChange={handleChange}
                required
              />
            </div>
            <div className="field-group">
              <label htmlFor="monto_neto">Monto Neto:</label>
              <input
                type="number"
                id="monto_neto"
                name="monto_neto"
                value={cuenta.monto_neto}
                onChange={handleChange}
                required
              />
            </div>
            <div className="field-group inline">
              <label>¿Requiere IVA?</label>
              <input
                type="checkbox"
                checked={cuenta.requiere_iva}
                onChange={handleCheckboxChange}
              />
            </div>
            <div className="field-group">
              <label htmlFor="monto_con_iva">Monto con IVA:</label>
              <input
                type="number"
                id="monto_con_iva"
                name="monto_con_iva"
                value={cuenta.monto_con_iva}
                readOnly
              />
            </div>
            <div className="field-group">
              <label htmlFor="categoria">Categoría:</label>
              <select
                id="categoria"
                name="categoria"
                value={cuenta.categoria}
                onChange={handleChange}
                required
              >
                <option value="">Seleccione...</option>
                <option value="proveedor">Pago a Proveedor</option>
                <option value="otro">Otro</option>
                {categorias.map((categoria) => (
                  <option key={categoria.id} value={categoria.nombre}>
                    {categoria.nombre}
                  </option>
                ))}
              </select>
            </div>
            {cuenta.categoria === 'proveedor' && (
              <div className="field-group">
                <label htmlFor="proveedor_id">Proveedor:</label>
                <select
                  id="proveedor_id"
                  name="proveedor_id"
                  value={cuenta.proveedor_id}
                  onChange={handleChange}
                >
                  <option value="">Seleccione un proveedor</option>
                  {proveedores.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.nombre}
                    </option>
                  ))}
                </select>
              </div>
            )}
            <div className="field-group">
              <label htmlFor="fecha">Fecha:</label>
              <input
                type="date"
                id="fecha"
                name="fecha"
                value={cuenta.fecha}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div className="form-actions">
            <button type="submit" className="submit-button">
              {isEditing ? 'Actualizar Cuenta' : 'Registrar Cuenta'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default React.memo(ModalRegistro);
