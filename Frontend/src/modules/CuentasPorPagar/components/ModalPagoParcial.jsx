// src/modules/CuentasPorPagar/components/ModalPagoParcial.jsx
import React from 'react';

const ModalPagoParcial = ({
  selectedCuenta,
  pagoMonto,
  setPagoMonto,
  errorPago,
  handleGuardarPagoParcial,
  handleCerrarPagoModal,
  formatoMoneda
}) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>Ingresar Pago Parcial</h3>
        <div className="modal-details">
          <p>
            <span className="detail-label">Concepto:</span>
            <span className="detail-value">{selectedCuenta.concepto}</span>
          </p>
          <p>
            <span className="detail-label">Total con IVA:</span>
            <span className="detail-value">{formatoMoneda(selectedCuenta.monto_con_iva)}</span>
          </p>
          <p>
            <span className="detail-label">Pagos Parciales:</span>
            <span className="detail-value">{formatoMoneda(selectedCuenta.pagos_parciales || 0)}</span>
          </p>
          <p>
            <span className="detail-label">Restante:</span>
            <span className="detail-value">
              {formatoMoneda(
                parseFloat(selectedCuenta.monto_con_iva || 0) -
                parseFloat(selectedCuenta.pagos_parciales || 0)
              )}
            </span>
          </p>
        </div>
        <div className="modal-field">
          <label htmlFor="pagoMonto">Monto del Pago:</label>
          <input
            type="number"
            id="pagoMonto"
            value={pagoMonto}
            onChange={(e) => {
              const value = e.target.value;
              setPagoMonto(value);
            }}
          />
          {errorPago && <p className="error-message">{errorPago}</p>}
        </div>
        <div className="modal-actions">
          <button
            onClick={handleGuardarPagoParcial}
            className="submit-button"
            disabled={!pagoMonto || isNaN(pagoMonto) || parseFloat(pagoMonto) <= 0}
          >
            Guardar Pago
          </button>
          <button onClick={handleCerrarPagoModal} className="cancel-button">
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

export default React.memo(ModalPagoParcial);
