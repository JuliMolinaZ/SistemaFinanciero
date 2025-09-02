const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testStatusUpdate() {
  try {
    console.log('🧪 Probando actualización del campo ESTADO de proyectos...');

    // 1. Verificar proyectos existentes con sus estados
    console.log('\n📋 PROYECTOS ACTUALES CON SUS ESTADOS:');
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
      console.log(`  - ID ${project.id}: "${project.nombre}"`);
      console.log(`    Estado: ${project.estado || 'NULL'}`);
      console.log(`    Fase ID: ${project.phase_id || 'NULL'}`);
      console.log('');
    });

    // 2. Probar actualización de estado de un proyecto
    if (projects.length > 0) {
      const testProject = projects[0];
      console.log(`🔄 PROBANDO ACTUALIZACIÓN DE ESTADO PARA PROYECTO ID ${testProject.id}:`);
      
      // Cambiar a un estado diferente
      const currentStatus = testProject.estado || 'activo';
      const newStatus = currentStatus === 'activo' ? 'en_progreso' : 'activo';
      
      console.log(`  - Estado actual: ${currentStatus}`);
      console.log(`  - Cambiando a: ${newStatus}`);
      
      // Actualizar solo el estado
      const updatedProject = await prisma.project.update({
        where: { id: testProject.id },
        data: { estado: newStatus }
      });
      
      console.log(`  ✅ Proyecto actualizado exitosamente`);
      console.log(`  - Nuevo estado: ${updatedProject.estado}`);
      
      // Verificar que se actualizó
      const verifyProject = await prisma.project.findUnique({
        where: { id: testProject.id },
        select: {
          id: true,
          nombre: true,
          estado: true
        }
      });
      
      console.log(`  - Verificación: ${verifyProject.estado}`);
      
      // Revertir el cambio para no afectar los datos
      await prisma.project.update({
        where: { id: testProject.id },
        data: { estado: currentStatus }
      });
      
      console.log(`  🔄 Cambio revertido a estado original: ${currentStatus}`);
    }

    // 3. Probar actualización de múltiples campos (estado + fase)
    if (projects.length > 1) {
      const testProject2 = projects[1];
      console.log(`\n🔄 PROBANDO ACTUALIZACIÓN MÚLTIPLE PARA PROYECTO ID ${testProject2.id}:`);
      
      const currentStatus2 = testProject2.estado || 'activo';
      const currentPhase2 = testProject2.phase_id || 1;
      const newStatus2 = currentStatus2 === 'activo' ? 'pausado' : 'activo';
      const newPhase2 = currentPhase2 === 1 ? 2 : 1;
      
      console.log(`  - Estado actual: ${currentStatus2} → Nuevo: ${newStatus2}`);
      console.log(`  - Fase actual: ${currentPhase2} → Nueva: ${newPhase2}`);
      
      // Actualizar estado y fase
      const updatedProject2 = await prisma.project.update({
        where: { id: testProject2.id },
        data: { 
          estado: newStatus2,
          phase_id: newPhase2
        }
      });
      
      console.log(`  ✅ Proyecto actualizado exitosamente`);
      console.log(`  - Nuevo estado: ${updatedProject2.estado}`);
      console.log(`  - Nueva fase: ${updatedProject2.phase_id}`);
      
      // Revertir cambios
      await prisma.project.update({
        where: { id: testProject2.id },
        data: { 
          estado: currentStatus2,
          phase_id: currentPhase2
        }
      });
      
      console.log(`  🔄 Cambios revertidos`);
    }

    // 4. Verificar que los estados están disponibles
    console.log('\n📋 ESTADOS DISPONIBLES:');
    const availableStatuses = ['activo', 'en_progreso', 'pausado', 'completado'];
    availableStatuses.forEach(status => {
      console.log(`  - ${status}`);
    });

    // 5. Estadísticas finales
    console.log('\n📊 ESTADÍSTICAS DE ESTADOS:');
    const statusStats = await prisma.project.groupBy({
      by: ['estado'],
      _count: {
        estado: true
      }
    });
    
    statusStats.forEach(stat => {
      console.log(`  - ${stat.estado || 'NULL'}: ${stat._count.estado} proyectos`);
    });

    console.log('\n🎉 Prueba de actualización de estados completada exitosamente!');

  } catch (error) {
    console.error('❌ Error durante la prueba:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar la prueba
testStatusUpdate();
