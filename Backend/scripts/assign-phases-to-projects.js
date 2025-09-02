const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function assignPhasesToProjects() {
  try {
    console.log('🔧 Asignando fases a los proyectos existentes...');

    // 1. Verificar fases disponibles
    console.log('\n📋 FASES DISPONIBLES:');
    const phases = await prisma.phase.findMany({
      orderBy: { id: 'asc' }
    });

    if (phases.length === 0) {
      console.log('❌ No hay fases disponibles en la base de datos');
      return;
    }

    phases.forEach(phase => {
      console.log(`  - ID ${phase.id}: "${phase.nombre}" - ${phase.descripcion || 'Sin descripción'}`);
    });

    // 2. Verificar proyectos sin fase
    console.log('\n📋 PROYECTOS SIN FASE:');
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

    console.log(`  - Total de proyectos sin fase: ${projectsWithoutPhase.length}`);

    if (projectsWithoutPhase.length === 0) {
      console.log('✅ Todos los proyectos ya tienen fase asignada');
      return;
    }

    // Mostrar algunos ejemplos
    projectsWithoutPhase.slice(0, 5).forEach(project => {
      console.log(`    - ID ${project.id}: "${project.nombre}"`);
    });

    // 3. Asignar fases de manera inteligente
    console.log('\n🔄 ASIGNANDO FASES A PROYECTOS...');
    
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
        
        console.log(`  ✅ Proyecto "${project.nombre}" (ID: ${project.id}) → Fase: "${selectedPhase.nombre}"`);
        updatedCount++;
      } catch (error) {
        console.error(`  ❌ Error al actualizar proyecto ${project.id}:`, error);
      }
    }

    // 4. Verificar el resultado
    console.log('\n📊 VERIFICANDO RESULTADO:');
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

    console.log('  - Primeros 10 proyectos con sus fases:');
    finalProjects.forEach(project => {
      const phaseName = project.phases?.nombre || 'Sin fase';
      console.log(`    - ID ${project.id}: "${project.nombre}" → Fase: "${phaseName}"`);
    });

    // 5. Estadísticas finales
    console.log('\n📈 ESTADÍSTICAS FINALES:');
    const totalProjects = await prisma.project.count();
    const projectsWithPhase = await prisma.project.count({
      where: {
        phase_id: { not: null }
      }
    });
    
    console.log(`  - Total de proyectos: ${totalProjects}`);
    console.log(`  - Proyectos con fase: ${projectsWithPhase}`);
    console.log(`  - Proyectos sin fase: ${totalProjects - projectsWithPhase}`);
    console.log(`  - Proyectos actualizados en esta ejecución: ${updatedCount}`);

    console.log('\n🎉 Asignación de fases completada exitosamente!');

  } catch (error) {
    console.error('❌ Error durante la asignación de fases:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar la asignación
assignPhasesToProjects();
