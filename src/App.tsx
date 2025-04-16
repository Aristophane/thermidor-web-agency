import "./App.css";
import styled from "styled-components";
import LogoWelcomePage from "./components/LogoWelcomePage";
import { Cta1, Cta2, Cta3, Cta4 } from "./components/HomePageComponents";
import ClientCarousel from "./components/ClientCarousel";

/*
SERVICES
  CREATION SITE WEB
  SEO
  SEA - Ads
  UX/UI Design
  Branding & Identité Visuelle


PORTFOLIO / PROJETS
  MAISON CHARLET
  CHARLET BOIS
  BOILLOT & CO

CLIENTS / TEMOIGNAGES

CONTACT

MENTIONS LEGALES

*/

const ContentDiv = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100%;
  align-items: center;
  background-color: white;
  margin-top: 130vh;
`;

function App() {
  return (
    <>
      <LogoWelcomePage />
      <ContentDiv>
        <Cta1 />
        <Cta2 />
        <Cta3 />
      </ContentDiv>
    </>
  );
}

export default App;
