const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function verifyDatabaseStructure() {
  try {
    console.log('🔍 Verificando estructura real de la base de datos...');

    // 1. Verificar estructura de la tabla projects
    console.log('\n📊 ESTRUCTURA DE LA TABLA PROJECTS:');
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
        console.log(`  - ${col.COLUMN_NAME}: ${col.DATA_TYPE} (${col.IS_NULLABLE === 'YES' ? 'NULL' : 'NOT NULL'}) ${col.COLUMN_DEFAULT ? `DEFAULT: ${col.COLUMN_DEFAULT}` : ''}`);
      });
    } catch (error) {
      console.error('❌ Error al verificar estructura de projects:', error);
    }

    // 2. Verificar estructura de la tabla phases
    console.log('\n📋 ESTRUCTURA DE LA TABLA PHASES:');
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
          console.log(`  - ${col.COLUMN_NAME}: ${col.DATA_TYPE} (${col.IS_NULLABLE === 'YES' ? 'NULL' : 'NOT NULL'}) ${col.COLUMN_DEFAULT ? `DEFAULT: ${col.COLUMN_DEFAULT}` : ''}`);
        });
      } else {
        console.log('  ❌ Tabla phases no encontrada');
      }
    } catch (error) {
      console.error('❌ Error al verificar estructura de phases:', error);
    }

    // 3. Verificar datos de ejemplo en projects
    console.log('\n📋 DATOS DE EJEMPLO EN PROJECTS:');
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
          console.log(`  - ID ${project.id}: "${project.nombre}"`);
          console.log(`    Fase ID: ${project.phase_id || 'NULL'}`);
          console.log(`    Estado: ${project.estado || 'NULL'}`);
          console.log(`    Descripción: ${project.descripcion || 'Sin descripción'}`);
          console.log(`    Creado: ${project.created_at}`);
          console.log('');
        });
      } else {
        console.log('  ❌ No hay proyectos en la base de datos');
      }
    } catch (error) {
      console.error('❌ Error al obtener proyectos:', error);
    }

    // 4. Verificar datos de ejemplo en phases
    console.log('\n📋 DATOS DE EJEMPLO EN PHASES:');
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
          console.log(`  - ID ${phase.id}: "${phase.nombre}" - ${phase.descripcion || 'Sin descripción'}`);
        });
      } else {
        console.log('  ❌ No hay fases en la base de datos');
      }
    } catch (error) {
      console.error('❌ Error al obtener fases:', error);
    }

    // 5. Verificar si los campos estado y descripcion realmente existen
    console.log('\n🔍 VERIFICANDO CAMPOS ESPECÍFICOS:');
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
        console.log(`  - Proyecto ID ${project.id}: "${project.nombre}"`);
        console.log(`    Estado: ${project.estado || 'NULL (campo no existe)'}`);
        console.log(`    Descripción: ${project.descripcion || 'NULL (campo no existe)'}`);
        
        if (project.estado === null && project.descripcion === null) {
          console.log('  ⚠️  Los campos estado y descripcion NO existen en la base de datos');
        } else {
          console.log('  ✅ Los campos estado y descripcion existen en la base de datos');
        }
      }
    } catch (error) {
      console.error('❌ Error al verificar campos específicos:', error);
    }

    console.log('\n🎉 Verificación completada!');

  } catch (error) {
    console.error('❌ Error durante la verificación:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar la verificación
verifyDatabaseStructure();
