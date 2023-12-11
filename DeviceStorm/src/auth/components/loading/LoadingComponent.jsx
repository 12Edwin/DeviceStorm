import React from 'react';
import styled, { keyframes } from 'styled-components';

// Define el keyframe para la animación de rotación
const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

// Define estilos personalizados para el componente
const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

const Loader = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  border: 4px solid #fff;
  border-top-color: #7f58af;
  animation: ${rotate} 1s ease-in-out infinite;
`;

const Text = styled.p`
  margin-top: 20px;
  font-size: 24px;
  font-weight: bold;
  color: #7f58af;
`;

export function LoadingComponent() {
  return (
    <Container>
      <Loader />
      <Text>Cargando...</Text>
    </Container>
  );
}
