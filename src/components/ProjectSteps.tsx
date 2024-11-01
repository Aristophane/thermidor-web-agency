import React from "react";
import styled, { keyframes } from "styled-components";

interface StepProps {
  title: string;
  description: string;
}

const steps: StepProps[] = [
  {
    title: "Consultation",
    description: "Écouter vos besoins et définir les objectifs.",
  },
  {
    title: "Planification",
    description: "Établir une stratégie claire et un plan d’action.",
  },
  {
    title: "Conception",
    description: "Créer une maquette et un design visuel.",
  },
  {
    title: "Développement",
    description: "Coder et intégrer les fonctionnalités du site.",
  },
  {
    title: "Tests",
    description: "Vérifier la qualité et le bon fonctionnement.",
  },
  {
    title: "Lancement",
    description: "Mettre le site en ligne et l’optimiser.",
  },
];

const bounce = keyframes`
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
`;

const wiggle = keyframes`
  0%, 100% { transform: rotate(0deg); }
  25% { transform: rotate(2deg); }
  75% { transform: rotate(-2deg); }
`;

const StepContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
`;

const Circle = styled.div<{ index: number }>`
  width: 250px;
  height: 250px;
  border-radius: 50%;
  background-color: ${({ index }) => (index % 2 === 0 ? "#ff3238" : "#e4e1d0")};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 1em;
  text-align: center;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.3s;

  &:hover {
    animation: ${bounce} 0.5s ease-in-out;
  }

  &:active {
    animation: ${wiggle} 0.3s ease-in-out;
  }
`;

const StepTitle = styled.div`
  font-weight: bold;
    font-size: 1.5em;
`;

const StepDescription = styled.div`
  font-size: 1em;
  padding:1em;
`;

// Styles pour les titres
const Title = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 2rem;
  text-align: center;
`;

const ProjectSteps: React.FC = () => {
  return (
    <>
      <Title>Etapes de création de votre solution</Title>
      <StepContainer>
        {steps.map((step, index) => (
          <Circle key={index} index={index}>
            <StepTitle>{step.title}</StepTitle>
            <StepDescription>{step.description}</StepDescription>
          </Circle>
        ))}
      </StepContainer>
    </>
  );
};

export default ProjectSteps;
