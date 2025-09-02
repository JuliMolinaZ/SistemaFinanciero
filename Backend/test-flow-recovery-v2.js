// test-flow-recovery-v2.js
const { prisma } = require('./src/config/database');

async function testFlowRecoveryV2() {
  try {
    console.log('🧪 Iniciando pruebas del módulo FlowRecoveryV2...\n');

    // 1. Verificar conexión a la base de datos
    console.log('1️⃣ Verificando conexión a la base de datos...');
    await prisma.$connect();
    console.log('✅ Conexión exitosa\n');

    // 2. Verificar si existe la tabla recuperacion
    console.log('2️⃣ Verificando existencia de la tabla recuperacion...');
    try {
      const tableExists = await prisma.$queryRaw`
        SELECT COUNT(*) as count 
        FROM information_schema.tables 
        WHERE table_schema = DATABASE() 
        AND table_name = 'recuperacion'
      `;
      console.log('📊 Resultado de verificación de tabla:', tableExists);
      
      if (tableExists[0].count > 0) {
        console.log('✅ Tabla recuperacion existe');
      } else {
        console.log('❌ Tabla recuperacion NO existe');
      }
    } catch (error) {
      console.log('⚠️ Error al verificar tabla:', error.message);
    }
    console.log('');

    // 3. Verificar estructura de la tabla recuperacion
    console.log('3️⃣ Verificando estructura de la tabla recuperacion...');
    try {
      const columns = await prisma.$queryRaw`
        SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE, COLUMN_DEFAULT
        FROM information_schema.columns 
        WHERE table_schema = DATABASE() 
        AND table_name = 'recuperacion'
        ORDER BY ORDINAL_POSITION
      `;
      console.log('📋 Columnas de la tabla recuperacion:');
      columns.forEach(col => {
        console.log(`   - ${col.COLUMN_NAME}: ${col.DATA_TYPE} (${col.IS_NULLABLE === 'YES' ? 'NULL' : 'NOT NULL'})`);
      });
    } catch (error) {
      console.log('⚠️ Error al verificar estructura:', error.message);
    }
    console.log('');

    // 4. Verificar si hay datos en la tabla
    console.log('4️⃣ Verificando datos en la tabla recuperacion...');
    try {
      const count = await prisma.recuperacion.count();
      console.log(`📊 Total de registros en recuperacion: ${count}`);
      
      if (count > 0) {
        const sampleData = await prisma.recuperacion.findMany({
          take: 3,
          include: {
            clients: true,
            projects: true
          }
        });
        console.log('📝 Muestra de datos:');
        sampleData.forEach((item, index) => {
          console.log(`   Registro ${index + 1}:`, {
            id: item.id,
            concepto: item.concepto,
            monto: item.monto,
            cliente: item.clients?.nombre || 'Sin cliente',
            proyecto: item.projects?.nombre || 'Sin proyecto',
            recuperado: item.recuperado
          });
        });
      }
    } catch (error) {
      console.log('⚠️ Error al verificar datos:', error.message);
    }
    console.log('');

    // 5. Verificar relaciones con clientes y proyectos
    console.log('5️⃣ Verificando relaciones con clientes y proyectos...');
    try {
      const clientsCount = await prisma.client.count();
      const projectsCount = await prisma.project.count();
      console.log(`👥 Total de clientes: ${clientsCount}`);
      console.log(`📁 Total de proyectos: ${projectsCount}`);
      
      if (clientsCount > 0) {
        const sampleClient = await prisma.client.findFirst();
        console.log(`📝 Cliente de ejemplo: ${sampleClient.nombre} (ID: ${sampleClient.id})`);
      }
      
      if (projectsCount > 0) {
        const sampleProject = await prisma.project.findFirst();
        console.log(`📝 Proyecto de ejemplo: ${sampleProject.nombre} (ID: ${sampleProject.id})`);
      }
    } catch (error) {
      console.log('⚠️ Error al verificar relaciones:', error.message);
    }
    console.log('');

    // 6. Probar operación de lectura
    console.log('6️⃣ Probando operación de lectura...');
    try {
      const flows = await prisma.recuperacion.findMany({
        take: 5,
        include: {
          clients: true,
          projects: true
        },
        orderBy: { id: 'desc' }
      });
      console.log(`✅ Lectura exitosa: ${flows.length} registros obtenidos`);
      
      if (flows.length > 0) {
        console.log('📝 Primer registro:');
        console.log('   - ID:', flows[0].id);
        console.log('   - Concepto:', flows[0].concepto);
        console.log('   - Monto:', flows[0].monto);
        console.log('   - Cliente:', flows[0].clients?.nombre || 'Sin cliente');
        console.log('   - Proyecto:', flows[0].projects?.nombre || 'Sin proyecto');
        console.log('   - Recuperado:', flows[0].recuperado);
      }
    } catch (error) {
      console.log('❌ Error en operación de lectura:', error.message);
    }

  } catch (error) {
    console.error('❌ Error general en las pruebas:', error);
  } finally {
    await prisma.$disconnect();
    console.log('\n🔌 Conexión cerrada');
  }
}

// Ejecutar las pruebas
testFlowRecoveryV2();
