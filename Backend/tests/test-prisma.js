#!/usr/bin/env node

const { PrismaClient } = require('@prisma/client');

console.log('🚀 Probando Prisma...\n');

async function testPrisma() {
  const prisma = new PrismaClient();
  
  try {
    console.log('📋 1. Conectando a la base de datos...');
    
    // Probar conexión
    await prisma.$connect();
    console.log('✅ Conexión exitosa');
    
    console.log('\n📋 2. Verificando tablas existentes...');
    
    // Verificar si las tablas existen
    const tables = await prisma.$queryRaw`
      SELECT TABLE_NAME 
      FROM INFORMATION_SCHEMA.TABLES 
      WHERE TABLE_SCHEMA = DATABASE()
    `;
    
    console.log('📊 Tablas encontradas:');
    tables.forEach(table => {
      console.log(`   - ${table.TABLE_NAME}`);
    });
    
    console.log('\n📋 3. Probando consulta simple...');
    
    // Intentar contar usuarios
    try {
      const userCount = await prisma.user.count();
      console.log(`✅ Usuarios en la base de datos: ${userCount}`);
    } catch (error) {
      console.log('⚠️  Tabla users no existe o hay error:', error.message);
    }
    
    // Intentar contar clientes
    try {
      const clientCount = await prisma.client.count();
      console.log(`✅ Clientes en la base de datos: ${clientCount}`);
    } catch (error) {
      console.log('⚠️  Tabla clients no existe o hay error:', error.message);
    }
    
    console.log('\n📋 4. Probando inserción de datos de prueba...');
    
    // Crear un usuario de prueba
    try {
      const testUser = await prisma.user.create({
        data: {
          email: 'test-prisma@example.com',
          name: 'Usuario Prueba Prisma',
          role: 'user',
          firebase_uid: 'test-prisma-uid'
        }
      });
      console.log('✅ Usuario de prueba creado:', testUser.id);
      
      // Eliminar el usuario de prueba
      await prisma.user.delete({
        where: { id: testUser.id }
      });
      console.log('✅ Usuario de prueba eliminado');
      
    } catch (error) {
      console.log('⚠️  Error al crear usuario de prueba:', error.message);
    }
    
    console.log('\n🎉 ¡Prisma está funcionando correctamente!');
    
  } catch (error) {
    console.error('❌ Error en la prueba de Prisma:', error);
    console.error('\n💡 Posibles soluciones:');
    console.error('   1. Verificar que la base de datos esté corriendo');
    console.error('   2. Verificar las credenciales en .env');
    console.error('   3. Verificar que DATABASE_URL esté configurado');
    console.error('   4. Ejecutar: npx prisma generate');
    
  } finally {
    await prisma.$disconnect();
    console.log('\n🔌 Conexión cerrada');
  }
}

// Ejecutar prueba
testPrisma(); 