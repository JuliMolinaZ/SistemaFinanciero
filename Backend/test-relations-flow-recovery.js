// Script para probar las relaciones de flow_recovery_v2
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testFlowRecoveryRelations() {
  try {
    console.log('🔗 Probando relaciones de flow_recovery_v2...\n');
    
    // 1. Obtener registros con relaciones incluidas
    console.log('1️⃣ Obteniendo registros con relaciones...');
    const flowsWithRelations = await prisma.flow_recovery_v2.findMany({
      take: 5,
      include: {
        clients: {
          select: {
            id: true,
            nombre: true,
            run_cliente: true
          }
        },
        projects: {
          select: {
            id: true,
            nombre: true,
            descripcion: true
          }
        }
      },
      orderBy: { id: 'desc' }
    });
    
    console.log('✅ Registros obtenidos:', flowsWithRelations.length);
    
    // 2. Mostrar cada registro con sus relaciones
    flowsWithRelations.forEach((flow, index) => {
      console.log(`\n📋 Registro ${index + 1}:`);
      console.log(`   - ID: ${flow.id}`);
      console.log(`   - Concepto: ${flow.concepto}`);
      console.log(`   - Monto: ${flow.monto}`);
      console.log(`   - Cliente ID: ${flow.cliente_id}`);
      console.log(`   - Proyecto ID: ${flow.proyecto_id}`);
      
      if (flow.clients) {
        console.log(`   - Cliente: ${flow.clients.nombre} (${flow.clients.run_cliente})`);
      } else {
        console.log(`   - Cliente: Sin relación`);
      }
      
      if (flow.projects) {
        console.log(`   - Proyecto: ${flow.projects.nombre}`);
      } else {
        console.log(`   - Proyecto: Sin relación`);
      }
    });
    
    // 3. Verificar que las relaciones estén funcionando
    console.log('\n2️⃣ Verificando integridad de relaciones...');
    
    const flowsWithClient = flowsWithRelations.filter(f => f.clients);
    const flowsWithProject = flowsWithRelations.filter(f => f.projects);
    
    console.log(`   - Flows con cliente: ${flowsWithClient.length}/${flowsWithRelations.length}`);
    console.log(`   - Flows con proyecto: ${flowsWithProject.length}/${flowsWithRelations.length}`);
    
    // 4. Probar consulta específica por cliente
    if (flowsWithClient.length > 0) {
      const firstClient = flowsWithClient[0].clients;
      console.log(`\n3️⃣ Probando consulta por cliente: ${firstClient.nombre}`);
      
      const flowsByClient = await prisma.flow_recovery_v2.findMany({
        where: { cliente_id: firstClient.id },
        include: {
          clients: {
            select: { nombre: true }
          }
        }
      });
      
      console.log(`   - Flows encontrados para ${firstClient.nombre}: ${flowsByClient.length}`);
    }
    
    // 5. Probar consulta específica por proyecto
    if (flowsWithProject.length > 0) {
      const firstProject = flowsWithProject[0].projects;
      console.log(`\n4️⃣ Probando consulta por proyecto: ${firstProject.nombre}`);
      
      const flowsByProject = await prisma.flow_recovery_v2.findMany({
        where: { proyecto_id: firstProject.id },
        include: {
          projects: {
            select: { nombre: true }
          }
        }
      });
      
      console.log(`   - Flows encontrados para ${firstProject.nombre}: ${flowsByProject.length}`);
    }
    
    console.log('\n🎉 Prueba de relaciones completada');
    
  } catch (error) {
    console.error('❌ Error en las pruebas:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar las pruebas
testFlowRecoveryRelations();
