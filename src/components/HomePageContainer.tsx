import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import { Cta1, Cta2, Cta3 } from "./HomePageComponents";
import LogoWelcomePage from "./LogoWelcomePage";
import MovingCircles from "./MovingCircles";
import { motion, useScroll, useTransform } from "framer-motion";

const ContentDiv = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100%;
  align-items: center;
  margin-top: 100vh;
  z-index: 1;
`;

const MotionBlur = styled(motion.div)`
  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  backdrop-filter: blur(32px);
  z-index: 1;
  pointer-events: none;
`;

const HomePageContainer: React.FC = () => {
  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [0, window.innerHeight], [1, 0]);

  // Référence pour le div ContentDiv
  const contentDivRef = useRef<HTMLDivElement>(null);

  // State pour gérer si c'est le premier scroll
  const [hasScrolled, setHasScrolled] = useState(false);

  // Détecter le premier scroll et focus sur ContentDiv
  useEffect(() => {
    const handleScroll = () => {
      if (!hasScrolled) {
        console.log("focus!!")
        setHasScrolled(true);
        // Focus sur ContentDiv après le premier scroll
        contentDivRef.current?.focus();
      }
    };

    // Ajouter un event listener pour écouter le scroll
    window.addEventListener("scroll", handleScroll, { once: true });

    // Nettoyer l'event listener quand le composant est démonté
    return () => window.removeEventListener("scroll", handleScroll);
  }, [hasScrolled]);

  return (
    <>
      <MotionBlur style={{ opacity }} />
      <MovingCircles colors={['#D9FAD7', '#DBB846', '#98E9E3', '#CAD783', '#4D608B']} />
      <LogoWelcomePage />
      <ContentDiv ref={contentDivRef} tabIndex={-1}>
        <Cta1 />
        <Cta2 />
        <Cta3 />
      </ContentDiv>
    </>
  );
};

export default HomePageContainer;
