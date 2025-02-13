// src/modules/CuentasPorPagar/components/TablaCuentas.jsx
import React from 'react';
import {
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  IconButton,
  Tooltip,
  Typography,
  Box,
} from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faDollarSign, faPlus } from '@fortawesome/free-solid-svg-icons';

const TablaCuentas = ({
  cuentas,
  proveedores,
  formatoMoneda,
  handleAbrirPagoModal,
  handleTogglePagado,
  handleEdit,
  handleDelete,
}) => {
  return (
    <TableContainer
      component={Paper}
      sx={{
        boxShadow: 2,
        borderRadius: 2,
        mt: 2,
        backgroundColor: 'grey.50',
      }}
    >
      <Table>
        <TableHead sx={{ backgroundColor: 'black' }}>
          <TableRow>
            <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>Concepto</TableCell>
            <TableCell sx={{ fontWeight: 'bold', color: 'white' }} align="right">
              Monto Neto
            </TableCell>
            <TableCell sx={{ fontWeight: 'bold', color: 'white' }} align="right">
              Monto con IVA
            </TableCell>
            <TableCell sx={{ fontWeight: 'bold', color: 'white' }} align="right">
              Pagos Parciales
            </TableCell>
            <TableCell sx={{ fontWeight: 'bold', color: 'white' }} align="right">
              Restante
            </TableCell>
            <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>Categoría</TableCell>
            <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>Proveedor</TableCell>
            <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>Fecha</TableCell>
            <TableCell sx={{ fontWeight: 'bold', color: 'white' }} align="center">
              Pagado
            </TableCell>
            <TableCell sx={{ fontWeight: 'bold', color: 'white' }} align="center">
              Acciones
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {cuentas.map((c) => {
            const pagosParciales = parseFloat(c.pagos_parciales || 0);
            const totalConIVA = parseFloat(c.monto_con_iva || 0);
            const restante = totalConIVA - pagosParciales;
            return (
              <TableRow
                key={c.id}
                sx={{
                  backgroundColor: c.pagado ? '#81c784' : '#fff176',
                  '&:hover': {
                    backgroundColor: c.pagado ? '#66bb6a' : '#ffee58',
                  },
                }}
              >
                <TableCell>{c.concepto}</TableCell>
                <TableCell align="right">{formatoMoneda(c.monto_neto)}</TableCell>
                <TableCell align="right">{formatoMoneda(c.monto_con_iva)}</TableCell>
                <TableCell align="right">{formatoMoneda(pagosParciales)}</TableCell>
                <TableCell align="right">{formatoMoneda(restante)}</TableCell>
                <TableCell>{c.categoria}</TableCell>
                <TableCell>
                  {proveedores.find((p) => p.id === c.proveedor_id)?.nombre || 'N/A'}
                </TableCell>
                <TableCell>{new Date(c.fecha).toLocaleDateString()}</TableCell>
                <TableCell align="center">{c.pagado ? 'Sí' : 'No'}</TableCell>
                <TableCell align="center">
                  <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                    <Tooltip title="Agregar Pago Parcial">
                      <IconButton
                        onClick={() => handleAbrirPagoModal(c)}
                        size="small"
                        sx={{
                          backgroundColor: '#64b5f6',
                          borderRadius: 1,
                          boxShadow: 1,
                          color: 'white',
                          '&:hover': { backgroundColor: '#42a5f5' },
                        }}
                      >
                        <FontAwesomeIcon icon={faPlus} />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Marcar como Pagado">
                      <IconButton
                        onClick={() => handleTogglePagado(c.id)}
                        size="small"
                        sx={{
                          backgroundColor: '#66bb6a',
                          borderRadius: 1,
                          boxShadow: 1,
                          color: 'white',
                          '&:hover': { backgroundColor: '#4caf50' },
                        }}
                      >
                        <FontAwesomeIcon icon={faDollarSign} />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Editar">
                      <IconButton
                        onClick={() => handleEdit(c.id)}
                        size="small"
                        sx={{
                          backgroundColor: '#ffb74d',
                          borderRadius: 1,
                          boxShadow: 1,
                          color: 'white',
                          '&:hover': { backgroundColor: '#ffa726' },
                        }}
                      >
                        <FontAwesomeIcon icon={faEdit} />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Eliminar">
                      <IconButton
                        onClick={() => handleDelete(c.id)}
                        size="small"
                        sx={{
                          backgroundColor: '#e57373',
                          borderRadius: 1,
                          boxShadow: 1,
                          color: 'white',
                          '&:hover': { backgroundColor: '#ef5350' },
                        }}
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
      {cuentas.length === 0 && (
        <Box sx={{ p: 2, textAlign: 'center' }}>
          <Typography variant="subtitle1">No hay registros para mostrar</Typography>
        </Box>
      )}
    </TableContainer>
  );
};

export default React.memo(TablaCuentas);

