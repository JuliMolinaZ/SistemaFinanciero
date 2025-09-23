// Backend/scripts/add-operador-role.js
// =====================================================
// SCRIPT PARA AGREGAR EL ROL "OPERADOR"
// =====================================================

const { PrismaClient } = require('@prisma/client');

async function addOperadorRole() {
  const prisma = new PrismaClient();
  
  try {
    console.log('🔍 Verificando si el rol "Operador" ya existe...');
    
    // Verificar si el rol ya existe
    const existingRole = await prisma.roles.findFirst({
      where: { name: 'Operador' }
    });
    
    if (existingRole) {
      console.log('✅ El rol "Operador" ya existe con ID:', existingRole.id);
      return existingRole;
    }
    
    console.log('➕ Creando nuevo rol "Operador"...');
    
    // Crear el rol Operador
    const newRole = await prisma.roles.create({
      data: {
        name: 'Operador',
        description: 'Operador con acceso limitado a Gestión de Proyectos y Mi Perfil',
        level: 4,
        is_active: true
      }
    });
    
    console.log('✅ Rol "Operador" creado exitosamente:');
    console.log('   ID:', newRole.id);
    console.log('   Nombre:', newRole.name);
    console.log('   Descripción:', newRole.description);
    console.log('   Nivel:', newRole.level);
    
    // Obtener todos los módulos del sistema
    console.log('\n🔍 Obteniendo módulos del sistema...');
    const modules = await prisma.modules.findMany();
    console.log(`📦 Se encontraron ${modules.length} módulos`);
    
    // Configurar permisos básicos para Operador
    console.log('\n🔧 Configurando permisos para Operador...');
    
    const allowedModules = ['project_management', 'dashboard']; // Solo estos módulos
    
    for (const module of modules) {
      const canRead = allowedModules.includes(module.name);
      const canCreate = module.name === 'project_management';
      const canUpdate = module.name === 'project_management';
      
      // Buscar permiso existente
      const existingPermission = await prisma.permissions.findFirst({
        where: {
          role_id: newRole.id,
          module_id: module.id
        }
      });
      
      if (existingPermission) {
        // Actualizar permiso existente
        await prisma.permissions.update({
          where: { id: existingPermission.id },
          data: {
            can_read: canRead,
            can_create: canCreate,
            can_update: canUpdate,
            can_delete: false,
            can_export: canRead,
            can_approve: false
          }
        });
        console.log(`   ✅ Actualizado: ${module.name} - Lectura: ${canRead}`);
      } else {
        // Crear nuevo permiso
        await prisma.permissions.create({
          data: {
            role_id: newRole.id,
            module_id: module.id,
            can_read: canRead,
            can_create: canCreate,
            can_update: canUpdate,
            can_delete: false,
            can_export: canRead,
            can_approve: false
          }
        });
        console.log(`   ➕ Creado: ${module.name} - Lectura: ${canRead}`);
      }
    }
    
    console.log('\n🎉 ¡Rol "Operador" creado y configurado exitosamente!');
    console.log('📋 Permisos configurados:');
    console.log('   ✅ Gestión de Proyectos: Lectura, Creación, Actualización');
    console.log('   ✅ Dashboard: Solo Lectura');
    console.log('   ❌ Todos los demás módulos: Sin acceso');
    
    return newRole;
    
  } catch (error) {
    console.error('❌ Error creando rol Operador:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar el script
if (require.main === module) {
  addOperadorRole()
    .then(() => {
      console.log('\n✅ Script completado exitosamente');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n❌ Script falló:', error);
      process.exit(1);
    });
}

module.exports = { addOperadorRole };
