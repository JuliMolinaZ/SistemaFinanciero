#!/usr/bin/env node

// Script para actualizar la tabla de clientes con nuevos campos
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function updateClientsTable() {
  try {
    console.log('🔧 Iniciando actualización de la tabla de clientes...');
    
    // Verificar si los campos ya existen
    const existingClient = await prisma.client.findFirst();
    
    if (existingClient) {
      console.log('📊 Cliente existente encontrado:', {
        id: existingClient.id,
        nombre: existingClient.nombre,
        campos: Object.keys(existingClient)
      });
    }
    
    console.log('✅ Verificación completada');
    console.log('📋 La tabla se actualizará automáticamente con Prisma');
    console.log('🚀 Ejecuta: npx prisma db push');
    
  } catch (error) {
    console.error('❌ Error durante la verificación:', error);
  } finally {
    await prisma.$disconnect();
  }
}

updateClientsTable();
