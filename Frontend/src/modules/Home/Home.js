// src/modules/Home/Home.js
import React, { useContext, useState, useEffect } from 'react';
import { GlobalContext } from '../../context/GlobalState';
import './Home.css';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

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

  // Estado de carga
  const [isLoading, setIsLoading] = useState(true);

  // Seleccionar una frase al azar basada en la fecha actual
  useEffect(() => {
    const fetchQuote = () => {
      const date = new Date();
      const index = date.getDate() % motivationalQuotes.length;
      setQuote(motivationalQuotes[index]);
      setIsLoading(false);
    };

    // Simular una carga asíncrona
    const timer = setTimeout(fetchQuote, 1000); // 1 segundo de espera

    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="home-container">
      <div className="home-logo">
        {isLoading ? (
          <Skeleton circle={true} height={150} width={150} />
        ) : (
          <img src="/SigmaRed.jpeg" alt="Logo de Sigma" loading="lazy" />
        )}
      </div>
      <h1 className="home-title">
        {isLoading ? <Skeleton width={300} /> : `${profileData?.name || 'Usuario'}, bienvenido a `}
        {!isLoading && <span>SIGMA</span>}
      </h1>
      <p className="home-subtitle">
        {isLoading ? <Skeleton width={400} /> : 'Sistema Integral de Gestión y Manejo Administrativo.'}
      </p>
      <blockquote className="home-quote">
        {isLoading ? <Skeleton width={500} height={80} /> : <p>"{quote}"</p>}
      </blockquote>
    </section>
  );
};

export default Home;


