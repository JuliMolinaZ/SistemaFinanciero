// Script para verificar si el proyecto con ID 9 existe
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkProjectExists() {
  try {
    console.log('🔍 Verificando si el proyecto con ID 9 existe...\n');
    
    // 1. Verificar si el proyecto existe
    const project = await prisma.project.findUnique({
      where: { id: 9 }
    });
    
    if (project) {
      console.log('✅ Proyecto encontrado:');
      console.log('   - ID:', project.id);
      console.log('   - Nombre:', project.nombre);
      console.log('   - Descripción:', project.descripcion);
      console.log('   - Cliente ID:', project.cliente_id);
      console.log('   - Estado:', project.estado);
      console.log('   - Creado:', project.created_at);
    } else {
      console.log('❌ Proyecto con ID 9 NO existe');
    }
    
    // 2. Verificar todos los proyectos disponibles
    console.log('\n📋 Todos los proyectos disponibles:');
    const allProjects = await prisma.project.findMany({
      take: 10,
      orderBy: { id: 'asc' }
    });
    
    allProjects.forEach(p => {
      console.log(`   - ID ${p.id}: ${p.nombre || 'Sin nombre'} (Cliente: ${p.cliente_id})`);
    });
    
    // 3. Verificar si hay algún problema con la relación
    console.log('\n🔗 Verificando relación flow_recovery_v2 -> projects...');
    const flowsWithProject9 = await prisma.flow_recovery_v2.findMany({
      where: { proyecto_id: 9 },
      include: {
        projects: {
          select: {
            id: true,
            nombre: true
          }
        }
      }
    });
    
    console.log(`   - Flows con proyecto_id = 9: ${flowsWithProject9.length}`);
    flowsWithProject9.forEach(flow => {
      console.log(`     * Flow ID ${flow.id}: ${flow.concepto} -> Proyecto: ${flow.projects?.nombre || 'NULL'}`);
    });
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar la verificación
checkProjectExists();
