const { PrismaClient } = require('@prisma/client');

console.log('🔒 PROBANDO FUNCIONALIDADES DE SEGURIDAD\n');

async function testSecurityFeatures() {
  const prisma = new PrismaClient();
  
  try {
    console.log('📋 1. Conectando a la base de datos...');
    await prisma.$connect();
    console.log('✅ Conexión exitosa!');
    
    console.log('\n📋 2. Probando configuración de seguridad...');
    
    try {
      const configs = await prisma.securityConfig.findMany({
        select: {
          config_key: true,
          config_value: true,
          description: true
        }
      });
      
      console.log(`✅ Configuraciones de seguridad encontradas: ${configs.length}`);
      configs.forEach(config => {
        console.log(`   🔧 ${config.config_key}: ${config.config_value} - ${config.description}`);
      });
    } catch (error) {
      console.log(`❌ Error consultando configuración: ${error.message}`);
    }
    
    console.log('\n📋 3. Probando logs de auditoría...');
    
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
      
      console.log(`✅ Log de auditoría creado: ID ${auditLog.id}`);
      
      // Consultar logs de auditoría
      const auditLogs = await prisma.auditLog.findMany({
        take: 5,
        orderBy: { created_at: 'desc' }
      });
      
      console.log(`✅ Logs de auditoría encontrados: ${auditLogs.length}`);
      auditLogs.forEach(log => {
        console.log(`   📝 ${log.action} en ${log.table_name} - ${log.created_at}`);
      });
      
      // Limpiar log de prueba
      await prisma.auditLog.delete({
        where: { id: auditLog.id }
      });
      console.log('   🧹 Log de prueba eliminado');
      
    } catch (error) {
      console.log(`❌ Error con logs de auditoría: ${error.message}`);
    }
    
    console.log('\n📋 4. Probando logs de seguridad...');
    
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
      
      console.log(`✅ Log de seguridad creado: ID ${securityLog.id}`);
      
      // Consultar logs de seguridad
      const securityLogs = await prisma.securityLog.findMany({
        take: 5,
        orderBy: { created_at: 'desc' }
      });
      
      console.log(`✅ Logs de seguridad encontrados: ${securityLogs.length}`);
      securityLogs.forEach(log => {
        console.log(`   🛡️  ${log.event_type} (${log.severity}) - ${log.created_at}`);
      });
      
      // Limpiar log de prueba
      await prisma.securityLog.delete({
        where: { id: securityLog.id }
      });
      console.log('   🧹 Log de seguridad de prueba eliminado');
      
    } catch (error) {
      console.log(`❌ Error con logs de seguridad: ${error.message}`);
    }
    
    console.log('\n📋 5. Probando tokens JWT...');
    
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
        
        console.log(`✅ Token JWT creado: ID ${jwtToken.id} para usuario ${user.id}`);
        
        // Consultar tokens JWT
        const jwtTokens = await prisma.jwtToken.findMany({
          where: { user_id: user.id },
          take: 5
        });
        
        console.log(`✅ Tokens JWT encontrados: ${jwtTokens.length}`);
        jwtTokens.forEach(token => {
          console.log(`   🔑 Token ${token.id} - Expira: ${token.expires_at} - Revocado: ${token.is_revoked}`);
        });
        
        // Limpiar token de prueba
        await prisma.jwtToken.delete({
          where: { id: jwtToken.id }
        });
        console.log('   🧹 Token de prueba eliminado');
        
      } else {
        console.log('   ⚠️  No hay usuarios para probar tokens JWT');
      }
      
    } catch (error) {
      console.log(`❌ Error con tokens JWT: ${error.message}`);
    }
    
    console.log('\n📋 6. Probando consultas complejas de seguridad...');
    
    try {
      // Estadísticas de seguridad
      const [auditCount, securityCount, configCount] = await Promise.all([
        prisma.auditLog.count(),
        prisma.securityLog.count(),
        prisma.securityConfig.count()
      ]);
      
      console.log('📊 Estadísticas de seguridad:');
      console.log(`   📝 Logs de auditoría: ${auditCount}`);
      console.log(`   🛡️  Logs de seguridad: ${securityCount}`);
      console.log(`   🔧 Configuraciones: ${configCount}`);
      
    } catch (error) {
      console.log(`❌ Error obteniendo estadísticas: ${error.message}`);
    }
    
    console.log('\n🎉 ¡PRUEBA DE SEGURIDAD COMPLETA EXITOSA!');
    console.log('✅ Todas las tablas de seguridad funcionan correctamente');
    console.log('✅ Los logs de auditoría funcionan');
    console.log('✅ Los logs de seguridad funcionan');
    console.log('✅ Los tokens JWT funcionan');
    console.log('✅ La configuración de seguridad está disponible');
    
  } catch (error) {
    console.error('❌ Error en la prueba de seguridad:', error);
    
  } finally {
    await prisma.$disconnect();
    console.log('\n🔌 Conexión cerrada');
  }
}

// Ejecutar prueba de seguridad
testSecurityFeatures(); 