import React from 'react';
import './LoadingScreen.css';

const LoadingScreen = () => {
  return (
    <div className="loading-screen">
      <div className="spinner"></div>
      <p className="loading-text">Cargando...</p>
      <div className="loading-bar">
        <div className="loading-bar-progress"></div>
      </div>
    </div>
  );
};

export default LoadingScreen;