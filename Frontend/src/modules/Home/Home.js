// src/modules/Home/Home.js
import React, { useContext, useState, useEffect } from 'react';
import { GlobalContext } from '../../context/GlobalState';
import './Home.css'; // Asegúrate de crear y vincular este archivo CSS para los estilos

const Home = () => {
  const { profileData } = useContext(GlobalContext);

  // Lista de frases de motivación
  const motivationalQuotes = [
    "El éxito no es la clave de la felicidad. La felicidad es la clave del éxito.",
    "Cree en ti mismo y todo será posible.",
    "Cada día es una nueva oportunidad para crecer.",
    "Nunca dejes de aprender, porque la vida nunca deja de enseñar.",
    "La disciplina es el puente entre las metas y los logros.",
    "Haz de cada día tu obra maestra.",
    "La actitud es una pequeña cosa que marca una gran diferencia.",
  ];

  // Estado para la frase del día
  const [quote, setQuote] = useState("");

  // Seleccionar una frase al azar basada en la fecha actual
  useEffect(() => {
    const date = new Date();
    const index = date.getDate() % motivationalQuotes.length;
    setQuote(motivationalQuotes[index]);
  }, []);

  return (
    <section className="home-container">
      <div className="home-logo">
        <img src="/SigmaRed.jpeg" alt="Logo de Sigma" />
      </div>
      <h1 className="home-title">
        {profileData?.name || 'Usuario'}, bienvenido a <span>SIGMA</span>.
      </h1>
      <p className="home-subtitle">Sistema Integral de Gestión y Manejo Administrativo.</p>
      <blockquote className="home-quote">
        <p>"{quote}"</p>
      </blockquote>
    </section>
  );
};

export default Home;

