const { PrismaClient } = require('@prisma/client');
require('dotenv').config({ path: './config.env' });

const prisma = new PrismaClient();

async function addInvitationFields() {
  try {
    console.log('🔧 Agregando campos de invitación a la base de datos...\n');

    // Verificar si los campos ya existen
    const tableInfo = await prisma.$queryRaw`
      SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = DATABASE() 
      AND TABLE_NAME = 'users'
      AND COLUMN_NAME IN ('access_token', 'token_expiry')
    `;

    console.log('📋 Campos actuales en la tabla users:');
    tableInfo.forEach(col => {
      console.log(`   • ${col.COLUMN_NAME}: ${col.DATA_TYPE} (${col.IS_NULLABLE === 'YES' ? 'NULL' : 'NOT NULL'})`);
    });

    // Agregar campo access_token si no existe
    try {
      await prisma.$executeRaw`
        ALTER TABLE users 
        ADD COLUMN access_token VARCHAR(255) NULL
      `;
      console.log('✅ Campo access_token agregado exitosamente');
    } catch (error) {
      if (error.message.includes('Duplicate column name')) {
        console.log('ℹ️  Campo access_token ya existe');
      } else {
        console.error('❌ Error al agregar access_token:', error.message);
      }
    }

    // Agregar campo token_expiry si no existe
    try {
      await prisma.$executeRaw`
        ALTER TABLE users 
        ADD COLUMN token_expiry TIMESTAMP NULL
      `;
      console.log('✅ Campo token_expiry agregado exitosamente');
    } catch (error) {
      if (error.message.includes('Duplicate column name')) {
        console.log('ℹ️  Campo token_expiry ya existe');
      } else {
        console.error('❌ Error al agregar token_expiry:', error.message);
      }
    }

    // Verificar campos después de la modificación
    const finalTableInfo = await prisma.$queryRaw`
      SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = DATABASE() 
      AND TABLE_NAME = 'users'
      AND COLUMN_NAME IN ('access_token', 'token_expiry')
    `;

    console.log('\n📋 Campos después de la modificación:');
    finalTableInfo.forEach(col => {
      console.log(`   • ${col.COLUMN_NAME}: ${col.DATA_TYPE} (${col.IS_NULLABLE === 'YES' ? 'NULL' : 'NOT NULL'})`);
    });

    // Verificar que Prisma puede leer los nuevos campos
    console.log('\n🔍 Verificando que Prisma puede leer los nuevos campos...');
    
    const testUser = await prisma.user.findFirst({
      select: {
        id: true,
        email: true,
        access_token: true,
        token_expiry: true
      }
    });

    if (testUser) {
      console.log('✅ Prisma puede leer los nuevos campos correctamente');
      console.log(`   Usuario de prueba: ${testUser.email}`);
      console.log(`   access_token: ${testUser.access_token || 'NULL'}`);
      console.log(`   token_expiry: ${testUser.token_expiry || 'NULL'}`);
    } else {
      console.log('⚠️  No se encontraron usuarios para probar');
    }

    console.log('\n🎉 Campos de invitación agregados exitosamente!');
    console.log('\n📝 Campos disponibles:');
    console.log('   • access_token: Token de acceso temporal para invitaciones');
    console.log('   • token_expiry: Fecha de expiración del token');

  } catch (error) {
    console.error('❌ Error general:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar la función
addInvitationFields();
