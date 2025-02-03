import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileCsv } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { useCuentasPagar } from '../../hooks/useCuentasPagar';
import Filtros from './components/Filtros';
import TablaCuentas from './components/TablaCuentas';
import ModalRegistro from './components/ModalRegistro';
import ModalPagoParcial from './components/ModalPagoParcial';
import CalendarPagos from './components/CalendarPagos';
import './CuentasPagarForm.css';

const CuentasPagarForm = () => {
  /*** Estados y Custom Hook ***/
  const { cuentas, fetchCuentas, updateCuenta, createCuenta, deleteCuenta } = useCuentasPagar();

  // Estado para la cuenta actual (registro/actualización)
  const [cuenta, setCuenta] = useState({
    concepto: '',
    monto_neto: '',
    monto_con_iva: '',
    requiere_iva: false,
    categoria: '',
    proveedor_id: '',
    fecha: '',
    pagado: false,
    pagos_parciales: 0,
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [showFormModal, setShowFormModal] = useState(false);

  // Estados para totales
  const [totalPagadas, setTotalPagadas] = useState(0);
  const [totalPorPagar, setTotalPorPagar] = useState(0);

  // Estados para filtros
  const [filtroMes, setFiltroMes] = useState('');
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [estadoFiltro, setEstadoFiltro] = useState('');
  const [cuentasFiltradas, setCuentasFiltradas] = useState([]);

  // Estados para modal de pagos parciales
  const [showPagoModal, setShowPagoModal] = useState(false);
  const [selectedCuenta, setSelectedCuenta] = useState(null);
  const [pagoMonto, setPagoMonto] = useState('');
  const [errorPago, setErrorPago] = useState('');

  // Estado para mostrar/ocultar el calendario de pagos
  const [showCalendar, setShowCalendar] = useState(false);

  // Estados para proveedores y categorías
  const [proveedores, setProveedores] = useState([]);
  const [categorias, setCategorias] = useState([]);

  /*** Efectos Iniciales ***/
  useEffect(() => {
    fetchCuentas();
  }, [fetchCuentas]);

  useEffect(() => {
    const fetchProveedores = async () => {
      try {
        const response = await axios.get('https://sigma.runsolutions-services.com/api/proveedores');
        setProveedores(response.data);
      } catch (err) {
        console.error('Error al obtener proveedores:', err);
      }
    };
    const fetchCategorias = async () => {
      try {
        const response = await axios.get('https://sigma.runsolutions-services.com/api/categorias');
        setCategorias(response.data);
      } catch (err) {
        console.error('Error al obtener categorías:', err);
      }
    };
    fetchProveedores();
    fetchCategorias();
  }, []);

  /*** Función para formatear moneda ***/
  const formatoMoneda = useCallback((valor) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
    }).format(valor);
  }, []);

  /*** Filtrado y Cálculo de Totales ***/
  const filtrarCuentas = useCallback(() => {
    let filtradas = cuentas;
    if (filtroMes) {
      filtradas = filtradas.filter(
        (c) => new Date(c.fecha).getMonth() + 1 === parseInt(filtroMes, 10)
      );
    }
    if (fechaInicio && fechaFin) {
      const inicio = new Date(fechaInicio);
      const fin = new Date(fechaFin);
      fin.setDate(fin.getDate() + 1);
      filtradas = filtradas.filter((c) => {
        const fechaCuenta = new Date(c.fecha);
        return fechaCuenta >= inicio && fechaCuenta < fin;
      });
    }
    if (estadoFiltro) {
      if (estadoFiltro === 'pagadas') {
        filtradas = filtradas.filter((c) => c.pagado);
      } else if (estadoFiltro === 'pendientes') {
        filtradas = filtradas.filter((c) => !c.pagado);
      }
    }
    setCuentasFiltradas(filtradas);
  }, [cuentas, filtroMes, fechaInicio, fechaFin, estadoFiltro]);

  useEffect(() => {
    filtrarCuentas();
  }, [filtrarCuentas]);

  useEffect(() => {
    const totalPagadasCalc = cuentasFiltradas.reduce((acc, curr) => {
      const pago = curr.pagado
        ? parseFloat(curr.monto_con_iva || 0)
        : parseFloat(curr.pagos_parciales || 0);
      return acc + pago;
    }, 0);
    const totalPorPagarCalc = cuentasFiltradas.reduce((acc, curr) => {
      const montoConIVA = parseFloat(curr.monto_con_iva || 0);
      const pagos = curr.pagado
        ? montoConIVA
        : parseFloat(curr.pagos_parciales || 0);
      const restante = montoConIVA - pagos;
      return acc + (restante > 0 ? restante : 0);
    }, 0);
    setTotalPagadas(totalPagadasCalc);
    setTotalPorPagar(totalPorPagarCalc);
  }, [cuentasFiltradas]);

  const handleClearFilters = () => {
    setFiltroMes('');
    setFechaInicio('');
    setFechaFin('');
    setEstadoFiltro('');
  };

  /*** Manejo del Formulario (Registro/Actualización) ***/
  const toggleFormModal = useCallback(() => {
    setShowFormModal((prev) => {
      if (prev) {
        resetForm();
        return false;
      }
      return true;
    });
  }, []);

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
      pagos_parciales: 0,
    });
  };

  const handleChangeForm = (e) => {
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
      monto_con_iva: checked
        ? (parseFloat(prev.monto_neto || 0) * 1.16).toFixed(2)
        : prev.monto_neto,
    }));
  };

  const handleSubmitForm = async (e) => {
    e.preventDefault();
    if (isEditing) {
      await updateCuenta(editingId, cuenta);
    } else {
      await createCuenta(cuenta);
    }
    toggleFormModal();
  };

  const handleEdit = (id) => {
    const cuentaToEdit = cuentas.find((c) => c.id === id);
    setCuenta(cuentaToEdit);
    setIsEditing(true);
    setEditingId(id);
    setShowFormModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta cuenta por pagar?')) {
      await deleteCuenta(id);
    }
  };

  const handleTogglePagado = async (id) => {
    try {
      await axios.put(`/api/cuentas-pagar/${id}/pagado`);
      fetchCuentas();
    } catch (err) {
      console.error('Error al alternar el estado de pagado:', err);
    }
  };

  /*** Modal de Pagos Parciales ***/
  const handleAbrirPagoModal = (cuenta) => {
    setSelectedCuenta(cuenta);
    setPagoMonto('');
    setErrorPago('');
    setShowPagoModal(true);
  };

  const handleCerrarPagoModal = () => {
    setShowPagoModal(false);
    setSelectedCuenta(null);
    setPagoMonto('');
    setErrorPago('');
  };

  const handleGuardarPagoParcial = async () => {
    if (!pagoMonto || isNaN(pagoMonto) || parseFloat(pagoMonto) <= 0) {
      setErrorPago('Ingrese un monto válido mayor a 0.');
      return;
    }
    const montoPago = parseFloat(pagoMonto);
    const pagosActuales = parseFloat(selectedCuenta.pagos_parciales || 0);
    const nuevoTotalPagos = pagosActuales + montoPago;
    const totalConIVA = parseFloat(selectedCuenta.monto_con_iva || 0);
    const pagado = nuevoTotalPagos >= totalConIVA ? 1 : 0;
    try {
      await axios.put(`/api/cuentas-pagar/${selectedCuenta.id}`, {
        ...selectedCuenta,
        pagos_parciales: nuevoTotalPagos,
        pagado,
      });
      fetchCuentas();
      handleCerrarPagoModal();
    } catch (err) {
      console.error('Error al guardar pago parcial:', err);
    }
  };

  /*** Calendario de Pagos ***/
  const handleDateSelect = (dateString) => {
    setFechaInicio(dateString);
    setFechaFin(dateString);
  };

  /*** Ordenamiento de Cuentas Filtradas ***/
  const cuentasOrdenadas = useMemo(() => {
    return [...cuentasFiltradas].sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
  }, [cuentasFiltradas]);

  /*** Exportar a CSV ***/
  const handleExportCSV = async () => {
    try {
      const params = {};
      if (filtroMes) params.filtroMes = filtroMes;
      if (fechaInicio && fechaFin) {
        params.fechaInicio = fechaInicio;
        params.fechaFin = fechaFin;
      }
      const response = await axios.get(
        'https://sigma.runsolutions-services.com/api/cuentas-pagar/export',
        { params, responseType: 'blob' }
      );
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'cuentas-pagar.csv');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error('Error al exportar CSV:', err);
    }
  };

  return (
    <section className="cuentas-pagar-module">
      <h2>Cuentas por Pagar</h2>

      {/* Encabezado con el botón Registrar Cuenta */}
      <div className="header-actions">
        <button onClick={toggleFormModal} className="toggle-form-button">
          {showFormModal ? 'Cerrar Formulario' : 'Registrar Cuenta'}
        </button>
      </div>

      {/* Filtros y Totales */}
      <div className="card-filtros-totales">
        <Filtros
          filtroMes={filtroMes}
          setFiltroMes={setFiltroMes}
          fechaInicio={fechaInicio}
          setFechaInicio={setFechaInicio}
          fechaFin={fechaFin}
          setFechaFin={setFechaFin}
          estadoFiltro={estadoFiltro}
          setEstadoFiltro={setEstadoFiltro}
          handleClearFilters={handleClearFilters}
        />
        <div className="totales">
          <div className="total">
            <span>Cuentas Pagadas</span>
            <span className="valor-total">{formatoMoneda(totalPagadas)}</span>
          </div>
          <div className="total">
            <span>Cuentas por Pagar</span>
            <span className="valor-total">{formatoMoneda(totalPorPagar)}</span>
          </div>
        </div>
      </div>

      {/* Botón para mostrar/ocultar el Calendario de Pagos */}
      <div className="calendar-toggle">
        <button
          onClick={() => setShowCalendar((prev) => !prev)}
          className="toggle-calendar-button"
        >
          {showCalendar ? 'Ocultar Calendario de Pagos' : 'Visualizar Calendario de Pagos'}
        </button>
      </div>
      {showCalendar && <CalendarPagos cuentas={cuentas} onDateSelect={handleDateSelect} />}

      {/* Botón Exportar CSV ubicado entre el calendario y la tabla */}
      <div className="export-container">
        <button onClick={handleExportCSV} className="export-button">
          <FontAwesomeIcon icon={faFileCsv} /> Exportar CSV
        </button>
      </div>

      <h3>Cuentas por Pagar Registradas</h3>
      <TablaCuentas
        cuentas={cuentasOrdenadas}
        proveedores={proveedores}
        formatoMoneda={formatoMoneda}
        handleAbrirPagoModal={handleAbrirPagoModal}
        handleTogglePagado={handleTogglePagado}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
      />

      {/* Modal Registro/Actualización */}
      {showFormModal && (
        <ModalRegistro
          isEditing={isEditing}
          cuenta={cuenta}
          handleChange={handleChangeForm}
          handleCheckboxChange={handleCheckboxChange}
          handleSubmit={handleSubmitForm}
          toggleFormModal={toggleFormModal}
          proveedores={proveedores}
          categorias={categorias}
        />
      )}

      {/* Modal Pagos Parciales */}
      {showPagoModal && selectedCuenta && (
        <ModalPagoParcial
          selectedCuenta={selectedCuenta}
          pagoMonto={pagoMonto}
          setPagoMonto={setPagoMonto}
          errorPago={errorPago}
          handleGuardarPagoParcial={handleGuardarPagoParcial}
          handleCerrarPagoModal={handleCerrarPagoModal}
          formatoMoneda={formatoMoneda}
        />
      )}
    </section>
  );
};

export default CuentasPagarForm;






