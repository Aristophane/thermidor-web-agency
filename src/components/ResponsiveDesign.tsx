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
  color: #17a2b8; /* Cyan */
`;

const Description = styled.p`
  margin: 10px 0;
  font-size: 1.2rem;
`;

const Tile = styled.div`
  background-color: #17a2b8; /* Cyan */
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

const ResponsiveDesign: React.FC = () => {
  return (
    <Container>
      <Title>Responsive Design</Title>
      <Description>
        Tous nos projets intègrent un design responsive pour garantir une expérience optimale sur tous les appareils.
      </Description>
      <Tile className="show">
        <Title>Avantages</Title>
        <Advantages>
          <li>Compatibilité sur tous les appareils.</li>
          <li>Expérience utilisateur homogène.</li>
          <li>Optimisation SEO : boost de visibilité.</li>
        </Advantages>
      </Tile>
      <Tile className="show">
        <Title>Étapes</Title>
        <Steps>
          <li>Analyse de l'architecture existante.</li>
          <li>Création de maquettes responsive.</li>
          <li>Développement de solutions adaptatives.</li>
          <li>Tests sur différents appareils.</li>
          <li>Formation et suivi post-lancement.</li>
        </Steps>
      </Tile>
    </Container>
  );
};

export default ResponsiveDesign;
