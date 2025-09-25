const mysql = require('mysql2/promise');
require('dotenv').config();

async function addEstadoField() {
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

    // Verificar si el campo ya existe
    const [columns] = await connection.execute(`
      SELECT COLUMN_NAME
      FROM INFORMATION_SCHEMA.COLUMNS
      WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'projects' AND COLUMN_NAME = 'estado'
    `, [process.env.DB_NAME || 'sistema_financiero']);

    if (columns.length > 0) {

    } else {
      // Agregar el campo estado

      await connection.execute(`
        ALTER TABLE projects
        ADD COLUMN estado VARCHAR(50) DEFAULT 'activo'
      `);

    }

    // Actualizar registros existentes

    const [result] = await connection.execute(`
      UPDATE projects
      SET estado = 'activo' WHERE estado IS NULL
    `);

    // Verificar la estructura final
    const [finalColumns] = await connection.execute(`
      SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE, COLUMN_DEFAULT
      FROM INFORMATION_SCHEMA.COLUMNS
      WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'projects'
      ORDER BY ORDINAL_POSITION
    `, [process.env.DB_NAME || 'sistema_financiero']);

    finalColumns.forEach(col => {

    });

    // Verificar algunos registros de ejemplo
    const [projects] = await connection.execute(`
      SELECT id, nombre, estado
      FROM projects
      LIMIT 5
    `);

    projects.forEach(project => {

    });

  } catch (error) {
    console.error('❌ Error durante la migración:', error);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();

    }
  }
}

// Ejecutar la migración
addEstadoField();
