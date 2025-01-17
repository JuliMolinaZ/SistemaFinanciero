/* File: CuentasPagarForm.js */
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
    categoria: '',
    proveedor_id: '',
    fecha: '',
    pagado: false,
  });
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [filterByMonth, setFilterByMonth] = useState('');
  const [totalSemana, setTotalSemana] = useState(0);
  const [totalMes, setTotalMes] = useState(0);
  
  // Estados para filtrado semanal
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [cuentasFiltradas, setCuentasFiltradas] = useState([]);

  useEffect(() => {
    fetchCuentas();
    fetchProveedores();
  }, []);

  useEffect(() => {
    calculateTotals();
  }, [cuentas, filterByMonth]);

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
    if (showForm) {
      setIsEditing(false);
      setEditingId(null);
      setCuenta({
        concepto: '',
        monto_neto: '',
        monto_con_iva: '',
        categoria: '',
        proveedor_id: '',
        fecha: '',
        pagado: false,
      });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCuenta(prev => ({
      ...prev,
      [name]: value,
      ...(name === 'monto_neto' && {
        monto_con_iva: (parseFloat(value) * 1.16).toFixed(2)  // Cálculo automático del IVA
      })
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Establecer proveedor_id en null si la categoría no es 'proveedor'
    let cuentaAEnviar = { ...cuenta };
    if (cuentaAEnviar.categoria !== 'proveedor') {
      cuentaAEnviar.proveedor_id = null;
    }
  
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
    const confirmDelete = window.confirm('¿Estás seguro de que deseas eliminar esta cuenta por pagar?');
    if (!confirmDelete) return;

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

  const calculateTotals = () => {
    const currentDate = new Date();
    const startOfWeek = new Date(currentDate.setDate(currentDate.getDate() - currentDate.getDay()));
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(endOfWeek.getDate() + 6);

    const cuentasSemana = cuentas.filter(
      (c) => new Date(c.fecha) >= startOfWeek && new Date(c.fecha) <= endOfWeek
    );
    setTotalSemana(
      cuentasSemana.reduce((acc, curr) => acc + parseFloat(curr.monto_con_iva || 0), 0)
    );

    const cuentasMes = cuentas.filter(
      (c) => new Date(c.fecha).getMonth() + 1 === parseInt(filterByMonth)
    );
    setTotalMes(
      cuentasMes.reduce((acc, curr) => acc + parseFloat(curr.monto_con_iva || 0), 0)
    );
  };

  // Función para filtrar cuentas por un rango de fechas semanal
  const filtrarPorFecha = () => {
    if (!fechaInicio || !fechaFin) return;
    const inicio = new Date(fechaInicio);
    const fin = new Date(fechaFin);
    const filtradas = cuentas.filter((c) => {
      const fechaCuenta = new Date(c.fecha);
      return fechaCuenta >= inicio && fechaCuenta <= fin;
    });
    setCuentasFiltradas(filtradas);
  };

  return (
    <section className="cuentas-pagar-module">
      <h2>Módulo Cuentas por Pagar</h2>
      <button onClick={toggleForm} className="toggle-form-button">
        {showForm ? 'Cerrar formulario' : 'Registrar Cuenta'}
      </button>

      {showForm && (
        <form onSubmit={handleSubmit} className="cuentas-form">
          <label htmlFor="concepto">Concepto:</label>
          <input
            type="text"
            id="concepto"
            name="concepto"
            value={cuenta.concepto}
            onChange={handleChange}
            required
          />

          <label htmlFor="monto_neto">Monto Neto:</label>
          <input
            type="number"
            id="monto_neto"
            name="monto_neto"
            value={cuenta.monto_neto}
            onChange={handleChange}
            required
          />

          <label htmlFor="monto_con_iva">Monto con IVA:</label>
          <input
            type="number"
            id="monto_con_iva"
            name="monto_con_iva"
            value={cuenta.monto_con_iva}
            readOnly
          />

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

          {cuenta.categoria === 'proveedor' && (
            <div>
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

          <label htmlFor="fecha">Fecha:</label>
          <input
            type="date"
            id="fecha"
            name="fecha"
            value={cuenta.fecha}
            onChange={handleChange}
            required
          />

          <button type="submit" className="submit-button">
            {isEditing ? 'Actualizar Cuenta' : 'Registrar Cuenta'}
          </button>
        </form>
      )}

      <div>
        <h3>Total de la Semana: ${totalSemana.toFixed(2)}</h3>
        <h3>Total del Mes: ${totalMes.toFixed(2)}</h3>

        <label htmlFor="filterByMonth">Filtrar por Mes:</label>
        <select
          id="filterByMonth"
          value={filterByMonth}
          onChange={(e) => setFilterByMonth(e.target.value)}
        >
          <option value="">Seleccione un mes</option>
          {Array.from({ length: 12 }, (_, i) => (
            <option key={i + 1} value={i + 1}>
              {new Date(0, i).toLocaleString('default', { month: 'long' })}
            </option>
          ))}
        </select>

        <div>
          <label>Desde:</label>
          <input type="date" value={fechaInicio} onChange={(e) => setFechaInicio(e.target.value)} />
          <label>Hasta:</label>
          <input type="date" value={fechaFin} onChange={(e) => setFechaFin(e.target.value)} />
          <button onClick={filtrarPorFecha}>Filtrar por semana</button>
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
          {(cuentasFiltradas.length > 0 ? cuentasFiltradas : cuentas).map((c) => (
            <tr
              key={c.id}
              style={{
                backgroundColor: c.pagado ? '#d4edda' : '#fff3cd',
              }}
            >
              <td>{c.concepto}</td>
              <td>{c.monto_neto}</td>
              <td>{c.monto_con_iva}</td>
              <td>{c.categoria}</td>
              <td>{proveedores.find((p) => p.id === c.proveedor_id)?.nombre || 'N/A'}</td>
              <td>{new Date(c.fecha).toLocaleDateString()}</td>
              <td>{c.pagado ? 'Sí' : 'No'}</td>
              <td className="actions">
                <button className="icon-button edit-button" onClick={() => handleEdit(c.id)}>
                  <FontAwesomeIcon icon={faEdit} />
                </button>
                <button className="icon-button delete-button" onClick={() => handleDelete(c.id)}>
                  <FontAwesomeIcon icon={faTrash} />
                </button>
                <button className="icon-button pay-button" onClick={() => handleTogglePagado(c.id)}>
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

