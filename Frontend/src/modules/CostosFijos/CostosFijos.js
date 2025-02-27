// src/modules/CostosFijos/CostosFijos.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Grid,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tooltip,
  Snackbar,
  Alert,
  Slide,
} from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faClose, faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
  LabelList,
  ReferenceLine,
} from 'recharts';

// Formateadores de moneda
const formatterMXN = new Intl.NumberFormat('es-MX', {
  style: 'currency',
  currency: 'MXN',
  minimumFractionDigits: 2,
});
const formatterUSD = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
});

// Transición deslizante para el Snackbar
function SlideTransition(props) {
  return <Slide {...props} direction="left" />;
}

// Tooltip personalizado para la gráfica
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <Box
        sx={{
          backgroundColor: 'rgba(255,255,255,0.95)',
          border: '1px solid #ccc',
          p: 1,
          borderRadius: 1,
          boxShadow: 1,
        }}
      >
        <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
          {label}
        </Typography>
        {payload.map((entry, index) => (
          <Typography key={`item-${index}`} sx={{ color: entry.color }}>
            {entry.name}: {formatterMXN.format(entry.value)}
          </Typography>
        ))}
      </Box>
    );
  }
  return null;
};

// Componente de la gráfica
const ChartComponent = ({ dataGrafica, totalCostos }) => (
  <Box
    sx={{
      width: '100%',
      maxWidth: 1000,
      mb: 4,
      backgroundColor: '#fff',
      p: 2,
      borderRadius: 2,
      boxShadow: 2,
      mx: 'auto',
    }}
  >
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={dataGrafica} margin={{ top: 50, right: 30, left: 20, bottom: 50 }}>
        <defs>
          <linearGradient id="colorCostosFijos" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="colorCostosFijosUtilidad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" tick={{ fill: "#555" }} />
        <YAxis tick={{ fill: "#555" }}>
          <text
            x={-50}
            y={10}
            angle={-90}
            textAnchor="middle"
            fill="#555"
            fontSize="12px"
          >
            Monto en MXN
          </text>
        </YAxis>
        <RechartsTooltip content={<CustomTooltip />} />
        <Legend verticalAlign="top" height={36} />
        <Bar
          dataKey="Costos Fijos"
          fill="url(#colorCostosFijos)"
          animationDuration={1500}
          radius={[10, 10, 0, 0]}
        >
          <LabelList dataKey="Costos Fijos" position="top" formatter={(value) => formatterMXN.format(value)} />
        </Bar>
        <Bar
          dataKey="Costos Fijos + Utilidad"
          fill="url(#colorCostosFijosUtilidad)"
          animationDuration={1500}
          radius={[10, 10, 0, 0]}
        >
          <LabelList dataKey="Costos Fijos + Utilidad" position="top" formatter={(value) => formatterMXN.format(value)} />
        </Bar>
        {totalCostos > 0 && (
          <ReferenceLine
            y={totalCostos}
            stroke="red"
            strokeDasharray="3 3"
            label={{
              position: 'insideTopRight',
              value: 'Total Costos',
              fill: 'red',
              fontSize: 12,
              fontWeight: 'bold',
            }}
          />
        )}
      </BarChart>
    </ResponsiveContainer>
  </Box>
);

// Componente para mostrar totales y utilidad
const TotalsComponent = ({ totalCostos, porcentajeUtilidad, setPorcentajeUtilidad, resultadoUtilidad }) => (
  <Box
    sx={{
      width: '100%',
      maxWidth: 600,
      mb: 4,
      p: 3,
      border: '1px solid #ddd',
      borderRadius: 2,
      backgroundColor: '#fff',
      boxShadow: 2,
      textAlign: 'center',
      mx: 'auto',
    }}
  >
    <Typography variant="h5" sx={{ mb: 2, color: '#333' }}>
      Totales y Utilidad
    </Typography>
    <FormControl sx={{ mb: 2, minWidth: 200 }}>
      <InputLabel id="porcentaje-label">Porcentaje de Utilidad</InputLabel>
      <Select
        labelId="porcentaje-label"
        value={porcentajeUtilidad}
        label="Porcentaje de Utilidad"
        onChange={(e) => setPorcentajeUtilidad(Number(e.target.value))}
      >
        {[30, 40, 50, 60, 80, 100, 120].map((porcentaje) => (
          <MenuItem key={porcentaje} value={porcentaje}>
            {porcentaje}%
          </MenuItem>
        ))}
      </Select>
    </FormControl>
    <Typography variant="body1" sx={{ mt: 1, fontSize: '1.1rem', color: '#555' }}>
      <strong>Total Costos Fijos:</strong> {formatterMXN.format(totalCostos)}
    </Typography>
    <Typography variant="body1" sx={{ mt: 1, fontSize: '1.1rem', color: '#555' }}>
      <strong>Resultado de utilidad ({porcentajeUtilidad}%):</strong> {formatterMXN.format(resultadoUtilidad)}
    </Typography>
  </Box>
);

// Componente del formulario (dentro de un Dialog)
const FixedCostFormDialog = ({ open, onClose, isEditing, formData, onChange, onSubmit }) => (
  <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
    <DialogTitle
      sx={{
        p: 2,
        background: 'linear-gradient(90deg, #ff6b6b, #f94d9a)',
        color: '#fff',
        fontWeight: 'bold',
        position: 'relative',
      }}
    >
      {isEditing ? 'Actualizar Costo Fijo' : 'Registrar Costo Fijo'}
      <IconButton
        onClick={onClose}
        sx={{
          position: 'absolute',
          right: 8,
          top: 8,
          color: '#fff',
          '&:hover': { color: '#ffeb3b' },
        }}
      >
        <FontAwesomeIcon icon={faClose} />
      </IconButton>
    </DialogTitle>
    <DialogContent sx={{ backgroundColor: '#fff' }}>
      <Grid container spacing={2} sx={{ mt: 1 }}>
        <Grid item xs={12}>
          <TextField
            label="Colaborador"
            name="colaborador"
            value={formData.colaborador}
            onChange={onChange}
            fullWidth
            required
            variant="outlined"
            sx={{ backgroundColor: '#f9f9f9', borderRadius: 1 }}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Puesto"
            name="puesto"
            value={formData.puesto}
            onChange={onChange}
            fullWidth
            required
            variant="outlined"
            sx={{ backgroundColor: '#f9f9f9', borderRadius: 1 }}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Monto en USD"
            name="monto_usd"
            type="number"
            value={formData.monto_usd}
            onChange={onChange}
            fullWidth
            required
            inputProps={{ step: "0.01", min: "0" }}
            variant="outlined"
            sx={{ backgroundColor: '#f9f9f9', borderRadius: 1 }}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Fecha"
            name="fecha"
            type="date"
            value={formData.fecha}
            onChange={onChange}
            fullWidth
            required
            InputLabelProps={{ shrink: true }}
            variant="outlined"
            sx={{ backgroundColor: '#f9f9f9', borderRadius: 1 }}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Comentarios"
            name="comentarios"
            value={formData.comentarios}
            onChange={onChange}
            fullWidth
            multiline
            rows={3}
            variant="outlined"
            sx={{ backgroundColor: '#f9f9f9', borderRadius: 1 }}
          />
        </Grid>
      </Grid>
    </DialogContent>
    <DialogActions sx={{ p: 2, justifyContent: 'center', backgroundColor: '#fff' }}>
      <Button
        type="submit"
        onClick={onSubmit}
        variant="contained"
        sx={{
          backgroundColor: '#007bff',
          px: 4,
          py: 1.2,
          fontWeight: 'bold',
          borderRadius: 2,
          boxShadow: 2,
          transition: 'all 0.3s ease',
          '&:hover': { backgroundColor: '#0056b3', transform: 'scale(1.05)' },
        }}
      >
        {isEditing ? 'Actualizar Costo Fijo' : 'Registrar Costo Fijo'}
      </Button>
    </DialogActions>
  </Dialog>
);

// Componente para la tabla de costos fijos
const FixedCostTable = ({ costosFijos, handleEdit, handleDelete, handleEnviarACuenta }) => (
  <TableContainer
    component={Paper}
    sx={{ width: '100%', maxWidth: 1000, mb: 4, borderRadius: 2, boxShadow: 2, mx: 'auto' }}
  >
    <Table>
      <TableHead sx={{ backgroundColor: '#343a40' }}>
        <TableRow>
          <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Colaborador</TableCell>
          <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Puesto</TableCell>
          <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Monto USD</TableCell>
          <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Monto MXN</TableCell>
          <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Impuestos</TableCell>
          <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Comentarios</TableCell>
          <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Fecha</TableCell>
          <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Acciones</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {costosFijos.map((costo) => (
          <TableRow key={costo.id} sx={{ '&:hover': { backgroundColor: '#e9ecef' } }}>
            <TableCell>{costo.colaborador}</TableCell>
            <TableCell>{costo.puesto}</TableCell>
            <TableCell>{formatterUSD.format(costo.monto_usd)}</TableCell>
            <TableCell>{formatterMXN.format(costo.monto_mxn)}</TableCell>
            <TableCell>{formatterMXN.format(costo.impuestos_imss)}</TableCell>
            <TableCell>{costo.comentarios}</TableCell>
            <TableCell>{new Date(costo.fecha).toLocaleDateString('es-MX')}</TableCell>
            <TableCell>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Tooltip title="Enviar a Cuentas por Pagar">
                  <span>
                    <IconButton
                      onClick={() => handleEnviarACuenta(costo)}
                      disabled={costo.cuenta_creada}
                      sx={{
                        backgroundColor: costo.cuenta_creada ? 'gray' : '#ffc107',
                        color: '#fff',
                        '&:hover': { backgroundColor: costo.cuenta_creada ? 'gray' : '#e0a800' }
                      }}
                    >
                      <FontAwesomeIcon icon={faPaperPlane} />
                    </IconButton>
                  </span>
                </Tooltip>
                <Tooltip title="Editar">
                  <IconButton
                    onClick={() => handleEdit(costo)}
                    sx={{ backgroundColor: '#17a2b8', color: '#fff', '&:hover': { backgroundColor: '#138496' } }}
                  >
                    <FontAwesomeIcon icon={faEdit} />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Eliminar">
                  <IconButton
                    onClick={() => handleDelete(costo.id)}
                    sx={{ backgroundColor: '#dc3545', color: '#fff', '&:hover': { backgroundColor: '#c82333' } }}
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </IconButton>
                </Tooltip>
              </Box>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </TableContainer>
);

const CostosFijos = () => {
  const [costosFijos, setCostosFijos] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingCostoId, setEditingCostoId] = useState(null);
  const [formData, setFormData] = useState({
    colaborador: '',
    puesto: '',
    monto_usd: '',
    comentarios: '',
    fecha: '',
  });
  const [mesFiltro, setMesFiltro] = useState('');
  const tipoCambio = 20;
  const [porcentajeUtilidad, setPorcentajeUtilidad] = useState(40);
  const [resultadoUtilidad, setResultadoUtilidad] = useState(0);
  const [totalCostos, setTotalCostos] = useState(0);
  const [loading, setLoading] = useState(true);

  // Estado para notificaciones
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') return;
    setSnackbar({ ...snackbar, open: false });
  };

  useEffect(() => {
    fetchCostosFijos();
  }, [mesFiltro]);

  useEffect(() => {
    calcularUtilidad();
  }, [costosFijos, porcentajeUtilidad]);

  const fetchCostosFijos = async () => {
    setLoading(true);
    try {
      const response = await axios.get('https://sigma.runsolutions-services.com/api/costos-fijos', {
        params: { mes: mesFiltro },
      });
      const costos = response.data.map((costo) => ({
        ...costo,
        monto_mxn: parseFloat(costo.monto_mxn) || 0,
        monto_usd: parseFloat(costo.monto_usd) || 0,
        impuestos_imss: parseFloat(costo.impuestos_imss) || 0,
        cuenta_creada: costo.cuenta_creada, // nuevo campo para controlar el envío
      }));
      setCostosFijos(costos);
    } catch (error) {
      console.error('Error al obtener costos fijos:', error.response?.data || error.message);
      setSnackbar({ open: true, message: 'Error al obtener costos fijos.', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const toggleForm = () => {
    setShowForm((prev) => !prev);
    if (showForm) {
      setFormData({
        colaborador: '',
        puesto: '',
        monto_usd: '',
        comentarios: '',
        fecha: '',
      });
      setIsEditing(false);
      setEditingCostoId(null);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const monto_usd = parseFloat(formData.monto_usd) || 0;
    const monto_mxn = monto_usd * tipoCambio;
    const impuestos_imss = monto_mxn * 0.35;
    try {
      if (isEditing) {
        await axios.put(`https://sigma.runsolutions-services.com/api/costos-fijos/${editingCostoId}`, {
          ...formData,
          monto_usd,
          monto_mxn,
          impuestos_imss,
        });
        setSnackbar({ open: true, message: 'Costo fijo actualizado exitosamente.', severity: 'success' });
      } else {
        await axios.post('https://sigma.runsolutions-services.com/api/costos-fijos', {
          ...formData,
          monto_usd,
          monto_mxn,
          impuestos_imss,
        });
        setSnackbar({ open: true, message: 'Costo fijo registrado exitosamente.', severity: 'success' });
      }
      fetchCostosFijos();
      toggleForm();
    } catch (error) {
      console.error('Error al enviar el formulario:', error.response?.data || error.message);
      setSnackbar({ open: true, message: 'Error al enviar el formulario.', severity: 'error' });
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm('¿Estás seguro de que quieres eliminar este costo fijo?');
    if (!confirmDelete) return;
    try {
      await axios.delete(`https://sigma.runsolutions-services.com/api/costos-fijos/${id}`);
      setCostosFijos(prev => prev.filter(costo => costo.id !== id));
      setSnackbar({ open: true, message: 'Costo fijo eliminado exitosamente.', severity: 'success' });
    } catch (error) {
      console.error('Error al eliminar el costo fijo:', error.response?.data || error.message);
      setSnackbar({ open: true, message: 'Error al eliminar el costo fijo.', severity: 'error' });
    }
  };

  const handleEdit = (costo) => {
    setIsEditing(true);
    setEditingCostoId(costo.id);
    setFormData({
      colaborador: costo.colaborador,
      puesto: costo.puesto,
      monto_usd: costo.monto_usd,
      comentarios: costo.comentarios,
      fecha: costo.fecha,
    });
    setShowForm(true);
  };

  const handleEnviarACuenta = async (costo) => {
    if (costo.cuenta_creada) return;
    try {
      const response = await axios.post(`https://sigma.runsolutions-services.com/api/costos-fijos/${costo.id}/enviar`);
      setSnackbar({ open: true, message: response.data.message, severity: 'success' });
      // Actualizar el estado local para marcar este costo como enviado
      setCostosFijos(costosFijos.map(item => item.id === costo.id ? { ...item, cuenta_creada: 1 } : item));
    } catch (error) {
      console.error('Error al enviar a cuentas por pagar:', error.response?.data || error.message);
      setSnackbar({ open: true, message: 'Error al enviar a cuentas por pagar', severity: 'error' });
    }
  };

  const calcularUtilidad = () => {
    const total = costosFijos.reduce((acc, costo) => acc + (isNaN(costo.monto_mxn) ? 0 : costo.monto_mxn), 0);
    setTotalCostos(total);
    const utilidad = total * (porcentajeUtilidad / 100);
    setResultadoUtilidad(utilidad);
  };

  const dataGrafica =
    costosFijos.length > 0
      ? [
          {
            name: mesFiltro ? `Mes ${mesFiltro}` : 'Total',
            'Costos Fijos': totalCostos,
            'Costos Fijos + Utilidad': totalCostos + resultadoUtilidad,
          },
        ]
      : [];

  return (
    <Container sx={{ py: 4, backgroundColor: '#f0f2f5', minHeight: '100vh' }}>
      <Typography
        variant="h3"
        sx={{
          textAlign: 'center',
          mb: 4,
          color: 'var(--color-secondary, #e63946)',
          fontWeight: 'bold',
        }}
      >
        Costos Fijos
      </Typography>
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <ChartComponent dataGrafica={dataGrafica} totalCostos={totalCostos} />
          <TotalsComponent
            totalCostos={totalCostos}
            porcentajeUtilidad={porcentajeUtilidad}
            setPorcentajeUtilidad={setPorcentajeUtilidad}
            resultadoUtilidad={resultadoUtilidad}
          />
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
            <Button
              variant="contained"
              onClick={toggleForm}
              sx={{
                backgroundColor: '#28a745',
                color: '#fff',
                px: 3,
                py: 1,
                fontSize: '1rem',
                fontWeight: 'bold',
                borderRadius: 2,
                boxShadow: 2,
                transition: 'background 0.3s',
                '&:hover': { backgroundColor: '#218838' },
              }}
            >
              {showForm ? 'Cerrar formulario' : 'Registrar costo fijo'}
            </Button>
          </Box>
          <FixedCostFormDialog
            open={showForm}
            onClose={toggleForm}
            isEditing={isEditing}
            formData={formData}
            onChange={handleChange}
            onSubmit={handleSubmit}
          />
          <FixedCostTable
            costosFijos={costosFijos}
            handleEdit={handleEdit}
            handleDelete={handleDelete}
            handleEnviarACuenta={handleEnviarACuenta}
          />
        </>
      )}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        TransitionComponent={SlideTransition}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbar.severity} variant="filled" sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default CostosFijos;
