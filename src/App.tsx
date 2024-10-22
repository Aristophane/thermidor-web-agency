import "./App.css";
import styled from "styled-components";
import LogoWelcomePage from "./components/LogoWelcomePage";

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
  margin-top: 120vh;
`;

function App() {
  return (
    <>
      <LogoWelcomePage />
      <ContentDiv>
        <p>TEST TEST 1</p>
        <p>TEST TEST 2</p>
        <p>TEST TEST 3</p>
        <p>TEST TEST 4</p>
        <p>TEST TEST 5</p>
        <p>TEST TEST 6</p>
        <p>TEST TEST 7</p>
        <p>TEST TEST 8</p>
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
        <p>TEST TEST</p>
        <p>TEST TEST</p>
      </ContentDiv>
    </>
  );
}

export default App;
