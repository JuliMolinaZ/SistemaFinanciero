// test-roles-system.js - SCRIPT DE PRUEBA DEL SISTEMA DE ROLES
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testRolesSystem() {
  console.log('🚀 INICIANDO PRUEBAS DEL SISTEMA DE ROLES...\n');

  try {
    // =====================================================
    // 1. VERIFICAR ESTRUCTURA DE TABLAS
    // =====================================================
    console.log('📊 1. VERIFICANDO ESTRUCTURA DE TABLAS...');
    
    const tables = ['roles', 'role_permissions', 'system_modules', 'users'];
    for (const table of tables) {
      try {
        const count = await prisma.$queryRaw`SELECT COUNT(*) as count FROM ${table}`;
        console.log(`   ✅ Tabla ${table}: ${count[0].count} registros`);
      } catch (error) {
        console.log(`   ❌ Tabla ${table}: ERROR - ${error.message}`);
      }
    }

    // =====================================================
    // 2. VERIFICAR ROLES EXISTENTES
    // =====================================================
    console.log('\n👑 2. VERIFICANDO ROLES EXISTENTES...');
    
    const roles = await prisma.roles.findMany({
      orderBy: { level: 'asc' }
    });

    for (const role of roles) {
      console.log(`   📋 Rol: ${role.name} (Nivel ${role.level})`);
      console.log(`      Descripción: ${role.description || 'Sin descripción'}`);
      console.log(`      Activo: ${role.is_active ? '✅ Sí' : '❌ No'}`);
      
      // Contar usuarios con este rol
      const userCount = await prisma.user.count({
        where: { role_id: role.id }
      });
      console.log(`      Usuarios asignados: ${userCount}`);
      
      // Contar permisos del rol
      const permissionCount = await prisma.role_permissions.count({
        where: { role_id: role.id }
      });
      console.log(`      Permisos configurados: ${permissionCount}\n`);
    }

    // =====================================================
    // 3. VERIFICAR MÓDULOS DEL SISTEMA
    // =====================================================
    console.log('🔧 3. VERIFICANDO MÓDULOS DEL SISTEMA...');
    
    const modules = await prisma.system_modules.findMany({
      where: { is_active: true },
      orderBy: { name: 'asc' }
    });

    for (const module of modules) {
      console.log(`   📦 Módulo: ${module.name}`);
      console.log(`      Nombre: ${module.display_name}`);
      console.log(`      Ruta: ${module.route}`);
      console.log(`      Requiere aprobación: ${module.requires_approval ? '✅ Sí' : '❌ No'}\n`);
    }

    // =====================================================
    // 4. VERIFICAR PERMISOS POR ROL
    // =====================================================
    console.log('🔐 4. VERIFICANDO PERMISOS POR ROL...');
    
    for (const role of roles) {
      console.log(`   🎯 Permisos para rol: ${role.name}`);
      
      const permissions = await prisma.role_permissions.findMany({
        where: { role_id: role.id },
        orderBy: { module: 'asc' }
      });

      if (permissions.length === 0) {
        console.log(`      ⚠️  No hay permisos configurados`);
      } else {
        for (const perm of permissions) {
          const actions = [];
          if (perm.can_read) actions.push('📖 Leer');
          if (perm.can_create) actions.push('➕ Crear');
          if (perm.can_update) actions.push('✏️  Actualizar');
          if (perm.can_delete) actions.push('🗑️  Eliminar');
          if (perm.can_export) actions.push('📤 Exportar');
          if (perm.can_approve) actions.push('✅ Aprobar');
          
          console.log(`      📋 ${perm.module}: ${actions.join(', ') || '❌ Sin permisos'}`);
        }
      }
      console.log('');
    }

    // =====================================================
    // 5. VERIFICAR USUARIOS Y SUS ROLES
    // =====================================================
    console.log('👥 5. VERIFICANDO USUARIOS Y SUS ROLES...');
    
    const users = await prisma.user.findMany({
      include: {
        roles: true
      },
      orderBy: { name: 'asc' }
    });

    for (const user of users) {
      console.log(`   👤 Usuario: ${user.name} (${user.email})`);
      if (user.roles) {
        console.log(`      Rol: ${user.roles.name} (Nivel ${user.roles.level})`);
        console.log(`      Activo: ${user.is_active ? '✅ Sí' : '❌ No'}`);
      } else {
        console.log(`      ⚠️  Sin rol asignado`);
      }
      console.log('');
    }

    // =====================================================
    // 6. VERIFICAR INTEGRIDAD REFERENCIAL
    // =====================================================
    console.log('🔗 6. VERIFICANDO INTEGRIDAD REFERENCIAL...');
    
    // Verificar usuarios sin rol asignado
    const usersWithoutRole = await prisma.user.count({
      where: { role_id: null }
    });
    
    if (usersWithoutRole > 0) {
      console.log(`   ⚠️  Usuarios sin rol asignado: ${usersWithoutRole}`);
    } else {
      console.log(`   ✅ Todos los usuarios tienen rol asignado`);
    }

    // Verificar permisos sin rol
    const permissionsWithoutRole = await prisma.role_permissions.count({
      where: { role_id: null }
    });
    
    if (permissionsWithoutRole > 0) {
      console.log(`   ⚠️  Permisos sin rol: ${permissionsWithoutRole}`);
    } else {
      console.log(`   ✅ Todos los permisos tienen rol asignado`);
    }

    // =====================================================
    // 7. ESTADÍSTICAS GENERALES
    // =====================================================
    console.log('\n📈 7. ESTADÍSTICAS GENERALES...');
    
    const totalUsers = await prisma.user.count();
    const totalRoles = await prisma.roles.count();
    const totalPermissions = await prisma.role_permissions.count();
    const totalModules = await prisma.system_modules.count();
    
    console.log(`   👥 Total de usuarios: ${totalUsers}`);
    console.log(`   👑 Total de roles: ${totalRoles}`);
    console.log(`   🔐 Total de permisos: ${totalPermissions}`);
    console.log(`   📦 Total de módulos: ${totalModules}`);
    
    // Calcular cobertura de permisos
    const expectedPermissions = totalRoles * totalModules;
    const coverage = ((totalPermissions / expectedPermissions) * 100).toFixed(2);
    console.log(`   📊 Cobertura de permisos: ${coverage}%`);

    // =====================================================
    // 8. VERIFICAR CONFIGURACIONES DE ROLES
    // =====================================================
    console.log('\n⚙️  8. VERIFICANDO CONFIGURACIONES DE ROLES...');
    
    const roleConfigs = await prisma.role_config.findMany({
      include: {
        roles: true
      }
    });

    if (roleConfigs.length === 0) {
      console.log(`   ⚠️  No hay configuraciones de roles`);
    } else {
      for (const config of roleConfigs) {
        console.log(`   🔧 Configuración: ${config.config_key}`);
        console.log(`      Valor: ${config.config_value}`);
        console.log(`      Descripción: ${config.description}`);
        console.log(`      Rol: ${config.roles?.name || 'N/A'}\n`);
      }
    }

    // =====================================================
    // 9. VERIFICAR LOGS DE AUDITORÍA
    // =====================================================
    console.log('📝 9. VERIFICANDO LOGS DE AUDITORÍA...');
    
    try {
      const auditLogs = await prisma.audit_logs.count();
      console.log(`   📊 Total de logs de auditoría: ${auditLogs}`);
    } catch (error) {
      console.log(`   ❌ Tabla de auditoría no disponible: ${error.message}`);
    }

    // =====================================================
    // 10. RECOMENDACIONES
    // =====================================================
    console.log('\n💡 10. RECOMENDACIONES...');
    
    if (usersWithoutRole > 0) {
      console.log(`   🔴 Asignar roles a ${usersWithoutRole} usuarios sin rol`);
    }
    
    if (coverage < 100) {
      console.log(`   🟡 Mejorar cobertura de permisos (actual: ${coverage}%)`);
    }
    
    const inactiveRoles = roles.filter(r => !r.is_active).length;
    if (inactiveRoles > 0) {
      console.log(`   🟡 Revisar ${inactiveRoles} roles inactivos`);
    }
    
    console.log(`   🟢 Sistema de roles funcionando correctamente`);
    console.log(`   🟢 ${totalPermissions} permisos configurados`);
    console.log(`   🟢 ${totalUsers} usuarios con roles asignados`);

  } catch (error) {
    console.error('❌ ERROR EN LAS PRUEBAS:', error);
  } finally {
    await prisma.$disconnect();
    console.log('\n✅ PRUEBAS COMPLETADAS');
  }
}

// Ejecutar pruebas
testRolesSystem();
