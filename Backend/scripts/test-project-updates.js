const mysql = require('mysql2/promise');
require('dotenv').config();

async function testProjectUpdates() {
  let connection;

  try {
    console.log('🧪 Probando actualizaciones de proyectos...');

    // Crear conexión a la base de datos
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'sistema_financiero',
      port: process.env.DB_PORT || 3306
    });

    console.log('✅ Conexión a la base de datos establecida');

    // 1. Verificar estado actual de un proyecto
    console.log('\n📋 ESTADO ACTUAL DE UN PROYECTO:');
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
      console.log('❌ No hay proyectos para probar');
      return;
    }

    const project = currentProject[0];
    console.log(`  - Proyecto ID ${project.id}: "${project.nombre}"`);
    console.log(`    Fase ID: ${project.phase_id || 'NULL'}`);
    console.log(`    Estado: ${project.estado || 'NULL'}`);
    console.log(`    Descripción: ${project.descripcion || 'Sin descripción'}`);

    // 2. Verificar fases disponibles
    console.log('\n📋 FASES DISPONIBLES:');
    const [phases] = await connection.execute(`
      SELECT id, nombre, descripcion
      FROM phases
      ORDER BY id
    `);

    if (phases.length === 0) {
      console.log('❌ No hay fases disponibles');
      return;
    }

    phases.forEach(phase => {
      console.log(`  - ID ${phase.id}: "${phase.nombre}" - ${phase.descripcion || 'Sin descripción'}`);
    });

    // 3. Probar actualización de fase
    console.log('\n🔄 PROBANDO ACTUALIZACIÓN DE FASE:');
    const newPhaseId = phases[0].id; // Usar la primera fase disponible
    
    if (project.phase_id !== newPhaseId) {
      console.log(`  - Cambiando fase de ${project.phase_id || 'NULL'} a ${newPhaseId}`);
      
      const [updateResult] = await connection.execute(`
        UPDATE projects
        SET phase_id = ?, updated_at = NOW()
        WHERE id = ?
      `, [newPhaseId, project.id]);

      if (updateResult.affectedRows > 0) {
        console.log('  ✅ Fase actualizada exitosamente');
      } else {
        console.log('  ❌ Error al actualizar fase');
      }
    } else {
      console.log(`  - El proyecto ya tiene la fase ${newPhaseId}`);
    }

    // 4. Probar actualización de estado
    console.log('\n🔄 PROBANDO ACTUALIZACIÓN DE ESTADO:');
    const newEstado = 'en_progreso';
    
    if (project.estado !== newEstado) {
      console.log(`  - Cambiando estado de "${project.estado || 'NULL'}" a "${newEstado}"`);
      
      const [updateResult] = await connection.execute(`
        UPDATE projects
        SET estado = ?, updated_at = NOW()
        WHERE id = ?
      `, [newEstado, project.id]);

      if (updateResult.affectedRows > 0) {
        console.log('  ✅ Estado actualizado exitosamente');
      } else {
        console.log('  ❌ Error al actualizar estado');
      }
    } else {
      console.log(`  - El proyecto ya tiene el estado "${newEstado}"`);
    }

    // 5. Verificar cambios realizados
    console.log('\n📋 VERIFICANDO CAMBIOS REALIZADOS:');
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
      console.log(`  - Proyecto ID ${updated.id}: "${updated.nombre}"`);
      console.log(`    Fase ID: ${updated.phase_id || 'NULL'}`);
      console.log(`    Estado: ${updated.estado || 'NULL'}`);
      console.log(`    Descripción: ${updated.descripcion || 'Sin descripción'}`);
      console.log(`    Última actualización: ${updated.updated_at}`);
    }

    // 6. Probar relación con fases
    console.log('\n🔗 VERIFICANDO RELACIÓN CON FASES:');
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
      console.log(`  - Proyecto: "${projectPhase.proyecto_nombre}"`);
      console.log(`    Fase ID: ${projectPhase.phase_id || 'NULL'}`);
      console.log(`    Nombre Fase: ${projectPhase.fase_nombre || 'Sin fase asignada'}`);
      console.log(`    Descripción Fase: ${projectPhase.fase_descripcion || 'Sin descripción'}`);
      console.log(`    Estado: ${projectPhase.estado || 'Sin estado'}`);
    }

    console.log('\n🎉 Pruebas de actualización completadas exitosamente!');

  } catch (error) {
    console.error('❌ Error durante las pruebas:', error);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
      console.log('🔌 Conexión a la base de datos cerrada');
    }
  }
}

// Ejecutar las pruebas
testProjectUpdates();
