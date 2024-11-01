import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 30px;
`;

const Title = styled.h2`
  margin: 0;
  font-size: 2rem;
  color: #28a745; /* Vert */
`;

const Description = styled.p`
  margin: 10px 0;
  font-size: 1.2rem;
`;

const Tile = styled.div`
  background-color: #28a745; /* Vert */
  color: white;
  padding: 20px;
  border-radius: 8px;
  width: 300px;
  margin: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  text-align: center;
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.5s ease-out, transform 0.5s ease-out;
  
  &.show {
    opacity: 1;
    transform: translateY(0);
  }
`;

const Advantages = styled.ul`
  text-align: left;
  margin: 10px 0;
`;

const Steps = styled.ol`
  text-align: left;
  margin: 10px 0;
`;

const ApplicationMobile: React.FC = () => {
  return (
    <Container>
      <Title>Application Mobile</Title>
      <Description>
        Développez votre présence mobile avec nos applications sur mesure, alliant performance et interface intuitive.
      </Description>
      <Tile className="show">
        <Title>Avantages</Title>
        <Advantages>
          <li>Réactivité : Mises à jour rapides.</li>
          <li>Expérience utilisateur : Design centré sur l'utilisateur.</li>
          <li>Intégration facile : Lien avec vos systèmes existants.</li>
        </Advantages>
      </Tile>
      <Tile className="show">
        <Title>Étapes</Title>
        <Steps>
          <li>Analyse des besoins.</li>
          <li>Création d'une maquette.</li>
          <li>Développement et intégration.</li>
          <li>Tests utilisateurs.</li>
          <li>Mise en ligne sur les stores.</li>
        </Steps>
      </Tile>
    </Container>
  );
};

export default ApplicationMobile;
