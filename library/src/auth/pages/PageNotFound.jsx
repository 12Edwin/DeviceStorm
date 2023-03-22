import React from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

const Icon = styled(FontAwesomeIcon)`
  font-size: 100px;
  margin-bottom: 20px;
  color: #ff5959;
`;

const Heading = styled.h1`
  font-size: 36px;
  font-weight: bold;
  text-align: center;
  margin-bottom: 20px;
`;

const Message = styled.p`
  font-size: 18px;
  text-align: center;
`;

function PageNotFound() {
  return (
    <Container>
      <Icon icon={faExclamationCircle} />
      <Heading>Página no encontrada</Heading>
      <Message>Lo sentimos, la página que estás buscando no existe.</Message>
    </Container>
  );
}

export default PageNotFound;
