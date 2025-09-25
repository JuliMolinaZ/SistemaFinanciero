// Script temporal para agregar datos de prueba a usuarios existentes
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Departamentos disponibles
const departments = ['Tecnología', 'Operaciones', 'Administrativo', 'Contable'];

// Cargos disponibles
const positions = ['Project Manager', 'Desarrollador', 'Gerente', 'Auxiliar Operativo', 'Contador', 'Administrador'];

// Códigos de país más comunes
const countryCodes = ['+57', '+1', '+52', '+34', '+54'];

// Función para generar fecha de nacimiento aleatoria (entre 25 y 65 años)
function generateBirthDate() {
  const now = new Date();
  const minAge = 25;
  const maxAge = 65;
  const ageInMs = (minAge + Math.random() * (maxAge - minAge)) * 365.25 * 24 * 60 * 60 * 1000;
  const birthDate = new Date(now.getTime() - ageInMs);
  return birthDate.toISOString().split('T')[0]; // Formato YYYY-MM-DD
}

// Función para generar teléfono aleatorio
function generatePhone() {
  const numbers = Math.floor(3000000 + Math.random() * 6999999).toString();
  return numbers;
}

async function updateExistingUsers() {
  try {

    // Obtener todos los usuarios que no tienen datos completos
    const usersToUpdate = await prisma.user.findMany({
      where: {
        OR: [
          { birth_date: null },
          { phone_country_code: null },
          { department: null },
          { position: null },
          { phone: null }
        ]
      },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        phone_country_code: true,
        department: true,
        position: true,
        birth_date: true,
        role: true
      }
    });

    let updatedCount = 0;

    for (const user of usersToUpdate) {
      const updateData = {};

      // Solo actualizar campos que estén vacíos o null
      if (!user.birth_date) {
        updateData.birth_date = new Date(generateBirthDate());
      }

      if (!user.phone_country_code) {
        updateData.phone_country_code = countryCodes[Math.floor(Math.random() * countryCodes.length)];
      }

      if (!user.phone) {
        updateData.phone = generatePhone();
      }

      if (!user.department) {
        // Asignar departamento basado en el rol si es posible
        if (user.role) {
          const roleLower = user.role.toLowerCase();
          if (roleLower.includes('desarrollador') || roleLower.includes('dev')) {
            updateData.department = 'Tecnología';
          } else if (roleLower.includes('contador') || roleLower.includes('contable')) {
            updateData.department = 'Contable';
          } else if (roleLower.includes('operador') || roleLower.includes('auxiliar')) {
            updateData.department = 'Operaciones';
          } else {
            updateData.department = 'Administrativo';
          }
        } else {
          updateData.department = departments[Math.floor(Math.random() * departments.length)];
        }
      }

      if (!user.position) {
        // Asignar posición basada en el rol si es posible
        if (user.role) {
          const roleLower = user.role.toLowerCase();
          if (roleLower.includes('desarrollador') || roleLower.includes('dev')) {
            updateData.position = 'Desarrollador';
          } else if (roleLower.includes('pm') || roleLower.includes('manager')) {
            updateData.position = 'Project Manager';
          } else if (roleLower.includes('gerente')) {
            updateData.position = 'Gerente';
          } else if (roleLower.includes('contador')) {
            updateData.position = 'Contador';
          } else if (roleLower.includes('admin')) {
            updateData.position = 'Administrador';
          } else {
            updateData.position = 'Auxiliar Operativo';
          }
        } else {
          updateData.position = positions[Math.floor(Math.random() * positions.length)];
        }
      }

      // Solo actualizar si hay cambios
      if (Object.keys(updateData).length > 0) {
        updateData.updated_at = new Date();

        await prisma.user.update({
          where: { id: user.id },
          data: updateData
        });

        updatedCount++;
      }
    }

    // Mostrar estadísticas finales
    const stats = await prisma.user.groupBy({
      by: ['department'],
      _count: { department: true },
      where: { department: { not: null } }
    });

    stats.forEach(stat => {

    });

  } catch (error) {
    console.error('❌ Error actualizando usuarios:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar si el script es llamado directamente
if (require.main === module) {
  updateExistingUsers();
}

module.exports = { updateExistingUsers };