const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testPhaseUpdate() {
  try {
    console.log('🧪 Probando actualización de fases de proyectos...');

    // 1. Verificar proyectos existentes con sus fases
    console.log('\n📋 PROYECTOS ACTUALES CON SUS FASES:');
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
      console.log(`  - ID ${project.id}: "${project.nombre}"`);
      console.log(`    Fase ID: ${project.phase_id || 'NULL'}`);
      console.log(`    Fase Nombre: ${project.phases?.nombre || 'Sin fase'}`);
      console.log('');
    });

    // 2. Probar actualización de fase de un proyecto
    if (projects.length > 0) {
      const testProject = projects[0];
      console.log(`🔄 PROBANDO ACTUALIZACIÓN DE FASE PARA PROYECTO ID ${testProject.id}:`);
      
      // Cambiar a una fase diferente
      const newPhaseId = testProject.phase_id === 1 ? 2 : 1;
      const newPhase = await prisma.phase.findUnique({
        where: { id: newPhaseId }
      });
      
      console.log(`  - Fase actual: ${testProject.phases?.nombre || 'Sin fase'} (ID: ${testProject.phase_id})`);
      console.log(`  - Cambiando a: ${newPhase?.nombre} (ID: ${newPhaseId})`);
      
      // Actualizar solo el phase_id
      const updatedProject = await prisma.project.update({
        where: { id: testProject.id },
        data: { phase_id: newPhaseId }
      });
      
      console.log(`  ✅ Proyecto actualizado exitosamente`);
      console.log(`  - Nuevo phase_id: ${updatedProject.phase_id}`);
      
      // Verificar que se actualizó
      const verifyProject = await prisma.project.findUnique({
        where: { id: testProject.id },
        include: {
          phases: true
        }
      });
      
      console.log(`  - Verificación: ${verifyProject.phases?.nombre} (ID: ${verifyProject.phase_id})`);
      
      // Revertir el cambio para no afectar los datos
      await prisma.project.update({
        where: { id: testProject.id },
        data: { phase_id: testProject.phase_id }
      });
      
      console.log(`  🔄 Cambio revertido a fase original`);
    }

    // 3. Verificar que las fases están disponibles
    console.log('\n📋 FASES DISPONIBLES:');
    const phases = await prisma.phase.findMany({
      orderBy: { id: 'asc' }
    });

    phases.forEach(phase => {
      console.log(`  - ID ${phase.id}: "${phase.nombre}" - ${phase.descripcion || 'Sin descripción'}`);
    });

    // 4. Estadísticas finales
    console.log('\n📊 ESTADÍSTICAS:');
    const totalProjects = await prisma.project.count();
    const projectsWithPhase = await prisma.project.count({
      where: {
        phase_id: { not: null }
      }
    });
    
    console.log(`  - Total de proyectos: ${totalProjects}`);
    console.log(`  - Proyectos con fase: ${projectsWithPhase}`);
    console.log(`  - Proyectos sin fase: ${totalProjects - projectsWithPhase}`);

    console.log('\n🎉 Prueba de actualización de fases completada exitosamente!');

  } catch (error) {
    console.error('❌ Error durante la prueba:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar la prueba
testPhaseUpdate();
