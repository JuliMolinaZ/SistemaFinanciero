// 🔧 MIGRACIÓN: Agregar campo team_type a project_members
// ======================================================

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function addTeamTypeField() {
  try {

    // 1. Agregar columna team_type (esto ya está en el schema.prisma)

    // 2. Verificar si la columna ya existe
    try {
      await prisma.$executeRaw`SELECT team_type FROM project_members LIMIT 1`;

    } catch (error) {

      // Agregar la columna
      await prisma.$executeRaw`
        ALTER TABLE project_members 
        ADD COLUMN team_type VARCHAR(20) DEFAULT 'operations'
      `;

    }

    // 3. Actualizar registros existentes con valor por defecto
    const result = await prisma.$executeRaw`
      UPDATE project_members 
      SET team_type = 'operations' 
      WHERE team_type IS NULL OR team_type = ''
    `;

    // 3. Verificar la migración
    const count = await prisma.projectMember.count();

    // 4. Mostrar algunos ejemplos
    const samples = await prisma.projectMember.findMany({
      take: 5,
      include: {
        user: {
          select: { name: true }
        },
        project: {
          select: { nombre: true }
        }
      }
    });

    samples.forEach(member => {

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
  addTeamTypeField()
    .then(() => {

      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Error ejecutando script:', error);
      process.exit(1);
    });
}

module.exports = { addTeamTypeField };
