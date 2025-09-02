// debug-user-auth.js - Script para debug de autenticación del usuario
console.log('🔍 DEBUG USER AUTH - Script de debug iniciado');

// Función para verificar el usuario autenticado
async function debugUserAuth() {
  console.log('🔍 DEBUG USER AUTH - Verificando usuario autenticado...');
  
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
        
        // 2. Verificar si es el usuario correcto
        if (user.email === 'julianmolina.ing@gmail.com') {
          console.log('✅ Usuario correcto detectado: julianmolina.ing@gmail.com (Rol: Contador)');
          console.log('🔍 Firebase UID esperado: DjG0ywHFolagcA25FN4BsVpWH8P2');
          console.log('🔍 Firebase UID actual:', user.uid);
          
          if (user.uid === 'DjG0ywHFolagcA25FN4BsVpWH8P2') {
            console.log('✅ Firebase UID coincide correctamente');
          } else {
            console.log('❌ Firebase UID NO coincide - esto explica el problema!');
            console.log('❌ UID esperado: DjG0ywHFolagcA25FN4BsVpWH8P2');
            console.log('❌ UID actual:', user.uid);
          }
        } else {
          console.log('⚠️ Usuario diferente al esperado:', user.email);
        }
        
        // 3. Probar obtener permisos del usuario
        console.log('🔍 Probando obtener permisos del usuario...');
        const response = await fetch(`http://localhost:5001/api/role-management/user/firebase/${user.uid}/permissions`);
        const data = await response.json();
        
        if (data.success) {
          console.log('✅ Permisos obtenidos exitosamente:', {
            user: data.data.user,
            totalModules: Object.keys(data.data.permissions).length,
            isSuperAdmin: data.data.isSuperAdmin
          });
          
          // Mostrar módulos disponibles
          console.log('📋 Módulos disponibles:');
          Object.entries(data.data.permissions).forEach(([module, perms]) => {
            if (perms.can_read) {
              console.log(`  ✅ ${module}: ${perms.can_create ? 'Crear' : ''} ${perms.can_update ? 'Editar' : ''} ${perms.can_delete ? 'Eliminar' : ''} ${perms.can_export ? 'Exportar' : ''} ${perms.can_approve ? 'Aprobar' : ''}`);
            }
          });
          
        } else {
          console.error('❌ Error al obtener permisos:', data.message);
        }
      } else {
        console.log('⚠️ No hay usuario Firebase autenticado');
      }
    } else {
      console.log('⚠️ Firebase no está disponible');
    }
    
  } catch (error) {
    console.error('❌ Error en las pruebas:', error);
    console.error('❌ Detalles del error:', {
      message: error.message,
      name: error.name,
      stack: error.stack
    });
  }
}

// Función para verificar el contexto global del frontend
function debugGlobalContext() {
  console.log('🔍 DEBUG USER AUTH - Verificando contexto global...');
  
  // Verificar variables globales
  console.log('🔍 Variables globales disponibles:');
  console.log('  - window.location:', window.location.href);
  console.log('  - window.firebase:', typeof window.firebase);
  
  // Intentar acceder al contexto global si está disponible
  if (window.React && window.React.useContext) {
    console.log('✅ React está disponible');
  } else {
    console.log('⚠️ React no está disponible en el scope global');
  }
  
  // Verificar si hay algún estado de usuario en localStorage
  const storedUser = localStorage.getItem('user');
  if (storedUser) {
    console.log('✅ Usuario encontrado en localStorage:', JSON.parse(storedUser));
  } else {
    console.log('⚠️ No hay usuario almacenado en localStorage');
  }
  
  // Verificar si hay algún estado de permisos en localStorage
  const storedPermissions = localStorage.getItem('permissions');
  if (storedPermissions) {
    console.log('✅ Permisos encontrados en localStorage:', JSON.parse(storedPermissions));
  } else {
    console.log('⚠️ No hay permisos almacenados en localStorage');
  }
}

// Función para verificar el hook de permisos
function debugPermissionsHook() {
  console.log('🔍 DEBUG USER AUTH - Verificando hook de permisos...');
  
  try {
    // Intentar acceder al hook de permisos si está disponible
    if (window.usePermissions) {
      console.log('✅ Hook usePermissions está disponible globalmente');
    } else {
      console.log('⚠️ Hook usePermissions no está disponible globalmente');
    }
    
    // Verificar si hay algún estado de permisos en sessionStorage
    const sessionPermissions = sessionStorage.getItem('permissions');
    if (sessionPermissions) {
      console.log('✅ Permisos encontrados en sessionStorage:', JSON.parse(sessionPermissions));
    } else {
      console.log('⚠️ No hay permisos almacenados en sessionStorage');
    }
    
  } catch (error) {
    console.error('❌ Error al verificar hook de permisos:', error);
  }
}

// Función para probar el endpoint directamente
async function testEndpointDirectly() {
  console.log('🔍 DEBUG USER AUTH - Probando endpoint directamente...');
  
  try {
    // Probar con el UID del usuario Contador
    const response = await fetch('http://localhost:5001/api/role-management/user/firebase/DjG0ywHFolagcA25FN4BsVpWH8P2/permissions');
    const data = await response.json();
    
    if (data.success) {
      console.log('✅ Endpoint funciona correctamente para usuario Contador');
      console.log('📊 Resumen de permisos:', {
        usuario: data.data.user.name,
        email: data.data.user.email,
        rol: data.data.user.role,
        totalModulos: Object.keys(data.data.permissions).length,
        modulosConPermisos: Object.keys(data.data.permissions).filter(module => data.data.permissions[module].can_read)
      });
    } else {
      console.error('❌ Endpoint falló:', data.message);
    }
  } catch (error) {
    console.error('❌ Error al probar endpoint:', error);
  }
}

// Ejecutar todas las pruebas
console.log('🔍 DEBUG USER AUTH - Ejecutando todas las pruebas...');
debugGlobalContext();
debugPermissionsHook();
debugUserAuth();
testEndpointDirectly();

// Exportar funciones para uso manual
window.debugUserAuth = {
  debugUserAuth,
  debugGlobalContext,
  debugPermissionsHook,
  testEndpointDirectly
};

console.log('🔍 DEBUG USER AUTH - Script cargado. Usa window.debugUserAuth para ejecutar pruebas manualmente.');
console.log('🔍 DEBUG USER AUTH - Ejemplo: window.debugUserAuth.debugUserAuth()');
