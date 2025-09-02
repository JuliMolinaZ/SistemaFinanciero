// src/modules/Usuarios/AuthForm.js
import React, { useState, useContext } from 'react';
import { GlobalContext } from '../../context/GlobalState';
import {
  Container,
  Box,
  Typography,
  Button,
  TextField,
  Card,
  CardContent,
  Alert,
  IconButton,
  InputAdornment,
  Divider,
  Chip,
} from '@mui/material';
import {
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Google as GoogleIcon,
  Email as EmailIcon,
  Lock as LockIcon,
  Person as PersonIcon,
  Security as SecurityIcon,
  Speed as SpeedIcon,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { auth } from '../../firebase';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';

const AuthForm = () => {

  
  const { setCurrentUser, setProfileComplete } = useContext(GlobalContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isLogin, setIsLogin] = useState(true);

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError('');
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      setCurrentUser(result.user);
      setProfileComplete(false);
    } catch (error) {
      setError('Error al iniciar sesión con Google. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const handleEmailSignIn = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      // Aquí iría la lógica de autenticación con email/password
      // Por ahora simulamos un login exitoso
      setTimeout(() => {
        setCurrentUser({ email, displayName: 'Usuario Demo' });
        setProfileComplete(false);
        setLoading(false);
      }, 1500);
    } catch (error) {
      setError('Error al iniciar sesión. Verifica tus credenciales.');
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    setError('');
  };

  return (
    <Container
      maxWidth={false}
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
        position: 'relative',
        overflow: 'hidden',
        py: 4,
      }}
    >
      {/* Partículas de fondo */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          overflow: 'hidden',
          zIndex: 0,
        }}
      >
        {[...Array(15)].map((_, index) => (
          <motion.div
            key={index}
            style={{
              position: 'absolute',
              width: Math.random() * 3 + 1,
              height: Math.random() * 3 + 1,
              background: 'rgba(79, 172, 254, 0.4)',
              borderRadius: '50%',
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -50, 0],
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
            }}
            transition={{
              duration: Math.random() * 4 + 3,
              repeat: Infinity,
              delay: Math.random() * 2,
              ease: 'easeInOut',
            }}
          />
        ))}
      </Box>

      {/* Contenido principal */}
      <Box
        sx={{
          position: 'relative',
          zIndex: 1,
          width: '100%',
          maxWidth: 450,
        }}
      >
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          {/* Header */}
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 1, delay: 0.2 }}
            >
              <Box
                component="img"
                src="/SigmaRed.jpeg"
                alt="Sigma Logo"
                sx={{
                  width: 100,
                  height: 100,
                  borderRadius: '50%',
                  border: '3px solid rgba(79, 172, 254, 0.3)',
                  boxShadow: '0 0 30px rgba(79, 172, 254, 0.5)',
                  mb: 2,
                }}
              />
            </motion.div>
            
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <Typography
                variant="h3"
                sx={{
                  fontWeight: 900,
                  background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                  backgroundSize: '200% 200%',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  animation: 'gradientShift 3s ease infinite',
                  mb: 1,
                  '@keyframes gradientShift': {
                    '0%, 100%': { backgroundPosition: '0% 50%' },
                    '50%': { backgroundPosition: '100% 50%' },
                  },
                }}
              >
                SIGMA
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  color: 'rgba(255, 255, 255, 0.8)',
                  fontWeight: 400,
                  mb: 1,
                }}
              >
                {isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: 'rgba(255, 255, 255, 0.6)',
                  fontWeight: 400,
                }}
              >
                Sistema Integral de Gestión y Manejo Administrativo
              </Typography>
            </motion.div>
          </Box>

          {/* Formulario */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <Card
              sx={{
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: 3,
                boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
              }}
            >
              <CardContent sx={{ p: 4 }}>
                {/* Botón de Google */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<GoogleIcon />}
                    onClick={handleGoogleSignIn}
                    disabled={loading}
                    sx={{
                      mb: 3,
                      py: 1.5,
                      border: '2px solid rgba(255, 255, 255, 0.3)',
                      color: 'white',
                      background: 'rgba(255, 255, 255, 0.1)',
                      backdropFilter: 'blur(10px)',
                      '&:hover': {
                        border: '2px solid rgba(255, 255, 255, 0.5)',
                        background: 'rgba(255, 255, 255, 0.2)',
                      },
                      '&:disabled': {
                        opacity: 0.6,
                      },
                    }}
                  >
                    {loading ? 'Conectando...' : 'Continuar con Google'}
                  </Button>
                </motion.div>

                <Divider sx={{ my: 3, borderColor: 'rgba(255, 255, 255, 0.2)' }}>
                  <Chip
                    label="O"
                    sx={{
                      color: 'rgba(255, 255, 255, 0.7)',
                      background: 'rgba(255, 255, 255, 0.1)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                    }}
                  />
                </Divider>

                {/* Formulario de email/password */}
                <Box component="form" onSubmit={handleEmailSignIn}>
                  <TextField
                    fullWidth
                    label="Email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={loading}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <EmailIcon sx={{ color: 'rgba(255, 255, 255, 0.7)' }} />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      mb: 3,
                      '& .MuiOutlinedInput-root': {
                        color: 'white',
                        background: 'rgba(255, 255, 255, 0.1)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        borderRadius: 2,
                        '&:hover': {
                          border: '1px solid rgba(255, 255, 255, 0.4)',
                        },
                        '&.Mui-focused': {
                          border: '1px solid #4facfe',
                          boxShadow: '0 0 0 3px rgba(79, 172, 254, 0.1)',
                        },
                      },
                      '& .MuiInputLabel-root': {
                        color: 'rgba(255, 255, 255, 0.7)',
                        '&.Mui-focused': {
                          color: '#4facfe',
                        },
                      },
                      '& .MuiOutlinedInput-notchedOutline': {
                        border: 'none',
                      },
                    }}
                  />

                  <TextField
                    fullWidth
                    label="Contraseña"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={loading}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LockIcon sx={{ color: 'rgba(255, 255, 255, 0.7)' }} />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={togglePasswordVisibility}
                            edge="end"
                            sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
                          >
                            {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      mb: 3,
                      '& .MuiOutlinedInput-root': {
                        color: 'white',
                        background: 'rgba(255, 255, 255, 0.1)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        borderRadius: 2,
                        '&:hover': {
                          border: '1px solid rgba(255, 255, 255, 0.4)',
                        },
                        '&.Mui-focused': {
                          border: '1px solid #4facfe',
                          boxShadow: '0 0 0 3px rgba(79, 172, 254, 0.1)',
                        },
                      },
                      '& .MuiInputLabel-root': {
                        color: 'rgba(255, 255, 255, 0.7)',
                        '&.Mui-focused': {
                          color: '#4facfe',
                        },
                      },
                      '& .MuiOutlinedInput-notchedOutline': {
                        border: 'none',
                      },
                    }}
                  />

                  {/* Mensaje de error */}
                  <AnimatePresence>
                    {error && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                      >
                        <Alert
                          severity="error"
                          sx={{
                            mb: 3,
                            background: 'rgba(244, 67, 54, 0.1)',
                            border: '1px solid rgba(244, 67, 54, 0.3)',
                            color: '#ff6b6b',
                            '& .MuiAlert-icon': {
                              color: '#ff6b6b',
                            },
                          }}
                        >
                          {error}
                        </Alert>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Botón de envío */}
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      type="submit"
                      fullWidth
                      variant="contained"
                      disabled={loading}
                      sx={{
                        py: 1.5,
                        background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                        border: 'none',
                        borderRadius: 2,
                        fontWeight: 600,
                        fontSize: '1rem',
                        textTransform: 'none',
                        boxShadow: '0 8px 25px rgba(79, 172, 254, 0.3)',
                        '&:hover': {
                          background: 'linear-gradient(135deg, #00f2fe 0%, #4facfe 100%)',
                          boxShadow: '0 12px 35px rgba(79, 172, 254, 0.4)',
                          transform: 'translateY(-2px)',
                        },
                        '&:disabled': {
                          opacity: 0.7,
                          transform: 'none',
                        },
                      }}
                    >
                      {loading ? (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                          >
                            <Box
                              sx={{
                                width: 16,
                                height: 16,
                                border: '2px solid rgba(255,255,255,0.3)',
                                borderTop: '2px solid white',
                                borderRadius: '50%',
                              }}
                            />
                          </motion.div>
                          Conectando...
                        </Box>
                      ) : (
                        isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'
                      )}
                    </Button>
                  </motion.div>
                </Box>

                {/* Cambiar modo de autenticación */}
                <Box sx={{ textAlign: 'center', mt: 3 }}>
                  <Typography
                    variant="body2"
                    sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 1 }}
                  >
                    {isLogin ? '¿No tienes una cuenta?' : '¿Ya tienes una cuenta?'}
                  </Typography>
                  <Button
                    onClick={toggleAuthMode}
                    sx={{
                      color: '#4facfe',
                      textTransform: 'none',
                      fontWeight: 600,
                      '&:hover': {
                        background: 'rgba(79, 172, 254, 0.1)',
                      },
                    }}
                  >
                    {isLogin ? 'Crear cuenta' : 'Iniciar sesión'}
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </motion.div>

          {/* Información adicional */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                gap: 4,
                mt: 4,
                pt: 3,
                borderTop: '1px solid rgba(255, 255, 255, 0.1)',
              }}
            >
              <Box sx={{ textAlign: 'center' }}>
                <SecurityIcon sx={{ color: '#00d4aa', fontSize: 24, mb: 1 }} />
                <Typography
                  variant="caption"
                  sx={{
                    color: 'rgba(255, 255, 255, 0.6)',
                    display: 'block',
                  }}
                >
                  Seguro
                </Typography>
              </Box>
              
              <Box sx={{ textAlign: 'center' }}>
                <SpeedIcon sx={{ color: '#f093fb', fontSize: 24, mb: 1 }} />
                <Typography
                  variant="caption"
                  sx={{
                    color: 'rgba(255, 255, 255, 0.6)',
                    display: 'block',
                  }}
                >
                  Rápido
                </Typography>
              </Box>
              
              <Box sx={{ textAlign: 'center' }}>
                <PersonIcon sx={{ color: '#4facfe', fontSize: 24, mb: 1 }} />
                <Typography
                  variant="caption"
                  sx={{
                    color: 'rgba(255, 255, 255, 0.6)',
                    display: 'block',
                  }}
                >
                  Confiable
                </Typography>
              </Box>
            </Box>
          </motion.div>
        </motion.div>
      </Box>
    </Container>
  );
};

export default AuthForm;


