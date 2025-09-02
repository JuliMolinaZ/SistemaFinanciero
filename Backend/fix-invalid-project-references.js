// Script para corregir referencias inválidas a proyectos en flow_recovery_v2
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function fixInvalidProjectReferences() {
  try {
    console.log('🔧 Corrigiendo referencias inválidas a proyectos...\n');
    
    // 1. Identificar registros con proyecto_id inválido
    console.log('1️⃣ Identificando registros con proyecto_id inválido...');
    const flowsWithInvalidProject = await prisma.flow_recovery_v2.findMany({
      where: {
        proyecto_id: {
          not: null
        }
      },
      include: {
        projects: {
          select: {
            id: true,
            nombre: true
          }
        }
      }
    });
    
    const invalidFlows = flowsWithInvalidProject.filter(flow => !flow.projects);
    console.log(`   - Total de flows con proyecto_id: ${flowsWithInvalidProject.length}`);
    console.log(`   - Flows con proyecto_id inválido: ${invalidFlows.length}`);
    
    if (invalidFlows.length === 0) {
      console.log('✅ No hay referencias inválidas que corregir');
      return;
    }
    
    // 2. Mostrar los registros problemáticos
    console.log('\n2️⃣ Registros con proyecto_id inválido:');
    invalidFlows.forEach(flow => {
      console.log(`   - ID ${flow.id}: "${flow.concepto}" -> proyecto_id: ${flow.proyecto_id} (INEXISTENTE)`);
    });
    
    // 3. Obtener proyectos válidos disponibles
    console.log('\n3️⃣ Proyectos válidos disponibles:');
    const validProjects = await prisma.project.findMany({
      take: 5,
      orderBy: { id: 'asc' }
    });
    
    validProjects.forEach(project => {
      console.log(`   - ID ${project.id}: ${project.nombre} (Cliente: ${project.cliente_id})`);
    });
    
    // 4. Corregir las referencias inválidas
    console.log('\n4️⃣ Corrigiendo referencias inválidas...');
    
    for (const flow of invalidFlows) {
      // Asignar el primer proyecto válido disponible
      const targetProject = validProjects[0];
      
      console.log(`   - Corrigiendo Flow ID ${flow.id}: proyecto_id ${flow.proyecto_id} -> ${targetProject.id}`);
      
      await prisma.flow_recovery_v2.update({
        where: { id: flow.id },
        data: {
          proyecto_id: targetProject.id,
          updated_at: new Date()
        }
      });
      
      console.log(`     ✅ Corregido`);
    }
    
    // 5. Verificar que la corrección funcionó
    console.log('\n5️⃣ Verificando corrección...');
    const correctedFlows = await prisma.flow_recovery_v2.findMany({
      where: {
        id: {
          in: invalidFlows.map(f => f.id)
        }
      },
      include: {
        projects: {
          select: {
            id: true,
            nombre: true
          }
        }
      }
    });
    
    correctedFlows.forEach(flow => {
      if (flow.projects) {
        console.log(`   ✅ Flow ID ${flow.id}: "${flow.concepto}" -> Proyecto: ${flow.projects.nombre}`);
      } else {
        console.log(`   ❌ Flow ID ${flow.id}: "${flow.concepto}" -> AÚN SIN PROYECTO`);
      }
    });
    
    console.log('\n🎉 Corrección de referencias completada');
    
  } catch (error) {
    console.error('❌ Error durante la corrección:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar la corrección
fixInvalidProjectReferences();
