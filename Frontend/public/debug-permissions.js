// debug-permissions.js - Script para debug de permisos
console.log('🔍 DEBUG PERMISSIONS - Script de debug iniciado');

// Función para probar la API de permisos
async function debugPermissionsAPI() {
  console.log('🔍 DEBUG PERMISSIONS - Iniciando prueba de API de permisos');
  
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
        
        // 2. Probar obtener permisos del usuario
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

// Función para verificar el estado del contexto global
function debugGlobalContext() {
  console.log('🔍 DEBUG PERMISSIONS - Verificando contexto global...');
  
  // Verificar si existe el contexto global
  if (window.React && window.React.useContext) {
    console.log('✅ React está disponible');
  } else {
    console.log('⚠️ React no está disponible en el scope global');
  }
  
  // Verificar variables globales
  console.log('🔍 Variables globales disponibles:');
  console.log('  - window.location:', window.location.href);
  console.log('  - window.firebase:', typeof window.firebase);
  console.log('  - window.React:', typeof window.React);
}

// Función para verificar el hook de permisos
async function debugPermissionsHook() {
  console.log('🔍 DEBUG PERMISSIONS - Verificando hook de permisos...');
  
  try {
    // Intentar acceder al hook de permisos si está disponible
    if (window.usePermissions) {
      console.log('✅ Hook usePermissions está disponible globalmente');
    } else {
      console.log('⚠️ Hook usePermissions no está disponible globalmente');
    }
    
    // Verificar si hay algún estado de permisos en localStorage
    const storedPermissions = localStorage.getItem('permissions');
    if (storedPermissions) {
      console.log('✅ Permisos encontrados en localStorage:', JSON.parse(storedPermissions));
    } else {
      console.log('⚠️ No hay permisos almacenados en localStorage');
    }
    
  } catch (error) {
    console.error('❌ Error al verificar hook de permisos:', error);
  }
}

// Ejecutar todas las pruebas
console.log('🔍 DEBUG PERMISSIONS - Ejecutando todas las pruebas...');
debugGlobalContext();
debugPermissionsHook();
debugPermissionsAPI();

// Exportar funciones para uso manual
window.debugPermissions = {
  debugPermissionsAPI,
  debugGlobalContext,
  debugPermissionsHook
};

console.log('🔍 DEBUG PERMISSIONS - Script cargado. Usa window.debugPermissions para ejecutar pruebas manualmente.');
console.log('🔍 DEBUG PERMISSIONS - Ejemplo: window.debugPermissions.debugPermissionsAPI()');
