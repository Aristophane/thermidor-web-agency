import React from 'react';
import styled from 'styled-components';

// Styles de base pour chaque composant en hauteur pleine
const CtaFullWidthContainer = styled.div<{ backgroundColor: string }>`
  min-height: 100vh;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 40px;
  color: #fff;
  background-color: ${({ backgroundColor }) => backgroundColor};
  text-align: left;
  box-sizing: border-box;
  margin: 0;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    flex-direction: column;
    text-align: center;
  }
`;

const TextContent = styled.div`
  flex: 1;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;

  @media (max-width: 768px) {
    align-items: center;
  }
`;

const Title = styled.h2`
  font-size: 2rem;
  margin-bottom: 12px;
`;

const Description = styled.p`
  font-size: 1.2rem;
  margin-bottom: 20px;
`;

const Button = styled.button`
  background-color: #ff3238;
  color: #fff;
  padding: 12px 24px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #cc2a30;
  }
`;

const Illustration = styled.img`
  max-width: 40%;
  height: auto;

  @media (max-width: 768px) {
    max-width: 80%;
    margin-top: 20px;
  }
`;

// Composants spécifiques
const Cta1: React.FC = () => (
  <CtaFullWidthContainer backgroundColor="#4a90e2">
    <TextContent>
      <Title>Vous voulez créer le site adapté à vos besoins ?</Title>
      <Description>E-Commerce, Site Vitrine, Back Office, Interface Client</Description>
      <Button>Contactez-nous</Button>
    </TextContent>
    <Illustration src="/path/to/illustration1.png" alt="Illustration création de site" />
  </CtaFullWidthContainer>
);

const Cta2: React.FC = () => (
  <CtaFullWidthContainer backgroundColor="#50e3c2">
    <TextContent>
      <Title>Besoin d'une expertise Tech pour votre SI ?</Title>
      <Description>Faites appel à nos services de DSI partagée au meilleur prix</Description>
      <Button>Choisissez votre forfait</Button>
    </TextContent>
    <Illustration src="/path/to/illustration2.png" alt="Illustration expertise tech" />
  </CtaFullWidthContainer>
);

const Cta3: React.FC = () => (
  <CtaFullWidthContainer backgroundColor="#e94e77">
    <TextContent>
      <Title>Envie de développer votre impact ?</Title>
      <Description>Nous gérons vos campagnes marketing et optimisons votre SEO</Description>
      <Button>En savoir plus</Button>
    </TextContent>
    <Illustration src="/path/to/illustration3.png" alt="Illustration marketing" />
  </CtaFullWidthContainer>
);

export { Cta1, Cta2, Cta3 };
