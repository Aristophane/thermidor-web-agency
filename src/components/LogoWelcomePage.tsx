import React from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Logo from "./Logo";
import styled from "styled-components";

// Cette div va couvrir toute la page et permettre à useScroll de fonctionner
const ScrollWrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  height: 200vh; // hauteur suffisante pour détecter le scroll
  width: 100vw;
  pointer-events: none;
  z-index: 0;
`;

const LogoWelcomePage: React.FC = () => {
  const { scrollY } = useScroll();
  const height = useTransform(scrollY, [0, window.innerHeight], ["100vh", "15vh"]);

  return (
    <>
      <ScrollWrapper />
      <motion.div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          display: "flex",
          zIndex: 2,
          height,
        }}
      >
        <Logo />
      </motion.div>
    </>
  );
};

export default LogoWelcomePage;
