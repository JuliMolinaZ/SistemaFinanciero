// debug-simple.js - Script de debug simple para permisos
console.log('🔍 DEBUG SIMPLE - Script de debug iniciado');

// Función para verificar el estado actual
async function debugCurrentState() {
  console.log('🔍 DEBUG SIMPLE - Verificando estado actual...');
  
  try {
    // 1. Verificar si hay un usuario autenticado en Firebase
    if (typeof firebase !== 'undefined' && firebase.auth) {
      const user = firebase.auth().currentUser;
      if (user) {
        console.log('✅ Usuario Firebase autenticado:', {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName
        });
        
        // 2. Probar el endpoint directamente
        console.log('🔍 Probando endpoint de permisos...');
        const response = await fetch(`http://localhost:5001/api/role-management/user/firebase/${user.uid}/permissions`);
        const data = await response.json();
        
        if (data.success) {
          console.log('✅ Endpoint funciona correctamente');
          console.log('📊 Datos del usuario:', data.data.user);
          console.log('📊 Total de módulos:', Object.keys(data.data.permissions).length);
          console.log('📊 Es Super Admin:', data.data.isSuperAdmin);
          
          // Mostrar algunos módulos como ejemplo
          const modules = Object.keys(data.data.permissions);
          console.log('📋 Primeros 5 módulos:', modules.slice(0, 5));
          
          // Verificar un módulo específico
          const testModule = 'contabilidad';
          if (data.data.permissions[testModule]) {
            console.log(`✅ Módulo ${testModule} tiene permisos:`, data.data.permissions[testModule]);
          } else {
            console.log(`❌ Módulo ${testModule} NO tiene permisos`);
          }
          
        } else {
          console.error('❌ Endpoint falló:', data.message);
        }
      } else {
        console.log('⚠️ No hay usuario Firebase autenticado');
      }
    } else {
      console.log('⚠️ Firebase no está disponible');
    }
    
  } catch (error) {
    console.error('❌ Error en debug:', error);
  }
}

// Ejecutar debug
debugCurrentState();

// Exportar para uso manual
window.debugSimple = debugCurrentState;

console.log('🔍 DEBUG SIMPLE - Script cargado. Usa window.debugSimple() para ejecutar manualmente.');
