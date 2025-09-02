const { PrismaClient } = require('@prisma/client');
require('dotenv').config({ path: './config.env' });

const prisma = new PrismaClient();

async function assignPermissionsSimple() {
  try {
    console.log('🔐 Asignando permisos básicos a los roles...\n');

    // Obtener roles
    const roles = await prisma.roles.findMany();
    console.log(`📋 Encontrados ${roles.length} roles:`);
    roles.forEach(role => console.log(`   - ${role.name} (ID: ${role.id})`));

    // Obtener módulos
    const modules = await prisma.$queryRaw`SELECT name FROM system_modules`;
    console.log(`\n📋 Encontrados ${modules.length} módulos`);

    // Para cada rol, asignar permisos básicos
    for (const role of roles) {
      console.log(`\n🔑 Configurando permisos para rol: ${role.name}`);
      
      for (const module of modules) {
        try {
          let canRead = false, canCreate = false, canUpdate = false, canDelete = false, canExport = false, canApprove = false;

          // Configurar permisos según el rol
          switch (role.name) {
            case 'Super Administrador':
              canRead = canCreate = canUpdate = canDelete = canExport = canApprove = true;
              break;
            
            case 'Contador':
              canRead = canCreate = canUpdate = canExport = true;
              canDelete = module.name !== 'proyectos';
              canApprove = module.name !== 'usuarios' && module.name !== 'permisos' && module.name !== 'auditoria';
              break;
            
            case 'Gerente':
              canRead = canCreate = canUpdate = canExport = true;
              canDelete = module.name !== 'usuarios' && module.name !== 'permisos' && module.name !== 'auditoria';
              canApprove = module.name !== 'usuarios' && module.name !== 'permisos' && module.name !== 'auditoria';
              break;
            
            case 'Desarrollador':
              canRead = true;
              canCreate = canUpdate = module.name !== 'usuarios' && module.name !== 'permisos' && module.name !== 'auditoria' && module.name !== 'contabilidad' && module.name !== 'costos_fijos';
              canDelete = module.name !== 'usuarios' && module.name !== 'permisos' && module.name !== 'auditoria' && module.name !== 'contabilidad' && module.name !== 'costos_fijos' && module.name !== 'proyectos';
              canExport = true;
              canApprove = false;
              break;
            
            case 'Invitado':
              canRead = module.name !== 'usuarios' && module.name !== 'permisos' && module.name !== 'auditoria' && module.name !== 'contabilidad' && module.name !== 'costos_fijos';
              canCreate = canUpdate = canDelete = canExport = canApprove = false;
              break;
            
            default:
              canRead = canCreate = canUpdate = canDelete = canExport = canApprove = false;
          }

          // Crear SQL para insertar permiso
          const sql = `INSERT INTO role_permissions 
            (role_id, module, can_read, can_create, can_update, can_delete, can_export, can_approve)
            VALUES (${role.id}, '${module.name}', ${canRead ? 1 : 0}, ${canCreate ? 1 : 0}, ${canUpdate ? 1 : 0}, 
                    ${canDelete ? 1 : 0}, ${canExport ? 1 : 0}, ${canApprove ? 1 : 0})`;

          await prisma.$executeRawUnsafe(sql);
          console.log(`   ✅ ${module.name}: ${canRead ? 'R' : '-'}${canCreate ? 'C' : '-'}${canUpdate ? 'U' : '-'}${canDelete ? 'D' : '-'}${canExport ? 'E' : '-'}${canApprove ? 'A' : '-'}`);

        } catch (error) {
          if (error.message.includes('Duplicate entry')) {
            console.log(`   ⚠️  Permiso ya existe para ${module.name}`);
          } else {
            console.log(`   ❌ Error con módulo ${module.name}: ${error.message}`);
          }
        }
      }
    }

    console.log('\n🔍 Verificación final...');
    
    try {
      const roleCount = await prisma.roles.count();
      const permissionCount = await prisma.$queryRaw`SELECT COUNT(*) as count FROM role_permissions`;
      const moduleCount = await prisma.$queryRaw`SELECT COUNT(*) as count FROM system_modules`;

      console.log(`✅ Roles: ${roleCount}`);
      console.log(`✅ Permisos: ${permissionCount[0].count}`);
      console.log(`✅ Módulos: ${moduleCount[0].count}`);

      console.log('\n🎉 ¡Sistema de roles configurado exitosamente!');
      console.log('📋 Próximos pasos:');
      console.log('   1. Reiniciar el servidor backend');
      console.log('   2. Probar los endpoints de roles');
      console.log('   3. Verificar que los middlewares de permisos funcionen');

    } catch (error) {
      console.log(`❌ Error en verificación final: ${error.message}`);
    }

  } catch (error) {
    console.error('❌ Error general:', error);
  } finally {
    await prisma.$disconnect();
  }
}

assignPermissionsSimple();
