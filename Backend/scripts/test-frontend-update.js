const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testFrontendUpdate() {
  try {
    console.log('🧪 Simulando actualización del frontend...');

    // 1. Obtener un proyecto para probar
    const testProject = await prisma.project.findFirst({
      select: {
        id: true,
        nombre: true,
        estado: true,
        phase_id: true,
        descripcion: true
      }
    });

    if (!testProject) {
      console.log('❌ No hay proyectos para probar');
      return;
    }

    console.log('📋 PROYECTO DE PRUEBA:');
    console.log(`  - ID: ${testProject.id}`);
    console.log(`  - Nombre: "${testProject.nombre}"`);
    console.log(`  - Estado actual: ${testProject.estado || 'NULL'}`);
    console.log(`  - Fase actual: ${testProject.phase_id || 'NULL'}`);
    console.log(`  - Descripción: ${testProject.descripcion || 'NULL'}`);

    // 2. Simular datos del formulario (como los envía el frontend)
    const formData = {
      nombre: testProject.nombre,
      estado: 'pausado', // Cambiar solo el estado
      phase_id: testProject.phase_id,
      descripcion: testProject.descripcion
    };

    console.log('\n🔄 DATOS DEL FORMULARIO (frontend):');
    console.log('  - formData:', formData);

    // 3. Simular datos originales (como los almacena el frontend)
    const originalData = {
      nombre: testProject.nombre,
      estado: testProject.estado,
      phase_id: testProject.phase_id,
      descripcion: testProject.descripcion
    };

    console.log('\n📋 DATOS ORIGINALES (frontend):');
    console.log('  - originalData:', originalData);

    // 4. Simular la función getModifiedFields del frontend
    const getModifiedFields = (original, current) => {
      const modified = {};
      Object.keys(current).forEach(key => {
        if (current[key] !== original[key]) {
          if (current[key] !== '' && current[key] !== null && current[key] !== undefined) {
            modified[key] = current[key];
          }
        }
      });
      return modified;
    };

    const modifiedFields = getModifiedFields(originalData, formData);
    console.log('\n🔍 CAMPOS MODIFICADOS (frontend):');
    console.log('  - modifiedFields:', modifiedFields);

    // 5. Simular la actualización en el backend
    console.log('\n🔄 ACTUALIZANDO EN BACKEND...');
    
    try {
      const updatedProject = await prisma.project.update({
        where: { id: testProject.id },
        data: modifiedFields
      });

      console.log('✅ Proyecto actualizado exitosamente');
      console.log('  - Nuevo estado:', updatedProject.estado);
      console.log('  - Nuevo phase_id:', updatedProject.phase_id);

      // 6. Verificar que se actualizó
      const verifyProject = await prisma.project.findUnique({
        where: { id: testProject.id },
        select: {
          id: true,
          nombre: true,
          estado: true,
          phase_id: true,
          descripcion: true
        }
      });

      console.log('\n📊 VERIFICACIÓN:');
      console.log('  - Estado después de actualizar:', verifyProject.estado);
      console.log('  - Fase después de actualizar:', verifyProject.phase_id);

      // 7. Revertir el cambio
      await prisma.project.update({
        where: { id: testProject.id },
        data: { estado: testProject.estado }
      });

      console.log('\n🔄 Cambio revertido a estado original');

    } catch (error) {
      console.error('❌ Error al actualizar:', error);
    }

    // 8. Probar con diferentes tipos de datos
    console.log('\n🧪 PROBANDO DIFERENTES ESCENARIOS:');
    
    // Escenario 1: Solo cambiar estado
    console.log('\n📋 ESCENARIO 1: Solo cambiar estado');
    const scenario1 = {
      nombre: testProject.nombre,
      estado: 'en_progreso',
      phase_id: testProject.phase_id,
      descripcion: testProject.descripcion
    };
    
    const modified1 = getModifiedFields(originalData, scenario1);
    console.log('  - Campos modificados:', modified1);
    
    // Escenario 2: Solo cambiar fase
    console.log('\n📋 ESCENARIO 2: Solo cambiar fase');
    const scenario2 = {
      nombre: testProject.nombre,
      estado: testProject.estado,
      phase_id: testProject.phase_id === 1 ? 2 : 1,
      descripcion: testProject.descripcion
    };
    
    const modified2 = getModifiedFields(originalData, scenario2);
    console.log('  - Campos modificados:', modified2);

    console.log('\n🎉 Prueba de simulación del frontend completada!');

  } catch (error) {
    console.error('❌ Error durante la prueba:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar la prueba
testFrontendUpdate();
