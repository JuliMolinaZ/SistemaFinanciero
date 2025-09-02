// check-all-users.js - Script para verificar todos los usuarios en el sistema

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const checkAllUsers = async () => {
  console.log('🔍 VERIFICANDO TODOS LOS USUARIOS EN EL SISTEMA');
  console.log('================================================');
  
  try {
    // Conectar a la base de datos
    await prisma.$connect();
    console.log('✅ Conexión a la base de datos establecida');
    
    // Obtener TODOS los usuarios
    console.log('\n📋 Obteniendo todos los usuarios...');
    const allUsers = await prisma.user.findMany({
      include: {
        roles: {
          select: {
            name: true,
            description: true
          }
        }
      },
      orderBy: {
        created_at: 'desc'
      }
    });
    
    console.log(`✅ Total de usuarios encontrados: ${allUsers.length}`);
    
    if (allUsers.length === 0) {
      console.log('⚠️ No hay usuarios en el sistema');
      return;
    }
    
    // Mostrar información detallada de cada usuario
    console.log('\n📝 DETALLES DE USUARIOS:');
    console.log('========================');
    
    allUsers.forEach((user, index) => {
      console.log(`\n👤 Usuario ${index + 1}:`);
      console.log(`   ID: ${user.id}`);
      console.log(`   Email: ${user.email || 'Sin email'}`);
      console.log(`   Nombre: ${user.name || 'Sin nombre'}`);
      console.log(`   Apellido: ${user.last_name || 'Sin apellido'}`);
      console.log(`   Rol: ${user.roles?.name || 'Sin rol asignado'}`);
      console.log(`   Perfil Completo: ${user.profile_complete ? '✅ Sí' : '❌ No'}`);
      console.log(`   Primer Login: ${user.is_first_login ? '✅ Sí' : '❌ No'}`);
      console.log(`   Fecha de Registro: ${user.created_at ? new Date(user.created_at).toLocaleString('es-ES') : 'Sin fecha'}`);
      console.log(`   Último Acceso: ${user.last_login ? new Date(user.last_login).toLocaleString('es-ES') : 'Sin acceso'}`);
      console.log(`   Estado: ${user.status || 'Sin estado'}`);
    });
    
    // Análisis de usuarios por estado
    console.log('\n📊 ANÁLISIS POR ESTADO:');
    console.log('========================');
    
    const completedProfiles = allUsers.filter(u => u.profile_complete);
    const pendingProfiles = allUsers.filter(u => !u.profile_complete);
    const withRoles = allUsers.filter(u => u.roles);
    const withoutRoles = allUsers.filter(u => !u.roles);
    
    console.log(`✅ Perfiles completados: ${completedProfiles.length}`);
    console.log(`⏳ Perfiles pendientes: ${pendingProfiles.length}`);
    console.log(`🔑 Con rol asignado: ${withRoles.length}`);
    console.log(`❌ Sin rol asignado: ${withoutRoles.length}`);
    
    // Mostrar usuarios pendientes específicamente
    if (pendingProfiles.length > 0) {
      console.log('\n⏳ USUARIOS PENDIENTES DE COMPLETAR PERFIL:');
      console.log('============================================');
      
      pendingProfiles.forEach((user, index) => {
        console.log(`\n👤 Pendiente ${index + 1}:`);
        console.log(`   ID: ${user.id}`);
        console.log(`   Email: ${user.email || 'Sin email'}`);
        console.log(`   Rol: ${user.roles?.name || 'Sin rol asignado'}`);
        console.log(`   Fecha de Registro: ${user.created_at ? new Date(user.created_at).toLocaleString('es-ES') : 'Sin fecha'}`);
      });
    }
    
    // Mostrar usuarios sin rol
    if (withoutRoles.length > 0) {
      console.log('\n❌ USUARIOS SIN ROL ASIGNADO:');
      console.log('==============================');
      
      withoutRoles.forEach((user, index) => {
        console.log(`\n👤 Sin Rol ${index + 1}:`);
        console.log(`   ID: ${user.id}`);
        console.log(`   Email: ${user.email || 'Sin email'}`);
        console.log(`   Perfil Completo: ${user.profile_complete ? '✅ Sí' : '❌ No'}`);
        console.log(`   Fecha de Registro: ${user.created_at ? new Date(user.created_at).toLocaleString('es-ES') : 'Sin fecha'}`);
      });
    }
    
  } catch (error) {
    console.error('❌ Error al verificar usuarios:', error);
  } finally {
    await prisma.$disconnect();
    console.log('\n✅ Conexión a la base de datos cerrada');
  }
  
  console.log('\n================================================');
  console.log('🔍 VERIFICACIÓN COMPLETADA');
};

// Ejecutar la verificación
checkAllUsers();
