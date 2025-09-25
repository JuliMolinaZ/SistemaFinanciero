// =====================================================
// SCRIPT PARA CREAR NOTIFICACIONES DE PRUEBA
// =====================================================

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const testNotifications = [
  {
    title: "Nuevo proyecto asignado",
    message: "Se te ha asignado el proyecto 'Sistema de Gestión Financiera' con fecha límite el 15 de octubre.",
    type: "info",
    category: "project",
    priority: "high",
    action_url: "/projects/123"
  },
  {
    title: "Tarea completada",
    message: "La tarea 'Implementar autenticación' ha sido marcada como completada por el equipo.",
    type: "success",
    category: "task",
    priority: "medium",
    action_url: "/tasks/456"
  },
  {
    title: "Recordatorio de reunión",
    message: "Tienes una reunión programada en 30 minutos: 'Revisión de proyecto semanal'.",
    type: "warning",
    category: "meeting",
    priority: "high",
    action_url: "/meetings/789"
  },
  {
    title: "Error en el sistema",
    message: "Se ha detectado un error en el módulo de reportes. El equipo técnico está trabajando en la solución.",
    type: "error",
    category: "system",
    priority: "critical",
    action_url: "/system/status"
  },
  {
    title: "Actualización del sistema",
    message: "El sistema se ha actualizado a la versión 2.1.0. Revisa las nuevas funcionalidades disponibles.",
    type: "system",
    category: "system",
    priority: "medium",
    action_url: "/system/updates"
  },
  {
    title: "Nuevo mensaje recibido",
    message: "Has recibido un mensaje de Juan Pérez sobre el proyecto en curso.",
    type: "info",
    category: "message",
    priority: "low",
    action_url: "/messages/101"
  },
  {
    title: "Documento aprobado",
    message: "El documento 'Propuesta técnica v3.0' ha sido aprobado por el gerente de proyecto.",
    type: "success",
    category: "document",
    priority: "medium",
    action_url: "/documents/202"
  },
  {
    title: "Vencimiento próximo",
    message: "El proyecto 'Sitio Web Corporativo' vence en 3 días. Revisa el estado actual.",
    type: "warning",
    category: "project",
    priority: "high",
    action_url: "/projects/303"
  }
];

async function createTestNotifications() {
  try {

    // Obtener todos los usuarios
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true
      }
    });

    if (users.length === 0) {

      return;
    }

    // Crear notificaciones para cada usuario
    const notificationsToCreate = [];
    
    for (const user of users) {
      // Crear 2-4 notificaciones aleatorias para cada usuario
      const numNotifications = Math.floor(Math.random() * 3) + 2;
      const selectedNotifications = testNotifications
        .sort(() => 0.5 - Math.random())
        .slice(0, numNotifications);

      for (const notification of selectedNotifications) {
        notificationsToCreate.push({
          user_id: user.id,
          ...notification,
          is_read: Math.random() > 0.6, // 40% de probabilidad de estar leída
          read_at: Math.random() > 0.6 ? new Date() : null
        });
      }
    }

    // Crear las notificaciones en lote
    const result = await prisma.systemNotification.createMany({
      data: notificationsToCreate
    });

    // Mostrar estadísticas
    const stats = await prisma.systemNotification.groupBy({
      by: ['type', 'is_read'],
      _count: {
        id: true
      }
    });

    stats.forEach(stat => {

    });

    // Mostrar conteo por usuario
    const userStats = await prisma.systemNotification.groupBy({
      by: ['user_id'],
      _count: {
        id: true
      },
      where: {
        is_read: false
      }
    });

    for (const stat of userStats) {
      const user = users.find(u => u.id === stat.user_id);

    }

  } catch (error) {
    console.error('❌ Error al crear notificaciones de prueba:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar el script
createTestNotifications();
