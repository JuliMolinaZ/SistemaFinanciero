// middleware/invitationBlock.js - Middleware para bloquear usuarios invitados

const blockInvitedUsers = (req, res, next) => {
  // Verificar si la URL contiene complete-profile (usuario invitado)
  const referer = req.get('Referer') || '';
  const userAgent = req.get('User-Agent') || '';
  const origin = req.get('Origin') || '';
  
  console.log('🔒 MIDDLEWARE INVITATION BLOCK - Verificando solicitud');
  console.log('🔒 Referer:', referer);
  console.log('🔒 User-Agent:', userAgent);
  console.log('🔒 Origin:', origin);
  console.log('🔒 URL solicitada:', req.originalUrl);
  console.log('🔒 Método:', req.method);
  
  // Solo bloquear si es una llamada específica a /api/usuarios (crear usuario)
  // Y NO bloquear las llamadas de GET para obtener perfiles existentes
  if (req.originalUrl === '/api/usuarios' && req.method === 'POST') {
    // DETECCIÓN INTELIGENTE: Verificar múltiples indicadores de usuario invitado
    
    // 1. Verificar si viene de una página de invitación
    const isFromInvitationPage = referer.includes('/complete-profile/') || 
                                userAgent.includes('complete-profile') ||
                                origin.includes('/complete-profile/');
    
    // 2. Verificar si el body contiene indicadores de invitación
    const body = req.body || {};
    const hasInvitationData = body.token || 
                             body.invitation_token || 
                             body.is_invited_user;
    
    // 3. Verificar headers personalizados
    const invitationHeader = req.get('X-Invitation-Token') || 
                           req.get('X-User-Type') === 'invited';
    
    // 4. DETECCIÓN CRÍTICA: Verificar si es un intento de crear perfil sin datos de Firebase
    const isFirebaseProfileCreation = body.email && 
                                    !body.firebase_uid && 
                                    !body.token && 
                                    !body.invitation_token;
    
    console.log('🔍 DETECCIÓN INTELIGENTE:');
    console.log('🔍 - Desde página de invitación:', isFromInvitationPage);
    console.log('🔍 - Datos de invitación en body:', hasInvitationData);
    console.log('🔍 - Headers de invitación:', invitationHeader);
    console.log('🔍 - Creación de perfil sin Firebase:', isFirebaseProfileCreation);
    console.log('🔍 - Body completo:', JSON.stringify(body));
    
    // Solo bloquear si se detecta como usuario invitado O intento de crear perfil sin Firebase
    if (isFromInvitationPage || hasInvitationData || invitationHeader || isFirebaseProfileCreation) {
      console.log('🚫 MIDDLEWARE: USUARIO INVITADO O PERFIL SIN FIREBASE DETECTADO - BLOQUEANDO LLAMADA');
      console.log('🚫 URL bloqueada:', req.originalUrl);
      console.log('🚫 Método:', req.method);
      console.log('🚫 Referer:', referer);
      console.log('🚫 Body:', JSON.stringify(body));
      
      return res.status(403).json({
        success: false,
        message: 'Acceso denegado para usuarios invitados o perfiles sin Firebase',
        error: 'Los usuarios invitados deben usar /api/user-registration/complete-profile',
        redirect: '/complete-profile',
        details: {
          reason: isFirebaseProfileCreation ? 'Intento de crear perfil sin datos de Firebase' : 'Usuario detectado como invitado',
          detectedFrom: {
            invitationPage: isFromInvitationPage,
            invitationData: hasInvitationData,
            invitationHeaders: invitationHeader,
            firebaseProfileCreation: isFirebaseProfileCreation
          }
        }
      });
    }
  }
  
  // Si no es un usuario invitado o es una llamada GET, continuar
  console.log('✅ MIDDLEWARE: Usuario normal o llamada GET - Continuando');
  next();
};

module.exports = { blockInvitedUsers };
