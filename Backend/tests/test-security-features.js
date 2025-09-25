const { PrismaClient } = require('@prisma/client');

async function testSecurityFeatures() {
  const prisma = new PrismaClient();
  
  try {

    await prisma.$connect();

    try {
      const configs = await prisma.securityConfig.findMany({
        select: {
          config_key: true,
          config_value: true,
          description: true
        }
      });

      configs.forEach(config => {

      });
    } catch (error) {

    }

    try {
      // Crear un log de auditoría de prueba
      const auditLog = await prisma.auditLog.create({
        data: {
          user_email: 'test@example.com',
          action: 'TEST_CREATE',
          table_name: 'test_table',
          record_id: 1,
          ip_address: '127.0.0.1',
          user_agent: 'Test Browser',
          details: { test: true, timestamp: new Date().toISOString() }
        }
      });

      // Consultar logs de auditoría
      const auditLogs = await prisma.auditLog.findMany({
        take: 5,
        orderBy: { created_at: 'desc' }
      });

      auditLogs.forEach(log => {

      });
      
      // Limpiar log de prueba
      await prisma.auditLog.delete({
        where: { id: auditLog.id }
      });

    } catch (error) {

    }

    try {
      // Crear un log de seguridad de prueba
      const securityLog = await prisma.securityLog.create({
        data: {
          event_type: 'LOGIN_ATTEMPT',
          severity: 'MEDIUM',
          ip_address: '127.0.0.1',
          user_agent: 'Test Browser',
          details: { success: true, method: 'email' }
        }
      });

      // Consultar logs de seguridad
      const securityLogs = await prisma.securityLog.findMany({
        take: 5,
        orderBy: { created_at: 'desc' }
      });

      securityLogs.forEach(log => {

      });
      
      // Limpiar log de prueba
      await prisma.securityLog.delete({
        where: { id: securityLog.id }
      });

    } catch (error) {

    }

    try {
      // Obtener un usuario para la prueba
      const user = await prisma.user.findFirst();
      
      if (user) {
        // Crear un token JWT de prueba
        const jwtToken = await prisma.jwtToken.create({
          data: {
            user_id: user.id,
            token_hash: 'test_hash_' + Date.now(),
            expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 horas
          }
        });

        // Consultar tokens JWT
        const jwtTokens = await prisma.jwtToken.findMany({
          where: { user_id: user.id },
          take: 5
        });

        jwtTokens.forEach(token => {

        });
        
        // Limpiar token de prueba
        await prisma.jwtToken.delete({
          where: { id: jwtToken.id }
        });

      } else {

      }
      
    } catch (error) {

    }

    try {
      // Estadísticas de seguridad
      const [auditCount, securityCount, configCount] = await Promise.all([
        prisma.auditLog.count(),
        prisma.securityLog.count(),
        prisma.securityConfig.count()
      ]);

    } catch (error) {

    }

  } catch (error) {
    console.error('❌ Error en la prueba de seguridad:', error);
    
  } finally {
    await prisma.$disconnect();

  }
}

// Ejecutar prueba de seguridad
testSecurityFeatures(); 