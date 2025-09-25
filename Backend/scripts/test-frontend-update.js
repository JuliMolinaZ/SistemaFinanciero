const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testFrontendUpdate() {
  try {

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

      return;
    }

    // 2. Simular datos del formulario (como los envía el frontend)
    const formData = {
      nombre: testProject.nombre,
      estado: 'pausado', // Cambiar solo el estado
      phase_id: testProject.phase_id,
      descripcion: testProject.descripcion
    };

    // 3. Simular datos originales (como los almacena el frontend)
    const originalData = {
      nombre: testProject.nombre,
      estado: testProject.estado,
      phase_id: testProject.phase_id,
      descripcion: testProject.descripcion
    };

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

    // 5. Simular la actualización en el backend

    try {
      const updatedProject = await prisma.project.update({
        where: { id: testProject.id },
        data: modifiedFields
      });

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

      // 7. Revertir el cambio
      await prisma.project.update({
        where: { id: testProject.id },
        data: { estado: testProject.estado }
      });

    } catch (error) {
      console.error('❌ Error al actualizar:', error);
    }

    // 8. Probar con diferentes tipos de datos

    // Escenario 1: Solo cambiar estado

    const scenario1 = {
      nombre: testProject.nombre,
      estado: 'en_progreso',
      phase_id: testProject.phase_id,
      descripcion: testProject.descripcion
    };
    
    const modified1 = getModifiedFields(originalData, scenario1);

    // Escenario 2: Solo cambiar fase

    const scenario2 = {
      nombre: testProject.nombre,
      estado: testProject.estado,
      phase_id: testProject.phase_id === 1 ? 2 : 1,
      descripcion: testProject.descripcion
    };
    
    const modified2 = getModifiedFields(originalData, scenario2);

  } catch (error) {
    console.error('❌ Error durante la prueba:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar la prueba
testFrontendUpdate();
