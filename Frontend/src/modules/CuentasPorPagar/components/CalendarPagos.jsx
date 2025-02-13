// src/modules/CuentasPorPagar/components/CalendarPagos.jsx
import React from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './CalendarPagos.css'; // Conserva los estilos para react-calendar y pending-payment
import { Box, Typography } from '@mui/material';

const CalendarPagos = ({ cuentas, onDateSelect }) => {
  // Filtrar cuentas pendientes (aquellas que no están pagadas)
  const pendientes = cuentas.filter(c => !c.pagado);

  // Crear un conjunto de fechas (formato YYYY-MM-DD) con pagos pendientes
  const pendingDates = new Set(
    pendientes.map(c => new Date(c.fecha).toISOString().split('T')[0])
  );

  // Asignar una clase a cada casilla del calendario si hay pagos pendientes ese día
  const tileClassName = ({ date, view }) => {
    if (view === 'month') {
      const dateString = date.toISOString().split('T')[0];
      if (pendingDates.has(dateString)) {
        return 'pending-payment';
      }
    }
    return null;
  };

  // Al hacer clic en un día, si ese día tiene pagos pendientes, se invoca el callback
  const handleClickDay = (date) => {
    const dateString = date.toISOString().split('T')[0];
    if (pendingDates.has(dateString)) {
      onDateSelect(dateString);
    }
  };

  return (
    <Box
      sx={{
        maxWidth: 550,
        mx: 'auto',
        p: 3,
        background: 'linear-gradient(90deg, #ff6b6b, #f94d9a)', // Degradado rojo similar al que usas
        borderRadius: 2,
        boxShadow: 3,
        mb: 4,
      }}
    >
      <Typography
        variant="h6"
        sx={{ textAlign: 'center', color: '#fff', mb: 2, fontWeight: 'bold' }}
      >
        Calendario de Pagos Pendientes
      </Typography>
      <Calendar tileClassName={tileClassName} onClickDay={handleClickDay} />
    </Box>
  );
};

export default CalendarPagos;
