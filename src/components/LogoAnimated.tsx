import "./LogoAnimated.css";
import logo from "../assets/logo_thermidor_web_agency.png";
import { useEffect, useState } from "react";
import _ from "lodash";

// Valeurs de top en vh
const topStart = 0;
const topEnd = -44;

const calculateTopValue = (): string => {
  // Hauteur de la fenêtre (100vh)
  const maxScroll = window.innerHeight;

  // Scroll actuel
  const scrollY = window.scrollY;

  // Clamp le scroll entre 0 et maxScroll (entre 0vh et 100vh)
  const clampedScroll = Math.min(Math.max(scrollY, 0), maxScroll);

  const interpolatedTop =
    topStart - (topStart - topEnd) * (clampedScroll / maxScroll);

  // Retourne la valeur 'top' en vh
  return `${interpolatedTop}vh`;
};

const LogoAnimated: React.FC = () => {
  const [scrollY, setScrollY] = useState(0);
  const [topPosition, setTopPosition] = useState(`${topStart}vh`);

  useEffect(() => {
    const handleScroll = _.throttle(() => {
      const scrollY = window.scrollY;
      setScrollY(scrollY);
      setTopPosition(calculateTopValue());
    }, 5);

    window.addEventListener("scroll", handleScroll);

    return () => {
       window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const logoScale = 1 - Math.min(scrollY / 400, 0.5);
  return (
    <>
      <div className="underneathOverlay-logo">
        <div
          className={`container-logo`}
          style={{
            top: `${topPosition}`,
            transform: ` scale(${logoScale})`,
          }}
        >
          <img src={logo} alt="Logo Thermidor Agence Web Lille" />
          <div className="text-logo-container">
            <h1>THERMIDOR</h1>
            <h1>AGENCE WEB</h1>
          </div>
        </div>
      </div>
    </>
  );
};

export default LogoAnimated;
