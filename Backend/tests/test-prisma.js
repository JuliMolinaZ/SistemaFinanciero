#!/usr/bin/env node

const { PrismaClient } = require('@prisma/client');

async function testPrisma() {
  const prisma = new PrismaClient();
  
  try {

    // Probar conexión
    await prisma.$connect();

    // Verificar si las tablas existen
    const tables = await prisma.$queryRaw`
      SELECT TABLE_NAME 
      FROM INFORMATION_SCHEMA.TABLES 
      WHERE TABLE_SCHEMA = DATABASE()
    `;

    tables.forEach(table => {

    });

    // Intentar contar usuarios
    try {
      const userCount = await prisma.user.count();

    } catch (error) {

    }
    
    // Intentar contar clientes
    try {
      const clientCount = await prisma.client.count();

    } catch (error) {

    }

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

      // Eliminar el usuario de prueba
      await prisma.user.delete({
        where: { id: testUser.id }
      });

    } catch (error) {

    }

  } catch (error) {
    console.error('❌ Error en la prueba de Prisma:', error);
    console.error('\n💡 Posibles soluciones:');
    console.error('   1. Verificar que la base de datos esté corriendo');
    console.error('   2. Verificar las credenciales en .env');
    console.error('   3. Verificar que DATABASE_URL esté configurado');
    console.error('   4. Ejecutar: npx prisma generate');
    
  } finally {
    await prisma.$disconnect();

  }
}

// Ejecutar prueba
testPrisma(); 