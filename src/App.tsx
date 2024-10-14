import "./App.css";
import styled from "styled-components";
import LogoAnimated from "./components/LogoAnimated";

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

const FlexDiv = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100%;
  align-items: center;
`;

const ContentDiv = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100%;
  align-items: center;
`;

function App() {
  return (
    <>
      <FlexDiv>
        <LogoAnimated />
      </FlexDiv>
      <ContentDiv>
        <p>TEST TEST</p>
        <p>TEST TEST</p>
        <p>TEST TEST</p>
        <p>TEST TEST</p>
        <p>TEST TEST</p>
        <p>TEST TEST</p>
        <p>TEST TEST</p>
        <p>TEST TEST</p>
        <p>TEST TEST</p>
        <p>TEST TEST</p>
      </ContentDiv>
    </>
  );
}

export default App;
