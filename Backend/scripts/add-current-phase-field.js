// 🔧 MIGRACIÓN: Agregar campo current_phase_id a projects
// ======================================================

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function addCurrentPhaseField() {
  try {
    console.log('🚀 Iniciando migración: Agregar campo current_phase_id');

    // 1. Verificar si la columna ya existe
    try {
      await prisma.$executeRaw`SELECT current_phase_id FROM projects LIMIT 1`;
      console.log('✅ La columna current_phase_id ya existe');
      return;
    } catch (error) {
      console.log('🔄 La columna current_phase_id no existe, agregándola...');
    }

    // 2. Agregar la columna current_phase_id
    await prisma.$executeRaw`
      ALTER TABLE projects 
      ADD COLUMN current_phase_id VARCHAR(36) NULL
    `;

    console.log('✅ Columna current_phase_id agregada exitosamente');

    // 3. Verificar la migración
    const count = await prisma.project.count();
    console.log(`✅ Total de proyectos: ${count}`);

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

    console.log('📋 Ejemplos de proyectos:');
    samples.forEach(project => {
      console.log(`  - ${project.nombre} (ID: ${project.id}, Fase: ${project.current_phase_id || 'Sin fase'})`);
    });

    console.log('🎉 Migración completada exitosamente');
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
      console.log('✅ Script ejecutado exitosamente');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Error ejecutando script:', error);
      process.exit(1);
    });
}

module.exports = { addCurrentPhaseField };
