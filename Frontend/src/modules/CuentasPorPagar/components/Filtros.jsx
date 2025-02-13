// src/modules/CuentasPorPagar/components/Filtros.jsx
import React from 'react';
import {
  Box,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Button,
} from '@mui/material';

const Filtros = ({
  filtroMes,
  setFiltroMes,
  fechaInicio,
  setFechaInicio,
  fechaFin,
  setFechaFin,
  estadoFiltro,
  setEstadoFiltro,
  handleClearFilters,
}) => {
  return (
    <Box
      sx={{
        backgroundColor: '#fff',
        border: '1px solid #ddd',
        borderRadius: 2,
        boxShadow: 1,
        p: 3,
        mb: 3,
      }}
    >
      <Grid container spacing={2} alignItems="center">
        {/* Primera fila: Selección de Mes y Estado */}
        <Grid item xs={12} md={6}>
          <FormControl fullWidth variant="outlined">
            <InputLabel id="filtroMes-label">Mes</InputLabel>
            <Select
              labelId="filtroMes-label"
              id="filtroMes"
              label="Mes"
              value={filtroMes}
              onChange={(e) => setFiltroMes(e.target.value)}
            >
              <MenuItem value="">
                <em>Todos</em>
              </MenuItem>
              {Array.from({ length: 12 }, (_, i) => (
                <MenuItem key={i + 1} value={i + 1}>
                  {new Date(0, i).toLocaleString('default', { month: 'short' })}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth variant="outlined">
            <InputLabel id="estadoFiltro-label">Estado</InputLabel>
            <Select
              labelId="estadoFiltro-label"
              id="estadoFiltro"
              label="Estado"
              value={estadoFiltro}
              onChange={(e) => setEstadoFiltro(e.target.value)}
            >
              <MenuItem value="">
                <em>Todos</em>
              </MenuItem>
              <MenuItem value="pagadas">Pagadas</MenuItem>
              <MenuItem value="pendientes">Pendientes</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        {/* Segunda fila: Fechas Desde y Hasta */}
        <Grid item xs={12} md={6}>
          <TextField
            label="Desde"
            type="date"
            fullWidth
            value={fechaInicio}
            onChange={(e) => setFechaInicio(e.target.value)}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            label="Hasta"
            type="date"
            fullWidth
            value={fechaFin}
            onChange={(e) => setFechaFin(e.target.value)}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>

        {/* Tercera fila: Botón para limpiar filtros */}
        <Grid item xs={12} sx={{ textAlign: 'center', mt: 1 }}>
          <Button variant="outlined" color="primary" onClick={handleClearFilters}>
            Borrar
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default React.memo(Filtros);



