import React, { useEffect, useState } from "react";
import "./WebAppComponent.css";
import LinksEnum from "../common/linksEnum";
import { Link } from "react-router-dom";
import Tile from "./Tile";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGlobe, faMobileAlt, faUser, faComputer } from "@fortawesome/free-solid-svg-icons";

const WebAppComponent: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Activation de l'animation après un léger délai
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="web-app-creation">
      <div className={`tiles-container ${isVisible ? "visible" : ""}`}>
        <Link to={LinksEnum.SiteSurMesure}>
          <Tile
            title="Site Web sur Mesure"
            description="Création de sites web personnalisés et performants."
            icon={<FontAwesomeIcon icon={faGlobe} />}
          />
        </Link>
        <Link to={LinksEnum.ApplicationsMobiles}>
          <Tile
            title="Appli Mobiles"
            description="Développement d'applications mobiles pour iOS et Android."
            icon={<FontAwesomeIcon icon={faMobileAlt} />}
          />
        </Link>
        <Link to={LinksEnum.ExperienceUtilisateur}>
          <Tile
            title="Expérience Utilisateur"
            description="Nous créons des interfaces intuitives et engageantes pour
              améliorer l’expérience utilisateur."
            icon={<FontAwesomeIcon icon={faUser} />}
          />
        </Link>
        <Link to={LinksEnum.ResponsiveDesign}>
          <Tile
            title="Responsive Design"
            description="Des solutions qui s’adaptent à tous les écrans, pour une
              expérience optimale sur mobile et desktop."
            icon={<FontAwesomeIcon icon={faComputer} />}
          />
        </Link>
      </div>
    </section>
  );
};

export default WebAppComponent;
