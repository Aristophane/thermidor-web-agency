import "./App.css";
import styled from "styled-components";
import LogoWelcomePage from "./components/LogoWelcomePage";
import { Cta1, Cta2, Cta3 } from "./components/HomePageComponents";
import MovingCircles from "./components/MovingCircles";

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
  margin-top: 100vh;
  z-index:1;
`;

function App() {
  return (
    <>
      <MovingCircles colors={['red', 'green', 'blue', 'purple', 'orange']} />
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
