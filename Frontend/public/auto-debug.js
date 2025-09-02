// auto-debug.js - Script que se ejecuta automáticamente para diagnosticar problemas
console.log('🚨 AUTO DEBUG - Script de diagnóstico automático iniciado');

// Función para monitorear errores en tiempo real
function setupErrorMonitoring() {
  console.log('🚨 AUTO DEBUG - Configurando monitoreo de errores...');
  
  // Monitorear errores no capturados
  window.addEventListener('error', (event) => {
    console.error('🚨 AUTO DEBUG - Error no capturado:', {
      message: event.message,
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno,
      error: event.error
    });
  });
  
  // Monitorear promesas rechazadas
  window.addEventListener('unhandledrejection', (event) => {
    console.error('🚨 AUTO DEBUG - Promesa rechazada no manejada:', {
      reason: event.reason,
      promise: event.promise
    });
  });
  
  // Monitorear cambios en la URL
  let lastUrl = window.location.href;
  const observer = new MutationObserver(() => {
    if (window.location.href !== lastUrl) {
      console.log('🚨 AUTO DEBUG - URL cambiada:', {
        from: lastUrl,
        to: window.location.href,
        timestamp: new Date().toISOString()
      });
      lastUrl = window.location.href;
    }
  });
  
  observer.observe(document, { subtree: true, childList: true });
  
  console.log('✅ AUTO DEBUG - Monitoreo de errores configurado');
}

// Función para verificar el estado de la aplicación
function checkAppState() {
  console.log('🚨 AUTO DEBUG - Verificando estado de la aplicación...');
  
  // Verificar si React está disponible
  if (window.React) {
    console.log('✅ AUTO DEBUG - React está disponible');
  } else {
    console.log('❌ AUTO DEBUG - React NO está disponible');
  }
  
  // Verificar si Firebase está disponible
  if (window.firebase) {
    console.log('✅ AUTO DEBUG - Firebase está disponible');
  } else {
    console.log('❌ AUTO DEBUG - Firebase NO está disponible');
  }
  
  // Verificar si Axios está disponible
  if (window.axios) {
    console.log('✅ AUTO DEBUG - Axios está disponible');
  } else {
    console.log('❌ AUTO DEBUG - Axios NO está disponible');
  }
  
  // Verificar variables de entorno
  console.log('🚨 AUTO DEBUG - Variables de entorno:', {
    'REACT_APP_API_URL': process.env.REACT_APP_API_URL,
    'NODE_ENV': process.env.NODE_ENV
  });
  
  // Verificar configuración de la página
  console.log('🚨 AUTO DEBUG - Configuración de la página:', {
    'URL': window.location.href,
    'Protocolo': window.location.protocol,
    'Hostname': window.location.hostname,
    'Puerto': window.location.port,
    'User Agent': navigator.userAgent
  });
}

// Función para probar conectividad básica
async function testBasicConnectivity() {
  console.log('🚨 AUTO DEBUG - Probando conectividad básica...');
  
  try {
    // Probar health check
    const response = await fetch('http://localhost:5001/api/health');
    if (response.ok) {
      console.log('✅ AUTO DEBUG - Backend accesible');
    } else {
      console.log('⚠️ AUTO DEBUG - Backend responde pero con error:', response.status);
    }
  } catch (error) {
    console.error('❌ AUTO DEBUG - Backend no accesible:', error.message);
  }
  
  try {
    // Probar frontend
    const response = await fetch('http://localhost:3000');
    if (response.ok) {
      console.log('✅ AUTO DEBUG - Frontend accesible');
    } else {
      console.log('⚠️ AUTO DEBUG - Frontend responde pero con error:', response.status);
    }
  } catch (error) {
    console.error('❌ AUTO DEBUG - Frontend no accesible:', error.message);
  }
}

// Función para monitorear el contexto global
function monitorGlobalContext() {
  console.log('🚨 AUTO DEBUG - Monitoreando contexto global...');
  
  // Verificar si el contexto global está disponible
  if (window.GlobalContext) {
    console.log('✅ AUTO DEBUG - GlobalContext está disponible');
  } else {
    console.log('❌ AUTO DEBUG - GlobalContext NO está disponible');
  }
  
  // Monitorear cambios en el localStorage
  const originalSetItem = localStorage.setItem;
  const originalRemoveItem = localStorage.removeItem;
  
  localStorage.setItem = function(key, value) {
    console.log('🚨 AUTO DEBUG - localStorage.setItem:', { key, value });
    originalSetItem.apply(this, arguments);
  };
  
  localStorage.removeItem = function(key) {
    console.log('🚨 AUTO DEBUG - localStorage.removeItem:', { key });
    originalRemoveItem.apply(this, arguments);
  };
  
  console.log('✅ AUTO DEBUG - Monitoreo de localStorage configurado');
}

// Función para verificar si hay problemas de CORS
async function checkCORSIssues() {
  console.log('🚨 AUTO DEBUG - Verificando problemas de CORS...');
  
  try {
    const response = await fetch('http://localhost:5001/api/health', {
      method: 'GET',
      headers: {
        'Origin': 'http://localhost:3000'
      }
    });
    
    console.log('✅ AUTO DEBUG - CORS GET funciona correctamente');
    
    // Verificar headers de CORS
    const corsHeaders = {
      'Access-Control-Allow-Origin': response.headers.get('Access-Control-Allow-Origin'),
      'Access-Control-Allow-Methods': response.headers.get('Access-Control-Allow-Methods'),
      'Access-Control-Allow-Headers': response.headers.get('Access-Control-Allow-Headers')
    };
    
    console.log('🚨 AUTO DEBUG - Headers de CORS:', corsHeaders);
    
  } catch (error) {
    console.error('❌ AUTO DEBUG - Problema de CORS detectado:', error.message);
  }
}

// Función principal que ejecuta todas las verificaciones
function runAutoDebug() {
  console.log('🚨 AUTO DEBUG - Iniciando diagnóstico automático...');
  console.log('🚨 AUTO DEBUG - Timestamp:', new Date().toISOString());
  
  setupErrorMonitoring();
  checkAppState();
  testBasicConnectivity();
  monitorGlobalContext();
  checkCORSIssues();
  
  console.log('✅ AUTO DEBUG - Diagnóstico automático completado');
}

// Ejecutar diagnóstico automático después de un breve delay
setTimeout(runAutoDebug, 1000);

// Exportar funciones para uso manual
window.autoDebug = {
  runAutoDebug,
  checkAppState,
  testBasicConnectivity,
  checkCORSIssues
};

console.log('🚨 AUTO DEBUG - Script cargado. Usa window.autoDebug para ejecutar diagnósticos manualmente.');
console.log('🚨 AUTO DEBUG - Ejemplo: window.autoDebug.runAutoDebug()');
