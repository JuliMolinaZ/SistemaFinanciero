// test-flow-api-simple.js
const axios = require('axios');

const BASE_URL = 'http://localhost:5001/api';

async function testFlowAPI() {
  try {
    console.log('🧪 Iniciando pruebas de la API FlowRecoveryV2...\n');

    // 1. Probar GET - Obtener todos los flows
    console.log('1️⃣ Probando GET /api/flowRecoveryV2...');
    try {
      const getResponse = await axios.get(`${BASE_URL}/flowRecoveryV2`);
      console.log('✅ GET exitoso:', {
        status: getResponse.status,
        success: getResponse.data.success,
        count: getResponse.data.data?.length || 0,
        message: getResponse.data.message
      });
      
      if (getResponse.data.data && getResponse.data.data.length > 0) {
        console.log('📝 Primer registro:', {
          id: getResponse.data.data[0].id,
          concepto: getResponse.data.data[0].concepto,
          monto: getResponse.data.data[0].monto
        });
      }
    } catch (error) {
      console.log('❌ GET falló:', {
        status: error.response?.status,
        message: error.response?.data?.message || error.message
      });
    }
    console.log('');

    // 2. Probar POST - Crear un nuevo flow
    console.log('2️⃣ Probando POST /api/flowRecoveryV2...');
    try {
      const testData = {
        concepto: 'Prueba API - ' + new Date().toISOString(),
        monto: 1000.50,
        fecha: new Date().toISOString().split('T')[0],
        categoria: 'Prueba',
        estado: 'pendiente',
        descripcion: 'Flow de prueba para validar API',
        prioridad: 'media',
        notas: 'Notas de prueba',
        recuperado: false
      };

      console.log('📝 Datos a enviar:', testData);
      
      const postResponse = await axios.post(`${BASE_URL}/flowRecoveryV2`, testData);
      console.log('✅ POST exitoso:', {
        status: postResponse.status,
        success: postResponse.data.success,
        id: postResponse.data.data?.id,
        message: postResponse.data.message
      });
      
      // Guardar el ID para las pruebas posteriores
      const createdId = postResponse.data.data?.id;
      
      if (createdId) {
        console.log('🆔 ID del registro creado:', createdId);
        
        // 3. Probar PUT - Actualizar el flow creado
        console.log('\n3️⃣ Probando PUT /api/flowRecoveryV2/' + createdId + '...');
        try {
          const updateData = {
            concepto: 'Prueba API - ACTUALIZADO',
            monto: 2000.75,
            estado: 'en_proceso',
            notas: 'Notas actualizadas de prueba'
          };

          console.log('📝 Datos para actualizar:', updateData);
          
          const putResponse = await axios.put(`${BASE_URL}/flowRecoveryV2/${createdId}`, updateData);
          console.log('✅ PUT exitoso:', {
            status: putResponse.status,
            success: putResponse.data.success,
            message: putResponse.data.message
          });
          
          // 4. Probar DELETE - Eliminar el flow creado
          console.log('\n4️⃣ Probando DELETE /api/flowRecoveryV2/' + createdId + '...');
          try {
            const deleteResponse = await axios.delete(`${BASE_URL}/flowRecoveryV2/${createdId}`);
            console.log('✅ DELETE exitoso:', {
              status: deleteResponse.status,
              success: deleteResponse.data.success,
              message: deleteResponse.data.message
            });
          } catch (error) {
            console.log('❌ DELETE falló:', {
              status: error.response?.status,
              message: error.response?.data?.message || error.message
            });
          }
        } catch (error) {
          console.log('❌ PUT falló:', {
            status: error.response?.status,
            message: error.response?.data?.message || error.message
          });
        }
      }
    } catch (error) {
      console.log('❌ POST falló:', {
        status: error.response?.status,
        message: error.response?.data?.message || error.message,
        data: error.response?.data
      });
    }

  } catch (error) {
    console.error('❌ Error general en las pruebas:', error.message);
  }
}

// Ejecutar las pruebas
testFlowAPI();
