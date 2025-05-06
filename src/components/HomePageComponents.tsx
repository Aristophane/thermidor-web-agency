import React from "react";
import { Link } from "react-router-dom";
import { styled, keyframes } from "styled-components";

// Styles de base pour chaque composant en hauteur pleine
const CtaFullWidthContainer = styled.div<{ backgroundColor: string }>`
  min-height: 100vh;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #fff;
  background-color: ${({ backgroundColor }) => backgroundColor};
  text-align: left;
  box-sizing: border-box;
  margin: 0;
  padding-left: 20%;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    flex-direction: column;
    text-align: center;
    padding-left: 0%;
  }
`;

const TextContent = styled.div`
  flex: 1;
  z-index: 2;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;

  @media (max-width: 768px) {
    align-items: center;
    padding-left: 15%;
    padding-right: 15%;
  }
`;

const Title = styled.h2`
  font-size: 2rem;
  margin-bottom: 12px;
  @media (max-width: 768px) {
    text-align: center;
  }
`;

const Description = styled.p`
  font-size: 1.2rem;
  margin-bottom: 20px;
`;

// Keyframes for text appearance
const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
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
  animation: ${fadeIn} 0.6s ease-out;

  &:hover {
    background-color: #cc2a30;
  }
`;
// Composants spécifiques
const Cta1: React.FC = () => (
  <CtaFullWidthContainer backgroundColor="#4D608B">
    <TextContent>
      <Title>Un site parfaitement taillé pour vos besoins ?</Title>
      <Description>
        E-Commerce, Site Vitrine, Back Office, Interface Client
      </Description>
      <Link to="/contact">
        <Button>Contactez-nous</Button>
      </Link>
    </TextContent>
  </CtaFullWidthContainer>
);

const Cta2: React.FC = () => (
  <CtaFullWidthContainer backgroundColor="#DBB846">
    <TextContent>
      <Title>Besoin d'une expertise Tech pour votre SI ?</Title>
      <Description>
        Faites appel à nos services de DSI partagée au meilleur prix
      </Description>
      <Link to="/contact">
        <Button>Faites appels à nos experts</Button>
      </Link>
    </TextContent>
  </CtaFullWidthContainer>
);

const Cta3: React.FC = () => (
  <CtaFullWidthContainer backgroundColor="#e94e77">
    <TextContent>
      <Title>Envie de développer votre impact ?</Title>
      <Description>
        Nous gérons vos campagnes marketing et optimisons votre SEO
      </Description>
      <Link to="/contact">
        <Button>Augmenter votre impact marketing</Button>
      </Link>
    </TextContent>
  </CtaFullWidthContainer>
);

export { Cta1, Cta2, Cta3 };
