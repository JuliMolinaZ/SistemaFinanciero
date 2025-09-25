const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function addClientColorField() {

  try {
    // Intentar agregar la columna usando SQL directo
    await prisma.$executeRawUnsafe(`
      ALTER TABLE clients ADD COLUMN color VARCHAR(7) DEFAULT '#3B82F6' COMMENT 'Color hex del cliente para visualización'
    `);

    // Actualizar clientes existentes con colores diversos
    await prisma.$executeRawUnsafe(`
      UPDATE clients
      SET color = CASE
          WHEN id % 10 = 1 THEN '#3B82F6'
          WHEN id % 10 = 2 THEN '#10B981'
          WHEN id % 10 = 3 THEN '#F59E0B'
          WHEN id % 10 = 4 THEN '#EF4444'
          WHEN id % 10 = 5 THEN '#8B5CF6'
          WHEN id % 10 = 6 THEN '#06B6D4'
          WHEN id % 10 = 7 THEN '#F97316'
          WHEN id % 10 = 8 THEN '#84CC16'
          WHEN id % 10 = 9 THEN '#EC4899'
          ELSE '#6B7280'
      END
      WHERE color IS NULL OR color = '#3B82F6'
    `);

    // Verificar la actualización
    const clientsWithColors = await prisma.client.findMany({
      select: {
        id: true,
        nombre: true,
        color: true
      },
      take: 10
    });

    clientsWithColors.forEach(client => {

    });

  } catch (error) {
    console.error('❌ Error en la migración:', error);

    // Si el error es que la columna ya existe, solo actualizamos los colores
    if (error.message.includes('column already exists') || error.message.includes('Duplicate column name')) {

      try {
        await prisma.$executeRawUnsafe(`
          UPDATE clients
          SET color = CASE
              WHEN id % 10 = 1 THEN '#3B82F6'
              WHEN id % 10 = 2 THEN '#10B981'
              WHEN id % 10 = 3 THEN '#F59E0B'
              WHEN id % 10 = 4 THEN '#EF4444'
              WHEN id % 10 = 5 THEN '#8B5CF6'
              WHEN id % 10 = 6 THEN '#06B6D4'
              WHEN id % 10 = 7 THEN '#F97316'
              WHEN id % 10 = 8 THEN '#84CC16'
              WHEN id % 10 = 9 THEN '#EC4899'
              ELSE '#6B7280'
          END
          WHERE color IS NULL OR color = '#3B82F6'
        `);

      } catch (updateError) {
        console.error('❌ Error actualizando colores:', updateError);
      }
    }
  } finally {
    await prisma.$disconnect();
  }
}

addClientColorField();