const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function addMissingFields() {
  try {
    console.log('🔍 Iniciando migración para agregar campos faltantes...');
    
    // Verificar si los campos ya existen
    const tableInfo = await prisma.$queryRaw`
      DESCRIBE recuperacion
    `;
    
    console.log('📋 Estructura actual de la tabla recuperacion:');
    console.log(tableInfo);
    
    // Agregar campo estado si no existe
    try {
      await prisma.$executeRaw`
        ALTER TABLE recuperacion ADD COLUMN estado VARCHAR(50) DEFAULT 'pendiente'
      `;
      console.log('✅ Campo estado agregado exitosamente');
    } catch (error) {
      if (error.message.includes('Duplicate column name')) {
        console.log('ℹ️ Campo estado ya existe');
      } else {
        console.error('❌ Error al agregar campo estado:', error.message);
      }
    }
    
    // Agregar campo descripcion si no existe
    try {
      await prisma.$executeRaw`
        ALTER TABLE recuperacion ADD COLUMN descripcion TEXT
      `;
      console.log('✅ Campo descripcion agregado exitosamente');
    } catch (error) {
      if (error.message.includes('Duplicate column name')) {
        console.log('ℹ️ Campo descripcion ya existe');
      } else {
        console.error('❌ Error al agregar campo descripcion:', error.message);
      }
    }
    
    // Agregar campo prioridad si no existe
    try {
      await prisma.$executeRaw`
        ALTER TABLE recuperacion ADD COLUMN prioridad VARCHAR(20) DEFAULT 'media'
      `;
      console.log('✅ Campo prioridad agregado exitosamente');
    } catch (error) {
      if (error.message.includes('Duplicate column name')) {
        console.log('ℹ️ Campo prioridad ya existe');
      } else {
        console.error('❌ Error al agregar campo prioridad:', error.message);
      }
    }
    
    // Agregar campo notas si no existe
    try {
      await prisma.$executeRaw`
        ALTER TABLE recuperacion ADD COLUMN notas TEXT
      `;
      console.log('✅ Campo notas agregado exitosamente');
    } catch (error) {
      if (error.message.includes('Duplicate column name')) {
        console.log('ℹ️ Campo notas ya existe');
      } else {
        console.error('❌ Error al agregar campo notas:', error.message);
      }
    }
    
    // Agregar campo fecha_vencimiento si no existe
    try {
      await prisma.$executeRaw`
        ALTER TABLE recuperacion ADD COLUMN fecha_vencimiento DATE
      `;
      console.log('✅ Campo fecha_vencimiento agregado exitosamente');
    } catch (error) {
      if (error.message.includes('Duplicate column name')) {
        console.log('ℹ️ Campo fecha_vencimiento ya existe');
      } else {
        console.error('❌ Error al agregar campo fecha_vencimiento:', error.message);
      }
    }
    
    // Actualizar registros existentes con valores por defecto
    try {
      await prisma.$executeRaw`
        UPDATE recuperacion SET estado = 'pendiente', prioridad = 'media' WHERE estado IS NULL OR prioridad IS NULL
      `;
      console.log('✅ Valores por defecto aplicados a registros existentes');
    } catch (error) {
      console.error('❌ Error al actualizar valores por defecto:', error.message);
    }
    
    // Verificar la estructura final
    const finalTableInfo = await prisma.$queryRaw`
      DESCRIBE recuperacion
    `;
    
    console.log('📋 Estructura final de la tabla recuperacion:');
    console.log(finalTableInfo);
    
    console.log('🎉 Migración completada exitosamente!');
    
  } catch (error) {
    console.error('❌ Error durante la migración:', error);
  } finally {
    await prisma.$disconnect();
  }
}

addMissingFields();
