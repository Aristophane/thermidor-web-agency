import "./App.css";
import video from "../src/assets/logoAnim.mp4";
import SlidingMenu from "./components/SlidingMenu";
import styled from "styled-components";
import VideoPlayer from "./components/VideoPlayer";

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
  position: fixed;
  top: 0;
`;

function App() {
  const menuItems = [
    {
      label: 'Services',
      submenu: [
        { label: 'Sites Web & Applications' },
        { label: 'Campagnes Sponsorisées (SEA, Ads)' },
        { label: 'UX/UI Design' },
        { label: 'Branding & Identité Visuelle' }
      ],
    },
    { label: 'Projets' },
    {
      label: 'Clients',
      submenu: [
        { label: 'Web Development' },
        { label: 'SEO' },
        { label: 'Marketing' },
      ],
    },
    { label: 'Contact' },
  ];
  return (
    <>
      <SlidingMenu items={menuItems} />
      <FlexDiv>
        <VideoPlayer src={video} />
      </FlexDiv>
    </>
  );
}

export default App;
