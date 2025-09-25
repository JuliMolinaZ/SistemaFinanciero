// =====================================================
// SCRIPT PARA ENVIAR NOTIFICACIÓN DE PRUEBA
// =====================================================

const { PrismaClient } = require('@prisma/client');
const notificationService = require('../src/services/notificationService');

const prisma = new PrismaClient();

async function sendTestNotification() {
  try {

    // Obtener un usuario aleatorio
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true
      },
      take: 5
    });

    if (users.length === 0) {

      return;
    }

    const randomUser = users[Math.floor(Math.random() * users.length)];

    // Crear notificación de prueba
    const notification = await notificationService.createAndSendNotification({
      user_id: randomUser.id,
      title: "Notificación de prueba",
      message: `Hola ${randomUser.name}, esta es una notificación de prueba enviada en tiempo real. Fecha: ${new Date().toLocaleString()}`,
      type: "info",
      category: "system",
      priority: "medium",
      action_url: "/dashboard",
      metadata: {
        test: true,
        timestamp: new Date().toISOString(),
        sender: "Sistema de pruebas"
      }
    });

    // Mostrar estadísticas de conexiones WebSocket
    const stats = notificationService.getConnectionStats();

    if (stats.users.length > 0) {

    }

  } catch (error) {
    console.error('❌ Error al enviar notificación de prueba:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar el script
sendTestNotification();
