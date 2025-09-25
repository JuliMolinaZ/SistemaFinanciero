const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testStatusUpdate() {
  try {

    // 1. Verificar proyectos existentes con sus estados

    const projects = await prisma.project.findMany({
      select: {
        id: true,
        nombre: true,
        estado: true,
        phase_id: true
      },
      take: 5
    });

    projects.forEach(project => {

    });

    // 2. Probar actualización de estado de un proyecto
    if (projects.length > 0) {
      const testProject = projects[0];

      // Cambiar a un estado diferente
      const currentStatus = testProject.estado || 'activo';
      const newStatus = currentStatus === 'activo' ? 'en_progreso' : 'activo';

      // Actualizar solo el estado
      const updatedProject = await prisma.project.update({
        where: { id: testProject.id },
        data: { estado: newStatus }
      });

      // Verificar que se actualizó
      const verifyProject = await prisma.project.findUnique({
        where: { id: testProject.id },
        select: {
          id: true,
          nombre: true,
          estado: true
        }
      });

      // Revertir el cambio para no afectar los datos
      await prisma.project.update({
        where: { id: testProject.id },
        data: { estado: currentStatus }
      });

    }

    // 3. Probar actualización de múltiples campos (estado + fase)
    if (projects.length > 1) {
      const testProject2 = projects[1];

      const currentStatus2 = testProject2.estado || 'activo';
      const currentPhase2 = testProject2.phase_id || 1;
      const newStatus2 = currentStatus2 === 'activo' ? 'pausado' : 'activo';
      const newPhase2 = currentPhase2 === 1 ? 2 : 1;

      // Actualizar estado y fase
      const updatedProject2 = await prisma.project.update({
        where: { id: testProject2.id },
        data: { 
          estado: newStatus2,
          phase_id: newPhase2
        }
      });

      // Revertir cambios
      await prisma.project.update({
        where: { id: testProject2.id },
        data: { 
          estado: currentStatus2,
          phase_id: currentPhase2
        }
      });

    }

    // 4. Verificar que los estados están disponibles

    const availableStatuses = ['activo', 'en_progreso', 'pausado', 'completado'];
    availableStatuses.forEach(status => {

    });

    // 5. Estadísticas finales

    const statusStats = await prisma.project.groupBy({
      by: ['estado'],
      _count: {
        estado: true
      }
    });
    
    statusStats.forEach(stat => {

    });

  } catch (error) {
    console.error('❌ Error durante la prueba:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar la prueba
testStatusUpdate();
