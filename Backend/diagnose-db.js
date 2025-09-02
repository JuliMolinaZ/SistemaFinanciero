const { PrismaClient } = require('@prisma/client');
require('dotenv').config({ path: './config.env' });

console.log('🔍 DIAGNÓSTICO DE BASE DE DATOS');
console.log('================================\n');

// Verificar variables de entorno
console.log('📋 Verificando variables de entorno...');
console.log('=====================================');
console.log('DATABASE_URL:', process.env.DATABASE_URL ? '✅ Configurada' : '❌ No configurada');
console.log('DB_HOST:', process.env.DB_HOST ? '✅ Configurada' : '❌ No configurada');
console.log('DB_USER:', process.env.DB_USER ? '✅ Configurada' : '❌ No configurada');
console.log('DB_NAME:', process.env.DB_NAME ? '✅ Configurada' : '❌ No configurada');
console.log('DB_PORT:', process.env.DB_PORT ? '✅ Configurada' : '❌ No configurada');

// Verificar archivo .env
console.log('\n📋 Verificando archivo .env...');
console.log('==============================');
try {
  const fs = require('fs');
  const envPath = './config.env';
  if (fs.existsSync(envPath)) {
    console.log('✅ Archivo config.env existe');
    const envContent = fs.readFileSync(envPath, 'utf8');
    const lines = envContent.split('\n').filter(line => line.trim() && !line.startsWith('#'));
    console.log(`   - ${lines.length} variables de entorno encontradas`);
  } else {
    console.log('❌ Archivo config.env NO existe');
  }
} catch (error) {
  console.log('❌ Error leyendo archivo .env:', error.message);
}

// Verificar Prisma
console.log('\n📋 Verificando Prisma...');
console.log('=========================');
try {
  const { PrismaClient } = require('@prisma/client');
  console.log('✅ Prisma Client importado correctamente');
  
  // Verificar esquema
  const fs = require('fs');
  const schemaPath = './prisma/schema.prisma';
  if (fs.existsSync(schemaPath)) {
    console.log('✅ Archivo schema.prisma existe');
    const schemaContent = fs.readFileSync(schemaPath, 'utf8');
    if (schemaContent.includes('model User')) {
      console.log('✅ Modelo User encontrado en el esquema');
    } else {
      console.log('❌ Modelo User NO encontrado en el esquema');
    }
    if (schemaContent.includes('model Roles')) {
      console.log('✅ Modelo Roles encontrado en el esquema');
    } else {
      console.log('❌ Modelo Roles NO encontrado en el esquema');
    }
  } else {
    console.log('❌ Archivo schema.prisma NO existe');
  }
} catch (error) {
  console.log('❌ Error con Prisma:', error.message);
}

// Verificar conexión a la base de datos
console.log('\n📋 Verificando conexión a la base de datos...');
console.log('=============================================');

async function testConnection() {
  const prisma = new PrismaClient();
  
  try {
    console.log('🔄 Intentando conectar...');
    await prisma.$connect();
    console.log('✅ Conexión establecida exitosamente');
    
    // Probar consulta simple
    console.log('🔄 Probando consulta simple...');
    const result = await prisma.$queryRaw`SELECT 1 as test`;
    console.log('✅ Consulta simple exitosa:', result);
    
    // Verificar si las tablas existen
    console.log('🔄 Verificando existencia de tablas...');
    const tables = await prisma.$queryRaw`
      SELECT TABLE_NAME 
      FROM INFORMATION_SCHEMA.TABLES 
      WHERE TABLE_SCHEMA = DATABASE()
      AND TABLE_NAME IN ('users', 'roles', 'role_permissions', 'system_modules')
      ORDER BY TABLE_NAME
    `;
    
    console.log('✅ Tablas encontradas:');
    tables.forEach(table => {
      console.log(`   - ${table.TABLE_NAME}`);
    });
    
    // Contar usuarios
    console.log('🔄 Contando usuarios...');
    const userCount = await prisma.$queryRaw`SELECT COUNT(*) as count FROM users`;
    console.log(`✅ Total de usuarios: ${userCount[0].count}`);
    
    // Contar roles
    console.log('🔄 Contando roles...');
    const roleCount = await prisma.$queryRaw`SELECT COUNT(*) as count FROM roles`;
    console.log(`✅ Total de roles: ${roleCount[0].count}`);
    
  } catch (error) {
    console.log('❌ Error de conexión:', error.message);
    console.log('   Stack trace:', error.stack);
  } finally {
    try {
      await prisma.$disconnect();
      console.log('✅ Conexión cerrada');
    } catch (error) {
      console.log('⚠️ Error cerrando conexión:', error.message);
    }
  }
}

// Ejecutar diagnóstico
testConnection()
  .then(() => {
    console.log('\n🏁 DIAGNÓSTICO COMPLETADO');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ ERROR EN DIAGNÓSTICO:', error);
    process.exit(1);
  });
