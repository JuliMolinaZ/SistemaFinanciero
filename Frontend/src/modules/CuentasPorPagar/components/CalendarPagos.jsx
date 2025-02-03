// src/modules/CuentasPorPagar/components/CalendarPagos.jsx
import React from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './CalendarPagos.css';

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

  // Cuando se hace clic en un día, si ese día tiene pagos pendientes, se invoca el callback
  const handleClickDay = (date) => {
    const dateString = date.toISOString().split('T')[0];
    if (pendingDates.has(dateString)) {
      onDateSelect(dateString);
    }
  };

  return (
    <div className="calendar-container">
      <Calendar 
        tileClassName={tileClassName} 
        onClickDay={handleClickDay} 
      />
    </div>
  );
};

export default CalendarPagos;
