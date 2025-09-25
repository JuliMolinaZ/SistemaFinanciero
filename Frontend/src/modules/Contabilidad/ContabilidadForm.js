// src/modules/Contabilidad/ContabilidadForm.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNotify } from '../../hooks/useNotify.js';
import {
  Container,
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Tooltip,
  CircularProgress,
  Checkbox,
} from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faEdit,
  faTrash,
  faFilePdf,
  faFileExcel,
  faClose,
} from '@fortawesome/free-solid-svg-icons';

// Configuración de la URL base para la API
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8765';

// Formateador de moneda MXN
const formatCurrency = (value) =>
  new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(value);

// =====================
// COMPONENTE: TitleHeader
// =====================
const TitleHeader = () => {

  return (
    <Typography
      variant="h3"
      component="h1"
      sx={{
        textAlign: 'center',
        mb: 4,
        color: 'var(--color-titulo, #e63946)',
        fontWeight: 'bold',
        textShadow: '0 2px 4px rgba(0,0,0,0.2)',
      }}
    >
      Movimientos Contables
    </Typography>
  );
};

// =====================
// COMPONENTE: FormDialog
// =====================
const FormDialog = ({
  open,
  onClose,
  isEditing,
  movimiento,
  onChange,
  onSubmit,
  error,
}) => {

  return (
    <Dialog open={open} onClose={() => { onClose(); }} fullWidth maxWidth="sm">
      {/* Todo el contenido está envuelto en un form */}
      <form
        onSubmit={(e) => {

          onSubmit(e);
        }}
      >
        <DialogTitle
          sx={{
            p: 2,
            background: 'linear-gradient(90deg, #ff6b6b, #f94d9a)',
            color: '#fff',
            fontWeight: 'bold',
            position: 'relative',
          }}
        >
          {isEditing ? 'Actualizar Movimiento' : 'Registrar Movimiento'}
          <IconButton
            onClick={() => { onClose(); }}
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
        <DialogContent sx={{ p: 3, backgroundColor: '#fff' }}>
          {error && (
            <Typography variant="body2" sx={{ color: 'var(--color-titulo, #e63946)', mb: 2, textAlign: 'center' }}>
              {error}
            </Typography>
          )}
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Fecha"
                name="fecha"
                type="date"
                value={movimiento.fecha}
                onChange={(e) => {

                  onChange(e);
                }}
                fullWidth
                required
                InputLabelProps={{ shrink: true }}
                variant="outlined"
                sx={{ backgroundColor: '#f9f9f9', borderRadius: 1 }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Concepto"
                name="concepto"
                value={movimiento.concepto}
                onChange={(e) => {

                  onChange(e);
                }}
                fullWidth
                required
                variant="outlined"
                sx={{ backgroundColor: '#f9f9f9', borderRadius: 1 }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Cargo"
                name="cargo"
                type="number"
                value={movimiento.cargo}
                onChange={(e) => {

                  onChange(e);
                }}
                fullWidth
                inputProps={{ min: "0", step: "0.01" }}
                disabled={movimiento.tipo !== 'cargo'}
                variant="outlined"
                sx={{ backgroundColor: '#f9f9f9', borderRadius: 1 }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Abono"
                name="abono"
                type="number"
                value={movimiento.abono}
                onChange={(e) => {

                  onChange(e);
                }}
                fullWidth
                inputProps={{ min: "0", step: "0.01" }}
                disabled={movimiento.tipo !== 'abono'}
                variant="outlined"
                sx={{ backgroundColor: '#f9f9f9', borderRadius: 1 }}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel id="tipo-label">Tipo</InputLabel>
                <Select
                  labelId="tipo-label"
                  name="tipo"
                  value={movimiento.tipo}
                  label="Tipo"
                  onChange={(e) => {

                    onChange(e);
                  }}
                >
                  <MenuItem value="cargo">Cargo</MenuItem>
                  <MenuItem value="abono">Abono</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Notas"
                name="notas"
                value={movimiento.notas}
                onChange={(e) => {

                  onChange(e);
                }}
                fullWidth
                multiline
                rows={3}
                variant="outlined"
                sx={{ backgroundColor: '#f9f9f9', borderRadius: 1 }}
              />
            </Grid>
            {/* Opciones para subir archivos */}
            <Grid item xs={12}>
              <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                Factura PDF:
              </Typography>
              <Button variant="outlined" component="label">
                Seleccionar Archivo
                <input
                  type="file"
                  name="facturaPDF"
                  accept="application/pdf"
                  hidden
                  onChange={(e) => {

                    onChange(e);
                  }}
                />
              </Button>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                Factura XML, XLSX o CSV:
              </Typography>
              <Button variant="outlined" component="label">
                Seleccionar Archivo
                <input
                  type="file"
                  name="facturaXML"
                  accept=".xml,.xlsx,.csv"
                  hidden
                  onChange={(e) => {

                    onChange(e);
                  }}
                />
              </Button>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 2, justifyContent: 'center', backgroundColor: '#fff' }}>
          <Button
            type="submit"
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
            {isEditing ? 'Actualizar Movimiento' : 'Registrar Movimiento'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

// =====================
// COMPONENTE: MovementsTable
// =====================
const MovementsTable = ({ movimientos, selectedMovimientos, handleSelectAll, handleSelectMovement, handleEdit, handleDelete }) => {
  // Asegurar que movimientos sea siempre un array
  const movimientosArray = Array.isArray(movimientos) ? movimientos : [];

  return (
    <TableContainer component={Paper} sx={{ width: '100%', maxWidth: 1100, mt: 4, mb: 6, borderRadius: 2, boxShadow: 2, mx: 'auto' }}>
      <Table>
        <TableHead sx={{ backgroundColor: 'var(--color-titulo, #e63946)' }}>
          <TableRow>
            <TableCell padding="checkbox">
              <Checkbox
                color="primary"
                checked={movimientosArray.length > 0 && selectedMovimientos.length === movimientosArray.length}
                onChange={(e) => {

                  handleSelectAll(e.target.checked);
                }}
              />
            </TableCell>
            <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Fecha</TableCell>
            <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Concepto</TableCell>
            <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Cargo</TableCell>
            <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Abono</TableCell>
            <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Monto</TableCell>
            <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Saldo</TableCell>
            <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Status</TableCell>
            <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Notas</TableCell>
            <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>PDF</TableCell>
            <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Excel/XML</TableCell>
            <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Acciones</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {movimientosArray.map((m) => {

            return (
              <TableRow key={m.id} sx={{ '&:hover': { backgroundColor: '#fefefe' } }}>
                <TableCell padding="checkbox">
                  <Checkbox
                    color="primary"
                    checked={selectedMovimientos.includes(m.id)}
                    onChange={(e) => {

                      handleSelectMovement(m.id, e.target.checked);
                    }}
                  />
                </TableCell>
                <TableCell>{m.fecha ? new Date(m.fecha).toLocaleDateString('es-MX') : 'Sin fecha'}</TableCell>
                <TableCell>{m.concepto}</TableCell>
                <TableCell>{m.cargo > 0 ? formatCurrency(m.cargo) : '-'}</TableCell>
                <TableCell>{m.abono > 0 ? formatCurrency(m.abono) : '-'}</TableCell>
                <TableCell>{formatCurrency(m.monto)}</TableCell>
                <TableCell>{m.saldo ? formatCurrency(m.saldo) : formatCurrency(0)}</TableCell>
                <TableCell>{m.status}</TableCell>
                <TableCell>{m.notas}</TableCell>
                <TableCell>
                  {m.facturaPDF ? (
                    <a href={`${API_URL}/uploads/${m.facturaPDF}`} target="_blank" rel="noopener noreferrer">
                      <IconButton sx={{ backgroundColor: '#d32f2f', color: '#fff', '&:hover': { backgroundColor: '#b71c1c' } }}>
                        <FontAwesomeIcon icon={faFilePdf} />
                      </IconButton>
                    </a>
                  ) : (
                    <IconButton disabled sx={{ opacity: 0.5 }}>
                      <FontAwesomeIcon icon={faFilePdf} />
                    </IconButton>
                  )}
                </TableCell>
                <TableCell>
                  {m.facturaXML ? (
                    <a href={`${API_URL}/uploads/${m.facturaXML}`} target="_blank" rel="noopener noreferrer">
                      <IconButton sx={{ backgroundColor: '#388e3c', color: '#fff', '&:hover': { backgroundColor: '#2e7d32' } }}>
                        <FontAwesomeIcon icon={faFileExcel} />
                      </IconButton>
                    </a>
                  ) : (
                    <IconButton disabled sx={{ opacity: 0.5 }}>
                      <FontAwesomeIcon icon={faFileExcel} />
                    </IconButton>
                  )}
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                    <Tooltip title="Editar">
                      <IconButton
                        onClick={() => {

                          handleEdit(m.id);
                        }}
                        sx={{ backgroundColor: '#17a2b8', color: '#fff', '&:hover': { backgroundColor: '#138496' } }}
                      >
                        <FontAwesomeIcon icon={faEdit} />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Eliminar">
                      <IconButton
                        onClick={() => {

                          handleDelete(m.id);
                        }}
                        sx={{ backgroundColor: '#e63946', color: '#fff', '&:hover': { backgroundColor: '#c12c33' } }}
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

// =====================
// COMPONENTE: ContabilidadForm (Principal)
// =====================
const ContabilidadForm = () => {

  const notify = useNotify();
  const [movimientos, setMovimientos] = useState([]);
  const [movimiento, setMovimiento] = useState({
    fecha: '',
    concepto: '',
    cargo: '',
    abono: '',
    notas: '',
    tipo: 'cargo',
    facturaPDF: null,
    facturaXML: null,
  });
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedMovimientos, setSelectedMovimientos] = useState([]);

  useEffect(() => {

    fetchMovimientos();
  }, []);

  const fetchMovimientos = async () => {

    try {
      const response = await axios.get(`${API_URL}/api/contabilidad`);
      // La API devuelve {success: true, data: [...], pagination: {...}}
      const movimientosData = response.data.data || [];
      setMovimientos(movimientosData);

    } catch (error) {
      console.error(">>> fetchMovimientos: Error al obtener movimientos:", error);
      notify.error({
        title: 'Error al cargar movimientos',
        description: 'No se pudieron obtener los movimientos contables',
        error
      });
    } finally {
      setLoading(false);

    }
  };

  const resetFormulario = () => {

    setIsEditing(false);
    setEditingId(null);
    setMovimiento({
      fecha: '',
      concepto: '',
      cargo: '',
      abono: '',
      notas: '',
      tipo: 'cargo',
      facturaPDF: null,
      facturaXML: null,
    });
    setError('');
  };

  const toggleForm = () => {

    if (showForm) {
      resetFormulario();
    }
    setShowForm((prev) => !prev);

  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === 'facturaPDF' || name === 'facturaXML') {
      setMovimiento((prev) => ({ ...prev, [name]: files[0] }));
    } else if (name === 'tipo') {
      setMovimiento((prev) => ({ ...prev, tipo: value, cargo: '', abono: '' }));
    } else {
      setMovimiento((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError('');

    const cargo = parseFloat(movimiento.cargo) || 0;
    const abono = parseFloat(movimiento.abono) || 0;

    if ((cargo > 0 && abono > 0) || (cargo === 0 && abono === 0)) {
      console.error(">>> handleSubmit: Error de validación. Ingrese solo un valor en 'Cargo' o 'Abono' y mayor a 0.");
      setError('Debe ingresar solo un valor en "Cargo" o "Abono" y mayor a 0.');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('fecha', movimiento.fecha);
      formData.append('concepto', movimiento.concepto);
      formData.append('cargo', cargo);
      formData.append('abono', abono);
      formData.append('tipo', movimiento.tipo);
      formData.append('notas', movimiento.notas || '');
      if (movimiento.facturaPDF) formData.append('facturaPDF', movimiento.facturaPDF);
      if (movimiento.facturaXML) formData.append('facturaXML', movimiento.facturaXML);

      if (isEditing) {

        await axios.put(`${API_URL}/api/contabilidad/${editingId}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      } else {

        await axios.post(`${API_URL}/api/contabilidad`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      }

      resetFormulario();
      fetchMovimientos();
      setShowForm(false);
      setSelectedMovimientos([]);
    } catch (error) {
      console.error(">>> handleSubmit: Error al registrar movimiento:", error);
      setError("Ocurrió un error al procesar la solicitud.");
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const yyyy = date.getFullYear();
    let mm = date.getMonth() + 1;
    let dd = date.getDate();
    if (mm < 10) mm = `0${mm}`;
    if (dd < 10) dd = `0${dd}`;
    return `${yyyy}-${mm}-${dd}`;
  };

  const handleEdit = (id) => {
    const movToEdit = movimientos.find((m) => m.id === id);

    setMovimiento({
      fecha: formatDate(movToEdit.fecha),
      concepto: movToEdit.concepto || '',
      cargo: movToEdit.cargo ? movToEdit.cargo.toString() : '',
      abono: movToEdit.abono ? movToEdit.abono.toString() : '',
      notas: movToEdit.notas || '',
      tipo: movToEdit.tipo || 'cargo',
      facturaPDF: null,
      facturaXML: null,
    });
    setIsEditing(true);
    setEditingId(id);
    setShowForm(true);
    setError('');
  };

  const handleDelete = async (id) => {

    if (!window.confirm("¿Seguro que deseas eliminar este movimiento?")) {

      return;
    }
    try {
      await axios.delete(`${API_URL}/api/contabilidad/${id}`);

      setMovimientos((prev) => prev.filter((m) => m.id !== id));
      setSelectedMovimientos((prev) => prev.filter((selId) => selId !== id));
    } catch (error) {
      console.error(">>> handleDelete: Error al eliminar movimiento:", error);
      notify.error({
        title: 'Error al eliminar',
        description: 'No se pudo eliminar el movimiento contable',
        error
      });
    }
  };

  // Manejo de selección de movimientos
  const handleSelectMovement = (id, isSelected) => {

    if (isSelected) {
      setSelectedMovimientos((prev) => [...prev, id]);
    } else {
      setSelectedMovimientos((prev) => prev.filter((selId) => selId !== id));
    }
  };

  const handleSelectAll = (isSelected) => {

    if (isSelected) {
      const allIds = movimientos.map((m) => m.id);
      setSelectedMovimientos(allIds);
    } else {
      setSelectedMovimientos([]);
    }
  };

  // Descargar XLS
  const downloadXLS = () => {
    let url = `${API_URL}/api/contabilidad/download/xls`;
    if (selectedMovimientos.length > 0) {
      url += `?ids=${selectedMovimientos.join(',')}`;
    }

    window.open(url, '_blank');
  };

  return (
    <Container sx={{ py: 4, backgroundColor: 'var(--color-fondo, #f5f5f5)', minHeight: '100vh' }}>
      <TitleHeader />
      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 2 }}>
        <Button
          onClick={() => {

            toggleForm();
          }}
          variant="contained"
          sx={{
            backgroundColor: 'var(--color-titulo, #e63946)',
            color: '#fff',
            fontWeight: 600,
            px: 2,
            py: 1,
            borderRadius: 2,
            transition: 'background 0.3s, transform 0.3s',
            '&:hover': { backgroundColor: 'var(--color-hover-rojo, #c12c33)', transform: 'scale(1.05)' },
          }}
        >
          {showForm ? 'Cerrar formulario' : 'Registrar Movimiento'}
        </Button>
        <Button
          onClick={downloadXLS}
          variant="contained"
          sx={{
            backgroundColor: '#007bff',
            color: '#fff',
            fontWeight: 600,
            px: 2,
            py: 1,
            borderRadius: 2,
            transition: 'background 0.3s, transform 0.3s',
            '&:hover': { backgroundColor: '#0056b3', transform: 'scale(1.05)' },
          }}
        >
          Descargar XLS
        </Button>
      </Box>
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <FormDialog
            open={showForm}
            onClose={toggleForm}
            isEditing={isEditing}
            movimiento={movimiento}
            onChange={handleChange}
            onSubmit={handleSubmit}
            error={error}
          />
          <MovementsTable
            movimientos={movimientos}
            selectedMovimientos={selectedMovimientos}
            handleSelectAll={handleSelectAll}
            handleSelectMovement={handleSelectMovement}
            handleEdit={handleEdit}
            handleDelete={handleDelete}
          />
        </>
      )}
    </Container>
  );
};

export default ContabilidadForm;
