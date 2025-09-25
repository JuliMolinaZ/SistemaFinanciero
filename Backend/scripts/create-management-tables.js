// 🔧 MIGRACIÓN: Crear tablas independientes para gestión de proyectos
// ================================================================

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function createManagementTables() {
  try {

    // 1. Crear tabla principal de proyectos de gestión
    await prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS management_projects (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nombre VARCHAR(255) NOT NULL,
        descripcion TEXT,
        cliente_id INT,
        methodology_id INT,
        project_manager_id INT,
        current_phase_id VARCHAR(36),
        start_date DATE,
        end_date DATE,
        status VARCHAR(50) DEFAULT 'planning',
        priority VARCHAR(20) DEFAULT 'medium',
        progress INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        
        INDEX idx_management_projects_cliente_id (cliente_id),
        INDEX idx_management_projects_methodology_id (methodology_id),
        INDEX idx_management_projects_project_manager_id (project_manager_id),
        INDEX idx_management_projects_current_phase_id (current_phase_id),
        INDEX idx_management_projects_status (status),
        INDEX idx_management_projects_priority (priority),
        INDEX idx_management_projects_start_date (start_date),
        INDEX idx_management_projects_end_date (end_date)
      )
    `;

    // 2. Crear tabla de miembros de proyectos de gestión
    await prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS management_project_members (
        id INT AUTO_INCREMENT PRIMARY KEY,
        project_id INT NOT NULL,
        user_id INT NOT NULL,
        role_name VARCHAR(100) DEFAULT 'Developer',
        team_type VARCHAR(20) DEFAULT 'operations',
        joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        left_at TIMESTAMP NULL,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        
        UNIQUE KEY uk_management_project_members (project_id, user_id, team_type),
        INDEX idx_management_project_members_project_id (project_id),
        INDEX idx_management_project_members_user_id (user_id),
        INDEX idx_management_project_members_team_type (team_type)
      )
    `;

    // 3. Crear tabla de fases de proyectos de gestión
    await prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS management_project_phases (
        id VARCHAR(36) PRIMARY KEY,
        project_id INT NOT NULL,
        name VARCHAR(100) NOT NULL,
        description TEXT,
        position INT DEFAULT 0,
        is_completed BOOLEAN DEFAULT FALSE,
        completed_at TIMESTAMP NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        
        UNIQUE KEY uk_management_project_phases (project_id, name),
        INDEX idx_management_project_phases_project_id (project_id),
        INDEX idx_management_project_phases_position (position)
      )
    `;

    // 4. Crear tabla de sprints de gestión
    await prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS management_sprints (
        id INT AUTO_INCREMENT PRIMARY KEY,
        project_id INT NOT NULL,
        name VARCHAR(100) NOT NULL,
        description TEXT,
        start_date DATE,
        end_date DATE,
        status VARCHAR(50) DEFAULT 'planning',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        
        INDEX idx_management_sprints_project_id (project_id),
        INDEX idx_management_sprints_status (status)
      )
    `;

    // 5. Crear tabla de tareas de gestión
    await prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS management_tasks (
        id INT AUTO_INCREMENT PRIMARY KEY,
        project_id INT NOT NULL,
        sprint_id INT,
        phase_id VARCHAR(36),
        title VARCHAR(255) NOT NULL,
        description TEXT,
        status VARCHAR(50) DEFAULT 'todo',
        priority VARCHAR(20) DEFAULT 'medium',
        assigned_to INT,
        due_date DATE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        
        INDEX idx_management_tasks_project_id (project_id),
        INDEX idx_management_tasks_sprint_id (sprint_id),
        INDEX idx_management_tasks_phase_id (phase_id),
        INDEX idx_management_tasks_assigned_to (assigned_to),
        INDEX idx_management_tasks_status (status)
      )
    `;

    // 6. Verificar la creación
    const tables = [
      'management_projects',
      'management_project_members', 
      'management_project_phases',
      'management_sprints',
      'management_tasks'
    ];

    for (const table of tables) {
      const result = await prisma.$queryRaw`
        SELECT COUNT(*) as count FROM information_schema.tables 
        WHERE table_schema = DATABASE() AND table_name = ${table}
      `;

    }

    // 7. Insertar datos de ejemplo

    await prisma.managementProject.create({
      data: {
        nombre: 'Sistema E-commerce Gestión',
        descripcion: 'Proyecto de gestión para desarrollo de e-commerce',
        status: 'active',
        priority: 'high',
        progress: 75
      }
    });

    await prisma.managementProject.create({
      data: {
        nombre: 'App Móvil Gestión',
        descripcion: 'Aplicación móvil para gestión de proyectos',
        status: 'planning',
        priority: 'medium',
        progress: 25
      }
    });

  } catch (error) {
    console.error('❌ Error creando tablas de gestión:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  createManagementTables()
    .then(() => {

      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Error ejecutando script:', error);
      process.exit(1);
    });
}

module.exports = { createManagementTables };
