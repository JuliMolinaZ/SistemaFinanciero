const mysql = require('mysql2/promise');
require('dotenv').config();

async function verifyProjectsTable() {
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

    // 1. Verificar estructura de la tabla projects

    const [columns] = await connection.execute(`
      SELECT 
        COLUMN_NAME, 
        DATA_TYPE, 
        IS_NULLABLE, 
        COLUMN_DEFAULT,
        COLUMN_KEY
      FROM INFORMATION_SCHEMA.COLUMNS
      WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'projects'
      ORDER BY ORDINAL_POSITION
    `, [process.env.DB_NAME || 'sistema_financiero']);

    columns.forEach(col => {

    });

    // 2. Verificar tabla de fases

    const [phaseColumns] = await connection.execute(`
      SELECT 
        COLUMN_NAME, 
        DATA_TYPE, 
        IS_NULLABLE, 
        COLUMN_DEFAULT
      FROM INFORMATION_SCHEMA.COLUMNS
      WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'phases'
      ORDER BY ORDINAL_POSITION
    `, [process.env.DB_NAME || 'sistema_financiero']);

    if (phaseColumns.length > 0) {
      phaseColumns.forEach(col => {

      });
    } else {

    }

    // 3. Verificar datos de ejemplo en projects

    const [projects] = await connection.execute(`
      SELECT 
        id, 
        nombre, 
        phase_id, 
        estado, 
        descripcion,
        created_at
      FROM projects
      LIMIT 5
    `);

    if (projects.length > 0) {
      projects.forEach(project => {

      });
    } else {

    }

    // 4. Verificar datos de ejemplo en phases

    const [phases] = await connection.execute(`
      SELECT id, nombre, descripcion
      FROM phases
      LIMIT 10
    `);

    if (phases.length > 0) {
      phases.forEach(phase => {

      });
    } else {

    }

    // 5. Verificar relaciones entre projects y phases

    const [projectPhases] = await connection.execute(`
      SELECT 
        p.id,
        p.nombre as proyecto_nombre,
        p.phase_id,
        ph.nombre as fase_nombre
      FROM projects p
      LEFT JOIN phases ph ON p.phase_id = ph.id
      LIMIT 5
    `);

    projectPhases.forEach(pp => {

    });

    // 6. Verificar índices y constraints

    const [indexes] = await connection.execute(`
      SELECT 
        INDEX_NAME,
        COLUMN_NAME,
        NON_UNIQUE
      FROM INFORMATION_SCHEMA.STATISTICS
      WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'projects'
      ORDER BY INDEX_NAME, SEQ_IN_INDEX
    `, [process.env.DB_NAME || 'sistema_financiero']);

    indexes.forEach(idx => {

    });

  } catch (error) {
    console.error('❌ Error durante la verificación:', error);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();

    }
  }
}

// Ejecutar la verificación
verifyProjectsTable();
