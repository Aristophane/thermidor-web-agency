// Importation des bibliothèques nécessaires
import styled from "styled-components";
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

// Styles pour les titres
const Title = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 1rem;
  text-align: center;
`;

const SiteWebSurMesure = () => {
  return (
    <Container>
      <Title>Création de Sites Web Sur Mesure</Title>
      <Advantages_CreationSiteWeb />
      <ProjectSteps />
    </Container>
  );
};

export default SiteWebSurMesure;
