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
import {
  Container,
  Box,
  Typography,
  Button,
  Snackbar,
  Alert,
  CircularProgress,
  Slide
} from '@mui/material';
import { calcularTotalesRecuperacion } from '../../utils/cuentas';

// Función de transición para Snackbar
function SlideTransition(props) {
  return <Slide {...props} direction="up" />;
}

// Establece por defecto el mes actual
const currentMonth = new Date().getMonth() + 1;

const CuentasPagarForm = () => {
  const { cuentas, fetchCuentas, updateCuenta, createCuenta, deleteCuenta } = useCuentasPagar();

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
    monto_transferencia: '',
    monto_efectivo: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [showFormModal, setShowFormModal] = useState(false);

  const [totalPagadas, setTotalPagadas] = useState(0);
  const [totalPorPagar, setTotalPorPagar] = useState(0);

  // Filtros
  // Por defecto se muestran las cuentas del mes actual;
  // si el usuario selecciona "Todas" en el Filtros se deberá asignar el valor "all"
  const [filtroMes, setFiltroMes] = useState(currentMonth.toString());
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [estadoFiltro, setEstadoFiltro] = useState('');
  const [cuentasFiltradas, setCuentasFiltradas] = useState([]);

  // Estado para selección de cuentas (IDs)
  const [selectedCuentas, setSelectedCuentas] = useState([]);

  const [showPagoModal, setShowPagoModal] = useState(false);
  const [selectedCuenta, setSelectedCuenta] = useState(null);
  const [pagoMonto, setPagoMonto] = useState('');
  const [errorPago, setErrorPago] = useState('');

  const [showCalendar, setShowCalendar] = useState(false);

  const [proveedores, setProveedores] = useState([]);
  const [categorias, setCategorias] = useState([]);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') return;
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  useEffect(() => {
    fetchCuentas();
  }, [fetchCuentas]);

  useEffect(() => {
    const fetchProveedores = async () => {
      try {
        const res = await axios.get('https://sigma.runsolutions-services.com/api/proveedores');
        setProveedores(res.data);
      } catch (err) {
        console.error('Error al obtener proveedores:', err);
      }
    };
    const fetchCategorias = async () => {
      try {
        const res = await axios.get('https://sigma.runsolutions-services.com/api/categorias');
        setCategorias(res.data);
      } catch (err) {
        console.error('Error al obtener categorías:', err);
      }
    };
    fetchProveedores();
    fetchCategorias();
  }, []);

  const formatoMoneda = useCallback((valor) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
    }).format(valor);
  }, []);

  const filtrarCuentas = useCallback(() => {
    let filtradas = cuentas;
    // Si filtroMes tiene valor y NO es "all", se filtra por mes
    if (filtroMes && filtroMes !== 'all') {
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
    // Al cambiar el filtro se limpia la selección
    setSelectedCuentas([]);
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
    // Si se desea ver todas, se puede asignar "all" aquí
    setFiltroMes(currentMonth.toString());
    setFechaInicio('');
    setFechaFin('');
    setEstadoFiltro('');
  };

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
      monto_transferencia: '',
      monto_efectivo: '',
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
    try {
      if (isEditing) {
        await updateCuenta(editingId, cuenta);
        setSnackbar({
          open: true,
          message: 'Cuenta actualizada exitosamente.',
          severity: 'success',
        });
      } else {
        await createCuenta(cuenta);
        setSnackbar({
          open: true,
          message: 'Cuenta registrada exitosamente.',
          severity: 'success',
        });
      }
      toggleFormModal();
    } catch (error) {
      console.error('Error en el formulario:', error.response?.data || error.message);
      setSnackbar({
        open: true,
        message: 'Error al enviar el formulario.',
        severity: 'error',
      });
    }
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
      try {
        await deleteCuenta(id);
        setSnackbar({
          open: true,
          message: 'Cuenta eliminada exitosamente.',
          severity: 'success',
        });
      } catch (error) {
        console.error('Error al eliminar:', error.response?.data || error.message);
        setSnackbar({
          open: true,
          message: 'Error al eliminar la cuenta.',
          severity: 'error',
        });
      }
    }
  };

  const handleTogglePagado = async (id) => {
    try {
      await axios.put(`/api/cuentas-pagar/${id}/pagado`);
      fetchCuentas();
    } catch (err) {
      console.error('Error al alternar pagado:', err);
    }
  };

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
      setSnackbar({
        open: true,
        message: 'Pago parcial registrado.',
        severity: 'success',
      });
    } catch (err) {
      console.error('Error al guardar pago parcial:', err);
      setSnackbar({
        open: true,
        message: 'Error al guardar pago parcial.',
        severity: 'error',
      });
    }
  };

  const handleDateSelect = (dateString) => {
    setFechaInicio(dateString);
    setFechaFin(dateString);
  };

  const cuentasOrdenadas = useMemo(() => {
    return [...cuentasFiltradas].sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
  }, [cuentasFiltradas]);

  // Funciones de selección de cuentas
  const handleToggleSelect = (cuentaId) => {
    setSelectedCuentas(prev =>
      prev.includes(cuentaId)
        ? prev.filter(id => id !== cuentaId)
        : [...prev, cuentaId]
    );
  };

  const handleSelectAll = () => {
    const allIds = cuentasOrdenadas.map(c => c.id);
    setSelectedCuentas(allIds);
  };

  const handleClearSelection = () => {
    setSelectedCuentas([]);
  };

  // Función para convertir datos a CSV de forma simple
  const convertToCSV = (objArray, fields) => {
    const header = fields.join(',');
    const csvRows = objArray.map(row =>
      fields.map(field => `"${row[field] !== undefined ? row[field] : ''}"`).join(',')
    );
    return [header, ...csvRows].join('\n');
  };

  const handleExportCSV = async () => {
    // Si hay cuentas seleccionadas, exportar solo esas
    if (selectedCuentas.length > 0) {
      const selectedData = cuentas.filter(c => selectedCuentas.includes(c.id));
      const fields = [
        'id',
        'concepto',
        'monto_neto',
        'monto_con_iva',
        'requiere_iva',
        'categoria',
        'proveedor_id',
        'fecha',
        'pagado',
        'pagos_parciales',
        'monto_transferencia',
        'monto_efectivo'
      ];
      const csv = convertToCSV(selectedData, fields);
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'cuentas-pagar-seleccionadas.csv');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      // Sino, exportar por los filtros aplicados (usando el endpoint)
      try {
        const params = {};
        if (filtroMes) params.filtroMes = filtroMes;
        if (fechaInicio && fechaFin) {
          params.fechaInicio = fechaInicio;
          params.fechaFin = fechaFin;
        }
        if (estadoFiltro) params.estadoFiltro = estadoFiltro;
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
        setSnackbar({
          open: true,
          message: 'Error al exportar CSV.',
          severity: 'error',
        });
      }
    }
  };

  if (!cuentas) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container sx={{ py: 4, backgroundColor: '#f0f2f5', minHeight: '100vh' }}>
      <Typography
        variant="h3"
        align="center"
        sx={{
          mb: 4,
          color: '#e63946',
          fontWeight: 'bold',
          borderBottom: '2px solid #e63946',
          pb: 1,
          textTransform: 'uppercase',
        }}
      >
        Cuentas por Pagar
      </Typography>
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          justifyContent: 'center',
          alignItems: 'center',
          gap: 2,
          mb: 3,
        }}
      >
        <Button
          variant="contained"
          color="primary"
          onClick={toggleFormModal}
          sx={{ boxShadow: 3, textTransform: 'none', px: 4, py: 1 }}
        >
          {showFormModal ? 'Cerrar Formulario' : 'Registrar Cuenta'}
        </Button>
        <Button
          variant="contained"
          color="success"
          onClick={handleExportCSV}
          sx={{ boxShadow: 3, textTransform: 'none', px: 4, py: 1 }}
        >
          <FontAwesomeIcon icon={faFileCsv} style={{ marginRight: '0.5rem' }} />
          Exportar CSV
        </Button>
        <Button
          variant="outlined"
          color="info"
          onClick={handleSelectAll}
          sx={{ boxShadow: 3, textTransform: 'none', px: 4, py: 1 }}
        >
          Seleccionar Todo
        </Button>
        <Button
          variant="outlined"
          color="warning"
          onClick={handleClearSelection}
          sx={{ boxShadow: 3, textTransform: 'none', px: 4, py: 1 }}
        >
          Borrar Selección
        </Button>
      </Box>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          width: '100%',
          maxWidth: 900,
          mx: 'auto',
          p: 2,
          backgroundColor: '#fff',
          border: '1px solid #ddd',
          borderRadius: 2,
          boxShadow: 3,
          mb: 4,
        }}
      >
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
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-around',
            alignItems: 'center',
            backgroundColor: '#e9ecef',
            borderRadius: 1,
            p: 1,
          }}
        >
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
              Cuentas Pagadas
            </Typography>
            <Typography variant="h6" sx={{ color: '#01af09' }}>
              {formatoMoneda(totalPagadas)}
            </Typography>
          </Box>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
              Cuentas por Pagar
            </Typography>
            <Typography variant="h6" sx={{ color: '#e63946' }}>
              {formatoMoneda(totalPorPagar)}
            </Typography>
          </Box>
        </Box>
      </Box>
      <Box sx={{ textAlign: 'center', mb: 3 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => setShowCalendar((prev) => !prev)}
          sx={{ boxShadow: 3, textTransform: 'none', px: 4, py: 1 }}
        >
          {showCalendar ? 'Ocultar Calendario de Pagos' : 'Visualizar Calendario de Pagos'}
        </Button>
      </Box>
      {showCalendar && <CalendarPagos cuentas={cuentas} onDateSelect={handleDateSelect} />}
      <Typography variant="h5" sx={{ mt: 4, mb: 2, textAlign: 'center' }}>
        Cuentas por Pagar Registradas
      </Typography>
      <TablaCuentas
        cuentas={cuentasOrdenadas}
        proveedores={proveedores}
        formatoMoneda={formatoMoneda}
        handleAbrirPagoModal={handleAbrirPagoModal}
        handleTogglePagado={handleTogglePagado}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
        selectedCuentas={selectedCuentas}
        onToggleSelect={handleToggleSelect}
        onSelectAll={handleSelectAll}
        onClearSelection={handleClearSelection}
      />
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
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        TransitionComponent={SlideTransition}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} variant="filled" sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default CuentasPagarForm;
