#!/usr/bin/env node

// Script para verificar que el campo status esté funcionando correctamente
const { prisma } = require('./src/config/prisma');

async function testStatusField() {
  try {
    console.log('🔍 Verificando campo status...');
    
    // Verificar estructura de la tabla
    const tableInfo = await prisma.$queryRaw`
      DESCRIBE clients
    `;
    
    console.log('📋 Estructura de la tabla clients:');
    tableInfo.forEach(column => {
      console.log(`   ${column.Field}: ${column.Type} ${column.Null === 'YES' ? 'NULL' : 'NOT NULL'} ${column.Default ? `DEFAULT ${column.Default}` : ''}`);
    });
    
    // Verificar si el campo status existe
    const statusColumn = tableInfo.find(col => col.Field === 'status');
    if (!statusColumn) {
      console.log('❌ Campo status no encontrado');
      return;
    }
    
    console.log('\n✅ Campo status encontrado:', statusColumn);
    
    // Verificar datos de clientes
    const clients = await prisma.$queryRaw`
      SELECT id, nombre, status, pais, estado, ciudad
      FROM clients 
      ORDER BY id 
      LIMIT 10
    `;
    
    console.log('\n📊 Datos de clientes:');
    clients.forEach(client => {
      console.log(`   ID ${client.id}: ${client.nombre} - Status: ${client.status || 'NULL'} - País: ${client.pais || 'NULL'} - Estado: ${client.estado || 'NULL'} - Ciudad: ${client.ciudad || 'NULL'}`);
    });
    
    // Probar actualización de un cliente
    console.log('\n🔄 Probando actualización de cliente...');
    
    const updateResult = await prisma.$executeRaw`
      UPDATE clients 
      SET status = 'inactivo', pais = 'México', estado = 'Querétaro', ciudad = 'Santiago de Querétaro'
      WHERE id = 2
    `;
    
    console.log(`✅ Cliente ID 2 actualizado: ${updateResult} filas afectadas`);
    
    // Verificar la actualización
    const updatedClient = await prisma.$queryRaw`
      SELECT id, nombre, status, pais, estado, ciudad
      FROM clients 
      WHERE id = 2
    `;
    
    console.log('\n📝 Cliente actualizado:');
    console.log(`   ID ${updatedClient[0].id}: ${updatedClient[0].nombre}`);
    console.log(`   Status: ${updatedClient[0].status}`);
    console.log(`   País: ${updatedClient[0].pais}`);
    console.log(`   Estado: ${updatedClient[0].estado}`);
    console.log(`   Ciudad: ${updatedClient[0].ciudad}`);
    
    // Estadísticas finales
    const stats = await prisma.$queryRaw`
      SELECT 
        COUNT(*) as total_clients,
        COUNT(CASE WHEN status = 'activo' THEN 1 END) as active_clients,
        COUNT(CASE WHEN status = 'inactivo' THEN 1 END) as inactive_clients,
        COUNT(CASE WHEN status IS NULL THEN 1 END) as null_status,
        COUNT(CASE WHEN pais IS NOT NULL THEN 1 END) as with_country,
        COUNT(CASE WHEN estado IS NOT NULL THEN 1 END) as with_state,
        COUNT(CASE WHEN ciudad IS NOT NULL THEN 1 END) as with_city
      FROM clients
    `;
    
    console.log('\n📈 Estadísticas finales:');
    console.log(`   Total clientes: ${stats[0].total_clients}`);
    console.log(`   Activos: ${stats[0].active_clients}`);
    console.log(`   Inactivos: ${stats[0].inactive_clients}`);
    console.log(`   Sin status: ${stats[0].null_status}`);
    console.log(`   Con país: ${stats[0].with_country}`);
    console.log(`   Con estado: ${stats[0].with_state}`);
    console.log(`   Con ciudad: ${stats[0].with_city}`);
    
    console.log('\n🎉 Prueba completada exitosamente!');
    
  } catch (error) {
    console.error('❌ Error durante la prueba:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar la prueba
testStatusField();
