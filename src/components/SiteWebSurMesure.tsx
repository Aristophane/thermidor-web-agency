import React, { useState } from "react";
import styled, { css } from "styled-components";
import { FaSearch } from "react-icons/fa";
import ProjectSteps from "./ProjectSteps";
import Advantages_CreationSiteWeb from "./Advantages_CreationSiteWeb";

// Styles pour le conteneur principal
const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
  background-color: #e4e1d0;
  color: #ff3238;
  font-family: "Arial", sans-serif;
`;

// Styles pour l'icône de loupe
const SearchIcon = styled(FaSearch)`
  margin-left: 0.5rem;
  font-size: 1.2rem;
  opacity: 0;
  transition: opacity 0.3s ease;
`;

// Styles pour les titres
const TitleLoop = styled.h1<{ isOpen: boolean }>`
  font-size: 2.5rem;
  margin-bottom: 1rem;
  text-align: center;
  cursor: pointer;
  display: flex;
  align-items: center;
  transition: transform 0.3s ease;
  &:hover {
    transform: scale(1.05);
  }
  &:hover ${SearchIcon} {
    opacity: 1;
  }
`;

// Styles pour les titres
const Title = styled.h1<{ isOpen: boolean }>`
  font-size: 2.5rem;
  margin-bottom: 1rem;
  text-align: center;
  display: flex;
  align-items: center;
  transition: transform 0.3s ease;
`;

// Styles pour la section coulissante avec une couleur de fond personnalisable
const SlidingSection = styled.div<{
  isVisible: boolean;
}>`
  max-height: ${({ isVisible }) => (isVisible ? "1000px" : "0")};
  overflow: hidden;
  transition: max-height 0.5s ease;
  ${({ isVisible }) =>
    isVisible &&
    css`
      padding: 1rem 0;
    `}
`;

interface SiteWebSurMesureProps {
  advantagesBgColor?: string;
  projectStepsBgColor?: string;
}

const SiteWebSurMesure: React.FC<SiteWebSurMesureProps> = () => {
  const [showAdvantages, setShowAdvantages] = useState(false);
  const [showProjectSteps, setShowProjectSteps] = useState(false);

  return (
    <Container>
      <Title
        isOpen={showAdvantages}
        onClick={() => setShowAdvantages(!showAdvantages)}
      >
        Création de Sites Web Sur Mesure
        <SearchIcon />
      </Title>
      <Advantages_CreationSiteWeb />
      <TitleLoop
        isOpen={showProjectSteps}
        onClick={() => setShowProjectSteps(!showProjectSteps)}
      >
        Etapes de création de votre solution
        <SearchIcon />
      </TitleLoop>
      <SlidingSection isVisible={showProjectSteps}>
        <ProjectSteps />
      </SlidingSection>
    </Container>
  );
};

export default SiteWebSurMesure;
