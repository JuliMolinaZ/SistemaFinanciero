// src/modules/Permisos/PermisosModule.js

import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import './PermisosModule.css';
import { GlobalContext } from '../../context/GlobalState';

const PermisosModule = () => {
  const { permisos, setPermisos } = useContext(GlobalContext);
  const [loading, setLoading] = useState(true);

  // Lee la variable de entorno (si no existe, usar "http://localhost:5000")
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  useEffect(() => {
    // Obtener la lista de permisos desde el backend
    const fetchPermisos = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/permisos`);
        setPermisos(response.data);
      } catch (error) {
        console.error('Error al obtener los permisos:', error.response?.data || error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPermisos();
  }, [API_URL, setPermisos]);

  const togglePermiso = async (modulo) => {
    try {
      // Encuentra el permiso actual
      const permiso = permisos.find((p) => p.modulo === modulo);
      const nuevoEstado = !permiso.acceso_administrador;

      // Actualiza el permiso en el backend
      await axios.put(`${API_URL}/api/permisos/${modulo}`, {
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

  if (loading) {
    return <div>Cargando permisos...</div>;
  }

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




