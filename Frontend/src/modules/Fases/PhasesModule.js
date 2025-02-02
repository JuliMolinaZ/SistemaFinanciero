// src/modules/Fases/PhasesModule.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PhasesModule = () => {
  const [phases, setPhases] = useState([]);

  useEffect(() => {
    fetchPhases();
  }, []);

  const fetchPhases = async () => {
    try {
      const response = await axios.get('https://sigma.runsolutions-services.com/api/phases');
      setPhases(response.data);
    } catch (error) {
      console.error('Error al obtener fases:', error);
    }
  };

  return (
    <section>
      <h2>Fases Predefinidas</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Descripción</th>
          </tr>
        </thead>
        <tbody>
          {phases.map((phase) => (
            <tr key={phase.id}>
              <td>{phase.id}</td>
              <td>{phase.nombre}</td>
              <td>{phase.descripcion}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
};

export default PhasesModule;