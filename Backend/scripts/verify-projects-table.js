const mysql = require('mysql2/promise');
require('dotenv').config();

async function verifyProjectsTable() {
  let connection;

  try {
    console.log('🔍 Verificando estructura de la tabla projects...');

    // Crear conexión a la base de datos
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'sistema_financiero',
      port: process.env.DB_PORT || 3306
    });

    console.log('✅ Conexión a la base de datos establecida');

    // 1. Verificar estructura de la tabla projects
    console.log('\n📊 ESTRUCTURA DE LA TABLA PROJECTS:');
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
      console.log(`  - ${col.COLUMN_NAME}: ${col.DATA_TYPE} (${col.IS_NULLABLE === 'YES' ? 'NULL' : 'NOT NULL'}) ${col.COLUMN_DEFAULT ? `DEFAULT: ${col.COLUMN_DEFAULT}` : ''} ${col.COLUMN_KEY === 'PRI' ? 'PRIMARY KEY' : ''}`);
    });

    // 2. Verificar tabla de fases
    console.log('\n📋 ESTRUCTURA DE LA TABLA PHASES:');
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
        console.log(`  - ${col.COLUMN_NAME}: ${col.DATA_TYPE} (${col.IS_NULLABLE === 'YES' ? 'NULL' : 'NOT NULL'}) ${col.COLUMN_DEFAULT ? `DEFAULT: ${col.COLUMN_DEFAULT}` : ''}`);
      });
    } else {
      console.log('  ❌ Tabla phases no encontrada');
    }

    // 3. Verificar datos de ejemplo en projects
    console.log('\n📋 DATOS DE EJEMPLO EN PROJECTS:');
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
        console.log(`  - ID ${project.id}: "${project.nombre}" | Fase ID: ${project.phase_id || 'NULL'} | Estado: ${project.estado || 'NULL'} | Descripción: ${project.descripcion || 'Sin descripción'}`);
      });
    } else {
      console.log('  ❌ No hay proyectos en la base de datos');
    }

    // 4. Verificar datos de ejemplo en phases
    console.log('\n📋 DATOS DE EJEMPLO EN PHASES:');
    const [phases] = await connection.execute(`
      SELECT id, nombre, descripcion
      FROM phases
      LIMIT 10
    `);

    if (phases.length > 0) {
      phases.forEach(phase => {
        console.log(`  - ID ${phase.id}: "${phase.nombre}" - ${phase.descripcion || 'Sin descripción'}`);
      });
    } else {
      console.log('  ❌ No hay fases en la base de datos');
    }

    // 5. Verificar relaciones entre projects y phases
    console.log('\n🔗 VERIFICANDO RELACIONES PROJECTS-PHASES:');
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
      console.log(`  - Proyecto "${pp.proyecto_nombre}" (ID: ${pp.id}) | Fase ID: ${pp.phase_id || 'NULL'} | Nombre Fase: ${pp.fase_nombre || 'Sin fase asignada'}`);
    });

    // 6. Verificar índices y constraints
    console.log('\n🔒 VERIFICANDO ÍNDICES Y CONSTRAINTS:');
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
      console.log(`  - Índice: ${idx.INDEX_NAME} | Columna: ${idx.COLUMN_NAME} | Único: ${idx.NON_UNIQUE === 0 ? 'SÍ' : 'NO'}`);
    });

    console.log('\n🎉 Verificación completada exitosamente!');

  } catch (error) {
    console.error('❌ Error durante la verificación:', error);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
      console.log('🔌 Conexión a la base de datos cerrada');
    }
  }
}

// Ejecutar la verificación
verifyProjectsTable();
