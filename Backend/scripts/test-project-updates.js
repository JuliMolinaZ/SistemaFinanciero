const mysql = require('mysql2/promise');
require('dotenv').config();

async function testProjectUpdates() {
  let connection;

  try {

    // Crear conexión a la base de datos
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'sistema_financiero',
      port: process.env.DB_PORT || 3306
    });

    // 1. Verificar estado actual de un proyecto

    const [currentProject] = await connection.execute(`
      SELECT 
        id, 
        nombre, 
        phase_id, 
        estado, 
        descripcion
      FROM projects
      LIMIT 1
    `);

    if (currentProject.length === 0) {

      return;
    }

    const project = currentProject[0];

    // 2. Verificar fases disponibles

    const [phases] = await connection.execute(`
      SELECT id, nombre, descripcion
      FROM phases
      ORDER BY id
    `);

    if (phases.length === 0) {

      return;
    }

    phases.forEach(phase => {

    });

    // 3. Probar actualización de fase

    const newPhaseId = phases[0].id; // Usar la primera fase disponible
    
    if (project.phase_id !== newPhaseId) {

      const [updateResult] = await connection.execute(`
        UPDATE projects
        SET phase_id = ?, updated_at = NOW()
        WHERE id = ?
      `, [newPhaseId, project.id]);

      if (updateResult.affectedRows > 0) {

      } else {

      }
    } else {

    }

    // 4. Probar actualización de estado

    const newEstado = 'en_progreso';
    
    if (project.estado !== newEstado) {

      const [updateResult] = await connection.execute(`
        UPDATE projects
        SET estado = ?, updated_at = NOW()
        WHERE id = ?
      `, [newEstado, project.id]);

      if (updateResult.affectedRows > 0) {

      } else {

      }
    } else {

    }

    // 5. Verificar cambios realizados

    const [updatedProject] = await connection.execute(`
      SELECT 
        id, 
        nombre, 
        phase_id, 
        estado, 
        descripcion,
        updated_at
      FROM projects
      WHERE id = ?
    `, [project.id]);

    if (updatedProject.length > 0) {
      const updated = updatedProject[0];

    }

    // 6. Probar relación con fases

    const [projectWithPhase] = await connection.execute(`
      SELECT 
        p.id,
        p.nombre as proyecto_nombre,
        p.phase_id,
        p.estado,
        ph.nombre as fase_nombre,
        ph.descripcion as fase_descripcion
      FROM projects p
      LEFT JOIN phases ph ON p.phase_id = ph.id
      WHERE p.id = ?
    `, [project.id]);

    if (projectWithPhase.length > 0) {
      const projectPhase = projectWithPhase[0];

    }

  } catch (error) {
    console.error('❌ Error durante las pruebas:', error);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();

    }
  }
}

// Ejecutar las pruebas
testProjectUpdates();
