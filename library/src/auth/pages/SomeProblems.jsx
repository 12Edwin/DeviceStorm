import React from 'react';
import image from '../../assets/img/500.png'

export const SomeProblems = () => {
  return (
    <div style={{ textAlign: 'center', marginTop: '2rem' }}>
      <img src={image} style={{ width: '15rem', marginBottom: '2rem' }} />
      <h2>¡Ups! Algo salió mal.</h2>
      <p>Lo sentimos, estamos experimentando problemas técnicos. Por favor, inténtalo de nuevo más tarde.</p>
    </div>
  );
};
