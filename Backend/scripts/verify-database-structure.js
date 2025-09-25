const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function verifyDatabaseStructure() {
  try {

    // 1. Verificar estructura de la tabla projects

    try {
      const projects = await prisma.$queryRaw`
        SELECT 
          COLUMN_NAME, 
          DATA_TYPE, 
          IS_NULLABLE, 
          COLUMN_DEFAULT
        FROM INFORMATION_SCHEMA.COLUMNS
        WHERE TABLE_SCHEMA = 'runsolutions_runite' 
        AND TABLE_NAME = 'projects'
        ORDER BY ORDINAL_POSITION
      `;
      
      projects.forEach(col => {

      });
    } catch (error) {
      console.error('❌ Error al verificar estructura de projects:', error);
    }

    // 2. Verificar estructura de la tabla phases

    try {
      const phases = await prisma.$queryRaw`
        SELECT 
          COLUMN_NAME, 
          DATA_TYPE, 
          IS_NULLABLE, 
          COLUMN_DEFAULT
        FROM INFORMATION_SCHEMA.COLUMNS
        WHERE TABLE_SCHEMA = 'runsolutions_runite' 
        AND TABLE_NAME = 'phases'
        ORDER BY ORDINAL_POSITION
      `;
      
      if (phases.length > 0) {
        phases.forEach(col => {

        });
      } else {

      }
    } catch (error) {
      console.error('❌ Error al verificar estructura de phases:', error);
    }

    // 3. Verificar datos de ejemplo en projects

    try {
      const sampleProjects = await prisma.project.findMany({
        take: 3,
        select: {
          id: true,
          nombre: true,
          phase_id: true,
          estado: true,
          descripcion: true,
          created_at: true
        }
      });

      if (sampleProjects.length > 0) {
        sampleProjects.forEach(project => {

        });
      } else {

      }
    } catch (error) {
      console.error('❌ Error al obtener proyectos:', error);
    }

    // 4. Verificar datos de ejemplo en phases

    try {
      const samplePhases = await prisma.phase.findMany({
        take: 5,
        select: {
          id: true,
          nombre: true,
          descripcion: true
        }
      });

      if (samplePhases.length > 0) {
        samplePhases.forEach(phase => {

        });
      } else {

      }
    } catch (error) {
      console.error('❌ Error al obtener fases:', error);
    }

    // 5. Verificar si los campos estado y descripcion realmente existen

    try {
      const projectWithFields = await prisma.$queryRaw`
        SELECT 
          id, 
          nombre, 
          estado, 
          descripcion
        FROM projects 
        LIMIT 1
      `;
      
      if (projectWithFields.length > 0) {
        const project = projectWithFields[0];

        if (project.estado === null && project.descripcion === null) {

        } else {

        }
      }
    } catch (error) {
      console.error('❌ Error al verificar campos específicos:', error);
    }

  } catch (error) {
    console.error('❌ Error durante la verificación:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar la verificación
verifyDatabaseStructure();
