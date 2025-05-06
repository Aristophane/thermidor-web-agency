import React, { useEffect, useState } from "react";
import { motion, useAnimation } from "framer-motion";
import Logo from "./Logo";

const LogoWelcomePage: React.FC = () => {
  const [scrollY, setScrollY] = useState(0);
  const controls = useAnimation();

  const handleScroll = () => {
    setScrollY(window.scrollY);
  };

  useEffect(() => {
    controls.start({
      height: `${Math.max(15, 100 - scrollY * 0.2)}vh`,
      transition: { duration: 0.2 },
    });
  }, [scrollY, controls]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <motion.div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        display: "flex",
        zIndex: 2
      }}
      animate={controls}
    >
      <Logo />
    </motion.div>
  );
};

export default LogoWelcomePage;
