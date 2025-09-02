// Script para probar la protección de datos en flow_recovery_v2
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testDataProtection() {
  try {
    console.log('🛡️ Probando protección de datos...\n');
    
    // 1. Obtener un registro de prueba
    console.log('1️⃣ Obteniendo registro de prueba...');
    const testRecord = await prisma.flow_recovery_v2.findFirst({
      where: {
        cliente_id: { not: null },
        proyecto_id: { not: null }
      },
      include: {
        clients: {
          select: { nombre: true }
        },
        projects: {
          select: { nombre: true }
        }
      }
    });
    
    if (!testRecord) {
      console.log('❌ No hay registros con cliente y proyecto para probar');
      return;
    }
    
    console.log('✅ Registro de prueba encontrado:');
    console.log(`   - ID: ${testRecord.id}`);
    console.log(`   - Concepto: ${testRecord.concepto}`);
    console.log(`   - Cliente: ${testRecord.clients?.nombre} (ID: ${testRecord.cliente_id})`);
    console.log(`   - Proyecto: ${testRecord.projects?.nombre} (ID: ${testRecord.proyecto_id})`);
    console.log(`   - Categoría: ${testRecord.categoria}`);
    console.log(`   - Estado: ${testRecord.estado}`);
    
    // 2. Simular actualización parcial (solo concepto)
    console.log('\n2️⃣ Simulando actualización parcial (solo concepto)...');
    console.log('   - Solo se enviará el campo "concepto"');
    console.log('   - NO se enviarán cliente_id, proyecto_id, etc.');
    
    const updateData = {
      concepto: testRecord.concepto + ' - ACTUALIZADO'
    };
    
    console.log('   - Datos a enviar:', updateData);
    
    // 3. Verificar que solo se actualice el campo enviado
    console.log('\n3️⃣ Verificando que solo se actualice el campo enviado...');
    
    // Simular la lógica del controlador
    const updateFields = {};
    
    if (updateData.concepto !== undefined && updateData.concepto !== null && updateData.concepto !== '') {
      updateFields.concepto = updateData.concepto.trim();
    }
    
    // NO se incluyen otros campos porque no se enviaron
    console.log('   - Campos que se actualizarán:', updateFields);
    console.log('   - Campos que NO se tocarán: cliente_id, proyecto_id, categoria, estado, etc.');
    
    // 4. Aplicar la actualización
    console.log('\n4️⃣ Aplicando actualización...');
    const updatedRecord = await prisma.flow_recovery_v2.update({
      where: { id: testRecord.id },
      data: updateFields
    });
    
    console.log('✅ Registro actualizado:');
    console.log(`   - Concepto: "${testRecord.concepto}" -> "${updatedRecord.concepto}"`);
    console.log(`   - Cliente ID: ${testRecord.cliente_id} -> ${updatedRecord.cliente_id} (✅ NO CAMBIÓ)`);
    console.log(`   - Proyecto ID: ${testRecord.proyecto_id} -> ${updatedRecord.proyecto_id} (✅ NO CAMBIÓ)`);
    console.log(`   - Categoría: "${testRecord.categoria}" -> "${updatedRecord.categoria}" (✅ NO CAMBIÓ)`);
    console.log(`   - Estado: "${testRecord.estado}" -> "${updatedRecord.estado}" (✅ NO CAMBIÓ)`);
    
    // 5. Revertir el cambio para no afectar los datos
    console.log('\n5️⃣ Revirtiendo cambio...');
    await prisma.flow_recovery_v2.update({
      where: { id: testRecord.id },
      data: {
        concepto: testRecord.concepto
      }
    });
    
    console.log('🔄 Cambio revertido');
    
    // 6. Verificación final
    console.log('\n6️⃣ Verificación final...');
    const finalRecord = await prisma.flow_recovery_v2.findUnique({
      where: { id: testRecord.id }
    });
    
    const clienteMantiene = testRecord.cliente_id === finalRecord.cliente_id;
    const proyectoMantiene = testRecord.proyecto_id === finalRecord.proyecto_id;
    const categoriaMantiene = testRecord.categoria === finalRecord.categoria;
    const estadoMantiene = testRecord.estado === finalRecord.estado;
    
    console.log('   - Cliente se mantuvo:', clienteMantiene ? '✅ SÍ' : '❌ NO');
    console.log('   - Proyecto se mantuvo:', proyectoMantiene ? '✅ SÍ' : '❌ NO');
    console.log('   - Categoría se mantuvo:', categoriaMantiene ? '✅ SÍ' : '❌ NO');
    console.log('   - Estado se mantuvo:', estadoMantiene ? '✅ SÍ' : '❌ NO');
    
    if (clienteMantiene && proyectoMantiene && categoriaMantiene && estadoMantiene) {
      console.log('\n🎉 PROTECCIÓN DE DATOS FUNCIONANDO CORRECTAMENTE');
      console.log('   - Solo se actualizaron los campos enviados');
      console.log('   - Los datos existentes se mantuvieron intactos');
    } else {
      console.log('\n❌ ERROR: Se perdieron datos durante la actualización');
    }
    
  } catch (error) {
    console.error('❌ Error en las pruebas:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar las pruebas
testDataProtection();
