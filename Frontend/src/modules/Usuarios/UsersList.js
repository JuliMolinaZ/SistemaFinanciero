// src/modules/Usuarios/UsersList.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  IconButton,
  TextField,
  CircularProgress,
  Fade,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

// Componente del título principal
const TitleHeader = () => (
  <Typography
    variant="h3"
    sx={{
      textAlign: 'center',
      textTransform: 'uppercase',
      fontWeight: 'bold',
      letterSpacing: 2,
      color: '#ff5757',
      mb: 3,
      borderBottom: '2px solid #ff5757',
      pb: 1,
      textShadow: `
        1px 1px 0 #000,
        3px 3px 0 rgba(0,0,0,0.2)
      `,
    }}
  >
    Usuarios
  </Typography>
);

// Componente de la tarjeta de usuario
const UserCard = ({ user, onDelete }) => (
  <Card
    sx={{
      borderRadius: 2,
      boxShadow: 3,
      transition: 'transform 0.2s ease, box-shadow 0.2s ease',
      '&:hover': { transform: 'translateY(-5px)', boxShadow: 6 },
    }}
  >
    <CardMedia
      component="img"
      height="140"
      image={user.avatar}
      alt="Avatar"
      sx={{
        width: 140,
        height: 140,
        borderRadius: '50%',
        border: '2px solid #ff5757',
        objectFit: 'cover',
        mx: 'auto',
        mt: 2,
      }}
    />
    <CardContent sx={{ textAlign: 'center' }}>
      <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 0.5 }}>
        {user.name}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
        {user.role}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {user.email}
      </Typography>
    </CardContent>
    <Box sx={{ display: 'flex', justifyContent: 'center', pb: 2 }}>
      <IconButton
        onClick={() => onDelete(user.id)}
        sx={{
          backgroundColor: '#ff5757',
          color: '#fff',
          '&:hover': { backgroundColor: '#e44e4e' },
          transition: 'background 0.3s ease',
        }}
      >
        <DeleteIcon />
      </IconButton>
    </Box>
  </Card>
);

const UsersList = () => {
  const [users, setUsers] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  // Actualiza el listado filtrado cada vez que cambia el campo de búsqueda o la lista de usuarios
  useEffect(() => {
    if (search.trim() === '') {
      setFiltered(users);
    } else {
      const filter = users.filter((user) =>
        user.name.toLowerCase().includes(search.toLowerCase())
      );
      setFiltered(filter);
    }
  }, [search, users]);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(
        'https://sigma.runsolutions-services.com/api/usuarios'
      );
      const data = response.data.map((user) => ({
        ...user,
        avatar: user.avatar || '/assets/avatars/default-avatar.png',
      }));
      setUsers(data);
      setFiltered(data);
    } catch (error) {
      console.error('Error al obtener usuarios:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      '¿ESTÁS SEGURO QUE QUIERES ELIMINAR ESTE USUARIO?'
    );
    if (!confirmDelete) return;

    try {
      await axios.delete(`/api/usuarios/${id}`);
      const newUsers = users.filter((user) => user.id !== id);
      setUsers(newUsers);
      setFiltered(newUsers);
    } catch (error) {
      console.error('Error al eliminar el usuario:', error);
    }
  };

  return (
    <Container sx={{ py: 4, backgroundColor: '#f9f9f9', minHeight: '100vh' }}>
      <Fade in={!loading} timeout={600}>
        <Box>
          <TitleHeader />
          {/* Campo de búsqueda */}
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
            <TextField
              variant="outlined"
              placeholder="Buscar usuario..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              sx={{
                width: '100%',
                maxWidth: 400,
                backgroundColor: '#fff',
                borderRadius: 1,
                boxShadow: 1,
              }}
            />
          </Box>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <Grid container spacing={3} justifyContent="center">
              {filtered.map((user) => (
                <Grid item key={user.id} xs={12} sm={6} md={4}>
                  <UserCard user={user} onDelete={handleDelete} />
                </Grid>
              ))}
            </Grid>
          )}
        </Box>
      </Fade>
    </Container>
  );
};

export default UsersList;

