import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './CuentasPagarForm.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faDollarSign } from '@fortawesome/free-solid-svg-icons';

const CuentasPagarForm = () => {
  const [cuentas, setCuentas] = useState([]);
  const [proveedores, setProveedores] = useState([]);
  const [cuenta, setCuenta] = useState({
    concepto: '',
    monto_neto: '',
    monto_con_iva: '',
    requiere_iva: false,
    categoria: '',
    proveedor_id: '',
    fecha: '',
    pagado: false,
  });
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [totalPagadas, setTotalPagadas] = useState(0);
  const [totalPorPagar, setTotalPorPagar] = useState(0);

  const [filtroMes, setFiltroMes] = useState('');
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [cuentasFiltradas, setCuentasFiltradas] = useState([]);

  useEffect(() => {
    fetchCuentas();
    fetchProveedores();
  }, []);

  useEffect(() => {
    filtrarCuentas();
  }, [filtroMes, fechaInicio, fechaFin, cuentas]);

  useEffect(() => {
    calcularTotales(cuentasFiltradas);
  }, [cuentasFiltradas]);

  const fetchCuentas = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/cuentas-pagar');
      setCuentas(response.data);
    } catch (error) {
      console.error('Error al obtener cuentas por pagar:', error);
    }
  };

  const fetchProveedores = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/proveedores');
      setProveedores(response.data);
    } catch (error) {
      console.error('Error al obtener proveedores:', error);
    }
  };

  const toggleForm = () => {
    setShowForm(!showForm);
    if (showForm) resetForm();
  };

  const resetForm = () => {
    setIsEditing(false);
    setEditingId(null);
    setCuenta({
      concepto: '',
      monto_neto: '',
      monto_con_iva: '',
      requiere_iva: false,
      categoria: '',
      proveedor_id: '',
      fecha: '',
      pagado: false,
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCuenta((prev) => ({
      ...prev,
      [name]: value,
      ...(name === 'monto_neto' && prev.requiere_iva && {
        monto_con_iva: (parseFloat(value) * 1.16).toFixed(2),
      }),
    }));
  };

  const handleCheckboxChange = (e) => {
    const { checked } = e.target;
    setCuenta((prev) => ({
      ...prev,
      requiere_iva: checked,
      monto_con_iva: checked ? (parseFloat(prev.monto_neto || 0) * 1.16).toFixed(2) : prev.monto_neto,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const cuentaAEnviar = { ...cuenta };
    if (cuentaAEnviar.categoria !== 'proveedor') cuentaAEnviar.proveedor_id = null;

    try {
      if (isEditing) {
        await axios.put(`http://localhost:5000/api/cuentas-pagar/${editingId}`, cuentaAEnviar);
      } else {
        await axios.post('http://localhost:5000/api/cuentas-pagar', cuentaAEnviar);
      }
      fetchCuentas();
      toggleForm();
    } catch (error) {
      console.error('Error al registrar cuenta por pagar:', error);
    }
  };

  const handleEdit = (id) => {
    const cuentaToEdit = cuentas.find((c) => c.id === id);
    setCuenta(cuentaToEdit);
    setIsEditing(true);
    setEditingId(id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar esta cuenta por pagar?')) return;

    try {
      await axios.delete(`http://localhost:5000/api/cuentas-pagar/${id}`);
      fetchCuentas();
    } catch (error) {
      console.error('Error al eliminar cuenta por pagar:', error);
    }
  };

  const handleTogglePagado = async (id) => {
    try {
      await axios.put(`http://localhost:5000/api/cuentas-pagar/${id}/pagado`);
      fetchCuentas();
    } catch (error) {
      console.error('Error al alternar el estado de pagado:', error);
    }
  };

  const calcularTotales = (cuentas) => {
    const totalPagadas = cuentas
      .filter((c) => c.pagado)
      .reduce((acc, curr) => acc + parseFloat(curr.monto_con_iva || 0), 0);
    const totalPorPagar = cuentas
      .filter((c) => !c.pagado)
      .reduce((acc, curr) => acc + parseFloat(curr.monto_con_iva || 0), 0);

    setTotalPagadas(totalPagadas);
    setTotalPorPagar(totalPorPagar);
  };

  const filtrarCuentas = () => {
    let filtradas = cuentas;

    if (filtroMes) {
      filtradas = filtradas.filter(
        (c) => new Date(c.fecha).getMonth() + 1 === parseInt(filtroMes, 10)
      );
    }

    if (fechaInicio && fechaFin) {
      const inicio = new Date(fechaInicio);
      const fin = new Date(fechaFin);
      filtradas = filtradas.filter((c) => {
        const fechaCuenta = new Date(c.fecha);
        return fechaCuenta >= inicio && fechaCuenta <= fin;
      });
    }

    setCuentasFiltradas(filtradas);
  };

  const formatoMoneda = (valor) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
    }).format(valor);
  };

  return (
    <section className="cuentas-pagar-module">
      <h2>Cuentas por Pagar</h2>
      <button onClick={toggleForm} className="toggle-form-button">
        {showForm ? 'Cerrar formulario' : 'Registrar Cuenta'}
      </button>

      {showForm && (
        <form onSubmit={handleSubmit} className="cuentas-form">
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

          <div className="field-group inline">
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

            <div className="checkbox-group">
              <input
                type="checkbox"
                checked={cuenta.requiere_iva}
                onChange={handleCheckboxChange}
              />
              <label>¿Requiere IVA?</label>
            </div>
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
            </select>
          </div>

          {cuenta.categoria === 'proveedor' && (
            <div className="field-group">
              <label htmlFor="proveedor_id">Seleccionar Proveedor:</label>
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

          <button type="submit" className="submit-button">
            {isEditing ? 'Actualizar Cuenta' : 'Registrar Cuenta'}
          </button>
        </form>
      )}

      {/* Filtros */}
      <div className="totales-y-filtros">
        <div className="filtro-mes">
          <label htmlFor="filtroMes">Filtrar por Mes:</label>
          <select
            id="filtroMes"
            value={filtroMes}
            onChange={(e) => setFiltroMes(e.target.value)}
          >
            <option value="">Todos los meses</option>
            {Array.from({ length: 12 }, (_, i) => (
              <option key={i + 1} value={i + 1}>
                {new Date(0, i).toLocaleString('default', { month: 'long' })}
              </option>
            ))}
          </select>
        </div>
        <div className="filtro-rango">
          <label>Desde:</label>
          <input
            type="date"
            value={fechaInicio}
            onChange={(e) => setFechaInicio(e.target.value)}
          />
          <label>Hasta:</label>
          <input
            type="date"
            value={fechaFin}
            onChange={(e) => setFechaFin(e.target.value)}
          />
        </div>
        <div className="total-semana">
          <span>Cuentas Pagadas:</span>
          <span>{formatoMoneda(totalPagadas)}</span>
        </div>
        <div className="total-semana">
          <span>Cuentas por Pagar:</span>
          <span>{formatoMoneda(totalPorPagar)}</span>
        </div>
      </div>

      <h3>Cuentas por Pagar Registradas</h3>
      <table className="cuentas-table">
        <thead>
          <tr>
            <th>Concepto</th>
            <th>Monto Neto</th>
            <th>Monto con IVA</th>
            <th>Categoría</th>
            <th>Proveedor</th>
            <th>Fecha</th>
            <th>Pagado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {cuentasFiltradas.map((c) => (
            <tr key={c.id} className={c.pagado ? 'pagada' : 'pendiente'}>
              <td>{c.concepto}</td>
              <td>{formatoMoneda(c.monto_neto)}</td>
              <td>{formatoMoneda(c.monto_con_iva)}</td>
              <td>{c.categoria}</td>
              <td>{proveedores.find((p) => p.id === c.proveedor_id)?.nombre || 'N/A'}</td>
              <td>{new Date(c.fecha).toLocaleDateString()}</td>
              <td>{c.pagado ? 'Sí' : 'No'}</td>
              <td className="actions">
                <button onClick={() => handleEdit(c.id)} className="icon-button edit-button">
                  <FontAwesomeIcon icon={faEdit} />
                </button>
                <button onClick={() => handleDelete(c.id)} className="icon-button delete-button">
                  <FontAwesomeIcon icon={faTrash} />
                </button>
                <button onClick={() => handleTogglePagado(c.id)} className="icon-button pay-button">
                  <FontAwesomeIcon icon={faDollarSign} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
};

export default CuentasPagarForm;


