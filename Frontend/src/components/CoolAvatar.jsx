import React from 'react';
import { Avatar, Box, Tooltip } from '@mui/material';
import { 
  Person, 
  Business, 
  Security, 
  AdminPanelSettings, 
  SupervisorAccount,
  Group,
  VerifiedUser,
  Star
} from '@mui/icons-material';

// Componente de Avatar Genial con múltiples opciones
const CoolAvatar = ({ 
  user, 
  size = 48, 
  showTooltip = true,
  variant = 'auto' // 'auto', 'dicebear', 'boring', 'initials', 'gradient'
}) => {
  
  // Función para generar avatar de DiceBear (geometrías geniales)
  const getDiceBearAvatar = (seed, style = 'identicon') => {
    const colors = ['ff6b6b', '4ecdc4', '45b7d1', '96ceb4', 'feca57', 'ff9ff3', '54a0ff', '5f27cd'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    return `https://api.dicebear.com/7.x/${style}/svg?seed=${seed}&backgroundColor=${randomColor}`;
  };

  // Función para generar avatar de Boring Avatars (patrones únicos)
  const getBoringAvatar = (seed) => {
    const colors = ['#92A1C6', '#146A7C', '#F0AB3D', '#C271B4', '#C20D90'];
    return `https://source.boringavatars.com/beam/120/${seed}?colors=${colors.join(',')}`;
  };

  // Función para generar avatar con gradientes personalizados
  const getGradientAvatar = (seed) => {
    const gradients = [
      'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
      'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
      'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
      'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
      'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
      'linear-gradient(135deg, #a8caba 0%, #5d4e75 100%)',
      'linear-gradient(135deg, #d299c2 0%, #fef9d7 100%)'
    ];
    
    const index = seed.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % gradients.length;
    return gradients[index];
  };

  // Función para obtener icono basado en el rol
  const getRoleIcon = (roleName) => {
    if (!roleName) return <Person />;
    
    const role = roleName.toLowerCase();
    if (role.includes('super') || role.includes('admin')) return <AdminPanelSettings />;
    if (role.includes('admin')) return <Security />;
    if (role.includes('gerente') || role.includes('manager')) return <SupervisorAccount />;
    if (role.includes('director') || role.includes('ceo')) return <Business />;
    if (role.includes('invitado') || role.includes('guest')) return <Group />;
    if (role.includes('usuario') || role.includes('user')) return <Person />;
    
    return <Person />;
  };

  // Función para obtener color del icono basado en el rol
  const getRoleIconColor = (roleName) => {
    if (!roleName) return '#667eea';
    
    const role = roleName.toLowerCase();
    if (role.includes('super') || role.includes('admin')) return '#f39c12'; // Dorado
    if (role.includes('admin')) return '#e74c3c'; // Rojo
    if (role.includes('gerente') || role.includes('manager')) return '#9b59b6'; // Púrpura
    if (role.includes('director') || role.includes('ceo')) return '#2ecc71'; // Verde
    if (role.includes('invitado') || role.includes('guest')) return '#95a5a6'; // Gris
    if (role.includes('usuario') || role.includes('user')) return '#3498db'; // Azul
    
    return '#667eea'; // Azul por defecto
  };

  // Generar seed único basado en email y nombre
  const generateSeed = () => {
    const email = user?.email || '';
    const name = user?.name || '';
    return `${email}${name}`.replace(/[^a-zA-Z0-9]/g, '');
  };

  const seed = generateSeed();
  const roleName = user?.roles?.name || user?.role;
  const roleIcon = getRoleIcon(roleName);
  const roleIconColor = getRoleIconColor(roleName);

  // Renderizar avatar según la variante
  const renderAvatar = () => {
    switch (variant) {
      case 'dicebear':
        return (
          <Avatar
            src={getDiceBearAvatar(seed, 'identicon')}
            sx={{
              width: size,
              height: size,
              border: `3px solid ${roleIconColor}20`,
              '&:hover': {
                transform: 'scale(1.05)',
                transition: 'transform 0.2s ease-in-out'
              }
            }}
          />
        );

      case 'boring':
        return (
          <Avatar
            src={getBoringAvatar(seed)}
            sx={{
              width: size,
              height: size,
              border: `3px solid ${roleIconColor}20`,
              '&:hover': {
                transform: 'scale(1.05)',
                transition: 'transform 0.2s ease-in-out'
              }
            }}
          />
        );

      case 'gradient':
        return (
          <Avatar
            sx={{
              width: size,
              height: size,
              background: getGradientAvatar(seed),
              border: `3px solid ${roleIconColor}20`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: size * 0.4,
              fontWeight: 'bold',
              '&:hover': {
                transform: 'scale(1.05)',
                transition: 'transform 0.2s ease-in-out'
              }
            }}
          >
            {user?.name?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase()}
          </Avatar>
        );

      case 'initials':
        return (
          <Avatar
            sx={{
              width: size,
              height: size,
              background: getGradientAvatar(seed),
              border: `3px solid ${roleIconColor}20`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: size * 0.4,
              fontWeight: 'bold',
              '&:hover': {
                transform: 'scale(1.05)',
                transition: 'transform 0.2s ease-in-out'
              }
            }}
          >
            {user?.name?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase()}
          </Avatar>
        );

      case 'auto':
      default:
        // Rotar entre diferentes estilos automáticamente
        const styles = ['dicebear', 'boring', 'gradient'];
        const styleIndex = seed.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % styles.length;
        const selectedStyle = styles[styleIndex];
        
        switch (selectedStyle) {
          case 'dicebear':
            return (
              <Avatar
                src={getDiceBearAvatar(seed, 'identicon')}
                sx={{
                  width: size,
                  height: size,
                  border: `3px solid ${roleIconColor}20`,
                  '&:hover': {
                    transform: 'scale(1.05)',
                    transition: 'transform 0.2s ease-in-out'
                  }
                }}
              />
            );
          case 'boring':
            return (
              <Avatar
                src={getBoringAvatar(seed)}
                sx={{
                  width: size,
                  height: size,
                  border: `3px solid ${roleIconColor}20`,
                  '&:hover': {
                    transform: 'scale(1.05)',
                    transition: 'transform 0.2s ease-in-out'
                  }
                }}
              />
            );
          default:
            return (
              <Avatar
                sx={{
                  width: size,
                  height: size,
                  background: getGradientAvatar(seed),
                  border: `3px solid ${roleIconColor}20`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: size * 0.4,
                  fontWeight: 'bold',
                  '&:hover': {
                    transform: 'scale(1.05)',
                    transition: 'transform 0.2s ease-in-out'
                  }
                }}
              >
                {user?.name?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase()}
              </Avatar>
            );
        }
    }
  };

  // Indicador de rol en la esquina
  const renderRoleIndicator = () => (
    <Box
      sx={{
        position: 'absolute',
        bottom: -2,
        right: -2,
        background: roleIconColor,
        borderRadius: '50%',
        width: size * 0.3,
        height: size * 0.3,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontSize: size * 0.15,
        border: '2px solid white',
        boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
      }}
    >
      {roleIcon}
    </Box>
  );

  const avatarContent = (
    <Box sx={{ position: 'relative' }}>
      {renderAvatar()}
      {renderRoleIndicator()}
    </Box>
  );

  if (showTooltip) {
    return (
      <Tooltip 
        title={`${user?.name || 'Usuario'} - ${roleName || 'Sin rol'}`}
        arrow
        placement="top"
      >
        {avatarContent}
      </Tooltip>
    );
  }

  return avatarContent;
};

export default CoolAvatar;
