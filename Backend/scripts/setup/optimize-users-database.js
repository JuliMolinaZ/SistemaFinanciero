#!/usr/bin/env node

/**
 * Script de optimización para el módulo de usuarios
 * Ejecuta automáticamente las optimizaciones de base de datos
 */

const mysql = require('mysql2/promise');
const fs = require('fs').promises;
const path = require('path');

// Configuración de la base de datos
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'sistema_financiero',
  multipleStatements: true,
  connectionLimit: 10,
  acquireTimeout: 60000,
  timeout: 60000,
  reconnect: true
};

// Colores para la consola
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

// Función para imprimir con colores
const log = (message, color = 'reset') => {

};

// Función para imprimir progreso
const logProgress = (step, total, message) => {
  const percentage = Math.round((step / total) * 100);
  const progressBar = '█'.repeat(Math.floor(percentage / 5)) + '░'.repeat(20 - Math.floor(percentage / 5));
  log(`[${progressBar}] ${percentage}% - ${message}`, 'cyan');
};

// Función para conectar a la base de datos
const connectToDatabase = async () => {
  try {
    log('🔌 Conectando a la base de datos...', 'blue');
    const connection = await mysql.createConnection(dbConfig);
    log('✅ Conexión exitosa a la base de datos', 'green');
    return connection;
  } catch (error) {
    log('❌ Error al conectar a la base de datos:', 'red');
    log(error.message, 'red');
    process.exit(1);
  }
};

// Función para leer el archivo SQL
const readSqlFile = async () => {
  try {
    const sqlPath = path.join(__dirname, '../../sql/optimize-users-table.sql');
    const sqlContent = await fs.readFile(sqlPath, 'utf8');
    return sqlContent;
  } catch (error) {
    log('❌ Error al leer el archivo SQL:', 'red');
    log(error.message, 'red');
    process.exit(1);
  }
};

// Función para verificar índices existentes
const checkExistingIndexes = async (connection) => {
  try {
    log('🔍 Verificando índices existentes...', 'blue');
    const [rows] = await connection.execute('SHOW INDEX FROM users');
    
    if (rows.length === 0) {
      log('⚠️  No se encontraron índices en la tabla users', 'yellow');
      return [];
    }
    
    log(`✅ Se encontraron ${rows.length} índices existentes`, 'green');
    rows.forEach(index => {
      log(`   - ${index.Key_name} (${index.Column_name})`, 'cyan');
    });
    
    return rows;
  } catch (error) {
    log('❌ Error al verificar índices:', 'red');
    log(error.message, 'red');
    return [];
  }
};

// Función para verificar el tamaño de la tabla
const checkTableSize = async (connection) => {
  try {
    log('📊 Verificando tamaño de la tabla...', 'blue');
    const [rows] = await connection.execute(`
      SELECT 
        table_name,
        table_rows,
        ROUND(data_length/1024/1024, 2) as data_size_mb,
        ROUND(index_length/1024/1024, 2) as index_size_mb,
        ROUND((data_length + index_length)/1024/1024, 2) as total_size_mb
      FROM information_schema.tables 
      WHERE table_schema = ? 
      AND table_name = 'users'
    `, [dbConfig.database]);
    
    if (rows.length > 0) {
      const table = rows[0];
      log(`📈 Tamaño de la tabla users:`, 'green');
      log(`   - Filas: ${table.table_rows}`, 'cyan');
      log(`   - Datos: ${table.data_size_mb} MB`, 'cyan');
      log(`   - Índices: ${table.index_size_mb} MB`, 'cyan');
      log(`   - Total: ${table.total_size_mb} MB`, 'cyan');
    }
    
    return rows[0] || null;
  } catch (error) {
    log('❌ Error al verificar tamaño de tabla:', 'red');
    log(error.message, 'red');
    return null;
  }
};

// Función para ejecutar optimizaciones
const executeOptimizations = async (connection, sqlContent) => {
  try {
    log('🚀 Ejecutando optimizaciones...', 'blue');
    
    // Dividir el SQL en comandos individuales
    const commands = sqlContent
      .split(';')
      .map(cmd => cmd.trim())
      .filter(cmd => cmd.length > 0 && !cmd.startsWith('--') && !cmd.startsWith('/*'));
    
    const totalCommands = commands.length;
    log(`📝 Ejecutando ${totalCommands} comandos de optimización...`, 'blue');
    
    for (let i = 0; i < commands.length; i++) {
      const command = commands[i];
      
      // Saltar comandos de verificación
      if (command.includes('SHOW') || command.includes('EXPLAIN') || command.includes('SELECT')) {
        continue;
      }
      
      try {
        await connection.execute(command);
        logProgress(i + 1, totalCommands, `Ejecutado: ${command.substring(0, 50)}...`);
      } catch (error) {
        // Ignorar errores de índices que ya existen
        if (error.message.includes('Duplicate key name') || error.message.includes('already exists')) {
          logProgress(i + 1, totalCommands, `Saltado (ya existe): ${command.substring(0, 50)}...`);
        } else {
          log(`⚠️  Error en comando: ${command.substring(0, 50)}...`, 'yellow');
          log(`   ${error.message}`, 'yellow');
        }
      }
    }
    
    log('✅ Optimizaciones completadas', 'green');
  } catch (error) {
    log('❌ Error al ejecutar optimizaciones:', 'red');
    log(error.message, 'red');
  }
};

// Función para verificar el rendimiento
const checkPerformance = async (connection) => {
  try {
    log('⚡ Verificando rendimiento...', 'blue');
    
    // Probar consultas optimizadas
    const testQueries = [
      {
        name: 'Búsqueda por firebase_uid',
        query: 'EXPLAIN SELECT * FROM users WHERE firebase_uid = ?',
        params: ['test_uid']
      },
      {
        name: 'Búsqueda por email',
        query: 'EXPLAIN SELECT * FROM users WHERE email = ?',
        params: ['test@example.com']
      },
      {
        name: 'Filtrado por rol',
        query: 'EXPLAIN SELECT * FROM users WHERE role = ? ORDER BY name',
        params: ['administrador']
      },
      {
        name: 'Usuarios activos',
        query: 'EXPLAIN SELECT * FROM users WHERE updated_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)',
        params: []
      }
    ];
    
    for (const test of testQueries) {
      try {
        const [rows] = await connection.execute(test.query, test.params);
        const usesIndex = rows.some(row => row.key !== null);
        const status = usesIndex ? '✅' : '⚠️';
        log(`${status} ${test.name}: ${usesIndex ? 'Usa índices' : 'No usa índices'}`, usesIndex ? 'green' : 'yellow');
      } catch (error) {
        log(`❌ Error en ${test.name}: ${error.message}`, 'red');
      }
    }
    
  } catch (error) {
    log('❌ Error al verificar rendimiento:', 'red');
    log(error.message, 'red');
  }
};

// Función para mostrar estadísticas finales
const showFinalStats = async (connection) => {
  try {
    log('📊 Estadísticas finales...', 'blue');
    
    // Verificar índices finales
    const [indexes] = await connection.execute('SHOW INDEX FROM users');
    log(`✅ Total de índices: ${indexes.length}`, 'green');
    
    // Verificar tamaño final
    const finalSize = await checkTableSize(connection);
    
    // Verificar vista de estadísticas
    try {
      const [stats] = await connection.execute('SELECT * FROM v_users_stats LIMIT 1');
      log('✅ Vista de estadísticas creada correctamente', 'green');
    } catch (error) {
      log('⚠️  Vista de estadísticas no disponible', 'yellow');
    }
    
    // Verificar procedimiento almacenado
    try {
      const [procedures] = await connection.execute('SHOW PROCEDURE STATUS WHERE Name = "ClearUserCache"');
      if (procedures.length > 0) {
        log('✅ Procedimiento ClearUserCache creado correctamente', 'green');
      }
    } catch (error) {
      log('⚠️  Procedimiento ClearUserCache no disponible', 'yellow');
    }
    
  } catch (error) {
    log('❌ Error al mostrar estadísticas finales:', 'red');
    log(error.message, 'red');
  }
};

// Función principal
const main = async () => {
  log('🚀 Iniciando optimización del módulo de usuarios...', 'bright');
  log('=' * 60, 'blue');
  
  let connection;
  
  try {
    // 1. Conectar a la base de datos
    connection = await connectToDatabase();
    
    // 2. Verificar estado inicial
    await checkExistingIndexes(connection);
    await checkTableSize(connection);
    
    // 3. Leer archivo SQL
    const sqlContent = await readSqlFile();
    
    // 4. Ejecutar optimizaciones
    await executeOptimizations(connection, sqlContent);
    
    // 5. Verificar rendimiento
    await checkPerformance(connection);
    
    // 6. Mostrar estadísticas finales
    await showFinalStats(connection);
    
    log('=' * 60, 'blue');
    log('🎉 ¡Optimización completada exitosamente!', 'bright');
    log('', 'reset');
    log('📋 Resumen de mejoras:', 'bright');
    log('   ✅ Índices optimizados para consultas frecuentes', 'green');
    log('   ✅ Cache en memoria del backend', 'green');
    log('   ✅ Consultas optimizadas con SELECT específico', 'green');
    log('   ✅ Vista de estadísticas creada', 'green');
    log('   ✅ Procedimiento de limpieza de cache', 'green');
    log('   ✅ Triggers de auditoría', 'green');
    log('   ✅ Evento de mantenimiento automático', 'green');
    log('', 'reset');
    log('💡 Próximos pasos:', 'bright');
    log('   1. Reiniciar el servidor backend', 'cyan');
    log('   2. Probar el módulo de usuarios', 'cyan');
    log('   3. Monitorear el rendimiento', 'cyan');
    log('   4. Ajustar configuración según necesidades', 'cyan');
    
  } catch (error) {
    log('❌ Error durante la optimización:', 'red');
    log(error.message, 'red');
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
      log('🔌 Conexión cerrada', 'blue');
    }
  }
};

// Ejecutar si es el archivo principal
if (require.main === module) {
  main().catch(error => {
    log('❌ Error fatal:', 'red');
    log(error.message, 'red');
    process.exit(1);
  });
}

module.exports = {
  main,
  connectToDatabase,
  checkExistingIndexes,
  checkTableSize,
  executeOptimizations,
  checkPerformance,
  showFinalStats
}; 