// src/modules/Home/Home.js
import React, { useContext } from 'react';
import { GlobalContext } from '../../context/GlobalState';

const Home = () => {
  const { profileData } = useContext(GlobalContext);

  return (
    <section style={{ padding: '2rem', textAlign: 'center' }}>
      <h1>Bienvenido {profileData?.name || 'Usuario'} al Sistema Financiero de Run Solutions</h1>
      <p>Desde aquí puedes acceder a tus módulos y gestionar tus actividades.</p>
    </section>
  );
};

export default Home;
