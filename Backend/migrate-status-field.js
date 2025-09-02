#!/usr/bin/env node

// Script para migrar y agregar el campo status a la tabla clients
const { prisma } = require('./src/config/prisma');

async function migrateStatusField() {
  try {
    console.log('🚀 Iniciando migración del campo status...');
    
    // Verificar si la tabla clients existe
    const tableExists = await prisma.$queryRaw`
      SELECT COUNT(*) as count 
      FROM information_schema.tables 
      WHERE table_schema = DATABASE() 
      AND table_name = 'clients'
    `;
    
    if (tableExists[0].count === 0) {
      console.log('❌ La tabla clients no existe');
      return;
    }
    
    console.log('✅ Tabla clients encontrada');
    
    // Verificar si el campo status ya existe
    const columnExists = await prisma.$queryRaw`
      SELECT COUNT(*) as count 
      FROM information_schema.columns 
      WHERE table_schema = DATABASE() 
      AND table_name = 'clients' 
      AND column_name = 'status'
    `;
    
    if (columnExists[0].count > 0) {
      console.log('ℹ️  El campo status ya existe');
    } else {
      console.log('🔧 Agregando campo status...');
      
      // Agregar el campo status
      await prisma.$executeRaw`
        ALTER TABLE clients 
        ADD COLUMN status VARCHAR(20) DEFAULT 'activo'
      `;
      
      console.log('✅ Campo status agregado exitosamente');
    }
    
    // Actualizar clientes existentes
    console.log('🔄 Actualizando clientes existentes...');
    
    const updateResult = await prisma.$executeRaw`
      UPDATE clients 
      SET status = 'activo' 
      WHERE status IS NULL
    `;
    
    console.log(`✅ ${updateResult} clientes actualizados`);
    
    // Crear índice para mejorar rendimiento
    console.log('🔧 Creando índice para el campo status...');
    
    try {
      await prisma.$executeRaw`
        CREATE INDEX idx_clients_status ON clients(status)
      `;
      console.log('✅ Índice creado exitosamente');
    } catch (error) {
      if (error.message.includes('Duplicate key name')) {
        console.log('ℹ️  El índice ya existe');
      } else {
        console.log('⚠️  Error al crear índice:', error.message);
      }
    }
    
    // Verificar el resultado
    console.log('📊 Verificando resultado de la migración...');
    
    const stats = await prisma.$queryRaw`
      SELECT 
        COUNT(*) as total_clients,
        COUNT(CASE WHEN status = 'activo' THEN 1 END) as active_clients,
        COUNT(CASE WHEN status = 'inactivo' THEN 1 END) as inactive_clients,
        COUNT(CASE WHEN status IS NULL THEN 1 END) as null_status
      FROM clients
    `;
    
    console.log('📈 Estadísticas de clientes:');
    console.log(`   Total: ${stats[0].total_clients}`);
    console.log(`   Activos: ${stats[0].active_clients}`);
    console.log(`   Inactivos: ${stats[0].inactive_clients}`);
    console.log(`   Sin status: ${stats[0].null_status}`);
    
    // Mostrar algunos ejemplos
    const examples = await prisma.$queryRaw`
      SELECT id, nombre, status 
      FROM clients 
      ORDER BY id 
      LIMIT 5
    `;
    
    console.log('\n📋 Ejemplos de clientes:');
    examples.forEach(client => {
      console.log(`   ID ${client.id}: ${client.nombre} - ${client.status}`);
    });
    
    console.log('\n🎉 Migración completada exitosamente!');
    
  } catch (error) {
    console.error('❌ Error durante la migración:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar la migración
migrateStatusField();
