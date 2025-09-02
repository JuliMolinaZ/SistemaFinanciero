// Script para probar la API de MoneyFlow Recovery
const axios = require('axios');

const API_BASE = 'http://localhost:3001/api';

async function testMoneyFlowAPI() {
  try {
    console.log('🧪 Probando API de MoneyFlow Recovery...\n');
    
    // 1. Obtener todos los registros
    console.log('1️⃣ Obteniendo todos los registros...');
    const getAllResponse = await axios.get(`${API_BASE}/moneyFlowRecovery`);
    console.log('✅ GET /moneyFlowRecovery exitoso');
    console.log('   - Status:', getAllResponse.status);
    console.log('   - Success:', getAllResponse.data.success);
    console.log('   - Total registros:', getAllResponse.data.data?.length || 0);
    
    if (getAllResponse.data.data && getAllResponse.data.data.length > 0) {
      const firstRecord = getAllResponse.data.data[0];
      console.log('   - Primer registro:', {
        id: firstRecord.id,
        concepto: firstRecord.concepto,
        recuperado: firstRecord.recuperado
      });
      
      // 2. Probar actualización del campo recuperado
      console.log('\n2️⃣ Probando actualización del campo recuperado...');
      const newRecuperadoValue = !firstRecord.recuperado;
      
      console.log(`   - Cambiando recuperado de ${firstRecord.recuperado} a ${newRecuperadoValue}`);
      
      const updateResponse = await axios.put(`${API_BASE}/moneyFlowRecovery/${firstRecord.id}`, {
        recuperado: newRecuperadoValue
      });
      
      console.log('✅ PUT /moneyFlowRecovery/:id exitoso');
      console.log('   - Status:', updateResponse.status);
      console.log('   - Success:', updateResponse.data.success);
      console.log('   - Datos actualizados:', updateResponse.data.data);
      
      // 3. Verificar que el cambio se guardó
      console.log('\n3️⃣ Verificando que el cambio se guardó...');
      const verifyResponse = await axios.get(`${API_BASE}/moneyFlowRecovery/${firstRecord.id}`);
      
      console.log('✅ GET /moneyFlowRecovery/:id exitoso');
      console.log('   - Status:', verifyResponse.status);
      console.log('   - Datos verificados:', verifyResponse.data.data);
      console.log('   - Campo recuperado actualizado:', verifyResponse.data.data.recuperado === newRecuperadoValue);
      
      // 4. Revertir el cambio
      console.log('\n4️⃣ Revirtiendo el cambio...');
      const revertResponse = await axios.put(`${API_BASE}/moneyFlowRecovery/${firstRecord.id}`, {
        recuperado: firstRecord.recuperado
      });
      
      console.log('✅ Cambio revertido exitosamente');
      console.log('   - Status:', revertResponse.status);
      console.log('   - Datos revertidos:', revertResponse.data.data);
      
      // 5. Probar actualización con múltiples campos
      console.log('\n5️⃣ Probando actualización con múltiples campos...');
      const multiUpdateResponse = await axios.put(`${API_BASE}/moneyFlowRecovery/${firstRecord.id}`, {
        concepto: firstRecord.concepto + ' (TEST)',
        categoria: 'Prueba de actualización',
        recuperado: firstRecord.recuperado
      });
      
      console.log('✅ Actualización múltiple exitosa');
      console.log('   - Status:', multiUpdateResponse.status);
      console.log('   - Datos actualizados:', multiUpdateResponse.data.data);
      
      // 6. Revertir cambios múltiples
      console.log('\n6️⃣ Revirtiendo cambios múltiples...');
      await axios.put(`${API_BASE}/moneyFlowRecovery/${firstRecord.id}`, {
        concepto: firstRecord.concepto,
        categoria: firstRecord.categoria,
        recuperado: firstRecord.recuperado
      });
      
      console.log('✅ Cambios múltiples revertidos');
      
    } else {
      console.log('⚠️ No hay registros para probar');
    }
    
    console.log('\n🎉 Todas las pruebas completadas exitosamente');
    
  } catch (error) {
    console.error('❌ Error en las pruebas:', error.message);
    if (error.response) {
      console.error('   - Status:', error.response.status);
      console.error('   - Data:', error.response.data);
    }
  }
}

// Ejecutar las pruebas
testMoneyFlowAPI();
