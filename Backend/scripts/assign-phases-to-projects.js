const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function assignPhasesToProjects() {
  try {

    // 1. Verificar fases disponibles

    const phases = await prisma.phase.findMany({
      orderBy: { id: 'asc' }
    });

    if (phases.length === 0) {

      return;
    }

    phases.forEach(phase => {

    });

    // 2. Verificar proyectos sin fase

    const projectsWithoutPhase = await prisma.project.findMany({
      where: {
        phase_id: null
      },
      select: {
        id: true,
        nombre: true,
        created_at: true
      }
    });

    if (projectsWithoutPhase.length === 0) {

      return;
    }

    // Mostrar algunos ejemplos
    projectsWithoutPhase.slice(0, 5).forEach(project => {

    });

    // 3. Asignar fases de manera inteligente

    let updatedCount = 0;
    
    for (let i = 0; i < projectsWithoutPhase.length; i++) {
      const project = projectsWithoutPhase[i];
      
      // Distribuir las fases de manera equilibrada
      const phaseIndex = i % phases.length;
      const selectedPhase = phases[phaseIndex];
      
      try {
        await prisma.project.update({
          where: { id: project.id },
          data: {
            phase_id: selectedPhase.id,
            updated_at: new Date()
          }
        });

        updatedCount++;
      } catch (error) {
        console.error(`  ❌ Error al actualizar proyecto ${project.id}:`, error);
      }
    }

    // 4. Verificar el resultado

    const finalProjects = await prisma.project.findMany({
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
      take: 10
    });

    finalProjects.forEach(project => {
      const phaseName = project.phases?.nombre || 'Sin fase';

    });

    // 5. Estadísticas finales

    const totalProjects = await prisma.project.count();
    const projectsWithPhase = await prisma.project.count({
      where: {
        phase_id: { not: null }
      }
    });

  } catch (error) {
    console.error('❌ Error durante la asignación de fases:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar la asignación
assignPhasesToProjects();
