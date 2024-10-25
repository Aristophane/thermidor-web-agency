import "./App.css";
import styled from "styled-components";
import LogoWelcomePage from "./components/LogoWelcomePage";
import { useState, useEffect } from "react";

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
  background-color: #5E0B15;
  margin-top: 120vh;
  color: white;
`;

const ContentDiv2 = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100%;
  align-items: center;
  background-color: #3A86FF;
  color: white;
`;
const colors = ['#ff3238', '#4caf50', '#2196f3', '#ffeb3b', '#9c27b0'];
const App: React.FC = () => {
  const [scrollY, setScrollY] = useState(0);
  const totalDivs = colors.length;
  const vhInitial = 100;
  const vhFinal = 10;
  const scrollPerDiv = window.innerHeight; // Scroll nécessaire pour rétrécir chaque div

  const handleScroll = () => {
    setScrollY(window.scrollY);
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const getDivHeight = (index: number) => {
    // Point de départ du scroll pour cette div
    const startScroll = index * scrollPerDiv;
    const endScroll = (index + 1) * scrollPerDiv;

    // Si le scroll est inférieur à son début, elle garde la taille initiale
    if (scrollY < startScroll) {
      return `${vhInitial}vh`;
    }
    // Si le scroll est supérieur à la fin de son intervalle, elle prend la taille finale
    if (scrollY > endScroll) {
      return `${vhFinal}vh`;
    }

    // Sinon, elle rétrécit progressivement entre vhInitial et vhFinal
    const progress = (scrollY - startScroll) / scrollPerDiv;
    const newHeight = vhInitial - progress * (vhInitial - vhFinal);
    return `${newHeight}vh`;
  };

  const getDivTop = (index: number) => {
    // Calcul de la position `top` pour chaque div basée sur son état de contraction
    let top = 0;

    for (let i = 0; i < index; i++) {
      top += parseFloat(getDivHeight(i));
    }

    return `${top}vh`;
  };

  return (
    <div className="App">
      {colors.map((color, index) => (
        <div
          key={index}
          className="color-div"
          style={{
            backgroundColor: color,
            height: getDivHeight(index),
            position: 'fixed',
            top: getDivTop(index),
            width: '100%',
            zIndex: totalDivs - index,
            transition: 'height 0.3s ease, top 0.3s ease',
          }}
        />
      ))}
      {/* Div fantôme pour permettre de scroller sur toute la page */}
      <div style={{ height: `${totalDivs * scrollPerDiv}px` }} />
    </div>
  );
};

// function App() {
//   return (
//     <>
//       <LogoWelcomePage />
//       <ContentDiv>
//         <p>TEST TEST 1</p>
//         <p>TEST TEST 2</p>
//         <p>TEST TEST 3</p>
//         <p>TEST TEST 4</p>
//         <p>TEST TEST 5</p>
//         <p>TEST TEST 6</p>
//         <p>TEST TEST 7</p>
//         <p>TEST TEST 8</p>
//         <p>TEST TEST</p>
//         <p>TEST TEST</p>
//         <p>TEST TEST</p>
//         <p>TEST TEST</p>
//         <p>TEST TEST</p>
//         <p>TEST TEST</p>
//         <p>TEST TEST</p>
//         <p>TEST TEST</p>
//         <p>TEST TEST</p>
//         <p>TEST TEST</p>
//         <p>TEST TEST</p>
//         <p>TEST TEST</p>
//         <p>TEST TEST</p>
//         <p>TEST TEST</p>
//         <p>TEST TEST</p>
//         <p>TEST TEST</p>
//         <p>TEST TEST</p>
//         <p>TEST TEST</p>
//         <p>TEST TEST</p>
//         <p>TEST TEST</p>
//         <p>TEST TEST</p>
//         <p>TEST TEST</p>
//       </ContentDiv>
//       <ContentDiv2>
//         <p>TEST TEST 1</p>
//         <p>TEST TEST 2</p>
//         <p>TEST TEST 3</p>
//         <p>TEST TEST 4</p>
//         <p>TEST TEST 5</p>
//         <p>TEST TEST 6</p>
//         <p>TEST TEST 7</p>
//         <p>TEST TEST 8</p>
//         <p>TEST TEST</p>
//         <p>TEST TEST</p>
//         <p>TEST TEST</p>
//         <p>TEST TEST</p>
//         <p>TEST TEST</p>
//         <p>TEST TEST</p>
//         <p>TEST TEST</p>
//         <p>TEST TEST</p>
//         <p>TEST TEST</p>
//         <p>TEST TEST</p>
//         <p>TEST TEST</p>
//         <p>TEST TEST</p>
//         <p>TEST TEST</p>
//         <p>TEST TEST</p>
//         <p>TEST TEST</p>
//         <p>TEST TEST</p>
//         <p>TEST TEST</p>
//         <p>TEST TEST</p>
//         <p>TEST TEST</p>
//         <p>TEST TEST</p>
//         <p>TEST TEST</p>
//         <p>TEST TEST</p>
//       </ContentDiv2>
//     </>
//   );
// }

export default App;
