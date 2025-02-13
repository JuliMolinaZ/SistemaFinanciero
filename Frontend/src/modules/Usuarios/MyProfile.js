// src/modules/MyProfile/MyProfile.jsx
import React, { useState, useContext, useEffect } from 'react';
import { GlobalContext } from '../../context/GlobalState';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Grid,
  Fade,
  CircularProgress
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

// Importa los avatares (asegúrate de que las rutas sean correctas)
import avatar1 from '../../assets/avatars/avatar1.svg';
import avatar2 from '../../assets/avatars/avatar2.svg';
import avatar3 from '../../assets/avatars/avatar3.svg';
import avatar4 from '../../assets/avatars/avatar4.svg';
import avatar5 from '../../assets/avatars/avatar5.svg';
import avatar6 from '../../assets/avatars/avatar6.svg';

const avatars = [avatar1, avatar2, avatar3, avatar4, avatar5, avatar6];

const ProfileHeader = () => (
  <Typography
    variant="h4"
    sx={{
      textAlign: 'center',
      fontWeight: 'bold',
      color: '#ff6b6b',
      mb: 3,
      textTransform: 'uppercase',
      letterSpacing: 1.5,
      borderBottom: '2px solid #ff6b6b',
      pb: 1,
      textShadow: `
        1px 1px 0 #000,
        3px 3px 0 rgba(0,0,0,0.2)
      `,
    }}
  >
    Mi Perfil
  </Typography>
);

const AvatarSelectorDialog = ({ open, onClose, onSelect, onUpload }) => (
  <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
    <DialogTitle
      sx={{
        background: 'linear-gradient(90deg, #ff6b6b, #f94d9a)',
        color: '#fff',
        fontWeight: 'bold',
        m: 0,
        p: 2,
      }}
    >
      Selecciona un avatar
      <IconButton
        onClick={onClose}
        sx={{
          position: 'absolute',
          right: 8,
          top: 8,
          color: '#fff',
          '&:hover': { color: '#ffeb3b' },
        }}
      >
        <CloseIcon />
      </IconButton>
    </DialogTitle>
    <DialogContent dividers sx={{ textAlign: 'center' }}>
      <Grid container spacing={2} justifyContent="center">
        {avatars.map((avatar, idx) => (
          <Grid item key={idx}>
            <Box
              component="img"
              src={avatar}
              alt={`Avatar ${idx + 1}`}
              sx={{
                width: 60,
                height: 60,
                borderRadius: '50%',
                cursor: 'pointer',
                border: '2px solid transparent',
                transition: 'border 0.3s, transform 0.3s',
                '&:hover': { borderColor: '#007bff', transform: 'scale(1.1)' },
              }}
              onClick={() => onSelect(avatar)}
            />
          </Grid>
        ))}
      </Grid>
      <Box sx={{ mt: 2 }}>
        <Button variant="outlined" component="label">
          Subir desde tu computadora
          <input type="file" accept="image/*" hidden onChange={onUpload} />
        </Button>
      </Box>
    </DialogContent>
  </Dialog>
);

const MyProfile = () => {
  const { profileData, setProfileData } = useContext(GlobalContext);
  const [form, setForm] = useState({
    name: '',
    role: '',
    avatar: ''
  });
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Al cargar el perfil, inicializamos el formulario y mostramos la data
  useEffect(() => {
    if (profileData) {
      setForm({
        name: profileData.name || '',
        role: profileData.role || '',
        avatar: profileData.avatar || avatars[0], // Por defecto, primer avatar
      });
      setLoading(false);
    }
  }, [profileData]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAvatarUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm({ ...form, avatar: reader.result });
        setModalOpen(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAvatarSelect = (avatar) => {
    setForm({ ...form, avatar });
    setModalOpen(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setProfileData({
      ...profileData,
      name: form.name,
      role: form.role, // Se mantiene el rol actual
      avatar: form.avatar,
    });
    alert('Perfil actualizado');
  };

  if (loading) {
    return (
      <Container sx={{ py: 4, minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container
      maxWidth="sm"
      sx={{
        background: '#f9f9f9',
        p: 4,
        borderRadius: 2,
        boxShadow: 3,
        mt: 4,
      }}
    >
      <Fade in timeout={600}>
        <Box component="form" onSubmit={handleSubmit}>
          <ProfileHeader />
          <Box
            sx={{
              textAlign: 'center',
              mb: 3,
              cursor: 'pointer',
            }}
            onClick={() => setModalOpen(true)}
          >
            <Box
              component="img"
              src={form.avatar || avatars[0]}
              alt="Avatar"
              sx={{
                width: 150,
                height: 150,
                borderRadius: '50%',
                border: '3px solid #ddd',
                boxShadow: 2,
                transition: 'transform 0.3s, box-shadow 0.3s',
                '&:hover': { transform: 'scale(1.1)', boxShadow: 4 },
              }}
            />
            <Typography
              variant="caption"
              sx={{ mt: 1, color: '#007bff', display: 'block' }}
            >
              Haz clic para cambiar avatar
            </Typography>
          </Box>
          <Box sx={{ mb: 2 }}>
            <TextField
              label="Nombre"
              name="name"
              value={form.name}
              onChange={handleChange}
              fullWidth
              required
              variant="outlined"
              sx={{ mb: 2 }}
            />
            <TextField
              label="Correo electrónico"
              value={profileData.email}
              fullWidth
              disabled
              variant="outlined"
              sx={{ mb: 2 }}
            />
            <TextField
              label="Rol en la empresa"
              name="role"
              value={form.role}
              fullWidth
              disabled
              variant="outlined"
              helperText="El rol asignado no se puede cambiar"
              sx={{ mb: 2 }}
            />
          </Box>
          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{
              backgroundColor: '#ff6b6b',
              color: '#fff',
              fontWeight: 'bold',
              py: 1.5,
              borderRadius: 2,
              transition: 'background 0.3s, transform 0.3s',
              '&:hover': { backgroundColor: '#e04646', transform: 'scale(1.02)' },
            }}
          >
            Guardar cambios
          </Button>
        </Box>
      </Fade>

      {/* Modal para seleccionar o subir avatar */}
      <AvatarSelectorDialog
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSelect={handleAvatarSelect}
        onUpload={handleAvatarUpload}
      />
    </Container>
  );
};

export default MyProfile;

