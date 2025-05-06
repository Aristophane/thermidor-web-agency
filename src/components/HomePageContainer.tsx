import styled from "styled-components";
import { Cta1, Cta2, Cta3 } from "./HomePageComponents";
import LogoWelcomePage from "./LogoWelcomePage";
import MovingCircles from "./MovingCircles";
import { motion, useScroll, useTransform } from "framer-motion";
import React from "react";

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

  return (
    <>
      <MotionBlur style={{ opacity }} />
      <MovingCircles colors={['#D9FAD7', '#DBB846', '#98E9E3', '#CAD783', '#4D608B']} />
      <LogoWelcomePage />
      <ContentDiv>
        <Cta1 />
        <Cta2 />
        <Cta3 />
      </ContentDiv>
    </>
  );
};

export default HomePageContainer;
