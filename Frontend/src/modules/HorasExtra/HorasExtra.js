import React, { useState } from "react";
import "./HorasExtra.css"; // Importar los estilos

const HorasExtra = () => {
  const [registros, setRegistros] = useState([]); // Almacena los registros
  const [horaInicio, setHoraInicio] = useState(null); // Almacena la hora de inicio
  const [horaFin, setHoraFin] = useState(null); // Almacena la hora de fin
  const [enProceso, setEnProceso] = useState(false); // Determina si hay una hora extra en curso

  // Función para iniciar una hora extra
  const iniciarHoraExtra = () => {
    const horaActual = new Date();
    setHoraInicio(horaActual);
    setEnProceso(true);
  };

  // Función para finalizar una hora extra
  const finalizarHoraExtra = () => {
    const horaActual = new Date();
    setHoraFin(horaActual);
    setEnProceso(false);

    // Calcular duración
    const duracion = Math.abs(horaActual - horaInicio);
    const horas = Math.floor(duracion / 3600000); // Horas trabajadas
    const minutos = Math.floor((duracion % 3600000) / 60000); // Minutos trabajados

    // Añadir el registro a la tabla
    setRegistros([
      ...registros,
      {
        id: registros.length + 1,
        horaInicio: horaInicio.toLocaleString(),
        horaFin: horaActual.toLocaleString(),
        duracion: `${horas}h ${minutos}m`,
      },
    ]);

    // Resetear los estados
    setHoraInicio(null);
    setHoraFin(null);
  };

  return (
    <div className="horas-extra-container">
      <h1>Gestión de Horas Extra</h1>
      <div className="botones">
        {enProceso ? (
          <button className="boton boton-terminar" onClick={finalizarHoraExtra}>
            Marcar como terminado
          </button>
        ) : (
          <button className="boton boton-iniciar" onClick={iniciarHoraExtra}>
            Iniciar hora extra
          </button>
        )}
      </div>
      <table className="tabla">
        <thead>
          <tr>
            <th>#</th>
            <th>Hora de Inicio</th>
            <th>Hora de Fin</th>
            <th>Duración</th>
          </tr>
        </thead>
        <tbody>
          {registros.map((registro) => (
            <tr key={registro.id}>
              <td>{registro.id}</td>
              <td>{registro.horaInicio}</td>
              <td>{registro.horaFin}</td>
              <td>{registro.duracion}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default HorasExtra;