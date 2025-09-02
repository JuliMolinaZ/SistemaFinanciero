import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Hook para detectar si el usuario está completando su perfil por invitación
export const useInvitationStatus = () => {
  const [isInvitedUser, setIsInvitedUser] = useState(false);
  const [invitationToken, setInvitationToken] = useState(null);
  const location = useLocation();

  useEffect(() => {
    // Verificar si la URL contiene un token de invitación
    const tokenMatch = location.pathname.match(/\/complete-profile\/([a-f0-9]{64})/);
    
    if (tokenMatch) {
      setIsInvitedUser(true);
      setInvitationToken(tokenMatch[1]);
    } else {
      setIsInvitedUser(false);
      setInvitationToken(null);
    }
  }, [location.pathname]);

  return {
    isInvitedUser,
    invitationToken,
    isCompletingProfile: isInvitedUser && invitationToken
  };
};

export default useInvitationStatus;
