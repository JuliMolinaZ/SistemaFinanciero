// 🔧 MIGRACIÓN: Agregar campo team_type a project_members
// ======================================================

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function addTeamTypeField() {
  try {
    console.log('🚀 Iniciando migración: Agregar campo team_type');

    // 1. Agregar columna team_type (esto ya está en el schema.prisma)
    console.log('✅ Campo team_type agregado al schema');

    // 2. Verificar si la columna ya existe
    try {
      await prisma.$executeRaw`SELECT team_type FROM project_members LIMIT 1`;
      console.log('✅ La columna team_type ya existe');
    } catch (error) {
      console.log('🔄 Agregando columna team_type...');
      
      // Agregar la columna
      await prisma.$executeRaw`
        ALTER TABLE project_members 
        ADD COLUMN team_type VARCHAR(20) DEFAULT 'operations'
      `;
      
      console.log('✅ Columna team_type agregada exitosamente');
    }

    // 3. Actualizar registros existentes con valor por defecto
    const result = await prisma.$executeRaw`
      UPDATE project_members 
      SET team_type = 'operations' 
      WHERE team_type IS NULL OR team_type = ''
    `;

    console.log(`✅ Actualizados ${result} registros con team_type = 'operations'`);

    // 3. Verificar la migración
    const count = await prisma.projectMember.count();
    console.log(`✅ Total de miembros de proyecto: ${count}`);

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

    console.log('📋 Ejemplos de registros:');
    samples.forEach(member => {
      console.log(`  - ${member.user.name} → ${member.project.nombre} (${member.team_type})`);
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
  addTeamTypeField()
    .then(() => {
      console.log('✅ Script ejecutado exitosamente');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Error ejecutando script:', error);
      process.exit(1);
    });
}

module.exports = { addTeamTypeField };
