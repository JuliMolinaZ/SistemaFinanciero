import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Grid, TextField, FormControl, InputLabel, Select, MenuItem, Box } from '@mui/material';
import { 
  Receipt as ReceiptIcon, 
  TrendingUp as TrendingUpIcon,
  AttachMoney as AttachMoneyIcon,
  Business as BusinessIcon,
  CalendarToday as CalendarIcon,
  Description as DescriptionIcon,
  Payment as PaymentIcon,
  AccountBalance as AccountBalanceIcon,
  LocalShipping as LocalShippingIcon,
  CheckCircle as CheckCircleIcon
} from '@mui/icons-material';

// Importar componentes unificados reutilizables
import {
  UnifiedContainer,
  UnifiedCard,
  UnifiedHeader,
  UnifiedDataTable,
  UnifiedForm,
  UnifiedSnackbar,
  useDebounce,
  useDataCache,
  formatCurrency,
  formatDate
} from '../../components/ModernUI';

const EmitidasFormsV2 = () => {
  // Estados
  const [facturas, setFacturas] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingFactura, setEditingFactura] = useState(null);
  const [formData, setFormData] = useState({
    numero_factura: '',
    cliente_id: '',
    fecha_emision: new Date().toISOString().split('T')[0],
    fecha_vencimiento: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    concepto: '',
    monto_sin_iva: '',
    iva: '',
    monto_total: '',
    estado: 'pendiente',
    metodo_pago: '',
    notas: ''
  });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Hooks personalizados
  const { getCachedData, setCachedData } = useDataCache();

  // Estadísticas del módulo
  const stats = [
    { 
      label: 'Total Facturas', 
      value: facturas.length.toString(), 
      icon: <ReceiptIcon />, 
      color: '#4ecdc4' 
    },
    { 
      label: 'Facturas Pendientes', 
      value: facturas.filter(f => f.estado === 'pendiente').length.toString(), 
      icon: <PaymentIcon />, 
      color: '#f39c12' 
    },
    { 
      label: 'Facturas Pagadas', 
      value: facturas.filter(f => f.estado === 'pagada').length.toString(), 
      icon: <CheckCircleIcon />, 
      color: '#27ae60' 
    },
    { 
      label: 'Total Facturado', 
      value: formatCurrency(facturas.reduce((sum, f) => sum + parseFloat(f.monto_total || 0), 0)), 
      icon: <AttachMoneyIcon />, 
      color: '#e74c3c' 
    }
  ];

  // Definir columnas de la tabla
  const tableColumns = [
    {
      id: 'numero_factura',
      label: 'N° Factura',
      render: (row) => (
        <Box sx={{ fontWeight: 700, color: '#2c3e50', fontSize: '1.1rem' }}>
          #{row.numero_factura}
        </Box>
      )
    },
    {
      id: 'cliente_nombre',
      label: 'Cliente',
      render: (row) => (
        <Box sx={{ fontWeight: 600, color: '#2c3e50' }}>
          {row.cliente_nombre || 'Cliente no encontrado'}
        </Box>
      )
    },
    {
      id: 'fecha_emision',
      label: 'Fecha Emisión',
      render: (row) => formatDate(row.fecha_emision)
    },
    {
      id: 'fecha_vencimiento',
      label: 'Vencimiento',
      render: (row) => formatDate(row.fecha_vencimiento)
    },
    {
      id: 'concepto',
      label: 'Concepto',
      render: (row) => (
        <Box sx={{ 
          color: '#7f8c8d',
          maxWidth: 200,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap'
        }}>
          {row.concepto || 'Sin concepto'}
        </Box>
      )
    },
    {
      id: 'monto_total',
      label: 'Monto Total',
      render: (row) => (
        <Box sx={{ 
          fontWeight: 700,
          color: '#27ae60',
          fontSize: '1.1rem'
        }}>
          {formatCurrency(row.monto_total)}
        </Box>
      )
    },
    {
      id: 'estado',
      label: 'Estado',
      render: (row) => (
        <Box sx={{ 
          px: 2, 
          py: 0.5, 
          borderRadius: 2, 
          background: row.estado === 'pagada' ? '#e8f5e8' : 
                      row.estado === 'pendiente' ? '#fff3e0' : 
                      row.estado === 'vencida' ? '#ffebee' : '#f3e5f5',
          color: row.estado === 'pagada' ? '#2e7d32' : 
                 row.estado === 'pendiente' ? '#f57c00' : 
                 row.estado === 'vencida' ? '#c62828' : '#7b1fa2',
          fontWeight: 600,
          fontSize: '0.75rem',
          textTransform: 'uppercase'
        }}>
          {row.estado === 'pagada' ? 'Pagada' : 
           row.estado === 'pendiente' ? 'Pendiente' : 
           row.estado === 'vencida' ? 'Vencida' : 'Anulada'}
        </Box>
      )
    },
    {
      id: 'metodo_pago',
      label: 'Método Pago',
      render: (row) => row.metodo_pago || 'N/A'
    }
  ];

  // Definir campos del formulario
  const formFields = [
    {
      name: 'numero_factura',
      label: 'Número de Factura',
      type: 'text',
      required: true,
      fullWidth: true,
      xs: 12,
      sm: 6
    },
    {
      name: 'cliente_id',
      label: 'Cliente',
      type: 'select',
      required: true,
      fullWidth: true,
      xs: 12,
      sm: 6,
      options: clientes.map(cliente => ({
        value: cliente.id,
        label: cliente.nombre
      }))
    },
    {
      name: 'fecha_emision',
      label: 'Fecha de Emisión',
      type: 'date',
      required: true,
      fullWidth: true,
      xs: 12,
      sm: 6
    },
    {
      name: 'fecha_vencimiento',
      label: 'Fecha de Vencimiento',
      type: 'date',
      required: true,
      fullWidth: true,
      xs: 12,
      sm: 6
    },
    {
      name: 'concepto',
      label: 'Concepto/Servicio',
      type: 'text',
      required: true,
      fullWidth: true,
      xs: 12,
      sm: 6
    },
    {
      name: 'monto_sin_iva',
      label: 'Monto Sin IVA',
      type: 'number',
      required: true,
      fullWidth: true,
      xs: 12,
      sm: 6
    },
    {
      name: 'iva',
      label: 'IVA (16%)',
      type: 'number',
      required: true,
      fullWidth: true,
      xs: 12,
      sm: 6,
      inputProps: { readOnly: true }
    },
    {
      name: 'monto_total',
      label: 'Monto Total',
      type: 'number',
      required: true,
      fullWidth: true,
      xs: 12,
      sm: 6,
      inputProps: { readOnly: true }
    },
    {
      name: 'estado',
      label: 'Estado',
      type: 'select',
      required: true,
      fullWidth: true,
      xs: 12,
      sm: 6,
      options: [
        { value: 'pendiente', label: 'Pendiente' },
        { value: 'pagada', label: 'Pagada' },
        { value: 'vencida', label: 'Vencida' },
        { value: 'anulada', label: 'Anulada' }
      ]
    },
    {
      name: 'metodo_pago',
      label: 'Método de Pago',
      type: 'select',
      required: false,
      fullWidth: true,
      xs: 12,
      sm: 6,
      options: [
        { value: 'efectivo', label: 'Efectivo' },
        { value: 'transferencia', label: 'Transferencia' },
        { value: 'cheque', label: 'Cheque' },
        { value: 'tarjeta', label: 'Tarjeta' },
        { value: 'otro', label: 'Otro' }
      ]
    },
    {
      name: 'notas',
      label: 'Notas Adicionales',
      type: 'text',
      required: false,
      fullWidth: true,
      xs: 12,
      sm: 12,
      multiline: true,
      rows: 3
    }
  ];

  // Funciones de API
  const fetchFacturas = useCallback(async () => {
    try {
      setLoading(true);
      const cached = getCachedData('facturas');
      if (cached) {
        setFacturas(cached);
        setLoading(false);
        return;
      }

      const response = await axios.get('/api/emitidas');
      if (response.data && response.data.success) {
        const facturasWithDetails = response.data.data.map(factura => ({
          ...factura,
          cliente_nombre: clientes.find(c => c.id === factura.cliente_id)?.nombre || 'N/A'
        }));
        setFacturas(facturasWithDetails);
        setCachedData('facturas', facturasWithDetails);
      } else {
        setFacturas([]);
      }
    } catch (error) {
      console.error('Error al obtener facturas:', error);
      setFacturas([]);
    } finally {
      setLoading(false);
    }
  }, [clientes, getCachedData, setCachedData]);

  const fetchClientes = useCallback(async () => {
    try {
      const response = await axios.get('/api/clients');
      if (response.data && response.data.success && Array.isArray(response.data.data)) {
        setClientes(response.data.data);
      } else if (Array.isArray(response.data)) {
        setClientes(response.data);
      } else {
        setClientes([]);
      }
    } catch (error) {
      console.error('Error al obtener clientes:', error);
      setClientes([]);
    }
  }, []);

  const createFactura = useCallback(async (data) => {
    try {
      const response = await axios.post('/api/emitidas', data);
      if (response.data && response.data.success) {
        setSnackbar({
          open: true,
          message: 'Factura creada exitosamente',
          severity: 'success'
        });
        fetchFacturas();
        return true;
      }
    } catch (error) {
      console.error('Error al crear factura:', error);
      setSnackbar({
        open: true,
        message: 'Error al crear factura',
        severity: 'error'
      });
      return false;
    }
  }, [fetchFacturas]);

  const updateFactura = useCallback(async (id, data) => {
    try {
      const response = await axios.put(`/api/emitidas/${id}`, data);
      if (response.data && response.data.success) {
        setSnackbar({
          open: true,
          message: 'Factura actualizada exitosamente',
          severity: 'success'
        });
        fetchFacturas();
        return true;
      }
    } catch (error) {
      console.error('Error al actualizar factura:', error);
      setSnackbar({
        open: true,
        message: 'Error al actualizar factura',
        severity: 'error'
      });
      return false;
    }
  }, [fetchFacturas]);

  const deleteFactura = useCallback(async (factura) => {
    if (window.confirm(`¿Estás seguro de eliminar la factura #${factura.numero_factura}?`)) {
      try {
        const response = await axios.delete(`/api/emitidas/${factura.id}`);
        if (response.data && response.data.success) {
          setSnackbar({
            open: true,
            message: 'Factura eliminada exitosamente',
            severity: 'success'
          });
          fetchFacturas();
        }
      } catch (error) {
        console.error('Error al eliminar factura:', error);
        setSnackbar({
          open: true,
          message: 'Error al eliminar factura',
          severity: 'error'
        });
      }
    }
  }, [fetchFacturas]);

  // Cálculos automáticos
  const calcularIVAyTotal = (montoSinIVA) => {
    const iva = parseFloat(montoSinIVA || 0) * 0.16;
    const total = parseFloat(montoSinIVA || 0) + iva;
    return { iva: iva.toFixed(2), total: total.toFixed(2) };
  };

  // Manejadores de eventos
  const handleCreateFactura = () => {
    setEditingFactura(null);
    setFormData({
      numero_factura: '',
      cliente_id: '',
      fecha_emision: new Date().toISOString().split('T')[0],
      fecha_vencimiento: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      concepto: '',
      monto_sin_iva: '',
      iva: '',
      monto_total: '',
      estado: 'pendiente',
      metodo_pago: '',
      notas: ''
    });
    setShowForm(true);
  };

  const handleEditFactura = (factura) => {
    setEditingFactura(factura);
    setFormData({
      numero_factura: factura.numero_factura || '',
      cliente_id: factura.cliente_id || '',
      fecha_emision: factura.fecha_emision ? new Date(factura.fecha_emision).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      fecha_vencimiento: factura.fecha_vencimiento ? new Date(factura.fecha_vencimiento).toISOString().split('T')[0] : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      concepto: factura.concepto || '',
      monto_sin_iva: factura.monto_sin_iva || '',
      iva: factura.iva || '',
      monto_total: factura.monto_total || '',
      estado: factura.estado || 'pendiente',
      metodo_pago: factura.metodo_pago || '',
      notas: factura.notas || ''
    });
    setShowForm(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    
    if (editingFactura) {
      const success = await updateFactura(editingFactura.id, formData);
      if (success) {
        setShowForm(false);
        setEditingFactura(null);
      }
    } else {
      const success = await createFactura(formData);
      if (success) {
        setShowForm(false);
      }
    }
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingFactura(null);
    setFormData({
      numero_factura: '',
      cliente_id: '',
      fecha_emision: new Date().toISOString().split('T')[0],
      fecha_vencimiento: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      concepto: '',
      monto_sin_iva: '',
      iva: '',
      monto_total: '',
      estado: 'pendiente',
      metodo_pago: '',
      notas: ''
    });
  };

  const handleMontoChange = (e) => {
    const montoSinIVA = e.target.value;
    const { iva, total } = calcularIVAyTotal(montoSinIVA);
    setFormData({
      ...formData,
      monto_sin_iva: montoSinIVA,
      iva: iva,
      monto_total: total
    });
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Efectos
  useEffect(() => {
    fetchClientes();
  }, [fetchClientes]);

  useEffect(() => {
    if (clientes.length > 0) {
      fetchFacturas();
    }
  }, [clientes, fetchFacturas]);

  return (
    <UnifiedContainer maxWidth="xl">
      {/* Header con estadísticas y acciones */}
      <UnifiedHeader
        title="Facturas Emitidas"
        subtitle="Gestiona todas las facturas emitidas a clientes"
        icon={<ReceiptIcon />}
        stats={stats}
        onRefresh={fetchFacturas}
        onCreate={handleCreateFactura}
      />

      {/* Tabla de datos */}
      <UnifiedCard sx={{ mb: 4 }}>
        <UnifiedDataTable
          data={facturas}
          columns={tableColumns}
          loading={loading}
          onEdit={handleEditFactura}
          onDelete={deleteFactura}
          emptyMessage="No hay facturas emitidas registradas"
          emptyIcon={<ReceiptIcon />}
        />
      </UnifiedCard>

      {/* Formulario modal */}
      <UnifiedForm
        open={showForm}
        onClose={handleFormCancel}
        title="Factura"
        isEditing={!!editingFactura}
        onSubmit={handleFormSubmit}
        submitText={editingFactura ? 'Actualizar' : 'Crear'}
        cancelText="Cancelar"
      >
        <Grid container spacing={3}>
          {formFields.map((field) => (
            <Grid item xs={field.xs} sm={field.sm} key={field.name}>
              {field.type === 'select' ? (
                <FormControl fullWidth={field.fullWidth} required={field.required}>
                  <InputLabel>{field.label}</InputLabel>
                  <Select
                    name={field.name}
                    value={formData[field.name]}
                    onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
                    label={field.label}
                  >
                    {field.options.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              ) : (
                <TextField
                  name={field.name}
                  label={field.label}
                  type={field.type}
                  value={formData[field.name]}
                  onChange={field.name === 'monto_sin_iva' ? handleMontoChange : (e) => setFormData({ ...formData, [field.name]: e.target.value })}
                  fullWidth={field.fullWidth}
                  required={field.required}
                  variant="outlined"
                  inputProps={field.inputProps || (field.type === 'number' ? { min: 0, step: 0.01 } : {})}
                  multiline={field.multiline}
                  rows={field.rows}
                />
              )}
            </Grid>
          ))}
        </Grid>
      </UnifiedForm>

      {/* Snackbar de notificaciones */}
      <UnifiedSnackbar
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={handleSnackbarClose}
      />
    </UnifiedContainer>
  );
};

export default EmitidasFormsV2;
