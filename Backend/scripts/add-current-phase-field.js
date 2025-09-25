// 🔧 MIGRACIÓN: Agregar campo current_phase_id a projects
// ======================================================

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function addCurrentPhaseField() {
  try {

    // 1. Verificar si la columna ya existe
    try {
      await prisma.$executeRaw`SELECT current_phase_id FROM projects LIMIT 1`;

      return;
    } catch (error) {

    }

    // 2. Agregar la columna current_phase_id
    await prisma.$executeRaw`
      ALTER TABLE projects 
      ADD COLUMN current_phase_id VARCHAR(36) NULL
    `;

    // 3. Verificar la migración
    const count = await prisma.project.count();

    // 4. Mostrar algunos ejemplos
    const samples = await prisma.project.findMany({
      take: 3,
      select: {
        id: true,
        nombre: true,
        current_phase_id: true,
        status: true
      }
    });

    samples.forEach(project => {

    });

  } catch (error) {
    console.error('❌ Error en la migración:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  addCurrentPhaseField()
    .then(() => {

      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Error ejecutando script:', error);
      process.exit(1);
    });
}

module.exports = { addCurrentPhaseField };
