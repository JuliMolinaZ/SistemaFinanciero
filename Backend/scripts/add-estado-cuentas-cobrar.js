// Script para agregar el campo estado a la tabla cuentas_por_cobrar
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function addEstadoField() {
  try {

    // Agregar el campo estado usando SQL directo
    await prisma.$executeRaw`
      ALTER TABLE cuentas_por_cobrar 
      ADD COLUMN estado VARCHAR(50) DEFAULT 'pendiente'
    `;

    // Actualizar registros existentes para tener un estado por defecto
    const updatedCount = await prisma.$executeRaw`
      UPDATE cuentas_por_cobrar 
      SET estado = 'pendiente' 
      WHERE estado IS NULL
    `;

    // Verificar la estructura de la tabla
    const tableInfo = await prisma.$queryRaw`
      DESCRIBE cuentas_por_cobrar
    `;

    tableInfo.forEach(column => {

    });

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

      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Error en la ejecución del script:', error);
      process.exit(1);
    });
}

module.exports = { addEstadoField };
