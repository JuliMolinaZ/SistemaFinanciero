const admin = require('firebase-admin');

// Cargar variables de entorno
require('dotenv').config({ path: './config.env' });

// Configuración de Firebase Admin SDK
let firebaseApp = null;

const initializeFirebase = () => {
  try {
    // Verificar si ya está inicializado
    if (firebaseApp) {

      return firebaseApp;
    }

    // Verificar variables de entorno requeridas
    const projectId = process.env.FIREBASE_PROJECT_ID;

    if (!projectId) {
      throw new Error('FIREBASE_PROJECT_ID no está configurado en las variables de entorno');
    }

    // Configuración de Firebase Admin SDK
    const firebaseConfig = {
      projectId: projectId,
      // Si tienes un archivo de credenciales de servicio
      ...(process.env.FIREBASE_SERVICE_ACCOUNT_KEY && {
        credential: admin.credential.cert(
          JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY)
        )
      }),
      // Si tienes un archivo de credenciales
      ...(process.env.FIREBASE_SERVICE_ACCOUNT_PATH && {
        credential: admin.credential.cert(
          require(process.env.FIREBASE_SERVICE_ACCOUNT_PATH)
        )
      })
    };

    // Inicializar Firebase Admin SDK
    firebaseApp = admin.initializeApp(firebaseConfig);

    return firebaseApp;
  } catch (error) {
    console.error('❌ Error inicializando Firebase Admin SDK:', error.message);
    
    // En modo desarrollo, usar configuración básica
    if (process.env.NODE_ENV === 'development') {

      try {
        const projectId = process.env.FIREBASE_PROJECT_ID || 'authenticationrun';
        firebaseApp = admin.initializeApp({
          projectId: projectId
        });

        return firebaseApp;
      } catch (devError) {
        console.error('❌ Error en modo desarrollo:', devError.message);
        throw devError;
      }
    }
    
    throw error;
  }
};

// Función para obtener la instancia de Firebase
const getFirebaseApp = () => {
  if (!firebaseApp) {
    return initializeFirebase();
  }
  return firebaseApp;
};

// Función para verificar token de Firebase
const verifyFirebaseToken = async (idToken) => {
  try {

    const app = getFirebaseApp();

    if (!app) {
      throw new Error('Firebase Admin SDK no está inicializado');
    }

    const decodedToken = await app.auth().verifyIdToken(idToken);

    return decodedToken;
  } catch (error) {
    // Solo mostrar error detallado si NO es un problema de audiencia
    if (!error.message.includes('audience')) {
      console.error('❌ Error verificando token Firebase:', error.message);
      console.error('❌ Stack trace:', error.stack);
    }
    throw error;
  }
};

// Función para verificar token del proyecto anterior (authenticationrun)
const verifyFirebaseTokenAlternative = async (idToken) => {
  try {
    // Crear instancia temporal de Firebase para el proyecto anterior
    const legacyApp = admin.initializeApp({
      projectId: 'authenticationrun'
    }, 'legacy-app');

    const decodedToken = await legacyApp.auth().verifyIdToken(idToken);

    // Limpiar la instancia temporal
    await legacyApp.delete();

    return decodedToken;
  } catch (error) {
    console.error('❌ Error verificando token con proyecto legacy:', error.message);
    throw error;
  }
};

// Función para obtener información del usuario de Firebase
const getFirebaseUser = async (uid) => {
  try {
    const app = getFirebaseApp();
    const userRecord = await app.auth().getUser(uid);
    return userRecord;
  } catch (error) {
    console.error('❌ Error obteniendo usuario de Firebase:', error.message);
    throw error;
  }
};

module.exports = {
  initializeFirebase,
  getFirebaseApp,
  verifyFirebaseToken,
  verifyFirebaseTokenAlternative,
  getFirebaseUser,
  admin
};
