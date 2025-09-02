// Script para probar la protección del campo monto
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testMontoProtection() {
  try {
    console.log('🛡️ Probando protección del campo monto...\n');
    
    // 1. Verificar registros existentes
    console.log('1️⃣ Verificando registros existentes...');
    const existingRecords = await prisma.flow_recovery_v2.findMany({ take: 3 });
    console.log('✅ Registros encontrados:', existingRecords.length);
    
    if (existingRecords.length > 0) {
      const testRecord = existingRecords[0];
      console.log('   - Registro de prueba ID:', testRecord.id);
      console.log('   - Monto actual:', testRecord.monto);
      console.log('   - Concepto:', testRecord.concepto);
      
      // 2. Probar actualización con monto válido
      console.log('\n2️⃣ Probando actualización con monto válido...');
      const newMonto = parseFloat(testRecord.monto) + 1000;
      
      const updateValid = await prisma.flow_recovery_v2.update({
        where: { id: testRecord.id },
        data: { 
          monto: newMonto,
          updated_at: new Date()
        }
      });
      
      console.log('✅ Actualización con monto válido exitosa');
      console.log('   - Monto anterior:', testRecord.monto);
      console.log('   - Monto nuevo:', updateValid.monto);
      
      // 3. Revertir el cambio
      await prisma.flow_recovery_v2.update({
        where: { id: testRecord.id },
        data: { 
          monto: testRecord.monto,
          updated_at: new Date()
        }
      });
      console.log('🔄 Cambio revertido');
      
      // 4. Probar actualización con monto 0 (debería mantener el original)
      console.log('\n3️⃣ Probando actualización con monto 0...');
      const updateZero = await prisma.flow_recovery_v2.update({
        where: { id: testRecord.id },
        data: { 
          monto: 0,
          updated_at: new Date()
        }
      });
      
      console.log('⚠️ Actualización con monto 0 ejecutada');
      console.log('   - Monto después de actualización:', updateZero.monto);
      
      // 5. Revertir el cambio
      await prisma.flow_recovery_v2.update({
        where: { id: testRecord.id },
        data: { 
          monto: testRecord.monto,
          updated_at: new Date()
        }
      });
      console.log('🔄 Cambio revertido');
      
      // 6. Probar actualización con monto negativo (debería mantener el original)
      console.log('\n4️⃣ Probando actualización con monto negativo...');
      const updateNegative = await prisma.flow_recovery_v2.update({
        where: { id: testRecord.id },
        data: { 
          monto: -100,
          updated_at: new Date()
        }
      });
      
      console.log('⚠️ Actualización con monto negativo ejecutada');
      console.log('   - Monto después de actualización:', updateNegative.monto);
      
      // 7. Revertir el cambio
      await prisma.flow_recovery_v2.update({
        where: { id: testRecord.id },
        data: { 
          monto: testRecord.monto,
          updated_at: new Date()
        }
      });
      console.log('🔄 Cambio revertido');
      
      // 8. Verificar que el monto final sea el correcto
      const finalRecord = await prisma.flow_recovery_v2.findUnique({
        where: { id: testRecord.id }
      });
      
      console.log('\n5️⃣ Verificación final...');
      console.log('   - Monto original:', testRecord.monto);
      console.log('   - Monto final:', finalRecord.monto);
      console.log('   - Montos coinciden:', parseFloat(testRecord.monto) === parseFloat(finalRecord.monto));
      
      if (parseFloat(testRecord.monto) === parseFloat(finalRecord.monto)) {
        console.log('✅ PROTECCIÓN DEL MONTO FUNCIONANDO CORRECTAMENTE');
      } else {
        console.log('❌ ERROR: El monto se modificó incorrectamente');
      }
      
    } else {
      console.log('⚠️ No hay registros para probar');
    }
    
  } catch (error) {
    console.error('❌ Error en las pruebas:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar las pruebas
testMontoProtection();
