const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testPhaseUpdate() {
  try {

    // 1. Verificar proyectos existentes con sus fases

    const projects = await prisma.project.findMany({
      select: {
        id: true,
        nombre: true,
        phase_id: true,
        phases: {
          select: {
            nombre: true,
            descripcion: true
          }
        }
      },
      take: 5
    });

    projects.forEach(project => {

    });

    // 2. Probar actualización de fase de un proyecto
    if (projects.length > 0) {
      const testProject = projects[0];

      // Cambiar a una fase diferente
      const newPhaseId = testProject.phase_id === 1 ? 2 : 1;
      const newPhase = await prisma.phase.findUnique({
        where: { id: newPhaseId }
      });

      // Actualizar solo el phase_id
      const updatedProject = await prisma.project.update({
        where: { id: testProject.id },
        data: { phase_id: newPhaseId }
      });

      // Verificar que se actualizó
      const verifyProject = await prisma.project.findUnique({
        where: { id: testProject.id },
        include: {
          phases: true
        }
      });

      // Revertir el cambio para no afectar los datos
      await prisma.project.update({
        where: { id: testProject.id },
        data: { phase_id: testProject.phase_id }
      });

    }

    // 3. Verificar que las fases están disponibles

    const phases = await prisma.phase.findMany({
      orderBy: { id: 'asc' }
    });

    phases.forEach(phase => {

    });

    // 4. Estadísticas finales

    const totalProjects = await prisma.project.count();
    const projectsWithPhase = await prisma.project.count({
      where: {
        phase_id: { not: null }
      }
    });

  } catch (error) {
    console.error('❌ Error durante la prueba:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar la prueba
testPhaseUpdate();
