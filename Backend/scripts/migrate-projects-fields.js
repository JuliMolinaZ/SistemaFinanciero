const mysql = require('mysql2/promise');
require('dotenv').config();

async function migrateProjectsFields() {
  let connection;
  
  try {
    console.log('🔧 Iniciando migración de campos para proyectos...');
    
    // Crear conexión a la base de datos
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'sistema_financiero',
      port: process.env.DB_PORT || 3306
    });
    
    console.log('✅ Conexión a la base de datos establecida');
    
    // Verificar si los campos ya existen
    const [columns] = await connection.execute(`
      SELECT COLUMN_NAME 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'projects'
    `, [process.env.DB_NAME || 'sistema_financiero']);
    
    const columnNames = columns.map(col => col.COLUMN_NAME);
    console.log('📋 Columnas existentes en la tabla projects:', columnNames);
    
    // Agregar campo estado si no existe
    if (!columnNames.includes('estado')) {
      console.log('➕ Agregando campo estado...');
      await connection.execute(`
        ALTER TABLE projects 
        ADD COLUMN estado VARCHAR(50) DEFAULT 'activo'
      `);
      console.log('✅ Campo estado agregado exitosamente');
    } else {
      console.log('ℹ️ Campo estado ya existe');
    }
    
    // Agregar campo descripcion si no existe
    if (!columnNames.includes('descripcion')) {
      console.log('➕ Agregando campo descripcion...');
      await connection.execute(`
        ALTER TABLE projects 
        ADD COLUMN descripcion TEXT
      `);
      console.log('✅ Campo descripcion agregado exitosamente');
    } else {
      console.log('ℹ️ Campo descripcion ya existe');
    }
    
    // Actualizar registros existentes para que tengan un estado por defecto
    console.log('🔄 Actualizando registros existentes...');
    const [result] = await connection.execute(`
      UPDATE projects 
      SET estado = 'activo' 
      WHERE estado IS NULL
    `);
    console.log(`✅ ${result.affectedRows} registros actualizados`);
    
    // Verificar la estructura final
    const [finalColumns] = await connection.execute(`
      SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE, COLUMN_DEFAULT
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'projects'
      ORDER BY ORDINAL_POSITION
    `, [process.env.DB_NAME || 'sistema_financiero']);
    
    console.log('\n📊 Estructura final de la tabla projects:');
    finalColumns.forEach(col => {
      console.log(`  - ${col.COLUMN_NAME}: ${col.DATA_TYPE} (${col.IS_NULLABLE === 'YES' ? 'NULL' : 'NOT NULL'}) ${col.COLUMN_DEFAULT ? `DEFAULT: ${col.COLUMN_DEFAULT}` : ''}`);
    });
    
    // Verificar algunos registros de ejemplo
    const [projects] = await connection.execute(`
      SELECT id, nombre, estado, descripcion 
      FROM projects 
      LIMIT 5
    `);
    
    console.log('\n📋 Ejemplos de registros:');
    projects.forEach(project => {
      console.log(`  - ID ${project.id}: "${project.nombre}" | Estado: ${project.estado} | Descripción: ${project.descripcion || 'Sin descripción'}`);
    });
    
    console.log('\n🎉 Migración completada exitosamente!');
    
  } catch (error) {
    console.error('❌ Error durante la migración:', error);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
      console.log('🔌 Conexión a la base de datos cerrada');
    }
  }
}

// Ejecutar la migración
migrateProjectsFields();
