// Script para verificar la estructura de flow_recovery_v2 y probar actualizaciones
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testFlowRecoveryStructure() {
  try {
    console.log('🔍 Verificando estructura de la tabla flow_recovery_v2...');
    
    // 1. Verificar si la tabla existe y obtener su estructura
    const tableInfo = await prisma.$queryRaw`
      SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE, COLUMN_DEFAULT, COLUMN_KEY
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = DATABASE() 
      AND TABLE_NAME = 'flow_recovery_v2'
      ORDER BY ORDINAL_POSITION
    `;
    
    console.log('📋 Estructura de la tabla flow_recovery_v2:');
    console.table(tableInfo);
    
    // 2. Verificar si hay registros
    const count = await prisma.flow_recovery_v2.count();
    console.log(`\n📊 Total de registros en flow_recovery_v2: ${count}`);
    
    if (count > 0) {
      // 3. Obtener algunos registros de ejemplo
      const sampleRecords = await prisma.flow_recovery_v2.findMany({ take: 3 });
      console.log('\n📝 Registros de ejemplo:');
      console.table(sampleRecords);
      
      // 4. Probar una actualización
      if (sampleRecords.length > 0) {
        const firstRecord = sampleRecords[0];
        console.log(`\n🔄 Probando actualización del registro ID: ${firstRecord.id}`);
        
        // Intentar actualizar el campo recuperado
        const updatedRecord = await prisma.flow_recovery_v2.update({
          where: { id: firstRecord.id },
          data: { 
            recuperado: !firstRecord.recuperado,
            updated_at: new Date()
          }
        });
        
        console.log('✅ Registro actualizado exitosamente:');
        console.log('  - Antes:', { id: firstRecord.id, recuperado: firstRecord.recuperado });
        console.log('  - Después:', { id: updatedRecord.id, recuperado: updatedRecord.recuperado });
        
        // Revertir el cambio
        await prisma.flow_recovery_v2.update({
          where: { id: firstRecord.id },
          data: { 
            recuperado: firstRecord.recuperado,
            updated_at: new Date()
          }
        });
        console.log('🔄 Cambio revertido');
      }
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar la prueba
testFlowRecoveryStructure();
