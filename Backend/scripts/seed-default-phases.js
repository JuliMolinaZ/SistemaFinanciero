const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Fases por defecto para nuevos proyectos
const DEFAULT_PHASES = [
  { name: 'Backlog', position: 0 },
  { name: 'Planificación', position: 1 },
  { name: 'En desarrollo', position: 2 },
  { name: 'QA', position: 3 },
  { name: 'Revisión', position: 4 },
  { name: 'Completado', position: 5 }
];

/**
 * Crea las fases por defecto para un proyecto
 * @param {number} projectId - ID del proyecto
 * @returns {Promise<Array>} Array de fases creadas
 */
async function createDefaultPhases(projectId) {
  try {
    const phases = [];

    for (const phaseData of DEFAULT_PHASES) {
      const phase = await prisma.projectPhase.create({
        data: {
          ...phaseData,
          project_id: projectId
        }
      });
      phases.push(phase);
    }

    // Establecer la primera fase como actual
    if (phases.length > 0) {
      await prisma.project.update({
        where: { id: projectId },
        data: { current_phase_id: phases[0].id }
      });
    }

    return phases;
  } catch (error) {
    console.error('Error creating default phases:', error);
    throw error;
  }
}

/**
 * Migra proyectos existentes para añadir fases por defecto
 */
async function migrateExistingProjects() {
  try {
    // Obtener proyectos que no tienen fases
    const projectsWithoutPhases = await prisma.project.findMany({
      where: {
        project_phases: {
          none: {}
        }
      },
      select: { id: true, nombre: true }
    });

    for (const project of projectsWithoutPhases) {

      await createDefaultPhases(project.id);
    }

  } catch (error) {
    console.error('Migration failed:', error);
    throw error;
  }
}

module.exports = {
  createDefaultPhases,
  migrateExistingProjects,
  DEFAULT_PHASES
};

// Ejecutar si es llamado directamente
if (require.main === module) {
  migrateExistingProjects()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
}