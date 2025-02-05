// src/hooks/useProjectsData.js
import { useState, useEffect } from 'react';
import axios from 'axios';

const useProjectsData = () => {
  const [totalProjects, setTotalProjects] = useState(0);
  const [projectsStatus, setProjectsStatus] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProjectsData = async () => {
      try {
        // Ajusta la URL según la configuración de tu API
        const response = await axios.get('/api/projects');
        const projects = response.data;

        // Establece el total de proyectos
        setTotalProjects(projects.length);

        // Agrupa proyectos por su estado; se asume que la propiedad es "status"
        const statusCount = projects.reduce((acc, project) => {
          const status = project.status || 'Sin definir';
          acc[status] = (acc[status] || 0) + 1;
          return acc;
        }, {});
        setProjectsStatus(statusCount);
      } catch (err) {
        console.error('Error al obtener datos de proyectos:', err);
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjectsData();
  }, []);

  return { totalProjects, projectsStatus, isLoading, error };
};

export default useProjectsData;
