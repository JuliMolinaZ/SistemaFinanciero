// 🚀 SCRIPT DE OPTIMIZACIÓN DE BASE DE DATOS
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function optimizeDatabase() {

  try {
    // Crear índices para mejorar performance de consultas frecuentes usando sintaxis MySQL correcta
    const optimizations = [
      // Índices para tabla projects
      `CREATE INDEX idx_projects_status ON Project(status);`,
      `CREATE INDEX idx_projects_priority ON Project(priority);`,
      `CREATE INDEX idx_projects_client ON Project(cliente_id);`,
      `CREATE INDEX idx_projects_manager ON Project(project_manager_id);`,
      `CREATE INDEX idx_projects_created_at ON Project(created_at);`,
      `CREATE INDEX idx_projects_dates ON Project(start_date, end_date);`,

      // Índices para tabla tasks
      `CREATE INDEX idx_tasks_project ON Task(project_id);`,
      `CREATE INDEX idx_tasks_status ON Task(status);`,
      `CREATE INDEX idx_tasks_priority ON Task(priority);`,
      `CREATE INDEX idx_tasks_assignee ON Task(assignee_id);`,
      `CREATE INDEX idx_tasks_sprint ON Task(sprint_id);`,
      `CREATE INDEX idx_tasks_due_date ON Task(due_date);`,
      `CREATE INDEX idx_tasks_updated_at ON Task(updated_at);`,

      // Índices para tabla sprints
      `CREATE INDEX idx_sprints_project ON Sprint(project_id);`,
      `CREATE INDEX idx_sprints_status ON Sprint(status);`,
      `CREATE INDEX idx_sprints_dates ON Sprint(start_date, end_date);`,

      // Índices para tabla project_members
      `CREATE INDEX idx_project_members_project ON ProjectMember(project_id);`,
      `CREATE INDEX idx_project_members_user ON ProjectMember(user_id);`,
      `CREATE INDEX idx_project_members_active ON ProjectMember(is_active);`,

      // Índices compuestos para consultas complejas
      `CREATE INDEX idx_projects_status_priority ON Project(status, priority);`,
      `CREATE INDEX idx_tasks_project_status ON Task(project_id, status);`,
      `CREATE INDEX idx_tasks_assignee_status ON Task(assignee_id, status);`,
      `CREATE INDEX idx_sprints_project_status ON Sprint(project_id, status);`
    ];

    for (const [index, query] of optimizations.entries()) {
      try {
        await prisma.$executeRawUnsafe(query);

      } catch (error) {
        if (error.message.includes('already exists')) {

        } else {
          console.error(`❌ Error creando índice ${index + 1}:`, error.message);
        }
      }
    }

    // Actualizar estadísticas de la base de datos

    await prisma.$executeRaw`ANALYZE TABLE Project, Task, Sprint, ProjectMember, TimeEntry, Comment;`;

    // Verificar fragmentación de tablas

    const tableStats = await prisma.$queryRaw`
      SELECT
        table_name,
        round((data_length + index_length) / 1024 / 1024, 2) AS 'Size (MB)',
        table_rows,
        round(data_free / 1024 / 1024, 2) AS 'Free Space (MB)'
      FROM information_schema.TABLES
      WHERE table_schema = DATABASE()
      AND table_name IN ('Project', 'Task', 'Sprint', 'ProjectMember', 'User', 'Client');
    `;

    // Optimizar tablas si hay mucha fragmentación
    const fragmentedTables = tableStats.filter(table =>
      table['Free Space (MB)'] > 5 &&
      table['Free Space (MB)'] / table['Size (MB)'] > 0.1
    );

    if (fragmentedTables.length > 0) {

      for (const table of fragmentedTables) {
        try {
          await prisma.$executeRawUnsafe(`OPTIMIZE TABLE ${table.table_name};`);

        } catch (error) {
          console.error(`❌ Error optimizando tabla ${table.table_name}:`, error.message);
        }
      }
    }

    // Configurar variables de optimización de MySQL

    const mysqlOptimizations = [
      `SET GLOBAL innodb_buffer_pool_size = 256M;`,
      `SET GLOBAL query_cache_size = 64M;`,
      `SET GLOBAL query_cache_type = 1;`,
      `SET GLOBAL slow_query_log = 1;`,
      `SET GLOBAL long_query_time = 2;`
    ];

    for (const optimization of mysqlOptimizations) {
      try {
        await prisma.$executeRawUnsafe(optimization);

      } catch (error) {

      }
    }

    // Generar reporte de optimización
    const reportData = {
      timestamp: new Date().toISOString(),
      indicesCreated: optimizations.length,
      tablesOptimized: fragmentedTables.length,
      tableStats: tableStats,
      recommendations: [
        'Ejecutar este script mensualmente para mantener el rendimiento',
        'Monitorear consultas lentas en los logs de MySQL',
        'Considerar particionado de tablas si el volumen de datos crece significativamente',
        'Revisar y actualizar índices según los patrones de consulta actuales'
      ]
    };

  } catch (error) {
    console.error('❌ Error durante la optimización:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar si es llamado directamente
if (require.main === module) {
  optimizeDatabase()
    .then(() => {

      process.exit(0);
    })
    .catch(error => {
      console.error('❌ Error en optimización:', error);
      process.exit(1);
    });
}

module.exports = { optimizeDatabase };