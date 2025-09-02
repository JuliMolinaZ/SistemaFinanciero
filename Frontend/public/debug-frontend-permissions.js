// debug-frontend-permissions.js - Script de debug específico para permisos del frontend
console.log('🔍 DEBUG FRONTEND PERMISSIONS - Script de debug iniciado');

// Función para verificar el estado de los permisos en el frontend
async function debugFrontendPermissions() {
  console.log('🔍 DEBUG FRONTEND PERMISSIONS - Verificando estado de permisos en el frontend...');
  
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
        
        // 2. Verificar si el hook usePermissions está disponible
        console.log('🔍 Verificando disponibilidad del hook usePermissions...');
        
        // 3. Probar el endpoint directamente para comparar
        console.log('🔍 Probando endpoint directamente...');
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
          
          // Verificar módulos específicos que deberían funcionar para Contador
          const testModules = ['contabilidad', 'costos_fijos', 'cuentas_por_pagar', 'cuentas_por_cobrar'];
          testModules.forEach(module => {
            if (data.data.permissions[module]) {
              console.log(`✅ Módulo ${module} tiene permisos:`, data.data.permissions[module]);
            } else {
              console.log(`❌ Módulo ${module} NO tiene permisos`);
            }
          });
          
        } else {
          console.error('❌ Endpoint falló:', data.message);
        }
      } else {
        console.log('⚠️ No hay usuario Firebase autenticado');
      }
    } else {
      console.log('⚠️ Firebase no está disponible');
    }
    
    // 4. Verificar el contexto global si está disponible
    console.log('🔍 Verificando contexto global...');
    
    // 5. Verificar si hay algún estado de permisos en localStorage/sessionStorage
    console.log('🔍 Verificando almacenamiento local...');
    const storedPermissions = localStorage.getItem('permissions');
    const sessionPermissions = sessionStorage.getItem('permissions');
    
    if (storedPermissions) {
      console.log('✅ Permisos encontrados en localStorage:', JSON.parse(storedPermissions));
    } else {
      console.log('⚠️ No hay permisos en localStorage');
    }
    
    if (sessionPermissions) {
      console.log('✅ Permisos encontrados en sessionStorage:', JSON.parse(sessionPermissions));
    } else {
      console.log('⚠️ No hay permisos en sessionStorage');
    }
    
    // 6. Verificar si hay algún error en la consola
    console.log('🔍 Verificando errores en la consola...');
    
  } catch (error) {
    console.error('❌ Error en debug:', error);
  }
}

// Función para simular la verificación de permisos
function simulatePermissionCheck() {
  console.log('🔍 DEBUG FRONTEND PERMISSIONS - Simulando verificación de permisos...');
  
  // Simular el comportamiento esperado del hook usePermissions
  const mockPermissions = {
    contabilidad: { can_read: true, can_create: true, can_update: true, can_delete: true, can_export: true, can_approve: true },
    costos_fijos: { can_read: true, can_create: true, can_update: true, can_delete: true, can_export: true, can_approve: true },
    cuentas_por_pagar: { can_read: true, can_create: true, can_update: true, can_delete: true, can_export: true, can_approve: true }
  };
  
  const canViewModule = (module) => {
    const permission = mockPermissions[module];
    const result = permission && permission.can_read;
    console.log(`🔍 canViewModule(${module}): ${result}`);
    return result;
  };
  
  // Probar con módulos que deberían funcionar
  console.log('🧪 Probando verificación de permisos simulada...');
  console.log('contabilidad:', canViewModule('contabilidad'));
  console.log('costos_fijos:', canViewModule('costos_fijos'));
  console.log('cuentas_por_pagar:', canViewModule('cuentas_por_pagar'));
  console.log('modulo_inexistente:', canViewModule('modulo_inexistente'));
}

// Función para verificar el estado del DOM
function debugDOMState() {
  console.log('🔍 DEBUG FRONTEND PERMISSIONS - Verificando estado del DOM...');
  
  // Verificar si hay mensajes de "Acceso no permitido" en el DOM
  const accessDeniedElements = document.querySelectorAll('*');
  let accessDeniedFound = false;
  
  accessDeniedElements.forEach(element => {
    if (element.textContent && element.textContent.includes('Acceso no permitido')) {
      console.log('🚨 Elemento con "Acceso no permitido" encontrado:', element);
      console.log('🚨 Clase del elemento:', element.className);
      console.log('🚨 ID del elemento:', element.id);
      console.log('🚨 Padre del elemento:', element.parentElement);
      accessDeniedFound = true;
    }
  });
  
  if (!accessDeniedFound) {
    console.log('✅ No se encontraron elementos con "Acceso no permitido" en el DOM');
  }
  
  // Verificar la URL actual
  console.log('🔍 URL actual:', window.location.href);
  console.log('🔍 Ruta actual:', window.location.pathname);
}

// Ejecutar todas las verificaciones
console.log('🔍 DEBUG FRONTEND PERMISSIONS - Ejecutando todas las verificaciones...');
debugFrontendPermissions();
simulatePermissionCheck();
debugDOMState();

// Exportar funciones para uso manual
window.debugFrontendPermissions = {
  debugFrontendPermissions,
  simulatePermissionCheck,
  debugDOMState
};

console.log('🔍 DEBUG FRONTEND PERMISSIONS - Script cargado. Usa window.debugFrontendPermissions para ejecutar verificaciones manualmente.');
console.log('🔍 DEBUG FRONTEND PERMISSIONS - Ejemplo: window.debugFrontendPermissions.debugFrontendPermissions()');
