// Script para agregar el campo estado a la tabla cuentas_por_cobrar
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function addEstadoField() {
  try {
    console.log('🔄 Agregando campo estado a la tabla cuentas_por_cobrar...');
    
    // Agregar el campo estado usando SQL directo
    await prisma.$executeRaw`
      ALTER TABLE cuentas_por_cobrar 
      ADD COLUMN estado VARCHAR(50) DEFAULT 'pendiente'
    `;
    
    console.log('✅ Campo estado agregado exitosamente');
    
    // Actualizar registros existentes para tener un estado por defecto
    const updatedCount = await prisma.$executeRaw`
      UPDATE cuentas_por_cobrar 
      SET estado = 'pendiente' 
      WHERE estado IS NULL
    `;
    
    console.log(`✅ ${updatedCount} registros actualizados con estado por defecto`);
    
    // Verificar la estructura de la tabla
    const tableInfo = await prisma.$queryRaw`
      DESCRIBE cuentas_por_cobrar
    `;
    
    console.log('\n📋 Estructura actualizada de la tabla:');
    tableInfo.forEach(column => {
      console.log(`  ${column.Field}: ${column.Type} ${column.Null === 'YES' ? 'NULL' : 'NOT NULL'} ${column.Default ? `DEFAULT ${column.Default}` : ''}`);
    });
    
    console.log('\n🎉 Migración completada exitosamente!');
    
  } catch (error) {
    console.error('❌ Error durante la migración:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar el script
if (require.main === module) {
  addEstadoField()
    .then(() => {
      console.log('✅ Script ejecutado exitosamente');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Error en la ejecución del script:', error);
      process.exit(1);
    });
}

module.exports = { addEstadoField };
