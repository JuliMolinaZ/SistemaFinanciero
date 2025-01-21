// src/modules/Permisos/PermisosModule.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './PermisosModule.css';

const PermisosModule = () => {
  const [permisos, setPermisos] = useState([]);

  useEffect(() => {
    // Obtener la lista de permisos desde el backend
    const fetchPermisos = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/permisos');
        setPermisos(response.data);
      } catch (error) {
        console.error('Error al obtener los permisos:', error.response?.data || error.message);
      }
    };

    fetchPermisos();
  }, []);

  const togglePermiso = async (modulo) => {
    try {
      // Encuentra el permiso actual
      const permiso = permisos.find((p) => p.modulo === modulo);
      const nuevoEstado = !permiso.acceso_administrador;

      // Actualiza el permiso en el backend
      await axios.put(`http://localhost:5000/api/permisos/${modulo}`, {
        acceso_administrador: nuevoEstado,
      });

      // Actualiza el estado local
      setPermisos((prevPermisos) =>
        prevPermisos.map((p) =>
          p.modulo === modulo ? { ...p, acceso_administrador: nuevoEstado } : p
        )
      );
    } catch (error) {
      console.error('Error al actualizar el permiso:', error.response?.data || error.message);
    }
  };

  return (
    <div className="permisos-module">
      <h2>Administración de Permisos</h2>
      <table className="permisos-table">
        <thead>
          <tr>
            <th>Módulo</th>
            <th>Acceso Administrador</th>
          </tr>
        </thead>
        <tbody>
          {permisos.map((permiso) => (
            <tr key={permiso.modulo}>
              <td>{permiso.modulo}</td>
              <td>
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={permiso.acceso_administrador}
                    onChange={() => togglePermiso(permiso.modulo)}
                  />
                  <span className="slider"></span>
                </label>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PermisosModule;


