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
  color: #ffc107; /* Jaune */
`;

const Description = styled.p`
  margin: 10px 0;
  font-size: 1.2rem;
`;

const Tile = styled.div`
  background-color: #ffc107; /* Jaune */
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

const ExperienceUtilisateur: React.FC = () => {
  return (
    <Container>
      <Title>Expérience Utilisateur</Title>
      <Description>
        Nous plaçons l'expérience utilisateur au cœur de notre processus pour garantir des interactions agréables.
      </Description>
      <Tile className="show">
        <Title>Avantages</Title>
        <Advantages>
          <li>Design centré sur l'utilisateur.</li>
          <li>Tests rigoureux.</li>
          <li>Adaptabilité : Intégration des retours utilisateurs.</li>
        </Advantages>
      </Tile>
      <Tile className="show">
        <Title>Étapes</Title>
        <Steps>
          <li>Recherche et analyse des utilisateurs.</li>
          <li>Création de wireframes.</li>
          <li>Tests d'usabilité.</li>
          <li>Itérations basées sur les retours.</li>
          <li>Implémentation finale.</li>
        </Steps>
      </Tile>
    </Container>
  );
};

export default ExperienceUtilisateur;
