const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

// Función para leer y ejecutar el archivo SQL
async function executeSQLMigration() {
  try {
    console.log('🚀 Iniciando migración del sistema de roles...');
    
    // Leer el archivo SQL
    const sqlPath = path.join(__dirname, 'sql', 'roles-system-migration.sql');
    const sqlContent = fs.readFileSync(sqlPath, 'utf8');
    
    // Dividir el SQL en comandos individuales
    const commands = sqlContent
      .split(';')
      .map(cmd => cmd.trim())
      .filter(cmd => cmd.length > 0 && !cmd.startsWith('--'));
    
    console.log(`📋 Se encontraron ${commands.length} comandos SQL para ejecutar`);
    
    // Ejecutar cada comando
    for (let i = 0; i < commands.length; i++) {
      const command = commands[i];
      if (command.trim()) {
        try {
          console.log(`⏳ Ejecutando comando ${i + 1}/${commands.length}...`);
          
          // Ejecutar el comando usando Prisma
          await prisma.$executeRawUnsafe(command);
          
          console.log(`✅ Comando ${i + 1} ejecutado exitosamente`);
        } catch (error) {
          console.error(`❌ Error en comando ${i + 1}:`, error.message);
          // Continuar con el siguiente comando
        }
      }
    }
    
    console.log('🎉 Migración del sistema de roles completada');
    
    // Verificar que las tablas se crearon correctamente
    await verifyMigration();
    
  } catch (error) {
    console.error('❌ Error durante la migración:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Función para verificar que la migración fue exitosa
async function verifyMigration() {
  try {
    console.log('\n🔍 Verificando migración...');
    
    // Verificar tabla roles
    const rolesCount = await prisma.roles.count();
    console.log(`📊 Tabla roles: ${rolesCount} registros`);
    
    // Verificar tabla role_permissions
    const permissionsCount = await prisma.role_permissions.count();
    console.log(`📊 Tabla role_permissions: ${permissionsCount} registros`);
    
    // Verificar tabla system_modules
    const modulesCount = await prisma.system_modules.count();
    console.log(`📊 Tabla system_modules: ${modulesCount} registros`);
    
    // Verificar tabla users
    const usersCount = await prisma.users.count();
    console.log(`📊 Tabla users: ${usersCount} registros`);
    
    // Verificar que los usuarios tengan role_id
    const usersWithRole = await prisma.users.count({
      where: {
        role_id: {
          not: null
        }
      }
    });
    
    console.log(`👥 Usuarios con rol asignado: ${usersWithRole}/${usersCount}`);
    
    if (usersWithRole === 0) {
      console.log('\n⚠️  ADVERTENCIA: Ningún usuario tiene rol asignado');
      console.log('🔧 Ejecutando asignación automática de roles...');
      await assignDefaultRoles();
    }
    
  } catch (error) {
    console.error('❌ Error verificando migración:', error);
  }
}

// Función para asignar roles por defecto
async function assignDefaultRoles() {
  try {
    console.log('\n🔧 Asignando roles por defecto...');
    
    // Obtener todos los usuarios
    const users = await prisma.users.findMany();
    
    // Obtener roles disponibles
    const roles = await prisma.roles.findMany();
    
    console.log(`👥 Usuarios encontrados: ${users.length}`);
    console.log(`🎭 Roles disponibles: ${roles.length}`);
    
    // Mapear usuarios a roles según el email
    for (const user of users) {
      let roleId = null;
      
      if (user.email === 'j.molina@runsolutions-services.com') {
        // Julian Molina = Super Admin (Nivel 1)
        roleId = roles.find(r => r.name === 'Administrador')?.id;
        console.log(`👑 Asignando rol Super Admin a ${user.name}`);
      } else if (user.email === 'jc.yanez@runsolutions-services.com') {
        // Juan Carlos = Gerente (Nivel 2)
        roleId = roles.find(r => r.name === 'Juan Carlos')?.id;
        console.log(`👔 Asignando rol Gerente a ${user.name}`);
      } else if (user.email === 'j.oviedo@runsolutions-services.com') {
        // Jessica = Administradora (Nivel 2)
        roleId = roles.find(r => r.name === 'Administrador')?.id;
        console.log(`👩‍💼 Asignando rol Administradora a ${user.name}`);
      } else {
        // Usuario de prueba = Operador (Nivel 5)
        roleId = roles.find(r => r.name === 'Operador')?.id;
        console.log(`👤 Asignando rol Operador a ${user.name}`);
      }
      
      if (roleId) {
        await prisma.users.update({
          where: { id: user.id },
          data: { 
            role_id: roleId,
            is_active: true
          }
        });
        console.log(`✅ Rol asignado a ${user.name}`);
      }
    }
    
    console.log('🎉 Roles asignados exitosamente');
    
  } catch (error) {
    console.error('❌ Error asignando roles:', error);
  }
}

// Ejecutar la migración
executeSQLMigration().catch(console.error);
