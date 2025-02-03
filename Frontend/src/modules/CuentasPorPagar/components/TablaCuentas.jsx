// src/modules/CuentasPorPagar/components/TablaCuentas.jsx
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faDollarSign, faPlus } from '@fortawesome/free-solid-svg-icons';

const TablaCuentas = ({
  cuentas,
  proveedores,
  formatoMoneda,
  handleAbrirPagoModal,
  handleTogglePagado,
  handleEdit,
  handleDelete
}) => {
  return (
    <div className="table-responsive">
      <table className="cuentas-table">
        <thead>
          <tr>
            <th>Concepto</th>
            <th>Monto Neto</th>
            <th>Monto con IVA</th>
            <th>Pagos Parciales</th>
            <th>Restante</th>
            <th>Categoría</th>
            <th>Proveedor</th>
            <th>Fecha</th>
            <th>Pagado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {cuentas.map((c) => {
            const pagosParciales = parseFloat(c.pagos_parciales || 0);
            const totalConIVA = parseFloat(c.monto_con_iva || 0);
            const restante = totalConIVA - pagosParciales;
            return (
              <tr key={c.id} className={c.pagado ? 'pagada' : 'pendiente'}>
                <td data-label="Concepto">{c.concepto}</td>
                <td data-label="Monto Neto">{formatoMoneda(c.monto_neto)}</td>
                <td data-label="Monto con IVA">{formatoMoneda(c.monto_con_iva)}</td>
                <td data-label="Pagos Parciales">{formatoMoneda(pagosParciales)}</td>
                <td data-label="Restante">{formatoMoneda(restante)}</td>
                <td data-label="Categoría">{c.categoria}</td>
                <td data-label="Proveedor">
                  {proveedores.find((p) => p.id === c.proveedor_id)?.nombre || 'N/A'}
                </td>
                <td data-label="Fecha">{new Date(c.fecha).toLocaleDateString()}</td>
                <td data-label="Pagado">{c.pagado ? 'Sí' : 'No'}</td>
                <td data-label="Acciones" className="actions">
                  <button onClick={() => handleAbrirPagoModal(c)} className="icon-button add-payment-button">
                    <FontAwesomeIcon icon={faPlus} />
                  </button>
                  <button onClick={() => handleTogglePagado(c.id)} className="icon-button pay-button">
                    <FontAwesomeIcon icon={faDollarSign} />
                  </button>
                  <button onClick={() => handleEdit(c.id)} className="icon-button edit-button">
                    <FontAwesomeIcon icon={faEdit} />
                  </button>
                  <button onClick={() => handleDelete(c.id)} className="icon-button delete-button">
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default React.memo(TablaCuentas);
